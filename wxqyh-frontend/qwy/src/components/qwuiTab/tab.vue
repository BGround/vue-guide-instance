<template>
  <div class="tab"
       :class="{
          'is-active':text == model,
          'is-flex': flex,
        }"
       :style="{
                  left: tabLeft + 'px',
                }"
       @click="currentIndex" >
    {{text}}{{num | noNum}}
    <slot></slot>
  </div>
</template>
<script type="text/javascript">
  /**
   * tab组件, 一般以组的形式调用
   * @example
   * <qwui-group-tab selected="1" full>
   <qwui-tab text="just" num="1"></qwui-tab>
   <qwui-tab text="like" num="2"></qwui-tab>
   <qwui-tab text="this" num="3"></qwui-tab>
   </qwui-group-tab>
   */
  export default {
    name: 'qwui-tab',
    props:{
      //tab文本内容
      text:{
        type:String,
        default:''
      },
      //tab附带数字
      num:{
        type:[String,Number],
        default:''
      },
      //选人特殊处理
      special:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        model: '',
        tabLeft:0
      }
    },
    computed:{
      flex:function () {
        return this.$parent.flex
      }
    },
    methods:{
      currentIndex:function () {
        this.$emit("click", this.text)
        this.model = this.text;
        for (let item of Object.values(this.$parent.$children)) {
          item.model = this.model
        }
        this.$parent.handleChange(this.text)
      }
    },
    mounted() {
      //查找是否有默认选中，没有则默认第一个为已选中
      let $parent = this.$parent
      if ($parent.selected) {
        this.model = $parent.$children[parseInt($parent.selected)].text
        $parent.handleChange(this.model)
      } else {
        this.model = $parent.$children[0].text
        $parent.handleChange(this.model)
      }
      if(this.special){
        this.tabLeft = 560 - $parent.$el.clientWidth
      }
    },
    filters:{
      noNum(num){
        if(num == undefined || num == null || num == ''){
          return ''
        }
        return '('+num+')'
      }
    }
  }
</script>
<style>
  .tab{
    display: inline-block;
    position: relative;
    padding: 0 12px;
    height: 40px;
    text-align: center;
    font-size: 14px;
    line-height: 40px;
    list-style: none;
    box-sizing: border-box;
    color: #666;
    cursor: pointer;
  }
  .tab.is-active{
    color:#C31725;
  }
  .tab.is-flex{
    width:100%;
  }
</style>
