<template>
    <div class="flow-board">
        <div class="header">
            <div class="title">
                <i class="icon"></i>
                流程看板
            </div>
            <div class="tab" @mouseover="showTabList = true" @mouseout="showTabList = false">
                看板视图
                <i class="icon" :class="showTabList && 'active'"></i>
                <div class="tabList" v-show="showTabList">
                    <div class="item active">看板视图</div>
                    <router-link class="item"
                        tag="div"
                        :to="{ name: 'detailData', query: { id: versionId, isTask: isTask } }">列表视图</router-link>
                </div>
            </div>
            <div class="search"
                :class="searchShow && 'active'"
                @click="showSearch">
                <i class="icon"></i>
            </div>
            <div class="setting"
                :class="settingShow && 'active'"
                @click="showSetting">
                <i class="icon"></i>
            </div>
        </div>
        <div class="container">
            <div class="form-title clearfix">
                {{formName}}
                <!-- <div class="level-tip">
                    需求级别：
                    <div class="level high"></div> 高
                    <div class="level middle"></div> 中
                    <div class="level low"></div> 低
                </div> -->
            </div>
            <div class="board-list" v-if="showBoardList">
                <node-item
                    v-for="node in nodeList"
                    :key="node.nodeId"
                    :nodeItem="node"
                    :versionId="versionId"
                    :searchValue="searchValue"
                    :isTask="isTask"
                    v-show="node.isShow"
                    @showDetail="showDetail"></node-item>
            </div>
            <div class="pop-frame" v-show="showFrame">
                <div class="mask" @click="closePopFrame" ref="maskLayer"></div>
                <transition name="slide">
                    <view-setting
                        v-if="settingShow"
                        :list="nodeList"
                        title="调整排序（拖动选项排序）"
                        nameKey="nodeName"
                        showKey="isShow"
                        @confirm="recombineList"
                        @cancel="closePopFrame">
                    </view-setting>
                </transition>
                <transition name="slide">
                    <search-condition
                        class="search-condition"
                        v-show="conditionShow"
                        :list="searchSetting"
                        title="设置查询条件"
                        nameKey="label"
                        showKey="show"
                        @confirm="setCondition"
                        @cancel="conditionShow = false">
                    </search-condition>
                </transition>
                <transition name="slide">
                    <iframe
                        ref="iframe"
                        v-show="detailShow"
                        class="form-detail"
                        :src="iframeUrl"
                        frameborder="0"></iframe>
                </transition>
                <advanced-search
                    v-show="searchShow"
                    :setting="searchSetting"
                    :cache-search-value="cacheSearchValue"
                    @close="searchClose"
                    @search="search">
                    <div slot="header"
                        class="condition" @click="conditionShow = true">
                        筛选查询
                        <i class="icon"></i>
                    </div>
                </advanced-search>
            </div>
        </div>
    </div>
</template>

<script>
import { getFlowBoardList, saveNodeStatus, showFlowBoard } from '../../../../api/list'
import sortableList from './sortableList'
import nodeItem from './nodeItem'
import advancedSearch from '@/components/base/AdvancedSearch/index'
import { mixinAdvancedSearch } from '../advancedSearch'

