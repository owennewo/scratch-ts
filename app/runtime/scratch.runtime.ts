import {SpriteModel} from "../model/sprite.model";
import {BlockArgModel} from "../model/blockarg.model";
import {ListWatcher} from "./list.watcher";
import {CostumeModel} from "../model/costume.model";
import {BlockModel} from "../model/block.model";
import {SpecOperation} from "../model/spec.model";
import {StageModel} from "../model/stage.model";
import {ScratchTime} from "./scratch.time";
import {ObjectModel} from "../model/object.model";
import {VideoMotionPrims} from "./primitives/video.motion.prims";
import {Interpreter} from "./interpreter";
import {Scratch} from "./scratch";
// ScratchRuntime.as
// John Maloney, September 2010

export class ScratchRuntime {

    public app: Scratch;
    public interp: Interpreter;
    public motionDetector: VideoMotionPrims;
    public keyIsDown: any[] = new Array(128); // records key up/down state
    public shiftIsDown: boolean;
    public lastAnswer: string = "";
    public cloneCount: number;
    public edgeTriggersEnabled: boolean = false; // initially false, becomes true when project first run
    public currentDoObj: ObjectModel = null;

    // private microphone: Microphone;
    private timerBase: number;

    protected projectToInstall: StageModel;
    protected saveAfterInstall: boolean;

    constructor(app: Scratch, interp: Interpreter) {
        this.app = app;
        this.interp = interp;
        this.timerBase = interp.currentMSecs;
        // this.clearKeyDownArray();
    }

    // -----------------------------
    // Running and stopping
    // ------------------------------

    public stepRuntime(): void {
        let count: number = 0;
        // if (this.projectToInstall !== null && (this.app.isOffline || this.app.isExtensionDevMode)) {
        //     this.installProject(this.projectToInstall);
        //     //            if (this.saveAfterInstall) this.app.setSaveNeeded(true);
        //     this.projectToInstall = null;
        //     this.saveAfterInstall = false;
        //     return;
        // }
        if (this.ready === ReadyLabel.COUNTDOWN) {
            let tR: number = ScratchTime.getTimer() * .001 - this.videoSeconds;
            // while (t > this.videoSounds.length / this.videoFramerate + 1 / this.videoFramerate) {
            //     this.saveSound();
            // }
            count = 3;
            if (tR >= 3.75) {
                this.ready = ReadyLabel.READY;
                count = 1;
                this.videoSounds = [];
                this.videoFrames = [];
                if (this.fullEditor) console.log("Editor video started", { projectID: this.app.projectID });
                else Log.track("Project video started", { projectID: this.app.projectID });
            }
            else if (tR >= 2.5) {
                count = 1;
            }
            else if (tR >= 1.25 && this.micReady) {
                count = 2;
            }
            else if (tR >= 1.25) {
                this.videoSeconds += tR;
            }
            else {
                this.app.refreshStagePart();
            }
        }
        if (this.recording) { // Recording a YouTube video?
            let t: number = ScratchTime.getTimer() * .001 - this.videoSeconds;
            // If, based on time and framerate, the current frame needs to be in the video, capture the frame.
            // Will always be true if framerate is 30, as every frame is captured.
            if (t > this.videoSounds.length / this.videoFramerate + 1 / this.videoFramerate) {
                if (this.fullEditor) this.app.removeRecordingTools();
                // saves visual frame to frames and sound clip to sounds
                this.saveFrame();
                this.app.updateRecordingTools(t);
            }
            else {
                // Will only run in low quality or full editor mode, when this frame isn"t captured for video
                // To reduce lag in low quality mode and full editor mode, video frames are only written
                // to the file if a new frame isn"t being captured and the total number of frames captured so far
                // is divisible by 2 or 3.
                // Some frames will be written to the file after recording has finished.
                this.app.updateRecordingTools(t);
                if (this.videoFrames.length > this.videoPosition && (this.videoFrames.length % 2 === 0 || this.videoFrames.length % 3 === 0)) {
                    // todo: port flvencoder
                    // 			this.baFlvEncoder.addFrame(this.videoFrames[this.videoPosition],this.videoSounds[this.videoPosition]);
                    // forget about frame just written
                    this.videoFrames[this.videoPosition] = null;
                    this.videoSounds[this.videoPosition] = null;
                    this.videoPosition++;
                }
            }
            // For a high quality video, every frame is immediately written to the video file
            // after being captured, to reduce memory.
            if (this.videoFrames.length > this.videoPosition && this.videoFramerate === 30.0) {
                // todo: port flvencoder
                // this.baFlvEncoder.addFrame(this.videoFrames[this.videoPosition],this.videoSounds[this.videoPosition]);
                // forget about frame just written
                this.videoFrames[this.videoPosition] = null;
                this.videoSounds[this.videoPosition] = null;
                this.videoPosition++;
            }
        }
        //        this.app.extensionManager.step();
        if (this.motionDetector) this.motionDetector.step(); //  Video motion detection

        //  Step the stage, sprites, and watchers
        this.app.stage.runtime.step();

        //  run scripts and commit any pen strokes
        this.processEdgeTriggeredHats();
        this.interp.stepThreads();
        this.app.stage.runtime.commitPenStrokes();

        if (this.ready === ReadyLabel.COUNTDOWN || this.ready === ReadyLabel.READY) {
            this.app.stage.runtime.countdown(count);
        }
    }

    // -------- recording video code ---------
    public recording: boolean;
    private videoFrames: any[] = [];
    private videoSounds: any[] = [];
    private videoTimer: number;
    // private baFlvEncoder:ByteArrayFlvEncoder;
    private videoPosition: number;
    private videoSeconds: number;
    private videoAlreadyDone: number;

    private projectSound: boolean;
    private micSound: boolean;
    private showCursor: boolean;
    public fullEditor: boolean;
    private videoFramerate: number;
    private videoWidth: number;
    private videoHeight: number;
    public ready: number = ReadyLabel.NOT_READY;

    // private micBytes: ByteArray;
    // private micPosition: number = 0;
    // private mic: Microphone;
    private micReady: boolean;

    private timeout: number;

