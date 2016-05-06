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
                function StackShape(spec, arg, isFinal, group) {
                    if (isFinal === void 0) { isFinal = false; }
                    _super.call(this, spec, arg, group);
                    this.stack1h = geometry_1.Geometry.EmptyStackH;
                    this.stack1y = 24;
                    this.hasLoopArrow = true;
                    this.isFinal = isFinal;
                    // let loopBlocks: string[] = ["doForever", "doForeverIf", "doRepeat", "doUntil"];
                    // this.base.hasLoopArrow = (loopBlocks.indexOf(this.op) >= 0);
                }
                StackShape.prototype.draw = function (x, y, prepend) {
                    if (prepend === void 0) { prepend = false; }
                    _super.prototype.draw.call(this, x, y);
                    var h1 = this.topH + this.stack1h - geometry_1.Geometry.NotchDepth;
                    var builder = path_builder_1.PathBuilder.create()
                        .drawTop(this.w)
                        .drawRightAndBottom(this.topH, this.w, true, geometry_1.Geometry.StackInset)
                        .drawArm(h1, this.w)
                        .drawRightAndBottom(h1 + geometry_1.Geometry.BottomBarH, this.w, true);
                    if (this.hasLoopArrow) {
                        builder.drawLoopArrow(this.w, h1 + geometry_1.Geometry.BottomBarH);
                    }
                    var pathString = builder.build();
                    var path = graphics_1.Graphics.ScriptPane.drawPath(pathString, this.spec.category.name.toLowerCase());
                    if (prepend) {
                        this.group.prepend(path);
                    }
                    else {
                        this.group.append(path);
                    }
                };
                return StackShape;
            })(base_shape_1.BaseShape);
            exports_1("StackShape", StackShape);
        }
    }
});
//# sourceMappingURL=stack.shape.js.map