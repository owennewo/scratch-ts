System.register(["../utils/graphics"], function(exports_1) {
    var graphics_1;
    var TalkBubble;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            TalkBubble = (function () {
                function TalkBubble(sprite, text, type, style) {
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
                    var id = "bubble-" + sprite.name;
                    if (!this.svg)
                        this.svg = graphics_1.Graphics.StagePane.group(id, sprite.x, sprite.y - 40, "bubble");
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
                    this.setText(text);
                }
                TalkBubble.prototype.setDirection = function (dir) {
                    // set direction of balloon tail to 'left' or 'right'
                    // and redraw balloon if necessary
                    var newValue = (dir === "left");
                    if (this.pointsLeft === newValue)
                        return;
                    this.pointsLeft = newValue;
                    var box = this.svg.getBBox();
                    this.setWidthHeight(box.width + this.padding * 2, box.height + this.padding * 2);
                };
                TalkBubble.prototype.getText = function () { return this.text; };
                TalkBubble.prototype.setText = function (s) {
                    var desiredWidth = 135;
                    // this.text.width = desiredWidth + 100; // wider than desiredWidth
                    //
                    var text = graphics_1.Graphics.StagePane.drawText(0, 0, s);
                    text.attr({
                        y: text.getBBox().h + 2,
                        x: 10
                    });
                    var box = text.getBBox();
                    this.text = s;
                    var bestWidth = Math.max(this.minWidth, Math.min(box.w + 8, desiredWidth)); // fix word wrap
                    this.setWidthHeight(bestWidth + this.padding * 2, box.height + this.padding * 2);
                    this.svg.append(text);
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
                    var svgPath = graphics_1.Graphics.StagePane.drawPath(path);
                    this.svg.append(svgPath);
                };
                TalkBubble.prototype.drawThink = function (w, h) {
                    var insetW = w - this.radius;
                    var insetH = h - this.radius;
                    var svgGroup = graphics_1.Graphics.StagePane.group("bubble", 0, 0);
                    var path = "M" + this.radius + " 0";
                    path = path + "L" + insetW + " 0";
                    path = path + "T" + w + " " + this.radius;
                    path = path + "L" + w + " " + insetH;
                    path = path + "T" + insetW + " " + h;
                    path = path + "L" + this.radius + " " + h;
                    path = path + "T0 " + insetH;
                    path = path + "L0 " + this.radius;
                    path = path + "T" + this.radius + " 0";
                    if (this.pointsLeft) {
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(16, h + 2, 12, 7, 2));
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(12, h + 10, 8, 5, 2));
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(6, h + 15, 6, 4, 1));
                    }
                    else {
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(w - 29, h + 2, 12, 7, 2));
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(w - 20, h + 10, 8, 5, 2));
                        svgGroup.append(graphics_1.Graphics.StagePane.drawEllipse(w - 12, h + 15, 6, 4, 1));
                    }
                };
                return TalkBubble;
            })();
            exports_1("TalkBubble", TalkBubble);
        }
    }
});
//# sourceMappingURL=talk.bubble.js.map