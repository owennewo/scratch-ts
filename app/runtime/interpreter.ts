import {SpecModel} from "../model/spec.model";
import {Primitives} from "./primitives/primitives";
import {StageModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {Scratch} from "./scratch";
import {ScratchTime} from "./scratch.time";
import {BlockArgModel} from "../model/blockarg.model";
import {SpriteModel} from "../model/sprite.model";
import {BlockModel} from "../model/block.model";
import {SpecOperation} from "../model/spec.model";

// Interpreter.as
// John Maloney, August 2009
// Revised, March 2010
//
// A simple yet efficient interpreter for BlockModels.
//
// Interpreters may seem mysterious, but this one is quite straightforward. Since every
// BlockModel knows which BlockModel (if any) follows it in a sequence of BlockModels, the interpreter
// simply executes the current BlockModel, then asks that BlockModel for the next BlockModel. The heart
// of the interpreter is the evalCmd() function, which looks up the opcode string in a
// dictionary (initialized by initPrims()) then calls the primitive function for that opcode.
// Control structures are handled by pushing the current state onto the active ScratchThread"s
// execution stack and continuing with the first BlockModel of the substack. When the end of a
// substack is reached, the previous execution state is popped. If the substack was a loop
// body, control yields to the next ScratchThread. Otherwise, execution continues with the next
// BlockModel. If there is no next BlockModel, and no state to pop, the ScratchThread terminates.
//
// The interpreter does as much as it can within workTime milliseconds, then returns
// control. It returns control earlier if either (a) there are are no more ScratchThreads to run
// or (b) some ScratchThread does a command that has a visible effect (e.g."move 10 steps").
//
// To add a command to the interpreter, just add a new case to initPrims(). Command BlockModels
// usually perform some operation and return null, while reporters must return a value.
// Control structures are a little tricky; look at some of the existing control structure
// commands to get a sense of what to do.
//
// Clocks and ScratchTime:
//
// The millisecond clock starts at zero when Flash is started and, since the clock is
// a 32-bit integer, it wraps after 24.86 days. Since it seems unlikely that one Scratch
// session would run that long, this code doesn"t deal with clock wrapping.
// Since Scratch only runs at discrete intervals, ScratchTimed commands may be resumed a few
// milliseconds late. These small errors accumulate, causing ScratchThreads to slip out of
// synchronization with each other, a problem especially noticeable in music projects.
// This problem is addressed by recording the amount of ScratchTime slippage and shortening
// subsequent ScratchTimed commands slightly to"catch up".
// Delay ScratchTimes are rounded to milliseconds, and the minimum delay is a millisecond.

import {ScratchVariable} from "./scratch.variable";
import {ScratchThread} from "./scratch.thread";


export class Interpreter {

    activeThread: ScratchThread;				// current ScratchThread
    currentMSecs: number = ScratchTime.getTimer();	// millisecond clock for the current step
    turboMode: boolean = false;

    stage: StageModel;

    private primTable;		// maps opcodes to functions
    private threads: any[] = [];			// all ScratchThreads
    private yield: boolean;				// set true to indicate that active ScratchThread should yield control
    private startTime: number;				// start ScratchTime for stepThreads()
    private doRedraw: boolean;
    private isWaiting: boolean;

    private warpMSecs: number = 500;		// max ScratchTime to run during warp
    private warpThread: ScratchThread;			// ScratchThread that is in warp mode
    private warpBlock: BlockModel;			// proc call BlockModel that entered warp mode

    private bubbleThread: ScratchThread;			// ScratchThread for reporter bubble
    public askThread: ScratchThread;				// ScratchThread that opened the ask prompt

    protected debugFunc: Function;

    private noThreadCount: number = 0; // tracking whether there are any active threads

    constructor(stage: StageModel) {
        this.stage = stage;
        this.initPrims();
        // checkPrims();
    }

    public targetObj(): ObjectModel { return this.stage.runtime.currentDoObject ? this.stage.runtime.currentDoObject : this.activeThread.target; }
    public targetSprite(): SpriteModel { return <SpriteModel>(this.stage.runtime.currentDoObject ? this.stage.runtime.currentDoObject : this.activeThread.target); }

    /* ScratchThreads */

    public doYield(): void { this.isWaiting = true; this.yield = true; }
    public redraw(): void { if (!this.turboMode) this.doRedraw = true; }

    public yieldOneCycle(): void {
        // Yield control but proceed to the next BlockModel. Do nothing in warp mode.
        // Used to ensure proper ordering of HTTP extension commands.
        if (this.activeThread === this.warpThread) return;
        if (this.activeThread.firstTime) {
            this.redraw();
            this.yield = true;
            this.activeThread.firstTime = false;
        }
    }

    public ScratchThreadCount(): number { return this.threads.length; }

    public toggleThread(b: BlockModel, targetObj: any, startupDelay: number = 0): void {
        let i: number, newThreads: any[] = [], wasRunning: boolean = false;
        for (i = 0; i < this.threads.length; i++) {
            if ((this.threads[i].topBlock === b) && (this.threads[i].target === targetObj)) {
                wasRunning = true;
            } else {
                newThreads.push(this.threads[i]);
            }
        }
        this.threads = newThreads;
        if (wasRunning) {
            if (this.stage.runtime.editMode) b.hideRunFeedback();
            this.clearWarpBlock();
        } else {
            let topBlock: BlockModel = b;
            if (b.isReporter) {
              console.log("todo: reporter");
                // click on reporter shows value in bubble
                // if (this.bubbleThread) {
                //     this.toggleThread(this.bubbleThread.topBlock, this.bubbleThread.target);
                // }
                // let reporter: BlockModel = b;
                // let interp: Interpreter = this;
                // b = new BlockModel("%s", "", -1);
                // b.opFunction = function(b: BlockModel): void {
                //     let p: Point = reporter.localToGlobal(new Point(0, 0));
                //     this.stage.showBubble(String(interp.arg(b, 0)), p.x, p.y, reporter.getRect(this.stage.stage).width);
                // };
                // b.args[0] = reporter;
            }
            if (this.stage.runtime.editMode) topBlock.showRunFeedback();
            let t: ScratchThread = new ScratchThread(b, targetObj, startupDelay);
            if (topBlock.isReporter) this.bubbleThread = t;
            t.topBlock = topBlock;
            this.threads.push(t);
            this.stage.runtime.threadStarted();
        }
    }

    public showAllRunFeedback(): void {
        for (let t of this.threads) {
            t.topBlock.showRunFeedback();
        }
    }

    public isRunning(b: BlockModel, targetObj: ObjectModel): boolean {
        for (let t of this.threads) {
            if ((t.topBlock === b) && (t.target === targetObj)) return true;
        }
        return false;
    }

    public startThreadForClone(b: BlockModel, clone: any): void {
        this.threads.push(new ScratchThread(b, clone));
    }

    public stopThreadsFor(target: any, skipActiveThread: boolean = false): void {
        for (let i: number = 0; i < this.threads.length; i++) {
            let t: ScratchThread = this.threads[i];
            if (skipActiveThread && (t === this.activeThread)) continue;
            if (t.target === target) {
                console.log("todo stop sound player");
                // if (t.tmpObj instanceof ScratchSoundPlayer) {
                //     (<ScratchSoundPlayer>t.tmpObj).stopPlaying();
                // }
                t.stop();
            }
        }
        if ((this.activeThread.target === target) && !skipActiveThread) this.yield = true;
    }

    public restartThread(b: BlockModel, targetObj: any): ScratchThread {
        // used by broadcast, click hats, and when key pressed hats
        // stop any ScratchThread running on b, then start a new ScratchThread on b
        let newThread: ScratchThread = new ScratchThread(b, targetObj);
        let wasRunning: boolean = false;
        for (let i: number = 0; i < this.threads.length; i++) {
            if ((this.threads[i].topBlock === b) && (this.threads[i].target === targetObj)) {
                if (this.askThread === this.threads[i]) this.stage.runtime.clearAskPrompts();
                this.threads[i] = newThread;
                wasRunning = true;
            }
        }
        if (!wasRunning) {
            this.threads.push(newThread);
            if (this.stage.runtime.editMode) b.showRunFeedback();
            this.stage.runtime.threadStarted();
        }
        return newThread;
    }

    public stopAllThreads(): void {
        this.threads = [];
        if (this.activeThread) this.activeThread.stop();
        this.clearWarpBlock();
        this.stage.runtime.clearRunFeedback();
        this.doRedraw = true;
    }

    public stepThreads(): void {
        this.startTime = ScratchTime.getTimer();
        let workTime: number = (0.75 * 1000) / this.stage.runtime.frameRate; // work for up to 75% of one frame ScratchTime
        this.doRedraw = false;
        this.currentMSecs = ScratchTime.getTimer();
        if (this.threads.length === 0) {
          this.noThreadCount++;
          if (this.noThreadCount > 1) {
              console.log("No threads, shutting down animation frame");
              ScratchTime.stopStepping();
          }
           return;
        } else {
            this.noThreadCount = 0;

        }
        while ((this.currentMSecs - this.startTime) < workTime) {
            if (this.warpThread && (!this.warpThread.block)) this.clearWarpBlock();
            let threadStopped: boolean = false;
            let runnableCount: number = 0;
            for (this.activeThread of this.threads) {
                this.isWaiting = false;
                this.stepActiveThread();
                if (!this.activeThread.block) threadStopped = true;
                if (!this.isWaiting) runnableCount++;
            }
            if (threadStopped) {
                let newThreads: any[] = [];
                for (let t of this.threads) {
                    if (t.block) newThreads.push(t);
                    else if (this.stage.runtime.editMode) {
                        if (t === this.bubbleThread) this.bubbleThread = null;
                        t.topBlock.hideRunFeedback();
                    }
                }
                this.threads = newThreads;
                if (this.threads.length === 0) return;
            }
            this.currentMSecs = ScratchTime.getTimer();
            if (this.doRedraw || (runnableCount === 0)) return;
        }
    }

    private stepActiveThread(): void {
        if (!this.activeThread.block) return;
        if (this.activeThread.startDelayCount > 0) { this.activeThread.startDelayCount--; this.doRedraw = true; return; }
        if (!(this.activeThread.target.isStage || (this.activeThread.target.parent instanceof StageModel))) {
            // sprite is being dragged
            if (this.stage.runtime.editMode) {
                // don"t run scripts of a sprite that is being dragged in edit mode, but do update the screen
                this.doRedraw = true;
                return;
            }
        }
        this.yield = false;
        while (true) {
            if (this.activeThread === this.warpThread) this.currentMSecs = ScratchTime.getTimer();
            this.evalCmd(this.activeThread.block);
            if (this.yield) {
                if (this.activeThread === this.warpThread) {
                    if ((this.currentMSecs - this.startTime) > this.warpMSecs) return;
                    this.yield = false;
                    continue;
                } else return;
            }

            if (this.activeThread.block)
                this.activeThread.block = this.activeThread.block.nextBlock;

            while (!this.activeThread.block) { // end of BlockModel sequence
                if (!this.activeThread.popState()) return; // end of script
                if ((this.activeThread.block === this.warpBlock) && this.activeThread.firstTime) { // end of outer warp BlockModel
                    this.clearWarpBlock();
                    this.activeThread.block = this.activeThread.block.nextBlock;
                    continue;
                }
                if (this.activeThread.isLoop) {
                    if (this.activeThread === this.warpThread) {
                        if ((this.currentMSecs - this.startTime) > this.warpMSecs) return;
                    } else return;
                } else {
                    if (this.activeThread.block.spec.code === SpecOperation.Call) this.activeThread.firstTime = true; // in case set false by call
                    this.activeThread.block = this.activeThread.block.nextBlock;
                }
            }
        }
    }

    private clearWarpBlock(): void {
        this.warpThread = null;
        this.warpBlock = null;
    }

    /* Evaluation */
    public evalCmd(b: BlockModel): any {
        if (!b) return 0; // arg() and friends can pass null if arg index is out of range
        let op: string = b.spec.code;
        if (!b.opFunction) {

            if (op.indexOf(".") > -1) {
              console.log("todo evalCmd for extensions");
                // b.opFunction = this.stage.runtime.extensionManager.primExtensionOp;
            } else {
              b.opFunction = this.primTable[op];
              if (!b.opFunction) b.opFunction = this.primTable["noop"];
            }

        }

        // TODO: Optimize this into a cached check if the args *could* BlockModel at all
        if (b.args.length && this.checkBlockingArgs(b)) {
            this.doYield();
            return null;
        }

        // Debug code
        if (this.debugFunc)
            this.debugFunc(b);

        return b.opFunction(b, this);
    }

    // Returns true if the ScratchThread needs to yield while data is requested
    public checkBlockingArgs(b: BlockModel): boolean {
        // Do any of the arguments request data?  If so, start any requests and yield.
        let shouldYield: boolean = false;
        let args: any[] = b.args;
        for (let i: number = 0; i < args.length; ++i) {
            let barg: BlockModel = <BlockModel>args[i];
            if (barg && barg instanceof BlockModel) {
                if (this.checkBlockingArgs(barg))
                    shouldYield = true;

                // Don"t start a request if the arguments for it are BlockModeling
                else if (barg.isRequester && barg.requestState < 2) {
                    if (barg.requestState === 0) this.evalCmd(barg);
                    shouldYield = true;
                }
            }
        }

        return shouldYield;
    }

    public arg(b: BlockModel, i: number): any {
        let args: any[] = b.args;
        if (b.rightToLeft) { i = args.length - i - 1; }
        return (b.args[i] instanceof BlockArgModel) ?
            args[i].argValue : this.evalCmd(args[i]);
    }

    public numarg(b: BlockModel, i: number): number {
        let args: any[] = b.args;
        if (b.rightToLeft) { i = args.length - i - 1; }
        let n: number = (args[i] instanceof BlockArgModel) ?
            Number(args[i].argValue) : Number(this.evalCmd(args[i]));

        if (n !== n) return 0; // return 0 if NaN (uses fast, inline test for NaN)
        return n;
    }

    public boolarg(b: BlockModel, i: number): boolean {
        if (b.rightToLeft) { i = b.args.length - i - 1; }
        let o: any = (b.args[i] instanceof BlockArgModel) ? b.args[i].argValue : this.evalCmd(b.args[i]);
        if (o instanceof Boolean) return o;
        if (o instanceof String) {
            let s: string = o;
            if ((s === "") || (s === "0") || (s.toLowerCase() === "false")) return false;
            return true; // treat all other strings as true
        }
        return Boolean(o); // coerce Number and anything else
    }

    public static asNumber(n: any): number {
        // Convert n to a number if possible. If n is a string, it must contain
        // at least one digit to be treated as a number (otherwise a string
        // containing only whitespace would be consider equal to zero.)
        if (typeof (n) === "string") {
            let s: string = n;
            let len: number = s.length;
            for (let i: number = 0; i < len; i++) {
                let code: number = s.charCodeAt(i);
                if (code >= 48 && code <= 57) return Number(s);
            }
            return NaN; // no digits found; string is not a number
        }
        return Number(n);
    }

    private startCmdList(b: BlockModel, isLoop: boolean = false, argList: any[] = null): void {
        if (!b) {
            if (isLoop) this.yield = true;
            return;
        }
        this.activeThread.isLoop = isLoop;
        this.activeThread.pushStateForBlock(b);
        if (argList) this.activeThread.args = argList;
        this.evalCmd(this.activeThread.block);
    }

    /* ScratchTimer */

    public startTimer(secs: number): void {
        let waitMSecs: number = 1000 * secs;
        if (waitMSecs < 0) waitMSecs = 0;
        this.activeThread.tmp = this.currentMSecs + waitMSecs; // end ScratchTime in milliseconds
        this.activeThread.firstTime = false;
        this.doYield();
    }

    public checkTimer(): boolean {
        // check for ScratchTimer expiration and clean up if expired. return true when expired
        if (this.currentMSecs >= this.activeThread.tmp) {
            // ScratchTime expired
            this.activeThread.tmp = 0;
            this.activeThread.tmpObj = null;
            this.activeThread.firstTime = true;
            return true;
        } else {
            // ScratchTime not yet expired
            this.doYield();
            return false;
        }
    }

    /* Primitives */

    public isImplemented(op: string): boolean {
        return this.primTable[op] !== undefined;
    }

    public getPrim(op: string): Function { return this.primTable[op]; }

    private initPrims(): void {
        this.primTable = {};
        // control
        this.primTable["whenGreenFlag"] = this.primTable["noop"];
        this.primTable["whenKeyPressed"] = this.primTable["noop"];
        this.primTable["whenClicked"] = this.primTable["noop"];
        this.primTable["whenSceneStarts"] = this.primTable["noop"];
        this.primTable["wait:elapsed:from:"] = this.primWait;
        this.primTable["doForever"] = function(b: BlockModel, interp: Interpreter): any { interp.startCmdList(b.stack1, true); };
        this.primTable["doRepeat"] = this.primRepeat;
        this.primTable["broadcast:"] = function(b: BlockModel, interp: Interpreter): any { interp.broadcast(this.arg(b, 0), false); };
        this.primTable["doBroadcastAndWait"] = function(b: BlockModel, interp: Interpreter): any { interp.broadcast(this.arg(b, 0), true); };
        this.primTable["whenIReceive"] = this.primTable["noop"];
        this.primTable["doForeverIf"] = function(b: BlockModel, interp: Interpreter): any { if (interp.arg(b, 0)) interp.startCmdList(b.stack1, true); else interp.yield = true; };
        this.primTable["doForLoop"] = this.primForLoop;
        this.primTable["doIf"] = function(b: BlockModel, interp: Interpreter): any { if (interp.arg(b, 0)) interp.startCmdList(b.stack1); };
        this.primTable["doIfElse"] = function(b: BlockModel, interp: Interpreter): any { if (interp.arg(b, 0)) interp.startCmdList(b.stack1); else interp.startCmdList(b.stack2); };
        this.primTable["doWaitUntil"] = function(b: BlockModel, interp: Interpreter): any { if (!interp.arg(b, 0)) this.yield = true; };
        this.primTable["doWhile"] = function(b: BlockModel, interp: Interpreter): any { if (interp.arg(b, 0)) interp.startCmdList(b.stack1, true); };
        this.primTable["doUntil"] = function(b: BlockModel, interp: Interpreter): any { if (!interp.arg(b, 0)) interp.startCmdList(b.stack1, true); };
        this.primTable["doReturn"] = this.primReturn;
        this.primTable["stopAll"] = function(b: BlockModel, interp: Interpreter): any { interp.stage.runtime.stopAll(); interp.yield = true; };
        this.primTable["stopScripts"] = this.primStop;
        this.primTable["warpSpeed"] = this.primOldWarpSpeed;

        // procedures
        this.primTable[SpecOperation.Call] = this.primCall;

        // variables
        this.primTable[SpecOperation.GetVar] = this.primVarGet;
        this.primTable[SpecOperation.SetVar] = this.primVarSet;
        this.primTable[SpecOperation.ChangeVar] = this.primVarChange;
        this.primTable[SpecOperation.GetParam] = this.primGetParam;

        // edge-trigger hat BlockModels
        this.primTable["whenDistanceLessThan"] = this.primTable["noop"];
        this.primTable["whenSensorConnected"] = this.primTable["noop"];
        this.primTable["whenSensorGreaterThan"] = this.primTable["noop"];
        this.primTable["whenTiltIs"] = this.primTable["noop"];

        this.addOtherPrims(this.primTable);
    }

    protected addOtherPrims(primTable: any): void {
        // other primitives
        new Primitives().addPrimsTo(primTable);
    }

    private checkPrims(): void {
        let op: string;
        let allOps: any[] = ["CALL", "GET_VAR", "NOOP"];
        for (let key in SpecModel.SPECS) {
          let spec = SpecModel.SPECS.get(key);
            if (spec.code.length > 3) {
                // op = spec[3];
                allOps.push(spec.code);
                if (this.primTable[op] === undefined) console.log("Unimplemented:" + op);
            }
        }
        for (op in this.primTable) {
            if (allOps.indexOf(op) < 0) console.log("Not in SpecOperation:" + op);
        }
    }

    private primForLoop(b: BlockModel, interp: Interpreter): void {
        let list: any[] = [];
        let loopVar: ScratchVariable;

        if (interp.activeThread.firstTime) {
            if (!(interp.arg(b, 0) instanceof String)) return;
            let listArg: any = interp.arg(b, 1);
            if (listArg instanceof Array) {
                list = listArg;
            }
            if (listArg instanceof String) {
                let n: number = Number(listArg);
                if (!isNaN(n)) listArg = n;
            }
            if ((listArg instanceof Number) && !isNaN(listArg)) {
                let last: number = listArg;
                if (last >= 1) {
                    list = new Array(last - 1);
                    for (let i: number = 0; i < last; i++) list[i] = i + 1;
                }
            }
            let looplet = interp.activeThread.target.lookupOrCreateVar(interp.arg(b, 0));
            interp.activeThread.args = [list, loopVar];
            interp.activeThread.tmp = 0;
            interp.activeThread.firstTime = false;
        }

        list = interp.activeThread.args[0];
        let looplet = interp.activeThread.args[1];
        if (interp.activeThread.tmp < list.length) {
            loopVar.value = list[interp.activeThread.tmp++];
            interp.startCmdList(b.stack1, true);
        } else {
            interp.activeThread.args = null;
            interp.activeThread.tmp = 0;
            interp.activeThread.firstTime = true;
        }
    }

    private primOldWarpSpeed(b: BlockModel, interp: Interpreter): void {
        // Semi-support for old warp BlockModel: run substack at normal speed.
        if (!b.stack1) return;
        interp.startCmdList(b.stack1);
    }

    private primRepeat(b: BlockModel, interp: Interpreter): void {
        if (interp.activeThread.firstTime) {
            let repeatCount: number = Math.max(0, Math.min(Math.round(interp.numarg(b, 0)), 2147483647)); // clip to range: 0 to 2^31-1
            interp.activeThread.tmp = repeatCount;
            interp.activeThread.firstTime = false;
        }
        if (interp.activeThread.tmp > 0) {
            interp.activeThread.tmp--; // decrement count
            interp.startCmdList(b.stack1, true);
        } else {
            interp.activeThread.firstTime = true;
        }
    }

    private primStop(b: BlockModel, interp: Interpreter): void {
        let type: string = interp.arg(b, 0);
        if (type === "all") { interp.stage.runtime.stopAll(); interp.yield = true; }
        if (type === "this script") interp.primReturn(b, interp);
        if (type === "other scripts in sprite") interp.stopThreadsFor(interp.activeThread.target, true);
        if (type === "other scripts in stage") interp.stopThreadsFor(interp.activeThread.target, true);
    }

    private primWait(b: BlockModel, interp: Interpreter): void {
        if (interp.activeThread.firstTime) {
            interp.startTimer(interp.numarg(b, 0));
            interp.redraw();
        } else interp.checkTimer();
    }

    // Broadcast and scene starting

    public broadcast(msg: string, waitFlag: boolean): void {
        let pair: any[];
        if (this.activeThread.firstTime) {
            let receivers: any[] = [];
            let newThreads: any[] = [];
            msg = msg.toLowerCase();
            let findReceivers: Function = function(stack: BlockModel, target: ObjectModel): void {
                if ((stack.spec.code === "whenIReceive") && (this.stack.args[0].argValue.toLowerCase() === msg)) {
                    receivers.push([this.stack, this.target]);
                }
            };
            this.stage.runtime.allStacksAndOwnersDo(findReceivers);
            // (re)start all receivers
            for (pair of receivers) newThreads.push(this.restartThread(pair[0], pair[1]));
            if (!waitFlag) return;
            this.activeThread.tmpObj = newThreads;
            this.activeThread.firstTime = false;
        }
        let done: boolean = true;
        for (let t of this.activeThread.tmpObj) { if (this.threads.indexOf(t) >= 0) done = false; }
        if (done) {
            this.activeThread.tmpObj = null;
            this.activeThread.firstTime = true;
        } else {
            this.yield = true;
        }
    }

    public startScene(sceneName: string, waitFlag: boolean): void {
        let pair: any[];
        if (this.activeThread.firstTime) {
            function findSceneHats(stack: BlockModel, target: ObjectModel): void {
                if ((stack.spec.code === "whenSceneStarts") && (this.stack.args[0].argValue === sceneName)) {
                    receivers.push([this.stack, this.target]);
                }
            }
            let receivers: any[] = [];
            this.stage.runtime.showCostumeNamed(sceneName);
            this.redraw();
            this.stage.runtime.allStacksAndOwnersDo(findSceneHats);
            // (re)start all receivers
            let newThreads: any[] = [];
            for (pair of receivers) newThreads.push(this.restartThread(pair[0], pair[1]));
            if (!waitFlag) return;
            this.activeThread.tmpObj = newThreads;
            this.activeThread.firstTime = false;
        }
        let done: boolean = true;
        for (let t of this.activeThread.tmpObj) { if (this.threads.indexOf(t) >= 0) done = false; }
        if (done) {
            this.activeThread.tmpObj = null;
            this.activeThread.firstTime = true;
        } else {
            this.yield = true;
        }
    }

    // Procedure call/return

    private primCall(b: BlockModel, interp: Interpreter): void {
        // Call a procedure. Handle recursive calls and"warp" procedures.
        // The activeThread.firstTime flag is used to mark the first call
        // to a procedure running in warp mode. activeThread.firstTime is
        // false for subsequent calls to warp mode procedures.

        // Lookup the procedure and cache for future use
        let obj: ObjectModel = interp.activeThread.target;
        // let code: string = b.spec.code;
        // let proc: BlockModel = obj.procCache[code];
        // if (!proc) {
        //     proc = obj.lookupProcedure(code);
        //     obj.procCache[code] = proc;
        // }
        if (!b.proc) {
          b.proc = interp.primTable[b.spec.code];
        }

        if (!b.proc) {
          console.log("can't find proc for" + b.spec.code);
          return;
        }

        if (interp.warpThread) {
            interp.activeThread.firstTime = false;
            if ((interp.currentMSecs - interp.startTime) > interp.warpMSecs) interp.yield = true;
        } else {
          console.log("todo support warp and yield");
            // if (proc.warpProcFlag) {
            //     // Start running in warp mode.
            //     interp.warpBlock = b;
            //     interp.warpThread = interp.activeThread;
            //     interp.activeThread.firstTime = true;
            // }
            // else
            // if (interp.activeThread.isRecursiveCall(b, b.proc)) {
            //     interp.yield = true;
            // }
        }
        let argCount: number = b.parameterNames.length;
        let argList: any[] = [];
        for (let i: number = 0; i < argCount; ++i) argList.push(interp.arg(b, i));
        interp.startCmdList(b, false, argList);
    }

    private primReturn(b: BlockModel, interp: Interpreter): void {
        // Return from the innermost procedure. If not in a procedure, stop the ScratchThread.
        if (!interp.activeThread.returnFromProcedure()) {
            interp.activeThread.stop();
            interp.yield = true;
        }
    }

    // ScratchVariable Primitives
    // Optimization: to avoid the cost of looking up the ScratchVariable every ScratchTime,
    // a reference to the ScratchVariable object is cached in the target object.

    private primVarGet(b: BlockModel, interp: Interpreter): any {
      console.log("todo primVarGet");
        // let target: ObjectModel = interp.stage.runtime.currentDoObject ? interp.stage.runtime.currentDoObject : interp.activeThread.target;
        //
        // let v: ScratchVariable = target.varCache[b.spec];
        // if (v === null) {
        //     v = target.varCache[b.spec] = target.lookupOrCreateVar(b.spec);
        //     if (v === null) return 0;
        // }
        // // XXX: Do we need a get() for persistent ScratchVariables here ?
        // return v.value;
    }

    protected primVarSet(b: BlockModel, interp: Interpreter): ScratchVariable {
        let name: string = interp.arg(b, 0);
        let v: ScratchVariable = interp.activeThread.target.varCache[name];
        if (!v) {
            v = interp.activeThread.target.varCache[name] = interp.activeThread.target.lookupOrCreateVar(name);
            if (!v) return null;
        }
        let oldvalue: any = v.value;
        v.value = interp.arg(b, 1);
        return v;
    }

    protected primVarChange(b: BlockModel, interp: Interpreter): ScratchVariable {
        let name: string = interp.arg(b, 0);
        let v: ScratchVariable = interp.activeThread.target.varCache[name];
        if (!v) {
            v = interp.activeThread.target.varCache[name] = interp.activeThread.target.lookupOrCreateVar(name);
            if (!v) return null;
        }
        v.value = Number(v.value) + interp.numarg(b, 1);
        return v;
    }

    private primGetParam(b: BlockModel, interp: Interpreter): any {
        if (b.parameterIndex < 0) {
            let proc: BlockModel = b.topBlock();
            if (proc.parameterNames) b.parameterIndex = proc.parameterNames.indexOf(b.spec);
            if (b.parameterIndex < 0) return 0;
        }
        if ((!interp.activeThread.args) || (b.parameterIndex >= interp.activeThread.args.length)) return 0;
        return interp.activeThread.args[b.parameterIndex];
    }

}
