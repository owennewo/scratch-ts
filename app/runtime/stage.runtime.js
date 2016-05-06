System.register(["../utils/graphics", "./scratch.time", "../model/object.model", "./interpreter", "./object.runtime", "../model/sprite.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var graphics_1, scratch_time_1, object_model_1, interpreter_1, object_runtime_1, sprite_model_1;
    var StageRuntime;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (scratch_time_1_1) {
                scratch_time_1 = scratch_time_1_1;
            },
            function (object_model_1_1) {
                object_model_1 = object_model_1_1;
            },
            function (interpreter_1_1) {
                interpreter_1 = interpreter_1_1;
            },
            function (object_runtime_1_1) {
                object_runtime_1 = object_runtime_1_1;
            },
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            }],
        execute: function() {
            StageRuntime = (function (_super) {
                __extends(StageRuntime, _super);
                function StageRuntime(stage) {
                    var _this = this;
                    _super.call(this, Snap("#svg-stage"));
                    this.penActivity = false;
                    this.frameRate = 30;
                    this.keyIsDown = new Array(128); // records key up/down state
                    this.mouseDownCount = 0;
                    this.mouseX = 0;
                    this.mouseY = 0;
                    this.lastAnswer = "todo";
                    this.notesPlaying = [];
                    this.audioPlaying = [];
                    this.edgeTriggersEnabled = false; // initially false, becomes true when project first run
                    this.triggeredHats = [];
                    this.stage = stage;
                    this.interp = new interpreter_1.Interpreter(stage);
                    if (window.AudioContext) {
                        this.audioContext = new AudioContext();
                        this.audioGain = this.audioContext.createGain();
                    }
                    else {
                        this.audioContext = new webkitAudioContext();
                        this.audioGain = this.audioContext.createGainNode();
                    }
                    this.audioGain.connect(this.audioContext.destination);
                    this.paper.mousedown(function () {
                        _this.mouseDownCount++;
                        console.log("mouseDownCount:" + _this.mouseDownCount);
                        if (_this.mouseDownCount === 1) {
                            _this.mouseIsDown = true;
                        }
                    });
                    this.paper.mouseup(function () {
                        _this.mouseDownCount++;
                        console.log("mouseDownCount:" + _this.mouseDownCount);
                        if (_this.mouseDownCount === 1) {
                            _this.mouseIsDown = true;
                        }
                    });
                    this.paper.mousemove(function (event) {
                        var target = event.currentTarget;
                        if (!_this.svg)
                            return;
                        var mysvg = _this.svg.parent().node;
                        var x = Math.floor(((event.layerX - mysvg.offsetLeft) / mysvg.offsetWidth * 480) - 240);
                        var y = Math.floor(-(((event.layerY - mysvg.offsetTop) / mysvg.offsetHeight * 320) - 160));
                        window.document.getElementById("x").innerHTML = x;
                        window.document.getElementById("y").innerHTML = y;
                        //            console.log(x + ":" + y);
                        _this.mouseX = x;
                        _this.mouseY = y;
                    });
                }
                StageRuntime.prototype.step = function () {
                    console.log("todo: StageRuntime step");
                };
                StageRuntime.prototype.countdown = function (count) {
                    console.log("todo: StageRuntime countdown");
                };
                StageRuntime.prototype.deleteClones = function () {
                    console.log("todo: deleteClones");
                };
                StageRuntime.prototype.clearFilters = function () {
                    console.log("todo: clear filters");
                };
                StageRuntime.prototype.commitPenStrokes = function () {
                    console.log("todo: commit pen strokes");
                };
                StageRuntime.prototype.clearPenStrokes = function () {
                    graphics_1.Graphics.StagePane.clearStrokes();
                    console.log("todo: clear pen strokes");
                };
                StageRuntime.prototype.stampSprite = function (sprite, alpha) {
                    console.log("todo: stampSprite");
                };
                StageRuntime.prototype.startGreenFlags = function (firstTime) {
                    var _this = this;
                    if (firstTime === void 0) { firstTime = false; }
                    scratch_time_1.ScratchTime.startStepping(this.interp);
                    function startIfGreenFlag(stack, target) {
                        if (stack.spec.code === "whenGreenFlag")
                            this.interp.toggleThread(stack, target);
                    }
                    // if (firstTime && this.app.stage.info.videoOn) {
                    //     // turn on video the first time if project was saved with camera on
                    //     this.app.stage.setVideoState("on");
                    // }
                    this.clearEdgeTriggeredHats();
                    this.timerReset();
                    window.setTimeout(function () { return _this.allStacksAndOwnersDo(startIfGreenFlag.bind(_this)); }, 0);
                };
                StageRuntime.prototype.stopAll = function () {
                    scratch_time_1.ScratchTime.stopStepping();
                    this.interp.stopAllThreads();
                    // this.clearRunFeedback();
                    this.stage.runtime.deleteClones();
                    //        this.cloneCount = 0;
                    // this.clearKeyDownArray();
                    // ScratchSoundPlayer.stopAllSounds();
                    // this.app.extensionManager.stopButtonPressed();
                    this.stage.runtime.clearFilters();
                    for (var _i = 0, _a = this.stage.children; _i < _a.length; _i++) {
                        var s = _a[_i];
                        if (s instanceof sprite_model_1.SpriteModel) {
                            s.runtime.clearFilters();
                            s.runtime.hideBubble();
                        }
                    }
                    // this.clearAskPrompts();
                    // this.app.removeLoadProgressBox();
                    this.motionDetector = null;
                };
                StageRuntime.prototype.clearEdgeTriggeredHats = function () { this.edgeTriggersEnabled = true; this.triggeredHats = []; };
                StageRuntime.prototype.timerReset = function () { this.timerBase = this.interp.currentMSecs; };
                StageRuntime.prototype.allStacksAndOwnersDo = function (f, setDoObj) {
                    if (setDoObj === void 0) { setDoObj = false; }
                    // Call the given function on every stack in the project, passing the stack and owning sprite/stage.
                    // This method is used by broadcast, so enumerate sprites/stage from front to back to match Scratch.
                    var stage = this.stage;
                    var stack;
                    for (var i = stage.children.length - 1; i >= 0; i--) {
                        var o = stage.children[i];
                        if (o instanceof object_model_1.ObjectModel) {
                            if (setDoObj)
                                this.currentDoObject = o;
                            for (var _i = 0, _a = o.scripts; _i < _a.length; _i++) {
                                stack = _a[_i];
                                f(stack.firstBlock, o);
                            }
                        }
                    }
                    if (setDoObj)
                        this.currentDoObject = stage;
                    for (var _b = 0, _c = stage.scripts; _b < _c.length; _b++) {
                        stack = _c[_b];
                        f(stack.firstBlock, stage);
                    }
                    this.currentDoObject = null;
                };
                StageRuntime.prototype.placeCostume = function (costume, element) {
                    // element.transform("translate(-240, -180)");
                    var background = this.svg.select("#stage-background");
                    if (background)
                        background.remove();
                    background = this.paper.group();
                    background.attr({ id: "stage-background", transform: "translate(-240,-180)" });
                    background.append(element);
                    this.svg.prepend(background);
                };
                // showCostume(costume: CostumeModel) {
                //   let backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";
                //
                //   if (this.background) {
                //     this.background = this.svg.group();
                //     this.background.attr({
                //       id: "stage-background-image"
                //     });
                //   } else {
                //     this.background.clear();
                //   }
                //     this.background.attr({
                //       href: backgroundUrl
                //     });
                //   } else {
                //     this.background = this.svg.image(backgroundUrl, -240, -180, 480, 360);
                //
                //   }
                //
                // }
                StageRuntime.prototype.showCostumeNamed = function (costumeName) {
                    var _this = this;
                    this.stage.costumes.forEach(function (costume, index) {
                        if (costume.name === costumeName) {
                            _super.prototype.showCostume.call(_this, _this.stage.costumes[index]);
                        }
                    });
                };
                StageRuntime.prototype.redraw = function () {
                    // do nothing
                };
                StageRuntime.prototype.threadStarted = function () {
                    console.log("todo threadstarted");
                };
                StageRuntime.prototype.clearAskPrompts = function () {
                    console.log("todo clearAskPrompts");
                };
                StageRuntime.prototype.clearRunFeedback = function () {
                    console.log("todo clearRunFeedback");
                };
                StageRuntime.prototype.initStage = function () {
                    console.log("Display initial stage");
                    graphics_1.Graphics.StagePane.clearAll();
                    // not sure why, but need to reset after clearAll otherwise svg.parent() is null
                    this.svg = Snap("#svg-stage");
                    this.stage.showCostume(this.stage.currentCostumeIndex);
                    this.stage.children.forEach(function (sprite) {
                        sprite.runtime.showCostume(sprite.costumes[sprite.currentCostumeIndex], sprite.visible);
                    });
                    // setInterval(() => {
                    //     // console.log("timer loop (replace with requestAnimationFrame??)");
                    //     this.interp.stepThreads();
                    // }, 2000);
                    //
                };
                StageRuntime.prototype.timer = function () {
                    console.log("todo stage runtime timer");
                    return -1;
                };
                StageRuntime.prototype.soundLevel = function () {
                    console.log("todo soundLevel");
                    return -1;
                };
                StageRuntime.prototype.isLoud = function () {
                    console.log("todo stage isLoud");
                    return -1;
                };
                StageRuntime.prototype.getTimeString = function (arg) {
                    console.log("todo stage runtime getTimeString");
                    return "timestring";
                };
                StageRuntime.prototype.getSensor = function (arg) {
                    console.log("todo stage runtime getSensor");
                    return -1;
                };
                StageRuntime.prototype.getBooleanSensor = function (arg) {
                    console.log("todo stage runtime getBooleanSensor");
                    return -1;
                };
                StageRuntime.prototype.type = function () {
                    return "stage";
                };
                return StageRuntime;
            })(object_runtime_1.ObjectRuntime);
            exports_1("StageRuntime", StageRuntime);
        }
    }
});
//# sourceMappingURL=stage.runtime.js.map