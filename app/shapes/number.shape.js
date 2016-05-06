System.register(["../services/script.layout.service", "./base.shape", "../utils/graphics"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var script_layout_service_1, base_shape_1, graphics_1;
    var NumberShape;
    return {
        setters:[
            function (script_layout_service_1_1) {
                script_layout_service_1 = script_layout_service_1_1;
            },
            function (base_shape_1_1) {
                base_shape_1 = base_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            NumberShape = (function (_super) {
                __extends(NumberShape, _super);
                function NumberShape(spec, arg, group) {
                    _super.call(this, spec, arg, group);
                    this.arg = arg;
                    this.indentTop = 2;
                    // this.indentBottom = 2;
                    // this.indentLeft = 6;
                    // this.indentRight = 4;
                    // this.type = 'r';
                    // this.isReporter = true;
                    // this.isRequester = ((type == 'R') || (type == 'rR'));
                    // this.forcedRequester = (type == 'rR');
                }
                NumberShape.prototype.draw = function (x, y) {
                    var _this = this;
                    _super.prototype.draw.call(this, x, y);
                    var argValue = 0;
                    var textBox = undefined;
                    var cssClass;
                    if (this.arg) {
                        var blockArg = this.arg;
                        if (blockArg.argValue) {
                            argValue = this.arg.argValue.toString();
                        }
                        var text = graphics_1.Graphics.ScriptPane.drawText(this.x, this.y, argValue.toString(), "blockarg");
                        cssClass = "blockarg";
                        textBox = text.getBBox();
                        text.attr({ y: textBox.h });
                        text.click(function () { return _this.startEdit(); });
                        this.group.append(text);
                    }
                    else {
                        textBox = this.group.getBBox();
                        cssClass = this.spec.category.name.toLowerCase();
                    }
                    var top = textBox.y;
                    this.w = textBox.width + 10;
                    this.topH = textBox.h + 10;
                    this.centerY = this.topH / 2;
                    this.y = y - 2;
                    this.x = textBox.x - 4;
                    var rect = graphics_1.Graphics.ScriptPane.drawRect(this.x, this.y, this.w, this.topH, this.centerY, this.centerY, cssClass);
                    rect.click(function () { return _this.startEdit(); });
                    this.group.prepend(rect);
                };
                NumberShape.prototype.startEdit = function () {
                    var argValue = this.arg.argValue.toString();
                    var newValue = window.prompt("update arg:", argValue);
                    if (newValue) {
                        this.arg.argValue = newValue;
                    }
                    script_layout_service_1.ScriptLayoutService.redrawScript(this.group);
                };
                return NumberShape;
            })(base_shape_1.BaseShape);
            exports_1("NumberShape", NumberShape);
        }
    }
});
//# sourceMappingURL=number.shape.js.map