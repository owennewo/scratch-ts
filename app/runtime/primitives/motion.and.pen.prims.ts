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

    constructor() {
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

    private primMove (b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        let radians: number = (Math.PI * (90 - s.direction)) / 180;
        let d: number = interp.numarg(b, 0);
        MotionAndPenPrims.moveSpriteTo(s, interp, s.x + (d * Math.cos(radians)), s.y + (d * Math.sin(radians)));
    };

    private primTurnRight(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) {
            s.direction = s.direction + interp.numarg(b, 0);
            if (s.visible) interp.redraw();
        }
    }

    private primTurnLeft(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) {
            s.direction = s.direction - interp.numarg(b, 0);
            s.runtime.redraw();
            if (s.visible) interp.redraw();
        }
    }

    private primSetDirection(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) {
            s.direction = interp.numarg(b, 0);
            s.runtime.redraw();
            if (s.visible) interp.redraw();
        }
    }

    private primPointTowards(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        let p: Point = MotionAndPenPrims.mouseOrSpritePosition(interp.arg(b, 0), interp);
        if ((s === null) || (p === null)) return;
        let dx: number = p.x - s.x;
        let dy: number = p.y - s.y;
        let angle: number = 90 - ((Math.atan2(dy, dx) * 180) / Math.PI);
        s.direction = angle;
        if (s.visible) interp.redraw();
    }

    private primGoTo(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) MotionAndPenPrims.moveSpriteTo(s, interp, interp.numarg(b, 0), interp.numarg(b, 1));
    }

    private primGoToSpriteOrMouse(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        let p: Point = MotionAndPenPrims.mouseOrSpritePosition(interp.arg(b, 0), interp);
        if ((s === null) || (p === null)) return;
        MotionAndPenPrims.moveSpriteTo(s, interp, p.x, p.y);
    }

    private primGlide(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        if (interp.activeThread.firstTime) {
            let secs: number = interp.numarg(b, 0);
            let destX: number = interp.numarg(b, 1);
            let destY: number = interp.numarg(b, 2);
            if (secs <= 0) {
                MotionAndPenPrims.moveSpriteTo(s, interp, destX, destY);
                return;
            }
            // record state: [0]start msecs, [1]duration, [2]startX, [3]startY, [4]endX, [5]endY
            interp.activeThread.tmpObj =
                [interp.currentMSecs, 1000 * secs, s.x, s.y, destX, destY];
            interp.startTimer(secs);
        } else {
            let state: any[] = interp.activeThread.tmpObj;
            if (!interp.checkTimer()) {
                // in progress: move to intermediate position along path
                let frac: number = (interp.currentMSecs - state[0]) / state[1];
                let newX: number = state[2] + (frac * (state[4] - state[2]));
                let newY: number = state[3] + (frac * (state[5] - state[3]));
                MotionAndPenPrims.moveSpriteTo(s, interp, newX, newY);
            } else {
                // finished: move to final position and clear state
                MotionAndPenPrims.moveSpriteTo(s, interp, state[4], state[5]);
                interp.activeThread.tmpObj = null;
            }
        }
    }

    private static mouseOrSpritePosition(arg: string, interp: Interpreter): Point {
        if (arg === "_mouse_") {
            let w: StageModel = interp.stage;
            return new Point(w.runtime.mouseX(), w.runtime.mouseY());
        } else {
            let s: SpriteModel = interp.stage.spriteNamed(arg);
            if (s === null) return null;
            return new Point(s.x, s.y);
        }
    }

    private primChangeX(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) MotionAndPenPrims.moveSpriteTo(s, interp, s.x + interp.numarg(b, 0), s.y);
    }

    private primSetX(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) MotionAndPenPrims.moveSpriteTo(s, interp, interp.numarg(b, 0), s.y);
    }

    private primChangeY(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + interp.numarg(b, 0));
    }

    private primSetY(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) MotionAndPenPrims.moveSpriteTo(s, interp, s.x, interp.numarg(b, 0));
    }

    private primBounceOffEdge(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s === null) return;
        if (!MotionAndPenPrims.turnAwayFromEdge(s)) return;
        MotionAndPenPrims.ensureOnStageOnBounce(s, interp);
        if (s.visible) interp.redraw();
    }

    private primXPosition(b: BlockModel, interp: Interpreter): number {
        let s: SpriteModel = interp.targetSprite();
        return (s != null) ? MotionAndPenPrims.snapToInteger(s.x) : 0;
    }

    private primYPosition(b: BlockModel, interp: Interpreter): number {
        let s: SpriteModel = interp.targetSprite();
        return (s != null) ? MotionAndPenPrims.snapToInteger(s.y) : 0;
    }

    private primDirection(b: BlockModel, interp: Interpreter): number {
        let s: SpriteModel = interp.targetSprite();
        return (s != null) ? MotionAndPenPrims.snapToInteger(s.direction) : 0;
    }

    private static snapToInteger(n: number): number {
        let rounded: number = Math.round(n);
        let delta: number = n - rounded;
        if (delta < 0) delta = -delta;
        return (delta < 0.00000001) ? rounded : n;
    }

    private primClear(b: BlockModel, interp: Interpreter): void {
        interp.stage.runtime.clearPenStrokes()
        ;
        interp.redraw();
    }

    private primPenDown(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.penIsDown = true;
        MotionAndPenPrims.touch(s, interp, s.x, s.y);
        interp.redraw();
    }

    private static touch(s: SpriteModel, interp: Interpreter, x: number, y: number): void {
        // let g: Graphics = interp.stage.newPenStrokes.graphics;
        // // g.lineStyle();
        // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
        // if (alpha === 0) alpha = 1;
        // g.beginFill(0xFFFFFF & s.runtime.penColorCache, alpha);
        // g.drawCircle(240 + x, 180 - y, s.runtime.penWidth / 2);
        // g.endFill();
        console.log("todo touch");
        interp.stage.runtime.penActivity = true;
    }

    private primPenUp(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.penIsDown = false;
    }

    private primSetPenColor(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenColor(interp.numarg(b, 0));
    }

    private primSetPenHue(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenHue(interp.numarg(b, 0));
    }

    private primChangePenHue(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenHue(s.runtime.penHue + interp.numarg(b, 0));
    }

    private primSetPenShade(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenShade(interp.numarg(b, 0));
    }

    private primChangePenShade(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenShade(s.runtime.penShade + interp.numarg(b, 0));
    }

    private primSetPenSize(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenSize(Math.max(1, Math.min(960, Math.round(interp.numarg(b, 0)))));
    }

    private primChangePenSize(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        if (s != null) s.runtime.setPenSize(s.runtime.penWidth + interp.numarg(b, 0));
    }

    private primStamp(b: BlockModel, interp: Interpreter): void {
        let s: SpriteModel = interp.targetSprite();
        // In 3D mode, get the alpha from the ghost filter
        // Otherwise, it can be easily accessed from the color transform.
        // let alpha: number = (Scratch.app.isIn3D ?
        // 1.0 - (Math.max(0, Math.min(s.filterPack.getFilterSetting( "ghost "), 100)) / 100) :
        //  s.img.transform.colorTransform.alphaMultiplier);
        let alpha: number = 0.5; // s.runtime.svg
//        .transform.colorTransform.alphaMultiplier;


        MotionAndPenPrims.doStamp(s, alpha, interp);
    }

    private static doStamp(s: SpriteModel, stampAlpha: number, interp: Interpreter): void {
        if (s === null) return;
        interp.stage.runtime.stampSprite(s, stampAlpha);
        interp.redraw();
    }

    private static moveSpriteTo(s: SpriteModel, interp: Interpreter, newX: number, newY: number): void {
        if (!(s.stage instanceof StageModel)) return; // don "t move while being dragged
        let oldX: number = s.x;
        let oldY: number = s.y;
        s.x = newX;
        s.y = newY;

        s.runtime.keepOnStage();
        s.runtime.redraw();

        if (s.runtime.penIsDown) MotionAndPenPrims.stroke(s, interp, oldX, oldY, s.x, s.y);
        if ((s.runtime.penIsDown) || (s.visible)) interp.redraw();
    }

    private static stroke(s: SpriteModel, interp: Interpreter, oldX: number, oldY: number, newX: number, newY: number): void {
        console.log("todo stroke");
        // let g: Graphics = interp.stage.newPenStrokes.graphics;
        // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
        // if (alpha === 0) alpha = 1;
        // g.lineStyle(s.runtime.penWidth, 0xFFFFFF & s.runtime.penColorCache, alpha);
        // g.moveTo(240 + oldX, 180 - oldY);
        // g.lineTo(240 + newX, 180 - newY);
        // trace( "pen line( "+oldX+ ",  "+oldY+ ",  "+newX+ ",  "+newY+ ") ");
        interp.stage.runtime.penActivity = true;
    }

    private static turnAwayFromEdge(s: SpriteModel): boolean {
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

    private static ensureOnStageOnBounce(s: SpriteModel, interp: Interpreter): void {
        let r: Rectangle = s.runtime.bounds();
        if (r.left < 0) MotionAndPenPrims.moveSpriteTo(s, interp, s.x - r.left, s.y);
        if (r.top < 0) MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + r.top);
        if (r.right > StageModel.STAGEW) {
            MotionAndPenPrims.moveSpriteTo(s, interp, s.x - (r.right - StageModel.STAGEW), s.y);
        }
        if (r.bottom > StageModel.STAGEH) {
            MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + (r.bottom - StageModel.STAGEH));
        }
    }

}
