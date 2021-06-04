<template>
  <div v-if="flowApproveDialogShow">
    <div class="user_select_pop">
      <div class="maskLayer"></div>
      <div class="user_select_box">
        <div class="user_select_scroll">
          <p class="chooseNodeListUI-top-title">{{dialogConfigTitle()}}</p>
          <div class="user_select_content">
            <div class="chooseNodeListUI-box" v-show="chooseNextNodeShow||(returnNextNodeList.length&&action=='returnApprove')">
              <div class="chooseNodeListUI-content">
                <p class="chooseNodeListUI-title" v-show="chooseNextNodeShow">选择下一处理节点</p>
                <div class="selectNodeBox"  v-show="chooseNextNodeShow" @click="showNodeBox">{{chooseNodeName}}<i class="qwui-click_icon_right"></i></div>
                <!--退审节点-->
                <p class="chooseNodeListUI-title" v-show="returnNextNodeList.length&&action=='returnApprove'">选择退回节点</p>
                <div class="selectReturnNodeBox" v-show="returnNextNodeList.length&&action=='returnApprove'">
                  <select v-model="returnNextNodeId">
                    <option class="qwui-click_icon_right"
                            :value="item.nodeId"
                            v-for="(item,index) in returnNextNodeList"
                            :key="index">
                      {{item.nodeName}}
                    </option>
                    <option class="qwui-click_icon_right" value="">提单人</option>
                  </select>
                </div>
              </div>
            </div>

            <!--加签-->
            <div class="selectAssignBox" v-if="action==='assignApprove'">
              <p class="chooseNodeListUI-title">选择加签节点</p>
              <label class="item" v-if="isSign">
                <input value="1" type="radio" class="icon_check" v-model="assignType">
                加会签 <span class="tip">(在当前节点中添加处理人)</span>
              </label>
              <label class="item" v-if="isFrontSign">
                <input value="2" type="radio" class="icon_check" v-model="assignType">
                加前签 <span class="tip">(在当前节点之前添加处理人)</span>
              </label>
              <label class="item" v-if="isBackSign">
                <input value="3" type="radio" class="icon_check" v-model="assignType">
                加后签 <span class="tip">(在当前节点之后添加处理人)</span>
              </label>
            </div>
            <!--加签选人-->
            <user_selected_group
              v-if="action==='assignApprove'"
              title="选择加签处理人"
              customClass="chooseNodeListUI"
              :mustChoose="true">
              <user_selected_item
                slot="user_selected_item"
                :List="counterSignPerson"
                :widthSize="widthSize"
                @showUserSelectedBox="addCounterSignPerson"
                @showPersonList="showPersonList"
                @removeSelected="removeCounterSignPerson">
              </user_selected_item>
            </user_selected_group>

            <!--审批操作时才需要输入理由-->
            <div class="chooseNodeListUI-title" v-if="dialogConfig.approveTitle">{{dialogConfig.approveTitle}}</div>
            <div class="qwui-dialog_textarea" v-if="action!==''">
            <textarea
              class="qwui-dialog_textarea_textarea"
              cols="30"
              rows="2"
              maxlength="200"
              :class="{textActive:isShowErrorTip}"
              :placeholder="dialogConfig.approveTip"
              v-model="approveText"
            >
            </textarea>
              <p class="qwui-dialog_textarea_counter">
                <span :class="{'active':approveText.length>190}">{{approveText.length}}</span>/200
              </p>
            </div>

            <div :class="['qwui-assign_box',{'qwui-assign_box_bg':assignBoxBg}]" v-if="action!==''&&action!='assignApprove'">
              <div class="qwui-assign_content">
                <div class="qwui-assign_content_left">
                  <div
                    class="usePresetSign_div"
                    v-if="usePresetSignShow"
                  >
                    <label>
                      <input
                        type="checkbox"
                        class="qwui-icon_checkbox"
                        v-model="isUsePresetSign"
                      >
                      使用后台存档的手写签名图
                    </label>
                  </div>
                  <div class="assign_img" v-if="assignImg"><img :src="assignImg" alt=""></div>
                </div>
                <!--签名按钮-->
                <assign_btn
                  v-if="writeAssignBtnShow"
                  :isUsePresetSign="isUsePresetSign"
                  @showAssignBox="assignBoxShow=!isUsePresetSign"
                >
                </assign_btn>
              </div>
            </div>

            <div v-if="userSelectShow">
              <!--选择处理人-->
              <user_selected_group
                customClass="chooseNodeListUI"
                v-if="flowAuditUserShow && item && item.startAuditList.show"
                v-for="(item,index) in FlowAuditUser"
                :key="item.nodeId"
                :title="startAuditTitle(item.nodeName?item.nodeName:item.nextNodeName)"
                :mustChoose="true">
                <user_selected_item
                  slot="user_selected_item"
                  :title="startAuditTitle(item.nodeName?item.nodeName:item.nextNodeName)"
                  :isEdit="item.startAuditList.isCanEdit"
                  :List="item.startAuditList.userSelected"
                  :widthSize="widthSize"
                  @showUserSelectedBox="FlowAuditUserShowBox(index)"
                  @showPersonList="showPersonList"
                  @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
                  :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
                </user_selected_item>
              </user_selected_group>
              <!--自由选择类型处理人-->
              <user_selected_group
                :title="'节点 · '+item.nodeName"
                v-for="(item,index) in appointNodeAndUserVOList"
                :key="item.nodeId"
                customClass="chooseNodeListUI"
                :mustChoose="true">
                <user_selected_item
                  slot="user_selected_item"
                  ref="item.nodeId"
                  :List="flowChioseNodeAuditUser[index]"
                  :title="'节点 · '+item.nodeName"
                  :widthSize="widthSize"
                  @showUserSelectedBox="otherAuditUserShowBox(index)"
                  @showPersonList="showPersonList"
                  @removeSelected="(payload)=>{removeChooseNodeUser({parentIndex:index,index:payload.index})}">
                </user_selected_item>
              </user_selected_group>
            </div>
          </div>
        </div>
        <button_group>
          <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
          <qwui_button
            v-if="action!=='assignApprove'"
            type="primary"
            text="提交"
            @buttonClick="saveNodeAuditUser"
          >
          </qwui_button>
          <!--加签确定-->
          <qwui_button
            v-if="action==='assignApprove'"
            type="primary"
            text="提交"
            @buttonClick="assignConfirm"
          >
          </qwui_button>
        </button_group>
      </div>
      <p class="qwui-dialog_textarea_tips" v-show="approveErrorTip">{{approveErrorTip}}</p>
      <!--签名弹窗-->
      <qw_assign_box
        v-show="assignBoxShow"
        @cancelCanvas="cancelCanvas"
        :imgUrl="localSignImg"
        :isFree="this.isFree"
        @saveCanvasToURL="saveCanvasToURL"
      >
      </qw_assign_box>
    </div>
    <!--下拉选择-->
    <chooseNextNode v-if="isShowNodeBox"></chooseNextNode>
  </div>
