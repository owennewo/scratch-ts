System.register([], function(exports_1) {
    var LogLevel;
    return {
        setters:[],
        execute: function() {
            LogLevel = (function () {
                function LogLevel() {
                }
                // Use this for problems that should be in our control
                LogLevel.ERROR = "err";
                // Use this for unexpected conditions and problems outside our control (network, user data, etc.)
                LogLevel.WARNING = "wrn";
                // These events will be communicated to JS so they can be handled by web UI, sent to GA, etc.
                LogLevel.TRACK = "trk";
                // Use this to report status information
                LogLevel.INFO = "inf";
                // Use this to report information useful for debugging
                LogLevel.DEBUG = "dbg";
                LogLevel.LEVEL = [
                    LogLevel.ERROR, LogLevel.WARNING, LogLevel.TRACK, LogLevel.INFO, LogLevel.DEBUG
                ];
                return LogLevel;
            })();
            exports_1("LogLevel", LogLevel);
        }
    }
});
//# sourceMappingURL=LogLevel.js.map