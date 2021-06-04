<template>
    <div class="left_side">
      <ul class="side_menun" v-show="dataBase.showSidebar">
        <li v-for="(item,index) in sidebarList"
            :key="index"
            v-perm="item.menuPermission"
            :class="{active:item.isActive,line:item.isShowLine}"
            @click="goDetail(item)"
            v-if="item.show">{{item.title | beyondSubstr}}</li>
      </ul>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    props:{
      sidebarList:{
        type:Array,
      },
    },
    data(){
      return{
        dataBase:dataBase
      }
    },
    computed:{
      ...mapGetters('header',[
        'trustApp',
        'permission'
      ]),
    },
    filters:{
      //后台左侧应用入口文字，超出6个中文且前三个文字为“企微云”时，自动截取掉（不显示）。
      beyondSubstr(agentName){
        if(agentName.length > 6 && agentName.substr(0,3) == '企微云'){
          agentName = agentName.substr(3);
        }
        return agentName;
      }
    },
    methods:{
      // 跳转页面
      goDetail(item){
        this.$emit('goDetail',item);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .left_side{
    padding: 30px 0 40px;
    width: 200px;
    min-height: 679px;
    border-right: 1px solid #d9dadc;
    background: #f6f6f6;
    .side_menun li{
      height: 34px;
      line-height: 34px;
      color: #676666;
      text-indent: 22px;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      box-sizing: border-box;
      cursor: pointer;
      background: url(~assets/images/arrow1.png) no-repeat 90% center;
      &:hover{
        color: #676666;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        background: #fff;
      }
      &.active,&.active:hover{
        color: #fff;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        background: url(~assets/images/arrow2.png) no-repeat 90% center #C31725;
      }
      &.line{
        position: relative;
        margin-top: 20px;
        &:before{
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          background: #ddd;
          height: 1px;
        }
      }
    }
  }
</style>
