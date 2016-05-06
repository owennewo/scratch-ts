System.register(["../model/spec.model", "../shapes/shape.factory", "../shapes/geometry", "../shapes/stack.shape", "../utils/graphics", "../model/script.model", "../model/block.model"], function(exports_1) {
    var spec_model_1, shape_factory_1, geometry_1, stack_shape_1, graphics_1, script_model_1, block_model_1;
    var ScriptLayoutService;
    return {
        setters:[
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
            },
            function (shape_factory_1_1) {
                shape_factory_1 = shape_factory_1_1;
            },
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            },
            function (stack_shape_1_1) {
                stack_shape_1 = stack_shape_1_1;
            },
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (script_model_1_1) {
                script_model_1 = script_model_1_1;
            },
            function (block_model_1_1) {
                block_model_1 = block_model_1_1;
            }],
        execute: function() {
            ScriptLayoutService = (function () {
                function ScriptLayoutService() {
                }
                ScriptLayoutService.drawObject = function (obj) {
                    graphics_1.Graphics.ScriptPane.onDragOverCallback = function (draggedElement, targetElement) {
                        var group = ScriptLayoutService.findElement(draggedElement, "g");
                        var x = group.node.getBoundingClientRect().left;
                        var cy = group.node.getBoundingClientRect().top + 0.5 * group.node.getBoundingClientRect().height;
                        var el = Snap.getElementByPoint(x - 2, cy);
                        if (el) {
                            this.overModel = ScriptLayoutService.findModel(el, block_model_1.BlockModel);
                        }
                        else {
                            this.overModel = undefined;
                        }
                    };
                    graphics_1.Graphics.ScriptPane.onDragEndCallback = function (draggedElement) {
                        if (this.overModel) {
                            // let block: BlockModel = this.overScriptBlock.data("block");
                            // let shape: Shape = this.overScriptBlock.data("shape");
                            var draggedModel = draggedElement.data("model");
                            if (!draggedModel) {
                                draggedModel = ScriptLayoutService.findModel(draggedElement);
                            }
                            if (!draggedModel) {
                                return;
                            }
                            console.log("overModel2:" + this.overModel.code);
                            if (this.overModel instanceof script_model_1.ScriptModel) {
                                console.log("should add this block as a new script");
                                return;
                            }
                            if (draggedModel instanceof spec_model_1.SpecModel) {
                                console.log("add spec to model");
                                var spec = draggedModel;
                                var newBlock = new block_model_1.BlockModel(spec, spec.defaultArgs);
                                var existingBlock = this.overModel;
                                draggedElement.transform("translate(0,0)");
                                if (!existingBlock || !existingBlock.insertBlock) {
                                    console.log("block was not dropped on valid target:" + typeof (existingBlock));
                                }
                                else {
                                    existingBlock.insertBlock(newBlock);
                                    ScriptLayoutService.redrawScript(existingBlock.shape.group);
                                }
                            }
                            else {
                                console.log("not spec:" + draggedModel);
                            }
                        }
                    };
                    graphics_1.Graphics.ScriptPane.remove("#script-work-area");
                    var scriptWorkArea = graphics_1.Graphics.ScriptPane.group("script-work-area", 220, 0);
                    var blockGroup = Snap.select("#script-pane-categories-blocks");
                    if (blockGroup)
                        blockGroup.insertAfter(scriptWorkArea);
                    scriptWorkArea.data("model", obj);
                    obj.scripts.forEach(function (script) {
                        ScriptLayoutService.drawScript(script, scriptWorkArea);
                    });
                };
                ScriptLayoutService.redrawScript = function (childSvg) {
                    var script = ScriptLayoutService.findModel(childSvg, script_model_1.ScriptModel);
                    ScriptLayoutService.drawScript(script, script.group.parent());
                };
                ScriptLayoutService.findModel = function (svgElement, constr) {
                    if (!svgElement || svgElement === null) {
                        return null;
                    }
                    var parent = svgElement.parent();
                    if (!parent || parent === null) {
                        return null;
                    }
                    if ((!parent.node || !parent.node.id)) {
                        // not an instance of Snap.Element
                        return null;
                    }
                    else {
                        if (parent.data) {
                            var model = parent.data("model");
                            if (model) {
                                if (constr) {
                                    if (constr === model.constructor) {
                                        return model;
                                    }
                                    else {
                                    }
                                }
                                else {
                                    return model;
                                }
                            }
                        }
                        return ScriptLayoutService.findModel(parent, constr);
                    }
                };
                ScriptLayoutService.findElement = function (svgElement, tagname) {
                    if (!svgElement || svgElement === null) {
                        return null;
                    }
                    if (svgElement.node.tagName === tagname) {
                        return svgElement;
                    }
                    var parent = svgElement.parent();
                    if (!parent || parent === null) {
                        return null;
                    }
                    if ((!parent.node || !parent.node.id)) {
                        // not an instance of Snap.Element
                        return null;
                    }
                    else {
                        return ScriptLayoutService.findElement(parent, tagname);
                    }
                };
                ScriptLayoutService.drawScript = function (script, scriptWorkArea) {
                    var current = script.firstBlock;
                    if (script.group) {
                        script.group.remove();
                    }
                    //      if (!script.group) {
                    script.group = graphics_1.Graphics.ScriptPane.group("scratch-script-" + script.index, script.x, script.y, "draggable svg-script");
                    script.group.data("model", script);
                    graphics_1.Graphics.ScriptPane.makeDraggable(script.group);
                    scriptWorkArea.append(script.group);
                    //        }
                    this.drawBlock(current, script.group, 0, 0);
                };
                ScriptLayoutService.drawBlock = function (b, scriptGroup, x, y) {
                    var stackHeight = 0;
                    if (!b.shape) {
                        b.shape = shape_factory_1.ShapeFactory.createShape(b.spec);
                    }
                    if (b.shape instanceof stack_shape_1.StackShape) {
                        var stackShape = b.shape;
                        var subStackHeight = this.drawBlock(b.stack1, scriptGroup, x + geometry_1.Geometry.SubstackInset, y + stackShape.stack1y);
                        stackShape.stack1h = subStackHeight;
                    }
                    //      if (!b.shape.group) {
                    b.shape.newGroup(scriptGroup, x, y, b);
                    b.shape.setDraggable(false);
                    //      }
                    b.shape.drawHeader(b.labelsAndArgs);
                    b.shape.draw(0, 0, true);
                    var shapeHeight = b.shape.getGroup().getBBox().h;
                    stackHeight += shapeHeight - 3;
                    if (b.nextBlock) {
                        stackHeight += this.drawBlock(b.nextBlock, scriptGroup, x, y + stackHeight);
                    }
                    return stackHeight;
                };
                return ScriptLayoutService;
            })();
            exports_1("ScriptLayoutService", ScriptLayoutService);
        }
    }
});
//# sourceMappingURL=script.layout.service.js.map