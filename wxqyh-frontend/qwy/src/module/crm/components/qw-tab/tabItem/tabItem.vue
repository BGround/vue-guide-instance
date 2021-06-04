<!-- 
  参数：
  @param label： tab的标签名
  @param name： tab的name值，必须唯一

  用法详见 ./../tab/tab.vue
-->
<template>
    <div class="qwui-tab--item" v-show="nowViewingTabName === name">            
        <div class="qwui-tab-item--content" >
            <slot></slot>
        </div>
    </div>    
</template>

<script>
export default {
    props: {        
        label: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: ""
        },
        checked: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        checkboxIndex: {
            type: Number,
            default: 0            
        }
    },
    computed: {
        index(){            
            return this.$parent._data.tabIndex
        },
        nowViewingTabName(){
            return this.$parent._data.tabName
        },        
    },  
    methods: {
        setChecked(value){
            this.$emit('update:checked', value)
        }
    },
    watch: {
        checked(newVal){
            console.log(newVal)            
            this.$parent.initCheckbox();
        }
    }
}
</script>

<style lang="scss" src="./tabItem.scss"></style>
