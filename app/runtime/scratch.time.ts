export class ScratchTime {

    static startTime: number = 0;
    static initTime() {
        this.startTime = new Date().getTime();
    }
    static getTimer(): number {
        if (ScratchTime.startTime === 0) {
            this.startTime = new Date().getTime();
        }
        return new Date().getTime() - this.startTime;
    }
}
