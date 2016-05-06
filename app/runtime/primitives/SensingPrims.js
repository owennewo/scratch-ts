System.register(["../../model/sprite.model"], function(exports_1) {
    "use strict";
    var sprite_model_1;
    var SensingPrims;
    return {
        setters:[
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            }],
        execute: function() {
            // SensingPrims.as
            // John Maloney, April 2010
            //
            // Sensing primitives.
            SensingPrims = (function () {
                function SensingPrims(app, interpreter) {
                    this.app = app;
                    this.interp = interpreter;
                }
                SensingPrims.prototype.addPrimsTo = function (primTable) {
                    // sensing
                    primTable["touching:"] = this.primTouching;
                    primTable["touchingColor:"] = this.primTouchingColor;
                    primTable["color:sees:"] = this.primColorSees;
                    primTable["doAsk"] = this.primAsk;
                    primTable["answer"] = function (b) { return this.app.runtime.lastAnswer; };
                    primTable["mousePressed"] = function (b) { return this.app.gh.mouseIsDown; };
                    primTable["mouseX"] = function (b) { return this.app.stagePane.scratchMouseX(); };
                    primTable["mouseY"] = function (b) { return this.app.stagePane.scratchMouseY(); };
                    primTable["timer"] = function (b) { return this.app.runtime.timer(); };
                    primTable["timerReset"] = function (b) { this.app.runtime.timerReset(); };
                    primTable["keyPressed:"] = this.primKeyPressed;
                    primTable["distanceTo:"] = this.primDistanceTo;
                    primTable["getAttribute:of:"] = this.primGetAttribute;
                    primTable["soundLevel"] = function (b) { return this.app.runtime.soundLevel(); };
                    primTable["isLoud"] = function (b) { return this.app.runtime.isLoud(); };
                    primTable["timestamp"] = this.primTimestamp;
                    primTable["timeAndDate"] = function (b) { return this.app.runtime.getTimeString(this.interp.arg(this.b, 0)); };
                    primTable["getUserName"] = function (b) { return ""; };
                    // sensor
                    primTable["sensor:"] = function (b) { return this.app.runtime.getSensor(this.interp.arg(this.b, 0)); };
                    primTable["sensorPressed:"] = function (b) { return this.app.runtime.getBooleanSensor(this.interp.arg(this.b, 0)); };
                    // variable and list watchers
                    primTable["showVariable:"] = this.primShowWatcher;
                    primTable["hideVariable:"] = this.primHideWatcher;
                    primTable["showList:"] = this.primShowListWatcher;
                    primTable["hideList:"] = this.primHideListWatcher;
                };
                SensingPrims.prototype.primTouching = function (b) {
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return false;
                    var arg = this.interp.arg(b, 0);
                    if ("_edge_" === arg) {
                        if (SensingPrims.stageRect.containsRect(s.getBounds(s.parent)))
                            return false;
                        var r = s.bounds();
                        return (r.left < 0) || (r.right > ScratchObj.STAGEW) ||
                            (r.top < 0) || (r.bottom > ScratchObj.STAGEH);
                    }
                    if ("_mouse_" === arg) {
                        return this.mouseTouches(s);
                    }
                    if (!s.visible)
                        return false;
                    ;
                    var sBM = s.bitmap(true);
                    for (var _i = 0, _a = this.app.stagePane.spritesAndClonesNamed(arg); _i < _a.length; _i++) {
                        var s2 = _a[_i];
                        if (s2.visible && sBM.hitTest(s.bounds().topLeft, 1, s2.bitmap(true), s2.bounds().topLeft, 1))
                            return true;
                    }
                    return false;
                };
                SensingPrims.prototype.mouseTouches = function (s) {
                    // True if the mouse touches the given sprite. This test is independent
                    // of whether the sprite is hidden or 100% ghosted.
                    // Note: p and r are in the coordinate system of the sprite"s parent (i.e. the ScratchStage).
                    if (!s.parent)
                        return false;
                    if (!s.getBounds(s).contains(s.mouseX, s.mouseY))
                        return false;
                    var r = s.bounds();
                    if (!r.contains(s.parent.mouseX, s.parent.mouseY))
                        return false;
                    return s.bitmap().hitTest(r.topLeft, 1, new Point(s.parent.mouseX, s.parent.mouseY));
                };
                //	private let testSpr:Sprite;
                //	private let myBMTest:Bitmap;
                //	private let stageBMTest:Bitmap;
                SensingPrims.prototype.primTouchingColor = function (b) {
                    // Note: Attempted to switch app.stage.quality to LOW to disable anti-aliasing, which
                    // can create false colors. Unfortunately, that caused serious performance issues.
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return false;
                    var c = this.interp.arg(b, 0) | 0xFF000000;
                    var myBM = s.bitmap(true);
                    var stageBM = this.stageBitmapWithoutSpriteFilteredByColor(s, c);
                    //		if(s.objName === "sensor") {
                    //			if(!testSpr) {
                    //				testSpr = new Sprite();
                    //				app.stage.addChild(testSpr);
                    //				myBMTest = new Bitmap();
                    //				myBMTest.y = 300;
                    //				testSpr.addChild(myBMTest);
                    //				stageBMTest = new Bitmap();
                    //				stageBMTest.y = 300;
                    //				testSpr.addChild(stageBMTest);
                    //			}
                    //			myBMTest.bitmapData = myBM;
                    //			stageBMTest.bitmapData = stageBM;
                    //			testSpr.graphics.clear();
                    //			testSpr.graphics.lineStyle(1);
                    //			testSpr.graphics.drawRect(myBM.width, 300, stageBM.width, stageBM.height);
                    //		}
                    return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
                };
                SensingPrims.prototype.primColorSees = function (b) {
                    // Note: Attempted to switch app.stage.quality to LOW to disable anti-aliasing, which
                    // can create false colors. Unfortunately, that caused serious performance issues.
                    var s = this.interp.targetSprite();
                    if (s === null)
                        return false;
                    var c1 = this.interp.arg(b, 0) | 0xFF000000;
                    var c2 = this.interp.arg(b, 1) | 0xFF000000;
                    var myBM = this.bitmapFilteredByColor(s.bitmap(true), c1);
                    var stageBM = this.stageBitmapWithoutSpriteFilteredByColor(s, c2);
                    //		if(!testSpr) {
                    //			testSpr = new Sprite();
                    //			testSpr.y = 300;
                    //			app.stage.addChild(testSpr);
                    //			stageBMTest = new Bitmap();
                    //			testSpr.addChild(stageBMTest);
                    //			myBMTest = new Bitmap();
                    //			myBMTest.filters = [new GlowFilter(0xFF00FF)];
                    //			testSpr.addChild(myBMTest);
                    //		}
                    //		myBMTest.bitmapData = myBM;
                    //		stageBMTest.bitmapData = stageBM;
                    //		testSpr.graphics.clear();
                    //		testSpr.graphics.lineStyle(1);
                    //		testSpr.graphics.drawRect(0, 0, stageBM.width, stageBM.height);
                    return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
                };
                SensingPrims.prototype.showBM = function (bm) {
                    if (this.debugView === null) {
                        this.debugView = new Bitmap();
                        this.debugView.x = 100;
                        this.debugView.y = 600;
                        this.app.addChild(this.debugView);
                    }
                    this.debugView.bitmapData = bm;
                };
                //	private let testBM:Bitmap = new Bitmap();
                SensingPrims.prototype.bitmapFilteredByColor = function (srcBM, c) {
                    //		if(!testBM.parent) {
                    //			testBM.y = 360; testBM.x = 15;
                    //			app.stage.addChild(testBM);
                    //		}
                    //		testBM.bitmapData = srcBM;
                    var outBM = new BitmapData(srcBM.width, srcBM.height, true, 0);
                    outBM.threshold(srcBM, srcBM.rect, srcBM.rect.topLeft, "==", c, 0xFF000000, 0xF0F8F8F0); // match only top five bits of each component
                    return outBM;
                };
                SensingPrims.prototype.stageBitmapWithoutSpriteFilteredByColor = function (s, c) {
                    return this.app.stagePane.getBitmapWithoutSpriteFilteredByColor(s, c);
                };
                SensingPrims.prototype.primAsk = function (b) {
                    if (this.app.runtime.askPromptShowing()) {
                        // wait if (1) some other sprite is asking (2) this question is answered (when firstTime is false)
                        this.interp.doYield();
                        return;
                    }
                    var obj = this.interp.targetObj();
                    if (this.interp.activeThread.firstTime) {
                        var question = this.interp.arg(b, 0);
                        if ((obj instanceof sprite_model_1.SpriteModel) && (obj.visible)) {
                            obj.showBubble(question, "talk", true);
                            this.app.runtime.showAskPrompt("");
                        }
                        else {
                            this.app.runtime.showAskPrompt(question);
                        }
                        this.interp.activeThread.firstTime = false;
                        this.interp.doYield();
                    }
                    else {
                        if ((obj instanceof sprite_model_1.SpriteModel) && (obj.visible))
                            obj.hideBubble();
                        this.interp.activeThread.firstTime = true;
                    }
                };
                SensingPrims.prototype.primKeyPressed = function (b) {
                    var key = this.interp.arg(b, 0);
                    if (key === "any") {
                        for (var _i = 0, _a = this.app.runtime.keyIsDown; _i < _a.length; _i++) {
                            var k = _a[_i];
                            if (k)
                                return true;
                        }
                        return false;
                    }
                    var ch = key.charCodeAt(0);
                    if (ch > 127)
                        return false;
                    if (key === "left arrow")
                        ch = 28;
                    if (key === "right arrow")
                        ch = 29;
                    if (key === "up arrow")
                        ch = 30;
                    if (key === "down arrow")
                        ch = 31;
                    if (key === "space")
                        ch = 32;
                    return this.app.runtime.keyIsDown[ch];
                };
                SensingPrims.prototype.primDistanceTo = function (b) {
                    var s = this.interp.targetSprite();
                    var p = this.mouseOrSpritePosition(this.interp.arg(b, 0));
                    if ((s === null) || (p === null))
                        return 10000;
                    var dx = p.x - s.x;
                    var dy = p.y - s.y;
                    return Math.sqrt((dx * dx) + (dy * dy));
                };
                SensingPrims.prototype.primGetAttribute = function (b) {
                    var attribute = this.interp.arg(b, 0);
                    var obj = this.app.stagePane.objNamed(String(this.interp.arg(b, 1)));
                    if (!(obj instanceof ScratchObj))
                        return 0;
                    if (obj instanceof sprite_model_1.SpriteModel) {
                        var s = obj;
                        if ("x position" === attribute)
                            return s.x;
                        if ("y position" === attribute)
                            return s.y;
                        if ("direction" === attribute)
                            return s.direction;
                        if ("costume #" === attribute)
                            return s.costumeNumber();
                        if ("costume name" === attribute)
                            return s.currentCostume().costumeName;
                        if ("size" === attribute)
                            return s.getSize();
                        if ("volume" === attribute)
                            return s.volume;
                    }
                    if (obj instanceof ScratchStage) {
                        if ("background #" === attribute)
                            return obj.costumeNumber(); // support for old 1.4 BlockModels
                        if ("backdrop #" === attribute)
                            return obj.costumeNumber();
                        if ("backdrop name" === attribute)
                            return obj.currentCostume().costumeName;
                        if ("volume" === attribute)
                            return obj.volume;
                    }
                    if (obj.ownsVar(attribute))
                        return obj.lookupVar(attribute).value; // variable
                    return 0;
                };
                SensingPrims.prototype.mouseOrSpritePosition = function (arg) {
                    if (arg === "_mouse_") {
                        var w = this.app.stagePane;
                        return new Point(w.scratchMouseX(), w.scratchMouseY());
                    }
                    else {
                        var s = this.app.stagePane.spriteNamed(arg);
                        if (s === null)
                            return null;
                        return new Point(s.x, s.y);
                    }
                    return null;
                };
                SensingPrims.prototype.primShowWatcher = function (b) {
                    var obj = this.interp.targetObj();
                    if (obj)
                        this.app.runtime.showVarOrListFor(this.interp.arg(b, 0), false, obj);
                };
                SensingPrims.prototype.primHideWatcher = function (b) {
                    var obj = this.interp.targetObj();
                    if (obj)
                        this.app.runtime.hideVarOrListFor(this.interp.arg(b, 0), false, obj);
                };
                SensingPrims.prototype.primShowListWatcher = function (b) {
                    var obj = this.interp.targetObj();
                    if (obj)
                        this.app.runtime.showVarOrListFor(this.interp.arg(b, 0), true, obj);
                };
                SensingPrims.prototype.primHideListWatcher = function (b) {
                    var obj = this.interp.targetObj();
                    if (obj)
                        this.app.runtime.hideVarOrListFor(this.interp.arg(b, 0), true, obj);
                };
                SensingPrims.prototype.primTimestamp = function (b) {
                    var millisecondsPerDay = 24 * 60 * 60 * 1000;
                    var epoch = new Date(2000, 0, 1); // Jan 1, 2000 (Note: Months are zero-based.)
                    var now = new Date();
                    var dstAdjust = now.getTimezoneOffset() - epoch.getTimezoneOffset();
                    var mSecsSinceEpoch = now.getTime() - epoch.getTime();
                    mSecsSinceEpoch += ((now.getTimezoneOffset() - dstAdjust) * 60 * 1000); // adjust to UTC (GMT)
                    return mSecsSinceEpoch / millisecondsPerDay;
                };
                // TODO: move to stage
                SensingPrims.stageRect = new Rectangle(0, 0, 480, 360);
                return SensingPrims;
            }());
            exports_1("SensingPrims", SensingPrims);
        }
    }
});
//# sourceMappingURL=SensingPrims.js.map