<template>
  <div
    class="submited"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <div class="qwui-nav_box_fixed">
      <search-bar
        :searchinput="searchBar"
        :keyWord="searchBar.keyWord"
        placeholder="搜索标题"
        @listenToSearchBox="showMsgFromSearchBar" >
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
    <select-card
      :selectdata="selectData"
      :userStyle="styleData"
      @listenTabChange="showMsgFromSelectCard">
    </select-card>
    <entrust-rules-list
      :list="list"
      @listenDelList="delList"
      @listenUpdateList="initList"
      @updateData="updateData"
      v-if="selectData.index == 0" ></entrust-rules-list>
    <entrust-record-list
      :list="list"
      v-if="selectData.index == 1"></entrust-record-list>
    <advanced-search
      ref="advancedSearch"
      v-show="advancedSearchShow"
      :setting="searchSetting"
      :cache-search-value="cacheSearchValue"
      @close="advancedSearchClose"
      @search="advancedSearch"></advanced-search>
    <div class="new-entrust qwui-tabbar" @click="entrustAdd" v-if="selectData.index == 0" >
        <img src="~assets/images/entrust_add.svg" alt="" class="entrust-add-img">
        <span class="new-entrust-font">新建委托</span>
    </div>
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      :record-title="recordTitle"
      :record-text="recordText"
      @childevent="loadMore"
      :listCount="list.length"
      :entrustTips="entrustTips"></load-more>
    <div class="qwui-tabbar_heaght" v-if="selectData.index == 0"></div>
  </div>
</template>

