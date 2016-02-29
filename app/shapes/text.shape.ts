import {SpecModel} from "../model/spec.model";
import {Graphics} from "../utils/graphics";
import {BaseShape} from "./base.shape";

export class TextShape extends BaseShape {

  text: string = "unspecified";

  constructor(spec: SpecModel, args: any[], text: string) {
      super(spec, args);
      this.text = text;
    }


    setText(text: string) {
      this.text = text;
    }

    draw(parentGroup: Snap.Element) {
        super.draw(parentGroup);
        this.group.append(Graphics.ScriptPane.drawText(0, 0, this.text, this.args));
    }
}
