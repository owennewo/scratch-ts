System.register(["../runtime/sprite.runtime", "./object.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var sprite_runtime_1, object_model_1;
    var SpriteModel, SpriteInfoModel;
    return {
        setters:[
            function (sprite_runtime_1_1) {
                sprite_runtime_1 = sprite_runtime_1_1;
            },
            function (object_model_1_1) {
                object_model_1 = object_model_1_1;
            }],
        execute: function() {
            SpriteModel = (function (_super) {
                __extends(SpriteModel, _super);
                function SpriteModel(stage) {
                    _super.call(this);
                    this.videomotion = {};
                    this.stage = stage;
                    this.runtime = new sprite_runtime_1.SpriteRuntime(this, stage.runtime);
                }
                SpriteModel.prototype.setRotationStyle = function (style) {
                    this.rotationStyle = style;
                };
                return SpriteModel;
            })(object_model_1.ObjectModel);
            exports_1("SpriteModel", SpriteModel);
            SpriteInfoModel = (function () {
                function SpriteInfoModel() {
                }
                return SpriteInfoModel;
            })();
            exports_1("SpriteInfoModel", SpriteInfoModel);
        }
    }
});
//# sourceMappingURL=sprite.model.js.map