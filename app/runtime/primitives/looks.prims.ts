import {BlockModel} from "../../model/block.model";


// LooksPrims.as
// John Maloney, April 2010
//
// Looks primitives.


// import {Scratch} from "../Scratch";
// import {Block} from "../blocks/Block";
// import {ScratchObj} from "../scratch/ScratchObj";
// import {ScratchStage} from "../scratch/ScratchStage";
// import {ScratchSprite} from "../scratch/ScratchSprite";
// import {Interpreter} from "../interpreter/Interpreter";

export class LooksPrims {

    private app: Scratch;
    private interp: Interpreter;

    constructor(app: Scratch, interpreter: Interpreter) {
        this.app = app;
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
        //		primTable["hideAll"]				= primHideAll;

        primTable["comeToFront"] = this.primGoFront;
        primTable["goBackByLayers:"] = this.primGoBack;

        primTable["setVideoState"] = this.primSetVideoState;
        primTable["setVideoTransparency"] = this.primSetVideoTransparency;

				// 	primTable["scrollAlign"]			= primScrollAlign;
				// primTable["scrollRight"]			= primScrollRight;
				// primTable["scrollUp"]				= primScrollUp;
				// primTable["xScroll"]				= function(b:*):* { return app.stagePane.xScroll };
				// primTable["yScroll"]				= function(b:*):* { return app.stagePane.yScroll };

        primTable["setRotationStyle"] = this.primSetRotationStyle;
    }

    private primNextCostume(b:  BlockModel): void {
        let s: ScratchObj = this.interp.targetObj();
        if (s != null) s.showCostume(s.currentCostumeIndex + 1);
        if (s.visible) this.interp.redraw();
    }

    private primShowCostume(b:  BlockModel): void {
        let s: ScratchObj = this.interp.targetObj();
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
        if (s.visible) this.interp.redraw();
    }

    private primCostumeIndex(b:  BlockModel): number {
        let s: ScratchObj = this.interp.targetObj();
        return (s === null) ? 1 : s.costumeNumber();
    }

    private primCostumeName(b:  BlockModel): string {
        let s: ScratchObj = this.interp.targetObj();
        return (s === null) ? "" : s.currentCostume().costumeName;
    }

    private primSceneIndex(b:  BlockModel): number {
        return this.app.stagePane.costumeNumber();
    }

    private primSceneName(b:  BlockModel): string {
        return this.app.stagePane.currentCostume().costumeName;
    }

    private startScene(s: string, waitFlag: boolean): void {
        if ("next backdrop" === s) s = this.backdropNameAt(this.app.stagePane.currentCostumeIndex + 1);
        else if ("previous backdrop" === s) s = this.backdropNameAt(this.app.stagePane.currentCostumeIndex - 1);
        else {
            let n: number = Interpreter.asNumber(s);
            if (!isNaN(n)) {
                n = (Math.round(n) - 1) % this.app.stagePane.costumes.length;
                if (n < 0) n += this.app.stagePane.costumes.length;
                s = this.app.stagePane.costumes[n].costumeName;
            }
        }
        this.interp.startScene(s, waitFlag);
    }

    private backdropNameAt(i: number): string {
        let costumes: any[] = this.app.stagePane.costumes;
        return costumes[(i + costumes.length) % costumes.length].costumeName;
    }

    private showBubbleAndWait(b: BlockModel, type: string): void {
        let text: any, secs: number;
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return;
        if (this.interp.activeThread.firstTime) {
            text = this.interp.arg(b, 0);
            secs = this.interp.numarg(b, 1);
            s.showBubble(text, type, b);
            if (s.visible) this.interp.redraw();
            this.interp.startTimer(secs);
        } else {
            if (this.interp.checkTimer() && s.bubble && (s.bubble.getSource() === b)) {
                s.hideBubble();
            }
        }
    }

    private showBubble(b: Block, type: string = null): void {
        let text: any, secs: number;
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return;
        if (type === null) { // combined talk/think/shout/whisper command
            type = this.interp.arg(b, 0);
            text = this.interp.arg(b, 1);
        } else { // talk or think command
            text = this.interp.arg(b, 0);
        }
        s.showBubble(text, type, b);
        if (s.visible) this.interp.redraw();
    }

