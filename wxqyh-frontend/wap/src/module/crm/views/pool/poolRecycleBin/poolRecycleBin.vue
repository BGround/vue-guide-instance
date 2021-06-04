<template>
  <div class="poolRecycleBin">
    <crm-filter-bar v-if="dealPoolList.length" :filterConfig="filterConfig" @choose="choosePool"></crm-filter-bar>
    <crm-list-bar class="listbar" :option="listBarOption" @changeBar="dealChange" :bottomLine="currentClientList.length === 0 ? true : false"></crm-list-bar>
    <div class="list_container">
      <scroll @loadMore="loadMore" ref="scroll" v-show="currentClientList.length">
        <crm-list :listData="currentClientList"
                  :isEllipsis="true"
                  :canSelect="true"
                  @selectEvent="dealSelect"
                  @click="goDetail"
        >
        </crm-list>
        <load-more  :loading="loadingMore"
                    :currPage="currentClientData.currPage"
                    :maxPage="currentClientData.maxPage"
        >
          <div class="member_tips">共{{currentClientData.totalRow}}个{{clientTypeName}}</div>
        </load-more>
      </scroll>
      <div class="no-data" v-show="currentClientList.length <= 0 && currentClientData.hasLoaded">
        <div class="noData_img"></div>
        <div class="noData_text">没有{{clientTypeName}}</div>
      </div>
    </div>
    <div class="operation_footer">
      <qwui-button v-show="currentSelectClients.length === 0" type="default" text="返回" @buttonClick="goHistory"></qwui-button>
      <qwui-button v-show="currentSelectClients.length > 0" type="default" text="取消" @buttonClick="dealCancel"></qwui-button>
      <qwui-button class="button_revert" v-show="currentSelectClients.length > 0" type="primary" text="恢复" @buttonClick="handleRecover"></qwui-button>
    </div>
  </div>
</template>

<script>
import CrmFilterBar from '../../../components/CrmFilterBar/CrmFilterBar';
import QwuiButton from '@/components/base/button/button';
import CrmListBar from '../../../components/CrmListBar/CrmListBar.vue';
import CrmList from '../../../components/CrmList/CrmList';
import {getPoolListByCharge, getPoolList, recoverClient} from '../../../api/pool/getData';
import LoadMore from '@/components/list/load_more';
import Scroll from '../../../components/CrmScroll/CrmScroll'
import { mapActions } from 'vuex';
const LIST_BAR_OPTION = [
  {
    title: '冻结客户',
    type: 'freeze',
  },
  {
    title: '废弃客户',
    type: 'abandon'
  }
];
const clientType = {
  'freeze': 3,
  'abandon': 4
}

