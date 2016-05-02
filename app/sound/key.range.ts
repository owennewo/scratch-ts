import {Envelope} from "./envelope";
export class KeyRange {

    topKey: number;
    sampleName: string;
    midiKey: number;
    loopStart: number;
    loopEnd: number;
    envelope: Envelope;

    constructor(topKey: number, sampleName: string, midiKey: number, loopStart: number, loopEnd: number, envelope?: Envelope) {
          this.topKey = topKey;
          this.sampleName = sampleName;
          this.midiKey = midiKey;
          this.loopStart = loopStart;
          this.loopEnd = loopEnd;
          this.envelope = envelope;
    }
}
