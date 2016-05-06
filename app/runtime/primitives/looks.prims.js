System.register(["../../model/stage.model", "../../model/sprite.model", "../interpreter"], function(exports_1) {
    var stage_model_1, sprite_model_1, interpreter_1;
    var LooksPrims;
    return {
        setters:[
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            },
            function (interpreter_1_1) {
                interpreter_1 = interpreter_1_1;
            }],
        execute: function() {
            // LooksPrims.as
            // John Maloney, April 2010
            //
            // Looks primitives.
            LooksPrims = (function () {
                function LooksPrims() {
                }
                LooksPrims.prototype.addPrimsTo = function (primTable) {
                    var _this = this;
                    primTable["lookLike:"] = this.primShowCostume;
                    primTable["nextCostume"] = this.primNextCostume;
                    primTable["costumeIndex"] = this.primCostumeIndex;
                    primTable["costumeName"] = this.primCostumeName;
                    primTable["showBackground:"] = this.primShowCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
                    primTable["nextBackground"] = this.primNextCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
                    primTable["backgroundIndex"] = this.primSceneIndex;
                    primTable["sceneName"] = this.primSceneName;
                    primTable["nextScene"] = function (b, interp) { _this.startScene(interp, "next backdrop", false); };
                    primTable["startScene"] = function (b, interp) { _this.startScene(interp, interp.arg(b, 0), false); };
                    primTable["startSceneAndWait"] = function (b, interp) { _this.startScene(interp, interp.arg(b, 0), true); };
                    primTable["say:duration:elapsed:from:"] = function (b, interp) { _this.showBubbleAndWait(b, interp, "talk"); };
                    primTable["say:"] = function (b, interp) { _this.showBubble(b, interp, "talk"); };
                    primTable["think:duration:elapsed:from:"] = function (b, interp) { _this.showBubbleAndWait(b, interp, "think"); };
                    primTable["think:"] = function (b, interp) { _this.showBubble(b, interp, "think"); };
                    primTable["changeGraphicEffect:by:"] = this.primChangeEffect;
                    primTable["setGraphicEffect:to:"] = this.primSetEffect;
                    primTable["filterReset"] = this.primClearEffects;
                    primTable["changeSizeBy:"] = this.primChangeSize;
                    primTable["setSizeTo:"] = this.primSetSize;
                    primTable["scale"] = this.primSize;
                    primTable["show"] = this.primShow;
                    primTable["hide"] = this.primHide;
                    // primTable["hideAll"]				= primHideAll;
                    primTable["comeToFront"] = this.primGoFront;
                    primTable["goBackByLayers:"] = this.primGoBack;
                    primTable["setVideoState"] = this.primSetVideoState;
                    primTable["setVideoTransparency"] = this.primSetVideoTransparency;
                    // 	primTable["scrollAlign"]			= primScrollAlign;
                    // primTable["scrollRight"]			= primScrollRight;
                    // primTable["scrollUp"]				= primScrollUp;
                    // primTable["xScroll"]				= function(b:*):* { return stage.xScroll };
                    // primTable["yScroll"]				= function(b:*):* { return stage.yScroll };
                    primTable["setRotationStyle"] = this.primSetRotationStyle;
                };
                LooksPrims.prototype.primNextCostume = function (b, interp) {
                    var s = interp.targetObj();
                    if (s != null)
                        s.showCostume(s.currentCostumeIndex + 1);
                    if (s.runtime.visible)
                        interp.redraw();
                };
                LooksPrims.prototype.primShowCostume = function (b, interp) {
                    var s = interp.targetObj();
                    if (s === null)
                        return;
                    var arg = interp.arg(b, 0);
                    if (typeof (arg) === "number") {
                        s.showCostume(arg - 1);
                    }
                    else {
                        var i = s.indexOfCostumeNamed(arg);
                        if (i >= 0) {
                            s.showCostume(i);
                        }
                        else if ("previous costume" === arg) {
                            s.showCostume(s.currentCostumeIndex - 1);
                        }
                        else if ("next costume" === arg) {
                            s.showCostume(s.currentCostumeIndex + 1);
                        }
                        else {
                            var n = interpreter_1.Interpreter.asNumber(arg);
                            if (!isNaN(n))
                                s.showCostume(n - 1);
                            else
                                return; // arg did not match a costume name nor is it a valid number
                        }
                    }
                    if (s.runtime.visible)
                        interp.redraw();
                };
                LooksPrims.prototype.primCostumeIndex = function (b, interp) {
                    var s = interp.targetObj();
                    return (s === null) ? 1 : s.currentCostumeIndex;
                };
                LooksPrims.prototype.primCostumeName = function (b, interp) {
                    var s = interp.targetObj();
                    return (s === null) ? "" : s.costumes[s.currentCostumeIndex].name;
                };
                LooksPrims.prototype.primSceneIndex = function (b, interp) {
                    return interp.stage.currentCostumeIndex;
                };
                LooksPrims.prototype.primSceneName = function (b, interp) {
                    return interp.stage.costumes[interp.stage.currentCostumeIndex].name;
                };
                LooksPrims.prototype.startScene = function (interp, s, waitFlag) {
                    if ("next backdrop" === s)
                        s = LooksPrims.backdropNameAt(interp, interp.stage.currentCostumeIndex + 1);
                    else if ("previous backdrop" === s)
                        s = LooksPrims.backdropNameAt(interp, interp.stage.currentCostumeIndex - 1);
                    else {
                        var n = interpreter_1.Interpreter.asNumber(s);
                        if (!isNaN(n)) {
                            n = (Math.round(n) - 1) % interp.stage.costumes.length;
                            if (n < 0)
                                n += interp.stage.costumes.length;
                            s = interp.stage.costumes[n].name;
                        }
                    }
                    interp.startScene(s, waitFlag);
                };
                LooksPrims.backdropNameAt = function (interp, i) {
                    var costumes = interp.stage.costumes;
                    return costumes[(i + costumes.length) % costumes.length].costumeName;
                };
                LooksPrims.prototype.showBubbleAndWait = function (b, interp, type) {
                    var text, secs;
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    if (interp.activeThread.firstTime) {
                        text = interp.arg(b, 0);
                        secs = interp.numarg(b, 1);
                        s.runtime.showBubble(text, type, b);
                        if (s.visible)
                            interp.redraw();
                        interp.startTimer(secs);
                    }
                    else {
                        if (interp.checkTimer() && s.runtime.bubble && (s.runtime.bubbleSource === b)) {
                            s.runtime.hideBubble();
                        }
                    }
                };
                LooksPrims.prototype.showBubble = function (b, interp, type) {
                    if (type === void 0) { type = null; }
                    var text, secs;
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    if (type === null) {
                        type = interp.arg(b, 0);
                        text = interp.arg(b, 1);
                    }
                    else {
                        text = interp.arg(b, 0);
                    }
                    s.runtime.showBubble(text, type, b);
                    if (s.visible)
                        interp.redraw();
                };
                LooksPrims.prototype.primChangeEffect = function (b, interp) {
                    var s = interp.targetObj();
                    if (s === null)
                        return;
                    var filterName = interp.arg(b, 0);
                    var delta = interp.numarg(b, 1);
                    if (delta === 0)
                        return;
                    console.log("todo:  primChangeEffect");
                    // let newValue: number = s.runtime.filterPack.getFilterSetting(filterName) + delta;
                    // s.runtime.filterPack.setFilter(filterName, newValue);
                    // s.runtime.stagelyFilters();
                    // if (s.runtime.visible || s === Scratch.stage) interp.redraw();
                };
                LooksPrims.prototype.primSetEffect = function (b, interp) {
                    console.log("todo primSetEffect");
                    // let s: ObjectModel = interp.targetObj();
                    // if (s === null) return;
                    // let filterName: string = interp.arg(b, 0);
                    // let newValue: number = interp.numarg(b, 1);
                    // if (s.filterPack.setFilter(filterName, newValue))
                    //     s.stagelyFilters();
                    // if (s.visible || s === Scratch.stage) interp.redraw();
                };
                LooksPrims.prototype.primClearEffects = function (b, interp) {
                    console.log("todo primClearEffects");
                    // let s: ScratchObj = interp.targetObj();
                    // s.clearFilters();
                    // s.stagelyFilters();
                    // if (s.visible || s === Scratch.stage) interp.redraw();
                };
                LooksPrims.prototype.primChangeSize = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    // let oldScale: number = s.scale;
                    var oldSize = s.runtime.getSize();
                    var oldScale = s.scale;
                    var newSize = oldSize + interp.numarg(b, 0);
                    var newScale = newSize * oldScale / oldSize;
                    s.scale = newScale;
                    //s.runtime.setSize(s.runtime.getSize() + interp.numarg(b, 0));
                    if (s.visible && (s.runtime.scaleX !== oldScale))
                        interp.redraw();
                    s.runtime.redraw();
                };
                LooksPrims.prototype.primSetRotationStyle = function (b, interp) {
                    var s = interp.targetSprite();
                    var newStyle = interp.arg(b, 0);
                    if ((s === null) || (newStyle === null))
                        return;
                    s.setRotationStyle(newStyle);
                };
                LooksPrims.prototype.primSetSize = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    var size = interp.numarg(b, 0);
                    s.scale = size / 100;
                    // s.runtime.setSize(size);
                    if (s.visible)
                        s.runtime.redraw();
                };
                LooksPrims.prototype.primSize = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return 100;
                    return Math.round(s.runtime.getSize()); // reporter returns rounded size, as in Scratch 1.4
                };
                LooksPrims.prototype.primShow = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return;
                    s.visible = true;
                    s.runtime.svg.removeClass("hide");
                    // if (!interp.stage.isIn3D) s.stagelyFilters();
                    if (s instanceof sprite_model_1.SpriteModel) {
                        s.runtime.updateBubble();
                    }
                    if (s.visible)
                        interp.redraw();
                };
                LooksPrims.prototype.primHide = function (b, interp) {
                    var s = interp.targetSprite();
                    if ((s === null) || !s.visible)
                        return;
                    s.visible = false;
                    s.runtime.svg.addClass("hide");
                    // if (!interp.stage.isIn3D) s.stagelyFilters();
                    s.runtime.updateBubble();
                    interp.redraw();
                };
                LooksPrims.prototype.primHideAll = function (b, interp) {
                    // Hide all sprites and delete all clones. Only works from the stage.
                    if (!(interp.targetObj() instanceof stage_model_1.StageModel))
                        return;
                    interp.stage.runtime.deleteClones();
                    for (var i = 0; i < interp.stage.children.length; i++) {
                        var o = interp.stage.children[i];
                        if (o instanceof sprite_model_1.SpriteModel) {
                            o.visible = false;
                            o.updateBubble();
                        }
                    }
                    interp.redraw();
                };
                LooksPrims.prototype.primGoFront = function (b, interp) {
                    console.log("todo go to front");
                    // let s: SpriteModel = interp.targetSprite();
                    // if ((s === null) || (s.parent === null)) return;
                    // s.parent.setChildIndex(s, s.parent.numChildren - 1);
                    // if (s.visible) interp.redraw();
                };
                LooksPrims.prototype.primGoBack = function (b, interp) {
                    console.log("todo go to back");
                    // let s: SpriteModel = interp.targetSprite();
                    // if ((s === null) || (s.parent === null)) return;
                    // let newIndex: number = s.parent.getChildIndex(s) - interp.numarg(b, 0);
                    // newIndex = Math.max(LooksPrims.minSpriteLayer(), Math.min(newIndex, s.parent.numChildren - 1));
                    //
                    // if (newIndex > 0 && newIndex < s.parent.numChildren) {
                    //     s.parent.setChildIndex(s, newIndex);
                    //     if (s.visible) interp.redraw();
                    // }
                };
                LooksPrims.prototype.minSpriteLayer = function () {
                    // Return the lowest sprite layer.
                    // let stg: StageModel = interp.stage;
                    // return stg.getChildIndex(stg.videoImage ? stg.videoImage : stg.penLayer) + 1;
                    console.log("todo min SpriteLayer");
                    return -1;
                };
                LooksPrims.prototype.primSetVideoState = function (b, interp) {
                    console.log("todo primSetVideoState");
                    // interp.stage.setVideoState(interp.arg(b, 0));
                };
                LooksPrims.prototype.primSetVideoTransparency = function (b, interp) {
                    console.log("todo primSetVideoTransparency");
                    // interp.stage.setVideoTransparency(interp.numarg(b, 0));
                    // interp.stage.setVideoState("on");
                };
                LooksPrims.prototype.primScrollAlign = function (b, interp) {
                    console.log("todo primScrollAlign");
                    // if (!interp.targetObj().isStage) return;
                    // interp.stage.scrollAlign(interp.arg(b, 0));
                };
                LooksPrims.prototype.primScrollRight = function (b, interp) {
                    console.log("todo primScrollRight");
                    // if (!interp.targetObj().isStage) return;
                    // interp.stage.scrollRight(interp.numarg(b, 0));
                };
                LooksPrims.prototype.primScrollUp = function (b, interp) {
                    console.log("todo primScrollUp");
                    // if (!interp.targetObj().isStage) return;
                    // interp.stage.scrollUp(interp.numarg(b, 0));
                };
                return LooksPrims;
            })();
            exports_1("LooksPrims", LooksPrims);
        }
    }
});
//# sourceMappingURL=looks.prims.js.map