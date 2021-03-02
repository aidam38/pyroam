import { getActiveBlockUid } from "./helpers";
import { q, writeToNextBlock } from "./api";
import { runPython } from "./pyodide";

var runActiveBlockAndWriteToNext = async () => {
  const uid = getActiveBlockUid();

  const query = `[:find (pull ?block [:block/string])
         :where [?block :block/uid "${uid}"]]`;
  const result = await q(query);

  var content = result[0][0].string;

  var ttt = "``" + "`";
  var code = content.replace(ttt + "python", "").replace(ttt, "");
  var out = await runPython(code);

  await writeToNextBlock(uid, out || "");
};

export const handleKeyPress = async (e) => {
  if (e.code == "Enter" && e.altKey == true) {
    runActiveBlockAndWriteToNext();
  }
};
