/** 
  * @param: to(默认:'')：路由链接地址
  * @param: replace(默认:false)：路由跳转时，使用replace
  * @example: 
  *     <qwui-breadcrumb>
  *         <qwui-breadcrumb-item :to="{path:'/'}">首页</qwui-breadcrumb-item>
  *         <qwui-breadcrumb-item><a href="http://www.baidu.com">活动列表</a></qwui-breadcrumb-item>
  *         <qwui-breadcrumb-item to="/">活动详情</qwui-breadcrumb-item>
  *      </qwui-breadcrumb>
  */
<template>
    <span class="qwui-breadcrumb_item">
        <span
        class="qwui-breadcrumb_item_inner"
        :class="[to? 'link_text' : 'c999']"
        @click="goLink">
            <slot></slot>
        </span>

        <span
        class="qwui-breadcrumb_separator">
            {{separator}}
        </span>
    </span>
</template>
<script>
export default {
    name: 'qwui-breadcrumb-item',
    data() {
        return {
            // 分隔线
            separator: this.$parent.separator
        }
    },
    props: {
        // 路由链接地址
        to: {
            type: [Object,String],
            default: ''
        },
        // 路由跳转时，使用replace 
        replace: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        // 跳转路由
        goLink(){
            let to = this.to;
            if(this.to){
                this.replace ? this.$router.replace(to) : this.$router.push(to);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import './qwuiBreadcrumb.scss';
</style>