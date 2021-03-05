"use strict";
exports.__esModule = true;
exports.invertTree = exports.processRawHtml = exports.getCodeBlockContent = exports.getActiveBlockUid = exports.createUid = exports.addScriptToPage = exports.addElementToPage = exports.sleep = void 0;
var sleep = function (m) {
    var t = m ? m : 10;
    return new Promise(function (r) { return setTimeout(r, t); });
};
exports.sleep = sleep;
var addElementToPage = function (element, tagId, typeT) {
    try {
        document.getElementById(tagId).remove();
    }
    catch (e) { }
    Object.assign(element, { type: typeT, async: false, tagId: tagId });
    document.getElementsByTagName("head")[0].appendChild(element);
};
exports.addElementToPage = addElementToPage;
var addScriptToPage = function (tagId, script) {
    exports.addElementToPage(Object.assign(document.createElement("script"), { src: script }), tagId, "text/javascript");
};
exports.addScriptToPage = addScriptToPage;
var createUid = function () {
    // From roam42 based on https://github.com/ai/nanoid#js version 3.1.2
    var nanoid = function (t) {
        if (t === void 0) { t = 21; }
        var e = "", r = crypto.getRandomValues(new Uint8Array(t));
        for (; t--;) {
            var n = 63 & r[t];
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
exports.createUid = createUid;
var getActiveBlockUid = function () {
    var el = document.activeElement;
    var uid = el.closest(".rm-block__input").id.slice(-9);
    return uid;
};
exports.getActiveBlockUid = getActiveBlockUid;
var getCodeBlockContent = function (el) {
    var rawHtml = el.parentElement.parentElement.querySelector(".CodeMirror-code").outerHTML;
    return exports.processRawHtml(rawHtml);
};
exports.getCodeBlockContent = getCodeBlockContent;
var processRawHtml = function (rawHtml) {
    var withNewLines = rawHtml
        .replace(/<div class="CodeMirror-linenumber.*?<\/div>/gm, "\n");
    var output = new DOMParser().parseFromString(withNewLines, "text/html").documentElement.textContent.replace(/\u200B/g, "");
    return output.slice(1);
};
exports.processRawHtml = processRawHtml;
var testTree = {
    uid: "C",
    _children: [{
            uid: "B",
            _children: [{
                    uid: "A",
                    _children: ["uglamugla"]
                }]
        }]
};
var invertTree = function (block, uid) {
    var attachParent = function (block, tree) {
        var parent = block._children[0];
        tree = {
            block: parent,
            child: tree
        };
        if (parent.uid === uid)
            return;
        return attachParent(parent, tree);
    };
    var invertedTree = attachParent(block, null);
    return invertedTree;
};
exports.invertTree = invertTree;
console.log(exports.invertTree(testTree, "A"));
