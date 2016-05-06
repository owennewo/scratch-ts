System.register(["./command.shape"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var command_shape_1;
    var FinalCommandShape;
    return {
        setters:[
            function (command_shape_1_1) {
                command_shape_1 = command_shape_1_1;
            }],
        execute: function() {
            FinalCommandShape = (function (_super) {
                __extends(FinalCommandShape, _super);
                function FinalCommandShape(category, spec) {
                    _super.call(this, category, spec);
                    this.hasNotch = false;
                    this.indentTop = 5;
                    // this.isTerminal = true;
                }
                return FinalCommandShape;
            })(command_shape_1.CommandShape);
            exports_1("FinalCommandShape", FinalCommandShape);
        }
    }
});
//# sourceMappingURL=final.command.shape.js.map