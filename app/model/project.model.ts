import {SpriteModel} from "./sprite.model";
import {ObjectModel} from "./object.model";

export class ProjectModel extends ObjectModel {
    tempo: number; // tempoBPM
    videoAlpha: number;
    children: SpriteModel[];
    info: ProjectInfoModel;  // info

    duplicate(): ProjectModel {
        let duplicate: ProjectModel = new ProjectModel();
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
