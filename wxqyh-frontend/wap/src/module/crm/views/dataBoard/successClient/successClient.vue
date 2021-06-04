<template>
  <div class="crm_list_wrap successClient">
    <div class="crm_list_header">
      <div class="flex_box">
        <div class="search_bar_wrap">
          <search-box :searchinput ="searchOption"
                      @listenToSearchBox = "dealInputSearch"
                      @listenToClearInput = "clearInputSearch"
                      ref="searchBox">
          </search-box>
        </div>
        <div class="operate_btn" @click="openSearch">
          <i class="hanber_icon"></i>
        </div>
      </div>
    </div>
    <div class="list_container">
      <scroll @loadMore="loadMore" v-show="clientList.length">
        <crm-list :listData="clientList"
                  :isEllipsis="true"
                  @click="goDetail"
        ></crm-list>
        <load-more  :loading="listData.loadingMore"
                    :currPage="listData.currPage"
                    :maxPage="listData.maxPage"
        >
          <div class="member_tips">共{{listData.totalRows}}个成交客户</div>
        </load-more>
      </scroll>
      <div class="no-data" v-show="clientList.length <= 0 && listData.hasLoaded">
        <div class="noData_img"></div>
        <div class="noData_text">没有成交客户</div>
      </div>
    </div>

    <advanced-search  v-if ="teamName || !firstTeamIds"
                      v-show="showSearch"
                      :setting="setting"
                      :cache-search-value="cacheSearchValue"
                      @close="closeSearch"
                      @search="search"
                      @reset="resetSearch"
    >
    </advanced-search>
    <team-list-select
      :listData="teamListData"
      v-show="showTeamSelect"
      @confirm="confirmTeam"
      @cancel="cancelTeam"
      ref="teamListSelect"
    ></team-list-select>
  </div>
</template>

<script>
import { mapMutations,mapActions } from 'vuex'
import SearchBox from '@/components/base/search_box';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
// import TeamTree from '../businessGraphic/businessTeamTree/businessTeamTree'
import CrmList from '../../../components/CrmList/CrmList';
import Scroll from '../../../components/CrmScroll/CrmScroll';
import LoadMore from '@/components/list/load_more';
import {getSuccessClientList, getTeamNameByTeamId, getSaleTeam} from '../../../api/dataBoard/getData'
import TeamListSelect from '../../../components/TeamListSelect/TeamListSelect';

