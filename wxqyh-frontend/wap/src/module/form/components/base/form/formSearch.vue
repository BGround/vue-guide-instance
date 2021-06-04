<template>
    <div class="form-search">
        <div class="header">
            <div class="back" @click="back">
                <i class="icon"></i>
            </div>
            <search-bar class="search-bar"
                :searchinput="searchBar"
                :keyWord="searchBar.keyWord"
                placeholder="搜索"
                @listenToSearchBox="showMsgFromSearchBar">
            </search-bar>
        </div>
        <div class="nav-bar" v-show="showNav">
            <span class="top" @click="back">应用 > </span>
            <span class="current">{{currApp.typeName}}</span>
        </div>
        <div class="list">
            <app-list
                v-show="showAppList"
                :appList="showSearchList ? searchAppList : appList"
                :checkedList="checkedList"
                @showTag="showTag"></app-list>
            <tag-list
                v-if="showTagList"
                :tagList="showSearchList ? searchTagList : tagList"
                :formList="showSearchList ? searchFormList : formList"
                :checkedList="checkedList"></tag-list>
        </div>
        <div class="footer">
            <div class="selected-name">已选择：
                <span class="result">{{selectedName}}</span></div>
            <div class="confirm" @click="confirm">确定</div>
        </div>
    </div>
</template>

<script>
import { getFormType, getFormTemplate } from "../../../api/list"
import SearchBar from '../newBase/SearchBox'
import LoadMore from '../load_more.vue'
import AppList from './appList'
import TagList from './tagList'

export default {
    name: 'formSearch',
    components: {
        SearchBar,
        LoadMore,
        AppList,
        TagList
    },
    props: {
        cacheCheckedList: Object,
        paramSearchType: Number|String
    },
    data() {
        return {
            searchBar: {
                show: true,
                keyWord: ''
            },
            searchAppList: [],
            searchTagList: [],
            searchFormList: [],
            appList: [],
            tagList: [],
            formList: [],
            showAppList: false,
            showTagList: false,
            showSearchList: false,
            showNav: false,
            currApp: {},
            currIndex: 0,
            checkedList: JSON.parse(JSON.stringify(this.cacheCheckedList)),
            selectedName: ''
        }
    },
    created() {
        this.initAppList()
    },
    methods: {
        async initAppList() {
            let _this = this,
                res = await getFormType({paramSearchType: this.paramSearchType})
            this.appList = res.pageData.map(item => {
                item.selected = _this.checkedList.appList[item.typeId]
                return item
            })
            this.showAppList = true
        },
        async initTagList() {
            let res = await getFormTemplate({ paramSearchType: this.paramSearchType, typeIds: [this.currApp.typeId] })
            this.setTagList(res.tagData, res.pageData)
        },
        setTagList(tagList, formList) {
            let _this = this
            tagList && tagList.forEach(tag => {
                tag.selected = !!_this.checkedList.tagList[tag.id]
                tag.formList = []
                formList = formList.filter(form => {
                    form.selected = !!_this.checkedList.formList[form.formId]
                    if(form.typeId == tag.id) {
                        tag.formList.push(form)
                        return false
                    }
                    return true
                })
            })
            formList = formList.map(item => {
                item.selected = !!_this.checkedList.formList[item.formId]
                return item
            })
            this.tagList = tagList || []
            this.formList = formList || []
        },
        showMsgFromSearchBar(keyWord) {
            this.showSearchList = true
            if(this.showNav) {
                this.searchTagList = this.tagList.filter(item => item.typeName.indexOf(keyWord) != -1 && item)
                this.searchFormList = this.formList.filter(item => item.formName.indexOf(keyWord) != -1 && item)
            } else {
                this.searchAppList = this.appList.filter(item => item.typeName.indexOf(keyWord) != -1 && item)
            }
        },
        showTag({ app, index }) {
            this.currApp = app
            this.currIndex = index
            this.formList = []
            this.tagList = []
            this.showNav = true
            this.showAppList = false
            this.showSearchList = false
            this.showTagList = true
            this.initTagList()
        },
        back() {
            if(this.showTagList) {
                this.$set(this.searchBar, 'keyWord', '')
                this.showSearchList = false
                this.showNav = false
                this.showAppList = true
                this.showTagList = false
            } else {
                this.$emit('close')
            }
        },
        confirm() {
            let nameStr = ''
            for (let value of Object.values(this.checkedList)) {
                for (let name of Object.values(value)) {
                    nameStr += name + '、'
                }
            }
            this.$emit('confirm', {
                checkedList: this.checkedList,
                nameStr: nameStr.replace(/、$/gi, '')
            })
        }
    },
    watch: {
        checkedList: {
            handler() {
                let nameStr = '',
                    appLength = Object.getOwnPropertyNames(this.checkedList.appList).length - 1,
                    tagLength = Object.getOwnPropertyNames(this.checkedList.tagList).length - 1,
                    formLength = Object.getOwnPropertyNames(this.checkedList.formList).length - 1
                if(appLength + tagLength + formLength > 1) {
                    appLength && (nameStr += appLength + ' 应用 ')
                    tagLength && (nameStr += tagLength + ' 标签 ')
                    formLength && (nameStr += formLength + ' 表单 ')
                } else {
                    for (let value of Object.values(this.checkedList)) {
                        for (let name of Object.values(value)) {
                            nameStr += name + '、'
                        }
                    }
                }
                this.selectedName = nameStr.replace(/、$/gi, '')
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: cover;
}
.form-search {
    display: flex;
    position: fixed;
    top: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    flex-direction: column;
    background-color: #fff;
    @media screen and (min-width: 1024px) {
        width: 740px;
        margin: auto;
    }
    .header {
        display: flex;
        height: 52px;
        flex: none;
        .back {
            position: relative;
            width: 20px;
            margin-left: 10px;
            cursor: pointer;
            .icon {
                position: absolute;
                display: inline-block;
                top: 50%;
                left: 50%;
                width: 11px;
                height: 18px;
                transform: translate(-50%, -50%);
                @include background('icon_arrow_ccc.png');
            }
        }
        .search-bar {
            flex: auto;
        }
    }
    .nav-bar {
        padding-left: 15px;
        line-height: 36px;
        border-bottom: 1px solid #F7F8FA;
        .top {
            display: inline-block;
            font-size: 13px;
            color: #B2B9C8;
        }
        .current {
            display: inline-block;
            font-size: 13px;
            color: #5585F0;
        }
    }
    .list {
        padding: 0 15px 15px 15px;
        overflow: auto;
        font-size: 13px;
        flex: auto;
    }
    .footer {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        min-height: 50px;
        line-height: 50px;
        font-size: 14px;
        padding: 0 15px;
        align-items: center;
        border-top: 1px solid #F5F5F5;
        background-color: #fff;
        @media screen and (min-width: 1024px) {
            width: 740px;
        }
        .selected-name {
            flex: auto;
            font-size: 15px;
            color: #7A7C80;
            .result {
                color: #5585F0;
            }
        }
        .confirm {
            float: right;
            width: 60px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background-color: #5585F0;
            color: #FFF;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>
