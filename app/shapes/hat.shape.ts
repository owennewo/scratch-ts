import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class HatShape extends BaseShape {

    constructor(spec: SpecModel, args: any[]) {
        super(spec, args);
        this.indentTop = 12;
    }

    draw(parentGroup: Snap.Element, prepend: boolean = false) {
        super.draw(parentGroup);

        this.topH = 35;
        let path = PathBuilder.create()
            .moveTo(0, 12)
            .curveBezier(0, 12, 27.5, 0, 52.5, 0, 80, 10)
            .lineTo(this.w - Geometry.CornerInset, 10)
            .lineTo(this.w, 10 + Geometry.CornerInset)
            .drawRightAndBottom(this.topH, this.w, true)
            .lineTo(0, 12)
            .build();
        if (prepend){
            this.group.prepend(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
        } else {
          this.group.append(Graphics.ScriptPane.drawPath(path, this.spec.category.name.toLowerCase()));
        }

    }

}
