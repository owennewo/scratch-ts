System.register([], function(exports_1) {
    var ObjectRuntime;
    return {
        setters:[],
        execute: function() {
            ObjectRuntime = (function () {
                function ObjectRuntime(paper) {
                    this.paper = paper;
                }
                ObjectRuntime.prototype.setVolume = function (volume) {
                    this.volume = volume;
                };
                ObjectRuntime.prototype.showCostume = function (costume, visible) {
                    var _this = this;
                    if (visible === void 0) { visible = true; }
                    var backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";
                    var defId = "def-" + costume.md5.split("\.")[0];
                    var spriteDef = Snap.select("#" + defId);
                    if (spriteDef) {
                        var useSvg = this.paper.use(defId);
                        if (!visible) {
                            useSvg.addClass("hide");
                        }
                        this.placeCostume(costume, useSvg);
                        this.redraw();
                    }
                    else {
                        if (costume.md5.endsWith("svg")) {
                            Snap.load(backgroundUrl, function (loadedFragment) {
                                var _this = this;
                                var defGroup = this.paper.group();
                                defGroup.attr({
                                    id: defId
                                });
                                defGroup.append(loadedFragment);
                                var def = defGroup.toDefs();
                                var useSvg = this.paper.use(defId);
                                if (!visible) {
                                    useSvg.addClass("hide");
                                }
                                this.placeCostume(costume, useSvg);
                                setTimeout(function () {
                                    // zero timeout will allow the svg to be placed and it should have bbox dimensions
                                    _this.redraw();
                                }, 0);
                            }, this);
                        }
                        else {
                            var image = this.paper.image(backgroundUrl, 0, 0, costume.centerX, costume.centerY);
                            var defGroup = this.paper.group();
                            defGroup.attr({
                                id: "def-" + costume.md5.split("\.")[0]
                            });
                            defGroup.append(image);
                            var def = defGroup.toDefs();
                            var useSvg = def.use();
                            if (!visible) {
                                useSvg.addClass("hide");
                            }
                            this.placeCostume(costume, useSvg);
                            setTimeout(function () {
                                // zero timeout will allow the svg to be placed and it should have bbox dimensions
                                _this.redraw();
                            }, 0);
                        }
                    }
                };
                return ObjectRuntime;
            })();
            exports_1("ObjectRuntime", ObjectRuntime);
        }
    }
});
//# sourceMappingURL=object.runtime.js.map