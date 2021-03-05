// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"helpers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processCodeBlocks = exports.getActiveCodeBlockContent = exports.processRawHtml = exports.removeBackticks = exports.getActiveBlockUid = exports.createUid = exports.addScriptToPage = exports.addElementToPage = exports.sleep = void 0;
/* ====== BASIC ======= */

var sleep = function sleep(m) {
  var t = m ? m : 10;
  return new Promise(function (r) {
    return setTimeout(r, t);
  });
};

exports.sleep = sleep;

var addElementToPage = function addElementToPage(element, tagId, typeT) {
  try {
    document.getElementById(tagId).remove();
  } catch (e) {}

  Object.assign(element, {
    type: typeT,
    async: false,
    tagId: tagId
  });
  document.getElementsByTagName("head")[0].appendChild(element);
};

exports.addElementToPage = addElementToPage;

var addScriptToPage = function addScriptToPage(tagId, script) {
  exports.addElementToPage(Object.assign(document.createElement("script"), {
    src: script
  }), tagId, "text/javascript");
};

exports.addScriptToPage = addScriptToPage;

var createUid = function createUid() {
  // From roam42 based on https://github.com/ai/nanoid#js version 3.1.2
  var nanoid = function nanoid(t) {
    if (t === void 0) {
      t = 21;
    }

    var e = "",
        r = crypto.getRandomValues(new Uint8Array(t));

    for (; t--;) {
      var n = 63 & r[t];
      e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-";
    }

    return e;
  };

  return nanoid(9);
};

exports.createUid = createUid;

var getActiveBlockUid = function getActiveBlockUid() {
  var el = document.activeElement;
  var uid = el.closest(".rm-block__input").id.slice(-9);
  return uid;
};

exports.getActiveBlockUid = getActiveBlockUid;

var removeBackticks = function removeBackticks(str) {
  var ttt = "``" + "`";
  return str.replace(ttt + "python", "").replace(ttt, "");
};

exports.removeBackticks = removeBackticks;
/* ======== CODEBLOCK PROCESSING ======= */

var processRawHtml = function processRawHtml(rawHtml) {
  var withNewLines = rawHtml.replace(/<div class="CodeMirror-linenumber.*?<\/div>/gm, "\n");
  var output = new DOMParser().parseFromString(withNewLines, "text/html").documentElement.textContent.replace(/\u200B/g, "");
  return output.slice(1);
};

exports.processRawHtml = processRawHtml;

var getActiveCodeBlockContent = function getActiveCodeBlockContent() {
  var el = document.activeElement;
  var rawHtml = el.parentElement.parentElement.querySelector(".CodeMirror-code").outerHTML;
  return exports.processRawHtml(rawHtml);
};

exports.getActiveCodeBlockContent = getActiveCodeBlockContent;
/* ====== TREE PARSERS ====== */

var invertTree = function invertTree(block, topUid) {
  var attachParent = function attachParent(oldTopBlock) {
    var newTopBlock = oldTopBlock._children[0];
    newTopBlock.child = oldTopBlock;
    if (newTopBlock.uid === topUid) return newTopBlock;
    return attachParent(newTopBlock);
  };

  var invertedTree = attachParent(block);
  return invertedTree;
};

var mergeTreesByUid = function mergeTreesByUid(topBlocks) {
  var latchOnto = function latchOnto(tree, topBlock) {
    var order = parseInt(topBlock.order) || 0;

    if (!tree[order]) {
      tree[order] = topBlock;

      if (topBlock.child) {
        tree[order].children = [];
        tree[order].children[topBlock.child.order] = topBlock.child;
      }
    }

    if (topBlock.child && topBlock.uid === tree[order].uid) {
      tree[order].children = latchOnto(tree[order].children || [], topBlock.child);
    }

    return tree;
  };

  var finalTree = [];
  topBlocks.forEach(function (topBlock) {
    finalTree = latchOnto(finalTree, topBlock);
  });
  return finalTree;
};

var flatten = function flatten(tree) {
  var finalArray = [];

  var stepIn = function stepIn(node) {
    finalArray.push(node);
    if (node.children && node.children.length !== 0) node.children.forEach(function (child) {
      stepIn(child);
    });
  };

  stepIn(tree);
  return finalArray;
};

var processCodeBlocks = function processCodeBlocks(codeblocks, uid) {
  var trees = codeblocks.map(function (codeblock) {
    return invertTree(codeblock[0], uid);
  });
  var tree = mergeTreesByUid(trees);
  console.log(tree);
  var cells = flatten(tree.filter(function (tr) {
    return tr;
  })[0]);
  cells = cells.filter(function (cell) {
    return cell.string && cell.string.startsWith("```python");
  }).map(function (cell) {
    return {
      uid: cell.uid,
      string: exports.removeBackticks(cell.string)
    };
  });
  return cells;
};

exports.processCodeBlocks = processCodeBlocks;
},{}],"pyodide.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runPython = exports.loadPyodide = void 0; //@ts-nocheck

var helpers_1 = require("./helpers");

