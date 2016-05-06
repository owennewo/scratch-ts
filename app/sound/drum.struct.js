System.register([], function(exports_1) {
    "use strict";
    var Drum;
    return {
        setters:[],
        execute: function() {
            Drum = (function () {
                function Drum(name, pitchAdjust, loopStart, loopEnd, decay) {
                    this.name = name;
                    this.pitchAdjust = pitchAdjust;
                    this.loopStart = loopStart;
                    this.loopEnd = loopEnd;
                }
                return Drum;
            }());
            exports_1("Drum", Drum);
        }
    }
});
//# sourceMappingURL=drum.struct.js.map