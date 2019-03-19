import { Component } from '../react';
import diffNode from './diff';

function render(vnode, container) {
  // container.appendChild(_render(vnode));
  const ret = diffNode(null, vnode);
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

  let { tag, attrs, children } = vnode;
  attrs = attrs || {};

  // 组件渲染
  if (typeof tag === 'function') {
    const component = createComponent(tag, attrs);
    setComponentProps(component, attrs);
    return component.base;
  }
  
  // 普通元素渲染
  const dom = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => setAttribute(dom, key, val));
  children.forEach(child => render(child, dom));
  return dom;
}

// 为节点添加属性
function setAttribute(dom, name, value) {
  // 添加样式
  if (name === 'style') {
    return Object.entries(value).forEach(([key, val]) => dom .style[key] = typeof val === 'number' ? `${val}px` : val);
  }

  // 添加事件
  if (/^on\w+/.test(name)) {
    name = name.toLowerCase();
    return dom[name] = value || '';
  }

  // 添加 class
  if (name === 'className') {
    name = 'class';
  }

  dom.setAttribute(name, value)
}

// 创建组件
function createComponent(component, props) {
  let inst;

  if (component.prototype && component.prototype.defaultProps) {
    Object.assign(props, component.prototype.defaultProps);
  }

  if (component.prototype && component.prototype.render) {
    inst = new component(props);
  } else {
    inst = new component(props);
    inst.constructor = component;
    inst.render = () => {
      return inst.constructor(props);
    }
  }

  return inst;
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.componentWillMount) {
      component.componentWillMount()
    }
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props);
  }

  renderComponent(component);
}

function renderComponent(component) {
  const render = component.render();

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  // const base = _render(render);
  const base = diffNode(component.base, render);

  if (!component.base) {
    if (component.componentDidMount) {
      component.componentDidMount();
    }
  } else if (component.componentDidUpdate) {
    component.componentDidUpdate()
  }

  // if (component.base && component.base.parentNode) {
  //   component.base.parentNode.replaceChild(base, component.base);
  // }

  component.base = base;
  base._component = component;
}

export default {
  render: (vnode, container) => {
    container.innerHTML = '';
    return render(vnode, container);
  },
  renderComponent,
  setAttribute,
  setComponentProps,
  createComponent
}