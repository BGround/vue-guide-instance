<template>
  <div class="setting-pool-rule">
    <div class="pool-rule-header">
      <setting-header :pages="['设置','公海规则设置']"
                      @go-back="$router.go(-1)"></setting-header>
    </div>
    <div class="pool-rule-body">
      <div class="rule-item">
        <div class="rule-item-left pdt6px">客户额度上限</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.upperLimit"></qw-input>
            个客户
            <span>（成交客户不再占用名额）</span>
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left pdt6px">连续领取规则</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.seriesRule"></qw-input>
            天内，不能领取同一个客户
            <span>（客户被主动退回或被动回收后一定时间不能再领取该客户）</span>
          </div>
          <div class="rule-item-right-cell">
            <qw-checkbox v-model="rule.isOpen">允许公海成员领取前查看公海客户详情</qw-checkbox>
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left">自动回收规则</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            系统将自动回收
            <span>（自动回收规则适用于除默认公海外的其他公海）</span>
          </div>
          <div class="rule-item-right-cell">
            获取之后
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.updateRule"></qw-input>
            天没有持续跟进的客户
            <span>（新建拜访单和商机阶段推进属于跟进行为）</span>
          </div>
          <div class="rule-item-right-cell ml42px">
            或
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.signRule"></qw-input>
            天没有成交的客户
            <span>（必须大于上一项）</span>
          </div>
          <div class="rule-item-right-cell ml42px"
               v-if="rule.updateRule>=rule.signRule">
            <p class="error">必须大于上一项设置的天数</p>
          </div>
          <div class="rule-item-right-cell">
            成交之后
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.afterSignRule"></qw-input>
            天没有持续跟进的客户
          </div>
          <div class="rule-item-right-cell ml42px">
            或
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.againSignRule"></qw-input>
            天没有再次成交的客户
            <span>（必须大于上一项）</span>
          </div>
          <div class="rule-item-right-cell ml42px"
               v-if="rule.afterSignRule>=rule.againSignRule">
            <p class="error">必须大于上一项设置的天数</p>
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left">设置成交定义</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            <qw-checkbox v-model="rule.signContract">商机阶段签约交款 </qw-checkbox>
            <qw-checkbox v-model="rule.createContract"
                         class="ml42px">创建合同 </qw-checkbox>
            <span>（至少一项）</span>
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left">转移客户规则</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell rule-margin">
            <qw-Radio v-model="rule.changeRule" label="1">转移后仍为成交客户 </qw-Radio>
            <qw-Radio v-model="rule.changeRule" label="0"
                      class="ml42px">转移后重置为未成交客户 </qw-Radio>
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left pdt6px">即将回收提醒</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            系统提前
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.remindRule"></qw-input>
            天提醒用户即将回收客户
          </div>
        </div>
      </div>
      <div class="rule-item">
        <div class="rule-item-left pdt6px">自动冻结规则</div>
        <div class="rule-item-right">
          <div class="rule-item-right-cell">
            连续退回
            <qw-input input-type="sort"
                      input-tips=""
                      v-model.number="rule.backTimes"></qw-input>
            次的客户将被自动冻结
          </div>
        </div>
      </div>
    </div>
    <div class="pool-rule-fotter">
      <qw-button type="primary"
                 @click="save">保存</qw-button>
    </div>
  </div>
