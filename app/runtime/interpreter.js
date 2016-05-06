System.register(["../model/spec.model", "./primitives/primitives", "../model/stage.model", "./scratch.time", "../model/blockarg.model", "../model/block.model", "./scratch.thread"], function(exports_1) {
    var spec_model_1, primitives_1, stage_model_1, scratch_time_1, blockarg_model_1, block_model_1, spec_model_2, scratch_thread_1;
    var Interpreter;
    return {
        setters:[
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
                spec_model_2 = spec_model_1_1;
            },
            function (primitives_1_1) {
                primitives_1 = primitives_1_1;
            },
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (scratch_time_1_1) {
                scratch_time_1 = scratch_time_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (block_model_1_1) {
                block_model_1 = block_model_1_1;
            },
            function (scratch_thread_1_1) {
                scratch_thread_1 = scratch_thread_1_1;
            }],
        execute: function() {
            Interpreter = (function () {
                function Interpreter(stage) {
                    this.currentMSecs = scratch_time_1.ScratchTime.getTimer(); // millisecond clock for the current step
                    this.turboMode = false;
                    this.threads = []; // all ScratchThreads
                    this.warpMSecs = 500; // max ScratchTime to run during warp
                    this.noThreadCount = 0; // tracking whether there are any active threads
                    this.stage = stage;
                    this.initPrims();
                    // checkPrims();
                }
                Interpreter.prototype.targetObj = function () {
                    return this.stage.runtime.currentDoObject ? this.stage.runtime.currentDoObject : this.activeThread.target;
                };
                Interpreter.prototype.targetSprite = function () {
                    return (this.stage.runtime.currentDoObject ? this.stage.runtime.currentDoObject : this.activeThread.target);
                };
                /* ScratchThreads */
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
                Interpreter.prototype.ScratchThreadCount = function () { return this.threads.length; };
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
                        if (this.stage.runtime.editMode)
                            b.hideRunFeedback();
                        this.clearWarpBlock();
                    }
                    else {
                        var topBlock = b;
                        if (b.isReporter) {
                            console.log("todo: reporter");
                        }
                        if (this.stage.runtime.editMode)
                            topBlock.showRunFeedback();
                        var t = new scratch_thread_1.ScratchThread(b, targetObj, startupDelay);
                        if (topBlock.isReporter)
                            this.bubbleThread = t;
                        t.topBlock = topBlock;
                        this.threads.push(t);
                        this.stage.runtime.threadStarted();
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
                    this.threads.push(new scratch_thread_1.ScratchThread(b, clone));
                };
                Interpreter.prototype.stopThreadsFor = function (target, skipActiveThread) {
                    if (skipActiveThread === void 0) { skipActiveThread = false; }
                    for (var i = 0; i < this.threads.length; i++) {
                        var t = this.threads[i];
                        if (skipActiveThread && (t === this.activeThread))
                            continue;
                        if (t.target === target) {
                            console.log("todo stop sound player");
                            // if (t.tmpObj instanceof ScratchSoundPlayer) {
                            //     (<ScratchSoundPlayer>t.tmpObj).stopPlaying();
                            // }
                            t.stop();
                        }
                    }
                    if ((this.activeThread.target === target) && !skipActiveThread)
                        this.yield = true;
                };
                Interpreter.prototype.restartThread = function (b, targetObj) {
                    // used by broadcast, click hats, and when key pressed hats
                    // stop any ScratchThread running on b, then start a new ScratchThread on b
                    var newThread = new scratch_thread_1.ScratchThread(b, targetObj);
                    var wasRunning = false;
                    for (var i = 0; i < this.threads.length; i++) {
                        if ((this.threads[i].topBlock === b) && (this.threads[i].target === targetObj)) {
                            if (this.askThread === this.threads[i])
                                this.stage.runtime.clearAskPrompts();
                            this.threads[i] = newThread;
                            wasRunning = true;
                        }
                    }
                    if (!wasRunning) {
                        this.threads.push(newThread);
                        if (this.stage.runtime.editMode)
                            b.showRunFeedback();
                        this.stage.runtime.threadStarted();
                    }
                    return newThread;
                };
                Interpreter.prototype.stopAllThreads = function () {
                    this.threads = [];
                    if (this.activeThread)
                        this.activeThread.stop();
                    this.clearWarpBlock();
                    this.stage.runtime.clearRunFeedback();
                    this.doRedraw = true;
                };
                Interpreter.prototype.stepThreads = function () {
                    this.startTime = scratch_time_1.ScratchTime.getTimer();
                    var workTime = (0.75 * 1000) / this.stage.runtime.frameRate; // work for up to 75% of one frame ScratchTime
                    this.doRedraw = false;
                    this.currentMSecs = scratch_time_1.ScratchTime.getTimer();
                    if (this.threads.length === 0) {
                        this.noThreadCount++;
                        if (this.noThreadCount > 5) {
                            this.noThreadCount = 0;
                            console.log("No threads, shutting down animation frame");
                            scratch_time_1.ScratchTime.stopStepping();
                        }
                        return;
                    }
                    else {
                        this.noThreadCount = 0;
                    }
                    while ((this.currentMSecs - this.startTime) < workTime) {
                        if (this.warpThread && (!this.warpThread.block))
                            this.clearWarpBlock();
                        var threadStopped = false;
                        var runnableCount = 0;
                        for (var _i = 0, _a = this.threads; _i < _a.length; _i++) {
                            this.activeThread = _a[_i];
                            this.isWaiting = false;
                            this.stepActiveThread();
                            if (!this.activeThread.block)
                                threadStopped = true;
                            if (!this.isWaiting)
                                runnableCount++;
                        }
                        if (threadStopped) {
                            var newThreads = [];
                            for (var _b = 0, _c = this.threads; _b < _c.length; _b++) {
                                var t = _c[_b];
                                if (t.block)
                                    newThreads.push(t);
                                else if (this.stage.runtime.editMode) {
                                    if (t === this.bubbleThread)
                                        this.bubbleThread = null;
                                    t.topBlock.hideRunFeedback();
                                }
                            }
                            this.threads = newThreads;
                            if (this.threads.length === 0)
                                return;
                        }
                        this.currentMSecs = scratch_time_1.ScratchTime.getTimer();
                        if (this.doRedraw || (runnableCount === 0))
                            return;
                    }
                };
                Interpreter.prototype.stepActiveThread = function () {
                    if (!this.activeThread.block)
                        return;
                    if (this.activeThread.startDelayCount > 0) {
                        this.activeThread.startDelayCount--;
                        this.doRedraw = true;
                        return;
                    }
                    if (this.activeThread.target && !(this.activeThread.target.isStage || (this.activeThread.target.parent instanceof stage_model_1.StageModel))) {
                        // sprite is being dragged
                        if (this.stage.runtime.editMode) {
                            // don"t run scripts of a sprite that is being dragged in edit mode, but do update the screen
                            this.doRedraw = true;
                            return;
                        }
                    }
                    this.yield = false;
                    while (true) {
                        if (this.activeThread === this.warpThread)
                            this.currentMSecs = scratch_time_1.ScratchTime.getTimer();
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
                        if (this.activeThread.block)
                            this.activeThread.block = this.activeThread.block.nextBlock;
                        while (!this.activeThread.block) {
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
                                if (this.activeThread.block.spec.code === spec_model_2.SpecOperation.Call)
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
                    if (!b.opFunction) {
                        if (op.indexOf(".") > -1) {
                            console.log("todo evalCmd for extensions");
                        }
                        else {
                            b.opFunction = this.primTable[op];
                            if (!b.opFunction)
                                b.opFunction = this.primTable["noop"];
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
                };
                // Returns true if the ScratchThread needs to yield while data is requested
                Interpreter.prototype.checkBlockingArgs = function (b) {
                    // Do any of the arguments request data?  If so, start any requests and yield.
                    var shouldYield = false;
                    var args = b.args;
                    for (var i = 0; i < args.length; ++i) {
                        var barg = args[i];
                        if (barg && barg instanceof block_model_1.BlockModel) {
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
                    if (!b) {
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
                /* ScratchTimer */
                Interpreter.prototype.startTimer = function (secs) {
                    var waitMSecs = 1000 * secs;
                    if (waitMSecs < 0)
                        waitMSecs = 0;
                    this.activeThread.tmp = this.currentMSecs + waitMSecs; // end ScratchTime in milliseconds
                    this.activeThread.firstTime = false;
                    this.doYield();
                };
                Interpreter.prototype.checkTimer = function () {
                    // check for ScratchTimer expiration and clean up if expired. return true when expired
                    if (this.currentMSecs >= this.activeThread.tmp) {
                        // ScratchTime expired
                        this.activeThread.tmp = 0;
                        this.activeThread.tmpObj = null;
                        this.activeThread.firstTime = true;
                        return true;
                    }
                    else {
                        // ScratchTime not yet expired
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
                    this.primTable["whenGreenFlag"] = this.primTable["noop"];
                    this.primTable["whenKeyPressed"] = this.primTable["noop"];
                    this.primTable["whenClicked"] = this.primTable["noop"];
                    this.primTable["whenSceneStarts"] = this.primTable["noop"];
                    this.primTable["wait:elapsed:from:"] = this.primWait;
                    this.primTable["doForever"] = function (b, interp) { interp.startCmdList(b.stack1, true); };
                    this.primTable["doRepeat"] = this.primRepeat;
                    this.primTable["broadcast:"] = function (b, interp) { interp.broadcast(interp.arg(b, 0), false); };
                    this.primTable["doBroadcastAndWait"] = function (b, interp) { interp.broadcast(interp.arg(b, 0), true); };
                    this.primTable["undefined"] = function (b, interp) { console.log("doing nothing"); };
                    this.primTable["whenIReceive"] = this.primTable["noop"];
                    this.primTable["doForeverIf"] = function (b, interp) { if (interp.arg(b, 0))
                        interp.startCmdList(b.stack1, true);
                    else
                        interp.yield = true; };
                    this.primTable["doForLoop"] = this.primForLoop;
                    this.primTable["doIf"] = function (b, interp) { if (interp.arg(b, 0))
                        interp.startCmdList(b.stack1); };
                    this.primTable["doIfElse"] = function (b, interp) { if (interp.arg(b, 0))
                        interp.startCmdList(b.stack1);
                    else
                        interp.startCmdList(b.stack2); };
                    this.primTable["doWaitUntil"] = function (b, interp) { if (!interp.arg(b, 0))
                        this.yield = true; };
                    this.primTable["doWhile"] = function (b, interp) { if (interp.arg(b, 0))
                        interp.startCmdList(b.stack1, true); };
                    this.primTable["doUntil"] = function (b, interp) { if (!interp.arg(b, 0))
                        interp.startCmdList(b.stack1, true); };
                    this.primTable["doReturn"] = this.primReturn;
                    this.primTable["stopAll"] = function (b, interp) { interp.stage.runtime.stopAll(); interp.yield = true; };
                    this.primTable["stopScripts"] = this.primStop;
                    this.primTable["warpSpeed"] = this.primOldWarpSpeed;
                    // procedures
                    this.primTable[spec_model_2.SpecOperation.Call] = this.primCall;
                    // variables
                    this.primTable[spec_model_2.SpecOperation.GetVar] = this.primVarGet;
                    this.primTable[spec_model_2.SpecOperation.SetVar] = this.primVarSet;
                    this.primTable[spec_model_2.SpecOperation.ChangeVar] = this.primVarChange;
                    this.primTable[spec_model_2.SpecOperation.GetParam] = this.primGetParam;
                    // edge-trigger hat BlockModels
                    this.primTable["whenDistanceLessThan"] = this.primTable["noop"];
                    this.primTable["whenSensorConnected"] = this.primTable["noop"];
                    this.primTable["whenSensorGreaterThan"] = this.primTable["noop"];
                    this.primTable["whenTiltIs"] = this.primTable["noop"];
                    this.addOtherPrims(this.primTable);
                };
                Interpreter.prototype.addOtherPrims = function (primTable) {
                    // other primitives
                    new primitives_1.Primitives().addPrimsTo(primTable);
                };
                Interpreter.prototype.checkPrims = function () {
                    var op;
                    var allOps = ["CALL", "GET_VAR", "NOOP"];
                    for (var key in spec_model_1.SpecModel.SPECS) {
                        var spec = spec_model_1.SpecModel.SPECS.get(key);
                        if (spec.code.length > 3) {
                            // op = spec[3];
                            allOps.push(spec.code);
                            if (this.primTable[op] === undefined)
                                console.log("Unimplemented:" + op);
                        }
                    }
                    for (op in this.primTable) {
                        if (allOps.indexOf(op) < 0)
                            console.log("Not in SpecOperation:" + op);
                    }
                };
                Interpreter.prototype.primForLoop = function (b, interp) {
                    var list = [];
                    var loopVar;
                    if (interp.activeThread.firstTime) {
                        if (!(interp.arg(b, 0) instanceof String))
                            return;
                        var listArg = interp.arg(b, 1);
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
                        var looplet_1 = interp.activeThread.target.lookupOrCreateVar(interp.arg(b, 0));
                        interp.activeThread.args = [list, loopVar];
                        interp.activeThread.tmp = 0;
                        interp.activeThread.firstTime = false;
                    }
                    list = interp.activeThread.args[0];
                    var looplet = interp.activeThread.args[1];
                    if (interp.activeThread.tmp < list.length) {
                        loopVar.value = list[interp.activeThread.tmp++];
                        interp.startCmdList(b.stack1, true);
                    }
                    else {
                        interp.activeThread.args = null;
                        interp.activeThread.tmp = 0;
                        interp.activeThread.firstTime = true;
                    }
                };
                Interpreter.prototype.primOldWarpSpeed = function (b, interp) {
                    // Semi-support for old warp BlockModel: run substack at normal speed.
                    if (!b.stack1)
                        return;
                    interp.startCmdList(b.stack1);
                };
                Interpreter.prototype.primRepeat = function (b, interp) {
                    if (interp.activeThread.firstTime) {
                        var repeatCount = Math.max(0, Math.min(Math.round(interp.numarg(b, 0)), 2147483647)); // clip to range: 0 to 2^31-1
                        interp.activeThread.tmp = repeatCount;
                        interp.activeThread.firstTime = false;
                    }
                    if (interp.activeThread.tmp > 0) {
                        interp.activeThread.tmp--; // decrement count
                        interp.startCmdList(b.stack1, true);
                    }
                    else {
                        interp.activeThread.firstTime = true;
                    }
                };
                Interpreter.prototype.primStop = function (b, interp) {
                    var type = interp.arg(b, 0);
                    if (type === "all") {
                        interp.stage.runtime.stopAll();
                        interp.yield = true;
                    }
                    if (type === "this script")
                        interp.primReturn(b, interp);
                    if (type === "other scripts in sprite")
                        interp.stopThreadsFor(interp.activeThread.target, true);
                    if (type === "other scripts in stage")
                        interp.stopThreadsFor(interp.activeThread.target, true);
                };
                Interpreter.prototype.primWait = function (b, interp) {
                    if (interp.activeThread.firstTime) {
                        interp.startTimer(interp.numarg(b, 0));
                        interp.redraw();
                    }
                    else
                        interp.checkTimer();
                };
                // Broadcast and scene starting
                Interpreter.prototype.broadcast = function (msg, waitFlag) {
                    var pair;
                    if (this.activeThread.firstTime) {
                        var receivers = [];
                        var newThreads = [];
                        msg = msg.toLowerCase();
                        var findReceivers = function (stack, target) {
                            if ((stack.spec.code === "whenIReceive") && (stack.args[0].argValue.toLowerCase() === msg)) {
                                receivers.push([stack, target]);
                            }
                        };
                        this.stage.runtime.allStacksAndOwnersDo(findReceivers);
                        // (re)start all receivers
                        for (var _i = 0; _i < receivers.length; _i++) {
                            pair = receivers[_i];
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
                            if ((stack.spec.code === "whenSceneStarts") && (stack.args[0].argValue === sceneName)) {
                                receivers.push([stack, this.target]);
                            }
                        }
                        var receivers = [];
                        this.stage.runtime.showCostumeNamed(sceneName);
                        this.redraw();
                        this.stage.runtime.allStacksAndOwnersDo(findSceneHats);
                        // (re)start all receivers
                        var newThreads = [];
                        for (var _i = 0; _i < receivers.length; _i++) {
                            pair = receivers[_i];
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
                Interpreter.prototype.primCall = function (b, interp) {
                    // Call a procedure. Handle recursive calls and"warp" procedures.
                    // The activeThread.firstTime flag is used to mark the first call
                    // to a procedure running in warp mode. activeThread.firstTime is
                    // false for subsequent calls to warp mode procedures.
                    // Lookup the procedure and cache for future use
                    var obj = interp.activeThread.target;
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
                        if ((interp.currentMSecs - interp.startTime) > interp.warpMSecs)
                            interp.yield = true;
                    }
                    else {
                        console.log("todo support warp and yield");
                    }
                    var argCount = b.parameterNames.length;
                    var argList = [];
                    for (var i = 0; i < argCount; ++i)
                        argList.push(interp.arg(b, i));
                    interp.startCmdList(b, false, argList);
                };
                Interpreter.prototype.primReturn = function (b, interp) {
                    // Return from the innermost procedure. If not in a procedure, stop the ScratchThread.
                    if (!interp.activeThread.returnFromProcedure()) {
                        interp.activeThread.stop();
                        interp.yield = true;
                    }
                };
                // ScratchVariable Primitives
                // Optimization: to avoid the cost of looking up the ScratchVariable every ScratchTime,
                // a reference to the ScratchVariable object is cached in the target object.
                Interpreter.prototype.primVarGet = function (b, interp) {
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
                };
                Interpreter.prototype.primVarSet = function (b, interp) {
                    var name = interp.arg(b, 0);
                    var v = interp.activeThread.target.varCache[name];
                    if (!v) {
                        v = interp.activeThread.target.varCache[name] = interp.activeThread.target.lookupOrCreateVar(name);
                        if (!v)
                            return null;
                    }
                    var oldvalue = v.value;
                    v.value = interp.arg(b, 1);
                    return v;
                };
                Interpreter.prototype.primVarChange = function (b, interp) {
                    var name = interp.arg(b, 0);
                    var v = interp.activeThread.target.varCache[name];
                    if (!v) {
                        v = interp.activeThread.target.varCache[name] = interp.activeThread.target.lookupOrCreateVar(name);
                        if (!v)
                            return null;
                    }
                    v.value = Number(v.value) + interp.numarg(b, 1);
                    return v;
                };
                Interpreter.prototype.primGetParam = function (b, interp) {
                    if (b.parameterIndex < 0) {
                        var proc = b.topBlock();
                        if (proc.parameterNames)
                            b.parameterIndex = proc.parameterNames.indexOf(b.spec);
                        if (b.parameterIndex < 0)
                            return 0;
                    }
                    if ((!interp.activeThread.args) || (b.parameterIndex >= interp.activeThread.args.length))
                        return 0;
                    return interp.activeThread.args[b.parameterIndex];
                };
                return Interpreter;
            })();
            exports_1("Interpreter", Interpreter);
        }
    }
});
//# sourceMappingURL=interpreter.js.map