    private primChangeEffect(b:  BlockModel): void {
        let s: ScratchObj = this.interp.targetObj();
        if (s === null) return;
        let filterName: string = this.interp.arg(b, 0);
        let delta: number = this.interp.numarg(b, 1);
        if (delta === 0) return;

        let newValue: number = s.filterPack.getFilterSetting(filterName) + delta;
        s.filterPack.setFilter(filterName, newValue);
        s.applyFilters();
        if (s.visible || s === Scratch.app.stagePane) this.interp.redraw();
    }

    private primSetEffect(b:  BlockModel): void {
        let s: ScratchObj = this.interp.targetObj();
        if (s === null) return;
        let filterName: string = this.interp.arg(b, 0);
        let newValue: number = this.interp.numarg(b, 1);
        if (s.filterPack.setFilter(filterName, newValue))
            s.applyFilters();
        if (s.visible || s === Scratch.app.stagePane) this.interp.redraw();
    }

    private primClearEffects(b:  BlockModel): void {
        let s: ScratchObj = this.interp.targetObj();
        s.clearFilters();
        s.applyFilters();
        if (s.visible || s === Scratch.app.stagePane) this.interp.redraw();
    }

    private primChangeSize(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return;
        let oldScale: number = s.scaleX;
        s.setSize(s.getSize() + this.interp.numarg(b, 0));
        if (s.visible && (s.scaleX != oldScale)) this.interp.redraw();
    }

    private primSetRotationStyle(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        let newStyle: string = this.interp.arg(b, 0);
        if ((s === null) || (newStyle === null)) return;
        s.setRotationStyle(newStyle);
    }

    private primSetSize(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return;
        s.setSize(this.interp.numarg(b, 0));
        if (s.visible) this.interp.redraw();
    }

    private primSize(b:  BlockModel): number {
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return 100;
        return Math.round(s.getSize()); // reporter returns rounded size, as in Scratch 1.4
    }

    private primShow(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if (s === null) return;
        s.visible = true;
        if (!this.app.isIn3D) s.applyFilters();
        s.updateBubble();
        if (s.visible) this.interp.redraw();
    }

    private primHide(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if ((s === null) || !s.visible) return;
        s.visible = false;
        if (!this.app.isIn3D) s.applyFilters();
        s.updateBubble();
        this.interp.redraw();
    }

    private primHideAll(b:  BlockModel): void {
        // Hide all sprites and delete all clones. Only works from the stage.
        if (!this.interp.targetObj().isStage) return;
        this.app.stagePane.deleteClones();
        for (let i: number = 0; i < this.app.stagePane.numChildren; i++) {
            let o: any = this.app.stagePane.getChildAt(i);
            if (o instanceof ScratchSprite) {
                o.visible = false;
                o.updateBubble();
            }
        }
        this.interp.redraw();
    }

    private primGoFront(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if ((s === null) || (s.parent === null)) return;
        s.parent.setChildIndex(s, s.parent.numChildren - 1);
        if (s.visible) this.interp.redraw();
    }

    private primGoBack(b:  BlockModel): void {
        let s: ScratchSprite = this.interp.targetSprite();
        if ((s === null) || (s.parent === null)) return;
        let newIndex: number = s.parent.getChildIndex(s) - this.interp.numarg(b, 0);
        newIndex = Math.max(this.minSpriteLayer(), Math.min(newIndex, s.parent.numChildren - 1));

        if (newIndex > 0 && newIndex < s.parent.numChildren) {
            s.parent.setChildIndex(s, newIndex);
            if (s.visible) this.interp.redraw();
        }
    }

    private minSpriteLayer(): number {
        // Return the lowest sprite layer.
        let stg: ScratchStage = this.app.stagePane;
        return stg.getChildIndex(stg.videoImage ? stg.videoImage : stg.penLayer) + 1;
    }

    private primSetVideoState(b:  BlockModel): void {
        this.app.stagePane.setVideoState(this.interp.arg(b, 0));
    }

    private primSetVideoTransparency(b:  BlockModel): void {
        this.app.stagePane.setVideoTransparency(this.interp.numarg(b, 0));
        this.app.stagePane.setVideoState("on");
    }

    private primScrollAlign(b:  BlockModel): void {
        if (!this.interp.targetObj().isStage) return;
        this.app.stagePane.scrollAlign(this.interp.arg(b, 0));
    }

    private primScrollRight(b:  BlockModel): void {
        if (!this.interp.targetObj().isStage) return;
        this.app.stagePane.scrollRight(this.interp.numarg(b, 0));
    }

    private primScrollUp(b:  BlockModel): void {
        if (!this.interp.targetObj().isStage) return;
        this.app.stagePane.scrollUp(this.interp.numarg(b, 0));
    }
}
//}
