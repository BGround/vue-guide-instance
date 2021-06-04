<template>
  <div class="tab_group"
      :class="{'flex_item': flex}">
    <slot></slot>
    <div class="bottom_bar"
         :style="{
                  left: barLeft + 'px',
                  width: barWidth + 'px'
                }">
      <span class="bottom_bar_span"
            :class="{
                'full':full
              }"></span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'qwui-group-tab',
    props:{
      //默认选中第几个
      selected:{
        type:[String,Number],
        default:0
      },
      //底部线是否100%填充
      full:{
        type:Boolean,
        default:false
      },
      //是否flex布局
      flex:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        index: 0,
        length: 0,
        barLeft:0, //bar左部距离
        barWidth:0,
      }
    },
    methods:{
      handleChange(val) {
        var self = this, flag = false;
        self.barLeft = 0;
        self.length = Object.values(this.$children).length
        Object.values(this.$children).forEach(function (e,index) {
          if(e.text == val){ //改变底部样式
            if(e.$el.style.left != '0px'){
              console.log(1)
              self.barLeft += parseInt(e.$el.style.left.replace('px',''))
            }
            self.barWidth = e.$el.clientWidth;
            self.index = index;
            flag = true
          } else if(!flag){
            self.barLeft += e.$el.clientWidth
          }
        })
      }
    }
  }
</script>
<style>
  .tab_group{
    display: inline-block;
    position:relative;
  }
  .tab_group.flex_item{
     display: flex;
     width: 100%;
   }
  .bottom_bar{
    position: absolute;
    height: 2px;
    bottom: 0;
    transition: right 0.3s cubic-bezier(0.35, 0, 0.25, 1) 0.09s, left 0.3s cubic-bezier(0.35, 0, 0.25, 1);
  }
  .bottom_bar_span {
    display: block;
    width: 70%;
    height: 100%;
    background-color: #C31725;
    margin: auto;
    -webkit-transition: width 0.3s cubic-bezier(0.35, 0, 0.25, 1);
    transition: width 0.3s cubic-bezier(0.35, 0, 0.25, 1);
  }
  .bottom_bar_span.full{
    width:100% !important;
  }
</style>
