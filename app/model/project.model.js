System.register(["./object.model"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var object_model_1;
    var ProjectModel, PenModel, ProjectInfoModel;
    return {
        setters:[
            function (object_model_1_1) {
                object_model_1 = object_model_1_1;
            }],
        execute: function() {
            ProjectModel = (function (_super) {
                __extends(ProjectModel, _super);
                function ProjectModel() {
                    _super.apply(this, arguments);
                }
                ProjectModel.prototype.duplicate = function () {
                    var duplicate = new ProjectModel();
                    duplicate.tempo = this.tempo;
                    duplicate.videoAlpha = this.videoAlpha;
                    return duplicate;
                };
                return ProjectModel;
            })(object_model_1.ObjectModel);
            exports_1("ProjectModel", ProjectModel);
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
//# sourceMappingURL=project.model.js.map