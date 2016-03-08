import {StageModel} from "../../model/stage.model";
import {Interpreter} from "../interpreter";
import {Scratch} from "../scratch";
import {SpriteModel} from "../../model/sprite.model";
import {BlockModel} from "../../model/block.model";
import {Rectangle} from "../../shapes/geometry";
import {Point} from "../../shapes/geometry";


// MotionAndPenPrims.as
// John Maloney, April 2010
//
// Scratch motion and pen primitives.

export class MotionAndPenPrims {

    private stage: StageModel;
    private interp: Interpreter;

    constructor(stage: StageModel, interpreter: Interpreter) {
        this.stage = stage;
        this.interp = interpreter;
    }

    public addPrimsTo(primTable: any): void {
        primTable["forward:"] = this.primMove;
        primTable["turnRight:"] = this.primTurnRight;
        primTable["turnLeft:"] = this.primTurnLeft;
        primTable["heading:"] = this.primSetDirection;
        primTable["pointTowards:"] = this.primPointTowards;
        primTable["gotoX:y:"] = this.primGoTo;
        primTable["gotoSpriteOrMouse:"] = this.primGoToSpriteOrMouse;
        primTable["glideSecs:toX:y:elapsed:from:"] = this.primGlide;

        primTable["changeXposBy:"] = this.primChangeX;
        primTable["xpos:"] = this.primSetX;
        primTable["changeYposBy:"] = this.primChangeY;
        primTable["ypos:"] = this.primSetY;

        primTable["bounceOffEdge"] = this.primBounceOffEdge;

        primTable["xpos"] = this.primXPosition;
        primTable["ypos"] = this.primYPosition;
        primTable["heading"] = this.primDirection;

        primTable["clearPenTrails"] = this.primClear;
        primTable["putPenDown"] = this.primPenDown;
        primTable["putPenUp"] = this.primPenUp;
        primTable["penColor:"] = this.primSetPenColor;
        primTable["setPenHueTo:"] = this.primSetPenHue;
        primTable["changePenHueBy:"] = this.primChangePenHue;
        primTable["setPenShadeTo:"] = this.primSetPenShade;
        primTable["changePenShadeBy:"] = this.primChangePenShade;
        primTable["penSize:"] = this.primSetPenSize;
        primTable["changePenSizeBy:"] = this.primChangePenSize;
        primTable["stampCostume"] = this.primStamp;
    }

    private primMove(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        let radians: number = (Math.PI * (90 - s.direction)) / 180;
        let d: number = this.interp.numarg(b, 0);
        this.moveSpriteTo(s, s.x + (d * Math.cos(radians)), s.y + (d * Math.sin(radians)));
    }

