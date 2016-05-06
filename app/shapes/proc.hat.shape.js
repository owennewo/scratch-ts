System.register(["../utils/path.builder", "./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1;
    var ProcHatShape;
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
            ProcHatShape = (function (_super) {
                __extends(ProcHatShape, _super);
                function ProcHatShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                    // this.isHat = true;
                }
                ProcHatShape.prototype.draw = function (x, y) {
                    _super.prototype.draw.call(this, x, y);
                    var trimColor = "#8E2EC2"; // 0xcf4ad9;
                    var archRoundness = Math.min(0.2, 35 / this.w);
                    // todo
                    // .beginFill(trimColor)
                    // .lineStyle(1, Specs.ProcedureColor)
                    var path = path_builder_1.PathBuilder.create()
                        .moveTo(0, 15)
                        .curve(0, 15, this.w, 15, archRoundness)
                        .drawRightAndBottom(this.topH, this.w, true)
                        .moveTo(-1, 13)
                        .curve(-1, 13, this.w + 1, 13, archRoundness)
                        .curve(this.w + 1, 13, this.w, 16, 0.6)
                        .curve(this.w, 16, 0, 16, -archRoundness)
                        .curve(0, 16, -1, 13, 0.6)
                        .build();
                    this.group.append(graphics_1.Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
                };
                return ProcHatShape;
            })(base_shape_1.BaseShape);
            exports_1("ProcHatShape", ProcHatShape);
        }
    }
});
//# sourceMappingURL=proc.hat.shape.js.map