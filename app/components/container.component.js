System.register(["./backdrops.component", "../services/script.layout.service", "../services/spec.layout.service", "../services/model.service", "angular2/core", "./stage.component", "./sprites.component"], function(exports_1) {
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
    var backdrops_component_1, script_layout_service_1, spec_layout_service_1, model_service_1, core_1, stage_component_1, sprites_component_1;
    var ContainerComponent;
    return {
        setters:[
            function (backdrops_component_1_1) {
                backdrops_component_1 = backdrops_component_1_1;
            },
            function (script_layout_service_1_1) {
                script_layout_service_1 = script_layout_service_1_1;
            },
            function (spec_layout_service_1_1) {
                spec_layout_service_1 = spec_layout_service_1_1;
            },
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (stage_component_1_1) {
                stage_component_1 = stage_component_1_1;
            },
            function (sprites_component_1_1) {
                sprites_component_1 = sprites_component_1_1;
            }],
        execute: function() {
            ContainerComponent = (function () {
                // stage: StageModel;
                function ContainerComponent(modelService) {
                    this.modelService = modelService;
                    modelService.onObjectSelected.subscribe(function (res) {
                        var scratchObject = res;
                        console.log("loading script for:" + scratchObject.name);
                        spec_layout_service_1.SpecLayoutService.drawCategories();
                        if (scratchObject.scripts && scratchObject.scripts.length > 0) {
                            script_layout_service_1.ScriptLayoutService.drawObject(scratchObject);
                        }
                    });
                    var defaultProjectId = "96813029";
                    var projectID = this.getParameterByName("projectid");
                    if (!projectID)
                        projectID = defaultProjectId;
                    modelService.loadProject(projectID);
                }
                ContainerComponent.prototype.getParameterByName = function (name) {
                    var url = window.location.href;
                    name = name.replace(/[\[\]]/g, "\\$&");
                    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
                    if (!results)
                        return null;
                    if (!results[2])
                        return "";
                    return decodeURIComponent(results[2].replace(/\+/g, " "));
                };
                ContainerComponent.prototype.onSelectedObject = function (event) {
                    console.log("+++++++++++++event:" + event);
                };
                ContainerComponent = __decorate([
                    core_1.Component({
                        selector: "div[id=container]",
                        template: "\n\n  <div class=\"row\">\n      <div id=\"stage-col\" class=\"col-sm-12 col-md-4\">\n        <div class=\"container-fluid\">\n          <div class=\"row\">\n\n            <section id=\"stage\" class=\"col-sm-6 col-md-12\">stage</section>\n            <div id=\"stage-objects\" class=\"col-sm-6 col-md-12\">\n              <div id=\"runtime-info\">fps: <span id=\"fps\">0</span>, x:<span id=\"x\">0</span>, y:<span id=\"y\">0</span></div>\n              <ul class=\"nav nav-tabs\">\n                  <li class=\"active\"><a data-toggle=\"tab\" href=\"#sprites\">Sprites</a></li>\n                  <li><a data-toggle=\"tab\" href=\"#backdrops\">Backdrops</a></li>\n              </ul>\n\n              <div class=\"tab-content\">\n                  <section id=\"sprites\" class=\"tab-pane fade in active\" >sprites</section>\n                  <section id=\"backdrops\" class=\"tab-pane fade\">background</section>\n              </div>\n            </div>\n          </div>\n      </div>\n      </div>\n      <div id=\"editor\" class=\"col-sm-12 col-md-8\">\n          <ul id=\"editor-tabs\" class=\"nav nav-tabs\">\n              <li class=\"active\"><a data-toggle=\"tab\" href=\"#script-editor\">Scripts</a></li>\n              <li><a data-toggle=\"tab\" href=\"#background-editor\">Backgrounds</a></li>\n              <li><a data-toggle=\"tab\" href=\"#sound-editor\">Sounds</a></li>\n          </ul>\n\n          <div id=\"editor-content\" class=\"tab-content\">\n              <section id=\"script-editor\" class=\"tab-pane fade in active\">\n\n                              <svg id=\"svg-script-pane\"></svg>\n\n              </section>\n              <section id=\"background-editor\" class=\"tab-pane fade\">background</section>\n              <section id=\"sound-editor\" class=\"tab-pane fade\">sounds</section>\n          </div>\n          <section id=\"backpack\">backpack</section>\n        </div>\n   </div>\n\n\n  ",
                        directives: [stage_component_1.StageComponent, sprites_component_1.SpritesComponent, backdrops_component_1.BackdropsComponent]
                    }),
                    __param(0, core_1.Inject(model_service_1.ModelService)), 
                    __metadata('design:paramtypes', [model_service_1.ModelService])
                ], ContainerComponent);
                return ContainerComponent;
            })();
            exports_1("ContainerComponent", ContainerComponent);
        }
    }
});
//# sourceMappingURL=container.component.js.map