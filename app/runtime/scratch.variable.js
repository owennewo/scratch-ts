System.register([], function(exports_1) {
    var ScratchVariable;
    return {
        setters:[],
        execute: function() {
            // Variable.as
            // John Maloney, February 2010
            //
            // A variable is a name-value pair.
            ScratchVariable = (function () {
                function ScratchVariable(vName, initialValue) {
                    this.name = vName;
                    this.value = initialValue;
                }
                ScratchVariable.prototype.writeJSON = function (json) {
                    json.writeKeyValue("name", this.name);
                    json.writeKeyValue("value", this.value);
                    json.writeKeyValue("isPersistent", this.isPersistent);
                };
                return ScratchVariable;
            })();
            exports_1("ScratchVariable", ScratchVariable);
        }
    }
});
//# sourceMappingURL=scratch.variable.js.map