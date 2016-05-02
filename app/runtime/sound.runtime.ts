import {SoundModel} from "../model/sound.model";
export class SoundRuntime {
    model: SoundModel;
    source: AudioBufferSourceNode;
    buffer: any;
    finished: Function;
}
