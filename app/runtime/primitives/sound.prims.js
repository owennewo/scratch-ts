System.register(["../../sound/sound.bank"], function(exports_1) {
    var sound_bank_1;
    var SoundPrims;
    return {
        setters:[
            function (sound_bank_1_1) {
                sound_bank_1 = sound_bank_1_1;
            }],
        execute: function() {
            // SoundPrimitives.as
            // John Maloney, June 2010
            //
            // Sound primitives.
            SoundPrims = (function () {
                function SoundPrims() {
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
                }
                SoundPrims.prototype.addPrimsTo = function (primTable) {
                    var _this = this;
                    primTable["playSound:"] = function (b, interp) { _this.primPlaySound(b, interp); };
                    primTable["doPlaySoundAndWait"] = this.primPlaySoundUntilDone;
                    primTable["stopAllSounds"] = function (b) {
                        console.log("todo stopAllSounds");
                        // this.ScratchSoundPlayer.stopAllSounds();
                    };
                    primTable["drum:duration:elapsed:from:"] = this.primPlayDrum; // Scratch 1.4 drum numbers
                    primTable["playDrum"] = this.primPlayDrum;
                    primTable["rest:elapsed:from:"] = this.primPlayRest;
                    primTable["noteOn:duration:elapsed:from:"] = this.primPlayNote;
                    primTable["midiInstrument:"] = this.primSetInstrument; // Scratch 1.4 instrument numbers
                    primTable["instrument:"] = this.primSetInstrument;
                    primTable["changeVolumeBy:"] = this.primChangeVolume;
                    primTable["setVolumeTo:"] = this.primSetVolume;
                    primTable["volume"] = this.primVolume;
                    primTable["changeTempoBy:"] = function (b, interp) {
                        interp.stage.tempo = interp.stage.tempo + interp.numarg(b, 0);
                        interp.redraw();
                    };
                    primTable["setTempoTo:"] = function (b, interp) {
                        interp.stage.tempo = interp.numarg(b, 0);
                        interp.redraw();
                    };
                    primTable["tempo"] = function (b, interp) { return interp.stage.tempo; };
                };
                SoundPrims.prototype.playSound = function (interp, snd) {
                    var runtime = interp.stage.runtime;
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
                    snd.runtime.source.done = false;
                    snd.runtime.source.finished = function () {
                        // Remove from the active audio list and disconnect the source from
                        // the sound dictionary.
                        var i = runtime.audioPlaying.indexOf(snd.runtime);
                        if (i > -1 && runtime.audioPlaying[i].source != null) {
                            runtime.audioPlaying[i].source.done = true;
                            runtime.audioPlaying[i].source = null;
                            runtime.audioPlaying.splice(i, 1);
                        }
                    };
                    window.setTimeout(snd.runtime.source.finished, snd.runtime.buffer.duration * 1000);
                    // Add the global list of playing sounds and start playing.
                    runtime.audioPlaying.push(snd.runtime);
                    snd.runtime.source.start();
                    return snd.runtime.source;
                };
                ;
                SoundPrims.prototype.playDrum = function (interp, drum, isMidi, secs, client) {
                    var runtime = interp.stage.runtime;
                    var player = sound_bank_1.SoundBank.getDrumPlayer(drum, isMidi, secs);
                    // player.client = client;
                    player.setDuration(secs);
                    var source = runtime.audioContext.createScriptProcessor(4096, 1, 1);
                    source.onaudioprocess = function (e) { player.writeSampleData(e); };
                    source.soundPlayer = player;
                    source.connect(runtime.audioGain);
                    runtime.notesPlaying.push(source);
                    source.finished = function () {
                        var i = runtime.notesPlaying.indexOf(source);
                        if (i > -1 && runtime.notesPlaying[i] != null) {
                            runtime.notesPlaying.splice(i, 1);
                        }
                    };
                    window.setTimeout(source.finished, secs * 1000);
                    return player;
                };
                ;
                SoundPrims.prototype.playNote = function (interp, instrument, midiKey, secs, client) {
                    var player = sound_bank_1.SoundBank.getNotePlayer(instrument, midiKey);
                    // player.client = client;
                    player.setNoteAndDuration(midiKey, secs);
                    var runtime = interp.stage.runtime;
                    var source = runtime.audioContext.createScriptProcessor(4096, 1, 1);
                    source.onaudioprocess = function (e) { player.writeSampleData(e); };
                    source.connect(runtime.audioGain);
                    runtime.notesPlaying.push(source);
                    source.finished = function () {
                        var i = runtime.notesPlaying.indexOf(source);
                        if (i > -1 && runtime.notesPlaying[i] != null) {
                            runtime.notesPlaying.splice(i, 1);
                        }
                    };
                    window.setTimeout(source.finished, secs * 1000);
                    return player;
                };
                SoundPrims.prototype.stopAllSounds = function (interp) {
                    var runtime = interp.stage.runtime;
                    var oldAudio = runtime.audioPlaying;
                    runtime.audioPlaying = [];
                    for (var s = 0; s < oldAudio.length; s++) {
                        if (oldAudio[s].source) {
                            oldAudio[s].source.disconnect();
                            oldAudio[s].source.finished();
                        }
                    }
                    var oldNotes = runtime.notesPlaying;
                    runtime.notesPlaying = [];
                    for (var s = 0; s < oldNotes.length; s++) {
                        if (oldNotes[s]) {
                            oldNotes[s].disconnect();
                            oldNotes[s].finished();
                        }
                    }
                };
                ;
                SoundPrims.prototype.primPlaySound = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s == null)
                        return;
                    var snd = s.soundNamed(interp.arg(b, 0));
                    if (snd != null)
                        this.playSound(interp, snd);
                };
                SoundPrims.prototype.primPlaySoundUntilDone = function (b, interp) {
                    var activeThread = interp.activeThread;
                    if (activeThread.firstTime) {
                        var snd = interp.targetSprite().soundNamed(interp.arg(b, 0));
                        if (snd == null)
                            return;
                        activeThread.tmpObj = this.playSound(interp, snd);
                        activeThread.firstTime = false;
                    }
                    var player = activeThread.tmpObj;
                    if (player == null || player.done || player.playbackState === 3) {
                        activeThread.tmpObj = null;
                        activeThread.firstTime = true;
                    }
                    else {
                        interp.doYield();
                    }
                };
                SoundPrims.prototype.primPlayNote = function (b, interp) {
                    var s = interp.targetSprite();
                    if (s == null)
                        return;
                    if (interp.activeThread.firstTime) {
                        var key = interp.numarg(b, 0);
                        var secs = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 1));
                        this.playNote(interp, s.runtime.instrument, key, secs, s);
                        interp.startTimer(secs);
                    }
                    else {
                        interp.checkTimer();
                    }
                };
                SoundPrims.prototype.primPlayDrum = function (b, interp) {
                    var s = interp.targetObj();
                    if (s == null)
                        return;
                    if (interp.activeThread.firstTime) {
                        var drum = Math.round(interp.numarg(b, 0));
                        var isMIDI = (b.spec.code === "drum:duration:elapsed:from:");
                        var secs = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 1));
                        this.playDrum(interp, drum, isMIDI, 10, s); // always play entire drum sample
                        interp.startTimer(secs);
                    }
                    else {
                        interp.checkTimer();
                    }
                };
                SoundPrims.prototype.primPlayRest = function (b, interp) {
                    var s = interp.targetObj();
                    if (s == null)
                        return;
                    if (interp.activeThread.firstTime) {
                        var secs = SoundPrims.beatsToSeconds(interp, interp.numarg(b, 0));
                        interp.startTimer(secs);
                    }
                    else {
                        interp.checkTimer();
                    }
                };
                SoundPrims.beatsToSeconds = function (interp, beats) {
                    return (beats * 60) / interp.stage.tempo;
                };
                SoundPrims.prototype.primSetInstrument = function (b, interp) {
                    // Set Scratch 2.0 instrument.
                    console.log("todo primSetInstrument");
                    var instr = interp.numarg(b, 0) - 1;
                    if (b.spec.code === "midiInstrument:") {
                        // map old to new instrument number
                        instr = this.instrumentMap[instr] - 1; // maps to -1 if out of range
                    }
                    instr = Math.max(0, Math.min(instr, sound_bank_1.SoundBank.instruments.length - 1));
                    if (interp.targetObj())
                        interp.targetSprite().runtime.instrument = instr;
                };
                SoundPrims.prototype.primChangeVolume = function (b, interp) {
                    var s = interp.targetObj();
                    if (s != null) {
                        s.runtime.setVolume(s.runtime.volume + interp.numarg(b, 0));
                        interp.redraw();
                    }
                };
                SoundPrims.prototype.primSetVolume = function (b, interp) {
                    var s = interp.targetObj();
                    if (s != null) {
                        s.runtime.setVolume(interp.numarg(b, 0));
                        interp.redraw();
                    }
                };
                SoundPrims.prototype.primVolume = function (b, interp) {
                    var s = interp.targetObj();
                    return (s != null) ? s.runtime.volume : 0;
                };
                return SoundPrims;
            })();
            exports_1("SoundPrims", SoundPrims);
        }
    }
});
//# sourceMappingURL=sound.prims.js.map