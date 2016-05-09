import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/block.arg.model";
import {Graphics} from "../utils/graphics";
import {SpecModel} from "../model/spec.model";
import {BaseShape} from "./base.shape";

export class IconShape extends BaseShape {
    iconName: string;

    constructor(spec: SpecModel, arg: BlockBaseModel, iconName: string, group?: Snap.Element) {
        super(spec, arg, group);
        this.iconName = iconName;
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw(x: number, y: number) {
      super.draw(x, y);
        // this.group = parentGroup;
        // this.centerY = this.topH / 2;

        let text = Graphics.ScriptPane.drawText(this.x, this.y, "[" + this.iconName + "]");
        text.attr( {
          y: text.getBBox().h + this.y
        });
        this.group.append(text);

    }

}
