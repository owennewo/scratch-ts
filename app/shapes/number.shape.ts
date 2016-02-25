import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class NumberShape extends BaseShape {
    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
        this.indentTop = 2;
        // this.indentBottom = 2;
        // this.indentLeft = 6;
        // this.indentRight = 4;


        // this.type = 'r';

        // this.isReporter = true;
        // this.isRequester = ((type == 'R') || (type == 'rR'));
        // this.forcedRequester = (type == 'rR');

    }

    draw() {
        super.draw();
        this.centerY = this.topH / 2;

        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.description);

        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .moveTo(this.centerY, this.topH)
            .curve(this.centerY, this.topH, 0, this.centerY)
            .curve(0, this.centerY, this.centerY, 0)
            .lineTo(this.w - this.centerY, 0)
            .curve(this.w - this.centerY, 0, this.w, this.centerY)
            .curve(this.w, this.centerY, this.w - this.centerY, this.topH)
            .build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
        this.group.append(text);
    }

}
