<template>
  <div class="wrap myRelavent">
    <div @click="goToDetail(url)" class="qwui-header">
      <div>
        <div class="qwui-my_mes">
          <div class="qwui-my_mes_container">
            <img v-if="userPower.field.headPic == 'true'" :src="userMes.empInf.headPic" alt>
            <p v-if="userPower.field.personName == 'true'" class="qwui-user_name">
              {{ userMes.empInf.personName?userMes.empInf.personName:'' }}
              <i class></i>
            </p>

            <p v-if="userPower.field.dept == 'true'" class="qwui-position">
              <span class="qwui-dept_mes" v-text="userMes.empInf.dept"></span>
              <span
                class="qwui-dept_mes"
                v-text="userMes.empInf.positionName?'/'+userMes.empInf.positionName:''"
              ></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 功能指引和问题反馈入口 -->
    <div class="qwui-item_list_box">
      <div v-for="(item,i) in itemList" :key="i" class="qwui-item_entry">
        <span class="qwui-text">{{item.text}}</span>
        <span class="qwui-more" @click="goEntry(item)">
          {{ item.moreDesc || '更多' }}
          <i class="qwui-arrow"></i>
        </span>
      </div>
    </div>

    <!--考核数据列表-->
    <div class="qwui-my_result" v-if="isShow">
      <div class="lean_entry_list_item qwui-flexbox pad15">
        <span class="qwui-flexItem">{{$t('i18n.performancemyResult')}}</span>
        <i @click="goToCheckList">
          <span class="goCheck">更多</span>
          <i class="arrow"></i>
        </i>
      </div>
      <div class="list_item" v-for="(item,index) in checkList" :key="index">
        <div class="flex_col">
          <div class="list_score">{{ item.totalScore }}</div>
          <p>总分</p>
        </div>
        <div class="item_info">
          <p class="check_name">{{ item.name }}</p>
          <p class="check_time">{{ item.startTime }} 至 {{ item.endTime }}</p>
          <p class="check_garde">评级：{{ item.degree }}</p>
        </div>
      </div>
    </div>
    <!--无考核数据时显示图片-->
    <div class="qwui-my_result" v-if="!isShow">
      <div class="qwui-lean_entry_list">
        <div class="lean_entry_list_item">
          <span class="qwui-flexItem">{{$t('i18n.performancemyResult')}}</span>
        </div>
        <no-record :hasrecord="hasrecord"></no-record>
      </div>
    </div>
  </div>
