<template>
  <div class="wrap">
    <div :class="{'form-bg':!isOpen}">
      <div class="form_title_box">
        <div class="form-title-read">
          <span class="ctitle">{{formTitle}}</span>
          </span>
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
    <formBase v-show="isShowFields" @setLinkage="getLinkage" @change="fieldChange" :addPage="true"/>
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
      <div class="form-bg">
        <flow_list v-if="isFreeFlow==2" :definition_id="definition_id" :id="id"></flow_list>
      </div>
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
          <user_selected_item
            v-if="flowNodeItemKeysShow(index)"
            @showUserSelectedBox="FlowAuditUserShowBox(index)"
            :isEdit="item.startAuditList.isCanEdit"
            slot="user_selected_item"
            :List="item.startAuditList.userSelected"
            :title="startAuditTitle(item.nodeName)"
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
      <!--相关人员的内容--->
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
      <choose_nodeList v-if="nextNodeListShow" @saveNodeAuditUserJson="submitedData"
                       @showPersonList="showPersonList"></choose_nodeList>
    </div>

    <!--外部单底部logo-->
    <div class="openFooterContent">
      <a v-if="isTask == 3" href="http://wbg.do1.com.cn/" target="_blank">
        表单流程由
        <img src="../../../assets/images/newsmallLogo.svg" alt="">
        道一云|企微 免费提供
      </a>
      <p v-else>如果你还没有确定现在立即发布，可以保存为草稿，之后可以再次编辑。</p>
    </div>
    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>

    <!--个人信息-->
    <user-info></user-info>

    <!--人员列表组件-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview"
               :show.sync="showPerson"></user_show>

    <!--crm字段信息-->
    <crm_info></crm_info>
  </div>
</template>

