System.register(["../services/project.io.service", "angular2/core", "angular2/http"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var project_io_service_1, core_1, http_1, core_2;
    var ModelService;
    return {
        setters:[
            function (project_io_service_1_1) {
                project_io_service_1 = project_io_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            ModelService = (function () {
                function ModelService(http) {
                    this.http = http;
                    this.onProjectLoaded = new core_2.EventEmitter();
                    this.onObjectSelected = new core_2.EventEmitter();
                }
                ModelService.prototype.selectObject = function (scratchObject) {
                    this.onObjectSelected.emit(scratchObject);
                };
                ModelService.prototype.loadProject = function (projectId) {
                    var _this = this;
                    var projectIO = new project_io_service_1.ProjectIOService();
                    var projectInfoUrl = "https://scratch.mit.edu/api/v1/project/" + projectId + "/?format=json";
                    var self = this;
                    this.projectDetail = undefined;
                    this.http.get(projectInfoUrl)
                        .subscribe(function (res) {
                        var json = JSON.parse(res["_body"]);
                        self.projectDetail = projectIO.readProjectDetail(json);
                    }, function (err) {
                        var errMsg = "error obtaining project info, perhaps it's private: " + JSON.stringify(err);
                        console.log(errMsg);
                    });
                    var projectUrl = "http://projects.scratch.mit.edu/internalapi/project/" + projectId + "/get/";
                    console.log("reading project file:" + projectUrl);
                    this.http.get(projectUrl).subscribe(function (res) {
                        var json = JSON.parse(res["_body"]);
                        var project = projectIO.readProject(json, projectId);
                        project.detail = self.projectDetail;
                        _this.onProjectLoaded.emit(project);
                    });
                };
                ModelService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(http_1.Http)), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ModelService);
                return ModelService;
            })();
            exports_1("ModelService", ModelService);
        }
    }
});
//# sourceMappingURL=model.service.js.map