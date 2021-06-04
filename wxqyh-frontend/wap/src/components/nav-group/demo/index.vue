<template>
  <section class="qwui-demo">
    <h2 class="qwui-demo__title">基础用法~当前位置：{{active}}</h2>
    <nav-group
      v-model="active"
      @change="navChange"
    >
      <nav-item icon="iconfont icon-renwufenpai-daichuli">待处理</nav-item>
      <nav-btn @click="navBtnClick"></nav-btn>
      <nav-item icon="iconfont icon-shenpiqingshi_wode" @click="navClick">我的</nav-item>
    </nav-group>

    <h2 class="qwui-demo__title">自定义图标</h2>
    <nav-group
      v-model="active2"
      @change="navChange"
    >
      <nav-item>
        <i class="qwui-icon iconfont icon-peixunxuexi_shijian" slot="icon"></i>
        会议
      </nav-item>
      <nav-item icon="iconfont icon-shenpiqingshi_wode">我的</nav-item>
    </nav-group>

    <h2 class="qwui-demo__title">红点、数字</h2>
    <nav-group
      v-model="active"
      @change="navChange"
    >
      <nav-item
        icon="iconfont icon-renwufenpai-daichuli"
        dot
      >待处理</nav-item>
      <nav-item
        info="20"
        icon="iconfont icon-shenpiqingshi_wode"
      >
        我的</nav-item>
    </nav-group>

    <h2 class="qwui-demo__title">router跳转</h2>
    <nav-group
      v-model="active3"
      @change="navChange"
    >
      <nav-item
        icon="iconfont icon-shenpiqingshi-bianji"
        to="/add"
      >新建</nav-item>
      <nav-item
        icon="iconfont icon-shenpiqingshi_wode"
      >
        我负责的
        </nav-item>
      <nav-item
        icon="iconfont icon-shenpiqingshi_wode"
      >
        我相关的
      </nav-item>
      <nav-item
        icon="iconfont icon-shenpiqingshi_wode"
      >
        已关闭
      </nav-item>
    </nav-group>

  </section>
</template>

<script>
  import NavGroup from '../../nav-group';
  import NavItem from '../../nav-item';
  import NavBtn from '../../nav-btn';
  export default {
    data() {
      return {
        active: 1,
        active2: 0,
        active3: 1
      };
    },
    components:{
      NavGroup,
      NavItem,
      NavBtn
    },
    methods:{
      navChange(value){
        console.log(value)
      },
      navClick(ev){
        alert('我的')
      },
      navBtnClick(){
        alert('点击按钮')
      }
    }
  };
</script>
<style lang="scss" scoped>
  .qwui-demo{
    .qwui-demo__title{
      padding: 40px 15px 15px;
      margin: 0;
      font-weight: 400;
      font-size: 14px;
      color: #666;
    }
    .qwui-nav_group_fixed{
      position: relative;
      border-bottom: none;
    }
  }
</style>
