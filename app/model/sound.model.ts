import {StageModel} from "./stage.model";
import {SoundRuntime} from "../runtime/sound.runtime";
export class SoundModel {
    id: number; // soundID
    name: string;  // soundName
    md5: string; // md5
    sampleCount: number;
    rate: number;
    format: string;
    stage: StageModel;
    runtime: SoundRuntime = new SoundRuntime(this);

    constructor(stage: StageModel) {
        this.stage = stage;
    }
}
