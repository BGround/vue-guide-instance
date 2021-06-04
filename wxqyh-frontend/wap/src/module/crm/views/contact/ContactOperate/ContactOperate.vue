<template>
  <div class="wrap ">
    <div class="qwui-warning" v-if="isWarnShow"><span class="waring-text">{{warnMsg}}</span></div>
    <div class="qwui-client_main" v-show="mainShow">
      <div class="qwui_btn_margin_bottom">
        <!--联系人姓名 所属客户-->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in nav"
            :item="item"
            :key="idx"
            v-model="item.value"
          >
            <div v-show="wxContactShow" class="wxContact" @click="wxContactList(item.value)">
              <p>
                <span class="wx_contact_icon"></span><span>外部联系人</span>
              </p>
            </div>
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>


        <!--职位 手机 邮箱-->
        <div class="qwui-client_location">
          <crm-operate-item
            v-if="item.status"
            :dataDetailMsg="add_nav"
            v-for="item in centerNav"
            :item="item"
            :key="item.id"
            :log="parentMsg"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar" v-show="centerNavShow"></div>
        </div>


        <!-- 生日 毕业院校 兴趣爱好 备注  自定义字段 -->
        <div class="qwui-client_communication">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="item in communicationNav"
            :item="item"
            :telRepeatMsg="telRepeatMsg"
            :key="item.id"
            :editTimeVal="editTimeVal"
            :birthEditTimeVal="birthEditTimeVal"
            v-if="item.status"
            @listenToChild="listenToChild"
            @listenToTime="listenToTime"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar custom_bar">可通过后台启用更多自定义字段</div>
        </div>

        <!-- 上传照片附件 -->
        <div class="qwui-client_attachment">
          <span class="img-text">照片</span>
          <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail" @handleClick="handleClick"></img_detail>
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
      <flow_button :buttondata="contactDetail.buttonConfig"></flow_button>

    </div>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
    :tabActive="'user'"
    :userSelectType="'onlyUser'"
    :userListUrl="userListUrl"
    :keyWordSearchUrl="keyWordSearchUrl"
    :letterSearchUrl="letterSearchUrl"
    v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 所属客户 -->
    <contact-tree v-show="typeTreeShow"
    :belongData="belongData"
    @typeSelected="typeSelected"
    @belongClientStr="belongClientStr"
    @treeListShow='treeListShow'
    @typeIds="typeIds"
    :clientListId="clientListId"
    :tree-list-is-show="treeListIsShow"
    :client-list-data="clientListData"
    :typeId="typeId"
    :noData.sync="noData"
    :searchBoxShow.sync="searchBoxShow"
    :hasmore="hasmore"
    ref="qwtree"
    ></contact-tree>
  </div>
</template>