    private saveFrame(): void {
        console.log("todo saveFrame");
        // this.saveSound();
        // let t: number = Time.getTimer() * .001 - this.videoSeconds;
        // while (t > this.videoSounds.length / this.videoFramerate + 1 / this.videoFramerate) {
        //     this.saveSound();
        // }
        // if (this.showCursor) let cursor: DisplayObject = Resources.createDO("videoCursor");
        // if (this.showCursor && this.app.gh.mouseIsDown) let circle: Bitmap = Resources.createBmp("mouseCircle");
        // let f: BitmapData;
        // if (this.fullEditor) {
        //     let aWidth: number = this.app.stage.stageWidth;
        //     let aHeight: number = this.app.stage.stageHeight;
        //     if (!Scratch.app.isIn3D) {
        //         if (this.app.stagePane.videoImage) this.app.stagePane.videoImage.visible = false;
        //     }
        //     if (this.videoWidth !== aWidth || this.videoHeight !== aHeight) {
        //         let scale: number = 1.0;
        //         scale = this.videoWidth / aWidth > this.videoHeight / aHeight ? this.videoHeight / aHeight : this.videoWidth / aWidth;
        //         let m: Matrix = new Matrix();
        //         m.scale(scale, scale);
        //         f = new BitmapData(this.videoWidth, this.videoHeight, false);
        //         f.draw(this.app.stage, m, null, null, new Rectangle(0, 0, aWidth * scale, aHeight * scale), false);
        //         if (Scratch.app.isIn3D) {
        //             let scaled: number = scale;
        //             if (!this.app.editMode) {
        //                 scaled *= this.app.presentationScale;
        //             }
        //             else if (this.app.stageIsContracted) {
        //                 scaled *= 0.5;
        //             }
        //             let d: BitmapData = this.app.stagePane.saveScreenData();
        //             f.draw(d, new Matrix(scaled, 0, 0, scaled, this.app.stagePane.localToGlobal(new Point(0, 0)).x * scale, this.app.stagePane.localToGlobal(new Point(0, 0)).y * scale));
        //         }
        //         else if (this.app.stagePane.videoImage) this.app.stagePane.videoImage.visible = true;
        //         if (this.showCursor && this.app.gh.mouseIsDown) {
        //             f.draw(circle, new Matrix(scale, 0, 0, scale, (this.app.stage.mouseX - circle.width / 2.0) * scale, (this.app.stage.mouseY - circle.height / 2.0) * scale));
        //         }
        //         if (this.showCursor) {
        //             f.draw(cursor, new Matrix(scale, 0, 0, scale, this.app.stage.mouseX * scale, this.app.stage.mouseY * scale));
        //         }
        //     }
        //     else {
        //         f = new BitmapData(this.videoWidth, this.videoHeight, false);
        //         f.draw(this.app.stage);
        //         if (Scratch.app.isIn3D) {
        //             let scaler: number = 1;
        //             if (!this.app.editMode) {
        //                 scaler *= this.app.presentationScale;
        //             }
        //             else if (this.app.stageIsContracted) {
        //                 scaler *= 0.5;
        //             }
        //             let e: BitmapData = this.app.stagePane.saveScreenData();
        //             if (scaler === 1) f.copyPixels(e, e.rect, new Point(this.app.stagePane.localToGlobal(new Point(0, 0)).x, this.app.stagePane.localToGlobal(new Point(0, 0)).y));
        //             else f.draw(e, new Matrix(scaler, 0, 0, scaler, this.app.stagePane.localToGlobal(new Point(0, 0)).x, this.app.stagePane.localToGlobal(new Point(0, 0)).y));
        //         }
        //         else if (this.app.stagePane.videoImage) this.app.stagePane.videoImage.visible = true;
        //         if (this.showCursor && this.app.gh.mouseIsDown) {
        //             f.copyPixels(circle.bitmapData, circle.bitmapData.rect, new Point(this.app.stage.mouseX - circle.width / 2.0, this.app.stage.mouseY - circle.height / 2.0));
        //         }
        //         if (this.showCursor) {
        //             f.draw(cursor, new Matrix(1, 0, 0, 1, this.app.stage.mouseX, this.app.stage.mouseY));
        //         }
        //     }
        // }
        // else {
        //     f = this.app.stagePane.saveScreenData();
        //     if (this.showCursor && this.app.gh.mouseIsDown) {
        //         f.copyPixels(circle.bitmapData, circle.bitmapData.rect, new Point(this.app.stagePane.mouseX - circle.width / 2.0, this.app.stagePane.mouseY - circle.height / 2.0));
        //     }
        //     if (this.showCursor) {
        //         f.draw(cursor, new Matrix(1, 0, 0, 1, this.app.stagePane.scratchMouseX() + 240, -this.app.stagePane.scratchMouseY() + 180));
        //     }
        // }
        // while (this.videoSounds.length > this.videoFrames.length) {
        //     this.videoFrames.push(f);
        // }
    }

    private saveSound(): void {
        console.log("todo save sound");
        //     let floats: any[] = [];
        //     /*
        // if (this.micSound && this.micBytes.length>0) {
        //     this.micBytes.position=this.micPosition;
        //
        //     while (this.micBytes.length>this.micBytes.position && floats.length<=this.baFlvEncoder.audioFrameSize/4) {
        //         floats.push(this.micBytes.readFloat());
        //     }
        //     this.micPosition = this.micBytes.position;
        //     this.micBytes.position = this.micBytes.length;
        // }
        // while (floats.length<=this.baFlvEncoder.audioFrameSize/4) {
        //     floats.push(0);
        // }
        // */
        //     if (this.projectSound) {
        //         for (let p: number = 0; p < ScratchSoundPlayer.activeSounds.length; p++) {
        //             let index: number = 0;
        //             let d: ScratchSoundPlayer = ScratchSoundPlayer.activeSounds[p];
        //             d.dataBytes.position = d.readPosition;
        //             while (index < floats.length && d.dataBytes.position < d.dataBytes.length) {
        //                 floats[index] += d.dataBytes.readFloat();
        //                 if (p === ScratchSoundPlayer.activeSounds.length - 1) {
        //                     if (floats[index] < -1 || floats[index] > 1) {
        //                         let current1: number = p + 1 + (this.micSound ? 1 : 0);
        //                         floats[index] = floats[index] / current1;
        //                     }
        //                 }
        //                 index++;
        //             }
        //             d.readPosition = d.dataBytes.position;
        //             d.dataBytes.position = d.dataBytes.length;
        //         }
        //     }
        //     let combinedStream: ByteArray = new ByteArray();
        //     for (let n of floats) {
        //         combinedStream.writeFloat(n);
        //     }
        //     floats = null;
        //     this.videoSounds.push(combinedStream);
        //     combinedStream = null;
    }
    // todo: port sample data
    //  private micSampleDataHandler(event:SampleDataEvent):void
    //  {
    //     while(event.data.bytesAvailable)
    //     {
    //         let sample:number = event.data.readFloat();
    //         this.micBytes.writeFloat(sample);
    //         this.micBytes.writeFloat(sample);
    //     }
    // }

