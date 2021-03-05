import { createUid, processCodeBlocks } from "./helpers";

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
export const getBlockStringByUid = async (uid) => {
  const query = `[:find (pull ?block [:block/string])
         :where [?block :block/uid "${uid}"]]`;
  const result = await q(query);

  return result[0][0].string;
}
export const writeToNestedBlock = async (parentUid, string) => {
  if (!string) return;

  const query = `
  [:find 
    (pull ?nestedBlock 
        [:block/uid])
   :where
    [?parentBlock :block/uid "${parentUid}"]
    [?parentBlock :block/children ?nestedBlock]]`;

  const result = await q(query);
  if (!result) {
    const nestedUid = createUid();
    createBlock(parentUid, 0, nestedUid, string);
  } else {
    const nestedUid = result[0][0].uid;
    updateBlock(nestedUid, string);
  }
};

export const getUidOfClosestBlockReferencing = async (uid: string, page: string) => {
  //@ts-ignore
  const results = await window.roamAlphaAPI.q(`[:find 
  (pull ?notebookBlock [:block/uid]) 
  :where  [?notebookBlock :block/refs ?pyroamNotebook]
          [?pyroamNotebook :node/title "${page}"]
          [?activeBlock :block/parents ?notebookBlock]
          [?activeBlock :block/uid "${uid}"]]`);
  //@ts-ignore
  return results[0][0].uid;
};

export const getAllCodeBlocksNestedUnder = async (topUid) => {
  //@ts-ignore
  var results = await window.roamAlphaAPI.q('[:find\
    (pull ?cell [:block/string :block/order :block/uid {:block/_children ...}])\
    :where  [?notebookBlock :block/uid "' + topUid + '"]\
            [?cell :block/parents ?notebookBlock]\
            [?cell :block/string ?string]\
            [(clojure.string/starts-with? ?string "```python")]]');
  const cells = processCodeBlocks(results, topUid);
  return cells;
};