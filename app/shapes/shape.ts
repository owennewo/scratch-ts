import {VisibleModel} from "../model/visible.model";
import {BlockModel} from "../model/block.model";
import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";

export interface Shape {
    h: number;
    y: number;
    id: string;
    getGroup(): any;
    setGroup(group: Snap.Element);
    newGroup(parentGoup: Snap.Element, x: number, y: number, vis: VisibleModel);
    draw(x: number, y: number, prepend?: boolean);
    drawHeader(args: BlockBaseModel[]);
    move(x: number, y: number);
    setWidthAndTopHeight(w: number, h: number);
    setColor(color: any);
    setDraggable(draggable: boolean);
    getBBox(): Snap.BBox;
}
