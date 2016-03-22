import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {Graphics} from "../utils/graphics";
import {SpecModel} from "../model/spec.model";
import {BaseShape} from "./base.shape";

export class IconShape extends BaseShape {
    iconName: string;

    constructor(spec: SpecModel, args: any[], iconName: string) {
        super(spec, args);
        this.iconName = iconName;
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw(parentGroup: Snap.Element) {
        this.group = parentGroup;
        // this.centerY = this.topH / 2;

        let text = Graphics.ScriptPane.drawText(this.x, this.y, this.iconName);

        this.group.append(text);

    }

}
