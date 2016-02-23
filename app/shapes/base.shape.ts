import {Shape} from "./shape";
import {Graphics, GraphicsBuilder} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export abstract class BaseShape implements Shape {
    id: string;
    x: number;
    y: number;
    color: string;
    // h: number = 20;
    w: number = 100;
    title: string;

    topH: number = 25;  // this is the height of the top bar.  most shape only have top bar but things like loops are more complex
    indentTop: number = 0;
    centerY: number;
    g: GraphicsBuilder;
    group: any; // svg group

    constructor(category: SpecCategoryModel, spec: SpecModel, x?: number, y?: number) {
        this.id = category.name + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        this.color = category.color;
        this.title = spec.description;
        this.x = x;
        this.y = y;
        this.g = Graphics.newGroup(this.id, x, y);
    }

    // move(x: number, y: number)
    // {
    //     this.x = x;
    //     this.y = y;

    //     this.centerY = y + this.h / 2;
    // }

    move(x: number, y: number) {
        console.log("to do move");
    }

    draw() {
        /*
        this.group = Graphics.PAPER.g(); //an svg group
        this.group.attr(
            {
                id: this.id,
                transform: "translate(" + this.x + "," + this.y + ")"
            }
        )
        */
    }

}
