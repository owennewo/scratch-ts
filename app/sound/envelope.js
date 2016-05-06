System.register([], function(exports_1) {
    var Envelope;
    return {
        setters:[],
        execute: function() {
            Envelope = (function () {
                function Envelope(attack, hold, decay) {
                    this.attack = attack;
                    this.hold = hold;
                    this.decay = decay;
                }
                return Envelope;
            })();
            exports_1("Envelope", Envelope);
        }
    }
});
//# sourceMappingURL=envelope.js.map