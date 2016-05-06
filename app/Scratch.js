/*
 * Scratch Project Editor and Player
 * Copyright (C) 2014 Massachusetts Institute of Technology
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
System.register([], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Scratch;
    return {
        setters:[],
        execute: function() {
            // Scratch.as
            // John Maloney, September 2009
            //
            // This is the top-level application.
            //module scratch {
            // import {Sprite} from './stubs/Sprite';
            // import {Event} from './stubs/Event';
            // import {Shape} from './stubs/Shape';
            // import {TextField} from './stubs/TextField';
            // import {TextFieldAutoSize} from './stubs/TextFieldAutoSize';
            // import {TextFormat} from './stubs/TextFormat';
            // import {ByteArray} from './stubs/ByteArray';
            // import {FileReference} from './stubs/FileReference';
            // import {Point} from './stubs/Point';
            // import {Rectangle} from './stubs/Rectangle';
            // import {MediaInfo} from './ui/media/MediaInfo';
            // import {MediaPane} from './ui/media/MediaPane';
            // import {Graphics} from './stubs/Graphics';
            // import {MouseEvent} from './stubs/MouseEvent';
            // import {KeyboardEvent} from './stubs/KeyboardEvent';
            // import {Base64Encoder} from './util/Base64Encoder';
            // import {ExtensionDevManager} from './extensions/ExtensionDevManager';
            // import {ScratchRuntime} from './scratch/ScratchRuntime';
            // import {ScratchObj} from './scratch/ScratchObj';
            // import {Interpreter} from './interpreter/Interpreter';
            // import {BlockPalette} from './ui/BlockPalette';
            // import {PaletteBuilder} from './scratch/PaletteBuilder';
            // import {Block} from './blocks/Block';
            // import {BlockMenus} from './scratch/BlockMenus';
            // import {ScriptsPane} from './uiwidgets/ScriptsPane';
            // import {ScratchStage} from './scratch/ScratchStage';
            // import {ScratchSprite} from './scratch/ScratchSprite';
            // import {ScratchSound} from './scratch/ScratchSound';
            // import {CSS} from './CSS';
            // import {SVGTool} from './svgeditor/tools/SVGTool';
            // import {ScratchCostume} from './scratch/ScratchCostume';
            // import {Translator} from './translation/Translator';
            // import {MediaLibrary} from './ui/media/MediaLibrary';	
            // import {LoadProgress} from './ui/LoadProgress';
            // import {CameraDialog} from './ui/CameraDialog';	
            // import {LibraryPart} from './ui/parts/LibraryPart';
            // import {TopBarPart} from './ui/parts/TopBarPart';
            // import {StagePart} from './ui/parts/StagePart';
            // import {TabsPart} from './ui/parts/TabsPart';
            // import {ScriptsPart} from './ui/parts/ScriptsPart';
            // import {ImagesPart} from './ui/parts/ImagesPart';
            // import {SoundsPart} from './ui/parts/SoundsPart';
            // import {ExtensionManager} from './extensions/ExtensionManager';
            // import {Log} from './logging/Log';
            // import {LogLevel} from './logging/LogLevel';
            // import {DialogBox} from './uiwidgets/DialogBox';
            // import {CursorTool} from './uiwidgets/CursorTool';
            // import {Server} from './util/Server';
            // import {GestureHandler} from './util/GestureHandler';
            // import {Transition} from './util/Transition';
            // import {IconButton} from './uiwidgets/IconButton';
            // import {ReadyLabel} from './scratch/ReadyLabel';
            // import {Menu} from './uiwidgets/Menu';
            // import {ListWatcher} from './watchers/ListWatcher';
            // import {DisplayObject} from './stubs/DisplayObject';
            // import {ProjectIO} from './util/ProjectIO';
            // import {Time} from './stubs/Time';
            // import {BlockColorEditor} from './uiwidgets/BlockColorEditor';
            Scratch = (function (_super) {
                __extends(Scratch, _super);
                function Scratch() {
                    _super.apply(this, arguments);
                }
                return Scratch;
            })(Sprite);
            exports_1("Scratch", Scratch);
        }
    }
});
//}
//# sourceMappingURL=Scratch.js.map