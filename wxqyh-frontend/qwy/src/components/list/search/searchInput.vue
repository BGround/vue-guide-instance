<!--
    搜索框组件
    @param inputWidth:搜索框长度，默认170
    @param inputTips:搜索框placeholder,默认为空
    @param searchData(必传):搜索的回调函数
    @param inputChange(必传):搜索框输入内容改变回调函数

    用法：
    <parent>
        <search-input inputWidth="xxx" inputTips="xxx" @searchData="xxx" @inputChange="xxx"></search-input>
    </parent>
 -->
<template>
    <div class="searchInput_wrap">
        <input type="text" class="search-input" :placeholder="inputTips" v-model="searchTitle" @keyup.enter="searchForm" 
        :style="{width:inputWidth + 'px'}" @input="inputChange">
        <div class="search-btn" @click="searchForm"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            searchTitle:''
        }
    },
    props: {
        inputWidth: {
            default: 170
        },
        inputTips:{
            default:''
        }
    },
    methods: {
        // 确认搜索
        searchForm() {
            this.$emit('searchData');
        },

        // 搜索框文字改变
        inputChange() {
            this.$emit('inputChange',this.searchTitle);
        }
    }
}
</script>
<style scoped>
.searchInput_wrap{
    display: flex;
}
.search-input {
    width: 170px;
    height: 32px;
    line-height: 32px;
    border: 1px solid #ccc;
    padding: 0 8px;
    box-sizing: border-box;
}
.search-btn {
    width: 30px;
    height: 32px;
    border: 1px solid #ccc;
    border-radius: 0;
    border-left: 0;
    background: url(../../../assets/images/search_icon.png) no-repeat center;
    cursor: pointer;
    box-sizing: border-box;
}
</style>


