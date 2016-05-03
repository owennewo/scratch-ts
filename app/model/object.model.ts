import {ObjectRuntime} from "../runtime/object.runtime";
import {ScriptModel} from "./script.model";
import {SoundModel} from "./sound.model";
import {CostumeModel} from "./costume.model";

export class ObjectModel {
    name: string; // objName
    scripts: ScriptModel[];
    sounds: SoundModel[];
    costumes: CostumeModel[];
    currentCostumeIndex: number = 0;

    runtime: ObjectRuntime;

    showCostume(costumeIndex: number) {
        if (costumeIndex >= this.costumes.length) costumeIndex = 0;
        if (costumeIndex < 0) costumeIndex = this.costumes.length - 1;
        this.currentCostumeIndex = costumeIndex;
        this.runtime.showCostume(this.costumes[costumeIndex]);
    }

    indexOfCostumeNamed(costumeName: string): number {
        for (let index = 0; index < this.costumes.length; index++) {
            if (this.costumes[index].name === costumeName) {
                return index;
            }
        }
        return -1;
    }

    soundNamed(name): SoundModel {
        for (let sound of this.sounds) {
            if (sound.name === name) return sound;
        }
        return null;
    };

}
