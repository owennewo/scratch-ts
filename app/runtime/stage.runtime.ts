import {CostumeModel} from "../model/costume.model";
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
    mouseIsDown: boolean;
    background: Snap.Element;

    lastAnswer: string = "todo";

    interp: Interpreter;
    private motionDetector: VideoMotionPrims;
    private stage: StageModel;
    private timerBase: number;
    private edgeTriggersEnabled: boolean = false; // initially false, becomes true when project first run
    private triggeredHats: any[] = [];


    constructor(stage: StageModel) {
        super();
        this.stage = stage;
        this.interp = new Interpreter(stage);
        this.svg = Snap("#svg-stage");

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

    showCostume(costume: CostumeModel) {
      let backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";

      if (this.background) {
        this.background.attr({
          href: backgroundUrl
        });
      } else {
        this.background = this.svg.image(backgroundUrl, -240, -180, 480, 360);
        this.background.attr({
          id: "stage-background-image"
        });
      }

    }

    showCostumeNamed(costumeName: string) {
        this.stage.costumes.forEach ((costume, index) => {
            if (costume.name === costumeName) {
              this.showCostume(this.stage.costumes[index]);
            }
        });

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

    start() {
      console.log("Display initial stage");
      this.stage.showCostume(this.stage.currentCostumeIndex);

      this.stage.children.forEach(sprite => {
        sprite.runtime.showCostume(sprite.costumes[sprite.currentCostumeIndex]);
      });

      setInterval(() => {
          // console.log("timer loop (replace with requestAnimationFrame??)");
          this.interp.stepThreads();
      }, 2000);

    }

    timer(): number {
      console.log("todo stage runtime timer");
      return -1;
    }

    soundLevel(): number {
      console.log("todo soundLevel");
      return -1;
    }

    isLoud(): number {
      console.log("todo stage isLoud");
      return -1;
    }

    getTimeString(arg: any): string {
      console.log("todo stage runtime getTimeString");
      return "timestring";
    }

    getSensor(arg: any): number {
      console.log("todo stage runtime getSensor");
      return -1;
    }

    getBooleanSensor(arg: any): number {
      console.log("todo stage runtime getBooleanSensor");
      return -1;
    }

}
