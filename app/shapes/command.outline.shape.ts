import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandOutlineShape extends BaseShape {
    hasNotch: boolean;
    constructor(category: SpecCategoryModel, spec: SpecModel, hasNotch: boolean, x: number, y: number) {
        super(category, spec, x, y);
        this.hasNotch = hasNotch;
        // this.base.filters = []; // no bezel
        this.indentTop = 3;
    }

    draw() {
        super.draw();

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .lineTo(0, Geometry.CornerInset)
            .build();

            this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
    }

}