    // public startVideo(editor: RecordingSpecEditor): void {
    //     this.projectSound = editor.soundFlag();
    //     this.micSound = editor.microphoneFlag();
    //     this.fullEditor = editor.editorFlag();
    //     this.showCursor = editor.cursorFlag();
    //     this.videoFramerate = (!editor.fifteenFlag()) ? 15.0 : 30.0;
    //     if (this.fullEditor) {
    //         this.videoFramerate = 10.0;
    //     }
    //     this.micReady = true;
    //     if (this.micSound) {
    //         this.mic = Microphone.getMicrophone();
    //         this.mic.setSilenceLevel(0);
    //         this.mic.gain = editor.getMicVolume();
    //         this.mic.rate = 44;
    //         this.micReady = false;
    //     }
    //     if (this.fullEditor) {
    //         if (this.app.stage.stageWidth < 960 && this.app.stage.stageHeight < 640) {
    //             this.videoWidth = this.app.stage.stageWidth;
    //             this.videoHeight = this.app.stage.stageHeight;
    //         }
    //         else {
    //             let ratio: number = this.app.stage.stageWidth / this.app.stage.stageHeight;
    //             if (960 / ratio < 640) {
    //                 this.videoWidth = 960;
    //                 this.videoHeight = 960 / ratio;
    //             }
    //             else {
    //                 this.videoWidth = 640 * ratio;
    //                 this.videoHeight = 640;
    //             }
    //         }
    //     }
    //     else {
    //         this.videoWidth = 480;
    //         this.videoHeight = 360;
    //     }
    //     this.ready = ReadyLabel.COUNTDOWN;
    //     this.videoSeconds = Time.getTimer() * .001;
    //     // todo port flv
    //     // this.baFlvEncoder = new ByteArrayFlvEncoder(this.videoFramerate);
    //     // this.baFlvEncoder.setVideoProperties(this.videoWidth, this.videoHeight);
    //     // this.baFlvEncoder.setAudioProperties(FlvEncoder.SAMPLERATE_44KHZ, true, true, true);
    //     // this.baFlvEncoder.start();
    //     this.waitAndStart();
    // }
    //
    // public exportToVideo(): void {
    //     let specEditor: RecordingSpecEditor = new RecordingSpecEditor();
    //     function startCountdown(): void {
    //         this.startVideo(specEditor);
    //     }
    //     DialogBox.close("Record Project Video", null, specEditor, "Start", this.app.stage, startCountdown);
    // }
    //
    // public stopVideo(): void {
    //     if (this.recording) {
    //         // todo: port event
    //         // this.videoTimer.dispatchEvent(new Event("TIMER"));
    //     }
    //     else if (this.ready === ReadyLabel.COUNTDOWN || ReadyLabel.READY) {
    //         this.ready = ReadyLabel.NOT_READY;
    //         this.app.refreshStagePart();
    //         this.app.stagePane.countdown(0);
    //     }
    // }
    //
    // public finishVideoExport(event: Event): void {
    //     this.stopRecording();
    //     this.stopAll();
    //     this.app.addLoadProgressBox("Writing video to file...");
    //     this.videoAlreadyDone = this.videoPosition;
    //     clearTimeout(this.timeout);
    //     this.timeout = window.setTimeout(this.saveRecording, 1);
    // }
    //
    // public waitAndStart(): void {
    //     if (!this.micReady && !this.mic.hasEventListener("STATUS")) {
    //         this.micBytes = new ByteArray();
    //         // TODO: port sample data
    //         // this.mic.addEventListener("SAMPLE_DATA", this.micSampleDataHandler);
    //         this.micReady = true;
    //     }
    //     if (this.ready === ReadyLabel.COUNTDOWN || this.ready === ReadyLabel.NOT_READY) {
    //         if (this.ready === ReadyLabel.NOT_READY) {
    //             // TODO: port encoder equiv
    //             // this.baFlvEncoder=null;
    //             return;
    //         }
    //         clearTimeout(this.timeout);
    //         this.timeout = window.setTimeout(this.waitAndStart, 1);
    //         return;
    //     }
    //     this.app.stagePane.countdown(0);
    //     this.ready = ReadyLabel.NOT_READY;
    //     this.app.refreshStagePart();
    //     let player: ScratchSoundPlayer, length: number;
    //     this.videoSeconds = Time.getTimer() * 0.001;
    //     for (player of ScratchSoundPlayer.activeSounds) {
    //         length = Math.floor((player.soundChannel.position * .001) * this.videoFramerate);
    //         // todo: port encoder
    //         // player.readPosition = Math.max(Math.min(this.baFlvEncoder.audioFrameSize*length,player.dataBytes.length),0);
    //     }
    //     this.clearRecording();
    //     this.recording = true;
    //     let seconds: number = 60; // modify to change length of video
    //     this.videoTimer = window.setTimeout(1000 * seconds, this.finishVideoExport);
    //     // this.videoTimer.addEventListener("TIMER", this.finishVideoExport);
    //     // this.videoTimer.start();
    // }
    //
    // public stopRecording(): void {
    //     this.recording = false;
    //     window.clearTimeout(this.videoTimer);
    //     // this.videoTimer.stop();
    //     // this.videoTimer.removeEventListener("TIMER", this.finishVideoExport);
    //     this.videoTimer = null;
    //     // if (fullEditor && app.render3D) app.go3D();
    //     this.app.refreshStagePart();
    // }
    //
    // public clearRecording(): void {
    //     this.recording = false;
    //     this.videoFrames = [];
    //     this.videoSounds = [];
    //     this.micBytes = new ByteArray();
    //     this.micPosition = 0;
    //     this.videoPosition = 0;
    //     // System.gc();
    //     this.ready = ReadyLabel.NOT_READY;
    //     // console.log("mem: " + System.totalMemory);
    // }
    //
    // public saveRecording(): void {
    //     // any captured frames that haven"t been written to file yet are written here
    //     if (this.videoFrames.length > this.videoPosition) {
    //         for (let b: number = 0; b < 20; b++) {
    //             if (this.videoPosition >= this.videoFrames.length) {
    //                 break;
    //             }
    //             // todo: port encoder
    //             // this.baFlvEncoder.addFrame(this.videoFrames[this.videoPosition],this.videoSounds[this.videoPosition]);
    //             this.videoFrames[this.videoPosition] = null;
    //             this.videoSounds[this.videoPosition] = null;
    //             this.videoPosition++;
    //         }
    //         if (this.app.lp) this.app.lp.setProgress(Math.min((this.videoPosition - this.videoAlreadyDone) / (this.videoFrames.length - this.videoAlreadyDone), 1));
    //         clearTimeout(this.timeout);
    //         this.timeout = window.setTimeout(this.saveRecording, 1);
    //         return;
    //     }
    //     let seconds: number = this.videoFrames.length / this.videoFramerate;
    //     this.app.removeLoadProgressBox();
    //     // todo: port encoder
    //     // this.baFlvEncoder.updateDurationMetadata();
    //     if (this.micSound) {
    //
    //         // this.mic.removeEventListener("SAMPLE_DATA", this.micSampleDataHandler);
    //         this.mic = null;
    //     }
    //     this.videoFrames = [];
    //     this.videoSounds = [];
    //     this.micBytes = null;
    //     this.micPosition = 0;
    //     let video: ByteArray;
    //     // todo: port encoder
    //     // video = this.baFlvEncoder.byteArray;
    //     // this.baFlvEncoder.kill();
    //     function saveFile(): void {
    //         let file: FileReference = new FileReference();
    //         this.file.save(video, "movie.flv");
    //         Scratch.app.log(LogLevel.TRACK, "Video downloaded", { projectID: this.app.projectID, seconds: this.roundToTens(seconds), megabytes: this.roundToTens(video.length / 1000000) });
    //         let specEditor: SharingSpecEditor = new SharingSpecEditor();
    //         DialogBox.close("Playing and Sharing Your Video", null, this.specEditor, "Back to Scratch");
    //         this.releaseVideo(false);
    //     }
    //     function releaseVideo(log: boolean = true): void {
    //         if (this.log) Scratch.app.log(LogLevel.TRACK, "Video canceled", { projectID: this.app.projectID, seconds: this.roundToTens(seconds), megabytes: this.roundToTens(video.length / 1000000) });
    //         video = null;
    //     }
    //     DialogBox.close("Video Finished!", "To save, click the button below.", null, "Save and Download", this.app.stage, saveFile, releaseVideo, null, true);
    // }

    private roundToTens(x: number): number {
        return Math.floor((x) * 10) / 10.;
    }

    // ----------

    // -----------------------------
    // Hat BlockModels
    // ------------------------------


    public startClickedHats(clickedObj: ObjectModel): void {
        for (let script of clickedObj.scripts) {
            if (script.firstBlock.spec.code === "whenClicked") {
                this.interp.restartThread(script.firstBlock, clickedObj);
            }
        }
    }

    public startKeyHats(ch: number): void {
        let keyName: string = null;
        if (("a".charCodeAt(0) <= ch) && (ch <= "z".charCodeAt(0))) keyName = String.fromCharCode(ch);
        if (("0".charCodeAt(0) <= ch) && (ch <= "9".charCodeAt(0))) keyName = String.fromCharCode(ch);
        if (28 === ch) keyName = "left arrow";
        if (29 === ch) keyName = "right arrow";
        if (30 === ch) keyName = "up arrow";
        if (31 === ch) keyName = "down arrow";
        if (32 === ch) keyName = "space";
        function startMatchingKeyHats(stack: BlockModel, target: ObjectModel): void {
            if (this.stack.op === "whenKeyPressed") {
                let k: string = this.stack.args[0].argValue;
                if (this.k === "any" || this.k === keyName) {
                    // only start the stack if it is not already running
                    if (!this.interp.isRunning(this.stack, this.target)) this.interp.toggleThread(this.stack, this.target);
                }
            }
        }
        console.log("todo allStacksAndOwnersDo");
        // this.allStacksAndOwnersDo(startMatchingKeyHats);
    }

