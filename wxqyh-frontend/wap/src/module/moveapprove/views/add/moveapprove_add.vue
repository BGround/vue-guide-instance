<template>
  <div class="wrap">
    <!--标题和类型-->
    <data_detail
      :dataDetailMsg="add_nav"
      :agent="agentCode"
      :autoCaching="autoCaching"
      :typeErrorTip="typeErrorTip"
      :titleErrorTip="titleErrorTip"
      :contentErrorTip="contentErrorTip"
      :isRequired="true"
      @listenToChild="showMsgFromDataDetail"
    >
    </data_detail>

    <qw-uploader
      fileType="images"
      :url="setUploadAction"
      :showTagUpload="false"
      :showUploadList="{showRemoveIcon: true}"
      :data="(file)=>setRequestParams(file,agentCode)"
      :fileList="imageList"
      :beforeReadFile="beforeReadImage"
      @wxChooseImage="(serverIds)=>saveWxChooseImage(wxChooseImageParams(serverIds,agentCode),getWxChooseImage)"
      @preview="(payload)=>previewFileList(payload)"
    ></qw-uploader>

    <qw-uploader
      list-type="picture-list"
      title="附件"
      fileType="file"
      :url="setUploadAction"
      :showUploadList="{showRemoveIcon: true}"
      :data="(file)=>setRequestParams(file,agentCode)"
      :fileList="fileList"
      :beforeReadFile="beforeReadFile"
      @removeSuccess="(payload)=>removeFileSuccess(payload,agentCode)"
      @preview="(payload)=>previewFileList(payload,true)"
    ></qw-uploader>

    <!--流程列表-->
    <flow-list
      v-if="isFree==0"
      :flowList="flowList"
      :flowId="flowId"
    >
    </flow-list>

    <!--选择处理人-->
    <div v-if="FlowAuditUser.length">
      <user-selected-group
        v-if="item && item.startAuditList.show"
        v-for="(item,index) in FlowAuditUser"
        :key="index"
        :title="startAuditTitle(item.nodeName)"
        :mustChoose="true"
        :loadLast="loadLastConfig.toPersonList"
        @confirmPick="confirmPick">
        <span class="approveType" slot="title">{{approveType}}</span>
        <user-selected-item
          slot="user_selected_item"
          :title="startAuditTitle(item.nodeName)"
          :isEdit="item.startAuditList.isCanEdit"
          :List="item.startAuditList.userSelected"
          :isOrderAudit="isOrderAudit"
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
    <!--选择相关人-->
    <user-selected-group
      title="相关人"
      :loadLast="loadLastConfig.ccPersonList"
      @confirmPick="confirmPick"
    >
      <user-selected-item
        :userTotal="ccPersonList.length"
        :List="ccPersonList"
        title="相关人"
        @showPersonList="showPersonList"
        @showUserSelectedBox="ccPersonListShowBox"
        slot="user_selected_item"
        @removeSelected="removeCCPerson">
      </user-selected-item>
    </user-selected-group>

    <!--底部操作按钮-->
    <div class="qwui_btn_move_bottom">
      <button_group>
        <qwui_button type="default" text="保存草稿" @buttonClick="checkDraft"></qwui_button>
        <qwui_button  type="primary" text="提交" @buttonClick="checkCommit"></qwui_button>
      </button_group>
    </div>
    <div class="move_bottom_box">
      <a class="move_tolank" id="moveForm" target="_blank" href="http://d.do1.com.cn/BSHS">
        模板太简单？使用表单流程，上千种模板随你挑
        <i class="move_icon_arrow"></i>
      </a>
    </div>


    <!--处理人范围选人-->
    <user-selected-rang
      v-if="FlowAuditUserBoxShow"
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
    >
    </user-selected-rang>

    <!--选择节点处理人-->
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      :agent="agentCode"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
    >
    </flow-approve-dialog>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig"
    >
    </user_selected_Box>

    <!--预览图片组件-->
    <previewImages></previewImages>
    <!--人员列表预览组件-->
    <user-preview
      v-bind="userPreviewConfig"
      :show.sync="showPerson"
    >
    </user-preview>
  </div>
