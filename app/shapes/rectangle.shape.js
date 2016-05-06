System.register(["./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var base_shape_1, graphics_1;
    var RectangleShape;
    return {
        setters:[
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            RectangleShape = (function (_super) {
                __extends(RectangleShape, _super);
                function RectangleShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                }
                RectangleShape.prototype.draw = function (x, y) {
                    // this.group = parentGroup;
                    this.group.append(graphics_1.Graphics.ScriptPane.drawRect(x, y, this.w, this.topH, 0, 0, this.spec.category.name.toLowerCase()));
                };
                return RectangleShape;
            })(base_shape_1.BaseShape);
            exports_1("RectangleShape", RectangleShape);
        }
    }
});
//# sourceMappingURL=rectangle.shape.js.map