<template lang="html">
  <div class="main-container">
    <router-view></router-view>
    <!--底部菜单-->
    <footer-nav :footerList="homeFooterList.nav"></footer-nav>
  </div>
</template>

<script>
import FooterNav from '../components/base/FooterNav';
import { mapGetters } from 'vuex';

export default {
  name: 'QwMain',
  components: {
    FooterNav,
  },
  data() {
    return {
      homeFooterList:{
        nav_on:0,
        nav:[
          {
            type: 'normal',
            class: 'ic_tabar1',
            text: 'i18n.reim.pages.myReimbursement',
            name: 'reimbursement',
          },
          {
            type: 'normal',
            class: 'ic_tabar2',
            text: 'i18n.reim.pages.approved',
            name: 'approved',
            num: ''
          },
          {
            type: 'normal',
            class: 'ic_tabar3',
            text: 'i18n.reim.pages.related',
            name: 'related'
          },
          {
            type: 'normal',
            class: 'ic_tabar4',
            text: 'i18n.reim.pages.more',
            path: '/more',
            name: 'more'
          }
        ]
      },
    };
  },
  computed: {
    ...mapGetters([
      'waitingNum',
    ])
  },
  watch: {
    waitingNum(num) {
      this.homeFooterList.nav[1].num = num;
    }
  },
  created() {
    this.homeFooterList.nav[1].num = this.waitingNum;
  },
};
</script>

<style lang="scss" scoped>
</style>
