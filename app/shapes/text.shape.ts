import {Graphics} from "../utils/graphics";
import {BaseShape} from "./base.shape";

export class TextShape extends BaseShape {

    text: string = "unspecified";
    setText(text: string) {
      this.text = text;
    }

    draw() {
        super.draw();
        this.group.append(Graphics.ScriptPane.drawText(0, 0, this.text));
    }
}
