<template>
  <div class="wrap">
    <div class="warp-no-data"  v-show="!hasData">
				<i class="icon-no-data icon-daiban"></i>
				<p class="noDataTitle">还没有关联应用</p>
				<p class="f-color-aaa">“我的待办”会自动关联已安装的企微应用<br/>
					将它们的待办事项统一展示，方便管理
				</p>
		</div>
    <div class="waittaskDiv" v-show="hasData">
      <div class="waittaskheadDiv">
          <div class="headItem" v-for="item in waittaskListShow" :key="item.id">
            <a :href="gotoUrl(item)">
            <img :src="item.img">
            <p>{{item.name}}</p>
            <span class="waitCont" v-if="item.waitCount">{{item.waitCount}}</span>
            </a>
          </div>
      </div>
      <div class="middleTitle" v-show="qyService">企业服务</div>
      <div class="waittaskfootDiv" v-show="qyService">
        <div class="headItem" v-for="item in footerWaitListShow" :key="item.id">
            <a :href="gotoUrl(item)">
            <img :src="item.img">
            <p>{{item.name}}</p>
            <span class="waitCont" v-if="item.waitCount">{{item.waitCount}}</span>
            </a>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { getAppOpenStatus } from '../api/getData';

const dynamicImg = require("@/assets/svg/ic_a-xwgg.svg");
const productinfoImg = require("@/assets/svg/ic_a-zsbk.svg");
const formImg = require("@/assets/svg/ic_a-bdlc.svg");
const askImg = require("@/assets/svg/ic_a-qjcc.svg");
const diaryImg = require("@/assets/svg/ic_a-gzrz.svg");
const taskImg = require("@/assets/svg/ic_a-rwfp.svg");
const meetingassistantImg = require("@/assets/svg/ic_a-hyzs.svg");
const moveapproveImg = require("@/assets/svg/ic_a-spqs.svg");
const expressImg = require("@/assets/svg/ic_a-ankd.svg");
const reimbursementImg = require("@/assets/svg/ic_a-fkbx.svg");
const topicImg = require("@/assets/svg/ic_a-tssq.svg");
const carImg = require("@/assets/svg/ic_a-qyyc.svg");
const crmImg = require("@/assets/svg/ic_a-crm.svg");
const examinationImg = require("@/assets/svg/ic_a-pxks.svg");
const checkworkImg = require("@/assets/svg/ic_a-kqdk.svg");
const contractImg = require("@/assets/svg/ic_a-htgl.svg");
const activityImg = require("@/assets/svg/ic_a-qyhd.svg");
const hrmanagementImg = require("@/assets/svg/ic_a-rskh.svg");
const liuliangImg = require("@/assets/images/ic_llcz.png");
const didiImg = require("@/assets/svg/ic_a-qycx.svg");

