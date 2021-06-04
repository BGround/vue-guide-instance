<template>
  <div class="debit-add">
    <div class="uncommit_tip" v-if="!isCommit && commitTimes">{{tips.uncommit}}</div>
    <!--借款单头部-->
    <div class="debit-header top-line">
      <div class="form-item border-bottom-1px">
        <div class="debit-field-name icon_isRequire">单据类型</div>
        <div class="debit-field-content">
          <select class="form-select" v-model="typeId" :class="{'placeholder': typeId==''}">
            <option value="">请选择</option>
            <option v-for="type in loanTypes"
                    :key="type.typeId"
                    :value="type.typeId"
                    :data="type.typeName">{{type.typeName  + '&#x200E;'}}
            </option>
          </select>
        </div>
        <div class="help-block" id="msg-type">{{fieldHelp.typeId}}</div>
      </div>
      <div class="debit-desc border-bottom-1px top-line">
        <div class="debit-desc-head">
          <p class="debit-no">借款单编号：{{loanPO.loanNo}}</p>
          <img class="icon_remark" src="~assets/images/icon_help.png" alt="" v-if="loanSetting.remark" @click="showRemark">
          <!--<div class="debit-remark" v-if="loanSetting.remark" @click="showRemark">{{$t('i18n.reim.editor.editorRemark')}}</div>-->
        </div>
        <div class="debit-title">
          <!--<div class="msg-title" id="msg-title" style="outline: none;"
               :contenteditable="loanSetting.isEdit == 1"
               @blur="changTitle" ref="loanTitle">{{loanPO.title}}</div>-->
          <input class="msg-title" id="msg-title"
               :disabled="loanSetting.isEdit == 0"
                 v-model="loanPO.title" maxlength="100"
                 @blur="checkFiledBlur('title')">
          <div class="help-block">{{fieldHelp.title}}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <!--借款明细字段-->
      <field-list class="top-line"
                  :fieldSetting="loanFieldSetting"
                  :fieldValue.sync="loanPO"
                  :readOnly="false"
                  @checkFiledBlur="checkFiledBlur">
      </field-list>
      <div class="top-line add-file-pic"
           :class="{'hasFile':filesList && filesList.length>0}"
           v-if="loanFieldSetting.image && loanFieldSetting.image.isEmploy == '1'">
        <p class="file-title"  :class="{'icon_isRequire':loanFieldSetting.image && loanFieldSetting.image.isMust == '1'}">图片/附件</p>
        <qw-uploader
          list-type="picture-list"
          :url="setUploadAction"
          :data="(file)=>setRequestParams(file,agent)"
          :fileList="filesList"
          @wxChooseImage="(serverIds)=>saveWxChooseImage(wxChooseImageParams(serverIds,agent),getWxChooseImage)"
          @preview="(payload)=>previewFileList(payload,true)"
        ></qw-uploader>
        <div v-if="fieldHelp.image" class="help-block" :id="'msg'+loanFieldSetting.image.id">{{fieldHelp.image}}</div>
      </div>
      <!--银行信息组件-->
        <bank-msg v-if="bankMsg.isEmploy == '1' && editStatus != 'approveredit'"
                  class="top-line"
                  :bankMsg.async="bankMsg"
                  :isEdit="true"
                  :bankSwitch="true"
                  :showDown="false"
                  @BankSwitch="BankSwitch"
                  @checkFiledBlur="checkFiledBlur">
        </bank-msg>
    </div>
    <!--流程列表-->
    <QwFlowList v-if="isShowFlowChoose && isFree==0" :flowList="flowList" :flowId="flowId"></QwFlowList>
    <!--选择处理人-->
    <div v-if="isShowFlowChoose && FlowAuditUser.length">
      <user_selected_group v-if="item && item.startAuditList.show"
                           v-for="(item,index) in FlowAuditUser"
                           :key="index"
                           title="审批人"
                           :mustChoose="true"
                           :loadLast="loadLastConfig.toPersonList"
                           @confirmPick="confirmPick">
        <user_selected_item slot="user_selected_item"
                            title="审批人"
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
    <user_selected_group title="相关人"
                         :loadLast="loadLastConfig.ccPersonList"
                         @confirmPick="confirmPick"
                         class="border-bottom-1px">
      <user_selected_item :userTotal="ccPersonList.length"
                          :List="ccPersonList"
                          title="相关人"
                          @showPersonList="showPersonList"
                          @showUserSelectedBox="ccPersonListShowBox"
                          slot="user_selected_item"
                          @removeSelected="removeCCPerson">
      </user_selected_item>
    </user_selected_group>
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
    <!--提交按钮-->
    <button_group class="cc_person_bottom">
      <qwui_button v-if="editStatus == 'approveredit'" type="primary" text="保存" @buttonClick="commitTask"></qwui_button>
      <template v-else>
        <qwui_button type="default" text="保存草稿" @buttonClick="commitTask(0)"></qwui_button>
        <qwui_button type="primary" text="提交" v-if="isCommit" @buttonClick="commitTask(1)"></qwui_button>
      </template>
    </button_group>
    <!--公共选人组件-->
    <user_selected_Box v-if="selectConfig.show"
                       :selectconfig="selectConfig">
    </user_selected_Box>
    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      :agent="agent"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="updateLoan"
      :action="approveActionStatus">
    </flow-approve-dialog>
    <!--人员列表预览组件-->
    <user_show :show.sync="showPerson"
               :title="userselectTitle"
               :limitPreview="limitPreview"
               :userSelect="userSelectList">
    </user_show>
    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>
