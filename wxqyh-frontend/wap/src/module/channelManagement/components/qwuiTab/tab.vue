<template>
  <div class="tab"
       :class="{
          'is-active':text == model
        }"
       @click="currentIndex" >
    {{text}}{{num | noNum}}
    <div class="point" v-if="point"></div>
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
      //tab附带值
      value:{
        type:String,
        default:''
      },
      //tab类型
      classification:{
        type:String,
        default:''
      },
      //tab附带数字
      num:{
        type:[String,Number],
        default:''
      },
      //tab右上部点，表示标识
      point:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        model: ''
      }
    },
    methods:{
      currentIndex:function () {
        this.model = this.text;
        for (let item of Object.values(this.$parent.$children)) {
          item.model = this.model
        }
        let tempItem = {
          text: this.text,
          value: this.value
        }
        this.$parent.clickThis(tempItem)
      }
    },
    mounted() {
      //查找是否有默认选中，没有则默认第一个为已选中
      let $parent = this.$parent;
      let temp = {
        text:'',
        value:''
      }, tempIndex = $parent.selected ? parseInt($parent.selected) : 0;
      temp.text = $parent.$children[tempIndex].text;
      temp.value = $parent.$children[tempIndex].value;
      this.model = temp.text;
      if(temp.text == this.text) {
        $parent.length = $parent.$children.length
        this.$nextTick(function () {
          $parent.clickThis(temp)
        })
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
<style src="./tab.scss" lang="scss">
</style>
