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
    var SpritesComponent;
    return {
        setters:[
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SpritesComponent = (function () {
                function SpritesComponent(modelService) {
                    var _this = this;
                    this.modelService = modelService;
                    modelService.onProjectLoaded.subscribe(function (data) {
                        var project = data;
                        _this.sprites = project.children;
                        modelService.selectObject(project.children[0]);
                    });
                }
                SpritesComponent.prototype.onSelect = function (sprite) {
                    console.log("selected sprite:" + sprite.name);
                    if (this.selectedObject !== sprite) {
                        this.selectedObject = sprite;
                        this.modelService.selectObject(this.selectedObject);
                    }
                };
                SpritesComponent = __decorate([
                    core_1.Component({
                        selector: "section[id=sprites]",
                        template: "\n\n        <h1>Sprites are us</h1>\n        <ul class=\"sprites\">\n          <li *ngFor=\"#sprite of sprites\"\n            [class.selected]=\"sprite === selectedObject\"\n            (click)=\"onSelect(sprite)\">\n            <span class=\"badge\">{{sprite.id}}</span> {{sprite.name}}\n          </li>\n        </ul>\n\n  ",
                        styles: ["\n\n  "]
                    }),
                    __param(0, core_1.Inject(model_service_1.ModelService)), 
                    __metadata('design:paramtypes', [model_service_1.ModelService])
                ], SpritesComponent);
                return SpritesComponent;
            })();
            exports_1("SpritesComponent", SpritesComponent);
        }
    }
});
//# sourceMappingURL=sprites.component.js.map