System.register(['./stubs/Sprite', './logging/Log'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Sprite_1, Log_1;
    var Scratch;
    return {
        setters:[
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            },
            function (Log_1_1) {
                Log_1 = Log_1_1;
            }],
        execute: function() {
            Scratch = (function (_super) {
                __extends(Scratch, _super);
                function Scratch() {
                    _super.call(this);
                    // Display modes
                    this.hostProtocol = 'http';
                    this.jsEnabled = false; // true when the SWF can talk to the webpage
                    this.ignoreResize = false; // If true, temporarily ignore resize events.
                    this.isExtensionDevMode = false; // If true, run in extension development mode (as on ScratchX)
                    this.isMicroworld = false;
                    this.projectID = '';
                    this.projectOwner = '';
                    this.oldWebsiteURL = '';
                    this.debugOps = false;
                    this.debugOpCmd = '';
                    this.lastTab = 'scripts';
                    this._usesUserNameBlock = false;
                    this.tipsBarClosedWidth = 17;
                    Log_1.Log.info("scratch2 initiated");
                    //SVGTool.setStage(this.stage);
                    //this.loaderInfo.uncaughtErrorEvents.addEventListener("UNCAUGHT_ERROR", this.uncaughtErrorHandler);
                    Scratch.app = this;
                }
                Scratch.versionString = 'v443';
                return Scratch;
            })(Sprite_1.Sprite);
            exports_1("Scratch", Scratch);
        }
    }
});
//# sourceMappingURL=Scratch2.js.map