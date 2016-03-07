import {CostumeModel} from "../model/costume.model";
export class ObjectRuntime {

    visible: boolean;
    volume: number;

    showCostume(costume: CostumeModel) {
      console.log("todo showCostume runtime");
    }

    setVolume(volume: number) {
      this.volume = volume;
    }
}
