import {VisibleModel} from "./visible.model";
import {Shape} from "../shapes/shape";

export abstract class BlockBaseModel implements VisibleModel {
  shape: Shape;

  abstract drawBlock(group: Snap.Element, x: number, y: number);

}
