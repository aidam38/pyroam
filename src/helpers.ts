/* ====== BASIC ======= */

export const sleep = (m) => {
  var t = m ? m : 10;
  return new Promise((r) => setTimeout(r, t));
};

export const addElementToPage = (element, tagId, typeT) => {
  try {
    document.getElementById(tagId).remove();
  } catch (e) { }
  Object.assign(element, { type: typeT, async: false, tagId: tagId });
  document.getElementsByTagName("head")[0].appendChild(element);
};

export const addScriptToPage = (tagId, script) => {
  addElementToPage(
    Object.assign(document.createElement("script"), { src: script }),
    tagId,
    "text/javascript"
  );
};

export function getActiveRoamInputElement() {
  const el = document.activeElement
  return el.closest(".rm-block__input")
}

export const getActiveBlockUid = () => {
  const roamInput = getActiveRoamInputElement()
  return roamInput.id.slice(-9)
}

export const removeBackticks = (str: string) => {
  var ttt = "``" + "`";
  return str.replace(ttt + "python", "").replace(ttt, "");
}

/* ======== CODEBLOCK PROCESSING ======= */
export const processRawHtml = (rawHtml: string) => {
  const withNewLines = rawHtml
    .replace(/<div class="CodeMirror-linenumber.*?<\/div>/gm, "\n")

  const output = new DOMParser().parseFromString(withNewLines, "text/html").documentElement.textContent.replace(/\u200B/g, "");
  return output.slice(1);
}

export const getActiveCodeBlockContent = () => {
  const el = document.activeElement;
  const rawHtml = el.parentElement.parentElement.querySelector(".CodeMirror-code").outerHTML;
  return processRawHtml(rawHtml);
}

/* ====== TREE PARSERS ====== */
const invertTree = (block, topUid) => {
  var attachParent = (oldTopBlock) => {
    var newTopBlock = oldTopBlock._children[0];
    newTopBlock.child = oldTopBlock;
    if (newTopBlock.uid === topUid) return newTopBlock;
    return attachParent(newTopBlock)
  }
  var invertedTree = attachParent(block);

  return invertedTree;
}

const mergeTreesByUid = (topBlocks) => {
  var latchOnto = (tree, topBlock) => {
    var order = parseInt(topBlock.order) || 0;
    if (!tree[order]) {
      tree[order] = topBlock;
      if (topBlock.child) {
        tree[order].children = []
        tree[order].children[topBlock.child.order] = topBlock.child
      }
    } if (topBlock.child && topBlock.uid === tree[order].uid) {
      tree[order].children = latchOnto(tree[order].children || [], topBlock.child)
    }

    return tree;
  }

  var finalTree = [];
  topBlocks.forEach(topBlock => {
    finalTree = latchOnto(finalTree, topBlock)
  });
  return finalTree;
}

const flatten = (tree) => {
  var finalArray = []
  var stepIn = (node) => {
    finalArray.push(node)
    if (node.children && node.children.length !== 0)
      node.children.forEach(child => {
        stepIn(child);
      });
  }
  stepIn(tree);
  return finalArray;
}

export const processCodeBlocks = (codeblocks, uid) => {
  var trees = codeblocks.map(codeblock => invertTree(codeblock[0], uid));
  var tree = mergeTreesByUid(trees);
  console.log(tree)
  var cells = flatten(tree.filter(tr => tr)[0]);
  cells = cells.filter(cell => cell.string && cell.string.startsWith("```python"))
    .map(cell => {
      return {
        uid: cell.uid,
        string: removeBackticks(cell.string)
      }
    })
  return cells;
}
