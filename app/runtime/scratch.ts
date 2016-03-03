import {StageModel} from "../model/stage.model";
import {Interpreter} from "./interpreter";
import {ScratchRuntime} from "./scratch.runtime";
// Scratch.as
// John Maloney, September 2009
//
// This is the top-level application.

export class Scratch {
    // Version
    // public static versionString: string = "v443";
    // public static app: Scratch; // static reference to the app, used for debugging
    //
    // // Display modes
    // public hostProtocol: string = "http";
    public editMode: boolean; // true when project editor showing, false when only the player is showing
    public isOffline: boolean; // true when running as an offline (i.e. stand-alone) app
    // public isSmallPlayer: boolean; // true when displaying as a scaled-down player (e.g. in search results)
    // public stageIsContracted: boolean; // true when the stage is half size to give more space on small screens
    // public isIn3D: boolean;
    // // public render3D:DisplayObjectContainerIn3D;
    // public isArmCPU: boolean;
    // public jsEnabled: boolean = false; // true when the SWF can talk to the webpage
    // public ignoreResize: boolean = false; // If true, temporarily ignore resize events.
    public isExtensionDevMode: boolean = false; // If true, run in extension development mode (as on ScratchX)
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
    public projectID: string = "";
    // public projectOwner: string = "";
    // public projectIsPrivate: boolean;
    // public oldWebsiteURL: string = "";
    // public loadInProgress: boolean;
    // public debugOps: boolean = false;
    // public debugOpCmd: string = "";
    //
    // protected autostart: boolean;
    // private viewedObject: ScratchObj;
    // private lastTab: string = "scripts";
    // protected wasEdited: boolean; // true if the project was edited and autosaved
    // private _usesUserNameBlock: boolean = false;
    // protected languageChanged: boolean; // set when language changed
    //
    // // UI Elements
    // public playerBG: Shape;
    // public palette: BlockPalette;
    // public scriptsPane: ScriptsPane;
    public stage: StageModel;
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
    runtime = new ScratchRuntime(this, this.runtime);


