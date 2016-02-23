import {Shape} from "./shape";
import {BooleanShape} from "./boolean.shape";
import {CommandOutlineShape} from "./command.outline.shape";
import {CommandShape} from "./command.shape";
import {FinalCommandShape} from "./final.command.shape";
import {FinalLoopShape} from "./final.loop.shape";
import {HatShape} from "./hat.shape";
import {IfElseShape} from "./if.else.shape";
import {LoopShape} from "./loop.shape";
import {NumberShape} from "./number.shape";
import {ProcHatShape} from "./proc.hat.shape";
import {RectangleShape} from "./rectangle.shape";
import {SpecModel} from "../model/spec.model";
import {SpecCategoryModel} from "../model/spec.category.model";

export class ShapeFactory {
    static createShape(category: SpecCategoryModel, spec: SpecModel, x: number, y: number): Shape {
        // var id = category.name  + "_" + spec.code.replace(new RegExp(':', 'g'), "_");
        let color = category.color;
        switch (spec._type) {
            case " ":
            case "":
            case "w":
                return new CommandShape(category, spec, x, y);
            case "b":
                return new BooleanShape(category, spec, x, y);
            case "r":
            case "R":
            case "rR":
                return new NumberShape(category, spec, x, y);
            case "h":
                return new HatShape(category, spec, x, y);
            case "c":
                return new LoopShape(category, spec, x, y);
            case "cf":
                return new FinalLoopShape(category, spec, x, y);
            case "e":
                return new IfElseShape(category, spec, x, y);
            case "f":
                return new CommandOutlineShape(category, spec, false, x, y);
            case "o":
                return new ProcHatShape(category, spec, x, y);
            case "p":
                return new ProcHatShape(category, spec, x, y);
            default:
                return new RectangleShape(category, spec, x, y);

        }

    }
}
