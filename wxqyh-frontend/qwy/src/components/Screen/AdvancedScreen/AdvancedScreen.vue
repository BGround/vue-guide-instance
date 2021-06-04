<template>
<div class="search-wrap" @keyup.enter="searchForm">
    <advancedScreenItem :screenItemList="screenItemList" :init="init" :search="search" @searchResult="searchResult"></advancedScreenItem>
    <div class="search-footer">
        <input class="search-btn search-btn-default" type="button" value="清空" @click="resetForm">
        <input class="search-btn search-btn-confirm" type="button" value="查询" @click="searchForm">
    </div>
</div>
</template>

<script>
import advancedScreenItem from './AdvancedScreenItem.vue';

export default {
    name: 'advancedScreen',
    props: {
        screenItemList: {
            type: Array,
            default: []
        },
    },
    data() {
        return {
            init: false, //初始化高级筛选数据
            search: false, //查询高级筛选数据
        }
    },
    methods: {
        resetForm() { // 重置高级搜索条件
            this.$set(this, 'init', !this.init);
        },
        searchForm() { // 高级查询
            this.$set(this, 'search', !this.search);
        },
        searchResult(data) { //点击查询返回的数据
            console.log(data);
            this.$emit('searchResult', data);
        }
    },
    components: {
        advancedScreenItem
    }
}
</script>

<style lang="scss" scoped>
.search-wrap {
    position: relative;
    border: 1px #ccc solid;
    background-color: #fff;

    .search-footer {
        margin-top: 10px;
        padding: 5px 20px;
        text-align: right;
        background-color: #f5f5f5;

        .search-btn {
            display: inline-block;
            padding: 0 16px;
            height: 26px;
            line-height: 26px;
            font-size: 14px;
            border-radius: 2px;
            box-sizing: border-box;

            &.search-btn-default {
                color: #333;
                border: 1px #ccc solid;
                margin-right: 16px;
                background-color: #fff;

                &:hover {
                    background-color: #f7f7f7;
                }
            }

            &.search-btn-confirm {
                color: #fff;
                border: 1px #f87b00 solid;
                background-color: #C31725;

                &:hover {
                    background-color: #ffa500;
                }
            }
        }
    }
}
</style>
