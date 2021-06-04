<template>
  <div class="page-customer-level">
    <div class="page-customer-level-container">
      <!--返回按钮-->
      <qwui-go-back :goBackConfig="goBackConfig" @listenToChild="backToSetting"></qwui-go-back>
      <!-- 开关以及文案 -->
      <div class="customer-level switch_inside">
        <div class="left_discription">
          <span class="dis_top">开启客户智能分级</span>
          <span class="dis_bottom">开启后客户中会显示客户级别字段，并按照评分规则和等级划分对客户进行评级</span>
        </div>
        <div class="right_switch">
          <qwui-switch :defaultStatus="switchStatus"
            @change="onChange()"
            @click.native.stop="()=>{}"></qwui-switch>
        </div>
      </div>
      <div class="customer-level">
        <div class="title score-title">
          <qw-popover ref="step2Popover"
            placement="right"
            :hover="true"
            :gutter="30">
            <div slot="content" class="import-step-popover">
              客户分数=∑（各指标的评分*各指标的权重） 评分指标以及指标的权重可以自定义设置
            </div>
            <span class="title_left is_question">各等级分数划分</span>
          </qw-popover>
          <span class="title_right set_lvset" @click="confirm">客户级别设置</span>
        </div>
        <div class="content">
          <span class="label-item" v-for="(item, index) in filter_clientGradeInfo" :key="index">{{item.name}}：<i>{{item.minVal}}-{{item.maxVal}} </i>分</span>
        </div>
      </div>
      <div class="customer-level score-level">
        <div class="title">
          <span class="title_left">评分规则</span>
          <span @click="setRule" class="title_right set_edit">修改</span>
        </div>
        <div class="content">
          <date-Table :clientGradeIndex="clientGradeIndex"></date-Table>
        </div>
      </div>
      <div class="sve-btn">
        <qwui-button :disabled="isDisabled" type='primary' @click="saveSetting">保存</qwui-button>
      </div>
    </div>
    <level-setting v-model="visible" :level_data="clientGradeInfo" @on-save="saveGrade"></level-setting>
    <assess-rule ref="assessRule" @finish="saveClientGradeIndex"></assess-rule>
  </div>
</template>

<script>
import qwuiGoBack from '@/components/base/qwuiGoBack';
import QwModal from "crm/components/qwModal";
import dateTable from './dataTable.vue';
import levelSetting from './levelSetting';
import QwPopover from "crm/components/qwPopover";
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import QwuiSwitch from "@/components/qwuiBase/qwuiSwitch/qwuiSwitch";
import assessRule from './assessRule/index';
import { getClientGrade, saveClientGrade, getClientGradeStatus, updateClientGradeStatus } from "@/module/crm/api/setting";

import baseURL from '@/assets/js/baseURL_config';

