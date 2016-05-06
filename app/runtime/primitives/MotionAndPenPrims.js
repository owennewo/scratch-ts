System.register([], function(exports_1) {
    "use strict";
    var MotionAndPenPrims;
    return {
        setters:[],
        execute: function() {
            // MotionAndPenPrims.as
            // John Maloney, April 2010
            //
            // Scratch motion and pen primitives.
            MotionAndPenPrims = (function () {
                function MotionAndPenPrims(app, interpreter) {
                    this.app = app;
                    this.interp = interpreter;
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
                MotionAndPenPrims.prototype.primMove = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    var radians = (Math.PI * (90 - s.direction)) / 180;
                    var d = this.interp.numarg(b, 0);
                    this.moveSpriteTo(s, s.x + (d * Math.cos(radians)), s.y + (d * Math.sin(radians)));
                };
                MotionAndPenPrims.prototype.primTurnRight = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null) {
                        s.setDirection(s.direction + this.interp.numarg(b, 0));
                        if (s.visible)
                            this.interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primTurnLeft = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null) {
                        s.setDirection(s.direction - this.interp.numarg(b, 0));
                        if (s.visible)
                            this.interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primSetDirection = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null) {
                        s.setDirection(this.interp.numarg(b, 0));
                        if (s.visible)
                            this.interp.redraw();
                    }
                };
                MotionAndPenPrims.prototype.primPointTowards = function (b) {
                    var s = this.interp.targetSprite();
                    var p = this.mouseOrSpritePosition(this.interp.arg(b, 0));
                    if ((s === null) || (p === null))
                        return;
                    var dx = p.x - s.x;
                    var dy = p.y - s.y;
                    var angle = 90 - ((Math.atan2(dy, dx) * 180) / Math.PI);
                    s.setDirection(angle);
                    if (s.visible)
                        this.interp.redraw();
                };
                MotionAndPenPrims.prototype.primGoTo = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        this.moveSpriteTo(s, this.interp.numarg(b, 0), this.interp.numarg(b, 1));
                };
                MotionAndPenPrims.prototype.primGoToSpriteOrMouse = function (b) {
                    var s = this.interp.targetSprite();
                    var p = this.mouseOrSpritePosition(this.interp.arg(b, 0));
                    if ((s === null) || (p === null))
                        return;
                    this.moveSpriteTo(s, p.x, p.y);
                };
                MotionAndPenPrims.prototype.primGlide = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    if (this.interp.activeThread.firstTime) {
                        var secs = this.interp.numarg(b, 0);
                        var destX = this.interp.numarg(b, 1);
                        var destY = this.interp.numarg(b, 2);
                        if (secs <= 0) {
                            this.moveSpriteTo(s, destX, destY);
                            return;
                        }
                        // record state: [0]start msecs, [1]duration, [2]startX, [3]startY, [4]endX, [5]endY
                        this.interp.activeThread.tmpObj =
                            [this.interp.currentMSecs, 1000 * secs, s.x, s.y, destX, destY];
                        this.interp.startTimer(secs);
                    }
                    else {
                        var state = this.interp.activeThread.tmpObj;
                        if (!this.interp.checkTimer()) {
                            // in progress: move to intermediate position along path
                            var frac = (this.interp.currentMSecs - state[0]) / state[1];
                            var newX = state[2] + (frac * (state[4] - state[2]));
                            var newY = state[3] + (frac * (state[5] - state[3]));
                            this.moveSpriteTo(s, newX, newY);
                        }
                        else {
                            // finished: move to final position and clear state
                            this.moveSpriteTo(s, state[4], state[5]);
                            this.interp.activeThread.tmpObj = null;
                        }
                    }
                };
                MotionAndPenPrims.prototype.mouseOrSpritePosition = function (arg) {
                    if (arg === "_mouse_") {
                        var w = this.app.stagePane;
                        return new Point(w.scratchMouseX(), w.scratchMouseY());
                    }
                    else {
                        var s = this.app.stagePane.spriteNamed(arg);
                        if (s === null)
                            return null;
                        return new Point(s.x, s.y);
                    }
                    return null;
                };
                MotionAndPenPrims.prototype.primChangeX = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        this.moveSpriteTo(s, s.x + this.interp.numarg(b, 0), s.y);
                };
                MotionAndPenPrims.prototype.primSetX = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        this.moveSpriteTo(s, this.interp.numarg(b, 0), s.y);
                };
                MotionAndPenPrims.prototype.primChangeY = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        this.moveSpriteTo(s, s.x, s.y + this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetY = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        this.moveSpriteTo(s, s.x, this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primBounceOffEdge = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    if (!this.turnAwayFromEdge(s))
                        return;
                    this.ensureOnStageOnBounce(s);
                    if (s.visible)
                        this.interp.redraw();
                };
                MotionAndPenPrims.prototype.primXPosition = function (b) {
                    var s = this.interp.targetSprite();
                    return (s != null) ? this.snapToInteger(s.x) : 0;
                };
                MotionAndPenPrims.prototype.primYPosition = function (b) {
                    var s = this.interp.targetSprite();
                    return (s != null) ? this.snapToInteger(s.y) : 0;
                };
                MotionAndPenPrims.prototype.primDirection = function (b) {
                    var s = this.interp.targetSprite();
                    return (s != null) ? this.snapToInteger(s.direction) : 0;
                };
                MotionAndPenPrims.prototype.snapToInteger = function (n) {
                    var rounded = Math.round(n);
                    var delta = n - rounded;
                    if (delta < 0)
                        delta = -delta;
                    return (delta < 0.00000001) ? rounded : n;
                };
                MotionAndPenPrims.prototype.primClear = function (b) {
                    this.app.stagePane.clearPenStrokes();
                    this.interp.redraw();
                };
                MotionAndPenPrims.prototype.primPenDown = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.penIsDown = true;
                    this.touch(s, s.x, s.y);
                    this.interp.redraw();
                };
                MotionAndPenPrims.prototype.touch = function (s, x, y) {
                    var g = this.app.stagePane.newPenStrokes.graphics;
                    // g.lineStyle();
                    var alpha = (0xFF & (s.penColorCache >> 24)) / 0xFF;
                    if (alpha === 0)
                        alpha = 1;
                    g.beginFill(0xFFFFFF & s.penColorCache, alpha);
                    g.drawCircle(240 + x, 180 - y, s.penWidth / 2);
                    g.endFill();
                    this.app.stagePane.penActivity = true;
                };
                MotionAndPenPrims.prototype.primPenUp = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.penIsDown = false;
                };
                MotionAndPenPrims.prototype.primSetPenColor = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenColor(this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenHue = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenHue(this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primChangePenHue = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenHue(s.penHue + this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenShade = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenShade(this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primChangePenShade = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenShade(s.penShade + this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primSetPenSize = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenSize(Math.max(1, Math.min(960, Math.round(this.interp.numarg(b, 0)))));
                };
                MotionAndPenPrims.prototype.primChangePenSize = function (b) {
                    var s = this.interp.targetSprite();
                    if (s != null)
                        s.setPenSize(s.penWidth + this.interp.numarg(b, 0));
                };
                MotionAndPenPrims.prototype.primStamp = function (b) {
                    var s = this.interp.targetSprite();
                    // In 3D mode, get the alpha from the ghost filter
                    // Otherwise, it can be easily accessed from the color transform.
                    // let alpha: number = (Scratch.app.isIn3D ?
                    // 1.0 - (Math.max(0, Math.min(s.filterPack.getFilterSetting( "ghost "), 100)) / 100) :
                    //  s.img.transform.colorTransform.alphaMultiplier);
                    var alpha = s.img.transform.colorTransform.alphaMultiplier;
                    this.doStamp(s, alpha);
                };
                MotionAndPenPrims.prototype.doStamp = function (s, stampAlpha) {
                    if (s === null)
                        return;
                    this.app.stagePane.stampSprite(s, stampAlpha);
                    this.interp.redraw();
                };
                MotionAndPenPrims.prototype.moveSpriteTo = function (s, newX, newY) {
                    if (!(s.parent instanceof ScratchStage))
                        return; // don "t move while being dragged
                    var oldX = s.x;
                    var oldY = s.y;
                    s.setScratchXY(newX, newY);
                    s.keepOnStage();
                    if (s.penIsDown)
                        this.stroke(s, oldX, oldY, s.x, s.y);
                    if ((s.penIsDown) || (s.visible))
                        this.interp.redraw();
                };
                MotionAndPenPrims.prototype.stroke = function (s, oldX, oldY, newX, newY) {
                    var g = this.app.stagePane.newPenStrokes.graphics;
                    var alpha = (0xFF & (s.penColorCache >> 24)) / 0xFF;
                    if (alpha === 0)
                        alpha = 1;
                    g.lineStyle(s.penWidth, 0xFFFFFF & s.penColorCache, alpha);
                    g.moveTo(240 + oldX, 180 - oldY);
                    g.lineTo(240 + newX, 180 - newY);
                    // trace( "pen line( "+oldX+ ",  "+oldY+ ",  "+newX+ ",  "+newY+ ") ");
                    this.app.stagePane.penActivity = true;
                };
                MotionAndPenPrims.prototype.turnAwayFromEdge = function (s) {
                    // turn away from the nearest edge if it "s close enough; otherwise do nothing
                    // Note: comparisons are in the stage coordinates, with origin (0, 0)
                    // use bounding rect of the sprite to account for costume rotation and scale
                    var r = s.bounds();
                    // measure distance to edges
                    var d1 = Math.max(0, r.left);
                    var d2 = Math.max(0, r.top);
                    var d3 = Math.max(0, ScratchObj.STAGEW - r.right);
                    var d4 = Math.max(0, ScratchObj.STAGEH - r.bottom);
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
                    s.setDirection(newDir);
                    return true;
                };
                MotionAndPenPrims.prototype.ensureOnStageOnBounce = function (s) {
                    var r = s.bounds();
                    if (r.left < 0)
                        this.moveSpriteTo(s, s.x - r.left, s.y);
                    if (r.top < 0)
                        this.moveSpriteTo(s, s.x, s.y + r.top);
                    if (r.right > ScratchObj.STAGEW) {
                        this.moveSpriteTo(s, s.x - (r.right - ScratchObj.STAGEW), s.y);
                    }
                    if (r.bottom > ScratchObj.STAGEH) {
                        this.moveSpriteTo(s, s.x, s.y + (r.bottom - ScratchObj.STAGEH));
                    }
                };
                return MotionAndPenPrims;
            }());
            exports_1("MotionAndPenPrims", MotionAndPenPrims);
        }
    }
});
//# sourceMappingURL=MotionAndPenPrims.js.map