/** 
  * @param val(默认:'')：选择项的值
  * @exmple 
  *     <qwui-dropdown>
  *         <qwui-dropdown-item val="a">从模板新建</qwui-dropdown-item> 
  *         <qwui-dropdown-item val="nana">
  *           <div>12234</div>
  *         </qwui-dropdown-item>
  *     </qwui-dropdown> 
  */
<template>
    <div class="qwui-dropdown_select_item" @click="handleClick">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'qwuiDropdownItem',
    props:{
        // 选择项的值
        val: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    },
    methods: {
        // 点击选择项触发的函数
        handleClick () {
            this.$parent.handleItemClick(this.val);
        }
    }
}
</script>
<style lang="scss">

</style>


