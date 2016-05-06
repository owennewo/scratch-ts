System.register(["./visible.model", "../utils/read.stream", "./blockarg.model", "./spec.category.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var visible_model_1, read_stream_1, blockarg_model_1, spec_category_model_1;
    var SpecModel, SpecSpacerModel, SpecOperation;
    return {
        setters:[
            function (visible_model_1_1) {
                visible_model_1 = visible_model_1_1;
            },
            function (read_stream_1_1) {
                read_stream_1 = read_stream_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (spec_category_model_1_1) {
                spec_category_model_1 = spec_category_model_1_1;
            }],
        execute: function() {
            SpecModel = (function (_super) {
                __extends(SpecModel, _super);
                function SpecModel(code, label, argCount, category, shapeType, defaultArgs) {
                    _super.call(this);
                    this.labelsAndArgs = [];
                    this.code = code;
                    this.category = category;
                    this.label = label;
                    this.argCount = argCount;
                    this.shapeType = shapeType;
                    this.defaultArgs = defaultArgs;
                    // this.shape = new BlockShapeModel()
                    this.addLabelsAndArgs();
                }
                SpecModel.prototype.addLabelsAndArgs = function () {
                    var specParts = read_stream_1.ReadStream.tokenize(this.label);
                    var i;
                    this.labelsAndArgs = [];
                    var argIndex = 0;
                    for (i = 0; i < specParts.length; i++) {
                        var arg = new blockarg_model_1.BlockArgModel(specParts[i], this);
                        if (arg.isArgument) {
                            if (this.defaultArgs && argIndex < this.defaultArgs.length) {
                                arg.defaultArgValue = this.defaultArgs[argIndex];
                            }
                            argIndex++;
                        }
                        this.labelsAndArgs.push(arg);
                    }
                };
                SpecModel.prototype.cloneLabelAndArgs = function () {
                    var clonedArgs = [];
                    for (var _i = 0, _a = this.labelsAndArgs; _i < _a.length; _i++) {
                        var arg = _a[_i];
                        clonedArgs.push(arg.clone());
                    }
                    return clonedArgs;
                };
                SpecModel.initialize = function () {
                    // block specification					type, cat, opcode			default args (optional)
                    // MOTION
                    var motion = spec_category_model_1.SpecCategoryModel.CATEGORIES.get(1);
                    SpecModel.add("move %n steps", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "forward:", [10]);
                    SpecModel.add("turn @turnRight %n degrees", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "turnRight:", [15]);
                    SpecModel.add("turn @turnLeft %n degrees", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "turnLeft:", [15]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 2);
                    SpecModel.add("point in direction %d.direction", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "heading:", [90]);
                    SpecModel.add("point towards %m.spriteOrMouse", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "pointTowards:", []);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 2);
                    SpecModel.add("go to x:%n y:%n", 2, " ", spec_category_model_1.SpecCategoryModel.MOTION, "gotoX:y:");
                    SpecModel.add("go to %m.spriteOrMouse", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "gotoSpriteOrMouse:", ["mouse-pointer"]);
                    SpecModel.add("glide %n secs to x:%n y:%n", 3, " ", spec_category_model_1.SpecCategoryModel.MOTION, "glideSecs:toX:y:elapsed:from:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 2);
                    SpecModel.add("change x by %n", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "changeXposBy:", [10]);
                    SpecModel.add("set x to %n", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "xpos:", [0]);
                    SpecModel.add("change y by %n", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "changeYposBy:", [10]);
                    SpecModel.add("set y to %n", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "ypos:", [0]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 2);
                    SpecModel.add("if on edge, bounce", 0, " ", spec_category_model_1.SpecCategoryModel.MOTION, "bounceOffEdge");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 1);
                    SpecModel.add("set rotation style %m.rotationStyle", 1, " ", spec_category_model_1.SpecCategoryModel.MOTION, "setRotationStyle", ["left-right"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.MOTION, 2);
                    SpecModel.add("x position", 0, "r", spec_category_model_1.SpecCategoryModel.MOTION, "xpos");
                    SpecModel.add("y position", 0, "r", spec_category_model_1.SpecCategoryModel.MOTION, "ypos");
                    SpecModel.add("direction", 0, "r", spec_category_model_1.SpecCategoryModel.MOTION, "heading");
                    // looks
                    SpecModel.add("say %s for %n secs", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "say:duration:elapsed:from:", ["Hello!", 2]);
                    SpecModel.add("say %s", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "say:", ["Hello!"]);
                    SpecModel.add("think %s for %n secs", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "think:duration:elapsed:from:", ["Hmm...", 2]);
                    SpecModel.add("think %s", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "think:", ["Hmm..."]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("show", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "show");
                    SpecModel.add("hide", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "hide");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("switch costume to %m.costume", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "lookLike:", ["costume1"]);
                    SpecModel.add("next costume", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "nextCostume");
                    SpecModel.add("switch backdrop to %m.backdrop", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "startScene", ["backdrop1"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("change %m.effect effect by %n", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "changeGraphicEffect:by:", ["color", 25]);
                    SpecModel.add("set %m.effect effect to %n", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "setGraphicEffect:to:", ["color", 0]);
                    SpecModel.add("clear graphic effects", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "filterReset");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("change size by %n", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "changeSizeBy:", [10]);
                    SpecModel.add("set size to %n%", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "setSizeTo:", [100]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("go to front", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "comeToFront");
                    SpecModel.add("go back %n layers", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS, "goBackByLayers:", [1]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS, 1);
                    SpecModel.add("costume #", 0, "r", spec_category_model_1.SpecCategoryModel.LOOKS, "costumeIndex");
                    SpecModel.add("backdrop name", 0, "r", spec_category_model_1.SpecCategoryModel.LOOKS, "sceneName");
                    SpecModel.add("size", 0, "r", spec_category_model_1.SpecCategoryModel.LOOKS, "scale");
                    // stage looks
                    SpecModel.add("switch backdrop to %m.backdrop", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "startScene", ["backdrop1"]);
                    SpecModel.add("switch backdrop to %m.backdrop and wait", 1, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "startSceneAndWait", ["backdrop1"]);
                    SpecModel.add("next backdrop", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "nextScene");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, 2);
                    SpecModel.add("change %m.effect effect by %n", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "changeGraphicEffect:by:", ["color", 25]);
                    SpecModel.add("set %m.effect effect to %n", 2, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "setGraphicEffect:to:", ["color", 0]);
                    SpecModel.add("clear graphic effects", 0, " ", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "filterReset");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, 1);
                    SpecModel.add("backdrop name", 0, "r", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "sceneName");
                    SpecModel.add("backdrop #", 0, "r", spec_category_model_1.SpecCategoryModel.LOOKS_STAGE, "backgroundIndex");
                    // sound
                    SpecModel.add("play sound %m.sound", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "playSound:", ["pop"]);
                    SpecModel.add("play sound %m.sound until done", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "doPlaySoundAndWait", ["pop"]);
                    SpecModel.add("stop all sounds", 0, " ", spec_category_model_1.SpecCategoryModel.SOUND, "stopAllSounds");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SOUND, 1);
                    SpecModel.add("play drum %d.drum for %n beats", 2, " ", spec_category_model_1.SpecCategoryModel.SOUND, "playDrum", [1, 0.25]);
                    SpecModel.add("rest for %n beats", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "rest:elapsed:from:", [0.25]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SOUND, 1);
                    SpecModel.add("play note %d.note for %n beats", 2, " ", spec_category_model_1.SpecCategoryModel.SOUND, "noteOn:duration:elapsed:from:", [60, 0.5]);
                    SpecModel.add("set instrument to %d.instrument", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "instrument:", [1]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SOUND, 1);
                    SpecModel.add("change volume by %n", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "changeVolumeBy:", [-10]);
                    SpecModel.add("set volume to %n%", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "setVolumeTo:", [100]);
                    SpecModel.add("volume", 0, "r", spec_category_model_1.SpecCategoryModel.SOUND, "volume");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SOUND, 1);
                    SpecModel.add("change tempo by %n", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "changeTempoBy:", [20]);
                    SpecModel.add("set tempo to %n bpm", 1, " ", spec_category_model_1.SpecCategoryModel.SOUND, "setTempoTo:", [60]);
                    SpecModel.add("tempo", 0, "r", spec_category_model_1.SpecCategoryModel.SOUND, "tempo");
                    // pen
                    SpecModel.add("clear", 0, " ", spec_category_model_1.SpecCategoryModel.PEN, "clearPenTrails");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    SpecModel.add("stamp", 0, " ", spec_category_model_1.SpecCategoryModel.PEN, "stampCostume");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    SpecModel.add("pen down", 0, " ", spec_category_model_1.SpecCategoryModel.PEN, "putPenDown");
                    SpecModel.add("pen up", 0, " ", spec_category_model_1.SpecCategoryModel.PEN, "putPenUp");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    SpecModel.add("set pen color to %c", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "penColor:");
                    SpecModel.add("change pen color by %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "changePenHueBy:");
                    SpecModel.add("set pen color to %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "setPenHueTo:", [0]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    SpecModel.add("change pen shade by %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "changePenShadeBy:");
                    SpecModel.add("set pen shade to %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "setPenShadeTo:", [50]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    SpecModel.add("change pen size by %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "changePenSizeBy:", [1]);
                    SpecModel.add("set pen size to %n", 1, " ", spec_category_model_1.SpecCategoryModel.PEN, "penSize:", [1]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.PEN, 1);
                    // stage pen
                    SpecModel.add("clear", 0, " ", spec_category_model_1.SpecCategoryModel.PEN_STAGE, "clearPenTrails");
                    // triggers
                    SpecModel.add("when @greenFlag clicked", 0, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenGreenFlag");
                    SpecModel.add("when %m.key key pressed", 1, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenKeyPressed", ["space"]);
                    SpecModel.add("when this sprite clicked", 0, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenClicked");
                    SpecModel.add("when backdrop switches to %m.backdrop", 1, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenSceneStarts", ["backdrop1"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.EVENTS, 2);
                    SpecModel.add("when %m.triggerSensor > %n", 2, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenSensorGreaterThan", ["loudness", 10]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.EVENTS, 2);
                    SpecModel.add("when I receive %m.broadcast", 1, "h", spec_category_model_1.SpecCategoryModel.EVENTS, "whenIReceive");
                    SpecModel.add("broadcast %m.broadcast", 1, " ", spec_category_model_1.SpecCategoryModel.EVENTS, "broadcast:");
                    SpecModel.add("broadcast %m.broadcast and wait", 1, " ", spec_category_model_1.SpecCategoryModel.EVENTS, "doBroadcastAndWait");
                    SpecModel.add("undefined", 0, " ", spec_category_model_1.SpecCategoryModel.EVENTS, "undefined");
                    // control - sprite
                    SpecModel.add("wait %n secs", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL, "wait:elapsed:from:", [1]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL, 1);
                    SpecModel.add("repeat %n", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL, "doRepeat", [10]);
                    SpecModel.add("forever", 0, "cf", spec_category_model_1.SpecCategoryModel.CONTROL, "doForever");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL, 1);
                    SpecModel.add("if %b then", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL, "doIf");
                    SpecModel.add("if %b then", 1, "e", spec_category_model_1.SpecCategoryModel.CONTROL, "doIfElse");
                    SpecModel.add("wait until %b", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL, "doWaitUntil");
                    SpecModel.add("repeat until %b", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL, "doUntil");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL, 1);
                    SpecModel.add("stop %m.stop", 1, "f", spec_category_model_1.SpecCategoryModel.CONTROL, "stopScripts", ["all"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL, 1);
                    SpecModel.add("when I start as a clone", 0, "h", spec_category_model_1.SpecCategoryModel.CONTROL, "whenCloned");
                    SpecModel.add("create clone of %m.spriteOnly", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL, "createCloneOf");
                    SpecModel.add("delete this clone", 0, "f", spec_category_model_1.SpecCategoryModel.CONTROL, "deleteClone");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL, 1);
                    // control - stage
                    SpecModel.add("wait %n secs", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "wait:elapsed:from:", [1]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, 1);
                    SpecModel.add("repeat %n", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doRepeat", [10]);
                    SpecModel.add("forever", 0, "cf", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doForever");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, 1);
                    SpecModel.add("if %b then", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doIf");
                    SpecModel.add("if %b then", 1, "e", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doIfElse");
                    SpecModel.add("wait until %b", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doWaitUntil");
                    SpecModel.add("repeat until %b", 1, "c", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "doUntil");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, 1);
                    SpecModel.add("stop %m.stop", 1, "f", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "stopScripts", ["all"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, 1);
                    SpecModel.add("create clone of %m.spriteOnly", 1, " ", spec_category_model_1.SpecCategoryModel.CONTROL_STAGE, "createCloneOf");
                    // sensing
                    SpecModel.add("touching %m.touching?", 1, "b", spec_category_model_1.SpecCategoryModel.SENSING, "touching:");
                    SpecModel.add("touching color %c?", 1, "b", spec_category_model_1.SpecCategoryModel.SENSING, "touchingColor:");
                    SpecModel.add("color %c is touching %c?", 1, "b", spec_category_model_1.SpecCategoryModel.SENSING, "color:sees:");
                    SpecModel.add("distance to %m.spriteOrMouse", 1, "r", spec_category_model_1.SpecCategoryModel.SENSING, "distanceTo:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("ask %s and wait", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING, "doAsk", ["What's your name?"]);
                    SpecModel.add("answer", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "answer");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("key %m.key pressed?", 1, "b", spec_category_model_1.SpecCategoryModel.SENSING, "keyPressed:", ["space"]);
                    SpecModel.add("mouse down?", 0, "b", spec_category_model_1.SpecCategoryModel.SENSING, "mousePressed");
                    SpecModel.add("mouse x", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "mouseX");
                    SpecModel.add("mouse y", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "mouseY");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("loudness", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "soundLevel");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("video %m.videoMotionType on %m.stageOrThis", 2, "r", spec_category_model_1.SpecCategoryModel.SENSING, "senseVideoMotion", ["motion"]);
                    SpecModel.add("turn video %m.videoState", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING, "setVideoState", ["on"]);
                    SpecModel.add("set video transparency to %n%", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING, "setVideoTransparency", [50]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("timer", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "timer");
                    SpecModel.add("reset timer", 0, " ", spec_category_model_1.SpecCategoryModel.SENSING, "timerReset");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("%m.attribute of %m.spriteOrStage", 2, "r", spec_category_model_1.SpecCategoryModel.SENSING, "getAttribute:of:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING, 1);
                    SpecModel.add("current %m.timeAndDate", 1, "r", spec_category_model_1.SpecCategoryModel.SENSING, "timeAndDate", ["minute"]);
                    SpecModel.add("days since 2000", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "timestamp");
                    SpecModel.add("username", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING, "getUserName");
                    // stage sensing
                    SpecModel.add("ask %s and wait", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "doAsk", ["What's your name?"]);
                    SpecModel.add("answer", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "answer");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("key %m.key pressed?", 1, "b", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "keyPressed:", ["space"]);
                    SpecModel.add("mouse down?", 0, "b", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "mousePressed");
                    SpecModel.add("mouse x", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "mouseX");
                    SpecModel.add("mouse y", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "mouseY");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("loudness", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "soundLevel");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("video %m.videoMotionType on %m.stageOrThis", 2, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "senseVideoMotion", ["motion", "Stage"]);
                    SpecModel.add("turn video %m.videoState", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "setVideoState", ["on"]);
                    SpecModel.add("set video transparency to %n%", 1, " ", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "setVideoTransparency", [50]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("timer", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "timer");
                    SpecModel.add("reset timer", 0, " ", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "timerReset");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("%m.attribute of %m.spriteOrStage", 2, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "getAttribute:of:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.SENSING_STAGE, 1);
                    SpecModel.add("current %m.timeAndDate", 1, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "timeAndDate", ["minute"]);
                    SpecModel.add("days since 2000", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "timestamp");
                    SpecModel.add("username", 0, "r", spec_category_model_1.SpecCategoryModel.SENSING_STAGE, "getUserName");
                    // operators
                    SpecModel.add("%n + %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "+");
                    SpecModel.add("%n - %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "-");
                    SpecModel.add("%n * %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "*");
                    SpecModel.add("%n / %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "/");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("pick random %n to %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "randomFrom:to:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("%s < %s", 2, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, "<");
                    SpecModel.add("%s = %s", 2, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, "=");
                    SpecModel.add("%s > %s", 2, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, ">");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("%b and %b", 2, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, "&");
                    SpecModel.add("%b or %b", 2, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, "|");
                    SpecModel.add("not %b", 1, "b", spec_category_model_1.SpecCategoryModel.OPERATORS, "not");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("join %s %s", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "concatenate:with:", ["hello ", "world"]);
                    SpecModel.add("letter %n of %s", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "letter:of:", [1, "world"]);
                    SpecModel.add("length of %s", 1, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "stringLength:", ["world"]);
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("%n mod %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "%");
                    SpecModel.add("round %n", 1, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "rounded");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.OPERATORS, 1);
                    SpecModel.add("%m.mathOp of %n", 2, "r", spec_category_model_1.SpecCategoryModel.OPERATORS, "computeFunction:of:", ["sqrt", 9]);
                    // variables
                    SpecModel.add("set %m.var to %s", 2, " ", spec_category_model_1.SpecCategoryModel.OPERATORS, "setVar:to:");
                    SpecModel.add("change %m.var by %n", 2, " ", spec_category_model_1.SpecCategoryModel.OPERATORS, "changeVar:by:");
                    SpecModel.add("show variable %m.var", 1, " ", spec_category_model_1.SpecCategoryModel.OPERATORS, "showVariable:");
                    SpecModel.add("hide variable %m.var", 1, " ", spec_category_model_1.SpecCategoryModel.OPERATORS, "hideVariable:");
                    // LIST
                    SpecModel.add("add %s to %m.list", 2, " ", spec_category_model_1.SpecCategoryModel.LIST, "append:toList:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LIST, 1);
                    SpecModel.add("delete %d.listDeleteItem of %m.list", 2, " ", spec_category_model_1.SpecCategoryModel.LIST, "deleteLine:ofList:");
                    SpecModel.add("insert %s at %d.listItem of %m.list", 3, " ", spec_category_model_1.SpecCategoryModel.LIST, "insert:at:ofList:");
                    SpecModel.add("replace item %d.listItem of %m.list with %s", 3, " ", spec_category_model_1.SpecCategoryModel.LIST, "setLine:ofList:to:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LIST, 1);
                    SpecModel.add("item %d.listItem of %m.list", 2, "r", spec_category_model_1.SpecCategoryModel.LIST, "getLine:ofList:");
                    SpecModel.add("length of %m.list", 1, "r", spec_category_model_1.SpecCategoryModel.LIST, "lineCountOfList:");
                    SpecModel.add("%m.list contains %s?", 2, "b", spec_category_model_1.SpecCategoryModel.LIST, "list:contains:");
                    SpecModel.addSpacer(spec_category_model_1.SpecCategoryModel.LIST, 1);
                    SpecModel.add("show list %m.list", 1, " ", spec_category_model_1.SpecCategoryModel.LIST, "showList:");
                    SpecModel.add("hide list %m.list", 2, " ", spec_category_model_1.SpecCategoryModel.LIST, "hideList:");
                    // obsolete blocks from Scratch 1.4 that may be used in older projects
                    SpecModel.add("play drum %n for %n beats", 2, " ", spec_category_model_1.SpecCategoryModel.OLD, "drum:duration:elapsed:from:", [1, 0.25]); // Scratch 1.4 MIDI drum
                    SpecModel.add("set instrument to %n", 1, " ", spec_category_model_1.SpecCategoryModel.OLD, "midiInstrument:", [1]);
                    SpecModel.add("loud?", 0, "b", spec_category_model_1.SpecCategoryModel.OLD, "isLoud");
                    // obsolete blocks from Scratch 1.4 that are converted to new forms (so should never appear):
                    SpecModel.add("abs %n", 1, "r", spec_category_model_1.SpecCategoryModel.OLD, "abs");
                    SpecModel.add("sqrt %n", 1, "r", spec_category_model_1.SpecCategoryModel.OLD, "sqrt");
                    SpecModel.add("stop script", 0, "f", spec_category_model_1.SpecCategoryModel.OLD, "doReturn");
                    SpecModel.add("stop all", 0, "f", spec_category_model_1.SpecCategoryModel.OLD, "stopAll");
                    SpecModel.add("switch to background %m.costume", 1, " ", spec_category_model_1.SpecCategoryModel.OLD, "showBackground:", ["backdrop1"]);
                    SpecModel.add("next background", 0, " ", spec_category_model_1.SpecCategoryModel.OLD, "nextBackground");
                    SpecModel.add("forever if %b", 1, "cf", spec_category_model_1.SpecCategoryModel.OLD, "doForeverIf");
                    // testing and experimental control prims
                    SpecModel.add("noop", 0, "r", spec_category_model_1.SpecCategoryModel.BETA, "COUNT");
                    SpecModel.add("counter", 0, "r", spec_category_model_1.SpecCategoryModel.BETA, "COUNT");
                    SpecModel.add("clear counter", 0, " ", spec_category_model_1.SpecCategoryModel.BETA, "CLR_COUNT");
                    SpecModel.add("incr counter", 0, " ", spec_category_model_1.SpecCategoryModel.BETA, "INCR_COUNT");
                    SpecModel.add("for each %m.varName in %s", 2, "c", spec_category_model_1.SpecCategoryModel.BETA, "doForLoop", ["v", 10]);
                    SpecModel.add("while %b", 1, "c", spec_category_model_1.SpecCategoryModel.BETA, "doWhile");
                    SpecModel.add("all at once", 0, "c", spec_category_model_1.SpecCategoryModel.BETA, "warpSpeed");
                    // stage motion (scrolling)
                    SpecModel.add("scroll right %n", 1, " ", spec_category_model_1.SpecCategoryModel.BETA, "scrollRight", [10]);
                    SpecModel.add("scroll up %n", 1, " ", spec_category_model_1.SpecCategoryModel.BETA, "scrollUp", [10]);
                    SpecModel.add("align scene %m.scrollAlign", 1, " ", spec_category_model_1.SpecCategoryModel.BETA, "scrollAlign", ["bottom-left"]);
                    SpecModel.add("x scroll", 0, "r", spec_category_model_1.SpecCategoryModel.BETA, "xScroll");
                    SpecModel.add("y scroll", 0, "r", spec_category_model_1.SpecCategoryModel.BETA, "yScroll");
                    // other obsolete blocks from alpha/beta
                    SpecModel.add("hide all sprites", 0, " ", spec_category_model_1.SpecCategoryModel.BETA, "hideAll");
                    SpecModel.add("user id", 0, "r", spec_category_model_1.SpecCategoryModel.BETA, "getUserId");
                };
                SpecModel.add = function (label, argCount, type, category, code, defaultArgs) {
                    var spec = new SpecModel(code, label, argCount, category, type, defaultArgs);
                    // spec.prepareShape(spec, type);
                    category.addSpec(spec);
                    SpecModel.SPECS.set(spec.code, spec);
                };
                SpecModel.addSpacer = function (category, spaces) {
                    var spec = new SpecSpacerModel(category, spaces);
                    category.addSpec(spec);
                };
                SpecModel.SPECS = new Map();
                return SpecModel;
            })(visible_model_1.VisibleModel);
            exports_1("SpecModel", SpecModel);
            SpecSpacerModel = (function (_super) {
                __extends(SpecSpacerModel, _super);
                function SpecSpacerModel(category, spaces) {
                    _super.call(this, "spacer", "this will be used as spacer between real specs", 0, category, "", [spaces]);
                }
                return SpecSpacerModel;
            })(SpecModel);
            exports_1("SpecSpacerModel", SpecSpacerModel);
            SpecOperation = (function () {
                function SpecOperation() {
                }
                SpecOperation.Call = "call";
                SpecOperation.GetList = "getList";
                SpecOperation.GetParam = "getParam";
                SpecOperation.GetVar = "getVar";
                SpecOperation.SetVar = "setVar";
                SpecOperation.ChangeVar = "changeVar";
                SpecOperation.ProcedureDef = "procedureDef";
                SpecOperation.ProcedureDeclaration = "procedureDeclaration";
                SpecOperation.procedure_declaration = "procedure_declatation"; // legacy name has same id as above - bit hacky
                return SpecOperation;
            })();
            exports_1("SpecOperation", SpecOperation);
        }
    }
});
//# sourceMappingURL=spec.model.js.map