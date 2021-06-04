<template>
  <div class="wrap">
    <!--新建页面-->
    <div>
      <!--标题和类型-->
      <data_detail :dataDetailMsg="add_nav"
                   :agent="agent"
                   @listenToChild="selectTemplateTypeBack">
      </data_detail>
      <!--流程列表-->
      <flow-list v-if="isFree==0" :flowList="flowList" :flowId="flowId"></flow-list>

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

      <!--选择相关人-->
      <user-selected-group
        title="相关人"
        :loadLast="loadLastConfig.ccPersonList"
        @confirmPick="confirmPick">
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

    </div>
    <!--底部操作按钮-->
    <button_group>
      <qwui_button type="default" text="保存草稿" @buttonClick=""></qwui_button>
      <qwui_button  type="primary" text="提交" @buttonClick="saveNodeAuditUser"></qwui_button>
    </button_group>




    <!--处理人范围选人弹窗-->
    <user-selected-rang v-if="FlowAuditUserBoxShow"
         :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
         :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
         :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
         :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
         :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
         :checked="FlowAuditUserIds(appointUserIndex)"
         @FlowAuditUserResult="FlowAuditUserResult">
    </user-selected-rang>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog v-if="flowApproveDialogShow"
                         agent='moveapprove'
                     @showPersonList="showPersonList"
                     @saveNodeAuditUserJson="commitTask">
    </flow-approve-dialog>

    <!--公共选人组件-->
    <user_selected_Box v-if="selectConfig.show"
                       :selectconfig="selectConfig">
    </user_selected_Box>
  </div>
</template>
<script>
  import {
    searchFlowListFun,
    findBranchFlowNextNodeInfoFun,
    settingAuditTitle,
    stringUserIds,
    isCheckFlowUserConfirm
  } from '@/components/flow/getAuditFlow'

  import {showTypeDict,getConfig,getFlowTemplate,getOldccOrTolist,getccPersonList} from "../../flowDemo/api/getData";
  import data_detail from "@/components/add/add_title";
  import {qwui_button, button_group} from '@/components/base/button'
  import user_selected_Box from '@/components/base/user_or_dept_select'

  import flowManager from '@/components/mixins/flow-manager'
  export default {
    components: {
      data_detail,
      qwui_button,
      button_group,
      user_selected_Box,
    },
    data() {
      return {
        agent: 'moveapprove',
        add_nav: { // 数据详情头部信息
          nav: '申请类型', // 头部标题
          title: "",
          content: "",
          titlePlaceholder: '输入申请标题（必填）',
          contentPlaceholder: '输入申请内容（必填）',
          templateTypeId: "",
          templateType: [],
        },
      }
    },
    mixins: [flowManager],
    created: function () {
      // 获取模板
      showTypeDict( (template) => {
        this.add_nav.templateType = template
      })

      // 获取orgID，记录 templateRefId
      getConfig( (orgID) => {
        //更新templateRefId
        this.updateUserSelectedState({type: "templateRefId", data: this.agent + orgID})
      })
    },
    methods: {

      //选择模板类型回调
      selectTemplateTypeBack(val) {
        let self =this
        //重置流程数据
        this.resetFlowData()

        if(val){
          //配置时间标题
          let time = _.getCurrentTime().substring(0,10).replace(/-/g,"")
          this.add_nav.title = _.personName + "_" + time + "_" + val.title
          // 重置加载上一次数据
          this.resetLoadLastConfig()
          //自由流程负责人的加载上一次按钮显示
          this.loadLastConfig.toPersonList.show = (val.isFree == "0" || val.isFree == "3")? false : true;
          // 请求相关人
          getccPersonList(val.id, (cclist) => {
            this.$store.commit('updateCCPerson', cclist);
          })
          //更新模板id
          getFlowTemplate(val.id, (data) => {
            if(data.isFree == "0" || data.isFree == "3" ){
              //更新流程类型,查询流程节点
              let params = {
                id: val.id,
                agentCode: this.agent,
                isBranchFlow: data.isFree == '3'? true : false
              }
              //不需要处理返回的数据可不配置callBack
              self.getAuditFlowListFun(data.isFree,params,()=>{

              })
            }else{
              //更新流程类型
              self.updateUserSelectedState({type: "isFree", data: '1'})
            }
          })
        }
      },
      //提交按钮点击，存在流转条件查下一个节点
      saveNodeAuditUser(){
        //应用的其他数据校验
//        this.function() return;

        //检验流程字段是否填写，是否存在分支流转
        this.checkFlowUserConfirmFun(()=>{
          //校验成功回调
          this.commitTask()
        })
      },
      //加载上一次审批人/相关人点击回调
      confirmPick(type, isGet){
        let updateType = type === '1' ? 'updateCCPerson':'updateUserSelected'
        if (!isGet) {
          this.$store.commit(updateType, []);
        } else {
          getOldccOrTolist(type, (ccOrTolist) => {
            this.$store.commit(updateType, ccOrTolist);
          })
        }
      },
      //保存提交数据
      commitTask(data) {
        console.log("提交接口请求")
        let params = {
          //创建者id:
          'creator' : _.userId,
          //相关人字段:
          'relatives': stringUserIds(this.ccPersonList),
        }
        //获取流程字段
        this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser})
        //返回的流程字段
        console.log(this.commitTaskParams)

      }
    }
  }
</script>
