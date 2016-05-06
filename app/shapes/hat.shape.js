System.register(["../utils/path.builder", "./base.shape", "../utils/graphics", "./geometry"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1, geometry_1;
    var HatShape;
    return {
        setters:[
            function (path_builder_1_1) {
                path_builder_1 = path_builder_1_1;
            },
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            }],
        execute: function() {
            HatShape = (function (_super) {
                __extends(HatShape, _super);
                function HatShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                    this.indentTop = 12;
                }
                HatShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    this.topH = 35;
                    var path = path_builder_1.PathBuilder.create()
                        .moveTo(0, 12)
                        .curveBezier(0, 12, 27.5, 0, 52.5, 0, 80, 10)
                        .lineTo(this.w - geometry_1.Geometry.CornerInset, 10)
                        .lineTo(this.w, 10 + geometry_1.Geometry.CornerInset)
                        .drawRightAndBottom(this.topH, this.w, true)
                        .lineTo(0, 12)
                        .build();
                    this.group.prepend(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                };
                return HatShape;
            })(base_shape_1.BaseShape);
            exports_1("HatShape", HatShape);
        }
    }
});
//# sourceMappingURL=hat.shape.js.map