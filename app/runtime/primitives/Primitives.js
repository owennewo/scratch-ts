System.register(["./LooksPrims", "./MotionAndPenPrims", "./SoundPrims", "./VideoMotionPrims", "./ListPrims", "./SensingPrims", "../../model/blockarg.model", "../../model/sprite.model"], function(exports_1) {
    "use strict";
    var LooksPrims_1, MotionAndPenPrims_1, SoundPrims_1, VideoMotionPrims_1, ListPrims_1, SensingPrims_1, blockarg_model_1, sprite_model_1;
    var Primitives;
    return {
        setters:[
            function (LooksPrims_1_1) {
                LooksPrims_1 = LooksPrims_1_1;
            },
            function (MotionAndPenPrims_1_1) {
                MotionAndPenPrims_1 = MotionAndPenPrims_1_1;
            },
            function (SoundPrims_1_1) {
                SoundPrims_1 = SoundPrims_1_1;
            },
            function (VideoMotionPrims_1_1) {
                VideoMotionPrims_1 = VideoMotionPrims_1_1;
            },
            function (ListPrims_1_1) {
                ListPrims_1 = ListPrims_1_1;
            },
            function (SensingPrims_1_1) {
                SensingPrims_1 = SensingPrims_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            }],
        execute: function() {
            // Primitives.as
            // John Maloney, April 2010
            //
            // Miscellaneous primitives. Registers other primitive modules.
            // Note: A few control structure primitives are implemented directly in Interpreter.as.
            Primitives = (function () {
                function Primitives(app, interpreter) {
                    this.MaxCloneCount = 300;
                    this.app = app;
                    this.interp = interpreter;
                }
                Primitives.prototype.addPrimsTo = function (primTable) {
                    // operators
                    primTable["+"] = function (b) { return this.interp.numarg(this.b, 0) + this.interp.numarg(this.b, 1); };
                    primTable["-"] = function (b) { return this.interp.numarg(this.b, 0) - this.interp.numarg(this.b, 1); };
                    primTable["*"] = function (b) { return this.interp.numarg(this.b, 0) * this.interp.numarg(this.b, 1); };
                    primTable["/"] = function (b) { return this.interp.numarg(this.b, 0) / this.interp.numarg(this.b, 1); };
                    primTable["randomFrom:to:"] = this.primRandom;
                    primTable["<"] = function (b) { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) < 0; };
                    primTable["="] = function (b) { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) === 0; };
                    primTable[">"] = function (b) { return Primitives.compare(this.interp.arg(this.b, 0), this.interp.arg(this.b, 1)) > 0; };
                    primTable["&"] = function (b) { return this.interp.arg(this.b, 0) && this.interp.arg(this.b, 1); };
                    primTable["|"] = function (b) { return this.interp.arg(this.b, 0) || this.interp.arg(this.b, 1); };
                    primTable["not"] = function (b) { return !this.interp.arg(this.b, 0); };
                    primTable["abs"] = function (b) { return Math.abs(this.interp.numarg(this.b, 0)); };
                    primTable["sqrt"] = function (b) { return Math.sqrt(this.interp.numarg(this.b, 0)); };
                    primTable["concatenate:with:"] = function (b) { return ("" + this.interp.arg(this.b, 0) + this.interp.arg(this.b, 1)).substr(0, 10240); };
                    primTable["letter:of:"] = this.primLetterOf;
                    primTable["stringLength:"] = function (b) { return String(this.interp.arg(this.b, 0)).length; };
                    primTable["%"] = this.primModulo;
                    primTable["rounded"] = function (b) { return Math.round(this.interp.numarg(this.b, 0)); };
                    primTable["computeFunction:of:"] = this.primMathFunction;
                    // clone
                    primTable["createCloneOf"] = this.primCreateCloneOf;
                    primTable["deleteClone"] = this.primDeleteClone;
                    primTable["whenCloned"] = this.interp.primNoop;
                    // testing (for development)
                    primTable["NOOP"] = this.interp.primNoop;
                    primTable["COUNT"] = function (b) { return this.counter; };
                    primTable["INCR_COUNT"] = function (b) { this.counter++; };
                    primTable["CLR_COUNT"] = function (b) { this.counter = 0; };
                    new LooksPrims_1.LooksPrims(this.app, this.interp).addPrimsTo(primTable);
                    new MotionAndPenPrims_1.MotionAndPenPrims(this.app, this.interp).addPrimsTo(primTable);
                    new SoundPrims_1.SoundPrims(this.app, this.interp).addPrimsTo(primTable);
                    new VideoMotionPrims_1.VideoMotionPrims(this.app, this.interp).addPrimsTo(primTable);
                    this.addOtherPrims(primTable);
                };
                Primitives.prototype.addOtherPrims = function (primTable) {
                    new SensingPrims_1.SensingPrims(this.app, this.interp).addPrimsTo(primTable);
                    new ListPrims_1.ListPrims(this.app, this.interp).addPrimsTo(primTable);
                };
                Primitives.prototype.primRandom = function (b) {
                    var n1 = this.interp.numarg(b, 0);
                    var n2 = this.interp.numarg(b, 1);
                    var low = (n1 <= n2) ? n1 : n2;
                    var hi = (n1 <= n2) ? n2 : n1;
                    if (low === hi)
                        return low;
                    // if both low and hi are ints, truncate the result to an int
                    var ba1 = b.args[0];
                    var ba2 = b.args[1];
                    var int1 = ba1 ? ba1.numberType === blockarg_model_1.BlockArgModel.NT_INT : Math.floor(n1) === n1;
                    var int2 = ba2 ? ba2.numberType === blockarg_model_1.BlockArgModel.NT_INT : Math.floor(n2) === n2;
                    if (int1 && int2)
                        return low + Math.floor(Math.random() * ((hi + 1) - low));
                    return (Math.random() * (hi - low)) + low;
                };
                Primitives.prototype.primLetterOf = function (b) {
                    var s = this.interp.arg(b, 1);
                    var i = this.interp.numarg(b, 0) - 1;
                    if ((i < 0) || (i >= s.length))
                        return "";
                    return s.charAt(i);
                };
                Primitives.prototype.primModulo = function (b) {
                    var n = this.interp.numarg(b, 0);
                    var modulus = this.interp.numarg(b, 1);
                    var result = n % modulus;
                    if (result / modulus < 0)
                        result += modulus;
                    return result;
                };
                Primitives.prototype.primMathFunction = function (b) {
                    var op = this.interp.arg(b, 0);
                    var n = this.interp.numarg(b, 1);
                    switch (op) {
                        case "abs": return Math.abs(n);
                        case "floor": return Math.floor(n);
                        case "ceiling": return Math.ceil(n);
                        case "int": return n - (n % 1); // used during alpha, but removed from menu
                        case "sqrt": return Math.sqrt(n);
                        case "sin": return Math.sin((Math.PI * n) / 180);
                        case "cos": return Math.cos((Math.PI * n) / 180);
                        case "tan": return Math.tan((Math.PI * n) / 180);
                        case "asin": return (Math.asin(n) * 180) / Math.PI;
                        case "acos": return (Math.acos(n) * 180) / Math.PI;
                        case "atan": return (Math.atan(n) * 180) / Math.PI;
                        case "ln": return Math.log(n);
                        case "log": return Math.log(n) / Math.LN10;
                        case "e ^": return Math.exp(n);
                        case "10 ^": return Math.pow(10, n);
                    }
                    return 0;
                };
                Primitives.compare = function (a1, a2) {
                    // This is static so it can be used by the list "contains" primitive.
                    var n1 = Interpreter.asNumber(a1);
                    var n2 = Interpreter.asNumber(a2);
                    // X !== X is faster than isNaN()
                    if (n1 !== n1 || n2 !== n2) {
                        // Suffix the strings to avoid properties and methods of the Dictionary class (constructor, hasOwnProperty, etc)
                        if (a1 instanceof String && Primitives.emptyDict[a1])
                            a1 += "_";
                        if (a2 instanceof String && Primitives.emptyDict[a2])
                            a2 += "_";
                        // at least one argument can"t be converted to a number: compare as strings
                        var s1 = Primitives.lcDict[a1];
                        if (!s1)
                            s1 = Primitives.lcDict[a1] = String(a1).toLowerCase();
                        var s2 = Primitives.lcDict[a2];
                        if (!s2)
                            s2 = Primitives.lcDict[a2] = String(a2).toLowerCase();
                        return s1.localeCompare(s2);
                    }
                    else {
                        // compare as numbers
                        if (n1 < n2)
                            return -1;
                        if (n1 === n2)
                            return 0;
                        if (n1 > n2)
                            return 1;
                    }
                    return 1;
                };
                Primitives.prototype.primCreateCloneOf = function (b) {
                    var objName = this.interp.arg(b, 0);
                    var proto = this.app.stagePane.spriteNamed(objName);
                    if ("_myself_" === objName)
                        proto = this.interp.activeThread.target;
                    if (!proto)
                        return;
                    if (this.app.runtime.cloneCount > this.MaxCloneCount)
                        return;
                    var clone = new sprite_model_1.SpriteModel();
                    if (proto.parent === this.app.stagePane)
                        this.app.stagePane.addChildAt(clone, this.app.stagePane.getChildIndex(proto));
                    else
                        this.app.stagePane.addChild(clone);
                    clone.initFrom(proto, true);
                    clone.name = proto.name;
                    clone.isClone = true;
                    for (var _i = 0, _a = clone.scripts; _i < _a.length; _i++) {
                        var stack = _a[_i];
                        if (stack.op === "whenCloned") {
                            this.interp.startThreadForClone(stack, clone);
                        }
                    }
                    this.app.runtime.cloneCount++;
                };
                Primitives.prototype.primDeleteClone = function (b) {
                    var clone = this.interp.targetSprite();
                    if ((clone === null) || (!clone.isClone) || (clone.parent === null))
                        return;
                    if (clone.bubble && clone.bubble.parent)
                        clone.bubble.parent.removeChild(clone.bubble);
                    clone.parent.removeChild(clone);
                    this.app.interp.stopThreadsFor(clone);
                    this.app.runtime.cloneCount--;
                };
                Primitives.emptyDict = {};
                Primitives.lcDict = {};
                return Primitives;
            }());
            exports_1("Primitives", Primitives);
        }
    }
});
//# sourceMappingURL=Primitives.js.map