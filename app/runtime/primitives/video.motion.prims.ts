import {StageModel} from "../../model/stage.model";
import {ObjectModel} from "../../model/object.model";
import {Scratch} from "../scratch";
import {Interpreter} from "../interpreter";
import {SpriteModel} from "../../model/sprite.model";
import {BlockModel} from "../../model/block.model";
// VideoMotionPrims.as
// Tony Hwang and John Maloney, January 2011
//
// Video motion sensing primitives.


export class VideoMotionPrims {

    public static readMotionSensor: Function;

    private toDegree: number = 180 / Math.PI;
    private WIDTH: number = 480;
    private HEIGHT: number = 360;
    private AMOUNT_SCALE: number = 100; // chosen empirically to give a range of roughly 0-100
    private THRESHOLD: number = 10;
    private WINSIZE: number = 8;

    private stage: StageModel;
    private interp: Interpreter;

    private gradA2Array: number[] = new Array<number>(this.WIDTH * this.HEIGHT, 1);
    private gradA1B2Array: number[] = new Array<number>(this.WIDTH * this.HEIGHT, 1);
    private gradB1Array: number[] = new Array<number>(this.WIDTH * this.HEIGHT, 1);
    private gradC2Array: number[] = new Array<number>(this.WIDTH * this.HEIGHT, 1);
    private gradC1Array: number[] = new Array<number>(this.WIDTH * this.HEIGHT, 1);

    private motionAmount: number;
    private motionDirection: number;
    private analysisDone: boolean;

    private frameNum: number;
//    private frameBuffer: BitmapData;
    private curr: number[];
    private prev: number[];

    constructor(stage: StageModel, interpreter: Interpreter) {
        this.stage = stage;
        this.interp = interpreter;
  //      this.frameBuffer = new BitmapData(this.WIDTH, this.HEIGHT);
    }

    public addPrimsTo(primTable: any): void {
        primTable["senseVideoMotion"] = this.primVideoMotion;
        VideoMotionPrims.readMotionSensor = this.getMotionOn;
    }

    private primVideoMotion(b: BlockModel): number {
        // let motionType: string = this.interp.arg(b, 0);
        // let obj: ObjectModel = this.app.stage.objNamed(String(this.interp.arg(b, 1)));
        // if ("this sprite" === this.interp.arg(b, 1)) obj = this.interp.targetObj();
        // return this.getMotionOn(motionType, obj);
        return -1;
    }

    private getMotionOn(motionType: string, obj: ObjectModel): number {
        // if (!obj) return 0;
        // this.startMotionDetector();
        // if (!this.analysisDone) this.analyzeFrame();
        // if (obj.isStage) {
        //     if (motionType === "direction") return this.motionDirection;
        //     if (motionType === "motion") return Math.min(100, this.motionAmount);
        // } else {
        //     let s: SpriteModel = <SpriteModel>obj;
        //     if (this.analysisDone) this.getLocalMotion(s);
        //     if (motionType === "direction") return s.localMotionDirection;
        //     if (motionType === "motion") return Math.min(100, s.localMotionAmount);
        // }
        return 0;
    }

    // start/stop getting step() calls from runtime:
    // private startMotionDetector(): void { this.app.runtime.motionDetector = this; }
    // private stopMotionDetector(): void { this.app.runtime.motionDetector = null; }

    public step() {
      console.log ("todo video motion step");
        // this.frameNum++;
        // let sprites: any[] = this.app.stage.sprites();
        // if (!(this.app.stage && this.app.stage.videoImage)) {
        //     this.prev = this.curr = null;
        //     this.motionAmount = this.motionDirection = 0;
        //     for (let i: number = 0; i < sprites.length; i++) {
        //         sprites[i].localMotionAmount = 0;
        //         sprites[i].localMotionDirection = 0;
        //     }
        //     this.analysisDone = true;
        //     this.stopMotionDetector();
        //     return;
        // }

        // let img: BitmapData = this.app.stagePane.videoImage.bitmapData;
        // let scale: number = Math.min(this.WIDTH / img.width, this.HEIGHT / img.height);
        // let m: Matrix = new Matrix();
        // m.scale(scale, scale);
        // this.frameBuffer.draw(img, m);
        //
        this.prev = this.curr;
        // this.curr = this.frameBuffer.getVector(this.frameBuffer.rect);
        this.analysisDone = false;
    }

