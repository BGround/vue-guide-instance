<template>
  <div v-if="flowList.length">
    <div class="flow_list_wrap">
      <div class="qwui-flow_list">
        <div class="qwui-user_cell_title">
          <p class="title qwui-flow_list-title">{{$t('i18n.approvalProcess')}}
            <span class="qwui-required_mark">*</span>
          </p>
        </div>
      </div>
      <ul class="flow_list">
        <li class="flow_list_item" v-for="(item,index) in flowList" :key="item.id">
          <label class="flow_name" @click.stop="getFlowAuditUser(item.id)">
            <input type="radio" class="icon_check" :checked="item.id==flowId">
            <p>{{item.name}}</p>
          </label>
          <div class="icon_help" @click.stop="showFlowNode(item.id,item.name)"></div>
        </li>
      </ul>
    </div>
    <div class="process_pop" v-if="isShowFlowNode">
      <div class="process_mask">
        <div class="process_head">{{flowName}}</div>
        <div class="process_content">
          <div class="process_list">
            <div class="process_item">
              <div class="title">
                <i class="icon_step"></i>
                <div class="name">
                  <p>提单</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
            <div class="process_item" v-for="(item,index) in nodeList" :key="item.id">
              <div class="title">
                <i class="icon_step">{{index + 1}}</i>
                <div class="name">
                  <p>{{item.nodeName}}</p>
                </div>
              </div>
              <div class="content">
                <p>[{{nodeType[item.nodeType - 1]}}{{item.isSign == 0 ? '/会签' : ''}}] {{item.handleAccounts}}</p>
              </div>
            </div>
            <div class="process_item">
              <div class="title">
                <i class="icon_step"></i>
                <div class="name">
                  <p>结束</p>
                </div>
              </div>
              <div class="content"></div>
            </div>
          </div>
        </div>
        <div class="processFooter">
          <span class="qwui-btn qwui-btn_default" @click="isShowFlowNode = false">返回</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import {findFlowNodeList} from "@/components/flow/api/getApi";
  import {getFlowAuditUserFun} from '@/components/flow/getAuditFlow'

  export default {
    name: "QwFlowList",
    props:{
      flowList:{
        type: Array
      },
      flowId:String
    },
    data() {
      return {
        isShowFlowNode: false,
        nodeList: [],
        flowName: "",
        nodeType: ["审批", "知会", "承办"],
        oldFlowId: "",
        isGetting: false //正在请求
      };
    },
    methods: {
      getFlowAuditUser(flowId) {
        let self = this;
        if (flowId == self.flowId || self.isGetting) return;
        self.isGetting = true
        this.$store.commit("updateUserSelectedState",{type: "flowId", data: flowId})
        let param = {
          definitionId: "",
          id: "",
          flowId: flowId,
          currentNodeId: "",
          nextNodeId: "",
          parallelNextNodeIds: "",
          isBranchFlow: false
        };
        getFlowAuditUserFun(param, function (data) {
          self.isGetting = false
          self.$store.commit("updateFlowAuditUserData",data)
        });
      },
      showFlowNode(flowId, flowName) {
        let self = this
        if (flowId == self.oldFlowId) {
          self.isShowFlowNode = true
          return;
        }
        self.oldFlowId = flowId;
        findFlowNodeList({flowId:flowId}).then(result => {
          if (result.code == '0') {
            self.nodeList = result.data.nodeList;
            self.flowName = flowName;
            self.isShowFlowNode = true
          } else {
            _.alert('提示', result.desc)
          }
        });
      }
    }
  };
</script>
<style scoped>
  @import "css/flowList.css";
</style>

