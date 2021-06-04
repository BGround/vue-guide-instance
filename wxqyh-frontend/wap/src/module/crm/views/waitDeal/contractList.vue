<template>
  <div class="qwui-waitDeal_list" v-scroll="loadMore" ref="wrapList">
    <!--列表-->
    <crm-list
      :listData="listData"
      @click="goDetail"
      :isEllipsis="true"
      v-show="!noRecord.show"
    >
    </crm-list>

    <!--暂无记录-->
    <div class="waitDeal-noRecord" v-if="noRecord.show">
      <div class="waitDeal-noRecord-img"></div>
      <div class="waitDeal-noRecord-tips">暂无数据</div>
    </div>

    <!--加载组件-->
    <loadMore :loading="loadingMore" :currPage="currPage" :maxPage="maxPage">
      <div class="member_tips">没有更多</div>
    </loadMore>
  </div>

</template>

<script>
  import crmList from '../../components/CrmList/CrmList';
  import loadMore from '@/components/list/load_more.vue';
  import {getContractList} from '../../api/contract/getData.js'
    export default {
      name: "list",
      components:{
        crmList,
        loadMore,
      },
      data(){
        return{
          totalRows:0,//总数
          maxPage:1,//最大页
          currPage:1,//当前页
          hasMore:true,//是否有更多数据
          loadingMore: false,  // 是否正在加载
          listData:[],//列表数据
          noRecord:{  // 无记录配置
            show:false,
          },
          isScroll:false,//是否滚动了列表
          scrollTop:0,//列表滚动高度
        }
      },
      created(){
        this.getList();
      },
      activated() {
        if (this.scrollTop > 0) {
          this.$refs.wrapList.scrollTop = this.scrollTop;
        }
      },
      methods:{
        //列表
        getList:function(){
          let listParam={
            ['tbCrmContractSearchVO.readStatus']:'',
            ['tbCrmContractSearchVO.submitStatus']: 1,
            ['tbCrmContractSearchVO.contractStatus']:'',
            ['tbCrmContractSearchVO.contractOwner']: 3,
            ['tbCrmContractSearchVO.contractType']:'',
            ['tbCrmContractSearchVO.startSearchTime']:'',
            ['tbCrmContractSearchVO.endSearchTime']:'',
            ['tbCrmContractSearchVO.startQueryTime']:'',
            ['tbCrmContractSearchVO.endQueryTime']:'',
            ['tbCrmContractSearchVO.startContractAmount']:'',
            ['tbCrmContractSearchVO.endContractAmount']:'',
            ['tbCrmContractSearchVO.startPaymentAmount']:'',
            ['tbCrmContractSearchVO.endPaymentAmount']:'',
            ['tbCrmContractSearchVO.startNonPaymentAmount']:'',
            ['tbCrmContractSearchVO.endNonPaymentAmount']:'',
            ['tbCrmContractSearchVO.startDeelTime']:'',
            ['tbCrmContractSearchVO.endDeelTime']:'',
            ['tbCrmContractSearchVO.startCreateTime']:'',
            ['tbCrmContractSearchVO.endCreateTime']:'',
            ['tbCrmContractSearchVO.contractName']:'',
            ['tbCrmContractSearchVO.clientName']:'',
            ['tbCrmContractSearchVO.chargePerson']:'',
            ['tbCrmContractSearchVO.relater']:'',
            ['tbCrmContractSearchVO.createPerson']:'',
            ['tbCrmContractSearchVO.keyWord']:'',
            'stageType': '0',
            'page':this.currPage,
          }
          this.loadingMore=true;
          getContractList(listParam).then(result => {
            let res=result.data;
            this.totalRows=res.totalRows;
            this.maxPage=res.maxPage;
            this.currPage=res.currPage;
            this.hasMore = res.currPage >= res.maxPage? false : true;
            this.loadingMore=false;

            if(this.totalRows > 0){
              this.noRecord.show = false;
              res.pageData.forEach(item =>{
                let obj={
                  id:item.id,  // 列表id
                  top: item.title,  // 头部栏标题
                  mid: [
                    {
                      title: '合同金额(元)：',
                      value: ` ${_.formatMoney(item.contractAmount,2)}`,
                    },
                    {
                      title: '回款金额(元)：',
                      value: `${_.formatMoney(item.paymentAmount,2)}`,
                    }
                  ],
                  bottom: {
                    isShowAvator: false,
                    msg: {},
                    data: []
                  }
                }
                this.listData.push(obj)
              })
            }else{//是否显示缺省图
              this.noRecord.show = true;
            }
          })
        },

        // 加载更多列表
        loadMore (el) {
          let scrollTop = el.scrollTop;
          let offsetHeight = el.offsetHeight;
          let scrollHeight = el.scrollHeight;
          this.scrollTop=scrollTop;
          if(scrollTop + offsetHeight >= scrollHeight - 10){
            if(this.hasMore && !this.loadingMore){
              this.currPage++;
              this.getList();
            }
          }
          this.isScroll = scrollTop > 0? true:false;
          this.$emit('isScroll',this.isScroll);
        },


        //进入详情
        goDetail:function(id){
          this.$router.push({path:"/ContractContent",query:{id:id,isFromWaitDealList:1}});
        }
      }
    }
</script>

<style scoped lang="scss">
  .qwui-waitDeal_list{
    flex: 1;
    overflow-y: auto;
    background: #fff;
    padding-bottom: 48px;
    box-sizing: border-box;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
      padding-bottom: 14px;
    }
    /deep/ .list_item_top{
      color: #3F4A64;
    }
    /deep/ .list_item_mid{
      .mid_inner{
         span{
           &:nth-of-type(1){
             color: #9196A1 !important;
           }
           &:nth-of-type(2){
             color: #5585F0 !important;
           }
        }
      }
    }
    .waitDeal-noRecord {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: fixed;
      left: 0;
      right: 0;
      top: 50%;
      margin-top: -186px;
      &-img {
        margin-top: 80px;
        width: 160px;
        height: 160px;
        background: url("~assets/images/crm/crm_nocomment.png") no-repeat;
        background-size: contain;
      }
      &-tips {
        color: #b2b9c8;
        font-size: 14px;
      }
    }

    .listNum{
      padding-left: 15px;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      background: #F6F6FA;
      p{
        color: #9196A1;
        font-size: 12px;
      }
      transition: .1s ease;
    }
  }
</style>
