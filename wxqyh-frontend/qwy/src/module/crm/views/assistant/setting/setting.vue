<template>
  <div class="setting">
    <div class="header">
      <div class="normal_btn qw-return_btn"
           @click="goBack"></div>
      <span>企微云小站 / </span>设置
    </div>
    <div class="content">
      <div class="crm_setting_wrap">
        <div class="crm_wrap_item cardSet_item"
             permission="clientSet">
          <div class="qwui-item_header">
            <div class="qwui-item_title">允许编辑名片上的职位</div>
            <div class="switch1"
                 @click="editSwitch">
              <p id="edit_cardPosition"
                 :class="switchFlag? 'on':'off'"></p>
            </div>
          </div>
          <p class="qwui-item_content">开启后用户可编辑名片上的职位，但不会同步更新通讯录的职位</p>
        </div>
        <a class="crm_wrap_item smallPrograme_item"
           :class="{hoverItem: isVipGold}"
           permission="clientSet"
           @click="goPage">
          <div class="qwui-item_header">
            <div class="qwui-item_title">小程序菜单设置</div>
            <div class="qwui-item_tag"></div>
          </div>
          <p class="qwui-item_content">自定义小程序的菜单显示，满足不同企业的业务需要</p>
          <div class="qwui-item_tip"
               v-if="!isVipGold">
            该功能仅限尊享版用户使用，
            <span @click="buyVIP">马上升级尊享版 ></span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSmallProgrameEditPosition,
  changeSmallProgrameEditPosition
} from "crm/api/assistant";
import { isVipGold } from "@/assets/js/vip-manager";
export default {
  components: {},
  created() {
    //获取编辑名片职位的开关状态,'0'为开,'1'为关
    getSmallProgrameEditPosition(
      {
        agentCode: "crm_wxapp_able_edit_position"
      },
      res => {
        if (res.is_photograph == "0") {
          this.switchFlag = true;
          this.switchNumber = "0";
        } else {
          this.switchFlag = false;
          this.switchNumber = "1";
        }
      }
    );
    //判断是否为尊享版
    this.isVipGold = isVipGold(interfaceCode.INTERFACE_CODE_CRMMINI);
  },
  data() {
    return {
      switchFlag: false,
      switchNumber: "1",
      isVipGold: false
    };
  },
  methods: {
    // 返回
    goBack() {
      this.$router.push({ name: "assistantGuide" });
    },
    editSwitch() {
      this.switchNumber = this.switchNumber == "0" ? "1" : "0";
      this.switchFlag = !this.switchFlag;
      changeSmallProgrameEditPosition(
        {
          agentCode: "crm_wxapp_able_edit_position",
          isPhotograph: this.switchNumber
        },
        res => {}
      );
    },
    goPage() {
      if (this.isVipGold) {
        this.$router.push({ name: "smallProgramMenuSet" });
      }
    },
    buyVIP() {
      window.open(
        _.baseURL +
          "/vm/module/service.html#/open/home?type=viprespect_crmpackage"
      );
    }
  }
};
</script>

<style src='./setting.scss' lang="scss" scoped></style>

