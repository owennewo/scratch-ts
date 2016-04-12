import {VisibleModel} from "./visible.model";
import {Shape} from "../shapes/shape";

export abstract class BlockBaseModel extends VisibleModel {
  shape: Shape;

  abstract drawBlock(group: Snap.Element, x: number, y: number);

}
