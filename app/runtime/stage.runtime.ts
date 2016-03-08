import {ScriptModel} from "../model/script.model";
import {ObjectModel} from "../model/object.model";
import {BlockModel} from "../model/block.model";
import {StageModel} from "../model/stage.model";
import {VideoMotionPrims} from "./primitives/video.motion.prims";
import {Interpreter} from "./interpreter";
import {ObjectRuntime} from "./object.runtime";
import {SpriteModel} from "../model/sprite.model";

export class StageRuntime extends ObjectRuntime {

    penActivity: boolean = false;
    currentDoObject: ObjectModel;
    editMode: boolean;
    frameRate: number = 30;
    keyIsDown: any[] = new Array(128); // records key up/down state
    shiftIsDown: boolean;

    private interp: Interpreter;
    private motionDetector: VideoMotionPrims;
    private stage: StageModel;
    private timerBase: number;
    private edgeTriggersEnabled: boolean = false; // initially false, becomes true when project first run
    private triggeredHats: any[] = [];


    constructor(stage: StageModel) {
        super();
        this.stage = stage;
        this.interp = new Interpreter(stage);
    }

    step() {
        console.log("todo: StageRuntime step");
    }

    countdown(count: number) {
        console.log("todo: StageRuntime countdown");
    }

    deleteClones() {
        console.log("todo: deleteClones");
    }

    clearFilters() {
        console.log("todo: clear filters");
    }

    commitPenStrokes() {
        console.log("todo: commit pen strokes");
    }

    clearPenStrokes() {
        console.log("todo: clear pen strokes");
    }

    mouseX(): number {
        console.log("todo: get mousex");
        return -1;
    }

    mouseY(): number {
        console.log("todo: getMouseY");
        return -1;
    }

    stampSprite(sprite: SpriteModel, alpha: number) {
        console.log("todo: stampSprite");
    }

    public startGreenFlags(firstTime: boolean = false): void {
        function startIfGreenFlag(stack: BlockModel, target: ObjectModel): void {
            if (stack.spec.code === "whenGreenFlag") this.interp.toggleThread(stack, target);
        }
        this.stopAll();

        // if (firstTime && this.app.stage.info.videoOn) {
        //     // turn on video the first time if project was saved with camera on
        //     this.app.stage.setVideoState("on");
        // }
        this.clearEdgeTriggeredHats();
        this.timerReset();
        window.setTimeout(() =>  this.allStacksAndOwnersDo(startIfGreenFlag.bind(this)), 0);
    }

    public stopAll(): void {
        this.interp.stopAllThreads();
        // this.clearRunFeedback();
        this.stage.runtime.deleteClones();
        //        this.cloneCount = 0;
        // this.clearKeyDownArray();
        // ScratchSoundPlayer.stopAllSounds();
        // this.app.extensionManager.stopButtonPressed();
        this.stage.runtime.clearFilters();
        for (let s of this.stage.children) {
            if (s instanceof SpriteModel) {
                s.runtime.clearFilters();
                s.runtime.hideBubble();
            }
        }
        // this.clearAskPrompts();
        // this.app.removeLoadProgressBox();
        this.motionDetector = null;
    }

    private clearEdgeTriggeredHats(): void { this.edgeTriggersEnabled = true; this.triggeredHats = []; }

    public timerReset(): void { this.timerBase = this.interp.currentMSecs; }

    public allStacksAndOwnersDo(f: Function, setDoObj: boolean = false): void {
        // Call the given function on every stack in the project, passing the stack and owning sprite/stage.
        // This method is used by broadcast, so enumerate sprites/stage from front to back to match Scratch.
        let stage: StageModel = this.stage;
        let stack: ScriptModel;
        for (let i: number = stage.children.length - 1; i >= 0; i--) {
            let o: any = stage.children[i];
            if (o instanceof ObjectModel) {
                if (setDoObj) this.currentDoObject = o;
                for (stack of o.scripts) f(stack.firstBlock, o);
            }
        }
        if (setDoObj) this.currentDoObject = stage;
        for (stack of stage.scripts) f(stack.firstBlock, stage);
        this.currentDoObject = null;
    }

    threadStarted() {
      console.log("todo threadstarted");
    }

    clearAskPrompts() {
      console.log("todo clearAskPrompts");
    }

    clearRunFeedback() {
      console.log("todo clearRunFeedback");
    }

}
