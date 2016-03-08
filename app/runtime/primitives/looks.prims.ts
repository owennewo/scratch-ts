import {StageModel} from "../../model/stage.model";
import {SpriteModel} from "../../model/sprite.model";
import {ObjectModel} from "../../model/object.model";
import {Scratch} from "../scratch";
import {Interpreter} from "../interpreter";
import {BlockModel} from "../../model/block.model";


// LooksPrims.as
// John Maloney, April 2010
//
// Looks primitives.

export class LooksPrims {

    private stage: StageModel;
    private interp: Interpreter;

    constructor(stage: StageModel, interpreter: Interpreter) {
        this.stage = stage;
        this.interp = interpreter;
    }

    public addPrimsTo(primTable: any): void {
        primTable["lookLike:"] = this.primShowCostume;
        primTable["nextCostume"] = this.primNextCostume;
        primTable["costumeIndex"] = this.primCostumeIndex;
        primTable["costumeName"] = this.primCostumeName;

        primTable["showBackground:"] = this.primShowCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
        primTable["nextBackground"] = this.primNextCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
        primTable["backgroundIndex"] = this.primSceneIndex;
        primTable["sceneName"] = this.primSceneName;
        primTable["nextScene"] = function(b: any): any { this.startScene("next backdrop", false); };
        primTable["startScene"] = function(b: any): any { this.startScene(this.interp.arg(this.b, 0), false); };
        primTable["startSceneAndWait"] = function(b: any): any { this.startScene(this.interp.arg(this.b, 0), true); };

        primTable["say:duration:elapsed:from:"] = function(b: any): any { this.showBubbleAndWait(this.b, "talk"); };
        primTable["say:"] = function(b: any): any { this.showBubble(this.b, "talk"); };
        primTable["think:duration:elapsed:from:"] = function(b: any): any { this.showBubbleAndWait(this.b, "think"); };
        primTable["think:"] = function(b: any): any { this.showBubble(this.b, "think"); };

        primTable["changeGraphicEffect:by:"] = this.primChangeEffect;
        primTable["setGraphicEffect:to:"] = this.primSetEffect;
        primTable["filterReset"] = this.primClearEffects;

        primTable["changeSizeBy:"] = this.primChangeSize;
        primTable["setSizeTo:"] = this.primSetSize;
        primTable["scale"] = this.primSize;

        primTable["show"] = this.primShow;
        primTable["hide"] = this.primHide;
        // primTable["hideAll"]				= primHideAll;

        primTable["comeToFront"] = this.primGoFront;
        primTable["goBackByLayers:"] = this.primGoBack;

        primTable["setVideoState"] = this.primSetVideoState;
        primTable["setVideoTransparency"] = this.primSetVideoTransparency;

				// 	primTable["scrollAlign"]			= primScrollAlign;
				// primTable["scrollRight"]			= primScrollRight;
				// primTable["scrollUp"]				= primScrollUp;
				// primTable["xScroll"]				= function(b:*):* { return stage.xScroll };
				// primTable["yScroll"]				= function(b:*):* { return stage.yScroll };

        primTable["setRotationStyle"] = this.primSetRotationStyle;
    }

    private primNextCostume(b:  BlockModel): void {
        let s: ObjectModel = this.interp.targetObj();
        if (s != null) s.showCostume(s.currentCostumeIndex + 1);
        if (s.runtime.visible) this.interp.redraw();
    }

    private primShowCostume(b:  BlockModel): void {
        let s: ObjectModel = this.interp.targetObj();
        if (s === null) return;
        let arg: any = this.interp.arg(b, 0);
        if (typeof (arg) === "number") {
            s.showCostume(arg - 1);
        } else {
            let i: number = s.indexOfCostumeNamed(arg);
            if (i >= 0) {
                s.showCostume(i);
            } else if ("previous costume" === arg) {
                s.showCostume(s.currentCostumeIndex - 1);
            } else if ("next costume" === arg) {
                s.showCostume(s.currentCostumeIndex + 1);
            } else {
                let n: number = Interpreter.asNumber(arg);
                if (!isNaN(n)) s.showCostume(n - 1);
                else return; // arg did not match a costume name nor is it a valid number
            }
        }
        if (s.runtime.visible) this.interp.redraw();
    }

