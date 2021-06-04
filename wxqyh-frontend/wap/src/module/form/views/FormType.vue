<template>
	<div class="wrap formtype"
          :class="{'no-record': showRecord}"
					:infinite-scroll-immediate-check="false"
					v-infinite-scroll="loadMore"
					infinite-scroll-disabled="busy"
					infinite-scroll-distance="10">
		<router-link :to="{name: 'search', query: {range: 'all', tips: '搜索表单、应用'}}" class="qwui-nav_box_fixed">
      <simple-search></simple-search>
		</router-link>
		<div
			class="recentlyUsed">
			<p class="itemTip">最近使用表单<a class="fr" @click="showRecentSize">显示设置</a></p>
			<div class="list-wrapper">
        <router-link
          tag="div"
          v-for="(item,index) in recentlyList"
          :key="index"
          :to="{name: 'add', query: {id: item.definitionVersionsId}}"
        >
          <form-item :listItem="item" :showInfoFrame="false"></form-item>
        </router-link>
      </div>
		</div>
		<p class="itemTip">
      {{filterText}}

      <span class="type-change-btn" @click="changeSearchType">
        <span class="change-btn left" :class="{'active': searchType == 'formlist'}"></span>
        <span class="change-btn right" :class="{'active': searchType == 'grouplist'}"></span>
        <span class="change-btn slide-btn" :class="{'ltr': searchType == 'grouplist', 'rtl': searchType == 'formlist'}"></span>
      </span>
    </p>
    <div class="list-box" :class="{'empty': showRecord}">
      <div class="list-wrapper">
        <router-link
          v-for="(item, index) in list"
          :key="index"
          :to="{name: routeInfo.path, query: {id: item[routeInfo.idName], title: item.typeName ? item.typeName : ''}}"
        >
          <component
            :is="searchType == 'formlist' ? 'FormItem': 'GroupItem'"
            :listItem="item"
             :showInfoFrame="false"
          >
          </component>
        </router-link>
      </div>
      <load-more
        v-show="!isLoading"
        :showrecord="showRecord"
        :busy="busy"
        :loading="loading"
        @childevent="loadMore"
        :loadingText="loadText"
      >
      </load-more>
    </div>
    <dialog-bar :show="dialogShow"
                :recentlySize="recentlySize"
                @cancel="cancelDialog"
                @confirm="confirmDialog">
      <cell primary="content">
        <range v-model="recentlySize" :min="1" :max="10" :step="1" :rangeBarHeight="4"></range>
      </cell>
    </dialog-bar>
  </div>
</template>

<script>

import SimpleSearch from '../components/base/newBase/SimpleSearch'
import LoadMore from '../components/base/load_more'
import FormItem from '../components/list/FormItem'
import GroupItem from '../components/list/GroupItem'
import { initRecently, getRecentlySize, setRecentlySize, initGroup, initForm } from '../api/list'
import dialogBar from '../components/base/newBase/DialogBar.vue';
import Range from 'vux/src/components/range';
import Cell from 'vux/src/components/cell';
export default {
	components:{
		SimpleSearch,
		FormItem,
		GroupItem,
		LoadMore,
    dialogBar,
		Cell,
    Range
	},
	data(){
		return {
      isLoading: true,
      navList: {
        index: 0,
        nav: [
          {content: '表单', type: 'form', callback: initForm},
          {content: '分组', type: 'group', callback: initGroup}
        ]
      },
      formList: [],
			recentlyList: [],
      groupList: [],
			recordTitle: '',
			recordText: '',
			busy: true,
      loading: false,
      hasChanged: false,
			dialogShow:false,//是否显示最近使用个数设置框
			setting: {
				page: 1,
				pageSize: 20,
				keyWord: ''
      },
      placeholder: {
        'formlist': '搜索表单',
        'grouplist': '搜索应用'
      },
      searchType: 'formlist',
			recentlySize: 2
		}
	},
	computed:{
		showRecord(){
      this.groupList = this.groupList || [];
      if(this.searchType == 'formlist') {
        return this.formList.length == 0 ? true : false;
      }
			return this.groupList.length == 0 ? true : false;
    },
    loadText() {
      return this.searchType == 'formlist' ? '共 ' + this.formList.length + ' 个表单' :
                                             '共 ' + this.groupList.length + ' 个应用';
    },
    list() {
      return this.searchType == 'formlist' ? this.formList : this.groupList;
    },
    routeInfo() {
      let info = {};
      if(this.searchType == 'formlist') {
        info.path = 'add';
        info.idName = 'definitionVersionsId';
      }else {
        info.path = 'appdetail';
        info.idName = 'id';
      }
      return info;
    },
    filterText() {
      return this.searchType == 'formlist' ? '全部表单' : '全部应用';
    }
	},
	created() {
		let _this = this;
		getRecentlySize().then((res) => {
			this.initFormList(res.data.size)
		});
    this.searchType = localStorage.getItem('newSubSearchType') || 'formlist';
		this.initList();
	},
	methods:{
    changeSearchType() {
      this.isLoading = true;
      this.hasChanged = true;
      if(this.searchType === 'formlist') {
        this.searchType = 'grouplist';
        localStorage.setItem('newSubSearchType', 'grouplist');
      }else {
        this.searchType = 'formlist';
        localStorage.setItem('newSubSearchType', 'formlist');
      }
      this.setting.page = 1;
      this.initList();
    },
		loadMore(){
			this.setting.page++;
			this.loading = true;
            this.busy = true;
			this.initList(true);
		},
		initFormList(size) {
			_.showLoading()
			initRecently(size).then((res) => {
				_.hideLoading();
				if(res.code != "0") {
					return _.alert('提示', res.desc);
				}
				this.recentlyList = res.data.data;
				this.recentlySize = this.recentlyList.length;
			})
		},
		initList(isLoadMore) {

			let _this = this,
      searchValue = this.setting;
			searchValue.type = '';
			searchValue.status = '';

			_.showLoading();
			if(this.searchType == 'formlist') {
        initForm(searchValue).then((res) => {
          if(this.isLoading) this.isLoading = false;
          _this.setList(res, 0, isLoadMore)
        })
      }else {
        initGroup(searchValue).then((res) =>  {
          if(this.isLoading) this.isLoading = false;
          _this.setList(res, 1, isLoadMore);
        })
      }
		},
		setList(res, flag, isLoadMore) {
			_.hideLoading();
			this.loading = false;
			if(res.code != "0") {
				return _.alert('提示', res.desc);
			}
			this.busy = res.data.maxPage == 0 || res.data.currPage == res.data.maxPage;
			this.setting.page = res.data.currPage;
      if(flag === 0) this.formList = isLoadMore ? this.formList.concat(res.data.pageData) : res.data.pageData;
      if(flag === 1) this.groupList = isLoadMore ? this.groupList.concat(res.data.pageData) : res.data.pageData;
		},
		showRecentSize() {
			//更新进度按钮
			this.dialogShow = true;
		},
		cancelDialog() {//取消
			this.dialogShow = false;
		},
		confirmDialog() {//确定
			let _this = this;
			setRecentlySize(this.recentlySize).then(() => {
				this.initFormList();
				this.dialogShow = false;
			});
		},
    cancelSearch() {
      this.isShowSearch = false;
    }
	},
	watch: {
    'setting.keyWord': {
			handler(val) {
				this.recordTitle = '找不到相关记录';
				this.recordText = '';
				if(val == '') {
					this.recordText = '';
					this.recordTitle = '';
				}
			},
			deep: true
    }
  },
  destroyed() {
    this.isLoading = true;
  }
}