const SEARCH_OPTION = {
  show: true,
  keyWord: '',
  moreFunction: {
    show: false,
    option: [
      {
        name:'标题',
        placeholder:'请输入客户名称搜索'
      }
    ]
  },
  rightSpan: {
    show: false,
    callback: null
  }
}
const CONSTRACT_TAB = 'constract_tab'
const BUSINESS_TAB = 'business_tab'
const RESET_DATA = {
  'searchValue.type': '',  // 商机赢单客户还是合同成交客户
  'searchValue.owner': '1',        // 客户拥有者
  'searchValue.clientCreateTime': 'all',                 // 创建时间类型
  'searchValue.successTime': 'all',   // 成交时间类型
  'searchValue.minCount': '',           //成交金额（下限）
  'searchValue.maxCount': '',            //成交金额（上限）
  'searchValue.teamIds': '',
}
export default {
  components: {
    SearchBox,
    AdvancedSearch,
    CrmList,
    Scroll,
    LoadMore,
    TeamListSelect
  },
  created() {
    // 若为团队时
    if(this.firstTeamIds){
      this._getTeamNameByTeamId();
    } else {
      this.initSearch()
    }
    this._getSuccessClientList();
  },
  beforeDestroy () {
    this.clientList = [];
  },
  data () {
    return {
      searchOption: SEARCH_OPTION,
      teamName: '',
      firstTeamIds: this.$route.query.teamIds,
      showTeamSelect: false,
      requestParams: {
        'searchValue.keyWord': '',                   //搜索关键字
        'searchValue.type': this.$route.query.type,  // 商机赢单客户还是合同成交客户
        'searchValue.owner': this.$route.query.owner,        // 客户拥有者
        'searchValue.clientCreateTime': 'all',                 // 创建时间类型
        'searchValue.successTime': this.$route.query.successTime,   // 成交时间类型
        'searchValue.minCount': '',           //成交金额（下限）
        'searchValue.maxCount': '',            //成交金额（上限）
        'searchValue.teamIds': this.$route.query.teamIds || '',
        'page': 1
      },
      setting: [  // 高级搜索配置列表
        {
          label: '成交定义',
          key: 'searchValue.type',
          type: 'radio',
          value: [
            { text: '全部', value: '', callBack: this.clearMoney},
            { text: '商机赢单', value: 'business', relativeLabel:[6]},
            { text: '合同签约', value: 'contract', relativeLabel:[6]}
          ]
        },
        {
          label: '所有者',
          key: 'searchValue.owner',
          type: 'radio',
          value: [
            { text: '全部', value: '0', callBack: this.clearTeam},
            { text: '我负责的', value: '1', callBack: this.clearTeam},
            { text: '我相关的', value: '2', callBack: this.clearTeam},
            { text: '我创建的', value: '3', callBack: this.clearTeam},
            { text: '销售团队', value: '4', relativeLabel:[3]}
          ]
        },
        {
          label: '',
          key: 'searchValue.teamIds',
          type: 'handle',
          callBack: this.selectTeam,
          show: false,
        },
        {
          label: '创建时间',
          key: 'searchValue.clientCreateTime',
          type: 'radio',
          value: [
            { text: '全部', value: 'all'},
            { text: '上月', value: 'lastMonth'},
            { text: '本月', value: 'month'},
            { text: '本季', value: 'season'},
            { text: '今年', value: 'year'}
          ]
        },
        {
          label: '最近成交时间',
          key: 'searchValue.successTime',
          type: 'radio',
          value: [
            { text: '全部', value: 'all'},
            { text: '上月', value: 'lastMonth'},
            { text: '本月', value: 'month'},
            { text: '本季', value: 'season'},
            { text: '今年', value: 'year'},
            { text: '本周', value: 'week'},
            { text: '上周', value: 'lastWeek'}
          ]
        },
        {
          label: '成交金额（元）',
          key: ['searchValue.minCount', 'searchValue.maxCount'],
          type: 'interval',
          inputType: 'number',
          show: false,
          placeholder: '请输入',
        },
      ],
      showSearch: false,
      cacheSearchValue: {}, //高级搜索初始化
      clientList: [],  // 成交客户列表
      listData: {
        hasLoaded: false
      },
      loadingMore: false,
      teamListData: [],
      needClearTeam: false
    }
  },
  computed: {},
  methods: {
    // 获取销售团队
    _getSaleTeam() {
      let data = {
        pageSize: 50
      }
      getSaleTeam(data).then(res => {
        if (res.code === '0') {
          this.saleTeam = res.data.pageData;
          this.saleTeam.map(item => {
            let obj = {
              id: item.id,
              firstTitle: item.teamName,
              secondTitle: item.teamMemberNum,
              isSelect: item.id === this.firstTeamIds? true : false
            }
            if(this.needClearTeam){

              obj['isSelect'] = false;

            }
            this.teamListData.push(obj);
          })
          this.needClearTeam = false;
        } else {
          _.alert('提示',res.desc);
        }
      })
    },
    _getTeamNameByTeamId() {

      let teamId = this.$route.query.teamIds || '';
      if(!teamId) return;
      let data = {
        teamId: teamId
      }
      getTeamNameByTeamId(data).then(res => {
        if(res.code === '0'){
          this.teamName = res.data.teamName;
          this.initSearch()
        } else {
          _.alert('提示',res.desc);
        }
      })
    },
    // 获取成交客户列表
    _getSuccessClientList(){
      this.loadingMore = true;
      getSuccessClientList(this.requestParams).then(res => {
        this.loadingMore = false;
        if (res.code === '0') {
          let data = res.data;
          let list = res.data.pager;
          this.listData = {
            currPage: data.currPage,
            maxPage: data.maxPage,
            totalRows: data.totalRows,
            hasMore: data.currPage < data.maxPage,
            hasLoaded: true
          };
          if(list && list.length > 0){
            list.map((item, index) => {
              let clientTypeName = item.type === 0 ? '商机赢单' : '合同签约'
              let tabClassName = 'status_gray'
              let obj = {
                id: item.clientId,
                top: item.clientName,
                tabClass: tabClassName,
                tabName: clientTypeName,
                showTab: true,
                mid: [],
                bottom: {
                  isShowAvator: false,
                  msg: {},
                  data: [
                    {
                      title: '成交时间：',
                      value: item.successTime
                    }
                  ]
                },
              }
              this.clientList.push(obj)
            })
          }
        } else {
          _.alert('提示',res.desc);
        }
      })
    },

    loadMore() {
      if(this.listData.hasMore && !this.loadingMore){
        this.requestParams.page = this.requestParams.page + 1;
        this.listData.hasLoaded = false;
        this._getSuccessClientList();
      }
    },

    // 开启高级搜索
    openSearch() {
      this.showSearch = true
    },

    // 关闭高级搜索
    closeSearch() {
      this.showSearch = false;
    },

    // 初始化高级搜索
    initSearch() {
      let paramsKeys = Object.keys(this.$route.query);
      paramsKeys.map(item => {
        this.cacheSearchValue[`searchValue.${item}`] = this.requestParams[`searchValue.${item}`];
      })
      if(this.firstTeamIds){
        this.setting[2].label = this.teamName;
      }
    },

    // 点击高级搜索确定
    search(searchValue){
      this.clientList = [];
      this.requestParams.page = 1
      let keyList = Object.keys(searchValue);

      // 若没有返回数据， 则表示点击重置数据
      if (keyList.length > 0) {
        // 验证
        let owner = searchValue['searchValue.owner'];
        let teamIds = searchValue['searchValue.teamIds'] || '';
        let minCount = searchValue['searchValue.minCount'] || '';
        let maxCount = searchValue['searchValue.maxCount'] || '';
        // 验证1、如果选择销售团队 却没有明确的销售团队
        if(owner === '4' && !teamIds){
          // 保持高级搜索开启
          this.openSearch();
          // 提示
          _.alert('提示', '请选择销售团队');
          return;
        }
        // 验证2、最大值小于最小值
        if(minCount && maxCount){
          if(Number(minCount) > Number(maxCount)){
            // 保持高级搜索开启
            this.openSearch();
            // 提示
            _.alert('提示', '成交金额的最小值不得大于最大值');
            return;
          }
        }

        // 赋值并请求参数
        if(searchValue['searchValue.owner'] != '4'){
          //Object.assign({},searchValue, {'searchValue.teamIds': ''})
          searchValue['searchValue.teamIds'] = ''
        }
        if(!searchValue['searchValue.type']){
          searchValue['searchValue.minCount'] = '';
          searchValue['searchValue.maxCount'] = '';
        }

        this.requestParams = Object.assign({}, this.requestParams, searchValue)
        this.listData.hasLoaded = false;
        this._getSuccessClientList();
      }

    },

    // 高级搜索点击重置
    resetSearch() {
      this.cacheSearchValue = JSON.parse(JSON.stringify(RESET_DATA))
      // 销售团队清空
      this.setting[2].label = '';
      this.needClearTeam = true;
    },

    setCacheValue(key, value) {
      this.$set('this.cacheSearchValue', key, value)
    },

    // 高级搜索——所有者变更
    clearTeam(){
      this.setting[2].label = '';
      this.cacheSearchValue['searchValue.teamIds'] = '';
      this.needClearTeam = true;
    },

    clearMoney() {
      this.cacheSearchValue['searchValue.minCount'] = '';
      this.cacheSearchValue['searchValue.maxCount'] = '';
    },

    // 高级搜索——点击选择销售团队
    selectTeam() {
      this.showTeamSelect = true
      // 之前加载过销售团队
      if(this.teamListData.length > 0){
        if(this.needClearTeam){
          this.$refs.teamListSelect.clearSelected()
          this.needClearTeam = false;
        }

      } else{
        this._getSaleTeam()
      }
    },

    // 高级搜索——销售团队点击确定
    confirmTeam (ids, selectData) {
      let selectDataName = '';
      let selectDataId = '';
      let arr_name = [];
      let arr_id = [];
      selectData.forEach((item, index) => {
        arr_name.push(item.firstTitle)
        arr_id.push(item.id)
      })

      selectDataName = arr_name.join(',')
      selectDataId = arr_id.join(',')
      // this.teamName = selectDataName;
      // 赋值给团队选择input框
      this.setting[2].label = selectDataName;
      this.cacheSearchValue['searchValue.teamIds'] = selectDataId;
      this.showTeamSelect = false;

    },

    // 高级搜索——销售团队点击取消
    cancelTeam(){
      this.showTeamSelect = false;
    },

    // 获取搜索框内容
    dealInputSearch(data) {
      this.clientList = [];
      this.requestParams.page = 1
      this.requestParams['searchValue.keyWord'] = data;
      this.listData.hasLoaded = false;
      this._getSuccessClientList();
    },

    clearInputSearch() {
      this.clientList = [];
      this.requestParams.page = 1;
      this.requestParams['searchValue.keyWord'] = '';
      this.listData.hasLoaded = false;
      this._getSuccessClientList();
    },

    goDetail(id){
      this.$router.push({path:"ClientDetails/ClientContent",query:{id:id, isClient: 0}});
    }
  }
}

</script>
<style lang='scss'>
.successClient{
  .search_bar_wrap{
    display: inline-block;
    vertical-align: middle
  }
  .list_container{
    flex: 1;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 43px;
    bottom: 0px;
    .crm_list{
      &::before{
        content: normal;
      }
      .contract_tab, .business_tab{
        border: 1px solid #666;
        border-radius: 3px;
      }
    }
    .no-data{
      text-align: center;
      font-size: 14px;
      margin-top: 87px;
      .noData_img{
        background: url('~assets/images/crm/no_data.png');
        background-size: 190px 170px;
        width: 200px;
        height: 174px;
        margin: 0 auto;
      }
      .noData_text{
        color: #A2A5B2
      }
    }
  }
  /deep/ .treeItem .treeContent{
    width: 1px;
  }
}
</style>
