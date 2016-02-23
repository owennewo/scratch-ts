import {ObjectModel} from "./object.model";

export class SpriteModel extends ObjectModel {
    x: number; // scratchX
    y: number; // scratchY
    scale: number;
    direction: number;
    rotationStyle: string;
    isDraggable: boolean;
    indexInLibrary: number;
    visible: boolean;
    info: SpriteInfoModel;  // spriteInfo
}

export class SpriteInfoModel {

}
