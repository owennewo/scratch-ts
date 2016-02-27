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
    static createShape(spec: SpecModel): Shape {
        // var id = category.name  + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        switch (spec.shapeType) {
            case " ":
            case "":
            case "w":
                return new CommandShape(spec);
            case "b":
                return new BooleanShape(spec);
            case "r":
            case "R":
            case "rR":
                return new NumberShape(spec);
            case "h":
                return new HatShape(spec);
            case "c":
                return new StackShape(spec);
            case "cf":
                return new StackShape(spec, true);
            case "e":
                return new DoubleStackShape(spec);
            case "f":
                return new CommandOutlineShape(spec, false);
            case "o":
                return new ProcHatShape(spec);
            case "p":
                return new ProcHatShape(spec);
            default:
                return new RectangleShape(spec);

        }

    }



}
