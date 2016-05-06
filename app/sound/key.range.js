System.register([], function(exports_1) {
    var KeyRange;
    return {
        setters:[],
        execute: function() {
            KeyRange = (function () {
                function KeyRange(topKey, sampleName, midiKey, loopStart, loopEnd, envelope) {
                    this.topKey = topKey;
                    this.sampleName = sampleName;
                    this.midiKey = midiKey;
                    this.loopStart = loopStart;
                    this.loopEnd = loopEnd;
                    this.envelope = envelope;
                }
                return KeyRange;
            })();
            exports_1("KeyRange", KeyRange);
        }
    }
});
//# sourceMappingURL=key.range.js.map