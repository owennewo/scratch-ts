import {TextBoxShape} from "./text.box.shape";
import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {Shape} from "./shape";
import {BooleanShape} from "./boolean.shape";
import {CommandOutlineShape} from "./command.outline.shape";
import {CommandShape} from "./command.shape";
import {HatShape} from "./hat.shape";
import {DoubleStackShape} from "./double.stack.shape";
import {StackShape} from "./stack.shape";
import {NumberShape} from "./number.shape";
import {ProcHatShape} from "./proc.hat.shape";
import {SpecModel} from "../model/spec.model";
import {SpecCategoryModel} from "../model/spec.category.model";

export class ShapeFactory {
    static createShape(spec: SpecModel, arg?: BlockBaseModel, group?: Snap.Element): Shape {
      // if (!args) args = spec.defaultArgs;
        // var id = category.name  + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        switch (spec.shapeType) {
            case " ":
            case "":
            case "w":
                return new CommandShape(spec, arg, group);
            case "b":
                return new BooleanShape(spec, arg, group);
            case "r":
            case "R":
            case "rR":
              if (arg instanceof BlockArgModel && !arg.argValue) (<BlockArgModel> arg).argValue = 0;
                return new NumberShape(spec, arg, group);
            case "h":
                return new HatShape(spec, arg, group);
            case "c":
                return new StackShape(spec, arg, false, group);
            case "cf":
                return new StackShape(spec, arg, true, group);
            case "e":
                return new DoubleStackShape(spec, arg, group);
            case "f":
                return new CommandOutlineShape(spec, arg, false, group);
            case "o":
                return new ProcHatShape(spec, arg, group);
            case "p":
                return new ProcHatShape(spec, arg, group);
            default:
                return new TextBoxShape(spec, arg, group);

        }

    }



}
