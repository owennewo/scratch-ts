import {ScriptModel} from '../model/script.model'
import {BlockModel} from '../model/block.model'
import {Graphics} from '../utils/graphics';
import {SpecCategoryModel} from '../model/spec.category.model';

export class ScriptUI
{
    static drawCategories()
    {
        let graphics = Graphics.builder();
        
        let index = 0;
        
        var rows = Math.ceil(SpecCategoryModel.CATEGORIES.size/2);
        
            
        
        SpecCategoryModel.CATEGORIES.forEach(category => {
            console.log(" + " + category.name);
            var row = index % rows;
            var col = Math.floor(index / rows);
            var x = 20 + col * 100;
            var y = 20 + row * 25;
            graphics.color = category.color;
            graphics.drawRect(x, y, 90, 20);
            graphics.color = "#FFF";
            graphics.drawText(x + 5, y + 15, category.name);
                
            category.specs.forEach(spec => {
                console.log("   - " + spec.opCode);
            });
            index++; 
            
            
        });
    }
    
    
	static displayScripts(scripts: ScriptModel[])
	{
        for (var script of scripts)
        {
		  console.log(" + script is at:" + script.x + ":" + script.y);
          this.displayBlock(script.firstBlock);            
        }
	}
	
	static displayBlock(block: BlockModel)
	{
		console.log("    - block" + block.op + "[" + block.args + "]");
		if (block.nextBlock)
		{
			this.displayBlock(block.nextBlock);
		}
	}
}