import {Shape} from "../shapes/shape";

export abstract class BlockBaseModel {
  shape: Shape;

  abstract drawBlock(group: Snap.Element, x: number, y: number);

}
