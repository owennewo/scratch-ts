System.register(["../../utils/graphics", "../../model/stage.model", "../../shapes/geometry"], function(exports_1) {
    var graphics_1, stage_model_1, geometry_1;
    var MotionAndPenPrims;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }],
        execute: function() {
            // MotionAndPenPrims.as
            // John Maloney, April 2010
            //
            // Scratch motion and pen primitives.
            MotionAndPenPrims = (function () {
                function MotionAndPenPrims() {
                }
                MotionAndPenPrims.prototype.addPrimsTo = function (primTable) {
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
                };
                MotionAndPenPrims.prototype.primMove = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    var radians = (Math.PI * (90 - s.direction)) / 180;
                    var d = interp.numarg(b, 0);
                    MotionAndPenPrims.moveSpriteTo(s, interp, s.x + (d * Math.cos(radians)), s.y + (d * Math.sin(radians)));
                };
                ;
                MotionAndPenPrims.prototype.primTurnRight = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null) {
                        s.direction = s.direction + interp.numarg(b, 0);
                        if (s.visible)
                            interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primTurnLeft = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null) {
                        s.direction = s.direction - interp.numarg(b, 0);
                        s.runtime.redraw();
                        if (s.visible)
                            interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primSetDirection = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null) {
                        s.direction = interp.numarg(b, 0);
                        s.runtime.redraw();
                        if (s.visible)
                            interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primPointTowards = function (b, interp) {
                    var s = interp.targetSprite();
                    var p = MotionAndPenPrims.mouseOrSpritePosition(interp.arg(b, 0), interp);
                    if ((s === null) || (p === null))
                        return;
                    var dx = p.x - s.x;
                    var dy = p.y - s.y;
                    var angle = 90 - ((Math.atan2(dy, dx) * 180) / Math.PI);
                    s.direction = angle;
                    if (s.visible)
                        interp.redraw();
                };
                MotionAndPenPrims.prototype.primGoTo = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        MotionAndPenPrims.moveSpriteTo(s, interp, interp.numarg(b, 0), interp.numarg(b, 1));
                };
                MotionAndPenPrims.prototype.primGoToSpriteOrMouse = function (b, interp) {
                    var s = interp.targetSprite();
                    var p = MotionAndPenPrims.mouseOrSpritePosition(interp.arg(b, 0), interp);
                    if ((s === null) || (p === null))
                        return;
                    MotionAndPenPrims.moveSpriteTo(s, interp, p.x, p.y);
                };
                MotionAndPenPrims.prototype.primGlide = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    if (interp.activeThread.firstTime) {
                        var secs = interp.numarg(b, 0);
                        var destX = interp.numarg(b, 1);
                        var destY = interp.numarg(b, 2);
                        if (secs <= 0) {
                            MotionAndPenPrims.moveSpriteTo(s, interp, destX, destY);
                            return;
                        }
                        // record state: [0]start msecs, [1]duration, [2]startX, [3]startY, [4]endX, [5]endY
                        interp.activeThread.tmpObj =
                            [interp.currentMSecs, 1000 * secs, s.x, s.y, destX, destY];
                        interp.startTimer(secs);
                    }
                    else {
                        var state = interp.activeThread.tmpObj;
                        if (!interp.checkTimer()) {
                            // in progress: move to intermediate position along path
                            var frac = (interp.currentMSecs - state[0]) / state[1];
                            var newX = state[2] + (frac * (state[4] - state[2]));
                            var newY = state[3] + (frac * (state[5] - state[3]));
                            MotionAndPenPrims.moveSpriteTo(s, interp, newX, newY);
                        }
                        else {
                            // finished: move to final position and clear state
                            MotionAndPenPrims.moveSpriteTo(s, interp, state[4], state[5]);
                            interp.activeThread.tmpObj = null;
                        }
                    }
                };
                MotionAndPenPrims.mouseOrSpritePosition = function (arg, interp) {
                    if (arg === "_mouse_") {
                        var w = interp.stage;
                        return new geometry_1.Point(w.runtime.mouseX, w.runtime.mouseY);
                    }
                    else {
                        var s = interp.stage.spriteNamed(arg);
                        if (s === null)
                            return null;
                        return new geometry_1.Point(s.x, s.y);
                    }
                };
                MotionAndPenPrims.prototype.primChangeX = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x + interp.numarg(b, 0), s.y);
                };
                MotionAndPenPrims.prototype.primSetX = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        MotionAndPenPrims.moveSpriteTo(s, interp, interp.numarg(b, 0), s.y);
                };
                MotionAndPenPrims.prototype.primChangeY = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetY = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x, interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primBounceOffEdge = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    if (!MotionAndPenPrims.turnAwayFromEdge(s))
                        return;
                    MotionAndPenPrims.ensureOnStageOnBounce(s, interp);
                    if (s.visible)
                        interp.redraw();
                };
                MotionAndPenPrims.prototype.primXPosition = function (b, interp) {
                    var s = interp.targetSprite();
                    return (s != null) ? MotionAndPenPrims.snapToInteger(s.x) : 0;
                };
                MotionAndPenPrims.prototype.primYPosition = function (b, interp) {
                    var s = interp.targetSprite();
                    return (s != null) ? MotionAndPenPrims.snapToInteger(s.y) : 0;
                };
                MotionAndPenPrims.prototype.primDirection = function (b, interp) {
                    var s = interp.targetSprite();
                    return (s != null) ? MotionAndPenPrims.snapToInteger(s.direction) : 0;
                };
                MotionAndPenPrims.snapToInteger = function (n) {
                    var rounded = Math.round(n);
                    var delta = n - rounded;
                    if (delta < 0)
                        delta = -delta;
                    return (delta < 0.00000001) ? rounded : n;
                };
                MotionAndPenPrims.prototype.primClear = function (b, interp) {
                    interp.stage.runtime.clearPenStrokes();
                    interp.redraw();
                };
                MotionAndPenPrims.prototype.primPenDown = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.penIsDown = true;
                    MotionAndPenPrims.touch(s, interp, s.x, s.y);
                    interp.redraw();
                };
                MotionAndPenPrims.touch = function (s, interp, x, y) {
                    // let g: Graphics = interp.stage.newPenStrokes.graphics;
                    // // g.lineStyle();
                    // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
                    // if (alpha === 0) alpha = 1;
                    // g.beginFill(0xFFFFFF & s.runtime.penColorCache, alpha);
                    // g.drawCircle(240 + x, 180 - y, s.runtime.penWidth / 2);
                    // g.endFill();
                    console.log("todo touch");
                    interp.stage.runtime.penActivity = true;
                };
                MotionAndPenPrims.prototype.primPenUp = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.penIsDown = false;
                };
                MotionAndPenPrims.prototype.primSetPenColor = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenColor(interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenHue = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenHue(interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primChangePenHue = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenHue(s.runtime.penHue + interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenShade = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenShade(interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primChangePenShade = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenShade(s.runtime.penShade + interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenSize = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenSize(Math.max(1, Math.min(960, Math.round(interp.numarg(b, 0)))));
                };
                MotionAndPenPrims.prototype.primChangePenSize = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s != null)
                        s.runtime.setPenSize(s.runtime.penWidth + interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primStamp = function (b, interp) {
                    var s = interp.targetSprite();
                    // In 3D mode, get the alpha from the ghost filter
                    // Otherwise, it can be easily accessed from the color transform.
                    // let alpha: number = (Scratch.app.isIn3D ?
                    // 1.0 - (Math.max(0, Math.min(s.filterPack.getFilterSetting( "ghost "), 100)) / 100) :
                    //  s.img.transform.colorTransform.alphaMultiplier);
                    var alpha = 0.5; // s.runtime.svg
                    //        .transform.colorTransform.alphaMultiplier;
                    MotionAndPenPrims.doStamp(s, alpha, interp);
                };
                MotionAndPenPrims.doStamp = function (s, stampAlpha, interp) {
                    if (s === null)
                        return;
                    interp.stage.runtime.stampSprite(s, stampAlpha);
                    interp.redraw();
                };
                MotionAndPenPrims.moveSpriteTo = function (s, interp, newX, newY) {
                    if (!(s.stage instanceof stage_model_1.StageModel))
                        return; // don "t move while being dragged
                    var oldX = s.x;
                    var oldY = s.y;
                    s.x = newX;
                    s.y = newY;
                    s.runtime.keepOnStage();
                    s.runtime.redraw();
                    if (s.runtime.penIsDown)
                        MotionAndPenPrims.stroke(s, interp, oldX, oldY, s.x, s.y);
                    if ((s.runtime.penIsDown) || (s.visible))
                        interp.redraw();
                };
                MotionAndPenPrims.stroke = function (s, interp, oldX, oldY, newX, newY) {
                    // console.log("todo stroke");
                    var color = interp.targetObj().runtime.penColor;
                    var width = interp.targetObj().runtime.penWidth;
                    graphics_1.Graphics.StagePane.drawStroke(oldX, oldY, newX, newY, color, width);
                    // let g: Graphics = interp.stage.newPenStrokes.graphics;
                    // let alpha: number = (0xFF & (s.runtime.penColorCache >> 24)) / 0xFF;
                    // if (alpha === 0) alpha = 1;
                    // g.lineStyle(s.runtime.penWidth, 0xFFFFFF & s.runtime.penColorCache, alpha);
                    // g.moveTo(240 + oldX, 180 - oldY);
                    // g.lineTo(240 + newX, 180 - newY);
                    // trace( "pen line( "+oldX+ ",  "+oldY+ ",  "+newX+ ",  "+newY+ ") ");
                    interp.stage.runtime.penActivity = true;
                };
                MotionAndPenPrims.turnAwayFromEdge = function (s) {
                    // turn away from the nearest edge if it "s close enough; otherwise do nothing
                    // Note: comparisons are in the stage coordinates, with origin (0, 0)
                    // use bounding rect of the sprite to account for costume rotation and scale
                    var r = s.runtime.bounds();
                    // measure distance to edges
                    var d1 = Math.max(0, r.left);
                    var d2 = Math.max(0, r.top);
                    var d3 = Math.max(0, stage_model_1.StageModel.STAGEW - r.right);
                    var d4 = Math.max(0, stage_model_1.StageModel.STAGEH - r.bottom);
                    // find the nearest edge
                    var e = 0, minDist = 100000;
                    if (d1 < minDist) {
                        minDist = d1;
                        e = 1;
                    }
                    if (d2 < minDist) {
                        minDist = d2;
                        e = 2;
                    }
                    if (d3 < minDist) {
                        minDist = d3;
                        e = 3;
                    }
                    if (d4 < minDist) {
                        minDist = d4;
                        e = 4;
                    }
                    if (minDist > 0)
                        return false; // not touching to any edge
                    // point away from nearest edge
                    var radians = ((90 - s.direction) * Math.PI) / 180;
                    var dx = Math.cos(radians);
                    var dy = -Math.sin(radians);
                    if (e === 1) {
                        dx = Math.max(0.2, Math.abs(dx));
                    }
                    if (e === 2) {
                        dy = Math.max(0.2, Math.abs(dy));
                    }
                    if (e === 3) {
                        dx = 0 - Math.max(0.2, Math.abs(dx));
                    }
                    if (e === 4) {
                        dy = 0 - Math.max(0.2, Math.abs(dy));
                    }
                    var newDir = ((180 * Math.atan2(dy, dx)) / Math.PI) + 90;
                    s.runtime.setDirection(newDir);
                    return true;
                };
                MotionAndPenPrims.ensureOnStageOnBounce = function (s, interp) {
                    var r = s.runtime.bounds();
                    if (r.left < 0)
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x - r.left, s.y);
                    if (r.top < 0)
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + r.top);
                    if (r.right > stage_model_1.StageModel.STAGEW) {
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x - (r.right - stage_model_1.StageModel.STAGEW), s.y);
                    }
                    if (r.bottom > stage_model_1.StageModel.STAGEH) {
                        MotionAndPenPrims.moveSpriteTo(s, interp, s.x, s.y + (r.bottom - stage_model_1.StageModel.STAGEH));
                    }
                };
                return MotionAndPenPrims;
            })();
            exports_1("MotionAndPenPrims", MotionAndPenPrims);
        }
    }
});
//# sourceMappingURL=motion.and.pen.prims.js.map