export default{
    name:"waittaskList",
    data(){
      return{
        waittaskList:{
          dynamic:{
            id:"dynamic",
            name:"新闻公告",
            img:dynamicImg,
            urlOne:_.baseURL+"/jsp/wap/dynamicinfoManage/dynamicinfo_list.jsp?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&t=4&status=1&schType=8&agentCode=dynamic",
            urlTwo:_.baseURL+"/jsp/wap/dynamicinfoManage/dynamicinfo_list.jsp?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&t=1&status=1&agentCode=dynamic&abc=1",
            waitCount:""
          },
          productinfo:{
            id:"productinfo",
            name:"知识百科",
            img:productinfoImg,
            urlOne:_.baseURL+"/jsp/wap/product/product_list.jsp?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=productinfo&type=2&abc=1",
            urlTwo:_.baseURL+"/jsp/wap/product/product_list.jsp?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=productinfo&type=3&abc=1",
            waitCount:""
          },
          form:{
            id:"form",
            name:"表单流程",
            img:formImg,
            urlOne:_.baseURL+"/jsp/wap/form/audit_list.jsp?type=1&status=1&agentCode=form",
            urlTwo:_.baseURL+"/jsp/wap/form/form_diy.jsp?agentCode=form&abc=1",
            waitCount:""
          },
          ask:{
            id:"ask",
            name:"请假出差",
            img:askImg,
            urlOne:_.baseURL+"/jsp/wap/ask/todo_list.jsp?agentCode=ask&abc=1",
            urlTwo:_.baseURL+"/jsp/wap/ask/list.jsp?type=1&status=all&agentCode=ask&abc=1",
            waitCount:""
          },
          diary:{
            id:"diary",
            name:"工作日志",
            img:diaryImg,
            urlOne:_.baseURL+"/vp/module/diary.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=diary&type=2&status=1#/",
            urlTwo:_.baseURL+"/vp/module/diary.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=diary&type=1&status=1#/",
            waitCount:""
          },
          task:{
            id:"task",
            name:"任务申请",
            img:taskImg,
            urlOne:_.baseURL+"/vp/module/taskAssignment.html?agentCode=task&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            urlTwo:_.baseURL+"/jsp/wap/task/task_index.jsp?agentCode=task&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            waitCount:""
          },
          meetingassistant:{
            id:"meetingassistant",
            name:"会议助手",
            img:meetingassistantImg,
            urlOne:_.baseURL+"/jsp/wap/meeting/meeting_index.jsp?type=2&status=1&agentCode=meetingassistant",
            urlTwo:_.baseURL+"/jsp/wap/meeting/meeting_index.jsp",
            waitCount:""
          },
          moveapprove:{
            id:"moveapprove",
            name:"审批请示",
            img:moveapproveImg,
            urlOne:_.baseURL+"/vp/module/moveapprove.html?agentCode=moveapprove&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            urlTwo:_.baseURL+"/vp/module/moveapprove.html?agentCode=moveapprove&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            waitCount:""
          },
          express:{
            id:"express",
            name:"拿快递",
            img:expressImg,
            urlOne:_.baseURL+"/jsp/wap/express/list.jsp?status=0&agentCode=express&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            urlTwo:_.baseURL+"/jsp/wap/express/list.jsp?status=0&agentCode=express&corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):''),
            waitCount:""
          },
          reimbursement:{
            id:"reimbursement",
            name:"费控报销",
            img:reimbursementImg,
            urlOne:_.baseURL+"/jsp/wap/reimbursement/reimbursement_index.jsp?type=2&status=0&agentCode=reimbursement",
            urlTwo:_.baseURL+"/jsp/wap/reimbursement/reimbursement_index.jsp?agentCode=reimbursement&abc=1",
            waitCount:""
          },
          topic:{
            id:"topic",
            name:"同事社区",
            img:topicImg,
            urlOne:_.baseURL+"/jsp/wap/topic/unRead_list.jsp",
            urlTwo:_.baseURL+"/jsp/wap/topic/all_topic_list.jsp?agentCode=topic&abc=1",
            waitCount:""
          },
          car:{
            id:"car",
            name:"车辆管理",
            img:carImg,
            urlOne:_.baseURL+"/jsp/wap/car/taskList.jsp",
            urlTwo:_.baseURL+"/jsp/wap/car/car_index.jsp",
            waitCount:""
          },
          crm:{
            id:"crm",
            name:"移动CRM",
            img:crmImg,
            urlOne:_.baseURL+"/vp/module/crm.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=crm#/",
            urlTwo:_.baseURL+"/vp/module/crm.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=crm#/",
            waitCount:""
          },
          examination:{
            id:"examination",
            name:"考试评测",
            img:examinationImg,
            urlOne:_.baseURL+"/jsp/wap/examination/exam_index.jsp",
            urlTwo:_.baseURL+"/jsp/wap/examination/exam_index.jsp?agentCode=examination&abc=1",
            waitCount:""
          },
          checkwork:{
            id:"checkwork",
            name:"考勤打卡",
            img:checkworkImg,
            urlOne:_.baseURL+"/jsp/wap/checkwork/rep_list.jsp?type=1&recType=2&agentCode=checkwork&abc=1",
            urlTwo:_.baseURL+"/jsp/wap/checkwork/add.jsp?agentCode=checkwork&abc=1",
            waitCount:""
          },
          contract:{
            id:"contract",
            name:"合同流程",
            img:contractImg,
            urlOne:_.baseURL+"/vp/module/crm.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=contract#/contractList/isread?submitStatus=1&auditType=3&contractOwner=3",
            urlTwo:_.baseURL+"/vp/module/crm.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=contract#/contractList/isread?submitStatus=1&contractOwner=3",
            waitCount:""
          },
          activity:{
            id:"activity",
            name:"活动报名",
            img:activityImg,
            urlOne:_.baseURL+"/vp/module/culture.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&status=3&agentCode=activity&abc=1#/activityList",
            urlTwo:_.baseURL+"/vp/module/culture.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=activity&abc=1#/activityList",
            waitCount:""
          },
          hrmanagement:{
            id:"hrmanagement",
            name:"人事管理",
            img:hrmanagementImg,
            urlOne:_.baseURL+"/vp/module/hrmanagement.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=hrmanagement",
            urlTwo:_.baseURL+"/vp/module/hrmanagement.html?corp_id="+(_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'')+"&agentCode=hrmanagement",
            waitCount:""
          },
          didi:{
            id:"didi",
            name:"企业出行",
            img:didiImg,
            urlOne:_.baseURL+"/jsp/wap/didi/diditrade.jsp",
            urlTwo:_.baseURL+"/jsp/wap/didi/diditrade.jsp",
            waitCount:""
          },
          liuliang:{
            id:"liuliang",
            name:"流量充值",
            img:liuliangImg,
            urlOne:_.baseURL+"",
            urlTwo:_.baseURL+"",
            waitCount:""
          }
        },
        qyService:false,
        hasData:true,
        waittaskListShow:[],
        footerWaitListShow:[],
        item:{
          id:"",
          name:"",
          img:"",
          urlOne:"",
          urlTwo:"",
          waitCount:""
        },
        isShowDidi:false,
        // 托管应用集合
        trustObj:'',
        // 企微云办公应用
        officeApp:['ask','dynamic','meetingassistant','moveapprove','checkwork','reimbursement','car'],
        // 企微云文化应用
        cultureApp:['activity','survey','topic'],
        // 已执行的请求数
        requestNum:0
      }
    },
    computed:{

    },
    created:function(){
      let seft = this;
      // 企微云办公开启应用
      getAppOpenStatus({
        parentAgentCode:'meetingassistant'
      },(data)=>{
        this.requestNum += 1;
        data.customAgentList.forEach((item)=>{
          if (item.agentStatus == 1){
            let index = seft.officeApp.indexOf(item.agentCode);
            if (index != -1){
              seft.officeApp.splice(index,1);
            }
          }
        })
      });
      // 企微云文化开启应用
      getAppOpenStatus({
        parentAgentCode: 'activity',
        belongAgent: 'activity'
      },(data)=>{
        this.requestNum += 1;
        data.customAgentList.forEach((item)=>{
          if (item.agentStatus == 1){
            let index = seft.cultureApp.indexOf(item.agentCode);
            if (index != -1){
              seft.cultureApp.splice(index,1);
            }
          }
        })
      });
      // 当所有接口请求完毕再调用待办的接口
      let timer = setInterval(()=>{
        this.trustObj = JSON.parse(localStorage.getItem('titleCache' + _.userId));
        if (this.trustObj && this.requestNum == 2){
          this.loadWaitTask();
          clearInterval(timer);
        }
      },100);

    },
    methods:{
      gotoUrl(item){
        var toUrl;
        if(item.waitCount > 0){
          toUrl = item.urlOne;
        }else{
          toUrl = item.urlTwo;
        }
        return toUrl;
      },
      loadWaitTask(){
        var _this = this;
        _.showLoading();
        _.ajax({
          type:"post",
          url:_.baseURL+dataBase.getWaitListUrl,
          data:{},
          success:function(result){
            if(result.code == "0"){
              var list=result.data.list;
              if(list){
                if(list.length > 0) {
                        for(var i=0;i<list.length;i++){
                          // 已托管且应用已开启
                          if (list[i].agentCode in _this.trustObj && _this.officeApp.indexOf(list[i].agentCode) < 0 && _this.cultureApp.indexOf(list[i].agentCode) < 0){
                            _this.waittaskListShow.push(_this.waittaskList[list[i].agentCode]);
                            // 用户自定义应用名称
                            _this.waittaskList[list[i].agentCode].name = list[i].agentCodeName;
                            // 用户自定义应用图标
                            if (list[i].squareLogoUrl){
                              _this.waittaskList[list[i].agentCode].img = list[i].squareLogoUrl;
                            }
                            if(list[i].waitCount>0){
                              _this.waittaskList[list[i].agentCode].waitCount = list[i].waitCount;
                            }
                            if(list[i].agentCode == "car"){
                              _this.qyService = true;
                              _this.footerWaitListShow.push(_this.waittaskList.didi);
                            }
                          }
                        }
                      }else{
                        _this.hasData = false;
                      }
              }
              _.hideLoading();
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  .wrap {
    background: #fff;
    height: 100%;
  }
  .waittaskDiv {
    margin-top: 30px;
    background: #fff;
  }
  .headItem {
    position: relative;
    display: inline-block;
    width:25%;
    height:94px;
  }
  .headItem a {
    position: absolute;
    width: 60%;
    height: 60%;
    right: 20%;
    top: 20%;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    display: inline-block;
    text-decoration: none;
    z-index: 999;
  }
  .headItem img {
    display: block;
    width: 44px;
    height: 44px;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 3px 6px #14000000;
  }
  .headItem p {
    display: block;
    padding-top: 10px;
    font-size: 13px;
    color: #2E3952;
  }
  .waitCont {
    position: absolute;
    top: -10px;
    margin-left: 9px;
    height: 18px;
    line-height: 18px;
    background: #EB5342;
    padding: 0 5px;
    color: #fff;
    font-size: 15px;
    text-align: center;
    border-radius: 9px;
  }
  .middleTitle {
    position: relative;
    margin-top: 30px;
    height: 40px;
    line-height: 40px;
    padding-left:20px;
    font-size: 14px;
    background: #F7F8FA;
    color: #7A7D80;
  }
  .icon-no-data{
    width: 80px;
    height: 80px;
    display: inline-block;
  }
  .icon-daiban{
    background: url("../../../assets/images/icon_daiban.png") no-repeat center;
    background-size: 70px 70px;
  }
  .warp-no-data{
    margin: 115px 25px 0;
    text-align: center;
  }
  .noDataTitle {
    margin-top: 20px;
    color: #666;
    font-size: 20px;
  }
  .f-color-aaa {color: #aaa;}
</style>
