import {SoundRuntime} from "../runtime/sound.runtime";
export class SoundModel {
    id: number; // soundID
    name: string;  // soundName
    md5: string; // md5
    sampleCount: number;
    rate: number;
    format: string;

    runtime: SoundRuntime;
}
