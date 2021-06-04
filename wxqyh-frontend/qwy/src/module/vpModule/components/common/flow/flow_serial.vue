<template>
  <div class="processPop">
    <div class="process">
      <div class="processHead">流转明细</div>
      <div class="processContent">
        <div class="processList">
          <div class="processItem" v-for="(item,index) in auditSerial" :key="index">
            <div class="title">
              <i :class="['iconStep',item.status!=2 ? item.status>2 ? 'flow' : 'active' : '']"></i>
              <div class="name">
                <p>{{item.nodeName}}
                  <span>{{item.signType}}</span>
                </p>
              </div>
            </div>
            <div :class="['content',item.status!=2?'active':'']">
              <p v-if="item.handleAccounts!=''">[处理人{{item.isSign ? '/会签' : ''}}] {{item.handleAccounts}}</p>
              <p class="c333" v-for="(auditUserItem,index) in item.auditUserList" v-if="auditUserItem.auditUser!=''"
                 :key="index">
                [{{auditUserItem.nodeType}}] <span>{{auditUserItem.auditUser}}</span>
              </p>
              <div v-for="(parallel,index) in item.parallelList" :key="index">
                <div class="parallelList">
                  <div :class="['processItem',parallel[0].status!=2?'active':'']" v-show="!parallel[0].isShow">
                    <div class="title">
                      <i :class="['iconStep',parallel[0].status!=2 ? parallel[0].status>2 ? 'flow' : 'active' : '']"></i>
                      <div class="name">
                        <p>{{parallel[0].nodeName}}
                          <span>{{parallel[0].signType}}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div :class="['processItem',parallelItem.status!=2?'active':'']"
                       v-for="(parallelItem,index) in parallel" v-show="parallel[0].isShow" :key="index">
                    <div class="title">
                      <i :class="['iconStep',parallelItem.status != 2 ? parallelItem.status>2 ? 'flow': 'active':'']"></i>
                      <div class="name">
                        <p>{{parallelItem.nodeName}}
                          <span>{{parallelItem.signType}}</span>
                        </p>
                      </div>
                    </div>
                    <div :class="['content',parallelItem.status!=2?'active':'']">
                      <p v-if="parallelItem.handleAccounts!=''">
                        [处理人{{parallelItem.isSign ? '/会签' : ''}}] {{parallelItem.handleAccounts}}</p>
                      <p class="c333" v-for="(auditUserItem,index) in parallelItem.auditUserList"
                         v-if="auditUserItem.auditUser!=''" :key="index">
                        [{{auditUserItem.nodeType}}] <span>{{auditUserItem.auditUser}}</span>
                      </p>
                    </div>
                  </div>
                  <i :class="['icon_arrow_up',parallel[0].isShow?'':'icon_arrow_down']"
                     @click="parallelToggle(parallel[0])"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="processItem">
            <div class="title">
              <i :class="['iconStep',isOverActive?'active':'']"></i>
              <div class="name">
                <p>{{this.lastNodeText}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="processFooter">-->
        <!--<span class="qwui-btn qwui-btn_default" @click="hideProcessPop">返回</span>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'flowSerial',
    props: {
      flowSerialData: {
        type: Object
      },
      isover: {
        type: String
      }
    },
    computed: {
      lastNodeText() {
        let isFree = this.flowSerialData.isFreeFlow;
        //已审批或关闭显示结束，自由或分支审批中显示流转中
        if (this.isover == 1 || this.isover == -1) {
          return '结束'
        } else {
          return (isFree == '0' || isFree == '2') ? '结束' : '流转中'
        }
      },
      isOverActive() {
        //已审批或者已关闭勾选结束节点
        return this.isover == 1 || this.isover == -1
      }
    },
    data() {
      return {
        auditSerial: [],
        approveText: {
          1: ['审批', '退审', '未审批',  '干预节点', '干预处理人', '干预结束'],
          2: ['确认', '退回', '未审批',  '干预节点', '干预处理人', '干预结束'],
          3: ['办理', '退回', '未审批',  '干预节点', '干预处理人', '干预结束']
        }
      }
    },
    created() {
    },
    watch: {
      'flowSerialData':{
        handler(){
          if (this.flowSerialData.isFreeFlow == '1') {
            this.auditSerial = this.dealFreeSerial();
          } else {
            this.auditSerial = this.dealAuditSerial();
          }
        },
        deep:true,
//        immediate:true
      }
    },
    methods: {
      parallelToggle(item) {
        item.isShow = !item.isShow;
      },
      dealFreeSerial() {
        let list = this.flowSerialData.list;
        let auditSerial = [];
        for (let i = 0; i < list.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
            handleAccounts: '', //处理人
            auditUserList: [], //实际处理人
            status: '', //处理类型0已处理2未处理
          }
          let listItem = list[i];
          auditSerialItem.nodeName = listItem.nodeName;
          auditSerialItem.handleAccounts = listItem.handlePersons.replace(/,/g, '、');
          auditSerialItem.status = listItem.isCheck == '0' ? 2 : 0;
          if(listItem.auditPersonsList.length){
            listItem.auditPersonsList.forEach((value) => {
              let auditUserItem = {};
              auditUserItem.auditUser = value.handlePersons;
              auditUserItem.nodeType = this.dealFreeAudit(value).nodeType;
              auditSerialItem.auditUserList.push({...auditUserItem});
            })
          } else {
            auditSerialItem.nodeType = this.dealFreeAudit(listItem).nodeType;
            auditSerialItem.auditUser = listItem.handlePersons.replace(/,/g, '、');
          }
          auditSerial.push(auditSerialItem);
        }
        return auditSerial;
      },
      dealFreeAudit(listItem) {
        let auditSerialItem = {};
        switch (listItem.auditStatus) {
          case 0:
            auditSerialItem.nodeType = '退审';
            break;
          case 4:
            auditSerialItem.nodeType = '重新提交';
            break;
          case 5:
            auditSerialItem.nodeType = '转审';
            break;
          case 6:
            auditSerialItem.nodeType = '同意并结束';
            break;
          case 7:
            auditSerialItem.nodeType = '关闭';
            break;
          default:
            auditSerialItem.nodeType = '同意';
            break;
        }
        return auditSerialItem;
      },
      dealAuditSerial() {
        let list = this.flowSerialData.list;
        let auditSerial = [];
        let isFree = this.flowSerialData.isFreeFlow;
        for (let i = 0; i < list.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
            handleAccounts: '', //处理人
            isSign: false, //是否会签,signType非空时为true
            signType: '', //加签类型1前签2后签3普通会签
            auditUserList: [], //实际处理人
            status: '', //处理类型0已审批1退审2未处理
            parallelList: [],//并行中间节点list
            isShow: true, //是否显示并行子节点，默认展示
          }
          let listItem = list[i];

          auditSerialItem.nodeName = listItem.nodeName;

          if (listItem.signType && listItem.signType != '') {
            auditSerialItem.isSign = true;
            auditSerialItem.signType = listItem.signType != '3' ? listItem.signType == '1' ? ' · 前签' : ' · 后签' : '';
          }

          //0提单人 1审批通过 2退审 3未审批 4审批通过 5未重新提交 6结束节点未审批 7重新提交 8提单人自结束 9退审 12节点干预 13负责人干预 14干预结束
          let status = listItem.auditStatus;

          if (isFree == '0' || isFree == '2') { //固定流程
            //2未结束的最后节点
            let nodeStatus = listItem.nodeStatus;
            if (status == '0' || status == '5' || status == '7') {
              auditSerialItem.nodeName = status == '0' ? '提单' : '重新提交';
              auditSerialItem.status = status == '5' ? 2 : 0;
            } else {
              auditSerialItem.handleAccounts = listItem.personName.replace(/,/g, '、');
              if (status == '3' && (nodeStatus == '1' || nodeStatus == '2')) {
                // 未审批
                auditSerialItem.status = 2;
              } else if (status == '12' || status == '13' || status == '14') {
                //流程干预
                auditSerialItem.status = status - 9;
              } else {
                //status:2或者9时是退审，其他为已审批
                auditSerialItem.status = status == '2' || status == '9' ? 1 : 0;
              }
              // 实际处理人数据处理
              auditSerialItem.auditUserList = [...this.getAuditUserDetail(listItem, auditSerialItem.status)];
            }
          } else if (isFree == '3') { //分支流程
            if (listItem.status && listItem.status == '1') {
              auditSerialItem.nodeName = '提单';
              auditSerialItem.status = 0;
            } else {
              auditSerialItem.handleAccounts = listItem.handleAccounts.replace(/,/g, '、');
              if (status == '0' || status == '3') {
                //status:0退审，其他为已审批
                auditSerialItem.status = listItem.status == '0' || status == '0' ? 1 : 0;
              } else if (status == '12' || status == '13' || status == '14') {
                //流程干预
                auditSerialItem.status = status - 9;
              } else {
                //未审批
                auditSerialItem.status = 2;
              }
              // 实际处理人数据处理
              auditSerialItem.auditUserList = [...this.getAuditUserDetail(listItem, auditSerialItem.status)];
            }

            //有并行子节点
            if (listItem.parallelFlowNodes && listItem.parallelFlowNodes.length > 0) {
              for (let j = 0; j < listItem.parallelFlowNodes.length; j++) {
                auditSerialItem.parallelList.push(this.dealParallelNodes(listItem.parallelFlowNodes[j]));
              }
            }

          }
          auditSerial.push(auditSerialItem);
        }
        return auditSerial;
      },
      dealParallelNodes(parallelFlowNodes) {
        let parallelNodes = [];
        for (let i = 0; i < parallelFlowNodes.length; i++) {
          let auditSerialItem = {
            nodeName: '', //节点名称
            handleAccounts: '', //处理人
            isSign: false, //是否会签,signType非空时为true
            signType: '', //加签类型1前签2后签3普通会签
            auditUserList: [], //实际处理人
            status: '', //处理类型0已审批1退审2未处理
            parallelList: [],//并行中间节点list
            isShow: true, //是否显示并行子节点，默认展示
          }
          let parallelNodeItem = parallelFlowNodes[i];

          auditSerialItem.nodeName = parallelNodeItem.nodeName;

          if (parallelNodeItem.signType && parallelNodeItem.signType != '') {
            auditSerialItem.isSign = true;
            auditSerialItem.signType = parallelNodeItem.signType != '3' ? parallelNodeItem.signType == '1' ? ' · 前签' : ' · 后签' : '';
          }

          //auditStatus:0退审2未审批3已审批
          let status = parallelNodeItem.auditStatus;
          auditSerialItem.handleAccounts = parallelNodeItem.handleAccounts;
          if (status == '2') {
            auditSerialItem.status = 2;
          } else if (status == '12' || status == '13' || status == '14') {
            //流程干预
            auditSerialItem.status = status - 9;
          } else {
            auditSerialItem.status = status == '0' ? 1 : 0;
          }
          // 实际处理人数据处理
          auditSerialItem.auditUserList = [...this.getAuditUserDetail(parallelNodeItem, auditSerialItem.status, true)];
          parallelNodes.push(auditSerialItem);
        }
        return parallelNodes;
      },
      getNodeType(nodeType, status) {
        nodeType = nodeType == '' || nodeType == '0' ? 1 : nodeType;
        return this.approveText[nodeType][status];
      },
      getAuditUserDetail(listItem, nodeStatus, isParallelNode) {
        let isFree = this.flowSerialData.isFreeFlow;
        let auditUserList = [];
        if (listItem.signAuditPersons && listItem.signAuditPersons.length > 0) {
          listItem.signAuditPersons.forEach((value) => {
            let auditUserItem = {};
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? value.personName : value.auditUserName;
            let status = 0;
            if (isFree == '0' || isFree == '2') {
              status = value.auditStatus == '2' || value.auditStatus == '9' ? 1 : 0;
            } else if (isFree == '3') {
              if (isParallelNode) { // 并行节点状态判断
                status = value.auditStatus == '0' ? 1 : 0;
              } else {
                status = value.status == '0' || value.auditStatus == '0' ? 1 : 0;
              }
            }
            status = value.auditStatus >= 12 ? value.auditStatus - 9 : status;
            auditUserItem.nodeType = this.getNodeType(value.nodeType, status);
            auditUserList.push({...auditUserItem});
          })
        } else {
          if (nodeStatus != 2) {
            let auditUserItem = {};
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? listItem.personName : listItem.auditUserName;
            auditUserItem.nodeType = this.getNodeType(listItem.nodeType, nodeStatus);
            auditUserList.push(auditUserItem);
          }
        }
        return auditUserList;
      },
      hideProcessPop() {
        this.flowSerialData.isShowFlowSerial = false;
      }
    }
  }

