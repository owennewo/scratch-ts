System.register(["../../model/object.model", "../../model/stage.model", "../../shapes/geometry", "../../model/sprite.model"], function(exports_1) {
    var object_model_1, stage_model_1, geometry_1, geometry_2, sprite_model_1;
    var SensingPrims;
    return {
        setters:[
            function (object_model_1_1) {
                object_model_1 = object_model_1_1;
            },
            function (stage_model_1_1) {
                stage_model_1 = stage_model_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
                geometry_2 = geometry_1_1;
            },
            function (sprite_model_1_1) {
                sprite_model_1 = sprite_model_1_1;
            }],
        execute: function() {
            // SensingPrims.as
            // John Maloney, April 2010
            //
            // Sensing primitives.
            SensingPrims = (function () {
                function SensingPrims() {
                }
                SensingPrims.prototype.addPrimsTo = function (primTable) {
                    // sensing
                    primTable["touching:"] = this.primTouching;
                    primTable["touchingColor:"] = this.primTouchingColor;
                    primTable["color:sees:"] = this.primColorSees;
                    primTable["doAsk"] = this.primAsk;
                    primTable["answer"] = function (b, interp) { return interp.stage.runtime.lastAnswer; };
                    primTable["mousePressed"] = function (b, interp) { return interp.stage.runtime.mouseIsDown; };
                    primTable["mouseX"] = function (b, interp) { return interp.stage.runtime.mouseX; };
                    primTable["mouseY"] = function (b, interp) { return interp.stage.runtime.mouseY; };
                    primTable["timer"] = function (b, interp) { return interp.stage.runtime.timer(); };
                    primTable["timerReset"] = function (b, interp) { interp.stage.runtime.timerReset(); };
                    primTable["keyPressed:"] = this.primKeyPressed;
                    primTable["distanceTo:"] = this.primDistanceTo;
                    primTable["getAttribute:of:"] = this.primGetAttribute;
                    primTable["soundLevel"] = function (b, interp) { return interp.stage.runtime.soundLevel(); };
                    primTable["isLoud"] = function (b, interp) { return interp.stage.runtime.isLoud(); };
                    primTable["timestamp"] = this.primTimestamp;
                    primTable["timeAndDate"] = function (b, interp) { return interp.stage.runtime.getTimeString(interp.arg(this.b, 0)); };
                    primTable["getUserName"] = function (b) { return ""; };
                    // sensor
                    primTable["sensor:"] = function (b, interp) { return interp.stage.runtime.getSensor(interp.arg(this.b, 0)); };
                    primTable["sensorPressed:"] = function (b, interp) { return interp.stage.runtime.getBooleanSensor(interp.arg(this.b, 0)); };
                    // variable and list watchers
                    primTable["showVariable:"] = this.primShowWatcher;
                    primTable["hideVariable:"] = this.primHideWatcher;
                    primTable["showList:"] = this.primShowListWatcher;
                    primTable["hideList:"] = this.primHideListWatcher;
                };
                SensingPrims.prototype.primTouching = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s === null)
                        return false;
                    var arg = interp.arg(b, 0);
                    if ("_edge_" === arg) {
                        console.log("todo check edge touching");
                    }
                    if ("_mouse_" === arg) {
                        console.log("todo mouse touches");
                        return this.mouseTouches(s);
                    }
                    if (!s.visible)
                        return false;
                    for (var _i = 0, _a = interp.stage.spritesAndClonesNamed(arg); _i < _a.length; _i++) {
                        var s2 = _a[_i];
                        if (s2.visible && s2.runtime.isTouching(s.runtime))
                            return true;
                    }
                    return false;
                };
                SensingPrims.prototype.mouseTouches = function (s) {
                    // True if the mouse touches the given sprite. This test is independent
                    // of whether the sprite is hidden or 100% ghosted.
                    // Note: p and r are in the coordinate system of the sprite"s parent (i.e. the StageModel).
                    console.log("todo mouse touches");
                    // if (!s.parent) return false;
                    // if (!s.getBounds(s).contains(s.mouseX, s.mouseY)) return false;
                    // let r: Rectangle = s.bounds();
                    // if (!r.contains(s.parent.mouseX, s.parent.mouseY)) return false;
                    // return s.bitmap().hitTest(r.topLeft, 1, new Point(s.parent.mouseX, s.parent.mouseY));
                    return false;
                };
                // private let testSpr:Sprite;
                // private let myBMTest:Bitmap;
                // private let stageBMTest:Bitmap;
                SensingPrims.prototype.primTouchingColor = function (b, interp) {
                    // Note: Attempted to switch stage.stage.quality to LOW to disable anti-aliasing, which
                    // can create false colors. Unfortunately, that caused serious performance issues.
                    // let s: SpriteModel = interp.targetSprite();
                    // if (s === null) return false;
                    // let c: number = interp.arg(b, 0) | 0xFF000000;
                    // let myBM: BitmapData = s.bitmap(true);
                    // let stageBM: BitmapData = interp.stageBitmapWithoutSpriteFilteredByColor(s, c);
                    // if(s.objName === "sensor") {
                    //    if(!testSpr) {
                    //        testSpr = new Sprite();
                    //        stage.stage.addChild(testSpr);
                    //        myBMTest = new Bitmap();
                    //        myBMTest.y = 300;
                    //        testSpr.addChild(myBMTest);
                    //        stageBMTest = new Bitmap();
                    //        stageBMTest.y = 300;
                    //        testSpr.addChild(stageBMTest);
                    //    }
                    //    myBMTest.bitmapData = myBM;
                    //    stageBMTest.bitmapData = stageBM;
                    //    testSpr.graphics.clear();
                    //    testSpr.graphics.lineStyle(1);
                    //    testSpr.graphics.drawRect(myBM.width, 300, stageBM.width, stageBM.height);
                    // }
                    // return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
                    return null;
                };
                SensingPrims.prototype.primColorSees = function (b, interp) {
                    // Note: Attempted to switch stage.stage.quality to LOW to disable anti-aliasing, which
                    // can create false colors. Unfortunately, that caused serious performance issues.
                    // let s: SpriteModel = interp.targetSprite();
                    // if (s === null) return false;
                    // let c1: number = interp.arg(b, 0) | 0xFF000000;
                    // let c2: number = interp.arg(b, 1) | 0xFF000000;
                    // let myBM: BitmapData = this.bitmapFilteredByColor(s.bitmap(true), c1);
                    // let stageBM: BitmapData = interp.stageBitmapWithoutSpriteFilteredByColor(s, c2);
                    // if(!testSpr) {
                    // testSpr = new Sprite();
                    // testSpr.y = 300;
                    // stage.stage.addChild(testSpr);
                    // stageBMTest = new Bitmap();
                    // testSpr.addChild(stageBMTest);
                    // myBMTest = new Bitmap();
                    // myBMTest.filters = [new GlowFilter(0xFF00FF)];
                    // testSpr.addChild(myBMTest);
                    // }
                    // myBMTest.bitmapData = myBM;
                    // stageBMTest.bitmapData = stageBM;
                    // testSpr.graphics.clear();
                    // testSpr.graphics.lineStyle(1);
                    // testSpr.graphics.drawRect(0, 0, stageBM.width, stageBM.height);
                    // return myBM.hitTest(new Point(0, 0), 1, stageBM, new Point(0, 0), 1);
                    return null;
                };
                // used for debugging:
                // private debugView: Bitmap;
                // private showBM(bm: BitmapData): void {
                //     if (this.debugView === null) {
                //         this.debugView = new Bitmap();
                //         this.debugView.x = 100;
                //         this.debugView.y = 600;
                //         interp.stage.addChild(this.debugView);
                //     }
                //     this.debugView.bitmapData = bm;
                // }
                //
                // //	private let testBM:Bitmap = new Bitmap();
                // private bitmapFilteredByColor(srcBM: BitmapData, c: number): BitmapData {
                //     //		if(!testBM.parent) {
                //     //			testBM.y = 360; testBM.x = 15;
                //     //			stage.stage.addChild(testBM);
                //     //		}
                //     //		testBM.bitmapData = srcBM;
                //     let outBM: BitmapData = new BitmapData(srcBM.width, srcBM.height, true, 0);
                //     outBM.threshold(srcBM, srcBM.rect, srcBM.rect.topLeft, "==", c, 0xFF000000, 0xF0F8F8F0); // match only top five bits of each component
                //     return outBM;
                // }
                // private stageBitmapWithoutSpriteFilteredByColor(s: SpriteModel, c: number): BitmapData {
                //     // return interp.stage.stage.getBitmapWithoutSpriteFilteredByColor(s, c);
                // }
                SensingPrims.prototype.primAsk = function (b, interp) {
                    console.log("todo primAsk");
                    // if (interp.stage.runtime.askPromptShowing()) {
                    //     // wait if (1) some other sprite is asking (2) this question is answered (when firstTime is false)
                    //     interp.doYield();
                    //     return;
                    // }
                    // let obj: ObjectModel = interp.targetObj();
                    // if (interp.activeThread.firstTime) {
                    //     let question: string = interp.arg(b, 0);
                    //     if ((obj instanceof SpriteModel) && (obj.visible)) {
                    //         (<SpriteModel>obj).runtime.showBubble(question, "talk", b);
                    //         interp.stage.runtime.showAskPrompt("");
                    //     } else {
                    //         interp.stage.runtime.showAskPrompt(question);
                    //     }
                    //     interp.activeThread.firstTime = false;
                    //     interp.doYield();
                    // } else {
                    //     if ((obj instanceof SpriteModel) && (obj.visible)) (<SpriteModel> obj).runtime.hideBubble();
                    //     interp.activeThread.firstTime = true;
                    // }
                };
                SensingPrims.prototype.primKeyPressed = function (b, interp) {
                    var key = interp.arg(b, 0);
                    if (key === "any") {
                        for (var _i = 0, _a = interp.stage.runtime.keyIsDown; _i < _a.length; _i++) {
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
                    return interp.stage.runtime.keyIsDown[ch];
                };
                SensingPrims.prototype.primDistanceTo = function (b, interp) {
                    var s = interp.targetSprite();
                    var p = this.mouseOrSpritePosition(interp, interp.arg(b, 0));
                    if ((s === null) || (p === null))
                        return 10000;
                    var dx = p.x - s.x;
                    var dy = p.y - s.y;
                    return Math.sqrt((dx * dx) + (dy * dy));
                };
                SensingPrims.prototype.primGetAttribute = function (b, interp) {
                    var attribute = interp.arg(b, 0);
                    var obj = interp.stage.objNamed(String(interp.arg(b, 1)));
                    if (!(obj instanceof object_model_1.ObjectModel))
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
                            return s.currentCostumeIndex;
                        if ("costume name" === attribute)
                            return s.costumes[s.currentCostumeIndex].name;
                        if ("size" === attribute)
                            return s.runtime.getSize();
                        if ("volume" === attribute)
                            return s.runtime.volume;
                    }
                    if (obj instanceof stage_model_1.StageModel) {
                        if ("background #" === attribute)
                            return obj.currentCostumeIndex; // support for old 1.4 BlockModels
                        if ("backdrop #" === attribute)
                            return obj.currentCostumeIndex;
                        if ("backdrop name" === attribute)
                            return obj.costumes[obj.currentCostumeIndex].name;
                        if ("volume" === attribute)
                            return obj.runtime.volume;
                    }
                    console.log("todo ownsVar/lookup vars");
                    // if (obj.ownsVar(attribute)) return obj.lookupVar(attribute).value; // variable
                    return 0;
                };
                SensingPrims.prototype.mouseOrSpritePosition = function (interp, arg) {
                    if (arg === "_mouse_") {
                        return new geometry_2.Point(interp.stage.runtime.mouseX, interp.stage.runtime.mouseY);
                    }
                    else {
                        var s = interp.stage.spriteNamed(arg);
                        if (s === null)
                            return null;
                        return new geometry_2.Point(s.x, s.y);
                    }
                };
                SensingPrims.prototype.primShowWatcher = function (b, interp) {
                    var obj = interp.targetObj();
                    console.log("todo: primShowWatcher");
                    //        if (obj) interp.stage.runtime.showVarOrListFor(interp.arg(b, 0), false, obj);
                };
                SensingPrims.prototype.primHideWatcher = function (b, interp) {
                    var obj = interp.targetObj();
                    console.log("todo: primHideWatcher");
                    // if (obj) interp.stage.runtime.hideVarOrListFor(interp.arg(b, 0), false, obj);
                };
                SensingPrims.prototype.primShowListWatcher = function (b, interp) {
                    var obj = interp.targetObj();
                    console.log("todo: showVarOrListFor");
                    // if (obj) interp.stage.runtime.showVarOrListFor(interp.arg(b, 0), true, obj);
                };
                SensingPrims.prototype.primHideListWatcher = function (b, interp) {
                    var obj = interp.targetObj();
                    console.log("todo: hideVarOrListFor");
                    // if (obj) interp.stage.runtime.hideVarOrListFor(interp.arg(b, 0), true, obj);
                };
                SensingPrims.prototype.primTimestamp = function (b, interp) {
                    var millisecondsPerDay = 24 * 60 * 60 * 1000;
                    var epoch = new Date(2000, 0, 1); // Jan 1, 2000 (Note: Months are zero-based.)
                    var now = new Date();
                    var dstAdjust = now.getTimezoneOffset() - epoch.getTimezoneOffset();
                    var mSecsSinceEpoch = now.getTime() - epoch.getTime();
                    mSecsSinceEpoch += ((now.getTimezoneOffset() - dstAdjust) * 60 * 1000); // adjust to UTC (GMT)
                    return mSecsSinceEpoch / millisecondsPerDay;
                };
                // TODO: move to stage
                SensingPrims.stageRect = new geometry_1.Rectangle(0, 0, 480, 360);
                return SensingPrims;
            })();
            exports_1("SensingPrims", SensingPrims);
        }
    }
});
//# sourceMappingURL=sensing.prims.js.map