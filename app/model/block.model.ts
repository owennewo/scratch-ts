
//module blocks {
//import ExtensionManager = extensions.ExtensionManager;

//import {Sprite} from '../stubs/Sprite';
// import {TextFormat} from '../stubs/TextFormat';
// import {TextField} from '../stubs/TextField';
// import {TextFieldAutoSize} from '../stubs/TextFieldAutoSize';
// import {Point} from '../stubs/Point';
// import {URLLoader} from '../stubs/URLLoader';
// import {FocusEvent} from '../stubs/FocusEvent';
// import {GlowFilter} from '../stubs/GlowFilter';
// import {DisplayObjectContainer} from '../stubs/DisplayObjectContainer';
// import {DisplayObject} from '../stubs/DisplayObject';
// import {TextLineMetrics} from '../stubs/TextLineMetrics';
import {BlockShapeModel} from './block.shape.model';
import {BlockArgModel} from './blockarg.model';
import {Translator} from '../utils/translator';
import {Specs} from '../specs';
// import {Scratch} from '../Scratch';
// import {Resources} from '../assets/Resources';
// import {ReadStream} from '../util/ReadStream';
// import {DialogBox} from '../uiwidgets/DialogBox';
import {BlockIO} from '../io/block.io';

export class BlockModel  { //extends Sprite {
	
	private x: number;
	private y: number;
	private width: number;
	private height: number;

	private minCommandWidth:number = 36;
	private minHatWidth:number = 80;
	private minLoopWidth:number = 80;

//	public static argTextFormat:TextFormat;
//	public static blockLabelFormat:TextFormat;
	private static vOffset:number;

//	private static const blockLabelFormat:TextFormat = new TextFormat('LucidaBoldEmbedded', 10, 0xFFFFFF, true);
	private static useEmbeddedFont:boolean = false;

	public static MenuHandlerFunction:Function;	// optional function to handle block and blockArg menus

	public spec:string;
	public type:string;
	public op:string = "";
	public opFunction:Function;
	public args:any[] = [];
	public defaultArgValues:any[] = [];
	public parameterIndex:number = -1;	// cache of parameter index, used by GET_PARAM block
	public parameterNames:any[];	// used by procedure definition hats; null for other blocks
	public warpProcFlag:boolean;	// used by procedure definition hats to indicate warp speed
	public rightToLeft:boolean;

	public isHat:boolean = false;
	public isReporter:boolean = false;
	public isTerminal:boolean = false;	// blocks that end a stack like "stop" or "forever"

	// Blocking operations
	public isRequester:boolean = false;
	public forcedRequester:boolean = false;	// We've forced requester-like treatment on a non-requester block.
	public requestState:number = 0;		// 0 - no request made, 1 - awaiting response, 2 - data ready
	public response:any = null;
//	public requestLoader:URLLoader = null;

	public nextBlock:BlockModel;
	public previousBlock:BlockModel;
	
	public subStack1:BlockModel;
	public subStack2:BlockModel;

	public base:BlockShapeModel;

	private suppressLayout:boolean; // used to avoid extra layouts during block initialization
	private labelsAndArgs:any[] = [];
	private argTypes:any[] = [];
//	private elseLabel:TextField;

	private indentTop:number = 2;
	private indentBottom:number = 3;
	private indentLeft:number = 4
	private indentRight:number = 3;

	private static ROLE_NONE:number = 0;
	private static ROLE_ABSOLUTE:number = 1;
	private static ROLE_EMBEDDED:number = 2;
	private static ROLE_NEXT:number = 3;
	private static ROLE_SUBSTACK1:number = 4;
	private static ROLE_SUBSTACK2:number = 5;

//	private originalParent:DisplayObjectContainer;
	private originalRole:number;
	private originalIndex:number;
//	private originalPosition:Point;

