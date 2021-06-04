<template>
  <div class="crm-competitor-add">
    <CrmFormGroup>
      <CrmFormTextarea title="企业名称"
                       :required="true"
                       :showCounter="true"
                       :max-length="200"
                       v-model="tbCrmCompetitorInfoPO.competitorName"></CrmFormTextarea>
      <CrmFormInput title="规模"
                    :isLink="true"
                    placeholder="请选择"
                    @click.native="openPopup('scale')"
                    v-model="scale.value"></CrmFormInput>
    </CrmFormGroup>

    <CrmFormGroup>
      <CrmFormInput title="竞争力"
                    :isLink="true"
                    placeholder="请选择"
                    @click.native="openPopup('competition')"
                    v-model="competition.value"></CrmFormInput>
      <CrmFormTextarea title="优势"
                       :showCounter="true"
                       :max-length="2000"
                       v-model="tbCrmCompetitorInfoPO.advantage"></CrmFormTextarea>
      <CrmFormTextarea title="劣势"
                       :showCounter="true"
                       :max-length="2000"
                       v-model="tbCrmCompetitorInfoPO.disadvatage"></CrmFormTextarea>
      <CrmFormTextarea title="策略"
                       :showCounter="true"
                       :max-length="2000"
                       v-model="tbCrmCompetitorInfoPO.strategy"></CrmFormTextarea>
    </CrmFormGroup>

    <CrmFormGroup>
      <CrmFormTextarea title="联系信息"
                       :showCounter="true"
                       :max-length="200"
                       v-model="tbCrmCompetitorInfoPO.contactInfo"></CrmFormTextarea>
      <CrmFormTextarea title="描述"
                       :showCounter="true"
                       :max-length="2000"
                       v-model="tbCrmCompetitorInfoPO.description"></CrmFormTextarea>
    </CrmFormGroup>

    <!--选人组件显示-->
    <user-selected-group :title="userSelected.toPersonList.title"
                         :load-last="userSelected.toPersonList.loadLast"
                         @confirmPick="confirmPick">
      <user-selected-item slot="user_selected_item"
                          :List="userSelected.toPersonList.selectedList"
                          @showUserSelectedBox="showUserSelectedBox('toPersonList')"
                          @removeSelected="(payload)=>removeSelected('toPersonList',payload)">
      </user-selected-item>
    </user-selected-group>

    <user-selected-group :title="userSelected.ccPersonList.title"
                         :load-last="userSelected.ccPersonList.loadLast"
                         @confirmPick="confirmPick">
      <user-selected-item slot="user_selected_item"
                          :List="userSelected.ccPersonList.selectedList"
                          @showUserSelectedBox="showUserSelectedBox('ccPersonList')"
                          @removeSelected="(payload)=>removeSelected('ccPersonList',payload)">
      </user-selected-item>
    </user-selected-group>

    <div class="crm-competitor-add-save">
      <QwuiButton text="保存"
                  type="primary"
                  @click.native="save"></QwuiButton>
    </div>
    <!-- 选择规模/竞争力弹窗 -->
    <popup v-model="showPopup"
           position="right"
           width="100%"
           :showMask="false"
           :is-transparent="true">
      <div class="crm-competitor-add-radio-popup popop-has-bottombar">
        <group title="请选择">
          <radio :options="radioPopupContent.options"
                 v-model="radioPopupContent.value"></radio>
        </group>
      </div>
    </popup>

    <!--选人组件选择弹窗-->
    <user_choose :selectconfig="dataBase.selectConfig"
                 v-if="dataBase.selectConfig.show"
                 :tabActive="dataBase.selectConfig.signIndex =='depts'?'dept':'group'"
                 :closeUser="dataBase.selectConfig.signIndex =='depts'"
                 :closeGroup="dataBase.selectConfig.signIndex =='depts'"
                 :closeAllTab="dataBase.selectConfig.signIndex =='depts'">
    </user_choose>
  </div>
</template>

