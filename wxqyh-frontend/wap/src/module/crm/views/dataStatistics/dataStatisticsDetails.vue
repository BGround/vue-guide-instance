<template>
    <div class="moneyDetail_page">
        <div class="filter_wrap">
            <crm-filter-bar
            :filterConfig="filterConfig"
            @choose="chooseItem"
            :slotClass="slotClass"
        >
            <span>{{curTime}}</span>
        </crm-filter-bar>
        <div class="money_total" v-show = "totalItems>0">共计{{totalItems}}个回款&nbsp;&nbsp;&nbsp;&nbsp;总计{{totalMoney}}万元</div>

        </div>
        
        <div class="money_main" v-scroll="loadMoreList">
            <receive-contract-list :dataList="contractList"></receive-contract-list>
            <!--加载状态-->
            <load_more :loading="loadingMore" :currPage="this.page" :maxPage="totalPages">
                <div class="member_tips" v-show = "totalItems>0">没有更多</div>
            </load_more>
            
        </div>
        <no-record
            :stepTop="true"
            :hasRecord="noRecord"
            v-show="showRecord">
        </no-record>
    </div>
</template>
<script>
import CrmFilterBar from "../../components/CrmFilterBar/CrmFilterBar";
import receiveContractList from "./receiveContractList";
import load_more from "@/components/list/load_more";
import NoRecord from "@/components/base/noRecord";
import { getReceiveContract } from "../../api/dataStatistics/getData";

export default {
  data() {
    return {
      filterConfig: {
        itemData: [
          {
            key: "type", // 筛选项key
            show: true, // 是否显示
            type: "radioSelect", // 选择类型：radioSelect(单选) other(引入其他组件)
            data: [
              // 单选项数据
              {
                name:'全部',
                key:''
              },
              {
                name: "计划",
                key: "0"
              },
              {
                name: "实际",
                key: "1"
              },
              {
                name: "开票",
                key: "2"
              }
            ]
          }
        ]
      },
      contractList: [],
      totalItems: "0",
      totalMoney: "0",
      totalPages: "",
      curType: 0,//当前的回款种类
      slotClass: {
        textAlign: "center",
        lineHeight: "44px",
        fontSize: "14px",
        color: "#333",
        flex: "3",
        background: "#fff"
      },
      curTime: "",
      searchValue: "",
      hasMore: false,
      loadingMore: false,
      page: "1",
      noRecord: {
        // 无记录配置
        icon: "qwui-icon_no_Data",
        title: "",
        text: "暂无数据"
      },
      showRecord: false // 是否显示没有记录提示
    };
  },
  components: {
    CrmFilterBar,
    receiveContractList,
    load_more,
    NoRecord
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let query = JSON.parse(localStorage.getItem('receiveRouter'))
      this.searchValue =query.searchValue;
      let monyDetial = query.monyDetial;
      this.curType = monyDetial.type;
      this.curTime = monyDetial.stageName;
      this.filterConfig.itemData[0].defaultVal = this.curType.key
      this.getContractsList();
    },
    //切换回款类型
    chooseItem(data) {
      this.contractList = []
      this.totalItems = 0
      this.page = 1
      this.curType = data;
      this.searchValue["searchVO.stepType"] = data.key;
      this.getContractsList();
      let query = JSON.parse(localStorage.getItem('receiveRouter'));
      let monyDetial = query.monyDetial;
      monyDetial.type = data
      localStorage.setItem('receiveRouter',JSON.stringify({ monyDetial, searchValue: this.searchValue}))
    },
    loadMoreList(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this.hasMore && this.loadingMore) {
          this.page++;
          this.getContractsList();
        }
      }
    },
    getContractsList() {
      if (this.searchValue) {
        _.showLoading('')
        getReceiveContract({ ...this.searchValue, page: this.page })
          .then(res => {
            if (res.code == '0') {
              _.hideLoading('')
              this.totalItems = res.data.totalRows;
              if (this.totalItems > 0) {
                this.contractList.push(...res.data.pageData);
                this.totalPages = res.data.maxPage;
                this.totalMoney = res.data.total
                if (this.page < this.totalPages) {
                  this.hasMore = true;
                  this.loadingMore = true;
                }else{
                  this.loadingMore = false;
                }
                
                this.showRecord = false;
              } else {
                if(this.contractList.length == 0){
                  this.showRecord = true;
                }
              }
            }else{
              _.alert("提示", err);
            }
          })
          
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../crmBase.scss";
.moneyDetail_page {
  height: 100%;
  display: flex;
  height: 100%;
  flex-direction: column;
  .filter_wrap {
    position: relative;
    height: rem(84);
      .money_total {
        width: 100%;
        height: rem(40);
        line-height: rem(40);
        font-size: rem(13);
        color: #b2b9c8;
        padding-left:rem(15);
        box-sizing: border-box;
        background: #fff;
    }
  }
  .money_main {
    width: 100%;
    padding: 0 rem(15);
    box-sizing: border-box;
    position: relative;
    flex: 1;
    overflow-y: auto;
    margin-top:rem(8);
  }
}
</style>