import render from './render';

function diffNode(dom, vnode) {
  // console.log(dom, vnode)
  let out;
  // 文本节点
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

  let { tag, attrs } = vnode;
  vnode.attrs = attrs || {};
  // console.log(vnode)

  // 组件节点
  if (typeof tag === 'function') {
    return diffComponent(dom, vnode);
  }
  
  // 普通 html 节点类型
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(tag);

    if (dom) {
      // 将 dom 节点中的子节点转到 out 中，以便后面更新
      // Array.prototype.forEach.call(dom.childNodes, item => out.appendChild(item));

      if (dom.parentNode) {
        dom.parentNode.replaceChild(out, dom);
      }
    }
  }
  
  // 如果真实节点或者虚拟节点中有子节点，就需要更新
  if (vnode.children && vnode.children.length > 0 || out.childNodes && out.childNodes.length > 0) {
    diffChildren(out || dom, vnode);
  }

  // 属性更新
  diffAttribute(out || dom, vnode);
  return out || dom;
}

function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const keyed = {};
  const children = [];

  // 判断用户是否给组件设置了 key 值
  Array.prototype.forEach.call(domChildren, item => {
    const key = item.key;
    if (key) {
      keyed[key] = item;
    } else {
      children.push(item);
    }
  });

  // 查找是否有相同 key 的组件
  vChildren.children.forEach((item, index) => {
    const { attrs } = item;
    let child;

    if (attrs && keyed[attrs.key]) {
      child = keyed[attrs.key];
      keyed[attrs.key] = undefined;
    } else {
      const childrenLen = children.length;
      for (let i = 0; i < childrenLen; i++) {
        const childNow = children[i];
        if (childNow && isSameNodeType(childNow, item)) {
          child = childNow;
          children[i] = undefined;
          break;
        }
      }
    }

    child = diffNode(child, item);

    // 对元素的内容和顺序进行修改
    const f = domChildren[index];
    if (child && child !== dom && child !== f) {
      if (!f) {
        dom.appendChild(child);
      // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
      } else if (child === f.nextSibling) {
        removeNode(f);
      // 将更新后的节点移动到正确的位置
      } else {
        // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
        dom.insertBefore( child, f );
      }
    }
  })
} 

function diffComponent(dom, vnode) {
  // console.log(dom, vnode)
  let component = dom && dom._component;
  let oldDom = dom;
  if (component && component.constructor === vnode.tag) {
    render.setComponentProps(component, vnode.attrs);
    dom = component.base;
  } else {
    if (component) {
      unmountComponent(component);
      oldDom = null;
    }

    component = render.createComponent(vnode.tag, vnode.attrs);
    render.setComponentProps(component);
    dom = component.base;

    if ( oldDom && dom !== oldDom ) {
      oldDom._component = null;
      removeNode( oldDom );
    }

  }

  return dom;
}

// 卸载组件
function unmountComponent(component) {
  if (component.componentWillUnmount) {
    component.componentWillUnmount();
  }
  removeNode(component.base);
}

function diffAttribute(dom, vnode) {
  const old = {};
  const attrs = vnode.attrs || {};

  // 将原节点的属性遍历存放
  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    old[attr.name] = attr.value;
  }

  // 删除新的节点没有的属性
  for (let key in old) {
    if (!key in attrs) {
      render.setAttribute(dom, key, undefined);
    }
  }

  // 添加或修改属性
  Object.entries(attrs).forEach(([key, val]) => {
    if (old[key] !== val) {
      render.setAttribute(dom, key, val);
    }
  });
}

function isSameNodeType( dom, vnode ) {
  if ( typeof vnode === 'string' || typeof vnode === 'number' ) {
    return dom.nodeType === 3;
  }

  if ( typeof vnode.tag === 'string' ) {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase();
  }
  
  return dom && dom._component && dom._component.constructor === vnode.tag;
}

export default diffNode;