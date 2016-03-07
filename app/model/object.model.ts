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
    currentCostume: CostumeModel;

    runtime: ObjectRuntime;

    showCostume(costumeIndex: number) {
        this.currentCostumeIndex = costumeIndex;
        this.currentCostume = this.costumes[costumeIndex];
        this.runtime.showCostume(this.currentCostume);
    }

    indexOfCostumeNamed(costumeName: string): number {
        for (let index = 0; index < this.costumes.length; index++) {
          if (this.costumes[index].name === costumeName) {
            return index;
          }
        }
        return -1;
    }

}
