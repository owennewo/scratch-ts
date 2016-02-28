import {PathBuilder} from "../utils/path.builder";
import {Shape} from "./shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export abstract class BaseShape implements Shape {
    id: string;
    spec: SpecModel;

    group: Snap.Element; // svg group

    /* dimensio attributes */
    x: number;
    y: number;
    w: number = 100;
    topH: number = 25;  // this is the height of the top bar.  most shape only have top bar but things like loops are more complex
    indentTop: number = 0;
    centerY: number;
    h: number;

    draggable: boolean;

    constructor(spec: SpecModel) {
        this.spec = spec;
        this.id = this.spec.category.name + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        this.group = Graphics.ScriptPane.group(this.id, this.x, this.y);
    }

    move(x: number, y: number) {
        console.log("to do move");
        this.group.transform("t" + x + "," + y);

    }

    getGroup(): any {
      return this.group;
    }


    draw(parentGroup?: Snap.Element) {
      if (parentGroup) {
        parentGroup.append(this.group);
      }
    }

    setWidthAndTopHeight(w: number, h: number) {
      this.w = w;
      this.h = w;
    }

    setColor(color: any) {

    }

    setDraggable(draggable: boolean) {
      this.draggable = draggable;
      if (draggable) {
        this.makeDraggable();
        this.group.addClass("draggable");
      }


    }

    private makeDraggable() {

        let move = function(dx, dy) {
            this.attr({
                transform: this.data("origTransform") + (this.data("origTransform") ? "T" : "t") + [dx, dy]
            });
        };

        let start = function() {
            this.data("origTransform", this.transform().local);
        };
        let stop = function(mouseEvent) {

            console.log("finished dragging: " + this.getBBox().x + ":" + this.getBBox().y);
        };

        this.group.drag(move, start, stop);

    }

}
