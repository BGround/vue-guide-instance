<template>
  <div class="wrap">
    <!-- toast顶部 -->
    <div class="qwui-warning" v-if="isWarnShow"><span class="waring-text">{{warnMsg}}</span></div>
    <div class="qwui-client_main" v-show="mainShow">
      <div class="qwui_btn_margin_bottom">
        <!--拜访单标题 拜访单内容 所属外勤单-->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in nav"
            :item="item"
            :key="idx"
            v-model="item.value"
          >
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>

        <!-- 拜访客户 拜访联系人 拜访时间 自定义字段 -->
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
        <div class="qwui-client_attachment qwui-photo">
          <div class="img-text">图片</div>
          <add-img-list
            v-if="imgUploadPicList && imgUploadPicList.length"
            :imageList="imgUploadPicList"
            @handleDeleteImage="handleDeleteImage"
            :disabled="false">
          </add-img-list>
          <add-img v-if="isPic" agent="crm" :orderId="orderId" :onlyPhotograph="onlyPhotograph"
                   :imageList="imgUploadPicList"
                   :camera="camera"
                   :deleteImage="deleteImage"
                   @updateImageList="setImgUploadValue"
          >
          </add-img>
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
    <!-- 地图 -->
    <tencent-map :pos="pos" v-if="positionShow" v-show="mapShow" @positionData="positionData" type=getAddress></tencent-map>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
                 :userListUrl="userListUrl"
                 :keyWordSearchUrl="keyWordSearchUrl"
                 :letterSearchUrl="letterSearchUrl"
                 v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 所属客户 -->
    <visit-tree v-show="typeTreeShow"
                :visitClientData="visitClientData"
                :fieldBelongData="fieldBelongData"
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
                :visitClientId="visitClientId"
                :hasmore="hasmore"
                ref="qwtree"
    ></visit-tree>
  </div>
</template>

