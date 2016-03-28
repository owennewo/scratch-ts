import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {Shape} from "./shape";
import {SpecModel} from "../model/spec.model";
import {Graphics} from "../utils/graphics";
import {BaseShape} from "./base.shape";

export class TextShape extends BaseShape {

  text: string = "unspecified";

  static LineHeight: number = 18;
//  group: Snap.Element;

  constructor(spec: SpecModel, arg: BlockBaseModel, text: string, group?: Snap.Element) {
      super(spec, arg, group);
      this.text = text;
    }


    setText(text: string) {
      this.text = text;
    }

    draw(x: number, y: number) {
        super.draw(x, y);
        // super.draw(parentGroup);
        // this.group = parentGroup;
        let text = Graphics.ScriptPane.drawText(this.x, this.y + TextShape.LineHeight, this.text);

        text.attr( {
          y: text.getBBox().h
        });
        this.group.append(text);
    }


}
