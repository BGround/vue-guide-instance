<template>
  <div class="qwui-nav_tabs_box_content">
    <div class="qwui-nav_tabs" :class="[positionStyle]" v-if="activeTab">
      <div class="qwui-nav_tabs_box"
      :class="[{ active: index==i },defaultClass]"
      v-for="(item,i) in tabs" :key="i" @click="navTabsClick(i)">
        {{item.text}}
        <span class="qwui-badge" v-if="useBadge&&item.num">{{item.num | isOver}}</span>
        <div class="qwui-nav_num_text" v-if="numShow">
          {{item.num}}
        </div>
      </div>
    </div>
    <slot name="height"></slot>
    <!--:name="defaultActiveKey"-->
    <div class="qwui-nav_tabs_wrapper" :class="{'active':animated}" :style="styleTranslate">
      <slot :name="defaultActiveKey"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: "NavTabs",
    props:{
      tabs:{
        type:Array,
        required:true,
      },
      defaultActiveKey:{
        type:String,
        required:false,
        default:"",
      },
      animated:{
        type:Boolean,
        default:false,
      },
      activeIndex:{
        type:Number,
        required:false,
        default:0,
      },
      position:{
        type:String,
        required:false,
      },
      numShow:{
        type:Boolean,
        default:false,
      },
      defaultClass:{
        type:String,
        required:false,
        default:"",
      },
      //tab栏是否使用标记显示数字
      useBadge:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        index:this.activeIndex!=undefined? this.activeIndex:0,
      }
    },
    computed:{
      activeTab (){
        this.index = this.activeIndex
        return true
      },
      positionStyle(){
        return this.position
      },
      styleTranslate(){
        if(this.animated){
          return {transform: 'translateX('+-1*this.index*100+'%)'}
        }
      }
    },
    methods: {
      navTabsClick(i){
        this.index=i;
        this.$emit("listenNavTabs",i)
      }
    },
    filters:{
      isOver(num){
        return num > 99 ? '· · ·':num
      }
    }
  }
</script>
<style>
  .qwui-nav_tabs_box_content{
    display: flex;
    flex-direction:column;
    overflow:hidden;
  }
  .qwui-nav_tabs{
    display: flex;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
    margin: auto;
    width: 100%;
    background: #fff;
  }
  .qwui-nav_tabs.top{
    position: fixed;
    left: 0;
    right: 0;
    width: 100%;
  }
  .qwui-nav_tabs.fixedTop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
  .qwui-nav_tabs_box{
    position: relative;
    display: block;
    flex: 1;
    padding: 13px 0 13px;
    margin: 0 15px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
  }
  @media screen and (max-width: 320px) {
    .qwui-nav_tabs_box{
      margin: 0 10px 1px;
    }
  }
  .qwui-nav_tabs_box.active{
    border-bottom: 3px solid rgba(47,125,205,1);
    color:rgba(47,125,205,1);
  }
  .qwui-nav_tabs:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .num_padding{
    padding:8px 0 5px;
  }
  .qwui-nav_num_text{
    font-size: 13px;
    line-height: 13px;
  }
  .qwui-badge{
    display: inline-block;
    position: absolute;
    height: 18px;
    top: 10px;
    margin-left: 2px;
    padding: 0 6px;
    line-height: 18px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    background-color: #FF3333;
    border-radius: 10px;
  }
  .qwui-check_nav .qwui-nav_tabs{
    width:100%;
  }
</style>
