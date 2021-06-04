//快递相关
const express = r => require.ensure([], () => r(require('../../views/express/index')));
const expressList = r => require.ensure([], () => r(require('../../views/express/list')));
const expressSetting = r => require.ensure([], () => r(require('../../views/express/setting')));
const expressMenuSetting = r => require.ensure([], () => r(require('../../views/express/menuSetting.vue')));
const expressDescSetting = r => require.ensure([], () => r(require('../../views/express/DescSetting.vue')));
const expressPowerSetting = r => require.ensure([], () => r(require('../../views/express/powerSetting.vue')));


export default {
  expressRouter:{
    path:'/express',
    component:express,
    children: [
    {
      path: '',
      component: expressList,
    },
    {
      path: 'setting',
      component: expressSetting,
    },
    {
      path: 'menuSetting',
      component: expressMenuSetting,
    },
    {
      path: 'descSetting',
      component: expressDescSetting,
    },
    {
      path: 'powerSetting',
      component: expressPowerSetting,
    }
  ],
},
}