</template>

<script>
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import assign_btn from '@/components/assign/assign_btn'
  import qw_assign_box from '@/components/assign/assign_box'
  import chooseNextNode from '@/components/flow/chooseNextNode'
  import {qwui_button, button_group} from '@/components/base/button'
  import {approveDialogConfig} from '@/components/flow/config'
  import {getFlowReturnAudit,getUserInfoIsLeave} from '@/components/flow/api/getApi'
  import {isCheckAssign} from '@/components/flow/getAuditFlow'
  import {images_upload} from '@/utils/uploadImages';
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {
    isCheckAuditUser,
    isCheckAppointNodeAndUser
  } from '@/components/flow/getAuditFlow'
  export default {
    name: "QwFlowApproveDialog",
    components: {
      button_group,
      qwui_button,
      user_selected_item,
      user_selected_group,
      chooseNextNode,
      assign_btn,
      qw_assign_box,
    },
    props: {
      /* 审批操作事件
      * agreeApprove          同意
      * agreeReApprove        转审
      * agreeEndApprove       同意并结束
      * approve               审批
      * returnApprove         退审
      * closeApprove          关闭
      * endApprove            结束
      * assignApprove         加签
      * ''                    新增
      * */
      action: {
        type: String,
        default: '',
      },
      /*应用的agentCode*/
      agent: {
        type: String,
        required: true,
      },
      /*弹窗配置*/
      config: {
        type: Object,
        default() {
          return approveDialogConfig
        },
      },
      /*详情数据*/
      detail: {
        type: Object,
        default() {
          return {
            creator: '',    // 创建者ID
          }
        },
      }
    },
    data() {
      return {
        parallelNextNodeIds:'',
        approveDialogConfig: Object.assign({}, this.config || approveDialogConfig),
        approveText: '',          // 输入的理由
        isShowErrorTip:false,     // 错误提示语的显示
        approveErrorTip: '',      // 错误提示语
        assignType: '',      // 加签的类型
        counterSignPerson: [],          // 被加签的人员
        assignBoxShow: false,           // 签名弹窗
        localSignImg: '',               // 用户本地保存的手写签名图
        signImg: '',                    // 用户上传的签名图路径
        usePresetSign: false,           // 是否开启存档签名
        returnNextNodeId: '',           // 已选的退审节点ID
        returnNextNodeList: [],         // 可退审的节点
        createLeave: false,     // 创建人离职状态（true: 离职，false: 在职）
      }
    },
    computed: {
      ...mapState({
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,   // 自由选择处理人的节点
        flowChioseNodeAuditUser: state => state.flowUserSelected.flowChioseNodeAuditUser,     // 存放自由选择的处理人
        nextNodeList: state => state.flowUserSelected.nextNodeList,       // 下一步可选择的节点
        FlowAuditUser: state => state.flowUserSelected.FlowAuditUser,    // 处理人信息
        FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        isFree: state => state.flowUserSelected.isFree,         // 流程类型
        isBranchFlow: state => state.flowUserSelected.isBranchFlow,          //分支流程，true: 是
        refId: state => state.flowUserSelected.refId,         // 审批单id
        currentNodeId: state => state.flowUserSelected.currentNodeId,         // 当前节点ID
        isBranchNode: state => state.flowUserSelected.isBranchNode,         // 是否有流转
        commitTaskParams: state => state.flowUserSelected.commitTaskParams, // 提交返回的流程字段
        chooseNodeName: state => state.flowUserSelected.chooseNodeName, // 下一节点名称
        isShowNodeBox: state => state.flowUserSelected.isShowNodeBox, // 显示选择下一节点弹窗
      }),
      ...mapGetters([
        'FlowAuditUserIds'
      ]),
      assignImg() {
        return this.signImg ? _.filterCompressURL(this.signImg) : ''
      },
      assignBoxBg() {
        return this.userSelectShow && (this.flowAuditUserShow || this.appointNodeAndUserVOList.length>0)
      },
      widthSize(){
        return { paddingSize:10}
      },
      // 节点选择弹窗显示。新增/审批
      chooseNextNodeShow() {
        return this.nextNodeList.length>1 && (this.action==='' || this.action === 'approve' )
      },
      // 弹窗配置
      dialogConfig() {
        return this.approveDialogConfig[this.action]
      },
      // 是否显示手写签名入口(微信端&&审批/退审/结束/同意/同意并结束/同意并转审) false:未开启
      writeAssignBtnShow() {
        // 开发调试时，不需要在微信上才显示
        if(process.env.NODE_ENV!=='production') {
          return  this.dialogConfig.isShowAssign
        }
        return _.isWeChatApp() && this.dialogConfig.isShowAssign
      },
      // 是否显示开启存档签名的入口（审批/退审/允许提前结束）
      usePresetSignShow() {
        return this.dialogConfig.usePresetSignShow
          && this.isFree!=1
      },
      // 需要选择处理人的情况。新增/审批/转审/
      userSelectShow() {
        return this.action === '' || this.action === 'approve' ||  this.action==='agreeReApprove'
      },
      // 选择处理人
      flowAuditUserShow() {
        return (this.action === '' && this.FlowAuditUser.length>0)  // 新增页面，只要有处理人就显示
          || (
            !(this.nextNodeList.length===1 && this.nextNodeList[0].nodeStatus==2)
            &&  (
              this.isBranchNode        // 有流转
              || this.FlowAuditUser.length>1                          // 需要选择多个节点处理人时显示
              || this.FlowAuditUser.length===1 && (this.FlowAuditUser[0].isChoise!=='1' || this.FlowAuditList[0].audtiFlag==='2')    // 详情页面，需要选择处理人时才显示
            )
          )
        },
      // 是否可以选择会签 1:是 0:否addSign.countersignPersons
      isSign() {
        return this.FlowAuditList[0] && this.FlowAuditList[0].parseAddSignVO
          && this.FlowAuditList[0].parseAddSignVO.canAddSign && this.FlowAuditList[0].parseAddSignVO.canAddConterSign
      },
      // 是否可以加前签
      isFrontSign() {
        return this.FlowAuditList[0] && this.FlowAuditList[0].parseAddSignVO
          && this.FlowAuditList[0].parseAddSignVO.canAddSign && this.FlowAuditList[0].parseAddSignVO.canAddFrontSign
      },
      // 是否可以加后签
      isBackSign() {
        return this.FlowAuditList[0] && this.FlowAuditList[0].parseAddSignVO
          && this.FlowAuditList[0].parseAddSignVO.canAddSign && this.FlowAuditList[0].parseAddSignVO.canAddBackSign
      },
      // 是否开启存档签名 false:未开启
      isUsePresetSign: {
        get() {
          return this.usePresetSign
        },
        set(val) {
          if(val){
            if(!this.FlowAuditList[0].vo.isUsePresetSign){
              this.approveErrorTip = '后台未开启“允许使用存档签名”功能';
              return
            }
            if(this.FlowAuditList[0].userHandSignImg===""){
              this.approveErrorTip = '后台还未上传手写签名，请联系管理员';
              return
            }
            this.signImg = this.FlowAuditList[0].userHandSignImg
          } else {
            this.signImg = ''
          }
          this.usePresetSign = val
        }
      },
    },
    created: function () {
      let self = this

      // 审批理由
      this.approveText = this.getApproveText()

      // 创建者是否离职
      getUserInfoIsLeave(this.detail.creator,(result)=>{
        this.createLeave = result
      })

      // 如果是退审,非自由流程获取可退审节点
      if(this.action === 'returnApprove' && this.isFree !=1) {
        getFlowReturnAudit({
          refId: this.refId,
          isBranch: this.isBranchFlow,
          currentNodeId: this.currentNodeId,
          isMiddleAudit: this.FlowAuditList[0].vo.nodeStatus == 4,     // 是否并行流程子节点
          callback: function (data) {
            let arr = data.returnedNodeList.reverse()
            self.returnNextNodeId = data.returnedNodeList[0] ? data.returnedNodeList[0].nodeId : ''
            self.returnNextNodeList.splice(0)
            self.returnNextNodeList.push(...arr)
          }
        })
      }

      // true: 后台设置允许使用存档签名，并且有存档签名，并且不是关闭操作
      this.usePresetSign = !!(
        this.FlowAuditList[0]
        && this.FlowAuditList[0].vo.isUsePresetSign
        && this.FlowAuditList[0].userHandSignImg!==""
        && this.action!="closeApprove"
      )

      // 签名图
      this.signImg = this.usePresetSign ? this.FlowAuditList[0].userHandSignImg : ''

      // 弹窗时body不滚动
      if (_.isMobileApp()) {
        this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';
        document.body.style.top = -this.scrollTop + 'px';
      } else {
        document.body.style.overflow = 'hidden';
      }
    },
    watch: {
      // 错误提示语
      approveErrorTip(val){
        if(val!=""){
          _.tooltips_succeed(val,true,"",3000);
          this.approveErrorTip="";
        }
      },
    },
    methods: {
      ...mapMutations([
        "removeFlowAuditUser",   // 删除处理人
        "removeChooseNodeUser",
        "saveNodeAuditUserJson",
        "updateUserSelectedState",//更新vuex状态数据
        "updateUserSelectConfirm",    // 更新选人配置
        "updateNextNodeList",         // 更新下个节点列表
      ]),
      ...mapActions([
        "updateFlowUserSelected",     // 更新已选处理人
        "updateAppointNodeVOList",    // 更新节点列表
        'updateFlowCommitTaskParams', //更新提交数据json
      ]),
      // 处理人信息
      startAuditTitle: function (nodeName) {
        if (this.action == 'agreeReApprove') {
          return '转审处理人'
        } else {
          return nodeName ? '下一节点 · ' + nodeName : '处理人'
        }
      },
      // 弹窗标题
      dialogConfigTitle() {
        let title = this.dialogConfig.title
        if( this.action === 'approve' || this.action === 'returnApprove') {
          if(this.FlowAuditList.length && this.FlowAuditList[0].nodeType) {
            return title[this.FlowAuditList[0].nodeType]
          }
          return title[1]
        }
        return title
      },
      // 审批理由
      getApproveText() {
        let approveText = this.approveDialogConfig[this.action].reason
        // 如果是“审批”弹窗，根据后台设置类型，显示文案
        if(this.action === 'approve') {
          let text = approveText[this.FlowAuditList[0].nodeType]
          if(text) {
            return text
          }
        }
        // 如果是点击“结束”按钮，则需要判断下一步处理人是否离职，来显示理由
        if(this.action === 'endApprove') {
          return this.dialogConfig.reason[this.FlowAuditList[0].auditLeave-0]
        }
        return approveText
      },
      //显示人员预览弹窗
      showPersonList (title,list){
        this.$emit("showPersonList",title,list,true);
      },

      // 审批或新增时，弹窗选择处理人
      FlowAuditUserShowBox(index){
        this.updateUserSelectedState({type:'appointUserIndex',data:index})

        // 如果是指定范围选人
        if(this.FlowAuditUser[index].startAuditList.assignRange) {
          this.updateUserSelectedState({type:"FlowAuditUserBoxShow", data: true})
        }else {
          this.updateUserSelectConfirm({data:this.FlowAuditUser[index].startAuditList.userSelected,
            callBack: (result) => {
            this.$store.commit('updateUserSelected',result.user.data)
            }
          });
        }
      },
      // 自由选择调用选人组件
      otherAuditUserShowBox(index) {
        //初始化选人数据
        let list = []
        if(this.flowChioseNodeAuditUser.length && this.flowChioseNodeAuditUser[index]) {
          list.push(...this.flowChioseNodeAuditUser[index])
        }
        this.updateUserSelectConfirm({data:list,
          callBack: (result) => {
            this.$store.commit('updateChoseNodeAuditUser',{
              index: index,
              data: result.user.data
            })
          }
        });
      },

      // 取消签名
      cancelCanvas(payload) {
        this.assignBoxShow=false
        // 清除了签名
        if(!payload.isWriteSign) {
          this.localSignImg = ''
          this.signImg=''
        }
      },

      // 保存签名
      saveCanvasToURL(payload) {
        this.localSignImg = payload.imageUrl
        this.assignBoxShow = false
        if(this.localSignImg) {
          _.showLoading('上传中')
          images_upload(this.localSignImg,this.agent,(callback)=>{
            this.signImg = callback.imgurl
          })
        }
      },
      // 手写签名验证
      checkSoterInfo() {
        let isUseHandWriteSign = this.FlowAuditList[0].vo.isUseHandWriteSign
        let userHandSignImg = this.FlowAuditList[0].userHandSignImg
        // 只勾选存档签名，则使用存档签名
        if (this.usePresetSign && userHandSignImg !== "") {
          return { signImg: userHandSignImg }
        }
        // 有手写签名
        if(this.localSignImg) {
          return { signImg: this.signImg }
        }
        // 必须手写签名
        if(isUseHandWriteSign) {
          // 没有手写签名的时候，但是有开启存档签名，验证有无使用留档签名
          if ( !this.localSignImg && this.usePresetSign && userHandSignImg !== "") {
            return { signImg: userHandSignImg }
          }
          this.approveErrorTip = '必须使用签名功能才能审批';
          return false
        }

       return true
      },

      // 加签选人
      addCounterSignPerson() {
        this.updateUserSelectConfirm({data:this.counterSignPerson,
          callBack: (result) => {
            this.counterSignPerson = [...result.user.data]
          }
        });
      },
      // 移除被加签的人
      removeCounterSignPerson(data) {
        this.counterSignPerson.splice(data.index,1)
      },
      // 加签确定
      assignConfirm() {
        let ids = this.counterSignPerson.map(item => {
          return item.userId
        })
        if(!isCheckAssign({
            'counterSignPerson': this.counterSignPerson,
            'FlowAuditList': this.FlowAuditList,
            'approveText':this.approveText,
            'assignType': this.assignType
          })
        ) { return }
        /*
        * @isFree 1自由流程/0固定流程/3分支流程
        * @type 1会签/2前签/3后签
        * @addCountersignPersons 处理人
        * @reason 理由
        * */
        this.$emit('saveNodeAuditUserJson',{
          'isFree': this.isFree,
          'type': this.assignType,
          'addCounterSignPersonStr': ids.join('|'),
          'id':this.refId,
          'currentNodeId': this.currentNodeId,
          'reason': this.approveText,
        });
      },

      // 同意并转审判断方法
      changeTo() {
        // 转审人不能为空
        if(!this.FlowAuditUser[0].startAuditList.userSelected.length) {
          this.approveErrorTip = '转审人不能为空'
          return false
        }
        return true
      },

      // 取消弹窗
      cancelSelected(){
        this.updateUserSelectedState({type:"flowApproveDialogShow",data:false})
        this.resetBody()
      },
      // 隐藏弹窗后body恢复滚动
      resetBody(){
        if (_.isMobileApp()) {
          document.body.removeAttribute("style");
          window.scrollTo(0, this.scrollTop);
        } else {
          document.body.style.overflow = 'auto';
        }
      },
      // 点击确定
      saveNodeAuditUser() {
        this.resetBody()

        let commitData = {}

        // 如果是新增页面，或者是审批，则校验是否选择处理人
        if(this.action==='' || this.action==='approve') {
          if (this.flowAuditUserShow && !isCheckAuditUser({FlowAuditUser: this.FlowAuditUser})) return
          if (this.appointNodeAndUserVOList.length) {
            if (!isCheckAppointNodeAndUser({flowChioseNodeAuditUser: this.flowChioseNodeAuditUser})) return
          }
        }
        // 如果是自由流程，则保存转审的数据
        if(this.action==='agreeReApprove' && !this.changeTo() ) {return}

        // 如果是审批操作，理由必填
        if (this.action !=='' && !this.approveText) {
          this.isShowErrorTip = true;
          return
        }

        // 有手写签名
        if(this.localSignImg) {
          commitData.signImg = this.signImg
        }
        // 如果显示开启存档签名的入口，则校验
        if(this.usePresetSignShow) {
          let flag = this.checkSoterInfo()
          if(!flag) return
          if(flag.signImg) { commitData.signImg = flag.signImg }
        }

        // 保存自由选择的节点处理人信息
        this.saveNodeAuditUserJson();
        // 更新数据
        this.updateFlowCommitTaskParams({'isFree':this.isFree,'FlowAuditUser':this.FlowAuditUser})

        // 转审，提交转审人员
        if(this.action === 'agreeReApprove') {
          commitData.chooseFlowUser = this.FlowAuditUserIds(0).join('|')
        }
        // 退审，提交退审的节点id
        if(this.action ==='returnApprove') {
          // 如果提单人离职且退审到提单人，则弹窗提示
          if(this.createLeave && !this.returnNextNodeId){
            _.alert('提示','提单人已不在通讯录中，请联系管理员结束流程');
            return
          }
          commitData.currentNodeId = this.currentNodeId
          if(this.returnNextNodeList.length) {
            commitData.nextNodeId = this.returnNextNodeId
            if(this.isFree!=3) {
              commitData.chooseFlowUser = this.returnNextNodeId
            }
          }
        }
        //  如果是新增或审批或结束
       if(this.action==='' || this.action === 'approve' || this.action === 'endApprove') {
         Object.assign(commitData,this.commitTaskParams)
       }

        this.$emit('saveNodeAuditUserJson',{
          'status': this.dialogConfig.status,
          'reason': this.approveText,
          ...commitData
        });
      },
      showNodeBox() {
        this.$store.commit("updateUserSelectedState", {type: 'isShowNodeBox', data: true});
      },
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .user_select_pop,.maskLayer{
      width: 740px;
      margin: auto;
    }
  }
  .user_select_pop{
    position: fixed;
    z-index: 3;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .maskLayer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
    opacity: .4;
    animation: mask-gradient .25s ease;
  }
  @keyframes mask-gradient{
    0% {
      opacity: 0;
    }
    100% {
      opacity: .4;
    }
  }
  .user_select_box {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    animation: select-box-gradient .2s ease;
  }
  @keyframes select-box-gradient {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .user_select_scroll {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
  }
  .user_select_scroll::-webkit-scrollbar {
    width: 0;
  }
  .chooseNodeListUI-top-title {
    margin-top: 10px;
    padding: 20px 0 18px;
    color: #0A1736;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
  }
  .user_select_content {
    flex: 1;
    background-color: #fff;
  }
  /*理由输入框 start*/
  .qwui-dialog_textarea {
    flex-direction: column;
    margin: 0 15px;
    padding: 12px 12px 7px;
    border: 1px #E2E4E7 solid;
    border-radius: 2px;
    background-color: #fff;
  }
  .qwui-dialog_textarea textarea {
    width: 100%;
    height: 96px;
    text-align: left;
    vertical-align: top;
    font-size: 15px;
    color: #0A1736;
    line-height: 1.4;
    border: none;
  }
  .qwui-dialog_textarea_counter {
    font-size: 13px;
    color: #D2D5DB;
    text-align: right;
    line-height: 1;
  }
  .textActive::-webkit-input-placeholder {
    color: #FF1515;
  }
  .qwui-dialog_textarea_counter .active {
    color: #FF1515;
  }
  /*理由输入框 end*/

  /*加签选项*/
  .selectAssignBox {
    padding-bottom: 20px;
  }
  .selectAssignBox .item {
    display: flex;
    align-items: center;
    padding: 8px 16px 7px;
    font-size: 15px;
    color: #0A1735;
  }
  .selectAssignBox .tip {
    margin-left: 5px;
    color: #B2B9C8;
  }

  /*存档签名 start*/
  .qwui-assign_box_bg {
    padding-bottom: 10px;
    background-color: #F7F8F9;
  }
  .qwui-assign_content {
    padding: 20px 15px;
    background-color: #fff;
    overflow: hidden;
  }
  .qwui-assign_content_left {
    float: left;
  }
  .usePresetSign_div {
    margin-bottom: 25px;
  }
  .usePresetSign_div label {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #7A7D80;
    line-height: 1;
  }
  .assign_img img{
    margin-left: 5px;
    max-width: 98px;
    max-height: 55px;
    object-fit: contain;
  }
  /*存档签名 end*/

  /*选择节点 start*/
  .chooseNodeListUI-box {
    padding-bottom: 10px;
    background-color: #F7F8F9;
  }
  .chooseNodeListUI-content {
    padding-bottom: 20px;
    background-color: #fff;
  }
  /*选择节点 end*/

  /*退审选择节点 start*/
  .chooseNodeListUI-title {
    padding: 12px 18px;
    color: #0A1736;
    font-size: 16px;
    line-height: 22px;
  }
  .selectReturnNodeBox {
    position: relative;
    margin: 0 16px;
    padding: 7px 13px 8px 9px;
    border: 1px solid #E4E5E9;
    border-radius: 2px;
    background-color: #fff;
  }

  .selectReturnNodeBox select {
    width: 100%;
    padding-right: 20px;
    color: #0A1735;
    font-size: 13px;
    -webkit-appearance: none;
    -moz-appearance: none;
    outline: none;
    border: none;
    background: url("../../assets/images/icon_arrow_d.png") no-repeat right center;
    background-size: 12px 8px;
  }
  /*退审选择节点 end*/
  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 13px;
    width: 9px;
    height: 15px;
    background: 0 0 url("../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0, -50%);
  }
  /*选择下一节点*/
  .selectNodeBox {
    position: relative;
    margin: 0 16px;
    padding: 9px 22px 9px 9px;
    color: #0A1735;
    font-size: 13px;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 2px;
    background-color: #fff;
  }
  .selectNodeBox:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #E4E5E9;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: left top;
  }

  /*选择处理人*/
  .user_select_box /deep/ .qwui-user_select_charge_view {
    margin-top: 0;
    padding-top: 10px;
    background-color: #F7F8F9;
  }
  .user_select_box /deep/ .qwui-user_select_charge_view:first-child {
    padding-top: 0;
  }
  .user_select_box /deep/ .qwui-user_select_top {
    padding: 20px 18px 12px;
    background-color: #fff;
  }
  .user_select_box /deep/ .qwui-user_select_wap {
    padding: 0 0 0 18px;
    background-color: #fff;
  }
  .user_select_box /deep/ .qwui-btn_box {
    position: relative;
    border-top: 1px #F7F8FA solid;
    background-color: #fff;
  }

  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
    .qwui-btn_box {
      padding-bottom: 34px!important;
    }
  }
</style>
