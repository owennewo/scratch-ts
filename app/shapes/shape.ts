import {BlockModel} from "../model/block.model";
export interface Shape {
    h: number;
    y: number;
    getGroup(): any;
    draw(parentGroup: Snap.Element, prepend?: boolean);
    drawHeader(b: BlockModel);
    move(x: number, y: number);
    setWidthAndTopHeight(w: number, h: number);
    setColor(color: any);
    setDraggable(draggable: boolean);
    getBBox(): Snap.BBox;
}
