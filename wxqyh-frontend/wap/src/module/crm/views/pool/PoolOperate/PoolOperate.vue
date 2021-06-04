<template>
  <div class="wrap adapt_iphonex">
    <!-- toast提示条 -->
    <div class="qwui-warning" v-if="isWarnShow"><span class="waring-text">{{warnMsg}}</span></div>
    <div class="qwui-client_main" v-show="mainShow">
      <div class="qwui_btn_margin_bottom">
        <!--客户基本资料-->
        <div class="qwui-client_detail">
          <crm-operate-item
            v-for="(item,idx) in nav"
            v-model="item.value"
            :dataDetailMsg="add_nav"
            :item="item"
            :key="idx"
          >
            <!-- 客户名称重复提示 -->
            <div v-show="slotShow" class="repeatTips" @click="clientRepeat(item.value)">
              <p>
                客户名称已存在，点击查看
                <span class="repeatTipsIcon"></span>
              </p>
            </div>
          </crm-operate-item>
          <div class="qwui-separate_bar" v-show="onlyNav"></div>
        </div>


        <!--客户区域地址行业-->
        <div class="qwui-client_location">
          <!-- 省市区三级联动 -->
          <distpicker v-if="districtShow"
          :listenDistrictMust="listenDistrictMust"
          :area="area"
          @inputDispicker="inputDispicker"
          ></distpicker>
          <!-- 地址跟行业 -->
          <crm-operate-item
            v-if="item.status"
            :dataDetailMsg="add_nav"
            v-for="item in centerNav"
            :item="item"
            :key="item.id"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar" v-show="centerNavShow"></div>
        </div>


        <!-- 联系电话 邮箱 网址 备注 -->
        <div class="qwui-client_communication">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="item in communicationNav"
            :item="item"
            :key="item.id"
            :editTimeVal="editTimeVal"
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
          <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail"></img_detail>
          <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
        </div>


        <!--选人组件-->
        <user-add :userselect="dataBase.selectConfig"
        @selectPerson="selectPerson"
        @confirmPick="confirmPick"
        @selectUserClick="selectUserClick"
        ></user-add>
      </div>

      <!--底部操作按钮-->
        <div class="footer_btn_wrap">
          <qwui-button
              type="primary"
              text="保存并关闭"
              @buttonClick="keepClose"
          >
          </qwui-button>
        </div>

    </div>
    <!-- 地图 -->
    <tencent-map :pos="pos" v-show="!mapHide" @closeMap='closeMap' @positionData="positionData"></tencent-map>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
    :closeAllTab="true"
    :closeGroup="true"
    :closeDept="true"
    :tabActive="'user'"
    :userSelectType="'onlyUser'"
    :userListUrl="userListUrl"
    :keyWordSearchUrl="keyWordSearchUrl"
    :letterSearchUrl="letterSearchUrl"
    v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 客户类别 -->
    <pool-tree v-show="typeTreeShow"
    @currentSelected="currentSelected"
    @treeListShow='treeListShow'
    :noData.sync="noData"
    :treeListIsShow.sync="treeListIsShow"
    :searchBoxShow.sync="searchBoxShow"
    :check-confirm="checkConfirm"
    ref="qwtree"
    ></pool-tree>
  </div>
</template>

<script>
import CrmOperateItem from '../../base/CrmOperateItem';
import userAdd from '@/components/add/user_select_build';
import tencentMap from '@/components/add/tencentMap';
import QwuiButton from '@/components/base/button/button';
import PoolTree from './PoolTree';
import {getClientBriefing,
        getAddClient,
        getClientDetail,
        getOldGivenList,
        getClientHistoryInfo,
        getValidClientName,
        getTypeList,
        getChargePoolList,
        getIndustryList,
        getClientUpdate,
} from '../../../api/pool/getData';
import {mapMutations,mapActions} from 'vuex'
import distpicker from '../../base/distpicker';
import img_detail from '@/components/add/add_img';
import file_detail from '@/components/add/add_file';
import related_person_detail from '@/components/add/user_select_icon_right';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import clientOperateData from './data';
// 引入公共方法
import { formatMoney, formatPercentage } from '../../../utils/index';
  // 存放公海配置
  const poolConfig = {
    id: 'id',
    title: 'poolName',
    hasChildren: 'false',
    checkType: 'radio',
    headPic:'',
    parentId:'orgId',
    subTitle:'clientNum'
  }
  // 存放行业配置
  const industryConfig = {
    id: 'id',
    title: 'industry',
    hasChildren: 'hasChildren',
    checkType: '',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',
    parentId:'fatherid'
  }

