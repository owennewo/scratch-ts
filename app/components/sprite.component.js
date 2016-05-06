System.register(['angular2/core'], function(exports_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var SpriteComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SpriteComponent = (function () {
                function SpriteComponent() {
                }
                SpriteComponent = __decorate([
                    core_1.Component({
                        selector: 'sprite-detail',
                        template: "\n    <div *ngIf=\"hero\">\n      <h2>{{sprite.name}} details</h2>\n      <div>\n        <label>id: </label>{{sprite.id}}\n      </div>\n      <div>\n        <label>name: </label>\n        <input [(ngModel)]=\"sprite.name\" placeholder=\"name\"/>\n      </div>\n    </div>\n  ",
                        inputs: ['sprite']
                    }), 
                    __metadata('design:paramtypes', [])
                ], SpriteComponent);
                return SpriteComponent;
            }());
            exports_1("SpriteComponent", SpriteComponent);
        }
    }
});
//# sourceMappingURL=sprite.component.js.map