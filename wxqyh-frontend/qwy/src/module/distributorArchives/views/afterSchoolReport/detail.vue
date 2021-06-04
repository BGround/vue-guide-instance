<template>
  <div class="afterSchoolReportDetail">
    <h4>{{desData.serviceInfo.year}}年第{{desData.serviceInfo.quarter}}季度售后成绩单</h4>

    <!-- 服务综合业绩奖励 start -->
    <div class="titWrap">
      <h4>服务综合业绩奖励</h4>
    </div>
    <service-table :columns="desData.serviceInfo"></service-table>

    <div class="titWrap">
      <h4>备件&精品完成情况</h4>
    </div>
    <boutique-table :columns="desData.sparePart"></boutique-table>

    <div class="titWrap">
      <h4>服务运营评估结果</h4>
    </div>
    <div class="marketInfo">
      <!--      运营评估得分-->
      <operate-score-table :columns="operateScoreData"></operate-score-table>

      <div class="subTit">
        <p> · 基础保障能力（{{basicData | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="basicData"></basic-table>

      <div class="subTit">
        <p> · 维修技术能力（{{repairData  | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="repairData"></basic-table>

      <div class="subTit">
        <p> · 备件运营能力（{{sparePartData | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="sparePartData"></basic-table>

      <div class="subTit">
        <p> · 客户关系能力（{{customerData | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="customerData"></basic-table>

      <div class="subTit">
        <p> · 经营管理能力（{{operateData | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="operateData"></basic-table>

      <div class="subTit">
        <p> · 过程管理 （{{processData | moduleWeightFilter}}）</p>
      </div>
      <basic-table :columns="processData"></basic-table>
      <!--      备注-->
      <p class="remarkWrap">该站当季度共评价 {{processTotal.count || '0'}} 个指标，其中“优秀”有 {{processTotal.excellentCount || '0'}} 个，“良好”有 {{processTotal.wellCount || '0'}} 个，“待改善”有 {{processTotal.unimproveCount || '0'}} 个，“后进”有 {{processTotal.fallCount || '0'}} 个。</p>
    </div>

    <!--    四、日常激励汇总 start -->
    <div class="titWrap">
      <h4>日常激励汇总</h4>
    </div>
    <daily-incentive-table :columns="desData.stimulateInfo"></daily-incentive-table>
    <!--   日常激励汇总 end -->


    <!--    四、日常激励汇总 start -->
    <div class="titWrap">
      <h4>大区意见</h4>
    </div>
    <opinion :columns="desData.serviceInfo"></opinion>

    <!--   日常激励汇总 end -->

    <!--    四、日常激励汇总 start -->
    <div class="titWrap">
      <h4>整改计划表</h4>
    </div>
    <schedule :columns="servicePlanVOList"></schedule>

    <!--   日常激励汇总 end -->



    <!--    照片弹框 start-->
    <photo-pop v-if="isPhotoShow"
      :columns="desData.serviceInfo.reportImgs"
      @closePhotoPop="closePhotoPop"></photo-pop>
    <!--    照片弹框 end-->
  </div>
</template>

<script>
import serviceTable from './components/detail/serviceTable'
import boutiqueTable from './components/detail/boutiqueTable'
import dailyIncentiveTable from './components/detail/dailyIncentiveTable'
import operateScoreTable from './components/detail/operateScoreTable'
import basicTable from './components/detail/basicTable'
import photoPop from './components/detail/photoPop'
import opinion from './components/detail/opinion'
import schedule from './components/detail/schedule'

import { ajaxGetSalesAfetrReportById } from '@/module/distributorArchives/api/getData'
export default {
    filters:{
        moduleWeightFilter(data){
            console.log(data,'data')
            if(data && data[0] && data[0].moduleWeight){
                return data[0].moduleWeight
            }else{
                return '-'
            }
        }
    },

  data() {
    return {
      desData: { serviceInfo: {}, sparePart: [], stimulateInfo: [] },
      operateScoreData: [], // 运营评估得分
      basicData: [], // 基础保障能力
      repairData: [], // 维修技术能力
      sparePartData: [], // 备件运营能力
      customerData: [], // 客户关系能力
      operateData: [], // 经营管理能力
      processData: [], // 过程管理
      processTotal: {},
      isPhotoShow: false,
      servicePlanVOList: [],
    }
  },
  created() {
    this.getSalesAfetrReportById()
  },
  methods: {
    getSalesAfetrReportById() {
      let id = this.$route.query.id
      let params = {
        id: id
      }
      ajaxGetSalesAfetrReportById(params, data => {
        if (data) {
          // 处理文件
          let tempUrl = _.compressURL.replace('//compress', '')
          data.serviceInfo.reportFiles.map(item => {
            item.url = tempUrl + item.url
          })
          this.desData = data
          if (data.indicatorInfo) {
            let [
              operateScoreData,
              basicData,
              repairData,
              sparePartData,
              customerData,
              operateData,
              processData
            ] = [[], [], [], [], [], [], []]
            let indicatorInfo = data.indicatorInfo
            indicatorInfo.map(item => {
              if (item.module === '运营评估得分') {
                operateScoreData.push(item)
              }
              if (item.module === '基础保障能力') {
                basicData.push(item)
              }
              if (item.module === '维修技术能力') {
                repairData.push(item)
              }
              if (item.module === '备件运营能力') {
                sparePartData.push(item)
              }
              if (item.module === '客户关系能力') {
                customerData.push(item)
              }
              if (item.module === '经营管理能力') {
                operateData.push(item)
              }
              if (item.module === '过程管理') {
                processData.push(item)
              }
            })
            this.operateScoreData = operateScoreData
            this.basicData = basicData
            this.repairData = repairData
            this.sparePartData = sparePartData
            this.customerData = customerData
            this.operateData = operateData
            this.processData = processData
            if (processData.length > 0) {
              this.processTotal = processData[0].countVO
            }
            this.servicePlanVOList = data && data.servicePlanVOList ? data.servicePlanVOList : []
          }
        }
      })
    },
    // 关闭图片弹框
    closePhotoPop() {
      this.isPhotoShow = false
    }
  },
  components: {
    serviceTable,
    boutiqueTable,
    dailyIncentiveTable,
    operateScoreTable,
    basicTable,
    photoPop,
      opinion,
      schedule
  }
}
</script>

<style lang="less">
@import url('./css/detail.less');
</style>