<script>
  import SelectCard from "../base/MenuTab";
  import entrustRulesList from './entrustRulesList.vue'
  import entrustRecordList from './entrustRecordList.vue'
  import { entrustRule , entrustRecord} from '../../api/list'
  import { mixinTab } from './list'
  import advancedSearch from '@/components/base/AdvancedSearch/index'
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
  import { isVipGold } from '@/assets/js/vip-portal.js' 	//判断VIP

  export default {
    mixins: [mixinTab],
    components:{
      entrustRulesList,   // 委托规则
      entrustRecordList,  // 委托记录
      SelectCard,
      advancedSearch,
      dialog_mask_bottom
    },
    data() {
      return {
        list:[],
        styleData: {
          top: 52,
          fixed: true
        },
        selectData: {
          index:0,
          nav:[{ content: '委托规则' }, { content: '委托记录' }]
        },
        searchSetting: [
          {
            label: '委托处理状态',
            key: 'tbQyFlowEntrustRecordVO.handleStatus',
            type: 'radio',
            value: [{ text: '全部', value: ''}, { text: '已处理', value: '1'}, { text: '未处理', value: '0'}, { text: '已失效', value: '-1'}]
          },
          {
            label: '被委托人',
            key: 'tbQyFlowEntrustRecordVO.consigneeUserId',
            type: 'selectUserOrDepart',
            selectType: 'users',
            selectConfig: dataBase.selectConfig,
            userRestriction: '1000' //选人上限
          },
          {
            label: '委托生成时间',
            key: ['tbQyFlowEntrustRecordVO.startTime', 'tbQyFlowEntrustRecordVO.endTime'],
            type: 'date'
          }
        ],
        dialogBottomConfig: dataBase.dialogBottomConfig,
        recordText:'当您不方便处理申请单时，可以委托给其他人处理',
        recordTitle: '暂无委托规则',
        entrustTips: ''
      }
    },
    created() {
      let _this = this;
      this.initList();
      this.cache('entrustSearchValue', 'entrustCacheSearchValue');
      this.setting.keyWord = this.getStore("entrustKeyWord") || '';
      this.$set(this.searchBar, 'keyWord', this.getStore('entrustKeyWord') || '');
      this.searchBar.rightSpan.callback = function () {
        _this.advancedSearchShow = true;
      }
    },
    methods: {
      // 删除列表
      delList(index){
        this.list.splice(index,1);
      },
      // 设置dialog_mask_bottom
      updateData(ruleStatus){
        var execuTip = '';
        if(ruleStatus == 0 || ruleStatus == 1){
          ruleStatus == 1 ? execuTip = '暂停委托' : execuTip = '恢复执行';
          dataBase.dialogBottomConfig.title = '';
          dataBase.dialogBottomConfig.btnConfig.length = 0;
          dataBase.dialogBottomConfig.btnConfig[0] = {title: execuTip, callBack: null};
          dataBase.dialogBottomConfig.btnConfig[1] = {title:" 删除", callBack: null, primary:true};
          dataBase.dialogBottomConfig.btnConfig[2] = {title:" 取消", callBack: null};
        } else {
          dataBase.dialogBottomConfig.title = '';
          dataBase.dialogBottomConfig.btnConfig.length = 0;
          dataBase.dialogBottomConfig.btnConfig[0] = {title:" 删除", callBack: null, primary:true};
          dataBase.dialogBottomConfig.btnConfig[1] = {title:" 取消", callBack: null};
        }
      },
      // 初始化数据
      initList(isLoadMore) {
        this.useAdvance();
        this.selectData.index = parseInt(sessionStorage.getItem('tabValue')) || 0;
        var _this = this,
          initFunction = null,
          setting = JSON.parse(JSON.stringify(this.setting)),
          searchValue = this.isSearch && this.selectData.index == 1 ? this.searchValue : setting;
        // 判断请求内容的类型
        switch (this.selectData.index){
          // 委托规则
          case 0:
            initFunction = entrustRule;
            this.$store.state.formBase.pageData.paramSearchType = 1;
            this.entrustTips = 'rules';
            this.searchBar.rightSpan.show = false;
            break;
          // 委托记录
          case 1:
            initFunction = entrustRecord;
            this.$store.state.formBase.pageData.paramSearchType = 0;
            this.entrustTips = 'record';
            this.searchBar.rightSpan.show = true;
            break;
        }
        if(this.isSearch && this.selectData.index == 1) {
          searchValue = Object.assign(searchValue, setting);
        }
        searchValue.agentCode = dataBase.wxqyh_uploadfile.agent; // 应用code
        _.showLoading();
        initFunction(searchValue).then((res) => {
          _this.setList(res, isLoadMore);
        })
      },
      showMsgFromSelectCard(){
        sessionStorage.setItem('tabValue',this.selectData.index);
        this.initPageInfo();
      },
      initPageInfo() {
        this.list = [];
        this.setting.page = 1;
        this.busy = true;
        switch(this.selectData.index) {
          case 0:
            // 缓存高级搜索
            this.setStore('entrustSearchValue', this.searchValue);
            this.setStore('entrustCacheSearchValue', this.cacheSearchValue);
            this.setting.keyWord = this.getStore('entrustKeyWord') || '';
            // 缓存普通搜索框缓存
            this.$set(this.searchBar, 'keyWord', this.getStore('entrustKeyWord') || '');
            this.searchBar.rightSpan.show = false;
            this.recordTitle = '暂无委托规则';
            this.recordText = '当你不方便处理申请单时，可以委托给其他人处理';
            break;
          case 1:
            this.setStore('entrustKeyWord', this.setting.keyWord);
            this.setting.keyWord = this.searchValue['workOrderSearchVO.formTitle'] || '';
            this.$set(this.searchBar, 'keyWord', this.searchValue['workOrderSearchVO.formTitle'] || '');
            this.recordTitle = '暂无委托记录';
            this.recordText = '';
            this.searchBar.rightSpan.show = true;
            break;
        }
        this.initList();
      },
      // 新增规则
      entrustAdd(){
        if(isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
          this.$router.push({path:'/entrustAdd'});
        } else{
          _.alert("提示","流程委托仅限尊享版使用，请联系管理员升级","确定",function(){
            restoreSubmit();
          });
        }
      },
      showMsgFromSearchBar(keyWord){
        if(keyWord == this.setting.keyWord) {
          return
        }
        this.busy = true;
        this.list = [];
        this.setting.page = 1;
        this.setting.keyWord = keyWord;
        this.isSearch = this.isSearch;
        if(this.selectData.index == 1) {
          this.searchValue['workOrderSearchVO.formTitle'] = keyWord;
          this.$set(this.cacheSearchValue, 'workOrderSearchVO.formTitle', keyWord);
        }
        this.initList();
      },
    },
    // 组件销毁前缓存高级搜索条件
    beforeDestroy () {
      if(this.selectData.index == 0) {
        this.setStore('entrustKeyWord', this.setting.keyWord);
      } else {
        this.setStore('entrustSearchValue', this.searchValue);
        this.setStore('entrustCacheSearchValue', this.cacheSearchValue);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .submited {
    margin-top: 46px;
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px){
    .submited {
      padding-bottom: 34px;
    }
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px){
    .submited {
      padding-bottom: 34px;
    }
  }
  .submited .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    transition: top .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    .advance-search-icon {
      width: 24px;
      height: 24px;
      margin: 6px 0 0 17px;
      padding: 0;
      background-image: url(../../assets/images/icon_a-shearchbar_filter@2x.png);
      background-position: 0 -24px;
      background-repeat: no-repeat;
      background-size: 48px 36px;
      background-position: center;
      cursor: pointer;
    &.high-light {
       background: url(../../assets/images/icon_a-search_filteer_pes.png);
     }
    }
  }
  .new-entrust{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    z-index: 10;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    box-shadow:0px 1px 0px 0px rgba(228,229,233,0.5);
    cursor: pointer;
  }
  .new-entrust-font{
    margin-left: 8px;
    line-height: 50px;
    color: #4D7CFE;
    font-size: 15px;
  }
  @media screen and (min-width: 1024px){
    .new-entrust{
      width: 740px;
    }
  }
  .qwui-tabbar_heaght{
    height: 50px;
  }
  .entrust-add-img {
    margin-top: 19px;
    height: 13px;
  }
</style>
