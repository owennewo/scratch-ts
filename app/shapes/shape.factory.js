System.register(["./text.box.shape", "../model/blockarg.model", "./boolean.shape", "./command.outline.shape", "./command.shape", "./hat.shape", "./double.stack.shape", "./stack.shape", "./number.shape", "./proc.hat.shape"], function(exports_1) {
    var text_box_shape_1, blockarg_model_1, boolean_shape_1, command_outline_shape_1, command_shape_1, hat_shape_1, double_stack_shape_1, stack_shape_1, number_shape_1, proc_hat_shape_1;
    var ShapeFactory;
    return {
        setters:[
            function (text_box_shape_1_1) {
                text_box_shape_1 = text_box_shape_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (boolean_shape_1_1) {
                boolean_shape_1 = boolean_shape_1_1;
            },
            function (command_outline_shape_1_1) {
                command_outline_shape_1 = command_outline_shape_1_1;
            },
            function (command_shape_1_1) {
                command_shape_1 = command_shape_1_1;
            },
            function (hat_shape_1_1) {
                hat_shape_1 = hat_shape_1_1;
            },
            function (double_stack_shape_1_1) {
                double_stack_shape_1 = double_stack_shape_1_1;
            },
            function (stack_shape_1_1) {
                stack_shape_1 = stack_shape_1_1;
            },
            function (number_shape_1_1) {
                number_shape_1 = number_shape_1_1;
            },
            function (proc_hat_shape_1_1) {
                proc_hat_shape_1 = proc_hat_shape_1_1;
            }],
        execute: function() {
            ShapeFactory = (function () {
                function ShapeFactory() {
                }
                ShapeFactory.createShape = function (spec, arg, group) {
                    // if (!args) args = spec.defaultArgs;
                    // var id = category.name  + "_" + spec.code.replace(new RegExp(":", "g"), "_");
                    switch (spec.shapeType) {
                        case " ":
                        case "":
                        case "w":
                            return new command_shape_1.CommandShape(spec, arg, group);
                        case "b":
                            return new boolean_shape_1.BooleanShape(spec, arg, group);
                        case "r":
                        case "R":
                        case "rR":
                            if (arg instanceof blockarg_model_1.BlockArgModel && !arg.argValue)
                                arg.argValue = 0;
                            return new number_shape_1.NumberShape(spec, arg, group);
                        case "h":
                            return new hat_shape_1.HatShape(spec, arg, group);
                        case "c":
                            return new stack_shape_1.StackShape(spec, arg, false, group);
                        case "cf":
                            return new stack_shape_1.StackShape(spec, arg, true, group);
                        case "e":
                            return new double_stack_shape_1.DoubleStackShape(spec, arg, group);
                        case "f":
                            return new command_outline_shape_1.CommandOutlineShape(spec, arg, false, group);
                        case "o":
                            return new proc_hat_shape_1.ProcHatShape(spec, arg, group);
                        case "p":
                            return new proc_hat_shape_1.ProcHatShape(spec, arg, group);
                        default:
                            return new text_box_shape_1.TextBoxShape(spec, arg, group);
                    }
                };
                return ShapeFactory;
            })();
            exports_1("ShapeFactory", ShapeFactory);
        }
    }
});
//# sourceMappingURL=shape.factory.js.map