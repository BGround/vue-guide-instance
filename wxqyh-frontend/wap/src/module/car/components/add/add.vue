<template>
  <div class="wrap car-add">
    <!-- 提交失败提示语 -->
    <div class="err-tips" v-show="errTips">{{errTips}}</div>
    <div class="car-wrapper basic-field">
      <div class="car-item flex-item title" v-if="basicList.length>0 && basicList[0].status && basicList[0].status != '0'">
        <input :id="'field-' + basicList[0].id" type="text" v-model="basicValue.title" placeholder="请输入申请标题">
      </div>
      <div class="car-item use-time">
        <input type="hidden" id="take-time" v-model="basicValue.takeTime">
        <input type="hidden" id="back-time" v-model="basicValue.backTime">
        <div class="flex-item take-time" @click="modifyTakeTime">
          <p class="time">{{calDateTime(basicValue.takeTime, 1)}}</p>
          <p class="date">{{calDateTime(basicValue.takeTime, 0)}}</p>
        </div>
        <div class="flex-item icon-wrapper">
          <i class="use-time-icon"></i>
        </div>
        <div class="flex-item back-time" @click="modifyBackTime">
          <p class="time">{{calDateTime(basicValue.backTime, 1)}}</p>
          <p class="date">{{calDateTime(basicValue.backTime, 0)}}</p>
        </div>
      </div>
      <div class="car-item start-place" v-if="basicList.length>0 && basicList[4] && basicList[4].status && basicList[4].status != '0'">
        <i class="begin-location begin_icon"></i>
        <div class="flex-item">
          <input :id="'field-' + basicList[4].id" type="text" placeholder="请输入出发地" v-model="location.beginLocation" @change="editAddress(0)">
        </div>
        <i class="map-btn" @click="gotoMap(0)"></i>
      </div>
      <div class="car-item end-place" v-if="basicList.length>0 && basicList[5] && basicList[5].status && basicList[5].status != '0'">
        <i class="destination-location destination_icon"></i>
        <div class="flex-item">
          <input :id="'field-' + basicList[5].id" type="text" placeholder="请输入目的地" v-model="location.destinationLocation" @change="editAddress(1)">
        </div>
        <i class="map-btn" @click="gotoMap(1)"></i>
      </div>
      <div class="reason"  v-if="basicList.length>0 && basicList[3] && basicList[3].status && basicList[3].status != '0'">
        <text-area-field
          :field="basicList[3]"
          :value="basicValue.subject"
          @change="changeSubject">
        </text-area-field>
      </div>
    </div>
    <div class="car-wrapper">
      <div class="manager-group" v-if="basicList.length>0 && basicList[6] && basicList[6].status && basicList[6].status != '0'">
        <drop-down-field
          :field="basicList[6]"
          :value="managerGroupIdVal(basicList[6].list, basicValue.managerGroupId)"
          @change="changeManagerId">
        </drop-down-field>
      </div>
      <div v-if="basicList && basicList.length>0 && basicList[7] && basicList[7].status && basicList[7].status != '0'">
        <passenger-field :field="basicList[7]" @openContacts="addPassenger"></passenger-field>
      </div>
    </div>
    <div class="car-wrapper none-bottom">
      <custom-fields :list="customList" @change="fieldChange"></custom-fields>
    </div>
    <!--流程相关-->
    <div>
      <!--流程列表-->
      <QwFlowList v-if="needAudit == 1 && isFree == 0" :flowList="flowList" :flowId="flowId"></QwFlowList>
      <!--选择处理人-->
      <div v-if="needAudit == 1 && FlowAuditUser.length">
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
        title="相关人"
        :loadLast="loadLastConfig.ccPersonList"
        @confirmPick="confirmPick">
        <user_selected_item
          :userTotal="ccPersonList.length"
          :List="ccPersonList"
          title="相关人"
          @showPersonList="showPersonList"
          @showUserSelectedBox="ccPersonListShowBox"
          slot="user_selected_item"
          @removeSelected="removeCCPerson">
        </user_selected_item>
      </user_selected_group>
    </div>

    <!--底部操作按钮-->
    <button_group :fixed="true">
      <qwui_button type="default" text="草稿" @buttonClick="saveDraft"></qwui_button>
      <qwui_button  type="primary" text="提交" @buttonClick="submitted"></qwui_button>
    </button_group>

    <!--处理人范围选人-->
    <user_selected_ranglist :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
                            :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
                            :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
                            :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
                            :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
                            :checked="FlowAuditUserIds(appointUserIndex)"
                            @FlowAuditUserResult="FlowAuditUserResult"
                            v-if="FlowAuditUserBoxShow">
    </user_selected_ranglist>
    <!--选择节点处理人-->
    <flow-approve-dialog v-if="flowApproveDialogShow"
                        :agent="agent"
                        @saveNodeAuditUserJson="submittedData"
                        @showPersonList="showPersonList">
    </flow-approve-dialog>
    <!--公共选人组件-->
    <user_selected_Box v-if="selectConfig.show"
                      :selectconfig="selectConfig">
    </user_selected_Box>
    <!-- 地图组件 -->
    <map-search
      v-if="openMap"
      :openMap="openMap"
      :mapStatus="mapStatus"
      :location="location"
      @close="openMap=false">
    </map-search>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import { getCustomField, getConfigInfo, getOldGivenList, getHistoryInfo } from '../../api/getData'
  import {
    searchFlowListFun,
    findBranchFlowNextNodeInfoFun,
    getDepartmentInfoFun,
    settingAuditTitle,
    stringUserIds,
    isCheckFlowUserConfirm,
    getFlowAuditUserFun
  } from '@/components/flow/getAuditFlow'
  import {validation} from '../../js/validate'
  import QwFlowList from "@/components/flow/flowList";
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import FlowApproveDialog from '@/components/flow/flowApproveDialog'
  import {qwui_button, button_group} from '@/components/base/button'
  import audit_flow_api from '@/components/flow/api/getData'
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import customFields from '../customFields/customFields'
  import textAreaField from '../fields/textAreaField'
  import dropDownField from '../fields/dropDownField'
  import textField from '../fields/textField'
  import mapSearch from '../mapSearch/mapSearch'
  import passengerField from '../fields/passengerField'
  export default {
    name: 'add',
    components: {
      QwFlowList,
      user_selected_group,
      user_selected_item,
      user_selected_ranglist,
      FlowApproveDialog,
      user_selected_Box,
      qwui_button,
      button_group,
      customFields,
      textField,
      textAreaField,
      dropDownField,
      mapSearch,
      passengerField
    },
    data() {
      return {
        agent: dataBase.wxqyh_uploadfile.agent,
        orgId: '', //去掉了‘-’的orgId
        askId: '',
        dataBase: dataBase,
        clickTarget: 0,
        configInfo: [], //配置信息
        hasManager: '', //是否配置了车辆管理员
        basicList: [], //基础字段
        customList: [], //自定义字段
        needAudit: '', //是否需要审批
        myFlowId: '', //复制编辑的流程id
        myFlowList: [], //复制编辑的流程列表
        showPerson: false,    //是否展开所有选中人员列表
        userSelectTitle: '',
        userSelectList: [],
        limitPreview: false,  //限制弹个人信息弹窗
        stopClick: false,   //禁止保存草稿和提交 按钮多次点击
        status: '',
        errTips: '', //提交失败提示语
        isSubmitted: false,
        openMap: false,
        cacheName: 'car-add-' + _.userId
      }
    },
    mounted() {
      document.body.style.overflow = 'auto'
      // 重置数据
      this.$store.commit('resetFlowData')
      this.$store.commit('resetDetailData')
      this.$store.commit('resetLoadLastConfig')
      this.$store.commit('resetBasicData')
      this.$store.commit('resetMapStatus')
      // 初始化数据
      this.initAdd()
    },
    computed: {
      ...mapState({
        basicValue: state => state.fieldData.basicValue,
        customValue: state => state.fieldData.customValue,
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
        mapStatus: state => state.mapStatus.mapStatus,
        location: state => state.mapStatus.location, //地图获取的位置信息
      }),
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
        'getIsCheckFlowUserConfirmParams',//检验流程字段
        'findBranchFlowNextNodeInfoParams',//查找下一节点信息的入参
      ]),
      isMobile(){
        return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
      }
    },
    methods: {
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
      //zdq
      gotoMap(target){
        if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
          this.$store.commit('updateClickTarget',target)
          this.$store.commit('updateMapStatus', 'mapSearch')
          this.openMap = true
          if( this.clickTarget == 0 ){
            this.site = this.location.beginLocation
          }else if( this.clickTarget == 1 ){
            this.site = this.location.destinationLocation
          }
        }else{
          _.alert('提示','您的终端不支持选择地址!')
        }
      },
      editAddress(ele) {
        if(ele===0){
          this.$store.commit('updateLocation', {
            beginLongitude:'',
            beginLatitude: ''
          })
          this.$store.commit('updateBasicValue', {
            beginLocation: this.location.beginLocation
          })
        }else if(ele === 1){
          this.$store.commit('updateLocation',{
            destinationLongitude:'',
            destinationLatitude: ''
          })
          this.$store.commit('updateBasicValue', {
            destinationLocation: this.location.destinationLocation
          })
        }
      },
      initAdd() {
        let _this = this
        this.askId = this.$route.query.askId
        this.queryType = this.$route.query.type
        if(this.$route.query.carName) {
          this.$store.commit('updateBasicValue', {
            subject: `意向车辆：${this.$route.query.carName}`
          })
        }
        if(this.queryType === 'edit'){
          this.submitURL = _.baseURL + '/portal/carask/ajaxUpdate.do' //草稿进入编辑、审批中重新编辑
        }
        else{
          this.submitURL = _.baseURL + '/portal/carask/ajaxAdd.do' //新增和复制
        }
        _.showLoading()
        let p1 = new Promise((resolve, reject) => {
          getConfigInfo().then(res => { //配置信息
            if(res.code == '0') {
              resolve(res.data)
              _this.configInfo = res.data.config
              _this.hasManager = res.data.hasManager
              _this.needAudit = _this.configInfo.needAduit || 1 //是否需要审批：0 不走审批流程  1 需要审批(应用接口没有无需审批流程的话可自定义为1)
              _this.orgId = _this.configInfo.orgId.replace(/-/g, '')
              //更新templateRefId
              _this.updateUserSelectedState({type: "templateRefId", data: _this.agent + _this.orgId})
            } else {
              _.hideLoading()
              _.alert("i18n.notice", res.desc)
            }
          })
        })
        let p2 = new Promise((resolve, reject) => {
          getCustomField().then(res => { //请求字段数据
            if(res.code == '0') {
              resolve(res.data)
              _this.basicList = res.data.basicList
              _this.customList = res.data.list
            } else {
              _.hideLoading()
              _.alert("i18n.notice", res.desc)
            }
          })
        })
        let p3 = new Promise((resolve, reject) => {
          if(this.askId) {
            //获取历史数据
            getHistoryInfo({askId: this.askId}).then(res => {
              if(res.code == '0') {
                resolve(res.data)
                //初始化基础字段
                let vo = res.data.vo
                _this.$store.commit('updateBasicValue', {
                  title: vo.title,
                  takeTime: vo.takeTime,
                  backTime: vo.backTime,
                  subject: vo.subject,
                  managerGroupId: vo.managerGroupId,
                  beginLatitude: vo.beginLatitude,
                  beginLocation: vo.beginLocation,
                  beginLongitude: vo.beginLongitude,
                  destinationLatitude: vo.destinationLatitude,
                  destinationLocation: vo.destinationLocation,
                  destinationLongitude: vo.destinationLongitude,
                  innerPassenger: res.data.innerPassenger,
                  outerPassenger: res.data.outerPassenger
                })
                this.$store.commit('updateLocation', {
                  beginLatitude: vo.beginLatitude,
                  beginLocation: vo.beginLocation,
                  beginLongitude: vo.beginLongitude,
                  destinationLatitude: vo.destinationLatitude,
                  destinationLocation: vo.destinationLocation,
                  destinationLongitude: vo.destinationLongitude
                })
                //初始化相关人
                this.$store.commit('updateCCPerson', vo.ccPersons)
                this.myFlowId = res.data.flowConfigExtends.flowId
                this.myFlowList = res.data.flowConfigExtends.flowChooseBoxList
              } else {
                _.hideLoading()
                _.alert("i18n.notice", res.desc)
              }
            })
          } else resolve('')
        })
        Promise.all([p1, p2, p3]).then((result) => {
          _.hideLoading()
          let data = Object.assign({}, ...result)
          if(!_this.configInfo || _this.configInfo.permited == "0"){ //没有权限申请
            let btnConfig = {
              primaryBtn: {
                name: '确定',
                callBack: function() {
                  _this.$router.go(-1)
                }
              },
              defaultBtn: {
                name: '',
                callBack: null
              }, //主操作按钮
            }
            _.alert('提示',"你没有权限提交用车申请，如有疑问，请联系管理员", btnConfig)
          }
          if(_this.hasManager == "0"){
            _.alert("提示","请联系管理员设置车辆管理员，否则无法派车", btnConfig)
          }
          //初始化字段信息
          if(_this.askId && data.vo.itemList) {
            let _value = {}
            data.vo.itemList.forEach((item, index) => {
              let content = item.content == '未填写' ? '' : item.content
              _value[item.itemId] = content
              this.$set(_this.customList[index], 'value', content)
            })
            _this.$store.commit('updateCustomValue', _value)
          }
          //新建单和复制单用最新的时间
          if(!_this.askId || _this.queryType == 'copy') {
            _this.$store.commit('updateBasicValue', {
              title: `${new Date().Format("yyyyMMdd")}_用车申请_${_.personName}`,
              takeTime: new Date(new Date().getTime() + 1 * 10 * 60 * 1000).Format("yyyy-MM-dd hh:mm"), //当天时间10分钟后
              backTime: new Date(new Date().getTime() + (4 * 60 + 10) * 60 * 1000).Format("yyyy-MM-dd hh:mm") //开始时间4小时后
            })
          }
          //自由流程复制审批人
          if(_this.askId && _this.queryType == 'copy' && _this.configInfo.askFlowFree == 1) {
            _this.$store.commit('updateUserSelected', data.vo.toPersons)
          }
          // 复制相关人
          if(!this.askId) {
            this.$store.commit('updateCCPerson', this.configInfo.ccList)
          }
          // 编辑页面进入（复制所有信息，包括流程）
          if(this.askId && this.queryType == 'edit') {
            this.needAudit = data.flowConfigExtends.needAduit
            this.updateUserSelectedState({type: "isFree", data: data.flowConfigExtends.askFlowFree})
            if(data.vo.auditType == 1) this.$store.commit('updateUserSelected', data.vo.toPersons)
          } else {
            //审批流程类型：0固定流程 1自由流程 3分支流程
            this.updateUserSelectedState({type: "isFree", data: this.configInfo.askFlowFree})
          }
          this.loadLastConfig.toPersonList.show = (this.isFree == "0" || this.isFree == "3") ? false : true
          if(this.isFree != "1"){
            this.searchFlowList()
          }
          // 新增页缓存
          if(!_this.askId && !_this.$route.query.carName) {
            _this.cache(_this.cacheName)
          }
        }).catch(err => {
          _.hideLoading()
        })
      },
      calDateTime(datetime, type) {  //计算时间和日期
        let date = datetime && datetime.split(' ')[0]
        let time = datetime && datetime.split(' ')[1]
        if(type == 0) return date
        else return time
      },
      changeSubject(item) {  //用车事由
        this.$store.commit('updateBasicValue', {subject: item.value})
      },
      changeManagerId(item, id) {  //管理员组
        this.$store.commit('updateBasicValue', {managerGroupId: id})
      },
      managerGroupIdVal(group, id) { //获取管理员组的值
        if(!group) return
        let val = ''
        group.forEach(item => {
          if(item.id === id) {
            val = item.name
            return false
          }
        })
        return val
      },
      //设置标题
      startAuditTitle(nodeName){
        return settingAuditTitle(nodeName,this.isFree)
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
      // 选择处理人后
      FlowAuditUserResult(payload){
        this.$store.commit('checkFlowAuditUserType',payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      // 自定义字段数据变化
      fieldChange(item) {
        let _customValue = {}
        _customValue[item.key] = item.value
        this.$store.commit('updateCustomValue', _customValue)
      },
      // 设置缓存
      setStore(key, value) {
        value = JSON.stringify(value)
        localStorage.setItem(key, value)
      },
      getStore(key) {
        return JSON.parse(localStorage.getItem(key))
      },
      cache(key) {
        let cacheValue = this.getStore(key)
        if(cacheValue) {
          let _this = this
          let btnConfig = {
            primaryBtn: {
              name: '加载',
              callBack: function() {
                _this.$store.commit('updateBasicValue', cacheValue.basicValue)
                // 更新location信息
                _this.$store.commit('updateLocation', {
                  beginLatitude: cacheValue.basicValue.beginLatitude,
                  beginLocation: cacheValue.basicValue.beginLocation,
                  beginLongitude: cacheValue.basicValue.beginLongitude,
                  destinationLatitude: cacheValue.basicValue.destinationLatitude,
                  destinationLocation: cacheValue.basicValue.destinationLocation,
                  destinationLongitude: cacheValue.basicValue.destinationLongitude
                })
                // 更新自定义字段value值
                _this.$store.commit('updateCustomValue', cacheValue.customValue)
                _this.customList.forEach((item, index) => {
                  _this.$set(_this.customList[index], 'value', cacheValue.customValue[item.itemId])
                })
              }
            },
            defaultBtn: {
              name: '不加载',
              callBack: function() {
                localStorage.removeItem(_this.cacheName)
              }
            }, //主操作按钮
          }
          _.alert('',"是否需要加载上次未保存的内容？", btnConfig)
        }
      },
      //提交表单按钮
      submitted() {
        if(this.stopClick) return
        this.errTips = ''
        let validate = validation(this.basicList, this.basicValue, this.customList, this.customValue)
        if(validate.showFieldTips) {
          return
        } else if(validate.showTimeTips) {
          this.errTips = validate.showTimeTips
          $("html,body").animate({scrollTop: 0}, 100, 'linear')
          return
        }
        this.status = '1'
        if(this.askId) {
          this.submitAgain = 1  //重新编辑时提交
        }
        if(this.needAudit == 0) { //0为不用审批
          this.submittedData()
          return
        }
        //检验流程字段是否填写
        isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams,(type) => {
          //处理人没选,显示选人弹窗
          if(type === 'flowApproveDialogShow'){
            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
          } else if(type === 'findBranchFlowNextNode'){
            //查找下一节点信息
            findBranchFlowNextNodeInfoFun(this.findBranchFlowNextNodeInfoParams,(result) => {
              this.$store.commit('updateFlowAuditUserData', result);
              this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
              //更新下拉选择节点名称
              this.$store.commit('updateChooseNodeName')
            })
          } else{
            //验证成功
            this.submittedData()
          }
        })
      },
      saveDraft() {
        if(this.stopClick) return
        this.status = '0'
        //草稿不需要验证单的信息
        this.submittedData()
      },
      submittedData() {
        this.stopClick = true
        let _this = this
        let auditType
        let data = {}
        let customData = {} //自定义数据
        let basicData = {} //基础数据
        let innerPassenger = [] //内部乘车人
        let outerPassenger = [] // 外部乘车人
        //获取流程字段
        this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser})
        //返回的流程字段
        if(this.needAudit == '0') { //判断是否需要流程审批
          auditType = '4'
        } else {
          auditType = this.isFree
        }
        // 处理乘车人数据
        if(this.basicValue.innerPassenger && this.basicValue.innerPassenger.length > 0) {
          innerPassenger = this.basicValue.innerPassenger.map(item => {
            return item.userId
          })
        }
        outerPassenger = this.basicValue.outerPassenger || []
        data={
          submitAgain: this.submitAgain,
          flowDpId: this.commitTaskParams.flowDpId,
          nextNodeId: this.commitTaskParams.nextNodeId,
          currentNodeId: this.commitTaskParams.currentNodeId,
          flowChioseNodeAuditUserJson: this.commitTaskParams.flowChioseNodeAuditUserJson,
          choiseFlowUser: this.commitTaskParams.chooseFlowUser,
          incharges: this.commitTaskParams.incharges,
          relatives: stringUserIds(this.ccPersonList),
          innerPassenger: innerPassenger.join('|'),
          outerPassenger: outerPassenger.join('|'),
          'tbQyCarAskPO.hasItem': this.customList.length === 0 ? 0 : 1,
          'tbQyCarAskPO.auditType': auditType,
          'tbQyCarAskPO.status': this.status,
          'tbQyCarAskPO.askId': this.askId,
          'tbQyCarAskPO.flowId': this.flowId
        }
        if(Object.getOwnPropertyNames(this.customValue).length !== 0) {
          for(let key in this.customValue) {
            customData['tbQyCarAskItemPO.item' + key] = this.customValue[key]
          }
        }
        for(let key in this.basicValue) {
          if(key == 'innerPassenger' || key == 'outerPassenger') continue
          basicData['tbQyCarAskPO.' + key] = this.basicValue[key]
        }
        Object.assign(data, basicData, customData)
        _.showLoading('正在提交')
        _.ajax({
          url: this.submitURL,
          type: "POST",
          data: data,
          success: function (result) {
            _.hideLoading()
            if (result.code == "0") {
              _this.isSubmitted = true
              _this.$router.push({name: 'travel'})
            } else {
              _this.stopClick = false
              _.alert('提示', result.desc)
            }
          }
        })
      },
      confirmPick(type, isGet){
        let _this = this;
        let carType = {
          type: type,
          applyType: 'car',
          agentCode: 'car'
        }
        let updateType = type === '1' ? 'updateCCPerson':'updateUserSelected'
        if (!isGet) {
          this.$store.commit(updateType, []);
        } else {
          getOldGivenList(carType).then(function(result){
            if(result.code == "0"){
              let ccOrTolist = result.data.ccOrTolist;
              _this.$store.commit(updateType, ccOrTolist);
            }
          });
        }
      },
      // 删除相关人
      removeCCPerson(payload) {
        this.$store.commit('removeCCPerson',payload)
      },
      showPersonList(title,list){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        this.limitPreview = true
      },
      // 选择相关人
      ccPersonListShowBox(){
        //初始化选人数据
        this.updateUserSelectConfirm( { data: this.ccPersonList,
          callBack: (result) => {
            this.$store.commit('updateCCPerson',result.user.data)
          }
        });
      },
      //第一个接口审批列表数据
      searchFlowList() {
        let _this = this;
        let dataParam = {
          id: _this.isFree == 3 ? _this.agent + _this.orgId : _this.agent + '_' + _this.configInfo.orgId,
          agentCode: _this.agent,
          isBranchFlow: _this.isFree == 3 ? true : false
        }
        searchFlowListFun(dataParam, (result) => {
          //流程接口数据回调
          this.$store.commit('updateSearchFlowListData', result);
          if(this.myFlowId) {
            this.$store.commit("updateUserSelectedState", {
              type: "flowId",
              data: this.myFlowId
            })
            if(this.isFree == 0) {
              let param = {
                definitionId: "",
                id: "",
                flowId: this.myFlowId,
                currentNodeId: "",
                nextNodeId: "",
                parallelNextNodeIds: "",
                isBranchFlow: false
              }
              getFlowAuditUserFun(param, function (data) {
                _this.$store.commit("updateFlowAuditUserData",data)
              })
            }
          }
          if(this.myFlowList.length > 0) {
            this.$store.commit("updateUserSelectedState", {
              type: "flowList",
              data: this.myFlowList
            })
          }
        })
      },
      // 增加乘车人
      addPassenger() {
        this.updateUserSelectConfirm({data: (this.basicValue.innerPassenger || []),
          callBack: (result) => {
            this.$store.commit('updateBasicValue', {innerPassenger: result.user.data})
          }
        });
      },
      initTimePlugin() {
        let _this = this
        //初始化时间插件
        let $takeTime = $('#take-time')
        let $backTime = $('#back-time')
        let $textTime = $('#text-time')
        let mobiConfig = {
          dateFormat: "yy-mm-dd",
          dateOrder: "yymmd D",
          dayText: "日",
          display: "bottom",
          startYear: 2014,
          endYear: 2050,
          mode: "scroller",
          monthText: "月份",
          showNow: true,
          nowText: '当前时间',
          headText: "",
          stepMinute: 1,
          theme: "android-holo light",
          yearText: "年份",
          cancelText: "确认",
          setText: "取消"
        }
        $takeTime.mobiscroll().datetime({
          ...mobiConfig
        })
        $backTime.mobiscroll().datetime({
          ...mobiConfig
        })
        $takeTime.on("change", function(e) {
          _this.$store.commit('updateBasicValue', {takeTime: e.target.value})
        })
        $backTime.on("change", function(e) {
          _this.$store.commit('updateBasicValue', {backTime: e.target.value})
        })
      },
      modifyTakeTime() {
        $('#take-time').trigger('click')
      },
      modifyBackTime() {
        $('#back-time').trigger('click')
      }
    },
    updated() {
      this.initTimePlugin()
    },
    beforeDestroy () { // 组件销毁前缓存
      if(!this.isSubmitted && !this.askId) {
        let cacheValue = {
          basicValue: this.basicValue,
          customValue: this.customValue
        }
        this.setStore(this.cacheName, cacheValue)
      } else localStorage.removeItem(this.cacheName)
    }
  }
