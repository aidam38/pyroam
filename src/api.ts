import { createUid } from "./helpers";

/* === WRAPPERS === */
export const q = async (query) => {
  //@ts-ignore
  const result = await window.roamAlphaAPI.q(query);
  if (!result || result.length === 0) {
    return null;
  } else return result;
};

export const updateBlock = async (uid, string) => {
  //@ts-ignore
  await window.roamAlphaAPI.updateBlock({
    block: {
      uid: uid,
      string: string,
    },
  });
};

export const createBlock = async (parentUid, order, uid, string) => {
  //@ts-ignore
  await window.roamAlphaAPI.createBlock({
    location: {
      "parent-uid": parentUid,
      order: order,
    },
    block: {
      uid: uid,
      string: string,
    },
  });
};

/* === COMPOSITE FUNCTIONS === */
export const writeToNextBlock = async (uid, string) => {
  const query = `
  [:find 
    (pull ?block 
        [:block/order 
        {:block/_children 
            [:block/uid 
            {:block/children [:block/uid :block/order]}]}])
   :where
    [?block :block/uid "${uid}"]]`;

  const result = await q(query);
  if (!result) console.log("Couldn't find the block.");

  var block = result[0][0];
  var parent = block._children[0];
  var siblings = parent.children;

  if (!siblings.some((sibling) => sibling.order > block.order)) {
    const newUid = createUid();
    createBlock(parent.uid, block.order + 1, newUid, string);
  } else {
    const nextSibling = siblings.filter(
      (sibling) => sibling.order === block.order + 1
    )[0];
    updateBlock(nextSibling.uid, string);
  }
};