    private primTurnRight(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) {
            s.direction = s.direction + this.interp.numarg(b, 0);
            if (s.visible) this.interp.redraw();
        }
    }

    private primTurnLeft(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) {
            s.direction = s.direction - this.interp.numarg(b, 0);
            if (s.visible) this.interp.redraw();
        }
    }

    private primSetDirection(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) {
            s.direction = this.interp.numarg(b, 0);
            if (s.visible) this.interp.redraw();
        }
    }

    private primPointTowards(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        let p: Point = this.mouseOrSpritePosition(this.interp.arg(b, 0));
        if ((s === null) || (p === null)) return;
        let dx: number = p.x - s.x;
        let dy: number = p.y - s.y;
        let angle: number = 90 - ((Math.atan2(dy, dx) * 180) / Math.PI);
        s.direction = angle;
        if (s.visible) this.interp.redraw();
    }

    private primGoTo(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) this.moveSpriteTo(s, this.interp.numarg(b, 0), this.interp.numarg(b, 1));
    }

    private primGoToSpriteOrMouse(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        let p: Point = this.mouseOrSpritePosition(this.interp.arg(b, 0));
        if ((s === null) || (p === null)) return;
        this.moveSpriteTo(s, p.x, p.y);
    }

    private primGlide(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        if (this.interp.activeThread.firstTime) {
            let secs: number = this.interp.numarg(b, 0);
            let destX: number = this.interp.numarg(b, 1);
            let destY: number = this.interp.numarg(b, 2);
            if (secs <= 0) {
                this.moveSpriteTo(s, destX, destY);
                return;
            }
            // record state: [0]start msecs, [1]duration, [2]startX, [3]startY, [4]endX, [5]endY
            this.interp.activeThread.tmpObj =
                [this.interp.currentMSecs, 1000 * secs, s.x, s.y, destX, destY];
            this.interp.startTimer(secs);
        } else {
            let state: any[] = this.interp.activeThread.tmpObj;
            if (!this.interp.checkTimer()) {
                // in progress: move to intermediate position along path
                let frac: number = (this.interp.currentMSecs - state[0]) / state[1];
                let newX: number = state[2] + (frac * (state[4] - state[2]));
                let newY: number = state[3] + (frac * (state[5] - state[3]));
                this.moveSpriteTo(s, newX, newY);
            } else {
                // finished: move to final position and clear state
                this.moveSpriteTo(s, state[4], state[5]);
                this.interp.activeThread.tmpObj = null;
            }
        }
    }

    private mouseOrSpritePosition(arg: string): Point {
        if (arg === "_mouse_") {
            let w: StageModel = this.stage;
            return new Point(w.runtime.mouseX(), w.runtime.mouseY());
        } else {
            let s: SpriteModel = this.stage.spriteNamed(arg);
            if (s === null) return null;
            return new Point(s.x, s.y);
        }
    }

    private primChangeX(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) this.moveSpriteTo(s, s.x + this.interp.numarg(b, 0), s.y);
    }

    private primSetX(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) this.moveSpriteTo(s, this.interp.numarg(b, 0), s.y);
    }

    private primChangeY(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) this.moveSpriteTo(s, s.x, s.y + this.interp.numarg(b, 0));
    }

    private primSetY(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) this.moveSpriteTo(s, s.x, this.interp.numarg(b, 0));
    }

    private primBounceOffEdge(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s === null) return;
        if (!this.turnAwayFromEdge(s)) return;
        this.ensureOnStageOnBounce(s);
        if (s.visible) this.interp.redraw();
    }

    private primXPosition(b: BlockModel): number {
        let s: SpriteModel = this.interp.targetSprite();
        return (s != null) ? this.snapToInteger(s.x) : 0;
    }

    private primYPosition(b: BlockModel): number {
        let s: SpriteModel = this.interp.targetSprite();
        return (s != null) ? this.snapToInteger(s.y) : 0;
    }

    private primDirection(b: BlockModel): number {
        let s: SpriteModel = this.interp.targetSprite();
        return (s != null) ? this.snapToInteger(s.direction) : 0;
    }

    private snapToInteger(n: number): number {
        let rounded: number = Math.round(n);
        let delta: number = n - rounded;
        if (delta < 0) delta = -delta;
        return (delta < 0.00000001) ? rounded : n;
    }

    private primClear(b: BlockModel): void {
        this.stage.runtime.clearPenStrokes()
        ;
        this.interp.redraw();
    }

    private primPenDown(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.penIsDown = true;
        this.touch(s, s.x, s.y);
        this.interp.redraw();
    }

    private touch(s: SpriteModel, x: number, y: number): void {
        // let g: Graphics = this.stage.newPenStrokes.graphics;
        // // g.lineStyle();
        // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
        // if (alpha === 0) alpha = 1;
        // g.beginFill(0xFFFFFF & s.runtime.penColorCache, alpha);
        // g.drawCircle(240 + x, 180 - y, s.runtime.penWidth / 2);
        // g.endFill();
        console.log("todo touch");
        this.stage.runtime.penActivity = true;
    }

    private primPenUp(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.penIsDown = false;
    }

    private primSetPenColor(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenColor(this.interp.numarg(b, 0));
    }

    private primSetPenHue(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenHue(this.interp.numarg(b, 0));
    }

    private primChangePenHue(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenHue(s.runtime.penHue + this.interp.numarg(b, 0));
    }

    private primSetPenShade(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenShade(this.interp.numarg(b, 0));
    }

    private primChangePenShade(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenShade(s.runtime.penShade + this.interp.numarg(b, 0));
    }

    private primSetPenSize(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenSize(Math.max(1, Math.min(960, Math.round(this.interp.numarg(b, 0)))));
    }

    private primChangePenSize(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        if (s != null) s.runtime.setPenSize(s.runtime.penWidth + this.interp.numarg(b, 0));
    }

    private primStamp(b: BlockModel): void {
        let s: SpriteModel = this.interp.targetSprite();
        // In 3D mode, get the alpha from the ghost filter
        // Otherwise, it can be easily accessed from the color transform.
        // let alpha: number = (Scratch.app.isIn3D ?
        // 1.0 - (Math.max(0, Math.min(s.filterPack.getFilterSetting( "ghost "), 100)) / 100) :
        //  s.img.transform.colorTransform.alphaMultiplier);
        let alpha: number = 0.5; // s.runtime.svg
//        .transform.colorTransform.alphaMultiplier;


        this.doStamp(s, alpha);
    }

    private doStamp(s: SpriteModel, stampAlpha: number): void {
        if (s === null) return;
        this.stage.runtime.stampSprite(s, stampAlpha);
        this.interp.redraw();
    }

    private moveSpriteTo(s: SpriteModel, newX: number, newY: number): void {
        if (!(s.parent instanceof StageModel)) return; // don "t move while being dragged
        let oldX: number = s.x;
        let oldY: number = s.y;
        s.runtime.setXY(newX, newY);
        s.runtime.keepOnStage();
        if (s.runtime.penIsDown) this.stroke(s, oldX, oldY, s.x, s.y);
        if ((s.runtime.penIsDown) || (s.visible)) this.interp.redraw();
    }

    private stroke(s: SpriteModel, oldX: number, oldY: number, newX: number, newY: number): void {
        console.log("todo stroke");
        // let g: Graphics = this.stage.newPenStrokes.graphics;
        // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
        // if (alpha === 0) alpha = 1;
        // g.lineStyle(s.runtime.penWidth, 0xFFFFFF & s.runtime.penColorCache, alpha);
        // g.moveTo(240 + oldX, 180 - oldY);
        // g.lineTo(240 + newX, 180 - newY);
        // trace( "pen line( "+oldX+ ",  "+oldY+ ",  "+newX+ ",  "+newY+ ") ");
        this.stage.runtime.penActivity = true;
    }

    private turnAwayFromEdge(s: SpriteModel): boolean {
        // turn away from the nearest edge if it "s close enough; otherwise do nothing
        // Note: comparisons are in the stage coordinates, with origin (0, 0)
        // use bounding rect of the sprite to account for costume rotation and scale
        let r: Rectangle = s.runtime.bounds();
        // measure distance to edges
        let d1: number = Math.max(0, r.left);
        let d2: number = Math.max(0, r.top);
        let d3: number = Math.max(0, StageModel.STAGEW - r.right);
        let d4: number = Math.max(0, StageModel.STAGEH - r.bottom);
        // find the nearest edge
        let e: number = 0, minDist: number = 100000;
        if (d1 < minDist) { minDist = d1; e = 1; }
        if (d2 < minDist) { minDist = d2; e = 2; }
        if (d3 < minDist) { minDist = d3; e = 3; }
        if (d4 < minDist) { minDist = d4; e = 4; }
        if (minDist > 0) return false;  // not touching to any edge
        // point away from nearest edge
        let radians: number = ((90 - s.direction) * Math.PI) / 180;
        let dx: number = Math.cos(radians);
        let dy: number = -Math.sin(radians);
        if (e === 1) { dx = Math.max(0.2, Math.abs(dx)); }
        if (e === 2) { dy = Math.max(0.2, Math.abs(dy)); }
        if (e === 3) { dx = 0 - Math.max(0.2, Math.abs(dx)); }
        if (e === 4) { dy = 0 - Math.max(0.2, Math.abs(dy)); }
        let newDir: number = ((180 * Math.atan2(dy, dx)) / Math.PI) + 90;
        s.runtime.setDirection(newDir);
        return true;
    }

    private ensureOnStageOnBounce(s: SpriteModel): void {
        let r: Rectangle = s.runtime.bounds();
        if (r.left < 0) this.moveSpriteTo(s, s.x - r.left, s.y);
        if (r.top < 0) this.moveSpriteTo(s, s.x, s.y + r.top);
        if (r.right > StageModel.STAGEW) {
            this.moveSpriteTo(s, s.x - (r.right - StageModel.STAGEW), s.y);
        }
        if (r.bottom > StageModel.STAGEH) {
            this.moveSpriteTo(s, s.x, s.y + (r.bottom - StageModel.STAGEH));
        }
    }

}
