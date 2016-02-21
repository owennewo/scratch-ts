import {ProjectModel, ProjectInfoModel} from '../model/project.model'
import {ObjectModel} from '../model/object.model'
import {SpriteModel} from '../model/sprite.model'
import {ScriptModel} from '../model/script.model'
import {SoundModel} from '../model/sound.model'
import {CostumeModel} from '../model/costume.model'
import {BlockModel} from '../model/block.model'
import {Graphics} from '../utils/graphics'

import {BlockIO} from './block.io'

export class ProjectIO
{
	readProject(jsonProject:any): ProjectModel
	{
        
        
        
		var project:ProjectModel = new ProjectModel();
		
		this.readObject(project, jsonProject);
		project.tempo = jsonProject.tempoBPM;
		project.videoAlpha = jsonProject.videoAlpha;
		 
	
		project.children = this.readSprites(jsonProject.children);
		project.info = this.readProjectInfo(jsonProject.info);

		return project;		
	}
	
	readObject(object:ObjectModel, jsonProject: any)
	{
		object.name = jsonProject.objName;
		object.scripts = this.readScripts(jsonProject.scripts);
		object.sounds = this.readSounds(jsonProject.sounds);
		object.costumes = this.readCostumes(jsonProject.costumes);
		object.currentCostume = object.costumes[jsonProject.currentCostumeIndex];
	}

	/** SPRITES READ */
	readSprites(jsonSprites): SpriteModel[]
	{
		var sprites: SpriteModel[] = [];
		for (var jsonSprite of jsonSprites)
		{
			var sprite: SpriteModel = new SpriteModel();
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
	readScripts(jsonScripts): ScriptModel[]
	{
		var scripts: ScriptModel[] = [];
        if (!jsonScripts) return scripts;
		for (var jsonScript of jsonScripts)
		{
			var script: ScriptModel = new ScriptModel();
			script.x = jsonScript[0];
			script.y = jsonScript[1];
			script.firstBlock = BlockIO.arrayToStack(jsonScript[2]);
			scripts.push(script);
		}
		return scripts;
	}
	
	
	/** SOUND READ */
	readSounds(jsonSounds): SoundModel[]
	{
		var sounds: SoundModel[] = [];
        if (!jsonSounds) return sounds;
		for (var jsonSound of jsonSounds)
		{
			var sound: SoundModel = new SoundModel();
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
	readCostumes(jsonCostumes): CostumeModel[]
	{
		var costumes: CostumeModel[] = [];
        if (!jsonCostumes) return costumes;
		for (var jsonCostume of jsonCostumes)
		{
			var costume: CostumeModel = new CostumeModel();
			costume.id = jsonCostume.baseLayerID;
			costume.name = jsonCostume.costumeName;
			costume.md5 = jsonCostume.baseLayerMD5;
			costume.resolution = jsonCostume.bitmapResolution;
			costume.centerX = jsonCostume.rotationCenterX;
			costume.centerY = jsonCostume.rotationCenterY;
		}
		return costumes;
	}	
	
	/** PROJECT INFO READ */
	readProjectInfo(jsonInfo): ProjectInfoModel
	{
		var info: ProjectInfoModel = new ProjectInfoModel();
		info.id = jsonInfo.projectID;
		info.flashVersion = jsonInfo.flashVersion;
		info.hasCloudData = jsonInfo.hasCloudData;
		info.scriptCount = jsonInfo.scriptCount;
		info.videoOn = jsonInfo.videoOn;
		info.scratchVersion = jsonInfo.swfVersion
		info.spriteCount = jsonInfo.spriteCount;
		info.userAgent = jsonInfo.userAgent;
		return info;
	}
	
}