<script>
import CrmOperateItem from '../../base/CrmOperateItem';
import wx from 'weixin-js-sdk';
import userAdd from '@/components/add/user_select_build';
import ContactTree from './ContactTree';
import {
  getAddClient,
  searchClientList,
  getOldGivenList,
  getWxContactInfo,
  getWxContactDetail,
  addUserTo,
  getClientUpdate,
  queryMobileRepeat,
  getContactsItem,
  addContact,
  getContactHistoryInfo,
  updateContact,
  weixinjsAction,
  contactGetClient, // 路由携带clientId，则把客户字段填充
  showClientPerson, // 从详情页跳转到新增，带客户名称，请求其相关人列表
  getAgent, // 获取agent配置
 } from '../../../api/contact/getData';
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
import img_detail from '@/components/add/add_img';
import file_detail from '@/components/add/add_file';
import time_detail from '../../base/time_detail';
import related_person_detail from '@/components/add/user_select_icon_right';
import advanced_setting from '@/components/add/advanced_setting';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '@/assets/js/time-util';
import contactOperateData from './data';
// 引入公共方法
import { formatMoney, formatPercentage } from '../../../utils/index';
// 取得微信外部联系人基本信息
import { getWxContactList } from '../../../api/externalContact/getData';
// 存放所属客户的配置
const clientConfig = {
id: 'id',
title: 'clientName',
checkType: 'radio',
headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
parentId:'parentId',
subTitle:'clientCode'
}
export default {
  name:'ContactOperate',
  components:{
    userAdd,
    ContactTree,
    img_detail,
    file_detail,
    time_detail,
    related_person_detail,
    advanced_setting,
    flow_button,
    user_select,
    CrmOperateItem
  },
  data(){
    return {
      crmContactData: [], // 存放子组件选择的数据
      openIdParams:{
        openId:''
      },
      mobileIsRepeat: false, // 电话重复
      aa: '',
      openId: '',
      editData:'', // 编辑页面后台返回的数据
      editCustomList: [],
      searchBoxShow:true,
      clientListId: '',
      customAllList: [], // 存放自定义字段
      fixedAllList: [], // 存放未赋值的固定字段
      contactALlList: [], // 存放后台返回的固定字段和自定义字段
      contactData: [], // 存放页面渲染出来的固定字段和自定义字段
      belongClientId: [],
      typeData: [], // 所属客户列表
      getContactHistoryParams:{
        id: this.$route.query.contactId
      },
      noData: false,
      belongData:[],
      typeListIds:[],
      userListUrl:'/portal/selectUserAction!ajaxGetUserListByOrgID.action',
      keyWordSearchUrl:'/portal/selectUserAction!searchByNameOrPhone.action',
      letterSearchUrl:'/portal/selectUserAction!searchFirstLetter.action',
      typeId:'',
      typesSelected:'',
      dataBase:dataBase,
      advise: false,  // 是否通知相关人按钮
      wxContactShow: false, // 微信联系人的显示
      telRepeatMsg: false,
      keyword:{
        type: 0,
        clientName: ''
      },
      page:'',
      centerNavShow: true, // 分割线隐藏，行业地址区域板块隐藏的时候就为false
      address: '', // 地图
      clientData: '',// 所有list字段
      fixedData: '',

      params:{
        'tbCrmContactsInfoPO.id':'',
        'tbCrmContactsInfoPO.clientId': '', // 存放所属客户的Id
        'tbCrmContactsInfoPO.status': 1,
        'tbCrmContactsInfoPO.birthday': '2018-07-08',
        userOpenId:'',
        typeId:'',
        typeIds:'',
        isClient:'',
        typeIsMust:0,
        file:'',
        toSelectId:0,
        ccSelectId:0,
        submitType: 0, // 通知负责人相关人
        // 详情页面传值，获取id
        page: 1,
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
      parentMsg: '',
      typeTreeShow: false,
      listenDistrictMust: '',
      districtShow: false, //区域显示
      nav: contactOperateData.contact.contactDetail.nav,  //  头部输入框
      centerNav: contactOperateData.contact.contactDetail.centerNav,  // 区域地址行业输入框
      communicationNav: JSON.parse(JSON.stringify(contactOperateData.contact.contactDetail.communicationNav)),  // 通讯方式输入框
      contactDetail: contactOperateData.contact.contactDetail,
      mainShow: true,
      timeVal: '',
      editTimeVal: '',
      birthEditTimeVal:'',
      timeItem: '',
      inchargesSelected: '',
      relativesSelected: '',
      userSelected: '',
      areaName: '',
      add: contactOperateData.contact.contactDetail, // 传入组件的详细数据
      add_nav:{ //数据详情头部信息
        // nav: 'i18n.homeworkType', //头部标题
        title:"",
        content:"",
      },
      routerName: '',  // 当前路由的名称
      // oldRouter: '',  // 记录进入新增编辑页路由
      // isUsed: true, // 判断是否记录上一次的路由
      hasmore: true, // 是否有更多数据，传向子组件接收
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
  computed:{
      ...mapState({
        config: state => state.tree.config,                        // 配置
        options: state => state.tree.options,                      // 列表数据
        renderData: state => state.tree.renderData,                // { '父级ID': [子级数据] }
        // currentSelected: state => state.tree.currentSelected,      // 先前选择的数据，点击“取消”时返回
        currentParentId: state => state.tree.currentParentId,      // 当前列表的父Id
        prevParentId: state => state.tree.prevParentId,            // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
      }),
      ...mapGetters([
        'selectName',     // 当前获取的数据个数
      ]),
      // 当前已选的数据【必要的】
      selectValue: {
        get() {
          return this.$store.state.tree.selectValue
        },
        set(value) {
          this.updateSelectValue(value)
        }
      },
      currentSelected: {
        get() {
          return this.$store.state.tree.currentSelected;
        },
        set(value) {
          this.updateCurrentSelected(value)
        }
      },
    },
  created:function(){
    window.location.href.indexOf('contactId') != -1 ? this.editContactId = true : false;  // 判断是否是编辑页面
    this.init();
    this.checkListAdd(this.$route.query.keyWord);
    // 请求列表请求
    getContactsItem((data) => {
      this.customAllList = data.newItemList;
      this.fixedAllList = data.basicList;
      this.contactALlList = this.contactALlList.concat(this.customAllList,this.fixedAllList);
      this.customList();
      this.fixedList();
      this.contactData = this.contactData.concat(this.nav,this.centerNav,this.communicationNav);
      this.wxqyCreate();
      this.clientAddContact(this.$route.query.clientId);
      this.getHistoryContact();
    })


    // 默认当前用户为负责人
    let params = {
        userId: window._.userId
    }
    addUserTo(params)
      .then(res => {
        let { user } = res.data;
        this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(user);
        this.params.incharges = params.userId;
      })
    // 若是编辑页面，赋值

  },
  mounted(){
  },
  activated() {
    if(this.typeTreeShow ){
      this.clientBelong();
    }
  },
  methods: {
    ...mapMutations([
    'updateSelectValue',
    'handleGetData',
    'resetTreeConfigData',
    'changeConfig',
    'updateCurrentSelected'
    ]),
    ...mapActions('list',[
      'setCacheArray',
      'delCacheArray'
    ]),
    // 查重页面跳转过来带参数
    checkListAdd(val){
      if(this.$route.query.keyWord){
        // 正则判断是否数字，是的话存入联系电话，否则为客户名称
        if(/^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g.test(val) && this.centerNav.length > 0){
          this.centerNav.map((item,index) => {
            if(item.name == 'tel' && item.status == true){
              item.value = val
            }
          })
        }else{
          this.nav[0].value = val;
        }
      }
    },
    // 新建客户带过来的clientId
    clientAddContact(val){
      if(val){
        let obj = {
          id: val
        }
        contactGetClient(obj).then(res => {
          if(res.code == '0'){
            this.nav.map(item => {
              if(item.editName == 'clientName'){
                item.value = res.data.client.clientName;
                this.typeData = res.data.client.id; // 客户id赋值
                this.showAboutPerson(); // 假如有clientId,渲染相关人
                this.params['tbCrmContactsInfoPO.clientId'] = res.data.client.id

                // 数组变量存放客户数组
                let clientArr = [];
                  // 需要拼接后台传过来的格式
                let obj = {
                  clientName: res.data.client.clientName,
                  id: res.data.client.id,
                  clientCode: res.data.client.clientCode
                }
                clientArr.push(obj)
                this.crmContactData = clientArr;
              }
            })
          }else{
            _.alert('提示',res.desc);
          }
        })
      }

    },

    // 详情页跳转，渲染其相关人
    showAboutPerson(){
        let obj = {
          id: this.typeData
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
      if(this.$route.query.contactId){
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
    // 固定字段方法处理
    fixedList(fixedAllList){
      fixedAllList = this.fixedAllList;
      let fixedLists = [];
      fixedLists = fixedLists.concat(this.nav,this.centerNav,this.communicationNav.slice(0,4));
      fixedAllList.forEach((item) => {
        fixedLists.forEach((nitem) => {
          // 获取缓存
          this.routerName = this.$router.history.current.name;
          let storageValue = localStorage.getItem(this.routerName);
          let storageObj = storageValue? JSON.parse(storageValue) : {};
          let val = this.editContactId ? '' : storageObj[nitem.key] || ''; // 编辑缓存
          if(!this.$route.query.keyWord){
            this.$set(nitem,'value',val);
          }
          if(item.optionName == nitem.optionName || item.optionName == '姓名'){
            nitem.isMust = item.isMust;
            item.status == '1' ? nitem.status = true : nitem.status = false;
          }
        })
      })
    },
    // 树状组件传过来的str值
    belongClientStr(val){
      this.crmContactData = val;
      this.nav.forEach((item) => {
      if(item.editName == 'clientName'){
          item.value = val[0].clientName;
      }
      })
    },
    // 树状组件传过来的id
    typeSelected(val){
      this.typeData = val;
      this.params['tbCrmContactsInfoPO.clientId'] = val;
      // 选择了客户之后，必须清空相关人，编辑页面清空联系人姓名
      this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [];
      this.showAboutPerson(); // 假如有clientId,渲染相关人
      if(this.$route.query.contactId){
        this.nav[0].value = '';
      }
    },
    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
      this.typeTreeShow = val;
    },
    // 图片参数
    showMsgFromImgDetail(imgurl){
      this.params['imageUrls'] = '';
      this.params['imageUrls'] = imgurl.join(',');
    },
    // 点击图片触发事件
    handleClick(val){
      // wxqyh_isOpen = 'public';//默认外部联系人
      // wxqyh_isUsePublic = false;
    },
    // 检测联系电话是否重复
    checkPhoneRepeat(){
      // 验证手机重复需要的参数
      let phoneNum = {
        mobile:'',
        agentCode: 'crmContactsMobile'
      }
      this.contactData.forEach((item) => {
        if(item.name == 'tel'&&item.status == true){
          phoneNum.mobile = item.value
        }
      })
      // 联系电话重复toast弹窗
      return new Promise((resolve,reject) => {
        this.contactData.forEach((item) => {
          // 假如电话不为空则做验证 且值为原来编辑的值不用做验证
          if(item.name == 'tel' && item.value != ''){
            if(this.editData && item.value != this.editData.vo.mobile || !this.editContactId){
              queryMobileRepeat(phoneNum,(data) => {
                  if(data.isExist){
                    this.isWarnShow = true;
                    this.mobileIsRepeat = true;
                    setTimeout(() => {
                      this.isWarnShow = false;
                    },1000);
                    this.warnMsg = '联系电话已存在';
                  }else{
                    this.mobileIsRepeat = false;
                  }
                  resolve(this.mobileIsRepeat);
                })
              }else if(item.name == 'tel' && item.value == ''){
                resolve(false)
              }else{
                resolve(false)
              }
            }else if(item.name == 'tel' && item.value == ''){
              resolve(false)
            }

        })
      })
    },
    // 校验数据
    validateData () {
      // 弹窗
      if(!this.isWarnShow){
        for(let i = 0;i<this.contactData.length;i++){
          if(this.contactData[i].isMust == 1 && this.contactData[i].value == ''){
            _.alert("提示信息","请输入"+this.contactData[i].optionName);
            return false;
          }
        }
        // 假如centerNav的邮箱格式错，则红色toast
        for(let i = 0;i<this.centerNav.length;i++){
           // 判断邮箱如果有value值就进行验证
            if(this.centerNav[i].name === 'mail' && this.centerNav[i].value != ''){
              var myreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/;
              let mail = this.centerNav[i].value;
              if(myreg.test(mail)){
                this.isWarnShow = false;
              }else{
                this.isWarnShow = true;
                setTimeout(() => {
                  this.isWarnShow = false;
                },1000);
                this.warnMsg = '请输入正确的邮箱格式';
                return false;
              }
            }
        }
        if(this.dataBase.selectConfig.selectList["toPersonList"].userSelected.length < 1){
          _.alert("提示","至少要一个负责人才能保存");
          return false;
        }
        return true;
      }
    },
    // 固定字段跟自定义字段赋值到params
    contactListParams(){
      this.contactData.forEach((item) => {
        this.params[item.key] = item.value  //  固定字段赋值到params
        this.params.itemJson.list.forEach((pitem) => {
          if(item.optionName == pitem.fieldName){  //  自定义字段赋值到params
            if(item.type == 'select' && item.list.length>0 &&  item.value){
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
      if(this.$route.query.contactId){
        this.params['tbCrmContactsInfoPO.id'] = this.editData.vo.id
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
    getHistoryContact(){
        if(this.$route.query.contactId){
            getContactHistoryInfo(this.getContactHistoryParams,(data) => {
              this.editData = data; // 编辑所有数据赋值给editData
              this.editCustomList = data.itemList;
              // 编辑页面  固定自定义字段赋值
              for(let i=0;i<this.contactData.length;i++){
                  this.contactData[i].value = data.vo[this.contactData[i].editName] // 固定字段赋值
                  // 固定字段中的生日赋值
                  if(this.contactData[i].type == 'dateTime' && this.contactData[i].optionName == '生日'){
                    this.contactData[i].value = data.vo.birthday
                    this.birthEditTimeVal = data.vo.birthday
                  }
                  // 自定义字段赋值
                  for(let j=0;j<data.itemList.length;j++){
                      if(this.contactData[i].optionName == data.itemList[j].fieldName && this.contactData[i].optionName!='生日'){
                        this.contactData[i].value = data.itemList[j].fieldValue
                        // 自定义字段中的时间赋值
                        if(this.contactData[i].type == 'dateTime'){
                          this.editTimeVal = data.itemList[j].optionVal
                        }
                      }
                  }
              }

              // 负责人赋值
              if(data.vo.toPersons){
                this.dataBase.selectConfig.selectList["toPersonList"].userSelected = [];
                data.vo.toPersons.forEach((item) => {
                  this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(item)
                })
              }
                // 相关人赋值
              if(data.vo.ccPersons){
                data.vo.ccPersons.forEach((item) => {
                  this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
                })
              }
              // 照片赋值
              if(data.vo.picList){
                this.add.imgUpload.picList = [];
                data.vo.picList.forEach((item) => {
                  this.add.imgUpload.picList.push(item)
                })
              }
              if(data.vo.clientId){
                  this.typeData = data.vo.clientId
              }
              if(data.vo.clientId){
                this.params['tbCrmContactsInfoPO.clientId'] = data.vo.clientId
              }
              if(data.vo.openId){
                this.params.userOpenId = data.vo.openId;
              }
            })
        }
    },
    // 保存
    keepClose(){
      let isPass = this.validateData();
      if(!isPass) return;
      // 验证过邮箱格式后进行验证手机是否重复
      this.checkPhoneRepeat().then((data) => {
        if(!data){
          this.contactListParams(); // params的赋值
          // 负责人赋值
          this.incharges();
          // 联系人赋值
          this.relatives();
          const cb = data => {
            // this.isUsed = false;
            this.delCacheArray("ContactList");
             // 清除缓存
            localStorage.removeItem(this.routerName);
            _.hideLoading();
            setTimeout(()=>{
              // 编辑、列表页进入 返回
              if (['select','list','detail'].includes(this.$route.query.from)||
                this.$route.query.contactId) {
                this.$router.go(-1);
              } else {
                this.$router.replace({ path: "/contactList/isread" });
              }
            })
          };
          if(this.$route.query.contactId){
            this.editCustomAllList();
            // 自定义字段转json
            this.params.itemJson = JSON.stringify(this.params.itemJson);
            _.showLoading('提交中');
            updateContact(this.params,cb)
          }else{
            // 自定义字段转json
            this.params.itemJson = JSON.stringify(this.params.itemJson);
            _.showLoading('提交中');
            addContact(this.params,cb)
          }
        }

      });
    },
    listenToChild(val){
      for(let i = 0;i<this.listenDistrictMust.list.length;i++){
        if(this.listenDistrictMust.list[i].type == '4'){
          this.listenDistrictMust.list[i].value = val;
        }
      }
    },
    // 添加至database
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].title="负责人(可查看/修改)";
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人(可查看)";
      this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:false,name:""};
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:false,name:""};
      this.dataBase.selectConfig.selectList["toPersonList"].userSelected=[];
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

    // 负责人相关人添加
    confirmPick(el, isGet){ //负责人
      if(el == 'toPersonList'){
        let userSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
        if(isGet){
          this.keyword.type = Number(!isGet);
          getOldGivenList(this.keyword,(data) => {
            userSelected.splice(0,userSelected.length);
            userSelected.push.apply(userSelected, data.ccOrTolist);
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
      this.contactDetail.buttonConfig.primaryList[0].callBack = this.keepClose;
      // 给操作项绑定事件
      this.nav[1].clickEvent = this.clientBelong;
    },


    listenToTime(timeVal,timeItem){
      this.timeItem = timeItem;
      this.timeItem.value = timeVal;
    },
    // 客户名称
    checkClientName(){
      this.keyword.clientName = this.nav[0].value;

    },
    // 选择所属客户
    clientBelong () {
      this.$refs.qwtree.lock_roll = true;
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(clientConfig)
      let obj = {
        page: 1,
        ctype: 1,
        workInfo: '',
        agentcode: 'crm',
        pageSize:15
      }
      searchClientList(obj)
      .then(res => {
        if(res.code == '0'){
          if(res.data.pageData){
            this.handleGetData(res.data.pageData)
            this.belongData = res.data.pageData;
            this.updateSelectValue(this.typeData);
            this.updateCurrentSelected(this.crmContactData)
          }else{ // 请求无数据
            this.noData = true;
          }
          this.treeListIsShow=true;
          this.searchBoxShow=true;
          this.$refs.qwtree.lock_roll = false;
          this.hasmore = obj.page >= res.data.maxPage ? false : true
        }else{
          _.alert('提示',res.desc);
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
    // 点击树状input打印当前id
    typeIds(val){
      this.params['tbCrmClientInfoPO.poolId'] = val.join();
      if(this.params['tbCrmClientInfoPO.poolId'] === 0){
        this.params['tbCrmClientInfoPO.poolId'] = ''
      }
    },
    // 判断中间分割线是否隐藏
    centerNavIsShow(){
      let centerArr = [];
      this.centerNav.forEach((item) => {
        centerArr.push(item.status);
      })
      centerArr.indexOf(true) == -1 ? this.centerNavShow = false : this.centerNavShow = true
    },

    // 企业微信初始化
    wxqyCreate(){
      if(_.isQiyeweixinApp() && !this.editContactId){
        this.wxContactShow = true; // 企业微信就打开微信联系人
        // if(this.editContactId == false){
        //   wxqyh_isOpen = true; // 默认外部联系人
        // }
      }
    },

    // 微信联系人跳转
    wxContactList(){
      this.setAgentConfig();
    },

    setAgentConfig(){
      let self = this;
          let obj = {
            agentCode: 'crm',
            url: window.location.href.split('#')[0]
          }
          getAgent(obj).then(res => {
            if(res.code == '0'){
              let apijs = res.data.apijs;
              wx.agentConfig({
                  corpid: apijs.corpId,
                  agentid: apijs.agentid,
                  timestamp: apijs.timestamp,
                  nonceStr: apijs.noncestr,
                  signature: apijs.signature,
                  jsApiList: ['selectExternalContact'],
                  success: function(res) {
                      self.getExternalContact();
                  },
                  fail: function(res) {
                      if(res.errMsg.indexOf('function not exist') > -1){
                          alert('版本过低请升级')
                      }
                  }
              });
              }
          })
      },
    getExternalContact(){
      if(!_.isQiyeweixinApp()){
        _.alert("提示","请在企业微信客户端使用此功能","确定");
        return;
      };
       wx.invoke('selectExternalContact', {}, res=> {
        if (res.err_msg == "selectExternalContact:ok") {
          var userIds  = res.userIds ; //返回此次选择的外部联系人userId列表，数组类型
          if(userIds.length > 0){
            //传入userId获得外部联系人详情
            let obj = {
              userIds : res.userIds
            }
            localStorage.setItem('externalIds', res.userIds);
            // this.isUsed = false;
            userIds.length == 1 ? this.getWxContactInfo() : this.$router.push({name: "externalContact",query:{ type: 'contact' }});
          }else if(userIds.length > 10){
            alert('一次最多导入10个外部联系人')
          }
          else{
             _.alert(" ", "请先添加外部联系人",{
                primaryBtn:{
                    name: "查看指引",
                    callBack: () => {
                        location.href = _.baseURL + '/jsp/wap/crm/contact/contact_guide.jsp';
                    }
                },
                defaultBtn:{
                    name: "取消",
                    callBack: null
                },
            });
          }
        }
        else if(res.err_msg == "selectExternalContact:cancel" || res.err_msg == "selectExternalContact:fail"){
          //错误处理
        }else{
            _.alert("提示",JSON.stringify(res),"确定");
        }
      });
    },

    // 初始化
    getWxContactInfo(){
        let obj = localStorage.getItem('externalIds');
        let contactObj = {
            userIds: obj
        }
        getWxContactList(contactObj).then(res => {
            if(res.code == '0'){
                this.resetContactForm();
                let contactData = res.data.wxContactList[0]
                this.contactData.forEach((item) => {
                  if(item.editName == 'contactsName'){
                    item.value = contactData.name
                  }else if(item.editName == 'position'){
                    item.value = contactData.position
                  }else if(item.editName == 'remark'){
                    item.value = contactData.remark
                  }
                })
            }else if(res.code == '60011'){
                _.alert("",res.desc)
            }else{
                _.alert('提示',res.desc)
            }
        })
    },

    // 更换外部联系人之后重置表单
    resetContactForm(){
      this.params.userOpenId = '';
      this.contactData.forEach((item) => {
        if(item.editName == 'contactsName'){
          item.value = ''
        }else if(item.editName == 'clientName'){
          item.value = ''
        }else if(item.editName == 'position'){
          item.value = ''
        }else if(item.editName == 'mobile'){
          item.value = ''
        }else if(item.editName == 'email'){
          item.value = ''
        }else if(item.editName == 'remark'){
          item.value = ''
        }
      })
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
    .wxContact{
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 25px;
    padding-right: 15px;
    padding-left: 15px;
    font-size: 13px;
    color:rgba(70,125,185,1);
    border-left: 1px solid #dadada;
    z-index: 2;
    .wx_contact_icon{
      background:url('../../../../../assets/images/crm/wx_contact.png') center no-repeat;
      background-size:13px 13px;
      width: 20px;
      height: 20px;
      vertical-align: bottom;
      display: inline-block;
    }
    }
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

