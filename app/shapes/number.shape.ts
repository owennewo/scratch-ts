import {BlockBaseModel} from "../model/block.base.model";
import {BlockArgModel} from "../model/blockarg.model";
import {PathBuilder} from "../utils/path.builder";
import {BaseShape} from "./base.shape";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {SpecModel} from "../model/spec.model";


export class NumberShape extends BaseShape {
    constructor(spec: SpecModel, arg: BlockBaseModel, group?: Snap.Element) {
        super(spec, arg, group);

        this.indentTop = 2;
        // this.indentBottom = 2;
        // this.indentLeft = 6;
        // this.indentRight = 4;


        // this.type = 'r';

        // this.isReporter = true;
        // this.isRequester = ((type == 'R') || (type == 'rR'));
        // this.forcedRequester = (type == 'rR');

    }

    draw(x: number, y: number) {
      super.draw (x, y);
        // this.group = parentGroup;
        // super.draw(parentGroup);
        this.centerY = this.topH / 2;

        let argValue = 0;
        if (this.arg) {
          argValue = (<BlockArgModel> this.arg).argValue.toString();
        }

        let text = Graphics.ScriptPane.drawText(this.x, this.y, argValue.toString(), "blockarg");

        let textBox = text.getBBox();
        let top = textBox.y;

        text.attr({y: textBox.h});

        this.w = text.getBBox().width + 10;

        let rect = Graphics.ScriptPane.drawRect(textBox.x - 4, this.y - 2 , textBox.w + 8, textBox.h + 4, this.centerY, this.centerY, "blockarg");

        // let path = PathBuilder.create()
        //     .moveTo(this.x + this.centerY, this.topH - 2)
        //     .curve(this.x + this.centerY, this.topH - 2, this.x + 0, this.centerY)
        //     .curve(this.x + 0, this.centerY, this.x + this.centerY, 2)
        //     .lineTo(this.x + this.w - this.centerY, 2)
        //     .curve(this.x + this.w - this.centerY, 2, this.x + this.w, this.centerY)
        //     .curve(this.x + this.w, this.centerY, this.x + this.w - this.centerY, this.topH - 2)
        //     .build();
        this.group.append(rect);
        this.group.append(text);
    }

}
