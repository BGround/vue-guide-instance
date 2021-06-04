
import Vue from 'vue'
/* 公用组件引入定义 */
import QwFooter from '@/components/base/footer';
import QwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import msgBoxs from "@/components/base/msgBoxs";
import topAlert from '@/components/base/topAlert';
import ServiceAgreement from "@/components/serviceAgreement";

const components = [
  QwFooter,
  QwButton,
  msgBoxs,
  topAlert,
  ServiceAgreement
]

// 定义插件安装方法

const install = function(Vue) {

  components.map(component => {
    Vue.use(component);
  });

    // Vue.prototype.$alert = MessageBox.alert;
};

  /* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

export {
  QwFooter,
  QwButton,
  msgBoxs,
  topAlert,
  ServiceAgreement
}

export default{
  install,
}

