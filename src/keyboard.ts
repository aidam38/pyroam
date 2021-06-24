import {runActiveBlockAndWriteToNext, runActiveNotebook} from "./notebook"
import {getActiveBlockUid} from "./helpers"
import {createNextPythonBlock} from "./api"

export const handleKeyPress = async (e: KeyboardEvent) => {
  if (e.code === "Enter" && e.altKey === true && !e.shiftKey) {
      await runActiveBlockAndWriteToNext()
  } else if (e.code === "Enter" && e.metaKey === true ) {
      await runActiveBlockAndWriteToNext()
      await createNextPythonBlock(getActiveBlockUid())
      e.stopPropagation()
  } else if (e.code === "Enter" && e.altKey === true && e.shiftKey === true) {
    runActiveNotebook();
  } else if (e.key === "-" && e.ctrlKey === true && e.metaKey === true)  {
    console.log("pyroam: Removing key listener")
    document.removeEventListener("keydown", handleKeyPress)
  }
};
