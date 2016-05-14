import {Drum} from "../sound/drum";
import {KeyRange} from "./key.range";
import {Envelope} from "./envelope";
import {Instr} from "./instr";
import {NotePlayer} from "./note.player";
// SoundBank.js
// Tim Mickel, 2013
// Based on the original AS by John Maloney - Scratch 1.4 compatibility removed
//
// A collection of instrument and drum resources to support the note and drum commands.

export class SoundBank {

    // -----------------------------
    // Scratch 2.0 Instrument Definitions
    // ------------------------------

    // Each instrument is an array of one or more key-span entries of the following form:
    //
    //   top key of key span, sampleName, midiKey, loopStart, loopEnd, [attack, hold, decay]
    //
    // The loop points are -1 if the sound is unlooped (e.g. Marimba).
    // The three-element envelop array may be omitted if the instrument has no envelope.
    public static instruments: Array<Array<KeyRange>> =
    [
        [
            new KeyRange(38, "AcousticPiano_As3", 58, 10266, 17053, new Envelope(0, 100, 22)),
            new KeyRange(44, "AcousticPiano_C4", 60, 13968, 18975, new Envelope(0, 100, 20)),
            new KeyRange(51, "AcousticPiano_G4", 67, 12200, 12370, new Envelope(0, 80, 18)),
            new KeyRange(62, "AcousticPiano_C6", 84, 13042, 13276, new Envelope(0, 80, 16)),
            new KeyRange(70, "AcousticPiano_F5", 77, 12425, 12965, new Envelope(0, 40, 14)),
            new KeyRange(77, "AcousticPiano_Ds6", 87, 12368, 12869, new Envelope(0, 20, 10)),
            new KeyRange(85, "AcousticPiano_Ds6", 87, 12368, 12869, new Envelope(0, 0, 8)),
            new KeyRange(90, "AcousticPiano_Ds6", 87, 12368, 12869, new Envelope(0, 0, 6)),
            new KeyRange(96, "AcousticPiano_D7", 98, 7454, 7606, new Envelope(0, 0, 3)),
            new KeyRange(128, "AcousticPiano_D7", 98, 7454, 7606, new Envelope(0, 0, 2))
        ],
        [
            new KeyRange(48, "ElectricPiano_C2", 36, 15338, 17360, new Envelope(0, 80, 10)),
            new KeyRange(74, "ElectricPiano_C4", 60, 11426, 12016, new Envelope(0, 40, 8)),
            new KeyRange(128, "ElectricPiano_C4", 60, 11426, 12016, new Envelope(0, 0, 6))
        ],
        [
            new KeyRange(128, "Organ_G2", 43, 1306, 3330)
        ],
        [
            new KeyRange(40, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 15)),
            new KeyRange(56, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 13.5)),
            new KeyRange(60, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 12)),
            new KeyRange(67, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 8.5)),
            new KeyRange(72, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 7)),
            new KeyRange(83, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 5.5)),
            new KeyRange(128, "AcousticGuitar_F3", 53, 36665, 36791, new Envelope(0, 0, 4.5))
        ],
        [
            new KeyRange(40, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 15)),
            new KeyRange(56, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 13.5)),
            new KeyRange(60, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 12)),
            new KeyRange(67, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 8.5)),
            new KeyRange(72, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 7)),
            new KeyRange(83, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 5.5)),
            new KeyRange(128, "ElectricGuitar_F3", 53, 34692, 34945, new Envelope(0, 0, 4.5))
        ],
        [
            new KeyRange(34, "ElectricBass_G1", 31, 41912, 42363, new Envelope(0, 0, 17)),
            new KeyRange(48, "ElectricBass_G1", 31, 41912, 42363, new Envelope(0, 0, 14)),
            new KeyRange(64, "ElectricBass_G1", 31, 41912, 42363, new Envelope(0, 0, 12)),
            new KeyRange(128, "ElectricBass_G1", 31, 41912, 42363, new Envelope(0, 0, 10))
        ],
        [
            new KeyRange(38, "Pizz_G2", 43, 8554, 8782, new Envelope(0, 0, 5)),
            new KeyRange(45, "Pizz_G2", 43, 8554, 8782, new Envelope(0, 12, 4)),
            new KeyRange(56, "Pizz_A3", 57, 11460, 11659, new Envelope(0, 0, 4)),
            new KeyRange(64, "Pizz_A3", 57, 11460, 11659, new Envelope(0, 0, 3.2)),
            new KeyRange(72, "Pizz_E4", 64, 17525, 17592, new Envelope(0, 0, 2.8)),
            new KeyRange(80, "Pizz_E4", 64, 17525, 17592, new Envelope(0, 0, 2.2)),
            new KeyRange(128, "Pizz_E4", 64, 17525, 17592, new Envelope(0, 0, 1.5))
        ],
        [
            new KeyRange(41, "Cello_C2", 36, 8548, 8885),
            new KeyRange(52, "Cello_As2", 46, 7465, 7845),
            new KeyRange(62, "Violin_D4", 62, 10608, 11360),
            new KeyRange(75, "Violin_A4", 69, 3111, 3314, new Envelope(70, 0, 0)),
            new KeyRange(128, "Violin_E5", 76, 2383, 2484)
        ],
        [
            new KeyRange(30, "BassTrombone_A2_3", 45, 1357, 2360),
            new KeyRange(40, "BassTrombone_A2_2", 45, 1893, 2896),
            new KeyRange(55, "Trombone_B3", 59, 2646, 3897),
            new KeyRange(88, "Trombone_B3", 59, 2646, 3897, new Envelope(50, 0, 0)),
            new KeyRange(128, "Trumpet_E5", 76, 2884, 3152)
        ],
        [
            new KeyRange(128, "Clarinet_C4", 60, 14540, 15468)
        ],
        [
            new KeyRange(40, "TenorSax_C3", 48, 8939, 10794),
            new KeyRange(50, "TenorSax_C3", 48, 8939, 10794, new Envelope(20, 0, 0)),
            new KeyRange(59, "TenorSax_C3", 48, 8939, 10794, new Envelope(40, 0, 0)),
            new KeyRange(67, "AltoSax_A3", 57, 8546, 9049),
            new KeyRange(75, "AltoSax_A3", 57, 8546, 9049, new Envelope(20, 0, 0)),
            new KeyRange(80, "AltoSax_A3", 57, 8546, 9049, new Envelope(20, 0, 0)),
            new KeyRange(128, "AltoSax_C6", 84, 1258, 1848)
        ],
        [
            new KeyRange(61, "Flute_B5_2", 83, 1859, 2259),
            new KeyRange(128, "Flute_B5_1", 83, 2418, 2818)
        ],
        [
            new KeyRange(128, "WoodenFlute_C5", 72, 11426, 15724)
        ],
        [
            new KeyRange(57, "Bassoon_C3", 48, 2428, 4284),
            new KeyRange(67, "Bassoon_C3", 48, 2428, 4284, new Envelope(40, 0, 0)),
            new KeyRange(76, "Bassoon_C3", 48, 2428, 4284, new Envelope(80, 0, 0)),
            new KeyRange(84, "EnglishHorn_F3", 53, 7538, 8930, new Envelope(40, 0, 0)),
            new KeyRange(128, "EnglishHorn_D4", 62, 4857, 5231)
        ],
        [
            new KeyRange(39, "Choir_F3", 53, 14007, 41281),
            new KeyRange(50, "Choir_F3", 53, 14007, 41281, new Envelope(40, 0, 0)),
            new KeyRange(61, "Choir_F3", 53, 14007, 41281, new Envelope(60, 0, 0)),
            new KeyRange(72, "Choir_F4", 65, 16351, 46436),
            new KeyRange(128, "Choir_F5", 77, 18440, 45391)
        ],
        [
            new KeyRange(38, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 100, 8)),
            new KeyRange(48, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 100, 7.5)),
            new KeyRange(59, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 60, 7)),
            new KeyRange(70, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 40, 6)),
            new KeyRange(78, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 20, 5)),
            new KeyRange(86, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 0, 4)),
            new KeyRange(128, "Vibraphone_C3", 48, 6202, 6370, new Envelope(0, 0, 3))
        ],
        [
            new KeyRange(128, "MusicBox_C4", 60, 14278, 14700, new Envelope(0, 0, 2))
        ],
        [
            new KeyRange(128, "SteelDrum_D5", 74.4, -1, -1, new Envelope(0, 0, 2))
        ],
        [
            new KeyRange(128, "Marimba_C4", 60, -1, -1)
        ],
        [
            new KeyRange(80, "SynthLead_C4", 60, 135, 1400),
            new KeyRange(128, "SynthLead_C6", 84, 124, 356)
        ],
        [
            new KeyRange(38, "SynthPad_A3", 57, 4212, 88017, new Envelope(50, 0, 0)),
            new KeyRange(50, "SynthPad_A3", 57, 4212, 88017, new Envelope(80, 0, 0)),
            new KeyRange(62, "SynthPad_A3", 57, 4212, 88017, new Envelope(110, 0, 0)),
            new KeyRange(74, "SynthPad_A3", 57, 4212, 88017, new Envelope(150, 0, 0)),
            new KeyRange(86, "SynthPad_A3", 57, 4212, 88017, new Envelope(200, 0, 0)),
            new KeyRange(128, "SynthPad_C6", 84, 2575, 9202)
        ]
    ];

    // -----------------------------
    // Scratch 2.0 Drum Definitions
    // ------------------------------

    // Each drum entry is an array of of the form:
    //
    //   sampleName, pitchAdjust, [loopStart, loopEnd, decay]
    //
    // pitchAdjust (pitch shift in semitones) adjusts the original pitch.
    // The loop points and decay parameter may be omitted if the drum is unlooped.
    // (A few drums are looped to create several different pitched drums from one sample.)
    public static drums: Array<Drum> = [
        new Drum("SnareDrum", 0),
        new Drum("Tom", 0),
        new Drum("SideStick", 0),
        new Drum("Crash", -7),
        new Drum("HiHatOpen", -8),
        new Drum("HiHatClosed", 0),
        new Drum("Tambourine", 0),
        new Drum("Clap", 0),
        new Drum("Claves", 0),
        new Drum("WoodBlock", -4),
        new Drum("Cowbell", 0),
        new Drum("Triangle", -6, 16843, 17255, 2),
        new Drum("Bongo", 2),
        new Drum("Conga", -7, 4247, 4499, 2), // jhm decay
        new Drum("Cabasa", 0),
        new Drum("GuiroLong", 0),
        new Drum("Vibraslap", -6),
        new Drum("Cuica", -5)
    ];

    public static getInstrumentPlayer(instNum: number, midiKey: number, secs: number): NotePlayer {
        // Return a NotePlayer for the given Scratch 2.0 instrument number (1..21)
        // and MIDI key (0..127). If the instrument is out of range, use 1.
        let keyRange = SoundBank.getNoteRecord(instNum - 1, midiKey);
        let player = new NotePlayer(Instr.samples[keyRange.sampleName], SoundBank.pitchForKey(keyRange.midiKey), keyRange.loopStart, keyRange.loopEnd, keyRange.envelope);
        player.setNoteAndDuration(midiKey, secs);
        return player;
    }

    public static getNoteRecord(instNum, midiKey): KeyRange {
        // Get a note record for the given instrument number.
        if (instNum < 0 || instNum >= SoundBank.instruments.length) instNum = 0;
        let keyRanges = SoundBank.instruments[instNum];
        for (let r = 0; r < keyRanges.length; r++) {
            let topOfKeyRange = keyRanges[r][0];
            if (midiKey <= topOfKeyRange) return keyRanges[r];
        }
        return keyRanges[keyRanges.length - 1]; // return the note record for the top key range.
    }

    public static pitchForKey(midiKey: number): number {
        return 440 * Math.pow(2, (midiKey - 69) / 12); // midi key 69 is A=440 Hz
    }

    public static getDrumPlayer(drumNum: number, isMIDI: boolean, secs: number): NotePlayer {
        // Return a NotePlayer for the given drum number.
        let drum = SoundBank.drums[drumNum - 1];
        if (drum == null) drum = SoundBank.drums[2];
        let loopStart = -1, loopEnd = -1, env = null;

        Instr.wav(drum.sampleName);

        if (!Instr.samples[drum.sampleName]) {
            console.log("loaded " + drum.sampleName);
            return;
        }

        let player = new NotePlayer(Instr.samples[drum.sampleName], SoundBank.pitchForKey(60), loopStart, loopEnd, env);
        player.setNoteAndDuration(60 + drum.pitchAdjust, 0);
        return player;
    }

}
