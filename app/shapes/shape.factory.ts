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
import {RectangleShape} from "./rectangle.shape";
import {SpecModel} from "../model/spec.model";
import {SpecCategoryModel} from "../model/spec.category.model";

export class ShapeFactory {
    static createShape(spec: SpecModel, args?: any[]): Shape {
      if (!args) args = spec.defaultArgs;
        // var id = category.name  + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        switch (spec.shapeType) {
            case " ":
            case "":
            case "w":
                return new CommandShape(spec, args);
            case "b":
                return new BooleanShape(spec, args);
            case "r":
            case "R":
            case "rR":
                return new NumberShape(spec, new BlockArgModel("%n", spec));
            case "h":
                return new HatShape(spec, args);
            case "c":
                return new StackShape(spec, args);
            case "cf":
                return new StackShape(spec, args, true);
            case "e":
                return new DoubleStackShape(spec, args);
            case "f":
                return new CommandOutlineShape(spec, args, false);
            case "o":
                return new ProcHatShape(spec, args);
            case "p":
                return new ProcHatShape(spec, args);
            default:
                return new RectangleShape(spec, args);

        }

    }



}
