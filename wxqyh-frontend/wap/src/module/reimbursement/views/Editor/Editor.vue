<template>
  <div class="qwui-reimbursement_editor">
    <div
      class="qwui-reimbursement_main"
      :class="{'scroll_lock': isScrollLock }"
      :style="{height: winHeight}"
      ref="main">
      <div class="qwui-uncommit_tip" v-if="config.timeList && !isCommit">{{tips.uncommit}}</div>
      <!-- 报销头部 -->
      <div class="qwui-reim_header">
        <div class="qwui-reim_item border-bottom-1px">
          <div>{{$t('i18n.reim.editor.reimType')}}<span class="qwui-require_icon">*</span></div>
          <div class="qwui-select_control">
            <select
              class="qwui-form_select"
              :class="{'placeholder': isDefaultType(vo['tbQyReimbursementPO.typeId'])}"
              @change="selectReimType"
              v-model="vo['tbQyReimbursementPO.typeId']">
              <option value="">{{$t('i18n.pleaseSelect')}}</option>
              <option
                v-for="type in typeList"
                :key="type.typeId"
                :value="type.typeId"
              >{{type.typeName + '&#x200E;'}}</option>
            </select>
          </div>
        </div>
        <div class="qwui-reim_desc border-bottom-1px">
          <div class="qwui-reim_item">
            <div class="qwui-reim_no">{{`${$t('i18n.reim.editor.reimNumber')}：${vo['tbQyReimbursementPO.reimNo']}`}}</div>
            <div class="qwui-reim_remark" v-if="config.remark" @click="showRemark">{{$t('i18n.reim.editor.editorRemark')}}</div>
          </div>
          <div class="qwui-reim_title">
            <input class="qwui-reim_title_input" v-model="vo['tbQyReimbursementPO.title']" maxlength="50">
          </div>
        </div>
      </div>

      <!-- 报销明细列表 -->
      <qw-reim-detail-field
        v-for="(field, index) in vo.detailVO"
        :index="index"
        :key="index"
        :field-list="fieldList"
        :field-value.sync="field"
        :proj-status="projStatus"
        @scrollTo="scrollToDetail"
        @copyDetail="copyDetail"
        @deleteDetail="deleteDetail"
        @judgeSubjectMoney="batchJudgeMoney"
        @checkCostCenter="batchCheckCostCenter"
        @scrollLock="scrollLock"
        ref="reimDetailField"
      ></qw-reim-detail-field>

      <!-- 添加报销 -->
      <div class="qwui-add_detail">
        <p @click="addDetail">{{$t('i18n.reim.editor.addDetailBtn')}}</p>
      </div>

      <!-- 关联借款单 -->
      <qw-loan
        v-if="fieldObj.loan && fieldObj.loan.isEmploy"
        :vo="vo"
        :totalMoney="vo['tbQyReimbursementPO.totalMoney']"
        :field="fieldObj.loan"
        :isRelation="isRelation"
      ></qw-loan>

      <!-- 报销总计 -->
      <div class="qwui-total_detail">
        <div class="qwui-total_detail_head border-bottom-1px">
          {{$t('i18n.reim.editor.detailExpense')}}
          <span class="qwui-total_detail_norecord" v-if="!hasDetailList">{{$t('i18n.reim.editor.noDetail')}}</span>
        </div>
        <div class="qwui-total_detail_content border-bottom-1px" v-if="hasDetailList">
          <div>
            <span class="qwui-total_detail_title">{{$t('i18n.reim.editor.detailTotal')}}</span>
            <span class="qwui-total_detail_money">{{vo['tbQyReimbursementPO.totalMoney']}}</span>
          </div>
          <div class="qwui-total_detail_desc">
            <span>{{`${vo.detailVO.length} ${$t('i18n.reim.editor.detail')}，`}}</span>
            <span>{{`${totalAsk} ${$t('i18n.reim.editor.ask')}，`}}</span>
            <span>{{`${totalVeh} ${$t('i18n.reim.editor.veh')}，`}}</span>
            <span>{{`${totalWxCard} ${$t('i18n.reim.editor.wxCard')}`}}</span>
          </div>
        </div>
        <div v-if="vo['tbQyReimbursementPO.loanId']">
          <div class="total_item border-bottom-1px">
            <span>核销金额</span>
            <span class="total_item_money">{{vo['tbQyReimbursementPO.verificationMoney']|fixedTwoDecimal}}</span>
          </div>
          <div class="total_item payable border-bottom-1px">
            <span>应付金额</span>
            <span class="total_item_money warn">{{payable|fixedTwoDecimal}}</span>
          </div>
        </div>
      </div>
      <!-- 结算方式 -->
      <div class="qwui-reim_item border-bottom-1px" v-if="editStatus == 'approveredit' && hasData">
        <div>{{$t('i18n.reim.editor.settle')}}</div>
        <div class="qwui-select_control">
          <select
            class="qwui-form_select"
            :class="{'placeholder': isDefaultType(vo['tbQyReimbursementPO.settle'])}"
            v-model="vo['tbQyReimbursementPO.settle']">
            <option value="">{{$t('i18n.pleaseSelect')}}</option>
            <option
              v-for="type in settleDataList"
              :key="type.id"
              :value="type.code"
            >{{type.name}}</option>
          </select>
        </div>
      </div>

      <!-- 实付金额 -->
      <qw-actual-money
        v-if="fieldObj.actualMoney && fieldObj.actualMoney.isEmploy"
        :vo="vo"
        :field="fieldObj.actualMoney"
      ></qw-actual-money>

      <!-- 收款账号信息 -->
      <qw-receipt-account
        class="qwui-global_field"
        v-if="fieldObj.receiptAccount && fieldObj.receiptAccount.isEmploy"
        :vo="vo"
        :field="fieldObj.receiptAccount"
      ></qw-receipt-account>

      <!-- 附件 -->
      <qw-attachment
        class="qwui-global_field"
        v-if="fieldObj.attachment && fieldObj.attachment.isEmploy"
        :vo="vo"
        :field="fieldObj.attachment"
        ref="attachment"
      ></qw-attachment>


      <!-- 全局备注 -->
      <qw-global-remarks
        class="qwui-global_field"
        v-if="fieldObj.globalRemarks && fieldObj.globalRemarks.isEmploy"
        :vo="vo"
        :field="fieldObj.globalRemarks"
      ></qw-global-remarks>


      <!-- 流程开始 -->
      <!--流程列表-->
      <QwFlowList v-if="isShowFlowChoose && isFree==0" :flowList="flowList" :flowId="flowId"></QwFlowList>

      <!--选择处理人-->
      <div v-if="isShowFlowChoose && FlowAuditUser.length">
        <user_selected_group
          v-if="item && item.startAuditList.show"
          v-for="(item,index) in FlowAuditUser"
          :key="index"
          :title="startAuditTitle(item.nodeName)"
          :mustChoose="true"
          :loadLast="loadLastConfig.toPersonList"
          @confirmPick="confirmPick">
          <user_selected_item
            slot="user_selected_item"
            :title="startAuditTitle(item.nodeName)"
            :isEdit="item.startAuditList.isCanEdit"
            :List="item.startAuditList.userSelected"
            @showPersonList="showPersonList"
            @showUserSelectedBox="FlowAuditUserShowBox(index)"
            @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
            :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
          </user_selected_item>
        </user_selected_group>
      </div>

      <!--选择相关人-->
      <user_selected_group
        class="border-bottom-1px"
        :title="$t('i18n.cc')"
        :loadLast="loadLastConfig.ccPersonList"
        @confirmPick="confirmPick">
        <user_selected_item
          :userTotal="ccPersonList.length"
          :List="ccPersonList"
          :title="$t('i18n.cc')"
          @showPersonList="showPersonList"
          @showUserSelectedBox="ccPersonListShowBox"
          slot="user_selected_item"
          @removeSelected="removeCCPerson">
        </user_selected_item>
      </user_selected_group>

      <button_group class="qwui-bottom_btn">
        <qwui_button v-if="editStatus == 'approveredit'" type="primary" :text="$t('i18n.save')" @buttonClick="isNewCustomVersion"></qwui_button>
        <template v-else>
          <qwui_button type="default" :text="$t('i18n.reim.editor.saveDraft')" @buttonClick="isNewCustomVersion(0)"></qwui_button>
          <qwui_button v-if="isCommit"  type="primary" :text="$t('i18n.submission')" @buttonClick="isNewCustomVersion(1)"></qwui_button>
        </template>
      </button_group>
    </div>

    <!--处理人范围选人弹窗-->
    <user_selected_ranglist
      v-if="FlowAuditUserBoxShow"
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult">
    </user_selected_ranglist>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      :agent="agent"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask">
    </flow-approve-dialog>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user_selected_Box>

    <!-- 部门选择 -->
    <user-select
      v-bind="{ closeAllTab: true, closeGroup: true, closeUser: true, tabActive: 'dept'}"
      :selectconfig="deptSelectConfig"
      v-if="deptSelectConfig.show"
    ></user-select>

    <!-- 层级选择页 -->
    <qw-select-tree
      v-if="treeSelectConfig.isShow"
      :reim-creator="reimCreator"
      :tree-config="treeSelectConfig"
    ></qw-select-tree>

    <!-- 用车单亲、请假单列表页 -->
    <qw-relation-list
      :config="relationSelectConfig"
      v-if="relationSelectConfig.isShow"
    ></qw-relation-list>

    <!--人员列表预览组件-->
    <user-show
      :show.sync="showPerson"
      :title="userselectTitle"
      :limitPreview="limitPreview"
      :userSelect="userSelectList"
    ></user-show>

    <!-- 请假详情 -->
    <qw-ask-detail v-if="isShowAskDetail"></qw-ask-detail>

    <!-- 车单详情 -->
    <qw-veh-detail v-if="isShowVehDetail"></qw-veh-detail>

    <!-- 电子发票详情 -->
    <qw-invoice-detail v-if="isShowWxCardDetail"></qw-invoice-detail>

    <!-- 借款单详情 -->
    <qw-loan-detail v-if="isShowLoanDetail"></qw-loan-detail>
  </div>
