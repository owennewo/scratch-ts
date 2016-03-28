import {BlockBaseModel} from "../model/block.base.model";
import {ScriptLayout} from "../ui/script.layout";
import {BlockArgModel} from "../model/blockarg.model";
import {BlockModel} from "../model/block.model";
import {PathBuilder} from "../utils/path.builder";
import {Shape} from "./shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";
import {ArgType} from "../model/blockarg.model";


export abstract class BaseShape implements Shape {
    id: string;
    spec: SpecModel;

    group: Snap.Element; // svg group
    arg: BlockBaseModel;

    /* dimensio attributes */
    x: number = 0;
    y: number = 0;
    w: number = 100;
    topH: number = 25;  // this is the height of the top bar.  most shape only have top bar but things like loops are more complex
    indentTop: number = 0;
    centerY: number;
    h: number;


    draggable: boolean;

    constructor(spec: SpecModel, arg: BlockBaseModel, group: Snap.Element) {
        this.spec = spec;
        this.id = this.spec.category.name + "_" + spec.code.replace(new RegExp(":", "g"), "_");
        this.arg = arg;
        this.group = group;
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
//        this.group = Graphics.ScriptPane.group(this.id, this.x, this.y);
        this.group.transform("t" + x + "," + y);

    }

    getGroup(): any {
      return this.group;
    }

    setGroup(group: Snap.Element) {
      this.group = group;
    }

    newGroup(parentGroup: Snap.Element, x: number, y: number) {
      this.group = Graphics.ScriptPane.group(this.id, x, y);
      parentGroup.append(this.group);
    }

    drawHeader(args: BlockBaseModel[]) {

        let x = 5;
        let y = this.indentTop;
        for (let arg of args) {
          arg.drawBlock(this.group, x, y);

  //        if (arg instanceof BlockArgModel) {
              // arg.shape.draw(this.group);
    //      } else {
//            ScriptLayout.drawBlock(<BlockModel> arg, this.group, x, y);
      //    }
          x = arg.shape.getBBox().w + 10;
        }

        this.w = x;
    }

    draw(x: number, y: number) {
      this.x = x;
      this.y = y;
      if (this.draggable) {
        this.makeDraggable();
        this.group.addClass("draggable");
      }
      // if (parentGroup) {
      //   parentGroup.append(this.group);
      // }
    }

    setWidthAndTopHeight(w: number, h: number) {
      this.w = w;
      this.h = w;
    }

    setColor(color: any) {

    }

    setDraggable(draggable: boolean) {
      this.draggable = draggable;

    }

    getBBox(): Snap.BBox {
        return this.group.getBBox();
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
