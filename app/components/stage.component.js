System.register(["../services/model.service", "angular2/core"], function(exports_1) {
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
    var model_service_1, core_1;
    var StageComponent;
    return {
        setters:[
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            StageComponent = (function () {
                function StageComponent(modelService) {
                    var _this = this;
                    this.modelService = modelService;
                    modelService.onProjectLoaded.subscribe(function (data) {
                        _this.stage = data;
                        var title;
                        if (_this.stage.detail) {
                            title = _this.stage.detail.title;
                        }
                        else {
                            title = "not unshared, no title";
                        }
                        console.log("loaded project '" + _this.stage.id + "' with title '" + title + "'");
                        document.getElementById("project-name").value = title;
                        console.log("StageComponent is starting threads");
                        _this.stage.runtime.initStage();
                    });
                }
                StageComponent.prototype.start = function () {
                    this.stop();
                    console.log("greenFlag clicked");
                    this.stage.runtime.startGreenFlags(true);
                };
                StageComponent.prototype.stop = function () {
                    this.stage.runtime.stopAll();
                };
                StageComponent.prototype.resizeStage = function () {
                    var runtime = document.querySelector("#stage");
                    runtime.classList.toggle("fullscreen");
                };
                StageComponent = __decorate([
                    core_1.Component({
                        selector: "section[id=stage]",
                        template: "\n        <div class=\"inner\">\n          <div id=\"stage-header\" class=\"input-group\">\n            <span class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-default\" (click)=\"resizeStage()\">[+]</button>\n            </span>\n            <input type=\"text\" class=\"form-control\" id=\"project-name\" aria-label=\"\" value=\"untitled\">\n            <div class=\"input-group-btn\" role=\"group\" aria-label=\"\">\n              <button type=\"button\" class=\"btn btn-default\" (click)=\"start()\">Start</button>\n              <button type=\"button\" class=\"btn btn-default\" (click)=\"stop()\">Stop</button>\n            </div>\n          </div>\n          <svg id=\"svg-stage\" class=\"svg-stage\" viewBox=\"-240 -180 480 360\"></svg>\n        </div>\n\n  ",
                        styles: ["\n    #stage-header\n    {\n      height: 40px;\n    }\n    #stage-content\n    {\n      width: 480px;\n      height: 360px;\n      background: lightblue;\n    }\n  "]
                    }),
                    __param(0, core_1.Inject(model_service_1.ModelService)), 
                    __metadata('design:paramtypes', [model_service_1.ModelService])
                ], StageComponent);
                return StageComponent;
            })();
            exports_1("StageComponent", StageComponent);
        }
    }
});
//# sourceMappingURL=stage.component.js.map