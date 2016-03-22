import {BlockArgModel} from "../model/blockarg.model";
import {Shape} from "./shape";
import {SpecModel} from "../model/spec.model";
import {Graphics} from "../utils/graphics";
import {BaseShape} from "./base.shape";

export class TextShape extends BaseShape {

  text: string = "unspecified";
//  group: Snap.Element;

  constructor(spec: SpecModel, args: any[], text: string) {
      super(spec, args);
      this.text = text;
    }


    setText(text: string) {
      this.text = text;
    }

    draw(parentGroup: Snap.Element) {
        // super.draw(parentGroup);
        this.group = parentGroup;
        let text = Graphics.ScriptPane.drawText(this.x, this.y, this.text);
        parentGroup.append(text);
    }


}
