import {ObjectModel} from "../../model/object.model";
import {StageModel} from "../../model/stage.model";
import {Rectangle} from "../../shapes/geometry";
import {Point} from "../../shapes/geometry";
import {Interpreter} from "../interpreter";
import {Scratch} from "../scratch";
import {BlockModel} from "../../model/block.model";
import {SpriteModel} from "../../model/sprite.model";
// SensingPrims.as
// John Maloney, April 2010
//
// Sensing primitives.


export class SensingPrims {

    constructor() {
    }

    public addPrimsTo(primTable: any): void {
        // sensing
        primTable["touching:"] = this.primTouching;
        primTable["touchingColor:"] = this.primTouchingColor;
        primTable["color:sees:"] = this.primColorSees;

        primTable["doAsk"] = this.primAsk;
        primTable["answer"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.lastAnswer; };

        primTable["mousePressed"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.mouseIsDown; };
        primTable["mouseX"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.mouseX; };
        primTable["mouseY"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.mouseY; };
        primTable["timer"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.timer(); };
        primTable["timerReset"] = function(b: any, interp: Interpreter): any { interp.stage.runtime.timerReset(); };
        primTable["keyPressed:"] = this.primKeyPressed;
        primTable["distanceTo:"] = this.primDistanceTo;
        primTable["getAttribute:of:"] = this.primGetAttribute;
        primTable["soundLevel"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.soundLevel(); };
        primTable["isLoud"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.isLoud(); };
        primTable["timestamp"] = this.primTimestamp;
        primTable["timeAndDate"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.getTimeString(interp.arg(this.b, 0)); };
        primTable["getUserName"] = function(b: any): any { return ""; };

        // sensor
        primTable["sensor:"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.getSensor(interp.arg(this.b, 0)); };
        primTable["sensorPressed:"] = function(b: any, interp: Interpreter): any { return interp.stage.runtime.getBooleanSensor(interp.arg(this.b, 0)); };

        // variable and list watchers
        primTable["showVariable:"] = this.primShowWatcher;
        primTable["hideVariable:"] = this.primHideWatcher;
        primTable["showList:"] = this.primShowListWatcher;
        primTable["hideList:"] = this.primHideListWatcher;
    }

    // TODO: move to stage
    private static stageRect: Rectangle = new Rectangle(0, 0, 480, 360);
    private primTouching(b: BlockModel, interp: Interpreter): boolean {

        let s: SpriteModel = interp.targetSprite();
        if (s === null) return false;
        let arg: any = interp.arg(b, 0);
        if ("_edge_" === arg) {
          console.log("todo check edge touching");
            // if (SensingPrims.stageRect.containsRect(s.getBounds(s.parent))) return false;
            //
            // let r: Rectangle = s.runtime.bounds();
            // return (r.left < 0) || (r.right > StageModel.STAGEW) ||
            //     (r.top < 0) || (r.bottom > StageModel.STAGEH);
        }
        if ("_mouse_" === arg) {
          console.log("todo mouse touches");
            return this.mouseTouches(s);
        }
        if (!s.visible) return false;

        for (let s2 of interp.stage.spritesAndClonesNamed(arg)) {
          if (s2.visible && s2.runtime.isTouching(s.runtime ))
              return true;
        }

        return false;
    }

    public mouseTouches(s: SpriteModel): boolean {
        // True if the mouse touches the given sprite. This test is independent
        // of whether the sprite is hidden or 100% ghosted.
        // Note: p and r are in the coordinate system of the sprite"s parent (i.e. the StageModel).
        console.log("todo mouse touches");
        // if (!s.parent) return false;
        // if (!s.getBounds(s).contains(s.mouseX, s.mouseY)) return false;
        // let r: Rectangle = s.bounds();
        // if (!r.contains(s.parent.mouseX, s.parent.mouseY)) return false;
        // return s.bitmap().hitTest(r.topLeft, 1, new Point(s.parent.mouseX, s.parent.mouseY));
        return false;
    }

