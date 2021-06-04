import Vue from 'vue';
import { on } from './dom.js';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e));

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  // 循环所有的绑定节点，把它们的documentHandler属性所绑定的函数执行一次（这个时候得到的刚好是上面的那个判断执行的函数）
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

// 返回一个方法用来在点击的时候触发函数（触发之前会判断该元素是不是el，是不是focusElment以及他们的后代元素，如果是则不会执行函数）
function createDocumentHandler(el, binding, vnode) {
  return function(mouseup={},mousedown={}){
    if(!vnode ||
      !vnode.context ||
      !mousedown.target ||
      !mouseup.target ||
      el.contains(mousedown.target) ||
      el.contains(mouseup.target)){
      return;
    }

    if(binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]){
      vnode.context[el[ctx].methodName]();
    }else{
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-clickoutside="handleClose">
 * ```
 */

export default {
  // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
  // 把绑定的元素扔到nodeList里面，并给绑定元素设置属性
  // documentHandler属性在nodeList.forEach的时候执行并得到一个function
  // bindingFn 是绑定的那个值，用来执行的
  bind(el,binding,vnode){
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  // 所在组件的 VNode 更新时调用
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },
  // 只调用一次，指令与元素解绑时调用
  unbind (el) {
    let len = nodeList.length;
    for(let i = 0; i < len; i++){
      if(nodeList[i][ctx].id === el[ctx].id){
        nodeList.splice(i,1);
        break;
      }
    }
    delete el[ctx];
  }
};
