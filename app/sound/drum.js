System.register(["./envelope"], function(exports_1) {
    var envelope_1;
    var Drum;
    return {
        setters:[
            function (envelope_1_1) {
                envelope_1 = envelope_1_1;
            }],
        execute: function() {
            Drum = (function () {
                function Drum(sampleName, pitchAdjust, loopStart, loopEnd, decay) {
                    if (loopStart === void 0) { loopStart = -1; }
                    if (loopEnd === void 0) { loopEnd = -1; }
                    if (decay === void 0) { decay = null; }
                    this.sampleName = sampleName;
                    this.pitchAdjust = pitchAdjust;
                    this.loopStart = loopStart;
                    this.loopEnd = loopEnd;
                    this.envelope = new envelope_1.Envelope(0, 0, decay);
                }
                return Drum;
            })();
            exports_1("Drum", Drum);
        }
    }
});
//# sourceMappingURL=drum.js.map