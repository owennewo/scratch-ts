System.register(["../runtime/stage.runtime", "./object.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var stage_runtime_1, object_model_1;
    var StageModel, PenModel, ProjectInfoModel;
    return {
        setters:[
            function (stage_runtime_1_1) {
                stage_runtime_1 = stage_runtime_1_1;
            },
            function (object_model_1_1) {
                object_model_1 = object_model_1_1;
            }],
        execute: function() {
            StageModel = (function (_super) {
                __extends(StageModel, _super);
                function StageModel() {
                    _super.call(this);
                    this.runtime = new stage_runtime_1.StageRuntime(this);
                }
                StageModel.prototype.duplicate = function () {
                    var duplicate = new StageModel();
                    duplicate.tempo = this.tempo;
                    duplicate.videoAlpha = this.videoAlpha;
                    return duplicate;
                };
                StageModel.prototype.spriteNamed = function (spriteName) {
                    for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                        var sprite = _a[_i];
                        if (sprite.name === spriteName)
                            return sprite;
                    }
                    console.error("can't find sprite: " + spriteName);
                };
                StageModel.prototype.spritesAndClonesNamed = function (spriteName) {
                    // todo check for clones
                    var sprites = [];
                    var sprite = this.spriteNamed(spriteName);
                    if (sprite)
                        sprites.push(sprite);
                    return sprites;
                };
                StageModel.prototype.objNamed = function (objectName) {
                    var obj = this.spriteNamed(objectName);
                    if (obj !== null) {
                        return obj;
                    }
                    else {
                        console.log("todo: objNamed should look for other object types");
                        return null;
                    }
                };
                StageModel.STAGEW = 480;
                StageModel.STAGEH = 360;
                return StageModel;
            })(object_model_1.ObjectModel);
            exports_1("StageModel", StageModel);
            PenModel = (function () {
                function PenModel() {
                }
                return PenModel;
            })();
            exports_1("PenModel", PenModel);
            ProjectInfoModel = (function () {
                function ProjectInfoModel() {
                }
                return ProjectInfoModel;
            })();
            exports_1("ProjectInfoModel", ProjectInfoModel);
        }
    }
});
//# sourceMappingURL=stage.model.js.map