export default {
  components: {
    CrmFilterBar,
    QwuiButton,
    CrmListBar,
    CrmList,
    LoadMore,
    Scroll
  },
  created() {
    this._getPoolListByCharge();

    this.currentSelectClients = this[`select_${this.clientType}`]
  },
  data () {
    return {
      filterConfig: {
        itemData: [
          {
            key: 'poolName',
            show: true,
            type: 'radioSelect',
            defaultVal: this.$route.query.id,
            data: []
          }
        ]
      },
      dealPoolList: [],
      listBarOption: LIST_BAR_OPTION,
      poolId: this.$route.query.id,   // 当前的公海id
      clientType: 'freeze',           // 客户类型
      freezeData: {},
      freezeList: [],
      abandonData: {},
      abandonList: [],
      currentClientList: [],
      currentClientData: {
        hasLoaded: false
      },
      loadingMore: false,
      select_freeze: [],
      select_abandon: [],
      currentSelectClients: []
    }
  },
  computed: {
    clientTypeName() {
      if(this.clientType === 'freeze'){
        return '冻结客户'
      } else if(this.clientType === 'abandon') {
        return '废弃客户'
      }
    }
  },
  methods: {
    ...mapActions('list',[
      'delCacheArray'
    ]),
    _getPoolListByCharge() {
      let list = []
      getPoolListByCharge().then(res => {
        if(res.code === '0'){
          let poolList = res.data.poolList;
          if (poolList){
            let pool = {}
            poolList.forEach((item, index) => {
              pool = {
                name: item.poolName,
                key: item.id
              }
              list.push(pool)
            })
          }
          this.dealPoolList = list;
          this.$set(this.filterConfig.itemData[0], 'data', list);
          this._getPoolList(this.clientType)
        } else {
          _.alert('提示',res.desc);
        }
      })
    },
    // 获取公海客户列表
    _getPoolList(type, page = 1){
      if(!this.poolId) return;

      this.loadingMore = true;
      let data = {
        clientStatus: clientType[type],
        page: page,
        'searchValue.poolId': this.poolId
      }


      getPoolList(data).then(res => {
        if(res.code === '0'){
          // 若为冻结客户
          let data = res.data;
          let list = data.pageData;
          this.loadingMore = false;
          if(type === 'freeze'){
            this.freezeData = {
              'currPage': res.data.currPage,
              'maxPage': res.data.maxPage,
              'totalRow': res.data.totalRows,
              'hasMore': res.data.currPage >= res.data.maxPage ? false : true,
              'hasLoaded': true
            }
            if(list && list.length > 0){
              list.map((item, index) => {
                let formatedDay = this.formateDate(item.blockTime)
                let obj = {
                  id: item.id,
                  top: item.clientName,
                  canSelect: true,
                  mid: [],
                  bottom: {
                    isShowAvator: false,
                    msg: {},
                    data: [
                      {
                        title: '',
                        value: formatedDay,
                      },
                      {
                        title: '',
                        value: '被冻结'
                      }
                    ]
                  }
                }
                this.freezeList.push(obj)
              })
            }
            this.currentClientList = this.freezeList;
            this.currentClientData = this.freezeData;
          }
          // 若为废弃客户
          else if(type === 'abandon'){
            this.abandonData = res.data;
            this.abandonData = {
              'currPage': res.data.currPage,
              'maxPage': res.data.maxPage,
              'totalRow': res.data.totalRows,
              'hasMore': res.data.currPage >= res.data.maxPage ? false : true,
              'hasLoaded': true
            }
            if(list && list.length > 0){
              list.map((item, index) => {
                let formatedDay = this.formateDate(item.blockTime)
                let obj = {
                  id: item.id,
                  top: item.clientName,
                  canSelect: true,
                  mid: [],
                  bottom: {
                    isShowAvator: false,
                    msg: {},
                    data: [
                      {
                        title: '',
                        value: formatedDay,
                      },
                      {
                        title: '',
                        value: '被废弃'
                      }
                    ]
                  }
                }
                this.abandonList.push(obj)
              })
            }
            this.currentClientList = this.abandonList;
            this.currentClientData = this.abandonData
          }

        }  else {
          _.alert('提示',res.desc);
        }
      })
    },
    // 恢复废除、冻结公海客户
    _recoverClient(){
      let data = {
        poolId: this.poolId,
        clientIds: this.currentSelectClients.join(',')
      }
      recoverClient(data).then(res => {
        if(res.code === '0'){
          this.currentSelectClients = [];
          this[`select_${this.clientType}`] = [];
          _.tooltips_succeed('操作成功');
          this[`${this.clientType}List`] = [];
          this._getPoolList(this.clientType);
          this.delCacheArray('PoolList');
        } else {
          _.alert('提示',res.desc);
        }
      })
    },

    // 切换公海
    choosePool(data){

      this.poolId = data.key
      this.currentClientList = [];
      // this.currentClientData = null;
      this.abandonList = [];
      this.freezeList = []
      this._getPoolList(this.clientType);
      this.currentClientData.hasLoaded = false;
    },
    // 切换客户类型
    dealChange(clientType) {
      if(this.clientType === clientType) return;
      this.$refs.scroll.toTop();
      this.currentClientData.hasLoaded = false;
      this.currentClientList = [];
      this.clientType = clientType;
      this.currentSelectClients = this[`select_${this.clientType}`]

      // 如果此列表长度为0则重新加载
      if(this[`${this.clientType}List`].length === 0 ){
        this._getPoolList(this.clientType)
      } else {
        this.currentClientList = this[`${this.clientType}List`]
        this.currentClientData = this[`${this.clientType}Data`]
      }
    },
    // 勾选客户列表
    dealSelect(selectList){
      this[`select_${this.clientType}`] = selectList;
      this.currentSelectClients = this[`select_${this.clientType}`]
    },
    formateDate(data){
      if(data){
        let date = data.split(' ')[0];
        let year = date.split('-')[0];
        let month = date.split('-')[1];
        let day = date.split('-')[2];
        let currentYear = new Date().getFullYear();
        if(year == currentYear){
          return `${month}-${day}`
        } else{
          return date;
        }
      }
    },

    goHistory(){
      this.$router.replace({name: 'poolList'})
    },
    handleRecover(){
      this._recoverClient();
    },
    // 取消
    dealCancel(){
      this[`${this.clientType}List`].map((item, index) => {
        this.$set(item, 'isSelect', false);
        // this.currentSelectClients = []
      })
      this[`select_${this.clientType}`] = []
      this.currentSelectClients = []

    },
    goDetail(id) {
      sessionStorage.clear('id');//清除缓存
      this.$router.push({path:"PoolDetails/PoolContent",query:{id:id, type:1}});
    },
    loadMore () {
      if(this.currentClientData.hasMore && !this.loadingMore){
        let page = this.currentClientData.currPage + 1;

        this._getPoolList(this.clientType, page);
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.poolRecycleBin{
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  // height: -webkit-fill-available;
  .listbar{
    margin-top: 10px;
  }
  .list_container{
    flex: 1;
    background: #fff;
    position: absolute;
    width: 100%;
    top: 105px;
    bottom: 60px;
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
    .crm_list{
      &:before{
        z-index: 1;
      }
    }
  }
  .operation_footer{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    background: #fff;
    padding: 8px 0 8px 15px;
    .button_revert{
      margin-right: 15px;
    }
  }
}
</style>
