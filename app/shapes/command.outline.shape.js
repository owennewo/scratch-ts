System.register(["../utils/path.builder", "./base.shape", "../utils/graphics", "./geometry"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1, geometry_1;
    var CommandOutlineShape;
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
            CommandOutlineShape = (function (_super) {
                __extends(CommandOutlineShape, _super);
                function CommandOutlineShape(spec, arg, hasNotch, group) {
                    _super.call(this, spec, arg, group);
                    this.hasNotch = hasNotch;
                    // this.base.filters = []; // no bezel
                    this.indentTop = 3;
                }
                CommandOutlineShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    var path = path_builder_1.PathBuilder.create()
                        .drawTop(this.w)
                        .drawRightAndBottom(this.topH, this.w, this.hasNotch)
                        .lineTo(0, geometry_1.Geometry.CornerInset)
                        .build();
                    this.group.append(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                };
                return CommandOutlineShape;
            })(base_shape_1.BaseShape);
            exports_1("CommandOutlineShape", CommandOutlineShape);
        }
    }
});
//# sourceMappingURL=command.outline.shape.js.map