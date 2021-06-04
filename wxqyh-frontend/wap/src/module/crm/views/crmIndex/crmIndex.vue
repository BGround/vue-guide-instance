<template>
  <div class="wrap crm_index_wrap" >
      <router-view></router-view>
      <div class="crm_footer_tab index_footer_tab">
          <router-link class="footer_item" tag="div" :to="{name: 'home'}" active-class="active">
              <div class="tab_wrap">
                  <i class="iconfont cr-icon_a-home_tab_crm1"></i>
                  <p class="tab_name">CRM</p>
              </div>
          </router-link>
          <router-link class="footer_item" tag="div" :to="{name: 'dataBoard'}" active-class="active">
              <div class="tab_wrap">
                  <i class="iconfont cr-icon_a-icon_tab_data"></i>
                  <p class="tab_name">数据看板</p>
              </div>
          </router-link>
          <router-link class="footer_item" tag="div" :to="{name:'waitDealIndex',query:{fromTab:1}}" active-class="active">
            <div class="tab_wrap">
              <i class="iconfont cr-icon_a-home_tab_wait"></i>
              <p class="tab_name">待办</p>
            </div>
          </router-link>
          <router-link class="footer_item" tag="div" :to="{name: 'myHome'}" active-class="active">
            <div class="tab_wrap">
              <!-- <i class="iconfont cr-icon_a-home_tab_me"></i> -->
              <i class="iconfont cr-icon_a-home_tab_me1"></i>
              <p class="tab_name">我</p>
            </div>
          </router-link>
      </div>
  </div>
</template>

<script>
export default {
  name: 'crmIndex',
  data(){
    return {}
  },
  created:function(){

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
@import '../../crmBase.scss';
.crm_index_wrap{
    height: 100%;
    background: #fff;
}
</style>

