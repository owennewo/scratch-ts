import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandOutlineShape extends BaseShape {
    hasNotch: boolean;
    constructor(spec: SpecModel, hasNotch: boolean) {
        super(spec);
        this.hasNotch = hasNotch;
        // this.base.filters = []; // no bezel
        this.indentTop = 3;
    }

    draw(parentGroup: Snap.Element) {
        super.draw(parentGroup);

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .lineTo(0, Geometry.CornerInset)
            .build();

            this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
    }

}
