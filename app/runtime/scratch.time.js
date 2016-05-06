System.register([], function(exports_1) {
    var ScratchTime;
    return {
        setters:[],
        execute: function() {
            ScratchTime = (function () {
                function ScratchTime() {
                }
                ScratchTime.startStepping = function (interp) {
                    this.interp = interp;
                    ScratchTime.isStepping = true;
                    ScratchTime.callbackId = window.requestAnimationFrame(ScratchTime.doStep);
                };
                ScratchTime.doStep = function (timestamp) {
                    if (ScratchTime.lastTimestamp) {
                        var delta = timestamp - ScratchTime.lastTimestamp;
                        var fps = Math.floor(1000 / delta);
                        window.document.getElementById("fps").innerHTML = fps;
                    }
                    ScratchTime.lastTimestamp = timestamp;
                    ScratchTime.interp.stepThreads();
                    if (ScratchTime.isStepping) {
                        ScratchTime.callbackId = window.requestAnimationFrame(ScratchTime.doStep);
                    }
                };
                ScratchTime.stopStepping = function () {
                    ScratchTime.isStepping = false;
                    if (ScratchTime.callbackId) {
                        window.cancelAnimationFrame(ScratchTime.callbackId);
                        ScratchTime.callbackId = undefined;
                    }
                };
                ScratchTime.getTimer = function () {
                    return ScratchTime.lastTimestamp;
                };
                ScratchTime.lastTimestamp = undefined;
                ScratchTime.isStepping = false;
                return ScratchTime;
            })();
            exports_1("ScratchTime", ScratchTime);
        }
    }
});
//# sourceMappingURL=scratch.time.js.map