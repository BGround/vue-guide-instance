<template>
	<div class="wrap" ref="addWrap" :class="{'openDetail-wrap':!isMobile && isOpen, 'tipMargin': flowTip}">
    <transition name="slide">
      <div class="already-fill" v-if="hasAdd">您所在的单位已提交过表单，感谢您的参与</div>
    </transition>
		<!--无法流转提示-->
    <div class="qwui-flow_tip red" v-show="flowTip">
      <p class="qwui-flow_word red">{{flowTip}}</p>
    </div>
    <div class="form-qrcode-box" v-if="!isMobile && isOpen">
      <div class="form-qrcode-container">
        <qrcode :value="qrcodeUrl" :fg-color="'#000000'" type="img" :size="115"></qrcode>
      </div>
      <div class="form-qrcode-msg">
          <p>扫一扫在手机上填写</p>
      </div>
    </div>
    <div v-show="!succeedWin && !surverSuccess && !showAddError">
      <div :class="{'form-bg':!isOpen || isMobile}">
        <div class="form_title_box">
          <!--<div contenteditable="true" v-model="formTitle"></div>-->
          <div class="form-title-read" v-show="!updateTitle">
            <span class="ctitle">{{formTitle}}</span>
            <span class="icon-title-edit"
                  v-show="isUpdateTitle"
                  @click="editTitle">
					</span>
          </div>
          <div v-show="updateTitle" class="form-title-edit">
            <div class="title_edit_textarea" contenteditable="true" ref="updateTitle"
                 @blur="saveFormTitle($event)"
                 @input="countLength($event)"
                 v-model="formTitle" >
              {{formTitle}}
            </div>
            <p class="font-count" :class="{colorRed:titleLength == 100}">{{titleLength}}/100</p>
          </div>
          <!--表单截止时间-->
          <div class="suxing" v-if="formStop">
            <i class="iconfont icon-peixunxuexi_shijian"></i><span>截止时间 : {{formStop}}</span>
          </div>
        </div>
        <div class="form-detail-box" v-if="content">
          <div class="form-detail-content"
               ref="content"
               :class="{'form-detail-content-height':showToggle&&!showAllMsg}">
            <p id="content" v-html="content"></p>
          </div>
          <!--模糊效果-->
          <div class="form-detail-content-blur"
               v-if="showToggle&&!showAllMsg">
          </div>
          <div @click="toggleMsgfn"
               v-if="showToggle" class="form-detail-content-toggle">{{toggleMsg}}
            <span :class="{'toggle-up': showAllMsg,'toggle-down':!showAllMsg}">
					</span>
          </div>
        </div>
        <div class="form-bg" v-if="!isShowFields">
          <div class="form_flowFiled_box">
            <i class="form_icon_flowFiled"></i>
            <p>
              没有可填写的内容<br>请先在下方选择审批流程
            </p>
          </div>
        </div>
      </div>
      <formBase v-show="isShowFields && showFormBase" ref="formBase" @setLinkage="toGetLinkage"  @setAdvmthd="toGetAdvmthd" @change="fieldChange"/>
      <!--附件列表-->
      <add-file-list v-if="mediaList && mediaList.length"
                     agent="form"
                     customClass="file_list_len"
                     :filesList="mediaList"
                     :deleteFile="isFile?true:false"
                     @deleteFileItem="deleteFileItem"
                     :downLoad="true">
        <div slot="title" class="file_title">附件({{mediaList.length}})</div>
      </add-file-list>
      <add-img-list class="uploadFile uploadFile-imgList "
                    v-if="imgUploadPicList && imgUploadPicList.length"
                    :imageList="imgUploadPicList"
                    @handleDeleteImage="handleDeleteImage"
                    :disabled="false">
      </add-img-list>
      <div class="uploadFile clearfix" v-if="isFile||isPic">
        <!--上传附件-->
        <div class="fl upload-file-mr" :class="{'upload-file-mr-hasImg':imgUploadPicList && imgUploadPicList.length}">
          <file_detail v-if="isFile"
                       agent="form"
                       :filesList="mediaList"
                       :deleteFileList="deleteFileList"
                       @updateFileList="showMsgFromFileDetail">
          </file_detail>
        </div>
        <!--上传图片-->
        <div class="fl">
          <add-img v-if="isPic" agent="form" :orderId="orderId" :camera="chooseImageTypes"
                   :imageList="imgUploadPicList"
                   :deleteImage="deleteImage"
                   @updateImageList="setImgUploadValue"
                   listType="'picture-card'">
          </add-img>
        </div>
      </div>

      <div v-if="!isOpen">
        <!--流程列表-->
        <div class="form-bg"><flow_list v-if="isFreeFlow==2" :definition_id="definition_id" :id="id"></flow_list></div>
        <!--负责人的内容-->
        <user_selected_group v-show="isRelatives && !isOpen"

                             title="负责人"
                             :personNumber="toPersonList && toPersonList.length"
                             :loadLast="loadLastConfig.toPersonList"
                             @confirmPick="confirmToPick">
          <user_selected_item slot="user_selected_item"
                              :List="toPersonList"
                              :isEdit="editToPerson"
                              title="负责人"
                              @showPersonList="showPersonList"
                              @showUserSelectedBox="toPersonListShowBox"
                              :isRemove="editToPerson"
                              @removeSelected="removeToPerson">
          </user_selected_item>
        </user_selected_group>
        <!--选择处理人-->
        <div v-if="FlowAuditUser.length">
          <user_selected_group
            v-if="item && item.startAuditList.show"
            v-for="(item,index) in FlowAuditUser"
            :key="item.id"
            :title="startAuditTitle(item.nodeName)"
            :personNumber="item.startAuditList.userSelected && item.startAuditList.userSelected.length"
            :mustChoose="true"
            :loadLast="loadLastConfig.auditPersonList"
            @confirmPick="confirmPick">
            <span class="approveType" slot="title">{{approveType}}</span>
            <user_selected_item
              v-if="flowNodeItemKeysShow(index)"
              @showUserSelectedBox="FlowAuditUserShowBox(index)"
              :isEdit="item.startAuditList.isCanEdit"
              slot="user_selected_item"
              :List="item.startAuditList.userSelected"
              :title="startAuditTitle(item.nodeName)"
              :isOrderAudit="isOrderAudit"
              @showPersonList="showPersonList"
              @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
              :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
            </user_selected_item>
            <div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
                 v-show="item.startAuditList.flowNodeItemKeys&&item.startAuditList.allUser.length===0">
              <p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
            </div>
          </user_selected_group>
        </div>
        <!--选择相关人-->
        <user_selected_group v-show="isRelevants && !isOpen"
                             title="相关人"
                             :personNumber="ccPersonList && ccPersonList.length"
                             :loadLast="loadLastConfig.ccPersonList"
                             @confirmPick="confirmCCPick">
          <user_selected_item :isRemove="editCCPerson"
                              :isEdit="editCCPerson"
                              title="相关人"
                              @showPersonList="showPersonList"
                              @showUserSelectedBox="ccPersonListShowBox"
                              slot="user_selected_item"
                              :List="ccPersonList"
                              @removeSelected="removeCCPerson">
          </user_selected_item>
        </user_selected_group>
      </div>


      <!--匿名提交-->
      <div class="anonymous-ubmit" v-if="isAnonymous">
        <label @click="taggleAnonymous">
          <span class="qwui-checkbox-form"><i :class="{active:isAnonymousValue==1}"></i></span>匿名提交
        </label>
      </div>
      <select_crm v-if="dataBase.selectCrm.show"></select_crm>
      <!--底部操作按钮-->
      <flow_button :buttondata="buttonConfig"></flow_button>
      <div v-if="!isOpen">
        <!--<user_choose v-if="dataBase.selectConfig.show"></user_choose>-->
        <childView></childView>
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
        <choose_nodeList v-if="nextNodeListShow" @saveNodeAuditUserJson="submitedData" @showPersonList="showPersonList"></choose_nodeList>
      </div>

      <!--外部单底部logo-->
      <div class="openFooterContent" v-show="isOpen && isShowFooter">
        <a href="http://wbg.do1.com.cn/" target="_blank">
          <img src="../../../../assets/images/newsmallLogo.svg" alt="">
          道一云|企微，让工作更简单
        </a>
      </div>




      <!--个人信息-->
      <user-info></user-info>

      <!--人员列表组件-->
      <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>

      <!--crm字段信息-->
      <crm_info></crm_info>
    </div>
    <!--外部单提交成功-->
    <open-commit-success v-if="succeedWin" @editAgain="editAgain" :succeedData="succeedData" :isPC="!isMobile" :isShowFooter="isShowFooter"></open-commit-success>
    <!-- 重复提单 -->
    <add-error v-if="showAddError" :isPC="!isMobile"></add-error>
    <!-- 中奖 -->
    <lottery-result v-if="surverSuccess" @updateSurver="updateSurver" :giftInfo="giftInfo" :isPC="!isMobile"></lottery-result>
	</div>
