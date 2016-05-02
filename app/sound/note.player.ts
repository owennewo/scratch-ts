import {SoundDecoder} from "./sound.decoder";
// NotePlayer.js
// Tim Mickel, 2013
// Based entirely on the AS version by John Maloney
//
// Subclass of SoundDecoder to play notes on a sampled instrument or drum.
//
// A sampled instrument outputs interpolated sound samples from  an array of signed,
// 16-bit integers with an original sampling rate of 22050 samples/sec. The pitch is
// shifted by change the step size while iterating through this array. An instrument
// may also be looped so that it can be sustained and it may have a volume envelope
// to control the attack and decay of the note.

export class NotePlayer extends SoundDecoder {

    private originalPitch;
    private samplesRemaining = 0;
    private isLooped: boolean = false;
    private loopPoint;
    private loopLength;
    private envelopeValue;
    private samplesSinceStart;
    private attackEnd;
    private attackRate;
    private holdEnd;
    private decayRate;

    constructor(wavFileData: any, originalPitch: number, loopStart: number, loopEnd: number, env?: any) {
        super(wavFileData);
        this.originalPitch = originalPitch || null;
        this.index = 0;
        this.samplesRemaining = 0; // determines note duration

        // Looping
        this.isLooped = false;
        this.loopPoint = 0; // final sample in loop
        this.loopLength = 0;

        // Volume Envelope
        this.envelopeValue = 1;
        this.samplesSinceStart = 0;
        this.attackEnd = 0;
        this.attackRate = 0;
        this.holdEnd = 0;
        this.decayRate = 1;

        if (wavFileData === null) wavFileData = []; // new ArrayBuffer();

        let stepSize = 0.5; // default - no pitch shift
        let startOffset = 0;
        this.endOffset = wavFileData.byteLength / 2; // end of sample data
        let getSample = function() { return 0; }; // called once at startup time
        this.soundData = new Uint8Array(wavFileData);

        if ((loopStart >= 0) && (loopStart < this.endOffset)) {
            this.isLooped = true;
            this.loopPoint = loopStart;
            if ((loopEnd > 0) && (loopEnd <= this.endOffset)) this.endOffset = loopEnd;
            this.loopLength = this.endOffset - this.loopPoint;

            // Compute the original pitch more exactly from the loop length:
            let oneCycle = 22050 / this.originalPitch;
            let cycles = Math.round(this.loopLength / oneCycle);
            this.originalPitch = 22050 / (this.loopLength / cycles);
        }
        if (env) {
            this.attackEnd = env[0] * 44.100;
            if (this.attackEnd > 0) this.attackRate = Math.pow(33000, 1 / this.attackEnd);
            this.holdEnd = this.attackEnd + env[1] * 44.100;
            let decayCount = env[2] * 44100;
            this.decayRate = decayCount === 0 ? 1 : Math.pow(33000, -1 / decayCount);
        }
    }


    setNoteAndDuration(midiKey, secs) {
        midiKey = Math.max(0, Math.min(midiKey, 127));
        let pitch = 440 * Math.pow(2, (midiKey - 69) / 12); // midi key 69 is A (440 Hz)
        this.stepSize = pitch / (2 * this.originalPitch); // adjust for original sampling rate of 22050
        this.setDuration(secs);
    }

    setDuration(secs) {
        this.samplesSinceStart = 0;
        this.samplesRemaining = 44100 * secs;
        if (!this.isLooped) this.samplesRemaining = Math.min(this.samplesRemaining, this.endOffset / this.stepSize);
        this.envelopeValue = this.attackEnd > 0 ? 1 / 33000 : 1;
    }

    interpolatedSample() {
        if (this.samplesRemaining-- <= 0) { this.noteFinished(); return 0; }
        this.index += this.stepSize;
        while (this.index >= this.endOffset) {
            if (!this.isLooped) return 0;
            this.index -= this.loopLength;
        }
        let i = Math.floor(this.index);
        let frac = this.index - i;
        let curr = this.rawSample(i);
        let next = this.rawSample(i + 1);
        let sample = (curr + frac * (next - curr)) / 100000; // xxx 32000; attenuate...
        if (this.samplesRemaining < 1000) sample *= (this.samplesRemaining / 1000.0); // relaase phease
        this.updateEnvelope();
        return this.envelopeValue * sample;
    }

    rawSample(sampleIndex) {
        if (sampleIndex >= this.endOffset) {
            if (!this.isLooped) return 0;
            sampleIndex = this.loopPoint;
        }
        let byteIndex = 2 * sampleIndex;
        let result = (this.soundData[byteIndex + 1] << 8) + this.soundData[byteIndex];
        return result <= 32767 ? result : result - 65536;
    }

    updateEnvelope() {
        // Compute envelopeValue for the current sample.
        this.samplesSinceStart++;
        if (this.samplesSinceStart < this.attackEnd) {
            this.envelopeValue *= this.attackRate;
        } else if (this.samplesSinceStart === this.attackEnd) {
            this.envelopeValue = 1;
        } else if (this.samplesSinceStart > this.holdEnd) {
            if (this.decayRate < 1) this.envelopeValue *= this.decayRate;
        }
    }
}
