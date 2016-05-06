System.register(["../services/script.layout.service", "./block.base.model", "../shapes/stack.shape", "./spec.model", "../shapes/geometry", "./blockarg.model", "../utils/translator"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var script_layout_service_1, block_base_model_1, stack_shape_1, spec_model_1, geometry_1, blockarg_model_1, translator_1;
    var BlockModel;
    return {
        setters:[
            function (script_layout_service_1_1) {
                script_layout_service_1 = script_layout_service_1_1;
            },
            function (block_base_model_1_1) {
                block_base_model_1 = block_base_model_1_1;
            },
            function (stack_shape_1_1) {
                stack_shape_1 = stack_shape_1_1;
            },
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (translator_1_1) {
                translator_1 = translator_1_1;
            }],
        execute: function() {
            BlockModel = (function (_super) {
                __extends(BlockModel, _super);
                // private originalPosition:Point;
                function BlockModel(spec, defaultArgs) {
                    if (defaultArgs === void 0) { defaultArgs = null; }
                    _super.call(this);
                    this.minCommandWidth = 36;
                    this.minHatWidth = 80;
                    this.minLoopWidth = 80;
                    this.args = [];
                    this.defaultArgValues = [];
                    this.parameterIndex = -1; // cache of parameter index, used by GET_PARAM block
                    this.isHat = false;
                    this.isReporter = false;
                    this.isTerminal = false; // blocks that end a stack like "stop" or "forever"
                    // Blocking operations
                    this.isRequester = false;
                    this.forcedRequester = false; // We've forced requester-like treatment on a non-requester block.
                    this.requestState = 0; // 0 - no request made, 1 - awaiting response, 2 - data ready
                    this.response = null;
                    this.labelsAndArgs = [];
                    // private argTypes: any[] = [];
                    // private elseLabel:TextField;
                    this.indentTop = 2;
                    this.indentBottom = 3;
                    this.indentLeft = 4;
                    this.indentRight = 3;
                    this.spec = spec;
                    var shape;
                    if (!spec) {
                        console.error("error: spec is null");
                    }
                    this.setArgs(defaultArgs);
                }
                BlockModel.prototype.setArgs = function (defaultArgs) {
                    if (defaultArgs === void 0) { defaultArgs = null; }
                    if (this.spec.code === spec_model_1.SpecOperation.ProcedureDef) {
                        // procedure hat: make an icon from my spec and use that as the label
                        this.indentTop = 20;
                        this.indentBottom = 5;
                        this.indentLeft = 5;
                        this.indentRight = 5;
                        this.labelsAndArgs = [];
                        var b;
                    }
                    else if (this.spec.code === spec_model_1.SpecOperation.GetList || this.spec.code === spec_model_1.SpecOperation.GetList) {
                    }
                    else {
                        // loop
                        this.labelsAndArgs = this.spec.cloneLabelAndArgs();
                    }
                    this.rightToLeft = translator_1.Translator.rightToLeft;
                    // TODO: right to left
                    // if (this.rightToLeft) {
                    //     if (["+", "-", "*", "/", "%"].indexOf(this.op) > -1) this.rightToLeft = Translator.rightToLeftMath;
                    //     if ([">", "<"].indexOf(this.op) > -1) this.rightToLeft = false; // never change order of comparison ops
                    // }
                    if (this.rightToLeft) {
                        // reverse specs that don't start with arg specifier or an ASCII character
                        this.labelsAndArgs.reverse();
                        if (defaultArgs)
                            defaultArgs.reverse();
                    }
                    // for (let item of this.labelsAndArgs) this.addChild(item);
                    // if (defaultArgs) this.setDefaultArgs(defaultArgs);
                    // this.fixArgLayout();
                    this.collectArgs();
                };
                Object.defineProperty(BlockModel.prototype, "broadcastMsg", {
                    get: function () {
                        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
                            var arg = _a[_i];
                            if (arg instanceof blockarg_model_1.BlockArgModel && arg.menuName === "broadcast") {
                                return arg.argValue;
                            }
                        }
                        return null;
                    },
                    set: function (listName) {
                        for (var _i = 0, _a = this.args; _i < _a.length; _i++) {
                            var arg = _a[_i];
                            if (arg instanceof blockarg_model_1.BlockArgModel && arg.menuName === "broadcast") {
                                arg.setArgValue(listName);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                BlockModel.prototype.normalizedArgs = function () {
                    return this.rightToLeft ? this.args.concat().reverse() : this.args;
                };
                // changeOperator(newOp:string):void {
                // 	// Used to switch among a family of related operators (e.g. +, -, *, and /).
                // 	// Note: This does not deal with translation, so it only works for symbolic operators.
                // 	for (let item of this.labelsAndArgs) {
                // 		if ((item instanceof TextField) && (item.text === this.op)) item.text = newOp;
                // 	}
                // 	this.op = newOp;
                // 	this.opFunction = null;
                // 	this.fixArgLayout();
                // }
                // static setFonts(labelSize:number, argSize:number, boldFlag:boolean, vOffset:number):void {
                // 	let font:string = Resources.chooseFont([
                // 		'Lucida Grande', 'Verdana', 'Arial', 'DejaVu Sans']);
                // 	BlockModel.blockLabelFormat = new TextFormat(font, labelSize, 0xFFFFFF, boldFlag);
                // 	BlockModel.argTextFormat = new TextFormat(font, argSize, 0x505050, false);
                // 	BlockModel.vOffset = vOffset;
                // }
                // private declarationBlock():BlockModel {
                // 	// Create a block representing a procedure declaration to be embedded in a
                // 	// procedure definition header block. For each formal parameter, embed a
                // 	// reporter for that parameter.
                // 	let b:BlockModel = new BlockModel(this.spec, "o", Specs.procedureColor, 'proc_declaration');
                // 	if (!this.parameterNames) this.parameterNames = [];
                // 	for (let i:number = 0; i < this.parameterNames.length; i++) {
                // 		let argType:string = (typeof(this.defaultArgValues[i]) === 'boolean') ? 'b' : 'r';
                // 		let pBlock:BlockModel = new BlockModel(this.parameterNames[i], argType, Specs.parameterColor, Specs.GET_PARAM);
                // 		pBlock.parameterIndex = i;
                // 		b.setArg(i, pBlock);
                // 	}
                // 	b.fixArgLayout();
                // 	return b;
                // }
                // isProcDef():boolean { return this.op === Specs.PROCEDURE_DEF }
                // isEmbeddedInProcHat():boolean {
                // 	return (this.parent instanceof BlockModel) &&
                // 		(this.parent.op === Specs.PROCEDURE_DEF) &&
                // 		(this != this.parent.nextBlock);
                // }
                // isEmbeddedParameter():boolean {
                // 	if ((this.op != Specs.GET_PARAM) || !(this.parent instanceof BlockModel)) return false;
                // 	return this.parent.op === 'proc_declaration';
                // }
                // isInPalette():boolean {
                // 	let o:DisplayObject = this.parent;
                // 	while (o) {
                // 		if ('isBlockPalette' in o) return true;
                // 		o = o.parent;
                // 	}
                // 	return false;
                // }
                // setTerminal(flag:boolean):void {
                // 	// Used to change the "stop" block shape.
                // 	super.removeChild(this.shape);
                // 	this.isTerminal = flag;
                // 	let newShape:number = this.isTerminal ? BlockShapeModel.FinalCmdShape : BlockShapeModel.CmdShape;
                // 	this.shape = new BlockShapeModel(newShape, this.shape.color);
                // 	this.addChildAt(this.shape, 0);
                // 	this.fixArgLayout();
                // }
                // argType(arg:DisplayObject):string {
                // 	let i:number = this.labelsAndArgs.indexOf(arg);
                // 	return i === -1 ? '' : this.argTypes[i];
                // }
                // allBlocksDo(f:Function):void {
                // 	f(this);
                // 	for (let arg of this.args) {
                // 		if (arg instanceof BlockModel) arg.allBlocksDo(f);
                // 	}
                // 	if (this.stack1 != null) this.stack1.allBlocksDo(f);
                // 	if (this.stack2 != null) this.stack2.allBlocksDo(f);
                // 	if (this.nextBlock != null) this.nextBlock.allBlocksDo(f);
                // }
                // // showRunFeedback():void {
                // // 	if (this.filters && this.filters.length > 0) {
                // // 		for (let f of this.filters) {
                // // 			if (f instanceof GlowFilter) return;
                // // 		}
                // // 	}
                // // 	this.filters = this.runFeedbackFilters().concat(this.filters || []);
                // // }
                // // hideRunFeedback():void {
                // // 	if (this.filters && this.filters.length > 0) {
                // // 		let newFilters:any[] = [];
                // // 		for (let f of this.filters) {
                // // 			if (!(f instanceof GlowFilter)) newFilters.push(f);
                // // 		}
                // // 		this.filters = newFilters;
                // // 	}
                // // }
                // // private runFeedbackFilters():any[] {
                // // 	// filters for showing that a stack is running
                // // 	let f:GlowFilter = new GlowFilter(0xfeffa0);
                // // 	f.strength = 2;
                // // 	f.blurX = f.blurY = 12;
                // // 	f.quality = 3;
                // // 	return [f];
                // // }
                // // saveOriginalState():void {
                // // 	this.originalParent = this.parent;
                // // 	if (this.parent) {
                // // 		let b:BlockModel = <BlockModel>this.parent ;
                // // 		if (b === null) {
                // // 			this.originalRole = BlockModel.ROLE_ABSOLUTE;
                // // 		} else if (this.isReporter) {
                // // 			this.originalRole = BlockModel.ROLE_EMBEDDED;
                // // 			this.originalIndex = b.args.indexOf(this);
                // // 		} else if (b.nextBlock === this) {
                // // 			this.originalRole = BlockModel.ROLE_NEXT;
                // // 		} else if (b.stack1 === this) {
                // // 			this.originalRole = BlockModel.ROLE_stack1;
                // // 		} else if (b.stack2 === this) {
                // // 			this.originalRole = BlockModel.ROLE_stack2;
                // // 		}
                // // 		this.originalPosition = this.localToGlobal(new Point(0, 0));
                // // 	} else {
                // // 		this.originalRole = BlockModel.ROLE_NONE;
                // // 		this.originalPosition = null;
                // // 	}
                // // }
                // // restoreOriginalState():void {
                // // 	let b:BlockModel = <BlockModel>this.originalParent ;
                // // 	this.scaleX = this.scaleY = 1;
                // // 	switch (this.originalRole) {
                // // 	case BlockModel.ROLE_NONE:
                // // 		if (this.parent) this.parent.removeChild(this);
                // // 		break;
                // // 	case BlockModel.ROLE_ABSOLUTE:
                // // 		this.originalParent.addChild(this);
                // // 		let p:Point = this.originalParent.globalToLocal(this.originalPosition);
                // // 		this.x = p.x;
                // // 		this.y = p.y;
                // // 		break;
                // // 	case BlockModel.ROLE_EMBEDDED:
                // // 		b.replaceArgWithBlock(b.args[this.originalIndex], this, Scratch.app.scriptsPane);
                // // 		break;
                // // 	case BlockModel.ROLE_NEXT:
                // // 		b.insertBlock(this);
                // // 		break;
                // // 	case BlockModel.ROLE_stack1:
                // // 		b.insertBlockSub1(this);
                // // 		break;
                // // 	case BlockModel.ROLE_stack2:
                // // 		b.insertBlockSub2(this);
                // // 		break;
                // // 	}
                // // }
                // originalPositionIn(p:DisplayObject):Point {
                // 	return this.originalPosition && p.globalToLocal(this.originalPosition);
                // }
                // private setDefaultArgs(defaults:any[]):void {
                // 	this.collectArgs();
                // 	for (let i:number = 0; i < Math.min(this.args.length, defaults.length); i++) {
                // 		let argLabel:string = null;
                // 		let v:any = defaults[i];
                // 		if (v instanceof BlockArgModel) v = v.argValue;
                // 		if ('_edge_' === v) argLabel = Translator.map('edge');
                // 		if ('_mouse_' === v) argLabel = Translator.map('mouse-pointer');
                // 		if ('_myself_' === v) argLabel = Translator.map('myself');
                // 		if ('_stage_' === v) argLabel = Translator.map('Stage');
                // 		if (this.args[i] instanceof BlockArgModel) this.args[i].setArgValue(v, argLabel);
                // 	}
                // 	this.defaultArgValues = defaults;
                // }
                BlockModel.prototype.setArg = function (i, newArg) {
                    // called on newly-created block (assumes argument being set is a BlockArgModel)
                    // newArg can be either a reporter block or a literal value (string, number, etc.)
                    this.collectArgs();
                    if (i >= this.spec.argCount) {
                        console.log("too many args, ignoring:" + newArg);
                        return;
                    }
                    var oldArg = this.args[i];
                    if (newArg instanceof BlockModel) {
                        this.labelsAndArgs[this.labelsAndArgs.indexOf(oldArg)] = newArg;
                        this.args[i] = newArg;
                    }
                    else {
                        oldArg.setArgValue(newArg);
                    }
                };
                // private copyArgs(srcArgs:any[]):void {
                // 	// called on a newly created block that is being duplicated to copy the
                // 	// argument values and/or expressions from the source block's arguments
                // 	let i:number;
                // 	this.collectArgs();
                // 	for (i = 0; i < srcArgs.length; i++) {
                // 		let argToCopy:any = srcArgs[i];
                // 		if (argToCopy instanceof BlockArgModel) {
                // 			let arg:BlockArgModel = argToCopy;
                // 			this.args[i].setArgValue(arg.argValue, arg.labelOrNull());
                // 		}
                // 		if (argToCopy instanceof BlockModel) {
                // 			let newArg:BlockModel = argToCopy.duplicate(false);
                // 			let oldArg:any = this.args[i];
                // 			this.labelsAndArgs[this.labelsAndArgs.indexOf(oldArg)] = newArg;
                // 			this.args[i] = newArg;
                // 			super.removeChild(oldArg);
                // 			this.addChild(newArg);
                // 		}
                // 	}
                // }
                // private copyArgsForClone(srcArgs:any[]):void {
                // 	// called on a block that is being cloned.
                // 	this.args = [];
                // 	for (let i:number = 0; i < srcArgs.length; i++) {
                // 		let argToCopy:any = srcArgs[i];
                // 		if (argToCopy instanceof BlockArgModel) {
                // 			let a:BlockArgModel = new BlockArgModel(argToCopy.type, -1);
                // 			a.argValue = argToCopy.argValue;
                // 			this.args.push(a);
                // 		}
                // 		if (argToCopy instanceof BlockModel) {
                // 			this.args.push(argToCopy.duplicate(true));
                // 		}
                // 	}
                // 	for (let arg of this.args) this.addChild(arg); // fix for cloned proc bug xxx
                // }
                BlockModel.prototype.collectArgs = function () {
                    var i;
                    this.args = [];
                    for (i = 0; i < this.labelsAndArgs.length; i++) {
                        var a = this.labelsAndArgs[i];
                        if (a instanceof BlockModel) {
                            this.args.push(a);
                        }
                        else if (a instanceof blockarg_model_1.BlockArgModel) {
                            var arg = a;
                            if (arg.isArgument)
                                this.args.push(a);
                        }
                    }
                };
                // removeBlock(b:BlockModel):void {
                // 	if (b.parent === this) this.removeChild(b);
                // 	if (b === this.nextBlock) {
                // 		this.nextBlock = null;
                // 	}
                // 	if (b === this.stack1) this.stack1 = null;
                // 	if (b === this.stack2) this.stack2 = null;
                // 	if (b.isReporter) {
                // 		let i:number = this.labelsAndArgs.indexOf(b);
                // 		if (i < 0) return;
                // 		let newArg:DisplayObject = this.argOrLabelFor(this.argTypes[i], this.shape.color);
                // 		this.labelsAndArgs[i] = newArg;
                // 		this.addChild(newArg);
                // 		this.fixExpressionLayout();
                // 		// Cancel any outstanding requests (for blocking reporters, isRequester=true)
                // 		if(b.requestLoader)
                // 			b.requestLoader.close();
                // 	}
                // 	this.topBlock().fixStackLayout();
                // 	//Scratch::allow3d { Scratch.app.runtime.checkForGraphicEffects(); }
                // }
                BlockModel.prototype.insertBlock = function (b) {
                    var oldNext = this.nextBlock;
                    // if (oldNext != null) super.removeChild(oldNext);
                    // this.addChild(b);
                    this.nextBlock = b;
                    b.previousBlock = this;
                    if (oldNext != null)
                        b.appendBlock(oldNext);
                    this.topBlock().fixStackLayout();
                };
                BlockModel.prototype.fixStackLayout = function () {
                    console.log("fixing stack layout:" + this.spec.label);
                };
                BlockModel.prototype.insertBlockAbove = function (b) {
                    b.x = this.x;
                    b.y = this.y - b.height + geometry_1.Geometry.NotchDepth;
                    // this.parent.addChild(b);
                    b.bottomBlock().insertBlock(this);
                };
                BlockModel.prototype.insertBlockAround = function (b) {
                    b.x = this.x - geometry_1.Geometry.StackInset;
                    b.y = this.y - b.shape.stack1y + geometry_1.Geometry.NotchDepth;
                    // this.parent.addChild(b);
                    // this.parent.removeChild(this);
                    // b.addChild(this);
                    b.stack1 = this;
                    b.fixStackLayout();
                };
                BlockModel.prototype.insertBlockSub1 = function (b) {
                    var old = this.stack1;
                    // if (old != null) old.parent.removeChild(old);
                    // this.addChild(b);
                    this.stack1 = b;
                    if (old != null)
                        b.appendBlock(old);
                    this.topBlock().fixStackLayout();
                };
                BlockModel.prototype.insertBlockSub2 = function (b) {
                    var old = this.stack2;
                    // if (old != null) this.removeChild(old);
                    // this.addChild(b);
                    this.stack2 = b;
                    if (old != null)
                        b.appendBlock(old);
                    this.topBlock().fixStackLayout();
                };
                // replaceArgWithBlock(oldArg:DisplayObject, b:BlockModel, pane:DisplayObjectContainer):void {
                // 	let i:number = this.labelsAndArgs.indexOf(oldArg);
                // 	if (i < 0) return;
                // 	// remove the old argument
                // 	this.removeChild(oldArg);
                // 	this.labelsAndArgs[i] = b;
                // 	this.addChild(b);
                // 	this.fixExpressionLayout();
                // 	if (oldArg instanceof BlockModel) {
                // 		// leave old block in pane
                // 		let o:BlockModel = this.owningBlock();
                // 		let p:Point = pane.globalToLocal(o.localToGlobal(new Point(o.width + 5, (o.height - oldArg.height) / 2)));
                // 		oldArg.x = p.x;
                // 		oldArg.y = p.y;
                // 		pane.addChild(oldArg);
                // 	}
                // 	this.topBlock().fixStackLayout();
                // }
                BlockModel.prototype.appendBlock = function (b) {
                    if (this.shape instanceof stack_shape_1.StackShape && !this.stack1) {
                        this.insertBlockSub1(b);
                    }
                    else {
                        var bottom = this.bottomBlock();
                        // bottom.addChild(b);
                        bottom.nextBlock = b;
                        b.previousBlock = bottom;
                    }
                };
                // private owningBlock():BlockModel {
                // 	let b:BlockModel = this;
                // 	while (true) {
                // 		if (b.parent instanceof BlockModel) {
                // 			b = b.parent;
                // 			if (!b.isReporter) return b; // owning command block
                // 		} else {
                // 			return b; // top-level reporter block
                // 		}
                // 	}
                // 	return b; // never gets here
                // }
                BlockModel.prototype.topBlock = function () {
                    var result = this;
                    while (result.previousBlock instanceof BlockModel)
                        result = result.previousBlock;
                    return result;
                };
                BlockModel.prototype.bottomBlock = function () {
                    var result = this;
                    while (result.nextBlock != null)
                        result = result.nextBlock;
                    return result;
                };
                // private makeLabel(label:string):TextField {
                // 	let text:TextField = new TextField();
                // 	text.autoSize = TextFieldAutoSize.LEFT;
                // 	text.selectable = false;
                // 	text.background = false;
                // 	text.defaultTextFormat = BlockModel.blockLabelFormat;
                // 	text.text = label;
                // 	if (BlockModel.useEmbeddedFont) {
                // 		//text.antiAliasType = this.AntiAliasType.ADVANCED;
                // 		//TODO: do we need to port anti aliasing from as to ts
                // 		text.embedFonts = true;
                // 	}
                // 	text.mouseEnabled = false;
                // 	return text;
                // }
                // /* Menu */
                // menu(evt:MouseEvent):void {
                // 	// Note: Unlike most menu() methods, this method invokes
                // 	// the menu itself rather than returning a menu to the caller.
                // 	if (BlockModel.MenuHandlerFunction === null) return;
                // 	if (this.isEmbeddedInProcHat()) BlockModel.MenuHandlerFunction(null, this.parent);
                // 	else BlockModel.MenuHandlerFunction(null, this);
                // }
                // handleTool(tool:string, evt:MouseEvent):void {
                // 	if (this.isEmbeddedParameter()) return;
                // 	if (!this.isInPalette()) {
                // 		if ('copy' === tool) this.duplicateStack(10, 5);
                // 		if ('cut' === tool) this.deleteStack();
                // 	}
                // 	if (tool === 'help') this.showHelp();
                // }
                // showHelp():void {
                // 	let i:number = -1;
                // 	if((i = this.op.indexOf('.')) > -1) {
                // 		let extName:string = this.op.substr(0, i);
                // 		if(Scratch.app.extensionManager.isInternal(extName))
                // 			Scratch.app.showTip('ext:'+extName);
                // 		else
                // 			DialogBox.notify('Help Missing', 'There is no documentation available for experimental extension "'+extName+'".', Scratch.app.stage);
                // 	}
                // 	else {
                // 		Scratch.app.showTip(this.op);
                // 	}
                // }
                // duplicateStack(deltaX:number, deltaY:number):void {
                // 	if (this.isProcDef() || this.op === 'proc_declaration') return; // don't duplicate procedure definition
                // 	let forStage:boolean = Scratch.app.viewedObj() && Scratch.app.viewedObj().isStage;
                // 	let newStack:BlockModel = this.BlockIOService.stringToStack(this.BlockIOService.stackToString(this), forStage);
                // 	let p:Point = this.localToGlobal(new Point(0, 0));
                // 	newStack.x = p.x + deltaX;
                // 	newStack.y = p.y + deltaY;
                // 	Scratch.app.gh.grabOnMouseUp(newStack);
                // }
                // deleteStack():boolean {
                // 	if (this.op === 'proc_declaration') {
                // 		return (<BlockModel>this.parent ).deleteStack();
                // 	}
                // 	let app:Scratch = Scratch.app;
                // 	let top:BlockModel = this.topBlock();
                // 	if (this.op === Specs.PROCEDURE_DEF && app.runtime.allCallsOf(this.spec, app.viewedObj(), false).length) {
                // 		this.DialogBox.notify('Cannot Delete', 'To delete a block definition, first remove all uses of the block.', this.stage);
                // 		return false;
                // 	}
                // 	if (top === this && app.interp.isRunning(top, app.viewedObj())) {
                // 		app.interp.toggleThread(top, app.viewedObj());
                // 	}
                // 	// TODO: Remove any waiting reporter data in the Scratch.app.extensionManager
                // 	if (this.parent instanceof BlockModel) BlockModel(this.parent).removeBlock(this);
                // 	else if (this.parent) this.parent.removeChild(this);
                // 	this.cacheAsBitmap = false;
                // 	// set position for undelete
                // 	this.x = top.x;
                // 	this.y = top.y;
                // 	if (top != this) this.x += top.width + 5;
                // 	app.runtime.recordForUndelete(this, this.x, this.y, 0, app.viewedObj());
                // 	app.scriptsPane.saveScripts();
                // 	//Scratch::allow3d { app.runtime.checkForGraphicEffects(); }
                // 	app.updatePalette();
                // 	return true;
                // }
                // attachedCommentsIn(scriptsPane:ScriptsPane):any[] {
                // 	let allBlocks:any[] = [];
                // 	this.allBlocksDo(function (b:BlockModel):void {
                // 		allBlocks.push(this.b);
                // 	});
                // 	let result:any[] = []
                // 	if (!scriptsPane) return result;
                // 	for (let i:number = 0; i < scriptsPane.numChildren; i++) {
                // 		let c:ScratchComment = <ScratchComment>scriptsPane.getChildAt(i) ;
                // 		if (c && c.blockRef && allBlocks.indexOf(c.blockRef) != -1) {
                // 			result.push(c);
                // 		}
                // 	}
                // 	return result;
                // }
                // addComment():void {
                // 	let scriptsPane:ScriptsPane = <ScriptsPane>this.topBlock().parent ;
                // 	if (scriptsPane) scriptsPane.addComment(this);
                // }
                // /* Dragging */
                // objToGrab(evt:MouseEvent):BlockModel {
                // 	if (this.isEmbeddedParameter() || this.isInPalette()) return this.duplicate(false, Scratch.app.viewedObj() instanceof ScratchStage);
                // 	return this;
                // }
                // /* Events */
                // click(evt:MouseEvent):void {
                // 	if (this.editArg(evt)) return;
                // 	Scratch.app.runtime.interp.toggleThread(this.topBlock(), Scratch.app.viewedObj(), 1);
                // }
                // doubleClick(evt:MouseEvent):void {
                // 	if (this.editArg(evt)) return;
                // 	Scratch.app.runtime.interp.toggleThread(this.topBlock(), Scratch.app.viewedObj(), 1);
                // }
                // private editArg(evt:MouseEvent):boolean {
                // 	let arg:BlockArgModel = <BlockArgModel>evt.target ;
                // 	if (!arg) arg = <BlockArgModel>evt.target.parent ;
                // 	if (arg && arg.isEditable && (arg.parent === this)) {
                // 		arg.startEditing();
                // 		return true;
                // 	}
                // 	return false;
                // }
                // private focusChange(evt:FocusEvent):void {
                // 	evt.preventDefault();
                // 	if (evt.target.parent.parent != this) return; // make sure the target TextField is in this block, not a child block
                // 	if (this.args.length === 0) return;
                // 	let i:number, focusIndex:number = -1;
                // 	for (i = 0; i < this.args.length; i++) {
                // 		if (this.args[i] instanceof BlockArgModel && this.stage.focus === this.args[i].field) focusIndex = i;
                // 	}
                // 	let target:BlockModel = this;
                // 	let delta:number = evt.shiftKey ? -1 : 1;
                // 	i = focusIndex + delta;
                // 	for (;;) {
                // 		if (i >= target.args.length) {
                // 			let p:BlockModel = <BlockModel>target.parent ;
                // 			if (p) {
                // 				i = p.args.indexOf(target);
                // 				if (i != -1) {
                // 					i += delta;
                // 					target = p;
                // 					continue;
                // 				}
                // 			}
                // 			if (target.stack1) {
                // 				target = target.stack1;
                // 			} else if (target.stack2) {
                // 				target = target.stack2;
                // 			} else {
                // 				let t:BlockModel = target;
                // 				target = t.nextBlock;
                // 				while (!target) {
                // 					let tp:BlockModel = <BlockModel>t.parent ;
                // 					let b:BlockModel = t;
                // 					while (tp && tp.nextBlock === b) {
                // 						b = tp;
                // 						tp = <BlockModel>tp.parent ;
                // 					}
                // 					if (!tp) return;
                // 					target = tp.stack1 === b && tp.stack2 ? tp.stack2 : tp.nextBlock;
                // 					t = tp;
                // 				}
                // 			}
                // 			i = 0;
                // 		} else if (i < 0) {
                // 			p = <BlockModel>target.parent ;
                // 			if (!p) return;
                // 			i = p.args.indexOf(target);
                // 			if (i != -1) {
                // 				i += delta;
                // 				target = p;
                // 				continue;
                // 			}
                // 			let nested:BlockModel = p.nextBlock === target ? p.stack2 || p.stack1 : p.stack2 === target ? p.stack1 : null;
                // 			if (nested) {
                // 				for (;;) {
                // 					nested = nested.bottomBlock();
                // 					let n2:BlockModel = nested.stack1 || nested.stack2;
                // 					if (!n2) break;
                // 					nested = n2;
                // 				}
                // 				target = nested;
                // 			} else {
                // 				target = p;
                // 			}
                // 			i = target.args.length - 1;
                // 		} else {
                // 			if (target.args[i] instanceof BlockModel) {
                // 				target = target.args[i];
                // 				i = evt.shiftKey ? target.args.length - 1 : 0;
                // 			} else {
                // 				let a:BlockArgModel = <BlockArgModel>target.args[i] ;
                // 				if (a && a.field && a.isEditable) {
                // 					a.startEditing();
                // 					return;
                // 				}
                // 				i += delta;
                // 			}
                // 		}
                // 	}
                // }
                // getSummary():string {
                // 	let s:string = this.type === "r" ? "(" : this.type === "b" ? "<" : "";
                // 	let space:boolean = false;
                // 	for (let x:DisplayObject of this.labelsAndArgs) {
                // 		if (space) {
                // 			s += " ";
                // 		}
                // 		space = true;
                // 		let ba:BlockArgModel, b:BlockModel, tf:TextField;
                // 		if ((ba = <BlockArgModel>x )) {
                // 			s += ba.numberType ? "(" : "[";
                // 			s += ba.argValue;
                // 			if (!ba.isEditable) s += " v";
                // 			s += ba.numberType ? ")" : "]";
                // 		} else if ((b = <BlockModel>x )) {
                // 			s += b.getSummary();
                // 		} else if ((tf = <TextField>x )) {
                // 			s += TextField(x).text;
                // 		} else {
                // 			s += "@";
                // 		}
                // 	}
                // 	if (this.shape.canHavestack1()) {
                // 		s += "\n" + (this.stack1 ? BlockModel.indent(this.stack1.getSummary()) : "");
                // 		if (this.shape.canHavestack2()) {
                // 			s += "\n" + this.elseLabel.text;
                // 			s += "\n" + (this.stack2 ? BlockModel.indent(this.stack2.getSummary()) : "");
                // 		}
                // 		s += "\n" + Translator.map("end");
                // 	}
                // 	if (this.nextBlock) {
                // 		s += "\n" + this.nextBlock.getSummary();
                // 	}
                // 	s += this.type === "r" ? ")" : this.type === "b" ? ">" : "";
                // 	return s;
                // }
                // protected static indent(s:string):string {
                // 	return s.replace(/^/gm, "    ");
                // }
                //
                BlockModel.prototype.hideRunFeedback = function () {
                    console.log("todo hideRunFeedback");
                };
                BlockModel.prototype.showRunFeedback = function () {
                    console.log("todo showRunFeedback");
                };
                BlockModel.prototype.drawBlock = function (group, x, y) {
                    // let clone = this.clone();
                    // clone.shape.move(x, y);
                    script_layout_service_1.ScriptLayoutService.drawBlock(this, group, x, y);
                };
                BlockModel.prototype.clone = function () {
                    var clone = new BlockModel(this.spec, this.defaultArgValues);
                    return clone;
                };
                BlockModel.prototype.isStack = function () {
                    if (this.spec.shapeType === "cf" || this.spec.shapeType === "c" || this.spec.shapeType === "e") {
                        return true;
                    }
                    return false;
                };
                BlockModel.prototype.isDoubleStack = function () {
                    if (this.spec.shapeType === "e") {
                        return true;
                    }
                    return false;
                };
                // private static const blockLabelFormat:TextFormat = new TextFormat('LucidaBoldEmbedded', 10, 0xFFFFFF, true);
                BlockModel.useEmbeddedFont = false;
                BlockModel.ROLE_NONE = 0;
                BlockModel.ROLE_ABSOLUTE = 1;
                BlockModel.ROLE_EMBEDDED = 2;
                BlockModel.ROLE_NEXT = 3;
                BlockModel.ROLE_stack1 = 4;
                BlockModel.ROLE_stack2 = 5;
                return BlockModel;
            })(block_base_model_1.BlockBaseModel);
            exports_1("BlockModel", BlockModel);
        }
    }
});
//# sourceMappingURL=block.model.js.map