    constructor() {

        // SVGTool.setStage(this.stage);
        // this.loaderInfo.uncaughtErrorEvents.addEventListener("UNCAUGHT_ERROR", this.uncaughtErrorHandler);
        // Scratch.app = this;

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

    public updateRecordingTools(t: number) {
        // this.stagePart.updateRecordingTools(t);
        console.log("todo: update recording tools");
    }

    public removeRecordingTools() {
        // this.stagePart.removeRecordingTools();
        console.log("todo: remove recording tools");
    }

    public refreshStagePart() {
        // this.stagePart.refresh();
        console.log("todo: refresh stage");
    }

    // 	protected updateLayout(w:number, h:number):void {
    // 		if (!this.isMicroworld) {
    // 			this.topBarPart.x = 0;
    // 			this.topBarPart.y = 0;
    // 			this.topBarPart.setWidthHeight(w, 28);
    // 		}

    // 		var extraW:number = 2;
    // 		var extraH:number = this.stagePart.computeTopBarHeight() + 1;
    // 		if (this.editMode) {
    // 			// adjust for global scale (from browser zoom)

    // 			if (this.stageIsContracted) {
    // 				this.stagePart.setWidthHeight(240 + extraW, 180 + extraH, 0.5);
    // 			} else {
    // 				this.stagePart.setWidthHeight(480 + extraW, 360 + extraH, 1);
    // 			}
    // 			this.stagePart.x = 5;
    // 			this.stagePart.y = this.isMicroworld ? 5 : this.topBarPart.bottom() + 5;
    // 			this.fixLoadProgressLayout();
    // 		} else {
    // 			this.drawBG();
    // 			var pad:number = (w > 550) ? 16 : 0; // add padding for full-screen mode
    // 			var scale:number = Math.min((w - extraW - pad) / 480, (h - extraH - pad) / 360);
    // 			scale = Math.max(0.01, scale);
    // 			var scaledW:number = Math.floor((scale * 480) / 4) * 4; // round down to a multiple of 4
    // 			scale = scaledW / 480;
    // 			this.presentationScale = scale;
    // 			var playerW:number = (scale * 480) + extraW;
    // 			var playerH:number = (scale * 360) + extraH;
    // 			this.stagePart.setWidthHeight(playerW, playerH, scale);
    // 			this.stagePart.x = Math.floor((w - playerW) / 2);
    // 			this.stagePart.y = Math.floor((h - playerH) / 2);
    // 			this.fixLoadProgressLayout();
    // 			return;
    // 		}
    // 		this.libraryPart.x = this.stagePart.x;
    // 		this.libraryPart.y = this.stagePart.bottom() + 18;
    // 		this.libraryPart.setWidthHeight(this.stagePart.w, h - this.libraryPart.y);

    // 		this.tabsPart.x = this.stagePart.right() + 5;
    // 		if (!this.isMicroworld) {
    // 			this.tabsPart.y = this.topBarPart.bottom() + 5;
    // 			this.tabsPart.fixLayout();
    // 		}
    // 		else
    // 			this.tabsPart.visible = false;

    // 		// the content area shows the part associated with the currently selected tab:
    // 		var contentY:number = this.tabsPart.y + 27;
    // 		if (!this.isMicroworld)
    // 			w -= this.tipsWidth();
    // 		this.updateContentArea(this.tabsPart.x, contentY, w - this.tabsPart.x - 6, h - contentY - 5, h);
    // 	}

    // 	protected updateContentArea(contentX:number, contentY:number, contentW:number, contentH:number, fullH:number):void {
    // 		this.imagesPart.x = this.soundsPart.x = this.scriptsPart.x = contentX;
    // 		this.imagesPart.y = this.soundsPart.y = this.scriptsPart.y = contentY;
    // 		this.imagesPart.setWidthHeight(contentW, contentH);
    // 		this.soundsPart.setWidthHeight(contentW, contentH);
    // 		this.scriptsPart.setWidthHeight(contentW, contentH);

    // 		if (this.mediaLibrary) this.mediaLibrary.setWidthHeight(this.topBarPart.w, fullH);
    // 		if (this.frameRateGraph) {
    // 			this.frameRateGraph.y = this.stage.stageHeight - this.frameRateGraphH;
    // 			this.addChild(this.frameRateGraph); // put in front
    // 		}

    // 		// Scratch::allow3d {
    // 		// 	if (this.isIn3D) this.render3D.onStageResize();
    // 		// }
    // 	}

    // 	private drawBG():void {
    // 		var g:Graphics = this.playerBG.graphics;
    // 		g.clear();
    // 		g.beginFill(0);
    // 		g.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
    // 	}

    // 	private modalOverlay:Sprite;

    // 	public setModalOverlay(enableOverlay:boolean):void {
    // 		var currentlyEnabled:boolean = !!this.modalOverlay;
    // 		if (enableOverlay != currentlyEnabled) {
    // 			if (enableOverlay) {
    // 				function eatEvent(event:MouseEvent):void {
    // 					event.stopImmediatePropagation();
    // 					event.stopPropagation();
    // 				}

    // 				this.modalOverlay = new Sprite();
    // 				this.modalOverlay.graphics.beginFill(CSS.backgroundColor_ScratchX, 0.8);
    // 				this.modalOverlay.graphics.drawRect(0, 0, this.stage.width, this.stage.height);
    // 				this.modalOverlay.addEventListener(MouseEvent.CLICK, eatEvent);
    // 				this.modalOverlay.addEventListener(MouseEvent.MOUSE_DOWN, eatEvent);
    // 				// if (Scratch::allow3d) { // TODO: use a better flag or rename this one
    // 				// 	// These events are only available in flash 11.2 and above.
    // 				// 	this.modalOverlay.addEventListener(MouseEvent.RIGHT_CLICK, this.eatEvent);
    // 				// 	this.modalOverlay.addEventListener(MouseEvent.RIGHT_MOUSE_DOWN, this.eatEvent);
    // 				// 	this.modalOverlay.addEventListener(MouseEvent.MIDDLE_CLICK, this.eatEvent);
    // 				// 	this.modalOverlay.addEventListener(MouseEvent.MIDDLE_MOUSE_DOWN, this.eatEvent);
    // 				// }
    // 				this.stage.addChild(this.modalOverlay);
    // 			}
    // 			else {
    // 				this.stage.removeChild(this.modalOverlay);
    // 				this.modalOverlay = null;
    // 			}
    // 		}
    // 	}

    // 	public logoButtonPressed(b:IconButton):void {
    // 		if (this.isExtensionDevMode) {
    // 			this.externalCall("showPage", null, "home");
    // 		}
    // 	}

    // 	// -----------------------------
    // 	// Translations utilities
    // 	//------------------------------

    // 	public translationChanged():void {
    // 		// The translation has changed. Fix scripts and update the UI.
    // 		// directionChanged is true if the writing direction (e.g. left-to-right) has changed.
    // 		for (var o of this.stagePane.allObjects()) {
    // 			o.updateScriptsAfterTranslation();
    // 		}
    // 		var uiLayer:Sprite = Scratch.app.stagePane.getUILayer();
    // 		for (var i:number = 0; i < uiLayer.numChildren; ++i) {
    // 			var lw:ListWatcher = <ListWatcher>uiLayer.getChildAt(i) ;
    // 			if (lw) lw.updateTranslation();
    // 		}
    // 		this.topBarPart.updateTranslation();
    // 		this.stagePart.updateTranslation();
    // 		this.libraryPart.updateTranslation();
    // 		this.tabsPart.updateTranslation();
    // 		this.updatePalette(false);
    // 		this.imagesPart.updateTranslation();
    // 		this.soundsPart.updateTranslation();
    // 	}

    // 	// -----------------------------
    // 	// Menus
    // 	//------------------------------
    // 	public showFileMenu(b:any):void {
    // 		var m:Menu = new Menu(null, "File", CSS.topBarColor(), 28);
    // 		m.addItem("New", this.createNewProject);
    // 		m.addLine();

    // 		// Derived class will handle this
    // 		this.addFileMenuItems(b, m);

    // 		m.showOnStage(this.stage, b.x, this.topBarPart.bottom() - 1);
    // 	}

    // 	public stopVideo(b:any):void {
    // 		this.runtime.stopVideo();
    // 	}

    // 	protected addFileMenuItems(b:any, m:Menu):void {
    // 		m.addItem("Load Project", this.runtime.selectProjectFile);
    // 		m.addItem("Save Project", this.exportProjectToFile);
    // 		if (this.runtime.recording || this.runtime.ready==ReadyLabel.COUNTDOWN || this.runtime.ready==ReadyLabel.READY) {
    // 			m.addItem("Stop Video", this.runtime.stopVideo);
    // 		} else {
    // 			m.addItem("Record Project Video", this.runtime.exportToVideo);
    // 		}
    // 		if (this.canUndoRevert()) {
    // 			m.addLine();
    // 			m.addItem("Undo Revert", this.undoRevert);
    // 		} else if (this.canRevert()) {
    // 			m.addLine();
    // 			m.addItem("Revert", this.revertToOriginalProject);
    // 		}

    // 		if (b.lastEvent.shiftKey) {
    // 			m.addLine();
    // 			m.addItem("Save Project Summary", this.saveSummary);
    // 			m.addItem("Show version details", this.showVersionDetails);
    // 		}
    // 		if (b.lastEvent.shiftKey && this.jsEnabled) {
    // 			m.addLine();
    // 			m.addItem("Import experimental extension", function ():void {
    // 				function loadJSExtension(dialog:DialogBox):void {
    // 					var url:string = this.dialog.getField("URL").replace(/^\s+|\s+$/g, "");
    // 					if (this.url.length == 0) return;
    // 					this.externalCall("ScratchExtensions.loadExternalJS", null, this.url);
    // 				}

    // 				var d:DialogBox = new DialogBox(this.loadJSExtension);
    // 				d.addTitle("Load Javascript Scratch Extension");
    // 				d.addField("URL", 120);
    // 				d.addAcceptCancelButtons("Load");
    // 				d.showOnStage(Scratch.app.stage);
    // 			});
    // 		}
    // 	}

    // 	public showEditMenu(b:any):void {
    // 		var m:Menu = new Menu(null, "More", CSS.topBarColor(), 28);
    // 		m.addItem("Undelete", this.runtime.undelete, this.runtime.canUndelete());
    // 		m.addLine();
    // 		m.addItem("Small stage layout", this.toggleSmallStage, true, this.stageIsContracted);
    // 		m.addItem("Turbo mode", this.toggleTurboMode, true, this.interp.turboMode);
    // 		this.addEditMenuItems(b, m);
    // 		var p:Point = b.localToGlobal(new Point(0, 0));
    // 		m.showOnStage(this.stage, b.x, this.topBarPart.bottom() - 1);
    // 	}

    // 	protected addEditMenuItems(b:any, m:Menu):void {
    // 		m.addLine();
    // 		m.addItem("Edit block colors", this.editBlockColors);
    // 	}

    // 	protected editBlockColors():void {
    // 		var d:DialogBox = new DialogBox();
    // 		d.addTitle("Edit Block Colors");
    // 		d.addWidget(new BlockColorEditor());
    // 		d.addButton("Close", d.cancel);
    // 		d.showOnStage(this.stage, true);
    // 	}

    // 	protected canExportInternals():boolean {
    // 		return false;
    // 	}

    // 	private showAboutDialog():void {
    // 		DialogBox.notify(
    // 				"Scratch 2.0 " + Scratch.versionString,
    // 				"\n\nCopyright © 2012 MIT Media Laboratory" +
    // 				"\nAll rights reserved." +
    // 				"\n\nPlease do not distribute!", this.stage);
    // 	}

    // 	protected createNewProjectAndThen(callback:Function = null):void {
    // 		function clearProject():void {
    // 			this.startNewProject("", "");
    // 			this.setProjectName("Untitled");
    // 			this.topBarPart.refresh();
    // 			this.stagePart.refresh();
    // 			if (callback != null) callback();
    // 		}

    // 		this.saveProjectAndThen(clearProject);
    // 	}

    // 	protected createNewProject(ignore:any = null):void {
    // 		this.createNewProjectAndThen();
    // 	}

    // 	protected createNewProjectScratchX(jsCallback:any[]):void {
    // 		this.createNewProjectAndThen(function():void {
    // 			this.externalCallArray(jsCallback);
    // 		});
    // 	}

    // 	protected saveProjectAndThen(postSaveAction:Function = null):void {
    // 		// Give the user a chance to save their project, if needed, then call postSaveAction.
    // 		function doNothing():void {
    // 		}

    // 		function cancel():void {
    // 			d.cancel();
    // 		}

    // 		function proceedWithoutSaving():void {
    // 			d.cancel();
    // 			postSaveAction()
    // 		}

    // 		function save():void {
    // 			d.cancel();
    // 			this.exportProjectToFile(false, postSaveAction);
    // 		}

    // 		if (postSaveAction == null) postSaveAction = doNothing;
    // 		if (!this.saveNeeded) {
    // 			postSaveAction();
    // 			return;
    // 		}
    // 		var d:DialogBox = new DialogBox();
    // 		d.addTitle("Save project?");
    // 		d.addButton("Save", save);
    // 		d.addButton("Don\"t save", proceedWithoutSaving);
    // 		d.addButton("Cancel", cancel);
    // 		d.showOnStage(this.stage);
    // 	}

    // 	public exportProjectToFile(fromJS:boolean = false, saveCallback:Function = null):void {
    // 		function squeakSoundsConverted():void {
    // 			this.scriptsPane.saveScripts(false);
    // 			var projectType:string = this.extensionManager.hasExperimentalExtensions() ? ".sbx" : ".sb2";
    // 			var defaultName:string = this.projectName().trim();
    // 			this.defaultName = ((this.defaultName.length > 0) ? this.defaultName : "project") + this.projectType;
    // 			var zipData:ByteArray = projIO.encodeProjectAsZipFile(this.stagePane);
    // 			var file:FileReference = new FileReference();
    // 			this.file.addEventListener(Event.COMPLETE, this.fileSaved);
    // 			this.file.save(this.zipData, Scratch.fixFileName(this.defaultName));
    // 		}

    // 		function fileSaved(e:Event):void {
    // 			if (!fromJS) this.setProjectName(this.e.target.name);
    // 			if (this.isExtensionDevMode) {
    // 				// Some versions of the editor think of this as an "export" and some think of it as a "save"
    // 				this.saveNeeded = false;
    // 			}
    // 			if (saveCallback != null) saveCallback();
    // 		}

    // 		if (this.loadInProgress) return;
    // 		var projIO:ProjectIO = new ProjectIO(this);
    // 		projIO.convertSqueakSounds(this.stagePane, squeakSoundsConverted);
    // 	}

    // 	public static fixFileName(s:string):string {
    // 		// Replace illegal characters in the given string with dashes.
    // 		var illegal:string = "\\/:*?"<>|%";
    // 		var result:string = "";
    // 		for (var i:number = 0; i < s.length; i++) {
    // 			var ch:string = s.charAt(i);
    // 			if ((i == 0) && ("." == ch)) ch = "-"; // don"t allow leading period
    // 			result += (illegal.indexOf(ch) > -1) ? "-" : ch;
    // 		}
    // 		return result;
    // 	}

    // 	public saveSummary():void {
    // 		var name:string = (this.projectName() || "project") + ".txt";
    // 		var file:FileReference = new FileReference();
    // 		file.save(this.stagePane.getSummary(), Scratch.fixFileName(name));
    // 	}

    // 	public toggleSmallStage():void {
    // 		this.setSmallStageMode(!this.stageIsContracted);
    // 	}

    // 	public toggleTurboMode():void {
    // 		this.interp.turboMode = !this.interp.turboMode;
    // 		this.stagePart.refresh();
    // 	}

    // 	public handleTool(tool:string, evt:MouseEvent):void {
    // 	}

    // 	public showBubble(text:string, x:any = null, y:any = null, width:number = 0):void {
    // 		if (x == null) x = this.stage.mouseX;
    // 		if (y == null) y = this.stage.mouseY;
    // 		this.gh.showBubble(text, Number(x), Number(y), width);
    // 	}

    // 	// TODO: calculate field width for up to 40 hex digits of CSS.normalTextFont
    // 	protected kGitHashFieldWidth:number = 7 * 41;
    // 	protected makeVersionDetailsDialog():DialogBox {
    // 		var d:DialogBox = new DialogBox();
    // 		d.addTitle("Version Details");
    // 		//d.addField("GPU enabled", this.kGitHashFieldWidth, Scratch.allow3d);
    // 		d.addField("scratch-flash", this.kGitHashFieldWidth, Scratch.versionString);
    // 		return d;
    // 	}

    // 	protected showVersionDetails():void {
    // 		var versionDetailsBox:DialogBox = this.makeVersionDetailsDialog();
    // 		versionDetailsBox.addButton("OK", versionDetailsBox.accept);
    // 		versionDetailsBox.showOnStage(this.stage);
    // 	}

    // 	// -----------------------------
    // 	// Project Management and Sign in
    // 	//------------------------------

    // 	public setLanguagePressed(b:IconButton):void {
    // 		function setLanguage(lang:string):void {
    // 			Translator.setLanguage(this.lang);
    // 			this.languageChanged = true;
    // 		}

    // 		if (Translator.languages.length == 0) return; // empty language list
    // 		var m:Menu = new Menu(setLanguage, "Language", CSS.topBarColor(), 28);
    // 		if (b.lastEvent.shiftKey) {
    // 			m.addItem("import translation file");
    // 			m.addItem("set font size");
    // 			m.addLine();
    // 		}
    // 		for (var entry of Translator.languages) {
    // 			m.addItem(entry[1], entry[0]);
    // 		}
    // 		var p:Point = b.localToGlobal(new Point(0, 0));
    // 		m.showOnStage(this.stage, b.x, this.topBarPart.bottom() - 1);
    // 	}

    // 	public startNewProject(newOwner:string, newID:string):void {
    // 		this.runtime.installNewProject();
    // 		this.projectOwner = newOwner;
    // 		this.projectID = newID;
    // 		this.projectIsPrivate = true;
    // 	}

    // 	// -----------------------------
    // 	// Save status
    // 	//------------------------------

    // 	public saveNeeded:boolean;

    // 	public setSaveNeeded(saveNow:boolean = false):void {
    // 		saveNow = false;
    // 		// Set saveNeeded flag and update the status string.
    // 		this.saveNeeded = true;
    // 		if (!this.wasEdited) saveNow = true; // force a save on first change
    // 		this.clearRevertUndo();
    // 	}

    // 	protected clearSaveNeeded():void {
    // 		// Clear saveNeeded flag and update the status string.
    // 		function twoDigits(n:number):string {
    // 			return ((this.n < 10) ? "0" : "") + this.n
    // 		}

    // 		this.saveNeeded = false;
    // 		this.wasEdited = true;
    // 	}

    // 	// -----------------------------
    // 	// Project Reverting
    // 	//------------------------------

    // 	protected originalProj:ByteArray;
    // 	private revertUndo:ByteArray;

    // 	public saveForRevert(projData:ByteArray, isNew:boolean, onServer:boolean = false):void {
    // 		this.originalProj = projData;
    // 		this.revertUndo = null;
    // 	}

    // 	protected doRevert():void {
    // 		this.runtime.installProjectFromData(this.originalProj, false);
    // 	}

    // 	protected revertToOriginalProject():void {
    // 		function preDoRevert():void {
    // 			this.revertUndo = new ProjectIO(Scratch.app).encodeProjectAsZipFile(this.stagePane);
    // 			this.doRevert();
    // 		}

    // 		if (!this.originalProj) return;
    // 		DialogBox.confirm("Throw away all changes since opening this project?", this.stage, preDoRevert);
    // 	}

    // 	protected undoRevert():void {
    // 		if (!this.revertUndo) return;
    // 		this.runtime.installProjectFromData(this.revertUndo, false);
    // 		this.revertUndo = null;
    // 	}

    // 	protected canRevert():boolean {
    // 		return this.originalProj != null
    // 	}

    // 	protected canUndoRevert():boolean {
    // 		return this.revertUndo != null
    // 	}

    // 	private clearRevertUndo():void {
    // 		this.revertUndo = null
    // 	}

    // 	public addNewSprite(spr:ScratchSprite, showImages:boolean = false, atMouse:boolean = false):void {
    // 		var c:ScratchCostume, byteCount:number;
    // 		for (c of spr.costumes) {
    // 			if (!c.baseLayerData) c.prepareToSave()
    // 			byteCount += c.baseLayerData.length;
    // 		}
    // 		if (!this.okayToAdd(byteCount)) return; // not enough room
    // 		spr.objName = this.stagePane.unusedSpriteName(spr.objName);
    // 		spr.indexInLibrary = 1000000; // add at end of library
    // 		spr.setScratchXY(Math.floor(200 * Math.random() - 100), Math.floor(100 * Math.random() - 50));
    // 		if (atMouse) spr.setScratchXY(this.stagePane.scratchMouseX(), this.stagePane.scratchMouseY());
    // 		this.stagePane.addChild(spr);
    // 		spr.updateCostume();
    // 		this.selectSprite(spr);
    // 		this.setTab(showImages ? "images" : "scripts");
    // 		this.setSaveNeeded(true);
    // 		this.libraryPart.refresh();
    // 		for (c of spr.costumes) {
    // 			if (ScratchCostume.isSVGData(c.baseLayerData)) c.setSVGData(c.baseLayerData, false);
    // 		}
    // 	}

    // 	public addSound(snd:ScratchSound, targetObj:ScratchObj = null):void {
    // 		if (snd.soundData && !this.okayToAdd(snd.soundData.length)) return; // not enough room
    // 		if (!targetObj) targetObj = this.viewedObj();
    // 		snd.soundName = targetObj.unusedSoundName(snd.soundName);
    // 		targetObj.sounds.push(snd);
    // 		this.setSaveNeeded(true);
    // 		if (targetObj == this.viewedObj()) {
    // 			this.soundsPart.selectSound(snd);
    // 			this.setTab("sounds");
    // 		}
    // 	}

    // 	public addCostume(c:ScratchCostume, targetObj:ScratchObj = null):void {
    // 		if (!c.baseLayerData) c.prepareToSave();
    // 		if (!this.okayToAdd(c.baseLayerData.length)) return; // not enough room
    // 		if (!targetObj) targetObj = this.viewedObj();
    // 		c.costumeName = targetObj.unusedCostumeName(c.costumeName);
    // 		targetObj.costumes.push(c);
    // 		targetObj.showCostumeNamed(c.costumeName);
    // 		this.setSaveNeeded(true);
    // 		if (targetObj == this.viewedObj()) this.setTab("images");
    // 	}

    // 	public okayToAdd(newAssetBytes:number):boolean {
    // 		// Return true if there is room to add an asset of the given size.
    // 		// Otherwise, return false and display a warning dialog.
    // 		var assetByteLimit:number = 50 * 1024 * 1024; // 50 megabytes
    // 		var assetByteCount:number = newAssetBytes;
    // 		for (var obj of this.stagePane.allObjects()) {
    // 			for (var c of obj.costumes) {
    // 				if (!c.baseLayerData) c.prepareToSave();
    // 				assetByteCount += c.baseLayerData.length;
    // 			}
    // 			for (var snd of obj.sounds) assetByteCount += snd.soundData.length;
    // 		}
    // 		if (assetByteCount > assetByteLimit) {
    // 			var overBy:number = Math.max(1, (assetByteCount - assetByteLimit) / 1024);
    // 			DialogBox.notify(
    // 					"Sorry!",
    // 					"Adding that media asset would put this project over the size limit by " + overBy + " KB\n" +
    // 					"Please remove some costumes, backdrops, or sounds before adding additional media.",
    // 					this.stage);
    // 			return false;
    // 		}
    // 		return true;
    // 	}

    // 	// -----------------------------
    // 	// Flash sprite (helps connect a sprite on the stage with a sprite library entry)
    // 	//------------------------------

    // 	public flashSprite(spr:ScratchSprite):void {
    // 		function doFade(alpha:number):void {
    // 			box.alpha = this.alpha
    // 		}

    // 		function deleteBox():void {
    // 			if (box.parent) {
    // 				box.parent.removeChild(box)
    // 			}
    // 		}

    // 		var r:Rectangle = spr.getVisibleBounds(this);
    // 		var box:Shape = new Shape();
    // 		box.graphics.lineStyle(3, CSS.overColor, 1, true);
    // 		box.graphics.beginFill(0x808080);
    // 		box.graphics.drawRoundRect(0, 0, r.width, r.height, 12, 12);
    // 		box.x = r.x;
    // 		box.y = r.y;
    // 		this.addChild(box);
    // 		Transition.cubic(doFade, 1, 0, 0.5, deleteBox);
    // 	}

    // 	// -----------------------------
    // 	// Download Progress
    // 	//------------------------------

    // 	public addLoadProgressBox(title:string):void {
    // 		this.removeLoadProgressBox();
    // 		this.lp = new LoadProgress();
    // 		this.lp.setTitle(title);
    // 		this.stage.addChild(this.lp);
    // 		this.fixLoadProgressLayout();
    // 	}

    // 	public removeLoadProgressBox():void {
    // 		if (this.lp && this.lp.parent) this.lp.parent.removeChild(this.lp);
    // 		this.lp = null;
    // 	}

    // 	private fixLoadProgressLayout():void {
    // 		if (!this.lp) return;
    // 		var p:Point = this.stagePane.localToGlobal(new Point(0, 0));
    // 		this.lp.scaleX = this.stagePane.scaleX;
    // 		this.lp.scaleY = this.stagePane.scaleY;
    // 		this.lp.x = Math.floor(p.x + ((this.stagePane.width - this.lp.width) / 2));
    // 		this.lp.y = Math.floor(p.y + ((this.stagePane.height - this.lp.height) / 2));
    // 	}

    // 	// -----------------------------
    // 	// Frame rate readout (for use during development)
    // 	//------------------------------

    // 	private frameRateReadout:TextField;
    // 	private firstFrameTime:number;
    // 	private frameCount:number;

    // 	protected addFrameRateReadout(x:number, y:number, color:number = 0):void {
    // 		this.frameRateReadout = new TextField();
    // 		this.frameRateReadout.autoSize = TextFieldAutoSize.LEFT;
    // 		this.frameRateReadout.selectable = false;
    // 		this.frameRateReadout.background = false;
    // 		this.frameRateReadout.defaultTextFormat = new TextFormat(CSS.font, 12, color);
    // 		this.frameRateReadout.x = x;
    // 		this.frameRateReadout.y = y;
    // 		this.addChild(this.frameRateReadout);
    // 		this.frameRateReadout.addEventListener(Event.ENTER_FRAME, this.updateFrameRate);
    // 	}

    // 	private updateFrameRate(e:Event):void {
    // 		this.frameCount++;
    // 		if (!this.frameRateReadout) return;
    // 		var now:number = Time.getTimer();
    // 		var msecs:number = now - this.firstFrameTime;
    // 		if (msecs > 500) {
    // 			var fps:number = Math.round((1000 * this.frameCount) / msecs);
    // 			this.frameRateReadout.text = fps + " fps (" + Math.round(msecs / this.frameCount) + " msecs)";
    // 			this.firstFrameTime = now;
    // 			this.frameCount = 0;
    // 		}
    // 	}

    // 	// TODO: Remove / no longer used
    // 	private frameRateGraphH:number = 150;
    // 	private frameRateGraph:Shape;
    // 	private nextFrameRateX:number;
    // 	private lastFrameTime:number;

    // 	private addFrameRateGraph():void {
    // 		this.addChild(this.frameRateGraph = new Shape());
    // 		this.frameRateGraph.y = this.stage.stageHeight - this.frameRateGraphH;
    // 		this.clearFrameRateGraph();
    // 		this.stage.addEventListener(Event.ENTER_FRAME, this.updateFrameRateGraph);
    // 	}

    // 	public clearFrameRateGraph():void {
    // 		var g:Graphics = this.frameRateGraph.graphics;
    // 		g.clear();
    // 		g.beginFill(0xFFFFFF);
    // 		g.drawRect(0, 0, this.stage.stageWidth, this.frameRateGraphH);
    // 		this.nextFrameRateX = 0;
    // 	}

    // 	private updateFrameRateGraph(evt:any):void {
    // 		var now:number = Time.getTimer();
    // 		var msecs:number = now - this.lastFrameTime;
    // 		this.lastFrameTime = now;
    // 		var c:number = 0x505050;
    // 		if (msecs > 40) c = 0xE0E020;
    // 		if (msecs > 50) c = 0xA02020;

    // 		if (this.nextFrameRateX > this.stage.stageWidth) this.clearFrameRateGraph();
    // 		var g:Graphics = this.frameRateGraph.graphics;
    // 		g.beginFill(c);
    // 		var barH:number = Math.min(this.frameRateGraphH, msecs / 2);
    // 		g.drawRect(this.nextFrameRateX, this.frameRateGraphH - barH, 1, barH);
    // 		this.nextFrameRateX++;
    // 	}

    // 	// -----------------------------
    // 	// Camera Dialog
    // 	//------------------------------

    // 	public openCameraDialog(savePhoto:Function):void {
    // 		this.closeCameraDialog();
    // 		this.cameraDialog = new CameraDialog(savePhoto);
    // 		this.cameraDialog.fixLayout();
    // 		this.cameraDialog.x = (this.stage.stageWidth - this.cameraDialog.width) / 2;
    // 		this.cameraDialog.y = (this.stage.stageHeight - this.cameraDialog.height) / 2;
    // 		this.addChild(this.cameraDialog);
    // 	}

    // 	public closeCameraDialog():void {
    // 		if (this.cameraDialog) {
    // 			this.cameraDialog.closeDialog();
    // 			this.cameraDialog = null;
    // 		}
    // 	}

    // 	// Misc.
    // 	public createMediaInfo(obj:any, owningObj:ScratchObj = null):MediaInfo {
    // 		return new MediaInfo(obj, owningObj);
    // 	}

    // 	public static loadSingleFile(fileLoaded:Function, filter:string):void {
    // 		//todo port
    // 		// function fileSelected(event:Event):void {
    // 		// 	if (fileList.fileList.length > 0) {
    // 		// 		var file:FileReference = fileList.fileList[0];
    // 		// 		this.file.addEventListener(Event.COMPLETE, fileLoaded);
    // 		// 		this.file.load();
    // 		// 	}
    // 		// }

    // 		// var fileList:FileReferenceList = new FileReferenceList();
    // 		// fileList.addEventListener("SELECT", fileSelected);
    // 		// try {
    // 		// 	// Ignore the exception that happens when you call browse() with the file browser open
    // 		// 	fileList.browse(filter != null ? [filter] : null);
    // 		// } catch (e) {
    // 		// }
    // 	}

    // 	// -----------------------------
    // 	// External Interface abstraction
    // 	//------------------------------
    // /*
    // 	public externalInterfaceAvailable():boolean {
    // 		return ExternalInterface.available;
    // 	}
    // */
    // 	public externalCall(functionName:string, returnValueCallback:Function = null, ...args):void {
    // 		console.log("TODO: external call")
    // 		// args.unshift(functionName);
    // 		// var retVal:any = ExternalInterface.call.apply(ExternalInterface, args);
    // 		// if (returnValueCallback != null) {
    // 		// 	returnValueCallback(retVal);
    // 		// }
    // 	}
    // /*
    // 	public addExternalCallback(functionName:string, closure:Function):void {
    // 		ExternalInterface.addCallback(functionName, closure);
    // 	}

    // 	// jsCallbackArray is: [functionName, arg1, arg2...] where args are optional.
    // 	// TODO: rewrite all versions of externalCall in terms of this
    // 	public externalCallArray(jsCallbackArray:any[], returnValueCallback:Function = null):void {
    // 		var args:any[] = jsCallbackArray.concat(); // clone
    // 		args.splice(1, 0, returnValueCallback);
    // 		this.externalCall.apply(this, args);
    // 	}
    // 	*/
}
