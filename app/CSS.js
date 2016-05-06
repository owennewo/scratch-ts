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
System.register(['./Scratch', './assets/Resources', './stubs/TextFormat'], function(exports_1) {
    var Scratch_1, Resources_1, TextFormat_1;
    var CSS;
    return {
        setters:[
            function (Scratch_1_1) {
                Scratch_1 = Scratch_1_1;
            },
            function (Resources_1_1) {
                Resources_1 = Resources_1_1;
            },
            function (TextFormat_1_1) {
                TextFormat_1 = TextFormat_1_1;
            }],
        execute: function() {
            CSS = (function () {
                function CSS() {
                }
                CSS.topBarColor = function () { return Scratch_1.Scratch.app.isExtensionDevMode ? CSS.topBarColor_ScratchX : CSS.topBarColor_default; };
                CSS.backgroundColor = function () { return Scratch_1.Scratch.app.isExtensionDevMode ? CSS.backgroundColor_ScratchX : CSS.backgroundColor_default; };
                // ScratchX
                CSS.topBarColor_ScratchX = 0x30485f;
                CSS.backgroundColor_ScratchX = 0x3f5975;
                // Colors
                CSS.white = 0xFFFFFF;
                CSS.backgroundColor_default = CSS.white;
                CSS.topBarColor_default = 0x9C9EA2;
                CSS.tabColor = 0xE6E8E8;
                CSS.panelColor = 0xF2F2F2;
                CSS.itemSelectedColor = 0xD0D0D0;
                CSS.borderColor = 0xD0D1D2;
                CSS.textColor = 0x5C5D5F; // 0x6C6D6F
                CSS.buttonLabelColor = CSS.textColor;
                CSS.buttonLabelOverColor = 0xFBA939;
                CSS.offColor = 0x8F9193; // 0x9FA1A3
                CSS.onColor = CSS.textColor; // 0x4C4D4F
                CSS.overColor = 0x179FD7;
                CSS.arrowColor = 0xA6A8AC;
                // Fonts
                CSS.font = Resources_1.Resources.chooseFont(['Arial', 'Verdana', 'DejaVu Sans']);
                CSS.menuFontSize = 12;
                CSS.normalTextFormat = new TextFormat_1.TextFormat(CSS.font, 12, CSS.textColor);
                CSS.topBarButtonFormat = new TextFormat_1.TextFormat(CSS.font, 12, CSS.white, true);
                CSS.titleFormat = new TextFormat_1.TextFormat(CSS.font, 14, CSS.textColor);
                CSS.thumbnailFormat = new TextFormat_1.TextFormat(CSS.font, 11, CSS.textColor);
                CSS.thumbnailExtraInfoFormat = new TextFormat_1.TextFormat(CSS.font, 9, CSS.textColor);
                CSS.projectTitleFormat = new TextFormat_1.TextFormat(CSS.font, 13, CSS.textColor);
                CSS.projectInfoFormat = new TextFormat_1.TextFormat(CSS.font, 12, CSS.textColor);
                // Section title bars
                CSS.titleBarColors = [CSS.white, CSS.tabColor];
                CSS.titleBarH = 30;
                return CSS;
            })();
            exports_1("CSS", CSS);
        }
    }
});
//}
//# sourceMappingURL=CSS.js.map