    private getLocalMotion(s: SpriteModel): void {
        // if (!this.curr || !this.prev) {
        //     s.localMotionAmount = s.localMotionDirection = -1;
        //     return; // don"t have two frames to analyze yet
        // }
        // if (s.localFrameNum !== this.frameNum) {
        //     let i: number, j: number;
        //     let address: number;
        //     let activePixelNum: number;
        //
        //     let A2: number, A1B2: number, B1: number, C1: number, C2: number;
        //     let u: number, v: number, uu: number, vv: number;
        //
        //     let boundingRect: Rectangle = s.bounds(); // bounding rectangle for sprite
        //     let xmin: number = boundingRect.left;
        //     let xmax: number = boundingRect.right;
        //     let ymin: number = boundingRect.top;
        //     let ymax: number = boundingRect.bottom;
        //     let scaleFactor: number = 0;
        //
        //     A2 = 0;
        //     A1B2 = 0;
        //     B1 = 0;
        //     C1 = 0;
        //     C2 = 0;
        //     activePixelNum = 0;
        //     for (i = ymin; i < ymax; i++) { // y
        //         for (j = xmin; j < xmax; j++) { // x
        //             if (j > 0 && (j < this.WIDTH - 1) && i > 0 && (i < this.HEIGHT - 1)
        //                 && ((s.bitmap().getPixel32(j - xmin, i - ymin) >> 24 & 0xff) === 0xff)) {
        //                 address = i * this.WIDTH + j;
        //                 A2 += this.gradA2Array[address];
        //                 A1B2 += this.gradA1B2Array[address];
        //                 B1 += this.gradB1Array[address];
        //                 C2 += this.gradC2Array[address];
        //                 C1 += this.gradC1Array[address];
        //                 scaleFactor++;
        //             }
        //         }
        //     }
        //     let delta: number = (A1B2 * A1B2 - A2 * B1);
        //     if (delta) {
        //         // system is not singular - solving by Kramer method
        //         let deltaX: number = -(C1 * A1B2 - C2 * B1);
        //         let deltaY: number = -(A1B2 * C2 - A2 * C1);
        //         let Idelta: number = 8 / delta;
        //         u = deltaX * Idelta;
        //         v = deltaY * Idelta;
        //     } else {
        //         // singular system - find optical flow in gradient direction
        //         let Norm: number = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
        //         if (Norm) {
        //             let IGradNorm: number = 8 / Norm;
        //             let temp: number = -(C1 + C2) * IGradNorm;
        //             u = (A1B2 + A2) * temp;
        //             v = (B1 + A1B2) * temp;
        //         } else {
        //             u = v = 0;
        //         }
        //     }
        //
        //     if (scaleFactor !== 0) {
        //         activePixelNum = scaleFactor; // store the area of the sprite in pixels
        //         scaleFactor /= (2 * this.WINSIZE * 2 * this.WINSIZE);
        //
        //         u = u / scaleFactor;
        //         v = v / scaleFactor;
        //     }
        //
        //     s.localMotionAmount = Math.round(this.AMOUNT_SCALE * 2e-4 * activePixelNum * Math.sqrt((u * u) + (v * v))); // note 2e-4 *activePixelNum is an experimentally tuned threshold for my logitech Pro 9000 webcam - TTH
        //     if (s.localMotionAmount > 100) // clip all magnitudes greater than 100
        //         s.localMotionAmount = 100;
        //     if (s.localMotionAmount > (this.THRESHOLD / 3)) {
        //         s.localMotionDirection = ((Math.atan2(v, u) * this.toDegree + 270) % 360) - 180; // Scratch direction
        //     }
        //     s.localFrameNum = this.frameNum;
        // }
    }

    private analyzeFrame(): void {
        if (!this.curr || !this.prev) {
            this.motionAmount = this.motionDirection = -1;
            return; // don"t have two frames to analyze yet
        }
        let winStep: number = this.WINSIZE * 2 + 1;
        let wmax: number = this.WIDTH - this.WINSIZE - 1;
        let hmax: number = this.HEIGHT - this.WINSIZE - 1;

        let i: number, j: number, k: number, l: number;
        let address: number;

        let A2: number, A1B2: number, B1: number, C1: number, C2: number;
        let u: number, v: number, uu: number, vv: number, n: number;

        uu = vv = n = 0;
        for (i = this.WINSIZE + 1; i < hmax; i += winStep) { // y
            for (j = this.WINSIZE + 1; j < wmax; j += winStep) { // x
                A2 = 0;
                A1B2 = 0;
                B1 = 0;
                C1 = 0;
                C2 = 0;
                for (k = -this.WINSIZE; k <= this.WINSIZE; k++) { // y
                    for (l = -this.WINSIZE; l <= this.WINSIZE; l++) { // x
                        let gradX: number, gradY: number, gradT: number;

                        address = (i + k) * this.WIDTH + j + l;
                        gradX = (this.curr[address - 1] & 0xff) - (this.curr[address + 1] & 0xff);
                        gradY = (this.curr[address - this.WIDTH] & 0xff) - (this.curr[address + this.WIDTH] & 0xff);
                        gradT = (this.prev[address] & 0xff) - (this.curr[address] & 0xff);

                        this.gradA2Array[address] = gradX * gradX;
                        this.gradA1B2Array[address] = gradX * gradY;
                        this.gradB1Array[address] = gradY * gradY;
                        this.gradC2Array[address] = gradX * gradT;
                        this.gradC1Array[address] = gradY * gradT;

                        A2 += this.gradA2Array[address];
                        A1B2 += this.gradA1B2Array[address];
                        B1 += this.gradB1Array[address];
                        C2 += this.gradC2Array[address];
                        C1 += this.gradC1Array[address];
                    }
                }
                let delta: number = (A1B2 * A1B2 - A2 * B1);
                if (delta) {
                    // system is not singular - solving by Kramer method
                    let deltaX: number = -(C1 * A1B2 - C2 * B1);
                    let deltaY: number = -(A1B2 * C2 - A2 * C1);
                    let Idelta: number = 8 / delta;
                    u = deltaX * Idelta;
                    v = deltaY * Idelta;
                } else {
                    // singular system - find optical flow in gradient direction
                    let Norm: number = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
                    if (Norm) {
                        let IGradNorm: number = 8 / Norm;
                        let temp: number = -(C1 + C2) * IGradNorm;
                        u = (A1B2 + A2) * temp;
                        v = (B1 + A1B2) * temp;
                    } else {
                        u = v = 0;
                    }
                }
                if (-winStep < u && u < winStep && -winStep < v && v < winStep) {
                    uu += u;
                    vv += v;
                    n++;
                }
            }
        }
        uu /= n;
        vv /= n;
        this.motionAmount = Math.round(this.AMOUNT_SCALE * Math.sqrt((uu * uu) + (vv * vv)));
        if (this.motionAmount > this.THRESHOLD) {
            this.motionDirection = ((Math.atan2(vv, uu) * this.toDegree + 270) % 360) - 180; // Scratch direction
        }
        this.analysisDone = true;
    }

}
