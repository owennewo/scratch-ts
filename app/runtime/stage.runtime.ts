import {ObjectRuntime} from "./object.runtime";
import {SpriteModel} from "../model/sprite.model";

export class StageRuntime extends ObjectRuntime {

penActivity: boolean = false;

  step() {
    console.log("todo: StageRuntime step");
  }

  countdown(count: number) {
    console.log("todo: StageRuntime countdown");
  }

  deleteClones() {
    console.log("todo: deleteClones");
  }

  clearFilters() {
    console.log("todo: clear filters");
  }

  commitPenStrokes() {
    console.log("todo: commit pen strokes");
  }

  clearPenStrokes()  {
    console.log("todo: clear pen strokes");
  }

  mouseX(): number {
    console.log("todo: get mousex");
    return -1;
  }

  mouseY(): number {
    console.log("todo: getMouseY");
    return -1;
  }

  stampSprite(sprite: SpriteModel, alpha: number) {
    console.log("todo: stampSprite");
  }



}
