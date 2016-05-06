System.register(["../../utils/graphics"], function(exports_1) {
    "use strict";
    var graphics_1;
    var TalkBubble;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            TalkBubble = (function () {
                function TalkBubble(s, type, style, source) {
                    this.outlineColor = 0xA0A0A0;
                    this.radius = 8; // corner radius
                    this.padding = 5;
                    this.minWidth = 55;
                    this.pInset1 = 16;
                    this.pInset2 = 50;
                    this.pDrop = 17;
                    this.pDropX = 8;
                    this.lineWidth = 3;
                    this.type = type;
                    this.style = style;
                    this.source = source;
                    if (style === "ask") {
                        this.outlineColor = 0x4AADDE;
                    }
                    else if (style === "result") {
                        this.outlineColor = 0x888888;
                        this.minWidth = 16;
                        this.padding = 3;
                        this.radius = 5;
                        this.pInset1 = 8;
                        this.pInset2 = 16;
                        this.pDrop = 5;
                        this.pDropX = 4;
                        this.lineWidth = 0.5;
                    }
                    this.pointsLeft = true;
                    this.setText(s);
                }
                TalkBubble.prototype.setDirection = function (dir) {
                    // set direction of balloon tail to 'left' or 'right'
                    // and redraw balloon if necessary
                    var newValue = (dir === "left");
                    if (this.pointsLeft === newValue)
                        return;
                    this.pointsLeft = newValue;
                    var box = this.svgText.getBBox();
                    this.setWidthHeight(box.width + this.padding * 2, box.height + this.padding * 2);
                };
                TalkBubble.prototype.getText = function () { return this.text; };
                TalkBubble.prototype.getSource = function () { return this.source; };
                TalkBubble.prototype.setText = function (s) {
                    var desiredWidth = 135;
                    // this.text.width = desiredWidth + 100; // wider than desiredWidth
                    //
                    if (!this.svgText) {
                        this.svgText = graphics_1.Graphics.StagePane.drawText(0, 0, s);
                    }
                    var box = this.svgText.getBBox();
                    this.text = s;
                    var bestWidth = Math.max(this.minWidth, Math.min(box.w + 8, desiredWidth)); // fix word wrap
                    this.setWidthHeight(bestWidth + this.padding * 2, box.height + this.padding * 2);
                };
                TalkBubble.prototype.setWidthHeight = function (w, h) {
                    if (this.type === "think")
                        this.drawThink(w, h);
                    else
                        this.drawTalk(w, h);
                };
                TalkBubble.prototype.drawTalk = function (w, h) {
                    var insetW = w - this.radius;
                    var insetH = h - this.radius;
                    // pointer geometry:
                    var path = "M" + this.radius + " 0";
                    path = path + "L" + insetW + " 0";
                    path = path + "T" + w + " " + this.radius;
                    path = path + "L" + w + " " + insetH;
                    path = path + "T" + insetW + " " + h;
                    if (this.pointsLeft) {
                        path = path + "L" + this.pInset2 + " " + h;
                        path = path + "L" + this.pDropX + " " + h + this.pDrop;
                        path = path + "L" + this.pInset1 + " " + h;
                    }
                    else {
                        path = path + "L" + (w - this.pInset1) + " " + h;
                        path = path + "L" + (w - this.pDropX) + " " + h + this.pDrop;
                        path = path + "L" + (w - this.pInset2) + " " + h;
                    }
                    path = path + "L" + this.radius + " " + h;
                    path = path + "T" + 0 + " " + insetH;
                    path = path + "L" + 0 + " " + this.radius;
                    path = path + "T" + this.radius + " " + 0;
                    this.svgPath = graphics_1.Graphics.StagePane.drawPath(path);
                };
                TalkBubble.prototype.drawThink = function (w, h) {
                    var insetW = w - this.radius;
                    var insetH = h - this.radius;
                    this.startAt(this.radius, 0);
                    this.line(insetW, 0);
                    this.arc(w, this.radius);
                    this.line(w, insetH);
                    this.arc(insetW, h);
                    this.line(this.radius, h);
                    this.arc(0, insetH);
                    this.line(0, this.radius);
                    this.arc(this.radius, 0);
                    if (this.pointsLeft) {
                        this.ellipse(16, h + 2, 12, 7, 2);
                        this.ellipse(12, h + 10, 8, 5, 2);
                        this.ellipse(6, h + 15, 6, 4, 1);
                    }
                    else {
                        this.ellipse(w - 29, h + 2, 12, 7, 2);
                        this.ellipse(w - 20, h + 10, 8, 5, 2);
                        this.ellipse(w - 12, h + 15, 6, 4, 1);
                    }
                };
                TalkBubble.prototype.startAt = function (x, y) {
                    this.shape.graphics.moveTo(x, y);
                    this.lastXY = [x, y];
                };
                TalkBubble.prototype.line = function (x, y) {
                    this.shape.graphics.lineTo(x, y);
                    this.lastXY = [x, y];
                };
                TalkBubble.prototype.ellipse = function (x, y, w, h, lineW) {
                    this.shape.graphics.lineStyle(lineW, this.outlineColor);
                    this.shape.graphics.drawEllipse(x, y, w, h);
                };
                TalkBubble.prototype.arc = function (x, y) {
                    // Draw a curve between two points. Compute control point by following an orthogonal vector
                    // from the midpoint of the L between p1 and p2 scaled by roundness * dist(p1, p2).
                    // If concave is true, invert the curvature.
                    var roundness = 0.42; // approximates a quarter-circle
                    var midX = (this.lastXY[0] + x) / 2.0;
                    var midY = (this.lastXY[1] + y) / 2.0;
                    var cx = midX + (roundness * (y - this.lastXY[1]));
                    var cy = midY - (roundness * (x - this.lastXY[0]));
                    this.shape.graphics.curveTo(cx, cy, x, y);
                    this.lastXY = [x, y];
                };
                return TalkBubble;
            }());
            exports_1("TalkBubble", TalkBubble);
        }
    }
});
//# sourceMappingURL=bubble.shape.js.map