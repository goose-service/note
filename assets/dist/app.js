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
})({"ajax.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

/**
 * ajax interface
 *
 * @param {String} url
 * @param {String} method
 * @param {Object} params
 * @param {Object} headers
 */
function _default() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return new Promise(function (resolve, reject) {
    // check url
    if (!url) reject('not found url'); // set xhr instance object

    var xhr = new XMLHttpRequest(); // xhr event

    xhr.onreadystatechange = function () {
      if (!(this.readyState === 4 && this.status === 200)) return;

      try {
        resolve(JSON.parse(this.responseText));
      } catch (e) {
        reject('parse error');
      }
    }; // open xhr


    xhr.open(method.toUpperCase(), url, true); // set headers

    if (headers) {
      var keys = Object.keys(headers);

      for (var i = 0; i < keys.length; i++) {
        xhr.setRequestHeader(keys[i], headers[keys[i]]);
      }
    } // send xhr


    xhr.send();
  });
}

;
},{}],"prototypes.js":[function(require,module,exports) {
/**
 * Wrap an HTML Element
 * https://jonlabelle.com/snippets/view/javascript/wrap-an-html-element-in-javascript
 *
 * @param {Array} elms
 */
HTMLElement.prototype.wrap = function (elms) {
  // Convert `elms` to an array, if necessary.
  if (!elms.length) elms = [elms]; // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `child` below).

  for (var i = elms.length - 1; i >= 0; i--) {
    var child = i > 0 ? this.cloneNode(true) : this;
    var el = elms[i]; // Cache the current parent and sibling.

    var parent = el.parentNode;
    var sibling = el.nextSibling; // Wrap the element (is automatically removed from its current
    // parent).

    child.appendChild(el); // If the element had a sibling, insert the wrapper before
    // the sibling to maintain the HTML structure; otherwise, just
    // append it to the parent.

    if (sibling) {
      parent.insertBefore(child, sibling);
    } else {
      parent.appendChild(child);
    }
  }
};
},{}],"../../node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../node_modules/parcel/src/builtins/bundle-url.js"}],"../css/app.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../node_modules/parcel/src/builtins/css-loader.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _ajax = _interopRequireDefault(require("./ajax"));

require("./prototypes");

require("../css/app.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Redgoose = /*#__PURE__*/function () {
  /**
   * constructor
   */
  function Redgoose() {
    _classCallCheck(this, Redgoose);

    this.headerElements = {
      navigation: document.getElementById('headerNavigation'),
      search: document.getElementById('headerSearch'),
      searchForm: document.getElementById('search_keyword')
    };
    this.articleElements = {
      main: document.getElementById('article'),
      content: document.getElementById('article_content'),
      buttonLike: document.getElementById('button_like')
    }; // init header events

    this.initialHeaderEvents();
  }
  /**
   * initial header events
   */


  _createClass(Redgoose, [{
    key: "initialHeaderEvents",
    value: function initialHeaderEvents() {
      var self = this;
      var navigation = this.headerElements.navigation.children[0];
      var search = this.headerElements.search.children[0]; // navigation dropdown event

      navigation.addEventListener('click', function (e) {
        self.headerElements.search.classList.remove('active');
        e.currentTarget.parentNode.classList.toggle('active');
        e.currentTarget.parentNode.querySelector('.dropdown-content').classList.toggle('active');
      }); // search dropdown event

      search.addEventListener('click', function (e) {
        self.headerElements.navigation.classList.remove('active');
        e.currentTarget.parentNode.classList.toggle('active');
        e.currentTarget.parentNode.querySelector('.dropdown-content').classList.toggle('active'); // on focus input form

        if (e.currentTarget.parentNode.classList.contains('active')) {
          e.currentTarget.parentNode.querySelector('input[type=text]').focus();
        }
      }); // input keyword event from search input

      var searchInput = this.headerElements.searchForm.q;

      if (searchInput.value.length) {
        searchInput.parentNode.classList.add('is-word');
        search.parentNode.classList.add('active-bg');
      }

      searchInput.addEventListener('keyup', function (e) {
        if (searchInput.value.length) {
          searchInput.parentNode.classList.add('is-word');
          search.parentNode.classList.add('active-bg');
        } else {
          searchInput.parentNode.classList.remove('is-word');
          search.parentNode.classList.remove('active-bg');
        }
      }); // reset event from search input

      var searchReset = this.headerElements.searchForm.querySelector('button[type=reset]');
      searchReset.addEventListener('click', function (e) {
        e.preventDefault();
        searchInput.value = '';
        searchInput.parentNode.classList.remove('is-word');
        search.parentNode.classList.remove('active-bg');
        searchInput.focus();
      }); // dropdown content 닫기에 관련된 이벤트

      window.addEventListener('click', function (e) {
        if (!e.target.matches('.dropdown-button')) {
          if (!!e.target.closest('.dropdown-content')) return;
          var dropdowns = document.getElementsByClassName('dropdown-content');

          for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];

            if (openDropdown.classList.contains('active')) {
              openDropdown.parentNode.classList.remove('active');
              openDropdown.classList.remove('active');
            }
          }
        }
      });
    }
    /**
     * initial article
     */

  }, {
    key: "initialArticle",
    value: function initialArticle() {
      // button like event
      this.articleElements.buttonLike.addEventListener('click', function (e) {
        var button = e.currentTarget;
        var srl = parseInt(button.dataset.srl); // update button

        button.setAttribute('disabled', true);
        button.classList.add('on'); // update count

        var em = button.querySelector('em');
        var cnt = parseInt(em.textContent);
        em.innerHTML = String(cnt + 1); // call xhr

        (0, _ajax.default)("/on-like/".concat(srl, "/"), 'post', null).then(function (res) {
          if (!res.success) throw new Error();
          em.innerHTML = String(res.star);
        }).catch(function (e) {
          alert('Failed update like');
          button.removeAttribute('disabled');
          button.classList.remove('on');
          em.innerHTML = String(cnt);
        });
      });
    }
  }]);

  return Redgoose;
}();

module.exports = Redgoose;
},{"./ajax":"ajax.js","./prototypes":"prototypes.js","../css/app.scss":"../css/app.scss"}],"../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51460" + '/');

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
},{}]},{},["../../node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], "Redgoose")
//# sourceMappingURL=app.js.map