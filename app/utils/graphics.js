System.register([], function(exports_1) {
    var Graphics;
    return {
        setters:[],
        execute: function() {
            Graphics = (function () {
                //    color: string;
                // path: string = "";
                function Graphics(id) {
                    this.id = id;
                }
                Graphics.prototype.checkPaperReady = function () {
                    if (!this.paper) {
                        // lazy init
                        this.paper = Snap(this.id);
                    }
                };
                Graphics.prototype.group = function (id, x, y, groupClass) {
                    this.checkPaperReady();
                    var group = this.paper.group();
                    if (groupClass) {
                        group.addClass(groupClass);
                    }
                    if (id) {
                        group.attr({
                            id: id,
                            transform: "translate(" + x + "," + y + ")"
                        });
                    }
                    else {
                        group.attr({
                            transform: "translate(" + x + "," + y + ")"
                        });
                    }
                    return group;
                };
                Graphics.prototype.remove = function (selector) {
                    var elem = this.paper.select(selector);
                    if (elem)
                        elem.remove();
                };
                Graphics.prototype.has = function (selector) {
                    this.checkPaperReady();
                    var elem = this.paper.select(selector);
                    if (elem)
                        return true;
                    return false;
                };
                Graphics.prototype.drawRect = function (x, y, width, height, rx, ry, categoryClass) {
                    var r = this.paper.rect(x, y, width, height, rx, ry);
                    if (categoryClass) {
                        r.addClass(categoryClass);
                    }
                    return r;
                };
                Graphics.prototype.drawEllipse = function (x, y, rx, ry, lineWidth, categoryClass) {
                    var e = this.paper.ellipse(x, y, rx, ry);
                    if (categoryClass) {
                        e.addClass(categoryClass);
                    }
                    return e;
                };
                Graphics.prototype.drawDropDown = function (x, y, width, height, rx, ry, text) {
                    // let r = this.paper.rect(x, y, width, height, rx, ry);
                    var textBox = this.paper.text(x, y, text + "[v]");
                    textBox.attr({ y: textBox.getBBox().h });
                    return textBox;
                };
                Graphics.prototype.drawText = function (x, y, text, textClass) {
                    var result = this.paper.text(x, y, text);
                    if (textClass) {
                        result.addClass(textClass);
                    }
                    return result;
                };
                Graphics.prototype.drawPath = function (path, pathClass) {
                    var p = this.paper.path(path);
                    if (pathClass) {
                        p.addClass(pathClass);
                    }
                    return p;
                };
                Graphics.prototype.drawStroke = function (oldX, oldY, newX, newY, color, width) {
                    var strokeGroup = Snap.select("#stroke-group");
                    if (!strokeGroup)
                        strokeGroup = this.group("stroke-group", 0, 0, "");
                    var path = this.drawPath("M" + oldX + "," + (-oldY) + "L" + newX + "," + (-newY));
                    path.attr({
                        style: "stroke: " + color.hex + "; stroke-width:" + width
                    });
                    strokeGroup.append(path);
                    var stageBackground = Snap.select("#stage-background");
                    if (stageBackground) {
                        strokeGroup.insertAfter(stageBackground);
                    }
                };
                Graphics.prototype.clearStrokes = function () {
                    var strokeGroup = Snap.select("#stroke-group");
                    if (strokeGroup)
                        strokeGroup.remove();
                };
                Graphics.prototype.clearAll = function () {
                    this.checkPaperReady();
                    if (this.paper) {
                        this.paper.clear();
                    }
                };
                Graphics.prototype.makeDraggable = function (group) {
                    var move = function (dx, dy, mouseX, mouseY) {
                        group.attr({
                            transform: group.data("origTransform") + (group.data("origTransform") ? "T" : "t") + [dx, dy]
                        });
                        var targetElement = Snap.getElementByPoint(mouseX, mouseY);
                        this.onDragOverCallback(group, targetElement);
                    };
                    var start = function () {
                        group.data("origTransform", group.transform().local);
                    };
                    var stop = function (mouseEvent) {
                        this.onDragEndCallback(group);
                        console.log("finished dragging: " + group.getBBox().x + ":" + group.getBBox().y);
                    };
                    group.drag(move, start, stop, this, this, this);
                };
                Graphics.ScriptPane = new Graphics("#svg-script-pane");
                Graphics.StagePane = new Graphics("#svg-stage");
                return Graphics;
            })();
            exports_1("Graphics", Graphics);
        }
    }
});
//# sourceMappingURL=graphics.js.map