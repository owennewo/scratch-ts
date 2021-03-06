import {StageModel, ProjectInfoModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {SpriteModel} from "../model/sprite.model";
import {ProjectDetailModel} from "../model/project.detail.model";
import {ScriptModel} from "../model/script.model";
import {SoundModel} from "../model/sound.model";
import {CostumeModel} from "../model/costume.model";
import {BlockModel} from "../model/block.model";
import {Graphics} from "../utils/graphics";

import {BlockIOService} from "./block.io.service";

export class ProjectIOService {


    readProjectDetail(jsonInfo: any): ProjectDetailModel {

        let detail = new ProjectDetailModel();

        detail.creator.username = jsonInfo.creator.username;
        detail.creator.userprofile.bio = jsonInfo.creator.userprofile.bio;
        detail.creator.userprofile.status = jsonInfo.creator.userprofile.status;
        detail.creator.userprofile.country = jsonInfo.creator.userprofile.country;
        detail.dateTimeShared = jsonInfo.datetime_shared;
        detail.description = jsonInfo.description;
        detail.favoriteCount = jsonInfo.favorite_count;
        detail.id = jsonInfo.id;
        detail.loveCount = jsonInfo.love_count;
        detail.resourceUri = jsonInfo.resource_uri;
        detail.thumbnail = jsonInfo.thumbnail;
        detail.title = jsonInfo.title;
        detail.viewCount = jsonInfo.view_count;

        console.log("todo display project info:" + detail.title);
        return detail;

    }

    readProject(jsonStage: any, projectID: string): StageModel {

        let stage: StageModel = new StageModel();

        this.readObject(stage, stage, jsonStage);
        stage.tempo = jsonStage.tempoBPM;
        stage.videoAlpha = jsonStage.videoAlpha;


        stage.children = this.readSprites(jsonStage.children, stage);
        stage.info = this.readProjectInfo(jsonStage.info);
        stage.id = projectID;

        return stage;
    }

    readObject(stage: StageModel, object: ObjectModel, jsonProject: any) {
        object.name = jsonProject.objName;
        object.scripts = this.readScripts(jsonProject.scripts);
        object.sounds = this.readSounds(jsonProject.sounds, stage);
        object.costumes = this.readCostumes(jsonProject.costumes);
        object.currentCostumeIndex = jsonProject.currentCostumeIndex;
    }

    /** SPRITES READ */
    readSprites(jsonSprites, stage: StageModel): SpriteModel[] {
        let sprites: SpriteModel[] = [];
        for (let jsonSprite of jsonSprites) {
          if (!jsonSprite.objName) {
            console.log("warning: child is not a sprite! (probably target)");
            continue;
          }

            let sprite: SpriteModel = new SpriteModel(stage);
            this.readObject(stage, sprite, jsonSprite);
            sprite.x = jsonSprite.scratchX;
            sprite.y = jsonSprite.scratchY;
            sprite.scale = jsonSprite.scale;
            sprite.direction = jsonSprite.direction;
            sprite.rotationStyle = jsonSprite.rotationStyle;
            sprite.isDraggable = jsonSprite.isDraggable;
            sprite.indexInLibrary = jsonSprite.indexInLibrary;
            sprite.visible = jsonSprite.visible;
            sprite.info = jsonSprite.spriteInfo;

            sprites.push(sprite);
        }
        return sprites;
    }

    /** SCRIPT READ */
    readScripts(jsonScripts): ScriptModel[] {
        let scripts: ScriptModel[] = [];
        let index = 0;
        if (!jsonScripts) return scripts;
        for (let jsonScript of jsonScripts) {
            let script: ScriptModel = new ScriptModel();
            script.index = index;
            script.x = jsonScript[0];
            script.y = jsonScript[1];
            script.index = index;
            script.firstBlock = BlockIOService.arrayToStack(jsonScript[2]);
            scripts.push(script);
            index++;
        }
        return scripts;
    }


    /** SOUND READ */
    readSounds(jsonSounds, stage: StageModel): SoundModel[] {
        let sounds: SoundModel[] = [];
        if (!jsonSounds) return sounds;
        for (let jsonSound of jsonSounds) {
            let sound: SoundModel = new SoundModel(stage);
            sound.id = jsonSound.soundID;
            sound.name = jsonSound.soundName;
            sound.md5 = jsonSound.md5;
            sound.sampleCount = jsonSound.sampleCount;
            sound.rate = jsonSound.rate;
            sound.format = jsonSound.format;
            sounds.push(sound);
        }
        return sounds;
    }

    /** SOUND READ */
    readCostumes(jsonCostumes): CostumeModel[] {
        let costumes: CostumeModel[] = [];
        if (!jsonCostumes) return costumes;
        for (let jsonCostume of jsonCostumes) {
            let costume: CostumeModel = new CostumeModel();
            costume.id = jsonCostume.baseLayerID;
            costume.name = jsonCostume.costumeName;
            costume.md5 = jsonCostume.baseLayerMD5;
            costume.resolution = jsonCostume.bitmapResolution;
            costume.centerX = jsonCostume.rotationCenterX;
            costume.centerY = jsonCostume.rotationCenterY;
            costumes.push(costume);
        }
        return costumes;
    }

    /** PROJECT INFO READ */
    readProjectInfo(jsonInfo): ProjectInfoModel {
        let info: ProjectInfoModel = new ProjectInfoModel();
        info.id = jsonInfo.projectID;
        info.flashVersion = jsonInfo.flashVersion;
        info.hasCloudData = jsonInfo.hasCloudData;
        info.scriptCount = jsonInfo.scriptCount;
        info.videoOn = jsonInfo.videoOn;
        info.scratchVersion = jsonInfo.swfVersion;
        info.spriteCount = jsonInfo.spriteCount;
        info.userAgent = jsonInfo.userAgent;
        return info;
    }

}
