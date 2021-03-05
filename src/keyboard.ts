
import { runActiveBlockAndWriteToNext, runActiveNotebook } from "./notebook";

export const handleKeyPress = async (e) => {
  if (e.code === "Enter" && e.altKey === true && !e.shiftKey) {
    runActiveBlockAndWriteToNext();
  } else if (e.code === "Enter" && e.altKey === true && e.shiftKey === true) {
    runActiveNotebook();
  }
};