export default {
    mixins: [mixinAdvancedSearch],
    name: 'flowBoard',
    components: {
        nodeItem,
        advancedSearch,
        viewSetting: sortableList,
        searchCondition: sortableList
    },
    data() {
        return {
            versionId: this.$route.query.id,
            isTask: this.$route.query.isTask,
            nodeList: [],
            formName: '',
            showTabList: false,
            showFrame: false,
            showMask: false,
            showBoardList: true,
            settingShow: false,
            detailShow: false,
            searchShow: false,
            conditionShow: false,
            searchValue: {},
            cacheSearchValue: {},
            iframeUrl: '',
            searchSettingArr: [[0, 2, 5, 6, 7], [0, 2, 4, 5, 6, 7], [0, 2, 5, 6, 7, 8], [0, 7]]
        }
    },
    created() {
        this.needShowFlowBoard()
        document.body.classList.add("flow-board-style")
        this.initList()
    },
	methods: {
        async needShowFlowBoard() {
            let res = await showFlowBoard(),
                hasPermission = false;
            if(!_.isMobileApp() && res.result) { // 微信PC或者企业微信PC才可以进入
                if(this.isTask == '2' && this.isFreeFlow != '1') { // 审批单自由流程和分支流程才可以进入
                    hasPermission = true
                }
                if(this.isTask == '3' && this.isFreeFlow != '1' && this.isFreeFlow != null) { // 外部单有流程才可以进入
                    hasPermission = true
                }
            }
            if(!hasPermission) {
                _.alert('提示', '此功能暂未开放', {
                    primaryBtn: {name: "确定", callBack: () => {
                        this.$router.go(-1)
                    }},
                    defaultBtn: {name: "", callBack: null}
                })
            }
        },
        async initList() {
            _.showLoading()
            this.showBoardList = false
            let res = await getFlowBoardList({
                versionId: this.versionId,
                workOrderSearchVO: JSON.stringify(this.searchValue)
            })
            _.hideLoading()
            this.showBoardList = true
            this.formName = res.formName
            this.nodeList = res.result
        },
        showPopFrame(key) {
            let _this = this
            this.showFrame = true
            switch(key) {
                case 'searchShow': this.settingShow = false
                                   this.detailShow = false
                                   break;
                case 'settingShow': this.searchShow = false
                                   this.detailShow = false
                                   break;
                case 'detailShow': this.settingShow = false
                                   this.searchShow = false
                                   break;
            }
            setTimeout(() => {
                _this[key] = true
                _this.$refs.maskLayer.style.opacity = '.4'
            }, 10)
        },
        closePopFrame() {
            if(document.querySelector('.dp-mask')) {
                document.querySelector('.dp-mask').style.display = 'none'
            }
            if(document.querySelectorAll('.dp-container').length) {
                document.querySelectorAll('.dp-container').forEach(item => item.style.display = 'none')
            }
            dataBase.selectConfig.show = false
            let _this = this
            this.conditionShow = false
            this.settingShow = false
            this.searchShow = false
            this.detailShow = false
            this.$refs.maskLayer.style.opacity = '0';
            setTimeout(() => {
                _this.showFrame = false
            }, 200)
        },
        showSetting() {
            if(this.settingShow) {
                this.closePopFrame()
            } else {
                this.showPopFrame('settingShow')
            }
        },
        showSearch() {
            if(this.searchShow) {
                this.closePopFrame()
            } else {
                this.showPopFrame('searchShow')
            }
        },
        showDetail(currUrl) {
            this.iframeUrl = currUrl
            this.showPopFrame('detailShow')
        },
        async recombineList(sortList) {
            let res = await saveNodeStatus({
                versionId: this.versionId,
                nodeStatus: JSON.stringify(sortList.map(item => {
                    return { nodeId: item.nodeId, isShow: item.isShow }
                }))
            });
            this.nodeList = JSON.parse(JSON.stringify(sortList))
            this.closePopFrame()
        },
        searchClose() {
            this.searchShow = false
            this.closePopFrame()
        },
        search(searchValue) {
            this.cacheSearchValue = searchValue
            this.searchValue = this.filterDeptAndUser(searchValue)
            this.initList()
        },
        setCondition(sortList) {
            this.searchSetting = sortList
            this.conditionShow = false
        },
        filterDeptAndUser(searchValue) {
            let newSearchValue = JSON.parse(JSON.stringify(searchValue)),
                reg = /,$/gi
            if(searchValue.creatorId) {
                let userList = searchValue.creatorId.users || []
                newSearchValue['creatorId'] = userList.reduce((ids, user) => ids + user.id + ',', '').replace(reg, '')
            }
            if(searchValue.departId) {
                let deptList = searchValue.departId.depts || []
                newSearchValue['departId'] = deptList.reduce((ids, dept) => ids + dept.id + ',', '').replace(reg, '')
            }
            for(let key in newSearchValue) {
                if(newSearchValue[key] == '') {
                    delete newSearchValue[key]
                }
            }
            return newSearchValue
        },

    },
    beforeDestroy() {
        document.body.classList.remove("flow-board-style")
    }
}
</script>
<style lang="scss" scoped>
$baseUrl: '~assets/images/';
$black: #0A1735;

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: contain;
}
.flow-board {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    background-color: #FFF;
    .header {
        padding: 0 32px;
        line-height: 48px;
        box-shadow: 0 0 10px #EEE;
        z-index: 13;
        .title {
            position: relative;
            float: left;
            font-size: 14px;
            padding-left: 20px;
            .icon {
                position: absolute;
                top: 50%;
                left: 0;
                width: 16px;
                height: 16px;
                transform: translateY(-50%);
                @include background('icon_plane.png')
            }
        }
        .search, .setting {
            position: relative;
            float: right;
            width: 48px;
            height: 48px;
            cursor: pointer;
            &:hover {
                background-color: #F7F8FA;
            }
            .icon {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 16px;
                height: 16px;
                transform: translate(-50%, -50%);
            }
        }
        .search {
            &.active {
                background-color: #F7F8FA;
            }
            .icon {
                @include background('icon_search.png')
            }
        }
        .setting {
            &.active {
                background-color: #F7F8FA;
            }
            .icon {
                @include background('icon_view.png')
            }
        }
        .tab {
            position: relative;
            float: right;
            width: 88px;
            border-left: 1px solid #F7F8FA;
            text-align: center;
            cursor: pointer;
            .icon {
                position: absolute;
                top: 50%;
                right: 4px;
                width: 12px;
                height: 12px;
                transform: translateY(-50%);
                transition: all .3s ease;
                @include background('icon_arrow@2x.png');
                &.active {
                    transform: translateY(-50%) rotate(-180deg);
                    @include background('icon_arrow_active.png');
                }
            }
            .tabList {
                position: absolute;
                left: 1px;
                z-index: 12;
                width: 100%;
                font-size: 13px;
                padding: 4px 0;
                background: #FFF;
                box-shadow: 0 4px 8px 0 rgba(10,23,53,0.1);
                border-radius: 4px;
                .item {
                    line-height: 40px;
                    &.active {
                        color: #5585F0;
                    }
                    &:hover {
                        background-color: #F7F8FA;
                    }
                }
            }
        }
    }
    .container {
        position: relative;
        display: flex;
        flex: 1;
        overflow: hidden;
        .form-title {
            position: absolute;
            top: 0;
            width: 100%;
            padding: 0 32px;
            line-height: 92px;
            font-size: 20px;
            font-weight: 600;
            color: $black;
            .level-tip {
                float: right;
                color: #85868F;
                font-size: 12px;
                .level {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    margin: 0 4px 0 16px;
                    border-radius: 4px;
                    &.high {
                        background-color: #FF586D;
                    }
                    &.middle {
                        background-color: #FFC363;
                    }
                    &.low {
                        background-color: #28DA98;
                    }
                }
            }
        }
        .board-list {
            margin-top: 92px;
            display: flex;
            flex: 1;
            white-space: nowrap;
            overflow-y: hidden;
        }
        .pop-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            .mask {
                width: 100%;
                height: 100%;
                background-color: black;
                transition: all .2s ease;
                opacity: 0;
            }
            & >>> .advancedSearch {
                position: absolute;
                right: 0;
                width: 375px;
            }
            .search-condition {
                z-index: 12;
            }
            .condition {
                position: relative;
                line-height: 48px;
                padding: 0 15px;
                cursor: pointer;
                &:active {
                    background-color: #F7F8FA;
                }
                .icon {
                    position: absolute;
                    top: 50%;
                    right: 18px;
                    transform: translateY(-50%);
                    @include background('ic_setting.png');
                }
            }
            .form-detail {
                position: absolute;
                top: 0;
                right: 0;
                width: 640px;
                height: 100%;
            }
        }
    }
}
.slide-enter-active, .slide-leave-active {
    transition: all .2s ease;
}
.slide-enter {
    transform: translateX(750px);
    opacity: 0;
}
.slide-leave-to {
    transform: translateX(750px);
    opacity: 0;
}
</style>
