<template>
  <div class="retireNetWrap">
    <!-- 预警陈述 start -->
    <div class="titWrap mb10">
      <h4>预警陈述</h4>
    </div>
    <div class="warningWrap">
      <yj-flow :columns="yjCurrentIndex"></yj-flow>
      <div class="subTit">
        <p> · 预警陈述信息</p>
      </div>
      <early-warning-table :columns="earlyWarningData"></early-warning-table>

      <div class="subTit">
        <p> · 陈述项目整改</p>
      </div>
      <project-rectification-table :columns="proRectficateData"></project-rectification-table>
    </div>
    <!-- 预警陈述 end -->

    <!-- 退网信息 start -->
    <div class="titWrap mb10">
      <h4>退网信息</h4>
    </div>
    <div class="retireNetInfo">
      <div class="subTit">
        <p>· 风险评估 - 财务情况(单位：万元)</p>
      </div>
      <financial-table :columns="financialData"></financial-table>

      <div class="subTit">
        <p>· 退网信息</p>
      </div>
      <retire-table :columns="retireData"></retire-table>
    </div>
    <!-- 退网信息 end -->

    <!-- 退网清算 start -->
    <div class="titWrap mb10">
      <h4>退网清算</h4>
    </div>
    <div class="qsStateWrap">
      <qs-flow :columns="qsFlowData" :currentIndex="qsCurrentIndex"></qs-flow>

      <div class="subTit">
        <p>· 当前清算状态</p>
      </div>
      <p class="undischarged"><i class="el-icon-warning "></i>未清算</p>
      <undischarged-table :columns="undischargedData"></undischarged-table>
      <p class="liquidated"><i class="el-icon-success"></i>已清算</p>
      <liquidated-table :columns="liquidatedData"></liquidated-table>

      <div class="subTit">
        <p>· 往来业务时间</p>
      </div>
      <business-time-table :columns="businessData"></business-time-table>

      <div class="subTit">
        <p>· 保证金退款进度</p>
      </div>
      <deposit-tefund-table :columns="businessData"></deposit-tefund-table>
    </div>
    <!-- 退网清算 end -->
  </div>
</template>

<script>
  import financialTable from "./retireNet/financialTable";
  import retireTable from "./retireNet/retireTable";
  import yjFlow from "./retireNet/yjFlow";
  import qsFlow from "./retireNet/qsFlow";
  import undischargedTable from "./retireNet/undischargedTable";
  import liquidatedTable from "./retireNet/liquidatedTable";
  import businessTimeTable from "./retireNet/businessTimeTable";
  import depositTefundTable from "./retireNet/depositTefundTable";
  import earlyWarningTable from "./retireNet/earlyWarningTable";
  import projectRectificationTable from "./retireNet/projectRectificationTable";
  import {ajaxGetSelectByState,
  ajaxGetPcQuitWarningForm2,
      ajaxGetRetireInfo,ajaxGetRiskAssessment,ajaxGetFlowStage,ajaxGetLiquidationDept,ajaxGetPcQuitWarningForm,ajaxGetFindAllEarlyWarning,ajaxGetEarlyRectification
  } from '../../../api/getData'
