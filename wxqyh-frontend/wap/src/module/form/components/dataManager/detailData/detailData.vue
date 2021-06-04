<template>
    <div class="detailData"
        :class="{bottom: canDownLoad}"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
        <div class="header" v-show="!showSearchBar">
            <search-view
                ref="searchView"
                :length="totalRows"
                :customView="customView"
                :defaultView="defaultView"
                :searchSetting="searchSetting"
                :currDefaultView="currView"
                :customConfig="customConfig"
                @addView="addView"
                @deleteView="deleteView"
                @updateView="updateView"
                @setView="setView">
            </search-view>
            <div class="flowBoardIcon" @click="jumpToFlowBoard" v-if="showFlowBoard"></div>
            <div class="searchIcon" @click="searchBarShow"></div>
            <div class="advancedSearchIcon" @click="showSeniorSearch" :class="{'high-light': hasAdvance}"></div>
        </div>
        <div class="qwui-nav_box_fixed" v-show="showSearchBar">
            <search-bar
                :searchinput="searchBar"
                :keyWord="searchBar.keyWord"
                placeholder="搜索标题"
                @listenToSearchBox="showMsgFromSearchBar"
                @closeDialog="closeDialog"
                ref="searchBar">
                  <div
                    class="advance-search-icon"
                    slot="rightSpan"
                    v-if="searchBar.rightSpan &&  searchBar.rightSpan.show"
                    @click="searchBar.rightSpan.callback"
                    :class="{'high-light': hasAdvance}"
                  >
                  </div>
                </search-bar>
        </div>
        <detail-list :list="list"></detail-list>
        <button-group :fixed="true" v-if="canDownLoad && !(showSearch || showCondition)">
            <qwui-button type="primary" text="下载当前明细" @buttonClick="showCondition = true"></qwui-button>
        </button-group>
        <download-condition v-show="showCondition"
            :type="isTask == 3 ? 1 : 0"
            :id="versionId"
            :keyWord="setting.keyWord"
            @close="showCondition = false"></download-condition>
        <advanced-search
            v-show="showSearch"
            :setting="searchSetting"
			:cache-search-value="cacheSearchValue"
            @close="searchClose"
            @search="search"></advanced-search>
        <load-more
            :busy="busy"
            :loading="loading"
            :showrecord="showRecord"
            @childevent="loadMore"
            :listCount="list.length"
          >
          </load-more>
    </div>
</template>

<script>
import { wordOrderMxList, outerMxList, addFormView,
        deleteFormView, updateFormView, findFormViews, showFlowBoard } from '../../../api/list'
import { isVipGold } from '@/assets/js/vip-portal.js'
import detailList from './detailList'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
import downloadCondition from './detailDownLoadCondition'

import { mixinTab } from '../../list/tab.js'
import { mixinAdvancedSearch } from './advancedSearch.js'
import { mixinSearchView } from './searchView.js'
import { mixinCommonView } from '../../list/searchView.js'
import { mixinCommonSearch } from '../../list/advancedSearch.js'

