<template>
  <div id="personalData" class="wrap">
    <div v-if="unsync">
      <!-- 头部卡片 -->
      <div class="qwui-top_card">
        <img
          v-if="baseInfo.headPic!='0'&& baseInfo.headPic!=''"
          :src="baseInfo.headPic"
          class="headPic"
        >
        <img class="headPic" v-else src="~assets/images/oa_person.png" alt>
        <p class="qwui-name">{{baseInfo.personName}}</p>
        <p class="qwui-dept_name">
          {{depts}}
          <i v-if="baseInfo.positionName != '-'">/ {{baseInfo.positionName}}</i>
        </p>
      </div>
      <!-- 基本信息 -->
      <div class="qwui-msg_box baseInfo">
        <div class="qwui-title">基本信息</div>
        <div class="qwui-msg_item dashed">
          <ul>
            <li class="qwui-list_box">
              <span>昵称</span>
              <p>{{baseInfo.nickName}}</p>
            </li>
            <li class="qwui-list_box">
              <span>帐号</span>
              <p>{{baseInfo.accountName}}</p>
            </li>
          </ul>
        </div>
        <div class="qwui-msg_item">
          <ul>
            <li class="qwui-list_box" v-for="(item, i) in baseInfoListText" :key="i">
              <span>{{item.textDes}}</span>
              <p>{{baseInfo[item.name]?baseInfo[item.name] : item.value}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 任职信息 -->
      <div class="qwui-msg_box jobInfo">
        <div class="qwui-title">任职信息</div>
        <div class="qwui-msg_item">
          <ul>
            <li class="qwui-list_box" v-for="(item, i) in jobInfoListText" :key="i">
              <span>{{item.textDes}}</span>
              <p v-if="item.name == 'deptName'">{{depts}}</p>
              <p v-else>{{baseInfo[item.name]?baseInfo[item.name] : item.value}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="qwui-msg_box personInfo">
        <div class="qwui-title">个人信息</div>
        <div class="qwui-msg_item">
          <ul>
            <li class="qwui-list_box" v-for="(item, i) in personInfoText" :key="i">
              <span>{{item.textDes}}</span>
              <p>{{baseInfo[item.name]?baseInfo[item.name] : item.value}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 紧急联系人 -->
      <div class="qwui-msg_box contactList">
        <div class="qwui-title">紧急联系人</div>
        <div class="qwui-msg_item" v-for="(v, j) in contactList" :key="j">
          <ul>
            <li class="qwui-list_box" v-for="(item, i) in contactListText" :key="i">
              <span>{{item.textDes}}</span>
              <p>{{v[item.name]}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 家庭成员 -->
      <div class="qwui-msg_box familyList" v-if="familyList.length !== 0">
        <div class="qwui-title">家庭成员</div>
        <div
          class="qwui-msg_item"
          v-for="(v, j) in familyList"
          :key="j"
          :class="{'dashed':j<familyList.length-1}"
        >
          <ul>
            <li class="qwui-list_box" v-for="(item, i) in familyListText" :key="i">
              <span>{{item.textDes}}</span>
              <p>{{v[item.name]}}</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 工作经历 -->
      <div class="qwui-msg_box workList">
        <div class="qwui-title borderNone">工作经历</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in workList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.startDay | formatDate}}-{{item.endDay | formatDate}}</span>
                <p class="qwui-name pd10">{{item.corpName}}</p>
                <p class="qwui-des">{{item.deptName}} / {{item.position}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 合同信息 -->
      <div class="qwui-msg_box conList">
        <div class="qwui-title borderNone">合同信息</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in conList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.startDay | formatDate}}-{{item.endDay | formatDate}}</span>
                <p class="qwui-name pd10">{{item.contractNo}} {{item._contractType_desc}}</p>
                <p class="qwui-des">{{item._dealType_desc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 教育经历 -->
      <div class="qwui-msg_box eduList">
        <div class="qwui-title borderNone">教育经历</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in eduList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.startDay | formatDate}}-{{item.endDay | formatDate}}</span>
                <p class="qwui-name pd10">{{item.eduName}}</p>
                <p class="qwui-des">{{item.eduMajor}} / {{item._eduLevel_desc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 证书 -->
      <div class="qwui-msg_box certList">
        <div class="qwui-title borderNone">证书</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in certList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.getDay}} {{item.certName}}</span>
                <p class="qwui-name pd10">
                  证书编号
                  <i class="c999">{{item.certNo}}</i>
                </p>
                <p class="qwui-des">
                  颁发机构
                  <i class="c999">{{item.publishOrgName}}</i>
                </p>
                <p class="qwui-endTime pd10">
                  到期时间
                  <i class="c999">{{item.endDay}}</i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 本单位培训记录 -->
      <div class="qwui-msg_box trainList">
        <div class="qwui-title borderNone">本单位培训记录</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in trainList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.startDay | formatDate}}-{{item.endDay | formatDate}}</span>
                <p class="qwui-name pd10">
                  培训内容
                  <i class="c999">{{item.tryContent}}</i>
                </p>
                <p class="qwui-des">
                  培训机构
                  <i class="c999">{{item.tryOrgName}}</i>
                </p>
                <p class="qwui-endTime pd10">
                  复训时间
                  <i class="c999">{{item.tryRepliDay}}</i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 本单位奖罚记录 -->
      <div class="qwui-msg_box awardsList">
        <div class="qwui-title borderNone">本单位奖罚记录</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in awardsList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-date">{{item.awardDay}}</span>
                <p class="qwui-name pd10">{{item.awardName}}</p>
                <p class="qwui-des">
                  备注
                  <i class="c999">{{item.remark}}</i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 本单位晋升记录 -->
      <div class="qwui-msg_box promoteList">
        <div class="qwui-title borderNone">本单位晋升记录</div>
        <div class="qwui-oa_process">
          <ul>
            <li class="qwui-item_box" v-for="(item, i) in promoteList" :key="i">
              <i class="circle">{{i+1}}</i>
              <div class="qwui-oa_process_main">
                <span class="qwui-title_des">
                  原岗位
                  <i class="c999">{{item.formerPost}}</i>
                </span>
                <p class="qwui-name pd10">
                  晋升岗位
                  <i class="c999">{{item.promotePost}}</i>
                </p>
                <p class="qwui-des">
                  晋升时间
                  <i class="c999">{{item.promoteTime}}</i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="unsync" v-else>
      <i class="no_data_icon"></i>
      <p class="no_data_title">人事档案未同步</p>
      <p class="no_data_desc">示例数据不支持查看人事档案
        <br>请先前往管理后台同步人事档案
      </p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "personalData",
  data() {
    return {
      unsync: true,
      params: {
        empId: ""
      },
      baseInfo: {},
      depts: "",
      contactList: [],
      familyList: [],
      workList: [],
      conList: [],
      eduList: [],
      certList: [],
      trainList: [],
      awardsList: [],
      promoteList: [],
      //基本信息
      baseInfoListText: [
        { textDes: "微信号", name: "weixin" },
        { textDes: "手机号", name: "mobile" },
        { textDes: "邮箱", name: "email" },
        { textDes: "身份证号", name: "cardId" },
        { textDes: "出生日期", name: "birthDay" },
        { textDes: "农历生日", name: "birthDayMoon" },
        { textDes: "生日祝福提醒", name: "birthNotifyType" },
        { textDes: "参加工作时间", name: "firstWorkDay" },
        { textDes: "最高学历", name: "_topEdu_desc" },
        { textDes: "毕业院校", name: "gradutionFrom" },
        { textDes: "专业", name: "eduMajor" }
      ],
      //任职信息
      jobInfoListText: [
        { textDes: "员工状态", name: "_status_desc" },
        { textDes: "员工类型", name: "_hireType_desc" },
        { textDes: "员工性质", name: "_workType_desc" },
        { textDes: "入职日期", name: "joinDay" },
        { textDes: "转正日期", name: "regularDay" },
        { textDes: "部门", name: "deptName" },
        { textDes: "职位", name: "positionName" }
      ],
      //个人信息
      personInfoText: [
        { textDes: "民族", name: "_nation_desc" },
        { textDes: "户籍", name: "huji" },
        { textDes: "户籍类别", name: "_houseType_desc" },
        { textDes: "现住址", name: "addressNow" },
        { textDes: "婚姻状况", name: "_marrType_desc" },
        { textDes: "政治面貌", name: "_policyType_desc" },
        { textDes: "身高(cm)", name: "height" },
        { textDes: "体重(kg)", name: "weight" }
      ],
      //紧急联系人
      contactListText: [
        { textDes: "姓名", name: "name" },
        { textDes: "与本人关系", name: "_refType_desc" },
        { textDes: "电话", name: "mobile" },
        { textDes: "地址", name: "address" }
      ],
      //家庭成员
      familyListText: [
        { textDes: "姓名", name: "name" },
        { textDes: "与本人关系", name: "_refType_desc" },
        { textDes: "工作单位", name: "orgName" },
        { textDes: "职位", name: "orgPosition" },
        { textDes: "电话", name: "mobile" }
      ]
    };
  },
  created() {
    this.params.empId = this.$route.query.empId;
    this.getPersonalData();
  },
  methods: {
    getPersonalData() {
      _.showLoading("");
      axios
        .post(
          _.baseURL + "/portal/empinfPotalAction!viewInfoById.action",
          this.params
        )
        .then(result => {
          if (result.code == "0") {
            _.hideLoading();
            let data = result.data;
            this.baseInfo = data.empInf;
            this.contactList = data.contactList;
            this.familyList = data.familyList;
            this.workList = data.workList;
            this.conList = data.contractList;
            this.eduList = data.eduList;
            this.certList = data.cert;
            this.trainList = data.try;
            this.awardsList = data.awards;
            this.promoteList = data.promote;

            //格式化头像
            let headPic = "";
            if (
              this.baseInfo.bigHeadPic != "" &&
              this.baseInfo.bigHeadPic != "0"
            ) {
              headPic = this.baseInfo.bigHeadPic;
            } else {
              headPic = this.baseInfo.headPic.trim();
            }
            if (
              headPic &&
              headPic != "null" &&
              headPic.length > 0 &&
              headPic != "0"
            ) {
              if (headPic.indexOf("http") < 0) {
                this.baseInfo.headPic = _.compressURL + headPic;
              }
            }
            // 部门拼接
            if (data.depts.length > 0) {
              for (let i = 0; i < data.depts.length; i++) {
                this.depts += data.depts[i].deptFullName + ";";
              }
              // 截取最后一个
              this.depts = this.depts.substring(0, this.depts.length - 1);
            }
            //生日祝福提醒
            if (
              this.baseInfo.birthNotifyType != "" &&
              this.baseInfo.birthNotifyType == 0
            ) {
              this.baseInfo.birthNotifyType = "按农历";
            } else {
              this.baseInfo.birthNotifyType = "按阳历";
            }
            //格式化户籍
            if (this.baseInfo.provice == this.baseInfo.city) {
              this.baseInfo.huji =
                this.baseInfo.provice + this.baseInfo.distruct;
            } else {
              this.baseInfo.huji =
                this.baseInfo.provice +
                this.baseInfo.city +
                this.baseInfo.distruct;
            }
            //处理空值
            for (var key in this.baseInfo) {
              if (this.baseInfo[key] == "") {
                this.baseInfo[key] = "-";
              }
            }
            //格式化自定义字段
            for (let i = 0; i < data.optionVOs.length; i++) {
              if (
                data.optionVOs[i].itemVO == null ||
                data.optionVOs[i].itemVO == ""
              ) {
                data.optionVOs[i].itemVO = { content: "-" };
              }
              if (data.optionVOs[i].style == "0") {
                let baseInfoObj = {
                  textDes: data.optionVOs[i].optionName,
                  name: "",
                  value:
                    data.optionVOs[i].itemVO.content !== ""
                      ? data.optionVOs[i].itemVO.content
                      : "-"
                };
                this.baseInfoListText.push(baseInfoObj);
              } else if (data.optionVOs[i].style == "1") {
                let jobInfoObj = {
                  textDes: data.optionVOs[i].optionName,
                  name: "",
                  value:
                    data.optionVOs[i].itemVO.content !== ""
                      ? data.optionVOs[i].itemVO.content
                      : "-"
                };
                this.jobInfoListText.push(jobInfoObj);
              } else if (data.optionVOs[i].style == "2") {
                let personInfoObj = {
                  textDes: data.optionVOs[i].optionName,
                  name: "",
                  value:
                    data.optionVOs[i].itemVO.content !== ""
                      ? data.optionVOs[i].itemVO.content
                      : "-"
                };
                this.personInfoText.push(personInfoObj);
              }
            }
          } else if (
            result.code === "" &&
            result.desc == "待编辑的用户已被删除"
          ) {
            _.hideLoading();
            this.unsync = false;
          } else {
            _.hideLoading();
            _.alert("提示", result.desc);
          }
        })
        .catch(err => {
          _.hideLoading();
        });
    }
  },
  filters: {
    formatDate(time) {
      let date = time.replace(/-/g, ".");
      return date;
    }
  }
};
</script>
<style lang="scss" scoped>
#personalData {
  background: #f6f6f6;
  word-break: break-all;
  white-space: normal;
  min-height: 100%;
  .qwui-top_card {
    width: 100%;
    padding: 22px 0 22px;
    background: url(~assets/images/oa_bg.jpg) no-repeat center;
    background-size: cover;
    text-align: center;
    .headPic {
      display: inline-block;
      width: 75px;
      height: 75px;
      border-radius: 50%;
    }
    .qwui-name {
      margin: 12px 0;
      font-size: 16px;
      color: #fff;
    }
    .qwui-dept_name {
      color: #c2ddfb;
      font-size: 14px;
    }
  }
  .qwui-msg_box {
    background: #fff;
    border-top: 1px #eee solid;
    border-bottom: 1px #eee solid;
    padding: 0 15px;
    font-size: 15px;
    margin-top: 15px;
    .qwui-msg_item {
      padding: 10px 0;
    }
    .qwui-title {
      width: 100%;
      height: 44px;
      line-height: 44px;
      border-bottom: 1px #eee solid;
      color: #333;
    }
    .qwui-list_box {
      display: flex;
      padding: 10px 0;
      span {
        min-width: 75px;
        display: inline-block;
        &:first-of-type {
          flex: 0 1 128px;
          padding-right: 10px;
          color: #999;
        }
      }
      p {
        flex: 1;
        word-break: break-all;
        color: #333;
      }
    }
    .borderNone {
      border-bottom: none;
    }
  }
  .baseInfo {
    border-top: 0;
    margin-top: 0;
  }
  .qwui-oa_process {
    border-left: 1px #eee solid;
    .qwui-item_box {
      position: relative;
      margin: 20px 0;
      padding-left: 30px;
      .circle {
        position: absolute;
        left: -4px;
        top: 5px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #2f7dcd;
        text-indent: -9999px;
      }
      .qwui-oa_process_main {
        .qwui-date {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
  .dashed {
    border-bottom: 1px #eee dashed;
  }
  .pd10 {
    padding: 10px 0;
  }
  .c999 {
    color: #999;
  }
  .unsync {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
    .no_data_icon {
      width: 130px;
      height: 130px;
      display: inline-block;
      background: url(~assets/images/checkwork/noCourse.png) no-repeat;
      background-size: cover;
    }
    .no_data_title {
      font-size: 20px;
      color: #666;
    }
    .no_data_desc {
      margin-top: 10px;
      line-height: 16px;
      font-size: 14px;
      color: #bbb;
    }
  }
}
</style>