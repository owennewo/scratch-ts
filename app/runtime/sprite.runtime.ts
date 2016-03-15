import {SpriteModel} from "../model/sprite.model";
import {CostumeModel} from "../model/costume.model";
import {BlockModel} from "../model/block.model";
import {ObjectRuntime} from "./object.runtime";
import {Rectangle} from "../shapes/geometry";

export class SpriteRuntime extends ObjectRuntime {

    x: number = 0;
    y: number = 0;
    w: number = 30;
    h: number = 30;
    scaleX: number;
    sprite: SpriteModel;
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

    constructor(sprite: SpriteModel) {
      super();
      this.sprite = sprite;
    }

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

    redraw() {
      let s = this.sprite;
      // let trans = "translate(" + s.x + "," + s.y + ") rotate(" + s.direction + " " + s.x + " " + s.y + ") scale(" + s.scale + ")";
      let trans = "translate(" + s.x + "," + (-s.y) + ") rotate(" + (s.direction - 90) + ") scale(" + s.scale + ")";
      s.runtime.svg.transform(trans);
      // s.runtime.svg.transform("translate(" + s.direction + "deg)");
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
      let rect = this.bounds();
      if (rect.width > rect.height) return rect.width;
      else return rect.height;
    }

    setSize(size: number) {
      console.log("todo getSize spriteruntime");
      this.size = size;
    }

    showCostume(costume: CostumeModel) {
      if (!this.svg) {
        let backgroundUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/" + costume.md5 + "/get/";
        this.svg = this.sprite.stage.runtime.svg.group();
        Snap.load(backgroundUrl, function ( loadedFragment ) {
                                                this.svg.append( loadedFragment );
                                        }, this );
      }
      console.log("show costume");
      this.redraw();
    }

}
