import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class CommandShape extends BaseShape {

    hasNotch: boolean = true;

    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, group);
        this.indentTop = 3;
    }

    draw(x: number, y: number) {
        super.draw(x, y);

        let path = PathBuilder.create()
            .drawTop(this.w)
            .drawRightAndBottom(this.topH, this.w, this.hasNotch)
            .build();

        this.group.prepend(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));

    }

}
