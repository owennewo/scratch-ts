import {SpecCategoryModel} from "../model/spec.category.model";
import {BlockModel} from "./../model/block.model";
import {BlockArgModel} from "../model/blockarg.model";
import {Translator} from "../utils/translator";

/**
 * Convert blocks and stacks to/from an array structure or JSON string format.
 *  The array structure format captures the meaning of scripts in a compact form that
 *  is independent of the internal representation and is easy to convert to/from JSON.
 *
 * John Maloney, September 2010
*/
export class BlockIO {

    public static stackToString(b: BlockModel): string {
        return JSON.stringify(BlockIO.stackToArray(b));
    }

    public static stringToStack(s: string, forStage: boolean = false): BlockModel {
        return BlockIO.arrayToStack(JSON.parse(s), forStage);
    }

    public static stackToArray(b: BlockModel): any[] {
        // Return an array structure representing this entire stack.
        if (b == null) return null;
        let result: any[] = [];
        while (b != null) {
            result.push(BlockIO.blockToArray(b));
            b = b.nextBlock;
        }
        return result;
    }

    public static arrayToStack(cmdList: any[], forStage: boolean = false): BlockModel {
        // Return the stack represented by an array structure.
        let topBlock: BlockModel, lastBlock: BlockModel;
        for (let cmd of cmdList) {
            let b: BlockModel = null;
            try { b = BlockIO.arrayToBlock(cmd, "", forStage); } catch (e) { b = new BlockModel("undefined"); }
            if (topBlock == null) topBlock = b;
            if (lastBlock != null) lastBlock.insertBlock(b);
            lastBlock = b;
        }
        return topBlock;
    }

    private static blockToArray(b: BlockModel): any[] {
        // Return an array structure for this block.
        let result: any[] = [b.op];
        if (b.op === Specs.GetVar) return [Specs.GetVar, b.spec];		// variable reporter
        if (b.op === Specs.GetList) return [Specs.GetList, b.spec];	// list reporter
        if (b.op === Specs.GetParam) return [Specs.GetParam, b.spec, b.type]; // parameter reporter
        if (b.op === Specs.ProcedureDef)								// procedure definition
            return [Specs.ProcedureDef, b.spec, b.parameterNames, b.defaultArgValues, b.warpProcFlag];
        if (b.op === Specs.Call) result = [Specs.Call, b.spec];			// procedure call - arguments follow spec
        for (let a of b.normalizedArgs()) {
            // Note: arguments are always saved in normalized (i.e. left-to-right) order
            if (a instanceof BlockModel) result.push(BlockIO.blockToArray(a));
            if (a instanceof BlockArgModel) {
                let argVal: any = a.argValue;
                // if (argVal instanceof ScratchObj) {
                // 	// convert a Scratch sprite/stage reference to a name string
                // 	argVal = argVal.objName;
                // }
                result.push(argVal);
            }
        }
        if (b.base.canHaveSubstack1()) result.push(BlockIO.stackToArray(b.subStack1));
        if (b.base.canHaveSubstack2()) result.push(BlockIO.stackToArray(b.subStack2));
        return result;
    }

    private static arrayToBlock(cmd: any[], undefinedBlockType: string, forStage: boolean = false): BlockModel {
        // Make a block from an array of form: <op><arg>*

        // if (cmd[0] == 'getUserName') Scratch.app.usesUserNameBlock = true;

        let special: BlockModel = BlockIO.specialCmd(cmd, forStage);
        if (special) { special.fixArgLayout(); return special; }

        let b: BlockModel;
        b = BlockIO.convertOldCmd(cmd);
        if (b) { b.fixArgLayout(); return b; }

        if (cmd[0] === Specs.Call) {
            b = new BlockModel(cmd[1], "", Specs.ProcedureColor, Specs.Call);
            cmd.splice(0, 1);
        } else {
            let spec: any[] = BlockIO.specForCmd(cmd, undefinedBlockType);
            let label: string = spec[0];
            if (forStage && spec[3] === "whenClicked") label = "when Stage clicked";
            b = new BlockModel(label, spec[1], SpecCategoryModel.GetColorFromSpec(spec)); // TODO, Specs.blockColor(spec[2]), spec[3]);
        }

        let args: any[] = BlockIO.argsForCmd(cmd, b.args.length, b.rightToLeft);
        let substacks: any[] = BlockIO.substacksForCmd(cmd, b.args.length);
        let hadSpriteRef: boolean;
        for (let i: number = 0; i < args.length; i++) {
            let a: any = args[i];
            // if (a instanceof ScratchObj) {
            // 	a = a.objName; // convert a Scratch 1.4 sprite reference to a sprite name
            // 	hadSpriteRef = true;
            // }
            b.setArg(i, a);
        }
        if (substacks[0] && (b.base.canHaveSubstack1())) b.insertBlockSub1(substacks[0]);
        if (substacks[1] && (b.base.canHaveSubstack2())) b.insertBlockSub2(substacks[1]);
        // if hadSpriteRef is true, don't call fixMouseEdgeRefs() to avoid converting references
        // to sprites named 'mouse' or 'edge' to '_mouse_' or '_edge_'.
        if (!hadSpriteRef) BlockIO.fixMouseEdgeRefs(b);
        b.fixArgLayout();
        return b;
    }

