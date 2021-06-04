/**
  * @param defaultStatus(默认:false)：开关默认状态
  * @param changeSwitch：点击开关的回调函数
  * @exmple
  *     <parent>
  *         <qwui-switch :defaultStatus="defaultStatus" @change="change"></qwui-switch>
  *     </parent>
  */
<template>
    <div :class="{'inline_box':inline}">
        <div
            class="switch_wrap"
            :class="['on']"
            @click="changeSwitch"
         v-if="disabled"></div>
      <div
        class="switch_wrap"
        :class="[isOn? 'on' : 'off']"
        @click="changeSwitch"
        v-else></div>
    </div>
</template>
<script>
export default {
    name: 'qwui-switch',
    data(){
        return {

        }
    },
    props: {
        // 开关默认状态
        defaultStatus: {
            type: Boolean,
            default: false
        },
        //使用inline_block布局
        inline:{
            type:Boolean,
            default:true,
        },
      disabled:{
        type:Boolean,
        default:false,
      }
    },
    methods: {
        // 点击开关
        changeSwitch(){
            this.$emit('change', !this.isOn);
        }
    },
    computed:{
      isOn(){
        return this.defaultStatus;
      }
    }
}
</script>
<style lang="scss" scoped>
@import './qwuiSwitch.scss';
</style>