    // private let testSpr:Sprite;
    // private let myBMTest:Bitmap;
    // private let stageBMTest:Bitmap;
    private primTouchingColor(b: BlockModel, interp: Interpreter): boolean {
        // Note: Attempted to switch stage.stage.quality to LOW to disable anti-aliasing, which
        // can create false colors. Unfortunately, that caused serious performance issues.
        // let s: SpriteModel = interp.targetSprite();
        // if (s === null) return false;
        // let c: number = interp.arg(b, 0) | 0xFF000000;
        // let myBM: BitmapData = s.bitmap(true);
        // let stageBM: BitmapData = interp.stageBitmapWithoutSpriteFilteredByColor(s, c);
        // if(s.objName === "sensor") {
        //    if(!testSpr) {
        //        testSpr = new Sprite();
        //        stage.stage.addChild(testSpr);
        //        myBMTest = new Bitmap();
        //        myBMTest.y = 300;
        //        testSpr.addChild(myBMTest);
        //        stageBMTest = new Bitmap();
        //        stageBMTest.y = 300;
        //        testSpr.addChild(stageBMTest);
        //    }
        //    myBMTest.bitmapData = myBM;
        //    stageBMTest.bitmapData = stageBM;
        //    testSpr.graphics.clear();
        //    testSpr.graphics.lineStyle(1);
        //    testSpr.graphics.drawRect(myBM.width, 300, stageBM.width, stageBM.height);
        // }
        // return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
        return null;
    }

    private primColorSees(b: BlockModel, interp: Interpreter): boolean {
        // Note: Attempted to switch stage.stage.quality to LOW to disable anti-aliasing, which
        // can create false colors. Unfortunately, that caused serious performance issues.
        // let s: SpriteModel = interp.targetSprite();
        // if (s === null) return false;
        // let c1: number = interp.arg(b, 0) | 0xFF000000;
        // let c2: number = interp.arg(b, 1) | 0xFF000000;
        // let myBM: BitmapData = this.bitmapFilteredByColor(s.bitmap(true), c1);
        // let stageBM: BitmapData = interp.stageBitmapWithoutSpriteFilteredByColor(s, c2);
        // if(!testSpr) {
        // testSpr = new Sprite();
        // testSpr.y = 300;
        // stage.stage.addChild(testSpr);
        // stageBMTest = new Bitmap();
        // testSpr.addChild(stageBMTest);
        // myBMTest = new Bitmap();
        // myBMTest.filters = [new GlowFilter(0xFF00FF)];
        // testSpr.addChild(myBMTest);
        // }
        // myBMTest.bitmapData = myBM;
        // stageBMTest.bitmapData = stageBM;
        // testSpr.graphics.clear();
        // testSpr.graphics.lineStyle(1);
        // testSpr.graphics.drawRect(0, 0, stageBM.width, stageBM.height);
        // return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
        return null;
    }

    // used for debugging:
    // private debugView: Bitmap;
    // private showBM(bm: BitmapData): void {
    //     if (this.debugView === null) {
    //         this.debugView = new Bitmap();
    //         this.debugView.x = 100;
    //         this.debugView.y = 600;
    //         interp.stage.addChild(this.debugView);
    //     }
    //     this.debugView.bitmapData = bm;
    // }
    //
    // //	private let testBM:Bitmap = new Bitmap();
    // private bitmapFilteredByColor(srcBM: BitmapData, c: number): BitmapData {
    //     //		if(!testBM.parent) {
    //     //			testBM.y = 360; testBM.x = 15;
    //     //			stage.stage.addChild(testBM);
    //     //		}
    //     //		testBM.bitmapData = srcBM;
    //     let outBM: BitmapData = new BitmapData(srcBM.width, srcBM.height, true, 0);
    //     outBM.threshold(srcBM, srcBM.rect, srcBM.rect.topLeft, "==", c, 0xFF000000, 0xF0F8F8F0); // match only top five bits of each component
    //     return outBM;
    // }

    // private stageBitmapWithoutSpriteFilteredByColor(s: SpriteModel, c: number): BitmapData {
    //     // return interp.stage.stage.getBitmapWithoutSpriteFilteredByColor(s, c);
    // }

    private primAsk(b: BlockModel, interp: Interpreter): void {
      console.log("todo primAsk");
        // if (interp.stage.runtime.askPromptShowing()) {
        //     // wait if (1) some other sprite is asking (2) this question is answered (when firstTime is false)
        //     interp.doYield();
        //     return;
        // }
        // let obj: ObjectModel = interp.targetObj();
        // if (interp.activeThread.firstTime) {
        //     let question: string = interp.arg(b, 0);
        //     if ((obj instanceof SpriteModel) && (obj.visible)) {
        //         (<SpriteModel>obj).runtime.showBubble(question, "talk", b);
        //         interp.stage.runtime.showAskPrompt("");
        //     } else {
        //         interp.stage.runtime.showAskPrompt(question);
        //     }
        //     interp.activeThread.firstTime = false;
        //     interp.doYield();
        // } else {
        //     if ((obj instanceof SpriteModel) && (obj.visible)) (<SpriteModel> obj).runtime.hideBubble();
        //     interp.activeThread.firstTime = true;
        // }
    }

