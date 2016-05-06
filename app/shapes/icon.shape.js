System.register(["../utils/graphics", "./base.shape"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var graphics_1, base_shape_1;
    var IconShape;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            }],
        execute: function() {
            IconShape = (function (_super) {
                __extends(IconShape, _super);
                function IconShape(spec, arg, iconName, group) {
                    _super.call(this, spec, arg, group);
                    this.iconName = iconName;
                    // this.isReporter = true;
                    // this.indentLeft = 9;
                    // this.indentRight = 7;
                }
                IconShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    // this.group = parentGroup;
                    // this.centerY = this.topH / 2;
                    var text = graphics_1.Graphics.ScriptPane.drawText(this.x, this.y, "[" + this.iconName + "]");
                    text.attr({
                        y: text.getBBox().h + this.y
                    });
                    this.group.append(text);
                };
                return IconShape;
            })(base_shape_1.BaseShape);
            exports_1("IconShape", IconShape);
        }
    }
});
//# sourceMappingURL=icon.shape.js.map