    private primCostumeIndex(b:  BlockModel): number {
        let s: ObjectModel = this.interp.targetObj();
        return (s === null) ? 1 : s.currentCostumeIndex;
    }

    private primCostumeName(b:  BlockModel): string {
        let s: ObjectModel = this.interp.targetObj();
        return (s === null) ? "" : s.currentCostume.name;
    }

    private primSceneIndex(b:  BlockModel): number {
        return this.stage.currentCostumeIndex;
    }

    private primSceneName(b:  BlockModel): string {
        return this.stage.currentCostume.name;
    }

    private startScene(s: string, waitFlag: boolean): void {
        if ("next backdrop" === s) s = this.backdropNameAt(this.stage.currentCostumeIndex + 1);
        else if ("previous backdrop" === s) s = this.backdropNameAt(this.stage.currentCostumeIndex - 1);
        else {
            let n: number = Interpreter.asNumber(s);
            if (!isNaN(n)) {
                n = (Math.round(n) - 1) % this.stage.costumes.length;
                if (n < 0) n += this.stage.costumes.length;
                s = this.stage.costumes[n].name;
            }
        }
        this.interp.startScene(s, waitFlag);
    }

    private backdropNameAt(i: number): string {
        let costumes: any[] = this.stage.costumes;
        return costumes[(i + costumes.length) % costumes.length].costumeName;
    }

    private showBubbleAndWait(b: BlockModel, type: string): void {
        let text: any, secs: number;
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        if (this.interp.activeThread.firstTime) {
            text = this.interp.arg(b, 0);
            secs = this.interp.numarg(b, 1);
            s.runtime.showBubble(text, type, b);
            if (s.visible) this.interp.redraw();
            this.interp.startTimer(secs);
        } else {
            if (this.interp.checkTimer() && s.runtime.bubble && (s.runtime.bubbleSource === b)) {
                s.runtime.hideBubble();
            }
        }
    }

    private showBubble(b: BlockModel, type: string = null): void {
        let text: any, secs: number;
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        if (type === null) { // combined talk/think/shout/whisper command
            type = this.interp.arg(b, 0);
            text = this.interp.arg(b, 1);
        } else { // talk or think command
            text = this.interp.arg(b, 0);
        }
        s.runtime.showBubble(text, type, b);
        if (s.visible) this.interp.redraw();
    }

    private primChangeEffect(b:  BlockModel): void {
        let s: ObjectModel = this.interp.targetObj();
        if (s === null) return;
        let filterName: string = this.interp.arg(b, 0);
        let delta: number = this.interp.numarg(b, 1);
        if (delta === 0) return;

        console.log("todo:  primChangeEffect" );
        // let newValue: number = s.runtime.filterPack.getFilterSetting(filterName) + delta;
        // s.runtime.filterPack.setFilter(filterName, newValue);
        // s.runtime.stagelyFilters();
        // if (s.runtime.visible || s === Scratch.stage) this.interp.redraw();
    }

    private primSetEffect(b:  BlockModel): void {
      console.log("todo primSetEffect");
        // let s: ObjectModel = this.interp.targetObj();
        // if (s === null) return;
        // let filterName: string = this.interp.arg(b, 0);
        // let newValue: number = this.interp.numarg(b, 1);
        // if (s.filterPack.setFilter(filterName, newValue))
        //     s.stagelyFilters();
        // if (s.visible || s === Scratch.stage) this.interp.redraw();
    }

    private primClearEffects(b:  BlockModel): void {
      console.log("todo primClearEffects");
        // let s: ScratchObj = this.interp.targetObj();
        // s.clearFilters();
        // s.stagelyFilters();
        // if (s.visible || s === Scratch.stage) this.interp.redraw();
    }

