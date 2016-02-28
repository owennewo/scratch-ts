import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandShape extends BaseShape {

    hasNotch: boolean = true;

    constructor(spec: SpecModel) {
        super(spec);
        this.indentTop = 3;
    }

    draw(parentGroup: Snap.Element) {
        super.draw(parentGroup);
        let text = Graphics.ScriptPane.drawText(5, 18, this.spec.description);

        this.w = text.getBBox().width + 20;

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .build();
            this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
            this.group.append(text);
    }

}
