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

    group(id, x: number, y: number, isDraggable: boolean = false, groupClass?: string): any {
        this.checkPaperReady();
        let group = this.paper.group();

        if (isDraggable) {
          group.addClass("draggable");
          this.makeDraggable(group);
        }

        if (groupClass) {
          group.addClass(groupClass);
        }

        if (id) {
            group.attr({
                id: id,
                transform: "translate(" + x + "," + y + ")"
            });
        }
        return group;
    }




    drawRect(x: number, y: number, width: number, height: number, categoryClass?: string): Snap.Element {

        let r = this.paper.rect(x, y, width, height);

        if (categoryClass) {
            r.addClass(categoryClass);
        }

        return r;
    }

    drawText(x: number, y: number, text: string, textClasss?: string): any {
        let t = this.paper.text(x, y, text);

        if (textClasss) {
            t.addClass(textClasss);
        }

        return t;
    }

    drawPath(path: string, pathClass?: string): any {
        let p = this.paper.path(path);

        if (pathClass) {
            p.addClass(pathClass);
        }

        return p;
    }

    private makeDraggable(snapSvgElemennt) {

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

        snapSvgElemennt.drag(move, start, stop);

    }

}