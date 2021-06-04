<template>
    <div class="contract_operate">
        <div>
            <!-- 固定字段和自定义字段 -->
            <div class="operateItem_wrap">
                <crm-operate-item
                    v-model="item.value"
                    v-for="(item,idx) in contractConfig.group1"
                    :key="idx"
                    :item="item"
                    :dataDetailMsg="add_nav"
                >
                    <div class="noType_tips">
                        <p>
                            请联系管理员根据自身业务情况在合同类型设置页面自定义合同类型
                        </p>
                    </div>
                </crm-operate-item>
                <div class="qwui-separate_bar"></div>
            </div>
            <div class="operateItem_wrap">
                <crm-operate-item
                    v-model="item.value"
                    v-for="(item,idx) in contractConfig.group2"
                    :key="idx"
                    :item="item"
                    :dataDetailMsg="add_nav"
                >
                    <slot v-if="item.editName === 'clientName' || item.editName === 'businessName'">
                        <div class="contract_select_icon" @click="item.iconEvent">选择</div>
                    </slot>
                </crm-operate-item>
                <div class="qwui-separate_bar"></div>
            </div>
            <div class="operateItem_wrap">
                <crm-operate-item
                    v-model="item.value"
                    v-for="(item,idx) in contractConfig.group3"
                    :key="idx"
                    :item="item"
                    :dataDetailMsg="add_nav"
                ></crm-operate-item>
                <div class="qwui-separate_bar"></div>
            </div>
            <div class="operateItem_wrap">
                <crm-operate-item
                    v-model="item.value"
                    v-for="(item,idx) in contractConfig.group4"
                    :key="idx"
                    :item="item"
                    :dataDetailMsg="add_nav"
                    @changeUeditor="changeUeditor"
                    ref="group4"
                >
                    <slot v-if="item.editName === 'signatory'">
                        <div class="contract_select_icon" @click="item.iconEvent">选择</div>
                    </slot>
                </crm-operate-item>
                <div class="qwui-separate_bar custom_bar">可通过后台启用更多自定义字段</div>
            </div>

            <!-- 上传照片附件 -->
            <div class="qwui-client_attachment">
                <span class="img-text">照片</span>
                <add-img :dataDetailMsg="imgUpload" @listenToChild="showMsgFromImgDetail"></add-img>
                <add-file :dataDetailMsg="fileUpload" @listenToChild="showMsgFromFileDetail" v-if="showUpLoad"></add-file>
            </div>

            <!-- 流程列表 -->
            <qw-flow-list v-if="isFree === 0 && !isAuditUser" :flowList="flowList" :flowId="flowId"></qw-flow-list>

            <!--选择处理人-->
            <div v-if="FlowAuditUser.length && isFree!=='' && isFree != '4' && !isAuditUser">
                <user-selected-group
                    v-if="item && item.startAuditList.show"
                    v-for="(item,index) in FlowAuditUser"
                    :key="index"
                    :title="startAuditTitle(item.nodeName)"
                    :mustChoose="true"
                    :loadLast="{show:false}"
                >
                    <user-selected-item
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
                    </user-selected-item>
                </user-selected-group>
            </div>

            <!--处理人范围选人弹窗-->
            <user-selected-ranglist v-if="FlowAuditUserBoxShow"
                :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
                :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
                :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
                :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
                :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
                :checked="FlowAuditUserIds(appointUserIndex)"
                @FlowAuditUserResult="FlowAuditUserResult">
            </user-selected-ranglist>

            <!--选择节点处理人 弹窗-->
            <flow-approve-dialog v-if="flowApproveDialogShow"
                @showPersonList="showPersonList"
                @saveNodeAuditUserJson="commitTask"
                agent='contract'
            ></flow-approve-dialog>

            <!--公共选人组件-->
            <user-select v-if="selectConfig.show"
                :selectconfig="selectConfig"
            ></user-select>

            <!--选人组件-->
            <user-add
                :userselect="dataBase.selectConfig"
                @selectPerson="selectPerson"
                @confirmPick="confirmPick"
            ></user-add>

            <!-- 通知相关人 -->
            <div class="qw-client_inform">
                <div class="qwui-inform_text">
                    <span class="qw-bar_text">通知相关人</span>
                    <span class="qwui-user_cell_switch">
                        <input type="checkbox" class="qwui-user_cell_input" @click="getLastPick">
                    </span>
                </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="footer_btn_wrap">
                <qwui-button
                    v-if="!contractId || isDraft"
                    type="default"
                    text="保存草稿"
                    @buttonClick="saveContract('draft')"
                ></qwui-button>
                <qwui-button
                    type="primary"
                    text="保存"
                    @buttonClick="saveContract"
                ></qwui-button>
            </div>
        </div>
        <contract-tree
            v-if="showTree"
            @loadTreeData="loadTreeData"
            @closeTree="closeTree"
            @selectTree="selectTree"
            @treeLoadMore="treeLoadMore"
            @handleSearch="handleSearch"
            :options="treeOptions"
            :config="treeConfig"
            :treeSelectVal="treeSelectVal"
            :searchConfig="searchConfig"
            :showNoTips="showNoTips"
            :checkConfirm="treeType"
        ></contract-tree>
        <user-select
            :selectconfig="dataBase.selectConfig"
            :closeAllTab="true"
            :closeGroup="true"
            :closeDept="true"
            :tabActive="'user'"
            :userSelectType="''"
            v-if="showSignatory"
        ></user-select>
        <!--选择人员-->
        <user-select
            :selectconfig="dataBase.selectConfig"
            :tabActive="'user'"
            :userSelectType="'onlyUser'"
            v-if="dataBase.selectConfig.show"
        ></user-select>
    </div>
</template>
<script>
import AddImg from '@/components/add/add_img';
import AddFile from '@/components/add/add_file';
import userAdd from '@/components/add/user_select_build';
import QwuiButton from '@/components/base/button/button';
import listAvator from '@/assets/images/crm/ic_crm_ctype.png';
import UserSelect from '@/components/base/user_or_dept_select';
import QwFlowList from "@/components/flow/flowList";
import UserSelectedItem from '@/components/base/userOrDeptSelect/user_selected';
import UserSelectedGroup from '@/components/base/userOrDeptSelect/user_selected_group';
import UserSelectedRanglist from '@/components/base/userOrDeptSelect/user_selected_ranglist';
import FlowApproveDialog from '@/components/flow/flowApproveDialog';
import CrmOperateItem from '../../base/CrmOperateItem';
import ContractTree from '../ContractTree/ContractTree';
import {
            getContractStatus,
            searchContractType,
            addUserTo,
            searchClient,
            searchBusiness,
            searchClientSignatory,
            getFieldData,
            getOldGivenList,
            saveContract,
            updateContract,
            getContractDetail,
            getCustomContract,
            getContractTypePerson,
            getClientInfo
        } from '../../../api/contract/getData';