    // public collectBroadcasts(): any[] {
    //     function addBlock(b: BlockModel): void {
    //         if ((b.spec.code === "broadcast:") ||
    //             (b.spec.code === "doBroadcastAndWait") ||
    //             (b.spec.code === "whenIReceive")) {
    //             if (b.args[0] instanceof BlockArgModel) {
    //                 let msg: string = b.args[0].argValue;
    //                 if (result.indexOf(this.msg) < 0) result.push(this.msg);
    //             }
    //         }
    //     }
    //     let result: any[] = [];
    //     this.allStacksAndOwnersDo(function(stack: BlockModel, target: ObjectModel): void {
    //         this.stack.allBlocksDo(this.addBlock);
    //     });
    //     console.log("todo prepare block pallete")
    //     // let palette: BlockPalette = this.app.palette;
    //     // for (let i: number = 0; i < palette.numChildren; i++) {
    //     //     let b: BlockModel = <BlockModel>palette.getChildAt(i);
    //     //     if (b) addBlock(b);
    //     // }
    //     result.sort();
    //     return result;
    // }
    //
    // public hasUnofficialExtensions(): boolean {
    //     let found: boolean = false;
    //     this.allStacksAndOwnersDo(function(stack: BlockModel, target: ObjectModel): void {
    //         if (found) return;
    //         this.stack.allBlocksDo(function(b: BlockModel): void {
    //             if (found) return;
    //             if (this.isUnofficialExtensionBlock(this.b))
    //                 found = true;
    //         });
    //     });
    //     return found;
    // }

    // private isUnofficialExtensionBlock(b: BlockModel): boolean {
    //     let i: number = b.op.indexOf(".");
    //     if (i === -1) return false;
    //     let extName: string = b.op.substr(0, i);
    //     return !this.app.extensionManager.isInternal(extName);
    // }


    // public hasGraphicEffects(): boolean {
    //     let found: boolean = false;
    //     this.allStacksAndOwnersDo(function(stack: BlockModel, target: ObjectModel): void {
    //         if (found) return;
    //         this.stack.allBlocksDo(function(b: BlockModel): void {
    //             if (found) return;
    //             if (this.isGraphicEffectBlock(this.b))
    //                 found = true;
    //         });
    //     });
    //     return found;
    // }


    private isGraphicEffectBlock(b: BlockModel): boolean {
        return ("op" in b && (b.spec.code === "changeGraphicEffect:by:" || b.spec.code === "setGraphicEffect:to:") &&
            ("argValue" in b.args[0]) && b.args[0].argValue !== "ghost" && b.args[0].argValue !== "brightness");
    }

    // -----------------------------
    // Edge-trigger sensor hats
    // ------------------------------

    protected triggeredHats: any[] = [];

    private clearEdgeTriggeredHats(): void { this.edgeTriggersEnabled = true; this.triggeredHats = []; }

    // hats whose triggering condition is currently true
    protected activeHats: any[] = [];
    protected startEdgeTriggeredHats(hat: BlockModel, target: ObjectModel): void {
        if (!hat.isHat || !hat.nextBlock) return; // skip disconnected hats

        if ("whenSensorGreaterThan" === hat.spec.code) {
            let sensorName: string = this.interp.arg(hat, 0);
            let threshold: number = this.interp.numarg(hat, 1);
            if (("loudness" === sensorName && this.soundLevel() > threshold) ||
                ("timer" === sensorName && this.timer() > threshold) // ||
                //  ("video motion" === sensorName && target.runtime.visible && VideoMotionPrims.readMotionSensor("motion", target) > threshold)
            ) {
                if (this.triggeredHats.indexOf(hat) === -1) { // not already trigged
                    // only start the stack if it is not already running
                    if (!this.interp.isRunning(hat, target)) this.interp.toggleThread(hat, target);
                }
                this.activeHats.push(hat);
            }
        } else if ("whenSensorConnected" === hat.spec.code) {
            // if (this.getBooleanSensor(this.interp.arg(hat, 0))) {
            //     if (this.triggeredHats.indexOf(hat) === -1) { // not already trigged
            //         // only start the stack if it is not already running
            //         if (!this.interp.isRunning(hat, target)) this.interp.toggleThread(hat, target);
            //     }
            //     this.activeHats.push(hat);
            // }
            // } else if (this.app.jsEnabled) {
            //     let dotIndex: number = hat.spec.code.indexOf(".");
            //     if (dotIndex > -1) {
            //         let extName: string = hat.spec.code.substr(0, dotIndex);
            //         if (this.app.extensionManager.extensionActive(extName)) {
            //             let op: string = hat.spec.code.substr(dotIndex + 1);
            //             let args: any[] = hat.args;
            //             let finalArgs: any[] = new Array(args.length);
            //             for (let i: number = 0; i < args.length; ++i)
            //                 finalArgs[i] = this.interp.arg(hat, i);
            //
            //             this.processExtensionReporter(hat, target, extName, op, finalArgs);
            //         }
            //    }
        }
    }

    // private processExtensionReporter(hat: BlockModel, target: ObjectModel, extName: string, op: string, finalArgs: any[]): void {
    //     // TODO: Is it safe to do this in a callback, or must it happen before we return from startEdgeTriggeredHats?
    //     this.app.externalCall("ScratchExtensions.getReporter", function(triggerCondition: boolean): void {
    //         if (this.triggerCondition) {
    //             if (this.triggeredHats.indexOf(hat) === -1) { // not already trigged
    //                 // only start the stack if it is not already running
    //                 if (!this.interp.isRunning(hat, target)) this.interp.toggleThread(hat, target);
    //             }
    //             this.activeHats.push(hat);
    //         }
    //     }, extName, op, finalArgs);
    // }

    private processEdgeTriggeredHats(): void {
        if (!this.edgeTriggersEnabled) return;
        this.activeHats = [];
        // this.allStacksAndOwnersDo(this.startEdgeTriggeredHats, true);
        this.triggeredHats = this.activeHats;
    }

    // public blockDropped(stack: BlockModel): void {
    //     // Turn on video the first time a video sensor reporter or hat BlockModel is added.
    //     stack.allBlocksDo(function(b: BlockModel): void {
    //         let op: string = this.b.op;
    //         if (op === this.SpecOperation.GET_PARAM) this.b.parameterIndex = -1;  // need to invalidate index cache
    //         if (("senseVideoMotion" === op) ||
    //             (("whenSensorGreaterThan" === op) && ("video motion" === this.interp.arg(this.b, 0)))) {
    //             this.app.libraryPart.showVideoButton();
    //         }
    //
    //         // Scratch::allow3d {
    //         // 	// Should we go 3D?
    //         // 	if(this.isGraphicEffectBlock(this.b))
    //         // 		this.app.go3D();
    //         // }
    //     });
    // }

    // -----------------------------
    // Project Loading and Installing
    // ------------------------------

