System.register(["../utils/graphics", "./base.shape"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var graphics_1, base_shape_1;
    var TextShape;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            }],
        execute: function() {
            TextShape = (function (_super) {
                __extends(TextShape, _super);
                //  group: Snap.Element;
                function TextShape(spec, arg, text, group) {
                    _super.call(this, spec, arg, group);
                    this.text = "unspecified";
                    this.text = text;
                }
                TextShape.prototype.setText = function (text) {
                    this.text = text;
                };
                TextShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    // super.draw(parentGroup);
                    // this.group = parentGroup;
                    var text = graphics_1.Graphics.ScriptPane.drawText(this.x, 0, this.text);
                    text.attr({
                        y: text.getBBox().h + this.y
                    });
                    this.group.append(text);
                };
                TextShape.LineHeight = 18;
                return TextShape;
            })(base_shape_1.BaseShape);
            exports_1("TextShape", TextShape);
        }
    }
});
//# sourceMappingURL=text.shape.js.map