	constructor(spec:string, type:string = " ", color:number = 0xD00000, op:any = 0, defaultArgs:any[] = null) {
		
		this.spec = Translator.map(spec);
		this.type = type;
		this.op = op;

		if ((Specs.CALL == op) ||
			(Specs.GET_LIST == op) ||
			(Specs.GET_PARAM == op) ||
			(Specs.GET_VAR == op) ||
			(Specs.PROCEDURE_DEF == op) ||
			('proc_declaration' == op)) {
				this.spec = spec; // don't translate var/list/param reporters
		}

		if (color == -1) return; // copy for clone; omit graphics

		var shape:number;
		if ((type == " ") || (type == "") || (type == "w")) {
			this.base = new BlockShapeModel(BlockShapeModel.CmdShape, color);
			this.indentTop = 3;
		} else if (type == "b") {
			this.base = new BlockShapeModel(BlockShapeModel.BooleanShape, color);
			this.isReporter = true;
			this.indentLeft = 9;
			this.indentRight = 7;
		} else if (type == "r" || type == "R" || type == "rR") {
			this.type = 'r';
			this.base = new BlockShapeModel(BlockShapeModel.NumberShape, color);
			this.isReporter = true;
			this.isRequester = ((type == 'R') || (type == 'rR'));
			this.forcedRequester = (type == 'rR');
			this.indentTop = 2;
			this.indentBottom = 2;
			this.indentLeft = 6;
			this.indentRight = 4;
		} else if (type == "h") {
			this.base = new BlockShapeModel(BlockShapeModel.HatShape, color);
			this.isHat = true;
			this.indentTop = 12;
		} else if (type == "c") {
			this.base = new BlockShapeModel(BlockShapeModel.LoopShape, color);
		} else if (type == "cf") {
			this.base = new BlockShapeModel(BlockShapeModel.FinalLoopShape, color);
			this.isTerminal = true;
		} else if (type == "e") {
			this.base = new BlockShapeModel(BlockShapeModel.IfElseShape, color);
//			this.addChild(this.elseLabel = this.makeLabel(Translator.map('else')));
		} else if (type == "f") {
			this.base = new BlockShapeModel(BlockShapeModel.FinalCmdShape, color);
			this.isTerminal = true;
			this.indentTop = 5;
		} else if (type == "o") { // cmd outline for proc definition
			this.base = new BlockShapeModel(BlockShapeModel.CmdOutlineShape, color);
//			this.base.filters = []; // no bezel
			this.indentTop = 3;
		} else if (type == "p") {
			this.base = new BlockShapeModel(BlockShapeModel.ProcHatShape, color);
			this.isHat = true;
		} else {
			this.base = new BlockShapeModel(BlockShapeModel.RectShape, color);
		}
//		this.addChildAt(this.base, 0);
		this.setSpec(this.spec, defaultArgs);

		///this.addEventListener(FocusEvent.KEY_FOCUS_CHANGE, this.focusChange);
	}

	public setSpec(newSpec:string, defaultArgs:any[] = null):void {
		for (var o of this.labelsAndArgs) {
			if (o.parent != null) o.parent.removeChild(o);
		}
		this.spec = newSpec;
		if (this.op == Specs.PROCEDURE_DEF) {
			// procedure hat: make an icon from my spec and use that as the label
			this.indentTop = 20;
			this.indentBottom = 5;
			this.indentLeft = 5;
			this.indentRight = 5;

			this.labelsAndArgs = [];
			this.argTypes = [];
//			var label:TextField = this.makeLabel(Translator.map('define'));
//			this.labelsAndArgs.push(label);
			var b:BlockModel;
//			this.labelsAndArgs.push(b = this.declarationBlock());
		} else if (this.op == Specs.GET_VAR || this.op == Specs.GET_LIST) {
//			this.labelsAndArgs = [this.makeLabel(this.spec)];
		} else {
			var loopBlocks:any[] = ['doForever', 'doForeverIf', 'doRepeat', 'doUntil'];
			this.base.hasLoopArrow = (loopBlocks.indexOf(this.op) >= 0);
//			this.addLabelsAndArgs(this.spec, this.base.color);
		}
		this.rightToLeft = Translator.rightToLeft;
		if (this.rightToLeft) {
			if (['+', '-', '*', '/', '%'].indexOf(this.op) > -1) this.rightToLeft = Translator.rightToLeftMath;
			if (['>', '<'].indexOf(this.op) > -1) this.rightToLeft = false; // never change order of comparison ops
		}
		if (this.rightToLeft) {
			// reverse specs that don't start with arg specifier or an ASCII character
			this.labelsAndArgs.reverse();
			this.argTypes.reverse();
			if (defaultArgs) defaultArgs.reverse();
		}
//		for (var item of this.labelsAndArgs) this.addChild(item);
//		if (defaultArgs) this.setDefaultArgs(defaultArgs);
		this.fixArgLayout();
	}

	public get broadcastMsg():string {
		for (var arg of this.args) {
			if (arg instanceof BlockArgModel && arg.menuName == "broadcast") {
				return arg.argValue;
			}
		}

		return null;
	}

	public set broadcastMsg(listName:string) {
		for (var arg of this.args) {
			if (arg instanceof BlockArgModel && arg.menuName == "broadcast") {
				arg.setArgValue(listName);
			}
		}
	}

	public normalizedArgs():any[] {
		return this.rightToLeft ? this.args.concat().reverse() : this.args;
	}

	// public changeOperator(newOp:string):void {
	// 	// Used to switch among a family of related operators (e.g. +, -, *, and /).
	// 	// Note: This does not deal with translation, so it only works for symbolic operators.
	// 	for (var item of this.labelsAndArgs) {
	// 		if ((item instanceof TextField) && (item.text == this.op)) item.text = newOp;
	// 	}
	// 	this.op = newOp;
	// 	this.opFunction = null;
	// 	this.fixArgLayout();
	// }

	// public static setFonts(labelSize:number, argSize:number, boldFlag:boolean, vOffset:number):void {
	// 	var font:string = Resources.chooseFont([
	// 		'Lucida Grande', 'Verdana', 'Arial', 'DejaVu Sans']);
	// 	BlockModel.blockLabelFormat = new TextFormat(font, labelSize, 0xFFFFFF, boldFlag);
	// 	BlockModel.argTextFormat = new TextFormat(font, argSize, 0x505050, false);
	// 	BlockModel.vOffset = vOffset;
	// }

