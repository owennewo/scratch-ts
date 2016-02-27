import {SpecCategoryModel} from "./spec.category.model";
import {BlockShapeModel} from "./block.shape.model";

export class SpecModel {
    static SPECS: Map<String, SpecModel> = new Map<String, SpecModel>();

    code: string;
    description: string;
    category: SpecCategoryModel;
    shapeType: string;
    defaultArgs: any[];

    constructor(code: string, description: string, category: SpecCategoryModel, shapeType: string, defaultArgs: any[]) {
        this.code = code;
        this.category = category;
        this.description = description;
        this.shapeType = shapeType;
        this.defaultArgs = defaultArgs;
        // this.shape = new BlockShapeModel()
    }

    static initialize() {
        // block specification					type, cat, opcode			default args (optional)
        // MOTION
        let motion = SpecCategoryModel.CATEGORIES.get(1);
        SpecModel.add("move %n steps", " ", SpecCategoryModel.MOTION, "forward:", [10]);
        SpecModel.add("turn @turnRight %n degrees", " ", SpecCategoryModel.MOTION, "turnRight:", [15]);
        SpecModel.add("turn @turnLeft %n degrees", " ", SpecCategoryModel.MOTION, "turnLeft:", [15]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("point in direction %d.direction", " ", SpecCategoryModel.MOTION, "heading:", [90]);
        SpecModel.add("point towards %m.spriteOrMouse", " ", SpecCategoryModel.MOTION, "pointTowards:", []);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("go to x:%n y:%n", " ", SpecCategoryModel.MOTION, "gotoX:y:");
        SpecModel.add("go to %m.spriteOrMouse", " ", SpecCategoryModel.MOTION, "gotoSpriteOrMouse:", ["mouse-pointer"]);
        SpecModel.add("glide %n secs to x:%n y:%n", " ", SpecCategoryModel.MOTION, "glideSecs:toX:y:elapsed:from:");
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("change x by %n", " ", SpecCategoryModel.MOTION, "changeXposBy:", [10]);
        SpecModel.add("set x to %n", " ", SpecCategoryModel.MOTION, "xpos:", [0]);
        SpecModel.add("change y by %n", " ", SpecCategoryModel.MOTION, "changeYposBy:", [10]);
        SpecModel.add("set y to %n", " ", SpecCategoryModel.MOTION, "ypos:", [0]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("if on edge, bounce", " ", SpecCategoryModel.MOTION, "bounceOffEdge");
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 1);
        SpecModel.add("set rotation style %m.rotationStyle", " ", SpecCategoryModel.MOTION, "setRotationStyle", ["left-right"]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("x position", "r", SpecCategoryModel.MOTION, "xpos");
        SpecModel.add("y position", "r", SpecCategoryModel.MOTION, "ypos");
        SpecModel.add("direction", "r", SpecCategoryModel.MOTION, "heading");

        // looks
        SpecModel.add("say %s for %n secs", " ", SpecCategoryModel.LOOKS, "say:duration:elapsed:from:", ["Hello!", 2]);
        SpecModel.add("say %s", " ", SpecCategoryModel.LOOKS, "say:", ["Hello!"]);
        SpecModel.add("think %s for %n secs", " ", SpecCategoryModel.LOOKS, "think:duration:elapsed:from:", ["Hmm...", 2]);
        SpecModel.add("think %s", " ", SpecCategoryModel.LOOKS, "think:", ["Hmm..."]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("show", " ", SpecCategoryModel.LOOKS, "show");
        SpecModel.add("hide", " ", SpecCategoryModel.LOOKS, "hide");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("switch costume to %m.costume", " ", SpecCategoryModel.LOOKS, "lookLike:", ["costume1"]);
        SpecModel.add("next costume", " ", SpecCategoryModel.LOOKS, "nextCostume");
        SpecModel.add("switch backdrop to %m.backdrop", " ", SpecCategoryModel.LOOKS, "startScene", ["backdrop1"]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("change %m.effect effect by %n", " ", SpecCategoryModel.LOOKS, "changeGraphicEffect:by:", ["color", 25]);
        SpecModel.add("set %m.effect effect to %n", " ", SpecCategoryModel.LOOKS, "setGraphicEffect:to:", ["color", 0]);
        SpecModel.add("clear graphic effects", " ", SpecCategoryModel.LOOKS, "filterReset");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("change size by %n", " ", SpecCategoryModel.LOOKS, "changeSizeBy:", [10]);
        SpecModel.add("set size to %n%", " ", SpecCategoryModel.LOOKS, "setSizeTo:", [100]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("go to front", " ", SpecCategoryModel.LOOKS, "comeToFront");
        SpecModel.add("go back %n layers", " ", SpecCategoryModel.LOOKS, "goBackByLayers:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("costume #", "r", SpecCategoryModel.LOOKS, "costumeIndex");
        SpecModel.add("backdrop name", "r", SpecCategoryModel.LOOKS, "sceneName");
        SpecModel.add("size", "r", SpecCategoryModel.LOOKS, "scale");

        // stage looks
        SpecModel.add("switch backdrop to %m.backdrop", " ", SpecCategoryModel.LOOKS_STAGE, "startScene", ["backdrop1"]);
        SpecModel.add("switch backdrop to %m.backdrop and wait", " ", SpecCategoryModel.LOOKS_STAGE, "startSceneAndWait", ["backdrop1"]);
        SpecModel.add("next backdrop", " ", SpecCategoryModel.LOOKS_STAGE, "nextScene");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS_STAGE, 2);
        SpecModel.add("change %m.effect effect by %n", " ", SpecCategoryModel.LOOKS_STAGE, "changeGraphicEffect:by:", ["color", 25]);
        SpecModel.add("set %m.effect effect to %n", " ", SpecCategoryModel.LOOKS_STAGE, "setGraphicEffect:to:", ["color", 0]);
        SpecModel.add("clear graphic effects", " ", SpecCategoryModel.LOOKS_STAGE, "filterReset");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS_STAGE, 1);
        SpecModel.add("backdrop name", "r", SpecCategoryModel.LOOKS_STAGE, "sceneName");
        SpecModel.add("backdrop #", "r", SpecCategoryModel.LOOKS_STAGE, "backgroundIndex");

        // sound
        SpecModel.add("play sound %m.sound", " ", SpecCategoryModel.SOUND, "playSound:", ["pop"]);
        SpecModel.add("play sound %m.sound until done", " ", SpecCategoryModel.SOUND, "doPlaySoundAndWait", ["pop"]);
        SpecModel.add("stop all sounds", " ", SpecCategoryModel.SOUND, "stopAllSounds");
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("play drum %d.drum for %n beats", " ", SpecCategoryModel.SOUND, "playDrum", [1, 0.25]);
        SpecModel.add("rest for %n beats", " ", SpecCategoryModel.SOUND, "rest:elapsed:from:", [0.25]);
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("play note %d.note for %n beats", " ", SpecCategoryModel.SOUND, "noteOn:duration:elapsed:from:", [60, 0.5]);
        SpecModel.add("set instrument to %d.instrument", " ", SpecCategoryModel.SOUND, "instrument:", [1]);

        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("change volume by %n", " ", SpecCategoryModel.SOUND, "changeVolumeBy:", [-10]);
        SpecModel.add("set volume to %n%", " ", SpecCategoryModel.SOUND, "setVolumeTo:", [100]);
        SpecModel.add("volume", "r", SpecCategoryModel.SOUND, "volume");
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("change tempo by %n", " ", SpecCategoryModel.SOUND, "changeTempoBy:", [20]);
        SpecModel.add("set tempo to %n bpm", " ", SpecCategoryModel.SOUND, "setTempoTo:", [60]);
        SpecModel.add("tempo", "r", SpecCategoryModel.SOUND, "tempo");

        // pen
        SpecModel.add("clear", " ", SpecCategoryModel.PEN, "clearPenTrails");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("stamp", " ", SpecCategoryModel.PEN, "stampCostume");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("pen down", " ", SpecCategoryModel.PEN, "putPenDown");
        SpecModel.add("pen up", " ", SpecCategoryModel.PEN, "putPenUp");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("set pen color to %c", " ", SpecCategoryModel.PEN, "penColor:");
        SpecModel.add("change pen color by %n", " ", SpecCategoryModel.PEN, "changePenHueBy:");
        SpecModel.add("set pen color to %n", " ", SpecCategoryModel.PEN, "setPenHueTo:", [0]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("change pen shade by %n", " ", SpecCategoryModel.PEN, "changePenShadeBy:");
        SpecModel.add("set pen shade to %n", " ", SpecCategoryModel.PEN, "setPenShadeTo:", [50]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("change pen size by %n", " ", SpecCategoryModel.PEN, "changePenSizeBy:", [1]);
        SpecModel.add("set pen size to %n", " ", SpecCategoryModel.PEN, "penSize:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);

        // stage pen
        SpecModel.add("clear", " ", SpecCategoryModel.PEN_STAGE, "clearPenTrails");

        // triggers
        SpecModel.add("when @greenFlag clicked", "h", SpecCategoryModel.EVENTS, "whenGreenFlag");
        SpecModel.add("when %m.key key pressed", "h", SpecCategoryModel.EVENTS, "whenKeyPressed", ["space"]);
        SpecModel.add("when this sprite clicked", "h", SpecCategoryModel.EVENTS, "whenClicked");
        SpecModel.add("when backdrop switches to %m.backdrop", "h", SpecCategoryModel.EVENTS, "whenSceneStarts", ["backdrop1"]);
        SpecModel.addSpacer(SpecCategoryModel.EVENTS, 2);
        SpecModel.add("when %m.triggerSensor > %n", "h", SpecCategoryModel.EVENTS, "whenSensorGreaterThan", ["loudness", 10]);
        SpecModel.addSpacer(SpecCategoryModel.EVENTS, 2);
        SpecModel.add("when I receive %m.broadcast", "h", SpecCategoryModel.EVENTS, "whenIReceive");
        SpecModel.add("broadcast %m.broadcast", " ", SpecCategoryModel.EVENTS, "broadcast:");
        SpecModel.add("broadcast %m.broadcast and wait", " ", SpecCategoryModel.EVENTS, "doBroadcastAndWait");

        // control - sprite
        SpecModel.add("wait %n secs", " ", SpecCategoryModel.CONTROL, "wait:elapsed:from:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("repeat %n", "c", SpecCategoryModel.CONTROL, "doRepeat", [10]);
        SpecModel.add("forever", "cf", SpecCategoryModel.CONTROL, "doForever");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("if %b then", "c", SpecCategoryModel.CONTROL, "doIf");
        SpecModel.add("if %b then", "e", SpecCategoryModel.CONTROL, "doIfElse");
        SpecModel.add("wait until %b", " ", SpecCategoryModel.CONTROL, "doWaitUntil");
        SpecModel.add("repeat until %b", "c", SpecCategoryModel.CONTROL, "doUntil");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("stop %m.stop", "f", SpecCategoryModel.CONTROL, "stopScripts", ["all"]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("when I start as a clone", "h", SpecCategoryModel.CONTROL, "whenCloned");
        SpecModel.add("create clone of %m.spriteOnly", " ", SpecCategoryModel.CONTROL, "createCloneOf");
        SpecModel.add("delete this clone", "f", SpecCategoryModel.CONTROL, "deleteClone");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);

        // control - stage
        SpecModel.add("wait %n secs", " ", SpecCategoryModel.CONTROL_STAGE, "wait:elapsed:from:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("repeat %n", "c", SpecCategoryModel.CONTROL_STAGE, "doRepeat", [10]);
        SpecModel.add("forever", "cf", SpecCategoryModel.CONTROL_STAGE, "doForever");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("if %b then", "c", SpecCategoryModel.CONTROL_STAGE, "doIf");
        SpecModel.add("if %b then", "e", SpecCategoryModel.CONTROL_STAGE, "doIfElse");
        SpecModel.add("wait until %b", " ", SpecCategoryModel.CONTROL_STAGE, "doWaitUntil");
        SpecModel.add("repeat until %b", "c", SpecCategoryModel.CONTROL_STAGE, "doUntil");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("stop %m.stop", "f", SpecCategoryModel.CONTROL_STAGE, "stopScripts", ["all"]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("create clone of %m.spriteOnly", " ", SpecCategoryModel.CONTROL_STAGE, "createCloneOf");

        // sensing
        SpecModel.add("touching %m.touching?", "b", SpecCategoryModel.SENSING, "touching:");
        SpecModel.add("touching color %c?", "b", SpecCategoryModel.SENSING, "touchingColor:");
        SpecModel.add("color %c is touching %c?", "b", SpecCategoryModel.SENSING, "color:sees:");
        SpecModel.add("distance to %m.spriteOrMouse", "r", SpecCategoryModel.SENSING, "distanceTo:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("ask %s and wait", " ", SpecCategoryModel.SENSING, "doAsk", ["What's your name?"]);
        SpecModel.add("answer", "r", SpecCategoryModel.SENSING, "answer");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("key %m.key pressed?", "b", SpecCategoryModel.SENSING, "keyPressed:", ["space"]);
        SpecModel.add("mouse down?", "b", SpecCategoryModel.SENSING, "mousePressed");
        SpecModel.add("mouse x", "r", SpecCategoryModel.SENSING, "mouseX");
        SpecModel.add("mouse y", "r", SpecCategoryModel.SENSING, "mouseY");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("loudness", "r", SpecCategoryModel.SENSING, "soundLevel");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("video %m.videoMotionType on %m.stageOrThis", "r", SpecCategoryModel.SENSING, "senseVideoMotion", ["motion"]);
        SpecModel.add("turn video %m.videoState", " ", SpecCategoryModel.SENSING, "setVideoState", ["on"]);
        SpecModel.add("set video transparency to %n%", " ", SpecCategoryModel.SENSING, "setVideoTransparency", [50]);
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("timer", "r", SpecCategoryModel.SENSING, "timer");
        SpecModel.add("reset timer", " ", SpecCategoryModel.SENSING, "timerReset");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("%m.attribute of %m.spriteOrStage", "r", SpecCategoryModel.SENSING, "getAttribute:of:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("current %m.timeAndDate", "r", SpecCategoryModel.SENSING, "timeAndDate", ["minute"]);
        SpecModel.add("days since 2000", "r", SpecCategoryModel.SENSING, "timestamp");
        SpecModel.add("username", "r", SpecCategoryModel.SENSING, "getUserName");

        // stage sensing
        SpecModel.add("ask %s and wait", " ", SpecCategoryModel.SENSING_STAGE, "doAsk", ["What's your name?"]);
        SpecModel.add("answer", "r", SpecCategoryModel.SENSING_STAGE, "answer");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("key %m.key pressed?", "b", SpecCategoryModel.SENSING_STAGE, "keyPressed:", ["space"]);
        SpecModel.add("mouse down?", "b", SpecCategoryModel.SENSING_STAGE, "mousePressed");
        SpecModel.add("mouse x", "r", SpecCategoryModel.SENSING_STAGE, "mouseX");
        SpecModel.add("mouse y", "r", SpecCategoryModel.SENSING_STAGE, "mouseY");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("loudness", "r", SpecCategoryModel.SENSING_STAGE, "soundLevel");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("video %m.videoMotionType on %m.stageOrThis", "r", SpecCategoryModel.SENSING_STAGE, "senseVideoMotion", ["motion", "Stage"]);
        SpecModel.add("turn video %m.videoState", " ", SpecCategoryModel.SENSING_STAGE, "setVideoState", ["on"]);
        SpecModel.add("set video transparency to %n%", " ", SpecCategoryModel.SENSING_STAGE, "setVideoTransparency", [50]);
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("timer", "r", SpecCategoryModel.SENSING_STAGE, "timer");
        SpecModel.add("reset timer", " ", SpecCategoryModel.SENSING_STAGE, "timerReset");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("%m.attribute of %m.spriteOrStage", "r", SpecCategoryModel.SENSING_STAGE, "getAttribute:of:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("current %m.timeAndDate", "r", SpecCategoryModel.SENSING_STAGE, "timeAndDate", ["minute"]);
        SpecModel.add("days since 2000", "r", SpecCategoryModel.SENSING_STAGE, "timestamp");
        SpecModel.add("username", "r", SpecCategoryModel.SENSING_STAGE, "getUserName");

        // operators
        SpecModel.add("%n + %n", "r", SpecCategoryModel.OPERATORS, "+");
        SpecModel.add("%n - %n", "r", SpecCategoryModel.OPERATORS, "-");
        SpecModel.add("%n * %n", "r", SpecCategoryModel.OPERATORS, "*");
        SpecModel.add("%n / %n", "r", SpecCategoryModel.OPERATORS, "/");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("pick random %n to %n", "r", SpecCategoryModel.OPERATORS, "randomFrom:to:");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%s < %s", "b", SpecCategoryModel.OPERATORS, "<");
        SpecModel.add("%s = %s", "b", SpecCategoryModel.OPERATORS, "=");
        SpecModel.add("%s > %s", "b", SpecCategoryModel.OPERATORS, ">");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%b and %b", "b", SpecCategoryModel.OPERATORS, "&");
        SpecModel.add("%b or %b", "b", SpecCategoryModel.OPERATORS, "|");
        SpecModel.add("not %b", "b", SpecCategoryModel.OPERATORS, "not");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("join %s %s", "r", SpecCategoryModel.OPERATORS, "concatenate:with:", ["hello ", "world"]);
        SpecModel.add("letter %n of %s", "r", SpecCategoryModel.OPERATORS, "letter:of:", [1, "world"]);
        SpecModel.add("length of %s", "r", SpecCategoryModel.OPERATORS, "stringLength:", ["world"]);
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%n mod %n", "r", SpecCategoryModel.OPERATORS, "%");
        SpecModel.add("round %n", "r", SpecCategoryModel.OPERATORS, "rounded");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%m.mathOp of %n", "r", SpecCategoryModel.OPERATORS, "computeFunction:of:", ["sqrt", 9]);

        // variables
        SpecModel.add("set %m.var to %s", " ", SpecCategoryModel.OPERATORS, "setVar:to:");
        SpecModel.add("change %m.var by %n", " ", SpecCategoryModel.OPERATORS, "changeVar:by:");
        SpecModel.add("show variable %m.var", " ", SpecCategoryModel.OPERATORS, "showVariable:");
        SpecModel.add("hide variable %m.var", " ", SpecCategoryModel.OPERATORS, "hideVariable:");

        // LIST
        SpecModel.add("add %s to %m.list", " ", SpecCategoryModel.LIST, "append:toList:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("delete %d.listDeleteItem of %m.list", " ", SpecCategoryModel.LIST, "deleteLine:ofList:");
        SpecModel.add("insert %s at %d.listItem of %m.list", " ", SpecCategoryModel.LIST, "insert:at:ofList:");
        SpecModel.add("replace item %d.listItem of %m.list with %s", " ", SpecCategoryModel.LIST, "setLine:ofList:to:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("item %d.listItem of %m.list", "r", SpecCategoryModel.LIST, "getLine:ofList:");
        SpecModel.add("length of %m.list", "r", SpecCategoryModel.LIST, "lineCountOfList:");
        SpecModel.add("%m.list contains %s?", "b", SpecCategoryModel.LIST, "list:contains:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("show list %m.list", " ", SpecCategoryModel.LIST, "showList:");
        SpecModel.add("hide list %m.list", " ", SpecCategoryModel.LIST, "hideList:");

        // obsolete blocks from Scratch 1.4 that may be used in older projects
        SpecModel.add("play drum %n for %n beats", " ", SpecCategoryModel.OLD, "drum:duration:elapsed:from:", [1, 0.25]); // Scratch 1.4 MIDI drum
        SpecModel.add("set instrument to %n", " ", SpecCategoryModel.OLD, "midiInstrument:", [1]);
        SpecModel.add("loud?", "b", SpecCategoryModel.OLD, "isLoud");

        // obsolete blocks from Scratch 1.4 that are converted to new forms (so should never appear):
        SpecModel.add("abs %n", "r", SpecCategoryModel.OLD, "abs");
        SpecModel.add("sqrt %n", "r", SpecCategoryModel.OLD, "sqrt");
        SpecModel.add("stop script", "f", SpecCategoryModel.OLD, "doReturn");
        SpecModel.add("stop all", "f", SpecCategoryModel.OLD, "stopAll");
        SpecModel.add("switch to background %m.costume", " ", SpecCategoryModel.OLD, "showBackground:", ["backdrop1"]);
        SpecModel.add("next background", " ", SpecCategoryModel.OLD, "nextBackground");
        SpecModel.add("forever if %b", "cf", SpecCategoryModel.OLD, "doForeverIf");

        // testing and experimental control prims
        SpecModel.add("noop", "r", SpecCategoryModel.BETA, "COUNT");
        SpecModel.add("counter", "r", SpecCategoryModel.BETA, "COUNT");
        SpecModel.add("clear counter", " ", SpecCategoryModel.BETA, "CLR_COUNT");
        SpecModel.add("incr counter", " ", SpecCategoryModel.BETA, "INCR_COUNT");
        SpecModel.add("for each %m.varName in %s", "c", SpecCategoryModel.BETA, "doForLoop", ["v", 10]);
        SpecModel.add("while %b", "c", SpecCategoryModel.BETA, "doWhile");
        SpecModel.add("all at once", "c", SpecCategoryModel.BETA, "warpSpeed");

        // stage motion (scrolling)
        SpecModel.add("scroll right %n", " ", SpecCategoryModel.BETA, "scrollRight", [10]);
        SpecModel.add("scroll up %n", " ", SpecCategoryModel.BETA, "scrollUp", [10]);
        SpecModel.add("align scene %m.scrollAlign", " ", SpecCategoryModel.BETA, "scrollAlign", ["bottom-left"]);
        SpecModel.add("x scroll", "r", SpecCategoryModel.BETA, "xScroll");
        SpecModel.add("y scroll", "r", SpecCategoryModel.BETA, "yScroll");

        // other obsolete blocks from alpha/beta
        SpecModel.add("hide all sprites", " ", SpecCategoryModel.BETA, "hideAll");
        SpecModel.add("user id", "r", SpecCategoryModel.BETA, "getUserId");

    }


    static add(description: string, type: string, category: SpecCategoryModel, code: string, defaultArgs?: any[]) {
        let spec = new SpecModel(code, description, category, type, defaultArgs);
        // spec.prepareShape(spec, type);
        category.addSpec(spec);
        SpecModel.SPECS.set(spec.code, spec);
    }



    static addSpacer(category: SpecCategoryModel, spaces: number) {
        let spec = new SpecSpacerModel(category, spaces);
        category.addSpec(spec);
    }


    // public static extensionSpecs:anySpecModel.add(] = SpecModel.add("when %m.booleanSensor", "when %m.sensor %m.lessMore %n", "sensor %m.booleanSensor?", "%m.sensor sensor value", "turn %m.motor on for %n secs", "turn %m.motor on", "turn %m.motor off", "set %m.motor power to %n", "set %m.motor2 direction to %m.motorDirection", "when distance %m.lessMore %n", "when tilt %m.eNe %n", "distance", "tilt"];

}

export class SpecSpacerModel extends SpecModel {
    constructor(category: SpecCategoryModel, spaces: number) {
        super("spacer", "this will be used as spacer between real specs", category, "", [spaces]);
    }
}

export class SpecOperation {
  static Call = "call";
  static GetList = "getList";
  static GetParam = "getParam";
  static GetVar = "getVar";
  static SetVar = "setVar";
  static ChangeVar = "changeVar";
  static ProcedureDef = "procedureDef";
  static ProcedureDeclaration = "procedureDeclaration";
  static procedure_declaration = "procedure_declatation";  // legacy name has same id as above - bit hacky
}
