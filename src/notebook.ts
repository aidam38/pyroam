import {getActiveBlockUid, getActiveCodeBlockContent as getActiveCodeBlockContent} from "./helpers"
import {getAllCodeBlocksNestedUnder, getUidOfClosestBlockReferencing, writeToNestedBlock} from "./api"
import {runPython} from "./pyodide"
import {CellRunner} from "./observable"


const runAllBlocksBelowUidAndWrite = async (notebookUid) => {
    const cells = await getAllCodeBlocksNestedUnder(notebookUid)
    const activeUid = getActiveBlockUid()

    for (const cell of cells) {
        if (cell.uid === activeUid) cell.string = getActiveCodeBlockContent()

        const out = await runPython(cell.string)
        await writeToNestedBlock(cell.uid, out)
    }
}

const cellRunner = new CellRunner()
/**
 * Runs only the active cell
 */
export const runActiveBlockAndWriteToNext = async () => {
    const activeUid = getActiveBlockUid()
    const code = getActiveCodeBlockContent()
    const out = await cellRunner.run(code, activeUid, (out: string) => {
        console.log("trying to write a child of ", activeUid, out)
        return writeToNestedBlock(activeUid, out)
    })
    // await writeToNestedBlock(activeUid, out)
}

/**
 * Runs the whole notebook
 */
export const runActiveNotebook = async () => {
    const uid = getActiveBlockUid()
    const notebookUid = await getUidOfClosestBlockReferencing(uid, "pyroam/notebook")
    console.log("Notebook Block uid:" + notebookUid)
    runAllBlocksBelowUidAndWrite(notebookUid)
}