</template>
<script>
import SettingHeader from "./components/settingHeader";
import QwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import QwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import QwCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import QwRadio from "@/components/qwuiBase/qwuiRadio/qwuiRadio";
import { getPoolRule, savePoolRule } from "crm/api/setting";
import { isVipGold } from "@/assets/js/vip-manager";
import baseURL from "@/assets/js/baseURL_config";
export default {
  name: "settingPoolRule",
  components: {
    SettingHeader,
    QwInput,
    QwButton,
    QwCheckbox,
    QwRadio,
  },
  data() {
    return {
      rule: {
        upperLimit: 20, //个客户 maxlength="3" data-default="20"
        seriesRule: 30, //天内，不能领取同一个客户 maxlength="3" data-default="30"
        isOpen: 0, //允许公海成员领取前查看公海客户详情 0\\1
        updateRule: 7, //获取之后 没有持续跟进 maxlength="3" data-default="7"
        signRule: 30, //获取之后 没有成交  maxlength="3" data-default="30"
        afterSignRule: 21, //成交之后 没有持续跟进  maxlength="3" data-default="21"
        againSignRule: 180, //或 天没有再次成交的客户 maxlength="3" data-default="180"
        signContract: 0, // 商机阶段签约交款 0\\1
        createContract: 0, // 创建合同 0\\1
        changeRule: 0, // 重置为未成交 0\\1
        remindRule: 7, //系统提前 天提醒用户即将回收客户 maxlength="3" data-default="7"
        // delaySwitch: 0,
        backTimes: 3 //  连续退回 次的客户将被自动冻结 maxlength="3" data-default="3"
      }
    };
  },
  watch: {
    rule: {
      deep: true,
      handler(val) {
        // console.log(val.updateRule);
        Object.keys(val).forEach(key => {
          // if (Number.isNaN(Number.parseFloat(val[key]))) {
          //   val[key] = 0;
          //   return;
          // }

          if (Number(val[key]) < 0) {
            val[key] = 0;
          }
          //  else if (Number(val[key]) > 999) {
          //   val[key] = 999;
          // }
        });
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      dataBase.loading = true;
      getPoolRule()
        .then(res => {
          if (res.code == "0") {
            Object.keys(this.rule).forEach(key => {
              this.rule[key] = Number.parseInt(res.data.ruleVO[key]);
            });
            this.rule.changeRule += '';
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
    },
    isChecked() {
      if (!isVipGold(interfaceCode.INTERFACE_CODE_CRM)) {
        dataBase.alert(
          "提示",
          '该功能仅限尊享版使用，<a style="color:#f87b00" href=' +
            baseURL +
            "/qiweipublicity/companysrv/vip/vip_gold_index.jsp" +
            ' target="_blank">马上升级</a>'
        );
        return false;
      }
      //过滤 数字后面加符号
      if (
        Object.keys(this.rule).some(key => {
          return (
            typeof this.rule[key] !== "boolean" &&
            Number.isNaN(Number.parseFloat(this.rule[key]))
          );
        })
      ) {
        dataBase.top_alert("填写错误，请检查", false, 2000);
        return false;
      }
      if (this.rule.updateRule >= this.rule.signRule) {
        dataBase.top_alert("填写错误，请检查", false, 2000);
        return false;
      }
      if (this.rule.afterSignRule >= this.rule.againSignRule) {
        dataBase.top_alert("填写错误，请检查", false, 2000);
        return false;
      }
      if (!this.rule.signContract && !this.rule.createContract) {
        dataBase.top_alert("成交定义至少选一个", false, 2000);
        return false;
      }
      return true;
    },
    save() {
      if (this.isChecked()) {
        dataBase.loading = true;
        let _rule = {};
        Object.keys(this.rule).forEach(key => {
          _rule["poolRulePO." + key] = Number(this.rule[key]);
        });
        savePoolRule(_rule)
          .then(res => {
            if (res.code == "0") {
              dataBase.top_alert("保存成功", true, 1000);
              setTimeout(() => {
                this.$router.go(-1);
              }, 500);
            } else {
              dataBase.alert("提示信息", res.desc);
            }
          })
          .catch(err => {
            dataBase.alert("提示信息", "网络错误");
          })
          .finally(() => {
            dataBase.loading = false;
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-pool-rule {
  .ml42px {
    margin-left: 42px;
  }
  .pdt6px {
    padding-top: 6px;
  }
  .pool-rule-body {
    padding: 30px;
    border-bottom: 1px solid #eee;
    .rule-item {
      display: flex;
      // margin-bottom: 20px;
      &-left {
        width: 8em;
        text-align: right;
        margin-right: 10px;
      }
      &-right {
        &-cell {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          span {
            color: #999;
          }
          .error {
            display: flex;
            color: red;
            &::before {
              content: "";
              display: inline-block;
              width: 20px;
              height: 20px;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAKlBMVEX////XY1Hma1rsfGbzhm3vloXwqZz3uanxwLX4z8f76+j//v7////KWkTZGHxrAAAAAXRSTlMAQObYZgAAAAFiS0dEDIGzUWMAAAAJcEhZcwAACxMAAAsTAQCanBgAAACSSURBVHheTc4xC4JAAEDhBwaZUy5tQYgYrl0QBW3aUNvh5WqEBI2WzbU2FbS5SESEa/QT2htb/C/R5pve+FHpEXhHgIa32okTcAkDP3XB8FNPhDJHH0xvw2cSUYv7RSZVB20rZm/L+aBtRFb0/qPc1+iqmtS7jrQOiwjDTiyzNc7hPJH28gvo5jwu9wD3drmuGH4w6SDkKQ/JcAAAAABJRU5ErkJggg==);
              background-size: contain;
              background-repeat: no-repeat;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
  .pool-rule-fotter {
    text-align: center;
    margin: 20px 0 50px;
  }
}
</style>
<style lang="scss">
.setting-pool-rule {
  .pool-rule-body {
    .input_wrap {
      .qw_sortInput {
        border-radius: 4px;
        border: 1px solid #cccccc;
        height: initial;
        margin: 0 8px;
      }
    }
  }
}
.rule-margin{
  margin-top: 5px;
  margin-bottom: 15px !important;
}
</style>


