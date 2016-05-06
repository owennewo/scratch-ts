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
    var BackdropsComponent;
    return {
        setters:[
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BackdropsComponent = (function () {
                function BackdropsComponent(modelService) {
                    var _this = this;
                    this.modelService = modelService;
                    modelService.onProjectLoaded.subscribe(function (data) {
                        var project = data;
                        _this.project = project;
                        _this.backgrounds = project.costumes;
                        // project.costumes.forEach(sprite => {
                        //     console.log("background: " + sprite.name);
                        // });
                        // modelService.selectObject(project.children[0]);
                    });
                    modelService.onObjectSelected.subscribe(function (data) {
                        _this.selectedObject = data;
                    });
                }
                BackdropsComponent.prototype.onSelect = function (background) {
                    console.log("selected sprite:" + background.name);
                    if (!this.selectedObject || this.selectedObject !== this.project) {
                        this.selectedObject = this.project;
                        this.modelService.selectObject(this.project);
                    }
                };
                BackdropsComponent = __decorate([
                    core_1.Component({
                        selector: "section[id=backdrops]",
                        template: "\n\n        <h1>Sprites are us</h1>\n        <ul class=\"backdrops\">\n          <li *ngFor=\"#background of backgrounds\"\n            [class.selected]=\"background === selectedObject\"\n            (click)=\"onSelect(background)\">\n            <span class=\"badge\">{{background.id}}</span> {{background.name}}\n          </li>\n        </ul>\n\n  ",
                        styles: ["\n\n  "]
                    }),
                    __param(0, core_1.Inject(model_service_1.ModelService)), 
                    __metadata('design:paramtypes', [model_service_1.ModelService])
                ], BackdropsComponent);
                return BackdropsComponent;
            })();
            exports_1("BackdropsComponent", BackdropsComponent);
        }
    }
});
//# sourceMappingURL=backdrops.component.js.map