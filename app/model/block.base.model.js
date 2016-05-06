System.register(["./visible.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var visible_model_1;
    var BlockBaseModel;
    return {
        setters:[
            function (visible_model_1_1) {
                visible_model_1 = visible_model_1_1;
            }],
        execute: function() {
            BlockBaseModel = (function (_super) {
                __extends(BlockBaseModel, _super);
                function BlockBaseModel() {
                    _super.apply(this, arguments);
                }
                return BlockBaseModel;
            })(visible_model_1.VisibleModel);
            exports_1("BlockBaseModel", BlockBaseModel);
        }
    }
});
//# sourceMappingURL=block.base.model.js.map