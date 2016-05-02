import {Envelope} from "./envelope";

export class Drum {

    sampleName: string;
    pitchAdjust: number;
    loopStart: number;
    loopEnd: number;
    decay: number;
    envelope: Envelope;

    constructor(sampleName: string, pitchAdjust: number, loopStart: number = -1, loopEnd: number = -1, decay: number = null) {
        this.sampleName = sampleName;
        this.pitchAdjust = pitchAdjust;
        this.loopStart = loopStart;
        this.loopEnd = loopEnd;
        this.envelope = new Envelope(0, 0, decay);
    }

}
