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


        let argValue = 0;
        let textBox = undefined;
        let cssClass;
        if (this.arg) {
          argValue = (<BlockArgModel> this.arg).argValue.toString();
          let text = Graphics.ScriptPane.drawText(this.x, this.y, argValue.toString(), "blockarg");
          cssClass = "blockarg";
          textBox = text.getBBox();
          text.attr({y: textBox.h});
          this.group.append(text);
        } else {
          textBox = this.group.getBBox();
          cssClass = this.spec.category.name.toLowerCase();
        }

        let top = textBox.y;
        this.w = textBox.width + 10;
        this.topH = textBox.h + 10;
        this.centerY = this.topH / 2;
        this.y = y - 2;
        this.x = textBox.x - 4;
        let rect = Graphics.ScriptPane.drawRect(this.x, this.y , this.w, this.topH, this.centerY, this.centerY, cssClass);

        this.group.prepend(rect);

    }

}
