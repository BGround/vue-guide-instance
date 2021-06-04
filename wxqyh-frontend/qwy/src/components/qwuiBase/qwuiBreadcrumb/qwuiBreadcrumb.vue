<!-- 
   @param: separator(默认:'/')：分隔线
   @param: isBack(默认:true)：是否显示后退按钮
   @example: 
       <qwui-breadcrumb @handleClick="normalClick" :isBack="isFocus">
            <template slot="btn">
              <qwui-button @click="normalClick">返回</qwui-button>
            </template>
            <template slot="item">
              <qwui-breadcrumb-item :to="{path:'/'}">首页</qwui-breadcrumb-item>
              <qwui-breadcrumb-item><a href="http://www.baidu.com">活动列表</a></qwui-breadcrumb-item>
              <qwui-breadcrumb-item>活动详情</qwui-breadcrumb-item>
            </template>  
          </qwui-breadcrumb>
-->
<template>
    <div>
        <div class="qwui-breadcrumb_back" v-show="isBack">
            <slot name="btn"></slot>
        </div>
        <slot name="item"></slot>
    </div>
</template>
<script>
export default {
    name: 'qwui-breadcrumb',
    data() {
        return {

        }
    },
    props: {
        // 分隔线
        separator: {
            type: String,
            default: '/'
        },

        // 是否显示后退按钮
        isBack: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="scss" scoped>
@import './qwuiBreadcrumb.scss';
</style>


