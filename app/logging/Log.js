System.register(["./LogLevel"], function(exports_1) {
    var LogLevel_1;
    var Log;
    return {
        setters:[
            function (LogLevel_1_1) {
                LogLevel_1 = LogLevel_1_1;
            }],
        execute: function() {
            Log = (function () {
                function Log() {
                    this.logBuffer = [];
                }
                // Add a new entry to the log.
                Log.prototype.log = function (severity, message, extraData) {
                    var log = { severity: severity, message: message, extraData: extraData };
                    console.log("ScratchLog: " + JSON.stringify(log));
                    this.logBuffer.push(log);
                };
                Log.info = function (message, extraData) {
                    Log._LOG.log(LogLevel_1.LogLevel.INFO, message, extraData);
                };
                Log.warning = function (message, extraData) {
                    Log._LOG.log(LogLevel_1.LogLevel.WARNING, message, extraData);
                };
                Log.error = function (message, extraData) {
                    Log._LOG.log(LogLevel_1.LogLevel.ERROR, message, extraData);
                };
                Log.track = function (message, extraData) {
                    Log._LOG.log(LogLevel_1.LogLevel.TRACK, message, extraData);
                };
                Log.debug = function (message, extraData) {
                    Log._LOG.log(LogLevel_1.LogLevel.DEBUG, message, extraData);
                };
                // Generate a JSON-compatible object representing the contents of the log in a human- and machine-readable way.
                Log.prototype.report = function (severityLimit) {
                    if (severityLimit === void 0) { severityLimit = LogLevel_1.LogLevel.DEBUG; }
                    return this.logBuffer;
                };
                Log._LOG = new Log();
                return Log;
            })();
            exports_1("Log", Log);
        }
    }
});
//# sourceMappingURL=Log.js.map