    // public installEmptyProject(): void {
    //     this.app.saveForRevert(null, true);
    //     this.app.oldWebsiteURL = "";
    //     this.installProject(new StageModel());
    // }
    //
    // public installNewProject(): void {
    //     this.installEmptyProject();
    // }
    //
    // public selectProjectFile(): void {
    //     // Prompt user for a file name and load that file.
    //     let fileName: string, data: ByteArray;
    //     function fileLoadHandler(event: Event): void {
    //         let file: FileReference = this.FileReference(this.event.target);
    //         fileName = this.file.name;
    //         data = this.file.data;
    //         if (this.app.stagePane.isEmpty()) this.doInstall();
    //         else DialogBox.confirm("Replace contents of the current project?", this.app.stage, this.doInstall);
    //     }
    //     function doInstall(ignore: any = null): void {
    //         this.installProjectFromFile(fileName, data);
    //     }
    //     this.stopAll();
    //
    //     let filter: string;
    //     if (Scratch.app.isExtensionDevMode) {
    //         filter = "*.sbx;*.sb;*.sb2";
    //     }
    //     else {
    //         filter = "*.sb;*.sb2";
    //     }
    //     Scratch.loadSingleFile(fileLoadHandler, filter);
    // }
    //
    // public installProjectFromFile(fileName: string, data: ByteArray): void {
    //     // Install a project from a file with the given name and contents.
    //     this.stopAll();
    //     this.app.oldWebsiteURL = "";
    //     this.app.loadInProgress = true;
    //     this.installProjectFromData(data);
    //     this.app.setProjectName(fileName);
    // }
    //
    // public installProjectFromData(data: ByteArray, saveForRevert: boolean = true): void {
    //     let newProject: StageModel;
    //     this.stopAll();
    //     data.position = 0;
    //     if (data.length < 8 || data.readUTFBytes(8) !== "ScratchV") {
    //         data.position = 0;
    //         newProject = new ProjectIO(this.app).decodeProjectFromZipFile(data);
    //         if (!newProject) {
    //             this.projectLoadFailed();
    //             return;
    //         }
    //     } else {
    //         console.log("Old format not supported");
    //         // TODO: support old
    //         // let info:Object;
    //         // let objTable:any[];
    //         // data.position = 0;
    //         // let reader:ObjReader = new ObjReader(data);
    //         // try { info = reader.readInfo() } catch (e) { data.position = 0 }
    //         // try { objTable = reader.readObjTable() } catch (e) { }
    //         // if (!objTable) {
    //         // 	this.projectLoadFailed();
    //         // 	return;
    //         // }
    //         // newProject = new OldProjectReader().extractProject(objTable);
    //         // newProject.info = info;
    //         // if (info !== null) delete info.thumbnail; // delete old thumbnail
    //     }
    //     if (saveForRevert) this.app.saveForRevert(data, false);
    //     this.app.extensionManager.clearImportedExtensions();
    //     this.decodeImagesAndInstall(newProject);
    // }
    //
    // public projectLoadFailed(ignore: any = null): void {
    //     this.app.removeLoadProgressBox();
    //     // DialogBox.notify("Error!", "Project did not load.", app.stage);
    //     this.app.loadProjectFailed();
    // }
    //
    // public decodeImagesAndInstall(newProject: StageModel): void {
    //     function imagesDecoded(): void { this.projectToInstall = newProject; } // stepRuntime() will finish installation
    //     new ProjectIO(this.app).decodeAllImages(newProject.allObjects(), imagesDecoded);
    // }
    //
    // protected installProject(project: StageModel): void {
    //     if (this.app.stagePane !== null) this.stopAll();
    //     if (this.app.scriptsPane) this.app.scriptsPane.viewScriptsFor(null);
    //
    //     // Scratch::allow3d { if(this.app.isIn3D) this.app.render3D.setStage(project, project.penLayer); }
    //
    //     for (let obj of project.allObjects()) {
    //         obj.showCostume(obj.currentCostumeIndex);
    //         if (Scratch.app.isIn3D) obj.updateCostume();
    //         let spr: ScratchSprite = <ScratchSprite>obj;
    //         if (spr) spr.setDirection(spr.direction);
    //     }
    //
    //     this.app.resetPlugin();
    //     this.app.extensionManager.clearImportedExtensions();
    //     this.app.extensionManager.loadSavedExtensions(project.info.savedExtensions);
    //     this.app.installStage(project);
    //     this.app.updateSpriteLibrary(true);
    //     // set the active sprite
    //     let allSprites: any[] = this.app.stagePane.sprites();
    //     if (allSprites.length > 0) {
    //         // TODO: port Sort;
    //         // = allSprites.sortOn("indexInLibrary");
    //         this.app.selectSprite(allSprites[0]);
    //     } else {
    //         this.app.selectSprite(this.app.stagePane);
    //     }
    //     this.app.extensionManager.step();
    //     this.app.projectLoaded();
    //     // Scratch::allow3d { this.checkForGraphicEffects(); }
    // }


    // public checkForGraphicEffects(): void {
    //     if (this.hasGraphicEffects()) this.app.go3D();
    //     else this.app.go2D();
    // }

    // -----------------------------
    // Ask prompter
    // ------------------------------

    // public showAskPrompt(question: string = ""): void {
    //     let p: AskPrompter = new AskPrompter(question, this.app);
    //     this.interp.askThread = this.interp.activeThread;
    //     p.x = 15;
    //     p.y = ObjectModel.STAGEH - p.height - 5;
    //     this.app.stagePane.addChild(p);
    //     window.setTimeout(p.grabKeyboardFocus, 100); // workaround for Window keyboard event handling
    // }
    //
    // public hideAskPrompt(p: AskPrompter): void {
    //     this.interp.askThread = null;
    //     this.lastAnswer = p.answer();
    //     if (p.parent) {
    //         p.parent.removeChild(p);
    //     }
    //     this.app.stage.focus = null;
    // }
    //
    // public askPromptShowing(): boolean {
    //     let uiLayer: Sprite = this.app.stagePane.getUILayer();
    //     for (let i: number = 0; i < uiLayer.numChildren; i++) {
    //         if (uiLayer.getChildAt(i) instanceof AskPrompter)
    //             return true;
    //     }
    //     return false;
    // }
    //
    // public clearAskPrompts(): void {
    //     this.interp.askThread = null;
    //     let allPrompts: any[] = [];
    //     let uiLayer: Sprite = this.app.stagePane.getUILayer();
    //     let c: DisplayObject;
    //     for (let i: number = 0; i < uiLayer.numChildren; i++) {
    //         if ((c = uiLayer.getChildAt(i)) instanceof AskPrompter) allPrompts.push(c);
    //     }
    //     for (c of allPrompts) uiLayer.removeChild(c);
    // }

    // -----------------------------
    // Keyboard input handling
    // ------------------------------