</template>

<script>
import SwitchBtn from '@/components/form/switchBtn';
import QwReimDetailField from '../../components/reimbursement/ReimDetailField';
import QwRelationList from '../../components/reimbursement/RelationList';
import QwAskDetail from '../../components/reimbursement/AskDetail';
import QwVehDetail from '../../components/reimbursement/VehDetail';
import QwSelectTree from '../../components/base/SelectTree';
import UserSelect from '@/components/base/user_or_dept_select';
import QwInvoiceDetail from '../../components/reimbursement/InvoiceDetail';
import QwGlobalRemarks from '../../components/reimGlobalField/GlobalRemarks';
import QwAttachment from '../../components/reimGlobalField/Attachment';
import QwReceiptAccount from '../../components/reimGlobalField/ReceiptAccount';
import QwActualMoney from '../../components/reimGlobalField/ActualMoney';
import QwLoan from '../../components/reimGlobalField/Loan';
import QwLoanDetail from '../../components/reimbursement/LoanDetail';

import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist';
import userShow from '@/components/detail/user_show' //人员列表
import FlowApproveDialog from '@/components/flow/flowApproveDialog';
import QwFlowList from "@/components/flow/flowList";
import user_selected_Box from '@/components/base/user_or_dept_select';
import { qwui_button, button_group } from '@/components/base/button';
import {
  searchFlowListFun,
  findBranchFlowNextNodeInfoFun,
  stringUserIds,
  isCheckFlowUserConfirm,
  branchFlowListCheck,
  resetAuditFlowData
} from '@/components/flow/getAuditFlow';

import { isWhiteCorpId } from '../../api/debit'; // 获取借款白名单

import { reimData, initDetailData, initCommitData } from './data';

import {
  getConfigInfo,
  getProvinceList,
  getCityList,
  getHistoryInfo,
  commitReim,
  approveUpdate,
  judgeSubjectMoney,
  isNewCustomVersion,
  checkCostCenter,
  getSettle,
  kingDeeInfo
} from '../../api/editor';

import store from '../../js/store';
import { addNum } from '../../js/common';

import {
  showTypeDict,
  getConfig,
  getFlowTemplate,
  getOldccOrTolist,
} from "../../api/getData";
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import wx from 'weixin-js-sdk';