</template>
<script>
import {
  viewMyInfo,
  viewSetting,
  getCheckList,
  managesetting,
  getDynamicCode,
  feedbackList
} from "../api/getData";
import noRecord from "@/components/base/no_record";
export default {
  name: "myRelavent",
  components: {
    noRecord //无考核数据时显示
  },
  data() {
    return {
      url: "/jsp/wap/hrmanagement/detail.jsp?agentCode=hrmanagement&amp;abc=1",
      userMes: {
        empInf: {
          headPic: "", //用户头像
          personName: "", // 姓名
          dept: "" // 部门
        }
      }, //当前用户信息
      userPower: {
        //成员属性权限
        field: {
          headPic: false, // 头像查看权限
          personName: false, // 姓名查看权限
          dept: false // 部门查看权限
        }
      },
      hasrecord: {
        //无数据配置
        show: false,
        icon: "icon_noCheck",
        title: "暂无数据"
      },
      checkList: [], //考核数据列表
      isShow: false, //是否有考核数据，控制显示
      itemList: [
        { text: "工资条查看设置", name: "payrollSetting", moreDesc: "未开启" },
        { text: "功能指引", name: "functionGuide" },
        { text: "问题反馈", name: "problemFeedBack" }
      ],
      isManager: "",
      goFeedBackHistory: false,
      feedbackBase: `${location.href.slice(
        0,
        location.href.indexOf("/vp")
      )}/vp/module/form.html?agentCode=form&corp_id=${
        wxqyhConfig.orgConfigInfo.corpId
      }#/open/add?id=`
    };
  },
  created() {
    console.log(wxqyhConfig.orgConfigInfo.corpId)
    //获取用户头像等个人信息
    this._viewMyInfo();
    this._feedbackList();
    //获取考核列表数据
    this._getCheckList();
    this._managesetting();
    this.getDynamicCodeBtn();
  },
  methods: {
    // 是否有反馈历史
    _feedbackList() {
      feedbackList({}, data => {
        this.feedbackBase += data.feedBackVersionId;
        if (data.tbFormWorkOrderPOList.length > 0) {
          this.goFeedBackHistory = false;
        } else {
          this.goFeedBackHistory = true;
        }
      });
    },
    goToDetail(url) {
      window.location.href = _.baseURL + url;
    },
    goEntry(obj) {
      if (obj.name == "problemFeedBack") {
        let href
        if (!this.goFeedBackHistory) {
          this.$router.push({path:'FeedBackList'})
        } else {
          href = `${this.feedbackBase}&field=${
            wxqyhConfig.orgConfigInfo.corpId
          }&field1=${_.userId}&field2=胡韵静&field3=${
            this.isManager == 1 ? "管理员" : "普通员工"
          }&field4=${_.is_vip ? "付费用户" : "普通用户"}&field5=人事考核`;
        location.href = href;
        }
        //问题反馈
      } else if (obj.name == "functionGuide") {
        // 功能指引
        this.$router.push({ path: "functionGuideDetails" });
      } else {
        this.$router.push({ name: obj.name });
      }
    },
    _viewMyInfo() {
      let _this = this;
      viewMyInfo({}, data => {
        _this.userMes = { ...data };
        if (
          _this.userMes.empInf.headPic == "0" ||
          _this.userMes.empInf.headPic != ""
        ) {
          _this.userMes.empInf.headPic.trim();
        }
        if (
          _this.userMes.empInf.headPic &&
          _this.userMes.empInf.headPic != "null" &&
          _this.userMes.empInf.headPic.length > 0 &&
          _this.userMes.empInf.headPic != "0"
        ) {
          _this.userMes.empInf.headPic.indexOf("http") < 0
            ? (_this.userMes.empInf.headPic =
                _.compressURL + _this.userMes.empInf.headPic)
            : "";
        }
        _this.userMes.empInf.headPic != "0" &&
        _this.userMes.empInf.headPic !== ""
          ? ""
          : (_this.userMes.empInf.headPic = require("../../../assets/images/touxiang02.png"));

        _this._viewSetting(); //成员属性权限控制
      });
    },
    _viewSetting() {
      let _this = this;
      viewSetting({ type: "hrPersonal" }, data => {
        let deptName = ""; // 职位
        _this.userPower = { ...data.setting.hrPersonal.showInMobile };
        if (_this.userPower.field.dept) {
          if (_this.userMes.depts) {
            let deptsLength = _this.userMes.depts.length;
            _this.userMes.depts.forEach((element, index) => {
              if (index == deptsLength - 1) {
                deptName += element.deptName;
              } else {
                deptName += element.deptName + "/";
              }
              _this.userMes.empInf.dept = deptName;
            });
          }
          // deptName = _this.userMes.depts[0].deptName;
        }
        deptName.trim().length > 0 ? (deptName = deptName) : "";
      });
    },
    //获取考核详情列表
    _getCheckList() {
      getCheckList(dataBase.params, data => {
        if (data.pageData.pageData.length > 0) {
          this.isShow = true; //显示数据
          data.pageData.pageData.forEach(item => {
            if (item.degree === "") {
              item.degree = "超出已设的评级范围";
            }
          });
          this.checkList = data.pageData.pageData;
        }
        this.hasrecord.show = true;
      });
    },
    //跳转更多考核页面
    goToCheckList() {
      this.$router.push({ name: "myCheck" });
    },
    //获取反馈来源
    _managesetting() {
      managesetting({}, data => {
        if (data.isManager == 0) {
          this.isManager = "普通用户";
        } else {
          this.isManager = "管理员";
        }
      });
    },
    // 获取动态码查看工资条开关
    getDynamicCodeBtn() {
      getDynamicCode({}, data => {
        this.itemList[0].moreDesc = data.isOpen == "1" ? "已开启" : "未开启";
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.myRelavent {
  position: relative;
  font-family: -apple-system-font, "Helvetica Neue", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
  .qwui-header {
    background: url(~assets/images/hr_pic_bg_default.png) #fff no-repeat top
      left;
    background-size: 100% 87px;
    position: relative;
    width: 100%;
    height: auto;
    padding: 20px 15px 20px 15px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    > div {
      position: relative;
    }
    img {
      display: block;
      width: 100%;
      height: 180px;
    }
    .qwui-my_mes {
      min-height: 164px;
      box-sizing: border-box;
      box-shadow: 0 6px 12px 0 rgba(152, 161, 181, 0.2);
      position: relative;
      padding-bottom: 24px;
      padding-top: 14px;
      background: url(~assets/images/img_a-mine_bg.png) no-repeat left top;
      background-size: 100% 100%;
      img {
        display: block;
        width: 68px;
        height: 68px;
        box-sizing: border-box;
        margin: 0px auto 12px auto;
        border: 1px solid rgba(245, 245, 245, 1);
        border-radius: 50%;
      }
      .qwui-user_name {
        width: 100%;
        line-height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(10, 23, 53, 1);
        text-align: center;
        word-wrap: break-word;
        i {
          position: absolute;
          margin: 3px 0 0 10px;
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url("~assets/images/ic_a-profile_editor.png") center
            center;
          background-size: 100% 100%;
        }
      }
      .qwui-position {
        height: 20px;
        margin-top: 4px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(122, 124, 128, 1);
        line-height: 20px;
        text-align: center;
        .qwui-dept_mes {
          max-width: 6em;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .qwui-item_list_box {
    .qwui-item_entry {
      height: 40px;
      padding: 0 14px;
      background-color: #fff;
      line-height: 40px;
      border-bottom: 8px solid #f7f8fa;
      .qwui-text {
        font-size: 16px;
        color: #0a1735;
      }
      .qwui-more {
        font-size: 14px;
        color: #b2b9c8;
        float: right;
        .qwui-arrow {
          display: inline-block;
          vertical-align: middle;
          height: 24px;
          width: 24px;
          background: url(~assets/images/ic_white_arrow.png) center no-repeat;
          background-size: cover;
        }
      }
    }
  }
  .qwui-my_result {
    .lean_entry_list_item {
      height: 40px;
      line-height: 40px;
      padding: 0 14px;

      i {
        position: relative;
        height: 40px;
        width: 100px;
      }

      .goCheck {
        position: absolute;
        right: 21px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(178, 185, 200, 1);
      }

      .arrow {
        height: 24px;
        width: 24px;
        background: url(~assets/images/ic_white_arrow.png) center no-repeat;
        background-size: cover;
        position: absolute;
        top: 8px;
        right: 0px;
      }
    }

    /deep/ .qwui-no_record_box {
      margin-top: 28px;
    }

    /deep/ .icon_noCheck {
      display: inline-block;
      width: 300px;
      height: 210px;
      background: url(~assets/images/img_a-workbench.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .qwui-no_record_title {
      height: 21px;
      color: RGBA(178, 185, 200, 1);
      font-size: 15px;
    }

    .list_item {
      margin-left: 15px;
      display: flex;
      align-items: center;
      height: 104px;
      width: 100%;
      box-shadow: 0px 1px 0px 0px rgba(247, 248, 250, 1);
      &:last-child {
        border-bottom-style: solid;
        border-color: rgba(247, 248, 250, 1);
        border-width: 1px;
      }
      .flex_col {
        height: 76px;
        min-width: 76px;
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        border-right: 1px solid;
        border-color: rgba(247, 248, 250, 1);

        p {
          height: 18px;
          font-size: 13px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(122, 124, 128, 1);
          line-height: 18px;
          text-align: center;
        }
      }

      .list_score {
        margin-bottom: 4px;
        font-size: 24px;
        height: 33px;
        font-family: DIN-Medium;
        font-weight: 500;
        color: rgba(255, 88, 109, 1);
        line-height: 33px;
      }

      .item_info {
        flex: 1;
        width: 0;
        margin-left: 28px;
        display: flex;
        flex-direction: column;

        .check_name {
          height: 22px;
          width: 90%;
          font-size: 16px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(10, 23, 53, 1);
          line-height: 22px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .check_time {
          height: 18px;
          font-size: 13px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(178, 185, 200, 1);
          line-height: 18px;
          margin-top: 4px;
          overflow: hidden;
        }

        .check_garde {
          height: 18px;
          width: 90%;
          font-size: 13px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(122, 124, 128, 1);
          line-height: 18px;
          margin-top: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>