    private primChangeSize(b:  BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        let oldScale: number = s.runtime.scaleX;
        s.runtime.setSize(s.runtime.getSize() + this.interp.numarg(b, 0));
        if (s.visible && (s.runtime.scaleX !== oldScale)) this.interp.redraw();
    }

    private primSetRotationStyle(b:  BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        let newStyle: string = this.interp.arg(b, 0);
        if ((s === null) || (newStyle === null)) return;
        s.setRotationStyle(newStyle);
    }

    private primSetSize(b:  BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        s.runtime.setSize(this.interp.numarg(b, 0));
        if (s.visible) this.interp.redraw();
    }

    private primSize(b:  BlockModel): number {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return 100;
        return Math.round(s.runtime.getSize()); // reporter returns rounded size, as in Scratch 1.4
    }

    private primShow(b:  BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        s.visible = true;
        // if (!this.stage.isIn3D) s.stagelyFilters();
        s.runtime.updateBubble();
        if (s.visible) this.interp.redraw();
    }

    private primHide(b:  BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if ((s === null) || !s.visible) return;
        s.visible = false;
        // if (!this.stage.isIn3D) s.stagelyFilters();
        s.runtime.updateBubble();
        this.interp.redraw();
    }

    private primHideAll(b:  BlockModel): void {
        // Hide all sprites and delete all clones. Only works from the stage.
        if (!(this.interp.targetObj() instanceof StageModel)) return;
        this.stage.runtime.deleteClones();
        for (let i: number = 0; i < this.stage.children.length; i++) {
            let o: any = this.stage.children[i];
            if (o instanceof SpriteModel) {
                o.visible = false;
                o.updateBubble();
            }
        }
        this.interp.redraw();
    }

    private primGoFront(b:  BlockModel): void {
      console.log("todo go to front");
        // let s: SpriteModel = this.interp.targetSprite();
        // if ((s === null) || (s.parent === null)) return;
        // s.parent.setChildIndex(s, s.parent.numChildren - 1);
        // if (s.visible) this.interp.redraw();
    }

    private primGoBack(b:  BlockModel): void {
      console.log("todo go to back");
        // let s: SpriteModel = this.interp.targetSprite();
        // if ((s === null) || (s.parent === null)) return;
        // let newIndex: number = s.parent.getChildIndex(s) - this.interp.numarg(b, 0);
        // newIndex = Math.max(this.minSpriteLayer(), Math.min(newIndex, s.parent.numChildren - 1));
        //
        // if (newIndex > 0 && newIndex < s.parent.numChildren) {
        //     s.parent.setChildIndex(s, newIndex);
        //     if (s.visible) this.interp.redraw();
        // }
    }

    private minSpriteLayer(): number {
        // Return the lowest sprite layer.
        // let stg: StageModel = this.stage;
        // return stg.getChildIndex(stg.videoImage ? stg.videoImage : stg.penLayer) + 1;
        console.log("todo min SpriteLayer");
        return -1;
    }

    private primSetVideoState(b:  BlockModel): void {
      console.log("todo primSetVideoState");
        // this.stage.setVideoState(this.interp.arg(b, 0));
    }

    private primSetVideoTransparency(b:  BlockModel): void {
      console.log("todo primSetVideoTransparency");
        // this.stage.setVideoTransparency(this.interp.numarg(b, 0));
        // this.stage.setVideoState("on");
    }

    private primScrollAlign(b:  BlockModel): void {
      console.log("todo primScrollAlign");
        // if (!this.interp.targetObj().isStage) return;
        // this.stage.scrollAlign(this.interp.arg(b, 0));
    }

    private primScrollRight(b:  BlockModel): void {
      console.log("todo primScrollRight");
        // if (!this.interp.targetObj().isStage) return;
        // this.stage.scrollRight(this.interp.numarg(b, 0));
    }

    private primScrollUp(b:  BlockModel): void {
      console.log("todo primScrollUp");
        // if (!this.interp.targetObj().isStage) return;
        // this.stage.scrollUp(this.interp.numarg(b, 0));
    }
}