export default {
  name: 'Index',
  data() {
    return {
      goBackConfig:{
        hasLine:false,
        lastPath:'设置',
        currPath:'客户智能分级',
        isCustomEvent: true
      },
      dataBase: dataBase,
      visible: false,
      // 等级数据划分
      clientGradeInfo: [],
      // 表格数据
      clientGradeIndex: [],

      // 开关状态
      switchStatus: false
    }
  },
  components: {
    QwModal,
    dateTable,
    qwuiGoBack,
    levelSetting,
    QwPopover,
    qwuiButton,
    assessRule,
    QwuiSwitch
  },
  computed: {
    filter_clientGradeInfo() {
      return this.clientGradeInfo.filter(item => {
        return item.display && item.display !== '0';
      });
    },
    isDisabled() {
      return this.filter_clientGradeInfo.length === 0 || this.clientGradeIndex.length === 0;
    }
  },
  created() {
    this.getClientGradeStatus();
    this.getClientGrade();
  },
  methods: {
    //获取开关状态
    getClientGradeStatus() {
      let { alert:_alert } = this.dataBase;
      getClientGradeStatus().then(res => {
        if(res.code === '0') {
          this.$set(this, 'switchStatus', res.data.is_photograph === '1');
        } else {
          _alert('提示',res.desc);
        }
      }).catch(err => {
        _alert("错误提示", "网络错误");
      })
    },
    

    // 获取等级列表
    getClientGrade() {
      let { alert:_alert } = this.dataBase;
      getClientGrade().then(res => {
        if(res.code === '0') {
          let { clientGradeInfo, clientGradeIndex } = res.data;
          this.$set(this, 'clientGradeInfo', this.deepClone(clientGradeInfo));
          this.$set(this, 'clientGradeIndex', clientGradeIndex);
          if (clientGradeInfo.length === 0) {
            this.$set(this, 'clientGradeInfo', this.deepClone([{
              name: "",
              minVal: "",
              maxVal: "",
              display: ""
            }]))
            const msg = `<div class="setting-warning">还未设置评级规则，立即去设置</div>`;
            this.dataBase.alert('提示', msg, this.confirm, '确定',true);
          }
        } else {
          _alert('提示',res.desc);
        }
      }).catch(err => {
        _alert("错误提示", "网络错误");
      })
    },
    // 打开设置弹窗
    confirm() {
      this.visible = true;
    },
    // 暂存设置后的等级划分
    saveGrade(data) {
      this.$set(this, 'clientGradeInfo', data);
      this.visible = false;
    },
    // 保存设置
    saveSetting() {
      let { alert:_alert } = this.dataBase;
      let flag = this.clientGradeInfo.some(item => {
        return flag = item.name === '' || item.minVal === '' || item.maxVal === ''
      });
      if(flag) {
        _alert('提示', '客户级别信息未填写完整');
      } else {
        // 将等级的display 的值处理为字符串
        let formatClientGradeInfo = this.deepClone(this.clientGradeInfo);
        formatClientGradeInfo.map(item => {
          if (item.display === null) {
            item.display = '0'
          } else {
            item.display = item.display.toString();
          }
          return item;
        })
        let clientGradeInfo = JSON.stringify(formatClientGradeInfo);
        let clientGradeIndex = JSON.stringify(this.clientGradeIndex);
        const data = Object.assign({}, {clientGradeInfo,clientGradeIndex});
        saveClientGrade(data).then(res => {
          if(res.code === '0'){
            dataBase.top_alert('保存成功',true,2000);
          } else {
            _alert('提示', res.desc);
          }
        })
      }
    },
    // 设置平分规则
    setRule() {
      this.$refs.assessRule.toggleDialog(this.clientGradeIndex)
    },
    // 暂存评分规则
    saveClientGradeIndex(data) {
      this.$set(this, 'clientGradeIndex', this.deepClone(data));
    },
    // 深克隆对象/数组
    deepClone(obj){
      return JSON.parse(JSON.stringify(obj))
    },
    // 点击设置返回
    backToSetting() {
      this.$router.go(-1);
    },
    // 开关切换
    onChange() {
      let { alert:_alert } = this.dataBase;
      this.dataBase.loading = true;
      let status = this.switchStatus ? "0" : "1";
      updateClientGradeStatus(status).then(res => {
        if (res.code === '0') {
          this.switchStatus = !this.switchStatus;
        } else {
          _alert('提示', res.desc);
        }
      }).catch(err => {
        _alert(
          "错误提示",
          err && err.desc && err.desc ? err.desc : "网络错误"
        );
      })
      .finally(() => {
        this.dataBase.loading = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.page-customer-level {
  & /deep/ input::-webkit-outer-spin-button,
  & /deep/ input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  .setting-warning {
    padding-bottom: 20px;
  }
  .import-step-popover {
    padding: 12px;
    width: 239px;
    height: 35px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(10,23,53,1);
    line-height: 17px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.1);
    border-radius: 2px;
  }
  .page-customer-level-container {
    .customer-level {
      padding: 20px 0;
      &.switch_inside {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        padding: 14px 0 17px 12px;
        .left_discription {
          display: flex;
          flex-direction: column;
          .dis_top {
            padding-bottom: 9px;
            font-size:16px;
            font-family:MicrosoftYaHei;
            color:rgba(51,51,51,1);
            line-height:21px;
          }
          .dis_bottom {
            font-size:14px;
            font-family:MicrosoftYaHei;
            color:rgba(153,153,153,1);
            line-height:19px;
          }
        }
      }
      .content {
        display: flex;
        flex-wrap: wrap;
        .label-item {
          height:20px;
          padding: 16px 12px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:20px;
          background:rgba(248,123,0,0.05);
          border-radius:4px;
          margin-right: 40px;
          margin-bottom: 20px;
          i {
            color: #F87B00;
          }
        }
      }
      &.score-level {
        padding-bottom: 40px;
        border-bottom: 1px solid #F0F0F0;
      }
      .title {
        padding-right: 20px;
        padding-bottom: 26px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.score-title {
          padding-bottom: 50px;
        }
        .title_left {
          position: relative;
          height:20px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:20px;
          &:before {
            content: '|';
            color: #f87b00;
            margin-right: 11px;
            width: 2px;
            height: 14px;
          }
          &.is_question:after {
            position: absolute;
            content: '';
            background: url('~assets/images/icon_b-set_detail.png') no-repeat center;
            margin-left: 4px;
            width: 16px;
            height: 16px;
            padding: 2px 0;
            cursor: pointer;
          }
        }
        .title_right {
          position: relative;
          height:20px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(248,123,0,1);
          line-height:20px;
          padding-left: 8px;
          cursor: pointer;
          &:before {
            position: absolute;
            content: ' ';
            width: 16px;
            height: 16px;
            padding: 2px 0;
            left: -16px;
          }
          &.set_lvset:before {
            background: url('~assets/images/icon_b-set_lvset.png') no-repeat center;
          }
          &.set_edit:before {
            background: url('~assets/images/icon_b-set_edit.png') no-repeat center;
          }
        }
      }
    }
    .sve-btn {
      margin: 23px 0 34px 0;
      text-align: center;
    }
  }
}
</style>



