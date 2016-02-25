import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {Geometry} from "./geometry";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class HatShape extends BaseShape {

    constructor(category: SpecCategoryModel, spec: SpecModel, x: number, y: number) {
        super(category, spec, x, y);
        // this.isHat = true;
        this.indentTop = 12;
    }

    draw() {
        super.draw();
        let text = Graphics.ScriptPane.drawText(5, 25, this.spec.description);

        this.w = text.getBBox().width + 20;
        this.topH = 35;
// .curve(40, 0, 80, 10, 0.12)
//             .curve(10, 12, 40, 0, 0.15)
        let path = PathBuilder.create()
            .moveTo(0, 12)
            .curveBezier(0, 12, 27.5, 0, 52.5, 0, 80, 10)
            .lineTo(this.w - Geometry.CornerInset, 10)
            .lineTo(this.w, 10 + Geometry.CornerInset)
            .drawRightAndBottom(this.topH, this.w, true)
            .build();
        this.group.append(Graphics.ScriptPane.drawPath(path, this.category.name.toLowerCase()));
        this.group.append(text);


    }

}
