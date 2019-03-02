import Vue from 'vue';
import TopTipCom from './TopTip.vue';

// 创建子类
const TopTipConstructor = Vue.extend(TopTipCom);
let topTipIns = Vue.prototype.$TOPTIP;

let getAnInstance = () => {
  if (topTipIns) {
    topTipIns.destory();
  }
  // 创建实例
  topTipIns = new TopTipConstructor({
    el: document.createElement('div')
  });
  return topTipIns;
};

let removeDom = (instance, e) => {
  if (e.target.parentNode) {
    e.target.parentNode.removeChild(e.target);
  }
  instance.$destroy();
  topTipIns = null;
};

TopTipConstructor.prototype.remove = function() {
  this.visible = false;
  this.$el.addEventListener('transitionend', removeDom.bind(null, this));
};

TopTipConstructor.prototype.destory = function() {
  this.$el.parentNode.removeChild(this.$el);
  this.$destroy();
  topTipIns = null;
};

let TopTip = (options = {}) => {
  let duration = options.duration || 3000;

  let instance = getAnInstance();
  clearTimeout(instance.timer);
  instance.message = typeof options === 'string' ? options : options.message;

  document.body.appendChild(instance.$el); // 挂载body上
  Vue.nextTick(() => {
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    ~duration && (instance.timer = setTimeout(() => {
      instance.remove();
    }, duration));
  });
  return instance;
};

export default TopTip;
