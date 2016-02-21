import {SpecModel} from './spec.model'

export class SpecCategoryModel
{
    static CATEGORIES: Map<number, SpecCategoryModel> = new Map<number, SpecCategoryModel>();
    
    //SPRITE CATEGORIES
    static UNDEFINED = new SpecCategoryModel(0,  "undefined",  "#D42828");
    static MOTION = new SpecCategoryModel(1,  "Motion",		   "#4a6cd4");
    static LOOKS = new SpecCategoryModel(2,  "Looks",		   "#8a55d7");
    static SOUND = new SpecCategoryModel(3,  "Sound",		   "#bb42c3");
    static PEN = new SpecCategoryModel(4,  "Pen",			   "#0e9a6c"); // Scratch 1.4: 0x009870
    static EVENTS = new SpecCategoryModel(5,  "Events",		   "#c88330");
    static CONTROL = new SpecCategoryModel(6,  "Control",	   "#e1a91a");
    static SENSING = new SpecCategoryModel(7,  "Sensing",	   "#2ca5e2");
    static OPERATORS = new SpecCategoryModel(8,  "Operators",  "#5cb712");
    static DATA = new SpecCategoryModel(9,  "Data",		       "#EE7D16"); // Scratch 1.4: 0xF3761D
    static MORE = new SpecCategoryModel(10, "More Blocks",	   "#632D99"); // 0x531E99;
    static PARAMETER = new SpecCategoryModel(11, "Parameter",  "#5947B1");
    static LIST = new SpecCategoryModel(12, "List",		       "#CC5B22"); // Scratch 1.4: 0xD94D11
    static EXTENSION = new SpecCategoryModel(20, "Extension",  "#4B4A60"); // 0x72228C; // 0x672D79;
    
    //STAGE CATEGORIES
    static LOOKS_STAGE = new SpecCategoryModel(102,  "Looks",		   "#8a55d7");
    static PEN_STAGE = new SpecCategoryModel(104,  "Pen",		   "#0x0e9a6c");
    static CONTROL_STAGE = new SpecCategoryModel(104,  "Control",		   "#e1a91a");
    static SENSING_STAGE = new SpecCategoryModel(7,  "Sensing",	   "#2ca5e2");
    
    static OLD = new SpecCategoryModel(98, "OLD",  "#4B4A60"); // 0x72228C; // 0x672D79;
    static BETA = new SpecCategoryModel(99, "BETA",  "#4B4A60"); // 0x72228C; // 0x672D79;
    
    id: number;
    name: string;
    color: string;
    specs: SpecModel[];
    
    constructor(id: number, name: string, color: string)
    {
        this.id = id;
        this.name = name;
        this.color = color;
        this.specs = [];
    }
    
    addSpec(spec: SpecModel)
    {
        this.specs.push(spec);
    }
    
    toString(): string
    {
        return "[SpecCategoryModel name=" + name + "]";
    }
    
    static initialize()
    {
        //SpecCategoryModel.add(SpecCategoryModel.UNDEFINED);
        SpecCategoryModel.add(SpecCategoryModel.MOTION);
        SpecCategoryModel.add(SpecCategoryModel.LOOKS);
        SpecCategoryModel.add(SpecCategoryModel.SOUND);
        SpecCategoryModel.add(SpecCategoryModel.PEN);
        SpecCategoryModel.add(SpecCategoryModel.EVENTS);
        SpecCategoryModel.add(SpecCategoryModel.CONTROL);
        SpecCategoryModel.add(SpecCategoryModel.SENSING);
        SpecCategoryModel.add(SpecCategoryModel.OPERATORS);
        SpecCategoryModel.add(SpecCategoryModel.DATA);
        SpecCategoryModel.add(SpecCategoryModel.MORE);
        SpecCategoryModel.add(SpecCategoryModel.LIST);
        SpecCategoryModel.add(SpecCategoryModel.EXTENSION);
    }
    
    private static add(category: SpecCategoryModel)
    {
        SpecCategoryModel.CATEGORIES.set(category.id, category);
    }
}


