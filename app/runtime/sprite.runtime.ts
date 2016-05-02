import {TalkBubble} from "../utils/talk.bubble";
import {StageRuntime} from "./stage.runtime";
import {StageModel} from "../model/stage.model";
import {SpriteModel} from "../model/sprite.model";
import {CostumeModel} from "../model/costume.model";
import {BlockModel} from "../model/block.model";
import {ObjectRuntime} from "./object.runtime";
import {Rectangle} from "../shapes/geometry";

export class SpriteRuntime extends ObjectRuntime {

    scaleX: number;
    sprite: SpriteModel;
    direction: number;
    size: number;
    penIsDown: boolean = false;
    penColorCache: number;
    penWidth: number = 3;
    penColor: any = Snap.hsl2rgb(this.penHue * 2, 100, 50);
    penHue: number = 120;
    penShade: number;
    bubble: any;
    bubbleSource: any;
    lastScale: number;
    lastSpriteBox: Snap.BBox;
    instrument: number = 1;

    constructor(sprite: SpriteModel, stage: StageRuntime) {
        super(stage.paper);
        this.sprite = sprite;
    }

    clearFilters() {
        console.log("todo: SpriteRuntime clearFilters");
    }

    showBubble(text: string, type: string, block: BlockModel) {
        if (!this.bubble) {
            this.bubble = new TalkBubble(this.sprite, text, "say", "say");
        }
        this.bubbleSource = block;
        // this.bubble
        console.log("todo: Sprite runtime show bubble");
    }

    hideBubble() {
        let bubbleSvg = Snap.select("#bubble-" + this.sprite.name);
        if (bubbleSvg) {
            bubbleSvg.remove();
            this.bubble = undefined;
        }
        console.log("todo: SpriteRuntime hasBubbles");
    }

    updateBubble() {
        console.log("todo: SpriteRuntime updateBubbles");
    }

    setPenColor(color: number) {
        this.penColor = color;
        console.log("color set to:" + color);
    }

    setPenHue(color: number) {
        this.penHue = color;
        if (this.penHue > 360) this.penHue = this.penHue - 360;
        if (this.penHue < 0) this.penHue = this.penHue + 360;
        this.penColor = Snap.hsl2rgb(this.penHue * 2, 100, 50);

    }

    setPenShade(color: number) {
        this.penShade = color;
    }

    redraw() {
        let s = this.sprite;

        if (this.lastScale !== s.scale) {
            // removing the transform in order to get an accurate bbox width/height.  Is there a better way?
            s.runtime.svg.transform("rotate(0)");
            let spriteBox = this.svg.getBBox();
            this.lastSpriteBox = spriteBox;
            this.lastScale = s.scale;
        }

        let x = Math.floor(this.sprite.x - (this.lastSpriteBox.w / 2) - ((this.lastSpriteBox.h / 2) * (s.scale - 1)));
        let y = Math.floor(-(this.sprite.y + (this.lastSpriteBox.h / 2)) - ((this.lastSpriteBox.w / 2) * (s.scale - 1)));  // scratch y coordinate system is upside down compared to svg hence the negation

        let trans = "rotate(" + (s.direction - 90) + " " + this.sprite.x + " " + (-this.sprite.y) + ") translate(" + x + "," + y + ") scale(" + s.scale + ")";
        s.runtime.svg.transform(trans);

    }

    setPenSize(size: number) {
        this.size = size;
    }

    keepOnStage() {
        let box = this.svg.getBBox();

        if (box.x > ((StageModel.STAGEW / 2) - 20)) this.sprite.x = (StageModel.STAGEW / 2) - 20;
        if (box.x2 < ((-StageModel.STAGEW / 2) + 20)) this.sprite.x = (-StageModel.STAGEW / 2) + 20;

        // y maths is odd as y coordinates between scratch and svg is flipped
        if (box.y > ((StageModel.STAGEH / 2) - 20)) this.sprite.y = (-StageModel.STAGEH / 2) + 20;
        if (box.y2 < ((-StageModel.STAGEH / 2) + 20)) this.sprite.y = (StageModel.STAGEH / 2) - 20;

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

    type(): string {
      return "sprite";
    }

    isTouching(other: SpriteRuntime) {
        let box1 = this.svg.getBBox();
        let box2 = other.svg.getBBox();
        // this is a rough approximation to check if touching.  Not sure if its good enough, but there is no simple alternative
        return Snap.path.isPointInsideBBox(box1, box2.cx, box2.cy) || Snap.path.isPointInsideBBox(box2, box1.cx, box1.cy);
    }

    placeCostume(costume: CostumeModel, element: Snap.Element) {
        if (!this.svg) {
            this.svg = this.paper.group();
            this.svg.attr({
                id: this.type() + "-" + costume.name
            });
        }
        this.svg.clear();
        this.svg.append(element);
    }

}
