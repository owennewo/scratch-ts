System.register([], function(exports_1) {
    var ObjectModel;
    return {
        setters:[],
        execute: function() {
            ObjectModel = (function () {
                function ObjectModel() {
                    this.currentCostumeIndex = 0;
                }
                ObjectModel.prototype.showCostume = function (costumeIndex) {
                    if (costumeIndex >= this.costumes.length)
                        costumeIndex = 0;
                    if (costumeIndex < 0)
                        costumeIndex = this.costumes.length - 1;
                    this.currentCostumeIndex = costumeIndex;
                    this.runtime.showCostume(this.costumes[costumeIndex]);
                };
                ObjectModel.prototype.indexOfCostumeNamed = function (costumeName) {
                    for (var index = 0; index < this.costumes.length; index++) {
                        if (this.costumes[index].name === costumeName) {
                            return index;
                        }
                    }
                    return -1;
                };
                ObjectModel.prototype.soundNamed = function (name) {
                    for (var _i = 0, _a = this.sounds; _i < _a.length; _i++) {
                        var sound = _a[_i];
                        if (sound.name === name)
                            return sound;
                    }
                    return null;
                };
                ;
                return ObjectModel;
            })();
            exports_1("ObjectModel", ObjectModel);
        }
    }
});
//# sourceMappingURL=object.model.js.map