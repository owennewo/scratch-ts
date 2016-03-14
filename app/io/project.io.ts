import {StageModel, ProjectInfoModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {SpriteModel} from "../model/sprite.model";
import {ScriptModel} from "../model/script.model";
import {SoundModel} from "../model/sound.model";
import {CostumeModel} from "../model/costume.model";
import {BlockModel} from "../model/block.model";
import {Graphics} from "../utils/graphics";

import {BlockIO} from "./block.io";

export class ProjectIO {

    readProject(jsonStage: any): StageModel {

        let stage: StageModel = new StageModel();

        this.readObject(stage, jsonStage);
        stage.tempo = jsonStage.tempoBPM;
        stage.videoAlpha = jsonStage.videoAlpha;


        stage.children = this.readSprites(jsonStage.children, stage);
        stage.info = this.readProjectInfo(jsonStage.info);

        return stage;
    }

    readObject(object: ObjectModel, jsonProject: any) {
        object.name = jsonProject.objName;
        object.scripts = this.readScripts(jsonProject.scripts);
        object.sounds = this.readSounds(jsonProject.sounds);
        object.costumes = this.readCostumes(jsonProject.costumes);
        object.currentCostume = object.costumes[jsonProject.currentCostumeIndex];
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
            this.readObject(sprite, jsonSprite);
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
            script.firstBlock = BlockIO.arrayToStack(jsonScript[2]);
            scripts.push(script);
            index++;
        }
        return scripts;
    }


    /** SOUND READ */
    readSounds(jsonSounds): SoundModel[] {
        let sounds: SoundModel[] = [];
        if (!jsonSounds) return sounds;
        for (let jsonSound of jsonSounds) {
            let sound: SoundModel = new SoundModel();
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
