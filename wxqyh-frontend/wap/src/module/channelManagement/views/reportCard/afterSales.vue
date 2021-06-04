<template>
  <div class="report-card-of-after-sales">
     <qw-water-mark :content="getUserName" :font="14" :opacity="0.15">
    <dealerInfo :data="convertDealerData(serviceInfo)"></dealerInfo>
    <div class="gutter"></div>
    <performanceReward :data="serviceInfo"></performanceReward>
    <div class="gutter"></div>
    <completionStatus :data="sparePart"></completionStatus>
    <div class="gutter"></div>
    <evaluationResult :data="indicatorInfo"></evaluationResult>
    <div class="gutter"></div>
    <statisticsSuggestion :data="indicatorInfo" />
    <div class="gutter"></div>
    <div class="description">
      <span>成绩单说明</span>
      <span @click="handleClickCheckBtn">查看</span>
    </div>
    <div class="gutter"></div>

    <excitation title="日常激励汇总" :data="stimulateInfo"></excitation>
    <div class="gutter"></div>
    <warZoneOpinion v-if="isShowForm" :info="serviceInfo" :planList="planList" @updateStatus="handleUpdateStatus"></warZoneOpinion>
<!--    <div class="gutter"></div>-->
<!--    <dealerFeedback-->
<!--      :feedback="feedback"-->
<!--      @submit="handleSubmitManagerOpinion"-->
<!--      :info="serviceInfo"-->
<!--      v-if="isGeneralManagerRole"-->
<!--    ></dealerFeedback>-->
<!--    <div class="gutter"></div>-->
<!--    <directorFeedback-->
<!--      :files="files"-->
<!--      :imgs="imgs"-->
<!--      :reportCardId="reportCardId"-->
<!--      @submit="handleSubmitDirectorFile"-->
<!--      :info="serviceInfo"-->
<!--      v-if="isServiceDirectorRole"-->
<!--    ></directorFeedback>-->

    <qw-popup v-model="visible.center" position="center">
      <div class="demo-popup demo-popup-center">
        <div class="content" v-html="content"></div>
      </div>
    </qw-popup>
     </qw-water-mark>
  </div>
</template>

<script>
import dealerInfo from "@/module/channelManagement/components/reportCard/dealerInfo";
import performanceReward from "@/module/channelManagement/components/reportCard/performanceReward";
import completionStatus from "@/module/channelManagement/components/reportCard/completionStatus";
import evaluationResult from "@/module/channelManagement/components/reportCard/evaluationResult";
import statisticsSuggestion from "@/module/channelManagement/components/reportCard/statisticsSuggestion";
import excitation from "@/module/channelManagement/components/reportCard/excitation";
import feedback from "@/module/channelManagement/components/reportCard/feedback";
import dealerFeedback from "@/module/channelManagement/components/reportCard/dealerFeedback";
import warZoneOpinion from "@/module/channelManagement/components/reportCard/warZoneOpinion";
import directorFeedback from "@/module/channelManagement/components/reportCard/directorFeedback";
//战区负责人保存整改意见, 总经理确认查阅保存投资人意见, 保存服务总监上
import {
  getSalesAfetrReportById,
  getSalesReportExplain,
  // saveRemediationAction,
  // saveMannagerFeedback,
  // saveFeedback
} from "@/module/channelManagement/api/reportCard";

