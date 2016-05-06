System.register(["../runtime/sound.runtime"], function(exports_1) {
    var sound_runtime_1;
    var SoundModel;
    return {
        setters:[
            function (sound_runtime_1_1) {
                sound_runtime_1 = sound_runtime_1_1;
            }],
        execute: function() {
            SoundModel = (function () {
                function SoundModel(stage) {
                    this.runtime = new sound_runtime_1.SoundRuntime(this);
                    this.stage = stage;
                }
                return SoundModel;
            })();
            exports_1("SoundModel", SoundModel);
        }
    }
});
//# sourceMappingURL=sound.model.js.map