	// private declarationBlock():BlockModel {
	// 	// Create a block representing a procedure declaration to be embedded in a
	// 	// procedure definition header block. For each formal parameter, embed a
	// 	// reporter for that parameter.
	// 	var b:BlockModel = new BlockModel(this.spec, "o", Specs.procedureColor, 'proc_declaration');
	// 	if (!this.parameterNames) this.parameterNames = [];
	// 	for (var i:number = 0; i < this.parameterNames.length; i++) {
	// 		var argType:string = (typeof(this.defaultArgValues[i]) == 'boolean') ? 'b' : 'r';
	// 		var pBlock:BlockModel = new BlockModel(this.parameterNames[i], argType, Specs.parameterColor, Specs.GET_PARAM);
	// 		pBlock.parameterIndex = i;
	// 		b.setArg(i, pBlock);
	// 	}
	// 	b.fixArgLayout();
	// 	return b;
	// }

	// public isProcDef():boolean { return this.op == Specs.PROCEDURE_DEF }

	// public isEmbeddedInProcHat():boolean {
	// 	return (this.parent instanceof BlockModel) &&
	// 		(this.parent.op == Specs.PROCEDURE_DEF) &&
	// 		(this != this.parent.nextBlock);
	// }

	// public isEmbeddedParameter():boolean {
	// 	if ((this.op != Specs.GET_PARAM) || !(this.parent instanceof BlockModel)) return false;
	// 	return this.parent.op == 'proc_declaration';
	// }

	// public isInPalette():boolean {
	// 	var o:DisplayObject = this.parent;
	// 	while (o) {
	// 		if ('isBlockPalette' in o) return true;
	// 		o = o.parent;
	// 	}
	// 	return false;
	// }

	// public setTerminal(flag:boolean):void {
	// 	// Used to change the "stop" block shape.
	// 	super.removeChild(this.base);
	// 	this.isTerminal = flag;
	// 	var newShape:number = this.isTerminal ? BlockShapeModel.FinalCmdShape : BlockShapeModel.CmdShape;
	// 	this.base = new BlockShapeModel(newShape, this.base.color);
	// 	this.addChildAt(this.base, 0);
	// 	this.fixArgLayout();
	// }

	// private addLabelsAndArgs(spec:string, c:number):void {
	// 	var specParts:any[] = ReadStream.tokenize(spec), i:number;
	// 	this.labelsAndArgs = [];
	// 	this.argTypes = [];
	// 	for (i = 0; i < specParts.length; i++) {
	// 		var o:DisplayObject = this.argOrLabelFor(specParts[i], c);
	// 		this.labelsAndArgs.push(o);
	// 		var argType:string = 'icon';
	// 		if (o instanceof BlockArgModel) argType = specParts[i];
	// 		if (o instanceof TextField) argType = 'label';
	// 		this.argTypes.push(argType);
	// 	}
	// }

	// public argType(arg:DisplayObject):string {
	// 	var i:number = this.labelsAndArgs.indexOf(arg);
	// 	return i == -1 ? '' : this.argTypes[i];
	// }

	// public allBlocksDo(f:Function):void {
	// 	f(this);
	// 	for (var arg of this.args) {
	// 		if (arg instanceof BlockModel) arg.allBlocksDo(f);
	// 	}
	// 	if (this.subStack1 != null) this.subStack1.allBlocksDo(f);
	// 	if (this.subStack2 != null) this.subStack2.allBlocksDo(f);
	// 	if (this.nextBlock != null) this.nextBlock.allBlocksDo(f);
	// }

	// // public showRunFeedback():void {
	// // 	if (this.filters && this.filters.length > 0) {
	// // 		for (var f of this.filters) {
	// // 			if (f instanceof GlowFilter) return;
	// // 		}
	// // 	}
	// // 	this.filters = this.runFeedbackFilters().concat(this.filters || []);
	// // }

	// // public hideRunFeedback():void {
	// // 	if (this.filters && this.filters.length > 0) {
	// // 		var newFilters:any[] = [];
	// // 		for (var f of this.filters) {
	// // 			if (!(f instanceof GlowFilter)) newFilters.push(f);
	// // 		}
	// // 		this.filters = newFilters;
	// // 	}
	// // }

	// // private runFeedbackFilters():any[] {
	// // 	// filters for showing that a stack is running
	// // 	var f:GlowFilter = new GlowFilter(0xfeffa0);
	// // 	f.strength = 2;
	// // 	f.blurX = f.blurY = 12;
	// // 	f.quality = 3;
	// // 	return [f];
	// // }

