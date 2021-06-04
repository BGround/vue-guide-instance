/** 
  * @param direction(默认:'horizontal')：步骤条方向 水平:horizontal 垂直:vertical
  * @param active(默认:0)：设置当前激活步骤
  * @param isCenter(默认:false)：是否居中
  * @param dash(默认:false)：连接线是否为虚线 虚线:true 直线:false
  * @exmple 
  *     <parent>
  *          <qwui-steps :active="active" direction="vertical" :isCenter="defaultStatus" :isDash="defaultStatus">
  *     </parent> 
  */
<template>
    <div 
        class="qwui-steps"
        :class="{vertical: direction === 'vertical'}"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'qwui-steps',
    data() {
        return {
            // 存放子步骤
            steps: [], 
        }
    },
    props: {
        // 步骤条方向 水平:horizontal 垂直:vertical
        direction: {
            type: String,
            default: 'horizontal'
        },

        // 设置当前激活步骤
        active: {
            type: Number,
            default: 0
        },

        // 是否居中
        isCenter: {
            type: Boolean,
            default: false
        },

        // 连接线是否为虚线
        isDash: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        // 当前步骤的index
        steps (newVal, oldVal) {
            newVal.map((item, idx) => {
                item.index = idx;
            });
        }
    }
}
</script>
<style lang="scss">
@import './qwuiSteps.scss';
</style>