    public static specForCmd(cmd: any[], undefinedBlockType: string): any[] {
        // Return the block specification for the given command.
        let op: string = cmd[0];
				// convert old Squeak modulo operator
        if (op === "\\\\") op = "%";
        for (let entry of Specs.commands) {
            if (entry[3] === op) return entry;
        }
        // let extensionSpec:any[] = Scratch.app.extensionManager.specForCmd(op);
        // if (extensionSpec) return extensionSpec;

        let spec: string = "undefined";
        for (let i: number = 1; i < cmd.length; i++) spec += " %n"; // add placeholder arg slots
        return [spec, undefinedBlockType, 0, op]; // no match found
    }

    private static argsForCmd(cmd: any[], numArgs: number, reverseArgs: boolean): any[] {
        // Return an array of zero or more arguments for the given command.
        // Arguments may be literal values or reporter blocks (expressions).
        let result: any[] = [];
        for (let i: number = 1; i <= numArgs; i++) {
            let a: any = cmd[i];
            if (a instanceof Array) {
                // block
                result.push(BlockIO.arrayToBlock(a, "r"));
            } else {
                // literal value
                result.push(a);
            }
        }
        if (reverseArgs) result.reverse();
        return result;
    }

    private static substacksForCmd(cmd: any[], numArgs: number): any[] {
        // Return an array of zero or more substacks for the given command.
        let result: any[] = [];
        for (let i: number = 1 + numArgs; i < cmd.length; i++) {
            let a: any = cmd[i];
            if (a == null) result.push(null); // null indicates an empty stack
            else result.push(BlockIO.arrayToStack(a));
        }
        return result;
    }

    private static controlColor: string = SpecCategoryModel.CONTROL.color;

    private static specialCmd(cmd: any[], forStage: boolean): BlockModel {
        // If the given command is special (e.g. a reporter or old-style a hat blocK), return a block for it.
        // Otherwise, return null.
        let b: BlockModel;
        switch (cmd[0]) {
            case Specs.GetVar:
                return new BlockModel(cmd[1], "r", Specs.VariableColor, Specs.GetVar);
            case Specs.GetList:
                return new BlockModel(cmd[1], "r", Specs.ListColor, Specs.GetList);
            case Specs.ProcedureDef:
                b = new BlockModel("", "p", Specs.ProcedureColor, Specs.ProcedureDef);
                b.parameterNames = cmd[2];
                b.defaultArgValues = cmd[3];
                if (cmd.length > 4) b.warpProcFlag = cmd[4];
                b.setSpec(cmd[1]);
                b.fixArgLayout();
                return b;
            case Specs.GetParam:
                let paramType: string = (cmd.length >= 3) ? cmd[2] : "r";
                return new BlockModel(cmd[1], paramType, Specs.ParameterColor, Specs.GetParam);
            case "changeVariable":
                let varOp: string = cmd[2];
                if (varOp === Specs.SetVar) {
                    b = new BlockModel("set %m.let to %s", " ", Specs.VariableColor, Specs.SetVar);
                } else if (varOp === Specs.ChangeVar) {
                    b = new BlockModel("change %m.let by %n", " ", Specs.VariableColor, Specs.ChangeVar);
                }
                if (b == null) return null;
                let arg: any = cmd[3];
                let undefinedBlockType: string = "r";
                if (arg instanceof Array) arg = BlockIO.arrayToBlock(arg, undefinedBlockType);
                b.setArg(0, cmd[1]);
                b.setArg(1, arg);
                return b;
            case "EventHatMorph":
                if (cmd[1] === "Scratch-StartClicked") {
                    return new BlockModel("when @greenFlag clicked", "h", SpecCategoryModel.CONTROL.color, "whenGreenFlag");
                }
                b = new BlockModel("when I receive %m.broadcast", "h", SpecCategoryModel.CONTROL.color, "whenIReceive");
                b.setArg(0, cmd[1]);
                return b;
            case "MouseClickEventHatMorph":
                b = new BlockModel("when I am clicked", "h", SpecCategoryModel.CONTROL.color, "whenClicked");
                return b;
            case "KeyEventHatMorph":
                b = new BlockModel("when %m.key key pressed", "h", SpecCategoryModel.CONTROL.color, "whenKeyPressed");
                b.setArg(0, cmd[1]);
                return b;
            case "stopScripts":
                let type: string = (cmd[1].indexOf("other scripts") === 0) ? " " : "f"; // block type depends on menu arg
                b = new BlockModel("stop %m.stop", type, SpecCategoryModel.CONTROL.color, "stopScripts");
                if (type === " ") {
                    if (forStage) cmd[1] = "other scripts in stage";
                    else cmd[1] = "other scripts in sprite";

                }
                b.setArg(0, cmd[1]);
                return b;
        }
        return null;
    }

