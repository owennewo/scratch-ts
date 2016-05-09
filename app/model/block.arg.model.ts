import {TextBoxShape} from "../shapes/text.box.shape";
import {DropDownShape} from "../shapes/dropdown.shape";
import {BlockBaseModel} from "./block.base.model";
import {IconShape} from "../shapes/icon.shape";
import {TextShape} from "../shapes/text.shape";
import {NumberShape} from "../shapes/number.shape";
import {Shape} from "../shapes/shape";
import {SpecModel} from "./spec.model";
import {BooleanShape} from "../shapes/boolean.shape";
import {BlockShapeModel} from "./block.shape.model";
import {BlockModel} from "./block.model";
import {Graphics} from "../utils/graphics";
import {Translator} from "../utils/translator";


/**
 * A BlockArg represents a Block argument slot. Some BlockArgs, contain
 * a text field that can be edited by the user. Others (e.g. booleans)
 * are immutable. In either case, they be replaced by a reporter block
 * of the right type. That is, dropping a reporter block onto a BlockArg
 * inside a block causes the BlockArg to be replaced by the reporter.
 * If a reporter is removed, a BlockArg is added to the block.
 * To create a custom BlockArg widget such as a color picker, make a
 * subclass of BlockArg for the widget. Your constructor is responsible
 * for adding child display objects and setting its width and height.
 * The widget must initialize argValue and update it as the user
 * interacts with the widget. In some cases, the widget may need to
 * override the setArgValue() method. If the widget can accept dropped
 * arguments, it should set base to a BlockShape to support drag feedback.
 *
 * John Maloney, August 2009
 */
export class BlockArgModel extends BlockBaseModel {
    part: string;
    spec: SpecModel;

    public static epsilon: number = 1 / 4294967296;
    public static NT_NOT_NUMBER: number = 0;
    public static NT_FLOAT: number = 1;
    public static NT_INT: number = 2;

    public type: ArgType;
    public argValue: any = undefined;
    public defaultArgValue: any = "";
    public numberType: number = BlockArgModel.NT_NOT_NUMBER;
    public editable: boolean = false;
    public field; // :TextField;
    public menuName: string;
    public iconName: string;
    isArgument: boolean = true;

    // private menuIcon:Shap;

    // BlockArgModel types:
    // b - boolean (pointed)
    // c - color selector
    // d - number with menu (rounded w/ menu icon)
    // m - string with menu (rectangular w/ menu icon)
    // n - number (rounded)
    // s - string (rectangular)
    // none of the above - custom subclass of BlockArgModel
    constructor(part: string, spec: SpecModel) {
      super();
      this.spec = spec;
      this.part = part;
      // Possible token formats:
      // 	%<single letter>
      // 	%m.<menuName>
      // 	@<iconName>
      // 	label (any string with no embedded white space that does not start with % or @)
      // 	a token consisting of a single % or @ character is also a label
      if (part.length >= 2 && part.charAt(0) === "%") { // argument spec
          let argCode: string = part.charAt(1);

          switch (argCode) {
            case "b":
              this.argValue = false;
              this.type = ArgType.Boolean;
              this.shape = new BooleanShape(spec, this);
              return;
            case "c":
              this.type = ArgType.ColorPicker;
              this.shape = new TextBoxShape(spec, this);
              this.menuName = "colorPicker";
              // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);

              return;
            case "d":
              this.argValue = 0;
              this.type = ArgType.NumberMenu;
              this.editable = true;
              this.menuName = part.slice(3);
              this.addMenuIcon();
              this.shape = new NumberShape(spec, this);
              // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
              return;
            case "m":
              this.type = ArgType.Menu;
              this.menuName = part.slice(3);
              this.shape = new DropDownShape(spec, this);
              this.addMenuIcon();
              // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);

              return;
            case "n":
              this.argValue = 0;
              this.type = ArgType.Number;
              this.shape = new NumberShape(spec, this);
              this.numberType = BlockArgModel.NT_FLOAT;
              return;
            case "s":
              this.type = ArgType.UnknownS;
              this.shape = new TextBoxShape(spec, this);
              return;
            default:
              // custom type; subclass is responsible for adding
              // the desired children, setting width and height,
              // and optionally defining the base shape
              return;

          }
      } else if (part.length >= 2 && part.charAt(0) === "@") { // icon spec

        this.type = ArgType.Icon;
        this.iconName = part.slice(1);
        this.shape = new IconShape(spec, undefined, this.iconName);
        this.isArgument = false;
          // let icon: any = Specs.IconNamed(s.slice(1));
          // return (icon) ? icon : this.makeLabel(s);
      }
      else {
        this.type = ArgType.Label;
        this.shape = new TextShape(spec, undefined, part);
        this.isArgument = false;
      }

      if (this.type  === ArgType.ColorPicker) {
        this.shape.setWidthAndTopHeight(13, 13);
      }
      else {
        this.shape.setWidthAndTopHeight(30, 15); // BlockModel.argTextFormat.size + 6); // 15 for normal arg font
      }


//
//
//         if (this.editable || this.numberType || (this.type === "m")) { // add a string field
//             this.field = this.makeTextField();
//             if ((type === "m") && !editable) this.field.textColor = 0xFFFFFF;
//             else this.shape.setWidthAndTopHeight(30, 14); // Block.argTextFormat.size + 5); // 14 for normal arg font
//             this.field.text = this.numberType ? "10" : "";
//             if (this.numberType) this.field.restrict = "0-9e.\\-"; // restrict to numeric characters
//             if (editable) {
//                 // this.shape.setColor(0xFFFFFF); // if editable, set color to white
//                 this.isEditable = true;
//             }
// //            this.field.addEventListener(FocusEvent.FOCUS_OUT, this.stopEditing);
// //            this.addChild(this.field);
// //            this.textChanged(null);
//         } else {
//             this.shape.draw();
//         }
    }

