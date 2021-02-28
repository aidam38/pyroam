/* pyroam
   Author: Adam Krivka
 */
var pyroam = {};

/* ======= HELPER FUNCTIONS ======= */
pyroam.sleep = m => {
  var t = m ? m : 10;
  return new Promise(r => setTimeout(r, t))
};

/* ====== LOADING PYODIDE ====== */
pyroam.loader = {};

pyroam.loader.addElementToPage = (element, tagId, typeT) => {
  try { document.getElementById(tagId).remove() } catch (e) { };
  Object.assign(element, { type: typeT, async: false, tagId: tagId });
  document.getElementsByTagName('head')[0].appendChild(element);
}

pyroam.loader.addScriptToPage = (tagId, script) => {
  pyroam.loader.addElementToPage(Object.assign(document.createElement('script'), { src: script }), tagId, 'text/javascript');
}

pyroam.loadPyodide = async () => {
  pyroam.loader.addScriptToPage("pyodide", "https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js");
  await pyroam.sleep(2000);
  await languagePluginLoader;
  console.log("pyodide successfully loaded.");
  console.log(pyodide.runPython(`import sys\nsys.version`));

  await pyodide.loadPackage(["numpy", "matplotlib", "scipy"]);
  console.log("Loaded packages: ");
  console.log(pyodide.loadedPackages());
}

pyroam.writeToNextBlock = async (uid, string) => {
  var query = await window.roamAlphaAPI.q(`
    [:find (pull ?siblings [:block/uid :block/order])
     :where [?parent :block/refs ?siblings]
            [?parent :block/refs ?block]
            [?block :block/uid "${uid}"]]`);
  console.log(query);
  const sibling = query[0][0];
  // TODO: need to check syntax
  window.roamAlphaAPI.updateBlock({ uid: sibling.uid, string });
}

pyroam.handleKeyPress = async (e) => {
  if (e.code == "Enter" && e.altKey == true) {
    console.log(document.activeElement, e.target);
    var el = document.activeElement;
    const uid = el.closest('.rm-block__input').id.slice(-9);
    //Array(5).fill().forEach(() => {el = el.parentElement});
    //var uid = el.id.substring(el.id.length - 9)
    console.log(uid);
    var query = await window.roamAlphaAPI.q(`
        [:find (pull ?block [:block/string])
         :where [?block :block/uid "${uid}"]]`);
    var content = query[0][0].string;
    console.log(typeof content);
    var ttt = "``" + "`"
    var code = content.replace(ttt + "python", "").replace(ttt, "");
    const out = pyodide.runPython(code);
    //console.log(pyodide.runPython(code));
    await pyroam.writeToNextBlock(uid, out);
  }
}

document.addEventListener("keydown", pyroam.handleKeyPress);
pyroam.loadPyodide();