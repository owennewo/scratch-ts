System.register(["./Time", "../model/blockarg.model", "../model/block.model", "../model/spec.model", "./Thread"], function(exports_1) {
    "use strict";
    var Time_1, blockarg_model_1, block_model_1, spec_model_1, Thread_1;
    var Interpreter;
    return {
        setters:[
            function (Time_1_1) {
                Time_1 = Time_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (block_model_1_1) {
                block_model_1 = block_model_1_1;
            },
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
            },
            function (Thread_1_1) {
                Thread_1 = Thread_1_1;
            }],
        execute: function() {
            Interpreter = (function () {
                function Interpreter(app) {
                    this.currentMSecs = Time_1.Time.getTimer(); // millisecond clock for the current step
                    this.turboMode = false;
                    this.threads = []; // all threads
                    this.warpMSecs = 500; // max time to run during warp
                    this.app = app;
                    this.initPrims();
                    // checkPrims();
                }
                Interpreter.prototype.targetObj = function () { return this.app.runtime.currentDoObj ? this.app.runtime.currentDoObj : this.activeThread.target; };
                Interpreter.prototype.targetSprite = function () { return (this.app.runtime.currentDoObj ? this.app.runtime.currentDoObj : this.activeThread.target); };
                /* Threads */
                Interpreter.prototype.doYield = function () { this.isWaiting = true; this.yield = true; };
                Interpreter.prototype.redraw = function () { if (!this.turboMode)
                    this.doRedraw = true; };
                Interpreter.prototype.yieldOneCycle = function () {
                    // Yield control but proceed to the next BlockModel. Do nothing in warp mode.
                    // Used to ensure proper ordering of HTTP extension commands.
                    if (this.activeThread === this.warpThread)
                        return;
                    if (this.activeThread.firstTime) {
                        this.redraw();
                        this.yield = true;
                        this.activeThread.firstTime = false;
                    }
                };
                Interpreter.prototype.threadCount = function () { return this.threads.length; };
                Interpreter.prototype.toggleThread = function (b, targetObj, startupDelay) {
                    if (startupDelay === void 0) { startupDelay = 0; }
                    var i, newThreads = [], wasRunning = false;
                    for (i = 0; i < this.threads.length; i++) {
                        if ((this.threads[i].topBlock === b) && (this.threads[i].target === targetObj)) {
                            wasRunning = true;
                        }
                        else {
                            newThreads.push(this.threads[i]);
                        }
                    }
                    this.threads = newThreads;
                    if (wasRunning) {
                        if (this.app.editMode)
                            b.hideRunFeedback();
                        this.clearWarpBlock();
                    }
                    else {
                        var topBlock = b;
                        if (b.isReporter) {
                            // click on reporter shows value in bubble
                            if (this.bubbleThread) {
                                this.toggleThread(this.bubbleThread.topBlock, this.bubbleThread.target);
                            }
                            var reporter_1 = b;
                            var interp_1 = this;
                            b = new block_model_1.BlockModel("%s", "", -1);
                            b.opFunction = function (b) {
                                var p = reporter_1.localToGlobal(new Point(0, 0));
                                this.app.showBubble(String(interp_1.arg(b, 0)), p.x, p.y, reporter_1.getRect(this.app.stage).width);
                            };
                            b.args[0] = reporter_1;
                        }
                        if (this.app.editMode)
                            topBlock.showRunFeedback();
                        var t = new Thread_1.Thread(b, targetObj, startupDelay);
                        if (topBlock.isReporter)
                            this.bubbleThread = t;
                        t.topBlock = topBlock;
                        this.threads.push(t);
                        this.app.threadStarted();
                    }
                };
                Interpreter.prototype.showAllRunFeedback = function () {
                    for (var _i = 0, _a = this.threads; _i < _a.length; _i++) {
                        var t = _a[_i];
                        t.topBlock.showRunFeedback();
                    }
                };
                Interpreter.prototype.isRunning = function (b, targetObj) {
                    for (var _i = 0, _a = this.threads; _i < _a.length; _i++) {
                        var t = _a[_i];
                        if ((t.topBlock === b) && (t.target === targetObj))
                            return true;
                    }
                    return false;
                };
                Interpreter.prototype.startThreadForClone = function (b, clone) {
                    this.threads.push(new Thread_1.Thread(b, clone));
                };
                Interpreter.prototype.stopThreadsFor = function (target, skipActiveThread) {
                    if (skipActiveThread === void 0) { skipActiveThread = false; }
                    for (var i = 0; i < this.threads.length; i++) {
                        var t = this.threads[i];
                        if (skipActiveThread && (t === this.activeThread))
                            continue;
                        if (t.target === target) {
                            if (t.tmpObj instanceof ScratchSoundPlayer) {
                                t.tmpObj.stopPlaying();
                            }
                            t.stop();
                        }
                    }
                    if ((this.activeThread.target === target) && !skipActiveThread)
                        this.yield = true;
                };
                Interpreter.prototype.restartThread = function (b, targetObj) {
                    // used by broadcast, click hats, and when key pressed hats
                    // stop any thread running on b, then start a new thread on b
                    var newThread = new Thread_1.Thread(b, targetObj);
                    var wasRunning = false;
                    for (var i = 0; i < this.threads.length; i++) {
                        if ((this.threads[i].topBlock === b) && (this.threads[i].target === targetObj)) {
                            if (this.askThread === this.threads[i])
                                this.app.runtime.clearAskPrompts();
                            this.threads[i] = newThread;
                            wasRunning = true;
                        }
                    }
                    if (!wasRunning) {
                        this.threads.push(newThread);
                        if (this.app.editMode)
                            b.showRunFeedback();
                        this.app.threadStarted();
                    }
                    return newThread;
                };
                Interpreter.prototype.stopAllThreads = function () {
                    this.threads = [];
                    if (this.activeThread !== null)
                        this.activeThread.stop();
                    this.clearWarpBlock();
                    this.app.runtime.clearRunFeedback();
                    this.doRedraw = true;
                };
                Interpreter.prototype.stepThreads = function () {
                    this.startTime = Time_1.Time.getTimer();
                    var workTime = (0.75 * 1000) / this.app.stage.frameRate; // work for up to 75% of one frame time
                    this.doRedraw = false;
                    this.currentMSecs = Time_1.Time.getTimer();
                    if (this.threads.length === 0)
                        return;
                    while ((this.currentMSecs - this.startTime) < workTime) {
                        if (this.warpThread && (this.warpThread.block === null))
                            this.clearWarpBlock();
                        var threadStopped = false;
                        var runnableCount = 0;
                        for (var _i = 0, _a = this.threads; _i < _a.length; _i++) {
                            this.activeThread = _a[_i];
                            this.isWaiting = false;
                            this.stepActiveThread();
                            if (this.activeThread.block === null)
                                threadStopped = true;
                            if (!this.isWaiting)
                                runnableCount++;
                        }
                        if (threadStopped) {
                            var newThreads = [];
                            for (var _b = 0, _c = this.threads; _b < _c.length; _b++) {
                                var t = _c[_b];
                                if (t.block !== null)
                                    newThreads.push(t);
                                else if (this.app.editMode) {
                                    if (t === this.bubbleThread)
                                        this.bubbleThread = null;
                                    t.topBlock.hideRunFeedback();
                                }
                            }
                            this.threads = newThreads;
                            if (this.threads.length === 0)
                                return;
                        }
                        this.currentMSecs = Time_1.Time.getTimer();
                        if (this.doRedraw || (runnableCount === 0))
                            return;
                    }
                };
                Interpreter.prototype.stepActiveThread = function () {
                    if (this.activeThread.block === null)
                        return;
                    if (this.activeThread.startDelayCount > 0) {
                        this.activeThread.startDelayCount--;
                        this.doRedraw = true;
                        return;
                    }
                    if (!(this.activeThread.target.isStage || (this.activeThread.target.parent instanceof ScratchStage))) {
                        // sprite is being dragged
                        if (this.app.editMode) {
                            // don"t run scripts of a sprite that is being dragged in edit mode, but do update the screen
                            this.doRedraw = true;
                            return;
                        }
                    }
                    this.yield = false;
                    while (true) {
                        if (this.activeThread === this.warpThread)
                            this.currentMSecs = Time_1.Time.getTimer();
                        this.evalCmd(this.activeThread.block);
                        if (this.yield) {
                            if (this.activeThread === this.warpThread) {
                                if ((this.currentMSecs - this.startTime) > this.warpMSecs)
                                    return;
                                this.yield = false;
                                continue;
                            }
                            else
                                return;
                        }
                        if (this.activeThread.block !== null)
                            this.activeThread.block = this.activeThread.block.nextBlock;
                        while (this.activeThread.block === null) {
                            if (!this.activeThread.popState())
                                return; // end of script
                            if ((this.activeThread.block === this.warpBlock) && this.activeThread.firstTime) {
                                this.clearWarpBlock();
                                this.activeThread.block = this.activeThread.block.nextBlock;
                                continue;
                            }
                            if (this.activeThread.isLoop) {
                                if (this.activeThread === this.warpThread) {
                                    if ((this.currentMSecs - this.startTime) > this.warpMSecs)
                                        return;
                                }
                                else
                                    return;
                            }
                            else {
                                if (this.activeThread.block.spec.code === spec_model_1.SpecOperation.Call)
                                    this.activeThread.firstTime = true; // in case set false by call
                                this.activeThread.block = this.activeThread.block.nextBlock;
                            }
                        }
                    }
                };
                Interpreter.prototype.clearWarpBlock = function () {
                    this.warpThread = null;
                    this.warpBlock = null;
                };
                /* Evaluation */
                Interpreter.prototype.evalCmd = function (b) {
                    if (!b)
                        return 0; // arg() and friends can pass null if arg index is out of range
                    var op = b.spec.code;
                    if (b.opFunction === null) {
                        if (op.indexOf(".") > -1)
                            b.opFunction = this.app.extensionManager.primExtensionOp;
                        else
                            b.opFunction = (this.primTable[op] === undefined) ? this.primNoop : this.primTable[op];
                    }
                    // TODO: Optimize this into a cached check if the args *could* BlockModel at all
                    if (b.args.length && this.checkBlockingArgs(b)) {
                        this.doYield();
                        return null;
                    }
                    // Debug code
                    if (this.debugFunc !== null)
                        this.debugFunc(b);
                    return b.opFunction(b);
                };
                // Returns true if the thread needs to yield while data is requested
                Interpreter.prototype.checkBlockingArgs = function (b) {
                    // Do any of the arguments request data?  If so, start any requests and yield.
                    var shouldYield = false;
                    var args = b.args;
                    for (var i = 0; i < args.length; ++i) {
                        var barg = args[i];
                        if (barg) {
                            if (this.checkBlockingArgs(barg))
                                shouldYield = true;
                            else if (barg.isRequester && barg.requestState < 2) {
                                if (barg.requestState === 0)
                                    this.evalCmd(barg);
                                shouldYield = true;
                            }
                        }
                    }
                    return shouldYield;
                };
                Interpreter.prototype.arg = function (b, i) {
                    var args = b.args;
                    if (b.rightToLeft) {
                        i = args.length - i - 1;
                    }
                    return (b.args[i] instanceof blockarg_model_1.BlockArgModel) ?
                        args[i].argValue : this.evalCmd(args[i]);
                };
                Interpreter.prototype.numarg = function (b, i) {
                    var args = b.args;
                    if (b.rightToLeft) {
                        i = args.length - i - 1;
                    }
                    var n = (args[i] instanceof blockarg_model_1.BlockArgModel) ?
                        Number(args[i].argValue) : Number(this.evalCmd(args[i]));
                    if (n !== n)
                        return 0; // return 0 if NaN (uses fast, inline test for NaN)
                    return n;
                };
                Interpreter.prototype.boolarg = function (b, i) {
                    if (b.rightToLeft) {
                        i = b.args.length - i - 1;
                    }
                    var o = (b.args[i] instanceof blockarg_model_1.BlockArgModel) ? b.args[i].argValue : this.evalCmd(b.args[i]);
                    if (o instanceof Boolean)
                        return o;
                    if (o instanceof String) {
                        var s = o;
                        if ((s === "") || (s === "0") || (s.toLowerCase() === "false"))
                            return false;
                        return true; // treat all other strings as true
                    }
                    return Boolean(o); // coerce Number and anything else
                };
                Interpreter.asNumber = function (n) {
                    // Convert n to a number if possible. If n is a string, it must contain
                    // at least one digit to be treated as a number (otherwise a string
                    // containing only whitespace would be consider equal to zero.)
                    if (typeof (n) === "string") {
                        var s = n;
                        var len = s.length;
                        for (var i = 0; i < len; i++) {
                            var code = s.charCodeAt(i);
                            if (code >= 48 && code <= 57)
                                return Number(s);
                        }
                        return NaN; // no digits found; string is not a number
                    }
                    return Number(n);
                };
                Interpreter.prototype.startCmdList = function (b, isLoop, argList) {
                    if (isLoop === void 0) { isLoop = false; }
                    if (argList === void 0) { argList = null; }
                    if (b === null) {
                        if (isLoop)
                            this.yield = true;
                        return;
                    }
                    this.activeThread.isLoop = isLoop;
                    this.activeThread.pushStateForBlock(b);
                    if (argList)
                        this.activeThread.args = argList;
                    this.evalCmd(this.activeThread.block);
                };
                /* Timer */
                Interpreter.prototype.startTimer = function (secs) {
                    var waitMSecs = 1000 * secs;
                    if (waitMSecs < 0)
                        waitMSecs = 0;
                    this.activeThread.tmp = this.currentMSecs + waitMSecs; // end time in milliseconds
                    this.activeThread.firstTime = false;
                    this.doYield();
                };
                Interpreter.prototype.checkTimer = function () {
                    // check for timer expiration and clean up if expired. return true when expired
                    if (this.currentMSecs >= this.activeThread.tmp) {
                        // time expired
                        this.activeThread.tmp = 0;
                        this.activeThread.tmpObj = null;
                        this.activeThread.firstTime = true;
                        return true;
                    }
                    else {
                        // time not yet expired
                        this.doYield();
                        return false;
                    }
                };
                /* Primitives */
                Interpreter.prototype.isImplemented = function (op) {
                    return this.primTable[op] !== undefined;
                };
                Interpreter.prototype.getPrim = function (op) { return this.primTable[op]; };
                Interpreter.prototype.initPrims = function () {
                    this.primTable = {};
                    // control
                    this.primTable["whenGreenFlag"] = this.primNoop;
                    this.primTable["whenKeyPressed"] = this.primNoop;
                    this.primTable["whenClicked"] = this.primNoop;
                    this.primTable["whenSceneStarts"] = this.primNoop;
                    this.primTable["wait:elapsed:from:"] = this.primWait;
                    this.primTable["doForever"] = function (b) { this.startCmdList(this.b.subStack1, true); };
                    this.primTable["doRepeat"] = this.primRepeat;
                    this.primTable["broadcast:"] = function (b) { this.broadcast(this.arg(this.b, 0), false); };
                    this.primTable["doBroadcastAndWait"] = function (b) { this.broadcast(this.arg(this.b, 0), true); };
                    this.primTable["whenIReceive"] = this.primNoop;
                    this.primTable["doForeverIf"] = function (b) { if (this.arg(this.b, 0))
                        this.startCmdList(this.b.subStack1, true);
                    else
                        this.yield = true; };
                    this.primTable["doForLoop"] = this.primForLoop;
                    this.primTable["doIf"] = function (b) { if (this.arg(this.b, 0))
                        this.startCmdList(this.b.subStack1); };
                    this.primTable["doIfElse"] = function (b) { if (this.arg(this.b, 0))
                        this.startCmdList(this.b.subStack1);
                    else
                        this.startCmdList(this.b.subStack2); };
                    this.primTable["doWaitUntil"] = function (b) { if (!this.arg(this.b, 0))
                        this.yield = true; };
                    this.primTable["doWhile"] = function (b) { if (this.arg(this.b, 0))
                        this.startCmdList(this.b.subStack1, true); };
                    this.primTable["doUntil"] = function (b) { if (!this.arg(this.b, 0))
                        this.startCmdList(this.b.subStack1, true); };
                    this.primTable["doReturn"] = this.primReturn;
                    this.primTable["stopAll"] = function (b) { this.app.runtime.stopAll(); this.yield = true; };
                    this.primTable["stopScripts"] = this.primStop;
                    this.primTable["warpSpeed"] = this.primOldWarpSpeed;
                    // procedures
                    this.primTable[spec_model_1.SpecOperation.CALL] = this.primCall;
                    // variables
                    this.primTable[spec_model_1.SpecOperation.GET_VAR] = this.primVarGet;
                    this.primTable[spec_model_1.SpecOperation.SET_VAR] = this.primVarSet;
                    this.primTable[spec_model_1.SpecOperation.CHANGE_VAR] = this.primVarChange;
                    this.primTable[spec_model_1.SpecOperation.GET_PARAM] = this.primGetParam;
                    // edge-trigger hat BlockModels
                    this.primTable["whenDistanceLessThan"] = this.primNoop;
                    this.primTable["whenSensorConnected"] = this.primNoop;
                    this.primTable["whenSensorGreaterThan"] = this.primNoop;
                    this.primTable["whenTiltIs"] = this.primNoop;
                    this.addOtherPrims(this.primTable);
                };
                Interpreter.prototype.addOtherPrims = function (primTable) {
                    // other primitives
                    new Primitives(this.app, this).addPrimsTo(primTable);
                };
                Interpreter.prototype.checkPrims = function () {
                    var op;
                    var allOps = ["CALL", "GET_VAR", "NOOP"];
                    for (var _i = 0, _a = spec_model_1.SpecOperation.commands; _i < _a.length; _i++) {
                        var spec = _a[_i];
                        if (spec.length > 3) {
                            op = spec[3];
                            allOps.push(op);
                            if (this.primTable[op] === undefined)
                                console.log("Unimplemented:" + op);
                        }
                    }
                    for (op in this.primTable) {
                        if (allOps.indexOf(op) < 0)
                            console.log("Not in SpecOperation:" + op);
                    }
                };
                Interpreter.prototype.primNoop = function (b) { };
                Interpreter.prototype.primForLoop = function (b) {
                    var list = [];
                    var loopVar;
                    if (this.activeThread.firstTime) {
                        if (!(this.arg(b, 0) instanceof String))
                            return;
                        var listArg = this.arg(b, 1);
                        if (listArg instanceof Array) {
                            list = listArg;
                        }
                        if (listArg instanceof String) {
                            var n = Number(listArg);
                            if (!isNaN(n))
                                listArg = n;
                        }
                        if ((listArg instanceof Number) && !isNaN(listArg)) {
                            var last = listArg;
                            if (last >= 1) {
                                list = new Array(last - 1);
                                for (var i = 0; i < last; i++)
                                    list[i] = i + 1;
                            }
                        }
                        var looplet_1 = this.activeThread.target.lookupOrCreateVar(this.arg(b, 0));
                        this.activeThread.args = [list, loopVar];
                        this.activeThread.tmp = 0;
                        this.activeThread.firstTime = false;
                    }
                    list = this.activeThread.args[0];
                    var looplet = this.activeThread.args[1];
                    if (this.activeThread.tmp < list.length) {
                        loopVar.value = list[this.activeThread.tmp++];
                        this.startCmdList(b.subStack1, true);
                    }
                    else {
                        this.activeThread.args = null;
                        this.activeThread.tmp = 0;
                        this.activeThread.firstTime = true;
                    }
                };
                Interpreter.prototype.primOldWarpSpeed = function (b) {
                    // Semi-support for old warp BlockModel: run substack at normal speed.
                    if (b.subStack1 === null)
                        return;
                    this.startCmdList(b.subStack1);
                };
                Interpreter.prototype.primRepeat = function (b) {
                    if (this.activeThread.firstTime) {
                        var repeatCount = Math.max(0, Math.min(Math.round(this.numarg(b, 0)), 2147483647)); // clip to range: 0 to 2^31-1
                        this.activeThread.tmp = repeatCount;
                        this.activeThread.firstTime = false;
                    }
                    if (this.activeThread.tmp > 0) {
                        this.activeThread.tmp--; // decrement count
                        this.startCmdList(b.subStack1, true);
                    }
                    else {
                        this.activeThread.firstTime = true;
                    }
                };
                Interpreter.prototype.primStop = function (b) {
                    var type = this.arg(b, 0);
                    if (type === "all") {
                        this.app.runtime.stopAll();
                        this.yield = true;
                    }
                    if (type === "this script")
                        this.primReturn(b);
                    if (type === "other scripts in sprite")
                        this.stopThreadsFor(this.activeThread.target, true);
                    if (type === "other scripts in stage")
                        this.stopThreadsFor(this.activeThread.target, true);
                };
                Interpreter.prototype.primWait = function (b) {
                    if (this.activeThread.firstTime) {
                        this.startTimer(this.numarg(b, 0));
                        this.redraw();
                    }
                    else
                        this.checkTimer();
                };
                // Broadcast and scene starting
                Interpreter.prototype.broadcast = function (msg, waitFlag) {
                    var pair;
                    if (this.activeThread.firstTime) {
                        var receivers_1 = [];
                        var newThreads = [];
                        msg = msg.toLowerCase();
                        var findReceivers = function (stack, target) {
                            if ((this.stack.op === "whenIReceive") && (this.stack.args[0].argValue.toLowerCase() === msg)) {
                                receivers_1.push([this.stack, this.target]);
                            }
                        };
                        this.app.runtime.allStacksAndOwnersDo(findReceivers);
                        // (re)start all receivers
                        for (var _i = 0, receivers_2 = receivers_1; _i < receivers_2.length; _i++) {
                            pair = receivers_2[_i];
                            newThreads.push(this.restartThread(pair[0], pair[1]));
                        }
                        if (!waitFlag)
                            return;
                        this.activeThread.tmpObj = newThreads;
                        this.activeThread.firstTime = false;
                    }
                    var done = true;
                    for (var _a = 0, _b = this.activeThread.tmpObj; _a < _b.length; _a++) {
                        var t = _b[_a];
                        if (this.threads.indexOf(t) >= 0)
                            done = false;
                    }
                    if (done) {
                        this.activeThread.tmpObj = null;
                        this.activeThread.firstTime = true;
                    }
                    else {
                        this.yield = true;
                    }
                };
                Interpreter.prototype.startScene = function (sceneName, waitFlag) {
                    var pair;
                    if (this.activeThread.firstTime) {
                        function findSceneHats(stack, target) {
                            if ((this.stack.op === "whenSceneStarts") && (this.stack.args[0].argValue === sceneName)) {
                                receivers_3.push([this.stack, this.target]);
                            }
                        }
                        var receivers_3 = [];
                        this.app.stagePane.showCostumeNamed(sceneName);
                        this.redraw();
                        this.app.runtime.allStacksAndOwnersDo(findSceneHats);
                        // (re)start all receivers
                        var newThreads = [];
                        for (var _i = 0, receivers_4 = receivers_3; _i < receivers_4.length; _i++) {
                            pair = receivers_4[_i];
                            newThreads.push(this.restartThread(pair[0], pair[1]));
                        }
                        if (!waitFlag)
                            return;
                        this.activeThread.tmpObj = newThreads;
                        this.activeThread.firstTime = false;
                    }
                    var done = true;
                    for (var _a = 0, _b = this.activeThread.tmpObj; _a < _b.length; _a++) {
                        var t = _b[_a];
                        if (this.threads.indexOf(t) >= 0)
                            done = false;
                    }
                    if (done) {
                        this.activeThread.tmpObj = null;
                        this.activeThread.firstTime = true;
                    }
                    else {
                        this.yield = true;
                    }
                };
                // Procedure call/return
                Interpreter.prototype.primCall = function (b) {
                    // Call a procedure. Handle recursive calls and"warp" procedures.
                    // The activeThread.firstTime flag is used to mark the first call
                    // to a procedure running in warp mode. activeThread.firstTime is
                    // false for subsequent calls to warp mode procedures.
                    // Lookup the procedure and cache for future use
                    var obj = this.activeThread.target;
                    var spec = b.spec;
                    var proc = obj.procCache[spec];
                    if (!proc) {
                        proc = obj.lookupProcedure(spec);
                        obj.procCache[spec] = proc;
                    }
                    if (!proc)
                        return;
                    if (this.warpThread) {
                        this.activeThread.firstTime = false;
                        if ((this.currentMSecs - this.startTime) > this.warpMSecs)
                            this.yield = true;
                    }
                    else {
                        if (proc.warpProcFlag) {
                            // Start running in warp mode.
                            this.warpBlock = b;
                            this.warpThread = this.activeThread;
                            this.activeThread.firstTime = true;
                        }
                        else if (this.activeThread.isRecursiveCall(b, proc)) {
                            this.yield = true;
                        }
                    }
                    var argCount = proc.parameterNames.length;
                    var argList = [];
                    for (var i = 0; i < argCount; ++i)
                        argList.push(this.arg(b, i));
                    this.startCmdList(proc, false, argList);
                };
                Interpreter.prototype.primReturn = function (b) {
                    // Return from the innermost procedure. If not in a procedure, stop the thread.
                    if (!this.activeThread.returnFromProcedure()) {
                        this.activeThread.stop();
                        this.yield = true;
                    }
                };
                // Variable Primitives
                // Optimization: to avoid the cost of looking up the variable every time,
                // a reference to the Variable object is cached in the target object.
                Interpreter.prototype.primVarGet = function (b) {
                    var target = this.app.runtime.currentDoObj ? this.app.runtime.currentDoObj : this.activeThread.target;
                    var v = target.varCache[b.spec];
                    if (v === null) {
                        v = target.varCache[b.spec] = target.lookupOrCreateVar(b.spec);
                        if (v === null)
                            return 0;
                    }
                    // XXX: Do we need a get() for persistent variables here ?
                    return v.value;
                };
                Interpreter.prototype.primVarSet = function (b) {
                    var name = this.arg(b, 0);
                    var v = this.activeThread.target.varCache[name];
                    if (!v) {
                        v = this.activeThread.target.varCache[name] = this.activeThread.target.lookupOrCreateVar(name);
                        if (!v)
                            return null;
                    }
                    var oldvalue = v.value;
                    v.value = this.arg(b, 1);
                    return v;
                };
                Interpreter.prototype.primVarChange = function (b) {
                    var name = this.arg(b, 0);
                    var v = this.activeThread.target.varCache[name];
                    if (!v) {
                        v = this.activeThread.target.varCache[name] = this.activeThread.target.lookupOrCreateVar(name);
                        if (!v)
                            return null;
                    }
                    v.value = Number(v.value) + this.numarg(b, 1);
                    return v;
                };
                Interpreter.prototype.primGetParam = function (b) {
                    if (b.parameterIndex < 0) {
                        var proc = b.topBlock();
                        if (proc.parameterNames)
                            b.parameterIndex = proc.parameterNames.indexOf(b.spec);
                        if (b.parameterIndex < 0)
                            return 0;
                    }
                    if ((this.activeThread.args === null) || (b.parameterIndex >= this.activeThread.args.length))
                        return 0;
                    return this.activeThread.args[b.parameterIndex];
                };
                return Interpreter;
            }());
            exports_1("Interpreter", Interpreter);
        }
    }
});
//# sourceMappingURL=Interpreter.js.map