</template>

<script>

  import wx from 'weixin-js-sdk'
  import { Qrcode } from 'vux'
	import img_detail from '@/components/add/upload/add_img'
	import file_detail from '@/components/add/upload/add_file'
	import childView from '../childView'
  import EventBus from '@/utils/eventBus';
	import formBase from '../formBase.vue'
	import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
	import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
	import userInfo from '@/components/detail/user_info_card';//个人信息
	import openCommitSuccess from './openCommitSuccess.vue'   //外部单提交成功界面
	//修改数据的函数
	import {form_validation,filterData,scroll_height} from '../../js/validation'
  //导入fields的兼容性方法
  import { compatible } from '../../js/compatible'
	//选人的导入
	import related_person_detail from '../../../../components/add/user_select_icon_right';
	import user_choose from '@/components/base/user_or_dept_select.vue' //js导入
	import flow_button from '@/components/button/flow_button';
	import select_crm from '../base/select_crm.vue'
  import crm_info from '../base/crm_info';
	//流程的组件的导入
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
	import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
	import choose_nodeList from '../../components/chooseNodeList'
	import flow_list from "@/components/flow/flow_list";
	import {setFieldShowRead,getFrom, render_field,getOldGivenList,saveFormData,removeFormData,getFormData,setFieldShowHide,loadScript, getMember,isEmpty,isEquals,setLinkage,setAdvmthd,getLinkage,getAdvmthd,} from '../../js/getData'
	import Vue from 'vue'
	import audit_flow_api from '@/components/flow/api/getData'
	import addFileList from '@/components/add/upload/addFileList'
	import AddImg from '@/components/add/upload/add_img';
	import AddImgList from '@/components/add/upload/imgList';
  import user_show from '@/components/detail/user_show'
  import {updateCache} from '../../assets/js/keepAlive.js'
  import { getFreeFlowConfig } from '@/components/flow/api/getApi'
  import LotteryResult from './lotteryResult.vue'
  import AddError from './addError.vue'
	export default {
	  name:'add',
		components: {
			formBase,
			user_choose,
			related_person_detail,
			flow_button,
			childView,
			select_crm,
			user_selected_item,
			user_selected_group,
			file_detail,
			user_selected_ranglist,
			choose_nodeList,
			flow_list,
			openCommitSuccess,
			userInfo,
			addFileList,
			AddImgList,
			AddImg,
			user_show,
      crm_info,
      Qrcode,
      LotteryResult,
      AddError
		},
		data() {
      return {
        hasAdd: false,
        showAddError: false,
        giftInfo: {
          giftName: '',
          userId: '',
          corpId: ''
        },
        isSurvey: false,  //是否是抽奖单
        surverSuccess: false, //调查提交是否成功
        style: null,
        dataBase: dataBase,
        submitURL: '',
        queryType: '',
        formTitle: '',
        newFormTitle: '',
        formStop:'',
        content: '',
        //提交表单需要的数据
        id: '',
        definition_id: '',
        orderVersion: '',//工单版本号
        isFreeFlow: '',
        isTask: '',
        isBranchNode: false,
        orderId: '',       //图片水印参数
        definitionVersionsId: '', // 模板id
        chooseImageTypes: [],//手机端图片上传参数
        status: '',
        instanceTitleTemplate: '',
        instanceTitle: '',
        isUpdateTitle: true,//标题是否能更新
        updateTitle: false,
        isAnonymous: '',//是否匿名提交
        buttonConfig: { //操作按钮
          primaryList: [ {type: "primary", name: '立即提交', callBack: null} ],
          defaultList: [ {type: "default", name: '保存为草稿', callBack: null} ],
          style: {class: ""}//按钮是否置底部 active :底部、"":相对定位
        },
        isAnonymous: false,//匿名提交
        isAnonymousValue: '',//匿名提交数据
        isPic: false,//是否上传图片
        isFile: false,//是否上传文件
        isFileMust: false,//是否一定要上传文件
        ccPersonList: [],//相关人
        toPersonList: [],//负责人
        editToPerson: false,
        editCCPerson: false,
        isRelevants: false,
        isRelatives: false,
        loadLastConfig: {
          ccPersonList: {
            type: '1',
            show: false,
            name: '加载上次',
            isGetVal: false,
          },
          toPersonList: {
            type: '0',
            show: false,
            name: '加载上次',
            isGetVal: false,
          },
          auditPersonList: {
            type: '0',
            show: false,
            name: '加载上次',
            isGetVal: false,
          }
        },
        //图片数据
        imgUpload: {
          picList: [],
        },
        //文件数据
        fileUpload: {
          mediaList: 1,
          url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
        },
        mediaList: [],

        showAllMsg: false,
        toggleMsg: '展开显示全部',
        showToggle: false, //是否展开收起全部的按钮
        titleLength: 0,
        stopClick: false,   //禁止保存草稿和提交 按钮多次点击
        isOpen: false,   //是否是外部单
        isShowFooter: false,   //外部单logo可见
        succeedWin: false,//显示外部单提交成功框
        succeedData: {     //外部单提交成功传输的数据
          openDetailId: '', //提交成功的id
          isSearchForm: false, //提交成功的id
        },
        imgUploadPicList: [],
        showPerson: false,                                                   //是否展开所有选中人员列表
        userselectTitle: '',
        userSelectList: [],
        limitPreview: false,                                                //限制弹个人信息弹窗
        showFormBase:true,
        deleteFileList:{},   //删除文件附件
        deleteImage:{},      //删除图片附件
        isInstancesFlow:'',  //是否实例化表单
        previewImageUrl:[],                                                     //需要预览的图片列表
        parallelCurrentNodeId: '',
        qrcodeUrl:'',         //外部单链接二维码
        curEditFieldId:'',                                                      //触发数据联动时当前用户正在编辑的字段id
        cacheData: null,      //上次编辑缓存的数据
        approveType:'',// 自由流程审批类型
        isOrderAudit:false, // 自由流程是否按顺序审批
      };
		},
		computed: {
			...mapState({
				FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow, // 是否显示选人弹窗
				nextNodeListShow: state => state.userSelected.nextNodeListShow, // 是否显示选择下一个节点
				FlowAuditUser: state => state.userSelected.FlowAuditUser, // 处理人信息
				//ccPersonList: state => state.userSelected.ccPersonList, // 相关人信息
				flowChioseNodeAuditUser: state  => state.userSelected.flowChioseNodeAuditUser, // 当前节点指定处理人的处理人信息
				flowChioseNodeAuditUserJson: state => state.userSelected.flowChioseNodeAuditUserJson, // 当前节点指定处理人的处理人json
				choiseFlowUserJson: state => state.userSelected.choiseFlowUserJson, // 已选的处理人json(后台允许上一节点指定处理人:固定流程 人员id|人员id
																					// 分支流程 {节点id:人员id|人员id,节点id:人员id|人员id})
				flowDpIdJson: state => state.userSelected.flowDpIdJson, // 并行节点，多部门，选择的部门({节点id:部门id,节点id:部门id})
				flowList: state => state.userSelected.flowList, // 流程列表
				flowId: state => state.userSelected.flowId, // 已选的流程id
				currentNodeId: state => state.userSelected.currentNodeId, // 当前节点id
				nextNodeId: state => state.userSelected.nextNodeId, // 下一节点id
				parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开
				appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
				appointUserIndex:state => state.userSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
			}),
			...mapGetters([
				"FlowAuditUserIds",   // 已选择的处理人id
			]),
			isShowFields(){
				return this.isFreeFlow==2&&!this.queryType?this.flowId==""?false:true:true
			},
			schema(){
				return this.$store.state.formBase.schema;
			},
      //手机
      isMobile(){
			  return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
			},
			flowTip() {
				if(this.toPersonList.length > 500) {
					return '负责人不可超过500人，请重新选择'
				} else if(this.ccPersonList.length > 500) {
					return '相关人不可超过500人，请重新选择'
				}
				return false
			}
		},
		created() {
			var EventBus = new Vue();
			this.$root.EventBus = EventBus;
			this.$store.commit('reset');
			var _this = this;
			this.buttonConfig.primaryList[0].callBack = function () {
				_this.submited();
			};
			this.buttonConfig.defaultList[0]?this.buttonConfig.defaultList[0].callBack = function () {
				_this.saveDraft();
			}:'';
      // 重置数据
			this.$store.commit('resetFlowData');
			this.$store.commit('resetDetailData');
      //缓存数据
      this.cacheData = getFormData();
      if(!this.cacheData) {
        this.initForm();
      } else {
        _.alert('提示', '是否需要加载上次编辑内容', {
          primaryBtn: {name: "确认", callBack:function () {
            _this.initForm();
          }},
          defaultBtn: {name: "取消", callBack:function () {
            removeFormData();
            _this.cacheData = null;
            _this.initForm();
          }},
        })
      }
		},
		updated() {
			var content = document.getElementsByClassName('form-detail-content')[0]
			if(content){
				var contentH = content.offsetHeight;
				if(contentH > 129){
					content.style.setProperty('padding-bottom', '0px');
					this.showToggle = true;
				}
			}
		},
		methods: {
			...mapMutations([
				"removeFlowAuditUser",        // 删除处理人
				"updateNextNodeList",         // 更新下个节点列表
				'saveChoiseFlowUserJson',     // 自由选择处理人信息
			]),
			...mapActions([
				"updateFlowUserSelected",     // 更新已选处理人
			]),
			startAuditTitle:function(nodeName) {
				return nodeName ? nodeName+'处理人' : '处理人'
      },
      updateSurver() {
        this.surverSuccess = false;
        this.isSurvey = false;
        this.initForm();
      },
			// 选择处理人弹窗
			FlowAuditUserShowBox(index) {
				this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
				// 如果是指定范围选人
				if(this.FlowAuditUser[index].startAuditList.assignRange) {
					this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
				}else {
					var _this = this;
					dataBase.selectConfig.show = true;
					dataBase.selectConfig.signIndex = 'users';
					dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
						_this.$store.commit('updateUserSelected',data.user.data)
					}
					dataBase.selectConfig.selectList.users.userSelected = this.FlowAuditUser[index].startAuditList.userSelected;
				}
			},
      // 人员控件关联下一步处理人组件显示
      flowNodeItemKeysShow(index) {
        if (this.FlowAuditUser.length != 0 && this.FlowAuditUser[index].startAuditList.flowNodeItemKeys) {
          if (this.FlowAuditUser[index].startAuditList.allUser.length === 0) {
            return false
          } else {
            return true
          }
        } else if (this.FlowAuditUser[index].startAuditList) {
          return true;
        } else {
          return false;
        }
      },
			// 人员控件获取字段名
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item)=>{
						if(keys.indexOf(item._id)>=0){
							str+=item.label+'，';
						}
					})
				}
				return str.substring(0,str.length-1);
			},
			// 选择处理人后
			FlowAuditUserResult(payload) {
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
				// 如果是多部门，则请求部门负责人
				this.updateFlowUserSelected(payload)
			},
			showMsgFromImgDetail(imgurl){
//				this.commitDraft.draftFormData['imageUrls'] = '';
//				this.commitDraft.draftFormData['imageUrls'] = this.arrayToString(imgurl, 1);
			},
			setImgUploadValue(val){
				this.imgUploadPicList = val;
			},
			showMsgFromFileDetail(mediaId){
				this.mediaList.concat(mediaId);
			},
      deleteFileItem(item){
        this.deleteFileList = item;
      },
      handleDeleteImage(item){
        this.deleteImage = item;
      },
			taggleAnonymous(){
				if(this.isAnonymousValue){
					this.isAnonymousValue = '';
					this.buttonConfig.primaryList[0].name = '立即提交';
				}else{
					this.isAnonymousValue = 1;
					this.buttonConfig.primaryList[0].name = '匿名提交';
				}
			},
			fieldChange(val){
				var formData = this.$store.state.formBase.data;
				if(!this.queryType && JSON.stringify(val) != '{"key":"","value":""}'){
					saveFormData(JSON.stringify(formData));
				}
				var fieldArry = this.$store.state.formBase.fieldArry;
				var templateObj = this.$store.state.formBase.templateObj;
				var typeMap = this.$store.state.formBase.typeMap;
				var choiceMap = this.$store.state.formBase.choiceMap;
				if(fieldArry.indexOf(val.key)!=-1) {
					templateObj[ '{' + val.key + '}' ] = val.value;
					//下拉框
					if (typeMap[ val.key ] == 'DropDown'||typeMap[ val.key ] == 'RadioButton') {
						templateObj[ '{' + val.key + '}' ] = choiceMap[ val.value ] || '';
					}
          if(typeMap[ val.key ] == 'CheckBox'){
            let choiceStr = [];
            val.value.forEach(function(item){
              choiceStr.push(choiceMap[item] || '')
            })
            templateObj['{' + val.key + '}'] = choiceStr.join('，')
          }
				}
				if(JSON.stringify(templateObj)=='{}') return ;
					var ctitle = this.instanceTitleTemplate;
					this.schema.forEach(item =>{
						for(var k in templateObj) {
							if('{'+item._id+'}'===k && item.show){
								ctitle = ctitle.replace(new RegExp(k,"g"),templateObj[k]);
							}
						}
					})
					ctitle = ctitle.replace(new RegExp('\\{(.*?)\\}','g'),'');
					ctitle = ctitle.replace(new RegExp('&nbsp;','g'),'').substring(0,100);
					this.formTitle = ctitle;
					this.newFormTitle = this.formTitle;
			},
