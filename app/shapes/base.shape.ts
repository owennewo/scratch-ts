import {VisibleModel} from "../model/visible.model";
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
    indentLeft: number = 5;
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
        this.group.transform("t" + x + "," + y);

    }

    getGroup(): any {
      return this.group;
    }

    setGroup(group: Snap.Element) {
      this.group = group;
    }

    newGroup(parentGroup: Snap.Element, x: number, y: number, vis: VisibleModel) {
      this.group = Graphics.ScriptPane.group(this.id, x, y);
      this.group.data("model", vis);
      parentGroup.append(this.group);
    }

    drawHeader(args: BlockBaseModel[]) {

        let x = this.indentLeft;
        let y = this.indentTop;
        for (let arg of args) {
          arg.drawBlock(this.group, x, y);

          x = arg.shape.getBBox().w + this.indentLeft + 5;
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
      this.group.data("spec", this.spec);
      this.group.data("shape", this);
      Graphics.ScriptPane.makeDraggable(this.group);
    }

}