<script>
//  import {addData, configInfo, selectConfig} from './data'//模拟初始化接口的数据
  import {
    getConfigInfo,
    ajaxAddLoan,
    ajaxUpdate,
    getLastReceiptAccount,
    getLoanDetail,
//    approveUpdate,
  } from '../../../api/debit'
  import FieldList from '../../../components/Debit/DebitField.vue'
  import previewImages from "@/components/base/previewImages";
  import BankMsg from '../../../components/bankMsg.vue'
  // 公共组件
  import QwUploader from "@/components/upload";
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
  import user_selected_Box from '@/components/base/user_or_dept_select';
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist';
  import QwFlowList from "@/components/flow/flowList";
  import {qwui_button, button_group} from '@/components/base/button';
  import user_show from '@/components/detail/user_show'
  import {
    searchFlowListFun,
    findBranchFlowNextNodeInfoFun,
    getDepartmentInfoFun,
    settingAuditTitle,
    stringUserIds,
    isCheckFlowUserConfirm,
    branchFlowListCheck,
    resetAuditFlowData
  } from '@/components/flow/getAuditFlow';
  import ChooseNodeList from '@/module/moveapprove/components/chooseNodeList.vue';
  import FlowApproveDialog from '@/components/flow/flowApproveDialog'
  import {getOldccOrTolistLoan} from '../../../api/getData'
  import {validation, test} from '../../../js/validation'
  import dataBase from '../../../dataBase'
  //文件上传mixins
  import uploader from '../../../../../utils/uploader.js'
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    mixins: [uploader],
    components: {
      FieldList,
      BankMsg,
      user_selected_item,
      user_selected_group,
      user_selected_Box,
      qwui_button,
      button_group,
      QwFlowList,
      user_selected_ranglist,
      FlowApproveDialog,
      user_show,
      QwUploader,
      previewImages
    },
    data() {
      return {
        agent: 'reimbursement',
        loanId:'',
        // 编辑状态，审批:'approveredit' ，草稿：'draft',提单人编辑: 'edit'，新建: 'add'，复制: 'copy'
        editStatus: '',
        loanVersion:0,
        // 是否已经退审
        isOver: '',
        approveActionStatus: '', //当前点击按钮
        // 提示内容
        tips: {
          uncommit: '',
        },
        // 是否在可提交时间内
        isCommit: true,
        // 接口数据
        loanSetting: {},   // 基本设置
        loanTypes: [],     // 单据类型
        commitTimes: [],   // 可提交时间
        defaultPersons: [], // 默认相关人
        loanFiledSettings: [], // 借款单字段
        loanFlowSetting: {},   // 流程相关设置
        loanFieldSetting: {},  // 借款单字段配置
        //字段值
        loanPO: {
          loanId: '',
          loanNo: '',
          deptId: '',
          deptName: '',
          flowId: '',
          title: '',
          loanMoney: '',
          loanDate: '',
          repayDate: '',
          remark: '',
          isFree: '', // 0固定 1自由 3分支
          receiptFullName: '',
          bankAccount: '',
          depositBank: '',
          status: ''
        },//字段值end
        typeId: '',// 单据类型
        bankMsg: {},//收款账户详细信息
        fieldDetail: {}, // 明细字段的值
        editor: dataBase.editor, //填写规范
        submitURL: `${_.baseURL}/portal/loan/loanPortalCtl/ajaxAdd.do`,//提交借款单的接口地址
        filesList: [],//附件
        isUpload: true,//图片附件，是否显示上传入口，false则只显示列表
        isCached: true,//是否要缓存数据，默认为true,正常提交后就改为false
        userselectTitle:'',
        userSelectList:[],
        showPerson:false,
        limitPreview:false
      }
    },
    watch: {
      typeId(val) {
        this.checkFiledBlur('typeId');
      },
    },
    updated(){
      if(this.filesList.length>0){
        this.checkFiledBlur('filesList');
      }
    },
    created() {
      this.loanId = this.$route.query.id || '';
      // 记录编辑状态
      this.editStatus = this.$route.query.type || 'add';
      this.isCached = this.editStatus === 'add'?true:false;
      this.initForm();
    },
    methods: {
      //微信端插入图片列表
      getWxChooseImage(files){
        this.filesList.push(...files);
      },
      //初始化表单
      initForm() {
        _.showLoading();
        let _this = this;
        // 请求并初始化新建借款单的配置信息
        let id = this.editStatus == 'approveredit' ? this.loanId : '';
        getConfigInfo({'loanId':id}).then((res) => {
          _.hideLoading();
          if (res.code === '0') {
            // 当存在缓存的时候，提示用户要不要使用缓存数据(复制和编辑进来的新建页面就不要提示)
            if (this.editStatus=='add' && JSON.parse(window.localStorage.getItem('loanPO'))) {
              _.alert('i18n.notice', 'i18n.reim.editor.getStorage ', {
                primaryBtn: {name: 'i18n.confirm', callBack: () => this.confirmStorage()},
                defaultBtn: {name: 'i18n.cancel', callBack: null}
              });
            }
            const {instanceTitleTemplate, loanSetting, loanTypes, commitTimes, defaultPersons, loanFiledSettings, loanFlowSetting} = res.data;
            _this.commitTimes = commitTimes;   // 可提交时间
            this.checkCommitTime(_this.commitTimes);
            _this.loanSetting = loanSetting;   // 基本设置
            _this.loanTypes = loanTypes;     // 单据类型
            // 单据类型只有一个时默认选择该项
            if (_this.editStatus === 'add' &&  _this.loanTypes.length === 1) {
              this.typeId = _this.loanTypes[0].typeId;
            }
            _this.defaultPersons = defaultPersons; // 默认相关人
            _this.loanFiledSettings = loanFiledSettings; // 借款单字段
            // 将字段设置数组转换为对象
            _this.SetFieldObj();
            _this.bankMsg = Object.assign(_this.bankMsg, loanFiledSettings[6]);
            if(_this.editStatus === 'approveredit'){
              //审批人编辑
              _this.initLoanDetail('approveredit');
              _this.submitURL = `${_.baseURL}/portal/loan/loanPortalCtl/approveUpdate.do`;
            }else{
              let flowSetting = _this.loanFlowSetting;
              // 流程相关设置
              _this.loanFlowSetting = loanFlowSetting;
              _this.loanFlowSetting = Object.assign(_this.loanFlowSetting, flowSetting);
              // 初始化流程
              _this.initFlowData(_this.loanFlowSetting);
              if (_this.editStatus === 'copy') {
                _this.initLoanDetail('copy');
                // 复制初始化表单编号
                _this.loanPO.loanNo = loanSetting.number;
              } else if(_this.editStatus === 'edit'|| _this.editStatus === 'draft'){
                //提单人编辑和草稿
                _this.initLoanDetail('edit');
                _this.submitURL = `${_.baseURL}/portal/loan/loanPortalCtl/ajaxUpdate.do`;
              }else {
                // 新建初始化表单编号和标题
                _this.loanPO.loanNo = loanSetting.number;
                _this.loanPO.title = instanceTitleTemplate;
              }
            }
          }
        }).catch(err => {
          let btnConfig = {
            primaryBtn: {
              name: "i18n.confirm", callBack: function () {
                _this.$router.go(-1)
              }
            },
            defaultBtn: {name: '', callBack: null}
          };
          _.hideLoading();
          _.alert('提示', err.desc, btnConfig);
        });
      },
      // 初始化借款单数据
      initLoanDetail(type) {
        let _this = this;
        getLoanDetail({
          loanId: _this.loanId,
          size: "1"
        }).then((res) => {
          // 图片附件数据
          let fileList = [];
          fileList.push(...res.data.mediaList);
          fileList.push(...res.data.picList);
          _this.filesList.push(..._this.setMatchFileList(fileList));

          let data = res.data.data;
          // 基础字段数据
          _this.typeId = data.typeId;
          _this.setBankValue(_this.bankMsg, data);
          _this.loanPO.deptId = data.deptId || '';
          _this.loanPO.deptName = data.deptName || '';
          _this.loanPO.loanMoney = data.loanMoney|| '';
          _this.loanPO.remark = data.remark|| '';
          _this.loanPO.title = data.title|| '';
          _this.loanVersion = data.loanVersion || 0;
          _this.isOver = data.status == 3 ? 0 : ''; //status:3 退审
          //时间处理
          _this.loanPO.loanDate = data.loanDate;
          _this.loanPO.repayDate = data.repayDate;
          if (type == 'edit' || type == 'approveredit') {
            //提单人编辑，草稿，和审批人编辑时用原来的表单id和编号（复制会产生新的）
            _this.loanPO.loanId = data.loanId;
            _this.loanPO.loanNo = data.loanNo;
          }
          if(type == 'approveredit'){
            //审批人编辑加载原相关人
            _this.defaultPersons = data.ccPersonList;
            _this.initFlowData();
          }
        });
      },
      // 提示填写规范
      showRemark() {
        _.alert('借款单填写规范', this.loanSetting.remark, {
          primaryBtn: {name: 'i18n.confirm', callBack: null},
          defaultBtn: {name: '', callBack: null}
        });
      },
      //校验可提交借款单时间
      checkCommitTime(commitTimes){
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let dayTip = '可提交借款的时间段为：';
        // 判断是否在可提交区间内
        if(commitTimes && commitTimes.length > 0){
          for (let i = 0; i < commitTimes.length; i++) {
            // 只要day在某个可提交的区间内，就是对的
            if ( commitTimes[i].endTime>= day  && day >= commitTimes[i].startTime) {
              this.isCommit= true;
              return
            }else{
              this.isCommit = false;
            }
            // 获取可提交时间段
            dayTip += `${year}-${month}-${commitTimes[i].startTime} 至 ${year}-${month}-${commitTimes[i].endTime}，`
          }
          this.tips.uncommit = dayTip + '不在此时间段时，可以将内容保存为草稿';
        }
      },

      // 将返回的字段配置数组，转换为对象
      SetFieldObj() {
        for (let i = 0; i < this.loanFiledSettings.length; i++) {
          let setting = this.loanFiledSettings[i];
          this.$set(this.loanFieldSetting, setting.field, {})
//          this.loanFieldSetting[setting.field] = {};
          let field = this.loanFieldSetting[setting.field];
          // 深度监听对象
          this.$set(field, 'id', setting.id);
          this.$set(field, 'isEmploy', setting.isEmploy);
          this.$set(field, 'isMust', setting.isMust);
        }
      },
      // 用于将收款单位字段的值传到收款单位的配置信息中
      setBankValue(targetObj, sourceObj) {
        this.$set(targetObj, 'receiptFullName', sourceObj.receiptFullName);
        this.$set(targetObj, 'depositBank', sourceObj.depositBank);
        this.$set(targetObj, 'bankAccount', sourceObj.bankAccount);
      },
      // 加载上一次银行收款信息
      BankSwitch(flag) {
        let _this = this;
        if (flag == 1) {
          _.showLoading('加载中...');
          getLastReceiptAccount().then(res => {
            _.hideLoading();
            if(res.data.bankInfoVO){
              let data = res.data.bankInfoVO;
              _this.$set(_this.bankMsg, 'receiptFullName', data.receiptFullName);
              _this.$set(_this.bankMsg, 'depositBank', data.depositBank);
              _this.$set(_this.bankMsg, 'bankAccount', data.bankAccount);
            }else {
              _this.bankMsg.receiptFullName = '';
              _this.bankMsg.depositBank = '';
              _this.bankMsg.bankAccount = '';
            }
          })
        } else {
          _this.bankMsg.receiptFullName = '';
          _this.bankMsg.depositBank = '';
          _this.bankMsg.bankAccount = '';
        }
      },

      /*
      流程相关的方法
       */
      // 初始化流程信息
      initFlowData(loanFlowSetting) {
        //重置流程数据
        this.$store.commit('resetFlowData')

        // 审批人编辑只设置相关人，不加载流程
        if (this.editStatus == 'approveredit') {  /*|| this.isOver == '0'  退审重新编辑可以修改流程*/
          this.$store.commit('updateCCPerson', this.defaultPersons);
          return;
        }

        // 如果是新建和复制，不需要借款id
        if (this.editStatus == 'add' || this.editStatus == 'copy') {
          this.updateUserSelectedState({type: 'refId', data: '' });
        }

        const {isFree, orgId, flowList, id} = loanFlowSetting;

        // 重置加载上一次数据
        this.$store.commit('resetLoadLastConfig');

        // 设置相关人
        this.$store.commit('updateCCPerson', this.defaultPersons);

        //自由流程负责人的加载上一次按钮显示
        this.loadLastConfig.toPersonList.show = (isFree == "0" || isFree == "3") ? false : true;

        //更新templateRefId
        this.updateUserSelectedState({type: "templateRefId", data: 'loan' + orgId.replace(/-/g, '')});

        //更新模板id
        if (isFree == "0" || isFree == "3") {//0固定 1自由 3分支
          //更新流程类型
          this.updateUserSelectedState({type: "isFree", data: isFree});
          //查询流程节点
          this.getAuditFlowListFun(id);
        } else {
          //更新流程类型
          this.updateUserSelectedState({type: "isFree", data: '1'});
        }
        this.loanPO.isFree = isFree;
      },
      //第一个接口审批列表数据
      getAuditFlowListFun(id) {
        let params = {
          id: id,
          agentCode: 'loan',
          isBranchFlow: this.isFree == '3' ? true : false,
//          refId: this.editStatus == 'edit' ? this.loanId : '',
        }
        searchFlowListFun(params, (result) => {
          //流程接口数据回调
          this.$store.commit('updateSearchFlowListData', result);
        })
      },
      //预览个人信息
      showPersonList(title, list, type) {
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        if(type){
          this.limitPreview = true
        }else{
          this.limitPreview = false
        }
      },
      // 显示选择处理人弹窗
      FlowAuditUserShowBox(index) {
        this.updateUserSelectedState({type: 'appointUserIndex', data: index})
        //显示指定范围选人弹窗
        if (this.FlowAuditUser[index].startAuditList.assignRange) {
          this.updateUserSelectedState({type: "FlowAuditUserBoxShow", data: true})
        } else {
          //显示自由选处理人时的选人组件界面
          this.updateUserSelectConfirm({
            data: this.FlowAuditUser[index].startAuditList.userSelected,
            callBack: (result) => {
              this.$store.commit('updateUserSelected', result.user.data)
            }
          });
        }
      },
      // 添加相关人
      ccPersonListShowBox() {
        //初始化选人数据
        this.updateUserSelectConfirm({
          data: this.ccPersonList,
          callBack: (result) => {
            this.$store.commit('updateCCPerson', result.user.data)
          }
        })
      },
      // 删除相关人
      removeCCPerson(payload) {
        this.$store.commit('removeCCPerson', payload)
      },
      //选择处理人后点击确定回调
      FlowAuditUserResult(payload) {
        this.$store.commit('checkFlowAuditUserType', payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      //加载上一次审批人/相关人点击回调
      confirmPick(type, isGet) {
        let updateType = type === '1' ? 'updateCCPerson' : 'updateUserSelected';
        if (!isGet) {
          this.$store.commit(updateType, []);
        } else {
          getOldccOrTolistLoan(type, (ccOrTolist) => {
            this.$store.commit(updateType, ccOrTolist);
          })
        }
      },
      /*
      流程相关的方法end
       */

      //组装传参的提交数据
      saveParams() {
        let _this = this;
        let loanPO = this.loanPO;
        //提交前如果是不启用字段，把值清空（否则复制，提单人编辑时有可能会提交之前保存的字段值）
        _this.loanFiledSettings.forEach(function(item,index){
          //如果该字段不启用
          if(!item.isEmploy){
            switch(item.field){
              case 'dept':
                _this.loanPO.deptId = '';
                _this.loanPO.deptName = '';
                break
              case 'remarks':
                _this.loanPO.remark = '';
                break
              case 'image':
                _this.filesList = [];
                break
              case 'receiptAccount':
                _this.bankMsg.receiptFullName = '';
                _this.bankMsg.depositBank = '';
                _this.bankMsg.bankAccount = '';
                break
            }
          }
        });
        loanPO = Object.assign(loanPO, this.fieldDetail);
        this.setBankValue(loanPO, this.bankMsg);
        loanPO.isFree = this.loanFlowSetting.isFree;//是否自由流程 0
        loanPO.typeId = this.typeId;
        loanPO.status = 1;
        loanPO.loanVersion=this.loanVersion;

        // 审批人列表
        let auditPersonList = this.FlowAuditUser[0] ? this.FlowAuditUser[0].startAuditList.userSelected : [];
        let params = {
          //创建者id:
//          'creator': _.userId,
          // 后台接口
          'flowChioseNodeAuditUserJson': '',  // 可指定的节点 0
          'nextNodeId': this.nextNodeId, // 下一节点id 0
          'currentNodeId': this.currentNodeId, // 当前节点id 0
//          'parallelNextNodeIds': this.parallelNextNodeIds, // 下一个并行节点id 0     暂时没有并行流程
          'flowId': this.flowId,  //审批流程id 0
          'flowDpId': '', //
          'chooseFlowUser': '', //选择的特定用户id
          'relatives': stringUserIds(this.ccPersonList), //相关人
          'incharges': stringUserIds(auditPersonList), //审批人
          'loanPO': loanPO //字段信息
        };
        return params;
      },
      //保存草稿
      saveDraft() {
        _.showLoading("保存中...");
        let params = this.saveParams();
        //图片附件处理
        const {mediaIds,imageUrls} = this.getFileListId(this.filesList);
        params.mediaIds= mediaIds; //附件0
        params.imageUrls= imageUrls; //附件0

        params.loanPO.status = 0;
        ajaxAddLoan(this.submitURL, params).then(() => {
          _.hideLoading("保存中...");
          this.isCached = false;//标志不用缓存数据
          this.$router.push({
            path: '/newDraft'
          });
        }).catch(err=>{
          _.hideLoading();
          _.alert("提示",err.desc);
        });
      },
      // 点击提交、保存按钮
      commitTask(status){
        if(status == 0){//草稿
          this.saveDraft()
        }else{//提交(提单人编辑)或者审批人编辑的校验必填字段
          this.checkFiled(status);
        }
      },
      //校验必填字段
      checkFiled(status){
        // 获取发请求的参数
        let params = this.saveParams();
        // 字段校验函数 参数1可提交借款时间区间 参数2字段的设置，参数3最迟还款时间，参数4字段值,参数5图片附件数组
        let res = validation(this.loanFieldSetting, this.loanSetting.repayment, params.loanPO, this.filesList);//字段校验
        let fieldHelp = res.fieldHelp;
        let isError = res.isError;
        // 将校验出错的数据存到vuex里面
        this.setFieldHelp(fieldHelp);
        // 一旦校验不通过就不用往下走了
        if (isError) {
          return;
        }else{
          //校验通过
          if(status == '1'){//提交，去校验流程
            console.log('校验流程');
            this.checkFlow(params);
          }else {//审批人编辑提交，去更新字段
            console.log('status'+status);
            this.updateLoan(params);
          }
        }
      },
      //单条数据校验
      //失去焦点判空提示
      checkFiledBlur(name){
        // 获取检验字段
        let params = this.saveParams();
        // 字段校验函数 参数1可提交借款时间区间 参数2字段的设置，参数3最迟还款时间，参数4字段值,参数5图片附件数组
        let res = validation(this.loanFieldSetting, this.loanSetting.repayment, params.loanPO, this.filesList,name);//字段校验
        let fieldHelp = res.fieldHelp;
        let isError = res.isError;
        // 将校验出错的数据存到vuex里面
        this.setFieldHelp(fieldHelp);
        // 一旦校验不通过就不用往下走了
        if (isError) return;
      },
      //校验流程
      checkFlow(params){
        //检验流程字段是否填写
        isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams, (type) => {
          //处理人没选,显示选人弹窗
          console.log('校验流程：'+type);
          if (type === 'flowApproveDialogShow') {
            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
          } else if (type === 'findBranchFlowNextNode') {
            let params = Object.assign({
              'searchValue.field_sumMoneys': this.loanPO.loanMoney,
              'searchValue.field_department':this.loanPO.deptId,
//              initRefId: this.editStatus == 'edit' ? this.loanId : '',
            }, this.findBranchFlowNextNodeInfoParams);
            //查找下一节点信息
            findBranchFlowNextNodeInfoFun(params, (result) => {
              this.$store.commit('updateFlowAuditUserData', result);
              this.updateUserSelectedState({type: "flowApproveDialogShow", data: true});
              //更新下拉选择节点名称
              this.$store.commit('updateChooseNodeName');
            })
          } else {
            //验证成功就去更新字段
            this.updateLoan(params);
          }
        })
      },
      //更新字段
      updateLoan(){
        let params = this.saveParams();
        //获取流程字段
        this.updateFlowCommitTaskParams({'isFree': this.isFree, 'FlowAuditUser': this.FlowAuditUser});
        if (this.isFree == 0 || this.isFree == 3) { // 固定、分支
          params.flowId = this.flowId;
          if (this.appointNodeAndUserVOList.length) {
            params.flowChioseNodeAuditUserJson = this.commitTaskParams.flowChioseNodeAuditUserJson;
          }
          if (this.isFree == '0' && this.FlowAuditUser.length) {
            params.chooseFlowUser = this.commitTaskParams.chooseFlowUser;

            if (this.FlowAuditUser[0].audtiFlag == '2') {
              params.flowDpId = this.commitTaskParams.flowDpId;
            }
          }
          if (this.isFree == '3') {
            params.currentNodeId = this.commitTaskParams.currentNodeId;
            params.nextNodeId = this.commitTaskParams.nextNodeId;
            if (this.isBranchNode) {
              params.parallelNextNodeIds = this.commitTaskParams.parallelNextNodeIds;
            }
            if (this.FlowAuditUser.length) {
              params.choiseFlowUser = this.commitTaskParams.chooseFlowUser;
              params.flowDpId = this.commitTaskParams.flowDpId;
            }
          }
        }else{//自由
          params.incharges = this.commitTaskParams.incharges;
        }
        this.ajaxCommit(params);
      },
      //请求接口提交数据
      ajaxCommit(params){
        let  _this = this;
        //图片附件处理
        const {mediaIds,imageUrls} = this.getFileListId(this.filesList);
        params.mediaIds= mediaIds; //附件0
        params.imageUrls= imageUrls; //附件0
        _.showLoading("提交中...");
        ajaxAddLoan(this.submitURL, params).then((res) => {
          if (res.code == '0') {
            _.hideLoading();
            _this.isCached = false;
            if(_this.editStatus=='approveredit'){
              //审批人编辑提交后跳转至此单的详情页
              this.$router.push({
                path: '/debitDetail',
                query: {id: this.$route.query.id}
              });
            }else{
              //新建，复制，草稿，提单人编辑页面提交之后跳转至借款列表页
              this.$router.push({
                path: '/debitList',
              });
              this.$route.meta.queryType = 0;
              this.$route.meta.statusText = '我发起的';
            }
          } else {
            _.hideLoading();
            _.alert('提示', res.desc)
          }
        }).catch(err=>{
          _.hideLoading();
          _.alert('提示', err.desc);
        });
      },
      /*commitTask(status) {
        // 获取发请求的参数
        let params = this.saveParams();
        // 提交校验校验
        // 字段校验函数 参数1可提交借款时间区间 参数2字段的设置，参数3最迟还款时间，参数4字段值,参数5图片附件数组
        let res = validation(this.loanFieldSetting, this.loanSetting.repayment, params.loanPO, this.filesList.concat(this.imageList));//字段校验
        let fieldHelp = res.fieldHelp;
        let isError = res.isError;
        // 将校验出错的数据存到vuex里面
        this.setFieldHelp(fieldHelp);
        // 一旦校验不通过就不用往下走了
        if (isError) return;
        _.showLoading("提交中...");

        if(status==1){
          //如果是点击提交，先校验流程

        }else{
          //
        }



        if(name=='onlyField'){
          params.loanId = this.$route.query.id;
//          params.reimCreator = this.reimCreator;
//          params.relatives = stringUserIds(this.ccPersonList);
        }else{
          //获取流程字段
          this.updateFlowCommitTaskParams({'isFree': this.isFree, 'FlowAuditUser': this.FlowAuditUser});
          if (this.isFree == 0 || this.isFree == 3) { // 固定、分支
            params.flowId = this.flowId;
            if (this.appointNodeAndUserVOList.length) {
              params.flowChioseNodeAuditUserJson = this.commitTaskParams.flowChioseNodeAuditUserJson;
            }
            if (this.isFree == '0' && this.FlowAuditUser.length) {
              params.chooseFlowUser = this.commitTaskParams.chooseFlowUser;

              if (this.FlowAuditUser[0].audtiFlag == '2') {
                params.flowDpId = this.commitTaskParams.flowDpId;
              }
            }
            if (this.isFree == '3') {
              params.currentNodeId = this.commitTaskParams.currentNodeId;
              params.nextNodeId = this.commitTaskParams.nextNodeId;
              if (this.isBranchNode) {
                params.parallelNextNodeIds = this.commitReimTask.parallelNextNodeIds;
              }
              if (this.FlowAuditUser.length) {
                params.choiseFlowUser = this.commitTaskParams.chooseFlowUser;
                params.flowDpId = this.commitTaskParams.flowDpId;
              }
            }
          }else{//自由
            params.incharges = this.commitTaskParams.incharges;
          }
        }
        let  _this = this;
        ajaxAddLoan(this.submitURL, params).then((res) => {
          if (res.code == '0') {
            _.hideLoading("提交中...");
            _this.isCached = false;
            if(_this.editStatus=='approveredit'){
              //审批人编辑提交后跳转至此单的详情页
              this.$router.push({
                path: '/debitDetail',
                query: {id: this.$route.query.id}
              });
            }else{
              //新建，复制，草稿，提单人编辑页面提交之后跳转至借款列表页
              this.$router.push({
                path: '/debitList',
              });
              this.$route.meta.queryType = 0;
              this.$route.meta.statusText = '我发起的';
            }
          } else {
            _.hideLoading("提交中...");
            _.alert('提示', res.desc)
          }
        });
        //获取流程字段
        this.updateFlowCommitTaskParams({'isFree': this.isFree, 'FlowAuditUser': this.FlowAuditUser})
      },*/
      // 缓存数据
      saveCache(){
        this.setBankValue(this.loanPO, this.bankMsg); //
        delete this.loanPO.loanNo;
        delete this.loanPO.title;
        window.localStorage.setItem('loanPO', JSON.stringify(this.loanPO));
        window.localStorage.setItem('typeId', this.typeId);
        /*this.filesList.forEach(function (item,index){
          let str = item.originFileObj.type;
          item.originFileObjType = str;
        })
        window.localStorage.setItem('mediaList', JSON.stringify(this.filesList));*/
      },
      // 清除上次缓存
      cancelStorage() {
        // window.localStorage.clear();  // 有点怕把别人的缓存给清了，所以先不用
        window.localStorage.removeItem('loanPO');
//        window.localStorage.removeItem('mediaList');
        window.localStorage.removeItem('typeId');
      },
      // 使用上次缓存的数据
      confirmStorage() {
        // 缓存的内容不包括：借款单编号、借款主题
        this.loanPO = Object.assign(this.loanPO, JSON.parse(window.localStorage.getItem('loanPO')));
        /*var fileList = JSON.parse(window.localStorage.getItem('mediaList'));
        fileList.forEach(function (item) {
          item.originFileObj.type = item.originFileObjType;
        })
        this.filesList = this.setMatchFileList(fileList);*/
        this.setBankValue(this.bankMsg, this.loanPO);
        this.typeId = window.localStorage.getItem('typeId');
      },
      //vuex操作
      ...mapMutations([
        "removeFlowAuditUser",        // 删除处理人
        'saveChooseFlowUserJson',     // 自由选择确定保存处理人信息
        "updateUserSelectedState",    //更新vuex状态数据
        "updateUserSelectConfirm",    // 更新选人配置
        "setFieldHelp",               // 更新字段提示信息
        'hideDeptSelect',             //隐藏选部门页面
      ]),
      ...mapActions([
        "updateFlowUserSelected",     // 更新已选处理人
        'updateFlowCommitTaskParams', //更新提交数据json
//        "getNodeListInfo", //获取节点选择信息
      ]),
    },
    computed: {
      isShowFlowChoose() {
        return this.editStatus != 'approveredit';
      },
      ...mapState({
        FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
        selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
        loadLastConfig: state => state.flowUserSelected.loadLastConfig, // 加载上一次默认配置
        ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息
        isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
        flowList: state => state.flowUserSelected.flowList, // 流程列表
        flowId: state => state.flowUserSelected.flowId,                     // 已选的流程id
        templateRefId: state => state.flowUserSelected.templateRefId,          //模板借支单id

        isBranchFlow: state => state.flowUserSelected.isBranchFlow,           //接口返回的流程数据
        isBranchNode: state => state.flowUserSelected.isBranchNode,          //接口返回的流程数据
        currentNodeId: state => state.flowUserSelected.currentNodeId,      // 当前节点id
        nextNodeId: state => state.flowUserSelected.nextNodeId,           // 下一节点id
        defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
        parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开

        FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        appointUserIndex: state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息

        commitTaskParams: state => state.flowUserSelected.commitTaskParams, ////提交返回的流程字段
      }),
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
        'getIsCheckFlowUserConfirmParams',//检验流程字段
        'findBranchFlowNextNodeInfoParams',//查找下一节点信息的入参
        'fieldHelp', // 字段提示
      ]),
    },
    beforeDestroy() {
      // 可以缓存的时候就缓存借款单数据,
      if(this.isCached){
        this.saveCache();
      }else{
       // 不然就要清掉缓存
        if(this.editStatus === 'add'){
          this.cancelStorage();
        }
      }
      //组件销毁前清掉提交时的错误提示
      this.setFieldHelp();
      //清掉选部门面板
      this.hideDeptSelect();
      //清掉选人面板
      this.selectConfig.show = false;
      document.getElementsByTagName("body")[0].style.cssText = "";
      document.body.style.cssText = "";
    },
  }
