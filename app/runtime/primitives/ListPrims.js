System.register([], function(exports_1) {
    "use strict";
    var ListPrims;
    return {
        setters:[],
        execute: function() {
            // ListPrimitives.as
            // John Maloney, September 2010
            //
            // List primitives.
            // import {Scratch} from "../Scratch";
            // import {ScratchObj} from "../scratch/ScratchObj";
            // import {Primitives} from "../primitives/Primitives";
            // import {Specs} from "../Specs";
            // import {Block} from "../blocks/Block";
            // import {Interpreter} from "../interpreter/Interpreter";
            // import {ListWatcher} from "../watchers/ListWatcher";
            ListPrims = (function () {
                function ListPrims(app, interpreter) {
                    this.app = app;
                    this.interp = interpreter;
                }
                ListPrims.prototype.addPrimsTo = function (primTable) {
                    primTable[Specs.GET_LIST] = this.primContents;
                    primTable["append:toList:"] = this.primAppend;
                    primTable["deleteLine:ofList:"] = this.primDelete;
                    primTable["insert:at:ofList:"] = this.primInsert;
                    primTable["setLine:ofList:to:"] = this.primReplace;
                    primTable["getLine:ofList:"] = this.primGetItem;
                    primTable["lineCountOfList:"] = this.primLength;
                    primTable["list:contains:"] = this.primContains;
                };
                ListPrims.prototype.primContents = function (b) {
                    var list = this.interp.targetObj().lookupOrCreateList(b.spec);
                    if (!list)
                        return "";
                    var allSingleLetters = true;
                    for (var _i = 0, _a = list.contents; _i < _a.length; _i++) {
                        var el = _a[_i];
                        if (!((el instanceof String) && (el.length === 1))) {
                            allSingleLetters = false;
                            break;
                        }
                    }
                    return (list.contents.join(allSingleLetters ? "" : " "));
                };
                ListPrims.prototype.primAppend = function (b) {
                    var list = this.listarg(b, 1);
                    if (!list)
                        return;
                    this.listAppend(list, this.interp.arg(b, 0));
                    if (list.visible)
                        list.updateWatcher(list.contents.length, false, this.interp);
                };
                ListPrims.prototype.listAppend = function (list, item) {
                    list.contents.push(item);
                };
                ListPrims.prototype.primDelete = function (b) {
                    var which = this.interp.arg(b, 0);
                    var list = this.listarg(b, 1);
                    if (!list)
                        return;
                    var len = list.contents.length;
                    if (which === "all") {
                        this.listSet(list, []);
                        if (list.visible)
                            list.updateWatcher(-1, false, this.interp);
                    }
                    var n = (which === "last") ? len : Number(which);
                    if (isNaN(n))
                        return;
                    var i = Math.round(n);
                    if ((i < 1) || (i > len))
                        return;
                    this.listDelete(list, i);
                    if (list.visible)
                        list.updateWatcher(((i === len) ? i - 1 : i), false, this.interp);
                };
                ListPrims.prototype.listSet = function (list, newValue) {
                    list.contents = newValue;
                };
                ListPrims.prototype.listDelete = function (list, i) {
                    list.contents.splice(i - 1, 1);
                };
                ListPrims.prototype.primInsert = function (b) {
                    var val = this.interp.arg(b, 0);
                    var where = this.interp.arg(b, 1);
                    var list = this.listarg(b, 2);
                    if (!list)
                        return;
                    if (where === "last") {
                        this.listAppend(list, val);
                        if (list.visible)
                            list.updateWatcher(list.contents.length, false, this.interp);
                    }
                    else {
                        var i = this.computeIndex(where, list.contents.length + 1);
                        if (i < 0)
                            return;
                        this.listInsert(list, i, val);
                        if (list.visible)
                            list.updateWatcher(i, false, this.interp);
                    }
                };
                ListPrims.prototype.listInsert = function (list, i, item) {
                    list.contents.splice(i - 1, 0, item);
                };
                ListPrims.prototype.primReplace = function (b) {
                    var list = this.listarg(b, 1);
                    if (!list)
                        return;
                    var i = this.computeIndex(this.interp.arg(b, 0), list.contents.length);
                    if (i < 0)
                        return;
                    this.listReplace(list, i, this.interp.arg(b, 2));
                    if (list.visible)
                        list.updateWatcher(i, false, this.interp);
                };
                ListPrims.prototype.listReplace = function (list, i, item) {
                    list.contents[i - 1] = item;
                };
                ListPrims.prototype.primGetItem = function (b) {
                    var list = this.listarg(b, 1);
                    if (!list)
                        return "";
                    var i = this.computeIndex(this.interp.arg(b, 0), list.contents.length);
                    if (i < 0)
                        return "";
                    if (list.visible)
                        list.updateWatcher(i, true, this.interp);
                    return list.contents[i - 1];
                };
                ListPrims.prototype.primLength = function (b) {
                    var list = this.listarg(b, 0);
                    if (!list)
                        return 0;
                    return list.contents.length;
                };
                ListPrims.prototype.primContains = function (b) {
                    var list = this.listarg(b, 0);
                    if (!list)
                        return false;
                    var item = this.interp.arg(b, 1);
                    if (list.contents.indexOf(item) >= 0)
                        return true;
                    for (var _i = 0, _a = list.contents; _i < _a.length; _i++) {
                        var el = _a[_i];
                        // use Scratch comparison operator (Scratch considers the string "123" equal to the number 123)
                        if (Primitives.compare(el, item) === 0)
                            return true;
                    }
                    return false;
                };
                ListPrims.prototype.listarg = function (b, i) {
                    var listName = this.interp.arg(b, i);
                    if (listName.length === 0)
                        return null;
                    var obj = this.interp.targetObj();
                    var result = obj.listCache[listName];
                    if (!result) {
                        result = obj.listCache[listName] = obj.lookupOrCreateList(listName);
                    }
                    return result;
                };
                ListPrims.prototype.computeIndex = function (n, len) {
                    var i;
                    if (!(n instanceof Number)) {
                        if (n === "last")
                            return (len === 0) ? -1 : len;
                        if ((n === "any") || (n === "random"))
                            return (len === 0) ? -1 : 1 + Math.floor(Math.random() * len);
                        n = Number(n);
                        if (isNaN(n))
                            return -1;
                    }
                    i = Math.floor(n); // (n instanceof number) ? n : Math.floor(n);
                    if ((i < 1) || (i > len))
                        return -1;
                    return i;
                };
                return ListPrims;
            }());
            exports_1("ListPrims", ListPrims);
        }
    }
});
//# sourceMappingURL=ListPrims.js.map