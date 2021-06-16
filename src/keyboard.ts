
import { runActiveBlockAndWriteToNext, runActiveNotebook } from "./notebook";

export const handleKeyPress = async (e: KeyboardEvent) => {
  if (e.code === "Enter" && e.altKey === true && !e.shiftKey) {
    runActiveBlockAndWriteToNext();
  } else if (e.code === "Enter" && e.altKey === true && e.shiftKey === true) {
    runActiveNotebook();
  } else if (e.key === "-" && e.ctrlKey === true && e.metaKey === true)  {
    console.log("pyroam: Removing key listener")
    document.removeEventListener("keydown", handleKeyPress)
  }
};
