System.register(["../utils/graphics"], function(exports_1) {
    var graphics_1;
    var BaseShape;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            }],
        execute: function() {
            BaseShape = (function () {
                function BaseShape(spec, arg, group) {
                    /* dimensio attributes */
                    this.x = 0;
                    this.y = 0;
                    this.w = 100;
                    this.topH = 25; // this is the height of the top bar.  most shape only have top bar but things like loops are more complex
                    this.indentTop = 0;
                    this.indentLeft = 5;
                    this.spec = spec;
                    this.id = this.spec.category.name + "_" + spec.code.replace(new RegExp(":", "g"), "_");
                    this.arg = arg;
                    this.group = group;
                }
                BaseShape.prototype.move = function (x, y) {
                    this.x = x;
                    this.y = y;
                    this.group.transform("t" + x + "," + y);
                };
                BaseShape.prototype.getGroup = function () {
                    return this.group;
                };
                BaseShape.prototype.setGroup = function (group) {
                    this.group = group;
                };
                BaseShape.prototype.newGroup = function (parentGroup, x, y, vis) {
                    this.group = graphics_1.Graphics.ScriptPane.group(this.id, x, y);
                    this.group.data("model", vis);
                    parentGroup.append(this.group);
                };
                BaseShape.prototype.drawHeader = function (args) {
                    var x = this.indentLeft;
                    var y = this.indentTop;
                    for (var _i = 0; _i < args.length; _i++) {
                        var arg = args[_i];
                        arg.drawBlock(this.group, x, y);
                        x = arg.shape.getBBox().w + this.indentLeft + 5;
                    }
                    this.w = x;
                };
                BaseShape.prototype.draw = function (x, y) {
                    this.x = x;
                    this.y = y;
                    if (this.draggable) {
                        this.makeDraggable();
                        this.group.addClass("draggable");
                    }
                };
                BaseShape.prototype.setWidthAndTopHeight = function (w, h) {
                    this.w = w;
                    this.h = w;
                };
                BaseShape.prototype.setColor = function (color) {
                };
                BaseShape.prototype.setDraggable = function (draggable) {
                    this.draggable = draggable;
                };
                BaseShape.prototype.getBBox = function () {
                    return this.group.getBBox();
                };
                BaseShape.prototype.makeDraggable = function () {
                    this.group.data("spec", this.spec);
                    this.group.data("shape", this);
                    graphics_1.Graphics.ScriptPane.makeDraggable(this.group);
                };
                return BaseShape;
            })();
            exports_1("BaseShape", BaseShape);
        }
    }
});
//# sourceMappingURL=base.shape.js.map