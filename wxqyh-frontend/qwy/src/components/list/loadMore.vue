<template>
    <div>
        <div class="qwui-showMoreList"
            :class="{ 'pointer': !this.busy }">
            <p @click="loadMore" >
                <i class="qwui-icon_loadingMore"
                    v-show="loading"></i>
                {{loading ? '努力加载中...' : tips}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'QwLoadMore',
    props: {
        busy: Boolean,
        loading: Boolean,
        noMoreTips: {
            type: String,
            default: '已没有更多'
        }
    },
    computed: {
        tips() {
            return this.busy ? this.noMoreTips : '点击或向上滑动加载更多';
        }
    },
    methods: {
        loadMore() {
            if(!this.busy) {
                this.$emit('loadMore')
            }
        }
    }
}
</script>

<style>
.qwui-showMoreList {
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
}
.qwui-showMoreList p {
    position: relative;
}
.qwui-icon_loadingMore {
    display: inline-block;
    position: relative;
    top: 2px;
    left: -7px;
    width: 14px;
    height: 14px;
    background: url(../../assets/images/loading.png) no-repeat;
    background-size: cover;
    animation: rotate 1s infinite;
}
@keyframes rotate {
    from {
        transform: rotate(0)
    }
    to {
        transform: rotate(360deg);
    }
}
.pointer {
    cursor: pointer;
}
</style>
