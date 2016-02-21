/*
 * Scratch Project Editor and Player
 * Copyright (C) 2014 Massachusetts Institute of Technology
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// BlockArg.as
// John Maloney, August 2009
//
// A BlockArg represents a Block argument slot. Some BlockArgs, contain
// a text field that can be edited by the user. Others (e.g. booleans)
// are immutable. In either case, they be replaced by a reporter block
// of the right type. That is, dropping a reporter block onto a BlockArg
// inside a block causes the BlockArg to be replaced by the reporter.
// If a reporter is removed, a BlockArg is added to the block.
//
// To create a custom BlockArg widget such as a color picker, make a
// subclass of BlockArg for the widget. Your constructor is responsible
// for adding child display objects and setting its width and height.
// The widget must initialize argValue and update it as the user
// interacts with the widget. In some cases, the widget may need to
// override the setArgValue() method. If the widget can accept dropped
// arguments, it should set base to a BlockShape to support drag feedback.

//import {Sprite} from "../stubs/Sprite";
import {BlockShapeModel} from "./block.shape.model";
import {BlockModel} from "./block.model";
// import {Shape} from "../stubs/Shape";
// import {TextField} from "../stubs/TextField";
 import {Color} from "../utils/color";
// import {BevelFilter} from "../stubs/BevelFilter";
// import {Event} from "../stubs/Event";
// import {MouseEvent} from "../stubs/MouseEvent";
// import {FocusEvent} from "../stubs/FocusEvent";
import {Graphics} from "../utils/graphics";
import {Translator} from "../utils/translator";


export class BlockArgModel { 
	
	public static epsilon:number = 1 / 4294967296;
	public static NT_NOT_NUMBER:number = 0;
	public static NT_FLOAT:number = 1;
	public static NT_INT:number = 2;

	public type:string;
	public base:BlockShapeModel;
	public argValue:any = '';
	public numberType:number = BlockArgModel.NT_NOT_NUMBER;
	public isEditable:boolean;
	public field;//:TextField;
	public menuName:string;

//	private menuIcon:Shape;

	// BlockArgModel types:
	//	b - boolean (pointed)
	//	c - color selector
	//	d - number with menu (rounded w/ menu icon)
	//	m - string with menu (rectangular w/ menu icon)
	//	n - number (rounded)
	//	s - string (rectangular)
	//	none of the above - custom subclass of BlockArgModel
	constructor(type:string, color:number, editable:boolean = false, menuName:string = '') {
		
		this.type = type;

		if (color == -1) { // copy for clone; omit graphics
			if ((type == 'd') || (type == 'n')) this.numberType = BlockArgModel.NT_FLOAT;
			return;
		}
		var c:number = Color.scaleBrightness(color, 0.92);
		if (type == 'b') {
			this.base = new BlockShapeModel(BlockShapeModel.BooleanShape, c);
			this.argValue = false;
		} else if (type == 'c') {
			this.base = new BlockShapeModel(BlockShapeModel.RectShape, c);
			this.menuName = 'colorPicker';
			//this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
		} else if (type == 'd') {
			this.base = new BlockShapeModel(BlockShapeModel.NumberShape, c);
			this.numberType = BlockArgModel.NT_FLOAT;
			this.menuName = menuName;
			//this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
		} else if (type == 'm') {
			this.base = new BlockShapeModel(BlockShapeModel.RectShape, c);
			this.menuName = menuName;
			//this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
		} else if (type == 'n') {
			this.base = new BlockShapeModel(BlockShapeModel.NumberShape, c);
			this.numberType = BlockArgModel.NT_FLOAT;
			this.argValue = 0;
		} else if (type == 's') {
			this.base = new BlockShapeModel(BlockShapeModel.RectShape, c);
		} else {
			// custom type; subclass is responsible for adding
			// the desired children, setting width and height,
			// and optionally defining the base shape
			return;
		}

		// if (type == 'c') {
		// 	this.base.setWidthAndTopHeight(13, 13);
		// 	this.setArgValue(Color.random());
		// } else {
		// 	this.base.setWidthAndTopHeight(30, BlockModel.argTextFormat.size + 6); // 15 for normal arg font
		// }
		//this.base.filters = this.blockArgFilters();
		// this.addChild(this.base);

		// if ((type == 'd') || (type == 'm')) { // add a menu icon
		// 	this.menuIcon = new Shape();
		// 	var g:Graphics = this.menuIcon.graphics;
		// 	g.beginFill(0, 0.6); // darker version of base color
		// 	g.lineTo(7, 0);
		// 	g.lineTo(3.5, 4);
		// 	g.lineTo(0, 0);
		// 	g.endFill();
		// 	this.menuIcon.y = 5;
		// 	this.addChild(this.menuIcon);
		// }

		// if (editable || this.numberType || (type == 'm')) { // add a string field
		// 	this.field = this.makeTextField();
		// 	if ((type == 'm') && !editable) this.field.textColor = 0xFFFFFF;
		// 	else this.base.setWidthAndTopHeight(30, Block.argTextFormat.size + 5); // 14 for normal arg font
		// 	this.field.text = this.numberType ? '10' : '';
		// 	if (this.numberType) this.field.restrict = '0-9e.\\-'; // restrict to numeric characters
		// 	if (editable) {
		// 		this.base.setColor(0xFFFFFF); // if editable, set color to white
		// 		this.isEditable = true;
		// 	}
		// 	this.field.addEventListener(FocusEvent.FOCUS_OUT, this.stopEditing);
		// 	this.addChild(this.field);
		// 	this.textChanged(null);
		// } else {
		// 	this.base.redraw();
		// }
	}

	public labelOrNull():string { return this.field ? this.field.text : null }

	public setArgValue(value:any, label:string = null):void {
		// if provided, label is displayed in field, rather than the value
		// this is used for sprite names and to support translation
		this.argValue = value;
		if (this.field != null) {
			var s:string = (value == null) ? '' : value;
			this.field.text = (label) ? label : s;
			// if (this.menuName && !label && (value instanceof String) && (value != '')) {
			// 	if (BlockMenus.shouldTranslateItemForMenu(value, this.menuName)) {
			// 		// Translate menu value
			// 		this.field.text = Translator.map(value);
			// 	}
			// }
			//this.textChanged(null);
			this.argValue = value; // set argValue after textChanged()
			return;
		}
		if (this.type == 'c') this.base.setColor(Math.floor(this.argValue) & 0xFFFFFF);
		this.base.redraw();
	}

	public startEditing():void {
		if (this.isEditable) {
			this.field.type = "INPUT";
			this.field.selectable = true;
			if (this.field.text.length == 0) this.field.text = '  ';
			this.field.setSelection(0, this.field.text.length);
			//this.root.stage.focus = this.field;
		}
	}

	private stopEditing(ignore:any):void {
		this.field.type = "DYNAMIC";
		this.field.selectable = false;
	}

	// private BlockArgModelFilters():any[] {
	// 	// filters for BlockArg outlines
	// 	// var f:BevelFilter = new BevelFilter(1);
	// 	// f.blurX = f.blurY = 2;
	// 	// f.highlightAlpha = 0.3;
	// 	// f.shadowAlpha = 0.6;
	// 	// f.angle = 240;  // change light angle to show indentation
	// 	// return [f];
	// }

	private makeTextField() { //:TextField {
		// var tf:TextField = new TextField();
		// var offsets:any[] = this.argTextInsets(this.type);
		// tf.x = offsets[0];
		// tf.y = offsets[1];
		// tf.autoSize = this.TextFieldAutoSize.LEFT;
		// tf.defaultTextFormat = Block.argTextFormat;
		// tf.selectable = false;
		// tf.addEventListener(Event.CHANGE, this.textChanged);
		// return tf;
	}

	private argTextInsets(type:string = ''):any[] {
		if (type == 'b') return [5, 0];
		return this.numberType ? [3, 0] : [2, -1];
	}

	// private textChanged(evt:any):void {
	// 	this.argValue = this.field.text;
	// 	if (this.numberType) {
	// 		// optimization: coerce to a number if possible
	// 		var n:number = Number(this.argValue);
	// 		if (!isNaN(n)) {
	// 			this.argValue = n;

	// 			// For number arguments that are integers AND do NOT contain a decimal point, mark them as an INTEGER (used by pick random)
	// 			this.numberType = (this.field.text.indexOf('.') == -1 && n instanceof int) ? BlockArgModel.NT_INT : BlockArgModel.NT_FLOAT;
	// 		}
	// 		else
	// 			this.numberType = BlockArg.NT_FLOAT;
	// 	}
	// 	// fix layout:
	// 	var padding:number = (this.type == 'n') ? 3 : 0;
	// 	if (this.type == 'b') padding = 8;
	// 	if (this.menuIcon != null) padding = (this.type == 'd') ? 10 : 13;
	// 	var w:number = Math.max(14, this.field.textWidth + 6 + padding);
	// 	if (this.menuIcon) this.menuIcon.x = w - this.menuIcon.width - 3;
	// 	this.base.setWidth(w);
	// 	this.base.redraw();
	// 	if (this.parent instanceof Block) Block(this.parent).fixExpressionLayout();

	// 	if (evt && this.Scratch.app) this.Scratch.app.setSaveNeeded();
	// }

	// private invokeMenu(evt:MouseEvent):void {
	// 	if ((this.menuIcon != null) && (evt.localX <= this.menuIcon.x)) return;
	// 	if (BlockModel.MenuHandlerFunction != null) {
	// 		BlockModel.MenuHandlerFunction(evt, this.parent, this, this.menuName);
	// 		evt.stopImmediatePropagation();
	// 	}
	// }

}

