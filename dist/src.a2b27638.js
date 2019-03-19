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
})({"src/react/create-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(tag, attrs) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    tag: tag,
    attrs: attrs,
    children: children
  };
};

exports.default = _default;
},{}],"src/react-dom/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function diffNode(dom, vnode) {
  var out; // 文本节点

  if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
    vnode = '';
  }

  if (typeof vnode === 'number') {
    vnode = '' + vnode;
  }

  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode;
      }
    } else {
      out = document.createTextNode(vnode);

      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }

    return out;
  }

  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs;
  attrs = attrs || {}; // 组件节点

  if (typeof tag === 'function') {
    return diffComponent(dom, vnode);
  } // 普通 html 节点类型


  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(tag);

    if (dom) {
      // 将 dom 节点中的子节点转到 out 中，以便后面更新
      // Array.prototype.forEach.call(dom.childNodes, item => out.appendChild(item));
      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
  } // 如果真实节点或者虚拟节点中有子节点，就需要更新


  if (vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out || dom, vnode);
  } // 属性更新


  diffAttribute(out || dom, vnode);
  return out || dom;
}

function diffChildren(dom, vChildren) {
  var domChildren = dom.childNodes;
  var keyed = {};
  var children = []; // 判断用户是否给组件设置了 key 值

  Array.prototype.forEach.call(domChildren, function (item) {
    var key = item.key;

    if (key) {
      keyed[key] = item;
    } else {
      children.push(item);
    }
  }); // 查找是否有相同 key 的组件

  vChildren.children.forEach(function (item, index) {
    var attrs = item.attrs;
    var child;

    if (attrs && keyed[attrs.key]) {
      child = keyed[attrs.key];
      keyed[attrs.key] = undefined;
    } else {
      var childrenLen = children.length;

      for (var i = 0; i < childrenLen; i++) {
        var childNow = children[i];

        if (childNow && isSameNodeType(childNow, item)) {
          child = childNow;
          children[i] = undefined;
          break;
        }
      }
    }

    child = diffNode(child, item); // 对元素的内容和顺序进行修改

    var f = domChildren[index];

    if (child && child !== dom && child !== f) {
      if (!f) {
        dom.appendChild(child); // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
      } else if (child === f.nextSibling) {
        removeNode(f); // 将更新后的节点移动到正确的位置
      } else {
        // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
        dom.insertBefore(child, f);
      }
    }
  });
}

function diffComponent(dom, vnode) {
  var component = dom && dom._component;
  var oldDom = dom;

  if (component && component.constructor === vnode.tag) {
    _render.default.setComponentProps(component, vnode.attrs);

    dom = component.base;
  } else {
    if (component) {
      unmountComponent(component);
      oldDom = null;
    }

    component = _render.default.createComponent(vnode.tag, vnode.attrs);

    _render.default.setComponentProps(component);

    dom = component.base;

    if (oldDom && dom !== oldDom) {
      oldDom._component = null;
      removeNode(oldDom);
    }
  }

  return dom;
} // 卸载组件


function unmountComponent(component) {
  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }

  removeNode(component.base);
}

function diffAttribute(dom, vnode) {
  var old = {};
  var attrs = vnode.attrs || {}; // 将原节点的属性遍历存放

  for (var i = 0; i < dom.attributes.length; i++) {
    var attr = dom.attributes[i];
    old[attr.name] = attr.value;
  } // 删除新的节点没有的属性


  for (var key in old) {
    if (!key in attrs) {
      _render.default.setAttribute(dom, key, undefined);
    }
  } // 添加或修改属性


  Object.entries(attrs).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    if (old[key] !== val) {
      _render.default.setAttribute(dom, key, val);
    }
  });
}

function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3;
  }

  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }

  return dom && dom._component && dom._component.constructor === vnode.tag;
}

var _default = diffNode;
exports.default = _default;
},{"./render":"src/react-dom/render.js"}],"src/react-dom/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("../react");

var _diff = _interopRequireDefault(require("./diff"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _render2(vnode, container) {
  // container.appendChild(_render(vnode));
  var ret = (0, _diff.default)(null, vnode);

  if (container && ret.parentNode !== container) {
    container.appendChild(ret);
  }
}

function _render(vnode) {
  // console.log(vnode)
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = '';
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }

  var _vnode = vnode,
      tag = _vnode.tag,
      attrs = _vnode.attrs,
      children = _vnode.children;
  attrs = attrs || {}; // 组件渲染

  if (typeof tag === 'function') {
    var component = createComponent(tag, attrs);
    setComponentProps(component, attrs);
    return component.base;
  } // 普通元素渲染


  var dom = document.createElement(tag);
  Object.entries(attrs).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return setAttribute(dom, key, val);
  });
  children.forEach(function (child) {
    return _render2(child, dom);
  });
  return dom;
} // 为节点添加属性


