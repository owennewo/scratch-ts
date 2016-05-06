System.register(["../utils/path.builder", "./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1;
    var BooleanShape;
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
            BooleanShape = (function (_super) {
                __extends(BooleanShape, _super);
                function BooleanShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                    this.indentLeft = 15;
                    // this.isReporter = true;
                    // this.indentLeft = 9;
                    // this.indentRight = 7;
                }
                BooleanShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    // this.group = parentGroup;
                    this.centerY = this.topH / 2;
                    var path = path_builder_1.PathBuilder.create()
                        .moveTo(this.x, this.centerY)
                        .lineTo(this.x + this.centerY, 0)
                        .lineTo(this.x + this.w - this.centerY, 0)
                        .lineTo(this.x + this.w, this.centerY)
                        .lineTo(this.x + this.w - this.centerY, this.topH)
                        .lineTo(this.x + this.centerY, this.topH)
                        .lineTo(this.x, this.centerY)
                        .build();
                    this.group.prepend(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                };
                return BooleanShape;
            })(base_shape_1.BaseShape);
            exports_1("BooleanShape", BooleanShape);
        }
    }
});
//# sourceMappingURL=boolean.shape.js.map