    clone(): BlockArgModel {
       let clone = new BlockArgModel(this.part, this.spec);
       clone.type = this.type;
       clone.menuName = this.menuName;
       clone.iconName = this.iconName;
       clone.defaultArgValue = this.defaultArgValue;
       return clone;
    }

    addMenuIcon() {
      // todo do menu icon
      // this.menuIcon = new Shape();
      // let g: Graphics = this.menuIcon.graphics;
      // g.beginFill(0, 0.6); // darker version of base color
      // g.lineTo(7, 0);
      // g.lineTo(3.5, 4);
      // g.lineTo(0, 0);
      // g.endFill();
      // this.menuIcon.y = 5;
    }

    public labelOrNull(): string { return this.field ? this.field.text : null; }

    public setArgValue(value: any, label: string = null): void {
        // if provided, label is displayed in field, rather than the value
        // this is used for sprite names and to support translation
        this.argValue = value;
        if (this.field != null) {
            let s: string = (value == null) ? "" : value;
            this.field.text = (label) ? label : s;
            // if (this.menuName && !label && (value instanceof String) && (value != '')) {
            // 	if (BlockMenus.shouldTranslateItemForMenu(value, this.menuName)) {
            // 		// Translate menu value
            // 		this.field.text = Translator.map(value);
            // 	}
            // }
            // this.textChanged(null);
            this.argValue = value; // set argValue after textChanged()
            return;
        }
        if (this.type === ArgType.ColorPicker) this.shape.setColor(this.argValue);
        // this.shape.draw();
    }

    public startEditing(): void {
        if (this.editable) {
            this.field.type = "INPUT";
            this.field.selectable = true;
            if (this.field.text.length === 0) this.field.text = "  ";
            this.field.setSelection(0, this.field.text.length);
            // this.root.stage.focus = this.field;
        }
    }

    private stopEditing(ignore: any): void {
        this.field.type = "DYNAMIC";
        this.field.selectable = false;
    }

    // private BlockArgModelFilters():any[] {
    // 	// filters for BlockArg outlines
    // 	// let f:BevelFilter = new BevelFilter(1);
    // 	// f.blurX = f.blurY = 2;
    // 	// f.highlightAlpha = 0.3;
    // 	// f.shadowAlpha = 0.6;
    // 	// f.angle = 240;  // change light angle to show indentation
    // 	// return [f];
    // }

    private makeTextField() { // :TextField {
        // let tf:TextField = new TextField();
        // let offsets:any[] = this.argTextInsets(this.type);
        // tf.x = offsets[0];
        // tf.y = offsets[1];
        // tf.autoSize = this.TextFieldAutoSize.LEFT;
        // tf.defaultTextFormat = Block.argTextFormat;
        // tf.selectable = false;
        // tf.addEventListener(Event.CHANGE, this.textChanged);
        // return tf;
    }

    private argTextInsets(type: string = ""): any[] {
        if (type === "b") return [5, 0];
        return this.numberType ? [3, 0] : [2, -1];
    }

    drawBlock(group: Snap.Element, x: number, y: number) {
      this.shape.setGroup(group);

      this.shape.draw(x, y);
    }

    // private textChanged(evt:any):void {
    // 	this.argValue = this.field.text;
    // 	if (this.numberType) {
    // 		// optimization: coerce to a number if possible
    // 		let n:number = Number(this.argValue);
    // 		if (!isNaN(n)) {
    // 			this.argValue = n;

    // 			// For number arguments that are integers AND do NOT contain a decimal point, mark them as an INTEGER (used by pick random)
    // 			this.numberType = (this.field.text.indexOf('.') == -1 && n instanceof int) ? BlockArgModel.NT_INT : BlockArgModel.NT_FLOAT;
    // 		}
    // 		else
    // 			this.numberType = BlockArg.NT_FLOAT;
    // 	}
    // 	// fix layout:
    // 	let padding:number = (this.type == 'n') ? 3 : 0;
    // 	if (this.type == 'b') padding = 8;
    // 	if (this.menuIcon != null) padding = (this.type == 'd') ? 10 : 13;
    // 	let w:number = Math.max(14, this.field.textWidth + 6 + padding);
    // 	if (this.menuIcon) this.menuIcon.x = w - this.menuIcon.width - 3;
    // 	this.shape.setWidth(w);
    // 	this.shape.redraw();
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

export enum ArgType {
  Boolean, ColorPicker, NumberMenu, Menu, Number, Text, UnknownS, UnknownSub, Label, Icon
}
