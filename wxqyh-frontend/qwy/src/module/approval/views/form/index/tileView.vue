<template>
    <div id="tileView">
        <!-- 根目录 -->
        <root-level v-if="!showResult && levelShow == 1"></root-level>
        <!-- 一级分组 -->
        <child-level v-if="!showResult && levelShow == 2"></child-level>
        <!-- 搜索结果展示 -->
        <search-result v-if="showResult" ></search-result>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import noData from '@/components/list/noData'
import rootLevel from './components/rootLevel'
import childLevel from './components/childLevel'
import searchResult from './components/searchResult'
import groupSetting from './groupSetting'

export default {
    name: "tileView",
    components: {
        noData,
        rootLevel,
        childLevel,
        searchResult,
        groupSetting
    },
    computed: {
        ...mapGetters("form/index", [
            'currGroup',
            'listData',
            'isSearch',
            'showResult'
        ]),
        levelShow() { // 是 '全部分组' 还是 '一级分组'
            return this.currGroup.length;
        }
    },
    updated() {
        if(window.frameElement) {
            window.frameElement.height = window.document.body.scrollHeight
        }
    }
};
</script>

<style scoped>
#tileView {
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
    height: 900px;
    overflow: auto;
    padding: 20px 0 10px 0;
}
::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}
::-webkit-scrollbar-thumb {
    background: #ccc;
}
</style>