var loadPyodide = function loadPyodide() {
  return __awaiter(void 0, void 0, void 0, function () {
    var setup_code;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          helpers_1.addScriptToPage("pyodide", "https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js");
          return [4
          /*yield*/
          , helpers_1.sleep(2000)];

        case 1:
          _a.sent();

          return [4
          /*yield*/
          , languagePluginLoader];

        case 2:
          _a.sent();

          console.log("pyodide successfully loaded.");
          setup_code = "\nimport sys, io, traceback\nnamespace = {}  # use separate namespace to hide run_code, modules, etc.\ndef run_code(code):\n  \"\"\"run specified code and return stdout and stderr\"\"\"\n  out = io.StringIO()\n  oldout = sys.stdout\n  olderr = sys.stderr\n  sys.stdout = sys.stderr = out\n  try:\n      # change next line to exec(code, {}) if you want to clear vars each time\n      exec(code, namespace)\n  except:\n      traceback.print_exc()\n\n  sys.stdout = oldout\n  sys.stderr = olderr\n  return out.getvalue()\n";
          pyodide.runPython(setup_code);
          return [4
          /*yield*/
          , pyodide.loadPackage(["numpy", "matplotlib", "scipy"])];

        case 3:
          _a.sent();

          console.log("Loaded packages: ");
          console.log(pyodide.loadedPackages);
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.loadPyodide = loadPyodide;

var runPython = function runPython(code) {
  return __awaiter(void 0, void 0, void 0, function () {
    var out;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!code) return [2
          /*return*/
          ];
          pyodide.globals.code_to_run = code;
          return [4
          /*yield*/
          , pyodide.runPythonAsync("run_code(code_to_run)")];

        case 1:
          out = _a.sent();
          return [2
          /*return*/
          , out];
      }
    });
  });
};

exports.runPython = runPython;
},{"./helpers":"helpers.ts"}],"api.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCodeBlocksNestedUnder = exports.getUidOfClosestBlockReferencing = exports.writeToNestedBlock = exports.getBlockStringByUid = exports.createBlock = exports.updateBlock = exports.q = void 0;

var helpers_1 = require("./helpers");
/* === WRAPPERS === */


var q = function q(query) {
  return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , window.roamAlphaAPI.q(query)];

        case 1:
          result = _a.sent();

          if (!result || result.length === 0) {
            return [2
            /*return*/
            , null];
          } else return [2
          /*return*/
          , result];

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.q = q;

var updateBlock = function updateBlock(uid, string) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          //@ts-ignore
          return [4
          /*yield*/
          , window.roamAlphaAPI.updateBlock({
            block: {
              uid: uid,
              string: string
            }
          })];

        case 1:
          //@ts-ignore
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.updateBlock = updateBlock;

var createBlock = function createBlock(parentUid, order, uid, string) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          //@ts-ignore
          return [4
          /*yield*/
          , window.roamAlphaAPI.createBlock({
            location: {
              "parent-uid": parentUid,
              order: order
            },
            block: {
              uid: uid,
              string: string
            }
          })];

        case 1:
          //@ts-ignore
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.createBlock = createBlock;
/* === COMPOSITE FUNCTIONS === */

var getBlockStringByUid = function getBlockStringByUid(uid) {
  return __awaiter(void 0, void 0, void 0, function () {
    var query, result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          query = "[:find (pull ?block [:block/string])\n         :where [?block :block/uid \"" + uid + "\"]]";
          return [4
          /*yield*/
          , exports.q(query)];

        case 1:
          result = _a.sent();
          return [2
          /*return*/
          , result[0][0].string];
      }
    });
  });
};

exports.getBlockStringByUid = getBlockStringByUid;

var writeToNestedBlock = function writeToNestedBlock(parentUid, string) {
  return __awaiter(void 0, void 0, void 0, function () {
    var query, result, nestedUid, nestedUid;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!string) return [2
          /*return*/
          ];
          query = "\n  [:find \n    (pull ?nestedBlock \n        [:block/uid])\n   :where\n    [?parentBlock :block/uid \"" + parentUid + "\"]\n    [?parentBlock :block/children ?nestedBlock]]";
          return [4
          /*yield*/
          , exports.q(query)];

        case 1:
          result = _a.sent();

          if (!result) {
            nestedUid = helpers_1.createUid();
            exports.createBlock(parentUid, 0, nestedUid, string);
          } else {
            nestedUid = result[0][0].uid;
            exports.updateBlock(nestedUid, string);
          }

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.writeToNestedBlock = writeToNestedBlock;

var getUidOfClosestBlockReferencing = function getUidOfClosestBlockReferencing(uid, page) {
  return __awaiter(void 0, void 0, void 0, function () {
    var results, page_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , exports.q("[:find \n  (pull ?notebookBlock [:block/uid]) \n  :where  [?notebookBlock :block/refs ?pyroamNotebook]\n          [?pyroamNotebook :node/title \"" + page + "\"]\n          [?activeBlock :block/parents ?notebookBlock]\n          [?activeBlock :block/uid \"" + uid + "\"]]")];

        case 1:
          results = _a.sent();
          if (!results) return [3
          /*break*/
          , 2];
          return [2
          /*return*/
          , results[0][0].uid];

        case 2:
          return [4
          /*yield*/
          , exports.q("[:find \n    (pull ?page [:block/uid])\n    :where [?page :node/title]\n           [?activeBlock :block/uid \"" + uid + "\"] \n           [?activeBlock :block/parents ?page]]")];

        case 3:
          page_1 = _a.sent();
          return [2
          /*return*/
          , page_1[0][0].uid];
      }
    });
  });
};

