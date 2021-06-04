<template>
  <div class="setting-alarm">
    <div class="setting-alarm-header">
      <setting-header :pages="['设置','提醒设置']"
                      @go-back="$router.go(-1)"></setting-header>
    </div>
    <div class="setting-alarm-body">
      <ul>
        <li>
          <div class="item-left">
            <h6>客户回收提醒</h6>
            <p>客户已回收提醒</p>
          </div>
          <div class="item-right">
            <qwui-switch :defaultStatus="!!status.isClientRecycleReminder"
                         @change="onChange('isClientRecycleReminder')"></qwui-switch>
          </div>
        </li>
        <li>
          <div class="item-left">
            <h6>销售简报</h6>
            <p>推送昨日销售简报、上周销售简报</p>
          </div>
          <div class="item-right">
            <qwui-switch :defaultStatus="!!status.isSalesBriefing"
                         @change="onChange('isSalesBriefing')"></qwui-switch>
          </div>
        </li>
        <li>
          <div class="item-left">
            <h6>合同到期提醒</h6>
            <p>合同到达结束日期提醒</p>
            <div class="item-tags">
              <p v-if="contractAlarm.confirmCheckedTages.every(item=>{
                return !item})">无提醒对象</p>
              <template v-else>
                <span class="tag"
                      v-for="(item, index) in contractAlarm.tags"
                      :key="index"
                      v-if="contractAlarm.confirmCheckedTages[index]">
                  {{item}}
                </span>
              </template>

              <span class="edit"
                    @click="onEditContractTag"></span>
            </div>
          </div>
          <div class="item-right">
            <qwui-switch :defaultStatus="!!status.isContractExpirationReminder"
                         @change="onChange('isContractExpirationReminder')"></qwui-switch>
          </div>
        </li>
      </ul>
    </div>
    <qw-modal v-model="showModal"
              title="提醒对象"
              @on-confirm="onConfirm">
      <div class="modal-content">
        <span>该合同的：</span>
        <qw-checkbox v-for="(item, index) in contractAlarm.tags"
                     :key="index"
                     v-model="contractAlarm.checkedTags[index]">{{item}}</qw-checkbox>
      </div>
    </qw-modal>
  </div>
</template>

<script>
import SettingHeader from "./components/settingHeader";
import QwuiSwitch from "@/components/qwuiBase/qwuiSwitch/qwuiSwitch";
import {
  updateReminderSettings,
  getReminderSettings,
  getReminderContract,
  saveReminderContract
} from "crm/api/setting";
import QwCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import QwModal from "crm/components/qwModal";
export default {
  name: "settingAlarm", //提醒设置
  components: {
    SettingHeader,
    QwuiSwitch,
    QwModal,
    QwCheckbox
  },
  data() {
    return {
      status: {
        isClientRecycleReminder: 0,
        isContractExpirationReminder: 0,
        isSalesBriefing: 0
      },
      showModal: false,
      contractAlarm: {
        tags: ["负责人", "相关人", "创建人"],
        checkedTags: [],
        confirmCheckedTages: []
      }
    };
  },
  methods: {
    onChange(key) {
      dataBase.loading = true;
      this.$set(this.status, key, this.status[key] ? 0 : 1);
      updateReminderSettings(this.status)
        .then(res => {
          if (res.code == "0") {
            // dataBase.top_alert("更新成功", true, 1000);
          } else {
            this.$set(this.status, key, this.status[key] ? 0 : 1);
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          this.$set(this.status, key, this.status[key] ? 0 : 1);
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    init() {
      // getReminderSettings()
      dataBase.loading = true;
      Promise.all([getReminderSettings(), getReminderContract()])
        .then(res => {
          // console.log(res);
          if (res[0].code != "0" || res[1].code != "0") {
            dataBase.alert("提示", res.desc);
            return;
          }
          let _status = res[0].data.reminderSettingsVO;
          if (_status) {
            Object.keys(_status).forEach(key => {
              this.$set(this.status, key, _status[key] == "1" ? 1 : 0);
            });
          }

          let checkedTags = res[1].data.is_photograph.split("|").map(item => {
            return item == "1";
          });
          this.contractAlarm.confirmCheckedTages = JSON.parse(
            JSON.stringify(checkedTags)
          );
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    onEditContractTag() {
      this.contractAlarm.checkedTags = JSON.parse(
        JSON.stringify(this.contractAlarm.confirmCheckedTages)
      );
      this.showModal = true;
    },
    onConfirm() {
      dataBase.loading = true;
      let _val = "";
      this.contractAlarm.checkedTags.forEach((item, index) => {
        if (index == 0) {
          _val = Number(item);
        } else {
          _val += "|" + Number(item);
        }
      });
      saveReminderContract(_val)
        .then(res => {
          if (res.code == "0") {
            // dataBase.top_alert("更新成功", true, 1000);
            this.showModal = false;
            this.contractAlarm.confirmCheckedTages = JSON.parse(
              JSON.stringify(this.contractAlarm.checkedTags)
            );
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.setting-alarm {
  &-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 24px;
  }
  &-body {
    ul {
      li {
        justify-content: space-between;
        display: flex;
        padding: 14px 0 18px;
        border-bottom: 1px solid #dbdbdd;
        h6 {
          font-size: 16px;
        }
        p {
          margin-top: 5px;
          color: #999;
        }
        .item-tags {
          display: flex;
          align-items: center;
          margin-top: 5px;
          .tag {
            display: inline-block;
            width: 66px;
            padding: 6px 11px;
            margin-right: 4px;
            border: 1px solid #ddd;
            border-radius: 2px;
            box-sizing: border-box;
            color: #f87b00;
          }
          .edit {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-left: 8px;
            background: url(~assets/images/setting_custom.png) no-repeat center;
            background-size: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
  .modal-content {
    width: 600px;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    label {
      margin: 5px;
    }
  }
}
</style>
