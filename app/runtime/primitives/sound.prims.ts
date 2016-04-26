import {StageModel} from "../../model/stage.model";
import {ObjectModel} from "../../model/object.model";
import {ScratchThread} from "../scratch.thread";
import {BlockModel} from "../../model/block.model";
import {Interpreter} from "../interpreter";
import {Scratch} from "../scratch";
// SoundPrimitives.as
// John Maloney, June 2010
//
// Sound primitives.


export class SoundPrims {

    constructor() {
    }

    public addPrimsTo(primTable: any): void {
        primTable["playSound:"] = this.primPlaySound;
        primTable["doPlaySoundAndWait"] = this.primPlaySoundUntilDone;
        primTable["stopAllSounds"] = function(b: any): any { this.ScratchSoundPlayer.stopAllSounds(); };

        primTable["drum:duration:elapsed:from:"] = this.primPlayDrum; // Scratch 1.4 drum numbers
        primTable["playDrum"] = this.primPlayDrum;
        primTable["rest:elapsed:from:"] = this.primPlayRest;

        primTable["noteOn:duration:elapsed:from:"] = this.primPlayNote;
        primTable["midiInstrument:"] = this.primSetInstrument; // Scratch 1.4 instrument numbers
        primTable["instrument:"] = this.primSetInstrument;

        primTable["changeVolumeBy:"] = this.primChangeVolume;
        primTable["setVolumeTo:"] = this.primSetVolume;
        primTable["volume"] = this.primVolume;

        primTable["changeTempoBy:"] = function(b: any, interp: Interpreter): any {
            this.app.stagePane.setTempo(this.app.stagePane.tempoBPM + interp.numarg(this.b, 0));
            interp.redraw();
        };
        primTable["setTempoTo:"] = function(b: any, interp: Interpreter): any {
            this.app.stagePane.setTempo(interp.numarg(this.b, 0));
            interp.redraw();
        };
        primTable["tempo"] = function(b: any): any { return this.stage.tempo; };
    }

    private primPlaySound(b: BlockModel, interp: Interpreter): void {
      console.log("primPlaySound");
        // let snd: ScratchSound = interp.targetObj().findSound(interp.arg(b, 0));
        // if (snd != null) SoundPrims.playSound(snd, interp.targetObj());
    }

    private primPlaySoundUntilDone(b: BlockModel, interp: Interpreter): void {
        console.log("todo primPlaySoundUntilDone");
        interp.doYield();
        // let activeThread: ScratchThread = interp.activeThread;
        // if (activeThread.firstTime) {
        //     let snd: ScratchSound = interp.targetObj().findSound(interp.arg(b, 0));
        //     if (snd == null) return;
        //     activeThread.tmpObj = SoundPrims.playSound(snd, interp.targetObj());
        //     activeThread.firstTime = false;
        // }
        // let player: ScratchSoundPlayer = activeThread.tmpObj;
        // if ((player == null) || (player.atEnd())) { // finished playing
        //     activeThread.tmp = 0;
        //     activeThread.firstTime = true;
        // } else {
        //     interp.doYield();
        // }
    }

    private primPlayNote(b: BlockModel, interp: Interpreter): void {
      console.log("todo primPlayNote");
        // let s: ObjectModel = interp.targetObj();
        // if (s == null) return;
        // if (interp.activeThread.firstTime) {
        //     let key: number = interp.numarg(b, 0);
        //     let secs: number = SoundPrims.beatsToSeconds(interp.numarg(b, 1));
        //     interp.activeThread.tmpObj = SoundPrims.playNote(s.instrument, key, secs, s);
        //     interp.startTimer(secs);
        // } else {
        //     interp.checkTimer();
        // }
    }

