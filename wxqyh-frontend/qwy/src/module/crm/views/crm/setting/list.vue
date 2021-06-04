<template>
  <div class="crm-setting-list">
    <section class="setting-section"
             v-for="(item, index) in list"
             :key="index">
      <div class="setting-section-title">
        <i v-if="item.icon"
           :style="{
          backgroundImage:`url(${item.icon})`
        }"></i>
        <h4>{{item.name}}</h4>
      </div>
      <div class="setting-section-options">
        <div class="setting-section-item"
             :class="{
                link:sItem.type.includes('link')
              }"
             v-for="(sItem, sIndex) in item.options"
             :key="sIndex"
             @click="onClick(sItem)"
             v-perm="item.permission">

          <div class="setting-section-item-title">
            <div class="setting-section-item-title-left">
              <p>{{sItem.name}} </p>
              <i v-if="sItem.icon"
                 :style="{
          backgroundImage:`url(${sItem.icon})`
        }"></i>

            </div>

            <qwui-switch v-if="sItem.type.includes('switch')"
                         :defaultStatus="sItem.status"
                         @change="onChange(sItem)"
                         @click.native.stop="()=>{}"></qwui-switch>
          </div>
          <div class="setting-section-item-tips">{{sItem.tips}}</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import QwuiSwitch from "@/components/qwuiBase/qwuiSwitch/qwuiSwitch";
import {
  getImgWatermarkSet,
  getClientCharge,
  getDeleteContract,
  getCompetitorCharge,
  updateIsAddWatermark,
  updateClientCharge,
  updateDeleteContract,
  updateCompetitorCharge,
  getClientGradeStatus,
  updateClientGradeStatus
} from "crm/api/setting";