export default {
  components: {
    dealerInfo,
    performanceReward,
    completionStatus,
    evaluationResult,
    statisticsSuggestion,
    excitation,
    feedback,
    warZoneOpinion,
    dealerFeedback,
    directorFeedback
  },
  data() {
    return {
      serviceInfo: {},
      indicatorInfo: [],
      stimulateInfo: [],
      sparePart: [],
      content: "",
      visible: {},
      files: [],
      imgs: [],
      feedback: "",
      isDisabledFeedback: false,
      reportCardId: "",
      managerCheckStatus: "",
      chiefCheckStatus: "",
       dataBase: dataBase,
        planList: [],
    };
  },
  computed: {

      isGeneralUser(){
          return this.serviceInfo.personRole === 0;
      },

      isWarZoneLeader(){
          return this.serviceInfo.personRole === 1;
      },

      isManager(){
          return this.serviceInfo.personRole === 2;
      },

      isServiceDirector(){
          return this.serviceInfo.personRole === 3;
      },

      isShowForm() {

          if(this.isGeneralUser){
              return false;
          }
          //0：未提交 1：已提交 2：总经理审批 3：服务总监审批 4：全部审批完成 5：已完成
          const approvalStatus = this.serviceInfo.approvalStatus;
          console.log(this.serviceInfo.personRole, 're', approvalStatus)
          if(this.isWarZoneLeader){
              return true;
          }

          if(this.isManager && [1, 2, 3, 4, 5].includes(approvalStatus)){
              return true;
          }

          if(this.isServiceDirector && [1, 2, 3, 4, 5].includes(approvalStatus)){
              return true;
          }

      },

    getUserName(){
      return this.dataBase && this.dataBase.config && this.dataBase.config.personName ? this.dataBase.config.personName :''
    }
  },
  methods: {
    // 保存战区意见
    handleSubmitwarZoneOpinion(form) {
      // this.$confirm("提示", "是否确认将本成绩单及整改要求发送给经销商？")
      //   .then(() => {
      //     const params = Object.assign({}, { id: this.reportCardId }, form);
      //     saveRemediationAction(params).then(data => {
      //       if (data) {
      //         this.$toast('操作成功')
      //         this.$router.back();
      //       }
      //     });
      //   })
      //   .catch(() => {});
    },

    handleSubmitManagerOpinion(form) {
      // const params = Object.assign({}, { id: this.reportCardId }, form);
      // saveMannagerFeedback(params).then(data => {
      //   if (data) {
      //     this.$toast('操作成功')
      //     this.$router.back();
      //   }
      // });
    },

    handleSubmitDirectorFile({ fileNames, files, imgs }) {
      const body = {};
      Object.keys(this.serviceInfo).forEach(key => {
        body["serviceInfoVO." + key] = this.serviceInfo[key];
      });

      const params = {
        id: this.serviceInfo.id,
        fileNames: fileNames,
        files: files || [],
        imgs: imgs || []
      };

      saveFeedback(params).then(data => {
        if (data) {
          this.$toast('操作成功')
          this.$router.back();
        }
      });
    },

    handleClickCheckBtn() {
      this.$set(this.visible, "center", true);
    },
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === "[object Object]";
      return isObject && !!Object.keys(target).length;
    },

    convertDealerData(service) {
      if (!this.isNonEmptyObject(service)) {
        return {};
      }
      const statusMap = ["未发送", "已读", "未读", "已反馈",'', '已完成'];
      return {
        name: `${service.serviceFullName}${service.year}年${service.quarter}季度成绩单`,
        date: `发布日期：${service.year}年${service.quarter}季度`,
        statusText: statusMap[service.lookOverStatus],
        statusColor: service.readStatus === "2" ? "#06ACFF" : "#C6001F",
        avatar: "",
        extra: [
          {
            label: "服务ERP",
            value: service.serviceErp || "-"
          },
          {
            label: "性质",
            value: service.property || "-"
          },
          {
            label: "月均进站台次",
            value: service.intoPlatformCount || "-"
          }
        ]
      };
    },

      handleUpdateStatus(lookOverStatus){
          this.$set(this.serviceInfo, 'lookOverStatus', lookOverStatus);
      }
  },
  created() {
    const id = this.$route.query.id || "";
    getSalesAfetrReportById({ id: id }).then(data => {
      if (data) {
          // data.serviceInfo.approvalStatus = 4; //0：未提交 1：已提交 2：总经理审批 3：服务总监审批 4：全部审批完成 5：已完成
          // data.serviceInfo.personRole = 1; //0 普通用户 1战区负责人 2总经理 3 服务总监
          // data.serviceInfo.isNeed = 1;
          // data.serviceInfo.exitReason = '2222';

        this.serviceInfo = data.serviceInfo || {};
        this.indicatorInfo = data.indicatorInfo || [];
        this.stimulateInfo = data.stimulateInfo || {};
        this.sparePart = data.sparePart || [];
        this.files = data.serviceInfo.reportFiles || [];
        this.imgs = data.serviceInfo.reportImgs || [];
        // this.isDisabledFeedback =
        // data.serviceInfo && data.serviceInfo.lookOverStatus === "3"; // 已反馈
        this.feedback = data.serviceInfo.feedback || "";
        this.reportCardId = data.serviceInfo.id || "";
        this.managerCheckStatus = data.serviceInfo.managerCheckStatus || ""; // 1 有投资意见 0 无投资意见
        this.chiefCheckStatus = data.serviceInfo.chiefCheckStatus || ""; // 服务总监上附件 1 有 0无
        this.planList = data.planVOList || [];
      }
    });
    getSalesReportExplain().then(data => {
      if (data.explain) {
        this.content = data.explain.content;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.report-card-of-after-sales {
  /deep/ .qw-water-mark__list{
    pointer-events:none
  }
  .gutter {
    height: 10px;
    background: rgba(247, 247, 247, 1);
  }
  .content {
    background: #ffffff;
    width: 350px;
    height: 60vh;
  }
  .description {
    background: #ffffff;
    height: 40px;
    padding: 10px 0;
    height: 20px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #000;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
    align-items: center;
    display: flex;
  }
  .content {
    padding: 10px;
  }
}
</style>
