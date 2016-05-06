System.register(["../model/spec.model", "../model/spec.category.model", "../model/block.model", "../model/blockarg.model", "../utils/translator"], function(exports_1) {
    var spec_model_1, spec_category_model_1, block_model_1, spec_model_2, blockarg_model_1, translator_1;
    var BlockIOService;
    return {
        setters:[
            function (spec_model_1_1) {
                spec_model_1 = spec_model_1_1;
                spec_model_2 = spec_model_1_1;
            },
            function (spec_category_model_1_1) {
                spec_category_model_1 = spec_category_model_1_1;
            },
            function (block_model_1_1) {
                block_model_1 = block_model_1_1;
            },
            function (blockarg_model_1_1) {
                blockarg_model_1 = blockarg_model_1_1;
            },
            function (translator_1_1) {
                translator_1 = translator_1_1;
            }],
        execute: function() {
            /**
             * Convert blocks and stacks to/from an array structure or JSON string format.
             *  The array structure format captures the meaning of scripts in a compact form that
             *  is independent of the internal representation and is easy to convert to/from JSON.
             *
             * John Maloney, September 2010
            */
            BlockIOService = (function () {
                function BlockIOService() {
                }
                BlockIOService.stackToString = function (b) {
                    return JSON.stringify(BlockIOService.stackToArray(b));
                };
                BlockIOService.stringToStack = function (s, forStage) {
                    if (forStage === void 0) { forStage = false; }
                    return BlockIOService.arrayToStack(JSON.parse(s), forStage);
                };
                BlockIOService.stackToArray = function (b) {
                    // Return an array structure representing this entire stack.
                    if (b == null)
                        return null;
                    var result = [];
                    while (b != null) {
                        result.push(BlockIOService.blockToArray(b));
                        b = b.nextBlock;
                    }
                    return result;
                };
                BlockIOService.arrayToStack = function (cmdList, forStage) {
                    if (forStage === void 0) { forStage = false; }
                    // Return the stack represented by an array structure.
                    var topBlock, lastBlock;
                    for (var _i = 0; _i < cmdList.length; _i++) {
                        var cmd = cmdList[_i];
                        var b = null;
                        try {
                            b = BlockIOService.arrayToBlock(cmd, "", forStage);
                        }
                        catch (e) {
                            console.error("error reading stack", e);
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("undefined"));
                        }
                        if (topBlock == null)
                            topBlock = b;
                        if (lastBlock != null)
                            lastBlock.insertBlock(b);
                        lastBlock = b;
                    }
                    return topBlock;
                };
                BlockIOService.blockToArray = function (b) {
                    // Return an array structure for this block.
                    var result = [b.spec.code];
                    if (b.spec.code === spec_model_2.SpecOperation.GetVar)
                        return [spec_model_2.SpecOperation.GetVar, b.spec]; // variable reporter
                    if (b.spec.code === spec_model_2.SpecOperation.GetList)
                        return [spec_model_2.SpecOperation.GetList, b.spec]; // list reporter
                    if (b.spec.code === spec_model_2.SpecOperation.GetParam)
                        return [spec_model_2.SpecOperation.GetParam, b.spec, b.type]; // parameter reporter
                    if (b.spec.code === spec_model_2.SpecOperation.ProcedureDef)
                        return [spec_model_2.SpecOperation.ProcedureDef, b.spec, b.parameterNames, b.defaultArgValues, b.warpProcFlag];
                    if (b.spec.code === spec_model_2.SpecOperation.Call)
                        result = [spec_model_2.SpecOperation.Call, b.spec]; // procedure call - arguments follow spec
                    for (var _i = 0, _a = b.normalizedArgs(); _i < _a.length; _i++) {
                        var a = _a[_i];
                        // Note: arguments are always saved in normalized (i.e. left-to-right) order
                        if (a instanceof block_model_1.BlockModel)
                            result.push(BlockIOService.blockToArray(a));
                        if (a instanceof blockarg_model_1.BlockArgModel) {
                            var argVal = a.argValue;
                            // if (argVal instanceof ScratchObj) {
                            // 	// convert a Scratch sprite/stage reference to a name string
                            // 	argVal = argVal.objName;
                            // }
                            result.push(argVal);
                        }
                    }
                    if (b.isStack())
                        result.push(BlockIOService.stackToArray(b.stack1));
                    if (b.isDoubleStack())
                        result.push(BlockIOService.stackToArray(b.stack2));
                    return result;
                };
                BlockIOService.arrayToBlock = function (cmd, undefinedBlockType, forStage) {
                    // Make a block from an array of form: <op><arg>*
                    if (forStage === void 0) { forStage = false; }
                    // if (cmd[0] == 'getUserName') Scratch.app.usesUserNameBlock = true;
                    var special = BlockIOService.specialCmd(cmd, forStage);
                    if (special) {
                        return special;
                    }
                    var b;
                    b = BlockIOService.convertOldCmd(cmd);
                    if (b) {
                        return b;
                    }
                    if (cmd[0] === spec_model_2.SpecOperation.Call) {
                        b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.Call.toString()));
                        cmd.splice(0, 1);
                    }
                    else {
                        var spec = BlockIOService.specForCmd(cmd, undefinedBlockType);
                        if (!spec) {
                            // something has gone wrong, lets ignore it
                            return undefined;
                        }
                        else {
                            var label = spec[0];
                            if (forStage && spec[3] === "whenClicked")
                                label = "when Stage clicked";
                            b = new block_model_1.BlockModel(spec); // TODO, Specs.blockColor(spec[2]), spec[3]);
                        }
                    }
                    var args = BlockIOService.argsForCmd(cmd, b.spec.argCount, b.rightToLeft);
                    // console.log(b.spec.label + " with args " + args);
                    var substacks = BlockIOService.substacksForCmd(cmd, args.length);
                    var hadSpriteRef;
                    for (var i = 0; i < args.length; i++) {
                        var a = args[i];
                        // if (a instanceof ScratchObj) {
                        // 	a = a.objName; // convert a Scratch 1.4 sprite reference to a sprite name
                        // 	hadSpriteRef = true;
                        // }
                        b.setArg(i, a);
                    }
                    if (substacks[0] && b.isStack())
                        b.insertBlockSub1(substacks[0]);
                    if (substacks[1] && b.isDoubleStack())
                        b.insertBlockSub2(substacks[1]);
                    // if hadSpriteRef is true, don't call fixMouseEdgeRefs() to avoid converting references
                    // to sprites named 'mouse' or 'edge' to '_mouse_' or '_edge_'.
                    if (!hadSpriteRef)
                        BlockIOService.fixMouseEdgeRefs(b);
                    // b.fixArgLayout();
                    return b;
                };
                BlockIOService.specForCmd = function (specCode, undefinedBlockType) {
                    if (specCode instanceof Array) {
                        specCode = specCode[0];
                    }
                    // Return the block specification for the given command.
                    // let op: string = cmd[0];
                    // convert old Squeak modulo operator
                    // if (op === "\\\\") op = "%";
                    if (spec_model_1.SpecModel.SPECS.has(specCode))
                        return spec_model_1.SpecModel.SPECS.get(specCode);
                    // let extensionSpec:any[] = Scratch.app.extensionManager.specForCmd(op);
                    // if (extensionSpec) return extensionSpec;
                    debugger;
                    console.error("unknown spec:" + specCode);
                    return;
                    // let spec: string = "undefined";
                    // for (let i: number = 1; i < cmd.length; i++) spec += " %n"; // add placeholder arg slots
                    // return [spec, undefinedBlockType, 0, op]; // no match found
                };
                BlockIOService.argsForCmd = function (cmd, numArgs, reverseArgs) {
                    // Return an array of zero or more arguments for the given command.
                    // Arguments may be literal values or reporter blocks (expressions).
                    var result = [];
                    for (var i = 1; i <= numArgs; i++) {
                        var a = cmd[i];
                        if (a instanceof Array) {
                            // block
                            result.push(BlockIOService.arrayToBlock(a, "r"));
                        }
                        else {
                            // literal value
                            result.push(a);
                        }
                    }
                    if (reverseArgs)
                        result.reverse();
                    return result;
                };
                BlockIOService.substacksForCmd = function (cmd, numArgs) {
                    // Return an array of zero or more substacks for the given command.
                    var result = [];
                    for (var i = 1 + numArgs; i < cmd.length; i++) {
                        var a = cmd[i];
                        if (a instanceof Array) {
                            result.push(BlockIOService.arrayToStack(a));
                        }
                        else {
                            result.push(null);
                        }
                    }
                    return result;
                };
                BlockIOService.specialCmd = function (cmd, forStage) {
                    // If the given command is special (e.g. a reporter or old-style a hat blocK), return a block for it.
                    // Otherwise, return null.
                    var b;
                    switch (cmd[0]) {
                        case spec_model_2.SpecOperation.GetVar:
                            return new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.GetVar.toString()));
                        case spec_model_2.SpecOperation.GetList:
                            return new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.GetList.toString()));
                        case spec_model_2.SpecOperation.ProcedureDef:
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.ProcedureDef.toString()));
                            b.parameterNames = cmd[2];
                            b.defaultArgValues = cmd[3];
                            if (cmd.length > 4)
                                b.warpProcFlag = cmd[4];
                            // b.setSpec(cmd[1]);
                            // b.fixArgLayout();
                            return b;
                        case spec_model_2.SpecOperation.GetParam:
                            var paramType = (cmd.length >= 3) ? cmd[2] : "r";
                            return new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.GetParam.toString()));
                        case "changeVariable":
                            var varOp = cmd[2];
                            if (varOp === spec_model_2.SpecOperation.SetVar.toString()) {
                                b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.SetVar.toString()));
                            }
                            else if (varOp === spec_model_2.SpecOperation.ChangeVar.toString()) {
                                b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get(spec_model_2.SpecOperation.ChangeVar.toString()));
                            }
                            if (b == null)
                                return null;
                            var arg = cmd[3];
                            var undefinedBlockType = "r";
                            if (arg instanceof Array)
                                arg = BlockIOService.arrayToBlock(arg, undefinedBlockType);
                            b.setArg(0, cmd[1]);
                            b.setArg(1, arg);
                            return b;
                        case "EventHatMorph":
                            if (cmd[1] === "Scratch-StartClicked") {
                                return new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("whenGreenFlag"));
                            }
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("whenIReceive"));
                            b.setArg(0, cmd[1]);
                            return b;
                        case "MouseClickEventHatMorph":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("whenClicked"));
                            return b;
                        case "KeyEventHatMorph":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("whenKeyPressed"));
                            b.setArg(0, cmd[1]);
                            return b;
                        case "stopScripts":
                            var type = (cmd[1].indexOf("other scripts") === 0) ? " " : "f"; // block type depends on menu arg
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("stopScripts"));
                            if (type === " ") {
                                if (forStage)
                                    cmd[1] = "other scripts in stage";
                                else
                                    cmd[1] = "other scripts in sprite";
                            }
                            b.setArg(0, cmd[1]);
                            return b;
                    }
                    return null;
                };
                BlockIOService.convertOldCmd = function (cmd) {
                    // If the given command is one of a handful of old Scratch blocks,
                    // covert it to it's new form and return it. Otherwise, return null.
                    var b;
                    var controlColor = spec_category_model_1.SpecCategoryModel.CONTROL.color;
                    var looksColor = spec_category_model_1.SpecCategoryModel.LOOKS.color;
                    var operatorsColor = spec_category_model_1.SpecCategoryModel.OPERATORS.color;
                    switch (cmd[0]) {
                        case "abs":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("computeFunction:of:"));
                            b.setArg(0, "abs");
                            b.setArg(1, BlockIOService.convertArg(cmd[1]));
                            return b;
                        case "sqrt":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("computeFunction:of:"));
                            b.setArg(0, "sqrt");
                            b.setArg(1, BlockIOService.convertArg(cmd[1]));
                            return b;
                        case "doReturn":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("stopScripts"));
                            b.setArg(0, "this script");
                            return b;
                        case "stopAll":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("stopScripts"));
                            b.setArg(0, "all");
                            return b;
                        case "showBackground:":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("startScene"));
                            b.setArg(0, BlockIOService.convertArg(cmd[1]));
                            return b;
                        case "nextBackground":
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("nextScene"));
                            return b;
                        case "doForeverIf":
                            var ifBlock = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("doIf"));
                            ifBlock.setArg(0, BlockIOService.convertArg(cmd[1]));
                            if (cmd[2] instanceof Array)
                                ifBlock.insertBlockSub1(BlockIOService.arrayToStack(cmd[2]));
                            // ifBlock.fixArgLayout();
                            b = new block_model_1.BlockModel(spec_model_1.SpecModel.SPECS.get("doForever"));
                            b.insertBlockSub1(ifBlock);
                            return b;
                    }
                    return null;
                };
                BlockIOService.convertArg = function (arg) {
                    // If arg is an array, convert it to a block. Otherwise, return it unchanged.
                    return (arg instanceof Array) ? BlockIOService.arrayToBlock(arg, "r") : arg;
                };
                BlockIOService.fixMouseEdgeRefs = function (b) {
                    var refCmds = [
                        "createCloneOf", "distanceTo:", "getAttribute:of:",
                        "gotoSpriteOrMouse:", "pointTowards:", "touching:"];
                    if (refCmds.indexOf(b.spec.code) < 0)
                        return;
                    var arg;
                    if ((b.args.length === 1) && (b.args[0] instanceof blockarg_model_1.BlockArgModel))
                        arg = b.args[0];
                    if ((b.args.length === 2) && (b.args[1] instanceof blockarg_model_1.BlockArgModel))
                        arg = b.args[1];
                    if (arg) {
                        var oldVal = arg.argValue;
                        if (oldVal === "edge" || oldVal === "_edge_")
                            arg.setArgValue("_edge_", translator_1.Translator.map("edge"));
                        if (oldVal === "mouse" || oldVal === "_mouse_")
                            arg.setArgValue("_mouse_", translator_1.Translator.map("mouse-pointer"));
                        if (oldVal === "_myself_")
                            arg.setArgValue("_myself_", translator_1.Translator.map("myself"));
                        if (oldVal === "_stage_")
                            arg.setArgValue("_stage_", translator_1.Translator.map("Stage"));
                    }
                };
                BlockIOService.controlColor = spec_category_model_1.SpecCategoryModel.CONTROL.color;
                return BlockIOService;
            })();
            exports_1("BlockIOService", BlockIOService);
        }
    }
});
//# sourceMappingURL=block.io.service.js.map