//      数据联动
      toGetLinkage(val){
			  var _this = this,
          store = this.$store;
			  getLinkage(val, _this, store);
      },
//      高级函数
      toGetAdvmthd(val){
        var _this = this,
          store = this.$store;
        getAdvmthd(val, _this, store);
      },
			initForm() {
				var _this = this;
        var id = this.$route.query.id,
            corpId = this.$route.query.field;
        this.id = id;
        let userId = this.$route.query.field1; //从消息入口进入才会携带
        let href = window.location.href, formId = '';
        if(href.indexOf('tqy') != -1) { //测试
          formId = 'form01626a5c3b2a46d899ac183bd044708f';
        }else if(href.indexOf('10.10.0.174') != -1) { //本地
          formId = 'forma81eca4e763b4ecba556878568fba4b8';
        }else { //线上
          formId = 'form890780f8e91b4ae3b848c22c622ff31f';
        }
        //如果是满意度调查单，未登录、非微信、企业微信端不展示页面
        if(id === formId) {
          this.isSurvey = true;
          // if(userId) { //local
          if(userId && (_.isWeChat() || _.isQiyeweixin())) {
            //请求内部接口查询人员信息,防止复制链接分享
            let changBaseURL = '/wxqyh';
            _.ajax({
              url: changBaseURL+'/portal/contactAction!ajaxGetUserInfoByID.action',
              type: 'POST',
              data: {'userId': userId},
              success: function (result) {
                if(result.code != "0"){//未登录
                  window.location.href = changBaseURL + '/jsp/wap/tips/error.html?msg=页面已过期，请刷新或返回重新进入页面';
                  return;
                }
                _this.giftInfo.userId = userId;
                _this.giftInfo.corpId = result.data.userInfo.corpId;
              },
              error :function(result){
                return false;
              }
            })
          }else {
            window.location.href = _.baseURL + '/jsp/wap/tips/error.html?msg=页面已过期，请刷新或返回重新进入页面';
            return;
          }
        }else {
          this.surverSuccess = false;
          this.isSurvey = false;
        }
        this.queryType = this.$route.query.type;
        if(this.$route.path === "/open/add") this.queryType = 'open'
        switch (this.queryType) {
          case "edit":
            this.submitURL = _.baseURL + '/portal/portalForm/updateFroms.do';
            document.title = '编辑表单';
            break;
          case "toEdit":
            this.buttonConfig.defaultList = [];
            this.submitURL = _.baseURL + '/portal/portalForm/updateFormByToUser.do';
            document.title = '编辑表单';
            break;
          case "open":
            this.isOpen = true;
            this.loadCss();
            this.toggleMsgfn();
            this.buttonConfig.defaultList=[];
            this.submitURL = _.baseURL + '/open/openForm/addFroms.do';
            break;
          default:
            this.submitURL = _.baseURL + '/portal/portalForm/addFroms.do';
        }
				_.showLoading()
				getFrom(this.queryType, id, corpId, this.isSurvey).then(function (result) {
					_this.stopClick = false;
					if (result.code == "0") {
            //判断是否被同公司填过
            _this.hasAdd = result.data.hasAdd;
					  //兼容旧的字表的数据
            compatible(result.data.fields);
						//判断是否有省市区的数据
						var url = result.data.distpicker_data
						loadScript(url).then(res => {
              _.hideLoading();
              _this.isShowFooter = result.data.isShowFooter || false;
						//初始化表单数据
						var schema = result.data.fields;
						var detailsPO = result.data.detailsPO;
						var controlPO = result.data.controlPO;
                        _this.formStop = controlPO.stopTime;
						_this.content = _this.formatContent(detailsPO.content);
              _this.$nextTick(()=>{
                _this.imgsClickFunc();
              })
						_this.definition_id = result.data.id
                        _this.isInstancesFlow = result.data.isInstancesFlow;
            _this.orderVersion = result.data.orderVersion;
						_this.definitionVersionsId = detailsPO.definitionVersionsId;
						_this.orderId = result.data.isImgWatermark ? _this.definitionVersionsId : '';//图片水印传参 ：orderId
						_this.chooseImageTypes = controlPO.formPhotoSet && "0" == controlPO.formPhotoSet ? ['album','camera'] : ['camera'];//手机端图片上传控制
            setLinkage(schema, _this.$store);
						var defaultData = Object.assign(result.data.default,result.data.itemMap);
						//获取缓存数据

						var hasCache = false;
						if(_this.cacheData){
						  hasCache = true;
							defaultData = Object.assign(defaultData, JSON.parse(_this.cacheData));
						}
						if (result.data.isNewVersions) {
							_.alert("提示", "该表单已发布新版本，请确定你填写的数据");
						}
						//外部单的数据
						if(result.data.controlPO.isSearchForm === '1')
							_this.succeedData.isSearchForm = true;
						//表单标题不可编辑
						if (controlPO.isUpdaeTitle == 0) {
							_this.isUpdateTitle = false;
						}
						if(controlPO.isAnonymous == '1'){
							_this.isAnonymous = true;
						}
						if(controlPO.isPic == '1'){
							_this.isPic = true;
						}
						if(controlPO.isFile == '1'){
							_this.isFile = true;
							_this.isFileMust = controlPO.isFileMust||false;
						}
						var mediaList = result.data.mediaList;
						_this.mediaList = mediaList;
						if(result.data.picList && result.data.picList.length>0){
							var list = [];
							result.data.picList.forEach((item,index)=>{
								list.push({src:item.picPath});
							})
							_this.imgUploadPicList = list;
						}
						_this.fileUpload.mediaList = 2;
						//如果表单未开始填写
						if (result.data.timebefore) {
							_.alert("提示", "表单开始填写时间：" + controlPO.startTime);
							return;
						}
						var quota = result.data.quota;
            var store = _this.$store;
            var resultData = {
              controlPO: result.data.controlPO,
              detailsPO: result.data.detailsPO,
              isImgWatermark:result.data.isImgWatermark
            };
            store.commit ('updateDetailData', resultData);
            setAdvmthd(store, schema);
            //新增页面canGo为true
						render_field(store, schema, defaultData, null, _this, !hasCache);
						//setFormDetail
						store.commit('setFormDetail', controlPO);
						store.commit('setSelectQuota', quota);
						//微信分享
            var shareVO = result.data.shareVO;
            if(shareVO) {
              _this.share(shareVO);
            } 		//表单标题模板代码
						var instanceTitleTemplate = result.data.instanceTitleTemplate;
						_this.instanceTitleTemplate = instanceTitleTemplate;
						_this.formTitle = instanceTitleTemplate || result.data.detailsPO.formName;
						_this.newFormTitle = _this.formTitle;
						if (_this.isOpen) {
              document.title = result.data.detailsPO.title;
              _this.qrcodeUrl = result.data.shortUrl;
            }
						var typeMap = _this.$store.state.formBase.typeMap;
						var choiceMap = _this.$store.state.formBase.choiceMap;
						var fieldArry = [];
						var templateObj = {};
						if(instanceTitleTemplate){
							var arry = instanceTitleTemplate.match(/{[^}]+}/g);
							if(arry&&arry.length>0){
								arry.forEach(function(item){
									var key = item.substring(1,item.length-1);
									fieldArry.push(key);
									var defaultvalue = defaultData[key]||'';
									templateObj[item] = defaultvalue;
									if(typeMap[key] == 'DropDown'||typeMap[key] == 'RadioButton'){
										templateObj[item] = choiceMap[defaultvalue]||'';
									}
									if(typeMap[ key] == 'CheckBox'){
									  let choiceStr = [];
                    !isEmpty(defaultvalue) && defaultvalue.forEach(function(item){
                      choiceStr.push(choiceMap[item]||'')
                    })
                    templateObj[item] = choiceStr.join('，')
                  }
								});
							}else{
								if(_this.queryType === 'edit'){
									instanceTitleTemplate = result.data.instanceTitle || result.data.detailsPO.formName;
								}else{
									instanceTitleTemplate = instanceTitleTemplate || result.data.detailsPO.formName;
								}
								if(controlPO.isBuildTitle) {
									_this.formTitle = instanceTitleTemplate.replace(new RegExp('&nbsp;','g'),'');
									_this.newFormTitle = _this.formTitle;
								}
							}
						}else if(controlPO.isBuildTitle) {
							_this.formTitle = result.data.instanceTitle;
							_this.newFormTitle = _this.formTitle;
						}
						store.commit('setTemplateObj',templateObj);
						store.commit('setFieldArry',fieldArry);
						if(fieldArry.length>0){
							var ctitle = instanceTitleTemplate;
							for(var k in templateObj){
								ctitle = ctitle.replace(new RegExp(k,"g"),templateObj[k]);
							}
							var ctitle = ctitle.replace(new RegExp('&nbsp;','g'),'').substring(0,100);
							_this.formTitle = ctitle;
							_this.newFormTitle = _this.formTitle;
						}
					//	外部单则不执行流程代码
						if(_this.isOpen){
							_this.formFieldControlList(result.data.formFieldControlList);
							_this._addField()//外部单field1...fieldn功能
							return;
						}
						//相关人和负责人

						//允许修改相关人
						if(controlPO.isRelevants=="1"){
							_this.isRelevants = true;
							_this.ccPersonList = result.data.relevantList || result.data.receiveList || [];
							if(controlPO.isDisableRelevants=="0"){
								_this.editCCPerson = true;
								//新增时显示加载上一次开关
								_this.loadLastConfig.ccPersonList.show = true;
							}
						}
            //不是审批单的负责人显示,审批单的负责人是审批人
						_this.isTask = controlPO.isTask;
						if(controlPO.isTask != 2 && controlPO.isTask != 3){
							//隐藏审批单的处理人，如果是普通单和任务单就显示
							_this.FlowAuditUser.length = 0;
							if(controlPO.isRelatives=="1"){
								_this.isRelatives = true;
								_this.toPersonList = result.data.givenList||result.data.inchargesList||[]
								if(controlPO.isDisableRelatives=="0"){//允许添加负责人的属性
									_this.editToPerson = true;
									//新增时显示加载上一次开关
									_this.loadLastConfig.toPersonList.show = true;
								}
							}
						}
						_this.isFreeFlow = controlPO.isFreeFlow;
						if(controlPO.isTask == 2 && controlPO.isFreeFlow == "1"){
              getFreeFlowConfig(_this.definitionVersionsId, (data) => {
                if(data.isOrderAudit == 1){
                  _this.isOrderAudit = true;
                  _this.approveType = '(按顺序审批)';
                }else {
                  _this.isOrderAudit = false;
                  _this.approveType = '(或签)';
                }
              });
							//负责人进入编辑页面不显示处理人编辑入口
							if(result.data.controlPO.isDisableRelatives != '0'){
								_this.FlowAuditUser[0].startAuditList.isCanEdit = false;
							}else{
								_this.FlowAuditUser[0].startAuditList.isCanEdit = true;
								//新增时显示加载上一次开关
								_this.loadLastConfig.auditPersonList.show = true;
							}
						}
						//审批单，判断是什么流程,isFreeFlow=="1"自由流程isFreeFlow=="2"固定流程 isFreeFlow=="3"分支流程
						if(controlPO.isTask == 2 && controlPO.isFreeFlow=="1"){
							_this.$store.commit('resetFlowAuditUser');
							//修改自由流程的审批人员的store
							if(controlPO.isRelatives=="1"){
								var auditPerson = result.data.givenList||result.data.inchargesList||[];
								_this.$store.commit('updateUserSelected',auditPerson);
							}

							}
							if ((controlPO.isTask == 2 && controlPO.isFreeFlow != "1") || controlPO.isTask == 3) {
                _this.approveType = '';
								_this.searchFlowList ();
							}
						})
					} else {
							let btnConfig={
								primaryBtn:{name:"i18n.confirm", callBack: null},
								defaultBtn:{name:"", callBack:null},
							};
						if(result.code=='22107'){//设置项不允许普通单/任务单的负责人重新提交表单
							btnConfig.primaryBtn.callBack = function (){
								_this.$router.push({name: 'detail', query: { id: _this.id}});
							}
						}else{
							btnConfig.primaryBtn.callBack = function (){
								_this.$router.go(-1);
							};
						}
						_.alert("i18n.notice", result.desc,btnConfig);
					}
				});
			},
			//外部单field1...fieldn功能
      _addField(){
        var _this = this;
        var routerParms = this.$route.query;
        var fieldval = [];  //存储外部单的field的值
        for (var attr in routerParms) {
          if (attr.includes("field")) {
            fieldval.push(routerParms[attr])
          }
        }
        this.schema.some((item, index) => {
          if (item._type == "TextField" && item.value == undefined) {
            item.value = fieldval[index];
            if (item.value) {
              _this.$refs.formBase.hasLinkAdvm({key: item._id, value: item.value}, false)
              _this.$store.commit('setValue', {key: item._id, value: item.value})
            }
            return index == (fieldval.length-1);
          }
        });
      },
      isRelevanceFlowNodeItemKeys() {
        // 如果关联了人员控件，且人员控件没有选人，则跳到人员控件字段
        if (this.FlowAuditUser.length) {
          var arr = this.FlowAuditUser;
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].startAuditList.flowNodeItemKeys && arr[j].startAuditList.allUser.length === 0) {
              let incharges = arr[j].startAuditList.userSelected;
              if (!incharges.length) {
                var schema = this.$store.state.formBase.schema, labels = [];
                for (let i = 0; i < schema.length; i++) {
                  if (arr[j].startAuditList.flowNodeItemKeys.indexOf(schema[i]._id) != -1) {
                    labels.push(schema[i].label);
                    schema[i].help = `请填写${schema[i].label}`
                  }
                }
                var ids = arr[j].startAuditList.flowNodeItemKeys.split('|');
                _.tooltips_succeed(`已关联${labels}字段，请先填写`, true, "");
                scroll_height(ids[0]);
                return false
              }
            }
          }
        }
        return true;
      },
			//提交表单按钮
			submited() {
				if(this.stopClick) return;
				this.status = '1';
				let checkUser = true;
				if(this.toPersonList.length > 500) {
					return _.alert('提示','负责人超过500人，请重新编辑。若你无法编辑，请联系管理员登陆企微云后台调整');
				} else if (this.ccPersonList.length > 500) {
					return _.alert('提示','相关人超过500人，请重新编辑。若你无法编辑，请联系管理员登陆企微云后台调整');
				}
				if (this.getFormData()) {
					// isTask：2审批单 / 3外部单
					if (this.isTask == 2 || this.isTask ==3) {
						var data = {
							creator: this.dataBase.config.userId,
							checkUser:checkUser,
							isFree: this.isFreeFlow == '2'? '0': this.isFreeFlow,
							flowListLength: this.flowList.length,
							flowId: this.flowId,
							FlowAuditUser: this.FlowAuditUser,
							isBranchNode: this.isBranchNode,
							appointNodeAndUserVOList: this.appointNodeAndUserVOList,
							appointCallback: this.appointCallback,
							branchNodeCallback: this.branchNodeCallBack,
							showUserBoxCallback: this.showFlowAuditUserBox
            }
            if(!this.isRelevanceFlowNodeItemKeys()) return;
            audit_flow_api.isCheckFlow(data, this.submitedData);
          } else {
						this.submitedData();
					}
				}
			},
			saveDraft() {
				if(this.stopClick) return;
				this.status = '0';
				//草稿不需要验证单的信息
				this.submitedData();
			},
			stringUserIds(array) {
				let ids = array.map((value)=>{
					return value.userId;
				})
				return ids;
			},
			formFieldControlList(data){
				if(!data) return
				var map = {};
				var _this = this;
				data.forEach((item)=>{
					//外部单的控制
					if(_this.isOpen){
						map[item.itemKey] = item.isRead?true:false;
					}else{
						map[item.fieldId] = item.isRead?true:false;
					}
				});
        setFieldShowRead(this.$store,map)
			},
			submitedData() {
				var _this = this;
				this.stopClick = true;
				var itemMap = filterData(this.$store);
				var relatives = this.stringUserIds(this.ccPersonList).join(',');
				var incharges;
				var chooseFlowUser;
				var flowDpId ;
				var flowChioseNodeAuditUserJson;
				// isTask：2审批单 / 3外部单
				if (this.isTask == 2 || this.isTask == 3) {
					if (this.isFreeFlow == 3) {
						if (this.FlowAuditUser.length) {
							this.$store.commit("saveChoiseFlowUserJson");
							chooseFlowUser = this.choiseFlowUserJson;
							flowDpId = this.flowDpIdJson;
						}
					} else {
						if (this.FlowAuditUser.length) {
							var userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
              if (userSelected.length > 0) {
                var userIds = [...this.stringUserIds(userSelected)];
                if (this.isFreeFlow == 1) {
                  incharges = userIds.join(',');
                } else {
                  if (this.FlowAuditUser[0].isChoise != "1") {
                    chooseFlowUser = userIds.join('|');
                  }
                  if (this.FlowAuditUser[0].audtiFlag == "2") {
                    flowDpId = userSelected[0].deptId;
                  }
                }
              }
						}
					}

					if (this.appointNodeAndUserVOList.length) {
						flowChioseNodeAuditUserJson = JSON.stringify(this.flowChioseNodeAuditUserJson);
					}
				} else {
					var ids = this.toPersonList.map((value)=>{
						return value.userId;
					})
					incharges = ids.join(',');
				}
				var data = {};
					if(this.isOpen){
            if(this.isSurvey) { //满意度调查
              data = 	{
                id: this.id,
                definition_id: this.definition_id,
                status: 1,
                longitude:'',
                latitude:'',
                formTitle: this.newFormTitle,
                instanceTitle:this.newFormTitle,
                instanceTitleTemplate:this.instanceTitleTemplate,
                itemMap: itemMap,
                imageUrls: this.imgUploadPicList.map(item=>item.src).join(','),
                mediaIds: this.mediaList.map(item=>item.id).join(','),
                isAnonymous: this.isAnonymousValue,
                parallelNextNodeIds:this.parallelNextNodeIds,
                defAttr: 1,
                corpId: this.$route.query.field
              }
            } else {
              data = 	{
                id: this.id,
                definition_id: this.definition_id,
                status: 1,
                longitude:'',
                latitude:'',
                formTitle: this.newFormTitle,
                instanceTitle:this.newFormTitle,
                instanceTitleTemplate:this.instanceTitleTemplate,
                itemMap: itemMap,
                imageUrls: this.imgUploadPicList.map(item=>item.src).join(','),
                mediaIds: this.mediaList.map(item=>item.id).join(','),
                isAnonymous: this.isAnonymousValue,
                parallelNextNodeIds:this.parallelNextNodeIds
              }
            }

					}else{
						data={
							id: this.id,
							definition_id: this.definition_id,
							status: this.status,
							formTitle: this.newFormTitle,
							instanceTitle: this.newFormTitle,
							instanceTitleTemplate:this.instanceTitleTemplate,
							isAnonymous: this.isAnonymousValue,
							flowId: this.flowId,
							flowDpId: flowDpId,
							nextNodeId: this.nextNodeId,
							currentNodeId: this.currentNodeId,
							relatives:relatives,
							incharges:incharges,
							itemMap: itemMap,
							imageUrls: this.imgUploadPicList.map(item=>item.src).join(','),
							mediaIds: this.mediaList.map(item=>item.id).join(','),
							flowChioseNodeAuditUserJson: flowChioseNodeAuditUserJson,
							chooseFlowUser: chooseFlowUser,
              parallelNextNodeIds:this.parallelNextNodeIds
						}
					}
					if(this.queryType === 'edit' || 'toEdit'){
					  data.orderVersion = this.orderVersion;
          }
				_.showLoading('正在提交');
				_.ajax({
					url: this.submitURL,
					type: "POST",
					data: data,
					success: function (result) {
						_.hideLoading()
						if (result.code == "0") {
              removeFormData();
              if(_this.isSurvey) {  //满意度调查查看抽奖
                _this.surverSuccess = true;
                _this.giftInfo.giftName = false;
                this.isSurvey = false;
                return;
              }
							if(_this.isOpen){
								_this.succeedData.openDetailId = result.data.tbFormWorkOrderPOId;
								_this.succeedData.url = result.data.url;
								_this.succeedWin = true;  //是外部单则打开提交成功页面
                return;
              }
							if(_this.status == '0'){
                updateCache(null, true); //更新首页数量信息
								_this.$router.push({name: 'draft'});
							}else if(_this.status == '1'){
                updateCache('mine', true); //更新首页数量信息
                _this.$router.push({name: 'mine'});
							}
						} else {
              _this.stopClick = false;
              if(_this.isSurvey) {
                _this.showAddError = true;
                return;
              }
							_.alert('提示', result.desc);
						}
					}
				});
			},
			validations() {
				var schema = this.$store.state.formBase.schema;
				return form_validation(schema);
			},
			getFormData() {
				return this.validations();
			},
			editTitle() {
				this.updateTitle = true;
				this.titleLength = this.formTitle.length?this.formTitle.length:0;
				this.$nextTick(()=>{
          var el = this.$refs.updateTitle;
          el.focus();
          var range = this.getSelectedText(); //创建range
          range.selectAllChildren(el); //range 选择obj下所有子内容
          range.collapseToEnd(); //光标移至最后
        })
			},
      // 兼容性处理，获取所选的对象，用于鼠标聚到文本尾部
      getSelectedText() {
        var txt = '';
        if (window.getSelection) {
          txt = window.getSelection();
        } else if (window.document.getSelection) {
          txt = window.document.getSelection();
        } else if (window.document.selection) {
          txt = window.document.selection.createRange().text;
        }
        return txt;
      },

			// 选择相关人
			ccPersonListShowBox(){
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
					_this.ccPersonList = data.user.data;
				}
				dataBase.selectConfig.selectList.users.userSelected = this.ccPersonList;
			},

			toPersonListShowBox(){
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
					_this.toPersonList = data.user.data;
				}
				dataBase.selectConfig.selectList.users.userSelected = this.toPersonList;
			},
			// 加载自由流程的审批人
			confirmPick(type, isGet) {
				var _this = this;
				if (isGet) {
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "0" == type){
								_this.$store.commit('updateUserSelected',ccOrTolist);
							}
						}
					});
				} else {
					this.$store.commit('updateUserSelected',[]);
				}
			},
			confirmToPick(type, isGet){
				var _this = this;
				if(isGet){
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "0" == type){
								_this.toPersonList = ccOrTolist;
							}
						}
					});
				}else{
					this.toPersonList.splice(0,this.toPersonList.length);
				}
			},
			confirmCCPick(type, isGet){
				var _this = this;
				if(isGet){
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "1" == type){
								_this.ccPersonList = ccOrTolist;
							}
						}
					});
				}else{
					this.ccPersonList.splice(0,this.ccPersonList.length);
				}
			},
			//删除负责人
			removeToPerson(payload){
				this.toPersonList.splice(payload.index,1);
			},
			// 删除相关人
			removeCCPerson(payload) {
				this.ccPersonList.splice(payload.index,1);
			},
			toggleMsgfn() {
				this.showAllMsg = !this.showAllMsg;
				this.toggleMsg = this.showAllMsg ? '收起': '展开显示全部' ;
			},
			countLength({target}){
				this.titleLength = target.innerText.length
				if(target.innerText.length > 100){
					target.blur()	;
					this.titleLength = 100;
					target.innerText=target.innerText.slice(0,100)
				}
			},
			saveFormTitle({target}){            //存储临时标题内容并过滤表情字符（失焦过滤）
        let reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if(reg.test(target.innerText)){
          target.innerText = target.innerText.replace(reg,'');
          this.newFormTitle = target.innerText;
        }else{
          this.newFormTitle = target.innerText;
        }
			},
			showFlowAuditUserBox() {
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true});
			},
			showPersonList(title,list){
				this.userselectTitle = title;
				this.userSelectList = list;
				this.showPerson = true;
				this.limitPreview = true
			},
			// 自由选择处理人，显示选人弹窗
			appointCallback(){
				this.$store.commit("updateUserSelectedData", {type: "nextNodeListShow", data: true});
			},
			// 处理人员控件所选人员
			flowNodeItemKeysDate(){
        if (this.FlowAuditUser.length != 0) {
          this.FlowAuditUser.forEach((value, index) => {
            if (value.flowNodeItemKeys) {
              var ItemKeys = [];
              ItemKeys = value.flowNodeItemKeys.split('|');
              let users = [];
              let userItem = [];
              for (let i = 0; i < ItemKeys.length; i++) {
                var person = this.$store.state.formBase.data[ItemKeys[i]] || [];
                userItem.push(...person);
                if (userItem) {
                  userItem.forEach(item => {
                    let arry = item.split('_');
                    arry.pop();
                    users.push(arry.join('_'));
                  });
                }
              }
              let ids = users.unique().join(',');
              getMember(ids, (res) => {
                this.$store.commit('updateItemKeysSelected', {index: index, data: res});
              });
            }
          })
        }
			},
			branchNodeCallBack(){
				var _this = this;
                // 是否实例化过的表单
                if(this.isInstancesFlow) {
                  var data = {
                    initRefId: this.$route.query.id,//实例id
                    currentNodeId: this.parallelCurrentNodeId == "" ? this.currentNodeId : this.parallelCurrentNodeId,
                  }
                }else {
                  var data = {
                    templateRefId: this.definition_id,//版本id
                    currentNodeId: this.parallelCurrentNodeId == "" ? this.currentNodeId : this.parallelCurrentNodeId,
                  }
                }
				let typeMap = this.$store.state.formBase.typeMap;
				let choiceMap = this.$store.state.formBase.choiceMap;
				let formData = JSON.parse(JSON.stringify(this.$store.state.formBase.data));
				let newData = {};
				for(let i in formData){
					//	不同的字段类型不同传参
					switch(typeMap[i]){
						case 'MEMBERCustomerField':		//	通讯录字段
						case 'DEPTCustomerField':			//	部门字段
						case 'CRMCustomerField':			//  CRM字段
							newData['searchValue.'+ i] = formData[i].join('|');
						break;
						case 'RadioButton':						// 单项选择
						case 'DropDown':							// 下拉框
							newData['searchValue.'+ i] = choiceMap[formData[i]]
						break;
            case 'CheckBox':              //多选
              let checkVal = formData[i];
              if(checkVal){
                let val = []
                for (let j=0;j<checkVal.length;j++){
                  val.push(choiceMap[checkVal[j]]);
                }
                newData['searchValue.'+ i] = val.join(',');
              }
              break;
						default:
							newData['searchValue.'+ i] = formData[i];
					}
				}
				data = Object.assign(data,newData)
				audit_flow_api.findBranchFlowNextNodeInfo(data, (result) => {
					this.$store.commit('updateFlowAuditUser', result.nodeInfo);
					this.$store.commit('updateAppointNodeVOList', result.appointNodeAndUserVOList);
					this.$store.commit("updateNextNodeList", result.nextNodeList);
					this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: result.nextNodeId});
					this.$store.commit("updateUserSelectedData", {type: 'nextNodeListShow', data: true});
					this.$store.commit('updateUserSelectedData', {type: 'parallelNextNodeIds', data: result.parallelNextNodeIds});
          // 更新下拉选择节点名称
          this.$store.commit("updateChooseNodeName");
          _this.flowNodeItemKeysDate();
				})
			},
			searchFlowList() {
				var _this = this;
				var refId = this.queryType == "edit" ? _this.$route.query.id : "";
				var dataParam = {
					id: _this.definitionVersionsId,
					definitionId: _this.definition_id,
					isBranchFlow: _this.isFreeFlow == 3 ? true : false,
          refId: refId,
          agentCode: this.dataBase.wxqyh_uploadfile.agent
				}
				var config = {
				  id: this.id,
          definitionId: _this.definition_id,
					isFreeFlow: _this.isFreeFlow,
				}
				// 固定、分支请求流程列表 /portal/flow/flowAction!ajaxSearchFlowList.action
        _this.showFormBase = false;
        audit_flow_api.searchFlowList(dataParam, config, function (data) {
          _this.showFormBase = true;
					_this.$store.commit('updateFlowAuditUser', data.nodeInfo);
					_this.$store.commit('updateAppointNodeVOList', data.appointNodeAndUserVOList);
					_this.$store.commit('updateFlowList', data.flowList);
					_this.$store.commit('updateUserSelectedData', {type: 'flowId', data: data.flowId});
					_this.$store.commit("updateUserSelectedData", {type: 'currentNodeId', data: data.currentNodeId})
					_this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: data.nextNodeId})
					_this.isBranchNode = data.isBranchNode;
          _this.parallelCurrentNodeId = data.parallelCurrentNodeId;
					//表单字段的可见信息
					var firstFieldControlList = data.firstFieldControlList;
					if(firstFieldControlList){
						_this.formFieldControlList(firstFieldControlList);
					}
          _this.flowNodeItemKeysDate();
				});
			},
			editAgain(){
				this.$store.commit('reset');
				this.initForm();
				this.succeedWin = false;
			},
      //修改富文本中的网址和图片地址
      formatContent(str){
        str = _.checkURL(str,false)
        return str.replace(/@fileweb@\/compress/g,_.compressURL);
      },
      //富文本添加图片点击
      imgsClickFunc(){
        if(!this.$refs.content) return;
        this.previewImageUrl= []
        var imgs = this.$refs.content.getElementsByTagName('img');
        var contentPic = [];
        for(let i=0;i<imgs.length; i++){
          imgs[i].classList.add("previewImages")
          contentPic.push({picPath:imgs[i].src.replace(/compress\//,'',)});
        }
        this.previewImageUrl = contentPic;
        for(let i=0;i<imgs.length; i++){
          imgs[i].addEventListener('click',(event)=>{
            EventBus.$emit("previewImages",event.target.currentSrc.replace(/compress\//,''), this.previewImageUrl);
          })
        }
      },
      //分享的代码
      share(shareVO){
        _.checkApi.setDataForWeixinValue(
          shareVO.shareTitle,
          shareVO.shareImg,
          shareVO.shareContent.replace(/<[^>]+>/g,""),
          shareVO.shareUrl.split("#")[0]+"#"+shareVO.shareUrl.split("#")[1]
        );
      },
      //加载外部单需要的数据
      loadCss(){
        if(this.isMobile) return;
        this.style = document.createElement('style');
        this.style.type = 'text/css';
        this.style.rel = 'stylesheet';
        try{
          this.style .appendChild(document.createTextNode(
            '.qwui-nav_box_fixed, .qwui-footer_tabbar, ' +
            '.qwui-search_mask, .qwui-menu_tab_two_fixed, ' +
            '.qwui-btn_box, .qwui-menu_tab_fixed, .qwui-mask, ' +
            '.qwui-chat_comment_box, .qwui-tabbar, .qwui-dialog_bottom, ' +
            '.qwui-loading_mask, .qwui-rate_nav_fixed, ' +
            '.qwui-statistic_top_msg, .qwui-nav_footer_fix, ' +
            '.qwui-nav_tabs.top, .qwui-tips, ' +
            '.img_box, .qwui-login, .qwui-bar, ' +
            '.qwui-my .bg_img,.qwui-crm_select, ' +
            '.qwui-flow_tip {width: 400px !important;} ' +
            '.qwui-dialog {width:375px !important;} ' +
            'body {background:#F0F1F2}'));
        }catch(ex){
          this.style.styleSheet.cssText = code;
        }
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(this.style);
      },
		},
    beforeRouteLeave (to, from , next) {
      if (window.hasAlert) {
        EventBus.$emit("closeAlert");
        next(false)
      } else {
        next()
      }
    },
		watch:{
				'schema': {
					handler() {
						var val = {
							key:'',
							value:''
						}
						this.fieldChange(val)
					},
					deep: true
				},

    },
    beforeDestroy() {
      if(this.style) {
        document.getElementsByTagName('head')[0].removeChild(this.style);
      }
    }
	}

</script>
<style scoped>
  .wrap {
    overflow: initial;
  }
	.qwui-flow_tip.red {
		background-color: #FFE8E8;
	}
	.qwui-flow_word.red {
		color: #FF666E;
	}
	.tipMargin {
		margin-top: 36px;
	}
  .ctitle{
    white-space:pre-wrap;
  }
  .suxing{
    text-indent: 5px;
    padding: 5px 0;
  }
  .suxing i {
    color: #8d8d8d;
    font-size: 16px;
    margin-right: 5px;
  }
  .suxing span {
    color: #666;
  }
  .uploadFile{
    padding:0 5px 10px 15px;
    clear: both;
    background-color: #fff;
  }
  .uploadFile-imgList{
    margin-bottom: -10px;
  }
  .clearfix::after{
    content:"";
  　height:0;
  　line-height:0;
  　display:block;
  　visibility:hidden;
  　clear:both;
  }
  .clearfix{
　zoom:1;
  }
  .upload-file-mr{
    margin-right: 10px;
  }
  .upload-file-mr-hasImg {
    margin-top: 7px;
  }
	.openFooterContent {
		line-height: 16px;
		padding: 10px 20px;
		text-align: center;
	}
	.openFooterContent a {
    position: relative;
		font-size: 12px;
		color: #999;
	}
	.openFooterContent img {
		width: 15px;
		height: 15px;
    vertical-align: text-top;
  }
  .anonymous-ubmit{
    margin:20px 0 50px 15px;
  }
  .form_flowFiled_box {
    display: flex;
    justify-content:center;
    margin: 0 14px;
    padding: 15px 0;
    border: 1px #e5e5e5 dashed;
    border-radius: 2px;
    background-color: #f5f5f5;
  }
  .form_flowFiled_box p{
    font-size: 14px;
    color: #A6A6A6;
  }
  .form_icon_flowFiled {
    margin-right: 8px;
    width: 36px;
    height: 40px;
    background: url(../../../../assets/images/form_icon_flowFiled.png) no-repeat;
    background-size: cover;
  }
  .openDetail-wrap {
    width: 400px !important;
    margin: 28px auto;
    overflow: visible;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 14px 32px 0px rgba(201,205,214,0.8);
  }
  .already-fill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    color: #FFA721;
    background: #FFF6E8;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all .2s ease-in;
  }
  .slide-enter, .slide-leave-to {
    transform: translate3d(0, -100%, 0);
    opacity: 0;
  }
  .form-qrcode-box {
    position: fixed;
    padding: 16px 16px 15px;
    background: #C8CACC;
    border-radius: 4px;
    left: 50%;
    transform: translateX(240px);
  }
  .form-qrcode-container {
    background: #fff;
    padding: 10px 10px 6px;
    margin-bottom: 12px;
    border-radius: 2px;
  }
  .form-qrcode-msg {
    text-align: center;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
  }
  .approveType {
    color: #B2B9C8;
  }

</style>
