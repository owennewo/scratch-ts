import {Interpreter} from "./interpreter";
export class ScratchTime {
    static interp: Interpreter;
    static lastTimestamp: number = 0;
    static callbackId: number;
    static isStepping = false;
    static startStepping(interp: Interpreter) {
        this.interp = interp;
        ScratchTime.isStepping = true;
        ScratchTime.callbackId = window.requestAnimationFrame(ScratchTime.doStep);
    }

    static doStep(timestamp: number) {
      console.log("doStep");
      ScratchTime.lastTimestamp = timestamp;
      ScratchTime.interp.stepThreads();
      if (ScratchTime.isStepping) {
          ScratchTime.callbackId = window.requestAnimationFrame(ScratchTime.doStep);
      }
    }

    static stopStepping() {
      ScratchTime.isStepping = false;
      window.cancelAnimationFrame(ScratchTime.callbackId);
    }

    static getTimer(): number {
        return ScratchTime.lastTimestamp;
    }
}
