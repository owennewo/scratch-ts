System.register(["./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var base_shape_1, graphics_1;
    var TextBoxShape;
    return {
        setters:[
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            TextBoxShape = (function (_super) {
                __extends(TextBoxShape, _super);
                function TextBoxShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                }
                TextBoxShape.prototype.draw = function (x, y) {
                    var value = this.arg.argValue;
                    if (!value)
                        value = this.arg.defaultArgValue;
                    var text = graphics_1.Graphics.ScriptPane.drawText(x, y, value);
                    var textBox = text.getBBox();
                    text.attr({
                        y: textBox.h
                    });
                    this.group.append(graphics_1.Graphics.ScriptPane.drawRect(x, y, textBox.w, textBox.h, 0, 0, this.spec.category.name.toLowerCase()));
                    this.group.append(text);
                };
                return TextBoxShape;
            })(base_shape_1.BaseShape);
            exports_1("TextBoxShape", TextBoxShape);
        }
    }
});
//# sourceMappingURL=text.box.shape.js.map