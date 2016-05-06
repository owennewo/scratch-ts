import {StageModel} from "../model/stage.model";
import {SpriteModel} from "../model/sprite.model";
import {ObjectModel} from "../model/object.model";
import {Scratch} from "../runtime/scratch";
import {Interpreter} from "../runtime/interpreter";
import {BlockModel} from "../model/block.model";


// LooksPrims.as
// John Maloney, April 2010
//
// Looks primitives.

export class LooksPrims {


    constructor() {
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
        primTable["nextScene"] = (b: any, interp: Interpreter): any => { this.startScene(interp, "next backdrop", false); };
        primTable["startScene"] = (b: any, interp: Interpreter): any => { this.startScene(interp, interp.arg(b, 0), false); };
        primTable["startSceneAndWait"] = (b: any, interp: Interpreter): any => { this.startScene(interp, interp.arg(b, 0), true); };

        primTable["say:duration:elapsed:from:"] = (b: any, interp: Interpreter): any => { this.showBubbleAndWait(b, interp, "talk"); };
        primTable["say:"] = (b: any, interp: Interpreter): any => { this.showBubble(b, interp, "talk"); };
        primTable["think:duration:elapsed:from:"] = (b: any, interp: Interpreter): any => { this.showBubbleAndWait(b, interp, "think"); };
        primTable["think:"] = (b: any, interp: Interpreter): any => { this.showBubble(b, interp, "think"); };

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

    private primNextCostume(b:  BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s != null) s.showCostume(s.currentCostumeIndex + 1);
        if (s.runtime.visible) interp.redraw();
    }

