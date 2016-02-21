import {ScriptModel} from './script.model';
import {SoundModel} from './sound.model';
import {CostumeModel} from './costume.model';

export class ObjectModel
{
	name: string; //objName
	scripts: ScriptModel[];
	sounds: SoundModel[];
	costumes: CostumeModel[];
	currentCostume: CostumeModel; 	
}