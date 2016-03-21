import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandShape extends BaseShape {

    hasNotch: boolean = true;

    constructor(spec: SpecModel, args: any[]) {
        super(spec, args);
        this.indentTop = 3;
    }

    draw(parentGroup: Snap.Element, prepend?: boolean) {
        super.draw(parentGroup);

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .build();

            if (prepend) {
                this.group.prepend(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
            } else {
                this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
            }



    }

}