	// // public saveOriginalState():void {
	// // 	this.originalParent = this.parent;
	// // 	if (this.parent) {
	// // 		var b:BlockModel = <BlockModel>this.parent ;
	// // 		if (b == null) {
	// // 			this.originalRole = BlockModel.ROLE_ABSOLUTE;
	// // 		} else if (this.isReporter) {
	// // 			this.originalRole = BlockModel.ROLE_EMBEDDED;
	// // 			this.originalIndex = b.args.indexOf(this);
	// // 		} else if (b.nextBlock == this) {
	// // 			this.originalRole = BlockModel.ROLE_NEXT;
	// // 		} else if (b.subStack1 == this) {
	// // 			this.originalRole = BlockModel.ROLE_SUBSTACK1;
	// // 		} else if (b.subStack2 == this) {
	// // 			this.originalRole = BlockModel.ROLE_SUBSTACK2;
	// // 		}
	// // 		this.originalPosition = this.localToGlobal(new Point(0, 0));
	// // 	} else {
	// // 		this.originalRole = BlockModel.ROLE_NONE;
	// // 		this.originalPosition = null;
	// // 	}
	// // }

	// // public restoreOriginalState():void {
	// // 	var b:BlockModel = <BlockModel>this.originalParent ;
	// // 	this.scaleX = this.scaleY = 1;
	// // 	switch (this.originalRole) {
	// // 	case BlockModel.ROLE_NONE:
	// // 		if (this.parent) this.parent.removeChild(this);
	// // 		break;
	// // 	case BlockModel.ROLE_ABSOLUTE:
	// // 		this.originalParent.addChild(this);
	// // 		var p:Point = this.originalParent.globalToLocal(this.originalPosition);
	// // 		this.x = p.x;
	// // 		this.y = p.y;
	// // 		break;
	// // 	case BlockModel.ROLE_EMBEDDED:
	// // 		b.replaceArgWithBlock(b.args[this.originalIndex], this, Scratch.app.scriptsPane);
	// // 		break;
	// // 	case BlockModel.ROLE_NEXT:
	// // 		b.insertBlock(this);
	// // 		break;
	// // 	case BlockModel.ROLE_SUBSTACK1:
	// // 		b.insertBlockSub1(this);
	// // 		break;
	// // 	case BlockModel.ROLE_SUBSTACK2:
	// // 		b.insertBlockSub2(this);
	// // 		break;
	// // 	}
	// // }

	// public originalPositionIn(p:DisplayObject):Point {
	// 	return this.originalPosition && p.globalToLocal(this.originalPosition);
	// }

	// private setDefaultArgs(defaults:any[]):void {
	// 	this.collectArgs();
	// 	for (var i:number = 0; i < Math.min(this.args.length, defaults.length); i++) {
	// 		var argLabel:string = null;
	// 		var v:any = defaults[i];
	// 		if (v instanceof BlockArgModel) v = v.argValue;
	// 		if ('_edge_' == v) argLabel = Translator.map('edge');
	// 		if ('_mouse_' == v) argLabel = Translator.map('mouse-pointer');
	// 		if ('_myself_' == v) argLabel = Translator.map('myself');
	// 		if ('_stage_' == v) argLabel = Translator.map('Stage');
	// 		if (this.args[i] instanceof BlockArgModel) this.args[i].setArgValue(v, argLabel);
	// 	}
	// 	this.defaultArgValues = defaults;
	// }

	public setArg(i:number, newArg:any):void {
		// called on newly-created block (assumes argument being set is a BlockArgModel)
		// newArg can be either a reporter block or a literal value (string, number, etc.)
		this.collectArgs();
		if (i >= this.args.length) return;
		var oldArg:BlockArgModel = this.args[i];
		if (newArg instanceof BlockModel) {
			this.labelsAndArgs[this.labelsAndArgs.indexOf(oldArg)] = newArg;
			this.args[i] = newArg;
			//super.removeChild(oldArg);
			//this.addChild(newArg);
		} else {
			oldArg.setArgValue(newArg);
		}
	}

	// public fixExpressionLayout():void {
	// 	// fix expression layout up to the enclosing command block
	// 	var b:BlockModel = this;
	// 	while (b.isReporter) {
	// 		b.fixArgLayout();
	// 		if (b.parent instanceof BlockModel) b = b.parent
	// 		else return;
	// 	}
	// 	if (b instanceof BlockModel) b.fixArgLayout();
	// }

	public fixArgLayout():void {
		var item:any, i:number;
		if (this.suppressLayout) return;
		var x:number = this.indentLeft - this.indentAjustmentFor(this.labelsAndArgs[0]);
		var maxH:number = 0;
		for (i = 0; i < this.labelsAndArgs.length; i++) {
			item = this.labelsAndArgs[i];
			// Next line moves the argument of if and if-else blocks right slightly:
			if ((i == 1) && !(this.argTypes[i] == 'label')) x = Math.max(x, 30);
			item.x = x;
			maxH = Math.max(maxH, item.height);
			x += item.width + 2;
			if (this.argTypes[i] == 'icon') x += 3;
		}
		x -= this.indentAjustmentFor(this.labelsAndArgs[this.labelsAndArgs.length - 1]);

		for (i = 0; i < this.labelsAndArgs.length; i++) {
			item = this.labelsAndArgs[i];
			item.y = this.indentTop + ((maxH - item.height) / 2) + BlockModel.vOffset;
			if ((item instanceof BlockArgModel) && (!item.numberType)) item.y += 1;
		}

		if ([' ', '', 'o'].indexOf(this.type) >= 0) x = Math.max(x, this.minCommandWidth); // minimum width for command blocks
		if (['c', 'cf', 'e'].indexOf(this.type) >= 0) x = Math.max(x, this.minLoopWidth); // minimum width for C and E blocks
		if (['h'].indexOf(this.type) >= 0) x = Math.max(x, this.minHatWidth); // minimum width for hat blocks
		//if (this.elseLabel) x = Math.max(x, this.indentLeft + this.elseLabel.width + 2);

		this.base.setWidthAndTopHeight(x + this.indentRight, this.indentTop + maxH + this.indentBottom);
		if ((this.type == "c") || (this.type == "e")) this.fixStackLayout();
		this.base.redraw();
		this.fixElseLabel();
		this.collectArgs();
	}

