
<template>
  <transition name="fade">
    <div class="dataWrap">
      <header>
        <setting-header :pages="['设置','公海池设置']" @go-back="goBackClick">
        </setting-header>
      </header>
      <div class="pool-select">
        <div class="left-select">
          <!-- 团队列表 -->
          <left-side-bar
                        v-show="hasRuleData"
                        :renderConfig="renderConfig"
                        @listenToChild="changePoolId"
                        @listenAddPop="addPool"
          ></left-side-bar>
        </div>
        <div class="right-select">
          <div class="default-pool" v-if="!otherShow">
            <div class="defaultPoolName">
              <div class="nameItem">
                <span class="itemTitle"><span class="star">*</span>公海名称：</span>
                <qwui-input
                            v-model="poolName"
                            class="qwui-input_style"
                            :inputTips="inputTips"
                            :inputType="'text'"
                            :maxLength=12
                            :isWarning="isWarning"
                            :warningTips="'公海名称不能为空'"
                            @input="changeInput"
                            @blur="changeInput">
                </qwui-input>
              </div>
              <div class="chargeItem mt20">
                <span class="itemTitle">公海负责人：</span>
                <div class="chooseBtn">
                  <label class="mr60">
                      <input type="radio" name="manager" :checked="true" class="w18">
                      所有管理员
                  </label>
                  <p class="c999">子账户管理员绑定通讯录人员后即可在应用端进行公海管理 <span class="orangeText" @click="goBinding"> 去绑定</span></p>
                </div>
            </div>
            <div class="poolTypeItem mt20">
              <span class="itemTitle">公海类型：</span>
              <div class="chooseBtn">
                <p>
                  <label @click="changeWay('active')">
                      <input type="radio" name="poolType" :checked="isPoolType" class="w18">
                      主动领取型公海
                  </label>
                  <span class="c999">（公海成员可见可领取公海客户，也可由公海负责人分配）</span>
                </p>
                <p>
                  <label @click="changeWay('manual')">
                      <input type="radio" name="poolType" :checked="!isPoolType" class="w18">
                      手动分配型公海
                  </label>
                  <span class="c999">（公海成员不可见公海客户，由公海负责人分配）</span>
                </p>
              </div>
            </div>
            <div class="poolPersonItem mt20">
              <span class="itemTitle">公海成员：</span>
              <div class="chooseBtn">
                  <label>
                      <input type="radio" name="poolPerson" :checked="true" class="w18">
                      所有人
                  </label>
              </div>
            </div>
            <div class="createCustomItem mt20">
              <span class="createCustomText">创建客户时，允许公海成员选择默认公海
                <span class="c999">（默认公海客户不自动回收）</span>
              </span>
              <qwui-switch :defaultStatus="defaultStatus" @change="switchChange"></qwui-switch>
            </div>

            </div>
          </div>
          <div class="others-pool" v-if="otherShow">
            <div class="other-item_title">
              <span class="itemTitle"><span class="star">*</span>公海名称：</span>
              <qwui-input
                            v-model="poolName"
                            class="qwui-input_style"
                            :inputTips="inputTips"
                            :inputType="'text'"
                            :maxLength=12
                            :isWarning="isWarning"
                            :warningTips="'公海名称不能为空'"
                            @input="changeInput"
                            @blur="changeInput">
                </qwui-input>
            </div>
            <div class="sortItem mt20">
              <span class="itemTitle">排列序号：</span>
              <qwui-input
                          v-model="sortValue"
                          inputType="sort"
                          @input='sortInput'
                          @blur="sortInput"
                          :isWarning="sortWarning"
                          :warningTips="'排序不能大于100'"
                          defaultVal="0"
              ></qwui-input>
            </div>
            <div class="other-charge_item mt20">
              <span class="itemTitle"><span class="star">*</span>公海负责人：</span>
              <!--销售团队成员 选人组件-->
              <person-count class="qwui-principal_count"
                            :personCountShow="principalCountShow"
                            :defaultUsers="principalUsers"
                            :defaultDepts="principalDepts"
                            :showType="principalShowType"
                            @listenAddPerson="addPoolPerson()">
              </person-count>
              <pool-pick-person v-model="poolPickShow" @on-confirm="poolConfirm" :defaultChecked="principalUsers" ref="pickInit"></pool-pick-person>
              <p class="fz12 c999">选择的公海负责人需要绑定通讯录用户，否则没有应用端的操作权限</p>
            </div>
            <div class="poolTypeItem mt20">
              <span class="itemTitle">公海类型：</span>
              <div class="chooseBtn">
                <p>
                  <label @click="changeWay('active')">
                      <input type="radio" name="poolType" :checked="isPoolType" class="w18">
                      主动领取型公海
                  </label>
                  <span class="c999">（公海成员可见可领取公海客户，也可由公海负责人分配）</span>
                </p>
                <p>
                  <label @click="changeWay('manual')">
                      <input type="radio" name="poolType" :checked="!isPoolType" class="w18">
                      手动分配型公海
                  </label>
                  <span class="c999">（公海成员不可见公海客户，由公海负责人分配）</span>
                </p>
              </div>
            </div>
            <div class="other-person_item mt20">
              <span class="itemTitle"><span class="star">*</span>公海成员：</span>
              <!--公海成员 选人组件-->
              <person-count class="qwui-person_count_list"
                            :personCountShow="personCountShow"
                            :defaultUsers="defaultUsers"
                            :defaultDepts="personPrincipalDepts"
                            :showType="showType"
                            @listenAddPerson="addPerson">
              </person-count>
              <pick-person :show="pickPersonShow"
                            :defaultUsers="defaultUsers"
                            :defaultDepts="personPrincipalDepts"
                            :functionTab="functionTab"
                            @chooseDone="chooseDone"
                            @closeThis="closeThis">
              </pick-person>
            </div>
          </div>
          <div class="qwui-save_btn">
            <qwui-button type='primary' @click="savePoolData">保存</qwui-button>
          </div>
        </div>

      </div>

    </div>
  </transition>