</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .processPop {
      width: 454px;
      margin: auto;
    }
  }

  .processPop {
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
  }

  .processPop .process {
    position: relative;
    width: 454px;
    height: 100%;
    box-sizing: border-box;
    background-color: #fff;
  }

  .processHead {
    position: absolute;
    top: 0;
    padding: 20px 15px 25px;
    width: 100%;
    color: #333;
    font-size: 16px;
    line-height: 1;
  }

  .processContent {
    position: absolute;
    top: 60px;
    width: 100%;
    overflow-y: auto;
  }

  .processContent::-webkit-scrollbar {
    width: 0;
  }

  .processContent .processList {
    padding: 0 17px;
  }

  .processItem:last-child {
    padding-bottom: 30px;
  }

  .processItem .title {
    display: flex;
    display: -webkit-flex;
  }

  .processItem .title .name {
    display: flex;
    flex: 1;
    width: 0;
  }

  .processItem .title .name p {
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
  }

  .processItem .title .name span {
    color: #467DB9;
  }

  .processItem .iconStep {
    float: left;
    margin-right: 12px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px #ccc solid;
    box-sizing: border-box;
  }

  .iconStep.active {
    border: none;
    background: #C31725 url(../../../assets/images/icon_step_check.png) no-repeat center;
    background-size: 11px;
  }
  .iconStep.flow {
    border: none;
    background: #C31725 url(../../../assets/images/icon_step_flow.png) no-repeat center;
    background-size: 12px;
  }

  .icon_arrow_up {
    position: absolute;
    top: 20px;
    right: 15px;
    width: 50px;
    height: 20px;
    cursor: pointer;
  }

  .icon_arrow_up::after {
    content: "";
    position: absolute;
    top: 7px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-top: 2px solid #ccc;
    border-left: 2px solid #ccc;
    transform: rotate(45deg);
  }

  .icon_arrow_down::after {
    top: 2px;
    border: none;
    border-bottom: 2px solid #ccc;
    border-right: 2px solid #ccc;
  }

  .processItem .content {
    padding-bottom: 15px;
    margin: 6px 8px;
    border-left: 2px #ccc solid;
  }

  .processItem .content.active {
    border-left: 2px #FFF2DF solid;
  }

  .processItem:last-child > .content {
    border-left: none;
  }

  .processItem .content > p {
    margin-left: 20px;
    color: #999;
    font-size: 14px;
    line-height: 21px;
  }

  .processItem .content > p.c333 {
    color: #333;
  }

  .processFooter::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;

  }

  .parallelList {
    position: relative;
    padding: 20px 15px;
    margin: 10px 0 0 15px;
    background-color: #F5F5F5;
  }

  .parallelList .processItem:nth-last-child(2) .content {
    padding-bottom: 0;
    margin-bottom: 0;
    border-left: 0;
  }

</style>
