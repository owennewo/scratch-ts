System.register(["../utils/path.builder", "./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1;
    var CommandShape;
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
            }],
        execute: function() {
            CommandShape = (function (_super) {
                __extends(CommandShape, _super);
                function CommandShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                    this.hasNotch = true;
                    this.indentTop = 0;
                }
                CommandShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    var path = path_builder_1.PathBuilder.create()
                        .drawTop(this.w)
                        .drawRightAndBottom(this.topH, this.w, this.hasNotch)
                        .build();
                    this.group.prepend(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                };
                return CommandShape;
            })(base_shape_1.BaseShape);
            exports_1("CommandShape", CommandShape);
        }
    }
});
//# sourceMappingURL=command.shape.js.map