import {StageModel} from "./stage.model";
import {SpriteRuntime} from "../runtime/sprite.runtime";
import {ObjectModel} from "./object.model";

export class SpriteModel extends ObjectModel {
    stage: StageModel;
    x: number; // scratchX
    y: number; // scratchY
    scale: number;
    direction: number;
    rotationStyle: string;
    isDraggable: boolean;
    indexInLibrary: number;
    visible: boolean;
    info: SpriteInfoModel;  // spriteInfo
    videomotion = {};
    parent: StageModel;
    runtime: SpriteRuntime;

    constructor(stage: StageModel) {
      super();
      this.stage = stage;
      this.runtime = new SpriteRuntime(this);
    }

    setRotationStyle(style: string) {
        this.rotationStyle = style;
    }




}

export class SpriteInfoModel {

}