    private primPlayDrum(b: BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s == null) return;
        if (interp.activeThread.firstTime) {
            let drum: number = Math.round(interp.numarg(b, 0));
            let isMIDI: boolean = (b.spec.code === "drum:duration:elapsed:from:");
            let secs: number = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 1));
            SoundPrims.playDrum(drum, isMIDI, 10, s); // always play entire drum sample
            interp.startTimer(secs);
        } else {
            interp.checkTimer();
        }
    }

    private static playSound(s: any /* ScratchSound */, client: ObjectModel): any { // ScratchSoundPlayer {
        console.log("todo playSound");
        // let player: ScratchSoundPlayer = s.sndplayer();
        // player.client = client;
        // player.startPlaying();
        // return player;
    }

    private static playDrum(drum: number, isMIDI: boolean, secs: number, client: ObjectModel): any { // ScratchSoundPlayer {
      console.log("todo playDrum");
        // let player: NotePlayer = SoundBank.getDrumPlayer(drum, isMIDI, secs);
        // if (player == null) return null;
        // player.client = client;
        // player.setDuration(secs);
        // player.startPlaying();
        // return player;
    }

    private static playNote(instrument: number, midiKey: number, secs: number, client: ObjectModel): any { // ScratchSoundPlayer {
      console.log("todo playNote");
        // let player: NotePlayer = SoundBank.getNotePlayer(instrument, midiKey);
        // if (player == null) return null;
        // player.client = client;
        // player.setNoteAndDuration(midiKey, secs);
        // player.startPlaying();
        // return player;
    }

    private primPlayRest(b: BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s == null) return;
        if (interp.activeThread.firstTime) {
            let secs: number = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 0));
            interp.startTimer(secs);
        } else {
            interp.checkTimer();
        }
    }

    private static beatsToSeconds(interp: Interpreter, beats: number): number {
        return (beats * 60) / interp.stage.tempo;
    }

    private primSetInstrument(b: BlockModel, interp: Interpreter): void {
        // Set Scratch 2.0 instrument.
        console.log("todo primSetInstrument");
        // let instr: number = interp.numarg(b, 0) - 1;
        // if (b.spec.code === "midiInstrument:") {
        //     // map old to new instrument number
        //     instr = SoundPrims.instrumentMap[instr] - 1; // maps to -1 if out of range
        // }
        // instr = Math.max(0, Math.min(instr, SoundBank.instrumentNames.length - 1));
        // if (interp.targetObj()) interp.targetObj().instrument = instr;
    }

    private primChangeVolume(b: BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s != null) {
            s.runtime.setVolume(s.runtime.volume + interp.numarg(b, 0));
            interp.redraw();
        }
    }

    private primSetVolume(b: BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s != null) {
            s.runtime.setVolume(interp.numarg(b, 0));
            interp.redraw();
        }
    }

    private primVolume(b: BlockModel, interp: Interpreter): number {
        let s: ObjectModel = interp.targetObj();
        return (s != null) ? s.runtime.volume : 0;
    }

    // Map from a Scratch 1.4 (i.e. MIDI) instrument number to the closest Scratch 2.0 equivalent.
    private instrumentMap: any[] = [
        // Acoustic Grand, Bright Acoustic, Electric Grand, Honky-Tonk
        1, 1, 1, 1,
        // Electric Piano 1, Electric Piano 2, Harpsichord, Clavinet
        2, 2, 4, 4,
        // Celesta, Glockenspiel, Music Box, Vibraphone
        17, 17, 17, 16,
        // Marimba, Xylophone, Tubular Bells, Dulcimer
        19, 16, 17, 17,
        // Drawbar Organ, Percussive Organ, Rock Organ, Church Organ
        3, 3, 3, 3,
        // Reed Organ, Accordion, Harmonica, Tango Accordion
        3, 3, 3, 3,
        // Nylon String Guitar, Steel String Guitar, Electric Jazz Guitar, Electric Clean Guitar
        4, 4, 5, 5,
        // Electric Muted Guitar, Overdriven Guitar,Distortion Guitar, Guitar Harmonics
        5, 5, 5, 5,
        // Acoustic Bass, Electric Bass (finger), Electric Bass (pick), Fretless Bass
        6, 6, 6, 6,
        // Slap Bass 1, Slap Bass 2, Synth Bass 1, Synth Bass 2
        6, 6, 6, 6,
        // Violin, Viola, Cello, Contrabass
        8, 8, 8, 8,
        // Tremolo Strings, Pizzicato Strings, Orchestral Strings, Timpani
        8, 7, 8, 19,
        // String Ensemble 1, String Ensemble 2, SynthStrings 1, SynthStrings 2
        8, 8, 8, 8,
        // Choir Aahs, Voice Oohs, Synth Voice, Orchestra Hit
        15, 15, 15, 19,
        // Trumpet, Trombone, Tuba, Muted Trumpet
        9, 9, 9, 9,
        // French Horn, Brass Section, SynthBrass 1, SynthBrass 2
        9, 9, 9, 9,
        // Soprano Sax, Alto Sax, Tenor Sax, Baritone Sax
        11, 11, 11, 11,
        // Oboe, English Horn, Bassoon, Clarinet
        14, 14, 14, 10,
        // Piccolo, Flute, Recorder, Pan Flute
        12, 12, 13, 13,
        // Blown Bottle, Shakuhachi, Whistle, Ocarina
        13, 13, 12, 12,
        // Lead 1 (square), Lead 2 (sawtooth), Lead 3 (calliope), Lead 4 (chiff)
        20, 20, 20, 20,
        // Lead 5 (charang), Lead 6 (voice), Lead 7 (fifths), Lead 8 (bass+lead)
        20, 20, 20, 20,
        // Pad 1 (new age), Pad 2 (warm), Pad 3 (polysynth), Pad 4 (choir)
        21, 21, 21, 21,
        // Pad 5 (bowed), Pad 6 (metallic), Pad 7 (halo), Pad 8 (sweep)
        21, 21, 21, 21,
        // FX 1 (rain), FX 2 (soundtrack), FX 3 (crystal), FX 4 (atmosphere)
        21, 21, 21, 21,
        // FX 5 (brightness), FX 6 (goblins), FX 7 (echoes), FX 8 (sci-fi)
        21, 21, 21, 21,
        // Sitar, Banjo, Shamisen, Koto
        4, 4, 4, 4,
        // Kalimba, Bagpipe, Fiddle, Shanai
        17, 14, 8, 10,
        // Tinkle Bell, Agogo, Steel Drums, WoodBlockModel
        17, 17, 18, 19,
        // Taiko Drum, Melodic Tom, Synth Drum, Reverse Cymbal
        1, 1, 1, 1,
        // Guitar Fret Noise, Breath Noise, Seashore, Bird Tweet
        21, 21, 21, 21,
        // Telephone Ring, Helicopter, Applause, Gunshot
        21, 21, 21, 21
    ];

}
