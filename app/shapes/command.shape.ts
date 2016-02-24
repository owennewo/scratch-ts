import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandShape extends BaseShape {
    w: number;
    hasNotch: boolean = true;

    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
        this.indentTop = 3;
    }

    draw() {
        super.draw();
        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.description);

        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .build();
            this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
            this.group.append(text);
    }

}