	private indentAjustmentFor(item:any):number {
		var itemType:string = '';
		if (item instanceof BlockModel) itemType = item.type;
		if (item instanceof BlockArgModel) itemType = item.type;
		if ((this.type == 'b') && (itemType == 'b')) return 4;
		if ((this.type == 'r') && ((itemType == 'r') || (itemType == 'd') || (itemType == 'n'))) return 2;
		return 0;
	}

	public fixStackLayout():void {
		var b:BlockModel = this;
		while (b != null) {
			if (b.base.canHaveSubstack1()) {
				var substackH:number = BlockShapeModel.EmptySubstackH;
				if (b.subStack1) {
					b.subStack1.fixStackLayout();
					b.subStack1.x = BlockShapeModel.SubstackInset;
					b.subStack1.y = b.base.substack1y();
					//substackH = b.subStack1.getRect(b).height;
					if (b.subStack1.bottomBlock().isTerminal) substackH += BlockShapeModel.NotchDepth;
				}
				b.base.setSubstack1Height(substackH);
				substackH = BlockShapeModel.EmptySubstackH;
				if (b.subStack2) {
					b.subStack2.fixStackLayout();
					b.subStack2.x = BlockShapeModel.SubstackInset;
					b.subStack2.y = b.base.substack2y();
					//substackH = b.subStack2.getRect(b).height;
					if (b.subStack2.bottomBlock().isTerminal) substackH += BlockShapeModel.NotchDepth;
				}
				b.base.setSubstack2Height(substackH);
				b.base.redraw();
				b.fixElseLabel();
			}
			if (b.nextBlock != null) {
				b.nextBlock.x = 0;
				b.nextBlock.y = b.base.nextBlockY();
			}
			b = b.nextBlock;
		}
	}

	private fixElseLabel():void {
		// if (this.elseLabel) {
		// 	var metrics:TextLineMetrics = this.elseLabel.getLineMetrics(0);
		// 	var dy:number = (metrics.ascent + metrics.descent) / 2;
		// 	this.elseLabel.x = 4;
		// 	this.elseLabel.y = this.base.substack2y() - 11 - dy + BlockModel.vOffset;
		// }
	}

	// public previewSubstack1Height(h:number):void {
	// 	this.base.setSubstack1Height(h);
	// 	this.base.redraw();
	// 	this.fixElseLabel();
	// 	if (this.nextBlock) this.nextBlock.y = this.base.nextBlockY();
	// }

	// public duplicate(forClone:boolean, forStage:boolean = false):BlockModel {
	// 	var newSpec:string = this.spec;
	// 	if (this.op == 'whenClicked') newSpec = forStage ? 'when Stage clicked' : 'when this sprite clicked';
	// 	var dup:BlockModel = new BlockModel(newSpec, this.type, (forClone ? -1 : this.base.color), this.op);
	// 	dup.isRequester = this.isRequester;
	// 	dup.forcedRequester = this.forcedRequester;
	// 	dup.parameterNames = this.parameterNames;
	// 	dup.defaultArgValues = this.defaultArgValues;
	// 	dup.warpProcFlag = this.warpProcFlag;
	// 	if (forClone) {
	// 		dup.copyArgsForClone(this.args);
	// 	} else {
	// 		dup.copyArgs(this.args);
	// 		if (this.op == 'stopScripts' && this.args[0] instanceof BlockArgModel) {
	// 			if(this.args[0].argValue.indexOf('other scripts') == 0) {
	// 				if (forStage) dup.args[0].setArgValue('other scripts in stage');
	// 				else dup.args[0].setArgValue('other scripts in sprite');
	// 			}
	// 		}
	// 	}
	// 	if (this.nextBlock != null) dup.addChild(dup.nextBlock = this.nextBlock.duplicate(forClone, forStage));
	// 	if (this.subStack1 != null) dup.addChild(dup.subStack1 = this.subStack1.duplicate(forClone, forStage));
	// 	if (this.subStack2 != null) dup.addChild(dup.subStack2 = this.subStack2.duplicate(forClone, forStage));
	// 	if (!forClone) {
	// 		dup.x = this.x;
	// 		dup.y = this.y;
	// 		dup.fixExpressionLayout();
	// 		dup.fixStackLayout();
	// 	}
	// 	return dup;
	// }

