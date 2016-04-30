import {SpriteModel} from "../model/sprite.model";
import {Graphics} from "../utils/graphics";

export class TalkBubble {

    public pointsLeft: boolean;

    private type: string; // 'say' or 'think'
    private style: string; // 'say' or 'ask' or 'result'
    private outlineColor: number = 0xA0A0A0;
    private radius: number = 8;  // corner radius
    private padding: number = 5;
    private minWidth: number = 55;
    private lastXY: any[];
    private pInset1: number = 16;
    private pInset2: number = 50;
    private pDrop: number = 17;
    private pDropX: number = 8;
    private lineWidth: number = 3;
    private text: string;
    private svg: Snap.Element;

    constructor(sprite: SpriteModel, text: string, type: string, style: string) {
        this.type = type;
        this.style = style;
        let id = "bubble-" + sprite.name;
        if (!this.svg) this.svg = Graphics.StagePane.group(id, sprite.x, sprite.y - 40, "bubble");
        if (style === "ask") {
            this.outlineColor = 0x4AADDE;
        } else if (style === "result") {
            this.outlineColor = 0x888888;
            this.minWidth = 16;
            this.padding = 3;
            this.radius = 5;
            this.pInset1 = 8;
            this.pInset2 = 16;
            this.pDrop = 5;
            this.pDropX = 4;
            this.lineWidth = 0.5;
        }
        this.pointsLeft = true;
        this.setText(text);
    }

    public setDirection(dir: string): void {
        // set direction of balloon tail to 'left' or 'right'
        // and redraw balloon if necessary
        let newValue: boolean = (dir === "left");
        if (this.pointsLeft === newValue) return;
        this.pointsLeft = newValue;
        let box = this.svg.getBBox();
        this.setWidthHeight(box.width + this.padding * 2, box.height + this.padding * 2);
    }

    public getText(): string { return this.text; }

    private setText(s: string): void {
        let desiredWidth: number = 135;
        // this.text.width = desiredWidth + 100; // wider than desiredWidth
        //

        let text = Graphics.StagePane.drawText(0, 0, s);

        text.attr({
            y: text.getBBox().h + 2,
            x: 10
          });

        let box = text.getBBox();

        this.text = s;
        let bestWidth = Math.max(this.minWidth, Math.min(box.w + 8, desiredWidth)); // fix word wrap

        this.setWidthHeight(bestWidth + this.padding * 2, box.height + this.padding * 2);
        this.svg.append(text);
    }

    private setWidthHeight(w: number, h: number): void {
        if (this.type === "think") this.drawThink(w, h);
        else this.drawTalk(w, h);
    }

    private drawTalk(w: number, h: number): void {
        let insetW: number = w - this.radius;
        let insetH: number = h - this.radius;

        let path = "M" + this.radius + " 0";
        path = path + "L" + insetW + " 0";
        path = path + "T" + w + " " + this.radius;
        path = path + "L" + w + " " + insetH;
        path = path + "T" + insetW + " " + h;
        if (this.pointsLeft) {
            path = path + "L" + this.pInset2 + " " + h;
            path = path + "L" + this.pDropX + " " + h + this.pDrop;
            path = path + "L" + this.pInset1 + " " + h;
        } else {
            path = path + "L" + (w - this.pInset1) + " " + h;
            path = path + "L" + (w - this.pDropX) + " " + h + this.pDrop;
            path = path + "L" + (w - this.pInset2) + " " + h;
        }
        path = path + "L" + this.radius + " " + h;
        path = path + "T" + 0 + " " + insetH;
        path = path + "L" + 0 + " " + this.radius;
        path = path + "T" + this.radius + " " + 0;
        let svgPath = Graphics.StagePane.drawPath(path);
        this.svg.append(svgPath);
    }

    private drawThink(w: number, h: number): void {
        let insetW: number = w - this.radius;
        let insetH: number = h - this.radius;
        let svgGroup = Graphics.StagePane.group("bubble", 0, 0);

        let path = "M" + this.radius + " 0";
        path = path + "L" + insetW + " 0";
        path = path + "T" + w + " " + this.radius;
        path = path + "L" + w + " " + insetH;
        path = path + "T" + insetW + " " + h;

        path = path + "L" + this.radius + " " + h;
        path = path + "T0 " + insetH;
        path = path + "L0 " + this.radius;
        path = path + "T" + this.radius + " 0";


        if (this.pointsLeft) {
            svgGroup.append(Graphics.StagePane.drawEllipse(16, h + 2, 12, 7, 2));
            svgGroup.append(Graphics.StagePane.drawEllipse(12, h + 10, 8, 5, 2));
            svgGroup.append(Graphics.StagePane.drawEllipse(6, h + 15, 6, 4, 1));
        } else {
            svgGroup.append(Graphics.StagePane.drawEllipse(w - 29, h + 2, 12, 7, 2));
            svgGroup.append(Graphics.StagePane.drawEllipse(w - 20, h + 10, 8, 5, 2));
            svgGroup.append(Graphics.StagePane.drawEllipse(w - 12, h + 15, 6, 4, 1));
        }
    }

}
