/// <reference path="../definitelytyped/snapsvg.d.ts" />
import {ScriptModel} from "../model/script.model";
import {BlockModel} from "../model/block.model";
import {Graphics} from "../utils/graphics";
import {SpecCategoryModel} from "../model/spec.category.model";
import {ShapeFactory} from "../shapes/shape.factory";
import {SpecSpacerModel} from "../model/spec.model";
import {SpecOperation} from "../model/spec.model";

export class SpecPlacement {
    static drawCategories() {

      let op2: SpecOperation = SpecOperation.ProcedureDeclaration;// = "grr";
      let op3: SpecOperation = SpecOperation["ProcedureDeclaration"];
      let op4: SpecOperation = SpecOperation["procedure_declaration"];
      let op5: SpecOperation = SpecOperation.ProcedureDeclaration;
      let op6: SpecOperation = SpecOperation.GetVar;

      console.log (op2 === op3);
      console.log (op2 === op4);
      console.log (op2 === op5);
      console.log (op3 === op4);
      console.log (op3 === op4);
      console.log (op4 === op5);
      console.log (op2 === op6);
console.log (op3 === op6);
console.log (op4 === op6);
console.log (op5 === op6);


        let groupCategories = Graphics.ScriptPane.group("script-pane-categories", 10, 10);

        let index = 0;

        let rows = Math.ceil(SpecCategoryModel.CATEGORIES.size / 2);

        SpecCategoryModel.CATEGORIES.forEach(category => {

            console.log(" + " + category.name);
            let row = index % rows;
            let col = Math.floor(index / rows);
            let x = 20 + col * 110;
            let y = 20 + row * 25;

            let groupCategory = Graphics.ScriptPane.group(category.name + "-categories", x, y, false, category.name.toLowerCase());

            let rectStub = Graphics.ScriptPane.drawRect(0, 0, 10, 20, "stub");
            let rectMain = Graphics.ScriptPane.drawRect(10, 0, 90, 20, "main");

            groupCategory.click((event: MouseEvent) => {
              let categorySvgs: Snap.Element[] = Snap.selectAll("#script-pane-categories g");
              categorySvgs.forEach (categorySvg => { categorySvg.removeClass("active"); });
              this.drawCategory(category);
            });

            groupCategory.append(rectStub);
            groupCategory.append(rectMain);
            groupCategory.append(Graphics.ScriptPane.drawText(15, 15, category.name, "#FFF"));
            category.svg = groupCategory;
            groupCategories.append(groupCategory);

            index++;

        });


        this.drawCategory(SpecCategoryModel.CATEGORIES.get(1));
    }

    static drawCategory(category: SpecCategoryModel) {
        category.svg.addClass("active");
        console.log("drawing " + category.name);

        let oldCategoryBlocks = Graphics.ScriptPane.paper.select("#script-pane-categories-blocks");
        if (oldCategoryBlocks) {
          oldCategoryBlocks.remove();
        }

        let newCcategoryBlocks = Graphics.ScriptPane.group("script-pane-categories-blocks", 10, 200);

        let yPos = 0;
        category.specs.forEach(spec => {
          if (spec instanceof SpecSpacerModel) {
            yPos += 10;
            return;
          }
            let shape = ShapeFactory.createShape(category, spec, 20, yPos);
            shape.draw();
            let shapeHeight = shape.getGroup().getBBox().h;
            newCcategoryBlocks.append(shape.getGroup());
            yPos += shapeHeight + 5;
        });
    }


    static displayScripts(scripts: ScriptModel[]) {
        for (let script of scripts) {
            console.log(" + script is at:" + script.x + ":" + script.y);
            this.displayBlock(script.firstBlock);
        }
    }

    static displayBlock(block: BlockModel) {
        console.log("    - block" + block.op + "[" + block.args + "]");
        if (block.nextBlock) {
            this.displayBlock(block.nextBlock);
        }
    }
}
