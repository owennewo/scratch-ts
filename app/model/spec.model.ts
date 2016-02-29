import {SpecCategoryModel} from "./spec.category.model";
import {BlockShapeModel} from "./block.shape.model";

export class SpecModel {
    static SPECS: Map<String, SpecModel> = new Map<String, SpecModel>();

    code: string;
    label: string;
    argCount: number;
    category: SpecCategoryModel;
    shapeType: string;
    defaultArgs: any[];

    constructor(code: string, label: string, argCount: number, category: SpecCategoryModel, shapeType: string, defaultArgs: any[]) {
        this.code = code;
        this.category = category;
        this.label = label;
        this.argCount = argCount;
        this.shapeType = shapeType;
        this.defaultArgs = defaultArgs;
        // this.shape = new BlockShapeModel()
    }

    static initialize() {
        // block specification					type, cat, opcode			default args (optional)
        // MOTION
        let motion = SpecCategoryModel.CATEGORIES.get(1);
        SpecModel.add("move %n steps", 1, " ", SpecCategoryModel.MOTION, "forward:", [10]);
        SpecModel.add("turn @turnRight %n degrees", 1, " ", SpecCategoryModel.MOTION, "turnRight:", [15]);
        SpecModel.add("turn @turnLeft %n degrees", 1, " ", SpecCategoryModel.MOTION, "turnLeft:", [15]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("point in direction %d.direction", 1, " ", SpecCategoryModel.MOTION, "heading:", [90]);
        SpecModel.add("point towards %m.spriteOrMouse", 1, " ", SpecCategoryModel.MOTION, "pointTowards:", []);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("go to x:%n y:%n", 2, " ", SpecCategoryModel.MOTION, "gotoX:y:");
        SpecModel.add("go to %m.spriteOrMouse", 1, " ", SpecCategoryModel.MOTION, "gotoSpriteOrMouse:", ["mouse-pointer"]);
        SpecModel.add("glide %n secs to x:%n y:%n", 3, " ", SpecCategoryModel.MOTION, "glideSecs:toX:y:elapsed:from:");
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("change x by %n", 1, " ", SpecCategoryModel.MOTION, "changeXposBy:", [10]);
        SpecModel.add("set x to %n", 1, " ", SpecCategoryModel.MOTION, "xpos:", [0]);
        SpecModel.add("change y by %n", 1, " ", SpecCategoryModel.MOTION, "changeYposBy:", [10]);
        SpecModel.add("set y to %n", 1, " ", SpecCategoryModel.MOTION, "ypos:", [0]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("if on edge, bounce", 0, " ", SpecCategoryModel.MOTION, "bounceOffEdge");
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 1);
        SpecModel.add("set rotation style %m.rotationStyle", 1, " ", SpecCategoryModel.MOTION, "setRotationStyle", ["left-right"]);
        SpecModel.addSpacer(SpecCategoryModel.MOTION, 2);
        SpecModel.add("x position", 0, "r", SpecCategoryModel.MOTION, "xpos");
        SpecModel.add("y position", 0, "r", SpecCategoryModel.MOTION, "ypos");
        SpecModel.add("direction", 0, "r", SpecCategoryModel.MOTION, "heading");

        // looks
        SpecModel.add("say %s for %n secs", 2, " ", SpecCategoryModel.LOOKS, "say:duration:elapsed:from:", ["Hello!", 2]);
        SpecModel.add("say %s", 1, " ", SpecCategoryModel.LOOKS, "say:", ["Hello!"]);
        SpecModel.add("think %s for %n secs", 2, " ", SpecCategoryModel.LOOKS, "think:duration:elapsed:from:", ["Hmm...", 2]);
        SpecModel.add("think %s", 1, " ", SpecCategoryModel.LOOKS, "think:", ["Hmm..."]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("show", 0, " ", SpecCategoryModel.LOOKS, "show");
        SpecModel.add("hide", 0, " ", SpecCategoryModel.LOOKS, "hide");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("switch costume to %m.costume", 1, " ", SpecCategoryModel.LOOKS, "lookLike:", ["costume1"]);
        SpecModel.add("next costume", 0, " ", SpecCategoryModel.LOOKS, "nextCostume");
        SpecModel.add("switch backdrop to %m.backdrop", 1, " ", SpecCategoryModel.LOOKS, "startScene", ["backdrop1"]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("change %m.effect effect by %n", 2, " ", SpecCategoryModel.LOOKS, "changeGraphicEffect:by:", ["color", 25]);
        SpecModel.add("set %m.effect effect to %n", 2, " ", SpecCategoryModel.LOOKS, "setGraphicEffect:to:", ["color", 0]);
        SpecModel.add("clear graphic effects", 0, " ", SpecCategoryModel.LOOKS, "filterReset");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("change size by %n", 1, " ", SpecCategoryModel.LOOKS, "changeSizeBy:", [10]);
        SpecModel.add("set size to %n%", 1, " ", SpecCategoryModel.LOOKS, "setSizeTo:", [100]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("go to front", 0, " ", SpecCategoryModel.LOOKS, "comeToFront");
        SpecModel.add("go back %n layers", 1, " ", SpecCategoryModel.LOOKS, "goBackByLayers:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.LOOKS, 1);
        SpecModel.add("costume #", 0, "r", SpecCategoryModel.LOOKS, "costumeIndex");
        SpecModel.add("backdrop name", 0, "r", SpecCategoryModel.LOOKS, "sceneName");
        SpecModel.add("size", 0, "r", SpecCategoryModel.LOOKS, "scale");

        // stage looks
        SpecModel.add("switch backdrop to %m.backdrop", 1, " ", SpecCategoryModel.LOOKS_STAGE, "startScene", ["backdrop1"]);
        SpecModel.add("switch backdrop to %m.backdrop and wait", 1, " ", SpecCategoryModel.LOOKS_STAGE, "startSceneAndWait", ["backdrop1"]);
        SpecModel.add("next backdrop", 0, " ", SpecCategoryModel.LOOKS_STAGE, "nextScene");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS_STAGE, 2);
        SpecModel.add("change %m.effect effect by %n", 2, " ", SpecCategoryModel.LOOKS_STAGE, "changeGraphicEffect:by:", ["color", 25]);
        SpecModel.add("set %m.effect effect to %n", 2, " ", SpecCategoryModel.LOOKS_STAGE, "setGraphicEffect:to:", ["color", 0]);
        SpecModel.add("clear graphic effects", 0, " ", SpecCategoryModel.LOOKS_STAGE, "filterReset");
        SpecModel.addSpacer(SpecCategoryModel.LOOKS_STAGE, 1);
        SpecModel.add("backdrop name", 0, "r", SpecCategoryModel.LOOKS_STAGE, "sceneName");
        SpecModel.add("backdrop #", 0, "r", SpecCategoryModel.LOOKS_STAGE, "backgroundIndex");

        // sound
        SpecModel.add("play sound %m.sound", 1, " ", SpecCategoryModel.SOUND, "playSound:", ["pop"]);
        SpecModel.add("play sound %m.sound until done", 1, " ", SpecCategoryModel.SOUND, "doPlaySoundAndWait", ["pop"]);
        SpecModel.add("stop all sounds", 0, " ", SpecCategoryModel.SOUND, "stopAllSounds");
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("play drum %d.drum for %n beats", 2, " ", SpecCategoryModel.SOUND, "playDrum", [1, 0.25]);
        SpecModel.add("rest for %n beats", 1, " ", SpecCategoryModel.SOUND, "rest:elapsed:from:", [0.25]);
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("play note %d.note for %n beats", 2, " ", SpecCategoryModel.SOUND, "noteOn:duration:elapsed:from:", [60, 0.5]);
        SpecModel.add("set instrument to %d.instrument", 1, " ", SpecCategoryModel.SOUND, "instrument:", [1]);

        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("change volume by %n", 1, " ", SpecCategoryModel.SOUND, "changeVolumeBy:", [-10]);
        SpecModel.add("set volume to %n%", 1, " ", SpecCategoryModel.SOUND, "setVolumeTo:", [100]);
        SpecModel.add("volume", 0, "r", SpecCategoryModel.SOUND, "volume");
        SpecModel.addSpacer(SpecCategoryModel.SOUND, 1);
        SpecModel.add("change tempo by %n", 1, " ", SpecCategoryModel.SOUND, "changeTempoBy:", [20]);
        SpecModel.add("set tempo to %n bpm", 1, " ", SpecCategoryModel.SOUND, "setTempoTo:", [60]);
        SpecModel.add("tempo", 0, "r", SpecCategoryModel.SOUND, "tempo");

        // pen
        SpecModel.add("clear", 0, " ", SpecCategoryModel.PEN, "clearPenTrails");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("stamp", 0, " ", SpecCategoryModel.PEN, "stampCostume");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("pen down", 0, " ", SpecCategoryModel.PEN, "putPenDown");
        SpecModel.add("pen up", 0, " ", SpecCategoryModel.PEN, "putPenUp");
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("set pen color to %c", 1, " ", SpecCategoryModel.PEN, "penColor:");
        SpecModel.add("change pen color by %n", 1, " ", SpecCategoryModel.PEN, "changePenHueBy:");
        SpecModel.add("set pen color to %n", 1, " ", SpecCategoryModel.PEN, "setPenHueTo:", [0]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("change pen shade by %n", 1, " ", SpecCategoryModel.PEN, "changePenShadeBy:");
        SpecModel.add("set pen shade to %n", 1, " ", SpecCategoryModel.PEN, "setPenShadeTo:", [50]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);
        SpecModel.add("change pen size by %n", 1, " ", SpecCategoryModel.PEN, "changePenSizeBy:", [1]);
        SpecModel.add("set pen size to %n", 1, " ", SpecCategoryModel.PEN, "penSize:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.PEN, 1);

        // stage pen
        SpecModel.add("clear", 0, " ", SpecCategoryModel.PEN_STAGE, "clearPenTrails");

        // triggers
        SpecModel.add("when @greenFlag clicked", 0, "h", SpecCategoryModel.EVENTS, "whenGreenFlag");
        SpecModel.add("when %m.key key pressed", 1, "h", SpecCategoryModel.EVENTS, "whenKeyPressed", ["space"]);
        SpecModel.add("when this sprite clicked", 0, "h", SpecCategoryModel.EVENTS, "whenClicked");
        SpecModel.add("when backdrop switches to %m.backdrop", 1, "h", SpecCategoryModel.EVENTS, "whenSceneStarts", ["backdrop1"]);
        SpecModel.addSpacer(SpecCategoryModel.EVENTS, 2);
        SpecModel.add("when %m.triggerSensor > %n", 2, "h", SpecCategoryModel.EVENTS, "whenSensorGreaterThan", ["loudness", 10]);
        SpecModel.addSpacer(SpecCategoryModel.EVENTS, 2);
        SpecModel.add("when I receive %m.broadcast", 1, "h", SpecCategoryModel.EVENTS, "whenIReceive");
        SpecModel.add("broadcast %m.broadcast", 1, " ", SpecCategoryModel.EVENTS, "broadcast:");
        SpecModel.add("broadcast %m.broadcast and wait", 1, " ", SpecCategoryModel.EVENTS, "doBroadcastAndWait");

        // control - sprite
        SpecModel.add("wait %n secs", 1, " ", SpecCategoryModel.CONTROL, "wait:elapsed:from:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("repeat %n", 1, "c", SpecCategoryModel.CONTROL, "doRepeat", [10]);
        SpecModel.add("forever", 0, "cf", SpecCategoryModel.CONTROL, "doForever");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("if %b then", 1, "c", SpecCategoryModel.CONTROL, "doIf");
        SpecModel.add("if %b then", 1, "e", SpecCategoryModel.CONTROL, "doIfElse");
        SpecModel.add("wait until %b", 1, " ", SpecCategoryModel.CONTROL, "doWaitUntil");
        SpecModel.add("repeat until %b", 1, "c", SpecCategoryModel.CONTROL, "doUntil");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("stop %m.stop", 1, "f", SpecCategoryModel.CONTROL, "stopScripts", ["all"]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);
        SpecModel.add("when I start as a clone", 0, "h", SpecCategoryModel.CONTROL, "whenCloned");
        SpecModel.add("create clone of %m.spriteOnly", 1, " ", SpecCategoryModel.CONTROL, "createCloneOf");
        SpecModel.add("delete this clone", 0, "f", SpecCategoryModel.CONTROL, "deleteClone");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL, 1);

        // control - stage
        SpecModel.add("wait %n secs", 1, " ", SpecCategoryModel.CONTROL_STAGE, "wait:elapsed:from:", [1]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("repeat %n", 1, "c", SpecCategoryModel.CONTROL_STAGE, "doRepeat", [10]);
        SpecModel.add("forever", 1, "cf", SpecCategoryModel.CONTROL_STAGE, "doForever");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("if %b then", 1, "c", SpecCategoryModel.CONTROL_STAGE, "doIf");
        SpecModel.add("if %b then", 1, "e", SpecCategoryModel.CONTROL_STAGE, "doIfElse");
        SpecModel.add("wait until %b", 1, " ", SpecCategoryModel.CONTROL_STAGE, "doWaitUntil");
        SpecModel.add("repeat until %b", 1, "c", SpecCategoryModel.CONTROL_STAGE, "doUntil");
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("stop %m.stop", 1, "f", SpecCategoryModel.CONTROL_STAGE, "stopScripts", ["all"]);
        SpecModel.addSpacer(SpecCategoryModel.CONTROL_STAGE, 1);
        SpecModel.add("create clone of %m.spriteOnly", 1, " ", SpecCategoryModel.CONTROL_STAGE, "createCloneOf");

        // sensing
        SpecModel.add("touching %m.touching?", 1, "b", SpecCategoryModel.SENSING, "touching:");
        SpecModel.add("touching color %c?", 1, "b", SpecCategoryModel.SENSING, "touchingColor:");
        SpecModel.add("color %c is touching %c?", 1, "b", SpecCategoryModel.SENSING, "color:sees:");
        SpecModel.add("distance to %m.spriteOrMouse", 1, "r", SpecCategoryModel.SENSING, "distanceTo:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("ask %s and wait", 1, " ", SpecCategoryModel.SENSING, "doAsk", ["What's your name?"]);
        SpecModel.add("answer", 0, "r", SpecCategoryModel.SENSING, "answer");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("key %m.key pressed?", 1, "b", SpecCategoryModel.SENSING, "keyPressed:", ["space"]);
        SpecModel.add("mouse down?", 0, "b", SpecCategoryModel.SENSING, "mousePressed");
        SpecModel.add("mouse x", 0, "r", SpecCategoryModel.SENSING, "mouseX");
        SpecModel.add("mouse y", 0, "r", SpecCategoryModel.SENSING, "mouseY");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("loudness", 0, "r", SpecCategoryModel.SENSING, "soundLevel");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("video %m.videoMotionType on %m.stageOrThis", 2, "r", SpecCategoryModel.SENSING, "senseVideoMotion", ["motion"]);
        SpecModel.add("turn video %m.videoState", 1, " ", SpecCategoryModel.SENSING, "setVideoState", ["on"]);
        SpecModel.add("set video transparency to %n%", 1, " ", SpecCategoryModel.SENSING, "setVideoTransparency", [50]);
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("timer", 0, "r", SpecCategoryModel.SENSING, "timer");
        SpecModel.add("reset timer", 0, " ", SpecCategoryModel.SENSING, "timerReset");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("%m.attribute of %m.spriteOrStage", 2, "r", SpecCategoryModel.SENSING, "getAttribute:of:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING, 1);
        SpecModel.add("current %m.timeAndDate", 1, "r", SpecCategoryModel.SENSING, "timeAndDate", ["minute"]);
        SpecModel.add("days since 2000", 0, "r", SpecCategoryModel.SENSING, "timestamp");
        SpecModel.add("username", 0, "r", SpecCategoryModel.SENSING, "getUserName");

        // stage sensing
        SpecModel.add("ask %s and wait", 1, " ", SpecCategoryModel.SENSING_STAGE, "doAsk", ["What's your name?"]);
        SpecModel.add("answer", 0, "r", SpecCategoryModel.SENSING_STAGE, "answer");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("key %m.key pressed?", 1, "b", SpecCategoryModel.SENSING_STAGE, "keyPressed:", ["space"]);
        SpecModel.add("mouse down?", 0, "b", SpecCategoryModel.SENSING_STAGE, "mousePressed");
        SpecModel.add("mouse x", 0, "r", SpecCategoryModel.SENSING_STAGE, "mouseX");
        SpecModel.add("mouse y", 0, "r", SpecCategoryModel.SENSING_STAGE, "mouseY");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("loudness", 0, "r", SpecCategoryModel.SENSING_STAGE, "soundLevel");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("video %m.videoMotionType on %m.stageOrThis", 2, "r", SpecCategoryModel.SENSING_STAGE, "senseVideoMotion", ["motion", "Stage"]);
        SpecModel.add("turn video %m.videoState", 1, " ", SpecCategoryModel.SENSING_STAGE, "setVideoState", ["on"]);
        SpecModel.add("set video transparency to %n%", 1, " ", SpecCategoryModel.SENSING_STAGE, "setVideoTransparency", [50]);
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("timer", 0, "r", SpecCategoryModel.SENSING_STAGE, "timer");
        SpecModel.add("reset timer", 0, " ", SpecCategoryModel.SENSING_STAGE, "timerReset");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("%m.attribute of %m.spriteOrStage", 2, "r", SpecCategoryModel.SENSING_STAGE, "getAttribute:of:");
        SpecModel.addSpacer(SpecCategoryModel.SENSING_STAGE, 1);
        SpecModel.add("current %m.timeAndDate", 1, "r", SpecCategoryModel.SENSING_STAGE, "timeAndDate", ["minute"]);
        SpecModel.add("days since 2000", 0, "r", SpecCategoryModel.SENSING_STAGE, "timestamp");
        SpecModel.add("username", 0, "r", SpecCategoryModel.SENSING_STAGE, "getUserName");

        // operators
        SpecModel.add("%n + %n", 2, "r", SpecCategoryModel.OPERATORS, "+");
        SpecModel.add("%n - %n", 2, "r", SpecCategoryModel.OPERATORS, "-");
        SpecModel.add("%n * %n", 2, "r", SpecCategoryModel.OPERATORS, "*");
        SpecModel.add("%n / %n", 2, "r", SpecCategoryModel.OPERATORS, "/");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("pick random %n to %n", 2, "r", SpecCategoryModel.OPERATORS, "randomFrom:to:");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%s < %s", 2, "b", SpecCategoryModel.OPERATORS, "<");
        SpecModel.add("%s = %s", 2, "b", SpecCategoryModel.OPERATORS, "=");
        SpecModel.add("%s > %s", 2, "b", SpecCategoryModel.OPERATORS, ">");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%b and %b", 2, "b", SpecCategoryModel.OPERATORS, "&");
        SpecModel.add("%b or %b", 2, "b", SpecCategoryModel.OPERATORS, "|");
        SpecModel.add("not %b", 1, "b", SpecCategoryModel.OPERATORS, "not");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("join %s %s", 2, "r", SpecCategoryModel.OPERATORS, "concatenate:with:", ["hello ", "world"]);
        SpecModel.add("letter %n of %s", 2, "r", SpecCategoryModel.OPERATORS, "letter:of:", [1, "world"]);
        SpecModel.add("length of %s", 1, "r", SpecCategoryModel.OPERATORS, "stringLength:", ["world"]);
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%n mod %n", 2, "r", SpecCategoryModel.OPERATORS, "%");
        SpecModel.add("round %n", 1, "r", SpecCategoryModel.OPERATORS, "rounded");
        SpecModel.addSpacer(SpecCategoryModel.OPERATORS, 1);
        SpecModel.add("%m.mathOp of %n", 2, "r", SpecCategoryModel.OPERATORS, "computeFunction:of:", ["sqrt", 9]);

        // variables
        SpecModel.add("set %m.var to %s", 2, " ", SpecCategoryModel.OPERATORS, "setVar:to:");
        SpecModel.add("change %m.var by %n", 2, " ", SpecCategoryModel.OPERATORS, "changeVar:by:");
        SpecModel.add("show variable %m.var", 1, " ", SpecCategoryModel.OPERATORS, "showVariable:");
        SpecModel.add("hide variable %m.var", 1, " ", SpecCategoryModel.OPERATORS, "hideVariable:");

        // LIST
        SpecModel.add("add %s to %m.list", 2, " ", SpecCategoryModel.LIST, "append:toList:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("delete %d.listDeleteItem of %m.list", 2, " ", SpecCategoryModel.LIST, "deleteLine:ofList:");
        SpecModel.add("insert %s at %d.listItem of %m.list", 3, " ", SpecCategoryModel.LIST, "insert:at:ofList:");
        SpecModel.add("replace item %d.listItem of %m.list with %s", 3, " ", SpecCategoryModel.LIST, "setLine:ofList:to:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("item %d.listItem of %m.list", 2, "r", SpecCategoryModel.LIST, "getLine:ofList:");
        SpecModel.add("length of %m.list", 1, "r", SpecCategoryModel.LIST, "lineCountOfList:");
        SpecModel.add("%m.list contains %s?", 2, "b", SpecCategoryModel.LIST, "list:contains:");
        SpecModel.addSpacer(SpecCategoryModel.LIST, 1);
        SpecModel.add("show list %m.list", 1, " ", SpecCategoryModel.LIST, "showList:");
        SpecModel.add("hide list %m.list", 2, " ", SpecCategoryModel.LIST, "hideList:");

        // obsolete blocks from Scratch 1.4 that may be used in older projects
        SpecModel.add("play drum %n for %n beats", 2, " ", SpecCategoryModel.OLD, "drum:duration:elapsed:from:", [1, 0.25]); // Scratch 1.4 MIDI drum
        SpecModel.add("set instrument to %n", 1, " ", SpecCategoryModel.OLD, "midiInstrument:", [1]);
        SpecModel.add("loud?", 0, "b", SpecCategoryModel.OLD, "isLoud");

        // obsolete blocks from Scratch 1.4 that are converted to new forms (so should never appear):
        SpecModel.add("abs %n", 1, "r", SpecCategoryModel.OLD, "abs");
        SpecModel.add("sqrt %n", 1, "r", SpecCategoryModel.OLD, "sqrt");
        SpecModel.add("stop script", 0, "f", SpecCategoryModel.OLD, "doReturn");
        SpecModel.add("stop all", 0, "f", SpecCategoryModel.OLD, "stopAll");
        SpecModel.add("switch to background %m.costume", 1, " ", SpecCategoryModel.OLD, "showBackground:", ["backdrop1"]);
        SpecModel.add("next background", 0, " ", SpecCategoryModel.OLD, "nextBackground");
        SpecModel.add("forever if %b", 1, "cf", SpecCategoryModel.OLD, "doForeverIf");

        // testing and experimental control prims
        SpecModel.add("noop", 0, "r", SpecCategoryModel.BETA, "COUNT");
        SpecModel.add("counter", 0, "r", SpecCategoryModel.BETA, "COUNT");
        SpecModel.add("clear counter", 0, " ", SpecCategoryModel.BETA, "CLR_COUNT");
        SpecModel.add("incr counter", 0, " ", SpecCategoryModel.BETA, "INCR_COUNT");
        SpecModel.add("for each %m.varName in %s", 2, "c", SpecCategoryModel.BETA, "doForLoop", ["v", 10]);
        SpecModel.add("while %b", 1, "c", SpecCategoryModel.BETA, "doWhile");
        SpecModel.add("all at once", 0, "c", SpecCategoryModel.BETA, "warpSpeed");

        // stage motion (scrolling)
        SpecModel.add("scroll right %n", 1, " ", SpecCategoryModel.BETA, "scrollRight", [10]);
        SpecModel.add("scroll up %n", 1, " ", SpecCategoryModel.BETA, "scrollUp", [10]);
        SpecModel.add("align scene %m.scrollAlign", 1, " ", SpecCategoryModel.BETA, "scrollAlign", ["bottom-left"]);
        SpecModel.add("x scroll", 0, "r", SpecCategoryModel.BETA, "xScroll");
        SpecModel.add("y scroll", 0, "r", SpecCategoryModel.BETA, "yScroll");

        // other obsolete blocks from alpha/beta
        SpecModel.add("hide all sprites", 0, " ", SpecCategoryModel.BETA, "hideAll");
        SpecModel.add("user id", 0, "r", SpecCategoryModel.BETA, "getUserId");

    }


    static add(label: string, argCount: number, type: string, category: SpecCategoryModel, code: string, defaultArgs?: any[]) {
        let spec = new SpecModel(code, label, argCount, category, type, defaultArgs);
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
        super("spacer", "this will be used as spacer between real specs", 0, category, "", [spaces]);
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
