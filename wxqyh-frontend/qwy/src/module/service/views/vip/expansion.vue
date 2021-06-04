<template>
  <Layout>
    <div style="background:#fff">
      <Header class="exclusive-header" title="会员人数扩容"></Header>
    </div>

    <Layout >
      <Content width="1280px" style="margin-top:33px">
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
    ExpansionBuy,
  } from '../../components'
  import  {QwFooter} from '../../index'

  export default {
    name:'ExpansionBuy',
    props:{

    },
    components:{
      Layout,
      Header,
      Content,
      Tabs,
      ExpansionBuy,
      QwFooter,
    },
    data() {
      return {
        activeDoc:'ExpansionBuy'
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../css/exclusive.scss';
</style>
