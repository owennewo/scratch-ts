System.register(["./visible.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var visible_model_1;
    var ScriptModel;
    return {
        setters:[
            function (visible_model_1_1) {
                visible_model_1 = visible_model_1_1;
            }],
        execute: function() {
            ScriptModel = (function (_super) {
                __extends(ScriptModel, _super);
                function ScriptModel() {
                    _super.apply(this, arguments);
                }
                return ScriptModel;
            })(visible_model_1.VisibleModel);
            exports_1("ScriptModel", ScriptModel);
        }
    }
});
//# sourceMappingURL=script.model.js.map