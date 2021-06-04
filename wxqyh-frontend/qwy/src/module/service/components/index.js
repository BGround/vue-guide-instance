//私有组件定义
import Layout from '../components/layout'
import Header from '../components/header'
import Content from '../components/layout/content'
import Tabs from '../components/tabs'
import ExclusiveBuy from '../components/vip/exclusive.vue'
import ExpansionBuy from '../components/vip/expansion'
import QwPrice from '../components/vip/price'
import {Checkbox,CheckboxGroup,Package, PackageGroup} from '../components/checkbox'

const components = [
  Layout,
  Header,
  Content,
  Tabs,
  ExclusiveBuy,
  ExpansionBuy,
  QwPrice,
  Checkbox,
  CheckboxGroup,
  Package,
  PackageGroup
]

// 定义插件安装方法
const install = Vue => {
  components.map(component => {
    Vue.component(component.name, component);
  });

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// 单个组件暴露
export {
  Layout,
  Header,
  Tabs,
  Content,
  ExclusiveBuy,
  ExpansionBuy,
  QwPrice,
  Checkbox,
  CheckboxGroup,
  Package,
  PackageGroup
}

export default {
  install
};