export default {
  name: 'ClientOperate',
  components:{
    userAdd,
    distpicker,
    PoolTree,
    img_detail,
    file_detail,
    related_person_detail,
    flow_button,
    user_select,
    tencentMap,
    CrmOperateItem,
    QwuiButton
  },
  data(){
    return {
      poolSelectData: [], // 公海选择的数据
      industrySelectData: [], // 行业选择的数据
      beforeClientData: [],
      noData: false, // 请求列表无数据
      poolSelectedId: '', // 层级组件返回的id
      poolCurrentValue: '', // 层级组件返回的所有值
      allLists: [], // 全部字段
      fixLists: [], // 固定字段
      customLists: [], // 自定义字段
      code:'', // 存放客户编码的时间
      editItemList: [], //存放编辑的自定义字段
      typeListIds:[], // 存放客户类别
      industryListIds:[], // 存放行业
      getClientHisList: [], // 存放编辑页面请求回来的数据
      userListUrl:'/portal/selectUserAction!ajaxGetUserListByOrgID.action',
      keyWordSearchUrl:'/portal/selectUserAction!searchByNameOrPhone.action',
      letterSearchUrl:'/portal/selectUserAction!searchFirstLetter.action',
      typeId:'',
      poolId:'',
      industryId:[],  // 行业id
      typesSelected:'',
      poolsSelected:'',
      industriesSelected: '',  // 树状组件将已选中的值传回父组件
      dataBase:dataBase,
      advise: false,  // 是否通知相关人按钮
      slotShow: false, // 客户重复提示
      keyword:{
        type: 0,
        clientName: ''
      },
      page:'',
      centerNavShow: true, // 分割线隐藏，行业地址区域板块隐藏的时候就为false
      onlyNav: true, // 分割线隐藏，行业地址区域板块以及自定义字段隐藏的时候就为false
      address: '', // 地图
      clientData: '',// 所有list字段
      fixedData: '', // 固定字段
      params:{
        'clientPO.longitude': '', //　经纬度
        'clientPO.latitude': '',　//　经纬度
        'clientPO.industry':'',
        'clientPO.id':'',
        'clientPO.hasItem':1,
        agentCode: 'client',
        isPhotograph: 1,
        typeId:'',
        poolId:'',
        strItem:'4,5,6,7,8,9,10,11,14',
        typeIds:'',
        isClient:'',
        typeIsMust:0,
        contact_province_code:360000,
        contact_city_code:360100,
        file:'',
        industrys:'',
        oldPhone:'',
        toSelectId:0,
        ccSelectId:0,
        // 详情页面传值，获取id
        page: 1,
        id: '',
        givenUserIds:'', // 传的是相关人id
        itemJson:{
          "list":[]
        }
      },
      treeListIsShow: true,
      searchBoxShow:true,
      checkConfirm: '',
      poolData: [], // 所有字段列表，包括固定字段跟自定义字段
      industryData: [], // 行业列表
      isWarnShow: false, // 格式错误的顶部toast提示
      warnMsg: '', // 格式错误的字体提示
      typeTreeShow: false,
      listenDistrictMust: '', // 传入区域组件做逻辑处理
      districtShow: true, //区域显示
      nav: clientOperateData.client.clientDetail.nav,  //  头部输入框
      centerNav: clientOperateData.client.clientDetail.centerNav,  // 区域地址行业输入框
      communicationNav: JSON.parse(JSON.stringify(clientOperateData.client.clientDetail.communicationNav)),  // 通讯方式输入框
      clientDetail: clientOperateData.client.clientDetail,
      mainShow: true,
      mapHide: true,
      timeVal: '',
      editTimeVal: '',
      relativesSelected: '', // 相关人
      userSelected: '',
      add: clientOperateData.client.clientDetail, // 传入组件的详细数据
      area:[],
      add_nav:{ //数据详情头部信息
        title:"",
        content:"",
      },
      routerName: '',  // 当前路由的名称
      pos: {
        latitude: 23.128144,
        longitude: 113.359308,
        value: '广东省广州市天河区员村一横路3号'
      },
      editPoolClientId: '',
      oldRouter: '',  // 记录进入新增编辑页路由
      isUsed: true, // 判断是否记录上一次的路由
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.oldRouter = from.name;
    })
  },
  beforeRouteLeave (to, from, next) {
    // 启用的话就跳转到上一次路由
    if(this.isUsed){
      if(to.name === this.oldRouter){
        next();
      }
      else{
        next({name: this.oldRouter});
      }
    }
    else{
      next();
    }
  },
  created:function(){
    window.location.href.indexOf('poolId')!=-1 ? this.editPoolClientId = true : false;  // 判断是否是编辑页面
    // 初始化数据
    this.init();
    this.clientCode();
    this.getClientList();
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
    // 请求列表接口
    getClientList(){
      getClientBriefing((data) => {
        this.listenDistrictMust = data;
        this.allLists = data; // 后台返回的所有字段
        this.fixLists = data.basicList; // 后台返回的所有固定字段
        this.customLists = data.list; // 后台返回的所有自定义字段
        this.beforeClientData = this.clientDetail.nav.concat(this.clientDetail.centerNav,this.communicationNav); //渲染自定义字段前的data字段
        // 判断区域是否显示 区域单独组件
        if(data.basicList.length>0){
          data.basicList.forEach((item) => {
            if(item.optionName == '区域'){
              item.status == '1' ? this.districtShow = true : this.districtShow = false;
            }
          })
        }
        // 固定字段渲染
        this.fixList();
        // 自定义字段渲染
        this.customList();
        // 存放所有字段
        this.poolData = this.poolData.concat(this.nav,this.centerNav,this.communicationNav);
        // 判断中间分割线是否隐藏
        this.centerNavIsShow();
        // 中间板块以及自定义字段隐藏的时候分割线处理
        this.NavIsShow();
        // 自定义参数的命名，并赋值到params
        this.addParams();
        // 编辑页面请求
        this.getHisList();
      })
    },

    // 自定义参数命名
    addParams(){
      for(let i = 0;i<this.allLists.list.length;i++){
        let obj = {
          fieldName:this.allLists.list[i].optionName,
          fieldValue:this.allLists.list[i].value
        }
        this.params.itemJson.list.push(obj);
      }
    },

    // 编辑页面赋值
    getHisList(){
      if(this.editPoolClientId){
      // this.params.id = window.location.href.split('?')[2].split('=')[1];
      let editObj = {
        clientId: this.$route.query.poolId
      }
      // 编辑页面列表请求
      getClientHistoryInfo(editObj).then(res => {
        if(res.code == '0'){
          this.getClientHisList = res.data;
          if(res.data.itemList && res.data.itemList.length>0){
            res.data.itemList.forEach((item) => {
              this.editItemList.push(item)
            })
          }
          // 固定字段的赋值 省市区除外
          this.poolData.forEach((item) => {
            for(let i in res.data.tbCrmPoolClientInfoPO){
              if(i == item.editName){
                item.value = res.data.tbCrmPoolClientInfoPO[i]
              }
            }
          })
          // 省市区赋值必须把值传回子组件做处理
          this.area.push(res.data.tbCrmPoolClientInfoPO.provinceCode,res.data.tbCrmPoolClientInfoPO.cityCode,res.data.tbCrmPoolClientInfoPO.areaCode);
          // 编辑页面需要clientPO.id
          this.params['clientPO.id'] = res.data.tbCrmPoolClientInfoPO.id;
          // 自定义字段处理
          if(res.data.itemList){
            this.communicationNav.forEach((citem) => {
              res.data.itemList.forEach((item) => {
                if(citem.optionName == item.fieldName){
                  citem.value = item.fieldValue
                  if(citem.type == 'dateTime'){
                    this.editTimeVal = item.optionVal
                  }
                }
              })
            })
          }

        // 行业id赋值
        if(res.data.tbCrmPoolClientInfoPO.industryList){
          // 数组变量存放行业数组
          let industryArr = [];
          res.data.tbCrmPoolClientInfoPO.industryList.map(item => {
            // 需要拼接后台传过来的格式
            let obj = {
              code: item.industryId,
              industry: item.industry
            }
            industryArr.push(obj)
          })
          this.industrySelectData = industryArr;
          res.data.tbCrmPoolClientInfoPO.industryList.forEach((item) => {
            this.industryListIds.push(item.industryId);
          })
          this.industryId = this.industryListIds;
        }

        // 公海id赋值
        if(res.data.tbCrmPoolClientInfoPO.poolId){
          this.poolId = res.data.tbCrmPoolClientInfoPO.poolId;
          this.params.poolId = this.poolId;
        }

        // 相关人赋值
        if(res.data.tbCrmPoolClientInfoPO.ccPersons){
          res.data.tbCrmPoolClientInfoPO.ccPersons.forEach((item) => {
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
          })
        }

        // 照片赋值
        if(res.data.tbCrmPoolClientInfoPO.picList){
          this.add.imgUpload.picList = [];
          res.data.tbCrmPoolClientInfoPO.picList.forEach((item) => {
            this.add.imgUpload.picList.push(item)
          })
        }

        // 附件赋值
        if(res.data.mediaList){
          this.add.fileUpload.mediaList = [];
          res.data.mediaList.forEach((item) => {
            this.add.fileUpload.mediaList.push(item)
          })
        }

        // 经纬度赋值
        if(res.data.tbCrmPoolClientInfoPO.latitude){
          this.params['clientPO.latitude'] = res.data.tbCrmPoolClientInfoPO.latitude
        }
        if(res.data.tbCrmPoolClientInfoPO.longitude){
          this.params['clientPO.longitude'] = res.data.tbCrmPoolClientInfoPO.longitude
        }

        }else{
          _.alert('提示',res.desc);
        }

      })
    }
    },

    // 固定字段渲染
    fixList(){
      this.fixLists.forEach((item) => {
        this.beforeClientData.forEach((bitem) => {
          if(item.optionName == bitem.optionName && item.optionName != '客户编码'){
            // 获取缓存
            this.routerName = this.$router.history.current.name;
            let storageValue = localStorage.getItem(this.routerName);
            let storageObj = storageValue? JSON.parse(storageValue) : {};
            let val = this.editPoolClientId? '' : storageObj[bitem.key] || ''; // 编辑缓存
            this.$set(bitem,'value',val);
            item.status == '1' ? bitem.status = true : bitem.status = false; // 判断固定字段是否显示
            item.isMust == '1' ? bitem.isMust = 1 : bitem.isMust = 0 // 判断固定字段星号是否加载
          }
        })
      })
    },

    // 自定义字段渲染
    customList(){
      let placeholderName = '';
      if(this.customLists.length>0){
        this.customLists.forEach((item) => {
          // 判断自定义字段的placeholder
          item.list.length>0 ? placeholderName = item.list[0].name
          : placeholderName = '请输入'+item.optionName
          // 根据后台返回的type判断显示类型
          if(item.type == 1){
            item.type = 'input'
          }else if(item.type == 2){
            item.type = 'textarea'
          }else if(item.type == 0){
            item.type = 'select'
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
          // 给每个自定义字段加属性
          item = Object.assign({}, item, { placeholder: placeholderName, maxLength:'250',value: '' })//处理视图更新，得重创对象接收
          this.communicationNav.push(item);
          this.clientData = this.nav.concat(this.centerNav,this.communicationNav); // 所有字段list
          this.fixedData = this.nav.concat(this.centerNav); // 固定字段list
          // 自定义字段的显示隐藏
          this.communicationNav.forEach((citem) => {
            if(item.optionName == citem.optionName){
              item.status == '1' ? citem.status = true : citem.status = false
            }
            // 判断自定义字段的星号加载
            if(item.optionName == citem.optionName){
              item.isMust == '1' ?
              citem.isMust = 1 : citem.isMust = 0;
            }
          })
        })
      }
    },

    // 子组件选中后传过来的值跟id
    currentSelected(currentValue,selectedId){
      this.poolCurrentValue = currentValue;
      if(this.checkConfirm == 'poolList'){
        this.poolSelectData = currentValue
        this.nav[1].value = currentValue[0].poolName;
        this.poolId = selectedId;
      }else if(this.checkConfirm == 'industryList'){
        this.industrySelectData = currentValue
        this.selectedStrHandle();
        this.industryId = selectedId;
      }
    },
    // 处理层级组件返回的值赋值到value
    selectedStrHandle(){
      let industryStr = '';
      let industryArr = [];
      this.poolCurrentValue.forEach((item) => {
        industryArr.push(item.industry);
        industryStr = industryArr.join('|');
      })
      this.centerNav.forEach((item) => {
        if(item.editName == 'industry')
        item.value = industryStr;
      })
    },

    // 客户查重跳转
    clientRepeat(item){
      this.$router.push({ name:"checkList",params:{keyword:item}});
    },

    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
    },
    // 关闭地图
    closeMap(){
      this.mainShow = true;
      this.mapHide = true;
      if(this.address == ''){
        this.centerNav[0].value = this.pos.value
        this.params['clientPO.longitude'] = this.pos.longitude;
        this.params['clientPO.latitude'] = this.pos.latitude
      }else{
        this.centerNav[0].value = this.address;
      }
    },
    positionData(val){
      this.params['clientPO.latitude'] = val.latitude;
      this.params['clientPO.longitude'] = val.longitude;
      this.address = val.value;
    },
    // 附件参数
    showMsgFromFileDetail(mediaId) {
      this.params['mediaIds'] = '';
      this.params['mediaIds'] = mediaId.join(',');
    },
    // 图片参数
    showMsgFromImgDetail(imgurl){
      this.params['imageUrls'] = '';
      this.params['imageUrls'] = imgurl.join(',');
    },
    // 校验数据
    validateData () {
      // 弹窗
        if(!this.isWarnShow){
        for(let i = 0;i<this.poolData.length;i++){
          if(this.poolData[i].isMust == 1 && this.poolData[i].value == '' && this.poolData[i].status == true){
            _.alert("提示信息","请输入"+this.poolData[i].optionName);
            return false;
          }
        }
        // 假如commuNav的联系电话跟邮箱格式错，则红色toast
        for(let i = 0;i<this.communicationNav.length;i++){

          if(this.communicationNav[i].value != ''){ // 判断手机如果有value值就进行验证
            if(this.communicationNav[i].name === 'tel'){

              let phone = /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
              let tel = this.communicationNav[i].value;
              if(phone.test(tel)){
                this.isWarnShow = false;
              }else{
                this.isWarnShow = true;
                setTimeout(() => {
                  this.isWarnShow = false;
                },1000);
                this.warnMsg = '请输入正确的联系方式';
                return false;
              }
            }else if(this.communicationNav[i].name === 'mail'){
              var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              let mail = this.communicationNav[i].value;
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
        }
        return true;
      }
    },


    // 保存并关闭
    keepClose(){
      let isPass = this.validateData();
      if(!isPass) return;
      if(!this.slotShow){
        this.listParams();
      // 将固定字段跟自定义字段传入params
      for(let i = 0;i<this.poolData.length;i++){
        this.params[this.poolData[i].key] = this.poolData[i].value;  // 固定字段
        this.params.itemJson.list.forEach((item) => {
          if(this.poolData[i].optionName == item.fieldName && item.type != 'dateTime'){
            if(this.poolData[i].list.length>0 && this.poolData[i].type == 'select' && this.poolData[i].value ){
              item.fieldValue = this.poolData[i].value
            }else{
              item.fieldValue = this.poolData[i].value
            }
              item.fieldId = this.poolData[i].id
          }
          // 数值类型处理
          if (item.fieldName == this.poolData[i].optionName && this.poolData[i].ext1) {
            if (this.poolData[i].value && this.poolData[i].value.indexOf(',') !== -1) {
              item.fieldValue = this.poolData[i].value.split(',').join('');
            } else {
              item.fieldValue = this.poolData[i].value;
            }
              item.fieldId = this.poolData[i].id;
          }
          if (item.fieldName == this.poolData[i].optionName && this.poolData[i].ext1 && this.poolData[i].ext1 === '3') {
            item.fieldValue = formatPercentage(item.fieldValue);
            item.fieldId = this.poolData[i].id;
          }
        })
      }
      // 公海id
      this.params['clientPO.poolId'] = this.poolId;
      this.params.poolId = this.poolId;
      // 行业id
      this.params.industrys = this.industryId.join();

      if(this.editPoolClientId){
        // 编辑页面的行业列表传值
        this.params.itemJson = JSON.stringify(this.params.itemJson);
        getClientUpdate(this.params,(data) => {
          this.isUsed = false;
          this.delCacheArray('PoolList');
          this.$router.replace({path: '/poolList'});
          // // 清除缓存
          localStorage.removeItem(this.routerName);
        })

      }else if(!this.slotShow){
        this.params.itemJson = JSON.stringify(this.params.itemJson);
        getAddClient(this.params,(data) => {
          this.isUsed = false;
          this.delCacheArray('PoolList');
          this.$router.replace({path: '/poolList'});
          // // 清除缓存
          localStorage.removeItem(this.routerName);
        })
      }
      }
    },
    // 传向后台的数据处理
    listParams(){
      if(this.params.itemJson && typeof this.params.itemJson != 'object'){
          this.params.itemJson = JSON.parse(this.params.itemJson);
      }

      // 把params所需要的参数循环出来再传给后台
      for(let i = 0;i<this.clientData.length;i++){
        this.params[this.clientData[i].key] = this.clientData[i].value;
      }
      // 将相关人传入params
      let relativesSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
      let ccarr = [];
      relativesSelected.forEach((item) => {
        ccarr.push(item.userId);
      })
      this.params.givenUserIds = ccarr.join();
      // 自定义字段赋值
      if(this.params.itemJson.list){
        this.params.itemJson.list.forEach((item) => {
          this.editItemList.forEach((editItem) => {
            if(item.fieldName == editItem.fieldName && item.type != 'dateTime'){
              item.fieldId = editItem.fieldId
              item.id = editItem.id
            }
          })
        })
      }
      this.params['clientPO.industry'] = this.params['clientPO.industryName'];
    },

    // 监听子组件时间改变赋值
    listenToChild(val){
      for(let i = 0;i<this.allLists.list.length;i++){
        if(this.allLists.list[i].type == '4'){
          this.allLists.list[i].value = val;
        }
      }
    },
    // 监听子组件省市区赋值
    inputDispicker(val){
      this.params['clientPO.provinceCode'] = val[0];
      this.params['clientPO.cityCode'] = val[1];
      this.params['clientPO.areaCode'] = val[2];
    },

    // 选人初始化数据
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人(可查看)";
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
    },

    // 父组件判断是负责人还是相关人
    selectUserClick(val){
      if(val == 'relatives'){
        this.userListUrl='/portal/selectUserAction!ajaxGetUserListByOrgID.action';
      }
    },

    // 确定人员返回的数据,把id传至后台
    selectPerson(el,obj){
      if(el == 'ccPersonList'){
        this.params.givenUserIds = obj.user.idStr;
      }
    },

    // 负责人相关人添加
    confirmPick(el, isGet){
      if(el == 'ccPersonList'){ //相关人
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

    // 初始化客户编码
    clientCode () {
      var nowDate = _.getFormatDate(new Date(Date.now()), 'yyyy-MM-dd-hh-mm-ss');
      this.nav.forEach((item) => {
        if(item.optionName == '客户编码' && item.status == true ){
          item.value = nowDate.split('-').join('');
          this.code = item.value;
        }
      })
    },

    // 初始化
    init () {
      // 初始化省市区三级联动组件
      this.params['tbCrmClientInfoPO.provinceCode'] = '';
      this.params['tbCrmClientInfoPO.cityCode'] = '';
      this.params['tbCrmClientInfoPO.areaCode'] = '';
      // 初始化负责人相关人组件参数
      this.resetSelectPerson();

      // 给操作项绑定事件
      this.nav[0].clickEvent = this.checkClientName;
      this.nav[1].clickEvent = this.selectPool;
      this.centerNav[0].iconEvent = this.selectAddress;
      this.centerNav[1].clickEvent = this.selectIndustry;
    },
    // 时间改变获取
    listenToTime(timeVal){
      this.timeVal = timeVal;
    },
    // 客户名称
    checkClientName(){
      this.keyword.clientName = this.nav[0].value;
      // 判断客户名称是否重复 编辑页面客户名与刚进页面时候相同则不请求
      if(this.editPoolClientId && this.nav[0].value != this.getClientHisList.tbCrmPoolClientInfoPO.clientName || !this.editPoolClientId){
        getValidClientName(this.keyword).then(res => {
          // 重名则显示客户查重，否则隐藏
          this.slotShow = res.code != '0' ? true : false;
        })
      }
    },

    // 选择所属公海
    selectPool () {
      this.checkConfirm = 'poolList'
      this.typeTreeShow = true;
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(poolConfig)
      getChargePoolList().then(res => {
        if(res.code == '0'){
          if(res.data.poolList.length > 0){
            this.handleGetData(res.data.poolList);
            this.updateSelectValue(this.poolId);
            this.updateCurrentSelected(this.poolSelectData);
            this.treeListIsShow=true;
          }else{ // 请求无数据
            this.noData = true;
          }
          this.treeListIsShow=true;
          this.searchBoxShow=false;
          this.$refs.qwtree.lock_roll = false;
        }else{
          _.alert(res.desc)
        }
      })
    },

    // 选择行业
    selectIndustry () {
      this.checkConfirm = 'industryList'
      this.typeTreeShow = true;
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(industryConfig)
      getIndustryList(this.params,(data) => {
        if(data.pageData){
          this.handleGetData(data.pageData);
          this.updateSelectValue(this.industryId);
          this.updateCurrentSelected(this.industrySelectData);
          this.treeListIsShow=true;
          this.searchBoxShow=true;
        }else{
          this.noData = true;
        }
      })
    },

    // 选择地址
    selectAddress () {
      this.mapHide = false;
    },

    // 判断中间分割线是否隐藏
    centerNavIsShow(){
      let centerArr = [];
      this.communicationNav.forEach((item) => {
        centerArr.push(item.status);
      })
      centerArr.indexOf(true) == -1 ? this.centerNavShow = false : this.centerNavShow = true
    },
    // 判断nav的分割线是否隐藏
    NavIsShow(){
      let navArr = [];
      this.communicationNav.forEach((item) => {
        navArr.push(item.status);
      })
      // 判断中间分割线是否隐藏
      this.centerNav.forEach((item) => {
        navArr.push(item.status);
      })
      navArr.indexOf(true) == -1 ? this.onlyNav = false : this.onlyNav = true
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
    .repeatTips{
      position:absolute;
      top:0;
      right:0;
      margin-top:25px;
      padding-right:15px;
      height:50px;
      font-size:12px;
      color:#FF574D;
      z-index: 2;
      .repeatTipsIcon{
        display:inline-block;
        width: 15px;
        height: 17px;
        background: url('../../../../../assets/images/crm/ic_arrow.png') no-repeat center;
        background-size: 97%;
        vertical-align: bottom;
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
    .weui-cells{
      margin-top: 0 !important;
    }
    .weui-cells:before{
      display: none;
    }
    .vux-no-group-title {
      margin-top: 0 !important;
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
    .footer_btn_wrap{
      display: flex;
      padding: 20px 15px;
    }/*子组件下滑线清除*/
  }
}
</style>
