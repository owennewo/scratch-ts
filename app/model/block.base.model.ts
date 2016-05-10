import {BaseShape} from "../shapes/base.shape";
import {VisibleModel} from "./visible.model";

export abstract class BlockBaseModel extends VisibleModel {
  shape: BaseShape;

  abstract drawBlock(group: Snap.Element, x: number, y: number);

}
