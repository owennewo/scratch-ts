import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class BooleanShape extends BaseShape {
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
        // this.isReporter = true;
        // this.indentLeft = 9;
        // this.indentRight = 7;
    }

    draw() {
        super.draw();
        this.centerY = this.topH / 2;

        let text = Graphics.ScriptPane.drawText(10, 18, this.spec.description);
        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .moveTo(0, this.centerY)
            .lineTo(this.centerY, 0)
            .lineTo(this.w - this.centerY, 0)
            .lineTo(this.w , this.centerY)
            .lineTo(this.w - this.centerY, this.topH)
            .lineTo(this.centerY, this.topH)
            .lineTo(0, this.centerY)
            .build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
        this.group.append(text);

    }


}