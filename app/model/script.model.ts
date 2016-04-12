import {VisibleModel} from "./visible.model";
import {Shape} from "../shapes/shape";
import {BlockModel} from "./block.model";

export class ScriptModel extends VisibleModel {
    index: number;
    x: number;
    y: number;
    firstBlock: BlockModel;
}