    private static convertOldCmd(cmd: any[]): BlockModel {
        // If the given command is one of a handful of old Scratch blocks,
        // covert it to it's new form and return it. Otherwise, return null.
        let b: BlockModel;
        let controlColor = SpecCategoryModel.CONTROL.color;
        let looksColor = SpecCategoryModel.LOOKS.color;
        let operatorsColor = SpecCategoryModel.OPERATORS.color;

        switch (cmd[0]) {
            case "abs":
                b = new BlockModel("%m.mathOp of %n", "r", operatorsColor, "computeFunction:of:");
                b.setArg(0, "abs");
                b.setArg(1, BlockIO.convertArg(cmd[1]));
                return b;
            case "sqrt":
                b = new BlockModel("%m.mathOp of %n", "r", operatorsColor, "computeFunction:of:");
                b.setArg(0, "sqrt");
                b.setArg(1, BlockIO.convertArg(cmd[1]));
                return b;
            case "doReturn":
                b = new BlockModel("stop %m.stop", "f", controlColor, "stopScripts");
                b.setArg(0, "this script");
                return b;
            case "stopAll":
                b = new BlockModel("stop %m.stop", "f", controlColor, "stopScripts");
                b.setArg(0, "all");
                return b;
            case "showBackground:":
                b = new BlockModel("switch backdrop to %m.backdrop", " ", looksColor, "startScene");
                b.setArg(0, BlockIO.convertArg(cmd[1]));
                return b;
            case "nextBackground":
                b = new BlockModel("next background", " ", looksColor, "nextScene");
                return b;
            case "doForeverIf":
                let ifBlock: BlockModel = new BlockModel("if %b then", "c", controlColor, "doIf");
                ifBlock.setArg(0, BlockIO.convertArg(cmd[1]));
                if (cmd[2] instanceof Array) ifBlock.insertBlockSub1(BlockIO.arrayToStack(cmd[2]));
                ifBlock.fixArgLayout();

                b = new BlockModel("forever", "cf", controlColor, "doForever");
                b.insertBlockSub1(ifBlock);
                return b;
        }
        return null;
    }

    private static convertArg(arg: any): any {
        // If arg is an array, convert it to a block. Otherwise, return it unchanged.
        return (arg instanceof Array) ? BlockIO.arrayToBlock(arg, "r") : arg;
    }

    private static fixMouseEdgeRefs(b: BlockModel): void {
        let refCmds: any[] = [
            "createCloneOf", "distanceTo:", "getAttribute:of:",
            "gotoSpriteOrMouse:", "pointTowards:", "touching:"];
        if (refCmds.indexOf(b.op) < 0) return;
        let arg: BlockArgModel;
        if ((b.args.length === 1) && (b.args[0] instanceof BlockArgModel)) arg = b.args[0];
        if ((b.args.length === 2) && (b.args[1] instanceof BlockArgModel)) arg = b.args[1];
        if (arg) {
            let oldVal: string = arg.argValue;
            if (oldVal === "edge" || oldVal === "_edge_") arg.setArgValue("_edge_", Translator.map("edge"));
            if (oldVal === "mouse" || oldVal === "_mouse_") arg.setArgValue("_mouse_", Translator.map("mouse-pointer"));
            if (oldVal === "_myself_") arg.setArgValue("_myself_", Translator.map("myself"));
            if (oldVal === "_stage_") arg.setArgValue("_stage_", Translator.map("Stage"));
        }
    }

}
