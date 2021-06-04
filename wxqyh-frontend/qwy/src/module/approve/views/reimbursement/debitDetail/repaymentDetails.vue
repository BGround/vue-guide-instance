<template>
  <div class="repayment_detail">
    <div class="repayment_detail_list border_bottom">
      <p class="repayment_detail_item"><span class="name">还款日期</span> {{ repayObj.repayDate|| '-'}}
        <span v-if="!isBeOver" class="tips">剩余 <span class="days">{{remainDays}} </span>天</span>
        <span v-if="isBeOver" class="tips">已逾期 <span class="days">{{remainDays}} </span>天</span>
      </p>
      <p class="repayment_detail_item"><span class="name">待还金额</span> {{('￥'+repayObj.surplusMoney)||'-'}}</p>
      <p class="repayment_detail_item"><span class="name">已还金额</span> {{('￥'+repayObj.amountReturned)||'-'}}</p>
    </div>
    <!--列表-->
    <data-table :headData="headData"
                :dataList="detailList">
    </data-table>
  </div>
</template>
<script>
  import dataTable from '@/components/Table/dataTable.vue';
  export default {
    data() {
      return {
        remainDays:'',//剩余还款天数
        detailList:[],
        headData: {
          middle: [  //头部栏设置
            {
              title: "时间",   //标题名称(必传)
              key: "time",   // 数据字段名称(必传)
              width: 150,         //标题栏宽度(必传)
              textAlign: '', //数据文字方向(可选)：不传默认为left  值：left center right
            },
            {
              title: "状态",
              key: "status",
              width: 150
            },
            {
              title: "操作人",
              key: "operatorName",
              width: 150
            },
            {
              title: "金额",
              key: "money",
              width: 150,
              style:{
//                color:'#F76161',
                textAlign: 'right',
              }
            },
          ],
          right: {   //操作栏设置
            isShowOperate: false  //是否显示操作栏
          }
        },
      }
    },
    props: {
      repayObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isBeOver:{
        type:Boolean,
        default:false,//是否逾期
      },
    },
    components: {
      dataTable,
    },
    created(){
      // 获取剩余还款天数
      this.remainDays= this.getOffsetDays(Date.now(),new Date(this.repayObj.time).getTime());
    },
    mounted(){
      let detailVOS = this.repayObj.detailVOS;
      detailVOS.forEach(function(item,index){
         if(item.status.indexOf('驳回')>-1){
           item.key='money';
           item.style = {
             color:'#F76161',
             textAlign:'right',
           };
         }
      })
      this.detailList=detailVOS;
    },
    methods: {
      getOffsetDays(time1, time2) {
        let offsetTime = Math.abs(time1 - time2);
        return Math.floor(offsetTime / (3600 * 24 * 1e3)) + 1;
      }
    }
  }
</script>
<style scoped>
  .repayment_detail_list{
    padding: 20px;
    margin-bottom: 30px;
    word-break: break-all;
  }
  .repayment_detail_item{
    margin-bottom: 10px;
  }
  .repayment_detail_item .name{
    display: inline-block;
    width: 125px;
    color:#888;
  }
  .tips{
    margin-left: 15px;
  }
  .days{
    color:#F87B00;
  }
  .border_bottom{
    border-bottom: 1px solid #ccc;
  }
</style>
