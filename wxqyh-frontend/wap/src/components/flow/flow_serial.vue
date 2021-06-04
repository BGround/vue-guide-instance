<template>
  <div class="processPop">
    <div class="maskLayer" ref="maskLayer"></div>
    <div class="process">
      <div class="processScroll">
        <div class="processHead">
          <div class="processTitle">
            <p>流转明细</p>
            <p class="processAllTime" v-if="isShowAllWaitTime()">用时 {{waitTime(flowSerialData.list[0])}}</p>
          </div>
        </div>
        <div class="processContent">
          <div class="processList">
            <div class="processItem" v-for="(item,nodeIndex) in auditSerial" :key="nodeIndex">
              <div class="title">
                <i :class="['iconStep',flowStatus(item)]"></i>
                <div class="name">
                  <p :class="item.status!=2?'title-active':''">{{item.nodeName}}
                    <span>{{item.signType}}</span>
                  </p>
                </div>
                <p class="processNodeTime" v-if="flowSerialData.isFreeFlow != 1">{{showNodeTime(item)}}</p>
              </div>
              <div :class="['content',item.status!=2?'active':'']">
                <p v-if="item.handleAccounts!=''">处理人{{item.isSign ? '/会签' : ''}}：{{item.handleAccounts}}</p>
                <p class="c333" v-for="(auditUserItem,index) in item.auditUserList" v-if="auditUserItem.auditUser!=''"
                   :key="index">
                  <span>{{auditUserItem.auditUser}} <span class="dot">·</span> {{auditUserItem.nodeType}}</span>
                  <span v-if="nodeIndex != 0 && flowSerialData.isFreeFlow != 1" class="processNodeTime">{{titleTime(auditUserItem.auditTime)}}</span>
                </p>
                <p class="processWaitTime" v-if="isShowNodeWaitTime(item)">{{waitTimeShow(item)}}</p>
                <div v-for="(parallel,index) in item.parallelList" :key="index">
                  <div class="parallelList">
                    <div :class="['processItem',parallel[0].status!=2?'active':'']" v-show="!parallel[0].isShow">
                      <div class="title">
                        <i :class="['iconStep',parallelStatus(nodeIndex,auditSerial,parallel[0])]"></i>
                        <div class="name">
                          <p :class="parallel[0].status!=2?'title-active':''">{{parallel[0].nodeName}}
                            <span>{{parallel[0].signType}}</span>
                          </p>
                        </div>
                        <p class="processNodeTime">{{showNodeTime(parallel[0])}}</p>
                      </div>
                    </div>
                    <div :class="['processItem',parallelItem.status!=2?'active':'']"
                         v-for="(parallelItem,index) in parallel" v-show="parallel[0].isShow" :key="index">
                      <div class="title">
                        <i :class="['iconStep',parallelStatus(nodeIndex,auditSerial,parallelItem)]"></i>
                        <div class="name">
                          <p :class="parallelItem.status!=2?'title-active':''">{{parallelItem.nodeName}}
                            <span>{{parallelItem.signType}}</span>
                          </p>
                        </div>
                        <p class="processNodeTime">{{showNodeTime(parallelItem)}}</p>
                      </div>
                      <div :class="['content','parallelContent',parallelItem.status!=2?'active':'']">
                        <p v-if="parallelItem.handleAccounts!=''">
                          处理人{{parallelItem.isSign ? '/会签' : ''}}：{{parallelItem.handleAccounts}}</p>
                        <p class="c333" v-for="(auditUserItem,index) in parallelItem.auditUserList"
                           v-if="auditUserItem.auditUser!=''" :key="index">
                          <span>{{auditUserItem.auditUser}} <span class="dot">·</span> {{auditUserItem.nodeType}}</span>
                          <span class="processNodeTime">{{titleTime(auditUserItem.auditTime)}}</span>
                        </p>
                        <p class="processWaitTime" v-if="!isShowWaitTime(nodeIndex,auditSerial,parallelItem)">
                          {{waitTimeShow(parallelItem)}}
                        </p>
                      </div>
                    </div>
                    <div class="icon_arrow" @click="parallelToggle(parallel[0])">
                      <span>{{parallel[0].isShow?'收起':'更多'}}</span>
                      <i :class="['icon_arrow_up',parallel[0].isShow?'':'icon_arrow_down']"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="processItem">
              <div class="title">
                <i :class="['iconStep',isOverActive?'active':'']"></i>
                <div class="name">
                  <p :class="isOverActive?'title-active':''">{{lastNodeText}}</p>
                </div>
                <p class="processNodeTime" v-if="flowSerialData.isFreeFlow != 1 && isOverActive ">{{approveEndTime(flowSerialData.list[0])}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="processFooter">
        <span class="qwui-btn qwui-btn_default" @click="hideProcessPop">返回</span>
      </div>
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
          1: ['审批', '退审', '未审批',  '干预节点', '干预处理人', '干预结束', '关闭'],
          2: ['确认', '退回', '未审批',  '干预节点', '干预处理人', '干预结束', '关闭'],
          3: ['办理', '退回', '未审批',  '干预节点', '干预处理人', '干预结束', '关闭']
        },
      }
    },
    created() {
      let _this = this;
      if (this.flowSerialData.isFreeFlow == '1') {
        this.auditSerial = this.dealFreeSerial();
      } else {
        this.auditSerial = this.dealAuditSerial();
      };
      // 弹窗时body不滚动
      if (_.isMobileApp()) {
        this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = -this.scrollTop + 'px';
      } else {
        document.body.style.overflow = 'hidden';
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
          auditSerialItem.handleAccounts = listItem.auditStatus != '1' ? listItem.handlePersons.replace(/,/g, '、') : '';
          auditSerialItem.status = listItem.isCheck == '0' ? 2 : 0;
          if(listItem.auditPersonsList.length){
            listItem.auditPersonsList.forEach((value) => {
              let auditUserItem = {};
              auditUserItem.auditUser = value.handlePersons;
              auditUserItem.nodeType = this.dealFreeAudit(value.auditStatus);
              auditSerialItem.auditUserList.push({...auditUserItem});
            })
          }
          auditSerial.push(auditSerialItem);
        }
        return auditSerial;
      },
      dealFreeAudit(auditStatus) {
        let nodeType = '';
        switch (auditStatus) {
          case 0:
            nodeType = '退审';
            break;
          case 4:
            nodeType = '重新提交';
            break;
          case 5:
            nodeType = '转审';
            break;
          case 6:
            nodeType = '同意并结束';
            break;
          case 7:
            nodeType = '关闭';
            break;
          default:
            nodeType = '同意';
            break;
        }
        return nodeType;
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
            createTime: '', //创建时间
            auditTime: '', //审批时间
            nodeAuditTime: '', //节点用时
          }
          let listItem = list[i];
          auditSerialItem.auditTime = listItem.auditTime
          auditSerialItem.createTime = listItem.createTime
          auditSerialItem.nodeAuditTime = listItem.nodeAuditTime
          if (listItem.signType && listItem.signType != '') {
            auditSerialItem.isSign = true;
            auditSerialItem.signType = listItem.signType != '3' ? listItem.signType == '1' ? ' · 前签' : ' · 后签' : '';
          }

          // 0提单人 1审批通过 2退审 3未审批 4审批通过 5未重新提交 6结束节点未审批
          // 7重新提交 8提单人自结束 9退审 12节点干预 13负责人干预 14干预结束 15关闭(approveText有关)
          let status = listItem.auditStatus;

          if (isFree == '0' || isFree == '2') { //固定流程
            //2未结束的最后节点
            let nodeStatus = listItem.nodeStatus;
            if (status == '0') {
              auditSerialItem.nodeName = '提单';
              auditSerialItem.status = 0;
              this.isCreatorNode(auditSerialItem,listItem);
            } else {
              auditSerialItem.nodeName = status == '5' || status == '7' ? '提单人处理' : listItem.nodeName;
              auditSerialItem.handleAccounts = listItem.personName.replace(/,/g, '、');
              if ((status == '3' && (nodeStatus == '1' || nodeStatus == '2')) || status == '5') {
                // 未审批
                auditSerialItem.status = 2;
              } else if (status == '12' || status == '13' || status == '14') {
              //流程干预
              auditSerialItem.status = status - 9;
              } else if (status == '15') {
                //关闭
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
              this.isCreatorNode(auditSerialItem,listItem);
            } else {
              auditSerialItem.auditTime = listItem.auditTime;
              auditSerialItem.nodeName = listItem.nodeName;
              auditSerialItem.handleAccounts = listItem.handleAccounts.replace(/,/g, '、');
              if (status == '2') {
                //未审批
                auditSerialItem.status = 2;
              } else if (status == '12' || status == '13' || status == '14') {
                //流程干预
                auditSerialItem.status = status - 9;
              } else if (status == '15') {
                //关闭
                auditSerialItem.status = status - 9;
              } else {
                //status:0退审，其他为已审批
                auditSerialItem.status = listItem.status == '0' || status == '0' ? 1 : 0;
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
            isShow: true, //是否显示并行子节点，默认展示
            createTime:'',//创建时间
            auditTime:'',//审批时间
            nodeAuditTime: '', //节点用时
          }
          let parallelNodeItem = parallelFlowNodes[i];
          auditSerialItem.createTime = parallelNodeItem.createTime;
          auditSerialItem.auditTime = parallelNodeItem.auditTime;
          auditSerialItem.nodeAuditTime = parallelNodeItem.nodeAuditTime;
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
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? value.personName + value.entrustUserName : value.auditUserName;
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
            auditUserItem.auditTime = value.auditTime
            auditUserList.push({...auditUserItem});
          })
        } else {
          if (nodeStatus != 2) {
            let auditUserItem = {};
            auditUserItem.auditUser = isFree == '0' || isFree == '2' ? listItem.personName : listItem.auditUserName;
            auditUserItem.auditTime = listItem.auditTime;
            if (isFree == '3') {
              auditUserItem.nodeType = listItem.auditStatus == '4' ? '重新提交' : this.getNodeType(listItem.nodeType, nodeStatus);
            } else {
              auditUserItem.nodeType = listItem.auditStatus == '7' ? '重新提交' : this.getNodeType(listItem.nodeType, nodeStatus);
            }
            auditUserList.push(auditUserItem);
          }
        }
        return auditUserList;
      },
      hideProcessPop() {
        this.flowSerialData.isShowFlowSerial = false;
        this.resetBody();
      },
      // 节点图标类型
      statusIcon(item) {
        if(item.status != 2) {
          if(item.status > 2 && item.status < 6){
            return 'flow';
          }else {
            return 'active';
          }
        }else {
          return '';
        }
      },
      flowStatus(item) {
        // 非并行当前所在节点流程特殊标识(有创建时间且显示等待时间)
        if(item.createTime && this.isShowNodeWaitTime(item) && !item.nodeAuditTime) return 'current'
        return this.statusIcon(item);
      },
      parallelStatus(index,auditSerial,parallelItem){
        // 并行中当前所在节点流程特殊标识(有创建时间且显示等待时间)
        if(parallelItem.createTime && !this.isShowWaitTime(index,auditSerial,parallelItem) && !parallelItem.nodeAuditTime) return 'current'
        return this.statusIcon(parallelItem);
      },
      // 提单节点默认添加参数
      isCreatorNode(auditSerialItem,listItem) {
        let isFree = this.flowSerialData.isFreeFlow;
        let auditUserItem = {};
        auditUserItem.auditTime = listItem.auditTime;
        if(isFree == '0' || isFree == '2'){
          // 固定
          auditUserItem.auditUser = listItem.personName;
        }else if(isFree == '3'){
          // 分支流程
          auditUserItem.auditUser = listItem.auditUserName;
        }
        auditUserItem.nodeType = '提单';
        auditSerialItem.auditUserList = [auditUserItem];
        if(listItem.signAuditPersons.length){
          auditSerialItem.auditUserList.push(...this.getAuditUserDetail(listItem, auditSerialItem.status));
        }
      },
      // 等待/总用时 .replace(/-/g,'/')适配苹果手机
      waitTime(lastTime) {
        let nextTime = this.flowSerialData.currentTime ? new Date(this.flowSerialData.currentTime.replace(/-/g,'/')) : new Date();
        if(lastTime.billEndTime){
            nextTime = new Date(lastTime.billEndTime.replace(/-/g,'/'));
        }
        let oneDayTime = 1000 * 60 * 60 * 24,
          oneMinTime = 1000 * 60 * 60,
          oneSecTime = 1000 * 60,
          allTime = new Date(nextTime.getTime() - new Date(lastTime.createTime.replace(/-/g,'/')).getTime()),
          days = parseInt(allTime / oneDayTime),
          hours = parseInt((allTime % oneDayTime) / oneMinTime),
          minutes = parseInt((allTime % oneMinTime) / oneSecTime),
          seconds = parseInt((allTime % oneSecTime) / 1000);
        return (days ? days + ' 天 ':'') + (hours ? hours + ' 小时 ' : '') + (minutes ? minutes + ' 分钟 ' : '') + (seconds ? seconds + ' 秒' : '') ;
      },
      waitTimeShow(item) {
        if(!item.createTime) return;
        if(item.nodeAuditTime){
          return '用时 ' + item.nodeAuditTime;
        }else {
          return '等待 ' + this.waitTime(item)
        }
      },
      // 节点、审批、结束时间转换
      titleTime(item) {
        if(!item) return;
        let showTime = new Date(item.replace(/-/g,'/')),
            nowTime = this.flowSerialData.currentTime ? new Date(this.flowSerialData.currentTime.replace(/-/g,'/')) : new Date();
        if(nowTime.getFullYear() == showTime.getFullYear()){
          showTime = showTime.Format('MM-dd hh:mm:ss');
        }else {
          showTime = showTime.Format('yyyy-MM-dd hh:mm:ss');
        }
        return showTime;
      },
      // 显示节点时间
      showNodeTime(item) {
        if(!item.createTime) return;// 没有创建时间的节点不显示
        return this.titleTime(item.createTime);
      },
      // 结束时间==最后一个节点审批时间
      approveEndTime(lastTime) {
        if(lastTime.billEndTime){
          return this.titleTime(lastTime.billEndTime);
        }
      },
      // 总用时
      isShowAllWaitTime(){
        return this.flowSerialData.isFreeFlow != 1
          && !(this.isOverActive && this.flowSerialData.list[0].billEndTime == '' ); // 兼容旧数据，状态为已审批或者已关闭且第一个节点的billEndTime为空
      },
      // 节点是否显示等待时间
      isShowNodeWaitTime(item){
        return item.nodeName !='提单'
          && this.flowSerialData.isFreeFlow != 1  // 不是自由流程
          && !(item.parallelList && item.parallelList.length) // 没有并行节点
          && !((item.status != 2 || this.isOverActive) && !item.nodeAuditTime) // 不是（未审或者单已结束且没有节点用时）
      },
      // 并行内节点是否显示等待时间
      isShowWaitTime(index,auditSerial,parallelItem) {
        let flag1 = auditSerial[index+1] && auditSerial[index+1].createTime; // 下一节点有创建时间
        let flag2 = !parallelItem.nodeAuditTime; // 并行内节点没有节点用时
        return (flag1 || this.isOverActive) && flag2;
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
    }
  }