</script>

<style lang="scss" scoped>
$baseURL: '../assets/images/';
.formtype {
    display: flex;
    flex-direction: column;
    padding-bottom: 0;
    &.no-record {
      height: 100vh;
      overflow: hidden;
    }
}
.formtype .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}
.recentlyUsed {
  margin-top: 52px;
}
.itemTip {
  height: 44px;
  line-height: 44px;
  background: rgba(255,255,255,1);
  padding: 0 14px;
  font-size: 14px;
  font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
  font-weight: 500;
  color: rgba(10,23,53,1);
  border-bottom: 1px solid #f7f8fb;
  .type-change-btn {
    display: flex;
    float: right;
    margin-top: 7px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: left;
    border-radius: 15px;
    background: #F7F8FA;
    padding: 2px;
    box-sizing: border-box;
    .change-btn {
      display: inline-block;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: transparent;
      background-position: center;
      background-size: 16px;
      background-repeat: no-repeat;
      transition: all .2s ease-in;
      z-index: 2;
      &.left {
        background-image: url($baseURL + 'icon_a-tabbars_mine_pes@2x.png');
        margin-right: 4px;
        &.active {
          background-image: url($baseURL + 'icon_a-tabbars_mine_nor@2x.png');
        }
      }
      &.right {
        background-image: url($baseURL + 'switch_a-add_apps_off@2x.png');
        &.active {
          background-image: url($baseURL + 'icon_a-tabbars_more_pes@2x.png');
        }
      }
      &.slide-btn {
        position: absolute;
        background: #fff;
        z-index: 1;
        &.ltr {
          transform: translate3d(30px, 0, 0);
        }
        &.rtl {
          transform: translate3d(0, 0, 0);
        }
      }
    }
  }
}
.itemTip a {
	font-size:14px;
  font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
  font-weight:400;
  color:rgba(178,185,200,1);
}
.fr {
	float: right;
}
.list-box.empty {
  flex: 1;
  background: #fff;
}
.list-wrapper {
  position: relative;
  background: #fff;
  margin-bottom: 8px;
}
.title {
	text-align: center;
}
.overMask {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.2);
}
.recentSize {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	background-color: #fff;
	border-radius: 5px;;
}
.recentSize .title {
	color: #333;
	padding: 15px 10px 5px 10px;
	font-size: 17px;
}
.recentSize .content {
	padding: 15px;
	margin-bottom: 10px;
	display: flex;
	color: #666;
}
.recentSize .content .progressNum {
	text-align: center;
	flex: 1;
	font-size: 17px;
}
.recentSize .content .progressBar {
	margin: 10px 0;
	height: 4px;
	flex: 9;
	position: relative;
}
.progressBar .currProgress {
	position: absolute;
	top: 0;
	left: 0;
	background-color: #2f7dcd;
	height: 4px;
}
.progressBar .circle-icon {
	display: inline-block;
	position: absolute;
	top: -13px;
	width: 26px;
	height: 26px;
	background-color: #fff;
	border-radius: 50%;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);
	transform: translateX(-50%);
	cursor: pointer;
}
.progressBar .progress {
	background-color: #b6b6b6;
	height: 4px;
}
.recentSize .btn {
	display: flex;
	height: 42px;
	font-size: 16px;
	line-height: 42px;
	border-top: 0.5px solid #ccc;
}
.recentSize .btn .cancle, .recentSize .btn .confirm {
	flex: 1;
	text-align: center;
	cursor: pointer;
}
.recentSize .btn .cancle {
	color: #666;
	border-right: 0.5px solid #ccc;
}
.recentSize .btn .confirm {
	color: #467db9;
}
</style>
