System.register(["../shapes/text.box.shape", "../shapes/dropdown.shape", "./block.base.model", "../shapes/icon.shape", "../shapes/text.shape", "../shapes/number.shape", "../shapes/boolean.shape"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var text_box_shape_1, dropdown_shape_1, block_base_model_1, icon_shape_1, text_shape_1, number_shape_1, boolean_shape_1;
    var BlockArgModel, ArgType;
    return {
        setters:[
            function (text_box_shape_1_1) {
                text_box_shape_1 = text_box_shape_1_1;
            },
            function (dropdown_shape_1_1) {
                dropdown_shape_1 = dropdown_shape_1_1;
            },
            function (block_base_model_1_1) {
                block_base_model_1 = block_base_model_1_1;
            },
            function (icon_shape_1_1) {
                icon_shape_1 = icon_shape_1_1;
            },
            function (text_shape_1_1) {
                text_shape_1 = text_shape_1_1;
            },
            function (number_shape_1_1) {
                number_shape_1 = number_shape_1_1;
            },
            function (boolean_shape_1_1) {
                boolean_shape_1 = boolean_shape_1_1;
            }],
        execute: function() {
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
            BlockArgModel = (function (_super) {
                __extends(BlockArgModel, _super);
                // private menuIcon:Shap;
                // BlockArgModel types:
                // b - boolean (pointed)
                // c - color selector
                // d - number with menu (rounded w/ menu icon)
                // m - string with menu (rectangular w/ menu icon)
                // n - number (rounded)
                // s - string (rectangular)
                // none of the above - custom subclass of BlockArgModel
                function BlockArgModel(part, spec) {
                    _super.call(this);
                    this.argValue = undefined;
                    this.defaultArgValue = "";
                    this.numberType = BlockArgModel.NT_NOT_NUMBER;
                    this.editable = false;
                    this.isArgument = true;
                    this.spec = spec;
                    this.part = part;
                    // Possible token formats:
                    // 	%<single letter>
                    // 	%m.<menuName>
                    // 	@<iconName>
                    // 	label (any string with no embedded white space that does not start with % or @)
                    // 	a token consisting of a single % or @ character is also a label
                    if (part.length >= 2 && part.charAt(0) === "%") {
                        var argCode = part.charAt(1);
                        switch (argCode) {
                            case "b":
                                this.argValue = false;
                                this.type = ArgType.Boolean;
                                this.shape = new boolean_shape_1.BooleanShape(spec, this);
                                return;
                            case "c":
                                this.type = ArgType.ColorPicker;
                                this.shape = new text_box_shape_1.TextBoxShape(spec, this);
                                this.menuName = "colorPicker";
                                // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
                                return;
                            case "d":
                                this.argValue = 0;
                                this.type = ArgType.NumberMenu;
                                this.editable = true;
                                this.menuName = part.slice(3);
                                this.addMenuIcon();
                                this.shape = new number_shape_1.NumberShape(spec, this);
                                // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
                                return;
                            case "m":
                                this.type = ArgType.Menu;
                                this.menuName = part.slice(3);
                                this.shape = new dropdown_shape_1.DropDownShape(spec, this);
                                this.addMenuIcon();
                                // this.addEventListener(MouseEvent.MOUSE_DOWN, this.invokeMenu);
                                return;
                            case "n":
                                this.argValue = 0;
                                this.type = ArgType.Number;
                                this.shape = new number_shape_1.NumberShape(spec, this);
                                this.numberType = BlockArgModel.NT_FLOAT;
                                return;
                            case "s":
                                this.type = ArgType.UnknownS;
                                this.shape = new text_box_shape_1.TextBoxShape(spec, this);
                                return;
                            default:
                                // custom type; subclass is responsible for adding
                                // the desired children, setting width and height,
                                // and optionally defining the base shape
                                return;
                        }
                    }
                    else if (part.length >= 2 && part.charAt(0) === "@") {
                        this.type = ArgType.Icon;
                        this.iconName = part.slice(1);
                        this.shape = new icon_shape_1.IconShape(spec, undefined, this.iconName);
                        this.isArgument = false;
                    }
                    else {
                        this.type = ArgType.Label;
                        this.shape = new text_shape_1.TextShape(spec, undefined, part);
                        this.isArgument = false;
                    }
                    if (this.type === ArgType.ColorPicker) {
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
                BlockArgModel.prototype.clone = function () {
                    var clone = new BlockArgModel(this.part, this.spec);
                    clone.type = this.type;
                    clone.menuName = this.menuName;
                    clone.iconName = this.iconName;
                    clone.defaultArgValue = this.defaultArgValue;
                    return clone;
                };
                BlockArgModel.prototype.addMenuIcon = function () {
                    // todo do menu icon
                    // this.menuIcon = new Shape();
                    // let g: Graphics = this.menuIcon.graphics;
                    // g.beginFill(0, 0.6); // darker version of base color
                    // g.lineTo(7, 0);
                    // g.lineTo(3.5, 4);
                    // g.lineTo(0, 0);
                    // g.endFill();
                    // this.menuIcon.y = 5;
                };
                BlockArgModel.prototype.labelOrNull = function () { return this.field ? this.field.text : null; };
                BlockArgModel.prototype.setArgValue = function (value, label) {
                    if (label === void 0) { label = null; }
                    // if provided, label is displayed in field, rather than the value
                    // this is used for sprite names and to support translation
                    this.argValue = value;
                    if (this.field != null) {
                        var s = (value == null) ? "" : value;
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
                    if (this.type === ArgType.ColorPicker)
                        this.shape.setColor(this.argValue);
                    // this.shape.draw();
                };
                BlockArgModel.prototype.startEditing = function () {
                    if (this.editable) {
                        this.field.type = "INPUT";
                        this.field.selectable = true;
                        if (this.field.text.length === 0)
                            this.field.text = "  ";
                        this.field.setSelection(0, this.field.text.length);
                    }
                };
                BlockArgModel.prototype.stopEditing = function (ignore) {
                    this.field.type = "DYNAMIC";
                    this.field.selectable = false;
                };
                // private BlockArgModelFilters():any[] {
                // 	// filters for BlockArg outlines
                // 	// let f:BevelFilter = new BevelFilter(1);
                // 	// f.blurX = f.blurY = 2;
                // 	// f.highlightAlpha = 0.3;
                // 	// f.shadowAlpha = 0.6;
                // 	// f.angle = 240;  // change light angle to show indentation
                // 	// return [f];
                // }
                BlockArgModel.prototype.makeTextField = function () {
                    // let tf:TextField = new TextField();
                    // let offsets:any[] = this.argTextInsets(this.type);
                    // tf.x = offsets[0];
                    // tf.y = offsets[1];
                    // tf.autoSize = this.TextFieldAutoSize.LEFT;
                    // tf.defaultTextFormat = Block.argTextFormat;
                    // tf.selectable = false;
                    // tf.addEventListener(Event.CHANGE, this.textChanged);
                    // return tf;
                };
                BlockArgModel.prototype.argTextInsets = function (type) {
                    if (type === void 0) { type = ""; }
                    if (type === "b")
                        return [5, 0];
                    return this.numberType ? [3, 0] : [2, -1];
                };
                BlockArgModel.prototype.drawBlock = function (group, x, y) {
                    this.shape.setGroup(group);
                    this.shape.draw(x, y);
                };
                BlockArgModel.epsilon = 1 / 4294967296;
                BlockArgModel.NT_NOT_NUMBER = 0;
                BlockArgModel.NT_FLOAT = 1;
                BlockArgModel.NT_INT = 2;
                return BlockArgModel;
            })(block_base_model_1.BlockBaseModel);
            exports_1("BlockArgModel", BlockArgModel);
            (function (ArgType) {
                ArgType[ArgType["Boolean"] = 0] = "Boolean";
                ArgType[ArgType["ColorPicker"] = 1] = "ColorPicker";
                ArgType[ArgType["NumberMenu"] = 2] = "NumberMenu";
                ArgType[ArgType["Menu"] = 3] = "Menu";
                ArgType[ArgType["Number"] = 4] = "Number";
                ArgType[ArgType["Text"] = 5] = "Text";
                ArgType[ArgType["UnknownS"] = 6] = "UnknownS";
                ArgType[ArgType["UnknownSub"] = 7] = "UnknownSub";
                ArgType[ArgType["Label"] = 8] = "Label";
                ArgType[ArgType["Icon"] = 9] = "Icon";
            })(ArgType || (ArgType = {}));
            exports_1("ArgType", ArgType);
        }
    }
});
//# sourceMappingURL=blockarg.model.js.map