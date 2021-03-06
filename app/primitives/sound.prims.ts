import {NotePlayer} from "../sound/note.player";
import {SoundModel} from "../model/sound.model";
import {SoundBank} from "../sound/sound.bank";
import {StageModel} from "../model/stage.model";
import {ObjectModel} from "../model/object.model";
import {ScratchThread} from "../runtime/scratch.thread";
import {BlockModel} from "../model/block.model";
import {Interpreter} from "../runtime/interpreter";

// SoundPrimitives.as
// John Maloney, June 2010
//
// Sound primitives.
export class SoundPrims {

    constructor() {
    }

    public addPrimsTo(primTable: any): void {
        primTable["playSound:"] = (b: any, interp: Interpreter) => { this.primPlaySound(b, interp); };
        primTable["doPlaySoundAndWait"] = this.primPlaySoundUntilDone;
        primTable["stopAllSounds"] = (b: any): any => {
            console.log("todo stopAllSounds");
            // this.ScratchSoundPlayer.stopAllSounds();
        };

        primTable["drum:duration:elapsed:from:"] = (b: any, interp: Interpreter) => { this.primPlayDrum(b, interp); }; // Scratch 1.4 drum numbers
        primTable["playDrum"] = (b: any, interp: Interpreter) => { this.primPlayDrum(b, interp); };
        primTable["rest:elapsed:from:"] = this.primPlayRest;

        primTable["noteOn:duration:elapsed:from:"] = this.primPlayNote;
        primTable["midiInstrument:"] = this.primSetInstrument; // Scratch 1.4 instrument numbers
        primTable["instrument:"] = this.primSetInstrument;

        primTable["changeVolumeBy:"] = this.primChangeVolume;
        primTable["setVolumeTo:"] = this.primSetVolume;
        primTable["volume"] = this.primVolume;

        primTable["changeTempoBy:"] = (b: any, interp: Interpreter): any => {
            interp.stage.tempo = interp.stage.tempo + interp.numarg(b, 0);
            interp.redraw();
        };
        primTable["setTempoTo:"] = (b: any, interp: Interpreter): any => {
            interp.stage.tempo = interp.numarg(b, 0);
            interp.redraw();
        };
        primTable["tempo"] = (b: any, interp: Interpreter): any => { return interp.stage.tempo; };
    }


    private playSound(interp: Interpreter, snd: SoundModel): AudioNode {
        let runtime = interp.stage.runtime;
        if (snd.runtime.source) {
            // If this particular sound is already playing, stop it.
            snd.runtime.source.disconnect();
            snd.runtime.source = null;
        }

        snd.runtime.source = runtime.audioContext.createBufferSource();
        if (!snd.runtime.buffer) {
            snd.runtime.load();
            console.log("todo: fix sound so it works first time (early load)");
            return;
        }
        snd.runtime.source.buffer = snd.runtime.buffer;
        snd.runtime.source.connect(runtime.audioGain);

        // Track the sound's completion state
        snd.runtime.done = false;
        snd.runtime.finished = function() {
            // Remove from the active audio list and disconnect the source from
            // the sound dictionary.
            let i = runtime.audioPlaying.indexOf(snd.runtime);
            if (i > -1 && runtime.audioPlaying[i].source != null) {
                runtime.audioPlaying[i].done = true;
                runtime.audioPlaying[i].source = null;
                runtime.audioPlaying.splice(i, 1);
            }
        };
        window.setTimeout(snd.runtime.finished, snd.runtime.buffer.duration * 1000);
        // Add the global list of playing sounds and start playing.
        runtime.audioPlaying.push(snd.runtime);
        snd.runtime.source.start();
        return snd.runtime.source;
    };