<script>
import CrmFormTextarea from "crm/components/CrmForm/Textarea";
import CrmFormInput from "crm/components/CrmForm/Input";
import CrmFormGroup from "crm/components/CrmForm/Group";
import userSelectedItem from "@/components/base/userOrDeptSelect/user_selected";
import userSelectedGroup from "@/components/base/userOrDeptSelect/user_selected_group";
import QwuiButton from "@/components/base/button/button";
import user_choose from "@/components/base/user_or_dept_select.vue"; //js导入
import { Popup, Group, Radio } from "vux";
import {
  addCompetitor,
  updateCompetitor,
  getOldGivenList,
  getCompetitorSetting
} from "crm/api/competitor";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CrmCompetitorAdd",
  components: {
    CrmFormTextarea,
    CrmFormInput,
    CrmFormGroup,
    userSelectedItem,
    userSelectedGroup,
    QwuiButton,
    Popup,
    Group,
    Radio,
    user_choose
  },
  data() {
    return {
      userSelected: {
        toPersonList: {
          title: "负责人（可查看、修改资料）",
          loadLast: { show: true, name: "加载上次", type: "toPersonList" },
          selectedList: []
        },
        ccPersonList: {
          title: "相关人（可查看资料）",
          loadLast: { show: true, name: "加载上次", type: "ccPersonList" },
          selectedList: []
        }
      },
      dataBase: dataBase,
      showPopup: false,
      competition: {
        options: ["弱竞争力", "一般竞争力", "潜在竞争力", "强竞争力"]
      },
      scale: {
        options: [
          "0-20人",
          "20-50人",
          "50-100人",
          "100-200人",
          "200-500人",
          "500-1000人",
          "1000人以上"
        ]
      },
      radioPopupContent: {
        options: []
      },
      tbCrmCompetitorInfoPO: {},
      cacheUserList: {
        toPersonList: [],
        ccPersonList: []
      },
      toPersonsIsRadio: true
    };
  },
  computed: {
    ...mapGetters(["competitorDetial"])
  },
  watch: {
    "$route.query"(val) {
      if (!val.scale && !val.competition) {
        this.showPopup = false;
      } else {
        this.showPopup = true;
        if (val.scale) {
          document.title = "规模";
          this.radioPopupContent = this.scale;
        }
        if (val.competition) {
          document.title = "竞争力";
          this.radioPopupContent = this.competition;
        }
      }
    },
    "competition.value"(val) {
      if (this.$route.query.competition) {
        this.$router.go(-1);
      }
      this.tbCrmCompetitorInfoPO.competitorPower =
        this.competition.options.indexOf(val) + 1;
    },
    "scale.value"(val) {
      if (this.$route.query.scale) {
        this.$router.go(-1);
      }
      this.tbCrmCompetitorInfoPO.scale = this.scale.options.indexOf(val) + 1;
    }
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    ...mapActions(["addCachePage", "removeCachePage"]),
    init() {
      if (
        this.$route.query.id &&
        this.$route.query.id === this.competitorDetial.id
      ) {
        //编辑
        this.removeCachePage("CrmCompetitorAdd");
        this.$route.meta.title = "编辑竞争对手";
        this.tbCrmCompetitorInfoPO.competitorName = this.competitorDetial.competitorName;
        this.tbCrmCompetitorInfoPO.advantage = this.competitorDetial.advantage;
        this.tbCrmCompetitorInfoPO.disadvatage = this.competitorDetial.disadvatage;
        this.tbCrmCompetitorInfoPO.strategy = this.competitorDetial.strategy;
        this.tbCrmCompetitorInfoPO.contactInfo = this.competitorDetial.contactInfo;
        this.tbCrmCompetitorInfoPO.description = this.competitorDetial.description;
        this.tbCrmCompetitorInfoPO.id = this.competitorDetial.id;
        // this.scale.value = this.scale.options[this.competitorDetial.scale];
        this.$set(
          this.scale,
          "value",
          this.scale.options[this.competitorDetial.scale - 1]
        );
        this.$set(
          this.competition,
          "value",
          this.competition.options[this.competitorDetial.competitorPower - 1]
        );
        // this.competition.value = this.competition.options[
        //   this.competitorDetial.competitorPower
        // ];
        this.userSelected.toPersonList.selectedList = this.competitorDetial.toPersons;
        this.userSelected.ccPersonList.selectedList = this.competitorDetial.ccPersons;
      } else {
        //新建
        this.$route.meta.title = "新建竞争对手";
        this.addCachePage("CrmCompetitorAdd");
        this.userSelected.toPersonList.selectedList = [
          {
            personName: _.personName,
            userId: _.userId,
            headPic: _.headPic
          }
        ];
      }

      //获取负责人单多选设置
      _.showLoading();
      getCompetitorSetting().then(res => {
        _.hideLoading();
        if (res.code == 0) {
          // res.data.multiple 0关闭多选 1开启
          this.toPersonsIsRadio = res.data.multiple == 0;
        } else {
          _.alert("提示信息", res.desc);
        }
      });
    },
    //保存
    save() {
      if (!this.tbCrmCompetitorInfoPO.competitorName) {
        _.alert("提示信息", "请输入企业名称");
        return;
      }
      if (this.userSelected.toPersonList.selectedList.length === 0) {
        _.alert("提示信息", "请选择负责人");
        return;
      }

      let toPersons = this.userSelected.toPersonList.selectedList.map(
        (item, index) => {
          return {
            userId: item.userId,
            sort: index + 1
          };
        }
      );

      let ccPersons = this.userSelected.ccPersonList.selectedList.map(
        (item, index) => {
          return {
            userId: item.userId,
            sort: index + 1
          };
        }
      );

      _.showLoading();
      let dataJson = {
        dataJson: JSON.stringify({
          tbCrmCompetitorInfoPO: this.tbCrmCompetitorInfoPO,
          toPersons,
          ccPersons
        })
      };
      (() => {
        if (this.tbCrmCompetitorInfoPO.id) {
          return updateCompetitor(dataJson);
        } else {
          return addCompetitor(dataJson);
        }
      })().then(res => {
        _.hideLoading();
        if (res.code == 0) {
          this.removeCachePage("CrmCompetitorAdd");
          this.removeCachePage("CrmCompetitorList");
          setTimeout(() => {
            // 给清除缓存留点时间 ，watch不到缓存列表的变化
            if (
              this.tbCrmCompetitorInfoPO.id ||
              ["select", "list"].includes(this.$route.query.from)
            ) {
              this.$router.go(-1);
            } else {
              this.$router.replace("/competitor/list");
            }
          });
        } else {
          _.alert("提示信息", res.desc);
        }
      });
    },
    openPopup(val) {
      this.$router.push({
        path: "/competitor/add",
        query: {
          [val]: true
        }
      });
    },
    //加载上次
    confirmPick(type, boolean) {
      let _type = ["", "toPersonList", "ccPersonList"].indexOf(type);
      if (boolean) {
        getOldGivenList(_type).then(res => {
          if (res.code == 0) {
            this.cacheUserList[type] = this.userSelected[type].selectedList;
            if (
              type === "toPersonList" &&
              this.toPersonsIsRadio &&
              res.data.ccOrTolist &&
              res.data.ccOrTolist.length > 1
            ) {
              // this.$set(this.userSelected[type].loadLast, "isGetVal", false);
              // _.alert("提示信息", "只能选择单个负责人");
              this.userSelected[type].selectedList = [res.data.ccOrTolist[0]];
            } else {
              this.userSelected[type].selectedList = res.data.ccOrTolist || [];
            }
          } else {
            // this.$set(this.userSelected[type].loadLast, "isGetVal", false);
            _.alert("提示信息", res.desc);
          }
        });
      } else {
        this.userSelected[type].selectedList = this.cacheUserList[type];
      }
    },
    // 点击选人+
    showUserSelectedBox(type) {
      if (type === "toPersonList" && this.toPersonsIsRadio) {
        this.dataBase.selectConfig.selectList.toPersonList.userRestriction = 1;
      }
      this.dataBase.selectConfig.signIndex = type;
      //callBack回调
      this.dataBase.selectConfig.selectList[
        type
      ].callBack.confirm = this.selectedUserConfirm;
      //默认选择
      this.dataBase.selectConfig.selectList[type].userSelected = JSON.parse(
        JSON.stringify(this.userSelected[type].selectedList)
      );
      this.dataBase.selectConfig.show = true;
    },
    // 选人成功
    selectedUserConfirm(type, data) {
      this.userSelected[type].selectedList = data.user.data;
      // console.log(type, data);
    },
    // 点击x
    removeSelected(type, data) {
      this.userSelected[type].selectedList.splice(data.index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.crm-competitor-add {
  height: 100%;
  overflow-y: auto;
  background-color: #f6f7fb;
  &-save {
    background-color: #fff;
    margin-top: 8px;
    padding: 6px 14px;
  }
}
</style>

<style lang="scss">
@import "crm/style/variable.scss";

.crm-competitor-add {
  .qwui-user_select_box {
    .qwui-user_select_charge {
      margin-top: 8px;
      .qwui-user_select_title {
        background-color: #fff;
      }
    }
    .qwui-user_select_title:after,
    .qwui-user_select_charge:after {
      border-bottom: 0;
    }
  }
  .crm-competitor-add-radio-popup {
    max-width: $pageMaxWidth;
    margin: auto;
    height: 100%;
    overflow-y: auto;
    background-color: #fff;
    .weui-cells__title {
      font-size: 15px;
      color: #0a1735;
    }
    .weui-check__label {
      font-size: 15px;
      color: #0a1735;
    }
  }
}
</style>

