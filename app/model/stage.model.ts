import {StageRuntime} from "../runtime/stage.runtime";
import {SpriteModel} from "./sprite.model";
import {ObjectModel} from "./object.model";

export class StageModel extends ObjectModel {
    tempo: number; // tempoBPM
    videoAlpha: number;
    children: SpriteModel[];
    info: ProjectInfoModel;  // info
    runtime = new StageRuntime();

    duplicate(): StageModel {
        let duplicate: StageModel = new StageModel();
        duplicate.tempo = this.tempo;
        duplicate.videoAlpha = this.videoAlpha;
        return duplicate;
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