function setAttribute(dom, name, value) {
  // 添加样式
  if (name === 'style') {
    return Object.entries(value).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          val = _ref4[1];

      return dom.style[key] = typeof val === 'number' ? "".concat(val, "px") : val;
    });
  } // 添加事件


  if (/^on\w+/.test(name)) {
    name = name.toLowerCase();
    return dom[name] = value || '';
  } // 添加 class


  if (name === 'className') {
    name = 'class';
  }

  dom.setAttribute(name, value);
} // 创建组件


function createComponent(component, props) {
  var inst;

  if (component.prototype && component.prototype.defaultProps) {
    Object.assign(props, component.prototype.defaultProps);
  }

  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new component(props);
    inst.constructor = component;

    inst.render = function () {
      return inst.constructor(props);
    };
  }

  return inst;
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) {
      component.componentWillMount();
    }
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  renderComponent(component);
}

function renderComponent(component) {
  var render = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  } // const base = _render(render);


  var base = (0, _diff.default)(component.base, render);

  if (!component.base) {
    if (component.componentDidMount) {
      component.componentDidMount();
    }
  } else if (component.componentDidUpdate) {
    component.componentDidUpdate();
  } // if (component.base && component.base.parentNode) {
  //   component.base.parentNode.replaceChild(base, component.base);
  // }


  component.base = base;
  base._component = component;
}

var _default = {
  render: function render(vnode, container) {
    container.innerHTML = '';
    return _render2(vnode, container);
  },
  renderComponent: renderComponent,
  setAttribute: setAttribute,
  setComponentProps: setComponentProps,
  createComponent: createComponent
};
exports.default = _default;
},{"../react":"src/react/index.js","./diff":"src/react-dom/diff.js"}],"src/react-dom/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _render = _interopRequireDefault(require("./render"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var render = _render.default.render,
    renderComponent = _render.default.renderComponent;
var _default = {
  render: render,
  renderComponent: renderComponent
};
exports.default = _default;
},{"./render":"src/react-dom/render.js"}],"src/react/component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = _interopRequireDefault(require("../react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 存放一次循环中的 state 队列
var setStateQueue = []; // 存放需要更新的组件队列

var renderQueue = [];

function enqueueSetState(stateChange, component, callback) {
  if (setStateQueue.length === 0) {
    setTimeout(flush);
  }

  setStateQueue.push({
    stateChange: stateChange,
    component: component,
    callback: callback
  });

  if (!renderQueue.some(function (item) {
    return item === component;
  })) {
    renderQueue.push(component);
  }
} // 清空 state 队列


function flush() {
  var item;

  while (item = setStateQueue.shift()) {
    var _item = item,
        stateChange = _item.stateChange,
        _component = _item.component,
        callback = _item.callback;

    if (!_component.prevState) {
      _component.prevState = Object.assign({}, _component.state);
    }

    if (typeof stateChange === 'function') {
      Object.assign(_component.state, stateChange(_component.prevState, _component.props));
    } else {
      Object.assign(_component.state, stateChange);
    }

    _component.prevState = _component.state;
    callback && callback.call(this);
  } // 渲染每一个组件


  var component;

  while (component = renderQueue.shift()) {
    _reactDom.default.renderComponent(component);
  }
}

var Component =
/*#__PURE__*/
function () {
  function Component() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this.state = {};
    this.props = props;
  }

  _createClass(Component, [{
    key: "setState",
    value: function setState(stateChange, callback) {
      enqueueSetState(stateChange, this, callback);
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{"../react-dom":"src/react-dom/index.js"}],"src/react/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createElement = _interopRequireDefault(require("./create-element"));

var _component = _interopRequireDefault(require("./component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createElement: _createElement.default,
  Component: _component.default
};
exports.default = _default;
},{"./create-element":"src/react/create-element.js","./component":"src/react/component.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("./react"));

var _reactDom = _interopRequireDefault(require("./react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function Show(_ref) {
  var num = _ref.num;
  return _react.default.createElement("h1", null, num);
}

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App() {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this));
    _this.state = {
      num: 0
    };
    return _this;
  }

  _createClass(App, [{
    key: "hello",
    value: function hello() {
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        num: this.state.num + 1
      });
      this.setState({
        num: this.state.num + 1
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", {
        className: "App",
        onClick: function onClick() {
          return _this2.hello();
        }
      }, _react.default.createElement(Show, {
        num: this.state.num
      }));
    }
  }]);

  return App;
}(_react.default.Component);

_reactDom.default.render(_react.default.createElement(App, null), document.getElementById('root'));
},{"./react":"src/react/index.js","./react-dom":"src/react-dom/index.js"}],"../../../Users/mackenike/.nodejs/node_global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55695" + '/');

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
},{}]},{},["../../../Users/mackenike/.nodejs/node_global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.map