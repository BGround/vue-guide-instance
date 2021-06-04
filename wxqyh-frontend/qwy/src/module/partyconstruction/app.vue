<template lang="html">
  <div id="app">
    <router-view>获取智慧党建页面异常，请刷新或与我们联系</router-view>

    <!-- 加载框 -->
    <!-- <qw-loading v-if="isShowLoading"></qw-loading> -->
  </div>
</template>

<script>
import Vue from 'vue';
// import Ajax from './utils/ajax';
// import QwLoading from './components/common/loading';

export default {
  name: 'app',
  // data () {
  //   return {
  //     isShowLoading: false
  //   }
  // },
  // components: {
  //   QwLoading
  // },
  // beforeCreate () {
  //   Vue.use(Ajax, {
  //     loading: {
  //       show: async name => {
  //         this.isShowLoading = true;
  //       },
  //       hide: async name => {
  //         this.isShowLoading = false;
  //       }
  //     },
  //     handler: {
  //       response: async res => {
  //         if (res.code === '0') {
  //           return Promise.resolve(res);
  //         } else {
  //           return Promise.reject(res.desc);
  //         }
  //       },
  //       error: async err => {
  //
  //       }
  //     }
  //   })
  // }
}
</script>

<style lang="scss" src="./static/scss/common.scss">

</style>
