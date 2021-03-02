export const sleep = (m) => {
  var t = m ? m : 10;
  return new Promise((r) => setTimeout(r, t));
};

export const addElementToPage = (element, tagId, typeT) => {
  try {
    document.getElementById(tagId).remove();
  } catch (e) {}
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

export const createUid = () => {
  // From roam42 based on https://github.com/ai/nanoid#js version 3.1.2
  let nanoid = (t = 21) => {
    let e = "",
      r = crypto.getRandomValues(new Uint8Array(t));
    for (; t--; ) {
      let n = 63 & r[t];
      e +=
        n < 36
          ? n.toString(36)
          : n < 62
          ? (n - 26).toString(36).toUpperCase()
          : n < 63
          ? "_"
          : "-";
    }
    return e;
  };
  return nanoid(9);
};

export const getActiveBlockUid = () => {
  const el = document.activeElement;
  const uid = el.closest(".rm-block__input").id.slice(-9);
  return uid;
};