    // public keyDown(evt: KeyboardEvent): void {
    //     this.shiftIsDown = evt.shiftKey;
    //     let ch: number = evt.charCode;
    //     if (evt.charCode === 0) ch = this.mapArrowKey(evt.keyCode);
    //     if ((65 <= ch) && (ch <= 90)) ch += 32; // map A-Z to a-z
    //     if (!(evt.target instanceof TextField)) this.startKeyHats(ch);
    //     if (ch < 128) this.keyIsDown[ch] = true;
    // }
    //
    // public keyUp(evt: KeyboardEvent): void {
    //     this.shiftIsDown = evt.shiftKey;
    //     let ch: number = evt.charCode;
    //     if (evt.charCode === 0) ch = this.mapArrowKey(evt.keyCode);
    //     if ((65 <= ch) && (ch <= 90)) ch += 32; // map A-Z to a-z
    //     if (ch < 128) this.keyIsDown[ch] = false;
    // }
    //
    // private clearKeyDownArray(): void {
    //     for (let i: number = 0; i < 128; i++) this.keyIsDown[i] = false;
    // }
    //
    // private mapArrowKey(keyCode: number): number {
    //     // map key codes for arrow keys to ASCII, other key codes to zero
    //     if (keyCode === 37) return 28;
    //     if (keyCode === 38) return 30;
    //     if (keyCode === 39) return 29;
    //     if (keyCode === 40) return 31;
    //     return 0;
    // }
    //
    // // -----------------------------
    // // Sensors
    // // ------------------------------
    //
    // public getSensor(sensorName: string): number {
    //     return this.app.extensionManager.getStateVar("PicoBoard", sensorName, 0);
    // }
    //
    // public getBooleanSensor(sensorName: string): boolean {
    //     if (sensorName === "button pressed") return this.app.extensionManager.getStateVar("PicoBoard", "button", 1023) < 10;
    //     if (sensorName.indexOf("connected") > -1) { // "A connected" etc.
    //         sensorName = "resistance-" + sensorName.charAt(0);
    //         return this.app.extensionManager.getStateVar("PicoBoard", sensorName, 1023) < 10;
    //     }
    //     return false;
    // }
    //
    // public getTimeString(which: string): any {
    //     // Return local time properties.
    //     let now: Date = new Date();
    //     switch (which) {
    //         case "hour": return now.getHours();
    //         case "minute": return now.getMinutes();
    //         case "second": return now.getSeconds();
    //         case "year": return now.getFullYear(); // four digit year (e.g. 2012)
    //         case "month": return now.getMonth() + 1; // 1-12
    //         case "date": return now.getDate(); // 1-31
    //         case "day of week": return now.getDay() + 1; // 1-7, where 1 is Sunday
    //     }
    //     return ""; // shouldn"t happen
    // }
    //
    // // -----------------------------
    // // Variables
    // // ------------------------------
    //
    // public createVariable(varName: string): void {
    //     this.app.viewedObj().lookupOrCreateVar(varName);
    // }
    //
    // public deleteVariable(varName: string): void {
    //     let v: Variable = this.app.viewedObj().lookupVar(varName);
    //
    //     if (this.app.viewedObj().ownsVar(varName)) {
    //         this.app.viewedObj().deleteVar(varName);
    //     } else {
    //         this.app.stageObj().deleteVar(varName);
    //     }
    //     this.clearAllCaches();
    // }
    //
    // public allVarNames(): any[] {
    //     let result: any[] = [], v: Variable;
    //     for (v of this.app.stageObj().variables) result.push(v.name);
    //     if (!this.app.viewedObj().isStage) {
    //         for (v of this.app.viewedObj().variables) result.push(v.name);
    //     }
    //     return result;
    // }
    //
    // public renameVariable(oldName: string, newName: string): void {
    //     if (oldName === newName) return;
    //     let owner: ObjectModel = this.app.viewedObj();
    //     if (!owner.ownsVar(oldName)) owner = this.app.stagePane;
    //     if (owner.hasName(newName)) {
    //         DialogBox.notify("Cannot Rename", "That name is already in use.");
    //         return;
    //     }
    //
    //     let v: Variable = owner.lookupVar(oldName);
    //     if (v !== null) {
    //         v.name = newName;
    //         if (v.watcher) v.watcher.changeVarName(newName);
    //     } else {
    //         owner.lookupOrCreateVar(newName);
    //     }
    //     this.updateVarRefs(oldName, newName, owner);
    //     this.app.updatePalette();
    // }
    //
    // public updateVariable(v: Variable): void { }
    // public makeVariable(varObj: any): Variable { return new Variable(varObj.name, varObj.value); }
    // public makeListWatcher(): ListWatcher { return new ListWatcher(); }
    //
    // private updateVarRefs(oldName: string, newName: string, owner: ObjectModel): void {
    //     // Change the variable name in all BlockModels that use it.
    //     for (let b of this.allUsesOfVariable(oldName, owner)) {
    //         if (b.op === SpecOperation.GET_VAR) {
    //             b.setSpec(newName);
    //             b.fixExpressionLayout();
    //         } else {
    //             b.args[0].setArgValue(newName);
    //         }
    //     }
    // }
    //
    // // -----------------------------
    // // Lists
    // // ------------------------------
    //
    // public allListNames(): any[] {
    //     let result: any[] = this.app.stageObj().listNames();
    //     if (!this.app.viewedObj().isStage) {
    //         result = result.concat(this.app.viewedObj().listNames());
    //     }
    //     return result;
    // }
    //
    // public deleteList(listName: string): void {
    //     if (this.app.viewedObj().ownsList(listName)) {
    //         this.app.viewedObj().deleteList(listName);
    //     } else {
    //         this.app.stageObj().deleteList(listName);
    //     }
    //     this.clearAllCaches();
    // }
    //
    // // -----------------------------
    // // Sensing
    // // ------------------------------
    //
    public timer(): number { return (this.interp.currentMSecs - this.timerBase) / 1000; }

