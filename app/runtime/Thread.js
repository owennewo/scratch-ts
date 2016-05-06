System.register(["../model/spec.model"], function(exports_1) {
    "use strict";
    var spec_model_1;
    var Thread, StackFrame;
    return {
        setters:[
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
            }],
        execute: function() {
            ;
            // Thread.as
            // John Maloney, March 2010
            //
            // Thread is an internal data structure used by the interpreter. It holds the
            // state of a thread so it can continue from where it left off, and it has
            // a stack to support nested control structures and procedure calls.
            Thread = (function () {
                function Thread(b, targetObj, startupDelay) {
                    if (startupDelay === void 0) { startupDelay = 0; }
                    this.target = targetObj;
                    this.stop();
                    this.topBlock = b;
                    this.startDelayCount = startupDelay;
                    // initForBlock
                    this.block = b;
                    this.isLoop = false;
                    this.firstTime = true;
                    this.tmp = 0;
                }
                Thread.prototype.pushStateForBlock = function (b) {
                    if (this.sp >= (this.stack.length - 1))
                        this.growStack();
                    var old = this.stack[this.sp++];
                    old.block = this.block;
                    old.isLoop = this.isLoop;
                    old.firstTime = this.firstTime;
                    old.tmp = this.tmp;
                    old.args = this.args;
                    // initForBlock
                    this.block = b;
                    this.isLoop = false;
                    this.firstTime = true;
                    this.tmp = 0;
                };
                Thread.prototype.popState = function () {
                    if (this.sp === 0)
                        return false;
                    var old = this.stack[--this.sp];
                    this.block = old.block;
                    this.isLoop = old.isLoop;
                    this.firstTime = old.firstTime;
                    this.tmp = old.tmp;
                    this.args = old.args;
                    return true;
                };
                Thread.prototype.stackEmpty = function () { return this.sp === 0; };
                Thread.prototype.stop = function () {
                    this.block = null;
                    this.stack = new Array(4);
                    this.stack[0] = new StackFrame();
                    this.stack[1] = new StackFrame();
                    this.stack[2] = new StackFrame();
                    this.stack[3] = new StackFrame();
                    this.sp = 0;
                };
                Thread.prototype.isRecursiveCall = function (procCall, procHat) {
                    var callCount = 5; // maximum number of enclosing procedure calls to examine
                    for (var i = this.sp - 1; i >= 0; i--) {
                        var b = this.stack[i].block;
                        if (b.spec.code === spec_model_1.SpecOperation.Call) {
                            if (procCall === b)
                                return true;
                            if (procHat === this.target.procCache[b.spec])
                                return true;
                        }
                        if (--callCount < 0)
                            return false;
                    }
                    return false;
                };
                Thread.prototype.returnFromProcedure = function () {
                    for (var i = this.sp - 1; i >= 0; i--) {
                        if (this.stack[i].block.spec.code === spec_model_1.SpecOperation.Call) {
                            this.sp = i + 1; // 'hack' the stack pointer, but don't do the final popState here
                            this.block = null; // make it do the final popState through the usual stepActiveThread mechanism
                            return true;
                        }
                    }
                    return false;
                };
                Thread.prototype.initForBlock = function (b) {
                    this.block = b;
                    this.isLoop = false;
                    this.firstTime = true;
                    this.tmp = 0;
                };
                Thread.prototype.growStack = function () {
                    // The stack is an array of Thread instances, pre-allocated for efficiency.
                    // When growing, the current size is doubled.
                    var s = this.stack.length;
                    var n = s + s;
                    this.stack.length = n;
                    for (var i = s; i < n; ++i)
                        this.stack[i] = new StackFrame();
                };
                return Thread;
            }());
            exports_1("Thread", Thread);
            StackFrame = (function () {
                function StackFrame() {
                }
                return StackFrame;
            }());
        }
    }
});
//# sourceMappingURL=Thread.js.map