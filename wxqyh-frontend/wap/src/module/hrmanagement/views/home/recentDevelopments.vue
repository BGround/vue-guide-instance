<template>
    <div class="qwui-recent_developments">
        <div class="recent_content">
            <div class="recent_header">
                <div class="recent_head">
                    <div class="recent_headPortrait">
                    <img :alt="$t('i18n.headPortrait')" 
                         :src="workStatus.headPic">
                    <div class="rencent_hiddin">
                        <p>Hi</p>
                        <p class="greeting">{{ greeting }}！{{ workStatus.userName }}</p>
                    </div>
                    </div>
                </div>
                <div class="today_wait"
                     @click="goTodayWait">
                    <span>今日待办</span><i class="arrow"></i>
                </div>
            </div>
            <div class="recent_footer" v-if="isHasOffice" @click="goToCheckWork">
                <p>昨日工作 <span>{{ workStatus.workTime }}</span> 小时</p>
                <p class="workStatus" :class="workType[workStatus.workType-1]"></p>
            </div>
            <div class="recent_footer" v-if="!isHasOffice">
                <p>昨日工作 -- 小时</p>
                <p>尚未安装企微云办公，<span class="goToOffice" @click="goToOffice">去安装<i class="arrow"></i></span></p>
            </div>
        </div>
    </div>
</template>
<script>
import { getYesterdayWorkStatus,getIsHasOffice } from '../../api/getData';


export default {
    name:'recentDevelopments',
    data(){
      return {
        workStatus:{
          workType: 4,    //昨日考勤状态
          workTime: 0,    //昨日考勤时间
          userName: "",   //用户名
          headPic: require('assets/images/touxiang02.png'),    //用户头像
          nowTime: "",    //当前服务器时间
          yesterdayYMD:""
        },
        greeting: "",     //问候语
        workType: ['work_normal','work_abnormal','leave','rest'],  
        isHasOffice:false,
      }
    },
    created(){
      this._getWorkerSituation();  //获取用户信息以及昨日考勤信息
    },
    methods:{
      _getWorkerSituation(){
        let _this = this;
        getIsHasOffice({agentCodes:"meetingassistant"},data=>{
            _this.isHasOffice=data.list[0].isTrust;
        })
		getYesterdayWorkStatus({},data =>{
          _this.workStatus=data;
          if(_this.workStatus.headPic==''||_this.workStatus.headPic=='0'){
            _this.workStatus.headPic=require("assets/images/touxiang02.png");
          }
          let now=(_this.workStatus.nowTime).split(":");
          let nowHour=parseInt(now[0]);
          let hours=[6,11,15,19,22];
          let greetings=["深夜好","早上好","中午好","下午好","晚上好"];
          for(let i=0;i<hours.length;i++){
            if(nowHour<hours[i]){
              _this.greeting=greetings[i];
              return;
            }        
          }
          _this.greeting=greetings[0];
        });
      },
      goTodayWait(){
        window.location.href= _.baseURL+"/vp/module/waittask.html?corp_id="+window.wxqyhConfig.orgConfigInfo.corpId+"&agentCode="+dataBase.wxqyh_uploadfile.agent+"#/";
      },
      goToCheckWork(){
          window.location.href= _.baseURL+"/jsp/wap/checkwork/calendarDetail.jsp?agentCode=checkwork&abc=1&searchDate="+this.workStatus.yesterdayYMD;
      },
      goToOffice(){
          if(!_.isMobileApp() && (_.isQiyeweixin() || _.isWeChat())){
              window.location.href="http://qy.do1.com.cn/qwy/qiweipublicity/experience2/step_suite.html?code=tj3adffe72e54c0f4c";
          }
          else{
              window.location.href="https://open.work.weixin.qq.com/3rdservice/wework/register?permanent_reg_code=wx1a55799d492290c4086f58e0a54018c80d95da14b017dc2b&notretry=yes";
          }
      }
    }
}
</script>
<style lang='scss' scoped>
    .qwui-recent_developments {
        font-family:PingFangSC-Regular;
        margin-bottom: 60px;
        height: 70px;
        padding:20px 14px 0px 14px;
        background: url(~assets/images/rectangle.svg) #fff no-repeat top left;
        background-size: 100%;
    }

    .recent_content {
        background:rgba(255,255,255,1);
        border-radius: 6px;
        box-shadow:0px 2px 8px 0px rgba(0,0,0,0.1);
    }

    .recent_header {
        display: flex;
        height: 62px;
        justify-content: space-between;
        align-items: center;
        padding:7px 0 7px 17px;
        border-radius: 6px 6px 0 0;
        box-shadow:0px 1px 0px 0px rgba(247,247,247,1);

        .recent_head {
            margin-right: 28px;  
            flex:1;
            overflow: hidden;     
        }

        .recent_headPortrait {
            display: flex;
            align-items: center;

            img {
                width: 47px;
                height: 47px;
                border-radius: 50%;
                margin-right: 11px;
            }

            .rencent_hiddin {
                flex:1;
                overflow: hidden;
             }
        }

        p {
        color: #7A7C80;
        font-size: 14px;
        height: 20px;
        }

        p:nth-child(2){
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
    }

    .today_wait {
        width: 92px;
        height: 30px;
        box-sizing: border-box;
        line-height: 30px;
        text-align: right;
        background-color: RGBA(85, 133, 240, 0.12);
        border-radius:100px 0 0 100px;
        font-size: 13px;
        color: #648EEC;

        span{
            display: inline-block;
            line-height: 18px;
            font-size: 13px;
            height: 18px;
        }

    }

        .arrow{
        height: 10px;
        width:10px;
        background: url(~assets/images/hr_icon_blue_arrow.png) no-repeat;
        background-size: contain;
        margin: 0 12px 0 4px;
        display: inline-block;
    }

    .recent_footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 13px 0 13px 15px;
        border-radius:0 0 6px 6px;
        
        p {
            font-size:13px;
            color: #7A7C80;
            height: 18px;
            line-height: 18px;

        span {
            color: #0A1735;
            font-size: 20px ;
            font-weight:500;
            height: 28px;
            display: inline-block;
        }
        }

        .workStatus{
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background-image: url(~assets/images/hr_icon_hrwork_status.png) ;
            margin-right: 14px;
            background-size: 68px 16px;
        }

        .goToOffice{
            display: inline-block;
            height:18px;
            font-size:13px;
            color:#5585F0;
            line-height:18px;
        }
    }

    p:nth-child(2) {
        word-wrap:break-word;
        word-break:break-all;
    }

    .work_normal {
        background-position: -68px 0;
    }

    .work_abnormal {
        background-position: -26px 0;
    }

    .leave {
        background-position: -52px 0;
    }

    .rest{
        display: none;
    }
</style>


