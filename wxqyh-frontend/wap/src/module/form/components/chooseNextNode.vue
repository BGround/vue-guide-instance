<template>
  <div>
    <div class="selectBox">
      <div class="selectTitle">选择下一步处理节点</div>
      <div class="selectBoxContent">
        <label class="nodeItem"
               v-for="(item,index) in nextNodeList"
               :for="item.nodeId">
          <input type="radio" class="icon_check" :value="item.id" :checked="item.id==nextNodeId" @change="changeNodeId(item)">
          <div class="nodeItemContent">
            <p>{{item.nodeName}}</p>
            <p v-for="(childItem,index) in item.nextNodeList" v-if="item.nodeStatus==3&&item.ext1!=2">· {{childItem.nodeName}}</p>
          </div>

        </label>
      </div>
      <button_group :fixed="true">
        <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
      </button_group>

    </div>
  </div>
</template>
<script>
  import audit_flow_api from "@/components/flow/api/getData.js";
  import {qwui_button, button_group} from '@/components/base/button'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import {getMember} from '../js/getData.js'

  export default {
    components: {
      button_group,
      qwui_button,
    },
    name: "chooseNextNode",
    data() {
      return {
        initNextNodeId:'',//初始下一节点id，id不同时才请求处理人
      }
    },
    computed: {
      ...mapState({
        nextNodeList: state => state.userSelected.nextNodeList,
        flowId: state => state.userSelected.flowId,
        currentNodeId: state => state.userSelected.currentNodeId,
        nextNodeId: state => state.userSelected.nextNodeId,
        choosedNodeName: state => state.userSelected.choosedNodeName,
        parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,
        nodeInfo: state => state.userSelected.nodeInfo,
        FlowAuditUser: state => state.userSelected.FlowAuditUser, // 处理人信息
      })
    },
    created: function () {
      this.initNextNodeId = this.nextNodeId;
    },
    methods: {
      changeNodeId(nodeItem) {
        let chooseNodeTitle = ''
        let parallelNextNodeIds = ''
        if (nodeItem.nodeStatus == 3 && nodeItem.ext1 != 2) {
          chooseNodeTitle += nodeItem.nodeName + '：'
          chooseNodeTitle += nodeItem.nextNodeList.map(value=>{
            return value.nodeName
          }).join('+');
          parallelNextNodeIds = nodeItem.nextNodeList.map(value=>{
            return value.id
          }).join(',');
        } else {
          chooseNodeTitle += nodeItem.nodeName
          parallelNextNodeIds = ""
        }
        this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: nodeItem.id})
        this.$store.commit("updateUserSelectedData", {type: 'choosedNodeName', data: chooseNodeTitle})
        this.$store.commit("updateUserSelectedData", {type: 'parallelNextNodeIds', data: parallelNextNodeIds})
      },
      confirmSelected() {
        this.$store.commit("updateUserSelectedData", {type: 'isShowNodeBox', data: false});
        this.initNextNodeId = this.nextNodeId
        var paramData = {
          definitionId:'',
          flowId:this.flowId,
          id:"",//新建是空的
          currentNodeId:this.currentNodeId,
          nextNodeId:this.nextNodeId,
          isBranchFlow: true,
          parallelNextNodeIds:this.parallelNextNodeIds
        }
        audit_flow_api.getFlowAuditUser(paramData, this.auditUserCallback);

      },
      auditUserCallback(data) {
        this.$store.commit('updateFlowAuditUser', data.nodeInfo);
        this.flowNodeItemKeysDate();
      },
      flowNodeItemKeysDate(){
        //判断下一节点是否是人员控件选择的处理人
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
    }
  }
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F7F7F7;
  }
  .selectBoxContent{
    position: absolute;
    top:54px;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }
  .selectBoxContent::-webkit-scrollbar {
    width: 0;
  }
  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    width: 9px;
    height: 15px;
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0,-50%);
  }
  .selectTitle{
    position: absolute;
    top: 0;
    padding: 10px 15px;
    width: 100%;
    color: #333;
    font-size: 16px;
    background-color: #fff;
  }

  .nodeItem{
    position: relative;
    display: flex;
    align-items: center;
    padding: 18px 15px;

  }
  .nodeItem::after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 15px;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .nodeItemContent p{
    color: #999;
    font-size: 13px;
  }
  .nodeItemContent p:nth-child(1){
    color: #333;
    font-size:16px;
  }
  .nodeItemContent p:nth-child(2){
    margin-top: 10px;
  }
</style>
