System.register(["../utils/talk.bubble", "../model/stage.model", "./object.runtime", "../shapes/geometry"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var talk_bubble_1, stage_model_1, object_runtime_1, geometry_1;
    var SpriteRuntime;
    return {
        setters:[
            function (talk_bubble_1_1) {
                talk_bubble_1 = talk_bubble_1_1;
            },
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (object_runtime_1_1) {
                object_runtime_1 = object_runtime_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }],
        execute: function() {
            SpriteRuntime = (function (_super) {
                __extends(SpriteRuntime, _super);
                function SpriteRuntime(sprite, stage) {
                    _super.call(this, stage.paper);
                    this.penIsDown = false;
                    this.penWidth = 3;
                    this.penColor = Snap.hsl2rgb(this.penHue * 2, 100, 50);
                    this.penHue = 120;
                    this.instrument = 1;
                    this.sprite = sprite;
                }
                SpriteRuntime.prototype.clearFilters = function () {
                    console.log("todo: SpriteRuntime clearFilters");
                };
                SpriteRuntime.prototype.showBubble = function (text, type, block) {
                    if (!this.bubble) {
                        this.bubble = new talk_bubble_1.TalkBubble(this.sprite, text, "say", "say");
                    }
                    this.bubbleSource = block;
                    // this.bubble
                    console.log("todo: Sprite runtime show bubble");
                };
                SpriteRuntime.prototype.hideBubble = function () {
                    var bubbleSvg = Snap.select("#bubble-" + this.sprite.name);
                    if (bubbleSvg) {
                        bubbleSvg.remove();
                        this.bubble = undefined;
                    }
                    console.log("todo: SpriteRuntime hasBubbles");
                };
                SpriteRuntime.prototype.updateBubble = function () {
                    console.log("todo: SpriteRuntime updateBubbles");
                };
                SpriteRuntime.prototype.setPenColor = function (color) {
                    this.penColor = color;
                    console.log("color set to:" + color);
                };
                SpriteRuntime.prototype.setPenHue = function (color) {
                    this.penHue = color;
                    if (this.penHue > 360)
                        this.penHue = this.penHue - 360;
                    if (this.penHue < 0)
                        this.penHue = this.penHue + 360;
                    this.penColor = Snap.hsl2rgb(this.penHue * 2, 100, 50);
                };
                SpriteRuntime.prototype.setPenShade = function (color) {
                    this.penShade = color;
                };
                SpriteRuntime.prototype.redraw = function () {
                    var s = this.sprite;
                    if (this.lastScale !== s.scale) {
                        // removing the transform in order to get an accurate bbox width/height.  Is there a better way?
                        s.runtime.svg.transform("rotate(0)");
                        var spriteBox = this.svg.getBBox();
                        this.lastSpriteBox = spriteBox;
                        this.lastScale = s.scale;
                    }
                    var x = Math.floor(this.sprite.x - (this.lastSpriteBox.w / 2) - ((this.lastSpriteBox.h / 2) * (s.scale - 1)));
                    var y = Math.floor(-(this.sprite.y + (this.lastSpriteBox.h / 2)) - ((this.lastSpriteBox.w / 2) * (s.scale - 1))); // scratch y coordinate system is upside down compared to svg hence the negation
                    var trans = "rotate(" + (s.direction - 90) + " " + this.sprite.x + " " + (-this.sprite.y) + ") translate(" + x + "," + y + ") scale(" + s.scale + ")";
                    s.runtime.svg.transform(trans);
                };
                SpriteRuntime.prototype.setPenSize = function (size) {
                    this.size = size;
                };
                SpriteRuntime.prototype.keepOnStage = function () {
                    var box = this.svg.getBBox();
                    if (box.x > ((stage_model_1.StageModel.STAGEW / 2) - 20))
                        this.sprite.x = (stage_model_1.StageModel.STAGEW / 2) - 20;
                    if (box.x2 < ((-stage_model_1.StageModel.STAGEW / 2) + 20))
                        this.sprite.x = (-stage_model_1.StageModel.STAGEW / 2) + 20;
                    // y maths is odd as y coordinates between scratch and svg is flipped
                    if (box.y > ((stage_model_1.StageModel.STAGEH / 2) - 20))
                        this.sprite.y = (-stage_model_1.StageModel.STAGEH / 2) + 20;
                    if (box.y2 < ((-stage_model_1.StageModel.STAGEH / 2) + 20))
                        this.sprite.y = (stage_model_1.StageModel.STAGEH / 2) - 20;
                };
                SpriteRuntime.prototype.setDirection = function (direction) {
                    this.direction = direction;
                };
                SpriteRuntime.prototype.bounds = function () {
                    return geometry_1.Rectangle.fromBBox(this.svg.getBBox());
                };
                SpriteRuntime.prototype.getSize = function () {
                    var rect = this.bounds();
                    if (rect.width > rect.height)
                        return rect.width;
                    else
                        return rect.height;
                };
                SpriteRuntime.prototype.setSize = function (size) {
                    console.log("todo getSize spriteruntime");
                    this.size = size;
                };
                SpriteRuntime.prototype.type = function () {
                    return "sprite";
                };
                SpriteRuntime.prototype.isTouching = function (other) {
                    var box1 = this.svg.getBBox();
                    var box2 = other.svg.getBBox();
                    // this is a rough approximation to check if touching.  Not sure if its good enough, but there is no simple alternative
                    return Snap.path.isPointInsideBBox(box1, box2.cx, box2.cy) || Snap.path.isPointInsideBBox(box2, box1.cx, box1.cy);
                };
                SpriteRuntime.prototype.placeCostume = function (costume, element) {
                    if (!this.svg) {
                        this.svg = this.paper.group();
                        this.svg.attr({
                            id: this.type() + "-" + costume.name
                        });
                    }
                    this.svg.clear();
                    this.svg.append(element);
                };
                return SpriteRuntime;
            })(object_runtime_1.ObjectRuntime);
            exports_1("SpriteRuntime", SpriteRuntime);
        }
    }
});
//# sourceMappingURL=sprite.runtime.js.map