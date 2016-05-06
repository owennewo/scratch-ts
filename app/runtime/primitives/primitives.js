System.register(["./list.prims", "./sensing.prims", "./video.motion.prims", "./sound.prims", "./motion.and.pen.prims", "./looks.prims", "../interpreter", "../../model/blockarg.model"], function(exports_1) {
    var list_prims_1, sensing_prims_1, video_motion_prims_1, sound_prims_1, motion_and_pen_prims_1, looks_prims_1, interpreter_1, blockarg_model_1;
    var Primitives;
    return {
        setters:[
            function (list_prims_1_1) {
                list_prims_1 = list_prims_1_1;
            },
            function (sensing_prims_1_1) {
                sensing_prims_1 = sensing_prims_1_1;
            },
            function (video_motion_prims_1_1) {
                video_motion_prims_1 = video_motion_prims_1_1;
            },
            function (sound_prims_1_1) {
                sound_prims_1 = sound_prims_1_1;
            },
            function (motion_and_pen_prims_1_1) {
                motion_and_pen_prims_1 = motion_and_pen_prims_1_1;
            },
            function (looks_prims_1_1) {
                looks_prims_1 = looks_prims_1_1;
            },
            function (interpreter_1_1) {
                interpreter_1 = interpreter_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            }],
        execute: function() {
            // Primitives.as
            // John Maloney, April 2010
            //
            // Miscellaneous primitives. Registers other primitive modules.
            // Note: A few control structure primitives are implemented directly in Interpreter.as.
            Primitives = (function () {
                function Primitives() {
                    this.MaxCloneCount = 300;
                }
                Primitives.prototype.addPrimsTo = function (primTable) {
                    var _this = this;
                    primTable["noop"] = function (b, interp) { };
                    // operators
                    primTable["+"] = function (b, interp) { return interp.numarg(b, 0) + interp.numarg(b, 1); };
                    primTable["-"] = function (b, interp) { return interp.numarg(b, 0) - interp.numarg(b, 1); };
                    primTable["*"] = function (b, interp) { return interp.numarg(b, 0) * interp.numarg(b, 1); };
                    primTable["/"] = function (b, interp) { return interp.numarg(b, 0) / interp.numarg(b, 1); };
                    primTable["randomFrom:to:"] = this.primRandom;
                    primTable["<"] = function (b, interp) { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) < 0; };
                    primTable["="] = function (b, interp) { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) === 0; };
                    primTable[">"] = function (b, interp) { return Primitives.compare(interp.arg(b, 0), interp.arg(b, 1)) > 0; };
                    primTable["&"] = function (b, interp) { return interp.arg(b, 0) && interp.arg(b, 1); };
                    primTable["|"] = function (b, interp) { return interp.arg(b, 0) || interp.arg(b, 1); };
                    primTable["not"] = function (b, interp) { return !interp.arg(b, 0); };
                    primTable["abs"] = function (b, interp) { return Math.abs(interp.numarg(b, 0)); };
                    primTable["sqrt"] = function (b, interp) { return Math.sqrt(interp.numarg(b, 0)); };
                    primTable["concatenate:with:"] = function (b, interp) { return ("" + interp.arg(b, 0) + interp.arg(b, 1)).substr(0, 10240); };
                    primTable["letter:of:"] = this.primLetterOf;
                    primTable["stringLength:"] = function (b, interp) { return String(interp.arg(b, 0)).length; };
                    primTable["%"] = this.primModulo;
                    primTable["rounded"] = function (b, interp) { return Math.round(interp.numarg(b, 0)); };
                    primTable["computeFunction:of:"] = this.primMathFunction;
                    // clone
                    primTable["createCloneOf"] = this.primCreateCloneOf;
                    primTable["deleteClone"] = this.primDeleteClone;
                    primTable["whenCloned"] = primTable["noop"];
                    primTable["NOOP"] = primTable["noop"];
                    // testing (for development)
                    primTable["COUNT"] = function (b, interp) { return _this.counter; };
                    primTable["INCR_COUNT"] = function (b, interp) { _this.counter++; };
                    primTable["CLR_COUNT"] = function (b, interp) { _this.counter = 0; };
                    new looks_prims_1.LooksPrims().addPrimsTo(primTable);
                    new motion_and_pen_prims_1.MotionAndPenPrims().addPrimsTo(primTable);
                    new sound_prims_1.SoundPrims().addPrimsTo(primTable);
                    new video_motion_prims_1.VideoMotionPrims().addPrimsTo(primTable);
                    this.addOtherPrims(primTable);
                };
                Primitives.prototype.addOtherPrims = function (primTable) {
                    new sensing_prims_1.SensingPrims().addPrimsTo(primTable);
                    new list_prims_1.ListPrims().addPrimsTo(primTable);
                };
                Primitives.prototype.primRandom = function (b, interp) {
                    var n1 = interp.numarg(b, 0);
                    var n2 = interp.numarg(b, 1);
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
                Primitives.prototype.primLetterOf = function (b, interp) {
                    var s = interp.arg(b, 1);
                    var i = interp.numarg(b, 0) - 1;
                    if ((i < 0) || (i >= s.length))
                        return "";
                    return s.charAt(i);
                };
                Primitives.prototype.primModulo = function (b, interp) {
                    var n = interp.numarg(b, 0);
                    var modulus = interp.numarg(b, 1);
                    var result = n % modulus;
                    if (result / modulus < 0)
                        result += modulus;
                    return result;
                };
                Primitives.prototype.primMathFunction = function (b, interp) {
                    var op = interp.arg(b, 0);
                    var n = interp.numarg(b, 1);
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
                    var n1 = interpreter_1.Interpreter.asNumber(a1);
                    var n2 = interpreter_1.Interpreter.asNumber(a2);
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
                Primitives.prototype.primCreateCloneOf = function (b, interp) {
                    console.log("todo create clone");
                    // let objName: string = interp.arg(b, 0);
                    // let proto: SpriteModel = this.stage.stage.spriteNamed(objName);
                    // if ("_myself_" === objName) proto = interp.activeThread.target;
                    // if (!proto) return;
                    // if (this.stage.runtime.cloneCount > this.MaxCloneCount) return;
                    // let clone: SpriteModel = new SpriteModel();
                    // if (proto.parent === this.stage.stagePane)
                    //     this.stage.stage.addChildAt(clone, this.stage.stage.getChildIndex(proto));
                    // else
                    //     this.stage.stage.addChild(clone);
                    //
                    // clone.initFrom(proto, true);
                    // clone.name = proto.name;
                    // clone.isClone = true;
                    // for (let stack of clone.scripts) {
                    //     if (stack.firstBlock.spec.code === "whenCloned") {
                    //         interp.startThreadForClone(stack, clone);
                    //     }
                    // }
                    // this.stage.runtime.cloneCount++;
                };
                Primitives.prototype.primDeleteClone = function (b, interp) {
                    console.log("todo delete clone");
                    // let clone: SpriteModel = interp.targetSprite();
                    // if ((clone === null) || (!clone.isClone) || (clone.parent === null)) return;
                    // if (clone.bubble && clone.bubble.parent) clone.bubble.parent.removeChild(clone.bubble);
                    // clone.parent.removeChild(clone);
                    // this.stage.interp.stopThreadsFor(clone);
                    // this.stage.runtime.cloneCount--;
                };
                Primitives.emptyDict = {};
                Primitives.lcDict = {};
                return Primitives;
            })();
            exports_1("Primitives", Primitives);
        }
    }
});
//# sourceMappingURL=primitives.js.map