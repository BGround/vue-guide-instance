<template>
    <Layout>
      <div style="background:#fff">
        <Header class="exclusive-header">
          <Tabs class="margin-left_logo">
            <span class="title" v-for="(tab,index) in tabs"
            :class="{active: index == activeKey}"
            :key="index" @click="tabClick(index)">{{tab.title}}</span>
          </Tabs>
          <div class="exclusive-btn-right">
            <qw-button class="exclusive-btn" @click="goTasteVip">申请体验</qw-button>
            <qw-button class="exclusive-btn" type='primary'>马上开通</qw-button>
          </div>
        </Header>
      </div>

      <Layout >
        <Content class="max-content_width">
            <components :is="activeDoc"></components>
        </Content>
      </Layout>


      <qw-footer></qw-footer>
    </Layout>
</template>
<script>

  import {
      Layout,
      Header,
      Content,
      Tabs,
      ExclusiveBuy
    } from '../../components'
  import  {QwFooter,QwButton} from '../../index'
  import baseURL from '@/assets/js/baseURL_config';
  export default {
    name:'ExclusiveVip',
    components:{
      Layout,
      Header,
      Content,
      Tabs,
      ExclusiveBuy,
      QwFooter,
      QwButton
    },
    data() {
      return {
        activeKey: 0,
        activeDoc: 'ExclusiveBuy',
        tabs: [
          {
            title: '开通尊享版',
          },
          {
            title: '特权详情',
          },
          {
            title: '版本对比',
          },
        ]

      }
    },
    methods: {
      //tab点击
      tabClick(index){
        this.activeKey = index
        if(index !== 0){
          let obj = {
            //特情详情
            1: `${baseURL}/qiweipublicity/companysrv/vip/vip_gold_index.jsp`,
            2: `${baseURL}/qiweipublicity/companysrv/vip/vip_single_buy.jsp?tabCode=3`
          }
          document.location.href= obj[index]
        }
      },
      //跳转到体验VIP
      goTasteVip(){
        window.open(`${baseURL}/open/form/add.jsp?id=49dfc058-7afb-4d55-86e9-f431690e4eec&corp_id=&agentCode=form`,"_blank")
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../css/exclusive.scss';
</style>