    private primKeyPressed(b: BlockModel, interp: Interpreter): boolean {
        let key: string = interp.arg(b, 0);
        if (key === "any") {
            for (let k of interp.stage.runtime.keyIsDown) {
                if (k) return true;
            }
            return false;
        }
        let ch: number = key.charCodeAt(0);
        if (ch > 127) return false;
        if (key === "left arrow") ch = 28;
        if (key === "right arrow") ch = 29;
        if (key === "up arrow") ch = 30;
        if (key === "down arrow") ch = 31;
        if (key === "space") ch = 32;
        return interp.stage.runtime.keyIsDown[ch];
    }

    private primDistanceTo(b: BlockModel, interp: Interpreter): number {
        let s: SpriteModel = interp.targetSprite();
        let p: Point = this.mouseOrSpritePosition(interp, interp.arg(b, 0));
        if ((s === null) || (p === null)) return 10000;
        let dx: number = p.x - s.x;
        let dy: number = p.y - s.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    private primGetAttribute(b: BlockModel, interp: Interpreter): any {
        let attribute: string = interp.arg(b, 0);
        let obj: ObjectModel = interp.stage.objNamed(String(interp.arg(b, 1)));
        if (!(obj instanceof ObjectModel)) return 0;
        if (obj instanceof SpriteModel) {
            let s: SpriteModel = obj;
            if ("x position" === attribute) return s.x;
            if ("y position" === attribute) return s.y;
            if ("direction" === attribute) return s.direction;
            if ("costume #" === attribute) return s.currentCostumeIndex;
            if ("costume name" === attribute) return s.costumes[s.currentCostumeIndex].name;
            if ("size" === attribute) return s.runtime.getSize();
            if ("volume" === attribute) return s.runtime.volume;
        } if (obj instanceof StageModel) {
            if ("background #" === attribute) return obj.currentCostumeIndex; // support for old 1.4 BlockModels
            if ("backdrop #" === attribute) return obj.currentCostumeIndex;
            if ("backdrop name" === attribute) return obj.costumes[obj.currentCostumeIndex].name;
            if ("volume" === attribute) return obj.runtime.volume;
        }
        console.log("todo ownsVar/lookup vars");
        // if (obj.ownsVar(attribute)) return obj.lookupVar(attribute).value; // variable
        return 0;
    }

    private mouseOrSpritePosition(interp: Interpreter, arg: string): Point {
        if (arg === "_mouse_") {
            return new Point(interp.stage.runtime.mouseX, interp.stage.runtime.mouseY);
        } else {
            let s: SpriteModel = interp.stage.spriteNamed(arg);
            if (s === null) return null;
            return new Point(s.x, s.y);
        }
    }

    private primShowWatcher(b: BlockModel, interp: Interpreter): any {
        let obj: ObjectModel = interp.targetObj();
        console.log("todo: primShowWatcher");
//        if (obj) interp.stage.runtime.showVarOrListFor(interp.arg(b, 0), false, obj);
    }

    private primHideWatcher(b: BlockModel, interp: Interpreter): any {
        let obj: ObjectModel = interp.targetObj();
        console.log("todo: primHideWatcher");
        // if (obj) interp.stage.runtime.hideVarOrListFor(interp.arg(b, 0), false, obj);
    }

    private primShowListWatcher(b: BlockModel, interp: Interpreter): any {
        let obj: ObjectModel = interp.targetObj();
        console.log("todo: showVarOrListFor");
        // if (obj) interp.stage.runtime.showVarOrListFor(interp.arg(b, 0), true, obj);
    }

    private primHideListWatcher(b: BlockModel, interp: Interpreter): any {
        let obj: ObjectModel = interp.targetObj();
        console.log("todo: hideVarOrListFor");
        // if (obj) interp.stage.runtime.hideVarOrListFor(interp.arg(b, 0), true, obj);
    }

    private primTimestamp(b: BlockModel, interp: Interpreter): any {
        let millisecondsPerDay: number = 24 * 60 * 60 * 1000;
        let epoch: Date = new Date(2000, 0, 1); // Jan 1, 2000 (Note: Months are zero-based.)
        let now: Date = new Date();
        let dstAdjust: number = now.getTimezoneOffset() - epoch.getTimezoneOffset();
        let mSecsSinceEpoch: number = now.getTime() - epoch.getTime();
        mSecsSinceEpoch += ((now.getTimezoneOffset() - dstAdjust) * 60 * 1000); // adjust to UTC (GMT)
        return mSecsSinceEpoch / millisecondsPerDay;
    }

}
