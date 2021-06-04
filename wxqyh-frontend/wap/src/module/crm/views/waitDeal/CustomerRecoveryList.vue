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
  import {getRecycle} from '../../api/waitDeal/getData.js'
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
        midTabClass:'', // 标签样式
        midTabName:'',//标签状态
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
          'page':this.currPage,
        }
        this.loadingMore=true;
        getRecycle(listParam).then(result => {
          let res=result.data;
          this.totalRows=res.totalRows;
          this.maxPage=res.maxPage;
          this.currPage=res.currPage;
          this.hasMore = res.currPage >= res.maxPage? false : true;
          this.loadingMore=false;

          if(res.totalRows>0){
            this.noRecord.show = false;
            res.pageData.forEach(item =>{
              this.midTabName=item.remindType == 0 ? '待跟进': item.remindType == 1 ? '待成交' : item.remindType == 10 ? '@none':'' ;
              this.midTabClass=item.remindType == 0 ? 'tab_blue': item.remindType == 1 ? 'tab_orange' : item.remindType == 10 ? 'tab_none' : '';
              // 只有lastUpdateTime显示跟进时间，成交时间和跟进时间都有不显示
              let titleRight
              let valueRight
              let isShow = Boolean(item.lastUpdateTime && item.successTime)
              if(item.lastUpdateTime){
                titleRight = '最近跟进'
                valueRight = item.lastUpdateTime
              }else{
                titleRight = '最近成交'
                valueRight = item.successTime
              }

              let obj={
                id:item.id,  // 列表id
                top: item.clientName,  // 头部栏标题
                mid: [
                  {
                    midShowTab:true, //是否显示标签
                    midTabClass:this.midTabClass, //标签类名
                    midTabName:this.midTabName, //标签状态名称
                    title: item.recycleDays + '天后回收',
                    midRight: {
                      isShow: !isShow,
                      titleRight: titleRight,
                      valueRight: valueRight
                    },
                  },
                ],
                bottom: {
                  isShowAvator: false,
                  msg: {},
                  data: []
                }
              }
              this.listData.push(obj)
            })
          }else{
            this.noRecord.show = true;//是否显示缺省图
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
        this.$router.push({path:'/ClientDetails/ClientContent',query:{id:id}});
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
          &:nth-last-of-type(2){
            color: #9196A1 !important;
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
