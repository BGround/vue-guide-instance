<template>
  <div class="qwui-tabs">
    <div class="qwui-tab_group">
      <div class="qwui-tab"
           :ref="'tab'+index"
           v-perm="item.perm"
           :class="{active:index==selectIndex}"
           v-for="(item,index) in tabList"
           :key="index"
            @click="selectTab(index)">
        {{item.text}}
      </div>
    </div>
    <div class="qwui-bottom_bar" ref="bar">
      <span class="qwui-bottom_bar_span"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      tabList:{
        type:Array
      },
      index:{
        type:Number,
        default:0,
      }
    },
    data(){
      return{
        selectIndex:0,
      }
    },
    methods:{
      selectTab(index){
        this.$refs.bar.style.transform = 'translateX('+this.$refs['tab'+index][0].offsetLeft+'px)';
        this.$refs.bar.style.width = this.$refs['tab'+index][0].offsetWidth+'px';
        this.selectIndex = index;
        this.$emit('selectIndex',index);
      }
    },
    mounted(){
      this.selectIndex = this.index;
      this.$refs.bar.style.transform = 'translateX('+this.$refs['tab'+this.selectIndex][0].offsetLeft+'px)';
      this.$refs.bar.style.width = this.$refs['tab'+this.selectIndex][0].offsetWidth+'px';
    },
    watch:{
      'index':function(newValue){
        this.selectIndex = newValue;
        this.$refs.bar.style.transform = 'translateX('+this.$refs['tab'+this.selectIndex][0].offsetLeft+'px)';
        this.$refs.bar.style.width = this.$refs['tab'+this.selectIndex][0].offsetWidth+'px';
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-tabs{
    position: relative;
    border-bottom: 1px solid #cccccc;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    min-width:960px;
    .qwui-tab_group{
      position: relative;
      display: flex;
      justify-content: center;
      .qwui-tab{
        display: inline-block;
        position: relative;
        padding: 0 15px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        list-style: none;
        box-sizing: border-box;
        color: #333;
        cursor: pointer;
        margin: 0 5px;
        &.active{
          color:#C31725;
        }
      }
    }
    .qwui-bottom_bar{
      position: absolute;
      height: 3px;
      bottom: 0;
      transition: transform .3s cubic-bezier(.645,.045,.355,1);
      .qwui-bottom_bar_span{
        display: block;
        width: 100%;
        height: 100%;
        background-color: #C31725;
        margin: auto;
      }
    }
  }
</style>
