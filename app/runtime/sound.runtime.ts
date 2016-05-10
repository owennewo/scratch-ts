import {SoundDecoder} from "../sound/sound.decoder";
import {SoundModel} from "../model/sound.model";
export class SoundRuntime {
    model: SoundModel;
    source: AudioBufferSourceNode;
    buffer: AudioBuffer;
    finished: Function;
    done: boolean = false;

    static baseUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/";


    constructor(model: SoundModel) {
        this.model = model;
    }

    load() {
        let request = new XMLHttpRequest();
        let url = SoundRuntime.baseUrl + this.model.md5 + "/get/";
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        let _this = this;
        let _context = this.model.stage.runtime.audioContext;
        request.onload = () => {
            let waveData = request.response;
            // Decode the waveData and populate a buffer channel with the samples
            let snd = new SoundDecoder(waveData);
            let samples = snd.getAllSamples();

            _this.buffer = _context.createBuffer(1, samples.length, _context.sampleRate);
            let data = _this.buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
                data[i] = samples[i];
            }
        };
        request.send();
    }


}