export default {
  name: "crmSettingList",
  components: {
    QwuiSwitch
  },
  data() {
    return {
      list: [
        //改变数组长度或者顺序时 请查看init()里的数据赋值是否需要调整
        {
          icon: require("@/assets/images/setting_obj.png"),
          name: "业务对象设置",
          options: [
            {
              name: "数据权限设置",
              tips: "设置各团队的CRM数据查看权限",
              type: "link",
              key: "dataPermission",
              permission: "clientCustom"
            },
            {
              name: "公海池设置",
              tips: "设置公海类型、成员等",
              type: "link",
              key: "poolSetting",
              permission: "poolCustom"
            },
            {
              name: "公海规则",
              tips: "设置客户领取、回收规则、提醒时间等",
              type: "link",
              permission: "poolRuleCustom",
              key: "poolRule"
            },
            {
              name: "客户类别",
              tips: "客户类别可用于管理客户的可见范围",
              type: "link",
              key: "clientType",
              permission: "clientType"
            },
            {
              name: "合同类型",
              tips: "根据业务情况可自定义合同审批流程",
              type: "link",
              key: "contractType",
              permission: "contractType"
            },
            {
              name: "合同分支流程设置",
              tips: "合同流程为分支流程，可设置具体内容",
              type: "link",
              permission: "contractType",
              key: "contractBranch"
            },
            {
              name: "发票类型及税率",
              tips: "创建和管理发票类型，自定义发票税率",
              type: "link",
              key: "billType",
              permission: "taxType"
            },
            {
              name: "拜访设置",
              tips: "设置拜访地址修改、选择图片等权限",
              type: "link",
              permission: "",
              key: "visit"
            },
            {
              name: "查重规则",
              tips: "设置业务对象查重规则",
              type: "link",
              key: "checkRepeat",
              permission: "repeatSetting"
            }
          ]
        },
        {
          icon: require("@/assets/images/setting_custom.png"),
          name: "自定义字段设置",
          options: [
            {
              name: "客户自定义字段",
              tips: "设置“客户”和“公海客户”的字段",
              type: "link",
              key: "clientCustom",
              permission: "clientCustom"
            },
            {
              name: "联系人自定义字段",
              tips: "设置“联系人”的字段",
              type: "link",
              key: "contactCustom",
              permission: "contactCustom"
            },
            {
              name: "商机自定义字段",
              tips: "设置“商机”的字段",
              type: "link",
              key: "businessCustom",
              permission: "businessCustom"
            },
            {
              name: "拜访自定义字段",
              tips: "设置“拜访”的字段",
              type: "link",
              key: "visitCustom",
              permission: "visitCustom"
            },
            {
              name: "合同自定义字段",
              tips: "设置“合同”的字段",
              type: "link",
              key: "contractCustom",
              permission: "contractCustom"
            }
          ]
        },
        {
          icon: require("@/assets/images/setting_other.png"),
          name: "其他设置",
          options: [
            {
              name: "菜单设置",
              tips: "应用端消息主页菜单，修改后1天内生效",
              type: "link",
              permission: "menuUpdate",
              key: "menu"
            },
            {
              name: "客户负责人转派",
              tips: "批量转移客户、联系人、商机、拜访",
              type: "link",
              permission: "clienTtransferred",
              key: "clienTtransferred"
            },
            {
              name: "提醒设置",
              tips: "设置应用端的推送提醒",
              type: "link",
              key: "alarm"
            },
            {
              name: "图片添加水印",
              tips: "上传图片时增加用户名和时间标记",
              type: "switch",
              key: "imgWatermar",
              permission: "visitWatermark"
            },
            {
              name: "允许添加多个客户负责人",
              tips: "开启后同个客户可添加多个负责人",
              type: "switch",
              key: "clientCharge",
              permission: "clientSet"
            },
            {
              name: "允许删除已审批合同",
              tips: "合同负责人可在审批结束后删除合同",
              type: ["switch"],
              key: "deleteContract",
              permission: "clientSet"
            },
            {
              name: "允许添加多个竞争对手负责人",
              tips: "开启后同个竞争对手可添加多个负责人",
              type: "switch",
              key: "competitorCharge"
            }
          ]
        },
        {
          icon: require("@/assets/images/setting_high_grade.png"),
          name: "高级设置",
          options: [
            {
              name: "客户智能分级",
              tips: "根据自定义标准划分客户级别",
              type: ["link"],
              key: "customerLevel",
              icon: require("@/assets/images/vip_icon.png")
            }
          ]
        }
      ],
    };
  },
  methods: {
    onClick(item) {
      if (!item.type.includes("link")) {
        return;
      }
      this.$router.push(`/crm/setting/${item.key}`);
    },
    onChange(item) {
      dataBase.loading = true;
      this.$set(item, "status", !item.status);
      this[item.key + "Set"](item.status ? "1" : "0")
        .then(res => {
          // dataBase.top_alert("更新成功", true, 1000);
        })
        .catch(err => {
          dataBase.alert(
            "错误提示",
            err && err.desc && err.desc ? err.desc : "网络错误"
          );
          this.$set(item, "status", !item.status);
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    init() {
      let { alert: _alert } = dataBase;
      dataBase.loading = true;
      Promise.all([
        getImgWatermarkSet(),
        getClientCharge(),
        getDeleteContract(),
        getCompetitorCharge(),
        getClientGradeStatus()
      ])
        .then(res => {
          // console.log(res);
          if (
            res.some(item => {
              item.code != 0 && _alert("错误提示", item.desc);
              return item.code != 0;
            })
          ) {
            return;
          }
          let vo = res[0].data.tbQyWatermarkSettingVO;
          if (vo) {
            // 图片添加水印
            this.$set(
              this.list[2].options[3],
              "status",
              vo.isAddWatermark === "1"
            );
          }
          //是否允许添加多个客户负责人
          this.$set(
            this.list[2].options[4],
            "status",
            res[1].data.is_photograph === "1"
          );

          // 允许删除已审批合同
          this.$set(
            this.list[2].options[5],
            "status",
            res[2].data.isPermit === "1"
          );

          // 允许竞争对手多负责人
          this.$set(
            this.list[2].options[6],
            "status",
            res[3].data.multiple === "1"
          );

          if (this.list[3] && this.list[3].options[0]) {
            //是否开启客户智能分级
            this.$set(
              this.list[3].options[0],
              "status",
              res[4].data.is_photograph === "1"
            );
          }
        })
        .catch(err => {
          _alert("错误提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    // 图片添加水印
    imgWatermarSet(status) {
      return new Promise((resolve, reject) => {
        updateIsAddWatermark(status)
          .then(res => {
            if (res.code === "0") {
              resolve();
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //是否允许添加多个客户负责人
    clientChargeSet(status) {
      return new Promise((resolve, reject) => {
        updateClientCharge(status)
          .then(res => {
            if (res.code === "0") {
              resolve();
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 允许删除已审批合同
    deleteContractSet(status) {
      return new Promise((resolve, reject) => {
        updateDeleteContract(status)
          .then(res => {
            if (res.code === "0") {
              resolve();
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 允许竞争对手多负责人
    competitorChargeSet(status) {
      return new Promise((resolve, reject) => {
        updateCompetitorCharge(status)
          .then(res => {
            if (res.code === "0") {
              resolve();
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 是否开启客户智能分级
    customerLevelSet(status) {
      return new Promise((resolve, reject) => {
        updateClientGradeStatus(status)
          .then(res => {
            if (res.code === "0") {
              resolve();
            } else {
              reject(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.crm-setting-list {
  .setting-section {
    padding-bottom: 20px;
    &:not(:last-child) {
      border-bottom: 1px dashed #ccc;
    }
    &:last-child {
      margin-bottom: 150px;
    }
    &-title {
      margin: 30px 0 15px;
      height: 20px;
      font-size: 18px;
      line-height: 20px;
      display: flex;
      align-items: center;
      i {
        display: inline-block;
        margin-right: 10px;
        width: 20px;
        height: 20px;
        background-size: contain;
      }
    }
    &-options {
      display: flex;
      flex-wrap: wrap;
    }
    &-item {
      width: 28%;
      padding: 10px 1%;
      margin-right: 30px;
      margin-right: 3.3%;
      &-title {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-left {
          display: flex;
          align-items: center;
          p {
            flex: 1;
          }
          i {
            display: inline-block;
            width: 48px;
            height: 20px;
            background-size: contain;
            background-repeat: no-repeat;
            margin: 0 5px;
          }
        }
      }
      &-tips {
        color: #999;
        margin-top: 5px;
      }
      &.link:hover {
        cursor: pointer;
        background-color: #eee;
        .setting-section-item-title {
          color: #f87b00;
        }
      }
    }
  }
}
</style>


