System.register([], function(exports_1) {
    "use strict";
    var Time;
    return {
        setters:[],
        execute: function() {
            Time = (function () {
                function Time() {
                }
                Time.initTime = function () {
                    this.startTime = new Date().getTime();
                };
                Time.getTimer = function () {
                    if (Time.startTime === 0) {
                        console.warn("time not initialized");
                    }
                    return new Date().getTime() - this.startTime;
                };
                Time.startTime = 0;
                return Time;
            }());
            exports_1("Time", Time);
        }
    }
});
//# sourceMappingURL=Time.js.map