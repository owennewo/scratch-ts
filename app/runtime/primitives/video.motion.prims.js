System.register([], function(exports_1) {
    var VideoMotionPrims;
    return {
        setters:[],
        execute: function() {
            // VideoMotionPrims.as
            // Tony Hwang and John Maloney, January 2011
            //
            // Video motion sensing primitives.
            VideoMotionPrims = (function () {
                function VideoMotionPrims() {
                    this.toDegree = 180 / Math.PI;
                    this.WIDTH = 480;
                    this.HEIGHT = 360;
                    this.AMOUNT_SCALE = 100; // chosen empirically to give a range of roughly 0-100
                    this.THRESHOLD = 10;
                    this.WINSIZE = 8;
                    this.gradA2Array = new Array(this.WIDTH * this.HEIGHT, 1);
                    this.gradA1B2Array = new Array(this.WIDTH * this.HEIGHT, 1);
                    this.gradB1Array = new Array(this.WIDTH * this.HEIGHT, 1);
                    this.gradC2Array = new Array(this.WIDTH * this.HEIGHT, 1);
                    this.gradC1Array = new Array(this.WIDTH * this.HEIGHT, 1);
                    //      this.frameBuffer = new BitmapData(this.WIDTH, this.HEIGHT);
                }
                VideoMotionPrims.prototype.addPrimsTo = function (primTable) {
                    primTable["senseVideoMotion"] = this.primVideoMotion;
                    VideoMotionPrims.readMotionSensor = this.getMotionOn;
                };
                VideoMotionPrims.prototype.primVideoMotion = function (b, interp) {
                    // let motionType: string = this.interp.arg(b, 0);
                    // let obj: ObjectModel = this.app.stage.objNamed(String(this.interp.arg(b, 1)));
                    // if ("this sprite" === this.interp.arg(b, 1)) obj = this.interp.targetObj();
                    // return this.getMotionOn(motionType, obj);
                    return -1;
                };
                VideoMotionPrims.prototype.getMotionOn = function (motionType, obj) {
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
                };
                // start/stop getting step() calls from runtime:
                // private startMotionDetector(): void { this.app.runtime.motionDetector = this; }
                // private stopMotionDetector(): void { this.app.runtime.motionDetector = null; }
                VideoMotionPrims.prototype.step = function () {
                    console.log("todo video motion step");
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
                };
                VideoMotionPrims.prototype.getLocalMotion = function (s) {
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
                };
                VideoMotionPrims.prototype.analyzeFrame = function () {
                    if (!this.curr || !this.prev) {
                        this.motionAmount = this.motionDirection = -1;
                        return; // don"t have two frames to analyze yet
                    }
                    var winStep = this.WINSIZE * 2 + 1;
                    var wmax = this.WIDTH - this.WINSIZE - 1;
                    var hmax = this.HEIGHT - this.WINSIZE - 1;
                    var i, j, k, l;
                    var address;
                    var A2, A1B2, B1, C1, C2;
                    var u, v, uu, vv, n;
                    uu = vv = n = 0;
                    for (i = this.WINSIZE + 1; i < hmax; i += winStep) {
                        for (j = this.WINSIZE + 1; j < wmax; j += winStep) {
                            A2 = 0;
                            A1B2 = 0;
                            B1 = 0;
                            C1 = 0;
                            C2 = 0;
                            for (k = -this.WINSIZE; k <= this.WINSIZE; k++) {
                                for (l = -this.WINSIZE; l <= this.WINSIZE; l++) {
                                    var gradX = void 0, gradY = void 0, gradT = void 0;
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
                            var delta = (A1B2 * A1B2 - A2 * B1);
                            if (delta) {
                                // system is not singular - solving by Kramer method
                                var deltaX = -(C1 * A1B2 - C2 * B1);
                                var deltaY = -(A1B2 * C2 - A2 * C1);
                                var Idelta = 8 / delta;
                                u = deltaX * Idelta;
                                v = deltaY * Idelta;
                            }
                            else {
                                // singular system - find optical flow in gradient direction
                                var Norm = (A1B2 + A2) * (A1B2 + A2) + (B1 + A1B2) * (B1 + A1B2);
                                if (Norm) {
                                    var IGradNorm = 8 / Norm;
                                    var temp = -(C1 + C2) * IGradNorm;
                                    u = (A1B2 + A2) * temp;
                                    v = (B1 + A1B2) * temp;
                                }
                                else {
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
                };
                return VideoMotionPrims;
            })();
            exports_1("VideoMotionPrims", VideoMotionPrims);
        }
    }
});
//# sourceMappingURL=video.motion.prims.js.map