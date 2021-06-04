/** 
  * @param itemClick(返回参数:val)：点击选择项的回调函数
  * @exmple 
  *     <parent>
  *         <qwui-dropdown @itemClick="change"></qwui-dropdown> 
  *     </parent>
  */
<template>
    <div class="qwui-dropdown" v-clickOut="hideSelect" @click="toggleSelect">
        <div class="qwui-dropdown_left">+新增表单</div>
        <div class="qwui-dropdown_right"></div>
        <div class="qwui-dropdown_select_list" v-if="showList">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'qwuiDropdown',
    data () {
        return {
            // 是否显示选择列表
            showList: false
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
    methods: {
        // 显示或隐藏选择列表
        toggleSelect(){
            this.showList = !this.showList;
        },

        // 点击子选项
        handleItemClick (val) {
            this.$emit('itemClick',val);
        },

        // 隐藏选项列表
        hideSelect(){
            this.showList = false;
        }
    }
}
</script>
<style lang="scss">
@import './QwuiDropdown.scss';
</style>


