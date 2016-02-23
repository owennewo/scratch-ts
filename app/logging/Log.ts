import {LogLevel} from "./LogLevel";

export class Log {

    logBuffer = [];

    constructor() {

    }

    private static _LOG = new Log();

    // Add a new entry to the log.
    public log(severity: string, message: string, extraData?: any) {

        let log = { severity: severity, message: message, extraData: extraData };
        console.log("ScratchLog: " + JSON.stringify(log));
        this.logBuffer.push(log);

    }

    public static info(message: string, extraData?: any) {
        Log._LOG.log(LogLevel.INFO, message, extraData);
    }

    public static warning(message: string, extraData?: any) {
        Log._LOG.log(LogLevel.WARNING, message, extraData);
    }

    public static error(message: string, extraData?: any) {
        Log._LOG.log(LogLevel.ERROR, message, extraData);
    }

    public static track(message: string, extraData?: any) {
        Log._LOG.log(LogLevel.TRACK, message, extraData);
    }

    public static debug(message: string, extraData?: any) {
        Log._LOG.log(LogLevel.DEBUG, message, extraData);
    }


    // Generate a JSON-compatible object representing the contents of the log in a human- and machine-readable way.
    public report(severityLimit: string = LogLevel.DEBUG): any {

        return this.logBuffer;
    }
}
