System.register(["../sound/sound.decoder"], function(exports_1) {
    var sound_decoder_1;
    var SoundRuntime;
    return {
        setters:[
            function (sound_decoder_1_1) {
                sound_decoder_1 = sound_decoder_1_1;
            }],
        execute: function() {
            SoundRuntime = (function () {
                function SoundRuntime(model) {
                    this.model = model;
                }
                SoundRuntime.prototype.load = function () {
                    var request = new XMLHttpRequest();
                    var url = SoundRuntime.baseUrl + this.model.md5 + "/get/";
                    request.open("GET", url, true);
                    request.responseType = "arraybuffer";
                    var _this = this;
                    var _context = this.model.stage.runtime.audioContext;
                    request.onload = function () {
                        var waveData = request.response;
                        // Decode the waveData and populate a buffer channel with the samples
                        var snd = new sound_decoder_1.SoundDecoder(waveData);
                        var samples = snd.getAllSamples();
                        _this.buffer = _context.createBuffer(1, samples.length, _context.sampleRate);
                        var data = _this.buffer.getChannelData(0);
                        for (var i = 0; i < data.length; i++) {
                            data[i] = samples[i];
                        }
                    };
                    request.send();
                };
                SoundRuntime.baseUrl = "http://cdn.assets.scratch.mit.edu/internalapi/asset/";
                return SoundRuntime;
            })();
            exports_1("SoundRuntime", SoundRuntime);
        }
    }
});
//# sourceMappingURL=sound.runtime.js.map