<script>

  import img_detail from 'vpCommon/add/upload/add_img'
  import file_detail from 'vpCommon/add/upload/add_file'
  import childView from '../childView'
  import EventBus from 'vpModule/utils/eventBus';
  import formBase from '../formBase.vue'
  import user_selected_item from 'vpCommon/base/userOrDeptSelect/user_selected'
  import user_selected_group from 'vpCommon/base/userOrDeptSelect/user_selected_group'
  import userInfo from 'vpCommon/detail/user_info_card';//个人信息
  import previewImages from "vpCommon/detail/previewImages";  //图片预览组件
  //修改数据的函数
  import {form_validation, filterData} from 'vpModule/js/form/validation'
  //导入fields的兼容性方法
  import {compatible} from 'vpModule/js/form/compatible'
  //选人的导入
  import related_person_detail from 'vpCommon/add/user_select_icon_right';
  import user_choose from 'vpCommon/base/user_or_dept_select.vue' //js导入
  import flow_button from 'vpCommon/button/flow_button';
  import select_crm from '../base/select_crm.vue'
  import crm_info from '../base/crm_info';
  //流程的组件的导入
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import user_selected_ranglist from 'vpCommon/base/userOrDeptSelect/user_selected_ranglist'
  import choose_nodeList from '../chooseNodeList'
  import flow_list from "vpCommon/flow/flow_list";
  import {
    setFieldShowRead,
    getFrom,
    render_field,
    getOldGivenList,
    saveFormData,
    removeFormData,
    getFormData,
    setFieldShowHide,
    loadScript,
    getMember,
    isEmpty
  } from 'vpModule/js/form/getData'
  import Vue from 'vue'
  import audit_flow_api from 'vpCommon/flow/api/getData'
  import addFileList from 'vpCommon/add/upload/addFileList'
  import AddImg from 'vpCommon/add/upload/add_img';
  import AddImgList from 'vpCommon/add/upload/imgList';
  import user_show from 'vpCommon/detail/user_show'

  export default {
    name: 'addPreview',
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
      userInfo,
      addFileList,
      AddImgList,
      AddImg,
      user_show,
      crm_info,
      previewImages
    },
    data() {
      return {
        dataBase: dataBase,
        submitURL: '',
        queryType: '',
        formTitle: '',
        formStop: '',
        content: '',
        //提交表单需要的数据
        id: '',
        definition_id: '',
        isFreeFlow: '',
        isTask: '',
        isBranchNode: false,
        orderId: '',       //图片水印参数
        definitionVersionsId: '',
        chooseImageTypes: [],//手机端图片上传参数
        status: '',
        instanceTitleTemplate: '',
        instanceTitle: '',
        isUpdateTitle: true,//标题是否能更新
        updateTitle: false,
        buttonConfig: { //操作按钮
          primaryList: [{type: "primary", name: '立即提交', callBack: null}],
          defaultList: [{type: "default", name: '保存为草稿', callBack: null}],
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
        imgUploadPicList: [],
        showPerson: false,                                                   //是否展开所有选中人员列表
        userselectTitle: '',
        userSelectList: [],
        limitPreview: false,                                                //限制弹个人信息弹窗
        deleteFileList: {},   //删除文件附件
        deleteImage: {},      //删除图片附件
        isInstancesFlow: '',  //是否实例化表单
        previewImageUrl: [],
        //需要预览的图片列表
        parallelCurrentNodeId: '',
        curEditFieldId: '',                                                      //触发数据联动时当前用户正在编辑的字段id
      };
    },
    computed: {
      ...mapState({
        FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow, // 是否显示选人弹窗
        nextNodeListShow: state => state.userSelected.nextNodeListShow, // 是否显示选择下一个节点
        FlowAuditUser: state => state.userSelected.FlowAuditUser, // 处理人信息
        //ccPersonList: state => state.userSelected.ccPersonList, // 相关人信息
        flowChioseNodeAuditUser: state => state.userSelected.flowChioseNodeAuditUser, // 当前节点指定处理人的处理人信息
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
        appointUserIndex: state => state.userSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
      }),
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
      ]),
      isShowFields() {
        return this.isFreeFlow == 2 && !this.queryType ? this.flowId == "" ? false : true : true
      },
      schema() {
        return this.$store.state.formBase.schema;
      },
      //手机
      isMobile() {
        return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
      }
    },
    created() {
      var EventBus = new Vue();
      document.documentElement.style.overflow = "scroll"
      document.documentElement.style.background = "#ddd";
      this.$root.EventBus = EventBus;
      this.$store.commit('reset');
      var _this = this;
      this.initForm();
      this.buttonConfig.primaryList[0].callBack = function () {
      };
      this.buttonConfig.defaultList[0] ? this.buttonConfig.defaultList[0].callBack = function () {
      } : '';
      // 重置数据
      this.$store.commit('resetFlowData');
      this.$store.commit('resetDetailData');

      // 外部单默认展开
      this.isOpen && this.toggleMsgfn();
    },
    updated() {
      var content = document.getElementsByClassName('form-detail-content')[0]
      if (content) {
        var contentH = content.offsetHeight;
        if (contentH > 129) {
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
      startAuditTitle: function (nodeName) {
        return nodeName ? nodeName + '处理人' : '处理人'
      },
      // 选择处理人弹窗
      FlowAuditUserShowBox(index) {
        this.$store.commit('updateUserSelectedData', {type: 'appointUserIndex', data: index})
        // 如果是指定范围选人
        if (this.FlowAuditUser[index].startAuditList.assignRange) {
          this.$store.commit('updateUserSelectedData', {type: "FlowAuditUserBoxShow", data: true})
        } else {
          var _this = this;
          dataBase.selectConfig.show = true;
          dataBase.selectConfig.signIndex = 'users';
          dataBase.selectConfig.selectList.users.callBack.confirm = function (id, data) {
            _this.$store.commit('updateUserSelected', data.user.data)
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
      isItemKeys(keys) {
        var str = '';
        if (keys) {
          this.$store.state.formBase.schema.forEach((item) => {
            if (keys.indexOf(item._id) >= 0) {
              str += item.label + '，';
            }
          })
        }
        return str.substring(0, str.length - 1);
      },
      // 选择处理人后
      FlowAuditUserResult(payload) {
        this.$store.commit('updateUserSelectedData', {type: "FlowAuditUserBoxShow", data: false})
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      showMsgFromImgDetail(imgurl) {
//				this.commitDraft.draftFormData['imageUrls'] = '';
//				this.commitDraft.draftFormData['imageUrls'] = this.arrayToString(imgurl, 1);
      },
      setImgUploadValue(val) {
        this.imgUploadPicList = val;
      },
      showMsgFromFileDetail(mediaId) {
        this.mediaList.concat(mediaId);
      },
      deleteFileItem(item) {
        this.deleteFileList = item;
      },
      handleDeleteImage(item) {
        this.deleteImage = item;
      },
      taggleAnonymous() {
        if (this.isAnonymousValue) {
          this.isAnonymousValue = '';
          this.buttonConfig.primaryList[0].name = '立即提交';
        } else {
          this.isAnonymousValue = 1;
          this.buttonConfig.primaryList[0].name = '匿名提交';
        }
      },
      fieldChange(val) {
        var formData = this.$store.state.formBase.data;
        if (JSON.stringify(val) != '{"key":"","value":""}') {
          saveFormData(JSON.stringify(formData));
        }
      },
      getLinkage(val, isCircle) {//获取并渲染联动数据
        var _this = this;
        var linkageMap = _this.$store.state.formBase.linkageMap;
        var isConflict = false;
        if (!isCircle) {
          _this.curEditFieldId = val.key;
        } else {
          let circleItem = _this.$store.state.formBase.schema.find(x => {
            return x._id == _this.curEditFieldId
          });
          if (circleItem.predefinedType === 3 && !isEmpty(circleItem.linkage)) {
            if (circleItem.linkage.condition[0].curItemKey == val.key) isConflict = true;
          }
        }
        if (isEmpty(val.value) || isConflict) {
          return;
        }
//        作关于单项选择与下拉框取值兼容的问题
        let fieldItem = _this.$store.state.formBase.schema.find(x => {
          return x._id == val.key
        });
        if (['RadioButton', 'DropDown'].indexOf(fieldItem._type) > -1) {
          val.value = fieldItem.choices.find(x => {
            return x._id == val.value
          }).value;
        }

        let _data = [];//传递的参数
        let data = {
          conditions: [],
          curDefinitionId: _this.$store.state.detail.detailData.controlPO.definitionId
        };
        linkageMap.forEach(item => {
          if (item.curItemKey == val.key) {
            let condition = JSON.parse(JSON.stringify(item));
            switch (typeof val.value) {
              case 'string' :
              case 'number' :                     //兼容评分字段
                condition.keyWord = [];
                condition.keyWord.push(val.value);
                break;
              case 'object' :
                condition.keyWord = val.value;
                break;

            }
            delete condition.curItemKey;
            _data.push(condition);
          }
        });
        data.conditions = _data
        data = JSON.stringify(data);
        this.getLinkageData(data);
      },
      //获取联动显示数据
      getLinkageData(data) {
        var _this = this;
        var linkageURL = _this.isOpen ? '/open/openForm/showRefDataForCondition.do' : '/portal/portalForm/showRefDataForCondition.do';
        _.ajax({
          url: _.baseURL + linkageURL,
          type: 'POST',
          dataType: 'json',
          data: {
            conditions: data
          },
          success: function (result) {
            if (result.code == 0) {
              var linkageDataList = JSON.parse(JSON.stringify(result.data.resultValues));
              linkageDataList.forEach((item) => {
                let map = {};
                map['key'] = item.itemKey;
                map['value'] = isEmpty(item.value) ? '' : JSON.parse(JSON.stringify(item.value))[0];
                let ids = _this.$store.state.formBase.linkageIds;//当返回结果字段id也为驱动字段id时，再次触发数据联动
                if (ids.indexOf(item.itemKey) != -1) {
                  _this.getLinkage(map, true);
                }
                //作关于单项选择与下拉框取值兼容的问题
                let fieldItem = _this.$store.state.formBase.schema.find(x => {
                  return x._id == map.key
                });
                if (['RadioButton', 'DropDown'].indexOf(fieldItem._type) > -1) {
                  map.value = fieldItem.choices.find(x => {
                    return x.value == map.value
                  })._id;
                }
                //解決多行文本字段无法实时更新的问题
                if (['TextArea'].indexOf(fieldItem._type) > -1) {
                  $('#field' + item.itemKey).find('.textarea_div_edit').text(map.value);
                }
                _this.$store.commit('setValue', map);
                _this.fieldChange(map);
                form_validation(_this.$store.state.formBase.schema);
              });
            } else {
              console.log(result.desc);
            }
          },
        });
      },
      initForm() {
        var _this = this;
        this.id = this.$route.query.id;
        _.showLoading()
        getFrom("preview", this.id).then(function (result) {
          _this.stopClick = false;
          if (result.code == "0") {
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
              _this.$nextTick(() => {
                _this.imgsClickFunc();
              })
              _this.definition_id = result.data.id
              _this.isInstancesFlow = result.data.isInstancesFlow;
              _this.definitionVersionsId = detailsPO.definitionVersionsId;
              _this.orderId = result.data.isImgWatermark ? _this.definitionVersionsId : '';//图片水印传参 ：orderId
              _this.chooseImageTypes = controlPO.formPhotoSet && "0" == controlPO.formPhotoSet ? ['album', 'camera'] : ['camera'];//手机端图片上传控制

              //数据联动
              var linkageMap = [],
                linkageIds = [],
                linkageIdGroups = [];
              schema.forEach(function (field) {
                if (field.predefinedType === 3 && !isEmpty(field.linkage)) {
                  let curShowKey = field._id,
                    linkage = field.linkage,
                    linkageMapData = {},
                    idGroups = [],
                    arr = [],
                    isSame = false;
                  for (let x = 0, l = linkage.condition.length; x < l; x++) {
                    let linkageMapData = {};
                    let curItemKey = linkage.condition[x].curItemKey;

                    linkageMapData.curShowKey = curShowKey;
                    linkageMapData.curItemKey = curItemKey;
                    linkageMapData.refFormId = linkage.refFormId;
                    linkageMapData.refShowKey = linkage.refShowKey;
                    linkageMapData.refItemKey = linkage.condition[x].refItemKey;

                    linkageIds.indexOf(curItemKey) == -1 && linkageIds.push(curItemKey);
                    idGroups.push(curItemKey);
                    linkageMap.push(linkageMapData);
                  }
                  arr.push(idGroups);
                  !isEmpty(linkageIdGroups) && linkageIdGroups.forEach(item => {
                    isEquals(item, arr) && (isSame = true);
                  });
                  !isSame && linkageIdGroups.push([idGroups]);
                }
              });
              !isEmpty(linkageMap) && _this.$store.commit('setLinkageMap', linkageMap);                        //存储数据联动条件信息
              !isEmpty(linkageIds) && _this.$store.commit('setLinkageIds', linkageIds);                        //存储作为数据联动驱动字段的id
              !isEmpty(linkageIdGroups) && _this.$store.commit('setLinkageIdGroups', linkageIdGroups);         //存储作为数据联动驱动字段的id组合
//            linkage测试
//              var linkageMap = {fo6c4cc725b5c9451a9f492fabd4059cc7:{refItemKey: "foa8935dbed62e44e28153ed9f54789398", refFormId: "formdac6fe802d954ca5bb0ebbeb45196016", refShowKey: "fo31e916b8901540e184b3abbba9f67a6a"}};
//            _this.$store.commit('setLinkageMap',linkageMap);
              var defaultData = Object.assign(result.data.default, result.data.itemMap);
              //获取缓存数据
              var cacheData = getFormData();
              if (cacheData) {
                defaultData = Object.assign(defaultData, JSON.parse(cacheData));
              }
              if (result.data.isNewVersions) {
                _.alert("提示", "该表单已发布新版本，请确定你填写的数据");
              }
              //表单标题不可编辑
              if (controlPO.isUpdaeTitle == 0) {
                _this.isUpdateTitle = false;
              }
              if (controlPO.isAnonymous == '1') {
                _this.isAnonymous = true;
              }
              if (controlPO.isPic == '1') {
                _this.isPic = true;
              }
              if (controlPO.isFile == '1') {
                _this.isFile = true;
                _this.isFileMust = controlPO.isFileMust || false;
              }
              var mediaList = result.data.mediaList;
              _this.mediaList = mediaList;
              if (result.data.picList && result.data.picList.length > 0) {
                var list = [];
                result.data.picList.forEach((item, index) => {
                  list.push({src: item.picPath});
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
              render_field(store, schema, defaultData);
              //setFormDetail
              store.commit('setFormDetail', controlPO);
              store.commit('setSelectQuota', quota);
              var resultData = {
                controlPO: result.data.controlPO,
                detailsPO: result.data.detailsPO,
                isImgWatermark: result.data.isImgWatermark
              }
              store.commit('updateDetailData', resultData);
              _this.formTitle = result.data.detailsPO.title;

              //允许修改相关人
              if (controlPO.isRelevants == "1") {
                _this.isRelevants = true;
                _this.ccPersonList = result.data.relevantList || result.data.receiveList || [];
                if (controlPO.isDisableRelevants == "0") {
                  _this.editCCPerson = true;
                  //新增时显示加载上一次开关
                  _this.loadLastConfig.ccPersonList.show = true;
                }
              }
              //不是审批单的负责人显示,审批单的负责人是审批人
              _this.isTask = controlPO.isTask;
              _this.isOpen = _this.isTask == 3;
              if (controlPO.isTask != 2 && controlPO.isTask != 3) {
                //隐藏审批单的处理人，如果是普通单和任务单就显示
                _this.FlowAuditUser.length = 0;
                if (controlPO.isRelatives == "1") {
                  _this.isRelatives = true;
                  _this.toPersonList = result.data.givenList || result.data.inchargesList || []
                  if (controlPO.isDisableRelatives == "0") {//允许添加负责人的属性
                    _this.editToPerson = true;
                    //新增时显示加载上一次开关
                    _this.loadLastConfig.toPersonList.show = true;
                  }
                }
              }
              _this.isFreeFlow = controlPO.isFreeFlow;
              if (controlPO.isTask == 2 && controlPO.isFreeFlow == "1") {
                //负责人进入编辑页面不显示处理人编辑入口
                if (result.data.controlPO.isDisableRelatives != '0') {
                  _this.FlowAuditUser[0].startAuditList.isCanEdit = false;
                } else {
                  _this.FlowAuditUser[0].startAuditList.isCanEdit = true;
                  //新增时显示加载上一次开关
                  _this.loadLastConfig.auditPersonList.show = true;
                }
              }
              //审批单，判断是什么流程,isFreeFlow=="1"自由流程isFreeFlow=="2"固定流程 isFreeFlow=="3"分支流程
              if (controlPO.isTask == 2 && controlPO.isFreeFlow == "1") {
                _this.$store.commit('resetFlowAuditUser');
                //修改自由流程的审批人员的store
                if (controlPO.isRelatives == "1") {
                  var auditPerson = result.data.givenList || result.data.inchargesList || [];
                  _this.$store.commit('updateUserSelected', auditPerson);
                }

              }
              if ((controlPO.isTask == 2 && controlPO.isFreeFlow != "1") || controlPO.isTask == 3) {
                _this.searchFlowList();
              }
            })
          } else {
            let btnConfig = {
              primaryBtn: {name: "i18n.confirm", callBack: null},
              defaultBtn: {name: "", callBack: null},
            };
            if (result.code == '22107') {//设置项不允许普通单/任务单的负责人重新提交表单
              btnConfig.primaryBtn.callBack = function () {
                _this.$router.push({name: 'detail', query: {id: _this.id}});
              }
            } else {
              btnConfig.primaryBtn.callBack = function () {
                _this.$router.go(-1);
              };
            }
            _.alert("i18n.notice", result.desc, btnConfig);
          }
        });
      },
      stringUserIds(array) {
        let ids = array.map((value) => {
          return value.userId;
        })
        return ids;
      },
      formFieldControlList(data) {
        if (!data) return
        var map = {};
        var _this = this;
        data.forEach((item) => {
          //外部单的控制
          if (_this.isOpen) {
            map[item.itemKey] = item.isRead ? true : false;
          } else {
            map[item.fieldId] = item.isRead ? true : false;
          }
        });
        setFieldShowRead(this.$store, map)
      },
      validations() {
        var schema = this.$store.state.formBase.schema;
        return form_validation(schema);
      },
      getFormData() {
        return this.validations();
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
      ccPersonListShowBox() {
        var _this = this;
        dataBase.selectConfig.show = true;
        dataBase.selectConfig.signIndex = 'users';
        dataBase.selectConfig.selectList.users.callBack.confirm = function (id, data) {
          _this.ccPersonList = data.user.data;
        }
        dataBase.selectConfig.selectList.users.userSelected = this.ccPersonList;
      },

      toPersonListShowBox() {
        var _this = this;
        dataBase.selectConfig.show = true;
        dataBase.selectConfig.signIndex = 'users';
        dataBase.selectConfig.selectList.users.callBack.confirm = function (id, data) {
          _this.toPersonList = data.user.data;
        }
        dataBase.selectConfig.selectList.users.userSelected = this.toPersonList;
      },
      // 加载自由流程的审批人
      confirmPick(type, isGet) {
        var _this = this;
        if (isGet) {
          getOldGivenList({"type": type}).then(function (result) {
            if (result.code == "0") {
              var ccOrTolist = result.data.ccOrTolist;
              if (ccOrTolist && ccOrTolist.length > 0 && "0" == type) {
                _this.$store.commit('updateUserSelected', ccOrTolist);
              }
            }
          });
        } else {
          this.$store.commit('updateUserSelected', []);
        }
      },
      confirmToPick(type, isGet) {
        var _this = this;
        if (isGet) {
          getOldGivenList({"type": type}).then(function (result) {
            if (result.code == "0") {
              var ccOrTolist = result.data.ccOrTolist;
              if (ccOrTolist && ccOrTolist.length > 0 && "0" == type) {
                _this.toPersonList = ccOrTolist;
              }
            }
          });
        } else {
          this.toPersonList.splice(0, this.toPersonList.length);
        }
      },
      confirmCCPick(type, isGet) {
        var _this = this;
        if (isGet) {
          getOldGivenList({"type": type}).then(function (result) {
            if (result.code == "0") {
              var ccOrTolist = result.data.ccOrTolist;
              if (ccOrTolist && ccOrTolist.length > 0 && "1" == type) {
                _this.ccPersonList = ccOrTolist;
              }
            }
          });
        } else {
          this.ccPersonList.splice(0, this.ccPersonList.length);
        }
      },
      //删除负责人
      removeToPerson(payload) {
        this.toPersonList.splice(payload.index, 1);
      },
      // 删除相关人
      removeCCPerson(payload) {
        this.ccPersonList.splice(payload.index, 1);
      },
      toggleMsgfn() {
        this.showAllMsg = !this.showAllMsg;
        this.toggleMsg = this.showAllMsg ? '收起' : '展开显示全部';
      },
      countLength({target}) {
        this.titleLength = target.innerText.length
        if (target.innerText.length > 100) {
          target.blur();
          this.titleLength = 100;
          target.innerText = target.innerText.slice(0, 100)
        }
      },
      showFlowAuditUserBox() {
        this.$store.commit('updateUserSelectedData', {type: "FlowAuditUserBoxShow", data: true});
      },
      showPersonList(title, list) {
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        this.limitPreview = true
      },
      // 自由选择处理人，显示选人弹窗
      appointCallback() {
        this.$store.commit("updateUserSelectedData", {type: "nextNodeListShow", data: true});
      },
      // 处理人员控件所选人员
      flowNodeItemKeysDate() {
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
      branchNodeCallBack() {
        var _this = this;
        // 是否实例化过的表单
        if (this.isInstancesFlow) {
          var data = {
            initRefId: this.$route.query.id,//实例id
            currentNodeId: this.parallelCurrentNodeId == "" ? this.currentNodeId : this.parallelCurrentNodeId,
          }
        } else {
          var data = {
            templateRefId: this.definition_id,//模板id
            currentNodeId: this.parallelCurrentNodeId == "" ? this.currentNodeId : this.parallelCurrentNodeId,
          }
        }
        let typeMap = this.$store.state.formBase.typeMap;
        let choiceMap = this.$store.state.formBase.choiceMap;
        let formData = JSON.parse(JSON.stringify(this.$store.state.formBase.data));
        let newData = {};
        for (let i in formData) {
          //	不同的字段类型不同传参
          switch (typeMap[i]) {
            case 'MEMBERCustomerField':		//	通讯录字段
            case 'DEPTCustomerField':			//	部门字段
            case 'CRMCustomerField':			//  CRM字段
              newData['searchValue.' + i] = formData[i].join('|');
              break;
            case 'RadioButton':						// 单项选择
            case 'DropDown':							// 下拉框
              newData['searchValue.' + i] = choiceMap[formData[i]]
              break;
            default:
              newData['searchValue.' + i] = formData[i];
          }
        }
        data = Object.assign(data, newData)
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
        var flowId = this.queryType == "edit" ? _this.$route.query.id : "";
        var dataParam = {
          id: _this.definitionVersionsId,
          definitionId: _this.definition_id,
          isBranchFlow: _this.isFreeFlow == 3 ? true : false,
          flowId: flowId
        }
        var config = {
          id: this.id,
          definitionId: _this.definition_id,
          isFreeFlow: _this.isFreeFlow,
        }
        // 固定、分支请求流程列表 /portal/flow/flowAction!ajaxSearchFlowList.action
        audit_flow_api.searchFlowList(dataParam, config, function (data) {
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
          if (firstFieldControlList) {
            _this.formFieldControlList(firstFieldControlList);
          }
          _this.flowNodeItemKeysDate();
        });
      },
      //修改富文本中的网址和图片地址
      formatContent(str) {
        str = _.checkURL(str, false)
        return str.replace(/@fileweb@\/compress/g, _.compressURL);
      },
      //富文本添加图片点击
      imgsClickFunc() {
        if (!this.$refs.content) return;
        this.previewImageUrl = []
        var imgs = this.$refs.content.getElementsByTagName('img');
        var contentPic = [];
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].classList.add("previewImages")
          contentPic.push({picPath: imgs[i].src.replace(/compress\//, '',)});
        }
        this.previewImageUrl = contentPic;
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].addEventListener('click', (event) => {
            EventBus.$emit("previewImages", event.target.currentSrc.replace(/compress\//, ''), this.previewImageUrl);
          })
        }
      },
    },
  }

</script>
<style scoped lang="scss">
  body,html {
    background: #ddd;
    overflow: scroll !important;
  }
  .wrap {
    position: relative;
    overflow: hidden;
    min-width: 266px;
    .form-content {
      padding-bottom: 0;
    }
  }

  .ctitle {
    white-space: pre-wrap;
  }

  .suxing {
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

  .uploadFile {
    padding: 0 5px 10px 15px;
    clear: both;
    background-color: #fff;
  }

  .uploadFile-imgList {
    margin-bottom: -10px;
  }

  .clearfix::after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .clearfix {
    　zoom: 1;
  }

  .upload-file-mr {
    margin-right: 10px;
  }

  .upload-file-mr-hasImg {
    margin-top: 7px;
  }

  .openFooterContent {
    padding: 10px 20px;
    text-align: center;
    font-size: 0;
    color: #999;
    font-size: 12px;
    img {
      display: inline-block;
      width: 15px;
      height: 15px;
      vertical-align: middle;
    }
    a {
      color: #999;
      text-decoration: none;
    }
  }


  .anonymous-ubmit {
    margin: 20px 0 50px 15px;
  }

  .form_flowFiled_box {
    display: flex;
    justify-content: center;
    margin: 0 14px;
    padding: 15px 0;
    border: 1px #e5e5e5 dashed;
    border-radius: 2px;
    background-color: #f5f5f5;
  }

  .form_flowFiled_box p {
    font-size: 14px;
    color: #A6A6A6;
  }

  @media screen and (min-width: 1024px) {
      .wrap {
        width: 740px;
        margin: 0 auto;
      };
    }


</style>