exports.getUidOfClosestBlockReferencing = getUidOfClosestBlockReferencing;

var getAllCodeBlocksNestedUnder = function getAllCodeBlocksNestedUnder(topUid) {
  return __awaiter(void 0, void 0, void 0, function () {
    var results, cells;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , window.roamAlphaAPI.q('[:find\
    (pull ?cell [:block/string :block/order :block/uid {:block/_children ...}])\
    :where  [?notebookBlock :block/uid "' + topUid + '"]\
            [?cell :block/parents ?notebookBlock]\
            [?cell :block/string ?string]\
            [(clojure.string/starts-with? ?string "```python")]]')];

        case 1:
          results = _a.sent();
          cells = helpers_1.processCodeBlocks(results, topUid);
          return [2
          /*return*/
          , cells];
      }
    });
  });
};

exports.getAllCodeBlocksNestedUnder = getAllCodeBlocksNestedUnder;
},{"./helpers":"helpers.ts"}],"notebook.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runActiveNotebook = exports.runActiveBlockAndWriteToNext = void 0;

var helpers_1 = require("./helpers");

var api_1 = require("./api");

var pyodide_1 = require("./pyodide");

var runAllBlocksBelowUidAndWrite = function runAllBlocksBelowUidAndWrite(notebookUid) {
  return __awaiter(void 0, void 0, void 0, function () {
    var cells, activeUid, _i, cells_1, cell, out;

    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , api_1.getAllCodeBlocksNestedUnder(notebookUid)];

        case 1:
          cells = _a.sent();
          activeUid = helpers_1.getActiveBlockUid();
          _i = 0, cells_1 = cells;
          _a.label = 2;

        case 2:
          if (!(_i < cells_1.length)) return [3
          /*break*/
          , 6];
          cell = cells_1[_i];
          if (cell.uid === activeUid) cell.string = helpers_1.getActiveCodeBlockContent();
          return [4
          /*yield*/
          , pyodide_1.runPython(cell.string)];

        case 3:
          out = _a.sent();
          return [4
          /*yield*/
          , api_1.writeToNestedBlock(cell.uid, out)];

        case 4:
          _a.sent();

          _a.label = 5;

        case 5:
          _i++;
          return [3
          /*break*/
          , 2];

        case 6:
          return [2
          /*return*/
          ];
      }
    });
  });
};
/**
 * Runs only the active cell
 */


var runActiveBlockAndWriteToNext = function runActiveBlockAndWriteToNext() {
  return __awaiter(void 0, void 0, void 0, function () {
    var activeUid, code, out;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          activeUid = helpers_1.getActiveBlockUid();
          code = helpers_1.getActiveCodeBlockContent();
          return [4
          /*yield*/
          , pyodide_1.runPython(code)];

        case 1:
          out = _a.sent();
          return [4
          /*yield*/
          , api_1.writeToNestedBlock(activeUid, out)];

        case 2:
          _a.sent();

          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.runActiveBlockAndWriteToNext = runActiveBlockAndWriteToNext;
/**
 * Runs the whole notebook
 */

var runActiveNotebook = function runActiveNotebook() {
  return __awaiter(void 0, void 0, void 0, function () {
    var uid, notebookUid;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          uid = helpers_1.getActiveBlockUid();
          return [4
          /*yield*/
          , api_1.getUidOfClosestBlockReferencing(uid, "pyroam/notebook")];

        case 1:
          notebookUid = _a.sent();
          console.log("Notebook Block uid:" + notebookUid);
          runAllBlocksBelowUidAndWrite(notebookUid);
          return [2
          /*return*/
          ];
      }
    });
  });
};

exports.runActiveNotebook = runActiveNotebook;
},{"./helpers":"helpers.ts","./api":"api.ts","./pyodide":"pyodide.ts"}],"keyboard.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleKeyPress = void 0;

var notebook_1 = require("./notebook");

var handleKeyPress = function handleKeyPress(e) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (e.code === "Enter" && e.altKey === true && !e.shiftKey) {
        notebook_1.runActiveBlockAndWriteToNext();
      } else if (e.code === "Enter" && e.altKey === true && e.shiftKey === true) {
        notebook_1.runActiveNotebook();
      }

      return [2
      /*return*/
      ];
    });
  });
};

exports.handleKeyPress = handleKeyPress;
},{"./notebook":"notebook.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var pyodide_1 = require("./pyodide");

var keyboard_1 = require("./keyboard");

console.log("Loading pyroam.");
pyodide_1.loadPyodide();
document.addEventListener("keydown", keyboard_1.handleKeyPress);
},{"./pyodide":"pyodide.ts","./keyboard":"keyboard.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54364" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/pyroam.js.map