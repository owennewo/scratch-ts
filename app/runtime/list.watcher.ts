import {ScratchTime} from "./scratch.time";
import {Translator} from "../utils/translator";
import {Scratch} from "./scratch";




export class ListWatcher {

    // private titleFont: TextFormat = new TextFormat(CSS.font, 12, 0, true);
    // private cellNumFont: TextFormat = new TextFormat(CSS.font, 11, 0, false);
    // private SCROLLBAR_W: number = 10;
		//
    // public listName: string = "";
    // public target: ScratchObj; // the ScratchObj that owns this list
    // public contents: any[] = [];
    // public isPersistent: boolean = false;
		//
    // private frame: ResizeableFrame;
    // private title: TextField;
    // private elementCount: TextField;
    // private cellPane: Sprite;
    // private scrollbar: Scrollbar;
    // private addItemButton: IconButton;
		//
    // private firstVisibleIndex: number;
    // private visibleCells: any[] = [];
    // private visibleCellNums: any[] = [];
    // private insertionIndex: number = -1; // where to add an item; -1 means to add it at the end
		//
    // private cellPool: any[] = []; // recycled cells
    // private cellNumPool: any[] = []; // recycled cell numbers
    // private tempCellNum: TextField; // used to compute maximum cell number width
		//
    // private lastAccess: number[] = new Array<number>();
    // private lastActiveIndex: number;
    // private contentsChanged: boolean;
    // private isIdle: boolean;
    // private limitedView: boolean;
		//
    // constructor(listName: string = "List Title", contents: any[] = null, target: ScratchObj = null, limitView: boolean = false) {
    //     super();
    //     this.listName = listName;
    //     this.target = target;
    //     this.contents = (contents === null) ? [] : contents;
    //     this.limitedView = limitView;
		//
    //     this.frame = new ResizeableFrame(0x949191, 0xC1C4C7, 14, false, 2);
    //     this.frame.setWidthHeight(50, 100);
    //     this.frame.showResizer();
    //     this.frame.minWidth = 80;
    //     this.frame.minHeight = 62;
    //     this.addChild(this.frame);
		//
    //     this.title = this.createTextField(listName, this.titleFont);
    //     this.frame.addChild(this.title);
		//
    //     this.cellPane = new Sprite();
    //     this.cellPane.mask = new Shape();
    //     this.cellPane.addChild(this.cellPane.mask);
    //     this.addChild(this.cellPane);
		//
    //     this.scrollbar = new Scrollbar(10, 10, this.scrollToFraction);
    //     this.addChild(this.scrollbar);
		//
    //     this.addItemButton = new IconButton(this.addItem, "addItem");
    //     this.addChild(this.addItemButton);
		//
    //     this.elementCount = this.createTextField(Translator.map("length") + ": 0", this.cellNumFont);
    //     this.frame.addChild(this.elementCount);
		//
    //     this.setWidthHeight(100, 200);
    //     this.addEventListener(FocusEvent.FOCUS_IN, this.gotFocus);
    //     this.addEventListener(FocusEvent.FOCUS_OUT, this.lostFocus);
    // }
		//
    // public static strings(): any[] {
    //     return [
    //         "length", "import", "export", "hide",
    //         "Which column do you want to import"];
    // }
		//
    // public toggleLimitedView(limitView: boolean): void {
    //     this.limitedView = limitView;
    // }
    // public updateTitleAndContents(): void {
    //     // Called when opening a project.
    //     this.updateTitle();
    //     this.scrollToIndex(0);
    // }
		//
    // public updateTranslation(): void { this.updateElementCount(); }
		//
    // /* Dragging */
		//
    // public objToGrab(evt: MouseEvent): ListWatcher { return this; } // allow dragging
		//
    // /* Menu */
		//
    // public menu(evt: MouseEvent): Menu {
    //     let m: Menu = new Menu();
    //     m.addItem("import", this.importList);
    //     m.addItem("export", this.exportList);
    //     m.addLine();
    //     m.addItem("hide", this.hide);
    //     return m;
    // }
		//
    // private importList(): void {
    //     // Prompt user for a file name and import that file.
    //     // Each line of the file becomes a list item.
    //     function fileLoaded(event: Event): void {
    //         let file: FileReference = this.FileReference(this.event.target);
    //         let s: string = this.file.data.readUTFBytes(this.file.data.length);
    //         this.importLines(this.removeTrailingEmptyLines(this.s.split(/\r\n|[\r\n]/)));
    //     }
		//
    //     Scratch.loadSingleFile(fileLoaded);
    // }
		//
    // private exportList(): void {
    //     let file: FileReference = new FileReference();
    //     let s: string = this.contents.join("\n") + "\n";
    //     file.save(s, this.listName + ".txt");
    // }
		//
    // private hide(): void {
    //     this.visible = false;
    //     Scratch.app.updatePalette(false);
    // }
		//
    // // -----------------------------
    // // Visual feedback for list changes
    // // ------------------------------
		//
    // private removeTrailingEmptyLines(lines: any[]): any[] {
    //     while (lines.length && !lines[lines.length - 1]) lines.pop();
    //     return lines;
    // }
		//
    // private importLines(lines: any[]): void {
    //     function gotColumn(s: string): void {
    //         let n: number = parseInt(this.s);
    //         if (isNaN(this.n) || (this.n < 1) || (this.n > columnCount)) this.contents = lines;
    //         else this.contents = this.extractColumn(this.n, lines, delimiter);
    //         this.scrollToIndex(0);
    //     }
    //     let delimiter: string = this.guessDelimiter(lines);
    //     if (delimiter === null) { // single column (or empty)
    //         this.contents = lines;
    //         this.scrollToIndex(0);
    //         return;
    //     }
    //     let columnCount: number = lines[0].split(delimiter).length;
    //     DialogBox.ask(
    //         Translator.map("Which column do you want to import") + "(1-" + columnCount + ")?",
    //         "1", Scratch.app.stage, gotColumn);
    // }
		//
    // private guessDelimiter(lines: any[]): string {
    //     // Guess the delimiter used to separate the fields in multicolumn data.
    //     // Return the delimiter or null if the data is not multicolumn.
    //     // Note: Assume we"ve found the right delimiter if it splits three
    //     // lines into the same number (greater than 1) of fields.
		//
    //     if (lines.length === 0) return null;
		//
    //     for (let d of [",", "\t"]) {
    //         let count1: number = lines[0].split(d).length;
    //         let count2: number = lines[Math.floor(lines.length / 2)].split(d).length;
    //         let count3: number = lines[lines.length - 1].split(d).length;
    //         if ((count1 > 1) && (count1 === count2) && (count1 === count3)) return d;
    //     }
    //     return null;
    // }
		//
    // private extractColumn(n: number, lines: any[], delimiter: string): any[] {
    //     let result: any[] = [];
    //     for (let s of lines) {
    //         let cols: any[] = s.split(delimiter);
    //         result.push((n <= cols.length) ? cols[n - 1] : "");
    //     }
    //     return result;
    // }
		//
    // // -----------------------------
    // // Visual feedback for list changes
    // // ------------------------------
		//
    // public updateWatcher(i: number, readOnly: boolean, interp: Interpreter): void {
    //     // Called by list primitives. Record access to entry at i and whether list contents have changed.
    //     // readOnly should be true for read operations, false for operations that change the list.
    //     // Note: To reduce the cost of list operations, this function merely records changes,
    //     // leaving the more time-consuming work of updating the visual feedback to step(), which
    //     // is called only once per frame.
    //     this.isIdle = false;
    //     if (!readOnly) this.contentsChanged = true;
    //     if (this.parent === null) this.visible = false;
    //     if (!this.visible) return;
    //     this.adjustLastAccessSize();
    //     if ((i < 1) || (i > this.lastAccess.length)) return;
    //     this.lastAccess[i - 1] = Time.getTimer();
    //     this.lastActiveIndex = i - 1;
    //     interp.redraw();
    // }
		//
    // public prepareToShow(): void {
    //     // Called before showing a list that has been hidden to update its contents.
    //     this.updateTitle();
    //     this.contentsChanged = true;
    //     this.isIdle = false;
    //     this.step();
    // }
		//
    // public step(): void {
    //     // Update index highlights and contents if they have changed.
    //     if (this.isIdle) return;
    //     if (this.contentsChanged) {
    //         this.updateContents();
    //         this.updateScrollbar();
    //         this.contentsChanged = false;
    //     }
    //     if (this.contents.length === 0) {
    //         this.isIdle = true;
    //         return;
    //     }
    //     this.ensureVisible();
    //     this.updateIndexHighlights();
    // }
		//
    // private ensureVisible(): void {
    //     let i: number = Math.max(0, Math.min(this.lastActiveIndex, this.contents.length - 1));
    //     if ((this.firstVisibleIndex <= i) && (i < (this.firstVisibleIndex + this.visibleCells.length))) {
    //         return; // index is already visible
    //     }
    //     this.firstVisibleIndex = i;
    //     this.updateContents();
    //     this.updateScrollbar();
    // }
		//
    // private updateIndexHighlights(): void {
    //     // Highlight the cell number of all recently accessed cells currently visible.
    //     let fadeoutMSecs: number = 800;
    //     this.adjustLastAccessSize();
    //     let now: number = Time.getTimer();
    //     this.isIdle = true; // try to be idle; set to false if any non-zero lastAccess value is found
    //     for (let i: number = 0; i < this.visibleCellNums.length; i++) {
    //         let lastAccessTime: number = this.lastAccess[this.firstVisibleIndex + i];
    //         if (lastAccessTime > 0) {
    //             this.isIdle = false;
    //             let msecsSinceAccess: number = now - lastAccessTime;
    //             if (msecsSinceAccess < fadeoutMSecs) {
    //                 // Animate from yellow to black over fadeoutMSecs.
    //                 let gray: number = 255 * ((fadeoutMSecs - msecsSinceAccess) / fadeoutMSecs);
    //                 this.visibleCellNums[i].textColor = (gray << 16) | (gray << 8); // red + green = yellow
    //             } else {
    //                 this.visibleCellNums[i].textColor = 0; // black
    //                 this.lastAccess[this.firstVisibleIndex + i] = 0;
    //             }
    //         }
    //     }
    // }
		//
    // private adjustLastAccessSize(): void {
    //     // Ensure that lastAccess is the same length as contents.
    //     if (this.lastAccess.length === this.contents.length) return;
    //     if (this.lastAccess.length < this.contents.length) {
    //         this.lastAccess = this.lastAccess.concat(new Array<number>(this.contents.length - this.lastAccess.length));
    //     } else if (this.lastAccess.length > this.contents.length) {
    //         this.lastAccess = this.lastAccess.slice(0, this.contents.length);
    //     }
    // }
		//
    // // -----------------------------
    // // Add Item Button Support
    // // ------------------------------
		//
    // private addItem(b: IconButton = null): void {
    //     // Called when addItemButton is clicked.
    //     if ((this.root instanceof Scratch) && !(<Scratch>this.root).editMode) return;
    //     if (this.insertionIndex < 0) this.insertionIndex = this.contents.length;
    //     this.contents.splice(this.insertionIndex, 0, "");
    //     this.updateContents();
    //     this.updateScrollbar();
    //     this.selectCell(this.insertionIndex);
    // }
		//
    // private gotFocus(e: FocusEvent): void {
    //     // When the user clicks on a cell, it gets keyboard focus.
    //     // Record that list index for possibly inserting a new cell.
    //     // Note: focus is lost when the addItem button is clicked.
    //     let newFocus: DisplayObject = e.target;
    //     if (newFocus === null) return;
    //     this.insertionIndex = -1;
    //     for (let i: number = 0; i < this.visibleCells.length; i++) {
    //         if (this.visibleCells[i] === newFocus.parent) {
    //             this.insertionIndex = this.firstVisibleIndex + i + 1;
    //             return;
    //         }
    //     }
    // }
		//
    // private lostFocus(e: FocusEvent): void {
    //     // If another object is getting focus, clear insertionIndex.
    //     if (e.relatedObject != null) this.insertionIndex = -1;
    // }
		//
    // // -----------------------------
    // // Delete Item Button Support
    // // ------------------------------
		//
    // private deleteItem(b: IconButton): void {
    //     let cell: ListCell = <ListCell>b.lastEvent.target.parent;
    //     if (cell === null) return;
    //     for (let i: number = 0; i < this.visibleCells.length; i++) {
    //         let c: ListCell = this.visibleCells[i];
    //         if (c === cell) {
    //             let j: number = this.firstVisibleIndex + i;
    //             this.contents.splice(j, 1);
    //             if (j === this.contents.length && this.visibleCells.length === 1) {
    //                 this.scrollToIndex(j - 1);
    //             } else {
    //                 this.updateContents();
    //                 this.updateScrollbar();
    //             }
    //             if (this.visibleCells.length) {
    //                 this.selectCell(Math.min(j, this.contents.length - 1));
    //             }
    //             return;
    //         }
    //     }
    // }
		//
    // // -----------------------------
    // // Layout
    // // ------------------------------
		//
    // public setWidthHeight(w: number, h: number): void {
    //     this.frame.setWidthHeight(w, h);
    //     this.fixLayout();
    // }
		//
    // public fixLayout(): void {
    //     // Called by ResizeableFrame, so must be public.
    //     this.title.x = Math.floor((this.frame.w - this.title.width) / 2);
    //     this.title.y = 2;
		//
    //     this.elementCount.x = Math.floor((this.frame.w - this.elementCount.width) / 2);
    //     this.elementCount.y = this.frame.h - this.elementCount.height + 1;
		//
    //     this.cellPane.x = 1;
    //     this.cellPane.y = 22;
		//
    //     this.addItemButton.x = 2;
    //     this.addItemButton.y = this.frame.h - this.addItemButton.height - 2;
		//
    //     let g: Graphics = (<Shape>this.cellPane.mask).graphics;
    //     g.clear();
    //     g.beginFill(0);
    //     g.drawRect(0, 0, this.frame.w - 17, this.frame.h - 42);
    //     g.endFill();
		//
    //     this.scrollbar.setWidthHeight(this.SCROLLBAR_W, this.cellPane.mask.height);
    //     this.scrollbar.x = this.frame.w - this.SCROLLBAR_W - 2;
    //     this.scrollbar.y = 20;
		//
    //     this.updateContents();
    //     this.updateScrollbar();
    // }
		//
    // // -----------------------------
    // // List contents layout and scrolling
    // // ------------------------------
		//
    // private scrollToFraction(n: number): void {
    //     let old: number = this.firstVisibleIndex;
    //     n = Math.floor(n * this.contents.length);
    //     this.firstVisibleIndex = Math.max(0, Math.min(n, this.contents.length - 1));
    //     this.lastActiveIndex = this.firstVisibleIndex;
    //     if (this.firstVisibleIndex !== old) this.updateContents();
    // }
		//
    // private scrollToIndex(i: number): void {
    //     let frac: number = i / (this.contents.length - 1);
    //     this.firstVisibleIndex = -1; // force scrollToFraction() to always update contents
    //     this.scrollToFraction(frac);
    //     this.updateScrollbar();
    // }
		//
    // private updateScrollbar(): void {
    //     let frac: number = (this.firstVisibleIndex - 1) / (this.contents.length - 1);
    //     this.scrollbar.update(frac, this.visibleCells.length / this.contents.length);
    // }
		//
    // public updateContents(): void {
    //     // let limitedCloudView:Boolean = isPersistent;
    //     // if (limitedCloudView &&
    //     //   Scratch.app.isLoggedIn() && Scratch.app.editMode &&
    //     //   (Scratch.app.projectOwner === Scratch.app.userName)) {
    //     //   limitedCloudView = false; // only project owner can view cloud list contents
    //     // }
    //     let isEditable: boolean = Scratch.app.editMode && !this.limitedView;
    //     this.updateElementCount();
    //     this.removeAllCells();
    //     this.visibleCells = [];
    //     this.visibleCellNums = [];
    //     let visibleHeight: number = this.cellPane.height;
    //     let cellNumRight: number = this.cellNumWidth() + 14;
    //     let cellX: number = cellNumRight;
    //     let cellW: number = this.cellPane.width - cellX - 1;
    //     let nextY: number = 0;
    //     for (let i: number = this.firstVisibleIndex; i < this.contents.length; i++) {
    //         let s: string = Watcher.formatValue(this.contents[i]);
    //         if (this.limitedView && (s.length > 8)) s = s.slice(0, 8) + "...";
    //         let cell: ListCell = this.allocateCell(s, cellW);
    //         cell.x = cellX;
    //         cell.y = nextY;
    //         cell.setEditable(isEditable);
    //         this.visibleCells.push(cell);
    //         this.cellPane.addChild(cell);
		//
    //         let cellNum: TextField = this.allocateCellNum(String(i + 1));
    //         cellNum.x = cellNumRight - cellNum.width - 3;
    //         cellNum.y = nextY + Math.floor((cell.height - cellNum.height) / 2);
    //         cellNum.textColor = 0;
    //         this.visibleCellNums.push(cellNum);
    //         this.cellPane.addChild(cellNum);
		//
    //         nextY += cell.height - 1;
    //         if (nextY > visibleHeight) break;
    //     }
		//
    //     if (!this.contents.length) {
    //         let tf: TextField = this.createTextField(Translator.map("(empty)"), this.cellNumFont);
    //         tf.x = (this.frame.w - this.SCROLLBAR_W - tf.textWidth) / 2;
    //         tf.y = (visibleHeight - tf.textHeight) / 2;
    //         this.cellPane.addChild(tf);
    //     }
    // }
		//
    // private cellNumWidth(): number {
    //     // Return the estimated maximum cell number width. We assume that a list
    //     // can display at most 20 elements, so we need enough width to display
    //     // firstVisibleIndex + 20. Take the log base 10 to get the number of digits
    //     // and measure the width of a textfield with that many zeros.
    //     if (this.tempCellNum === null) this.tempCellNum = this.createTextField("", this.cellNumFont);
    //     let digitCount: number = Math.log(this.firstVisibleIndex + 20) / Math.log(10);
    //     this.tempCellNum.text = "000000000000000".slice(0, digitCount);
    //     return this.tempCellNum.textWidth;
    // }
		//
    // private removeAllCells(): void {
    //     // Remove all children except the mask. Recycle ListCells and TextFields.
    //     while (this.cellPane.numChildren > 1) {
    //         let o: DisplayObject = this.cellPane.getChildAt(1);
    //         if (o instanceof ListCell) this.cellPool.push(o);
    //         if (o instanceof TextField) this.cellNumPool.push(o);
    //         this.cellPane.removeChildAt(1);
    //     }
    // }
		//
    // private allocateCell(s: string, width: number): ListCell {
    //     // Allocate a ListCell with the given contents and width.
    //     // Recycle one from the cell pool if possible.
    //     if (this.cellPool.length === 0) return new ListCell(s, width, this.textChanged, this.keyPress, this.deleteItem);
    //     let result: ListCell = this.cellPool.pop();
    //     result.setText(s, width);
    //     return result;
    // }
		//
    // private allocateCellNum(s: string): TextField {
    //     // Allocate a TextField for a cell number with the given contents.
    //     // Recycle one from the cell number pool if possible.
    //     if (this.cellNumPool.length === 0) return this.createTextField(s, this.cellNumFont);
    //     let result: TextField = this.cellNumPool.pop();
    //     result.text = s;
    //     result.width = result.textWidth + 5;
    //     return result;
    // }
		//
    // private createTextField(s: string, format: TextFormat): TextField {
    //     let tf: TextField = new TextField();
    //     tf.type = "dynamic"; // not editable
    //     tf.selectable = false;
    //     tf.defaultTextFormat = format;
    //     tf.text = s;
    //     tf.height = tf.textHeight + 5;
    //     tf.width = tf.textWidth + 5;
    //     return tf;
    // }
		//
    // public updateTitle(): void {
    //     this.title.text = ((this.target === null) || (this.target.isStage)) ? this.listName : this.target.objName + ": " + this.listName;
    //     this.title.width = this.title.textWidth + 5;
    //     this.title.x = Math.floor((this.frame.w - this.title.width) / 2);
    // }
		//
    // private updateElementCount(): void {
    //     this.elementCount.text = Translator.map("length") + ": " + this.contents.length;
    //     this.elementCount.width = this.elementCount.textWidth + 5;
    //     this.elementCount.x = Math.floor((this.frame.w - this.elementCount.width) / 2);
    // }
		//
    // // -----------------------------
    // // User Input (handle events for cell"s TextField)
    // // ------------------------------
		//
    // private textChanged(e: Event): void {
    //     // Triggered by editing the contents of a cell.
    //     // Copy the cell contents into the underlying list.
    //     let cellContents: TextField = e.target;
    //     for (let i: number = 0; i < this.visibleCells.length; i++) {
    //         let cell: ListCell = this.visibleCells[i];
    //         if (cell.tf === cellContents) {
    //             this.contents[this.firstVisibleIndex + i] = cellContents.text;
    //             return;
    //         }
    //     }
    // }
		//
    // private selectCell(i: number, scroll: boolean = true): void {
    //     let j: number = i - this.firstVisibleIndex;
    //     if (j >= 0 && j < this.visibleCells.length) {
    //         this.visibleCells[j].select();
    //         this.insertionIndex = i + 1;
    //     } else if (scroll) {
    //         this.scrollToIndex(i);
    //         this.selectCell(i, false);
    //     }
    // }
		//
    // private keyPress(e: KeyboardEvent): void {
    //     // Respond to a key press on a cell.
    //     if (e.keyCode === 13) {
    //         if (e.shiftKey) this.insertionIndex--;
    //         this.addItem();
    //         return;
    //     }
    //     if (this.contents.length < 2) return; // only one cell, and it"s already selected
    //     let direction: number =
    //         e.keyCode === 38 ? -1 :
    //             e.keyCode === 40 ? 1 :
    //                 e.keyCode === 9 ? (e.shiftKey ? -1 : 1) : 0;
    //     if (direction === 0) return;
    //     let cellContents: TextField = e.target;
    //     for (let i: number = 0; i < this.visibleCells.length; i++) {
    //         let cell: ListCell = this.visibleCells[i];
    //         if (cell.tf === cellContents) {
    //             this.selectCell((this.firstVisibleIndex + i + direction + this.contents.length) % this.contents.length);
    //             return;
    //         }
    //     }
    // }
		//
    // // -----------------------------
    // // Saving
    // // ------------------------------
		//
    // public writeJSON(json: any): void {
    //     json.writeKeyValue("listName", this.listName);
    //     json.writeKeyValue("contents", this.contents);
    //     json.writeKeyValue("isPersistent", this.isPersistent);
    //     json.writeKeyValue("x", this.x);
    //     json.writeKeyValue("y", this.y);
    //     json.writeKeyValue("width", this.width);
    //     json.writeKeyValue("height", this.height);
    //     json.writeKeyValue("visible", this.visible && (this.parent != null));
    // }
		//
    // public readJSON(obj: any): void {
    //     this.listName = obj.listName;
    //     this.contents = obj.contents;
    //     this.isPersistent = (obj.isPersistent === undefined) ? false : obj.isPersistent; // handle old projects gracefully
    //     this.x = obj.x;
    //     this.y = obj.y;
    //     this.setWidthHeight(obj.width, obj.height);
    //     this.visible = obj.visible;
    //     this.updateTitleAndContents();
    // }

}
