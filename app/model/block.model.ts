import {ScriptLayoutService} from "../services/script.layout.service";
import {BlockBaseModel} from "./block.base.model";
import {Primitives} from "../runtime/primitives/primitives";
import {DoubleStackShape} from "../shapes/double.stack.shape";
import {StackShape} from "../shapes/stack.shape";
import {Shape} from "../shapes/shape";
import {SpecModel} from "./spec.model";
import {SpecOperation} from "./spec.model";
import {SpecCategoryModel} from "./spec.category.model";
import {ShapeFactory} from "../shapes/shape.factory";
import {Geometry} from "../shapes/geometry";
import {BlockArgModel} from "./blockarg.model";
import {ArgType} from "./blockarg.model";
import {Translator} from "../utils/translator";
import {BlockIOService} from "../services/block.io.service";
import {ReadStream} from "../utils/read.stream";

export class BlockModel extends BlockBaseModel {

    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private minCommandWidth: number = 36;
    private minHatWidth: number = 80;
    private minLoopWidth: number = 80;

    // static argTextFormat:TextFormat;
    // static blockLabelFormat:TextFormat;
    private static vOffset: number;

    // private static const blockLabelFormat:TextFormat = new TextFormat('LucidaBoldEmbedded', 10, 0xFFFFFF, true);
    private static useEmbeddedFont: boolean = false;

    static MenuHandlerFunction: Function;	// optional function to handle block and blockArg menus

    proc: Function;
    spec: SpecModel;
    type: string;
    svg: Snap.Element;
    // op: SpecOperation;
    opFunction: Function;
    args: any[] = [];
    defaultArgValues: any[] = [];
    parameterIndex: number = -1;	// cache of parameter index, used by GET_PARAM block
    parameterNames: any[];	// used by procedure definition hats; null for other blocks
    warpProcFlag: boolean;	// used by procedure definition hats to indicate warp speed
    rightToLeft: boolean;

    isHat: boolean = false;
    isReporter: boolean = false;
    isTerminal: boolean = false;	// blocks that end a stack like "stop" or "forever"

    // Blocking operations
    isRequester: boolean = false;
    forcedRequester: boolean = false;	// We've forced requester-like treatment on a non-requester block.
    requestState: number = 0;		// 0 - no request made, 1 - awaiting response, 2 - data ready
    response: any = null;
    // requestLoader:URLLoader = null;

    nextBlock: BlockModel;
    previousBlock: BlockModel;

    stack1: BlockModel;
    stack2: BlockModel;

    private suppressLayout: boolean; // used to avoid extra layouts during block initialization
    labelsAndArgs: BlockBaseModel[] = [];
    // private argTypes: any[] = [];
    // private elseLabel:TextField;

    private indentTop: number = 2;
    private indentBottom: number = 3;
    private indentLeft: number = 4;
    private indentRight: number = 3;

    private static ROLE_NONE: number = 0;
    private static ROLE_ABSOLUTE: number = 1;
    private static ROLE_EMBEDDED: number = 2;
    private static ROLE_NEXT: number = 3;
    private static ROLE_stack1: number = 4;
    private static ROLE_stack2: number = 5;

    // private originalParent:DisplayObjectContainer;
    private originalRole: number;
    private originalIndex: number;
    // private originalPosition:Point;

    constructor(spec?: SpecModel, defaultArgs: any[] = null) {
        super();

        this.spec = spec;

        let shape: number;
        if (!spec) {
            console.error("error: spec is null");
        }

        this.setArgs(defaultArgs);

    }

    setArgs(defaultArgs: any[] = null) {

        if (this.spec.code === SpecOperation.ProcedureDef) {
            // procedure hat: make an icon from my spec and use that as the label
            this.indentTop = 20;
            this.indentBottom = 5;
            this.indentLeft = 5;
            this.indentRight = 5;

            this.labelsAndArgs = [];
            let b: BlockModel;

        } else if (this.spec.code === SpecOperation.GetList || this.spec.code === SpecOperation.GetList) {
            // this.labelsAndArgs = [this.makeLabel(this.spec)];
        } else {
            // loop

            this.labelsAndArgs = this.spec.cloneLabelAndArgs();

        }
        this.rightToLeft = Translator.rightToLeft;
        // TODO: right to left
        // if (this.rightToLeft) {
        //     if (["+", "-", "*", "/", "%"].indexOf(this.op) > -1) this.rightToLeft = Translator.rightToLeftMath;
        //     if ([">", "<"].indexOf(this.op) > -1) this.rightToLeft = false; // never change order of comparison ops
        // }
        if (this.rightToLeft) {
            // reverse specs that don't start with arg specifier or an ASCII character
            this.labelsAndArgs.reverse();

            if (defaultArgs) defaultArgs.reverse();
        }
        // for (let item of this.labelsAndArgs) this.addChild(item);
        // if (defaultArgs) this.setDefaultArgs(defaultArgs);
        // this.fixArgLayout();
        this.collectArgs();
    }

