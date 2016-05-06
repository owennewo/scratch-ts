System.register(["./loop.shape"], function(exports_1) {
    "use strict";
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var loop_shape_1;
    var FinalStackShape;
    return {
        setters:[
            function (loop_shape_1_1) {
                loop_shape_1 = loop_shape_1_1;
            }],
        execute: function() {
            FinalStackShape = (function (_super) {
                __extends(FinalStackShape, _super);
                function FinalStackShape(category, spec, x, y) {
                    _super.call(this, category, spec, x, y);
                    // this.isTerminal = true;
                }
                return FinalStackShape;
            }(loop_shape_1.StackShape));
            exports_1("FinalStackShape", FinalStackShape);
        }
    }
});
//# sourceMappingURL=final.loop.shape.js.map