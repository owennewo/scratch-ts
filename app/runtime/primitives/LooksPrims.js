System.register([], function(exports_1) {
    "use strict";
    var LooksPrims;
    return {
        setters:[],
        execute: function() {
            // LooksPrims.as
            // John Maloney, April 2010
            //
            // Looks primitives.
            // import {Scratch} from "../Scratch";
            // import {Block} from "../blocks/Block";
            // import {ScratchObj} from "../scratch/ScratchObj";
            // import {ScratchStage} from "../scratch/ScratchStage";
            // import {ScratchSprite} from "../scratch/ScratchSprite";
            // import {Interpreter} from "../interpreter/Interpreter";
            LooksPrims = (function () {
                function LooksPrims(app, interpreter) {
                    this.app = app;
                    this.interp = interpreter;
                }
                LooksPrims.prototype.addPrimsTo = function (primTable) {
                    primTable["lookLike:"] = this.primShowCostume;
                    primTable["nextCostume"] = this.primNextCostume;
                    primTable["costumeIndex"] = this.primCostumeIndex;
                    primTable["costumeName"] = this.primCostumeName;
                    primTable["showBackground:"] = this.primShowCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
                    primTable["nextBackground"] = this.primNextCostume; // used by Scratch 1.4 and earlier (doesn"t start scene hats)
                    primTable["backgroundIndex"] = this.primSceneIndex;
                    primTable["sceneName"] = this.primSceneName;
                    primTable["nextScene"] = function (b) { this.startScene("next backdrop", false); };
                    primTable["startScene"] = function (b) { this.startScene(this.interp.arg(this.b, 0), false); };
                    primTable["startSceneAndWait"] = function (b) { this.startScene(this.interp.arg(this.b, 0), true); };
                    primTable["say:duration:elapsed:from:"] = function (b) { this.showBubbleAndWait(this.b, "talk"); };
                    primTable["say:"] = function (b) { this.showBubble(this.b, "talk"); };
                    primTable["think:duration:elapsed:from:"] = function (b) { this.showBubbleAndWait(this.b, "think"); };
                    primTable["think:"] = function (b) { this.showBubble(this.b, "think"); };
                    primTable["changeGraphicEffect:by:"] = this.primChangeEffect;
                    primTable["setGraphicEffect:to:"] = this.primSetEffect;
                    primTable["filterReset"] = this.primClearEffects;
                    primTable["changeSizeBy:"] = this.primChangeSize;
                    primTable["setSizeTo:"] = this.primSetSize;
                    primTable["scale"] = this.primSize;
                    primTable["show"] = this.primShow;
                    primTable["hide"] = this.primHide;
                    //		primTable["hideAll"]				= primHideAll;
                    primTable["comeToFront"] = this.primGoFront;
                    primTable["goBackByLayers:"] = this.primGoBack;
                    primTable["setVideoState"] = this.primSetVideoState;
                    primTable["setVideoTransparency"] = this.primSetVideoTransparency;
                    // 	primTable["scrollAlign"]			= primScrollAlign;
                    // primTable["scrollRight"]			= primScrollRight;
                    // primTable["scrollUp"]				= primScrollUp;
                    // primTable["xScroll"]				= function(b:*):* { return app.stagePane.xScroll };
                    // primTable["yScroll"]				= function(b:*):* { return app.stagePane.yScroll };
                    primTable["setRotationStyle"] = this.primSetRotationStyle;
                };
                LooksPrims.prototype.primNextCostume = function (b) {
                    var s = this.interp.targetObj();
                    if (s != null)
                        s.showCostume(s.currentCostumeIndex + 1);
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primShowCostume = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    var arg = this.interp.arg(b, 0);
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
                            var n = Interpreter.asNumber(arg);
                            if (!isNaN(n))
                                s.showCostume(n - 1);
                            else
                                return; // arg did not match a costume name nor is it a valid number
                        }
                    }
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primCostumeIndex = function (b) {
                    var s = this.interp.targetObj();
                    return (s === null) ? 1 : s.costumeNumber();
                };
                LooksPrims.prototype.primCostumeName = function (b) {
                    var s = this.interp.targetObj();
                    return (s === null) ? "" : s.currentCostume().costumeName;
                };
                LooksPrims.prototype.primSceneIndex = function (b) {
                    return this.app.stagePane.costumeNumber();
                };
                LooksPrims.prototype.primSceneName = function (b) {
                    return this.app.stagePane.currentCostume().costumeName;
                };
                LooksPrims.prototype.startScene = function (s, waitFlag) {
                    if ("next backdrop" === s)
                        s = this.backdropNameAt(this.app.stagePane.currentCostumeIndex + 1);
                    else if ("previous backdrop" === s)
                        s = this.backdropNameAt(this.app.stagePane.currentCostumeIndex - 1);
                    else {
                        var n = Interpreter.asNumber(s);
                        if (!isNaN(n)) {
                            n = (Math.round(n) - 1) % this.app.stagePane.costumes.length;
                            if (n < 0)
                                n += this.app.stagePane.costumes.length;
                            s = this.app.stagePane.costumes[n].costumeName;
                        }
                    }
                    this.interp.startScene(s, waitFlag);
                };
                LooksPrims.prototype.backdropNameAt = function (i) {
                    var costumes = this.app.stagePane.costumes;
                    return costumes[(i + costumes.length) % costumes.length].costumeName;
                };
                LooksPrims.prototype.showBubbleAndWait = function (b, type) {
                    var text, secs;
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    if (this.interp.activeThread.firstTime) {
                        text = this.interp.arg(b, 0);
                        secs = this.interp.numarg(b, 1);
                        s.showBubble(text, type, b);
                        if (s.visible)
                            this.interp.redraw();
                        this.interp.startTimer(secs);
                    }
                    else {
                        if (this.interp.checkTimer() && s.bubble && (s.bubble.getSource() === b)) {
                            s.hideBubble();
                        }
                    }
                };
                LooksPrims.prototype.showBubble = function (b, type) {
                    if (type === void 0) { type = null; }
                    var text, secs;
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    if (type === null) {
                        type = this.interp.arg(b, 0);
                        text = this.interp.arg(b, 1);
                    }
                    else {
                        text = this.interp.arg(b, 0);
                    }
                    s.showBubble(text, type, b);
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primChangeEffect = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    var filterName = this.interp.arg(b, 0);
                    var delta = this.interp.numarg(b, 1);
                    if (delta === 0)
                        return;
                    var newValue = s.filterPack.getFilterSetting(filterName) + delta;
                    s.filterPack.setFilter(filterName, newValue);
                    s.applyFilters();
                    if (s.visible || s === Scratch.app.stagePane)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primSetEffect = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    var filterName = this.interp.arg(b, 0);
                    var newValue = this.interp.numarg(b, 1);
                    if (s.filterPack.setFilter(filterName, newValue))
                        s.applyFilters();
                    if (s.visible || s === Scratch.app.stagePane)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primClearEffects = function (b) {
                    var s = this.interp.targetObj();
                    s.clearFilters();
                    s.applyFilters();
                    if (s.visible || s === Scratch.app.stagePane)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primChangeSize = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    var oldScale = s.scaleX;
                    s.setSize(s.getSize() + this.interp.numarg(b, 0));
                    if (s.visible && (s.scaleX != oldScale))
                        this.interp.redraw();
                };
                LooksPrims.prototype.primSetRotationStyle = function (b) {
                    var s = this.interp.targetSprite();
                    var newStyle = this.interp.arg(b, 0);
                    if ((s === null) || (newStyle === null))
                        return;
                    s.setRotationStyle(newStyle);
                };
                LooksPrims.prototype.primSetSize = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    s.setSize(this.interp.numarg(b, 0));
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primSize = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return 100;
                    return Math.round(s.getSize()); // reporter returns rounded size, as in Scratch 1.4
                };
                LooksPrims.prototype.primShow = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return;
                    s.visible = true;
                    if (!this.app.isIn3D)
                        s.applyFilters();
                    s.updateBubble();
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primHide = function (b) {
                    var s = this.interp.targetSprite();
                    if ((s === null) || !s.visible)
                        return;
                    s.visible = false;
                    if (!this.app.isIn3D)
                        s.applyFilters();
                    s.updateBubble();
                    this.interp.redraw();
                };
                LooksPrims.prototype.primHideAll = function (b) {
                    // Hide all sprites and delete all clones. Only works from the stage.
                    if (!this.interp.targetObj().isStage)
                        return;
                    this.app.stagePane.deleteClones();
                    for (var i = 0; i < this.app.stagePane.numChildren; i++) {
                        var o = this.app.stagePane.getChildAt(i);
                        if (o instanceof ScratchSprite) {
                            o.visible = false;
                            o.updateBubble();
                        }
                    }
                    this.interp.redraw();
                };
                LooksPrims.prototype.primGoFront = function (b) {
                    var s = this.interp.targetSprite();
                    if ((s === null) || (s.parent === null))
                        return;
                    s.parent.setChildIndex(s, s.parent.numChildren - 1);
                    if (s.visible)
                        this.interp.redraw();
                };
                LooksPrims.prototype.primGoBack = function (b) {
                    var s = this.interp.targetSprite();
                    if ((s === null) || (s.parent === null))
                        return;
                    var newIndex = s.parent.getChildIndex(s) - this.interp.numarg(b, 0);
                    newIndex = Math.max(this.minSpriteLayer(), Math.min(newIndex, s.parent.numChildren - 1));
                    if (newIndex > 0 && newIndex < s.parent.numChildren) {
                        s.parent.setChildIndex(s, newIndex);
                        if (s.visible)
                            this.interp.redraw();
                    }
                };
                LooksPrims.prototype.minSpriteLayer = function () {
                    // Return the lowest sprite layer.
                    var stg = this.app.stagePane;
                    return stg.getChildIndex(stg.videoImage ? stg.videoImage : stg.penLayer) + 1;
                };
                LooksPrims.prototype.primSetVideoState = function (b) {
                    this.app.stagePane.setVideoState(this.interp.arg(b, 0));
                };
                LooksPrims.prototype.primSetVideoTransparency = function (b) {
                    this.app.stagePane.setVideoTransparency(this.interp.numarg(b, 0));
                    this.app.stagePane.setVideoState("on");
                };
                LooksPrims.prototype.primScrollAlign = function (b) {
                    if (!this.interp.targetObj().isStage)
                        return;
                    this.app.stagePane.scrollAlign(this.interp.arg(b, 0));
                };
                LooksPrims.prototype.primScrollRight = function (b) {
                    if (!this.interp.targetObj().isStage)
                        return;
                    this.app.stagePane.scrollRight(this.interp.numarg(b, 0));
                };
                LooksPrims.prototype.primScrollUp = function (b) {
                    if (!this.interp.targetObj().isStage)
                        return;
                    this.app.stagePane.scrollUp(this.interp.numarg(b, 0));
                };
                return LooksPrims;
            }());
            exports_1("LooksPrims", LooksPrims);
        }
    }
});
//}
//# sourceMappingURL=LooksPrims.js.map