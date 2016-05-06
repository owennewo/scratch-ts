System.register(["../utils/path.builder", "./stack.shape", "../utils/graphics", "./geometry"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, stack_shape_1, graphics_1, geometry_1;
    var DoubleStackShape;
    return {
        setters:[
            function (path_builder_1_1) {
                path_builder_1 = path_builder_1_1;
            },
            function (stack_shape_1_1) {
                stack_shape_1 = stack_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }],
        execute: function() {
            DoubleStackShape = (function (_super) {
                __extends(DoubleStackShape, _super);
                function DoubleStackShape(spec, arg, group) {
                    _super.call(this, spec, arg, false, group);
                    this.stack2h = geometry_1.Geometry.EmptyStackH;
                }
                DoubleStackShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    var h1 = this.topH + this.stack1h - geometry_1.Geometry.NotchDepth;
                    var h2 = h1 + geometry_1.Geometry.DividerH + this.stack2h - geometry_1.Geometry.NotchDepth;
                    var text = graphics_1.Graphics.ScriptPane.drawText(5, 18, this.spec.label);
                    this.w = text.getBBox().width + 20;
                    var path = path_builder_1.PathBuilder.create()
                        .drawTop(this.w)
                        .drawRightAndBottom(this.topH, this.w, true, geometry_1.Geometry.StackInset)
                        .drawArm(h1, this.w)
                        .drawRightAndBottom(h1 + geometry_1.Geometry.DividerH, this.w, true, geometry_1.Geometry.StackInset)
                        .drawArm(h2, this.w)
                        .drawRightAndBottom(h2 + geometry_1.Geometry.BottomBarH, this.w, true)
                        .build();
                    this.group.append(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                    this.group.append(text);
                };
                return DoubleStackShape;
            })(stack_shape_1.StackShape);
            exports_1("DoubleStackShape", DoubleStackShape);
        }
    }
});
//# sourceMappingURL=double.stack.shape.js.map