    // private playDrum(interp: Interpreter, drum: number, isMidi: boolean, secs: number, client: ObjectModel) {
    //     let runtime = interp.stage.runtime;
    //     let player = SoundBank.getDrumPlayer(drum, isMidi, secs);
    //     // player.client = client;
    //     player.setDuration(secs);
    //     let source = runtime.audioContext.createScriptProcessor(4096, 1, 1);
    //     source.onaudioprocess = function(e) { player.writeSampleData(e); };
    //     source.soundPlayer = player;
    //     source.connect(runtime.audioGain);
    //     runtime.notesPlaying.push(source);
    //     source.finished = function() {
    //         let i = runtime.notesPlaying.indexOf(source);
    //         if (i > -1 && runtime.notesPlaying[i] != null) {
    //             runtime.notesPlaying.splice(i, 1);
    //         }
    //     };
    //     window.setTimeout(source.finished, secs * 1000);
    //     return player;
    // };

    private playNote(interp: Interpreter, player: NotePlayer) {


        let runtime = interp.stage.runtime;
        player.source = runtime.audioContext.createScriptProcessor(4096, 1, 1);
        player.source.onaudioprocess = function(e) { player.writeSampleData(e); };
        player.source.connect(runtime.audioGain);
        runtime.notesPlaying.push(player);
        player.finished = function() {
            let i = runtime.notesPlaying.indexOf(player);
            if (i > -1 && runtime.notesPlaying[i] != null) {
                runtime.notesPlaying.splice(i, 1);
            }
        };
        window.setTimeout(player.finished, player.secs * 1000);
        return player;
    }

    private stopAllSounds(interp: Interpreter) {
      let runtime = interp.stage.runtime;
        let oldPlayers = runtime.audioPlaying;
        runtime.audioPlaying = [];
        for (let s = 0; s < oldPlayers.length; s++) {
            if (oldPlayers[s].source) {
                oldPlayers[s].source.disconnect();
                oldPlayers[s].finished();
            }
        }

        let oldNotes = runtime.notesPlaying;
        runtime.notesPlaying = [];
        for (let s = 0; s < oldNotes.length; s++) {
            if (oldNotes[s]) {
                oldNotes[s].source.disconnect();
                oldNotes[s].finished();
            }
        }
    };


    private primPlaySound(b: BlockModel, interp: Interpreter): void {
        let s = interp.targetSprite();
        if (s == null) return;
        let snd = s.soundNamed(interp.arg(b, 0));
        if (snd != null) this.playSound(interp, snd);
    }

    private primPlaySoundUntilDone(b: BlockModel, interp: Interpreter): void {

        let activeThread = interp.activeThread;
        if (activeThread.firstTime) {
            let snd = interp.targetSprite().soundNamed(interp.arg(b, 0));
            if (snd == null) return;
            activeThread.tmpObj = this.playSound(interp, snd);
            activeThread.firstTime = false;
        }
        let player = activeThread.tmpObj;
        if (player == null || player.done || player.playbackState === 3) {
            activeThread.tmpObj = null;
            activeThread.firstTime = true;
        } else {
            interp.doYield();
        }

    }

    private primPlayNote(b: BlockModel, interp: Interpreter): void {
      let s = interp.targetSprite();
      if (s == null) return;
      if (interp.activeThread.firstTime) {
        let key = interp.numarg(b, 0);
        let secs = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 1));
        let player = SoundBank.getInstrumentPlayer(s.runtime.instrument, key, secs);
        this.playNote(interp, player);
        interp.startTimer(secs);
      } else {
          interp.checkTimer();
      }
    }

    private primPlayDrum(b: BlockModel, interp: Interpreter): void {
        let s: ObjectModel = interp.targetObj();
        if (s == null) return;
        if (interp.activeThread.firstTime) {
            let drum: number = Math.round(interp.numarg(b, 0));
            let isMidi: boolean = (b.spec.code === "drum:duration:elapsed:from:");
            let secs: number = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 1));
            let player = SoundBank.getDrumPlayer(drum, isMidi, secs);
            this.playNote(interp, player); // always play entire drum sample
            interp.startTimer(secs);
        } else {
            interp.checkTimer();
        }
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
        let instr: number = interp.numarg(b, 0) - 1;
        if (b.spec.code === "midiInstrument:") {
            // map old to new instrument number
            instr = this.instrumentMap[instr] - 1; // maps to -1 if out of range
        }
        instr = Math.max(0, Math.min(instr, SoundBank.instruments.length - 1));
        if (interp.targetObj()) interp.targetSprite().runtime.instrument = instr;
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
