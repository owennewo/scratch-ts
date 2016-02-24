import {PathBuilder} from "../utils/path.builder";
import {Shape} from "./shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export abstract class BaseShape implements Shape {
    id: string;
    category: SpecCategoryModel;
    spec: SpecModel;

    group: any; // svg group

    /* dimensio attributes */
    x: number;
    y: number;
    w: number = 100;
    topH: number = 25;  // this is the height of the top bar.  most shape only have top bar but things like loops are more complex
    indentTop: number = 0;
    centerY: number;

    constructor(category: SpecCategoryModel, spec: SpecModel, x?: number, y?: number) {
        this.id = category.name + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        this.category = category;
        this.spec = spec;
        this.x = x;
        this.y = y;
        this.group = Graphics.ScriptPane.group(this.id, x, y, true);
    }

    move(x: number, y: number) {
        console.log("to do move");
    }

    getGroup(): any {
      return this.group
    }


    draw() {

    }

}
