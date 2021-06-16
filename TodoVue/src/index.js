import Vue from 'vue'
import App from './app.vue'

import './assets/styles/global.styl'
import './assets/images/bg.png'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render: (h) => h(App)      // render里面的参数h，就是vue中的createApp
}).$mount(root)                // 将App实例挂载到root上