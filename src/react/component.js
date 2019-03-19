import ReactDom from '../react-dom';

// 存放一次循环中的 state 队列
const setStateQueue = [];
// 存放需要更新的组件队列
const renderQueue = [];

function enqueueSetState(stateChange, component, callback) {
  if (setStateQueue.length === 0) {
    setTimeout(flush);
  }

  setStateQueue.push({
    stateChange,
    component,
    callback
  });
  
  if (!renderQueue.some( item => item === component )) {
    renderQueue.push(component);
  }
}

// 清空 state 队列
function flush() {
  let item;

  while (item = setStateQueue.shift()) {
    let { stateChange, component, callback } = item;
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state);
    }

    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props));
    } else {
      Object.assign(component.state, stateChange);
    }

    component.prevState = component.state;

    callback && callback.call(this);
  }

  // 渲染每一个组件
  let component;
  // console.log(renderQueue)
  while( component = renderQueue.shift() ) {
    // console.log(component.state)
    ReactDom.renderComponent( component );
  }
  // console.log(renderQueue)
}

class Component {
  constructor(props = {}) {
    this.state = {};
    this.props = props;
  }

  setState(stateChange, callback) {
    enqueueSetState(stateChange, this, callback);
  }
}

export default Component;