import {
            searchFlowListFun,
            findBranchFlowNextNodeInfoFun,
            settingAuditTitle,
            stringUserIds,
            isCheckFlowUserConfirm
        } from '@/components/flow/getAuditFlow'
import { mapState, mapGetters, mapMutations, mapActions} from 'vuex';
// 引入公共方法
import { formatMoney, formatPercentage } from '../../../utils/index';

const CONTRACT_AMOUNT_IDX = 3;  // 合同金额索引
const CONTRACT_STATUS_IDX = 0;  // 合同状态索引
const OUR_SIGNATORYS_IDX = 4;  // 我方签约人索引
const CLIENT_NAME_IDX = 1;  // 所属客户索引
const CONTRACT_TYPE_IDX = 0;  // 合同类型索引
const CONTRACT_TITLE_IDX = 0;  // 合同标题索引
const BELONG_BUSINESS_IDX = 2;  // 所属商机索引
const CLIENT_SIGNATORYS_IDX = 5;  // 客户签约人索引

export default {
    name: 'ContractOperate',
    components: {
        CrmOperateItem,
        AddImg,
        AddFile,
        userAdd,
        QwuiButton,
        ContractTree,
        UserSelect,
        QwFlowList,
        UserSelectedItem,
        UserSelectedGroup,
        UserSelectedRanglist,
        FlowApproveDialog
    },
    data () {
        return {
            dataBase: dataBase,
            contractConfig: {  // 固定字段和自定义字段配置
                group1: [
                    {
                        type: 'input',
                        optionName: '合同类型',
                        paramsName: '合同类型',
                        editName: 'typeName',
                        placeholder: '请选择合同类型',
                        isMust: 1,
                        maxLength: '100',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.typeName',
                        showMask: true,
                        showArrow: true,
                        clickEvent: this.selectContractType
                    },
                ],
                group2: [
                    {
                        type: 'textarea',
                        optionName: '标题',
                        paramsName: '合同标题',
                        editName: 'title',
                        placeholder: '',
                        isMust: 1,
                        maxLength: '200',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.title'
                    },
                    {
                        type: 'input',
                        optionName: '所属客户',
                        paramsName: '所属客户',
                        editName: 'clientName',
                        placeholder: '请输入',
                        isMust: 0,
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.clientName',
                        iconEvent: this.selectClient,
                        isSlot: true
                    },
                    {
                        type: 'input',
                        optionName: '所属商机',
                        paramsName: '所属商机',
                        editName: 'businessName',
                        placeholder: '请输入',
                        isMust: 0,
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.businessName',
                        iconEvent: this.selectBusiness,
                        isSlot: true
                    },
                    {
                        type: 'input',
                        optionName: '合同金额 (元)',
                        paramsName: '合同金额',
                        editName: 'nonPaymentAmount',
                        placeholder: '请输入',
                        isMust: 1,
                        maxLength: '13',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.contractAmount',
                        changeCallBack: this.contractAmountChange
                    },
                    {
                        type: 'dateTime',
                        optionName: '开始日期',
                        paramsName: '开始日期',
                        editName: 'startTime',
                        isMust: 1,
                        status: true,
                        value: '',
                        key: 'tbCrmContractInfoPO.startTime',
                        format: 'YYYY-MM-DD'
                    },
                    {
                        type: 'dateTime',
                        optionName: '结束日期',
                        paramsName: '结束日期',
                        editName: 'endTime',
                        isMust: 1,
                        status: true,
                        value: '',
                        key: 'tbCrmContractInfoPO.endTime',
                        format: 'YYYY-MM-DD'
                    },
                ],
                group3: [
                    {
                        type: 'select',
                        optionName: '状态',
                        paramsName: '合同状态',
                        editName: 'contractStatus',
                        isMust: 1,
                        value: '',
                        status: true,
                        key: 'tbCrmContractInfoPO.contractStatus',
                        list: []
                    },
                ],
                group4: [
                    {
                        type: 'select',
                        optionName: '付款方式',
                        paramsName: '付款方式',
                        editName: 'payment',
                        isMust: 1,
                        value: '',
                        status: true,
                        key: 'tbCrmContractInfoPO.payment',
                        list: [
                            {id: '0', name: '支票'},
                            {id: '1', name: '现金'},
                            {id: '2', name: '邮政汇款'},
                            {id: '3', name: '电汇'},
                            {id: '4', name: '网上转账'},
                            {id: '5', name: '支付宝'},
                            {id: '6', name: '微信支付'},
                            {id: '7', name: '刷卡'},
                            {id: '8', name: '其他'},
                        ]
                    },
                    {
                        type: 'input',
                        optionName: '合同编码',
                        paramsName: '合同编码',
                        editName: 'contractCode',
                        placeholder: '请输入',
                        isMust: 0,
                        maxLength: '35',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.contractCode',
                    },
                    {
                        type: 'textarea',
                        optionName: '合同正文',
                        paramsName: '合同正文',
                        editName: 'content',
                        placeholder: '请输入',
                        isMust: 0,
                        maxLength: '60000',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.content',
                        isUseUeditor:false,
                        moreFunctions:[]
                    },
                    {
                        type: 'dateTime',
                        optionName: '签约日期',
                        paramsName: '签约日期',
                        editName: 'deelDate',
                        isMust: 1,
                        status: true,
                        value: '',
                        key: 'tbCrmContractInfoPO.deelDate',
                        format: 'YYYY-MM-DD'
                    },
                    {
                        type: 'input',
                        optionName: '我方签约人',
                        paramsName: '我方签约人',
                        placeholder: '请选择',
                        isMust: 0,
                        value:'',
                        status: true,
                        key: 'ourSignatorys',
                        showMask: true,
                        showArrow: true,
                        clickEvent: this.selectOwnerSignatory
                    },
                    {
                        type: 'input',
                        optionName: '客户签约人',
                        paramsName: '客户签约人',
                        editName: 'signatory',
                        placeholder: '请输入',
                        isMust: 0,
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.signatory',
                        iconEvent: this.selectClientSignatory,
                        isSlot: true
                    },
                    {
                        type: 'textarea',
                        optionName: '备注',
                        paramsName: '备注',
                        editName: 'remark',
                        isMust: 0,
                        maxLength: '2000',
                        placeholder: '请输入',
                        value:'',
                        status: true,
                        key: 'tbCrmContractInfoPO.remark',
                    },
                ]
            },
            customField: [],  // 自定义字段信息
            add_nav: {  //数据详情头部信息
                title:"",
                content:"",
            },
            imgUpload: {  // 传入图片组件的详细数据
                picList: [],
            },
            fileUpload: {  // 传入附件组件的详细数据
                mediaList: [],
                url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
            },
            showTree: false,  // 是否显示树列表
            treeType: '',  // 树列表数据类型
            treeOptions: [],  // 树列表数据
            page: 1,  // 树列表页数
            hasMore: false,  // 是否有更多数据
            lockRoll: false,  // 是否能滚动
            treeConfig: {},  // 树列表配置
            treeSelectVal: '',
            params: {  // 提交的数据项
                'tbCrmContractInfoPO.isFree': '',
                'flowChioseNodeAuditUserJson': '',
                'itemJson': '',
                'tbCrmContractInfoPO.typeId': '',
                'tbCrmContractInfoPO.typeName': '',
                'tbCrmContractInfoPO.title': '',
                'tbCrmContractInfoPO.clientId': '',
                'tbCrmContractInfoPO.clientName': '',
                'tbCrmContractInfoPO.businessId': '',
                'tbCrmContractInfoPO.businessName': '',
                'tbCrmContractInfoPO.contractAmount': '',
                'tbCrmContractInfoPO.startTime': '',
                'tbCrmContractInfoPO.endTime': '',
                'tbCrmContractInfoPO.contractStatus': '',
                'tbCrmContractInfoPO.payment': '',
                'tbCrmContractInfoPO.contractCode': '',
                'tbCrmContractInfoPO.content': '',
                'tbCrmContractInfoPO.deelDate': '',
                'ourSignatorys': '',
                'signatoryIds': '',
                'tbCrmContractInfoPO.signatoryId': '',
                'tbCrmContractInfoPO.signatory': '',
                'tbCrmContractInfoPO.remark': '',
                'mediaIds': '',
                'flowId': '',
                'flowDpId': '',
                'nextNodeId': '',
                'currentNodeId': '',
                'searchValue.field_contractType': '',
                'searchValue.field_contractAmount': '',
                'toSelectId': 0,
                'incharges': '',
                'ccSelectId': 0,
                'relatives': '',
                'submitType': 0,
                'tbCrmContractInfoPO.submitStatus': 1
            },
            typeSelectVal: [],  // 合同状态已选择数据
            clientSelectVal: [],  // 所属客户已选择数据
            businessSelectVal: [],  // 所属商机已选择数据
            clientSignatoryVal: [],  // 客户签约人已选择数据
            clientId: '',  // 所属客户id
            searchConfig: {},  // 树列表搜索配置
            keyword: '',  // 搜索关键字
            showSignatory: false,  // 是否显示我方签约人选人列表
            isUpLoadMust: false,  // 附件是否必填
            showUpLoad: true,  // 是否显示附件
            advise: false,  // 是否通知相关人
            moneyAmount: '',  // 合同金额数字
            contractId: '',  // 合同ID
            showNoTips: false,  // 是否显示无记录提示
            isFree: '',  // 流程类型
            isDraft: false,  // 是否草稿
            isAuditUser: false,  // 如果当前人为审批人,不能改合同类型、合同相关人、负责人，以及合同审批人
            // oldRouter: '',  // 记录进入新增编辑页路由
            // isUsed: true, // 判断是否记录上一次的路由
            hasType: true  // 是否存在合同类型
        }
    },
    computed: {
        ...mapState({
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
            "FlowAuditUserIds",  // 已选择的处理人id
            'getIsCheckFlowUserConfirmParams',  //检验流程字段
            'findBranchFlowNextNodeInfoParams',  //查找下一节点信息的入参
        ]),

        // 全部字段信息
        fieldMsg () {
            let { group1, group2, group3, group4 } = this.contractConfig;
            return [...group1, ...group2, ...group3, ...group4];
        }
    },
    // beforeRouteEnter (to, from, next) {
    //     next(vm => {
    //         vm.oldRouter = from.name;
    //     })
    // },
    // beforeRouteLeave (to, from, next) {
    //     // 启用的话就跳转到上一次路由
    //     if(this.isUsed){
    //         if(to.name === this.oldRouter){
    //             next();
    //         }
    //         else{
    //             next({name: this.oldRouter});
    //         }
    //     }
    //     else{
    //         next();
    //     }
    // },
    created () {
        this.init();
    },
  activated() {
   let _funName = {
        belongClient:"selectClient",
        belongBusiness:"selectBusiness",
        clientSignatory:"selectClientSignatory",
      }[this.treeType]
      if(_funName&&this.showTree){
        this[_funName]();
        this.loadTreeData();
      }
  },
    beforeDestroy () {
        window.dataBase.wxqyh_uploadfile.agent = 'crm';
    },
    methods: {
        ...mapActions('list',[
            'setCacheArray',
            'delCacheArray'
        ]),

        ...mapMutations([
            "removeFlowAuditUser",        // 删除处理人
            'saveChooseFlowUserJson',     // 自由选择确定保存处理人信息
            "updateUserSelectedState",    //更新vuex状态数据
            "updateUserSelectConfirm",    // 更新选人配置
        ]),

        ...mapActions([
            "updateFlowUserSelected",     // 更新已选处理人
            'updateFlowCommitTaskParams', //更新提交数据json
            "getNodeListInfo", //获取节点选择信息
        ]),

        // 获取是否存在合同自定义类型
        getCustomContract () {
            getCustomContract().then(res => {
                if(res.code == '0'){
                    let { hasType } = res.data;

                    // 若没有合同自定义类型，则显示提示
                    if(!hasType){
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].isSlot = true;
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].showArrow = false;
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].placeholder = '';
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].clickEvent = null;
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 合同金额改变的回调函数
        contractAmountChange () {
            // 转换输入的内容
            let val = this.contractConfig.group2[CONTRACT_AMOUNT_IDX].value.replace(/[^\d.]/g,'');
            this.moneyAmount = val;
            val = val? formatMoney(val) : '';

            let newObj = Object.assign({}, this.contractConfig.group2[CONTRACT_AMOUNT_IDX], {value: val});
            this.$set(this.contractConfig.group2, CONTRACT_AMOUNT_IDX, newObj);
        },

        // 获取合同状态
        getContractStatus () {
            getContractStatus().then(res => {
                if(res.code == '0'){
                    let list = res.data.list;
                    let arr = [];
                    list.map((item, idx) => {
                        // 只有启用才显示
                        if(item.isShow == 1){
                            let obj = {
                                id: item.statusCode,
                                name: item.name
                            }
                            arr.push(obj);
                        }
                    });
                    this.contractConfig.group3[CONTRACT_STATUS_IDX].list = arr;
                }
            })
        },

        // 初始化
        init () {
            let params = {
                userId: window._.userId
            }
            let { contractId, clientId, agentCode } = this.$route.query;

            window.dataBase.wxqyh_uploadfile.agent = agentCode === 'contract'? 'contract' : 'crm';

            this.contractId = contractId || '';
            this.isAuditUser = this.$route.query.isAuditUser == '1'? true : false;

            // 初始化我方签约人选人数据
            this.dataBase.selectConfig.selectList.signatory = {
                "title":"",
                "selectType": "user",
                "userName": "relatives",
                "userSelected": [],
                "deptSelected":[],
                "deptSelectedShow": false,
                "callBack": {
                    "confirm": null,
                },
            }

            this.getCustomContract();
            this.resetSelectPerson();
            this.getContractStatus();
            this.getFieldData();

            // 新增默认当前用户为负责人
            if(!this.contractId){
                addUserTo(params).then(res => {
                    let { user } = res.data;
                    this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(user);
                    this.params.incharges = params.userId;
                })
                this.contractConfig.group4[2].moreFunctions = [{name:"summaryContract"}]
            }

            // 如果存在clientId，赋值所属客户
            if(clientId){
                let obj = {
                    id: clientId
                }
                this.contractConfig.group2[CLIENT_NAME_IDX].isSlot = false;
                this.contractConfig.group2[CLIENT_NAME_IDX].readonly = true;

                getClientInfo(obj).then(res => {
                    if(res.code == '0'){
                        let clientName = res.data.client.clientName;
                        this.contractConfig.group2[CLIENT_NAME_IDX].value = this.params['tbCrmContractInfoPO.clientName'] = clientName;
                        this.params['tbCrmContractInfoPO.clientId'] = this.clientId = clientId;
                    }
                    else{
                        _.alert('提示', res.desc);
                    }
                });
            }
        },

        //改变是否使用富文本
        changeUeditor:function (val) {
            this.$set(this.contractConfig.group4[2],'isUseUeditor',val)
        },

        // 图片参数
        showMsgFromImgDetail (imgurl) {
            this.params['imageUrls'] = imgurl.join(',');
        },

        // 附件参数
        showMsgFromFileDetail (mediaId) {
            this.params['mediaIds'] = mediaId.join(',');
        },

        // 重置选人组件
        resetSelectPerson(){
            this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
            this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
            this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
            this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
            this.dataBase.selectConfig.selectList["toPersonList"].title="负责人(可查看/修改)";
            this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人(可查看)";
            this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次"};
            this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
            this.dataBase.selectConfig.selectList["toPersonList"].userSelected=[];
            this.dataBase.selectConfig.selectList["signatory"].callBack.confirm = this.confirmUser;
            this.dataBase.selectConfig.selectList["signatory"].callBack.close = this.cancelUser;
        },

        // 确定人员返回的数据,把id传至后台
        selectPerson(el,obj){
            if(el == 'toPersonList'){
                this.params.incharges = obj.user.idStr;
            }
            if(el == 'ccPersonList'){
                this.params.relatives = obj.user.idStr;
            }
        },

        // 负责人相关人加载上一次
        confirmPick(el, isGet){
            let listType = el == 'toPersonList'? 'toPersonList' : 'ccPersonList';
            let userSelected = this.dataBase.selectConfig.selectList[listType].userSelected;
            let obj = {
                type: el == 'toPersonList'? 0 : 1
            }

            // 如果加载上一次，则请求接口
            if(isGet){
                getOldGivenList(obj).then(res => {
                    userSelected.splice(0,userSelected.length);
                    userSelected.push.apply(userSelected, res.data.ccOrTolist);
                });
            }else{
                userSelected.splice(0,userSelected.length);
            }
        },

        // 是否通知相关人
        getLastPick () {
            this.advise = !this.advise;
            this.params['submitType'] = this.advise? 1 : 0;
        },

        // 重置树列表数据
        resetTreeData () {
            this.treeOptions = [];
            this.page = 1;
            this.keyWord = '';
            this.showNoTips = false;
        },

        // 选择合同状态
        selectContractType () {
            this.searchConfig = {};
            this.resetTreeData();
            this.treeConfig = {
                id: 'id',
                title: 'typeName',
                checkType: 'radio',
                headPic:''
            }
            this.treeType = 'contractType';
            this.treeSelectVal = this.typeSelectVal;
            this.openTree();
        },

        // 选择所属客户
        selectClient () {
            this.resetTreeData();
            this.treeConfig = {
                id: 'id',
                title: 'clientName',
                checkType: 'radio',
                headPic: listAvator,
                subTitle: 'clientCode'
            }
            this.treeType = 'belongClient';
            this.treeSelectVal = this.clientSelectVal;
            this.searchConfig = {
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction: {
                    show: true,
                    option: [
                        {
                            name:'客户名称',
                            placeholder:'按客户名称搜索',
                            value: 'name'
                        },
                        {
                            name:'联系电话',
                            placeholder:'按联系电话搜索',
                            value: 'phone'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            }
            this.openTree();
        },

        // 选择所属商机
        selectBusiness () {
            if(this.clientId){
                this.searchConfig = {};
                this.resetTreeData();
                this.treeConfig = {
                    id: 'id',
                    title: 'title',
                    checkType: 'radio',
                    headPic: '',
                }
                this.treeType = 'belongBusiness';
                this.treeSelectVal = this.businessSelectVal;
                this.openTree();
            }
            else{
                _.alert('提示', '请选择所属客户');
            }
        },

        // 选择客户签约人
        selectClientSignatory () {
            if(this.clientId){
                this.searchConfig = {};
                this.resetTreeData();
                this.treeConfig = {
                    id: 'id',
                    title: 'contactsName',
                    checkType: 'checkbox',
                    headPic: '',
                }
                this.treeType = 'clientSignatory';
                this.treeSelectVal = this.clientSignatoryVal;
                this.openTree();
            }
            else{
                _.alert('提示', '请选择所属客户');
            }
        },

        // 是否锁住滚动
        lockScroll (islock) {
            document.body.style.overflow = islock? 'hidden' : '';
            document.body.style.height = islock? '100%' : '';
        },

        // 确定选择我方签约人
        confirmUser (el, obj) {
            let { data } = obj.user;
            let nameArr = [], idArr = [];

            data.map((item,idx) => {
                nameArr.push(item.personName);
                idArr.push(item.userId);
            });

            // 我方签约人赋值
            this.contractConfig.group4[OUR_SIGNATORYS_IDX].value = nameArr.join(',');
            this.params['signatoryIds'] = idArr.join(',');
            this.cancelUser();
        },

        // 取消选择我方签约人
        cancelUser () {
            this.showSignatory = false;
            this.lockScroll(false);
        },

        // 选择我方签约人
        selectOwnerSignatory () {
            this.dataBase.selectConfig.signIndex = 'signatory';
            this.showSignatory = true;
            this.lockScroll(true);
        },

        // 加载树列表回调函数
        loadTreeData (val) {
            if(this.treeType === 'contractType'){
                this.searchContractType(this.keyWord);
            }
            else if(this.treeType === 'belongClient'){
                // 根据类型进行搜索
                val === 'phone'? this.searchClient(this.keyWord, 2) : this.searchClient(this.keyWord, '');
            }
            else if(this.treeType === 'belongBusiness'){
                this.searchBusiness(this.keyWord);
            }
            else if(this.treeType === 'clientSignatory'){
                this.searchClientSignatory(this.keyWord);
            }
        },

        // 获取合同状态列表
        searchContractType (keyWord) {
            let obj = {
                keyWord: keyWord || '',
                page: this.page,
                pageSize: 15
            }
            this.lockRoll = true;
            searchContractType(obj).then(res => {
                this.deelData(res);
            });
        },

        // 获取所属客户
        searchClient (keyword, typeId) {
            let obj = {
                keyWord: keyword || '',
                typeId: typeId || '',
                userId: '',
                ctype: 2,
                page: this.page,
                crmTypes: '',
                crmUserId: '',
                agentcode: 'crm',
                workInfo: '',
                pageSize: 15
            }
            this.lockRoll = true;
            searchClient(obj).then(res => {
                this.deelData(res);
            })
        },

        // 获取所属商机
        searchBusiness (keyWord) {
            let obj = {
                selectClientId: this.clientId,
                keyWord: keyWord || '',
                page: this.page,
                pageSize: 15
            }
            this.lockRoll = true;
            searchBusiness(obj).then(res => {
                this.deelData(res);
            });
        },

        // 获取客户签约人
        searchClientSignatory (keyWord) {
            let obj = {
                selectClientId: this.clientId,
                keyWord: keyWord || '',
                page: this.page,
                pageSize: 15
            }
            this.lockRoll = true;
            searchClientSignatory(obj).then(res => {
                this.deelData(res);
            });
        },

        // 处理数据
        deelData (res){
            if(res.code == '0'){
                let { currPage, maxPage, totalRows } = res.data;
                let list = res.data.pageData;

                if(list && list.length > 0){
                    this.treeOptions = this.treeOptions.concat(list);
                }
                this.lockRoll = false;
                this.hasMore = currPage >= maxPage? false : true;
                this.showNoTips = totalRows > 0? false : true;
            }
            else{
                _.alert('提示', res.desc);
            }
        },

        // 关闭树列表
        closeTree () {
            this.lockScroll(false);
            this.showTree = false;
        },

        // 打开树列表
        openTree () {
            this.lockScroll(true);
            this.showTree = true;
        },

        // 选择树列表项
        selectTree (data, selectVal) {
            if(this.treeType === 'contractType'){  // 合同类型
                let context = this.contractConfig.group2[CLIENT_NAME_IDX].value? `_${this.contractConfig.group2[CLIENT_NAME_IDX].value}` : '';

                // 对已选择的数组、传给后台对应的字段复制
                this.typeSelectVal = selectVal;
                this.params['tbCrmContractInfoPO.typeId'] = data[0].id;
                this.contractConfig.group1[CONTRACT_TYPE_IDX].value = data[0].typeName;
                this.params['tbCrmContractInfoPO.isFree'] = this.isFree = data[0].isFree;
                // 拼接标题
                this.contractConfig.group2[CONTRACT_TITLE_IDX].value = `${context}_${data[0].typeName}`;
                this.hasType = true;

                // 流程相关
                this.deelFlow(data[0].id, true);
            }
            else if(this.treeType === 'belongClient'){  // 所属客户
                let oldClientId = this.clientId;
                let context = this.contractConfig.group1[CONTRACT_TYPE_IDX].value? `_${this.contractConfig.group1[CONTRACT_TYPE_IDX].value}` : '';

                // 对已选择的数组、传给后台对应的字段赋值
                this.clientSelectVal = selectVal;
                this.clientId = this.params['tbCrmContractInfoPO.clientId'] = data[0].id || '';
                this.contractConfig.group2[CLIENT_NAME_IDX].value = data[0].clientName || '';
                // 拼接标题
                this.contractConfig.group2[CONTRACT_TITLE_IDX].value = `_${data[0].clientName || ''}${context}`;

                // 重置所属商机
                if(oldClientId !== this.clientId){
                    // 重置所属商机
                    this.businessSelectVal = [];
                    this.contractConfig.group2[BELONG_BUSINESS_IDX].value = '';
                    this.params['tbCrmContractInfoPO.businessId'] = '';

                    // 重置客户签约人
                    this.clientSignatoryVal = [];
                    this.contractConfig.group4[CLIENT_SIGNATORYS_IDX].value = '';
                    this.params['tbCrmContractInfoPO.signatoryId'] = '';
                }
            }
            else if(this.treeType === 'belongBusiness'){  // 所属商机
                // 对已选择的数组、传给后台对应的字段复制
                this.businessSelectVal = selectVal;
                this.contractConfig.group2[BELONG_BUSINESS_IDX].value = data[0].title;
                this.params['tbCrmContractInfoPO.businessId'] = data[0].id;
            }
            else if(this.treeType === 'clientSignatory'){  // 客户签约人
                let names = [], ids = [];
                // 对已选择的数组、传给后台对应的字段复制
                this.clientSignatoryVal = selectVal;

                data.map((item,idx) => {
                    names.push(item.contactsName);
                    ids.push(item.id);
                });
                this.contractConfig.group4[CLIENT_SIGNATORYS_IDX].value = names.join(',');
                this.params['tbCrmContractInfoPO.signatoryId'] = ids.join(',');
            }
        },

        // 加载更多树列表数据
        treeLoadMore () {
            if(this.hasMore && !this.lockRoll){
                this.page++;
                this.loadTreeData();
            }
        },

        // 树列表搜索
        handleSearch (keyWord, val) {
            this.resetTreeData();
            this.keyWord = keyWord;
            this.loadTreeData(val);
        },

        // 获取合同字段数据
        getFieldData () {
            getFieldData().then(res => {
                if(res.code == '0'){
                    let basicList = res.data.basicList;
                    let customList = res.data.list;

                    // 基础字段
                    if(basicList && basicList.length > 0){
                        basicList.map(basicItem => {
                            if(basicItem.optionName === '附件'){
                                this.isUpLoadMust = basicItem.isMust == '1'? true : false;
                                this.showUpLoad = basicItem.status == '1'? true : false;
                            }

                            // 处理基础字段信息
                            this.fieldMsg.map(configItem => {
                                if(basicItem.optionName === configItem.paramsName){
                                    configItem.isMust = basicItem.isMust;
                                    configItem.status = basicItem.status == '1'? true : false;
                                }
                            });
                        })
                    }

                    // 自定义字段
                    if(customList && customList.length > 0){
                        // 自定义字段类型
                        let typeArr = [
                                        {typeName: 'select', length: ''},
                                        {typeName: 'input', length: '200'},
                                        {typeName: 'textarea', length: '2000'},
                                        {typeName: 'phone', length: '200'},
                                        {typeName: 'dateTime', length: ''},
                                        {typeName: 'input', length: '200'},
                                      ];

                        // 处理自定义字段信息
                        customList.map(item => {
                            let list = item.list;
                            let content = list.length > 0? list[0].name : `请输入${item.optionName}`;  // 拼接输入框placeholder
                            let obj = {
                                type: typeArr[Number(item.type)].typeName,
                                optionName: item.optionName,
                                paramsName: item.optionName,
                                isMust: item.isMust,
                                value: '',
                                status: item.status == '1'? true : false,
                                id: item.id,
                                filedType: 'custom',
                                placeholder: content,
                                maxLength: typeArr[Number(item.type)].length
                            }

                            if (item.ext1) {
                                obj = Object.assign(obj, {ext1: item.ext1, changeCallBack: this.numberCheck});
                            }
                            // 处理选择框
                            if(item.type == '0'){
                                let arr = [];

                                // 拼接select的Option
                                list.map(listItem => {
                                    let listObj = {
                                        id: listItem.id,
                                        name: listItem.name
                                    }
                                    arr.push(listObj);
                                });
                                obj.list = arr;
                            }
                            this.contractConfig.group4.push(obj);
                        });
                    }

                    // 若是编辑页面，则请求合同详情数据
                    if(this.contractId){
                        this.getContractDetail();
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 获取合同详情信息
        getContractDetail () {
            let obj = {
                id: this.contractId
            }
            _.showLoading();
            getContractDetail(obj).then(res => {
                _.hideLoading();
                if(res.code == '0'){
                    let { detail, itemList, contractHasType } = res.data;
                    let {
                            signatoryId,
                            signatoryList,
                            contractPicList,
                            mediaList,
                            toPersonList,
                            ccPersonList,
                            isFree,
                            typeId,
                            clientId,
                            businessId,
                            nonPaymentAmount,
                            submitStatus,
                            auditList,
                            isUEditor
                        } = detail;
                    let clientSignator = signatoryId? signatoryId.split(',') : [];
                    let paramsObj = {};

                    // 是否草稿
                    this.isDraft = submitStatus == '1'? false : true;
                    this.hasType = contractHasType;

                    this.changeUeditor(isUEditor ? true : false)

                    // 字段赋值
                    this.fieldMsg.map(item => {
                        if(item.filedType !== 'custom'){  // 固定字段
                            item.value = detail[item.editName];
                        }
                        else{  // 自定义字段
                            if(itemList && itemList.length > 0){
                                itemList.map(listItem => {
                                    if(listItem.fieldId === item.id){
                                        item.customId = listItem.id;
                                        item.value = listItem.fieldValue;
                                    }
                                })
                            }
                        }
                    });

                    this.typeSelectVal = typeId;  // 合同类型id赋值
                    this.clientSelectVal = this.clientId = clientId;  // 所属客户id赋值
                    this.businessSelectVal = businessId;  // 所属商机id赋值
                    this.moneyAmount = nonPaymentAmount;  // 合同金额赋值
                    this.isFree = isFree;  // 流程类型

                    // 客户签约人id赋值
                    clientSignator.map(item => {
                        this.clientSignatoryVal.push(item);
                    });

                    // 我方签约人数据赋值
                    let idsArr = [];
                    if(signatoryList && signatoryList.length > 0){
                        let nameArr = [];
                        signatoryList.map(item => {
                            nameArr.push(item.personName);
                            idsArr.push(item.userId);
                        });
                        this.dataBase.selectConfig.selectList["signatory"].userSelected = [...signatoryList];
                        this.contractConfig.group4[OUR_SIGNATORYS_IDX].value = nameArr.join(',');
                    }

                    // 流程赋值
                    if(this.isAuditUser){
                        // 合同状态不能点击
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].clickEvent = null;
                        this.contractConfig.group1[CONTRACT_TYPE_IDX].showArrow = false;

                        // 负责人相关人不能选择
                        this.dataBase.selectConfig.selectList["toPersonList"].loadLast = {show: false};
                        this.dataBase.selectConfig.selectList["ccPersonList"].loadLast = {show: false};
                        this.dataBase.selectConfig.selectList["toPersonList"].isOptional= false;
                        this.dataBase.selectConfig.selectList["ccPersonList"].isOptional= false;
                    }
                    else{  // 退审后才对流程相关赋值
                        this.$store.commit('updateUserSelected', auditList);
                        this.deelFlow(typeId, '', () => {
                            // 相关人赋值
                            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [];
                            ccPersonList.map(item => {
                                this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
                            });
                        });
                    }

                    // 照片赋值
                    contractPicList.map(item => {
                        this.imgUpload.picList.push(item);
                    });

                    // 附件赋值
                    mediaList.map(item => {
                        this.fileUpload.mediaList.push(item);
                    });

                    // 负责人赋值
                    this.dataBase.selectConfig.selectList["toPersonList"].userSelected = [];
                    toPersonList.map(item => {
                        this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(item);
                    });

                    // 相关人赋值
                    this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [];
                    ccPersonList.map(item => {
                        this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
                    });

                    // 传给后台字段赋值
                    paramsObj = {
                        'tbCrmContractInfoPO.isFree': !this.isAuditUser? isFree : '',
                        'tbCrmContractInfoPO.typeId': typeId,
                        'tbCrmContractInfoPO.clientId': clientId,
                        'tbCrmContractInfoPO.businessId': businessId,
                        'tbCrmContractInfoPO.signatoryId': signatoryId,
                        'signatoryIds': idsArr.length > 0? idsArr.join(',') : '',
                        'searchValue.field_contractType': this.contractConfig.group1[CONTRACT_TYPE_IDX].value
                    }
                    this.params = Object.assign({}, this.params, paramsObj);
                }
                else{
                    _.alert('提示', res.desc,
                        {
                            primaryBtn:{
                                name: "i18n.confirm",
                                callBack: () => {
                                    this.$router.back(-1);
                                }
                            },
                            defaultBtn:{
                                name: "",
                                callBack: null
                            },
                        }
                    );
                }
            });
        },

        // 保存合同
        saveContract (type) {
            let arr = [];
            let jsonObj = {};
            let isPass = true;  // 是否通过验证

            // 组装传给后台的数据
            for(let i=0;i<this.fieldMsg.length;i++){
                // 富文本赋值
                if(this.fieldMsg[i].key == 'tbCrmContractInfoPO.content'){
                    if(this.contractConfig.group4[2].isUseUeditor){
                        this.fieldMsg[i].value = this.$refs.group4[2].getUEContent()
                    }
                }
                // 必填且值为空弹出提示
                if(type !== 'draft'){
                    if(this.fieldMsg[i].isMust == '1' && this.fieldMsg[i].value === ''){
                        isPass = false;
                        _.alert('提示', `${this.fieldMsg[i].optionName}不能为空`);
                        break;
                    }
                }

                // 拼接json
                if(this.fieldMsg[i].filedType && this.fieldMsg[i].filedType === 'custom'){
                    let obj = {
                        fieldId: this.fieldMsg[i].id,
                        fieldName: this.fieldMsg[i].optionName,
                        fieldValue: this.fieldMsg[i].value,
                        id: this.fieldMsg[i].customId || ''
                    }

                    if (this.fieldMsg[i].ext1) {
                        if (this.fieldMsg[i].value && this.fieldMsg[i].value.indexOf(',') !== -1) {
                            obj.fieldValue = this.fieldMsg[i].value.split(',').join('');
                        } else {
                            obj.fieldValue = this.fieldMsg[i].value;
                        }
                    }
                    // 将百分比的数值类型处理成 数字+% 的形式
                    if (this.fieldMsg[i].ext1 && this.fieldMsg[i].ext1 === '3') {
                        obj.fieldValue = formatPercentage(obj.fieldValue);
                    }


                    arr.push(obj);
                }
                else{
                    this.params[this.fieldMsg[i].key] = this.fieldMsg[i].value;
                }
            }
            jsonObj.list = arr;
            this.params['itemJson'] = JSON.stringify(jsonObj);

            if(!isPass) return;

            // 判断结束时间是否早于开始时间
            let startTime = new Date(this.params['tbCrmContractInfoPO.startTime']).getTime();
            let endTime = new Date(this.params['tbCrmContractInfoPO.endTime']).getTime()
            if(startTime > endTime){
                _.alert('提示', '结束日期不能早于开始日期');
                return;
            }

            // 若附件为必填，判断附近是否为空
            if(this.isUpLoadMust && !this.params['mediaIds']){
                _.alert('提示', '附件不能为空');
                return;
            }

            // 处理负责人和相关人
            let incharge = [], relative = [];
            let toArr = this.dataBase.selectConfig.selectList['toPersonList'].userSelected;
            let ccArr = this.dataBase.selectConfig.selectList['ccPersonList'].userSelected;

            // 获取负责人
            toArr.map(item => {
                incharge.push(item.userId);
            });

            // 获取相关人
            ccArr.map(item => {
                relative.push(item.userId);
            })

            this.params['incharges'] = incharge.join(',');
            this.params['relatives'] = relative.join(',');
            this.params['tbCrmContractInfoPO.contractAmount'] = this.moneyAmount;
            this.params['tbCrmContractInfoPO.submitStatus'] = type !== 'draft'? 1 : 0;

            // 如果是分支流程，则传入这2个值
            if(this.isFree == '3'){
                this.params['searchValue.field_contractType'] = this.contractConfig.group1[CONTRACT_TYPE_IDX].value;
                this.params['searchValue.field_contractAmount'] = this.moneyAmount;
            }

            // 有流程才进入检验
            if(this.isFree != '4' && !this.isAuditUser && type !== 'draft'){
                //检验流程字段是否填写
                isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams,(type) => {
                    //处理人没选,显示选人弹窗
                    if(type === 'flowApproveDialogShow'){
                        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
                    }
                    else if(type === 'findBranchFlowNextNode'){
                        let obj = {
                            initRefId: '',
                            templateRefId: this.templateRefId,
                            currentNodeId: this.currentNodeId,
                            'searchValue.field_contractType': this.contractConfig.group1[CONTRACT_TYPE_IDX].value,
                            'searchValue.field_contractAmount': this.moneyAmount
                        }

                        //查找下一节点信息
                        findBranchFlowNextNodeInfoFun(obj,(result) => {
                            this.$store.commit('updateFlowAuditUserData', result);
                            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
                            //更新下拉选择节点名称
                            this.$store.commit('updateChooseNodeName')
                        })
                    }
                    else{
                        //验证成功
                        this.commitTask();
                    }
                });
            }
            else{  // 无需审批
                this.commitTask();
            }

        },

        // 提交数据
        commitTask () {
            let approverList = this.selectConfig.selectList.user.userSelected;  // 审批人列表
            let approverId = [];

            this.params['flowId'] = this.flowId;
            this.params['currentNodeId'] = this.currentNodeId;
            this.params['nextNodeId'] = this.nextNodeId;

            // 获取审批人
            if(approverList.length > 0){
                approverList.map(item => {
                    approverId.push(item.userId);
                });
                this.params['inchargeList'] = approverId.join(',');
            }

            if(this.isFree != '1' && this.isFree != '4'){
                //获取流程字段
                this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser});
                this.params['flowChioseNodeAuditUserJson'] = this.commitTaskParams['flowChioseNodeAuditUserJson'];
                this.isFree === 0? this.params['radio_choose'] = this.commitTaskParams['flowId'] : '';
                this.params['chooseFlowUser'] = this.commitTaskParams['chooseFlowUser'];

            }

            // 点击保存草稿或保存
            if(!this.contractId){  // 新增
                this.addContract();
            }
            else{  // 编辑
                this.updateContract();
            }
        },

        // 增加合同
        addContract () {
            _.showLoading('提交中');
            saveContract(this.params).then(res => {
                if(res.code == '0'){
                    // this.isUsed = false;
                    this.delCacheArray('ContractList');
                    if(this.$route.query.from==='select'){
                      this.$route.go(-1);
                    }else{
                      this.params['tbCrmContractInfoPO.submitStatus'] == '0'? 
                      this.$router.replace({path: '/contractList/isread', query: {submitStatus: '0', agentCode: this.$route.query.agentCode}})
                      : this.$router.replace({path: '/contractList/isread', query: {agentCode: this.$route.query.agentCode}});
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
                _.hideLoading();
            });
        },

        // 编辑合同
        updateContract () {
            let updateObj = {
                'tbCrmContractInfoPO.id': this.contractId,
                ...this.params
            }
            _.showLoading('提交中');
            updateContract(updateObj).then(res => {
                if(res.code == '0'){
                  // this.isUsed = false;
                  if(this.$route.query.isFromWaitDealList != 1){ //判断是否从首页待办中进入合同详情后再进入编辑
                    this.delCacheArray('ContractList');
                     if(this.$route.query.from==='select'){
                      this.$route.go(-1);
                    }else{
                      this.params['tbCrmContractInfoPO.submitStatus'] == '0'?
                      this.$router.replace({path: '/contractList/isread', query: {submitStatus: '0', agentCode: this.$route.query.agentCode}})
                      :this.$router.replace({path: '/contractList/isread', query: {agentCode: this.$route.query.agentCode}});
                    }
                  }else{
                    this.delCacheArray('crmIndex'); //清除待办审批列表缓存
                    this.$router.push({path:"/index/waitDeal",query:{fromTab:1}});
                  }
                }
                else{
                    _.alert('提示', res.desc);
                }
                _.hideLoading();
            });
        },

        // 获取合同类型流程模板
        getFlowTempleteList (id) {
            let obj = {
                id,
                agentCode: 'contract',
                isBranchFlow: this.isFree == '3'? true : false
            }
            searchFlowListFun(obj, (result) => {
                //流程接口数据回调
                this.$store.commit('updateSearchFlowListData', result);
            });
        },

        // 获取流程相关人
        getContractTypePerson (id, callBack) {
            let obj = {
                id
            }
            getContractTypePerson(obj).then(res => {
                if(res.code == '0'){
                    let { personList, orgId } = res.data.type;
                    this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [...personList];
                    callBack && callBack();
                    this.updateUserSelectedState({type: "templateRefId", data: `contract${orgId.split('-').join('')}`})
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },

        // 处理流程相关
        deelFlow (id, isSelect, callBack) {
            //重置流程数据
            this.$store.commit('resetFlowData')

            // 更新模板id
            if(this.isFree == '0' || this.isFree == '3'){
                this.updateUserSelectedState({type: "isFree", data: this.isFree.toString()})
                this.getFlowTempleteList(id);
            }
            else{
                this.updateUserSelectedState({type: "isFree", data: '1'})
            }

            // 存在合同类型才获取流程相关人
            if(this.hasType){
                this.getContractTypePerson(id, callBack);
            }
        },

        //设置标题
        startAuditTitle (nodeName) {
            return settingAuditTitle(nodeName, this.isFree.toString());
        },

        //预览个人信息
        showPersonList (title,list,type) {
            console.log("预览")
        },

        // 显示选择处理人弹窗
        FlowAuditUserShowBox (index) {
            this.updateUserSelectedState({type:'appointUserIndex',data:index});

            //显示指定范围选人弹窗
            if(this.FlowAuditUser[index].startAuditList.assignRange){
                this.updateUserSelectedState({type:"FlowAuditUserBoxShow", data: true})
            }
            else{
                //显示自由选处理人时的选人组件界面
                this.updateUserSelectConfirm( { data: this.FlowAuditUser[index].startAuditList.userSelected,
                    callBack: (result) => {
                        this.$store.commit('updateUserSelected',result.user.data)
                    }
                });
            }
        },

        FlowAuditUserResult (payload) {
            this.$store.commit('checkFlowAuditUserType',payload)
            // 如果是多部门，则请求部门负责人
            this.updateFlowUserSelected(payload)
        },

        // 数字校验
        numberCheck(value, item) {
            const { id, ext1 } = item;
            const decamal_reg = /\./g;
            // 第一位不运行输入小数点
            if (value.toString().charAt(0) === '.') {
                value = value.replace('.', '');
            }
            let val = value.replace(/[^\d.]/g,'');
            val = val? formatMoney(val) : '';
            // 1 表示整数 ，2 表示小数 ，3 表示百分比
            if (ext1 === '1') {
                val = val.toString();
                val = val.replace(decamal_reg, '');
            } else {
                val = val.toString();
                if (val.indexOf('.') !== -1) {
                    const num_arr = val.split('.');
                    if (num_arr[1].length > 2) {
                    num_arr[1] = num_arr[1].substring(0, 2);
                    val = num_arr.join('.');
                    }
                }
            }
            for(let i = 0 ; i < this.contractConfig.group4.length; i ++) {
                if(this.contractConfig.group4[i].id === id) {
                    // 拼接 - 号
                    if (this.contractConfig.group4[i].value && this.contractConfig.group4[i].value.charAt(0) === '-') {
                        let first_word = this.contractConfig.group4[i].value.substring(0, 1);
                        val = first_word + val;
                    }
                    // 用nextTick 强制视图更新
                    this.$nextTick(() => {
                        this.$set(this.contractConfig.group4[i], 'value', val);
                    })
                    break;
                }
            }
        }
    }
}
</script>
<style lang="scss">
@import './ContractOperate.scss';
</style>

<style lang="scss" scoped>
.contract_operate{
    height: 100%;
    overflow-y: auto;
}
</style>