    // public isLoud(): boolean { return this.soundLevel() > 10; }
    //
    public soundLevel(): number {
        console.log("todo sound level");
        return 0;
        //     if (Microphone === null) {
        //         let microphone = Microphone.getMicrophone();
        //         if (microphone) {
        //             microphone.setLoopBack(true);
        //             // TODO: port??
        //             // microphone.soundTransform = new SoundTransform(0, 0);
        //         }
        //     }
        //     return (microphone ? microphone.activityLevel : 0);
    }
    //
    // // -----------------------------
    // // Script utilities
    // // ------------------------------
    //
    // public renameCostume(newName: string): void {
    //     let obj: ObjectModel = this.app.viewedObj();
    //     let costume: CostumeModel = obj.currentCostume();
    //     costume.costumeName = "";
    //     let oldName: string = costume.costumeName;
    //     newName = obj.unusedCostumeName(newName || Translator.map("costume1"));
    //     costume.costumeName = newName;
    //     this.updateArgs(obj.isStage ? this.allUsesOfBackdrop(oldName) : this.allUsesOfCostume(oldName), newName);
    // }
    //
    // public renameSprite(newName: string): void {
    //     let obj: ObjectModel = this.app.viewedObj();
    //     let oldName: string = obj.objName;
    //     obj.objName = "";
    //     newName = this.app.stagePane.unusedSpriteName(newName || "Sprite1");
    //     obj.objName = newName;
    //     for (let lw of this.app.viewedObj().lists) {
    //         lw.updateTitle();
    //     }
    //     this.updateArgs(this.allUsesOfSprite(oldName), newName);
    // }
    //
    // private updateArgs(args: any[], newValue: any): void {
    //     for (let a of args) {
    //         a.setArgValue(newValue);
    //     }
    //     this.app.setSaveNeeded();
    // }
    //
    // public renameSound(s: ScratchSound, newName: string): void {
    //     let obj: ObjectModel = this.app.viewedObj();
    //     let oldName: string = s.soundName;
    //     s.soundName = "";
    //     newName = obj.unusedSoundName(newName || Translator.map("sound1"));
    //     s.soundName = newName;
    //     this.allUsesOfSoundDo(oldName, function(a: BlockArgModel): void {
    //         this.a.setArgValue(newName);
    //     });
    //     this.app.setSaveNeeded();
    // }
    //
    // public clearRunFeedback(): void {
    //     if (this.app.editMode) {
    //         for (let stack of this.allStacks()) {
    //             stack.allBlocksDo(function(b: BlockModel): void {
    //                 this.b.hideRunFeedback();
    //             });
    //         }
    //     }
    //     this.app.updatePalette();
    // }
    //
    // public allSendersOfBroadcast(msg: string): any[] {
    //     // Return an array of all Scratch objects that broadcast the given message.
    //     let result: any[] = [];
    //     for (let o of this.app.stagePane.allObjects()) {
    //         if (this.sendsBroadcast(o, msg)) result.push(o);
    //     }
    //     return result;
    // }
    //
    // public allReceiversOfBroadcast(msg: string): any[] {
    //     // Return an array of all Scratch objects that receive the given message.
    //     let result: any[] = [];
    //     for (let o of this.app.stagePane.allObjects()) {
    //         if (this.receivesBroadcast(o, msg)) result.push(o);
    //     }
    //     return result;
    // }
    //
    // public renameBroadcast(oldMsg: string, newMsg: string): void {
    //     if (oldMsg === newMsg) return;
    //
    //     if (this.allSendersOfBroadcast(newMsg).length > 0 ||
    //         this.allReceiversOfBroadcast(newMsg).length > 0) {
    //         DialogBox.notify("Cannot Rename", "That name is already in use.");
    //         return;
    //     }
    //
    //     for (let obj of this.allBroadcastBlocksWithMsg(oldMsg)) {
    //         obj.broadcastMsg = newMsg;
    //     }
    //
    //     this.app.updatePalette();
    // }
    //
    // private sendsBroadcast(obj: ObjectModel, msg: string): boolean {
    //     for (let stack of obj.scripts) {
    //         let found: boolean;
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             if (this.b.op === "broadcast:" || this.b.op === "doBroadcastAndWait") {
    //                 if (this.b.broadcastMsg === msg) found = true;
    //             }
    //         });
    //         if (found) return true;
    //     }
    //     return false;
    // }
    //
    // private receivesBroadcast(obj: ObjectModel, msg: string): boolean {
    //     msg = msg.toLowerCase();
    //     for (let stack of obj.scripts) {
    //         let found: boolean;
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             if (this.b.op === "whenIReceive") {
    //                 if (this.b.broadcastMsg.toLowerCase() === msg) found = true;
    //             }
    //         });
    //         if (found) return true;
    //     }
    //     return false;
    // }
    //
    // private allBroadcastBlocksWithMsg(msg: string): any[] {
    //     let result: any[] = [];
    //     for (let o of this.app.stagePane.allObjects()) {
    //         for (let stack of o.scripts) {
    //             stack.allBlocksDo(function(b: BlockModel): void {
    //                 if (this.b.op === "broadcast:" || this.b.op === "doBroadcastAndWait" || this.b.op === "whenIReceive") {
    //                     if (this.b.broadcastMsg === msg) result.push(this.b);
    //                 }
    //             });
    //         }
    //     }
    //     return result;
    // }
    //
    // public allUsesOfBackdrop(backdropName: string): any[] {
    //     let result: any[] = [];
    //     this.allStacksAndOwnersDo(function(stack: BlockModel, target: ObjectModel): void {
    //         this.stack.allBlocksDo(function(b: BlockModel): void {
    //             for (let a of this.b.args) {
    //                 if (a instanceof BlockArgModel && a.menuName === "backdrop" && a.argValue === backdropName) result.push(a);
    //             }
    //         });
    //     });
    //     return result;
    // }
    //
    // public allUsesOfCostume(costumeName: string): any[] {
    //     let result: any[] = [];
    //     for (let stack of this.app.viewedObj().scripts) {
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             for (let a of this.b.args) {
    //                 if (a instanceof BlockArgModel && a.menuName === "costume" && a.argValue === costumeName) result.push(a);
    //             }
    //         });
    //     }
    //     return result;
    // }
    //
    // public allUsesOfSprite(spriteName: string): any[] {
    //     let spriteMenus: any[] = ["spriteOnly", "spriteOrMouse", "spriteOrStage", "touching"];
    //     let result: any[] = [];
    //     for (let stack of this.allStacks()) {
    //         // for each BlockModel in stack
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             for (let a of this.b.args) {
    //                 if (a instanceof BlockArgModel && spriteMenus.indexOf(a.menuName) !== -1 && a.argValue === spriteName) result.push(a);
    //             }
    //         });
    //     }
    //     return result;
    // }
    //
    // public allUsesOfVariable(varName: string, owner: ObjectModel): any[] {
    //     let variableBlocks: any[] = [SpecOperation.SET_VAR, SpecOperation.CHANGE_VAR, "showVariable:", "hideVariable:"];
    //     let result: any[] = [];
    //     let stacks: any[] = owner.isStage ? this.allStacks() : owner.scripts;
    //     for (let stack of stacks) {
    //         // for each BlockModel in stack
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             if (this.b.op === this.SpecOperation.GET_let && this.b.spec === varName) result.push(this.b);
    //             if (variableBlocks.indexOf(this.b.op) !== -1 && this.b.args[0] instanceof BlockArgModel && this.b.args[0].argValue === varName) result.push(this.b);
    //         });
    //     }
    //     return result;
    // }
    //
    // public allUsesOfSoundDo(soundName: string, f: Function): void {
    //     for (let stack of this.app.viewedObj().scripts) {
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             for (let a of this.b.args) {
    //                 if (a instanceof BlockArgModel && a.menuName === "sound" && a.argValue === soundName) f(a);
    //             }
    //         });
    //     }
    // }
    //
    // public allCallsOf(callee: string, owner: ObjectModel, includeRecursive: boolean = true): any[] {
    //     let result: any[] = [];
    //     for (let stack of owner.scripts) {
    //         if (!includeRecursive && stack.op === SpecOperation.PROCEDURE_DEF && stack.spec === callee) continue;
    //         // for each BlockModel in stack
    //         stack.allBlocksDo(function(b: BlockModel): void {
    //             if (this.b.op === this.SpecOperation.CALL && this.b.spec === callee) result.push(this.b);
    //         });
    //     }
    //     return result;
    // }
    //
    // public updateCalls(): void {
    //     this.allStacksAndOwnersDo(function(b: BlockModel, target: ObjectModel): void {
    //         if (this.b.op === this.SpecOperation.CALL) {
    //             if (this.target.lookupProcedure(this.b.spec) === null) {
    //                 this.b.base.setColor(0xFF0000);
    //                 this.b.base.redraw();
    //             }
    //             else this.b.base.setColor(this.SpecOperation.procedureColor);
    //         }
    //     });
    //     this.clearAllCaches();
    // }

    // public allStacks(): any[] {
    //     // return an array containing all stacks in all objects
    //     let result: any[] = [];
    //     this.allStacksAndOwnersDo(
    //         function(stack: BlockModel, target: ObjectModel): void { result.push(this.stack); });
    //     return result;
    // }

    // public allStacksAndOwnersDo(f: Function, setDoObj: boolean = false): void {
    //     // Call the given function on every stack in the project, passing the stack and owning sprite/stage.
    //     // This method is used by broadcast, so enumerate sprites/stage from front to back to match Scratch.
    //     let stage: StageModel = this.app.stagePane;
    //     let stack: BlockModel;
    //     for (let i: number = stage.numChildren - 1; i >= 0; i--) {
    //         let o: any = stage.getChildAt(i);
    //         if (o instanceof ObjectModel) {
    //             if (setDoObj) this.currentDoObj = o;
    //             for (stack of o.scripts) f(stack, o);
    //         }
    //     }
    //     if (setDoObj) this.currentDoObj = stage;
    //     for (stack of stage.scripts) f(stack, stage);
    //     this.currentDoObj = null;
    // }
    //
    // public clearAllCaches(): void {
    //     for (let obj of this.app.stagePane.allObjects()) obj.clearCaches();
    // }
    //
    // // -----------------------------
    // // Variable, List, and Reporter Watchers
    // // ------------------------------
    //
    // public showWatcher(data: any, showFlag: boolean): void {
    //     if ("variable" === data.type) {
    //         if (showFlag) this.showVarOrListFor(data.varName, data.isList, data.targetObj);
    //         else this.hideVarOrListFor(data.varName, data.isList, data.targetObj);
    //     }
    //     if ("reporter" === data.type) {
    //         let w: Watcher = this.findReporterWatcher(data);
    //         if (w) {
    //             w.visible = showFlag;
    //         } else {
    //             if (showFlag) {
    //                 w = new Watcher();
    //                 w.initWatcher(data.targetObj, data.cmd, data.param, data.color);
    //                 this.showOnStage(w);
    //             }
    //         }
    //     }
    //
    //     this.app.setSaveNeeded();
    // }
    //
    // public showVarOrListFor(varName: string, isList: boolean, targetObj: ObjectModel): void {
    //     if (targetObj.isClone) {
    //         // Clone"s can"t show local variables/lists (but can show global ones)
    //         if (!isList && targetObj.ownsVar(varName)) return;
    //         if (isList && targetObj.ownsList(varName)) return;
    //     }
    //     let w: DisplayObject = isList ? this.watcherForList(targetObj, varName) : this.watcherForVar(targetObj, varName);
    //     if (w instanceof ListWatcher) (<ListWatcher>w).prepareToShow();
    //     if (w !== null && (!w.visible || !w.parent)) {
    //         this.showOnStage(w);
    //         this.app.updatePalette(false);
    //     }
    // }
    //
    // private showOnStage(w: DisplayObject): void {
    //     if (w.parent === null) this.setInitialPosition(w);
    //     w.visible = true;
    //     this.app.stagePane.addChild(w);
    // }
    //
    // private setInitialPosition(watcher: DisplayObject): void {
    //     let wList: any[] = this.app.stagePane.watchers();
    //     let w: number = watcher.width;
    //     let h: number = watcher.height;
    //     let x: number = 5;
    //     while (x < 400) {
    //         let maxX: number = 0;
    //         let y: number = 5;
    //         while (y < 320) {
    //             let otherWatcher: DisplayObject = this.watcherIntersecting(wList, new Rectangle(x, y, w, h));
    //             if (!otherWatcher) {
    //                 watcher.x = x;
    //                 watcher.y = y;
    //                 return;
    //             }
    //             y = otherWatcher.y + otherWatcher.height + 5;
    //             maxX = otherWatcher.x + otherWatcher.width;
    //         }
    //         x = maxX + 5;
    //     }
    //     // Couldn"t find an unused place, so pick a random spot
    //     watcher.x = 5 + Math.floor(400 * Math.random());
    //     watcher.y = 5 + Math.floor(320 * Math.random());
    // }
    //
    // private watcherIntersecting(watchers: any[], r: Rectangle): DisplayObject {
    //     for (let w of watchers) {
    //         if (r.intersects(w.getBounds(this.app.stagePane))) return w;
    //     }
    //     return null;
    // }
    //
    // public hideVarOrListFor(varName: string, isList: boolean, targetObj: ObjectModel): void {
    //     let w: DisplayObject = isList ? this.watcherForList(targetObj, varName) : this.watcherForVar(targetObj, varName);
    //     if (w !== null && w.visible) {
    //         w.visible = false;
    //         this.app.updatePalette(false);
    //     }
    // }
    //
    // public watcherShowing(data: any): boolean {
    //     if ("variable" === data.type) {
    //         let targetObj: ObjectModel = data.targetObj;
    //         let varName: string = data.varName;
    //         let uiLayer: Sprite = this.app.stagePane.getUILayer();
    //         let i: number;
    //         if (data.isList)
    //             for (i = 0; i < uiLayer.numChildren; i++) {
    //                 let listW: ListWatcher = <ListWatcher>uiLayer.getChildAt(i);
    //                 if (listW && (listW.listName === varName) && listW.visible) return true;
    //             }
    //         else
    //             for (i = 0; i < uiLayer.numChildren; i++) {
    //                 let varW: Watcher = <Watcher>uiLayer.getChildAt(i);
    //                 if (varW && varW.isVarWatcherFor(targetObj, varName) && varW.visible) return true;
    //             }
    //     }
    //     if ("reporter" === data.type) {
    //         let w: Watcher = this.findReporterWatcher(data);
    //         return w && w.visible;
    //     }
    //     return false;
    // }
    //
    // private findReporterWatcher(data: any): Watcher {
    //     let uiLayer: Sprite = this.app.stagePane.getUILayer();
    //     for (let i: number = 0; i < uiLayer.numChildren; i++) {
    //         let w: Watcher = <Watcher>uiLayer.getChildAt(i);
    //         if (w && w.isReporterWatcher(data.targetObj, data.cmd, data.param)) return w;
    //     }
    //     return null;
    // }
    //
    // private watcherForVar(targetObj: ObjectModel, vName: string): DisplayObject {
    //     let v: Variable = targetObj.lookupVar(vName);
    //     if (v === null) return null; // variable is not defined
    //     if (v.watcher === null) {
    //         if (this.app.stagePane.ownsVar(vName)) targetObj = this.app.stagePane; // global
    //         let existing: Watcher = this.existingWatcherForVar(targetObj, vName);
    //         if (existing !== null) {
    //             v.watcher = existing;
    //         } else {
    //             v.watcher = new Watcher();
    //             v.watcher.initForVar(targetObj, vName);
    //         }
    //     }
    //     return v.watcher;
    // }
    //
    // private watcherForList(targetObj: ObjectModel, listName: string): DisplayObject {
    //     let w: ListWatcher;
    //     for (w of targetObj.lists) {
    //         if (w.listName === listName) return w;
    //     }
    //     for (w of this.app.stagePane.lists) {
    //         if (w.listName === listName) return w;
    //     }
    //     return null;
    // }
    //
    // private existingWatcherForVar(target: ObjectModel, vName: string): Watcher {
    //     let uiLayer: Sprite = this.app.stagePane.getUILayer();
    //     for (let i: number = 0; i < uiLayer.numChildren; i++) {
    //         let c: any = uiLayer.getChildAt(i);
    //         if ((c instanceof Watcher) && (c.isVarWatcherFor(target, vName))) return c;
    //     }
    //     return null;
    // }

    // -----------------------------
    // Undelete support
    // ------------------------------

    private lastDelete: any[]; // object, x, y, owner (for BlockModels/stacks/costumes/sounds)

    public canUndelete(): boolean { return this.lastDelete !== null; }
    public clearLastDelete(): void { this.lastDelete = null; }

    // public recordForUndelete(obj: any, x: number, y: number, index: number, owner: any = null): void {
    //     if (obj instanceof BlockModel) {
    //         let comments: any[] = (<BlockModel>obj).attachedCommentsIn(this.app.scriptsPane);
    //         if (comments.length) {
    //             for (let c of comments) {
    //                 c.parent.removeChild(c);
    //             }
    //             this.app.scriptsPane.fixCommentLayout();
    //             obj = [obj, comments];
    //         }
    //     }
    //     this.lastDelete = [obj, x, y, index, owner];
    // }

    public undelete(): void {
        if (!this.lastDelete) return;
        let obj: any = this.lastDelete[0];
        let x: number = this.lastDelete[1];
        let y: number = this.lastDelete[2];
        let index: number = this.lastDelete[3];
        let previousOwner: any = this.lastDelete[4];
        // this.doUndelete(obj, x, y, previousOwner);
        this.lastDelete = null;
    }

    // protected doUndelete(obj: any, x: number, y: number, prevOwner: any): void {
    //     if (obj instanceof MediaInfo) {
    //         if (prevOwner instanceof ObjectModel) {
    //             this.app.selectSprite(prevOwner);
    //             if (obj.mycostume) this.app.addCostume(<CostumeModel>obj.mycostume);
    //             if (obj.mysound) this.app.addSound(<ScratchSound>obj.mysound);
    //         }
    //     } else if (obj instanceof ScratchSprite) {
    //         this.app.addNewSprite(obj);
    //         obj.setScratchXY(x, y);
    //         this.app.selectSprite(obj);
    //     } else if ((obj instanceof Array) || (obj instanceof BlockModel) || (obj instanceof ScratchComment)) {
    //         this.app.selectSprite(prevOwner);
    //         this.app.setTab("scripts");
    //         let b: DisplayObject = obj instanceof Array ? obj[0] : obj;
    //         b.x = this.app.scriptsPane.padding;
    //         b.y = this.app.scriptsPane.padding;
    //         if (b instanceof BlockModel) b.cacheAsBitmap = true;
    //         this.app.scriptsPane.addChild(b);
    //         if (obj instanceof Array) {
    //             for (let c of obj[1]) {
    //                 this.app.scriptsPane.addChild(c);
    //             }
    //         }
    //         this.app.scriptsPane.saveScripts();
    //         if (b instanceof BlockModel) this.app.updatePalette();
    //     }
    // }

}

enum ReadyLabel {
    NOT_READY, COUNTDOWN, READY
}
