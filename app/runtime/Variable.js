System.register([], function(exports_1) {
    "use strict";
    var Variable;
    return {
        setters:[],
        execute: function() {
            // Variable.as
            // John Maloney, February 2010
            //
            // A variable is a name-value pair.
            Variable = (function () {
                function Variable(vName, initialValue) {
                    this.name = vName;
                    this.value = initialValue;
                }
                Variable.prototype.writeJSON = function (json) {
                    json.writeKeyValue("name", this.name);
                    json.writeKeyValue("value", this.value);
                    json.writeKeyValue("isPersistent", this.isPersistent);
                };
                return Variable;
            }());
            exports_1("Variable", Variable);
        }
    }
});
//# sourceMappingURL=Variable.js.map