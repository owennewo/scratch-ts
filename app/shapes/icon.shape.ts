import {PathBuilder} from "../utils/path.builder";
import {Graphics} from "../utils/graphics";
import {SpecModel} from "../model/spec.model";
import {BaseShape} from "./base.shape";

export class IconShape extends BaseShape {
    iconName: string;

    constructor(spec: SpecModel, iconName: string) {
        super(spec);
        this.iconName = iconName;
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw() {
        super.draw();
        this.centerY = this.topH / 2;

        let text = Graphics.ScriptPane.drawText(10, 18, this.iconName);
        this.w = text.getBBox().width + 20;


        this.group.append(text);

    }

}