    private primShowCostume(b:  BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s === null) return;
        let arg: any = interp.arg(b, 0);
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
        if (s.runtime.visible) interp.redraw();
    }

    private primCostumeIndex(b:  BlockModel, interp: Interpreter): number {
        let s: ObjectModel = interp.targetObj();
        return (s === null) ? 1 : s.currentCostumeIndex;
    }

    private primCostumeName(b:  BlockModel, interp: Interpreter): string {
        let s: ObjectModel = interp.targetObj();
        return (s === null) ? "" : s.costumes[s.currentCostumeIndex].name;
    }

    private primSceneIndex(b:  BlockModel, interp: Interpreter): number {
        return interp.stage.currentCostumeIndex;
    }

    private primSceneName(b:  BlockModel, interp: Interpreter): string {
        return interp.stage.costumes[interp.stage.currentCostumeIndex].name;
    }

    private startScene(interp: Interpreter, s: string, waitFlag: boolean): void {
        if ("next backdrop" === s) s = LooksPrims.backdropNameAt(interp, interp.stage.currentCostumeIndex + 1);
        else if ("previous backdrop" === s) s = LooksPrims.backdropNameAt(interp, interp.stage.currentCostumeIndex - 1);
        else {
            let n: number = Interpreter.asNumber(s);
            if (!isNaN(n)) {
                n = (Math.round(n) - 1) % interp.stage.costumes.length;
                if (n < 0) n += interp.stage.costumes.length;
                s = interp.stage.costumes[n].name;
            }
        }
        interp.startScene(s, waitFlag);
    }

    private static backdropNameAt(interp: Interpreter, i: number): string {
        let costumes: any[] = interp.stage.costumes;
        return costumes[(i + costumes.length) % costumes.length].costumeName;
    }

    private showBubbleAndWait(b: BlockModel, interp: Interpreter, type: string): void {
        let text: any, secs: number;
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        if (interp.activeThread.firstTime) {
            text = interp.arg(b, 0);
            secs = interp.numarg(b, 1);
            s.runtime.showBubble(text, type, b);
            if (s.visible) interp.redraw();
            interp.startTimer(secs);
        } else {
            if (interp.checkTimer() && s.runtime.bubble && (s.runtime.bubbleSource === b)) {
                s.runtime.hideBubble();
            }
        }
    }

    private showBubble(b: BlockModel, interp: Interpreter, type: string = null): void {
        let text: any, secs: number;
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        if (type === null) { // combined talk/think/shout/whisper command
            type = interp.arg(b, 0);
            text = interp.arg(b, 1);
        } else { // talk or think command
            text = interp.arg(b, 0);
        }
        s.runtime.showBubble(text, type, b);
        if (s.visible) interp.redraw();
    }

    private primChangeEffect(b:  BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s === null) return;
        let filterName: string = interp.arg(b, 0);
        let delta: number = interp.numarg(b, 1);
        if (delta === 0) return;

        console.log("todo:  primChangeEffect" );
        // let newValue: number = s.runtime.filterPack.getFilterSetting(filterName) + delta;
        // s.runtime.filterPack.setFilter(filterName, newValue);
        // s.runtime.stagelyFilters();
        // if (s.runtime.visible || s === Scratch.stage) interp.redraw();
    }

    private primSetEffect(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primSetEffect");
        // let s: ObjectModel = interp.targetObj();
        // if (s === null) return;
        // let filterName: string = interp.arg(b, 0);
        // let newValue: number = interp.numarg(b, 1);
        // if (s.filterPack.setFilter(filterName, newValue))
        //     s.stagelyFilters();
        // if (s.visible || s === Scratch.stage) interp.redraw();
    }

    private primClearEffects(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primClearEffects");
        // let s: ScratchObj = interp.targetObj();
        // s.clearFilters();
        // s.stagelyFilters();
        // if (s.visible || s === Scratch.stage) interp.redraw();
    }

    private primChangeSize(b:  BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        // let oldScale: number = s.scale;
        let oldSize = s.runtime.getSize();
        let oldScale = s.scale;
        let newSize = oldSize + interp.numarg(b, 0);
        let newScale = newSize * oldScale / oldSize;
        s.scale = newScale;
        //s.runtime.setSize(s.runtime.getSize() + interp.numarg(b, 0));
        if (s.visible && (s.runtime.scaleX !== oldScale)) interp.redraw();
        s.runtime.redraw();
    }

    private primSetRotationStyle(b:  BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        let newStyle: string = interp.arg(b, 0);
        if ((s === null) || (newStyle === null)) return;
        s.setRotationStyle(newStyle);
    }

    private primSetSize(b:  BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        let size = interp.numarg(b, 0);
        s.scale = size / 100;
        // s.runtime.setSize(size);
        if (s.visible) s.runtime.redraw();
    }

    private primSize(b:  BlockModel, interp: Interpreter): number {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return 100;
        return Math.round(s.runtime.getSize()); // reporter returns rounded size, as in Scratch 1.4
    }

    private primShow(b:  BlockModel, interp: Interpreter): void {
        let s = interp.targetSprite();
        if (s === null) return;
        s.visible = true;
        s.runtime.svg.removeClass("hide");
        // if (!interp.stage.isIn3D) s.stagelyFilters();
        if (s instanceof SpriteModel) {
            s.runtime.updateBubble();
        }
        if (s.visible) interp.redraw();
    }

    private primHide(b:  BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if ((s === null) || !s.visible) return;
        s.visible = false;
        s.runtime.svg.addClass("hide");
        // if (!interp.stage.isIn3D) s.stagelyFilters();
        s.runtime.updateBubble();
        interp.redraw();
    }

    private primHideAll(b:  BlockModel, interp: Interpreter): void {
        // Hide all sprites and delete all clones. Only works from the stage.
        if (!(interp.targetObj() instanceof StageModel)) return;
        interp.stage.runtime.deleteClones();
        for (let i: number = 0; i < interp.stage.children.length; i++) {
            let o: any = interp.stage.children[i];
            if (o instanceof SpriteModel) {
                o.visible = false;
                o.updateBubble();
            }
        }
        interp.redraw();
    }

    private primGoFront(b:  BlockModel, interp: Interpreter): void {
      console.log("todo go to front");
        // let s: SpriteModel = interp.targetSprite();
        // if ((s === null) || (s.parent === null)) return;
        // s.parent.setChildIndex(s, s.parent.numChildren - 1);
        // if (s.visible) interp.redraw();
    }

    private primGoBack(b:  BlockModel, interp: Interpreter): void {
      console.log("todo go to back");
        // let s: SpriteModel = interp.targetSprite();
        // if ((s === null) || (s.parent === null)) return;
        // let newIndex: number = s.parent.getChildIndex(s) - interp.numarg(b, 0);
        // newIndex = Math.max(LooksPrims.minSpriteLayer(), Math.min(newIndex, s.parent.numChildren - 1));
        //
        // if (newIndex > 0 && newIndex < s.parent.numChildren) {
        //     s.parent.setChildIndex(s, newIndex);
        //     if (s.visible) interp.redraw();
        // }
    }

    private minSpriteLayer(): number {
        // Return the lowest sprite layer.
        // let stg: StageModel = interp.stage;
        // return stg.getChildIndex(stg.videoImage ? stg.videoImage : stg.penLayer) + 1;
        console.log("todo min SpriteLayer");
        return -1;
    }

    private primSetVideoState(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primSetVideoState");
        // interp.stage.setVideoState(interp.arg(b, 0));
    }

    private primSetVideoTransparency(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primSetVideoTransparency");
        // interp.stage.setVideoTransparency(interp.numarg(b, 0));
        // interp.stage.setVideoState("on");
    }

    private primScrollAlign(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primScrollAlign");
        // if (!interp.targetObj().isStage) return;
        // interp.stage.scrollAlign(interp.arg(b, 0));
    }

    private primScrollRight(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primScrollRight");
        // if (!interp.targetObj().isStage) return;
        // interp.stage.scrollRight(interp.numarg(b, 0));
    }

    private primScrollUp(b:  BlockModel, interp: Interpreter): void {
      console.log("todo primScrollUp");
        // if (!interp.targetObj().isStage) return;
        // interp.stage.scrollUp(interp.numarg(b, 0));
    }
}
