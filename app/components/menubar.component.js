System.register(["../services/local.storage.service", "../services/model.service", "angular2/core"], function(exports_1) {
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
    var local_storage_service_1, model_service_1, core_1;
    var MenuBarComponent;
    return {
        setters:[
            function (local_storage_service_1_1) {
                local_storage_service_1 = local_storage_service_1_1;
            },
            function (model_service_1_1) {
                model_service_1 = model_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MenuBarComponent = (function () {
                function MenuBarComponent(modelService) {
                    this.modelService = modelService;
                    this.recentProjects = local_storage_service_1.LocalStorageService.getRecentProjects();
                    this.recentProjectKeys = Object.keys(this.recentProjects);
                    modelService.onProjectLoaded.subscribe(function (data) {
                        var stage = data;
                        var title = "private";
                        if (stage.detail)
                            title = stage.detail.title;
                        local_storage_service_1.LocalStorageService.addRecentProject(stage.id, title);
                    });
                }
                MenuBarComponent.prototype.promptProject = function () {
                    var projectID = window.prompt("Please enter the project id");
                    if (projectID) {
                        console.log("loading project: " + projectID);
                        this.modelService.loadProject(projectID);
                    }
                };
                MenuBarComponent.prototype.openProject = function (projectId) {
                    if (projectId) {
                        console.log("loading project: " + projectId + ":" + this.recentProjects[projectId]);
                        this.modelService.loadProject(projectId);
                    }
                };
                MenuBarComponent = __decorate([
                    core_1.Component({
                        selector: "nav[id=menu-bar]",
                        template: "\n\n        <div class=\"container-fluid\">\n          <div class=\"navbar-header\">\n            <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n              <span class=\"sr-only\">Toggle navigation</span>\n              <span class=\"icon-bar\"></span>\n              <span class=\"icon-bar\"></span>\n              <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" href=\"#\">Scratch</a>\n          </div>\n          <div id=\"navbar\" class=\"navbar-collapse collapse\" aria-expanded=\"false\" style=\"height: 1px;\">\n            <ul class=\"nav navbar-nav\">\n              <li class=\"dropdown\">\n                <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">File <span class=\"caret\"></span></a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#\" (click)=\"promptProject()\">Open project</a></li>\n                  <li role=\"separator\" class=\"divider\"></li>\n                  <li class=\"dropdown-header\">Recent projects</li>\n                  <li *ngFor=\"#key of recentProjectKeys\"><a href=\"#\" (click)=\"openProject(key)\">{{key + \" (\" + recentProjects[key].title + \")\" }}</a></li>\n                  <li role=\"separator\" class=\"divider\"></li>\n                  <li><a href=\"#\">Revert</a></li>\n                </ul>\n              </li>\n               <li class=\"dropdown\">\n                <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Edit <span class=\"caret\"></span></a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#\">Undelete</a></li>\n                  <li role=\"separator\" class=\"divider\"></li>\n                  <li><a href=\"#\">Small Stage Layout</a></li>\n                  <li><a href=\"#\">Turbo Mode</a></li>\n                </ul>\n              </li>\n              <li><a href=\"#\">Tips</a></li>\n              <li><a href=\"#\">About</a></li>\n            </ul>\n            <ul class=\"nav navbar-nav navbar-right\">\n               <li class=\"dropdown\">\n                <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">Account <span class=\"caret\"></span></a>\n                <ul class=\"dropdown-menu\">\n                  <li><a href=\"#\">Profile</a></li>\n                  <li><a href=\"#\">My Stuff</a></li>\n                  <li><a href=\"#\">Account Settingss</a></li>\n                  <li role=\"separator\" class=\"divider\"></li>\n                  <li><a href=\"#\">Sign out</a></li>\n                </ul>\n              </li>\n            </ul>\n          </div><!--/.nav-collapse -->\n        </div><!--/.container-fluid -->\n\n  ",
                        styles: ["\n\n  "]
                    }),
                    __param(0, core_1.Inject(model_service_1.ModelService)), 
                    __metadata('design:paramtypes', [model_service_1.ModelService])
                ], MenuBarComponent);
                return MenuBarComponent;
            })();
            exports_1("MenuBarComponent", MenuBarComponent);
        }
    }
});
//# sourceMappingURL=menubar.component.js.map