import {ScriptModel} from "../model/script.model";
import {Shape} from "../shapes/shape";
import {BlockModel} from "../model/block.model";
/// <reference path="../definitelytyped/snapsvg.d.ts" />

import {BaseShape} from "../shapes/base.shape";
import {ReadStream} from "./read.stream";
import {Geometry} from "../shapes/geometry";

export class Graphics {
    static ScriptPane = new Graphics("#svg-script-pane");
    static StagePane = new Graphics("#svg-stage");

    id: string;
    paper: Snap.Paper;
    onDragOverCallback: Function;
    onDragEndCallback: Function;

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

    drawEllipse(x: number, y: number, rx: number, ry: number, lineWidth: number, categoryClass?: string): Snap.Element {

        let e = this.paper.ellipse(x, y, rx, ry);

        if (categoryClass) {
            e.addClass(categoryClass);
        }

        return e;
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

    drawStroke(oldX: number, oldY: number, newX: number, newY: number, color: any, width: number) {
        let strokeGroup = Snap.select("#stroke-group");
        if (!strokeGroup) strokeGroup = this.group("stroke-group", 0, 0, "");
        let path = this.drawPath("M" + oldX + "," + (-oldY) + "L" + newX + "," + (-newY));
        path.attr({
            style: "stroke: " + color.hex + "; stroke-width:" + width
        });
        strokeGroup.append(path);
        let stageBackground = Snap.select("#stage-background");
        if (stageBackground) {
            strokeGroup.insertAfter(stageBackground);
        }

    }

    clearStrokes() {
        let strokeGroup = Snap.select("#stroke-group");
        if (strokeGroup) strokeGroup.remove();
    }

    clearAll() {
        this.checkPaperReady();
        if (this.paper) {
            this.paper.clear();
        }
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