</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .processPop {
      width: 740px;
      margin: auto;
    }
  }
  .processPop {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    box-sizing: border-box;
    animation: select-box-gradient .2s ease;
  }

  .processPop .process {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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

  .processScroll {
    position: relative;
    height: 100%;
    overflow-y: auto;
  }

  .processScroll::-webkit-scrollbar {
    width: 0;
  }

  .processHead {
    display: flex;
    position: absolute;
    top: 0;
    padding: 20px 0 25px;
    margin-top: 10px;
    border-radius: 8px 8px 0 0;
    align-items: center;
    width: 100%;
    color: #333;
    background-color: #fff;
    font-size: 16px;
    line-height: 1;
  }

  .processTitle {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .processTitle:first-child {
    color: #0A1736;
  }

  .processHead::before {
    content: '';
    margin-left: 17px;
    margin-right: 15px;
    width: 3px;
    height: 14px;
    background-color: #5684F0;
    border-radius: 2px;
  }

  .processAllTime {
    margin-right: 22px;
    font-size: 13px;
    color: #7A7D80;
  }

  .processContent {
    position: absolute;
    top: 60px;
    bottom: 60px;
    width: 100%;
    background-color: #fff;
  }

  .processContent .processList {
    padding: 0 15px;
    background-color: #fff;
  }

  .processItem:last-child {
    padding-bottom: 82px;
  }

  .processItem .title {
    display: flex;
  }

  .processItem .title .name {
    display: flex;
    flex: 1;
    justify-content: space-between;
    width: 0;
  }

  .processItem .title .name p {
    color: #2E3952;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 15px;
  }

  .processItem .title .name p.title-active{
    color: #333;
    font-weight: 600;
  }

  .processItem .title .name span {
    color: #467DB9;
  }

  .processNodeTime {
    padding-right: 5px;
    font-size: 12px;
    color: #B2B9C8;
    white-space: nowrap;
  }

  .processItem .iconStep {
    float: left;
    margin-right: 12px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px #ccc solid;
    box-sizing: border-box;
  }

  .iconStep.active {
    border: none;
    background: #458BE9 url(~assets/images/icon_step_check.svg) no-repeat center;
    background-size: 11px;
  }
  .iconStep.flow {
    border: none;
    background: #458BE9 url(../../assets/images/icon_step_flow.png) no-repeat center;
    background-size: 12px;
  }
  .iconStep.current {
    border: 2px #458BE9 solid;
  }

  .icon_arrow{
    margin-top: 18px;
    text-align: center;
    cursor: pointer;
  }

  .icon_arrow span{
    font-size: 14px;
    color: #B2B9C8;
  }

  .icon_arrow_up {
    position: absolute;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .icon_arrow_up::after {
    content: "";
    position: absolute;
    top: 9px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-top: 2px solid #D2D5DB;
    border-left: 2px solid #D2D5DB;
    transform: rotate(45deg);
  }

  .icon_arrow_down::after {
    top: 5px;
    border: none;
    border-bottom: 2px solid #ccc;
    border-right: 2px solid #ccc;
  }

  .processItem .content {
    padding-top: 6px;
    padding-bottom: 21px;
    margin: -2px 5px 0 7px;
    border-left: 2px #F7F8FA solid;
  }

  .processItem .content.active {
    border-left: 2px #E8F0FF solid;
  }

  .processItem .parallelContent {
    border-left: 2px #EEF2FD solid;
  }

  .processItem:last-child > .content {
    border-left: none;
  }

  .processItem .content > p {
    margin-left: 20px;
    color: #7A7D80;
    font-size: 14px;
    line-height: 21px;
  }

  .processItem .content > p.c333 {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    color: #0A1836;
  }

  .processItem .content > p.c333 .processNodeTime {
    margin-top: 2px;
    padding-right: 0;
  }

  .processFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 8px 15px;
    background: #fff;
    box-sizing: border-box
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
    padding: 20px 10px 20px 15px;
    margin: 10px 0 0 15px;
    background-color: #F7F8FB;
    border-radius: 4px;
  }

  .parallelList .processItem:nth-last-child(2) .content {
    padding-bottom: 0;
    margin-bottom: 0;
    border-left: 0;
  }

  .processItem .content .processWaitTime {
    margin-top: 10px;
    color: #B2B9C8;
  }

  .dot {
    color: #86888B;
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

</style>
