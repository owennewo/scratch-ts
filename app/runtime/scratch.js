System.register(["./scratch.runtime"], function(exports_1) {
    var scratch_runtime_1;
    var Scratch;
    return {
        setters:[
            function (scratch_runtime_1_1) {
                scratch_runtime_1 = scratch_runtime_1_1;
            }],
        execute: function() {
            // Scratch.as
            // John Maloney, September 2009
            //
            // This is the top-level application.
            Scratch = (function () {
                function Scratch() {
                    // SVGTool.setStage(this.stage);
                    // this.loaderInfo.uncaughtErrorEvents.addEventListener("UNCAUGHT_ERROR", this.uncaughtErrorHandler);
                    // Scratch.app = this;
                    // public isSmallPlayer: boolean; // true when displaying as a scaled-down player (e.g. in search results)
                    // public stageIsContracted: boolean; // true when the stage is half size to give more space on small screens
                    // public isIn3D: boolean;
                    // // public render3D:DisplayObjectContainerIn3D;
                    // public isArmCPU: boolean;
                    // public jsEnabled: boolean = false; // true when the SWF can talk to the webpage
                    // public ignoreResize: boolean = false; // If true, temporarily ignore resize events.
                    this.isExtensionDevMode = false; // If true, run in extension development mode (as on ScratchX)
                    // public isMicroworld: boolean = false;
                    //
                    // public presentationScale: number;
                    //
                    // // Runtime
                    // public runtime: ScratchRuntime;
                    // public interp: Interpreter;
                    // public extensionManager: ExtensionManager;
                    // public server: Server;
                    // public gh: GestureHandler;
                    this.projectID = "";
                    // public mediaLibrary: MediaLibrary;
                    // public lp: LoadProgress;
                    // public cameraDialog: CameraDialog;
                    //
                    // // UI Parts
                    // public libraryPart: LibraryPart;
                    // protected topBarPart: TopBarPart;
                    // protected stagePart: StagePart;
                    // private tabsPart: TabsPart;
                    // protected scriptsPart: ScriptsPart;
                    // public imagesPart: ImagesPart;
                    // public soundsPart: SoundsPart;
                    // public tipsBarClosedWidth: number = 17;
                    this.runtime = new scratch_runtime_1.ScratchRuntime(this, this.runtime);
                    // This one must finish before most other queries can start, so do it separately
                    // this.determineJSAccess();
                }
                // 	protected determineJSAccess():void {
                // 		this.externalCall("")
                // 		/*
                // 		if (this.externalInterfaceAvailable()) {
                // 			try {
                // 				this.externalCall("function(){return true;}", this.jsAccessDetermined);
                // 				return; // wait for callback
                // 			}
                // 			catch (e) {
                // 			}
                // 		}
                // 		this.jsAccessDetermined(false);
                // 		*/
                // 	}
                // 	private jsAccessDetermined(result:boolean):void {
                // 		this.jsEnabled = result;
                // 		this.initialize();
                // 	}
                // 	protected initialize():void {
                // 		// this.isOffline = !URLUtil.isHttpURL(this.loaderInfo.url);
                // 		// this.hostProtocol = URLUtil.getProtocol(this.loaderInfo.url);
                // 		// this.isExtensionDevMode = (this.loaderInfo.parameters["extensionDevMode"] == "true");
                // 		// this.isMicroworld = (this.loaderInfo.parameters["microworldMode"] == "true");
                // 		this.checkFlashVersion();
                // 		this.initServer();
                // 		this.stage.align = "TOP_LEFT";
                // 		this.stage.scaleMode = "NO_SCALE";
                // 		this.stage.frameRate = 30;
                // 		if (this.stage.hasOwnProperty("color")) {
                // 			// Stage doesn"t have a color property on Air 2.6, and Linux throws if you try to set it anyway.
                // 			this.stage["color"] = CSS.backgroundColor();
                // 		}
                // 		Block.setFonts(10, 9, true, 0); // default font sizes
                // 		Block.MenuHandlerFunction = BlockMenus.BlockMenuHandler;
                // 		CursorTool.init(this);
                // 		Scratch.app = this;
                // 		this.stagePane = this.getScratchStage();
                // 		this.gh = new GestureHandler(this, false); //TODO Check IE (this.loaderInfo.parameters["inIE"] == "true"));
                // 		this.initInterpreter();
                // 		this.initRuntime();
                // 		this.initExtensionManager();
                // 		Translator.initializeLanguageList();
                // 		this.playerBG = new Shape(); // create, but don"t add
                // 		this.addParts();
                // 		this.server.getSelectedLang(Translator.setLanguageValue);
                // 		this.stage.addEventListener(MouseEvent.MOUSE_DOWN, this.gh.mouseDown);
                // 		this.stage.addEventListener(MouseEvent.MOUSE_MOVE, this.gh.mouseMove);
                // 		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.gh.mouseUp);
                // 		this.stage.addEventListener(MouseEvent.MOUSE_WHEEL, this.gh.mouseWheel);
                // 		this.stage.addEventListener("rightClick", this.gh.rightMouseClick);
                // 		this.stage.addEventListener(KeyboardEvent.KEY_UP, this.runtime.keyUp);
                // 		this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.keyDown); // to handle escape key
                // 		this.stage.addEventListener(Event.ENTER_FRAME, this.step);
                // 		this.stage.addEventListener(Event.RESIZE, this.onResize);
                // 		this.setEditMode(this.startInEditMode());
                // 		// install project before calling fixLayout()
                // 		if (this.editMode) this.runtime.installNewProject();
                // 		else this.runtime.installEmptyProject();
                // 		this.fixLayout();
                // 		//Analyze.collectAssets(0, 119110);
                // 		//Analyze.checkProjects(56086, 64220);
                // 		//Analyze.countMissingAssets();
                // 		this.handleStartupParameters();
                // 	}
                // 	protected handleStartupParameters():void {
                // 		this.setupExternalInterface(false);
                // 		this.jsEditorReady();
                // 	}
                // 	protected setupExternalInterface(oldWebsitePlayer:boolean):void {
                // 		if (!this.jsEnabled) return;
                // 		// this.addExternalCallback("ASloadExtension", this.extensionManager.loadRawExtension);
                // 		// this.addExternalCallback("ASextensionCallDone", this.extensionManager.callCompleted);
                // 		// this.addExternalCallback("ASextensionReporterDone", this.extensionManager.reporterCompleted);
                // 		// this.addExternalCallback("AScreateNewProject", this.createNewProjectScratchX);
                // 		// if (this.isExtensionDevMode) {
                // 		// 	this.addExternalCallback("ASloadGithubURL", this.loadGithubURL);
                // 		// 	this.addExternalCallback("ASloadBase64SBX", this.loadBase64SBX);
                // 		// 	this.addExternalCallback("ASsetModalOverlay", this.setModalOverlay);
                // 		// }
                // 	}
                // 	protected jsEditorReady():void {
                // 		// if (this.jsEnabled) {
                // 		// 	this.externalCall("JSeditorReady", function (success:boolean):void {
                // 		// 		if (!this.success) this.jsThrowError("Calling JSeditorReady() failed.");
                // 		// 	});
                // 		// }
                // 	}
                // 	private loadSingleGithubURL(url:string):void {
                // 		url = decodeURI(url).trim();
                // 		function handleComplete(e:Event):void {
                // 			//TODO: port
                // 			// this.runtime.installProjectFromData(sbxLoader.data);
                // 			// if (this.projectName().trim().length == 0) {
                // 			// 	var newProjectName:string = url;
                // 			// 	var index:number = this.newProjectName.indexOf("?");
                // 			// 	if (this.index > 0) this.newProjectName = this.newProjectName.slice(0, this.index);
                // 			// 	this.index = this.newProjectName.lastIndexOf("/");
                // 			// 	if (this.index > 0) this.newProjectName = this.newProjectName.substr(this.index + 1);
                // 			// 	this.index = this.newProjectName.lastIndexOf(".sbx");
                // 			// 	if (this.index > 0) this.newProjectName = this.newProjectName.slice(0, this.index);
                // 			// 	this.setProjectName(this.newProjectName);
                // 			// }
                // 		}
                // 		function handleError(e:ErrorEvent):void {
                // 			this.jsThrowError("Failed to load SBX: " + this.e.toString());
                // 		}
                // 		var fileExtension:string = url.substr(url.lastIndexOf(".")).toLowerCase();
                // 		if (fileExtension == ".js") {
                // 			//this.externalCall("ScratchExtensions.loadExternalJS", null, url);
                // 			return;
                // 		}
                // 		// Otherwise assume it"s a project (SB2, SBX, etc.)
                // 		this.loadInProgress = true;
                // 		//TODO port url loading
                // 		/*
                // 		var request:URLRequest = new URLRequest(url);
                // 		var sbxLoader:URLLoader = new URLLoader(request);
                // 		sbxLoader.dataFormat = "BINARY";
                // 		sbxLoader.addEventListener(Event.COMPLETE, handleComplete);
                // 		sbxLoader.addEventListener("SECURITY_ERROR", handleError);
                // 		sbxLoader.addEventListener("IO_ERROR", handleError);
                // 		sbxLoader.load(request);
                // 		*/
                // 	}
                // 	private pendingExtensionURLs:any[];
                // 	private loadGithubURL(urlOrArray:any):void {
                // 		if (!this.isExtensionDevMode) return;
                // 		var url:string;
                // 		var urlArray:any[] = urlOrArray ;
                // 		if (urlArray) {
                // 			var urlCount:number = urlArray.length;
                // 			var extensionURLs:any[] = [];
                // 			var projectURL:string;
                // 			var index:number;
                // 			// Filter URLs: allow at most one project file, and wait until it loads before loading extensions.
                // 			for (index = 0; index < urlCount; ++index) {
                // 				url = decodeURI(urlArray[index]).trim();
                // 				if (url.toLowerCase().endsWith(".js")) {
                // 					extensionURLs.push(url);
                // 				}
                // 				else if (url.length > 0) {
                // 					if (projectURL) {
                // 						this.jsThrowError("Ignoring extra project URL: " + projectURL);
                // 					}
                // 					projectURL = url.trim();
                // 				}
                // 			}
                // 			if (projectURL) {
                // 				this.pendingExtensionURLs = extensionURLs;
                // 				this.loadSingleGithubURL(projectURL);
                // 				// warning will be shown later
                // 			}
                // 			else {
                // 				urlCount = extensionURLs.length;
                // 				for (index = 0; index < urlCount; ++index) {
                // 					this.loadSingleGithubURL(extensionURLs[index]);
                // 				}
                // 				this.externalCall("JSshowWarning");
                // 			}
                // 		}
                // 		else {
                // 			url = urlOrArray ;
                // 			this.loadSingleGithubURL(url);
                // 			this.externalCall("JSshowWarning");
                // 		}
                // 	}
                // 	private loadBase64SBX(base64:string):void {
                // 		var sbxData:ByteArray = Base64Encoder.decode(base64);
                // 		Scratch.app.setProjectName("");
                // 		this.runtime.installProjectFromData(sbxData);
                // 	}
                // 	protected initTopBarPart():void {
                // 		this.topBarPart = new TopBarPart(this);
                // 	}
                // 	protected initScriptsPart():void {
                // 		this.scriptsPart = new ScriptsPart(this);
                // 	}
                // 	protected initImagesPart():void {
                // 		this.imagesPart = new ImagesPart(this);
                // 	}
                // 	protected initInterpreter():void {
                // 		this.interp = new Interpreter(this);
                // 	}
                // 	protected initRuntime():void {
                // 		this.runtime = new ScratchRuntime(this, this.interp);
                // 	}
                // 	protected initExtensionManager():void {
                // 		if (this.isExtensionDevMode) {
                // 			this.extensionManager = new ExtensionDevManager(this);
                // 		}
                // 		else {
                // 			this.extensionManager = new ExtensionManager(this);
                // 		}
                // 	}
                // 	protected initServer():void {
                // 		this.server = new Server();
                // 	}
                // 	public showTip(tipName:string):void {
                // 	}
                // 	public closeTips():void {
                // 	}
                // 	public reopenTips():void {
                // 	}
                // 	public tipsWidth():number {
                // 		return 0;
                // 	}
                // 	protected startInEditMode():boolean {
                // 		return this.isOffline || this.isExtensionDevMode;
                // 	}
                // 	public getMediaLibrary(type:string, whenDone:Function):MediaLibrary {
                // 		return new MediaLibrary(this, type, whenDone);
                // 	}
                // 	public getMediaPane(app:Scratch, type:string):MediaPane {
                // 		return new MediaPane(app, type);
                // 	}
                // 	public getScratchStage():ScratchStage {
                // 		return new ScratchStage();
                // 	}
                // 	public getPaletteBuilder():PaletteBuilder {
                // 		return new PaletteBuilder(this);
                // 	}
                // 	private uncaughtErrorHandler(event:Event):void {
                // 		//TODO port error handling
                // 		/*
                // 		if (event.error instanceof Error) {
                // 			var error:Error = <Error>event.error ;
                // 			this.logException(error);
                // 		}
                // 		else if (event.error instanceof this.ErrorEvent) {
                // 			var errorEvent:ErrorEvent = <ErrorEvent>event.error ;
                // 			this.log(LogLevel.ERROR, errorEvent.toString());
                // 		}
                // 		*/
                // 	}
                // 	// All other log...() methods funnel to this one
                // 	public log(severity:string, messageKey:string, extraData:Object = null) {
                // 		this.logger.log(severity, messageKey, extraData);
                // 	}
                // 	// Log an Error object generated by an exception
                // 	public logException(e:Error):void {
                // 		this.log(LogLevel.ERROR, e.toString());
                // 	}
                // 	// Shorthand for log(LogLevel.ERROR, ...)
                // 	public logMessage(msg:string, extra_data:Object = null):void {
                // 		this.log(LogLevel.ERROR, msg, extra_data);
                // 	}
                // 	public loadProjectFailed():void {
                // 		this.loadInProgress = false;
                // 	}
                // 	public jsThrowError(s:string):void {
                // 		// Throw the given string as an error in the browser. Errors on the production site are logged.
                // 		var errorString:string = "SWF Error: " + s;
                // 		this.log(LogLevel.WARNING, errorString);
                // 		if (this.jsEnabled) {
                // 			this.externalCall("JSthrowError", null, errorString);
                // 		}
                // 	}
                // 	protected checkFlashVersion():void {
                // 		// Scratch::allow3d {
                // 		// 	if (this.Capabilities.playerType != "Desktop" || this.Capabilities.version.indexOf("IOS") === 0) {
                // 		// 		var versionString:string = this.Capabilities.version.substr(this.Capabilities.version.indexOf(" ") + 1);
                // 		// 		var versionParts:any[] = versionString.split(",");
                // 		// 		var majorVersion:number = parseInt(versionParts[0]);
                // 		// 		var minorVersion:number = parseInt(versionParts[1]);
                // 		// 		if ((majorVersion > 11 || (majorVersion == 11 && minorVersion >= 7)) && !this.isArmCPU && this.Capabilities.cpuArchitecture == "x86") {
                // 		// 			this.render3D = new DisplayObjectContainerIn3D();
                // 		// 			this.render3D.setStatusCallback(this.handleRenderCallback);
                // 		// 			return;
                // 		// 		}
                // 		// 	}
                // 		// }
                // 		//this.render3D = null;
                // 	}
                // 	/*SCRATCH*//*::*//*allow3d*/
                // 	protected handleRenderCallback(enabled:boolean):void {
                // 		if (!enabled) {
                // 			this.go2D();
                // 			//this.render3D = null;
                // 		}
                // 		else {
                // 			for (var i:number = 0; i < this.stagePane.numChildren; ++i) {
                // 				var spr:ScratchSprite = (<ScratchSprite>this.stagePane.getChildAt(i) );
                // 				if (spr) {
                // 					spr.clearCachedBitmap();
                // 					spr.updateCostume();
                // 					spr.applyFilters();
                // 				}
                // 			}
                // 			this.stagePane.clearCachedBitmap();
                // 			this.stagePane.updateCostume();
                // 			this.stagePane.applyFilters();
                // 		}
                // 	}
                // 	public clearCachedBitmaps():void {
                // 		for (var i:number = 0; i < this.stagePane.numChildren; ++i) {
                // 			var spr:ScratchSprite = (<ScratchSprite>this.stagePane.getChildAt(i) );
                // 			if (spr) spr.clearCachedBitmap();
                // 		}
                // 		this.stagePane.clearCachedBitmap();
                // 		// unsupported technique that seems to force garbage collection
                // 		// try {
                // 		// 	new LocalConnection().connect("foo");
                // 		// 	new LocalConnection().connect("foo");
                // 		// } catch (e:Error) {
                // 		// }
                // 	}
                // 	/*SCRATCH*//*::*//*allow3d*/
                // 	public go3D():void {
                // 		/*
                // 		if (!this.render3D || this.isIn3D) return;
                // 		var i:number = this.stagePart.getChildIndex(this.stagePane);
                // 		this.stagePart.removeChild(this.stagePane);
                // 		this.render3D.setStage(this.stagePane, this.stagePane.penLayer);
                // 		this.stagePart.addChildAt(this.stagePane, i);
                // 		this.isIn3D = true;
                // 		*/
                // 	}
                // 	/*SCRATCH*//*::*//*allow3d*/
                // 	public go2D():void {
                // 		//if (!this.render3D || !this.isIn3D) return;
                // 		var i:number = this.stagePart.getChildIndex(this.stagePane);
                // 		this.stagePart.removeChild(this.stagePane);
                // 		//this.render3D.setStage(null, null);
                // 		this.stagePart.addChildAt(this.stagePane, i);
                // 		this.isIn3D = false;
                // 		for (i = 0; i < this.stagePane.numChildren; ++i) {
                // 			var spr:ScratchSprite = (<ScratchSprite>this.stagePane.getChildAt(i) );
                // 			if (spr) {
                // 				spr.clearCachedBitmap();
                // 				spr.updateCostume();
                // 				spr.applyFilters();
                // 			}
                // 		}
                // 		this.stagePane.clearCachedBitmap();
                // 		this.stagePane.updateCostume();
                // 		this.stagePane.applyFilters();
                // 	}
                // 	private debugRect:Shape;
                // 	public showDebugRect(r:Rectangle):void {
                // 		// Used during debugging...
                // 		var p:Point = this.stagePane.localToGlobal(new Point(0, 0));
                // 		if (!this.debugRect) this.debugRect = new Shape();
                // 		var g:Graphics = this.debugRect.graphics;
                // 		g.clear();
                // 		if (r) {
                // 			g.lineStyle(2, 0xFFFF00);
                // 			g.drawRect(p.x + r.x, p.y + r.y, r.width, r.height);
                // 			this.addChild(this.debugRect);
                // 		}
                // 	}
                // 	public strings():any[] {
                // 		return [
                // 			"a copy of the project file on your computer.",
                // 			"Project not saved!", "Save now", "Not saved; project did not load.",
                // 			"Save project?", "Don\"t save",
                // 			"Save now", "Saved",
                // 			"Revert", "Undo Revert", "Reverting...",
                // 			"Throw away all changes since opening this project?",
                // 		];
                // 	}
                // 	public viewedObj():ScratchObj {
                // 		return this.viewedObject;
                // 	}
                // 	public stageObj():ScratchStage {
                // 		return this.stagePane;
                // 	}
                // 	public projectName():string {
                // 		return this.stagePart.projectName();
                // 	}
                // 	public highlightSprites(sprites:any[]):void {
                // 		this.libraryPart.highlight(sprites);
                // 	}
                // 	public refreshImageTab(fromEditor:boolean):void {
                // 		this.imagesPart.refresh(fromEditor);
                // 	}
                // 	public refreshSoundTab():void {
                // 		this.soundsPart.refresh();
                // 	}
                // 	public selectCostume():void {
                // 		this.imagesPart.selectCostume();
                // 	}
                // 	public selectSound(snd:ScratchSound):void {
                // 		this.soundsPart.selectSound(snd);
                // 	}
                // 	public clearTool():void {
                // 		CursorTool.setTool(null);
                // 		this.topBarPart.clearToolButtons();
                // 	}
                // 	public tabsRight():number {
                // 		return this.tabsPart.x + this.tabsPart.w;
                // 	}
                // 	public enableEditorTools(flag:boolean):void {
                // 		this.imagesPart.editor.enableTools(flag);
                // 	}
                // public get usesUserNameBlock(): boolean {
                //     return this._usesUserNameBlock;
                // }
                //
                // public set usesUserNameBlock(value: boolean) {
                //     this._usesUserNameBlock = value;
                //     this.stagePart.refresh();
                // }
                // 	public updatePalette(clearCaches:boolean = true):void {
                // 		// Note: updatePalette() is called after changing variable, list, or procedure
                // 		// definitions, so this is a convenient place to clear the interpreter"s caches.
                // 		if (this.isShowing(this.scriptsPart)) this.scriptsPart.updatePalette();
                // 		if (clearCaches) this.runtime.clearAllCaches();
                // 	}
                // 	public setProjectName(s:string):void {
                // 		if (s.slice(-3) == ".sb") s = s.slice(0, -3);
                // 		if (s.slice(-4) == ".sb2") s = s.slice(0, -4);
                // 		this.stagePart.setProjectName(s);
                // 	}
                // 	protected wasEditing:boolean;
                // 	public setPresentationMode(enterPresentation:boolean):void {
                // 		if (enterPresentation) {
                // 			this.wasEditing = this.editMode;
                // 			if (this.wasEditing) {
                // 				this.setEditMode(false);
                // 				if (this.jsEnabled) this.externalCall("tip_bar_api.hide");
                // 			}
                // 		} else {
                // 			if (this.wasEditing) {
                // 				this.setEditMode(true);
                // 				if (this.jsEnabled) this.externalCall("tip_bar_api.show");
                // 			}
                // 		}
                // 		if (this.isOffline) {
                // 			//this.stage.displayState = enterPresentation ? StageDisplayState.FULL_SCREEN_INTERACTIVE : StageDisplayState.NORMAL;
                // 		}
                // 		for (var o of this.stagePane.allObjects()) o.applyFilters();
                // 		if (this.lp) this.fixLoadProgressLayout();
                // 		this.stagePane.updateCostume();
                // 		// Scratch::allow3d {
                // 		// 	if (this.isIn3D) this.render3D.onStageResize();
                // 		// }
                // 	}
                // 	private keyDown(evt:KeyboardEvent):void {
                // 		// Escape stops drag operations
                // 		if (!evt.shiftKey && evt.charCode == 27) {
                // 			this.gh.escKeyDown();
                // 		}
                // 		// Escape exists presentation mode.
                // 		else if ((evt.charCode == 27) && this.stagePart.isInPresentationMode()) {
                // 			this.setPresentationMode(false);
                // 			this.stagePart.exitPresentationMode();
                // 		}
                // 		// Handle enter key
                // //		else if(evt.keyCode == 13 && !stage.focus) {
                // //			stagePart.playButtonPressed(null);
                // //			evt.preventDefault();
                // //			evt.stopImmediatePropagation();
                // //		}
                // 		// Handle ctrl-m and toggle 2d/3d mode
                // 		else if (evt.ctrlKey && evt.charCode == 109) {
                // 			// Scratch::allow3d {
                // 			// 	this.isIn3D ? this.go2D() : this.go3D();
                // 			// }
                // 			evt.preventDefault();
                // 			evt.stopImmediatePropagation();
                // 		}
                // 		else {
                // 			this.runtime.keyDown(evt);
                // 		}
                // 	}
                // 	private setSmallStageMode(flag:boolean):void {
                // 		this.stageIsContracted = flag;
                // 		this.stagePart.updateRecordingTools();
                // 		this.fixLayout();
                // 		this.libraryPart.refresh();
                // 		this.tabsPart.refresh();
                // 		this.stagePane.applyFilters();
                // 		this.stagePane.updateCostume();
                // 	}
                // 	public projectLoaded():void {
                // 		this.removeLoadProgressBox();
                // 		//this.System.gc();
                // 		if (this.autostart) this.runtime.startGreenFlags(true);
                // 		this.loadInProgress = false;
                // 		this.saveNeeded = false;
                // 		// translate the blocks of the newly loaded project
                // 		for (var o of this.stagePane.allObjects()) {
                // 			o.updateScriptsAfterTranslation();
                // 		}
                // 		if (this.jsEnabled && this.isExtensionDevMode) {
                // 			if (this.pendingExtensionURLs) {
                // 				this.loadGithubURL(this.pendingExtensionURLs);
                // 				this.pendingExtensionURLs = null;
                // 			}
                // 			this.externalCall("JSprojectLoaded");
                // 		}
                // 	}
                // 	public resetPlugin():void {
                // 		if (this.jsEnabled)
                // 			this.externalCall("ScratchExtensions.resetPlugin");
                // 	}
                // 	protected step(e:Event):void {
                // 		// Step the runtime system and all UI components.
                // 		this.gh.step();
                // 		this.runtime.stepRuntime();
                // 		Transition.step(null);
                // 		this.stagePart.step();
                // 		this.libraryPart.step();
                // 		this.scriptsPart.step();
                // 		this.imagesPart.step();
                // 	}
                // 	public updateSpriteLibrary(sortByIndex:boolean = false):void {
                // 		this.libraryPart.refresh()
                // 	}
                // 	public updateTopBar():void {
                // 		this.topBarPart.refresh();
                // 	}
                // 	public threadStarted():void {
                // 		this.stagePart.threadStarted()
                // 	}
                // 	public selectSprite(obj:ScratchObj):void {
                // 		if (this.isShowing(this.imagesPart)) this.imagesPart.editor.shutdown();
                // 		if (this.isShowing(this.soundsPart)) this.soundsPart.editor.shutdown();
                // 		this.viewedObject = obj;
                // 		this.libraryPart.refresh();
                // 		this.tabsPart.refresh();
                // 		if (this.isShowing(this.imagesPart)) {
                // 			this.imagesPart.refresh();
                // 		}
                // 		if (this.isShowing(this.soundsPart)) {
                // 			this.soundsPart.currentIndex = 0;
                // 			this.soundsPart.refresh();
                // 		}
                // 		if (this.isShowing(this.scriptsPart)) {
                // 			this.scriptsPart.updatePalette();
                // 			this.scriptsPane.viewScriptsFor(obj);
                // 			this.scriptsPart.updateSpriteWatermark();
                // 		}
                // 	}
                // 	public setTab(tabName:string):void {
                // 		if (this.isShowing(this.imagesPart)) this.imagesPart.editor.shutdown();
                // 		if (this.isShowing(this.soundsPart)) this.soundsPart.editor.shutdown();
                // 		this.hide(this.scriptsPart);
                // 		this.hide(this.imagesPart);
                // 		this.hide(this.soundsPart);
                // 		if (!this.editMode) return;
                // 		if (tabName == "images") {
                // 			this.show(this.imagesPart);
                // 			this.imagesPart.refresh();
                // 		} else if (tabName == "sounds") {
                // 			this.soundsPart.refresh();
                // 			this.show(this.soundsPart);
                // 		} else if (tabName && (tabName.length > 0)) {
                // 			tabName = "scripts";
                // 			this.scriptsPart.updatePalette();
                // 			this.scriptsPane.viewScriptsFor(this.viewedObject);
                // 			this.scriptsPart.updateSpriteWatermark();
                // 			this.show(this.scriptsPart);
                // 		}
                // 		this.show(this.tabsPart);
                // 		this.show(this.stagePart); // put stage in front
                // 		this.tabsPart.selectTab(tabName);
                // 		this.lastTab = tabName;
                // 		if (this.saveNeeded) this.setSaveNeeded(true); // save project when switching tabs, if needed (but NOT while loading!)
                // 	}
                // 	public installStage(newStage:ScratchStage):void {
                // 		var showGreenflagOverlay:boolean = this.shouldShowGreenFlag();
                // 		this.stagePart.installStage(newStage, showGreenflagOverlay);
                // 		this.selectSprite(newStage);
                // 		this.libraryPart.refresh();
                // 		this.setTab("scripts");
                // 		this.scriptsPart.resetCategory();
                // 		this.wasEdited = false;
                // 	}
                // 	protected shouldShowGreenFlag():boolean {
                // 		return !(this.autostart || this.editMode);
                // 	}
                // 	protected addParts():void {
                // 		this.initTopBarPart();
                // 		this.stagePart = this.getStagePart();
                // 		this.libraryPart = this.getLibraryPart();
                // 		this.tabsPart = new TabsPart(this);
                // 		this.initScriptsPart();
                // 		this.initImagesPart();
                // 		this.soundsPart = new SoundsPart(this);
                // 		this.addChild(this.topBarPart);
                // 		this.addChild(this.stagePart);
                // 		this.addChild(this.libraryPart);
                // 		this.addChild(this.tabsPart);
                // 	}
                // 	protected getStagePart():StagePart {
                // 		return new StagePart(this);
                // 	}
                // 	protected getLibraryPart():LibraryPart {
                // 		return new LibraryPart(this);
                // 	}
                // 	public fixExtensionURL(javascriptURL:string):string {
                // 		return javascriptURL;
                // 	}
                // 	// -----------------------------
                // 	// UI Modes and Resizing
                // 	//------------------------------
                // 	public setEditMode(newMode:boolean):void {
                // 		Menu.removeMenusFrom(this.stage);
                // 		this.editMode = newMode;
                // 		if (this.editMode) {
                // 			this.interp.showAllRunFeedback();
                // 			this.hide(this.playerBG);
                // 			this.show(this.topBarPart);
                // 			this.show(this.libraryPart);
                // 			this.show(this.tabsPart);
                // 			this.setTab(this.lastTab);
                // 			this.stagePart.hidePlayButton();
                // 			this.runtime.edgeTriggersEnabled = true;
                // 		} else {
                // 			this.addChildAt(this.playerBG, 0); // behind everything
                // 			this.playerBG.visible = false;
                // 			this.hide(this.topBarPart);
                // 			this.hide(this.libraryPart);
                // 			this.hide(this.tabsPart);
                // 			this.setTab(null); // hides scripts, images, and sounds
                // 		}
                // 		this.stagePane.updateListWatchers();
                // 		this.show(this.stagePart); // put stage in front
                // 		this.fixLayout();
                // 		this.stagePart.refresh();
                // 	}
                // 	protected hide(obj:DisplayObject):void {
                // 		if (obj.parent) obj.parent.removeChild(obj)
                // 	}
                // 	protected show(obj:DisplayObject):void {
                // 		this.addChild(obj)
                // 	}
                // 	protected isShowing(obj:DisplayObject):boolean {
                // 		return obj.parent != null
                // 	}
                // 	public onResize(e:Event):void {
                // 		if (!this.ignoreResize) this.fixLayout();
                // 	}
                // 	public fixLayout():void {
                // 		var w:number = this.stage.stageWidth;
                // 		var h:number = this.stage.stageHeight - 1; // fix to show bottom border...
                // 		w = Math.ceil(w / this.scaleX);
                // 		h = Math.ceil(h / this.scaleY);
                // 		this.updateLayout(w, h);
                // 	}
                Scratch.prototype.updateRecordingTools = function (t) {
                    // this.stagePart.updateRecordingTools(t);
                    console.log("todo: update recording tools");
                };
                Scratch.prototype.removeRecordingTools = function () {
                    // this.stagePart.removeRecordingTools();
                    console.log("todo: remove recording tools");
                };
                Scratch.prototype.refreshStagePart = function () {
                    // this.stagePart.refresh();
                    console.log("todo: refresh stage");
                };
                return Scratch;
            })();
            exports_1("Scratch", Scratch);
        }
    }
});
//# sourceMappingURL=scratch.js.map