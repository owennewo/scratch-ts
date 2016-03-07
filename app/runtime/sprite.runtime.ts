import {BlockModel} from "../model/block.model";
import {ObjectRuntime} from "./object.runtime";
import {Rectangle} from "../shapes/geometry";

export class SpriteRuntime extends ObjectRuntime {

    x: number;
    y: number;
    scaleX: number;
    svg: Snap.Element;
    direction: number;
    size: number;
    penIsDown: boolean = false;
    penColorCache: number;
    penWidth: number;
    penColor: number;
    penHue: number;
    penShade: number;
    bubble: any;
    bubbleSource: any;

    clearFilters() {
        console.log("todo: SpriteRuntime clearFilters");
    }

    showBubble(text: string, type: string, block: BlockModel) {
      console.log("todo: Sprite runtime show bubble");
    }

    hideBubble() {
        console.log("todo: SpriteRuntime hasBubbles");
    }

    updateBubble() {
      console.log("todo: SpriteRuntime updateBubbles");
    }

    setPenColor(color: number) {
        this.penColor = color;
    }

    setPenHue(color: number) {
        this.penHue = color;
    }

    setPenShade(color: number) {
        this.penShade = color;
    }

    setXY(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    setPenSize(size: number) {
        this.size = size;
    }

    keepOnStage() {
        console.log("todo: keep on stage");
    }

    setDirection(direction: number) {
        this.direction = direction;
    }

    bounds(): Rectangle {
        return Rectangle.fromBBox(this.svg.getBBox());
    }

    getSize(): number {
      console.log("todo getSize spriteruntime");
      return this.size;
    }

    setSize(size: number) {
      console.log("todo getSize spriteruntime");
      this.size = size;
    }

}