</script>

<style scoped>
  .car-add {
    -webkit-overflow-scrolling: touch;
    padding-bottom: 60px;
  }
  .err-tips {
    width: 100%;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    color: #FE5354;
    background: #FFE5E5;
  }
  .car-wrapper {
    padding:0 15px;
    background-color: #fff;
    margin-bottom: 8px;
  }
  .car-wrapper .car-item {
    position: relative;
    background: #fff;
    font-size: 16px;
    color: #333;
    padding: 13px 0;
    line-height: 22px;
    min-height: 19px;
    display: flex;
  }
  .car-wrapper .car-item.title {
    padding: 16px 15px 16px 0;
  }
  .car-wrapper .car-item.title:after {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    border-bottom: 1px solid #F7F8FA;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .car-wrapper .car-item .flex-item {
    flex: 1;
  }
  .car-wrapper .use-time {
    padding: 22px 0;
  }
  .use-time .take-time, .use-time .back-time {
    cursor: pointer;
  }
  .use-time .time {
    font-size: 20px;
    height: 28px;
    line-height: 28px;
    color: #1B233A;
    text-align: center;
  }
  .use-time .date {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: #B2B9C8;
    text-align: center;
  }
  .use-time .icon-wrapper {
    position: relative;
    text-align: center;
    transform: translateX(-36px);
  }
  .use-time-icon {
    position: absolute;
    top: 20px;
    width: 72px;
    height: 8px;
    background: url(~assets/images/car/group.png) no-repeat;
    background-size: 72px auto;
  }
  .flex-item input {
    width: 100%;
    color: #1B233A;
    font-size: 16px;
    vertical-align: top;
    background: #fff;
  }
  .start-place input, .end-place input {
    color: #0A1735;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .map-btn {
    width: 24px;
    height: 24px;
    background: url(~assets/images/car/icon_a-newtask-list_place.png) no-repeat;
    /*background-size: 24px auto;*/
    cursor: pointer;
     background-size: 24px 24px;
  }
  .destination-location,.begin-location {
    position: relative;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    margin-right: 7px;
  }
  .destination-location{
    background: url(~assets/images/car/icon_end.png) no-repeat;
    background-size: 10px 10px;
  }
  .begin-location {
    background: url(~assets/images/car/icon_begin.png) no-repeat;
    background-size: 10px 10px;
  }
  .wrap .none-bottom {
    margin-bottom: 0;
  }
  .begin_icon::before,.destination-location::before{
    content: '';
    position: absolute;
    width: 0;
    height: 19px;
    border-left: 1px dotted #E3E4E8;
    left: 4.5px;
  }
  .begin_icon::before{
    top: 10px;
  }
  .destination_icon::before{
    top: -20px;
  }
  /*input.placeholder颜色*/
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #D2D5DB;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D2D5DB;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D2D5DB;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #D2D5DB;
  }
  /*修改placeholder颜色*/
  .error-tip::-webkit-input-placeholder{
    color: #FF586D;
  }
  .error-tip::-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-ms-input-placeholder{
    color: #FF586D;
  }
</style>
