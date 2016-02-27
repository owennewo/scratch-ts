import {ScriptModel} from "../model/script.model";
import {BlockModel} from "../model/block.model";

export class BlockPlacement {
    private static INSTANCE = new BlockPlacement;

    current: BlockModel;

    static displayScript(script: ScriptModel) {
        let current = script.firstBlock;
        let previous = undefined;
        let next = undefined;
        while (current) {
            previous = current.previousBlock;
            next = current.nextBlock;
            if (!previous) {
                BlockPlacement.with(current).drawAt(script.x, script.y);
            } else {
                BlockPlacement.with(current).drawAfter(previous);
            }
            current = next;
        }
    }


    static with(block: BlockModel): BlockPlacement {
        BlockPlacement.INSTANCE.current = block;
        return BlockPlacement.INSTANCE;
    }

    drawAt(x: number, y: number) {

    }

    drawAfter(previous: BlockModel) {

    }


}