	// private copyArgs(srcArgs:any[]):void {
	// 	// called on a newly created block that is being duplicated to copy the
	// 	// argument values and/or expressions from the source block's arguments
	// 	var i:number;
	// 	this.collectArgs();
	// 	for (i = 0; i < srcArgs.length; i++) {
	// 		var argToCopy:any = srcArgs[i];
	// 		if (argToCopy instanceof BlockArgModel) {
	// 			var arg:BlockArgModel = argToCopy;
	// 			this.args[i].setArgValue(arg.argValue, arg.labelOrNull());
	// 		}
	// 		if (argToCopy instanceof BlockModel) {
	// 			var newArg:BlockModel = argToCopy.duplicate(false);
	// 			var oldArg:any = this.args[i];
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
	// 	for (var i:number = 0; i < srcArgs.length; i++) {
	// 		var argToCopy:any = srcArgs[i];
	// 		if (argToCopy instanceof BlockArgModel) {
	// 			var a:BlockArgModel = new BlockArgModel(argToCopy.type, -1);
	// 			a.argValue = argToCopy.argValue;
	// 			this.args.push(a);
	// 		}
	// 		if (argToCopy instanceof BlockModel) {
	// 			this.args.push(argToCopy.duplicate(true));
	// 		}
	// 	}
	// 	for (var arg of this.args) this.addChild(arg); // fix for cloned proc bug xxx
	// }

	private collectArgs():void {
		var i:number;
		this.args = [];
		for (i = 0; i < this.labelsAndArgs.length; i++) {
			var a:any = this.labelsAndArgs[i];
			if ((a instanceof BlockModel) || (a instanceof BlockArgModel)) this.args.push(a);
		}
	}

	// public removeBlock(b:BlockModel):void {
	// 	if (b.parent == this) this.removeChild(b);
	// 	if (b == this.nextBlock) {
	// 		this.nextBlock = null;
	// 	}
	// 	if (b == this.subStack1) this.subStack1 = null;
	// 	if (b == this.subStack2) this.subStack2 = null;
	// 	if (b.isReporter) {
	// 		var i:number = this.labelsAndArgs.indexOf(b);
	// 		if (i < 0) return;
	// 		var newArg:DisplayObject = this.argOrLabelFor(this.argTypes[i], this.base.color);
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

	public insertBlock(b:BlockModel):void {
		var oldNext:BlockModel = this.nextBlock;

		//if (oldNext != null) super.removeChild(oldNext);

		//this.addChild(b);
		this.nextBlock = b;
		b.previousBlock = this;
		
		if (oldNext != null) b.appendBlock(oldNext); 
		

		this.topBlock().fixStackLayout();
	}

	public insertBlockAbove(b:BlockModel):void {
		b.x = this.x;
		b.y = this.y - b.height + BlockShapeModel.NotchDepth;
		//this.parent.addChild(b);
		b.bottomBlock().insertBlock(this);
	}

	public insertBlockAround(b:BlockModel):void {
		b.x = this.x - BlockShapeModel.SubstackInset;
		b.y = this.y - b.base.substack1y(); //  + BlockShapeModel.NotchDepth;
		//this.parent.addChild(b);
		//this.parent.removeChild(this);
		//b.addChild(this);
		b.subStack1 = this;
		b.fixStackLayout();
	}

	public insertBlockSub1(b:BlockModel):void {
		var old:BlockModel = this.subStack1;
		//if (old != null) old.parent.removeChild(old);

		//this.addChild(b);
		this.subStack1 = b;
		
		if (old != null) b.appendBlock(old);
		this.topBlock().fixStackLayout();
	}

	public insertBlockSub2(b:BlockModel):void {
		var old:BlockModel = this.subStack2;
		//if (old != null) this.removeChild(old);

		//this.addChild(b);
		this.subStack2 = b;
		if (old != null) b.appendBlock(old);
		this.topBlock().fixStackLayout();
	}

	// public replaceArgWithBlock(oldArg:DisplayObject, b:BlockModel, pane:DisplayObjectContainer):void {
	// 	var i:number = this.labelsAndArgs.indexOf(oldArg);
	// 	if (i < 0) return;

	// 	// remove the old argument
	// 	this.removeChild(oldArg);
	// 	this.labelsAndArgs[i] = b;
	// 	this.addChild(b);
	// 	this.fixExpressionLayout();

	// 	if (oldArg instanceof BlockModel) {
	// 		// leave old block in pane
	// 		var o:BlockModel = this.owningBlock();
	// 		var p:Point = pane.globalToLocal(o.localToGlobal(new Point(o.width + 5, (o.height - oldArg.height) / 2)));
	// 		oldArg.x = p.x;
	// 		oldArg.y = p.y;
	// 		pane.addChild(oldArg);
	// 	}
	// 	this.topBlock().fixStackLayout();
	// }

	private appendBlock(b:BlockModel):void {
		if (this.base.canHaveSubstack1() && !this.subStack1) {
			this.insertBlockSub1(b);
		} else {
			var bottom:BlockModel = this.bottomBlock();
			//bottom.addChild(b);
			bottom.nextBlock = b;
			b.previousBlock = bottom;
		}
	}

