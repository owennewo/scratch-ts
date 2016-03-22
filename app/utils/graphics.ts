import {ReadStream} from "./read.stream";
/// <reference path="../definitelytyped/snapsvg.d.ts" />

import {Geometry} from "../shapes/geometry";
import {Color} from "../utils/color";


export class Graphics {
    static ScriptPane = new Graphics("#svg-script-pane");

    id: string;
    paper: Snap.Paper;
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

}