</template>
<script>
  import {
    stringUserIds,
    isCheckFlowUserConfirm
  } from '@/components/flow/getAuditFlow'
  import flowManager from '@/components/mixins/flow-manager'
  import {qwui_button, button_group} from '@/components/base/button'

  import data_detail from "@/components/add/add_title";
  import flow_button from "@/components/button/flow_button";
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import QwUploader from "@/components/upload";
  import EventBus from '@/utils/eventBus';
  import previewImages from "@/components/base/previewImages";
  //文件上传mixins
  import uploader from '../../../../utils/uploader.js'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {showTypeDict,getFlowTemplate,getConfig,getOldccOrTolist,getccPersonList,getTaskInfo} from "../../api/getData";
  import { getFreeFlowConfig } from '@/components/flow/api/getApi'

  export default {
    mixins: [flowManager,uploader],
    components: {
      data_detail,
      flow_button,
      qwui_button,
      button_group,
      user_selected_Box,
      previewImages,
      QwUploader
    },
    data() {
      return {
        dataBase: dataBase,
        agentCode: 'moveapprove',
        add_nav: { // 数据详情头部信息
          nav: '申请类型', // 头部标题
          title: "",
          content: "",
          titlePlaceholder: '输入申请标题（必填）',
          contentPlaceholder: '输入申请内容（必填）',
          templateTypeId: "",
          templateType: [],
        },
       //错误信息提示 头部组件
        typeErrorTip: '',
        titleErrorTip: '',
        contentErrorTip: '',
        autoCaching:false,
        deleteCaching:false,
        draft: {
          moveId: "", // 审批单id
          creator: "", // 创建人
          mediaIds: "", // 附件
          imageUrls: "", // 图片
          addOrUpdateUrl: '',
          commitStatus: '', // 0代表保存草稿，1代表提交
        },
        initFlowId: "",
        commitDraft: {}, // 提交参数
        approveType:'',// 自由流程审批类型
        isOrderAudit:false, // 自由流程是否按顺序审批
        //图片\附件列表
        imageList: [],
        fileList: [],
      };
    },
    created: function () {
      // 判断是新增或者编辑
      if (this.$route.query.moveId) {
        this.draft.moveId = this.$route.query.moveId;
        this.draft.addOrUpdateUrl = '/portal/moveapprove/ajaxUpdate.do';
        this.loadDraftData();
      } else {
        this.draft.creator = this.dataBase.config.userId
        this.draft.addOrUpdateUrl = '/portal/moveapprove/ajaxAdd.do';
                                                                                        //开启自动缓存
        this.autoCaching=true;
        let name=this.agentCode+"_add_"+_.userId;
        let addNavData=JSON.parse(localStorage.getItem(name));
        if(addNavData){
          this.add_nav=addNavData;
          if(addNavData.templateTypeId && addNavData.templateType.length>0){
            for(let i=0;i<addNavData.templateType.length;i++){
              if (addNavData.templateTypeId== addNavData.templateType[i].id) {
                this.showMsgFromDataDetail(addNavData.templateType[i]);
                break;
              }
            }
          }
        }
      }
      // chong
      // 获取模板
      showTypeDict( (template) => {
        this.add_nav.templateType = template
      })
      // 获取orgID
      getConfig( (orgID) => {
        //更新templateRefId
        this.updateUserSelectedState({type: "templateRefId", data: this.agentCode + orgID})
      })
    },
    destroyed(){
      if(this.deleteCaching){
        let name=this.agentCode+"_add_"+_.userId;
        localStorage.removeItem(name);
      }
    },
    methods: {
      //微信端插入图片列表
      getWxChooseImage(files){
        this.imageList.push(...files);
      },
      stringUserIds(array) {
        let ids = array.map((value)=>{
          return value.userId;
        })
        return ids.join('|');
      },
      // @val 返回原来接口请求的数据
      showMsgFromDataDetail(val) {
        // 子组件传来数据
        this.commitDraft = {};      // 提交数据
        this.$store.commit('resetFlowData');

        if (val) {
          //配置时间标题
          let time = _.getCurrentTime().substring(0,10).replace(/-/g,"")
          this.add_nav.title = _.personName + "_" + time + "_" + val.title
          // 重置加载上一次数据
          this.$store.commit('resetLoadLastConfig')
          // 加载上一次
          this.loadLastConfig.toPersonList.show = (val.isFree == "0" || val.isFree == "3")? false : true;
          this.loadLastConfig.toPersonList.isGetVal = false;
          this.loadLastConfig.ccPersonList.isGetVal = false;
          // 请求相关人
          getccPersonList(val.id, (cclist) => {
            this.$store.commit('updateCCPerson', cclist);
          })
          // 根据模板id请求最新的模板详情
          this.getFlowTemplate(val.id);
        }
      },
      getFlowTemplate(id) {
        // 根据模板id请求最新的模板详情
        getFlowTemplate(id, (data) => {
          if(data.isFree == "0" || data.isFree == "3" ){
            //更新流程类型,查询流程节点
            let params = {
              id: id,
              agentCode: this.agentCode,
              isBranchFlow: data.isFree == '3'? true : false
            }
            //不需要处理返回的数据可不配置callBack
            this.getAuditFlowListFun(data.isFree,params,(result)=>{
              this.approveType = '';
            })
          }else{
            //更新流程类型
            this.updateUserSelectedState({type: "isFree", data: '1'})
            getFreeFlowConfig(id, (data) => {
              if(data.isOrderAudit == 1){
                this.isOrderAudit = true;
                this.approveType = '(按顺序审批)';
              }else {
                this.isOrderAudit = false;
                this.approveType = '(或签)';
              }
            });
          }
        })
      },
      // 编辑初始数据
      loadDraftData() {
        getTaskInfo(this.draft.moveId, (data) => {
          this.dataBase.draft.fileUpload.mediaList = data.mediaList;
          if (data.vo) {
            this.add_nav.templateTypeId = data.vo.moveapproveType;
            this.add_nav.title = data.vo.title;
            this.add_nav.content = data.vo.content;
            this.draft.creator = data.vo.creator;
            this.dataBase.draft.imgUpload.picList = data.vo.picList;
            this.imageList.push(...this.setMatchFileList(data.vo.picList));
            this.fileList.push(...this.setMatchFileList(data.mediaList));
            //更新流程类型
            this.updateUserSelectedState({type: "isFree", data:data.vo.isFree})
            this.initFlowId = data.vo.flowId;
            this.updateUserSelectedState({type: 'flowId', data: data.vo.flowId});
            this.loadLastConfig.toPersonList.show = (data.vo.isFree == "0" || data.vo.isFree == "3") ? false : true;
            this.$store.commit('updateUserSelected', data.vo.toPersons);
            this.updateCCPerson(data.vo.ccPersons);
            this.getFlowTemplate(data.vo.moveapproveType);
          }
        })
      },
      // 加载上一次审批人/相关人
      confirmPick(type, isGet) {
        let updateType = type === '1' ? 'updateCCPerson':'updateUserSelected'
        if (!isGet) {
          this.$store.commit(updateType, []);
        } else {
          getOldccOrTolist(type, (ccOrTolist) => {
            this.$store.commit(updateType, ccOrTolist);
          })
        }
      },
      checkCommit() { // 提交
        this.draft.commitStatus = 1;
        this.isCheckMust();
      },
      checkDraft() { // 保存为草稿
        this.draft.commitStatus = 0;
        this.isCheckMust();
      },
      isCheckMust() { // 验证必填
        this.typeErrorTip = '';
        this.titleErrorTip = '';
        this.contentErrorTip = '';
        this.hasError = false;
        if (this.add_nav.templateTypeId == '') {
          this.typeErrorTip = '申请类型不能为空';
          this.hasError = true;
        }
        if (this.add_nav.title == '') {
          this.titleErrorTip = '申请标题不能为空';
          this.hasError = true;
        }
        if (this.add_nav.content == '') {
          this.contentErrorTip = '申请内容不能为空';
          this.hasError = true;
        }
        if(this.hasError){
          document.body.scrollTop = 0
          // Firefox
          document.documentElement.scrollTop = 0
          // Safari
          window.pageYOffset = 0
          return
        }
        // 如果是草稿，就直接提交
        if (!this.draft.commitStatus) {
          this.commitTask();
        } else {
          //检验流程字段是否填写，是否存在分支流转
          this.checkFlowUserConfirmFun(()=>{
            //校验成功回调
            this.commitTask()
          })
        }
      },
      initCommitDraft() {
        //获取流程字段
        this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser})
        const {mediaIds} = this.getFileListId(this.fileList);
        const {imageUrls}= this.getFileListId(this.imageList);
        this.commitDraft = { // 提交参数
          'tbQyMoveapprovePO.moveapproveType': this.add_nav.templateTypeId,
          'tbQyMoveapprovePO.title': this.add_nav.title,
          'tbQyMoveapprovePO.content': this.add_nav.content,
          'tbQyMoveapprovePO.isFree': this.isFree,
          'tbQyMoveapprovePO.moveapproveStatus': this.draft.commitStatus,
          'mediaIds': mediaIds,
          'imageUrls': imageUrls,
          'relatives': this.stringUserIds(this.ccPersonList),
        }
        if (this.$route.query.moveId) {
          this.commitDraft['tbQyMoveapprovePO.moveapproveId'] = this.draft.moveId;
          this.commitDraft['tbQyMoveapprovePO.creator'] = this.draft.creator;
        }

        this.commitDraft = Object.assign({},this.commitDraft,this.commitTaskParams)
      },
      commitTask() {
        this.initCommitDraft();
        var self = this;
        _.showLoading("i18n.submitting");
        _.ajax({
          url: _.baseURL + self.draft.addOrUpdateUrl,
          type: 'POST',
          data: self.commitDraft,
          dataType: 'json',
          success: function (result) {
            _.hideLoading();
            if (result.code == "0") {
              _.tooltips_succeed("i18n.operationSuccess");
              self.deleteCaching=true;
              if (self.draft.commitStatus) {
                self.$router.push({
                  path: '/my/submit'
                })
              } else {
                self.$router.push({
                  path: '/draft'
                })
              }
            } else {
              _.alert('提示', result.desc);
            }
          }
        })
      },
    },
  };

</script>
<style scoped>
  .qwui_btn_move_bottom{
    padding: 12px 0 15px;
  }
  .move_bottom_box{
    padding: 15px 0 30px;
  }
  .move_tolank{
    display: flex;
    font-size: 14px;
    color: #B2B9C8;
    cursor: pointer;
    justify-content: center;
    align-items: center;
  }
  .move_icon_arrow{
    display: inline-block;
    position:relative;
    left:10px;
    width: 8px;
    height:14px;
    background: url(../../../../assets/images/ic_arrow.png) no-repeat;
    background-size: 100% 100%;
  }
  .approveType {
    color: #B2B9C8;
  }
</style>


