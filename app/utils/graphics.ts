import {ScriptModel} from "../model/script.model";
import {Shape} from "../shapes/shape";
import {BlockModel} from "../model/block.model";
/// <reference path="../definitelytyped/snapsvg.d.ts" />

import {BaseShape} from "../shapes/base.shape";
import {ReadStream} from "./read.stream";
import {Geometry} from "../shapes/geometry";
import {Color} from "../utils/color";


export class Graphics {
    static ScriptPane = new Graphics("#svg-script-pane");

    id: string;
    paper: Snap.Paper;
    onDragOverCallback: Function;
    onDragEndCallback: Function;
    //    color: string;
    // path: string = "";


    constructor(id: string) {
        this.id = id;
    }

    checkPaperReady() {
        if (!this.paper) {
            // lazy init
            this.paper = Snap(this.id);
        }
    }

    group(id, x: number, y: number, groupClass?: string): any {
        this.checkPaperReady();
        let group = this.paper.group();

        if (groupClass) {
          group.addClass(groupClass);
        }

        if (id) {
            group.attr({
                id: id,
                transform: "translate(" + x + "," + y + ")"
            });
        } else {
          group.attr({
              transform: "translate(" + x + "," + y + ")"
          });
        }

        return group;
    }

    remove(selector: string) {
      let elem = this.paper.select(selector);
      if (elem) elem.remove();
    }

    has(selector: string): boolean {
      this.checkPaperReady();
      let elem = this.paper.select(selector);
      if (elem) return true;
      return false;
    }

    drawRect(x: number, y: number, width: number, height: number, rx: number, ry: number, categoryClass?: string): Snap.Element {

        let r = this.paper.rect(x, y, width, height, rx, ry);

        if (categoryClass) {
            r.addClass(categoryClass);
        }

        return r;
    }

    drawDropDown(x: number, y: number, width: number, height: number, rx: number, ry: number, text: string): Snap.Element {

        // let r = this.paper.rect(x, y, width, height, rx, ry);
        let textBox = this.paper.text(x, y, text + "[v]");

        textBox.attr({y: textBox.getBBox().h});


        return textBox;
    }

    drawText(x: number, y: number, text: string, textClass?: string): Snap.Element {

        let result = this.paper.text(x, y, text);
        if (textClass) {
            result.addClass(textClass);
        }

        return result;
    }

    drawPath(path: string, pathClass?: string): any {
        let p = this.paper.path(path);

        if (pathClass) {
            p.addClass(pathClass);
        }

        return p;
    }

    makeDraggable(group: Snap.Element) {
      let move = function(dx, dy, mouseX, mouseY) {

          group.attr({
              transform: group.data("origTransform") + (group.data("origTransform") ? "T" : "t") + [dx, dy]
          });
          let targetElement = Snap.getElementByPoint(mouseX, mouseY);

          this.onDragOverCallback(group, targetElement);

      };

      let start = function() {
          group.data("origTransform", group.transform().local);
      };
      let stop = function(mouseEvent) {
          this.onDragEndCallback(group);
          console.log("finished dragging: " + group.getBBox().x + ":" + group.getBBox().y);
      };

      group.drag(move, start, stop, this, this, this);
    }


}
