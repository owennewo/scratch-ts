System.register(["./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var base_shape_1, graphics_1;
    var DropDownShape;
    return {
        setters:[
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            DropDownShape = (function (_super) {
                __extends(DropDownShape, _super);
                function DropDownShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                }
                DropDownShape.prototype.draw = function (x, y) {
                    // this.group = parentGroup;
                    var argModel = this.arg;
                    var value = argModel.argValue;
                    if (!value)
                        value = argModel.part;
                    this.group.append(graphics_1.Graphics.ScriptPane.drawDropDown(x, y, this.w, this.topH, 0, 0, value));
                };
                return DropDownShape;
            })(base_shape_1.BaseShape);
            exports_1("DropDownShape", DropDownShape);
        }
    }
});
//# sourceMappingURL=dropdown.shape.js.map