<template>
  <div>
    <div class="main_wrap">
      <div class="container">
        <div class="left_side">
          <dl
            class="left_side_dl"
            v-perm="item.moduleName"
            v-for="(item, index) in appArr"
            :key="item.id"
          >
            <dt
              :class="{left_side_dt:true,
                                   show_hover:!item.appList.length,
                                   active:active === item.menuModule,
                                  }"
              @click="menuTile(index,item.appList.length,item.menuModule)"
            >
              {{ item.title }}
              <span :class="['left_side_dt_icon', `icon_${item.menuModule}`]"></span>
            </dt>
            <dd
              :class="{left_side_dd:true,
                                   active:active === itemChild.name
                                  }"
              v-perm="itemChild.permission"
              v-for="(itemChild, indexChide) in item.appList"
              :key="itemChild.name"
              @click="menuItem(index, indexChide,itemChild.name)"
            >{{ itemChild.name }}</dd>
          </dl>
        </div>
        <div class="right_side">
          <router-view></router-view>
        </div>
      </div>
      <div class="bged pt25">
        <qwFooter></qwFooter>
      </div>
    </div>
  </div>
</template>
<script>
import qwFooter from "@/components/base/footer";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "hrApp",
  data() {
    return {
      baseURL: _.baseURL,
      appArr: [],
    };
  },
  components: {
    qwFooter
  },
  computed: {
    ...mapGetters("header", ["trustApp", "permission"]),
    ...mapState({
      active: state => state.leftSide.active
    })
  },
  watch: {
    trustApp: function(newVal, oldVal) {
      // this.changeActive(newVal);
    }
  },
  created() {
    this.$api.getMenuList({ menuAssortment: "hrmanagement" }, this.sortappArr);
  },
  mounted() {
    // 动态渲染内容高度
    let windowHeight = document.documentElement.clientHeight;
    let mainHeight = windowHeight - 90 - 58;
    document.querySelector(".main_wrap").style.minHeight = `${mainHeight}px`;
    // this.changeActive(this.trustApp);
  },
  methods: {
    // 跳转页面
    goDetail(agentCode) {
      let baseURL = this.baseURL;
      window.location.href = `${baseURL}/manager/sales/main.jsp?agentCode=${agentCode}`;
    },

    // 改变选择左侧菜单栏状态
    //左侧菜单栏数据的整理
    sortappArr(data) {
      var self = this;
      data.menuList &&
        data.menuList.forEach(value => {
          if (value.menuModule == "hrmanagement") {
            value.appList = [
              {
                name: "首页",
                permission: "hrmanagementMenu"
              },
              {
                name: "员工花名册",
                permission: "empinfList"
              },
              {
                name: "设置",
                permission: "viewEmpSetting"
              }
            ];
            self.appArr.push(value);
          } else if (value.menuModule == "HRReport") {
            value.appList = [];
            self.appArr.push(value);
          } else if (value.menuModule == "groupsend") {
            value.appList = [];
            self.appArr.push(value);
          } else if (value.menuModule == "hrmark") {
            value.appList = [
              {
                name: "评分考核",
                permission: ""
              },
              {
                name: "考核模板",
                permission: ""
              }
            ];
            self.appArr.push(value);
          }
        });
      //员工关怀是所有账户中必须出现的
      this.appArr.push({
        id: "d0cbd621-9cf5-11e8-83dd-00e04c4fd5fb",
        title: "员工关怀",
        menuModule: "HRBless",
        appList: []
      });
    },

    //左侧菜单标题栏的点击事件
    menuTile(index, flag, menuModule) {
      if (!flag) {
        //跳转会jsp页面的工资条菜单
        if (menuModule === "groupsend") {
          window.location.href = `${
            this.baseURL
          }/manager/hrmanagement/hrmanagement_main.jsp?agentCode=${menuModule}`;
        } else if (menuModule === "HRReport") {
          // this.$router.push({ path: "personalReport" });
          window.location.href = `${this.baseURL}/vm/module/hrmanagement.html#/personalReport`;
        } else {
          window.location.href = `${
            this.baseURL
          }/manager/hrmanagement/hrmanagement_main.jsp?bless=fromDynamic`;
        }
      }
    },

    //左侧菜单栏子栏目的点击事件
    menuItem(index, itemIndex, name) {
      if (name === "首页") {
        window.location.href = `${
          this.baseURL
        }/manager/hrmanagement/hrmanagement_main.jsp`;
      } else if (name === "员工花名册") {
        window.location.href = `${
          this.baseURL
        }/manager/hrmanagement/hrmanagement_main.jsp?empId=empinfList`;
      } else if (name === "设置") {
        window.location.href = `${
          this.baseURL
        }/manager/hrmanagement/hrmanagement_main.jsp?viewEmpSetting=toSetting`;
      } else if (name === "评分考核") {
        window.location.href = `${
          this.baseURL
        }/manager/hrmanagement/hrmanagement_main.jsp?hrmark_wrap=0`;
      } else if (name === "考核模板") {
        window.location.href = `${
          this.baseURL
        }/manager/hrmanagement/hrmanagement_main.jsp?hrmark_wrap=1`;
      }
    }
  }
};
</script>
<style scoped>
.pt25 {
  padding-top: 25px;
}
.main_wrap {
  padding-top: 25px;
  width: 100%;
  background: #ededed;
  box-sizing: border-box;
}
.bged {
  background: #ededed;
}
.container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 430px;
  border: 1px solid #d9dadc;
  background: #ffff;
}
.container .right_side {
  background-color: #fff;
}
.container .left_side {
  padding: 30px 0 40px;
  width: 200px;
  min-height: 679px;
  background: rgba(250, 250, 250, 1);
  box-shadow: 1px 0px 0px 0px rgba(231, 231, 231, 1);
}
.side_menun li {
  height: 32px;
  line-height: 32px;
  color: #676666;
  text-indent: 22px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  cursor: pointer;
  background: url(../../../assets/images/arrow1.png) no-repeat 90% center;
}
.side_menun li:hover {
  color: #676666;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.side_menun .active,
.side_menun .active:hover {
  color: #fff;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  background: url(../../../assets/images/arrow2.png) no-repeat 90% center
  #C31725;
}
.right_side {
  padding: 0 30px;
  width: 80%;
  box-sizing: content-box;
}
</style>
<style lang="scss" scoped>
.main_wrap {
  .container {
    .left_side {
      .left_side_dl {
        .left_side_dt {
          position: relative;
          height: 45px;
          line-height: 45px;
          padding-left: 49px;
          font-size: 16px;
          color: #666;
          .left_side_dt_icon {
            content: "";
            display: block;
            position: absolute;
            width: 20px;
            height: 20px;
            top: 12px;
            left: 20px;
            &.icon_hrmanagement {
              background: url(~assets/images/ic_hr.png) no-repeat;
            }
            &.icon_groupsend {
              background: url(~assets/images/ic_Payroll.png) no-repeat;
            }
            &.icon_hrmark {
              background: url(~assets/images/ic_mark.png) no-repeat;
            }
            &.icon_HRBless {
              background: url(~assets/images/ic_hrBless.png) no-repeat;
            }
            &.icon_HRReport {
              background: url(~assets/images/ic_report.png) no-repeat;
            }
          }
          &.show_hover:hover {
            background-color: #f4f5f6;
            cursor: pointer;
          }
          &.active {
            color: #fff;
            background-color: #C31725 !important;
          }
        }
        .left_side_dd {
          position: relative;
          height: 40px;
          line-height: 40px;
          padding-left: 49px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          &::after {
            content: "";
            display: block;
            position: absolute;
            width: 7px;
            height: 10px;
            background: url(~assets/images/arrow1.png) no-repeat;
            top: 15px;
            right: 30px;
          }
          &:hover {
            background-color: #f4f5f6;
          }
          &.active {
            color: #fff;
            background-color: #C31725 !important;
          }
        }
      }
    }
  }
}
</style>


