import {Geometry} from "../shapes/geometry";
import {Color} from "../utils/color";

export class Graphics {
    static ScriptPane = new Graphics("#svg-script-pane");

    id: string;
    paper: any;
//    color: string;
    // path: string = "";


    constructor(id: string) {
      this.id = id;
    }

    checkPaperReady()
    {
        if (!this.paper)
        {
           // lazy init
           this.paper = Snap(this.id);
        }
    }

    group(id, x: number, y: number, isDraggable: boolean = false): any {
        this.checkPaperReady();
        let group = this.paper.group();

        this.makeDraggable(group);

        if (id) {
            group.attr({
                id: id,
                transform: "translate(" + x + "," + y + ")"
            });
        }
        return group;
    }

    private makeDraggable(snapSvgElemennt) {

        let move = function(dx, dy) {
            this.attr({
                transform: this.data("origTransform") + (this.data("origTransform") ? "T" : "t") + [dx, dy]
            });
        }

        let start = function() {
            this.data("origTransform", this.transform().local);
        }
        let stop = function(mouseEvent) {

            console.log("finished dragging: " + this.getBBox().x + ":" + this.getBBox().y);
        }

        snapSvgElemennt.drag(move, start, stop)


}





    // clear(): GraphicsBuilder {
    //     this.path = "";
    //
    //     return this;
    // }

    // endFill(): GraphicsBuilder {
    //     let p = this.paper.path(this.path);
    //     if (this.color) {
    //         p.attr("fill", this.color);
    //     }
    //     this.group.add(p);
    //     return this;
    // }

    drawRect(x: number, y: number, width: number, height: number, color: string): any {
        if (!x) x = 5;
        if (!y) y = 5;
        if (!width) width = 5;
        if (!height) height = 5;
        // this.moveTo(x, y);
        // this.lineTo(x + width, y);
        // this.lineTo(x + width, y + height);
        // this.lineTo(x, y + height);
        // this.lineTo(x, y);
        let rect = this.paper.rect(x, y, width, height);
        rect.attr({
            fill: color
        });
        // this.group.add(rect);
        return rect;
    }

    drawText(x: number, y: number, text: string, color: string): any {
        let t = this.paper.text(x, y, text);
        t.attr({
            fill: color
        });
        return t;
    }

    drawPath(path: string, color: string): any {
        let p = this.paper.path(path);
        p.attr({
            fill: color
        });
        return p;
    }

/*

    lineStyle(thickness?: number, color?: string, alpha?: number, pixelHinting?: boolean): GraphicsBuilder {
        console.log("todo: Graphics");
        return this;
    }

    beginFill(color: string, alpha?: number): GraphicsBuilder {
        this.color = color;
        return this;
    }
*/


}
