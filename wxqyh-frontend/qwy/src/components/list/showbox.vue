<!--
    消息盒子居中显示组件
    @param boxWidth:box宽度
    @param boxHeight:box高度
    @param closeBox(必传):关闭盒子的回调函数
 -->
<template>
    <div class="showBox_wrap">
        <div class="showBox_mask">
            <div class="showBox" :style="{width:boxWidth + 'px',height:boxHeight + 'px'}">
                <div class="showBox_header">
                    <span class="close" @click="closeBox">×</span>
                </div>
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    props: {
        boxWidth:{
            default:360
        },
        boxHeight:{
            default:360
        }
    },
    methods: {
        // 关闭盒子
        closeBox(){
            this.$emit('closeBox');
        }
    }
}
</script>
<style scoped>
.showBox_wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.showBox_mask{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
}
.showBox{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #fff;
    border-radius: 4px;
}
.showBox_header{
    height: 45px;
}
.showBox_header .close{
    float: right;
    display: block;
    padding: 12px 16px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    font-style: normal;
    font-size: 30px;
    color: #ccc;
    cursor: pointer;
}
</style>
 
 
 