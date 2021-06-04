<template>
  <div class="wrap ">
    <!-- toast顶部 -->
    <div class="qwui-warning" v-if="isWarnShow"><span class="waring-text">{{warnMsg}}</span></div>
    <div class="qwui-client_main" v-show="mainShow">
      <div class="qwui_btn_margin_bottom">
        <!--商机标题 商机内容-->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in nav"
            :item="item"
            :key="idx"
            v-if="item.status"
            v-model="item.value"
            @input="titleInput"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>

        <!-- 所属客户 -->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in belongClientNav"
            :item="item"
            :key="idx"
            v-model="item.value"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>


        <!-- 客户联系人 -->
        <div class="qwui-client_detail" v-if="clientContactShow">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in clientContactNav"
            :addItems="addClientItems"
            :item="item"
            :key="idx"
            v-model="item.value"
            @del="delClientContact"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>

        <!-- 商机合作伙伴 -->
        <div class="qwui-client_detail" v-if="businessPartnerShow">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in businessPartnerNav"
            :addItems="addBusinessItems"
            :item="item"
            :key="idx"
            v-model="item.value"
            @del="delBusinessPartner"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>

        <!-- 竞争对手 -->
        <div class="qwui-client_detail" v-if="competitorShow">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in competitorNav"
            :addItems="addCompetitorItems"
            :item="item"
            :key="idx"
            v-model="item.value"
            @del="delCompetitor"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>

        <!-- 目前所在商机阶段 -->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in businessStageNav"
            :item="item"
            :key="idx"
            v-model="item.value"
            @input="input"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>


        <!-- 商机类别 销售额(元) 结单日期 自定义字段 -->
        <div class="qwui-client_communication">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="item in communicationNav"
            :item="item"
            :key="item.id"
            :editTimeVal="editTimeVal"
            :birthEditTimeVal="birthEditTimeVal"
            v-if="item.status"
            @listenToDate="listenToDate"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar custom_bar">可通过后台启用更多自定义字段</div>
        </div>

        <!-- 上传照片附件 -->
        <div class="qwui-client_attachment">
          <span class="img-text">照片</span>
          <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail"></img_detail>
          <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
        </div>


        <!--选人组件-->
        <user-add :userselect="dataBase.selectConfig" @selectPerson="selectPerson" @confirmPick="confirmPick"></user-add>
        <div class="qw-client_inform">
          <div class="qwui-inform_text">
            <span class="qw-bar_text">通知相关人</span>
            <span class="qwui-user_cell_switch">
              <input type="checkbox" class="qwui-user_cell_input" @click="getLastPick(advise)">
            </span>
          </div>
        </div>
      </div>

      <!--底部操作按钮-->
      <flow_button :buttondata="businessDetail.buttonConfig"></flow_button>

    </div>

    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
    :userListUrl="userListUrl"
    :keyWordSearchUrl="keyWordSearchUrl"
    :letterSearchUrl="letterSearchUrl"
    v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 所属客户 -->
    <business-tree v-show="typeTreeShow"
    :belongClientData="belongClientData"
    :businessContactData="businessContactData"
    :businessPartnerData="businessPartnerData"
    :competitorData="competitorData"
    :searchBar="searchBar"
    @currentSelected="currentSelected"
    @treeListShow='treeListShow'
    @sameValue="sameValue"
    :treeListIsShow.sync="treeListIsShow"
    :clientListId="clientListId"
    :tree-list-is-show="treeListIsShow"
    :client-list-data="clientListData"
    :check-confirm="checkConfirm"
    :typeId="typeId"
    :searchBoxShow.sync="searchBoxShow"
    :noData.sync="noData"
    :belongClientId="belongClientId"
    :hasmore="hasmore"
    ref="qwtree"
    ></business-tree>
  </div>
</template>

<script>
import CrmOperateItem from '../../base/CrmOperateItem';
import userAdd from '@/components/add/user_select_build';
import BusinessTree from './BusinessTree';
import {
  getAddClient,
  getOldGivenList,
  addUserTo, // 当前登录人请求
  addBusiness, // 新增商机
  getBusinessInfo, // 编辑页面的列表请求
  getOptionLists, // 字段请求
  searchClientList, // 客户列表
  searchCompetitorList, // 竞争对手列表
  searchContactList, // 联系人列表
  addToDraft, // 保存草稿
  updateBusiness, // 编辑商机，保存按钮
  showClientPerson, // 选择完客户后，相关人的添加
  getClientInfo, // 详情页跳转新增，带过来客户信息
 } from '../../../api/business/getData';
import {mapMutations,mapActions} from 'vuex'
import img_detail from '@/components/add/add_img';
import file_detail from '@/components/add/add_file';
import time_detail from '../../base/time_detail';
import related_person_detail from '@/components/add/user_select_icon_right';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '@/assets/js/time-util';
import businessOperateData from './data';
import { dateToUnix } from '../../../../../assets/js/time-util';
// 引入公共方法
import { formatMoney, formatPercentage } from '../../../utils/index';

// 存放商机合作伙伴的配置
const businessPartnerConfig = {
  id: 'id',
  title: 'clientName',
  checkType: 'checkbox',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
  // parentId:'parentId',
  subTitle:'clientCode'
}

// 存放竞争对手的配置
const competitorConfig = {
  id: 'id',
  title: 'competitorName',
  checkType: 'checkbox',
}

// 存放所属客户的配置
const clientConfig = {
  id: 'id',
  title: 'clientName',
  checkType: 'radio',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
  parentId:'parentId',
  subTitle:'clientCode'
}

// 存放客户联系人的配置
const contactConfig = {
  id: 'id',
  title: 'contactsName',
  checkType: 'checkbox',
  // parentId:'parentId',
  subTitle:'mobile'
}