</script>
<style scoped>
  .uncommit_tip {
    padding: 10px;
    font-size: 13px;
    color: #fff;
    background: #85868d;
  }
  .icon_isRequire::after {
    margin-left: 5px;
    content: '*';
    color: #E64E4E;
  }

  .form-select {
    position: relative;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
    min-width: 150px;
    padding-right: 15px;
    font-size: 16px;
    line-height: 1;
    color: #3B455D;
    background: white;
    outline: none;
    border: none;
    direction: rtl;
  }
  .placeholder{
      color: #bbb;
  }
  .form-select option {
    direction: rtl;
  }

  .form-select option disabled {
    color: rgb(153, 153, 153);
  }

  .icon_down_gray {
    position: absolute;
    top:19px;
    right:15px;
    margin-left: 4px;
    width: 16px;
    height: 16px;
    transform: rotate(-90deg);
    background: url("../../../../../assets/images/icon_down_gray.png") no-repeat center;
    background-size: 14px 8px;
  }

  .help-block {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #FF574D;
  }

  .top-line {
    margin-top: 10px;
  }

  .form-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 15px;
    font-size: 16px;
    line-height: 20px;
    background: white;
  }
  .add-file-pic{
    padding: 15px 16px;
    background: #fff;
  }
  .hasFile{
    padding: 15px 16px 0 16px;
  }
  .file-title{
    position: absolute;
    color: #3B455D;
    font-size: 16px;
  }
  /deep/ .upload-box{
    padding: 0 !important;
  }
  .icon_isRequire::after {
    margin-left: 5px;
    content: '*';
    color: #E64E4E;
  }
  .bank-load {
    margin-left: auto;
    padding-right: 40px;
    font-size: 13px;
    color: #888;
  }

  .debit-desc {
    font-size: 20px;
    background: white;
  }

  .debit-desc-head {
    padding: 15px;
    display: flex;
    font-size: 14px;
  }

  .debit-no {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    font-size: 14px;
    color: #666;
  }

  .debit-remark {
    position: relative;
    font-size: 14px;
    color: #586C94;
    margin-left:7px;
    height:30px;
    line-height: 26px;
  }
   .icon_remark {
    width: 14px;
    height: 14px;
    margin-top:3px;
  }

  .debit-title {
    padding: 0 15px 20px 15px;
    outline: none;
  }
  .debit-title .msg-title{
    width: 100%;
    font-size: 17px;
    word-break:break-all;
    background-color: #fff;
    white-space: pre;
  }
  .debit-field-name {
    margin-right: auto;
  }

  .debit-field-content {
    position: relative;
    margin-left: auto;
    width: 70%;
    text-align: right;
    font-size: 16px;
    line-height: 1;
    color: #3B455D;
  }
  .debit-field-content::after{
    position: absolute;
    top: 50%;
    right: 2px;
    margin-top: -4px;
    content: '';
    display: inline-block;
    width:10px;
    height: 10px;
    border-style: solid;
    border-width: 2px 2px 0 0;
    border-color: #ccc;
    box-sizing: border-box;
    transform: rotate(44deg);
    vertical-align: middle;
  }
  .debit-field-content input {
    text-align: right;
    font-size: 16px;
    color: #3B455D;
    background-color: white;
  }
  .cc_person_bottom{
    background-color: #fff;
  }
</style>
