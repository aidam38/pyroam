import { getActiveBlockUid, getActiveCodeBlockContent as getActiveCodeBlockContent, removeBackticks } from "./helpers";
import { q, writeToNestedBlock, getUidOfClosestBlockReferencing, getAllCodeBlocksNestedUnder, getBlockStringByUid } from "./api";
import { runPython } from "./pyodide";


const runAllBlocksBelowUidAndWrite = async (notebookUid) => {
    const cells = await getAllCodeBlocksNestedUnder(notebookUid);
    const activeUid = getActiveBlockUid();

    for (const cell of cells) {
        if (cell.uid === activeUid) cell.string = getActiveCodeBlockContent()

        const out = await runPython(cell.string);
        await writeToNestedBlock(cell.uid, out)
    }
}

/**
 * Runs only the active cell
 */
export const runActiveBlockAndWriteToNext = async () => {
    const activeUid = getActiveBlockUid();
    const code = getActiveCodeBlockContent()
    const out = await runPython(code)
    await writeToNestedBlock(activeUid, out)
};

/**
 * Runs the whole notebook
 */
export const runActiveNotebook = async () => {
    const uid = getActiveBlockUid();
    const notebookUid = await getUidOfClosestBlockReferencing(uid, "pyroam/notebook");
    console.log("Notebook Block uid:" + notebookUid)
    runAllBlocksBelowUidAndWrite(notebookUid);
}