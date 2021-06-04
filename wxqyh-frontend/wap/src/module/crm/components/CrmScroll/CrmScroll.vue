/** 
    @params bottomDistance(可选)：距离底部多少触发上拉加载
    @params loadMore(可选)：上拉加载回调函数
    @example(注意：parent高度一定要固定)
        <parent>
            <crm-scroll @loadMore="loadMore">
                <ul class="data_list">
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                    <li>123</li>
                </ul>
            </crm-scroll>
        </parent>
 */
<template>
    <div 
        class="crm_scroll_wrap" 
        v-scroll="pullUp"
        ref="crmScroll"
    >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'CrmScroll',
    props: {
        // 距离底部多少触发上拉加载
        bottomDistance: {
            type: Number,
            default: 10
        }
    },
    data () {
        return {

        }
    },
    methods: {
        // 上拉加载
        pullUp (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight >= scrollHeight - this.bottomDistance){
                this.$emit('loadMore');
            }
        },

        // 回到顶部
        toTop () {
            this.$refs.crmScroll.scrollTop = 0;
        }
    }
}
</script>
<style lang="scss" scoped>
@import './CrmScroll.scss';
</style>


