<template>
<!-- 选项卡 -->

   <div class="qwui-crm_tab">
    <div class="qwui-crm_tabCon">
      <h1 class="qwui-crm_title" >
        销售简报（本月）
      </h1>
      <div class="crm_clear">
        <div class="qwui-crm_tabb_content qwui-crm_tabb_content_left">
          <span class="qwui-crm_tabb_content_span">{{briefingVO.lastAddBusinessNum}}</span>
          <p class="qwui-crm_tabb_content_lable">新增商机</p>
        </div>
        <div class="qwui-crm_tabb_content" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.businessTurnover}}</span>
          <p class="qwui-crm_tabb_content_lable">成交金额(万元)</p>
        </div>
        <div class="qwui-crm_tabb_content qwui-crm_tabb_content_left" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.totalFunnelNum}}</span>
          <p class="qwui-crm_tabb_content_lable">漏斗总值(万元)</p>
        </div>
        <div class="qwui-crm_tabb_content" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.expectTurnover}}</span>
          <p class="qwui-crm_tabb_content_lable">预计成交(万元)</p>
        </div>
      </div>
    </div>
  </div>



</template>

<script>
  import { getCountBriefing,getCompanyDetailList } from '../../api/client/getData'
  export default {
    name: 'crm_tab',
    data() {
      return{
        keyword:{
          startTime:'',
          endTime:''
        },        
        tabContents: [{}, {}, {}], //本季和本年, 用来判断是否以及获取过数据
        briefingVO: {
          businessTurnover: 0,
          expectTurnover: 0,
          lastAddBusinessNum: 0,
          totalFunnelNum: 0
        },
        num: 0,
        date: ''
      }
    },
    created() {
      this.initDate();
      // 默认加载本月数据
      this.getDataMonth();
    },
    methods: {
      initDate() {
        var date = new Date(),
        month = date.getMonth() + 1,
        strMonth = month >= 10? month: "0" + month;
        this.date = ''+date.getFullYear()+'-'+strMonth;
      },

      // 点击本月
      getDataMonth:function() {
        this.keyword.startTime = this.date;
        this.keyword.endTime = this.date;
        getCountBriefing(this.keyword, (data)=> {
          this.briefingVO = data.briefingVO;
          this.tabContents[0] = data.briefingVO;
        })
      },
      // 点击本季度
      getQuarterMonth:function() {// 获得季度开始月份跟结束月份
        var arr = this.date.split('-'),
            year = arr[0],
            month = arr[1],
            startMonth,
            endMonth;

        if(month <=3 ){
            startMonth = '01';
            endMonth = '03';
        }else if(3 < month && month <= 6){
            startMonth = '04';
            endMonth = '06';
        }else if(6 < month && month <= 9){
            startMonth = '07';
            endMonth = '09';
        }else{
            startMonth = '10';
            endMonth = '12';
        }
        this.keyword.startTime = year + '-'+ startMonth;
        this.keyword.endTime = year + '-'+ endMonth;
        return getCountBriefing(this.keyword, (data) => {
          this.tabContents[1] = data.briefingVO;
        });
      },
      // 点击本年
      getDataYear:function() {
        var arr = this.date.split('-');
        this.keyword.startTime = ''+arr[0]+'-01';
        this.keyword.endTime = ''+arr[0]+'-12';
        arr = null;
        return getCountBriefing(this.keyword, (data) => {
          this.tabContents[2] = data.briefingVO;;
        });
      },
  
    }
  }

</script>
<style lang="scss" scoped>
@import '../../crmBase.scss';
.qwui-crm_title{
    padding: rem(32) 0 rem(16) 0;
    line-height: rem(22);
    color: #0A1735;
    font-size: rem(16);
    font-weight: normal;
  }
</style>
<style type="text/css" scoped>
  .wrap{
    background:#fff;
  }
  .crm-tab{
    text-align: center;
    width:72%;
    margin:0 auto;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(66,194,126,1);
  }  
  .crm-tab:first-child{
    border-left:none;
  }
  .qwui-crm_tab_nav{
    display:inline-block;
    width:33.3333%;
    height:33px;
    text-align: center;
    border-left:1px solid rgba(66,194,126,1);
    font:14px PingFangSC-Regular;
    color:rgba(66,194,126,1);
    line-height:32px;
    box-sizing: border-box;
    cursor:pointer;
  }
  .active{
    color:#fff;
    background:rgba(66,194,126,1)
  }
  .qwui-crm_tab{    
    box-sizing: border-box;
    padding: 0 12px;
    background: #fff;
  }
  .qwui-crm_tabtext{
    font-size:14px;
    font-family:PingFangSC-Regular;
    line-height: 30px;
  }
  .qwui-crm_tabb_content{
    float: left;
    width: 48.5%;
    margin: 6px 0;
    text-align: left;
    text-indent: 2em;
    padding: 12px 0;
    background-color: #F7F8FA;
    border-radius: 4px;
  }
  .qwui-crm_tabb_content_left{
    margin-right: 3%;
  }  
  .qwui-crm_tabb_content_lable{
    font-size:13px;
    font-family:PingFangSC-Regular;
    color:#B2B9C8;
    line-height:14px;
    margin-top:3px;
  }
  .qwui-crm_tabb_content_span{
    font-size:15px;
    font-family:PingFang-SC-Medium;
    color:#0A1735;
    line-height:25px;
  }
  .crm_clear{
    overflow: hidden;
  }
</style>
