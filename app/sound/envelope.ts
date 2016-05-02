export class Envelope {
    attack: number;
    hold: number;
    decay: number;

    constructor(attack: number, hold: number, decay: number) {
        this.attack = attack;
        this.hold = hold;
        this.decay = decay;
    }
}