	// private owningBlock():BlockModel {
	// 	var b:BlockModel = this;
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

	public topBlock():BlockModel {
		var result:BlockModel = this;
		while (result.previousBlock instanceof BlockModel) result = result.previousBlock;
		return <BlockModel>result;
	}

	public bottomBlock():BlockModel {
		var result:BlockModel = this;
		while (result.nextBlock!= null) result = result.nextBlock;
		return result;
	}

	// private argOrLabelFor(s:string, c:number):DisplayObject {
	// 	// Possible token formats:
	// 	//	%<single letter>
	// 	//	%m.<menuName>
	// 	//	@<iconName>
	// 	//	label (any string with no embedded white space that does not start with % or @)
	// 	//	a token consisting of a single % or @ character is also a label
	// 	if (s.length >= 2 && s.charAt(0) == "%") { // argument spec
	// 		var argSpec:string = s.charAt(1);
	// 		if (argSpec == "b") return new BlockArgModel("b", c);
	// 		if (argSpec == "c") return new BlockArgModel("c", c);
	// 		if (argSpec == "d") return new BlockArgModel("d", c, true, s.slice(3));
	// 		if (argSpec == "m") return new BlockArgModel("m", c, false, s.slice(3));
	// 		if (argSpec == "n") return new BlockArgModel("n", c, true);
	// 		if (argSpec == "s") return new BlockArgModel("s", c, true);
	// 	} else if (s.length >= 2 && s.charAt(0) == "@") { // icon spec
	// 		var icon:any = Specs.IconNamed(s.slice(1));
	// 		return (icon) ? icon : this.makeLabel(s);
	// 	}
	// 	return this.makeLabel(ReadStream.unescape(s));
	// }

	// private makeLabel(label:string):TextField {
	// 	var text:TextField = new TextField();
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

	// public menu(evt:MouseEvent):void {
	// 	// Note: Unlike most menu() methods, this method invokes
	// 	// the menu itself rather than returning a menu to the caller.
	// 	if (BlockModel.MenuHandlerFunction == null) return;
	// 	if (this.isEmbeddedInProcHat()) BlockModel.MenuHandlerFunction(null, this.parent);
	// 	else BlockModel.MenuHandlerFunction(null, this);
	// }

	// public handleTool(tool:string, evt:MouseEvent):void {
	// 	if (this.isEmbeddedParameter()) return;
	// 	if (!this.isInPalette()) {
	// 		if ('copy' == tool) this.duplicateStack(10, 5);
	// 		if ('cut' == tool) this.deleteStack();
	// 	}
	// 	if (tool == 'help') this.showHelp();
	// }

	// public showHelp():void {
	// 	var i:number = -1;
	// 	if((i = this.op.indexOf('.')) > -1) {
	// 		var extName:string = this.op.substr(0, i);
	// 		if(Scratch.app.extensionManager.isInternal(extName))
	// 			Scratch.app.showTip('ext:'+extName);
	// 		else
	// 			DialogBox.notify('Help Missing', 'There is no documentation available for experimental extension "'+extName+'".', Scratch.app.stage);
	// 	}
	// 	else {
	// 		Scratch.app.showTip(this.op);
	// 	}
	// }

	// public duplicateStack(deltaX:number, deltaY:number):void {
	// 	if (this.isProcDef() || this.op == 'proc_declaration') return; // don't duplicate procedure definition
	// 	var forStage:boolean = Scratch.app.viewedObj() && Scratch.app.viewedObj().isStage;
	// 	var newStack:BlockModel = this.BlockIO.stringToStack(this.BlockIO.stackToString(this), forStage);
	// 	var p:Point = this.localToGlobal(new Point(0, 0));
	// 	newStack.x = p.x + deltaX;
	// 	newStack.y = p.y + deltaY;
	// 	Scratch.app.gh.grabOnMouseUp(newStack);
	// }

	// public deleteStack():boolean {
	// 	if (this.op == 'proc_declaration') {
	// 		return (<BlockModel>this.parent ).deleteStack();
	// 	}
	// 	var app:Scratch = Scratch.app;
	// 	var top:BlockModel = this.topBlock();
	// 	if (this.op == Specs.PROCEDURE_DEF && app.runtime.allCallsOf(this.spec, app.viewedObj(), false).length) {
	// 		this.DialogBox.notify('Cannot Delete', 'To delete a block definition, first remove all uses of the block.', this.stage);
	// 		return false;
	// 	}
	// 	if (top == this && app.interp.isRunning(top, app.viewedObj())) {
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

	// public attachedCommentsIn(scriptsPane:ScriptsPane):any[] {
	// 	var allBlocks:any[] = [];
	// 	this.allBlocksDo(function (b:BlockModel):void {
	// 		allBlocks.push(this.b);
	// 	});
	// 	var result:any[] = []
	// 	if (!scriptsPane) return result;
	// 	for (var i:number = 0; i < scriptsPane.numChildren; i++) {
	// 		var c:ScratchComment = <ScratchComment>scriptsPane.getChildAt(i) ;
	// 		if (c && c.blockRef && allBlocks.indexOf(c.blockRef) != -1) {
	// 			result.push(c);
	// 		}
	// 	}
	// 	return result;
	// }