</template>

<script>
import qwuiSwitch from "@/components/qwuiBase/qwuiSwitch/qwuiSwitch";
import qwuiInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import qwuiButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import leftSideBar from "./components/LeftSideBar";
import settingHeader from "./components/settingHeader";
import poolPickPerson from "./components/poolPickPerson";
import {
  getTeamList,
  addTeamItem,
  delPoolItem,
  searchTeamItem,
  getTeamDetail,
  savePoolConfig,
  getPoolList,
  getPoolDetail
} from "crm/api/setting";
import personCount from "@/components/pickPerson/qwuiPersonCount";
import pickPerson from "@/components/pickPerson/pickPerson";
export default {
  data() {
    return {
      personList: {
        // 公海负责人列表
        personList: []
      },
      poolPickShow: false, // 公海选人组件
      isPoolType: true, // 默认选中主动领取型公海
      defaultStatus: true, // switch开关
      sortWarning: false, // 公海序号提示，不能超过30
      sortValue: "", // 列表序号
      inputTips: '如" 华南直销公海 "', // placeholder
      poolNameInput: "", // 输入公海名字
      otherShow: false, // 其他公海隐藏，默认公海显示
      isWarning: false, // 团队名称提示，不能为空
      funcBoxShow: false, // 遮罩弹窗显示隐藏
      secondBtn: "", // 传给组件，默认没有取消按钮
      step: 1, // 记录帮助提示的状态
      personCountShow: true, // 选人结果显示隐藏
      showType: {
        person: true,
        dept: true
      },
      pickPersonShow: false,
      defaultUsers: [],
      functionTab: [
        { text: "部门" },
        { text: "标签人员" },
        { text: "特定人员" },
        { text: "批量导入" },
        { text: "高级筛选" }
      ],
      principalFunctionTab: [
        { text: "部门" },
        { text: "标签人员" },
        { text: "特定人员" },
        { text: "批量导入" },
        { text: "高级筛选" }
      ],
      principalPickShow: false, // 选人组件显示隐藏
      principalCountShow: true,
      principalUsers: [], // 成员
      principalDepts: [], // 部门
      personPrincipalDepts: [], //成员部门
      principalShowType: {
        person: true,
        // dept: true
      },
      poolId: "", // 公海的id
      poolName: "", // 公海的名字
      poolListData: [], // 团队数据
      hasRuleData: true,
      renderConfig: {
        addOperateName: "新建公海",
        renderList: [], // 规则列表
        currentIndex: 0
      }
    };
  },
  components: {
    settingHeader,
    leftSideBar,
    personCount,
    pickPerson,
    qwuiButton,
    qwuiInput,
    qwuiSwitch,
    poolPickPerson
  },
  created() {
    this.init();
  },
  watch: {
    // 监听输入团队，去除前后空格
    poolName(newVal, oldVal) {
      this.poolName = this.trim(newVal);
    }
  },
  methods: {
    init() {
      this.renderConfig.renderList = [];
      this.poolListData = [];
      dataBase.loading = true;
      getPoolList().then(res => {
        dataBase.loading = false;
        if (res.code == "0") {
          // 获取返回的团队数据
          this.poolListData = res.data.poolList;
          // this.poolName = res.data.poolList[0].poolName;
          this.poolListData.forEach(item => {
            this.renderConfig.renderList.push({
              itemName: item.poolName,
              itemIcon: require("@/assets/images/crm/poolIcon.svg"),
              id: item.id,
              status: 0,
              operateList: [
                {
                  operateName: "删除",
                  operateFunc: () => {
                    this.delPool(item);
                  }
                }
              ]
            });
          });
          // 默认公海不允许操作
          delete this.renderConfig.renderList[0].operateList;
          this.renderConfig.currentIndex = 0;
          this.getItemDetail(res.data.poolList[0].id);
        } else {
          _.alert("提示", res.desc);
        }
      });
    },

    // 获取公海当前详情
    getItemDetail(id) {
      this.$refs.pickInit && this.$refs.pickInit.init();
      getPoolDetail({ poolId: id }).then(res => {
        if (res.code == "0") {
          this.defaultStatus = res.data.poolDetail.allowSelectWhenCreate;
          this.isPoolType = res.data.poolDetail.poolType == 1 ? true : false;
          this.sortValue = res.data.poolDetail.sortNum;
          this.poolName = res.data.poolDetail.poolName;
          this.poolId = res.data.poolDetail.id;
          this.principalUsers = res.data.poolDetail.personVOList;
          this.defaultUsers = res.data.poolDetail.memberVOList;
          this.personList.personList = res.data.poolDetail.personVOList;
          this.personPrincipalDepts = res.data.poolDetail.departRefPOS;
        } else {
          _.alert(res.desc);
        }
      });
    },

    // 返回上一级
    goBackClick() {
      this.$router.go(-1);
    },

    // 打开帮助提示
    helpClick() {
      this.step = 1;
      this.tipDatas[0].show = true;
    },

    // 选择团队监听事件
    changePoolId(id, key) {
      this.isWarning = false;
      this.sortWarning = false;
      this.otherShow = id == 0 ? false : true;

      if (this.poolListData[key]) {
        this.poolName = this.poolListData[key].poolName;
      }
      id ? (this.poolId = id) : "";
      this.renderConfig.currentIndex = key;
      this.getItemDetail(id);
    },

    // 新增公海
    addPool() {
      // 初始化提醒
      this.poolName = "";
      this.poolId = "";
      this.otherShow = true;
      this.personPrincipalDepts = [];
      this.principalUsers = [];
      this.defaultUsers = [];
      this.sortValue = "";
      this.isWarning = false;
      this.sortWarning = false;
    },

    // 添加人员
    addPerson(status) {
      if (status) {
        this.principalPickShow = true;
      } else {
        this.pickPersonShow = true;
      }
    },

    // 选人确定按钮回调
    choosePrincipal(deptSelected, tagList, specialUsers) {
      this.principalUsers = specialUsers;
      this.principalDepts = deptSelected;
      this.principalPickShow = false;
    },

    // 选人回调
    chooseDone(deptSelected, tagList, specialUsers) {
      this.defaultUsers = specialUsers;
      this.personPrincipalDepts = deptSelected;
      this.pickPersonShow = false;
    },

    // 选人关闭按钮回调
    closeThis(status) {
      if (status) {
        this.principalPickShow = false;
      } else {
        this.pickPersonShow = false;
      }
    },

    // 保存按钮回调函数
    savePoolData() {
      let isPass = this.vali();
      if (isPass) {
        let userIdsArr = [],
          personsArr = [],
          deptsArr = [];
        // 清空公海负责人
        this.personList.personList = [];
        this.principalUsers.map(item => {
          userIdsArr.push(item.userId);
        });
        this.defaultUsers.map(item => {
          personsArr.push(item.userId);
        });
        this.personPrincipalDepts.map(item => {
          if (item.nodeId) {
            deptsArr.push(item.nodeId);
          } else {
            deptsArr.push(item.deptId);
          }
        });
        this.personList.personList = JSON.parse(JSON.stringify(this.principalUsers));

        this.personList.personList.forEach(item => {
          let a = item.accountName;
          item.accountName = item.personName;
          item.personName = a;
        });

        let obj = {
          "configPO.id": this.poolId,
          "configPO.poolName": this.poolName,
          "configPO.sortNum": this.sortValue,
          "configPO.poolType": this.isPoolType == true ? 1 : 0,
          personList: JSON.stringify(this.personList), // 公海负责人
          deptIds: deptsArr.length > 0 ? deptsArr.join("|") : "", // 公海成员部门
          userIds: personsArr.length > 0 ? personsArr.join("|") : "", // 公海成员
          allowSelect: this.defaultStatus ? 1 : 0
        };
        dataBase.loading = true;
        savePoolConfig(obj).then(res => {
          dataBase.loading = false;
          if (res.code == "0") {
            dataBase.top_alert('保存成功',true,3000);
            // 刚新增完的则部根据id查，编辑的则传id
            if (this.poolId == "") {
              this.getItemDetail(0);
              this.renderConfig.currentIndex = 0;
              this.otherShow = !this.otherShow;
              this.init();
            } else {
              this.getItemDetail(this.poolId);
            }
          } else {
            _.alert("提示", res.desc);
          }
        });
      }
    },

    // 关掉tip
    deleteTip(item) {
      item.show = false;
    },

    // 点击下一步 status: 'pre': 上一步   'next': 下一步
    handleClick(status, item) {
      status == "pre" ? this.step-- : this.step++;
      this.tipDatas.forEach(item => {
        item.show = false;
        if (item.step == this.step) {
          item.show = true;
        }
      });
    },

    // 关闭遮罩
    closeMask() {
      this.funcBoxShow = !this.funcBoxShow;
      // 关闭遮罩把序号清空，避免请求存在旧数据
      this.sortValue = "";
    },

    // 输入input
    changeInput() {
      this.isWarning = this.poolName == "";
    },

    // 输入需要input
    sortInput(val) {
      if (!(/(^\+?[1-9][0-9]*$)/.test(val))) {
        this.sortValue = val.substring(0,val.length-1);
      }
      this.sortWarning = this.sortValue > 100;
    },

    // 正则去掉左右空白格
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    // 删除团队
    delPool(item) {
      let self = this;
      _.alert(
        "提示",
        "确定要删除该公海吗？",
        function() {
          self.delRequest(item);
        },
        "确定",
        true
      );
    },

    // 删除请求
    delRequest(val) {
      dataBase.loading = true;
      delPoolItem({ id: val.id }).then(res => {
        dataBase.loading = false;
        if (res.code == "0") {
          dataBase.top_alert("删除成功", true, 2000);
          this.otherShow = !this.otherShow;
          this.init();
        } else {
          _.alert("提示", res.desc);
        }
      });
    },

    // 去绑定
    goBinding() {
      top.location.href = _.baseURL+"/manager/managesetting/user_main.jsp?classClick=2";
    },

    // switch开关
    switchChange(isOn) {
      this.defaultStatus = !this.defaultStatus;
    },

    // 打开公海选人
    addPoolPerson() {
      this.poolPickShow = true;
    },

    // 公海选人确定事件
    poolConfirm(checkedList) {
      if(checkedList.length>5){
        _.alert('提示','最多添加五个公海负责人')
        return
      }else{
        this.principalUsers = [];
        this.poolPickShow = false;
        checkedList.forEach((item) => {
          let obj = {
            id: item.qyUserId,
            accountName: item.personName,
            poolAccount: item.poolAccount,
            userId: item.userId,
            personName: item.accountName,
            wxUserId: item.wxUserId,
            accountId: item.accountId,
            isAdmin: item.isAdmin
          }
          this.principalUsers.push(obj)
        })
      }
    },

    // 判空
    vali() {
      this.changeInput();
      if (this.isWarning || this.sortWarning) {
        return false;
      }
      if(this.otherShow){
        if (this.principalUsers.length == 0) {
          _.alert("提示", "公海负责人不能为空");
          return false;
        } else if (
          this.defaultUsers.length == 0 &&
          this.personPrincipalDepts.length == 0
        ) {
          _.alert("提示", "公海成员不能为空");
          return false;
        } else{
          return true
        }
      }else{
        return true
      }
    },

    // 改变label
    changeWay(type) {
      this.isPoolType = type == "active" ? true : false;
    }
  }
};
</script>