<script>
  import CrmOperateItem from '../../base/CrmOperateItem';
  import userAdd from '@/components/add/user_select_build';
  import tencentMap from '@/components/add/tencentMap';
  import VisitTree from './VisitTree';
  import {
    getOldGivenList, // 添加上次负责人相关人接口
    addUserTo, // 当前登录人请求
    addOutsideWork, // 新增拜访
    getOutworkHistoryInfo, // 编辑页面的列表请求
    getOptionLists, // 字段请求
    searchOutworkList, // 所属外勤单列表
    searchClientList, // 拜访客户列表
    searchContactList, // 拜访联系人列表
    searchBusinessList,//拜访商机列表
    getOutworkDetail, // 选择所属外勤单得出拜访客户
    addToDraft, // 保存草稿
    updateOutsideWork, // 编辑拜访
    photoSetting, // 获取图片上传方式
    showClientPerson, // 选择完客户后，相关人的添加
    getClientInfo, // 详情页跳转新增，获取客户信息请求
  } from '../../../api/visit/getData';
  import {mapMutations,mapActions} from 'vuex'
  import img_detail from '@/components/add/add_img';
  import AddImgList from '@/components/add/upload/imgList';
  import AddImg from '@/components/add/upload/add_img';
  import file_detail from '@/components/add/add_file';
  import time_detail from '../../base/time_detail';
  import related_person_detail from '@/components/add/user_select_icon_right';
  import flow_button from '@/components/button/flow_button';
  import user_select from '@/components/base/user_or_dept_select';
  import * as timeUtil from '@/assets/js/time-util';
  import contactOperateData from './data';
  // 引入公共方法
  import { formatMoney, formatPercentage } from '../../../utils/index';

  // 存放所属外勤单的配置
  const fieldBelongConfig = {
    id: 'id',
    title: 'outworkTitle',
    checkType: 'radio',
    parentId:'parentId',
    subTitle:'personName'
  }

  // 存放拜访客户的配置
  const clientConfig = {
    id: 'id',
    title: 'clientName',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
    parentId:'parentId',
    subTitle:'clientCode'
  }

  // 存放拜访联系人的配置
  const contactConfig = {
    id: 'id',
    title: 'contactsName',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/touxiang02.png',
    parentId:'parentId',
    subTitle:'mobile'
  }
  // 存放拜访商机的配置
  const businessConfig = {
    id: 'id',
    title: 'title',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/touxiang02.png',
    parentId:'parentId',
    subTitle:''
  }
  export default {
    name:'VisitOperate',
    components:{
      userAdd,
      AddImg,
      AddImgList,
      VisitTree,
      img_detail,
      file_detail,
      time_detail,
      related_person_detail,
      flow_button,
      user_select,
      tencentMap,
      CrmOperateItem
    },
    data(){
      return {        
        isPic: false,
        onlyPhotograph: false, // 判断能否拍照上传，true：只能拍照，false，支持拍照跟图片库
        camera: ['album', 'camera'],
        orderId: '',       //图片水印参数
        imgUploadPicList:[],
        openIdParams:{
          openId:''
        },
        isPc: false,
        mapShow:false,
        positionShow: false,
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
                name:'拜访次数',
                placeholder:'按拜访次数搜索',
                value: 1
              },
              {
                name:'联系电话',
                placeholder:'按联系电话搜索',
                value: 2
              }
            ]
          },
        },
        sameId:true,
        creator: '', // 默认登陆者
        openId: '',
        checkConfirm: '' , // 储存点击树状组件的变量
        visitClientId: '', // 选中的拜访客户的id
        clientSelectData: [], // 选中的拜访客户的数据
        visitContactId: '', // 选中的拜访联系人的id
        contactSelectData: [], // 选中的拜访联系人的数据
        visitBusinessId: '', // 选中的拜访商机的id
        businessSelectData: [], // 选中的拜访商机的数据
        // visitClientValue: '', // 选中的拜访客户的详细信息
        visitValue: '', // 树状列表选中的详细信息
        fieldBelongId: '', // 选中的所属外勤单的id
        fieldSelectData: [], // 选中的所属外勤单的所有数据
        editData:'', // 编辑页面后台返回的数据
        editCustomList: [],
        searchBoxShow:true, // 搜索框的有无
        noData: false,
        clientListId: '',
        customAllList: [], // 存放自定义字段
        fixedAllList: [], // 存放未赋值的固定字段
        visitALlList: [], // 存放后台返回的固定字段和自定义字段
        visitData: [], // 存放页面渲染出来的固定字段和自定义字段
        belongClientId: [],
        typeData: [], // 所属客户列表
        getOutworkHistoryParams:{
          OutworkId: this.$route.query.visitId
        },
        visitClientData:[], // 拜访客户列表
        fieldBelongData:[], // 所属外勤单列表
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
        deleteImage:{},  //删除图片附件
        page:'',
        address: '', // 地图
        clientData: '',// 所有list字段
        fixedData: '',
        pos: {

        },
        params:{
          'tbOutsideWorkInfoPO.id':'',
          'tbOutsideWorkInfoPO.createPerson' : '',
          'tbOutsideWorkInfoPO.outworkId' : '',
          'tbOutsideWorkInfoPO.clientId': '', // 存放所属客户的Id
          'tbOutsideWorkInfoPO.clientAddress' : '',
          'tbOutsideWorkInfoPO.status': 0, // 编辑页面需要传，保存草稿0，保存1
          'tbOutsideWorkInfoPO.longitude': '', // 经纬度
          'tbOutsideWorkInfoPO.latitude': '',
          'tbOutsideWorkInfoPO.type': 2,
          'tbOutsideWorkInfoPO.hasItem': 1,
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
        parentMsg: '',
        typeTreeShow: false,
        districtShow: false, //区域显示
        nav: contactOperateData.contact.contactDetail.nav,  //  头部输入框
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
        editVisitId: false,
        editCopy: false,
        visitSetting: '', // 拜访列表请求的设置，开启拜访地址能否修改
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
    created:function(){
      // 判断是否是编辑页面
      window.location.href.indexOf('visitId') != -1 ? this.editVisitId = true : false;
      // 判断是否是复制页面 复制页面的保存按钮是新增，不是更新，请求还是编辑页面
      window.location.href.indexOf('copy') != -1 ? this.editCopy = true : false;
      // 假如是复制页面，则把title改成新建
      if(this.editCopy){
        document.title = '新建客户拜访'
      }
      // 初始化数据，包括选人以及点击事件
      this.init();
      // 请求列表请求
      getOptionLists((data) => {
        this.customAllList = data.newItemList;  // 请求后的自定义字段全部存在customAllList
        this.fixedAllList = data.basicList;  // 请求后的固定字段全部存在fixedAllList
        this.visitALlList = this.visitALlList.concat(this.customAllList,this.fixedAllList);  // 存放后台返回的所有字段，包括固定字段跟自定义字段
        if(data.visitSetting){
          this.visitSetting = data.visitSetting;
        }
        this.customList(); // 自定义字段处理
        this.fixedList();  // 固定字段处理，包括缓存处理
        this.visitData = this.visitData.concat(this.nav,this.communicationNav);  // 存放data的所有字段
        this.addUserToSelect(); // 创建人赋值负责人，包括拜访单处理的方法
        this.positionShow = true; // 字段加载后再渲染地图组件
        this.getClient(this.$route.query.clientId);
        if(!this.editVisitId){
          this.isPic = true
        }
      })
    },
    activated() {
     
      //刷新选择弹窗列表
    let _funName = {
          visitClientList:"visitClient", //拜访客户
          visitContactList:"visitContact",//联系人
         visitBusinessList :"visitBusiness",
        }[this.checkConfirm]
        if(_funName&&this.typeTreeShow){
          this.noData=false;
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
            this.visitTitle(); // 处理拜访单标题 , 标题不接受缓存，所以放在缓存处理后
            this.getOutworkEdit();  // 编辑页面请求
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
            // id: item.id
          }
          this.params.itemJson.list.push(obj);
        })
      },

      editCustomAllList(){
        //   将自定义字段赋到params.itemJson  编辑
        if(this.$route.query.visitId && !this.editCopy){
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

      // 固定字段方法处理
      fixedList(fixedAllList){
        fixedAllList = this.fixedAllList;
        let fixedLists = [];
        fixedLists = fixedLists.concat(this.nav,this.communicationNav.slice(0,6));
        fixedAllList.forEach((item) => {
          fixedLists.forEach((nitem) => {
            // 获取缓存
            this.routerName = this.$router.history.current.name;
            let storageValue = localStorage.getItem(this.routerName);
            let storageObj = storageValue? JSON.parse(storageValue) : {};
            let val = this.editVisitId ? '' : storageObj[nitem.key] || ''; // 编辑缓存
            this.$set(nitem,'value',val);
            if(item.optionName == nitem.optionName || item.optionName == '姓名'){
              nitem.isMust = item.isMust;
              item.status == '1' ? nitem.status = true : nitem.status = false;
            }
            // 一开始客户地址隐藏，拜访客户有地址的话再显示
            if(nitem.optionName == '客户地址'){
              nitem.status = false;
              nitem.isMust = 0
              // 客户地址不能编辑
              this.$set(nitem,'readonly','');
            }
            if(nitem.minTime == ''){
              nitem.value = _.getFormatDate(new Date(Date.now()), 'yyyy-MM-dd hh:mm')
            }
            if(nitem.optionName == '拜访地址' && this.visitSetting != ''){
              if(this.visitSetting.isDisable && this.visitSetting.isDisable == '0'){
                this.$set(nitem,'readonly','');
              }
            }
          })
        })
      },

      // 假如选中的拜访客户是跟上次一样的，就不清空联系人
      sameValue(val){
        this.sameId = val;
        // 假如选中的是跟上次一样的，就不清空联系人，不一样则清空
        if(!this.sameId){
          this.communicationNav[1].value = '';
          // 清空id数据
          this.visitContactId = ''
        }
      },

      // 树状组件传过来的值，currentValue代表所有值，selectedId代表其id
      currentSelected(currentValue,selectedId){
        if(currentValue.length>0){
          this.visitValue = currentValue;
          // 拜访客户确定后返回
          if(this.checkConfirm == 'visitClientList'){
            this.clientSelectData = currentValue;
            this.communicationNav[0].value = currentValue[0].clientName
            this.visitClientId = selectedId;
            // 选择拜访客户后，假如客户有地址，则显示字段客户地址并赋值，否则隐藏
            this.selectClient();
            // 选择完客户后，相关人根据请求赋值
            this.showAboutPerson();
            //选择完客户后，拜访商机清空需要重新选择
            this.visitBusinessId = '';
            this.businessSelectData = '';
            this.communicationNav[2].value = ''
          }else if(this.checkConfirm == 'fieldListBelongList'){ // 所属外勤单确定后返回
            this.fieldSelectData = currentValue;
            this.visitData.forEach((item) => {
              if(item.optionName == '所属外勤单' && item.status == true){
                item.value = currentValue[0].outworkTitle
              }
              this.fieldBelongId = selectedId;
            })
            this.selectFeild();
          }else if(this.checkConfirm == 'visitContactList'){ // 拜访联系人确定后返回
            this.visitContactId = selectedId;
            this.contactSelectData = currentValue;
            this.communicationNav[1].value = currentValue[0].contactsName
          }else if(this.checkConfirm == 'visitBusinessList'){
            this.visitBusinessId = selectedId;
            this.businessSelectData = currentValue;
            this.communicationNav[2].value = currentValue[0].title
          }
        }
      },

      // 选择所属外勤单后，渲染拜访客户跟改变拜访单标题
      selectFeild(){
        let obj = {
          id: this.fieldBelongId
        }
        // 点击第一次请求 page为1
        getOutworkDetail(obj)
          .then(res => {
            if(res.code == '0'){
              // 选择所属外勤单后，渲染拜访客户
              this.communicationNav[0].value = res.data.outwork.clientName;
              // 假如选了所属外勤单，渲染的客户是有地址的，则渲染多拜访地址
              if(res.data.outwork.address){
                this.selectClient();
              }
              this.visitClientId = res.data.outwork.clientId;
              // 改变所属客户，也要改变相关人，未开
              // this.showAboutPerson();
              let clientObj = {
                clientName: res.data.outwork.clientName,
                id: this.visitClientId
              }
              this.clientSelectData = [];
              this.clientSelectData.push(clientObj)
              // 选择所属外勤单后，拼接拜访单标题 编辑页面不改变
              if(!this.$route.query.visitId){
                var arr = this.nav[0].value.split('_');
                arr.splice(1,0,res.data.outwork.clientName+'拜访单');
                let arr2 = [];
                arr2[0] = arr[0];
                arr2[1] = arr[1];
                arr2[2] = arr[arr.length-1]
                this.nav[0].value = arr2.join('_')
              }
            }
            else{
              _.alert('提示',res.desc);
            }
          })
      },

      // 选择拜访客户后，假如客户有地址，则显示字段客户地址并赋值，否则隐藏
      selectClient(){
        let obj = {
          id : this.visitClientId
        }
        this.fixedAllList.forEach((item) => {
          if(item.optionName == '客户地址' && item.status == 1){
            this.communicationNav.forEach((citem) => {
              if(citem.optionName == '客户地址' && this.visitValue[0].address != ''){
                citem.status = true;
                this.$set(citem,'value',this.visitValue[0].address,citem);
              }else if(citem.optionName == '客户地址' && this.visitValue[0].address == ''){
                citem.status = false
              }
            })
          }
        })
        // 选择拜访客户后，拼接拜访单标题
        this.visitTitle();
        var arr = this.nav[0].value.split('_');
        arr.splice(1,0,this.communicationNav[0].value+'拜访单');
        let arr2 = [];
        arr2[0] = arr[0];
        arr2[1] = arr[1];
        arr2[2] = arr[arr.length-1]
        this.nav[0].value = arr2.join('_')
      },

      // 详情新增拜访带过来的clientId
      getClient(val){
        if(val){
          let obj = {
            id: val
          }
          getClientInfo(obj).then(res => {
            if(res.code == '0'){
              this.visitClientId = res.data.client.id; // 客户id赋值
              this.showAboutPerson();
              // 拜访客户的赋值
              this.communicationNav.map(item => {
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
              this.visitTitle();
              var arr = this.nav[0].value.split('_');
              arr.splice(1,0,this.communicationNav[0].value+'拜访单');
              let arr2 = [];
              arr2[0] = arr[0];
              arr2[1] = arr[1];
              arr2[2] = arr[arr.length-1]
              this.nav[0].value = arr2.join('_')
            }else{
              _.alert('提示',res.desc);
            }
          })
        }
      },

      // 拜访单标题
      visitTitle(){
        var nowDate = _.getFormatDate(new Date(Date.now()), 'yyyy-MM-dd-hh-mm-ss');
        this.nav[0].value = this.creator + '_' + nowDate.split('-').join('');
      },

      // 按确认键
      treeListShow(val){
        this.mainShow = !val;
        this.typeTreeShow = val;
      },

      // 图片上传
      setImgUploadValue(val){
        console.log(val)
        this.imgUploadPicList = val
        let arr = [];
        this.imgUploadPicList.forEach((item) => {
          arr.push(item.src)
        })
        this.params['imageUrls'] = arr.join();
      },

      // 校验数据
      validateData () {
        // 弹窗
        if(!this.isWarnShow){
          for(let i = 0;i<this.visitData.length;i++){
            if(this.visitData[i].isMust == 1 && !this.visitData[i].value){
              _.alert("提示信息","请输入"+this.visitData[i].optionName);
              return false;
            }
          }
          // 若后台传来的拜访图片是必填，则必须选择拜访图片
          for(let i = 0;i<this.visitALlList.length;i++){
            if(this.visitALlList[i].optionName == '图片' && this.visitALlList[i].isMust == '1' && this.imgUploadPicList.length == 0 ){
              _.alert("提示","请上传图片");
              return false;
            }
          }
          // 负责人最少必须选择一个
          if(this.dataBase.selectConfig.selectList["toPersonList"].userSelected.length < 1){
            _.alert("提示","至少要一个负责人才能保存");
            return false;
          }
          return true;
        }
      },

      // 固定字段跟自定义字段赋值到params
      visitListParams(){
        this.visitData.forEach((item) => {
          this.params[item.key] = item.value;  //  固定字段赋值到params
          this.params['tbOutsideWorkInfoPO.outworkId'] = this.fieldBelongId; // 所属外勤单的ID
          this.params['tbOutsideWorkInfoPO.clientId'] = this.visitClientId; // 拜访客户的ID
          this.params['tbOutsideWorkInfoPO.contactId'] = this.visitContactId; // 拜访联系人的ID
          this.params['tbOutsideWorkInfoPO.businessId'] =this.visitBusinessId//拜访商机的ID
          //this.params['businessJson'] = JSON.stringify({"businessId": this.visitBusinessId,"businessName":this.communicationNav[5].value})
          this.params.creator = this.creator;
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
          // 编辑页面自定义赋值的时候会传多一个id
          if(this.$route.query.visitId){
            this.params['tbOutsideWorkInfoPO.id'] = this.editData.vo.id;
          }
        })
        // 后台接收参数问题，得在秒后面加多:00
        if(this.params['tbOutsideWorkInfoPO.outworkTime'] != ''){
          this.params['tbOutsideWorkInfoPO.outworkTime'] = this.params['tbOutsideWorkInfoPO.outworkTime'].substr(0)+':00';
        }
        // 联系人id的赋值
        if(this.$route.query.visitId){
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

      // 图片赋值params
      picParams(){
        let picArr = []
        this.imgUploadPicList.forEach((item) => {
          picArr.push(item.src)
        })
        this.params['imageUrls'] = picArr.join();
      },

      // 编辑页面请求
      getOutworkEdit(){
        if(this.$route.query.visitId){
          // 编辑已提交的页面的时候没有保存草稿按钮，编辑草稿的时候是有按钮的
          if(!this.$route.query.status && !this.editCopy){
            this.$set(this.contactDetail.buttonConfig,'defaultList','')
          }
          // 编辑请求列表
          getOutworkHistoryInfo(this.getOutworkHistoryParams,(data) => {
            this.editData = data; // 编辑所有数据赋值给editData
            this.editCustomList = data.itemList;
            // 编辑页面  固定自定义字段赋值
            for(let i=0;i<this.visitData.length;i++){
              this.visitData[i].value = data.vo[this.visitData[i].editName] // 固定字段赋值
              // 固定字段中的生日赋值
              if(this.visitData[i].type == 'dateTime' && this.visitData[i].optionName == '拜访时间'){
                this.visitData[i].value = data.vo.outworkTime.substr(0,16)
                this.birthEditTimeVal = data.vo.outworkTime.substr(0,16)
              }
              // 自定义字段赋值
              for(let j=0;j<data.itemList.length;j++){
                if(this.visitData[i].optionName == data.itemList[j].fieldName && this.visitData[i].optionName!='生日'){
                  this.visitData[i].value = data.itemList[j].fieldValue
                  // 自定义字段中的时间赋值
                  if(this.visitData[i].type == 'dateTime'){
                    this.editTimeVal = data.itemList[j].optionVal
                  }
                }
              }
            }
            // 负责人赋值
            if(data.vo.toPersons){
              this.$set(this.dataBase.selectConfig.selectList["toPersonList"],'userSelected',[])
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
            // 照片赋值 先清空
            if(data.vo.picList.length > 0){
              if(!this.editCopy){
                this.imgUploadPicList = [];
                data.vo.picList.forEach((item) => {
                  let obj = {
                    src:item.picPath
                  }
                  this.imgUploadPicList.push(obj)
                })
              }
            }
            // 将编辑请求的外勤单id传到子组件
            if(data.vo.outworkId){
              this.fieldBelongId = data.vo.outworkId
            }
            // 将编辑请求的拜访客户id传到子组件
            if(data.vo.clientId){
              this.visitClientId = data.vo.clientId
            }
            // 将编辑请求的拜访联系人id传到子组件
            if(data.vo.contactId){
              this.visitContactId = data.vo.contactId
            }
            // 将编辑请求的拜访联系人id传到子组件
            if(data.vo.businessId){
              this.visitBusinessId = data.vo.businessId
            }
            this.isPic = true;
          })
        }
      },

      // 保存
      save(){
        this.visitListParams(); // params的赋值
        let isPass = this.validateData();
        if(!isPass) return;
        this.incharges(); // 负责人处理
        this.relatives(); // 相关人处理
        this.picParams(); // 照片上传处理
        this.editCustomAllList(); // 编辑页面的自定义字段赋值
        this.params.itemJson = JSON.stringify(this.params.itemJson);
        this.params.status = 1; // 保存草稿是0，保存是1
        this.params['tbOutsideWorkInfoPO.status'] = 1;
        // 编辑页面保存是更新，复制页面与新增页面是直接新增
        if(this.$route.query.visitId && !this.editCopy){
          _.showLoading('提交中');
          updateOutsideWork(this.params).then(res => {
            if(res.code == '0'){
              // this.isUsed = false;
              this.delCacheArray('VisitList');
              this.$router.go(-1);
              // this.$router.replace({path: '/visitList/isread',query:{status:'1',appId:'1'}});
              // // 清除缓存
              localStorage.removeItem(this.routerName);
            }else{
              _.alert('提示',res.desc);
            }
            _.hideLoading();
          })
        }else{
          _.showLoading('提交中');
          addToDraft(this.params).then(res => {
            if(res.code == '0'){
              this.delCacheArray('VisitList');
              // 编辑、列表页进入 返回
              if (['list','detail','select'].includes(this.$route.query.from)) {
                this.$router.go(-1);
              } else {
                this.$router.replace({path: '/visitList/isread',query:{status:'1',appId:'1'}});
              }
              // // 清除缓存
              localStorage.removeItem(this.routerName);
            }
            else{
              _.alert('提示',res.desc);
            }
            _.hideLoading();
          })
        }

      },

      // 保存为草稿 保存草稿带status=0
      saveDraft(){
        this.visitListParams();
        this.incharges(); // 负责人处理
        this.relatives(); // 相关人处理
        this.picParams(); // 照片上传处理
        this.params.itemJson = JSON.stringify(this.params.itemJson);
        // 保存草稿 编辑页面的保存草稿是更新接口，新增页面的保存草稿是新增接口
        _.showLoading('提交中');
        if(this.editVisitId){
          updateOutsideWork(this.params).then(res => {
            if(res.code == '0'){
              this.delCacheArray('VisitList');
              if(this.$route.query.from==="select"){
                this.$router.go(-1);
              }else{
                this.$router.replace({path: '/visitList/isread',query:{status:'0',appId:'1'}});
              }
              // // 清除缓存
              localStorage.removeItem(this.routerName);
            }else{
              _.alert('提示',res.desc);
            }
            _.hideLoading();
          })
        }else{
          addToDraft(this.params).then(res => {
            if(res.code == '0'){
              // this.isUsed = false;
              this.delCacheArray('VisitList');
              if(this.$route.query.from==="select"){
                this.$router.go(-1);
              }else{
                this.$router.replace({path: '/visitList/isread',query:{status:'0',appId:'1'}});
              }
              // // 清除缓存
              localStorage.removeItem(this.routerName);
            }
            else{
              _.alert('提示',res.desc);
            }
            _.hideLoading();
          })
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
        this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次"};
        this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
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
        // 图片上传方式 可否支持拍照上传
        this.getPhotoType();
        // 给按钮绑定事件
        this.contactDetail.buttonConfig.primaryList[0].callBack = this.save; // 保存
        this.$set(this.contactDetail.buttonConfig,'defaultList',[{type:"default",name:'保存为草稿', callBack:null}]) // 初始化保存草稿按钮
        this.contactDetail.buttonConfig.defaultList[0].callBack = this.saveDraft; // 保存为草稿
        // 拜访单内容绑定事件，失去焦点触发
        this.nav[1].clickEvent = this.visitContent;
        // 所属外勤单绑定事件
        this.nav[2].clickEvent = this.fieldListBelong;
        // 拜访客户绑定事件
        this.communicationNav[0].clickEvent = this.visitClient;
        // 拜访联系人绑定事件
        this.communicationNav[1].clickEvent = this.visitContact;
        // 拜访商机绑定事件
        this.communicationNav[2].clickEvent = this.visitBusiness;
      },

      // 拜访内容失去焦点,假如标题为空，则截取15个字符赋值标题
      visitContent(){
        if(this.nav[0].value == ''){
          this.nav[0].value = this.nav[1].value.substr(0,15);
        }
      },

      // 点击所属外勤单
      fieldListBelong(){
        // 初始化搜索框
        this.searchBar= {
          show: true,
          ridMask: true
        }
        this.checkConfirm = 'fieldListBelongList';
        this.$refs.qwtree.lock_roll = true;
        this.typeTreeShow = true; // 显示tree
        this.treeListIsShow = true;
        this.mainShow = false;
        // 重置数据 【必要的】
        this.resetTreeConfigData()
        // 所属外勤单配置
        this.changeConfig(fieldBelongConfig);
        let obj = {
          page: 1,
          key: '',
          pageSize: 15
        }
        // 点击第一次请求 page为1
        searchOutworkList(obj)
          .then(res => {
            if(res.code == '0'){
              if(res.data.pageData){
                this.handleGetData(res.data.pageData);
                this.fieldBelongData = res.data.pageData;
                this.updateSelectValue(this.fieldBelongId);
                this.updateCurrentSelected(this.fieldSelectData);
              }else{ // 请求无数据
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

      // 点击拜访客户
      visitClient(){
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
                name:'拜访次数',
                placeholder:'按拜访次数搜索',
                value: 1
              },
              {
                name:'联系电话',
                placeholder:'按联系电话搜索',
                value: 2
              }
            ]
          },
        },
        this.checkConfirm = 'visitClientList';
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
          ctype: 3,
          workInfo: 1,
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
                this.visitClientData = res.data.pageData;
                this.updateSelectValue(this.visitClientId);
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

      // 点击拜访联系人
      visitContact(){
        // 初始化搜索框
        this.searchBar= {
          show: true,
          ridMask: true
        }
        // 假如客户为空的时候，则弹窗提示
        if(this.communicationNav[0].value == ''){
          _.alert('提示',"请先选择拜访客户");
        }else{
          this.checkConfirm = 'visitContactList';
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
            selectClientId: this.visitClientId,
            pageSize: 15
          }
          // 点击第一次请求 page为1
          searchContactList(obj)
            .then(res => {
              if(res.code == '0'){
                if(res.data.pageData){
                  this.handleGetData(res.data.pageData)
                  this.visitClientData = res.data.pageData;
                  this.updateSelectValue(this.visitContactId);
                  this.updateCurrentSelected(this.contactSelectData);
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
        }
      },
      visitBusiness(){
        // 初始化搜索框
        this.searchBar= {
          show: true,
          ridMask: true
        }
        // 假如客户为空的时候，则弹窗提示
        if(this.communicationNav[0].value == ''){
          _.alert('提示',"请先选择拜访客户");
        }else{
          this.checkConfirm = 'visitBusinessList';
          this.$refs.qwtree.lock_roll = true;
          this.typeTreeShow = true; // 显示tree
          this.treeListIsShow = true;
          this.mainShow = false;
          // 重置数据 【必要的】
          this.resetTreeConfigData()
          this.changeConfig(businessConfig)
          let obj = {
            page: 1,
            selectClientId: this.visitClientId,
            pageSize: 15
          }
          searchBusinessList(obj).then(res => {
            if(res.code == '0'){
              if(res.data.pageData){
                this.handleGetData(res.data.pageData)
                // this.visitClientData = res.data.pageData;
                this.updateSelectValue(this.visitBusinessId);
                this.updateCurrentSelected(this.businessSelectData);
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
        }
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
      // 腾讯地图自动定位拜访地址
      positionData(val){
        this.communicationNav.forEach((item) => {
          if(item.optionName == '拜访地址' && item.status == 1)
            // 经度 longitude，浮点数，范围为180 ~ -180。纬度 latitude，浮点数，范围为90 ~ -90
            // 只有经纬度符合标准才会将位置信息传入
            var longitude = parseFloat(val.longitude);
            var latitude = parseFloat(val.latitude);
            if( longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90  ){
              item.value = val.value
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

      // 图片删除
      handleDeleteImage(item){
        this.imgUploadPicList.splice(item.index,1)
      },

      // 获取图片上传方式
      getPhotoType(){
        let obj = {
          agentCode: 'crm'
        }
        // is_photograph:0 允许选择图片 is_photograph:1  只能拍照上传
        photoSetting(obj)
          .then(res => {
            if(res.code == '0'){
              this.onlyPhotograph = res.data.is_photograph == '1' ? true : false;
              if(res.data.is_photograph == '1'){
                this.onlyPhotograph = true;
                this.camera = ['camera'];
              }else{
                this.onlyPhotograph = false;
                this.camera = ['album', 'camera'];
              }
            }
            else{
              _.alert('提示',res.desc);
            }
          })
      },

      // 选择客户后，相关人的添加
      showAboutPerson(){
        let obj = {
          id: this.visitClientId
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
  .qwui-title_detaildata{padding-left:15px;}
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
  .qwui-photo{
    padding: 0 0 15px 15px !important;
  .img-text{
    padding: 14px 0 0 0 !important;
    display: block !important;
    font-size:16px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
  }
  }
  /*照片附件*/
  .qwui-client_attachment{
    position:relative;
    background-color: #fff;
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