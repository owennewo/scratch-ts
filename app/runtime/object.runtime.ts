import {CostumeModel} from "../model/costume.model";
export abstract class ObjectRuntime {

    visible: boolean;
    volume: number;
    svg: any;

    abstract showCostume(costume: CostumeModel);

    setVolume(volume: number) {
      this.volume = volume;
    }
}
