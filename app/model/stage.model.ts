import {StageRuntime} from "../runtime/stage.runtime";
import {SpriteModel} from "./sprite.model";
import {ObjectModel} from "./object.model";

export class StageModel extends ObjectModel {

    static STAGEW = 480;
    static STAGEH = 360;
    svg: Snap.Paper;
    tempo: number; // tempoBPM
    videoAlpha: number;
    children: SpriteModel[];
    info: ProjectInfoModel;  // info
    runtime: StageRuntime;

    constructor() {
      super();
      this.runtime = new StageRuntime(this);
    }

    duplicate(): StageModel {
        let duplicate: StageModel = new StageModel();
        duplicate.tempo = this.tempo;
        duplicate.videoAlpha = this.videoAlpha;
        return duplicate;
    }

    spriteNamed(spriteName: string): SpriteModel  {
      for (let sprite of this.children) {
        if (sprite.name === spriteName) return sprite;
      }
      console.error("can't find sprite: " + spriteName);
    }

    spritesAndClonesNamed(spriteName): SpriteModel[] {
      // todo check for clones
      let sprites = [];
      let sprite = this.spriteNamed(spriteName);
      if (sprite) sprites.push(sprite);
      return sprites;
    }

    objNamed(objectName: string): ObjectModel {
      let obj = this.spriteNamed(objectName);
      if (obj !== null) {
        return obj;
      } else {
        console.log ("todo: objNamed should look for other object types");
        return null;
      }
    }

}

export class PenModel {
    id: number; // penLayerID
    md5: string; // penLayerMD5
}

export class ProjectInfoModel {
    id: string; // projectID`
    flashVersion: string;
    hasCloudData: boolean;
    scriptCount: number;
    videoOn: boolean;
    scratchVersion: number; // swfVersion
    spriteCount: number;
    userAgent: string;
}
