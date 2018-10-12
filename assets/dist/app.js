// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
},{}],"cookie.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;

/**
 * set cookie
 *
 * @param {String} key
 * @param {String} value
 * @param {Number} day
 * @param {String} path
 */
function set(key) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1';
  var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 7;
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
  var date = new Date();
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
  document.cookie = "".concat(key, "=").concat(value, ";expires=").concat(date.toUTCString(), ";path=").concat(path);
}
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
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
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

var cookie = _interopRequireWildcard(require("./cookie"));

require("../css/app.scss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Redgoose =
/*#__PURE__*/
function () {
  /**
   * constructor
   *
   * @param {Object} options
   */
  function Redgoose() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Redgoose);

    this.options = options;
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
      if (searchInput.value.length) searchInput.parentNode.classList.add('is-word');
      searchInput.addEventListener('keyup', function (e) {
        if (searchInput.value.length) {
          searchInput.parentNode.classList.add('is-word');
        } else {
          searchInput.parentNode.classList.remove('is-word');
        }
      }); // reset event from search input

      var searchReset = this.headerElements.searchForm.querySelector('button[type=reset]');
      searchReset.addEventListener('click', function (e) {
        e.preventDefault();
        searchInput.value = '';
        searchInput.parentNode.classList.remove('is-word');
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
     * merge options
     *
     * @param {Object} options
     */

  }, {
    key: "mergeOptions",
    value: function mergeOptions(options) {
      this.options = _objectSpread({}, this.options, options);
    }
    /**
     * initial article
     */

  }, {
    key: "initialArticle",
    value: function initialArticle() {
      var _this = this;

      // images in content
      this.articleElements.content.querySelectorAll('img').forEach(function (img, key) {
        if (img.parentNode) {
          img.parentNode.classList.add('image');
        }
      }); // button like event

      this.articleElements.buttonLike.addEventListener('click', function (e) {
        var button = e.currentTarget;
        var srl = parseInt(button.dataset.srl);
        var headers = {
          Authorization: _this.options.token
        }; // update button

        button.setAttribute('disabled', true);
        button.classList.add('on'); // update count

        var em = button.querySelector('em');
        var cnt = parseInt(em.textContent);
        em.innerHTML = String(cnt + 1);
        (0, _ajax.default)("".concat(_this.options.url_api, "/articles/").concat(srl, "/update?type=star"), 'get', null, headers).then(function (res) {
          if (res.success) {
            cookie.set("redgoose-like-".concat(srl), '1', 10, _this.options.url_cookie);
          } else {
            alert('Failed update like');
            button.removeAttribute('disabled');
            button.classList.remove('on');
            em.innerHTML = String(cnt);
          }
        });
      });
    }
  }]);

  return Redgoose;
}();

module.exports = Redgoose;
},{"./ajax":"ajax.js","./cookie":"cookie.js","../css/app.scss":"../css/app.scss"}],"../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55961" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/parcel/src/builtins/hmr-runtime.js","app.js"], "Redgoose")
//# sourceMappingURL=/app.map