export default {
  name:'BusinessOperate',
  components:{
    userAdd,
    BusinessTree,
    img_detail,
    file_detail,
    time_detail,
    related_person_detail,
    flow_button,
    user_select,
    CrmOperateItem
  },
  data(){
    return {
      clientContactShow: false, // 客户联系人的显示隐藏
      businessPartnerShow: false, // 商机合作伙伴的显示隐藏
      competitorShow: false, // 竞争对手的显示隐藏
      openIdParams:{
        openId:''
      },
      mapShow:false,
      // 搜索框初始化
      searchBar: {
        show: true,
        ridMask: true,
        moreFunction:{
          show: true,
          option: [
            {
              name:'客户名称',
              placeholder:'按客户名称搜索',
              value: 0
            },
            {
              name:'联系电话',
              placeholder:'按联系电话搜索',
              value: 2
            }
          ]
        },
      },
      addClientItems: [], // 添加客户联系人
      addBusinessItems: [],  // 添加商机合作伙伴
      addCompetitorItems: [],  // 添加竞争对手
      creator: '', // 默认登陆者
      openId: '',
      checkConfirm: '' , // 储存点击树状组件的变量
      businessContactId: [], // 选中的联系人的id
      clientContactData: [], // 选中联系人的数据
      businessPartnerData: [], // 选中商机合作伙伴的数据
      competitorData: [],
      // visitClientValue: '', // 选中的拜访客户的详细信息
      businessValue: '', // 树状列表选中的详细信息
      editData:'', // 编辑页面后台返回的数据
      editCustomList: '',
      searchBoxShow:true, // 搜索框的有无
      noData: false,
      clientListId: '',
      customAllList: [], // 存放自定义字段
      fixedAllList: [], // 存放未赋值的固定字段
      businessALlList: [], // 存放后台返回的固定字段和自定义字段
      // businessData: [], // 存放页面渲染出来的固定字段和自定义字段
      belongClientId: [], // 存放所属客户的Id
      clientSelectData: [], // 存放所属客户的数据
      businessPartnerId: [], // 存放商业合作伙伴的Id
      competitorId: [], // 存放竞争对手的Id
      getBusinessHistoryParams:{
          id: this.$route.query.businessId
      },
      belongClientData:[], // 所属客户列表
      businessContactData: [], // 客户联系人列表
      typeListIds:[],
      userListUrl:'/portal/selectUserAction!ajaxGetUserListByOrgID.action',
      keyWordSearchUrl:'/portal/selectUserAction!searchByNameOrPhone.action',
      letterSearchUrl:'/portal/selectUserAction!searchFirstLetter.action',
      typeId:'',
      typesSelected:'',
      dataBase:dataBase,
      advise: false,  // 是否通知相关人按钮
      keyword:{
        type: 0,
        clientName: ''
      },
      page:'',
      address: '', // 地图
      clientData: '',// 所有list字段
      fixedData: '',
      pos: {

      },
      params:{
        'tbCrmBusinessInfoPO.id':'',
        'tbCrmBusinessInfoPO.createPerson' : '',
        'tbCrmBusinessInfoPO.clientId': '', // 存放所属客户的Id
        'tbCrmBusinessInfoPO.status': 0, // 编辑页面需要传，保存草稿1，保存2
        'tbCrmBusinessInfoPO.estimatedSale': '',
        // 传向后台的客户联系人数据
        contactRelJson:{
          'list': []
        },
        // 传向后台的商机合作伙伴数据
        partRelJson:{
          "list":[]
        },
        // 传向后台的客户联系人数据
        compRelJson:{
          "list":[]
        },
        status: 0, // 保存草稿为0，保存为1
        come: 1,
        creator: '',
        appId: 1,
        userOpenId:'',
        typeId:'',
        file:'',
        toSelectId:0,
        ccSelectId:0,
        submitType: 0, // 通知负责人相关人
        incharges:'', // 传的是负责人id
        relatives:'', // 传的是相关人id
        itemJson:{
          "list":[]
        }
      },
      treeListIsShow: true,
      clientListData: [], // 所属客户列表
      isWarnShow: false, // 格式错误的顶部toast提示
      warnMsg: '',
      sameId: true,
      parentMsg: '',
      typeTreeShow: false,
      districtShow: false, //区域显示
      nav: businessOperateData.business.businessDetail.nav,  //  头部输入框
      belongClientNav: businessOperateData.business.businessDetail.belongClientNav,
      clientContactNav: businessOperateData.business.businessDetail.clientContactNav,
      businessPartnerNav:businessOperateData.business.businessDetail.businessPartnerNav,
      competitorNav:businessOperateData.business.businessDetail.competitorNav,
      businessStageNav:businessOperateData.business.businessDetail.businessStageNav,
      communicationNav: JSON.parse(JSON.stringify(businessOperateData.business.businessDetail.communicationNav)),  // 通讯方式输入框
      businessDetail: businessOperateData.business.businessDetail,
      mainShow: true,
      timeVal: '',
      editTimeVal: '',
      birthEditTimeVal:'',
      timeItem: '',
      inchargesSelected: '',
      relativesSelected: '',
      userSelected: '',
      areaName: '',
      add: businessOperateData.business.businessDetail, // 传入组件的详细数据
      add_nav:{ //数据详情头部信息
        // nav: 'i18n.homeworkType', //头部标题
        title:"",
        content:"",
      },
      editBusinessId: false,
      routerName: '',  // 当前路由的名称
      // oldRouter: '',  // 记录进入新增编辑页路由
      // isUsed: true, // 判断是否记录上一次的路由
      hasmore: true, // 是否有更多数据，传向子组件接收
      creatorTitle: '',
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     vm.oldRouter = from.name;
  //   })
  // },
  // beforeRouteLeave (to, from, next) {
  //   // 启用的话就跳转到上一次路由
  //   if(this.isUsed){
  //     if(to.name === this.oldRouter){
  //       next();
  //     }
  //     else{
  //       next({name: this.oldRouter});
  //     }
  //   }
  //   else{
  //     next();
  //   }
  // },
  created:function(){
    // 判断是否是编辑页面
    window.location.href.indexOf('businessId') != -1 ? this.editBusinessId = true : false;
    // 初始化数据
    this.init();
    // 请求列表请求
    getOptionLists((data) => {
      this.customAllList = data.newItemList; // 自定义字段
      this.fixedAllList = data.basicList; // 固定字段
      this.businessALlList = this.businessALlList.concat(this.customAllList,this.fixedAllList); // 后台返回的自定义与固定字段
      this.customList();
      this.fixedList();
      this.addUserToSelect();
      this.getClient(this.$route.query.clientId)
      this.getBusinessEdit();
    })
  },
  computed: {
    businessData: function(){
      const businessArr = []
      return businessArr.concat(this.nav,this.belongClientNav,this.clientContactNav,this.businessPartnerNav,this.competitorNav,this.businessStageNav,this.communicationNav);
    }
  },
  activated() {
   let _funName = {
        belongClientList:"belongClient",//所属客户
        businessPartnerList:"businessPartnerAdd",//商机合作伙伴
        competitorList:"competitorAdd",//竞争对手
        businessContactList:"businessContact"//商机
      }[this.checkConfirm]
    if(_funName&&this.typeTreeShow){
      this.noData = false;
      this[_funName]()
    }
  },
  methods: {
    ...mapMutations([
    'updateSelectValue',
    'handleGetData',
    'resetTreeConfigData',
    'updateCurrentSelected',
    'changeConfig',
    ]),
    ...mapActions('list',[
      'setCacheArray',
      'delCacheArray'
    ]),

    // 默认当前用户为负责人，并渲染标题
    addUserToSelect(){
      let params = {
          userId: window._.userId
      }
      addUserTo(params)
      .then(res => {
        let { user } = res.data;
        this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(user);
        this.params.incharges = params.userId;
        this.creator = res.data.user.personName;
        // 处理商机标题 , 标题不接受缓存，所以放在缓存处理后
        if(this.nav[0].value == ''){
          this.businessTitle(); // 处理商机标题
        }
      })
    },

    // 监听标题的改变
    titleInput(val){
      this.creatorTitle = val;
    },

    // // 销售金额改变的回调函数
    businessAmountChange () {
      let val = this.communicationNav[1].value.replace(/[^\d.]/g,'');
      val = val? formatMoney(val) : '';
      let newObj = Object.assign({}, this.communicationNav[1], {value: val});
      this.$set(this.communicationNav,1, newObj);
      // this.$set(this.businessData,'communicationNav',this.communicationNav)
    },

    // 自定义字段方法处理 新增
    customList(customAllList){
      let placeholderName = '';   // 存放placeholder
      if(this.customAllList.length>0){
        this.customAllList.forEach((item) => {
          // 根据后台返回的type判断显示类型
          if(item.type == 1){
            item.type = 'input'
          }else if(item.type == 2){
            item.type = 'textarea'
          }else if(item.type == 0){
            item.type = 'select'
          }else if(item.type == 3){
            item.type = 'phone'
          }else if(item.type == 5){
            item.type = 'input';
            item.changeCallBack = this.numberCheck;
          }else{
            item.type = 'dateTime'
          }
          // 假如是下拉，要根据list里的isShow判断是否显示下拉选项
          if(item.type == 'select' && item.list.length > 0){
            let listArr = [];
            item.list.forEach((litem) => {
              if(litem.isShow == '1'){
                listArr.push(litem)
              }
            })
            item.list = [];
            item.list = listArr;
          }
          item.list.length>0 ? placeholderName = item.list[0].name : placeholderName = '请输入'+item.optionName; // 判断自定义字段的placeholder值，后台没返回则默认值
          item = Object.assign({}, item, { placeholder: placeholderName, maxLength:'2000',value: '' })//处理视图更新，得重创对象接收
          this.communicationNav.push(item)
        })
      }
      //   将自定义字段赋到params.itemJson  新增
      this.customAllList.forEach((item) => {
          let obj = {
            fieldName: item.optionName,
            fieldValue: item.value,
            fieldId: item.id,
          }
          this.params.itemJson.list.push(obj);
      })
    },

    editCustomAllList(){
      //   将自定义字段赋到params.itemJson  编辑
      if(this.$route.query.businessId){
        // 编辑页面，假如后台传过来自定义字段为空的时候，则视为新增，itemJson.list是没有id的，有的话就给他赋值id
        if(this.editCustomList.length > 0){
          this.editCustomList.forEach((item) => {
            this.params.itemJson.list.forEach((litem) => {
              if(item.fieldName == litem.fieldName){
                if(item.id){
                  this.$set(litem,'id',item.id);
                }
              }
            })
          })
        }
      }
    },

    // 处理客户联系人,把数据放进 contactRelJson:{"list":[{"contactId":"12321321","contactName":"haha"}]}
    clientContactHandle(){
      let contactArr = [];
      //   将客户联系人字段赋到params.contactRelJson  新增
      this.clientContactData.forEach((item) => {
        if(this.$route.query.businessId && item.contactName){
          let obj = {
            contactName: item.contactName,
            contactId: item.id,
          }
          contactArr.push(obj);
        }else{
          let obj = {
            contactName: item.contactsName,
            contactId: item.id,
          }
          contactArr.push(obj);
        }
      })
      this.params.contactRelJson = {};
      this.params.contactRelJson.list = contactArr;
      this.clientContactNav[0].value = this.clientContactData.join();
    },

    // 处理商机合作伙伴,把数据放进 partRelJson:{"list":[{"id":"","clientId":"12321321","clientName":"haha","relativeType":1}]}
    businessPartnerHandle(){
      let businessPartnerArr = [];
      //   将客户联系人字段赋到params.partRelJson  新增
      this.businessPartnerData.forEach((item) => {
        if(this.$route.query.businessId && item.clientId){
          let obj = {
            id: '',
            clientName: item.clientName,
            clientId: item.clientId,
            relativeType: 1 //商机合作伙伴为1
          }
          businessPartnerArr.push(obj);
        }else{
          let obj = {
            id: '',
            clientName: item.clientName,
            clientId: item.id,
            relativeType: 1 //商机合作伙伴为1
          }
          businessPartnerArr.push(obj);
        }
      })
      this.params.partRelJson = {};
      this.params.partRelJson.list = businessPartnerArr;
      this.businessPartnerNav[0].value = this.businessPartnerData.join();
    },

    // 处理竞争对手,把数据放进 compRelJson:{"list":[{"id":"","clientId":"12321321","clientName":"haha","relativeType":2}]}
    competitorHandle(){
      let competitorArr = [];
      //   将客户联系人字段赋到params.compRelJson  新增
      this.competitorData.forEach((item) => {
        if(this.$route.query.businessId && item.id){
          let obj = {
            id:  item.id,
            competitorName: item.competitorName,
            relativeType: 2 // 竞争对手为2
          }
          competitorArr.push(obj);
        }else{
          let obj = {
            id:  item.id,
            competitorName: item.competitorName,
            relativeType: 2 // 竞争对手为2
          }
          competitorArr.push(obj);
        }
      })
      this.params.compRelJson = {};
      this.params.compRelJson.list = competitorArr;
      this.competitorNav[0].value = this.competitorData.join();
    },

    // 固定字段方法处理
    fixedList(fixedAllList){
      fixedAllList = this.fixedAllList; // 后台的固定字段
      let fixedLists = [];
      let listItem = []; // 存放目前商机阶段ishow为1的下拉列表
      let typeItem = []; // 存放商机类别isshow为1的下拉列表
      // 把data里的固定字段全部拼接成fixdLists数组
      fixedLists = fixedLists.concat(this.nav,this.communicationNav.slice(0,3),this.belongClientNav,this.clientContactNav,this.businessPartnerNav,this.competitorNav,this.businessStageNav);
      fixedAllList.forEach((item) => {
        if(item.optionName == '客户联系人' && item.status == '1'){ // 判断客户联系人显示与否
          this.clientContactShow = true;
        }else if(item.optionName == '商机合作伙伴' && item.status == '1'){ // 判断商机合作伙伴显示与否
          this.businessPartnerShow = true;
        }else if(item.optionName == '竞争对手' && item.status == '1'){ // 判断竞争对手显示与否
          this.competitorShow = true;
        }
        fixedLists.forEach((nitem) => { // 不用判断商机标题，商机内容，所属客户，目前商机阶段，都是启用且必填
        // 获取缓存
          this.routerName = this.$router.history.current.name;
          let storageValue = localStorage.getItem(this.routerName);
          let storageObj = storageValue? JSON.parse(storageValue) : {};
          let val = this.editBusinessId ? '' : storageObj[nitem.key] || ''; // 编辑缓存
          this.$set(nitem,'value',val);
          if(item.optionName == nitem.optionName || (item.optionName == '内容' && nitem.optionName == '商机内容')){
            nitem.isMust = item.isMust;
            item.status == '1' ? nitem.status = true : nitem.status = false;
          }

        })
        // 目前商机阶段，isshow为1才显示
        if(item.optionName == '目前阶段'){
          item.list.forEach((litem) => {
            if(litem.isShow == '1'){
              litem.id = litem.stageCode;
              litem.name = litem.name+'（'+litem.winRate+'%）'; // 拼接name跟百分比
              listItem.push(litem);
            }
          })
          this.$set(this.businessStageNav[0],'list',listItem)
        }
        // 商机类别，isshow为1才显示
        if(item.optionName == '商机类别'){
          item.list.forEach((litem) => {
            if(litem.isShow == '1'){
              litem.id = litem.stageCode;
              typeItem.push(litem);
            }
          })
          this.$set(this.communicationNav[0],'list',typeItem)
        }
      })
    },

    // 假如选中的所属客户是跟上次一样的，就不清空联系人
    sameValue(val){
      this.sameId = val;
      // 选择所属客户后，清空客户联系人跟id，以及所有数据
      if(this.sameId == false){
        this.addClientItems = [];
        this.businessContactId = [];
        this.clientContactData = [];
      }
    },

    // 详情新增商机带过来的clientId
    getClient(val){
      if(val){
        let obj = {
          id: val
        }
        getClientInfo(obj).then(res => {
          if(res.code == '0'){
            this.belongClientId = res.data.client.id; // 客户id赋值
            this.showAboutPerson();
            // 所属客户的赋值
            this.belongClientNav.map(item => {
              if(item.editName == 'clientName'){
                item.value = res.data.client.clientName;

                // 数组变量存放客户数组
                let clientArr = [];
                  // 需要拼接后台传过来的格式
                let obj = {
                  clientName: res.data.client.clientName,
                  id: res.data.client.id,
                  clientCode: res.data.client.clientCode
                }
                clientArr.push(obj)
                this.clientSelectData = clientArr;
              }
            })
            this.selectClient();
          }else{
            _.alert('提示',res.desc);
          }
        })
      }
    },

    // 选择客户后，相关人的添加
    showAboutPerson(){
      let obj = {
        id: this.belongClientId
      }
      showClientPerson(obj).then(res => {
        if(res.code == '0'){
          this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [];
          res.data.ccpersons.map((item,index) => {
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item);
          })
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 树状组件传过来的值，currentValue代表所有值，selectedId代表其id
    currentSelected(currentValue,selectedId){
      if(currentValue.length>0){
        // 所属客户确定后返回
        if(this.checkConfirm == 'belongClientList'){ // 所属客户确认后返回
          this.clientSelectData = currentValue;
          this.belongClientNav[0].value = currentValue[0].clientName // 将选中的值赋给所属客户
          this.belongClientId = selectedId; // 选中的id赋给belongClientId
          this.showAboutPerson();
          this.selectClient();
        }else if(this.checkConfirm == 'businessContactList'){ // 客户联系人确定后返回
          this.businessContactId = selectedId;
          this.clientContactData = currentValue;
          this.addClientItems = [];
          this.clientContactData.forEach((item) => {
            this.addClientItems.push({ message: item.contactsName, id: item.id })
          })
        }else if(this.checkConfirm == 'businessPartnerList'){ // 商机合作伙伴确定后返回
          this.businessPartnerId = selectedId;
          this.businessPartnerData = currentValue;
          this.addBusinessItems = [];
          this.businessPartnerData.forEach((item) => {
            this.addBusinessItems.push({ message: item.clientName, id: item.id })
          })
        }else if(this.checkConfirm == 'competitorList'){ // 竞争对手确认后返回
          this.competitorId = selectedId;
          this.competitorData = currentValue;
          this.addCompetitorItems = [];
          this.competitorData.forEach((item) => {
            this.addCompetitorItems.push({ message: item.competitorName, id: item.id })
          })
        }
      }
    },

    // 选择所属客户后，标题改变，姓名_所属客户名+_时间
    selectClient(){
      // 有缓存后再执行一次title方法
      if(this.nav[0].value === '' || this.creatorTitle == ''){
        this.businessTitle();
        let arr = this.nav[0].value.split('_');
        arr.splice(1,0,this.belongClientNav[0].value);
        let businessArr = [...arr];
        businessArr[0] = this.dataBase.selectConfig.selectList["toPersonList"].userSelected[0].personName || '';
        this.nav[0].value = businessArr.join('_');
      }
    },

    // 商机标题
    businessTitle(){
      var nowDate = _.getFormatDate(new Date(Date.now()), 'yyyy-MM-dd-hh-mm');
      this.nav[0].value = this.creator + '_' + nowDate.split('-').join('');
    },

    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
      this.typeTreeShow = val;
    },

    // 附件参数
    showMsgFromFileDetail(mediaId) {
      this.params['mediaIds'] = mediaId.join(',');
    },

    // 图片参数
    showMsgFromImgDetail(imgurl){
      this.params['imageUrls'] = '';
      this.params['imageUrls'] = imgurl.join(',');
    },

    // 校验数据
    validateData () {
      // 弹窗提示未填写字段
      for(let i = 0;i<this.businessData.length;i++){
        if(this.businessData[i].isMust == 1 && this.businessData[i].value == ''){
          _.alert("提示信息","请输入"+this.businessData[i].optionName);
          return false;
        }
      }
      //  验证所属客户和合作伙伴是否相同
      // for(let i = 0;i<this.businessPartnerId.length;i++){
      //   if(this.businessPartnerId[i] == this.belongClientId){
      //     _.alert("提示","所属客户不能与商机合作伙伴或竞争对手相同","确定");
      //     return false;
      //   }
      // }
      //  验证所属客户和竞争对手是否相同
      for(let i = 0;i<this.competitorId.length;i++){
        if(this.competitorId[i] == this.belongClientId){
          _.alert("提示","所属客户不能与商机合作伙伴或竞争对手相同","确定");
          return false;
        }
      }
      // 编辑页面，假如选择的是签约交款，赢率百分百，则不能修改，修改了会有toast弹窗提示
      if(this.editBusinessId && this.editData.tbCrmBusinessInfoPO.winRate == '100.0' && this.businessStageNav[0].winRate != '100.0'){
        this.isWarnShow = true;
        setTimeout(() => {
          this.isWarnShow = false;
        },1000);
        this.warnMsg = '已赢单的商机不可修改赢率'
        return false;
      }
      // 至少一个负责人
      if(this.dataBase.selectConfig.selectList["toPersonList"].userSelected.length < 1){
        _.alert("提示","至少要一个负责人才能保存");
        return false;
      }
      return true;
    },
    input(val){
      this.businessStageNav[0].list.map(item => {
        if(item.stageCode == this.businessStageNav[0].value){
          this.businessStageNav[0].winRate = item.winRate
        }
      })
    },
    // 固定字段跟自定义字段赋值到params
    businessListParams(){
      this.businessData.forEach((item) => {
        this.params[item.key] = item.value;  //  固定字段赋值到params
        this.params['tbCrmBusinessInfoPO.estimatedSale'] = this.params['tbCrmBusinessInfoPO.estimatedSale'].split(',').join('') || '0';
        this.params['tbCrmBusinessInfoPO.clientId'] = this.belongClientId; // 客户联系人的ID
        this.params.creator = this.creator;
        // 点击保存草稿，假如失败，把字符串转化为对象
        if(typeof(this.params.itemJson.list) != 'object'){
          this.params.itemJson = JSON.parse(this.params.itemJson)
        }
        this.params.itemJson.list.forEach((pitem) => {
          if(item.optionName == pitem.fieldName){  //  自定义字段赋值到params
            if(item.type == 'select' && item.list.length>0 && item.value){
              pitem.fieldValue = item.value
            }else if(item.ext1){
              if (item.value && item.value.indexOf(',') !== -1) {
                pitem.fieldValue = item.value.split(',').join('');
              } else {
                pitem.fieldValue = item.value;
              }
            }else{
              pitem.fieldValue = item.value
            }
            if (item.ext1 === '3') {
              // 将百分比的数值类型处理成 数字+% 的形式
              // 判断小数点位数，防止出现  数字 + . + % 的情况
              pitem.fieldValue = formatPercentage(pitem.fieldValue);
            }
            pitem.fieldId = item.id
          }
        })
      })
      // 联系人id的赋值
      if(this.$route.query.businessId){
        this.params['tbCrmBusinessInfoPO.id'] = this.editData.tbCrmBusinessInfoPO.id
      }
    },

    // 负责人赋值params
    incharges(){
      let inchargesSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
      let toarr = [];
      inchargesSelected.forEach((item) => {
        toarr.push(item.userId);
      })
      this.params.incharges = toarr.join();
    },

    // 相关人赋值params
    relatives(){
      let relativesSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
      let ccarr = [];
      relativesSelected.forEach((item) => {
        ccarr.push(item.userId);
      })
      this.params.relatives = ccarr.join();
    },

    getBusinessEdit(){
      if(this.$route.query.businessId){
        // 编辑请求列表
        getBusinessInfo(this.getBusinessHistoryParams,(data) => {
          if(data.tbCrmBusinessInfoPO.status == '0'){
            // 编辑页面的时候没有保存草稿按钮，且status为0,草稿页面是有保存按钮键的
            this.$set(this.businessDetail.buttonConfig,'defaultList','')
          }
          this.editData = data; // 编辑所有数据赋值给editData
          this.editCustomList = data.itemList;
          // 编辑页面  固定自定义字段赋值
          for(let i=0;i<this.businessData.length;i++){
              this.businessData[i].value = data.tbCrmBusinessInfoPO[this.businessData[i].editName] // 固定字段赋值
              if(this.businessData[i].winRate == ''){
                this.$set(this.businessData[i],'winRate',data.tbCrmBusinessInfoPO.winRate)
              }
              if(this.businessData[i].optionName == '销售额(元)'){
                 this.businessData[i].value =  this.businessData[i].value == '0.0' ? '' : this.businessData[i].value
              }
              // 固定字段中的生日赋值
              if(this.businessData[i].type == 'dateTime' && this.businessData[i].optionName == '结单日期'){
                this.businessData[i].value = data.tbCrmBusinessInfoPO.estimatedDate
                this.birthEditTimeVal = data.tbCrmBusinessInfoPO.estimatedDate
              }
              // 自定义字段赋值
              for(let j=0;j<data.itemList.length;j++){
                  if(this.businessData[i].optionName == data.itemList[j].fieldName && this.businessData[i].optionName!='生日'){
                    this.businessData[i].value = data.itemList[j].fieldValue
                    // 自定义字段中的时间赋值
                    if(this.businessData[i].type == 'dateTime'){
                      this.editTimeVal = data.itemList[j].optionVal
                    }
                  }
              }
          }
          // 负责人赋值
          if(data.tbCrmBusinessInfoPO.toPersons){
            // 清空负责人
            this.$set(this.dataBase.selectConfig.selectList["toPersonList"],'userSelected',[])
            data.tbCrmBusinessInfoPO.toPersons.forEach((item) => {
              this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(item)
            })
          }
            // 相关人赋值
          if(data.tbCrmBusinessInfoPO.ccPersons){
            data.tbCrmBusinessInfoPO.ccPersons.forEach((item) => {
              this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
            })
          }
          // 照片赋值
          if(data.tbCrmBusinessInfoPO.picList.length > 0){
            this.add.imgUpload.picList = [];
            data.tbCrmBusinessInfoPO.picList.forEach((item) => {
              this.add.imgUpload.picList.push(item)
            })
          }
          // 附件赋值
          if(data.mediaList.length > 0){
            this.add.fileUpload.mediaList = [];
            data.mediaList.forEach((item) => {
              this.add.fileUpload.mediaList.push(item)
            })
          }

          // 商机合作伙伴：addBusinessItems  客户联系人：addClientItems  竞争对手：addCompetitorItems
          // 将编辑请求的竞争对手id传到子组件
          if(data.tbCrmBusinessInfoPO.competitorList.length>0){
            // 后台返回的竞争对手数据赋值给competitorData
            let competitorArr = [];
            data.tbCrmBusinessInfoPO.competitorList.map(item => {
              // 需要拼接后台传过来的格式
              let obj = {
                competitorName: item.competitorName,
                id: item.id,
                message: item.competitorName,
                // businessId:item.businessId,
                relativeType: 2 //竞争对手为2
              }
              competitorArr.push(obj)
            })
            this.competitorData = competitorArr;

            data.tbCrmBusinessInfoPO.competitorList.forEach((item) => {
              // 把竞争对手id放进competitorId存放
              this.competitorId.push(item.id)
              this.$set(item,'message',item.competitorName)
            })
            // 把后台竞争对手的数组赋值上页面上显示
            this.addCompetitorItems = data.tbCrmBusinessInfoPO.competitorList;
          }

          // 将编辑请求的商机合作伙伴id传到子组件
          if(data.tbCrmBusinessInfoPO.partnerList.length>0){
            // 后台返回的竞争对手数据赋值给competitorData
            // this.businessPartnerData = data.tbCrmBusinessInfoPO.partnerList;

            // 数组变量存放行业数组
            let businessPartnerArr = [];
            data.tbCrmBusinessInfoPO.partnerList.map(item => {
              // 需要拼接后台传过来的格式
              let obj = {
                clientName: item.clientName,
                id: item.clientId,
                message: item.clientName,
                businessId:item.businessId,
                relativeType: 1 //商机合作伙伴为1
              }
              businessPartnerArr.push(obj)
            })
            this.businessPartnerData = businessPartnerArr;

            data.tbCrmBusinessInfoPO.partnerList.forEach((item) => {
              this.businessPartnerId.push(item.clientId)
              this.$set(item,'message',item.clientName)
            })
            this.addBusinessItems = data.tbCrmBusinessInfoPO.partnerList;
          }

          // 将编辑请求的客户联系人id传到子组件
          if(data.tbCrmBusinessInfoPO.contactList.length>0){
            // 数组变量存放行业数组
            let contactArr = [];
            data.tbCrmBusinessInfoPO.contactList.map(item => {
              // 需要拼接后台传过来的格式
              let obj = {
                contactsName: item.contactName,
                id: item.contactId
              }
              contactArr.push(obj)
            })
            this.clientContactData = contactArr;

            data.tbCrmBusinessInfoPO.contactList.forEach((item) => {
              this.businessContactId.push(item.contactId)
              this.$set(item,'message',item.contactName)
            })
            this.addClientItems = data.tbCrmBusinessInfoPO.contactList;
          }
          // 将编辑请求的所属客户id传到子组件
          if(data.tbCrmBusinessInfoPO.clientId){
            this.belongClientId = data.tbCrmBusinessInfoPO.clientId
          }
        })
      }
    },

    // 保存
    save(){
      this.clientContactHandle();
      this.businessPartnerHandle();
      this.competitorHandle();
      let isPass = this.validateData();
      if(!isPass) return;
      this.businessListParams(); // params的赋值
      this.incharges();
      this.relatives();
      this.editCustomAllList();
      this.params.contactRelJson = JSON.stringify(this.params.contactRelJson);
      this.params.partRelJson = JSON.stringify(this.params.partRelJson);
      this.params.compRelJson = JSON.stringify(this.params.compRelJson);
      this.params.status = 0; // 保存草稿是1，保存是0
      this.params['tbCrmBusinessInfoPO.status'] = 0;
      //		赢率为100时，则提示
      this.checkWin(0);

    },

    // 保存为草稿
    saveDraft(){
      this.clientContactHandle();
      this.businessPartnerHandle();
      this.competitorHandle();
      this.businessListParams();
      this.incharges();
      this.relatives();
      this.editCustomAllList();
      // this.params.itemJson = JSON.stringify(this.params.itemJson);
      this.params.contactRelJson = JSON.stringify(this.params.contactRelJson);
      this.params.partRelJson = JSON.stringify(this.params.partRelJson);
      this.params.compRelJson = JSON.stringify(this.params.compRelJson);
      this.params.status = 1; // 保存草稿是1，保存是0
      this.params['tbCrmBusinessInfoPO.status'] = 1;
      // 保存草稿 编辑页面的保存草稿是更新接口，新增页面的保存草稿是新增接口
      this.submit(1);
    },

    checkWin(status){
      if((this.businessStageNav[0].winRate == '100.0' && !this.editBusinessId) || (this.businessStageNav[0].winRate == '100.0' && this.editBusinessId && this.editData.tbCrmBusinessInfoPO.winRate != '100.0') || (this.$route.query.status && this.businessStageNav[0].winRate == '100.0')){
         _.alert("提示","商机赢率100%后不可进行赢率修改,同时确认结单日期是否准确,是否确认该商机赢单？",{
            primaryBtn:{
                name: "i18n.confirm",
                callBack: () => {
                  this.submit(status)
                }
            },
            defaultBtn:{
                name: "i18n.cancel",
                callBack: null
            },
            });
      }else{
        this.submit(status);
      }
    },

    // 添加至database
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].userRestriction="1"; // 只能选一个负责人
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].title="负责人(可查看/修改)";
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人(可查看)";
      this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次"};
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
      this.dataBase.selectConfig.selectList["toPersonList"].userSelected=[];
    },

    submit(status){
      this.params.itemJson = JSON.stringify(this.params.itemJson);
       _.showLoading('提交中');
      (()=>{
         if(this.$route.query.businessId){
           return updateBusiness(this.params);
         }
         return  addBusiness(this.params);
      })().then(res => {
          if(res.code == '0'){
            this.delCacheArray('BusinessList');
            // 清除缓存
            localStorage.removeItem(this.routerName);
            setTimeout(()=>{
              // 列表 详情 选择 跳转过来的 完成后返回
              if(['list','select','detail'].includes(this.$route.query.from)
              ||this.$route.query.businessId){
                  this.$router.go(-1);
              }else{
                this.$router.replace({path: '/businessList/isread',query:{status:status}});
              }
            })
          }else{
            _.alert('提示',res.desc);
          }
          _.hideLoading();
        })
    },

    // 确定人员返回的数据,把id传至后台
    selectPerson(el,obj){
      if(el == 'toPersonList'){
        this.params.incharges = obj.user.idStr;
        if(this.nav[0].value === '' || this.creatorTitle == ''){
          // 初始化商机标题
          this.businessTitle();
          let arr = this.nav[0].value.split('_');
          if(obj.user.data.length>0){
            arr[0] = obj.user.data[0].personName;
          }
          let businessArr = [...arr];
          businessArr.splice(1, 0, this.belongClientNav[0].value);
          this.nav[0].value = businessArr.join('_');
        }
      }
      if(el == 'ccPersonList'){
        this.params.relatives = obj.user.idStr;
      }
    },

    // 负责人相关人添加
    confirmPick(el, isGet){ //负责人
      if(el == 'toPersonList'){
        let userSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
        if(isGet){
          this.keyword.type = Number(!isGet);
          getOldGivenList(this.keyword,(data) => {
            userSelected.splice(0,userSelected.length);
            userSelected.push.apply(userSelected, data.ccOrTolist);
            this.businessTitle();
            let arr = this.nav[0].value.split('_');
            arr.splice(1,0,this.belongClientNav[0].value);
            let businessArr = [...arr];
            if(userSelected.length>0){
              businessArr[0] = userSelected[0].personName
            }else{
              businessArr[0] = ''
            }
            this.nav[0].value = businessArr.join('_');
          })
        }else{
          userSelected.splice(0,userSelected.length);
        }
      }else if(el == 'ccPersonList'){ //相关人
        let userSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
        if(isGet){
          this.keyword.type = Number(isGet);
          return getOldGivenList(this.keyword,(data) => {
            userSelected.splice(0,userSelected.length);
            userSelected.push.apply(userSelected, data.ccOrTolist);
          })
        }else{
          userSelected.splice(0,userSelected.length);
        }
      }
    },

    // 初始化
    init () {
      // 初始化负责人相关人组件参数
      this.resetSelectPerson();
      // 给按钮绑定事件
      this.businessDetail.buttonConfig.primaryList[0].callBack = this.save; // 保存
      this.$set(this.businessDetail.buttonConfig,'defaultList',[{type:"default",name:'保存为草稿', callBack:null}]) // 初始化保存草稿按钮
      this.businessDetail.buttonConfig.defaultList[0].callBack = this.saveDraft; // 保存为草稿
      // 商机销售金额处理
      this.communicationNav[1].changeCallBack = this.businessAmountChange;
      // 添加客户联系人事件
      this.clientContactNav[0].clickEvent = this.addClientContact;
      // 添加商业合作伙伴事件
      this.businessPartnerNav[0].clickEvent = this.addBusinessPartner;
      // 添加竞争对手事件
      this.competitorNav[0].clickEvent = this.addCompetitor;
      // 所属客户绑定事件
      this.belongClientNav[0].clickEvent = this.belongClient;
    },

    // 添加客户联系人的事件
    addClientContact(){
      this.belongClientNav[0].value == '' ? _.alert('提示','请先选择所属客户') :
      this.businessContact();
    },

    // 添加商机伙伴
    addBusinessPartner(){
      this.businessPartnerAdd();
    },

    // 添加竞争对手
    addCompetitor(){
      this.competitorAdd();
      // this.addCompetitorItems.push({ message: '789', id: Math.random() })
    },

    // 删除客户联系人
    delClientContact(val){
      // 点击删除则删除该项
      this.addClientItems.splice(val,1)
      // 重置businessContactId
      this.businessContactId = [];
      let contactArr = [];
      // 将删除后的值重新push进id数组
      this.addClientItems.forEach((item) => {
        this.businessContactId.push(item.id)
        // 该项的数据也清空
        this.clientContactData.forEach((bitem) => {
          if(this.$route.query.businessId){
            if(bitem.id == item.contactId){
              contactArr.push(bitem);
            }
          }else{
            if(bitem.id == item.id){
              contactArr.push(bitem);
            }
          }
        })
      })
      this.clientContactData = contactArr;
    },

    // 删除商机合作伙伴
    delBusinessPartner(val){
      this.addBusinessItems.splice(val,1)

      // 重置businessContactId
      this.businessPartnerId = [];
      let partnerArr = [];
      // 将删除后的值重新push进id数组
      this.addBusinessItems.forEach((item) => {
        if(this.$route.query.businessId){
          this.businessPartnerId.push(item.clientId)
        }else{
          this.businessPartnerId.push(item.id)
        }
        // 该项的数据也清空
        this.businessPartnerData.forEach((bitem) => {
          if(this.$route.query.businessId){
            if(bitem.id == item.clientId){
              partnerArr.push(bitem);
            }
          }else{
            if(bitem.id == item.id){
              partnerArr.push(bitem);
            }
          }
        })
      })
      this.businessPartnerData = partnerArr;
    },

    // 删除竞争对手
    delCompetitor(val){
      this.addCompetitorItems.splice(val,1)
      // 重置competitorId
      this.competitorId = [];
      let comArr = [];
      // 将删除后的值重新push进id数组
      this.addCompetitorItems.forEach((item) => {
        // if(this.$route.query.businessId){
        //   this.competitorId.push(item.clientId)
        // }else{
          this.competitorId.push(item.id)
        // }
        // 该项的数据也清空
        this.competitorData.forEach((bitem) => {
          // if(this.$route.query.businessId){
          //   if(bitem.id == item.clientId){
          //     comArr.push(bitem);
          //   }
          // }else{
            if(bitem.id == item.id){
              comArr.push(bitem);
            }
          // }
        })
      })
      this.competitorData = comArr;
    },

    // 点击所属客户
    belongClient(){
      // 初始化搜索框
      this.searchBar = {
        show: true,
        ridMask: true,
        moreFunction:{
          show: true,
          option: [
            {
              name:'客户名称',
              placeholder:'按客户名称搜索',
              value: ''
            },
            {
              name:'联系电话',
              placeholder:'按联系电话搜索',
              value: 2
            }
          ]
        },
      },
      this.checkConfirm = 'belongClientList';
      this.$refs.qwtree.lock_roll = true;
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 拜访客户配置
      this.changeConfig(clientConfig);
      let obj = {
        page: 1,
        key: '',
        ctype: 2,
        workInfo: '',
        agentcode: 'crm',
        typeId: '',
        pageSize: 15
      }
      // 点击第一次请求 page为1
      searchClientList(obj)
      .then(res => {
        if(res.code == '0'){
          if(res.data.pageData){
            this.handleGetData(res.data.pageData)
            this.belongClientData = res.data.pageData;
            this.updateSelectValue(this.belongClientId);
            this.updateCurrentSelected(this.clientSelectData);
          }
          else{ // 请求无数据
            this.noData = true;
          }
          this.treeListIsShow=true;
          this.searchBoxShow=true;
          this.$refs.qwtree.lock_roll = false;
          this.hasmore = obj.page >= res.data.maxPage ? false : true
        }
        else{
            _.alert('提示',res.desc);
        }
      })
    },

    // 点击商机合作伙伴
    businessPartnerAdd(){
      // 初始化搜索框
      this.searchBar = {
        show: true,
        ridMask: true,
        moreFunction:{
          show: true,
          option: [
            {
              name:'客户名称',
              placeholder:'按客户名称搜索',
              value: ''
            },
            {
              name:'联系电话',
              placeholder:'按联系电话搜索',
              value: 2
            }
          ]
        },
      },
      this.checkConfirm = 'businessPartnerList';
      this.$refs.qwtree.lock_roll = true;
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 拜访客户配置
      this.changeConfig(businessPartnerConfig);
      let obj = {
        page: 1,
        key: '',
        ctype: 2,
        workInfo: '',
        agentcode: 'crm',
        typeId: '',
        pageSize: 15
      }
      // 点击第一次请求 page为1
      searchClientList(obj)
      .then(res => {
        if(res.code == '0'){
          if(res.data.pageData){
            this.handleGetData(res.data.pageData)
            // this.businessPartnerData = res.data.pageData;
            this.updateSelectValue(this.businessPartnerId);
            this.updateCurrentSelected(this.businessPartnerData);
          }
          else{ // 请求无数据
            this.noData = true;
          }
          this.treeListIsShow=true;
          this.searchBoxShow=true;
          this.$refs.qwtree.lock_roll = false;
          this.hasmore = obj.page >= res.data.maxPage ? false : true
        }
        else{
            _.alert('提示',res.desc);
        }
      })
    },
    // 点击竞争对手
    competitorAdd(){
      // 初始化搜索框
      this.searchBar = {
        show: true,
        ridMask: true,
      },
      this.checkConfirm = 'competitorList';
      this.$refs.qwtree.lock_roll = true;
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 拜访客户配置
      this.changeConfig(competitorConfig);
      let obj = {
        page: 1,
        key: '',
        ctype: 2,
        workInfo: '',
        agentcode: 'crm',
        typeId: '',
        pageSize: 15
      }
      // 点击第一次请求 page为1
      searchCompetitorList(obj)
      .then(res => {
        if(res.code == '0'){
          if(res.data.pageData){
            this.handleGetData(res.data.pageData)
            // this.competitorData = res.data.pageData;
            this.updateSelectValue(this.competitorId);
            this.updateCurrentSelected(this.competitorData);
          }
          else{ // 请求无数据
            this.noData = true;
          }
          this.treeListIsShow=true;
          this.searchBoxShow=true;
          this.$refs.qwtree.lock_roll = false;
          this.hasmore = obj.page >= res.data.maxPage ? false : true
        }
        else{
            _.alert('提示',res.desc);
        }
      })
    },

    // 点击客户联系人
    businessContact(){
      // 初始化搜索框
      this.searchBar= {
        show: true,
        ridMask: true
      }
        this.checkConfirm = 'businessContactList';
        this.$refs.qwtree.lock_roll = true;
        this.typeTreeShow = true; // 显示tree
        this.treeListIsShow = true;
        this.mainShow = false;
        // 重置数据 【必要的】
        this.resetTreeConfigData()
        // 拜访客户配置
        this.changeConfig(contactConfig);
        let obj = {
          page: 1,
          selectClientId: this.belongClientId,
          pageSize: 15
        }
        // 点击第一次请求 page为1
        searchContactList(obj)
        .then(res => {
          if(res.code == '0'){
            if(res.data.pageData){
              this.handleGetData(res.data.pageData)
              this.businessContactData = res.data.pageData;
              this.updateSelectValue(this.businessContactId);
              this.updateCurrentSelected(this.clientContactData);
            }
            else{ // 请求无数据
              this.noData = true;
            }
            this.treeListIsShow=true;
            this.searchBoxShow=true;
            this.$refs.qwtree.lock_roll = false;
            this.hasmore = obj.page >= res.data.maxPage ? false : true
          }
          else{
              _.alert('提示',res.desc);
          }
        })
    },

    listenToTime(timeVal,timeItem){
      this.timeItem = timeItem;
      this.timeItem.value = timeVal;
    },

    // 监听拜访时间，默认为当前时间
    listenToDate(val){
      this.communicationNav.forEach((item) => {
        if(item.minTime == ''){
          item.value = val;
        }
      })
    },

    //判断是否通知负责人和相关人
    getLastPick:function (string) {
      this.advise == false ? this.advise = true : this.advise = false;
      if(this.advise){
        this.params.submitType = 1
      }else{
        this.params.submitType = 0
      }
    },

    //获取地址栏参数 获取问号后的参数的值?client=123
    getParam(paramName){
      let paramValue = "";
      let isFound = false;
      if (window.location.search.indexOf("?") == 0 && window.location.search.indexOf("=")>1){
        let arrSource = decodeURIComponent(window.location.search).substring(1,window.location.search.length).split("&");
        let i = 0;
        while (i < arrSource.length && !isFound){
          if (arrSource[i].indexOf("=") > 0){
            if (arrSource[i].split("=")[0].toLowerCase()==paramName.toLowerCase()){
              paramValue = arrSource[i].split("=")[1];
              isFound = true;
            }
          }
          i++;
        }
      }
      return paramValue;
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
      for(let i = 0 ; i < this.communicationNav.length; i ++) {
        if(this.communicationNav[i].id === id) {
          // 拼接 - 号
          if (this.communicationNav[i].value && this.communicationNav[i].value.charAt(0) === '-') {
            let first_word = this.communicationNav[i].value.substring(0, 1);
            val = first_word + val;
          }
          // 用nextTick 强制视图更新
          this.$nextTick(() => {
            this.$set(this.communicationNav[i], 'value', val);
          })
          break;
        }
      }
    }
  }
}
</script>
<style lang="scss">
.wrap{
  position:relative;
  background: none;
  .qwui-warning{
    position:fixed;
    height:36px;
    width:100%;
    text-align: center;
    background-color:rgba(255,232,232,1);
    z-index: 2;
    .waring-text{
      display:inline-block;
      color:rgba(255,102,110,1);
      font-size:14px;
      line-height: 14px;
      margin-top:11px;
    }
  }
  .qwui-client_main{
    /*照片附件*/
    .qwui-client_attachment{
      position:relative;
      background-color: #fff;
      .img-text{
        padding: 14px 0 0 15px;
        display: inline-block;
        font-size:16px;
        font-family:PingFangSC-Regular;
        color:rgba(51,51,51,1);
      }
    }
    .qwui-client_attachment::after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      border-bottom: 1px solid #e5e5e5;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }


    /*可通过后台启用更多自定义字段*/
    .custom_bar{
      position: relative;
      width: 100%;
      padding: 10px 0 20px 15px;
      background-color: #f5f5f5;
      font-size:13px;
      font-family:PingFangSC-Regular;
      color:rgba(187,187,187,1);
    }
    .qw-client_inform{
      height:44px;
      font-family:PingFangSC-Regular;
      color:rgba(51,51,51,1);
      font-size:16px;
      position: relative;
      background: #fff;
      .qwui-user_cell_input{
        float:right;
      }
      .qwui-inform_text{
        padding:10px 15px;
        margin-top:10px;
      }
    }
    .qw-client_inform:after, .separate_bar:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ddd;
      color: #ddd;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .separate_bar{
      position: relative;
      height: 10px;
      background-color: #f5f5f5;
    }
    .qwui-f_add_image_list:after {
      border-top:none !important;
    }


    /*子组件下滑线清除*/
    .qwui-client_detail .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .qwui-client_location .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .qwui-client_communication .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .vux-popup-picker-value{
      float:right;
      color:#333;
    }
    .qwui-client_communication{
      .vux-cell-value {
        font-size:16px;
        line-height:37px;
        font-family:PingFangSC-Regular;
        color:#333;
      }
      .weui-cells:after{
        border-bottom: none;
      }
    }

    .qwui-separate_bar{
      &:before, &:after{
        transform-origin: 0 0;
      }
    }
    .vux-no-group-title{
      margin-top: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.wrap{
    height: 100%;
    overflow-y: auto;
}
</style>
