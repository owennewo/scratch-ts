System.register(["./wav.file"], function(exports_1) {
    var wav_file_1;
    var SoundDecoder;
    return {
        setters:[
            function (wav_file_1_1) {
                wav_file_1 = wav_file_1_1;
            }],
        execute: function() {
            // SoundDecoder.js
            // Decode WAV Files (8-bit, 16-bit, and ADPCM) for playing by Sprites.
            // For best performance, this should be run only once per WAV and
            // the decoded buffer should be cached.
            // Based almost entirely on John Maloney's AS implementation.
            SoundDecoder = (function () {
                function SoundDecoder(wavFileData) {
                    this.indexTable = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8];
                    this.stepTable = [
                        7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
                        50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230,
                        253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963,
                        1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327,
                        3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487,
                        12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
                    ];
                    this.soundData = null;
                    this.startOffset = 0;
                    this.endOffset = 0;
                    this.stepSize = 0;
                    this.adpcmBlockSize = 0;
                    this.bytePosition = 0;
                    this.soundChannel = null;
                    this.lastBufferTime = 0;
                    this.getSample = null;
                    this.fraction = 0.0;
                    this.thisSample = 0;
                    // decoder state
                    this.sample = 0;
                    this.index = 0;
                    this.lastByte = -1; // -1 indicates that there is no saved lastByte
                    this.nextSample = 0;
                    this.info = null;
                    this.getSample = this.getSample16Uncompressed;
                    if (wavFileData != null) {
                        var info = wav_file_1.WAVFile.decode(wavFileData);
                        this.info = info;
                        this.startOffset = info.sampleDataStart;
                        this.endOffset = this.startOffset + info.sampleDataSize;
                        this.soundData = new Uint8Array(wavFileData.slice(this.startOffset, this.endOffset));
                        this.stepSize = info.samplesPerSecond / 44100.0;
                        if (info.encoding === 17) {
                            this.adpcmBlockSize = info.adpcmBlockSize;
                            this.getSample = this.getSampleADPCM;
                        }
                        else {
                            if (info.bitsPerSample === 8)
                                this.getSample = this.getSample8Uncompressed;
                            if (info.bitsPerSample === 16)
                                this.getSample = this.getSample16Uncompressed;
                        }
                    }
                }
                ;
                SoundDecoder.prototype.noteFinished = function () {
                    // Called by subclasses to force ending condition to be true in writeSampleData()
                    this.bytePosition = this.endOffset;
                };
                ;
                // Used for Notes and Drums - Web Audio API ScriptProcessorNodes use this
                // as a callback function to fill the buffers with sample data.
                SoundDecoder.prototype.writeSampleData = function (evt) {
                    var i = 0;
                    var output = evt.outputBuffer.getChannelData(0);
                    // this.updateVolume();
                    for (i = 0; i < output.length; i++) {
                        var n = this.interpolatedSample();
                        output[i] = n;
                    }
                };
                ;
                // For pre-caching the samples of WAV sounds
                // Return a full list of samples generated by the decoder.
                SoundDecoder.prototype.getAllSamples = function () {
                    var samples = [], smp = 0;
                    smp = this.interpolatedSample();
                    while (smp != null) {
                        samples.push(smp);
                        smp = this.interpolatedSample();
                    }
                    return samples;
                };
                ;
                // Provide the next sample for the buffer
                SoundDecoder.prototype.interpolatedSample = function () {
                    this.fraction += this.stepSize;
                    while (this.fraction >= 1.0) {
                        this.thisSample = this.nextSample;
                        this.nextSample = this.getSample();
                        this.fraction -= 1.0;
                    }
                    if (this.nextSample === null) {
                        return null;
                    }
                    var out = this.fraction === 0 ? this.thisSample : this.thisSample + this.fraction * (this.nextSample - this.thisSample);
                    return out / 32768.0;
                };
                ;
                // 16-bit samples, big-endian
                SoundDecoder.prototype.getSample16Uncompressed = function () {
                    var result = 0;
                    if (this.bytePosition <= (this.info.sampleDataSize - 2)) {
                        result = (this.soundData[this.bytePosition + 1] << 8) + this.soundData[this.bytePosition];
                        if (result > 32767)
                            result -= 65536;
                        this.bytePosition += 2;
                    }
                    else {
                        this.bytePosition = this.endOffset;
                        result = null;
                    }
                    return result;
                };
                ;
                // 8-bit samples, uncompressed
                SoundDecoder.prototype.getSample8Uncompressed = function () {
                    if (this.bytePosition >= this.info.sampleDataSize)
                        return null;
                    return (this.soundData[this.bytePosition++] - 128) << 8;
                };
                ;
                /*SoundDecoder.prototype.updateVolume = function() {
                    if (this.client === null) {
                        this.volume = 1.0;
                        return;
                    }
                    if (this.client.volume === this.lastClientVolume) return; // optimization
                    this.volume = Math.max(0.0, Math.min(this.client.volume / 100.0, 1.0));
                    this.lastClientVolume = this.client.volume;
                }*/
                // Decoder for IMA ADPCM compressed sounds
                SoundDecoder.prototype.getSampleADPCM = function () {
                    // Decompress sample data using the IMA ADPCM algorithm.
                    // Note: Handles only one channel, 4-bits/sample.
                    var step = 0, code = 0, delta = 0;
                    if (this.bytePosition % this.adpcmBlockSize === 0 && this.lastByte < 0) {
                        if (this.bytePosition > this.info.sampleDataSize - 4)
                            return null;
                        this.sample = (this.soundData[this.bytePosition + 1] << 8) + this.soundData[this.bytePosition];
                        if (this.sample > 32767)
                            this.sample -= 65536;
                        this.index = this.soundData[this.bytePosition + 2];
                        this.bytePosition += 4;
                        if (this.index > 88)
                            this.index = 88;
                        this.lastByte = -1;
                        return this.sample;
                    }
                    else {
                        // read 4-bit code and compute delta
                        if (this.lastByte < 0) {
                            if (this.bytePosition >= this.info.sampleDataSize)
                                return null;
                            this.lastByte = this.soundData[this.bytePosition++];
                            code = this.lastByte & 0xF;
                        }
                        else {
                            code = (this.lastByte >> 4) & 0xF;
                            this.lastByte = -1;
                        }
                        step = this.stepTable[this.index];
                        delta = 0;
                        if (code & 4)
                            delta += step;
                        if (code & 2)
                            delta += step >> 1;
                        if (code & 1)
                            delta += step >> 2;
                        delta += step >> 3;
                        // compute next index
                        this.index += this.indexTable[code];
                        if (this.index > 88)
                            this.index = 88;
                        if (this.index < 0)
                            this.index = 0;
                        // compute and output sample
                        this.sample += code & 8 ? -delta : delta;
                        if (this.sample > 32767)
                            this.sample = 32767;
                        if (this.sample < -32768)
                            this.sample = -32768;
                        return this.sample;
                    }
                };
                return SoundDecoder;
            })();
            exports_1("SoundDecoder", SoundDecoder);
        }
    }
});
//# sourceMappingURL=sound.decoder.js.map