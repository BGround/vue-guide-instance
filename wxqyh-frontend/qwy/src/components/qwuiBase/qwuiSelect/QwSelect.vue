/**
  * @param borderType(默认:round)：圆角round 直角rightAngle
  * @param dataList(默认[])：选择框内容
  * @param selectItem： 选择内容后的回调函数
  * @param v-model: 双向绑定当前选中项的下拉选项值（value）
  * @exmple
  *     <parent>
  *         <qwui-select @selectItem="selectItem" :dataList="optionData" v-model="selectKey" ></qwui-select>
  *     </parent>
  */
<template>
    <div class="box_wrap" v-clickOut="hideSelect">
        <div
            class="qwui-select_wrap"
            :class="[
                borderType
            ]"
            @click="handleSelect"
        >
            <input
                class="text_wrap"
                :title="selectVal.name"
                :value="selectVal.name"
                placeholder="请选择"
                readonly
            />
            <ul class="select_list" v-show="showList">
                <li class="select_item"
                    :class="{active: idx === selectVal.idx}"
                    v-for="(item,idx) in dataList"
                    :key="idx"
                    @click.stop="selectItem(item.optionName, item.val, idx)"
                    :title="item.optionName"
                >{{item.optionName}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'qwui-select',
    data() {
        return {
            // 是否显示选择列表
            showList: false,
            findIdxByKeyCache: {},
            findOptionNameByKeyCache: {}
        }
    },
    mounted(){
      if(this.selectKey){
        this.setValue(this.selectKey);
      }
    },
    watch: {
        selectKey(newVal,oldVal){
            this.setValue(newVal);
        }
    },
    model: {
        prop: 'selectKey',
        event: 'finishSelect'
    },
    props: {
        // 当前选中的option
        selectVal:{
            type:Object,
            default(){
                return {
                    name: '',
                    idx: 0
                }
            }
        },

        // 边框类型: round圆角
        borderType: {
            type: String,
            default: 'round'
        },

        // 选择内容数据列表
        dataList: {
            type: [Array,Object],
            default(){
                return []
            }
        },

        selectKey: {
            type: [String,Number],
            default: ""
        }
    },
    methods: {
        // 显示或隐藏选择列表
        handleSelect(){
            this.showList = !this.showList;
        },

        // 选择当前内容
        selectItem(optionName, val, idx){
            this.selectVal.name = optionName;
            this.selectVal.idx = idx;
            this.hideSelect();
            this.$emit('finishSelect',val);
            this.$emit('selectItem', optionName, val);
        },

        // 隐藏选项列表
        hideSelect(){
            this.showList = false;
        },

        // 设置select的值
        setValue(key){
            this.selectVal.name = this.findOptionNameByKey(key);
            this.selectVal.idx = this.findIdxByKey(key);
        },

        findIdxByKey(key){
            let result =  this.findIdxByKeyCache;
            if( Object.keys(result).length  == 0 ){
                this.dataList.map((item,index) => {
                    result[item.val] = index;
                })
                this.findIdxByKeyCache = result;
            }
            return result[key];
        },

        findOptionNameByKey(key){
            let result = this.findOptionNameByKeyCache;
            if( Object.keys(result).length  == 0 ){
                this.dataList.map((item,index) => {
                    result[item.val] = item.optionName;
                    this.findOptionNameByKeyCache = result;
                })
            }
            return result[key];
        }
    },
    directives: {
        //  点击空白地方隐藏选项列表
        clickOut: {
            bind(el, binding){
                el.handler = function(e){
                    // 如果是点击当前节点，则不触发选择列表消失
                    if (el.contains(e.target)) return false;
                    if (binding.expression) {
                        binding.value();
                    }
                }
                document.addEventListener('click', el.handler);
            },
            unbind: function(el) {
                document.removeEventListener('click', el.handler)
            }
        }
    },
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/baseUI.scss';

  .box_wrap{
    .qwui-select_wrap{
      position: relative;
      padding: 0 30px 0 15px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      border: 1px solid $border-color-base;
      box-sizing: border-box;
      cursor: pointer;
      &:after{
        content: "";
        position: absolute;
        margin-top: -3px;
        right: 12px;
        top: 50%;
        border-color: transparent transparent #999;
        border-style: solid;
        border-width: 5px;
        transform: rotate(180deg);
      }
      .text_wrap{
        padding: 0;
        width: 100%;
        height: 100%;
        vertical-align: text-bottom;
        border: 0;
        box-sizing: border-box;
        cursor: pointer;
        @include ellipsis;
      }
    }
  }

  .round{
    border-radius: 3px;
  }

  .rightAngle{
    border-radius: 0;
  }

  .select_list{
    position: absolute;
    left: -1px;
    top: 35px;
    z-index: 2;
    width:100%;
    max-height: 350px;
    border: 1px solid $border-color-base;
    border-radius: 3px;
    box-shadow: 0px 1px 5px 1px #ccc;
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
    .select_item{
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      @include ellipsis;
      &:hover{
        background: #F4F5F9;
      }
    }
    .active, .active:hover{
      color: #fff;
      background: #A7A7A7;
    }
  }
</style>



