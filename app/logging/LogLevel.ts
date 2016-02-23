export class LogLevel {

    // Use this for problems that should be in our control
    static ERROR: string = "err";

    // Use this for unexpected conditions and problems outside our control (network, user data, etc.)
    static WARNING: string = "wrn";

    // These events will be communicated to JS so they can be handled by web UI, sent to GA, etc.
    static TRACK: string = "trk";

    // Use this to report status information
    static INFO: string = "inf";

    // Use this to report information useful for debugging
    static DEBUG: string = "dbg";

    static LEVEL: any[] = [
        LogLevel.ERROR, LogLevel.WARNING, LogLevel.TRACK, LogLevel.INFO, LogLevel.DEBUG
    ];
}
