System.register(["../utils/graphics", "../model/spec.category.model", "../shapes/shape.factory", "../model/spec.model"], function(exports_1) {
    var graphics_1, spec_category_model_1, shape_factory_1, spec_model_1;
    var SpecLayoutService;
    return {
        setters:[
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (spec_category_model_1_1) {
                spec_category_model_1 = spec_category_model_1_1;
            },
            function (shape_factory_1_1) {
                shape_factory_1 = shape_factory_1_1;
            },
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
            }],
        execute: function() {
            SpecLayoutService = (function () {
                function SpecLayoutService() {
                }
                SpecLayoutService.drawCategories = function () {
                    var _this = this;
                    if (graphics_1.Graphics.ScriptPane.has("#script-pane-categories")) {
                        return; // categories already setup
                    }
                    var groupCategories = graphics_1.Graphics.ScriptPane.group("script-pane-categories", 10, 10);
                    var index = 0;
                    var rows = Math.ceil(spec_category_model_1.SpecCategoryModel.CATEGORIES.size / 2);
                    spec_category_model_1.SpecCategoryModel.CATEGORIES.forEach(function (category) {
                        var row = index % rows;
                        var col = Math.floor(index / rows);
                        var x = 20 + col * 110;
                        var y = 20 + row * 25;
                        var groupCategory = graphics_1.Graphics.ScriptPane.group(category.name + "-categories", x, y, category.name.toLowerCase());
                        var rectStub = graphics_1.Graphics.ScriptPane.drawRect(0, 0, 10, 20, 0, 0, "stub");
                        var rectMain = graphics_1.Graphics.ScriptPane.drawRect(10, 0, 90, 20, 0, 0, "main");
                        groupCategory.click(function (event) {
                            var categorySvgs = Snap.selectAll("#script-pane-categories g");
                            categorySvgs.forEach(function (categorySvg) { categorySvg.removeClass("active"); });
                            _this.drawCategory(category);
                        });
                        groupCategory.append(rectStub);
                        groupCategory.append(rectMain);
                        groupCategory.append(graphics_1.Graphics.ScriptPane.drawText(15, 15, category.name, "#FFF"));
                        category.svg = groupCategory;
                        groupCategories.append(groupCategory);
                        index++;
                    });
                    this.drawCategory(spec_category_model_1.SpecCategoryModel.CATEGORIES.get(1));
                };
                SpecLayoutService.drawCategory = function (category) {
                    category.svg.addClass("active");
                    var oldCategoryBlocks = graphics_1.Graphics.ScriptPane.paper.select("#script-pane-categories-blocks");
                    if (oldCategoryBlocks) {
                        oldCategoryBlocks.remove();
                    }
                    var newCategoryBlocks = graphics_1.Graphics.ScriptPane.group("script-pane-categories-blocks", 10, 200, "spec-categories");
                    var xPos = 0;
                    var yPos = 0;
                    category.specs.forEach(function (spec) {
                        if (spec instanceof spec_model_1.SpecSpacerModel) {
                            yPos += 10;
                            return;
                        }
                        var shape = shape_factory_1.ShapeFactory.createShape(spec);
                        shape.newGroup(newCategoryBlocks, xPos, yPos, spec);
                        shape.setDraggable(true);
                        shape.drawHeader(spec.labelsAndArgs);
                        shape.draw(0, 0, true);
                        var shapeHeight = shape.getGroup().getBBox().h;
                        yPos += shapeHeight + 5;
                    });
                };
                SpecLayoutService.displayScripts = function (scripts) {
                    for (var _i = 0; _i < scripts.length; _i++) {
                        var script = scripts[_i];
                        console.log(" + script is at:" + script.x + ":" + script.y);
                        this.displayBlock(script.firstBlock);
                    }
                };
                SpecLayoutService.displayBlock = function (block) {
                    console.log("    - block" + block.spec.code + "[" + block.args + "]");
                    if (block.nextBlock) {
                        this.displayBlock(block.nextBlock);
                    }
                };
                return SpecLayoutService;
            })();
            exports_1("SpecLayoutService", SpecLayoutService);
        }
    }
});
//# sourceMappingURL=spec.layout.service.js.map