export default {
  name: 'QwEditor',
  components: {
    SwitchBtn,
    QwReimDetailField,
    QwRelationList,
    QwAskDetail,
    QwVehDetail,
    QwSelectTree,
    UserSelect,
    QwInvoiceDetail,
    QwGlobalRemarks,
    QwAttachment,
    QwReceiptAccount,
    QwActualMoney,
    QwLoan,
    QwLoanDetail,

    user_selected_item,
    user_selected_group,
    userShow,
    qwui_button,
    button_group,
    QwFlowList,
    FlowApproveDialog,
    user_selected_ranglist,
    user_selected_Box,
  },
  data() {
    return {
      agent: 'reimbursement',
      // 编辑状态，审批:'approveredit' ，草稿: 'edit'，新建: 'add'，复制: 'copy'
      editStatus: '',
      // 报销ID
      reimId: '',
      //结算方式
      settleDataList: [],
      settle:'',
      //是否对接金蝶
      hasData: false,
      // 当为审批人提单人的用户id
      reimCreator: '',
      // 是否已经退审
      isOver: '',
      // 是否有设置成本中心
      projStatus: '',
      // 提示内容
      tips: {
        uncommit: '',
      },
      // 是否有可关联借款
      isRelation: '',
      // 费用日期限制
      produceEndTime: null,
      // 是否超额
      isExcess: false,
      // 报销数据
      vo: reimData(),
      // 明细配置
      config: {},
      // 单据类型
      typeList: [],
      // 报销字段配置
      fieldList: [],
      // 自定义字段
      customField:[],
      // 是否新版本
      isNewVersion:false,
      // 版本id
      versionId:'',
      // 用户所属部门
      departmentList: [],
      // 默认选择的所属部门
      defaultDept: {},
      // 默认选择的成本中心
      defaultProject: {},
      commitSuccess: false,
      // 是否在可提交时间内
      isCommit: false,
      // 字段的必填和显示
      fieldObj: {},
      isScrollLock: false,
      isSubmitting: false,
      userselectTitle: "", // 显示user-show组件时的默认title
      userSelectList: [], // user-show人员列表
      showPerson: false, // 是否显示详细人员列表
      limitPreview: false // 是否显示人员个人信息
    };
    isLoanWhite:false
  },
  computed: {
    globalFieldList() {
      return this.fieldList.filter(field => {
        return field.isEmploy ===  '1' && field.type === 2 && field.field !== 'actualMoney';
      });
    },
    winHeight() {
      return `${window.innerHeight}px`;
    },
    isShowFlowChoose() {
      return this.editStatus != 'approveredit';
    },
    // 请假单总计
    totalAsk() {
      let count = 0;
      this.vo.detailVO.forEach(detail => {
        if (detail.askId !== '') {
          count += 1;
        }
      });
      return count;
    },
    // 报销单总计
    totalVeh() {
      let count = 0;
      this.vo.detailVO.forEach(detail => {
        if (detail.carId !== '') {
          count += 1;
        }
      });
      return count;
    },
    // 发票总计
    totalWxCard() {
      return this.vo.fapiaoInfoList ? JSON.parse(this.vo.fapiaoInfoList).length : 0;
    },
    // 应付金额=明细总计 - 核销金额
    payable() {
      const totalMoney = Number(this.vo['tbQyReimbursementPO.totalMoney']);
      const verificationMoney = Number(this.vo['tbQyReimbursementPO.verificationMoney']);
      return (totalMoney - verificationMoney);
    },
    // 是否存在明细
    hasDetailList() {
      return this.vo.detailVO.length > 0;
    },
    ...mapState({
      isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
      templateRefId: state => state.flowUserSelected.templateRefId,          //模板审批单id

      isBranchFlow: state => state.flowUserSelected.isBranchFlow,           //接口返回的流程数据
      isBranchNode: state => state.flowUserSelected.isBranchNode,          //接口返回的流程数据
      flowId: state => state.flowUserSelected.flowId,                     // 已选的流程id
      currentNodeId: state => state.flowUserSelected.currentNodeId,      // 当前节点id
      nextNodeId: state => state.flowUserSelected.nextNodeId,           // 下一节点id
      defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
      parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开

      FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
      selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
      loadLastConfig: state => state.flowUserSelected.loadLastConfig, // 加载上一次默认配置
      ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息

      flowList: state => state.flowUserSelected.flowList, // 流程列表

      FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
      flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
      appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
      appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息

      commitTaskParams: state => state.flowUserSelected.commitTaskParams, ////提交返回的流程字段
    }),
    ...mapGetters([
      'selectLoanData',
      'isShowAskDetail',
      'isShowVehDetail',
      'isShowWxCardDetail',
      'isShowLoanDetail',
      "FlowAuditUserIds",   // 已选择的处理人id
      'getIsCheckFlowUserConfirmParams',//检验流程字段
      'findBranchFlowNextNodeInfoParams',//查找下一节点信息的入参
      'deptSelectConfig',
      'relationSelectConfig',
      'treeSelectConfig',
      'wxCardInfoList',
    ]),
  },
  filters: {
    fixedTwoDecimal(num) {
      return Number(num).toFixed(2);
    }
  },
  watch: {
    // 报销总计
    vo: {
      handler(vo) {
        this.totalMoney();
      },
      deep: true,
    },
    wxCardInfoList(list = []) {
      this.vo.fapiaoInfoList = JSON.stringify(list);
    },
  },
  created() {
    isWhiteCorpId({agentCode:'reimbursement',agentFunction:'loan'}).then((res)=> {
      if (res.code == '0') {
        this.isLoanWhite = res.data.isWhiteCorpId;
      }else {
        _.alert('提示',res.desc);
      }
    })

    this.storageAddKey = `${this.agent}_add_${_.userId}`;
    this.storageProjKey = `${this.agent}_project_${_.userId}`;

    // 记录编辑状态
    this.editStatus = this.$route.name;

    // 获取从草稿编辑，复制，重新编辑、审批编辑的报销id
    this.reimId = this.$route.query.reimId || '';
    // 审批编辑时的提单人id
    this.reimCreator = this.$route.query.reimCreator || '';

    // 获取后台配置信息
    this.getConfigInfo();

    // 获取城市数据
    this.getAddressList();

    //审批人编辑时，是否对接金蝶
    if (this.editStatus == 'approveredit') {
      this.kingDeeInfo();
    }

    window.onbeforeunload = () => {
      if (this.editStatus == 'add' && !this.commitSuccess) {
        store.set(this.storageAddKey, this.vo);
      }
    }
  },
  beforeDestroy() {
    if (this.editStatus == 'add' && !this.commitSuccess) {
      store.set(this.storageAddKey, this.vo);
    }
    this.hideDeptSelect();
  },
  methods: {
    isDefaultType(val) {
      return val == '';
    },
    // 金额总计
    totalMoney() {
      setTimeout(() => {
        let moneysTotal = this.vo.detailVO.reduce((count, detail) => {
          let money = detail.money;
          if (money != '' && !isNaN(money)) {
            return addNum(count, money);
          }
        }, 0);

        this.vo['tbQyReimbursementPO.totalMoney'] = moneysTotal ? moneysTotal: 0;
      }, 100);
    },
    //获取结算方式
    getSettle(typeId) {
     _.showLoading();
     getSettle({typeId}).then(res => {
       _.hideLoading();
       if(res.code == 0) {
         this.settleDataList = res.data.settleDataList;
         if(this.settleDataList && this.settle == '') {
          this.vo['tbQyReimbursementPO.settle'] =this.settleDataList[0].code;
         }
       }
     })
    },
    //是否对接金蝶
    kingDeeInfo() {
      kingDeeInfo().then(res => {
        if(res.code == 0) {
          this.hasData = res.data.hasData;
        }
      })
    },
    // 获取配置信息
    getConfigInfo() {
      _.showLoading();
      getConfigInfo({reimCreator: this.reimCreator}).then(res => {
        _.hideLoading();
        const { config, typeList = [], fieldList = [], projStatus, corpNameInfo, dept = [], customFields, isVerified} = res.data;
        this.versionId = res.data.versionId;
        // 后台的设置字段
        this.fieldList = fieldList;

        // 字段是否必填，是否显示
        this.fieldList.forEach(field => {
          this.fieldObj[field.field] = Object.assign({}, field, {
            isMust: field.isMust == '1',
            isEmploy: field.isEmploy == '1'
          });
        });
        // 后台的设置自定义字段
        let customField = customFields || [];
//        let seft = this;
        this.customField = JSON.parse(JSON.stringify(customField));
        // 是否设置成本中心
        this.projStatus = projStatus;

        // 单据类型
        this.typeList = typeList;

        this.isRelation = res.data.isRelation;

        // 单据类型只有一个时默认选择该项
        if (this.editStatus === 'add' && typeList.length === 1) {
          this.vo['tbQyReimbursementPO.typeId'] = typeList[0].typeId;
          this.vo['tbQyReimbursementPO.typeName'] = typeList[0].typeName;
        }

        // 是否是认证号
        this.updateVerifiedState(isVerified);

        // 设置工商注册全称
        this.updateCorpNameInfo(corpNameInfo);

        // 用户部门
        this.departmentList = dept;
        // 当提单人的所属部门只有1个时，默认选择提单人的所属部门；
        if (dept && dept.length == 1) {
          this.defaultDept = { id: dept[0].id, name: dept[0].departmentName};
        }

        // 获取上一次提交时选择的成本中心
        this.defaultProject = store.get(this.storageProjKey) || {};

        // 不是审批编辑时，验证是否有提交报销权限
        if (this.editStatus != 'approveredit') {
          if (!config || config.permited == "no") {
            _.alert('i18n.notice', 'i18n.reim.editor.noPermited', {
              primaryBtn: { name: 'i18n.confirm', callBack: ()  => { this.$router.push({ path: '/' }) }},
              defaultBtn: { name: '', callBack: null }
            });
            return;
          }
        }
        // 初始化配置信息
        this.initConfig(config);
      }).catch((err) => {
        _.hideLoading();
        if (err.desc) {
          _.alert('i18n.notice', err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      });
    },
    // 初始化配置信息
    initConfig(config) {
      this.config = config;

      // 新建或复制时初始化报销编号
      if (this.editStatus == 'add' || this.editStatus == 'copy') {
        this.vo['tbQyReimbursementPO.reimNo'] = _.getFormatDate(new Date(), '报销_yyyyMMddhhmmss');
      }

      // 新建报销时初始化标题
      if (this.editStatus == 'add') {
        this.vo['tbQyReimbursementPO.title'] = this.formatTitle(config.title);
      }

      // 检查报销可提交时间, 如果不在可提交时间，隐藏提交按钮，并顶部提示不可提交
      this.checkCommitTime();

      // 获取本月可提交报销时间
      if (config.produceEndTime) {
        this.produceEndTime = config.produceEndTime;
      }

      // 如果是新建则获取缓存，否则获取历史数据
      if (this.editStatus == 'add') {
        // 初始化流程
        this.initFlowData();
        // 提交后判断到有新版本，加载新的字段设置后，默认从缓存里获取已填写的数据匹配
        this.isNewVersion?this.confirmStorage(store.get(this.storageAddKey)):this.getLastStorage();
      } else {
        this.getHistoryInfo();
      }
    },
    //对比新旧版自定义字段赋值
    setNewCustom(detailVO){
      var _this = this;
      var detail = JSON.parse(JSON.stringify(detailVO));
      var newCustom = JSON.parse(JSON.stringify(_this.customField));
      detail.forEach((item, index) => {
        item.reimCustomFieldDataList.forEach((custom, cusIndex) => {
          _this.customField.forEach((list, listIndex) => {
            let id = custom.customId || custom.id;
            if (list.id == id && list.isEmploy == 1) {
              if(list.type == 'OPTION'){
                newCustom[listIndex].value = "";
                list.options.forEach((option,i)=>{
                  if(option.value == custom.value){
                    newCustom[listIndex].value = custom.value;
                  }
                })
              }else {
                newCustom[listIndex].value = custom.value;
              }
            }
          })
        })
        detailVO[index].reimCustomFieldDataList = JSON.parse(JSON.stringify(newCustom));
      })
      return detailVO;
    },
    // 检查可提交报销的时间
    checkCommitTime() {
      const { timeList } = this.config;

      if (timeList && timeList.length > 0) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let tip = this.$t('i18n.reim.editor.commitTip');

        for (let i = 0; i < timeList.length; i++) {
          let startTime = timeList[i].startTime;
          let endTime = timeList[i].endTime;
          let commitStart = `${year}-${month}-${startTime}`;
          let commitEnd = `${year}-${month}-${endTime}`;
          tip += `${commitStart} ${this.$t('i18n.reim.editor.to')} ${commitEnd}，`;

          if (day >= startTime && day <= endTime ) {
            this.isCommit = true;
          }
        }
        this.tips.uncommit = tip + this.$t('i18n.reim.editor.uncommitTip');
      }
    },
    // 填写规范弹窗
    showRemark() {
      _.alert('i18n.reim.editor.remarkTitle', this.config.remark, {
        primaryBtn: { name: 'i18n.confirm', callBack: null },
        defaultBtn: { name: '', callBack: null }
      });
    },
    // 支持模板： [yyyyMMddhhmmss]、[部门]、[姓名]
    // 例: “[yyyy]年[MM]月[部门]报销单”可生成“2017年01月行政部报销单”
    formatTitle(title) {
      let formatTitle = '';
      let date = new Date();
      let deptstr = this.departmentList.map(dept => dept.departmentName).join(',');

      if (title) {
        formatTitle = _.getFormatDate(new Date(), title)
        formatTitle = formatTitle.replace(/\[部门\]/g, deptstr);
        formatTitle = formatTitle.replace(/\[姓名\]/g, _.personName);
        formatTitle = formatTitle.replace(/\[|\]/g, '');
      } else {
        formatTitle = `${date.getFullYear()}年${date.getMonth() + 1}月报销_${_.personName}${deptstr}`;
      }
      return formatTitle;
    },
    // 根据报销ID获取历史数据
    getHistoryInfo() {
      _.showLoading();

      const reimId = this.reimId;
      let cloneOption = '';

      // 是否为复制报销单，1为复制报销单
      if (this.editStatus == 'copy') {
        cloneOption = 1;
      }

      getHistoryInfo({ reimId, cloneOption}).then((res) => {
        _.hideLoading();

        const history = res.data.vo;
        const {
          typeId, reimType, title, reimNo, receiptFullName, bankAccount, depositBank, versionNum, globalRemark,
          actualMoney, verificationMoney, loanId, loanTitle, repayDate, payableMoney, loanSurplusMoney
        } = history;
        this.settle = history.settle;
         //页面进入是加载一次结算方式
         if(this.editStatus == 'approveredit') {
          this.getSettle(typeId);
          this.vo['tbQyReimbursementPO.settle'] = this.settle;
         }

        // 判断历史选择的类型是否存在于后台设置中，有则选中
        this.typeList.forEach(type => {
          if (type.typeId == typeId) {
            this.vo['tbQyReimbursementPO.typeId'] = typeId;
            this.vo['tbQyReimbursementPO.typeName'] = reimType;
          }
        });

        this.vo['tbQyReimbursementPO.title'] = title;
        if (this.fieldObj.actualMoney && this.fieldObj.actualMoney.isEmploy) {
          this.vo['tbQyReimbursementPO.actualMoney'] = actualMoney;
        }

        if (this.fieldObj.receiptAccount.isEmploy) {
          this.vo['tbQyReimbursementPO.receiptFullName'] = receiptFullName;
          this.vo['tbQyReimbursementPO.bankAccount'] = bankAccount;
          this.vo['tbQyReimbursementPO.depositBank'] = depositBank;
        }

        if (this.fieldObj.globalRemarks && this.fieldObj.globalRemarks.isEmploy) {
          this.vo['tbQyReimbursementPO.globalRemark'] = globalRemark;
        }

        // 更新借款单的核销信息,核销金额变更提醒弹窗
        if (this.fieldObj.loan && this.fieldObj.loan.isEmploy) {
          if (loanId !== '') {
            this.vo['tbQyReimbursementPO.loanId'] = loanId;
            this.vo['tbQyReimbursementPO.verificationMoney'] = verificationMoney;
            this.setLoanData({
              loanId,
              title: loanTitle,
              repayDate: repayDate,
              surplusMoney: loanSurplusMoney
            });

            if (res.data.tips) {
              _.alert('i18n.reim.relationLoanChange', res.data.tips);
            }
          } else {
            // 借款单取消关联提醒弹窗
            if (res.data.tips) {
              _.alert('i18n.reim.relationLoanCancel', res.data.tips);
            }
          }
        }

        this.vo['tbQyReimbursementPO.versionNum'] = versionNum;

        //编辑的时候点击提交提示有新版本，会再次请求getHistoryInfo，附件不需要重复赋值
        if(!this.isNewVersion && this.fieldObj.attachment && this.fieldObj.attachment.isEmploy){
          this.$refs.attachment && (this.$refs.attachment.mediaList = [...res.data.mediaList] || []);
        }
        // 格式化图片数据
        history.detailList.forEach(detail => {
          detail.carId = detail.carAskId;
          this.addDetail(detail);
        });
        // 自定义字段
        var _this = this;
        //点击编辑的时候有新版本则出现提示，点击提交有新版本则不需要
        if(res.data.vo.isNewVersion == 1 && !this.isNewVersion){
          _.alert('i18n.notice', this.$t('i18n.reim.newVersion'), {
            primaryBtn: {name: 'i18n.confirm',callBack: null},
            defaultBtn: {name: '', callBack: null}
          });
        }

        // 是否为退审
        if (this.editStatus == 'edit') {
          this.isOver = history.isover == '0';
          this.vo['tbQyReimbursementPO.reimNo'] = reimNo;
        }

        //  为审批状态，获取审批人, 提交数据添加报销编号
        if (this.editStatus == 'approveredit') {
          this.vo['tbQyReimbursementPO.reimNo'] = reimNo;
        }

        // 超额判断、验证成本中心预算时间
        this.batchJudgeMoney();
        this.batchCheckCostCenter();

        this.initFlowData(history);
        this.vo.detailVO = this.setNewCustom(this.vo.detailVO);
        // 提交后判断到有新版本，加载新的字段设置后，默认从缓存里获取已填写的数据匹配
        if(this.isNewVersion){
          this.confirmStorage(store.get(this.storageAddKey));
        }

      }).catch((err) => {
        _.hideLoading();
        if (err.desc) {
          _.alert('i18n.notice', err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      });
    },
    // 获取缓存
    getLastStorage() {
      const voStorage = store.get(this.storageAddKey);

      if (voStorage) {
        _.alert('i18n.notice', 'i18n.reim.editor.getStorage ', {
          primaryBtn: { name: 'i18n.confirm', callBack: () => this.confirmStorage(voStorage) },
          defaultBtn: { name: 'i18n.cancel', callBack: this.cancelStorage }
        });
      } else {
        if (this.vo.detailVO.length < 1) {
          this.addDetail();
        }
      }
    },
    // 确定加载缓存
    confirmStorage(storage) {
      // 缓存的内容不包括：报销单编号、报销主题
      this.vo['tbQyReimbursementPO.typeId'] = storage['tbQyReimbursementPO.typeId'];
      this.vo['tbQyReimbursementPO.typeName'] = storage['tbQyReimbursementPO.typeName'];
      this.vo['tbQyReimbursementPO.receiptFullName'] = storage['tbQyReimbursementPO.receiptFullName'];
      this.vo['tbQyReimbursementPO.bankAccount'] = storage['tbQyReimbursementPO.bankAccount'];
      this.vo['tbQyReimbursementPO.depositBank'] = storage['tbQyReimbursementPO.depositBank'];

      storage.detailVO = this.setNewCustom(storage.detailVO);
      // 明细缓存的内容不包括发票，用车单，请假单，图片列表
      if (storage.detailVO.length > 0) {
        storage.detailVO.forEach(detail => {
          let data = Object.assign({}, detail, {
            carId: '',
            askId: '',
            fapiaoInfo: [],
            imgList: [],
          });
          this.isNewVersion? this.vo = Object.assign({}, this.vo, storage):this.addDetail(data);
        });
      } else {
        this.addDetail();
      }

      this.batchJudgeMoney();
      this.batchCheckCostCenter();
    },
    // 取消加载缓存
    cancelStorage() {
      store.remove(this.storageAddKey);
      this.addDetail();
    },
    // 提交时缓存成本中心，下次自动选择
    setCommitStorage() {
      // 提交后缓存成本中心, 取第一个明细的成本中心选择为缓存
      let detail = this.vo.detailVO[0];
      if (detail) {
        if (detail.projId !== '' && detail.projName !== '') {
          store.set(this.storageProjKey, { id: detail.projId, name: detail.projName});
        }
      }
    },
    // 获取省份、城市数据，并改成组件需要的格式
    getAddressList() {
      Promise.all([getProvinceList, getCityList]).then(resArr => {
        let provinces = resArr[0].data.provinceList.map(item => ({ name: item.province + '', value: 'p' + item.id }));
        let citys = resArr[1].data.cityList.map(item => ({ name: item.city, value: item.id + '', parent: 'p' + item.fatherid }));

        this.setAddressList(provinces.concat(citys));
      }).catch((err) => {});
    },
    // 添加一条明细
    addDetail(detailData) {
      // 复制时不启用的字段重置为空
      if (typeof detailData == 'object' && detailData.ext1) {
        if (!this.fieldObj.dept.isEmploy) {
          detailData.deptId = '';
          detailData.deptName = '';
        }

        if (!this.fieldObj.invoice.isEmploy) {
          detailData.invoice = '';
        }

        if (!this.fieldObj.remarks.isEmploy) {
          detailData.remark = '';
        }

        if (!this.fieldObj.image.isEmploy) {
          detailData.imgList = '';
        }

        if (!this.fieldObj.veh.isEmploy) {
          detailData.carId = '';
        }

        if (!this.fieldObj.ask.isEmploy) {
          detailData.askId = '';
        }

        if (!this.fieldObj.receipt.isEmploy) {
          detailData.fapiaoInfo = [];
        }

        if (this.fieldObj.vatSpecialInvoice && !this.fieldObj.vatSpecialInvoice.isEmploy) {
          detailData.vatSpecialInvoice = '';
          detailData.invoiceNumber = '';
          detailData.noTaxesMoney = '';
          detailData.taxesMoney = '';
          detailData.adValorem = '';
        }

        this.vo.detailVO.push(initDetailData(detailData));
      } else {
        var custom = JSON.parse(JSON.stringify(this.customField));
        // 默认选中上次提交的成本中心, 用户所属的部门
        this.vo.detailVO.push(initDetailData({
          deptId: this.defaultDept.id,
          deptName: this.defaultDept.name,
          projId: this.defaultProject.id,
          projName: this.defaultProject.name,
          reimCustomFieldDataList: custom.length ? custom:[]
        }));
      }
    },
    // 复制明细
    copyDetail(detailData) {
      this.addDetail(detailData);
      this.batchJudgeMoney();
      this.batchCheckCostCenter();
    },
    // 删除明细
    deleteDetail(index) {
      _.alert('', 'i18n.reim.editor.deleteDetail', {
        primaryBtn: { name: 'i18n.confirm', callBack: () => {
          this.vo.detailVO.splice(index, 1);
          this.batchJudgeMoney();
        }},
        defaultBtn: { name: 'i18n.cancel', callBack: null }
      });
    },
    scrollToDetail(index, top) {
      if (index > 0) {
        this.$refs.main.scrollTop = top;
      }
    },
    // 请求接口验证金额，并根据限制提示
    batchJudgeMoney() {
      let reimJson = this.vo.detailVO.map(detail => {
        return {
          money: detail.money,
          cityId: detail.cityId,
          subjId: detail.subjId,
          subjectParentsId: detail.subjectParentsId,
          centerId: detail.projId,
          startTime: detail.time,
          endTime: detail.endTimes
        }
      });

      let params = {
        reimId: '',
        reimCreator: this.reimCreator,
        judgeSubjectMoney: JSON.stringify(reimJson),
      }

      // 新建和复制时不需要传报销id
      if (this.editStatus != 'add' && this.editStatus != 'copy') {
        params.reimId = this.reimId;
      }

      judgeSubjectMoney(params).then(res => {
        let limitBudgetVO = res.data.limitBudgetVO; //预算限制
        let limitMoneyVO = res.data.limitMoneyVO; //标准限制

        if (!limitBudgetVO && !limitMoneyVO) {
          return;
        }

        //预算限制验证显示
        for(let i = 0; i<limitBudgetVO.length; i++){
          if (this.vo.detailVO[i]) {
            this.vo.detailVO[i].limitMoney = limitMoneyVO[i].limitMoney;
            this.vo.detailVO[i].limitCycle = limitMoneyVO[i].limitCycle;
            this.vo.detailVO[i].state = limitMoneyVO[i].state;
            this.vo.detailVO[i].enabled = limitMoneyVO[i].enabled;
            this.vo.detailVO[i].versionNumber = limitMoneyVO[i].versionNumber;
            this.vo.detailVO[i].levelId = limitMoneyVO[i].levelId;
            this.vo.detailVO[i].surplusMoney = limitMoneyVO[i].surplusMoney;

            this.vo.detailVO[i].budgetState = limitBudgetVO[i].state;
            this.vo.detailVO[i].budgetExcess = limitBudgetVO[i].excessBudget;
            this.vo.detailVO[i].budgetEnabled = limitBudgetVO[i].enabled;

            if (this.$refs.reimDetailField && this.$refs.reimDetailField[i]) {
              this.$refs.reimDetailField[i].judgeBudgetMoney();
              this.$refs.reimDetailField[i].judgeLimitMoney();
            }
          }
        }
      });
    },
    // 多条验证成本中心预算时间
    batchCheckCostCenter() {
      let checkData = this.vo.detailVO.map(detail => {
        return {
          subjectParentsId: detail.subjectParentsId,
          costCenterId: detail.projId,
          startTime: detail.time,
          endTime: detail.endTimes,
        }
      });

      checkCostCenter({checkData: JSON.stringify(checkData)}).then(res => {
        const checkList = res.data.checkList;

        if (!checkList.length) { return; }

        for(let i = 0; i < checkList.length; i++) {
          if (this.vo.detailVO[i]) {
            this.vo.detailVO[i].costCenterState = checkList[i].submission;
            this.vo.detailVO[i].costCenterMessage = checkList[i].message;
          }
        }
      }).catch(() => {});
    },
    vaildDetailFields(ruleFun, tip, title = 'i18n.notice',) {
      let flag = true;
      let index = '';
      this.vo.detailVO.forEach((detail, i) => {
        if (ruleFun(detail)) {
          index +=   `${i+1}、`;
          flag = false;
        }
      });

      if (!flag) {
        if (index.length > 0) {
          index = index.substring(0, index.length - 1);
        }
        _.alert(title, tip.replace('[i]', index));
      }
      return flag;
    },
    //自定义字段校验规则
    vaildDetailCustomFields(ruleFun) {
      let flag = true;
      let index = '';
      let tip = '';
      let detailVO = this.vo.detailVO;
      for(var i = 0;i<detailVO.length;i++){
        if (ruleFun(detailVO[i])&&ruleFun(detailVO[i]).status) {
          index  = i+1;
          flag = false;
          tip = ruleFun(detailVO[i]).tip;
          break;
        }
      }

      if (!flag) {
        _.alert('i18n.notice', tip.replace('[i]', index));
      }
      return flag;
    },
    // 重新判断规则超额
    validEnable() {
      this.batchJudgeMoney();
    },
    // 验证每条明细成本中心
    validProject() {
      return this.vaildDetailFields(detail => detail.projId == '', this.$t('i18n.reim.checkReimProject'));
    },
    // 验证每条明细部门
    validDept() {
      return this.vaildDetailFields(detail => detail.deptId == '', this.$t('i18n.reim.checkDept'));
    },
    // 验证每条明细科目
    validSubject() {
      return this.vaildDetailFields(detail => detail.subjId == '', this.$t('i18n.reim.checkSubject'));
    },
    // 验证发票号码
    validInvoiceNumber() {
      return this.vaildDetailFields(detail => {
        return detail.vatSpecialInvoice == 1 && detail.invoiceNumber === '';
      }, this.$t('i18n.reim.checkInvoiceNumber'));
    },
    // 验证不含税金额
    validNoTaxesMoney() {
      return this.vaildDetailFields(detail => {
        return detail.vatSpecialInvoice == 1 && detail.noTaxesMoney === '';
      }, this.$t('i18n.reim.checkNoTaxesMoney'));
    },
    // 验证税额
    vaildTaxesMoney() {
      return this.vaildDetailFields(detail => {
        return detail.vatSpecialInvoice == 1 && detail.taxesMoney === '';
      }, this.$t('i18n.reim.taxesMoney'));
    },
    // 验证价税合计
    vaildAdValorem() {
      return this.vaildDetailFields(detail => {
        return detail.vatSpecialInvoice == 1 && parseFloat(detail.adValorem||0) !== parseFloat(detail.money||0)
      }, this.$t('i18n.reim.checkAdValorem'));
    },
    // 验证每条明细产生日期是否为空，结束日期是否超过开始日期，是否超过允许提交的日期
    validDate() {
      let flag = true;

      this.vo.detailVO.every((detail, i) => {
        if (detail.time == '') {
          flag = false;
          _.alert('i18n.notice', this.$t('i18n.reim.checkTime').replace('[i]', i+1));
        } else if (!this.validTime(detail.time, detail.endTimes, i)) {
          flag = false;
        }else if (this.produceEndTime != '') {
          if (this.checkProduceEndTime(detail.time)) {
            flag = false;
            _.alert('i18n.notice', this.$t('i18n.reim.checkProduceEndTime').replace('[i]', this.produceEndTime));
          }
        }
        return flag;
      });
      return flag;
    },
    // 验证产生日期
    validTime(start, end, i) {
      let flag = true;
      let startStamp = new Date(start);
      let endStamp = new Date(end);

      if (startStamp > endStamp) {
        _.alert('i18n.notice', this.$t('i18n.reim.checkDurationTime').replace('[i]', i+1));
        flag = false;
      } else if (startStamp.getFullYear() != endStamp.getFullYear()){
        _.alert('i18n.notice', this.$t('i18n.reim.checkSpanTime').replace('[i]', i+1));
        flag = false;
      }

      return flag;
    },
    // 验证报销明细的时间
    checkProduceEndTime(produceTime){
      let d = Date.parse(produceTime.replace(/-/g,"/"));
      let curDate = new Date();
      curDate.setDate(this.produceEndTime);
      let endTime = curDate.getTime()
      if(d > endTime){
        return true;
      }
      return false;
    },
    // 验证每条明细金额是否为数字
    validMoneyType() {
      return this.vaildDetailFields(detail => detail.money != '' && isNaN(detail.money), this.$t('i18n.reim.checkMoneyType'));
    },
    // 验证每条明细金额是否为空或为零
    validMoney() {
      return this.vaildDetailFields(detail => detail.money == '' || detail.money <= 0, this.$t('i18n.reim.checkMoney'));
    },
    // 验证每条明细发票张数
    validInvoice() {
      return this.vaildDetailFields(detail => detail.invoice === '', this.$t('i18n.reim.checkInvoice'));
    },
    // 验证每条明细备注
    validRemarks() {
      return this.vaildDetailFields(detail => detail.remark.trim() === '', this.$t('i18n.reim.checkRemark'));
    },
    // 验证每条明细图片
    vaildImage() {
      return this.vaildDetailFields(detail => detail.imgList.length === 0, this.$t('i18n.reim.checkImage'));
    },
    // 验证每条明细的用车单
    vaildVeh() {
      return this.vaildDetailFields(detail => detail.carId === '', this.$t('i18n.reim.checkVeh'));
    },
    // 验证每条明细的请假出差单
    vaildAsk() {
      return this.vaildDetailFields(detail => detail.askId === '', this.$t('i18n.reim.checkAsk'));
    },
    // 验证每条明细发票
    vaildReceipt() {
      return this.vaildDetailFields(detail => detail.fapiaoInfo.length < 1, this.$t('i18n.reim.checkReceipt'));
    },
    // 超额验证
    validOverFree() {
      return this.vaildDetailFields(detail => {
        if (detail.state == '1' && detail.enabled == '1') {
          return true;
        } else if (detail.budgetState == '1' && detail.budgetEnabled == '1') {
          return true;
        } else {
          return false;
        }
      }, this.$t('i18n.reim.checkOverFree'), this.$t('i18n.reim.overFree'));
    },
    // 成本中心时间校验
    vaildCostCenter() {
      return this.vaildDetailFields(detail => !detail.costCenterState, this.$t('i18n.reim.checkCostCenter'));
    },
    // 验证为城市控制时，城市选择是否为空
    vaildControlCity() {
      return this.vaildDetailFields(details => details.control == 2 && details.cityId == '', this.$t('i18n.reim.checkControlCity'));
    },
    // 验证每条明细自定义字段是否填写
    validCustomFeild() {
      let tip = '';
      let res = this.vaildDetailCustomFields(detail => {
        if(detail.reimCustomFieldDataList){
          let list = detail.reimCustomFieldDataList;
          for(var i=0;i<list.length;i++ ){
            if(list[i].isMust==1){
              if(!list[i].value || list[i].value == ''){
                if(list[i].name){
                  list[i].type=='OPTION'?tip = this.$t('i18n.reim.pleaseSelect')+ list[i].name: tip = this.$t('i18n.reim.pleaseEnter')+list[i].name;
                }else if(list[i].customName){
                  list[i].type=='OPTION'?tip = this.$t('i18n.reim.pleaseSelect')+ list[i].customName : tip = his.$t('i18n.reim.pleaseEnter')+ list[i].customName;
                }
                let obj={status:true,tip:tip}
                return obj;
              }
            }
          }
        }
      });
      return res;
    },
    //校验新版本
    isNewCustomVersion(status) {
      isNewCustomVersion({versionId: this.versionId}).then(res => {
        if (res.data.isNewCustomVersion == 0) {
          this.isNewVersion = false;
          if(status==0 || status==1){
            this.commitReimTask(status);
          }else {
            this.saveReim();
          }
        } else {
          let _this = this;
          _.alert('i18n.notice', this.$t('i18n.reim.newVersion'), {
            primaryBtn: {
              name: 'i18n.confirm', callBack: () => {
                _this.isNewVersion = true;
                store.set(this.storageAddKey, this.vo);
                _this.getConfigInfo();
              }
            },
            defaultBtn: {name: '', callBack: null}
          });
        }
      }).catch((err) => {
        if (err.desc) {
          _.alert('i18n.notice', err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      })
    },
    // 点击保存草稿或提交，status=0草稿，status=1提交
    commitReimTask(status) {
      if (this.isSubmitting) {
        return;
      }
      //自定义字段有新版本
      if(this.isNewVersion){
        return;
      }
      this.vo['tbQyReimbursementPO.status'] = status;

      // 验证标题
      let title = this.vo['tbQyReimbursementPO.title'];
      if (title.length == 0 ) {
        _.alert('i18n.notice', 'i18n.reim.checkTitle');
        return;
      }

      _.showLoading('i18n.submitting');

      // 验证每条明细金额是否为数字
      if (!this.validMoneyType()) {
        _.hideLoading();
        return;
      }

      //  提交时验证必填数据
      if (status == '1') {
        if (this.vo.detailVO.length == 0) {
          _.hideLoading();
          _.alert('i18n.notice', this.$t('i18n.reim.checkReimDetail'));
          return;
        }

        if (this.vo['tbQyReimbursementPO.typeId'] == '') {
          _.hideLoading();
          _.alert('i18n.notice', this.$t('i18n.reim.checkReimType'));
          return;
        }

        // 验证成本中心
        if (this.fieldObj.reimProject.isMust && this.projStatus == '1' && !this.validProject()) {
          _.hideLoading();
          return;
        }

        // 验证部门
        if (this.fieldObj.dept.isMust && !this.validDept()) {
          _.hideLoading();
          return;
        }

        // 验证科目
        if (!this.validSubject()) {
          _.hideLoading();
          return;
        }

        if (!this.vaildControlCity()) {
          _.hideLoading();
          return;
        }

        // 验证日期
        if (!this.validDate()) {
          _.hideLoading();
          return;
        }

        // 验证金额
        if (!this.validMoney()) {
          _.hideLoading();
          return;
        }

        // 验证发票张数
        if (this.fieldObj.invoice.isMust && !this.validInvoice()) {
          _.hideLoading();
          return;
        }

        // 验证备注
        if (this.fieldObj.remarks.isMust && !this.validRemarks()) {
          _.hideLoading();
          return;
        }

        // 验证图片
        if (this.fieldObj.image.isMust && !this.vaildImage()) {
          _.hideLoading();
          return;
        }

        // 验证用车单
        if (this.fieldObj.veh.isMust && !this.vaildVeh()) {
          _.hideLoading();
          return;
        }

        // 验证请假出差单
        if (this.fieldObj.ask.isMust && !this.vaildAsk()) {
          _.hideLoading();
          return;
        }

        // 验证发票
        if (this.fieldObj.receipt.isMust && !this.vaildReceipt()) {
          _.hideLoading();
          return;
        }

        // 开启必填，并且有可关联的借款单
        if (this.fieldObj.loan && this.fieldObj.loan.isMust && this.isRelation === 1) {
          if (this.vo['tbQyReimbursementPO.loanId'] === '') {
            _.alert('i18n.notice', 'i18n.reim.checkLoan');
            _.hideLoading();
            return;
          }
        }

        // 验证增值税专用发票
        if (this.fieldObj.vatSpecialInvoice && this.fieldObj.vatSpecialInvoice.isMust) {
          if (!this.validInvoiceNumber()) {
            _.hideLoading();
            return;
          }

          if (!this.validNoTaxesMoney()) {
            _.hideLoading();
            return;
          }

          if (!this.vaildTaxesMoney()) {
            _.hideLoading();
            return;
          }

          if (!this.vaildAdValorem()) {
            _.hideLoading();
            return;
          }
        }

        // 验证超额
        if (!this.validOverFree()) {
          _.hideLoading();
          return;
        }

        // 成本中心时间验证
        if (!this.vaildCostCenter()) {
          _.hideLoading();
          return;
        }

        //验证自定义字段
        if (!this.validCustomFeild()){
          _.hideLoading();
          return;
        }

        //验证全局字段--备注
        if (this.fieldObj.globalRemarks && this.fieldObj.globalRemarks.isMust) {
          if (this.vo['tbQyReimbursementPO.globalRemark'] == '') {
            _.alert('i18n.notice', this.$t('i18n.reim.checkGlobalRemark'));
            _.hideLoading();
            return;
          }
        }

        //验证全局字段附件
        if (this.fieldObj.attachment && this.fieldObj.attachment.isMust) {
          if(this.vo['tbQyReimbursementPO.attachmentCount'] == 0){
            _.alert('i18n.notice', this.$t('i18n.reim.checkAttachment'));
            _.hideLoading();
            return;
          }
        }

        // 验证收款信息
        if (this.fieldObj.receiptAccount.isMust) {
          if (this.vo['tbQyReimbursementPO.receiptFullName'] == '') {
            _.alert('i18n.notice', 'i18n.reim.checkReceiptFullName');
            _.hideLoading();
            return;
          }

          if (this.vo['tbQyReimbursementPO.bankAccount'] == '') {
            _.alert('i18n.notice', 'i18n.reim.checkBankAccount');
            _.hideLoading();
            return;
          }

          if (this.vo['tbQyReimbursementPO.depositBank'] == '') {
            _.alert('i18n.notice', 'i18n.reim.checkDepositBank');
            _.hideLoading();
            return;
          }
        }

        //  重新判断规则超额
        this.validEnable();
      }

      this.url = `${_.baseURL}/portal/reimPortalCtl/ajaxAdd.do`;
      if (this.editStatus == 'edit') {
        this.url = `${_.baseURL}/portal/reimPortalCtl/ajaxUpdate.do`;
        this.vo['tbQyReimbursementPO.reimId'] = this.reimId
      }

      if (status == '1') {
          this.saveNodeAuditUser(status);
      } else {
        this.commitReim(status);
      }
    },
    // 拼接自定义字段传参的格式
    setCustomData(){
      var objArr=this.vo.detailVO;
      var arr = [];

      this.vo.detailVO.forEach((item,index)=>{

        if(item.reimCustomFieldDataList){
          item.reimCustomFieldDataList.forEach((detail,i)=>{
            var obj = {
              customName:detail.customName || detail.name,
              dataType:detail.dataType || detail.type,
              dataSort:detail.dataSort || detail.sort,
              value:detail.value,
              customId:detail.customId || detail.id
            }
            arr.push(obj);
//            arr[i]=obj;
          })
        }
        objArr[index].reimCustomFieldDataList=arr;
        arr=[];
      })

      this.vo.detailVO=objArr;
    },
    // 提交报销
    commitReim(status) {
      _.showLoading("i18n.submitting");
      this.isSubmitting = true;
      this.isNewVersion = false;
      this.setCustomData();
      let data = initCommitData(this.vo);
      data.versionId = this.versionId;
      var _this = this;
      commitReim(this.url, data).then((res) => {
        _.hideLoading();

        //  提交完成后清除缓存
        store.remove(this.storageAddKey);
        this.isSubmitting = false;
        this.commitSuccess = true;
        // 提交缓存成本中心和所属部门的选择
        this.setCommitStorage()

        if (status == '0') {
          this.isLoanWhite?this.$router.replace({ name: 'newDraft'}):this.$router.replace({ name: 'draft'}); //提交草稿跳转到草稿列表
        } else {
          this.$router.replace({ path: '/'}); //提交发布跳转到已提交列表
        }
      }).catch((err) => {
        _.hideLoading();
        this.isSubmitting = false;
        if(err.code == '28999'){
          _.alert('i18n.notice', err.desc,{
            primaryBtn: {name: 'i18n.confirm', callBack: () => {
              _this.isNewVersion = true;
              store.set(this.storageAddKey, this.vo);
              _this.getConfigInfo();
            }},
            defaultBtn: {name: '', callBack: null}
          });
        }else {
          if (err.desc) {
            _.alert('i18n.notice', err.desc);
          } else {
            _.alert('i18n.notice', 'i18n.reim.info.resultError');
          }
        }
      })
    },
    // 审批编辑时保存
    saveReim() {
      if (this.isSubmitting) {
        return;
      }
      //自定义字段有新版本
      if(this.isNewVersion){
        return;
      }
      // 验证标题
      let title = this.vo['tbQyReimbursementPO.title'];
      if (title.length == 0 ) {
        _.alert('i18n.notice', 'i18n.reim.checkTitle');
        return;
      }

      _.showLoading('i18n.submitting');

      if (!this.validMoneyType()) {
        _.hideLoading();
        return;
      }

      if (this.vo.detailVO.length == 0) {
        _.hideLoading();
        _.alert('i18n.notice', this.$t('i18n.reim.checkReimDetail'));
        return;
      }

      if (this.vo['tbQyReimbursementPO.typeId'] == '') {
        _.hideLoading();
        _.alert('i18n.notice', this.$t('i18n.reim.checkReimType'));
        return;
      }

      // 验证成本中心
      if (this.fieldObj.reimProject.isMust && this.projStatus == '1' && !this.validProject()) {
        _.hideLoading();
        return;
      }

      // 验证部门
      if (this.fieldObj.dept.isMust && !this.validDept()) {
        _.hideLoading();
        return;
      }

      // 验证科目
      if (!this.validSubject()) {
        _.hideLoading();
        return;
      }

      // 验证日期
      if (!this.validDate()) {
        _.hideLoading();
        return;
      }

      // 验证金额
      if (!this.validMoney()) {
        _.hideLoading();
        return;
      }

      // 验证发票张数
      if (this.fieldObj.invoice.isMust && !this.validInvoice()) {
        _.hideLoading();
        return;
      }

      // 验证备注
      if (this.fieldObj.remarks.isMust && !this.validRemarks()) {
        _.hideLoading();
        return;
      }

      // 验证图片
      if (this.fieldObj.image.isMust && !this.vaildImage()) {
        _.hideLoading();
        return;
      }

      // 验证增值税专用发票
      if (this.fieldObj.vatSpecialInvoice && this.fieldObj.vatSpecialInvoice.isMust) {
        if (!this.validInvoiceNumber()) {
          _.hideLoading();
          return;
        }

        if (!this.validNoTaxesMoney()) {
          _.hideLoading();
          return;
        }

        if (!this.vaildTaxesMoney()) {
          _.hideLoading();
          return;
        }

        if (!this.vaildAdValorem()) {
          _.hideLoading();
          return;
        }
      }

      // 验证超额
      if (!this.validOverFree()) {
        _.hideLoading();
        return;
      }

      // 成本中心时间验证
      if (!this.vaildCostCenter()) {
        _.hideLoading();
        return;
      }

      //验证自定义字段
      if (!this.validCustomFeild()){
        _.hideLoading();
        return;
      }

      // 验证实付金额
      if (this.fieldObj.actualMoney && this.fieldObj.actualMoney.isMust) {
        if (this.vo['tbQyReimbursementPO.actualMoney'] === '') {
          _.alert('i18n.notice', 'i18n.reim.checkActualMoney');
          _.hideLoading();
          return;
        }
      }

      //验证全局字段--备注
      if (this.fieldObj.globalRemarks && this.fieldObj.globalRemarks.isMust) {
        if (this.vo['tbQyReimbursementPO.globalRemark'] == '') {
          _.alert('i18n.notice', this.$t('i18n.reim.checkGlobalRemark'));
          _.hideLoading();
          return;
        }
      }

      //验证全局字段附件
      if (this.fieldObj.attachment && this.fieldObj.attachment.isMust) {
        if(this.vo['tbQyReimbursementPO.attachmentCount'] == 0){
          _.alert('i18n.notice', this.$t('i18n.reim.checkAttachment'));
          _.hideLoading();
          return;
        }
      }

      // 验证收款信息
      if (this.fieldObj.receiptAccount.isMust) {
        if (this.vo['tbQyReimbursementPO.receiptFullName'] == '') {
          _.alert('i18n.notice', 'i18n.reim.checkReceiptFullName');
          _.hideLoading();
          return;
        }

        if (this.vo['tbQyReimbursementPO.bankAccount'] == '') {
          _.alert('i18n.notice', 'i18n.reim.checkBankAccount');
          _.hideLoading();
          return;
        }

        if (this.vo['tbQyReimbursementPO.depositBank'] == '') {
          _.alert('i18n.notice', 'i18n.reim.checkDepositBank');
          _.hideLoading();
          return;
        }
      }

      //  重新判断规则超额
      this.validEnable();

      this.approveUpdate();
    },
    // 审批提交
    approveUpdate() {
      _.showLoading("i18n.submitting");
      this.isSubmitting = true;
      this.isNewVersion = false;
      this.setCustomData();
      let data = initCommitData(this.vo);

      data['tbQyReimbursementPO.reimId'] = this.reimId;
      data.reimCreator = this.reimCreator;
      data.relatives = stringUserIds(this.ccPersonList);
      data.versionId = this.versionId;
      var _this = this;
      approveUpdate(data).then((res) => {
        _.hideLoading();
        this.isSubmitting = false;
        this.commitSuccess = true;
        this.$router.push({ name: 'detail' , query: { id: this.reimId }});
      }).catch((err) => {
        _.hideLoading();
        this.isSubmitting = false;
        if (err.desc) {
          if(err.code == '28999'){
            _.alert('i18n.notice', err.desc,{
              primaryBtn: {name: 'i18n.confirm', callBack: () => {
                _this.isNewVersion = true;
                store.set(this.storageAddKey, this.vo);
                _this.getConfigInfo();}},
              defaultBtn: {name: '', callBack: null}
            });
          }else {
            _.alert('i18n.notice', err.desc);
          }
        } else {
          _.alert('i18n.notice', this.$t('i18n.reim.reimNotFound'));
        }
      });
    },
    //选择报销类型, 根据类型id获取类型名
    selectReimType(e) {
      let selectedId = e.target.value;
      let selected = this.typeList.find(type => type.typeId == selectedId);

      this.vo['tbQyReimbursementPO.typeName'] = selected.typeName;
      if(this.editStatus == 'approveredit') {
        this.getSettle(selectedId);
        if(this.settleDataList) {
          this.vo['tbQyReimbursementPO.settle'] =this.settleDataList[0].code;
        }
      }
    },
    scrollLock(flag) {
      this.isScrollLock = flag;
    },
    //设置标题
    startAuditTitle(nodeName){
      return this.settingAuditTitle(nodeName,this.isFree)
    },
    //设置选人的标题
    settingAuditTitle (nodeName,isFree) {
      if(isFree === '0' || isFree === '3'){
        return nodeName ? nodeName+this.$t('i18n.Handler') : this.$t('i18n.Handler');
      }else{
        return nodeName ? nodeName+this.$t('i18n.repApprover') : this.$t('i18n.repApprover');
      }
    },
    initFlowData(history) {
      // 重置流程数据
      this.$store.commit('resetFlowData');

      // 审批人编辑和退审时只设置相关人，不加载流程
      if (this.editStatus == 'approveredit') {
        this.$store.commit('updateCCPerson', history.ccPersons);
        return;
      }

      const { isFree, cclist, orgId, setId } = this.config;

      // 如果是新建和复制，不需要报销id
      if (this.editStatus == 'add' || this.editStatus == 'copy') {
        this.updateUserSelectedState({type: 'refId', data: '' });
      }

      // 设置相关人, 如果是新建加载配置相关，否则加载历史数据中的相关人
      if (this.editStatus == 'add') {
        this.$store.commit('updateCCPerson', cclist);
      } else {
        this.$store.commit('updateCCPerson', history.ccPersons);
      }

      // 重置加载上一次数据
      this.$store.commit('resetLoadLastConfig');

      //自由流程负责人的加载上一次按钮显示
      this.loadLastConfig.toPersonList.show = (isFree == "0" || isFree == "3")? false : true;

      //更新templateRefId
      this.updateUserSelectedState({type: "templateRefId", data: 'reim' + orgId.replace(/-/g, '')});

      //更新模板id
      if(isFree == "0" || isFree == "3" ){
        //更新流程类型
        this.updateUserSelectedState({type: "isFree", data: isFree});
        //查询流程节点
        this.getAuditFlowListFun(setId);
      }else{
        //更新流程类型
        this.updateUserSelectedState({type: "isFree", data: '1'});
      }
      this.vo['tbQyReimbursementPO.isFree'] = isFree;
    },
    //第一个接口审批列表数据
    getAuditFlowListFun (id){
      let params = {
        id: id,
        agentCode: 'reim',
        isBranchFlow: this.isFree == '3'? true : false
      }
      searchFlowListFun(params, (result) => {
        //流程接口数据回调
        this.$store.commit('updateSearchFlowListData', result);
      })
    },
    //提交按钮点击，存在流转条件查下一个节点
    saveNodeAuditUser(){
      //检验流程字段是否填写
      isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams,(type) => {
        //处理人没选,显示选人弹窗
        if(type === 'flowApproveDialogShow'){
          _.hideLoading();
          this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
        } else if(type === 'findBranchFlowNextNode'){
          //查找下一节点信息
          let subjIds = [], projIds = [], deptIds = [], standard = '0', budget = '0';
          this.vo.detailVO.forEach(detail => {
            if (detail.subjId) {
              subjIds.push(detail.subjId);
            }

            if (detail.projId) {
              projIds.push(detail.projId);
            }

            if (detail.deptId) {
              deptIds.push(detail.deptId);
            }
          });

          this.vo.detailVO.some(detail => {
            if (detail.state == '1') {
              standard = '1';
              return true;
            }
          });

          this.vo.detailVO.some(detail => {
            if (detail.budgetState == '1') {
              budget = '1';
              return true;
            }
          })

          let params = Object.assign({
            'searchValue.field_sumMoneys': this.vo['tbQyReimbursementPO.totalMoney'],
            'searchValue.field_standard': standard,
            'searchValue.field_budget': budget,
            'searchValue.field_department': deptIds.join(','),
            'searchValue.field_subject': subjIds.join(','),
            'searchValue.field_costCenter': projIds.join(','),
          }, this.findBranchFlowNextNodeInfoParams);

          findBranchFlowNextNodeInfoFun(params,(result) => {
            this.$store.commit('updateFlowAuditUserData', result);
            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
            //更新下拉选择节点名称
            this.$store.commit('updateChooseNodeName')
          })
        } else{
          //验证成功
          this.commitTask()
        }
      })
    },
    //预览个人信息
    showPersonList(title,list,type){
      this.userselectTitle = title;
      this.userSelectList = list;
      this.showPerson = true;
      this.limitPreview = type ? true : false;
    },
    // 显示选择处理人弹窗
    FlowAuditUserShowBox(index) {
      this.updateUserSelectedState({type:'appointUserIndex',data:index})
      //显示指定范围选人弹窗
      if(this.FlowAuditUser[index].startAuditList.assignRange){
        this.updateUserSelectedState({type:"FlowAuditUserBoxShow", data: true})
      } else{
        //显示自由选处理人时的选人组件界面
        this.updateUserSelectConfirm( { data: this.FlowAuditUser[index].startAuditList.userSelected,
          callBack: (result) => {
            this.$store.commit('updateUserSelected',result.user.data)
          }
        });
      }
    },
    // 添加相关人
    ccPersonListShowBox(){
      //初始化选人数据
      this.updateUserSelectConfirm( { data: this.ccPersonList,
        callBack: (result) => {
          this.$store.commit('updateCCPerson',result.user.data)
        }
      });
    },
    // 删除相关人
    removeCCPerson(payload) {
      this.$store.commit('removeCCPerson',payload)
    },
    //选择处理人后点击确定回调
    FlowAuditUserResult(payload){
      this.$store.commit('checkFlowAuditUserType',payload)
      // 如果是多部门，则请求部门负责人
      this.updateFlowUserSelected(payload)
    },
    //加载上一次审批人/相关人点击回调
    confirmPick(type, isGet){
      let updateType = type === '1' ? 'updateCCPerson':'updateUserSelected'
      if (!isGet) {
        this.$store.commit(updateType, []);
      } else {
        getOldccOrTolist(type, (ccOrTolist) => {
          this.$store.commit(updateType, ccOrTolist);
        })
      }
    },
    //保存提交数据
    commitTask(data) {
      let params = {
        //创建者id:
        'creator' : _.userId,
        //相关人字段:
        'relatives': stringUserIds(this.ccPersonList),
      }
      //获取流程字段
      this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser});

      //返回的流程字段
      this.vo['tbQyReimbursementPO.isFree'] = this.isFree;
      this.vo.relatives = stringUserIds(this.ccPersonList);

      if (this.isFree == '0' || this.isFree == '3') {
        this.vo['tbQyReimbursementPO.flowId'] = this.commitTaskParams.flowId;

        if (this.appointNodeAndUserVOList.length) {
          this.vo.flowChioseNodeAuditUserJson = this.commitTaskParams.flowChioseNodeAuditUserJson;
        }

        if (this.isFree == '0' && this.FlowAuditUser.length) {
          this.vo.choiseFlowUser = this.commitTaskParams.chooseFlowUser;

          if (this.FlowAuditUser[0].audtiFlag == '2') {
            this.vo.flowDpId = this.commitTaskParams.flowDpId;
          }
        }

        if (this.isFree == '3') {
          this.vo.currentNodeId = this.commitTaskParams.currentNodeId;
          this.vo.nextNodeId = this.commitTaskParams.nextNodeId;

          if (this.isBranchNode) {
            this.vo.parallelNextNodeIds = this.commitReimTask.parallelNextNodeIds;
          }

          if (this.FlowAuditUser.length) {
            this.vo.choiseFlowUser = this.commitTaskParams.chooseFlowUser;
            this.vo.flowDpId = this.commitTaskParams.flowDpId;
          }
        }
      } else {
        this.vo.incharges = this.commitTaskParams.incharges
      }

      this.commitReim();
    },
    ...mapMutations([
      'removeFlowAuditUser',        // 删除处理人
      'saveChooseFlowUserJson',     // 自由选择确定保存处理人信息
      'updateUserSelectedState',    //更新vuex状态数据
      'updateUserSelectConfirm',    // 更新选人配置
      'setAddressList',
      'setCurrentIndex',
      'hideDeptSelect',
      'updateVerifiedState',
      'updateCorpNameInfo',
      'setLoanData',
    ]),
    ...mapActions([
      'updateFlowUserSelected',     // 更新已选处理人
      'updateFlowCommitTaskParams', //更新提交数据json
      'getNodeListInfo', //获取节点选择信息
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import '~../../styles/variable.scss';
@import '~../../styles/common.scss';

$margin-top: 10px;
.qwui-reimbursement_editor {
  .qwui-reimbursement_main {
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
       display: none;
    }

    &.scroll_lock {
      display: none;
    }

    .qwui-uncommit_tip {
      padding: 10px;
      font-size: $font-size-medium-s;
      color: $color-text;
      background: #85868d;
    }

    .qwui-reim_header {
      margin-top: $box-padding;
      background: $color-background;

      .qwui-reim_desc {
        .qwui-reim_no {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-sub;
        }

        .qwui-reim_title {
          padding: 0 $box-padding 20px;

          .qwui-reim_title_input {
            margin-top: -1px;
            width: 100%;
            line-height: 17px;
            font-size: 16px;
          }
        }

        .qwui-reim_remark {
          position: relative;
          font-size: $font-size-small;
          color: #586C94;
          margin-left:16px;

          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -20px;
            transform: translateY(-50%);
            width: 13px;
            height: 13px;
            background: url('~assets/images/icon_help.png') no-repeat center center;
            background-size: cover;
          }
        }
      }
    }

    .qwui-reim_field_list {
      margin-top: $margin-top;
    }
    .qwui-add_detail {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $box-padding 0;
      font-size: $font-size-medium;
      line-height: 1;
      color: $color-normal;

      &::before {
        content: '';
        margin-right: 2px;
        width: 22px;
        height: 22px;
        background: url('~assets/images/reim/plus_icon.png') no-repeat center center;
        background-size: cover;
      }
    }

    .qwui-total_detail {
      margin-top: $margin-top;
      background: $color-background;
      .qwui-total_detail_head {
        height: 50px;
        line-height: 50px;
        padding: 0 $box-padding;
        font-size: $font-size-medium-x;
        color: #0A1736;

        .qwui-total_detail_norecord {
          float: right;
          font-size: $font-size-medium-s;
          color: $color-text-tip;
        }
      }
      .qwui-total_detail_content {
        padding: $box-padding;
        .qwui-total_detail_title {
          font-size: $font-size-medium-s;
          color: $color-text-sub;
        }

        .qwui-total_detail_money {
          float: right;
          font-size: $font-size-medium-x;
          color: $color-text-d;
          font-weight: bold;

          @extend .dollar;
        }

        .qwui-total_detail_desc {
          margin-top: 5px;
          font-size: $font-size-small;
          color: $color-text-tip;
        }
      }

      .total_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $box-padding;
        color: $color-text-sub;
        font-size: $font-size-medium-s;

        .total_item_money {
          font-size: $font-size-medium-x;
          font-weight: bold;
          color: $color-text-d;

          @extend .dollar;

          &.warn {
            color: #FF574D;
          }
        }
      }
    }

    .qwui-bottom_btn {
      background-color: $color-background;
    }

    .qwui-reim_item {
      display: flex;
      align-items: center;
      padding: $box-padding;
      font-size: $font-size-medium-x;
      line-height: 20px;
      background: $color-background;

      .qwui-require_icon {
        margin-left: 5px;
        color: $color-text-warn;
      }

      .qwui-form_input {
        flex: 1;
        font-size: $font-size-medium-x;
        line-height: 20px;
        text-align: right;
      }

      .qwui-select_control{
        position: relative;
        display: flex;
        flex: 1;
        direction: rtl;
        text-align: right;

        &::after{
          position: absolute;
          top: 0;
          right: 0;
          margin-top: 3px;
          @extend .arrow_down;
        }
      }


      .qwui-form_select{
        width: 100%;
        padding-right: 25px;
        font-size: $font-size-medium-x;
        line-height: 20px;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        outline: none;
        border: none;
        background: $color-background;

        &.placeholder {
          color: #bbb;
        }

        option{
          direction: rtl;
        }
      }
    }

    .qwui-item_title {
      color: #0A1736;
    }
    .qwui-reim_item_cloumn {
      flex-direction: column;
      align-items: stretch;

      .qwui-reim_item_cols {
        display: flex;
        flex: 1;
      }
    }
  }
  .qwui-global_field {
    margin-top: 10px;
  }
}
</style>
