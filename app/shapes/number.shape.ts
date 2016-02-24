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
        let centerY: number = this.topH / 2;

        let path = PathBuilder.create()
            .moveTo(centerY, this.topH)
            .curve(centerY, this.topH, 0, centerY)
            .curve(0, centerY, centerY, 0)
            .lineTo(this.w - centerY, 0)
            .curve(this.w - centerY, 0, this.w, centerY)
            .curve(this.w, centerY, this.w - centerY, this.topH)
            .build();
            this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
    }

}
