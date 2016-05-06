System.register([], function(exports_1) {
    "use strict";
    var SoundPrims;
    return {
        setters:[],
        execute: function() {
            // SoundPrimitives.as
            // John Maloney, June 2010
            //
            // Sound primitives.
            SoundPrims = (function () {
                function SoundPrims(app, interpreter) {
                    // Map from a Scratch 1.4 (i.e. MIDI) instrument number to the closest Scratch 2.0 equivalent.
                    this.instrumentMap = [
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
                    this.app = app;
                    this.interp = interpreter;
                }
                SoundPrims.prototype.addPrimsTo = function (primTable) {
                    primTable["playSound:"] = this.primPlaySound;
                    primTable["doPlaySoundAndWait"] = this.primPlaySoundUntilDone;
                    primTable["stopAllSounds"] = function (b) { this.ScratchSoundPlayer.stopAllSounds(); };
                    primTable["drum:duration:elapsed:from:"] = this.primPlayDrum; // Scratch 1.4 drum numbers
                    primTable["playDrum"] = this.primPlayDrum;
                    primTable["rest:elapsed:from:"] = this.primPlayRest;
                    primTable["noteOn:duration:elapsed:from:"] = this.primPlayNote;
                    primTable["midiInstrument:"] = this.primSetInstrument; // Scratch 1.4 instrument numbers
                    primTable["instrument:"] = this.primSetInstrument;
                    primTable["changeVolumeBy:"] = this.primChangeVolume;
                    primTable["setVolumeTo:"] = this.primSetVolume;
                    primTable["volume"] = this.primVolume;
                    primTable["changeTempoBy:"] = function (b) {
                        this.app.stagePane.setTempo(this.app.stagePane.tempoBPM + this.interp.numarg(this.b, 0));
                        this.interp.redraw();
                    };
                    primTable["setTempoTo:"] = function (b) {
                        this.app.stagePane.setTempo(this.interp.numarg(this.b, 0));
                        this.interp.redraw();
                    };
                    primTable["tempo"] = function (b) { return this.app.stagePane.tempoBPM; };
                };
                SoundPrims.prototype.primPlaySound = function (b) {
                    var snd = this.interp.targetObj().findSound(this.interp.arg(b, 0));
                    if (snd != null)
                        this.playSound(snd, this.interp.targetObj());
                };
                SoundPrims.prototype.primPlaySoundUntilDone = function (b) {
                    var activeThread = this.interp.activeThread;
                    if (activeThread.firstTime) {
                        var snd = this.interp.targetObj().findSound(this.interp.arg(b, 0));
                        if (snd === null)
                            return;
                        activeThread.tmpObj = this.playSound(snd, this.interp.targetObj());
                        activeThread.firstTime = false;
                    }
                    var player = activeThread.tmpObj;
                    if ((player === null) || (player.atEnd())) {
                        activeThread.tmp = 0;
                        activeThread.firstTime = true;
                    }
                    else {
                        this.interp.doYield();
                    }
                };
                SoundPrims.prototype.primPlayNote = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    if (this.interp.activeThread.firstTime) {
                        var key = this.interp.numarg(b, 0);
                        var secs = this.beatsToSeconds(this.interp.numarg(b, 1));
                        this.interp.activeThread.tmpObj = this.playNote(s.instrument, key, secs, s);
                        this.interp.startTimer(secs);
                    }
                    else {
                        this.interp.checkTimer();
                    }
                };
                SoundPrims.prototype.primPlayDrum = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    if (this.interp.activeThread.firstTime) {
                        var drum = Math.round(this.interp.numarg(b, 0));
                        var isMIDI = (b.op === "drum:duration:elapsed:from:");
                        var secs = this.beatsToSeconds(this.interp.numarg(b, 1));
                        this.playDrum(drum, isMIDI, 10, s); // always play entire drum sample
                        this.interp.startTimer(secs);
                    }
                    else {
                        this.interp.checkTimer();
                    }
                };
                SoundPrims.prototype.playSound = function (s, client) {
                    var player = s.sndplayer();
                    player.client = client;
                    player.startPlaying();
                    return player;
                };
                SoundPrims.prototype.playDrum = function (drum, isMIDI, secs, client) {
                    var player = SoundBank.getDrumPlayer(drum, isMIDI, secs);
                    if (player === null)
                        return null;
                    player.client = client;
                    player.setDuration(secs);
                    player.startPlaying();
                    return player;
                };
                SoundPrims.prototype.playNote = function (instrument, midiKey, secs, client) {
                    var player = SoundBank.getNotePlayer(instrument, midiKey);
                    if (player === null)
                        return null;
                    player.client = client;
                    player.setNoteAndDuration(midiKey, secs);
                    player.startPlaying();
                    return player;
                };
                SoundPrims.prototype.primPlayRest = function (b) {
                    var s = this.interp.targetObj();
                    if (s === null)
                        return;
                    if (this.interp.activeThread.firstTime) {
                        var secs = this.beatsToSeconds(this.interp.numarg(b, 0));
                        this.interp.startTimer(secs);
                    }
                    else {
                        this.interp.checkTimer();
                    }
                };
                SoundPrims.prototype.beatsToSeconds = function (beats) {
                    return (beats * 60) / this.app.stagePane.tempoBPM;
                };
                SoundPrims.prototype.primSetInstrument = function (b) {
                    // Set Scratch 2.0 instrument.
                    var instr = this.interp.numarg(b, 0) - 1;
                    if (b.op === "midiInstrument:") {
                        // map old to new instrument number
                        instr = this.instrumentMap[instr] - 1; // maps to -1 if out of range
                    }
                    instr = Math.max(0, Math.min(instr, SoundBank.instrumentNames.length - 1));
                    if (this.interp.targetObj())
                        this.interp.targetObj().instrument = instr;
                };
                SoundPrims.prototype.primChangeVolume = function (b) {
                    var s = this.interp.targetObj();
                    if (s != null) {
                        s.setVolume(s.volume + this.interp.numarg(b, 0));
                        this.interp.redraw();
                    }
                };
                SoundPrims.prototype.primSetVolume = function (b) {
                    var s = this.interp.targetObj();
                    if (s != null) {
                        s.setVolume(this.interp.numarg(b, 0));
                        this.interp.redraw();
                    }
                };
                SoundPrims.prototype.primVolume = function (b) {
                    var s = this.interp.targetObj();
                    return (s != null) ? s.volume : 0;
                };
                return SoundPrims;
            }());
            exports_1("SoundPrims", SoundPrims);
        }
    }
});
//# sourceMappingURL=SoundPrims.js.map