<style lang="scss" scoped>
.dataWrap {
  height: 100%;
  .pool-select {
    margin-top: 20px;
    // height: 100%;
    width: 100%;
    position: relative;
    .right-select {
      margin-left: 40px;
      float: left;
      width: 700px;
      position: relative;
      .others-pool {
        float: left;
        margin-top: 20px;
        .chooseBtn {
          display: inline-block;
          line-height: 32px;
        }
        .other-charge_item {
          p {
            margin-left: 112px;
          }
          .qwui-principal_count {
            width: 80%;
            display: inline-block;
          }
          // /deep/ .qwui-person_count{
          //   margin-top: 0;
          // }
        }
        .other-person_item {
          /deep/ .qwui-person_count_list {
            width: 80%;
            margin-top: 0;
            display: inline-block;
          }
        }
      }
      .default-pool {
        float: left;
        margin-top: 20px;
        .defaultPoolName {
          .qwui-input_style {
            margin-left: 5px;
          }
          .chargeItem {
            // margin-top: 20px;
          }
          .createCustomItem {
            .createCustomText {
              margin: 0 25px;
            }
          }
          .chooseBtn {
            display: inline-block;
            line-height: 32px;
            .orangeText {
              color: #f87b00;
              cursor: pointer;
            }
          }
        }
      }
      .team-member {
        height: 100%;
      }
      .pool-name {
        line-height: 20px;
        font-size: 20px;
      }
      .team {
        margin-top: 32px;
      }
      .grayFont {
        font-size: 14px;
        color: #999;
      }
      .qwui-save_btn {
        position: absolute;
        width: 100%;
        padding-top: 20px;
        // padding-bottom: 30px;
        bottom: -100px;
        text-align: center;
        margin-top: 40px;
        border-top: 1px solid #eee;
      }
    }
  }
  .addTeam_box {
    padding: 30px 0 40px;
    font-size: 14px;
    margin-bottom: 9px;
    .teamNameItem {
      text-align: center;
      .sortItem {
        text-align: left;
        margin: 20px 0 0 128px;
        // margin: 20px 0 0 -240px;
      }
      .input-bottom_text {
        color: #999;
        font-size: 12px;
        margin-left: -15px;
      }
      .itemTitle {
        margin-bottom: 5px;
        margin-right: 10px;
        line-height: 32px;
        display: inline-block;
        text-align: right;
        vertical-align: top;
        .star {
          margin-right: 5px;
          color: red;
        }
      }
    }
  }
  /deep/ .warningTips {
    text-align: left;
  }
  .itemTitle {
    display: inline-block;
    width: 98px;
    margin-bottom: 5px;
    margin-right: 10px;
    line-height: 32px;
    display: inline-block;
    text-align: right;
    vertical-align: top;
    .star {
      margin-right: 5px;
      color: red;
    }
  }
}
.mr60 {
  margin-right: 60px;
}
.c999 {
  color: #999;
}
.w18 {
  width: 18px;
}
.mt20 {
  margin-top: 20px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