    get broadcastMsg(): string {
        for (let arg of this.args) {
            if (arg instanceof BlockArgModel && arg.menuName === "broadcast") {
                return arg.argValue;
            }
        }

        return null;
    }

    set broadcastMsg(listName: string) {
        for (let arg of this.args) {
            if (arg instanceof BlockArgModel && arg.menuName === "broadcast") {
                arg.setArgValue(listName);
            }
        }
    }

    normalizedArgs(): any[] {
        return this.rightToLeft ? this.args.concat().reverse() : this.args;
    }

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

    setArg(i: number, newArg: any): void {
        // called on newly-created block (assumes argument being set is a BlockArgModel)
        // newArg can be either a reporter block or a literal value (string, number, etc.)
        this.collectArgs();
        if (i >= this.spec.argCount) {
            console.log("too many args, ignoring:" + newArg);
            return;
        }

        let oldArg: BlockArgModel = this.args[i];
        if (newArg instanceof BlockModel) {
           this.labelsAndArgs[this.labelsAndArgs.indexOf(oldArg)] = newArg;
           this.args[i] = newArg;
           // super.removeChild(oldArg);
           // this.addChild(newArg);
        } else {
           oldArg.setArgValue(newArg);
        }
    }



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

    private collectArgs(): void {
        let i: number;
        this.args = [];
        for (i = 0; i < this.labelsAndArgs.length; i++) {
            let a: any = this.labelsAndArgs[i];
            if (a instanceof BlockModel) {
              this.args.push(a);
            } else if (a instanceof BlockArgModel ) {
              let arg = <BlockArgModel> a;
              if (arg.isArgument) this.args.push(a);
            }
        }
    }

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

    insertBlock(b: BlockModel): void {
        let oldNext: BlockModel = this.nextBlock;

        // if (oldNext != null) super.removeChild(oldNext);

        // this.addChild(b);
        this.nextBlock = b;
        b.previousBlock = this;

        if (oldNext != null) b.appendBlock(oldNext);


        this.topBlock().fixStackLayout();
    }

    fixStackLayout() {
        console.log("fixing stack layout:" + this.spec.label);
    }

    insertBlockAbove(b: BlockModel): void {
        b.x = this.x;
        b.y = this.y - b.height + Geometry.NotchDepth;
        // this.parent.addChild(b);
        b.bottomBlock().insertBlock(this);
    }

    insertBlockAround(b: BlockModel): void {
        b.x = this.x - Geometry.StackInset;



        b.y = this.y - (<StackShape>b.shape).stack1y + Geometry.NotchDepth;
        // this.parent.addChild(b);
        // this.parent.removeChild(this);
        // b.addChild(this);
        b.stack1 = this;
        b.fixStackLayout();
    }

    insertBlockSub1(b: BlockModel): void {
        let old: BlockModel = this.stack1;
        // if (old != null) old.parent.removeChild(old);

        // this.addChild(b);
        this.stack1 = b;

        if (old != null) b.appendBlock(old);
        this.topBlock().fixStackLayout();
    }

    insertBlockSub2(b: BlockModel): void {
        let old: BlockModel = this.stack2;
        // if (old != null) this.removeChild(old);

        // this.addChild(b);
        this.stack2 = b;
        if (old != null) b.appendBlock(old);
        this.topBlock().fixStackLayout();
    }

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

    private appendBlock(b: BlockModel): void {
        if (this.shape instanceof StackShape && !this.stack1) {
            this.insertBlockSub1(b);
        } else {
            let bottom: BlockModel = this.bottomBlock();
            // bottom.addChild(b);
            bottom.nextBlock = b;
            b.previousBlock = bottom;
        }
    }

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

    topBlock(): BlockModel {
        let result: BlockModel = this;
        while (result.previousBlock instanceof BlockModel) result = result.previousBlock;
        return <BlockModel>result;
    }

    bottomBlock(): BlockModel {
        let result: BlockModel = this;
        while (result.nextBlock != null) result = result.nextBlock;
        return result;
    }


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
    hideRunFeedback() {
        console.log("todo hideRunFeedback");
    }

    showRunFeedback() {
        console.log("todo showRunFeedback");
    }

    drawBlock(group: Snap.Element, x: number, y: number) {
      // let clone = this.clone();
      // clone.shape.move(x, y);
      ScriptLayoutService.drawBlock(this, group, x, y);
    }

    clone(): BlockModel {
        let clone = new BlockModel(this.spec, this.defaultArgValues);
        return clone;
    }

    isStack(): boolean {
      if (this.spec.shapeType === "cf" || this.spec.shapeType === "c" || this.spec.shapeType === "e")  {
        return true;
      }
      return false;
    }

    isDoubleStack(): boolean {
      if (this.spec.shapeType === "e")  {
        return true;
      }
      return false;
    }

}