	// public addComment():void {
	// 	var scriptsPane:ScriptsPane = <ScriptsPane>this.topBlock().parent ;
	// 	if (scriptsPane) scriptsPane.addComment(this);
	// }

	// /* Dragging */

	// public objToGrab(evt:MouseEvent):BlockModel {
	// 	if (this.isEmbeddedParameter() || this.isInPalette()) return this.duplicate(false, Scratch.app.viewedObj() instanceof ScratchStage);
	// 	return this;
	// }

	// /* Events */

	// public click(evt:MouseEvent):void {
	// 	if (this.editArg(evt)) return;
	// 	Scratch.app.runtime.interp.toggleThread(this.topBlock(), Scratch.app.viewedObj(), 1);
	// }

	// public doubleClick(evt:MouseEvent):void {
	// 	if (this.editArg(evt)) return;
	// 	Scratch.app.runtime.interp.toggleThread(this.topBlock(), Scratch.app.viewedObj(), 1);
	// }

	// private editArg(evt:MouseEvent):boolean {
	// 	var arg:BlockArgModel = <BlockArgModel>evt.target ;
	// 	if (!arg) arg = <BlockArgModel>evt.target.parent ;
	// 	if (arg && arg.isEditable && (arg.parent == this)) {
	// 		arg.startEditing();
	// 		return true;
	// 	}
	// 	return false;
	// }

	// private focusChange(evt:FocusEvent):void {
	// 	evt.preventDefault();
	// 	if (evt.target.parent.parent != this) return; // make sure the target TextField is in this block, not a child block
	// 	if (this.args.length == 0) return;
	// 	var i:number, focusIndex:number = -1;
	// 	for (i = 0; i < this.args.length; i++) {
	// 		if (this.args[i] instanceof BlockArgModel && this.stage.focus == this.args[i].field) focusIndex = i;
	// 	}
	// 	var target:BlockModel = this;
	// 	var delta:number = evt.shiftKey ? -1 : 1;
	// 	i = focusIndex + delta;
	// 	for (;;) {
	// 		if (i >= target.args.length) {
	// 			var p:BlockModel = <BlockModel>target.parent ;
	// 			if (p) {
	// 				i = p.args.indexOf(target);
	// 				if (i != -1) {
	// 					i += delta;
	// 					target = p;
	// 					continue;
	// 				}
	// 			}
	// 			if (target.subStack1) {
	// 				target = target.subStack1;
	// 			} else if (target.subStack2) {
	// 				target = target.subStack2;
	// 			} else {
	// 				var t:BlockModel = target;
	// 				target = t.nextBlock;
	// 				while (!target) {
	// 					var tp:BlockModel = <BlockModel>t.parent ;
	// 					var b:BlockModel = t;
	// 					while (tp && tp.nextBlock == b) {
	// 						b = tp;
	// 						tp = <BlockModel>tp.parent ;
	// 					}
	// 					if (!tp) return;
	// 					target = tp.subStack1 == b && tp.subStack2 ? tp.subStack2 : tp.nextBlock;
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
	// 			var nested:BlockModel = p.nextBlock == target ? p.subStack2 || p.subStack1 : p.subStack2 == target ? p.subStack1 : null;
	// 			if (nested) {
	// 				for (;;) {
	// 					nested = nested.bottomBlock();
	// 					var n2:BlockModel = nested.subStack1 || nested.subStack2;
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
	// 				var a:BlockArgModel = <BlockArgModel>target.args[i] ;
	// 				if (a && a.field && a.isEditable) {
	// 					a.startEditing();
	// 					return;
	// 				}
	// 				i += delta;
	// 			}
	// 		}
	// 	}
	// }

	// public getSummary():string {
	// 	var s:string = this.type == "r" ? "(" : this.type == "b" ? "<" : "";
	// 	var space:boolean = false;
	// 	for (var x:DisplayObject of this.labelsAndArgs) {
	// 		if (space) {
	// 			s += " ";
	// 		}
	// 		space = true;
	// 		var ba:BlockArgModel, b:BlockModel, tf:TextField;
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
	// 	if (this.base.canHaveSubstack1()) {
	// 		s += "\n" + (this.subStack1 ? BlockModel.indent(this.subStack1.getSummary()) : "");
	// 		if (this.base.canHaveSubstack2()) {
	// 			s += "\n" + this.elseLabel.text;
	// 			s += "\n" + (this.subStack2 ? BlockModel.indent(this.subStack2.getSummary()) : "");
	// 		}
	// 		s += "\n" + Translator.map("end");
	// 	}
	// 	if (this.nextBlock) {
	// 		s += "\n" + this.nextBlock.getSummary();
	// 	}
	// 	s += this.type == "r" ? ")" : this.type == "b" ? ">" : "";
	// 	return s;
	// }

	// protected static indent(s:string):string {
	// 	return s.replace(/^/gm, "    ");
	// }

}