export default {
  data() {
    return {
        financialData:{}, // 财务情况数据
        retireData:{}, // 退网信息数据
        yjCurrentIndex:0,
        qsFlowData:[], // 预警陈述过程
        qsCurrentIndex:0,
        undischargedData: [], // 未清算
        liquidatedData: [], // 已清算
        businessData:{}, // 往来业务时间
        earlyWarningData:[], // 预警陈述
        proRectficateData:[], // 陈述项目整改
    }
  },
  props:['dealerId'],
  created(){
    this.init()
  },
  methods:{
    init(){
        this.getRiskAssessment()
        this.getRetireInfo()
        this.getFlowStage()
        this.getLiquidationDept()
        this.getPcQuitWarningForm()
        this.getFindAllEarlyWarning()
        this.getEarlyRectification()
        this.getSelectByState()
        this.getPcQuitWarningForm2();
    },
    // 预警陈述状态
    getSelectByState(){
        let params = {
            id: this.dealerId
        }
        let self = this
        ajaxGetSelectByState(params,data => {
            if(data && data.num){
                self.yjCurrentIndex = data.num
            }
        })
    },
    // 陈述项目整改
    getEarlyRectification(){
        let params = {
            id: this.dealerId
        }
        ajaxGetEarlyRectification(params,data => {
            if(data && data.entEarlyRectificationVos){
                this.proRectficateData = data.entEarlyRectificationVos
            }
        })
    },
    //  预警陈述信息
    getFindAllEarlyWarning(){
        let params = {
            id: this.dealerId
        }
        ajaxGetFindAllEarlyWarning(params,data => {
            if(data && data.allEarlyWarnings){
                this.earlyWarningData = data.allEarlyWarnings
            }
        })
    },
    // 往来业务时间
    getPcQuitWarningForm() {
        let params = {
            dealerId: this.dealerId
        }
        let self = this
        // ajaxGetPcQuitWarningForm(params,data => {
        //     if(data && data.formData){
        //       this.businessData = data.formData
        //     }
        // })
    },
    // 当前清算状态
    getLiquidationDept(){
        let params = {
            dealerId: this.dealerId
        }
        let self = this
        // ajaxGetLiquidationDept(params,data => {
        //     if(data && data.liquidationDept){
        //         let arr = data.liquidationDept
        //         let unData=[]
        //         let liData = []
        //         arr.map(item => {
        //             if(item.liquidationType===0) {
        //                 unData.push(item)
        //             } else {
        //                 liData.push(item)
        //             }
        //         })
        //         self.undischargedData = unData
        //         self.liquidatedData = liData
        //     }
        // })
    },
    // 清算流程
    getFlowStage(){
        let params = {
            dealerId: this.dealerId
        }
        let self = this
        // ajaxGetFlowStage(params,data => {
        //     if(data && data.flowStatusList && data.flowStatusList.length>0){
        //         let arr = data.flowStatusList
        //         let tempId = ''
        //         arr.sort(self.compareFun('nodeRank'))
        //         arr.map(item => {
        //             if(item.liquidationType===1) {
        //                 tempId = item.nodeRank
        //             }
        //         })

        //         self.qsFlowData = arr
        //         self.qsCurrentIndex = tempId
        //     }
        // })
    },

    getPcQuitWarningForm2(){
      let params = {
            dealerId: this.dealerId
        }
        let self = this
        ajaxGetPcQuitWarningForm2(params,data => {
            if(data && data.flowStatusList && data.flowStatusList.length>0){
                let arr = data.flowStatusList
                let tempId = ''
                arr.sort(self.compareFun('nodeRank'))
                arr.map(item => {
                    if(item.liquidationType===1) {
                        tempId = item.nodeRank
                    }
                })

                self.qsFlowData = arr
                self.qsCurrentIndex = tempId
            }

            if(data && data.liquidationDept){
                let arr = data.liquidationDept
                let unData=[]
                let liData = []
                arr.map(item => {
                    if(item.liquidationType===0) {
                        unData.push(item)
                    } else {
                        liData.push(item)
                    }
                })
                self.undischargedData = unData
                self.liquidatedData = liData
            }

            if(data && data.formData){
              this.businessData = data.formData
            }

            if(data && data.formData){
                this.retireData = data.formData
                 this.financialData = data.formData;
            }
        })
    },


    // 排序
    compareFun(property){
        return function(a,b) {
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2
        }
    },
    // 财务状况
    getRiskAssessment(){
        let params = {
            id: this.dealerId
        }
        // ajaxGetRiskAssessment(params,data => {
        //     if(data && data.tbEntRiskAssessmentVo){
        //         this.financialData = data.tbEntRiskAssessmentVo
        //     }
        // })
    },
    getRetireInfo(){
        let params = {
            id: this.dealerId
        }
        // ajaxGetRetireInfo(params,data => {
        //     if(data && data.tbEntRetireInfoVo){
        //         this.retireData = data.tbEntRetireInfoVo
        //     }
        // })
    }
  },
  components:{financialTable,retireTable,yjFlow,qsFlow,undischargedTable,liquidatedTable,businessTimeTable,depositTefundTable,earlyWarningTable,projectRectificationTable}
}
</script>
