System.register(["../utils/path.builder", "./base.shape", "../utils/graphics", "./geometry"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var path_builder_1, base_shape_1, graphics_1, geometry_1;
    var StackShape;
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
            StackShape = (function (_super) {
                __extends(StackShape, _super);
                function StackShape(category, spec) {
                    _super.call(this, category, spec);
                    this.substack1H = geometry_1.Geometry.EmptySubstackH;
                    this.hasLoopArrow = true;
                    // let loopBlocks: string[] = ["doForever", "doForeverIf", "doRepeat", "doUntil"];
                    // this.base.hasLoopArrow = (loopBlocks.indexOf(this.op) >= 0);
                }
                StackShape.prototype.draw = function () {
                    _super.prototype.draw.call(this);
                    var h1 = this.topH + this.substack1H - geometry_1.Geometry.NotchDepth;
                    var text = graphics_1.Graphics.ScriptPane.drawText(5, 18, this.spec.description);
                    this.w = text.getBBox().width + 20;
                    var builder = path_builder_1.PathBuilder.create()
                        .drawTop(this.w)
                        .drawRightAndBottom(this.topH, this.w, true, geometry_1.Geometry.SubstackInset)
                        .drawArm(h1, this.w)
                        .drawRightAndBottom(h1 + geometry_1.Geometry.BottomBarH, this.w, true);
                    if (this.hasLoopArrow) {
                        builder.drawLoopArrow(this.w, h1 + geometry_1.Geometry.BottomBarH);
                    }
                    var path = builder.build();
                    this.group.append(graphics_1.Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
                    this.group.append(text);
                };
                return StackShape;
            })(base_shape_1.BaseShape);
            exports_1("StackShape", StackShape);
        }
    }
});
//# sourceMappingURL=loop.shape.js.map