export default {
    mixins: [
        mixinTab,
        mixinCommonSearch,
        mixinAdvancedSearch,
        mixinCommonView,
        mixinSearchView
    ],
    name: 'detailData',
    components: {
        detailList,
        buttonGroup,
        downloadCondition,
        qwuiButton
    },
    data() {
        return {
            formName: '',
            versionId: this.$route.query.id, // 当前表单的versionId
            isTask: this.$route.query.isTask, // 当前表单的类型
            viewId: this.$route.query.viewId || 0,
            canDownLoad: 0,
            list: [],
            totalRows: 0,
            showFlowBoard: false,
            isFreeFlow: '',
            showCondition: false,
            showSearchBar: false,
            viewType: 2,
            initFunction: this.$route.query.isTask == 3 ? outerMxList : wordOrderMxList
        }
    },
    created() {
        this.cache('view' + this.versionId, 'customConfig' + this.versionId);
        this.initList();
    },
    methods: {
        async initList(isLoadMore) {
            this.busy = true
            this.useAdvance()
            let _this = this,
                setting = Object.assign(
                JSON.parse(JSON.stringify(this.setting)),
                { workOrderSearchVOJson: JSON.stringify(this.searchValue), definitionVersionsId: this.versionId }
            );
            _.showLoading()
            let res = await this.initFunction(setting)
            _.hideLoading()
            this.loading = false
            this.needShowFlowBoard();
            this.isFreeFlow = res.isFreeFlow
            this.setList(res, isLoadMore)
            this.customView = res.viewList.map(item => {
                item.param = JSON.parse(item.param)
                item.param.departId && (item.param.departId = { depts: item.param.deptVOs })
                item.param.creatorId && (item.param.creatorId = { users: item.param.createUserVOs })
                return item
            })
            this.formName = res.formName
            this.totalRows = res.totalRows
            wxqyhConfig.ready(function () {
                _this.canDownLoad = res.totalRows && res.isWxDownloadMx && isVipGold(interfaceCode.INTERFACE_CODE_FORM)
            });
        },
        searchBarShow() {
            this.showSearchBar = true;
            this.$refs.searchBar.closeThis();
        },
        showSeniorSearch() {
            this.$refs.searchBar.clickRightSpan();
        },
        showMsgFromSearchBar(keyWord){
            this.closeDialog();
            if(keyWord == this.setting.keyWord) {
				return
            }
            this.list = []
            this.setting.page = 1
            this.searchValue = { formTitle: keyWord }
            this.cacheSearchValue = { formTitle: keyWord }
            this.setCustomConfig(true, this.searchValue);
            this.initList();
        },
        search(searchValue) {
            this.setting.page = 1
            this.searchValue = this.filterDeptAndUser(searchValue)
            this.cacheSearchValue = searchValue
            delete this.searchValue['deptVOs']
            delete this.searchValue['createUserVOs']
            this.setCustomConfig(true, searchValue);
            this.initList()
        },
        closeDialog() {
            this.showSearchBar = false;
        },
        async needShowFlowBoard() {
          let res = await showFlowBoard()
          if(!_.isMobileApp() && res.result) { // PC才可以进入
            if(this.isTask == '2' && this.isFreeFlow != '1') { // 审批单自由流程和分支流程才可以进入
              this.showFlowBoard = true
            }
            if(this.isTask == '3' && this.isFreeFlow != '1' && this.isFreeFlow != null) { // 外部单有流程才可以进入
              this.showFlowBoard = true
            }
          }
        },
        jumpToFlowBoard() {
          if(_.isQiyeweixin() || _.isWeChat()) {
            this.$router.push({
              name: 'flowBoard',
              query: { id: this.versionId, isTask: this.isTask }
            })
          } else {
            window.open("#/flowBoard?id=" + this.versionId + "&isTask=" + this.isTask)
          }
        }
    },
    beforeDestroy () { // 组件销毁前缓存高级搜索条件
		this.setStore('view' + this.versionId, this.currView);
		this.setStore('customConfig' + this.versionId, this.customConfig);
	}
}
</script>

<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: contain;
}
.detailData {
    position: relative;
    .header {
        position: relative;
        display: flex;
        background-color: #fff;
        box-shadow: 0px -1px 0px 0px rgba(248, 249, 251, 1);
        .dataRange {
            display: flex;
            flex: auto;
            margin-right: 75px;
            .item {
                flex: auto;
                text-align: center;
                line-height: 25px;
                border: 1px solid #F7F8FA;
                font-size: 12px;
                color: #B2B9C8;
                background-color: #F7F8FA;
                border-radius: 15px;
                margin-right: 5px;
            }
            .item.active {
                color: rgba(85,133,240,1);
                border: 1px solid rgba(84,133,239,1);
                background-color: rgba(85,133,240,0.1);
            }
        }
        .flowBoardIcon {
            position: absolute;
            top: 50%;
            right: 90px;
            height: 20px;
            width: 20px;
            transform: translateY(-50%);
            @include background('icon_flowBoard.png');
        }
        .searchIcon {
            position: absolute;
            top: 50%;
            right: 50px;
            height: 20px;
            width: 20px;
            transform: translateY(-50%);
            @include background('ic_search_deep.png');
        }
        .advancedSearchIcon {
            position: absolute;
            top: 50%;
            right: 15px;
            width: 30px;
            height: 30px;
            transform: translateY(-50%);
            @include background('icon-search.png');
            background-size: cover;
            &.high-light {
                background-image: url(../../../assets/images/icon_a-search_filteer_pes.png);
                background-size: 20px;
                background-position: right;
            }
        }
    }
}
.detailData.bottom {
    margin-bottom: 60px;
}
.advance-search-icon {
  width: 24px;
  height: 24px;
  margin: 6px 0 0 17px;
  padding: 0;
  background-image: url(../../../assets/images/icon_a-shearchbar_filter@2x.png);
  background-position: 0 -24px;
  background-repeat: no-repeat;
  background-size: 48px 36px;
  background-position: center;
  cursor: pointer;
  &.high-light {
    background: url(../../../assets/images/icon_a-search_filteer_pes.png);
  }
}
</style>
