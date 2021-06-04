<template>
  <div class="schoolReportDesWrap">
    <school-report-info :columns="dataSource.salesreport"></school-report-info>


    <!-- 市场表现 start -->
    <div class="titWrap">
      <h4>市场表现</h4>
    </div>
    <div class="marketInfo">
      <div class="subTit">
        <p> · 市占率表现</p>
      </div>

      <div class="specialNumWrap">
        <ul>
          <li>
            <div class="specialNum"><span class="rank">NO.</span><span>{{dataSource.salesreportMarket.provinceSort}}</span></div>
            <p>排名</p>
          </li>
          <li>
            <div class="specialNum"><span>{{dataSource.salesreportMarket.cityPercent}}%</span></div>
            <p>所在城市市占率</p>
          </li>
          <li>
            <div class="specialNum"><span>{{dataSource.salesreportMarket.provincePercent}}%</span></div>
            <p>全省市占率</p>
          </li>
          <li>
            <div class="specialNum"><span>{{dataSource.salesreportMarket.countryPercent}}%</span></div>
            <p>全国市占率</p>
          </li>
        </ul>
      </div>

      <div class="marketRateInfo">
        <div class="tableWrap">
          <table class="firstTable">
            <tr>
              <th colspan="8">{{dataSource.salesreportMarket.year}}年（{{dataSource.salesreportMarket.month}}月）</th>
            </tr>
            <tr class="graybg">
              <th>所在城市市占率</th>
              <th>全国市占率</th>
              <th>全省市占率</th>
              <th>比全国</th>
              <th>比全省</th>
              <th>全省排名</th>
              <th>同比</th>
              <th>环比</th>
            </tr>
            <tr>
              <td>{{dataSource.salesreportMarket.cityPercent}}</td>
              <td>{{dataSource.salesreportMarket.countryPercent}}</td>
              <td>{{dataSource.salesreportMarket.provincePercent}}</td>
              <td>{{dataSource.salesreportMarket.country}}</td>
              <td>{{dataSource.salesreportMarket.province}}</td>
              <td>{{dataSource.salesreportMarket.provinceSort}}</td>
              <td>{{dataSource.salesreportMarket.yearOnYear}}</td>
              <td>{{dataSource.salesreportMarket.monthOnMonth}}</td>
            </tr>
          </table>

          <table>
            <tr>
              <th class="borderR">{{dataSource.salesreportMarket.year?dataSource.salesreportMarket.year-2:''}}</th>
              <th class="borderR">{{dataSource.salesreportMarket.year?dataSource.salesreportMarket.year-1:''}}</th>
              <th colspan="12">{{dataSource.salesreportMarket.year}}</th>
            </tr>
            <tr class="graybg">
              <th class="borderR">年度</th>
              <th class="borderR">年度</th>
              <th>1月</th>
              <th>2月</th>
              <th>3月</th>
              <th>4月</th>
              <th>5月</th>
              <th>6月</th>
              <th>7月</th>
              <th>8月</th>
              <th>9月</th>
              <th>10月</th>
              <th>11月</th>
              <th>12月</th>
            </tr>
            <tr>
              <td>{{dataSource.salesreportMarket.year2}}</td>
              <td>{{dataSource.salesreportMarket.year1}}</td>
              <td>{{dataSource.salesreportMarket.january}}</td>
              <td>{{dataSource.salesreportMarket.february}}</td>
              <td>{{dataSource.salesreportMarket.march}}</td>
              <td>{{dataSource.salesreportMarket.april}}</td>
              <td>{{dataSource.salesreportMarket.may}}</td>
              <td>{{dataSource.salesreportMarket.june}}</td>
              <td>{{dataSource.salesreportMarket.july}}</td>
              <td>{{dataSource.salesreportMarket.august}}</td>
              <td>{{dataSource.salesreportMarket.september}}</td>
              <td>{{dataSource.salesreportMarket.october}}</td>
              <td>{{dataSource.salesreportMarket.november}}</td>
              <td>{{dataSource.salesreportMarket.december}}</td>
            </tr>
          </table>
        </div>
        <div class="chartWrap">
          <market-share-trend v-if="marketShareData.length>0" :columns="marketShareData"></market-share-trend>
        </div>
      </div>

      <div class="subTit">
        <p> · 竞争对比表现</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="competeInfo">
        <compete-table :columns="dataSource.salesreportMarketBrandList"></compete-table>
        <div class="chartWrap">
          <compet-trend v-if="dataSource.salesreportMarketBrandList.length>0" :columns="dataSource.salesreportMarketBrandList"></compet-trend>
        </div>
      </div>
    </div>
    <!-- 市场表现 end -->

    <!-- 销量表现 start -->
    <div class="titWrap">
      <h4>销量表现</h4>
    </div>
    <div class="competeInfo">

      <div class="tableWrap">
        <div class="subTit">
          <p> · 提车</p>
        </div>
        <table>
          <tr>
            <th colspan="5">月度完成情况</th>
            <th colspan="4">提车完成率排名</th>
            <th rowspan="2"
              class="graybg">同城经销<br>
              商家数</th>
          </tr>
          <tr class="graybg">
            <th>提车目标</th>
            <th>提车完成</th>
            <th>完成率</th>
            <th>同比</th>
            <th>环比</th>
            <th>全国排名</th>
            <th>大区排名</th>
            <th>全省排名</th>
            <th>同城排名</th>
          </tr>
          <tr>
            <td>{{dataSource.salesreportSales.carTarget}}</td>
            <td>{{dataSource.salesreportSales.carComplete}}</td>
            <td>{{dataSource.salesreportSales.carPercent}}</td>
            <td>{{dataSource.salesreportSales.carYearOnYear}}</td>
            <td>{{dataSource.salesreportSales.carMonthOnMonth}}</td>
            <td>{{dataSource.salesreportSales.carCountrySort}}</td>
            <td>{{dataSource.salesreportSales.carAreaSort}}</td>
            <td>{{dataSource.salesreportSales.carProvinceSort}}</td>
            <td>{{dataSource.salesreportSales.carCitySort}}</td>
            <td>{{dataSource.salesreportSales.carDealerNum}}</td>
          </tr>
        </table>

        <div class="subTit">
          <p> · 实销</p>
        </div>
        <table>
          <tr>
            <th colspan="5">月度完成情况</th>
            <th colspan="4">提车完成率排名</th>
            <th rowspan="2"
              class="graybg">同城经销<br>
              商家数</th>
          </tr>
          <tr class="graybg">
            <th>提车目标</th>
            <th>提车完成</th>
            <th>完成率</th>
            <th>同比</th>
            <th>环比</th>
            <th>全国排名</th>
            <th>大区排名</th>
            <th>全省排名</th>
            <th>同城排名</th>
          </tr>
          <tr>
            <td>{{dataSource.salesreportSales.salesTarget}}</td>
            <td>{{dataSource.salesreportSales.salesComplete}}</td>
            <td>{{dataSource.salesreportSales.salesPercent}}</td>
            <td>{{dataSource.salesreportSales.salesYearOnYear}}</td>
            <td>{{dataSource.salesreportSales.salesMonthOnMonth}}</td>
            <td>{{dataSource.salesreportSales.salesCountrySort}}</td>
            <td>{{dataSource.salesreportSales.salesAreaSort}}</td>
            <td>{{dataSource.salesreportSales.salesProvinceSort}}</td>
            <td>{{dataSource.salesreportSales.salesCitySort}}</td>
            <td>{{dataSource.salesreportSales.salesDealerNum}}</td>
          </tr>
        </table>

        <div class="subTit">
          <p>· 库存</p>
        </div>
        <table>
          <tr>
            <th>库存数</th>
            <th>存销比</th>
          </tr>
          <tr>
            <td>{{dataSource.salesreportSales.stock}}</td>
            <td>{{dataSource.salesreportSales.stockPercent}}</td>
          </tr>
        </table>
      </div>

      <div class="chartWrap">
        <sale-volume-trend v-if="monthData.length>0" :columnsMonth="monthData" :columnsSx="sxData" :columnsTc="tcData" :columnsCxb="cxbData"></sale-volume-trend>
      </div>
    </div>
    <!-- 销量表现 end -->

    <!--    奖惩信息 start -->
    <div class="titWrap">
      <h4>奖惩信息</h4>
    </div>
    <rewards-table :columns="dataSource.rewardsList"></rewards-table>
    <!--    奖惩信息 end -->

    <!-- 经销商反馈 start -->
    <div class="titWrap">
      <h4>经销商反馈</h4>
    </div>
    <div class="distrInfo">
      <div class="subTit">
        <p>培训照片</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>

      <div class="trainInfo">
        <div class="trainL">
          <ul>
            <li>
              <img src="./images/icon_pxzp.png">
              <p class="tname">培训照片</p>
              <p><a href="javascript:;" @click="isPhotoShow=true">查看</a></p>
            </li>
            <li>
              <img src="./images/icon_zgfj.png">
              <p class="tname">整改附件</p>
              <p class="fileWrap" v-for="(item,index) in dataSource.files" :key="index"><a :href="item.url" :download="item.fileName">{{item.fileName}}</a></p>
              <p v-if="dataSource.files && dataSource.files.length===0" style="color:#999;">暂无数据</p>
            </li>
          </ul>
        </div>
        <div class="trainR">
          <div class="trainTit"><img src="./images/icon_tzryj.png"> 投资人意见</div>
          <textarea readonly class="remark" placeholder="投资人反馈意见">{{dataSource.salesreport.feedback}}</textarea>
        </div>
      </div>
      <div class="autograph">
        <span class="nameLabel">反馈人姓名</span>
        <span class="nameWrap">{{dataSource.salesreport.feedbackUser}}</span>
        {{dataSource.salesreport.feedbackTime}}
      </div>
    </div>
    <!-- 经销商反馈 end -->

    <!--    照片弹框 start-->
    <photo-pop v-if="isPhotoShow" :columns="dataSource.imgs" @closePhotoPop="closePhotoPop"></photo-pop>
    <!--    照片弹框 end-->
  </div>
</template>

<script>
  import schoolReportInfo from "./components/detail/schoolReportInfo";
  import competeTable from "./components/detail/competeTable";
  import marketShareTrend from "./components/detail/marketShareTrend";
  import competTrend from "./components/detail/competTrend";
  import saleVolumeTrend from "./components/detail/saleVolumeTrend";
  import rewardsTable from "./components/detail/rewardsTable";
  import photoPop from "./components/detail/photoPop";
  import {ajaxGetOpenSalesreportDetail,ajaxGetSalesreportDetail} from '@/module/distributorArchives/api/getData'
  export default {
  data() {
    return {
        id:'',
        dataSource:{
            files:[],
            imgs:[],
            salesreport:{
                dealerShortName:'',province:'',year:'',month:'',city:'',erp:'',dealerGroup:'',dealerTime:''
            },
            salesreportMarket:{},
            salesreportMarketBrandList:[],
            salesreportSales:{},
            rewardsList:[]
        },
        marketShareData:[], // 市占率折线图
        monthData:[],
        sxData:[],
        tcData:[],
        cxbData:[],
        isPhotoShow: false
    }
  },
  created(){
      this.init()
  },
  methods:{
      init(){
          this.id = this.$route.query.id
          this.getSalesreportDetail()
      },
      getSalesreportDetail(){
          let params = {
              id:this.id
          }
          ajaxGetSalesreportDetail(params,data => {
              if(data && data.salesreportDetail) {
                  // 处理文件
                  let tempUrl = _.compressURL.replace('//compress','')
                  data.salesreportDetail.files.map(item => {
                      item.url = tempUrl+item.url
                  })

                  this.dataSource = data.salesreportDetail
                  if(data.salesreportDetail.salesreportMarket) {
                      let arr = data.salesreportDetail.salesreportMarket
                      this.marketShareData.push(parseFloat(arr.january),parseFloat(arr.february),parseFloat(arr.march),parseFloat(arr.april),parseFloat(arr.may),parseFloat(arr.june),parseFloat(arr.july),parseFloat(arr.august),parseFloat(arr.september),parseFloat(arr.october),parseFloat(arr.november),parseFloat(arr.december))
                  }

                  let [monthData,sxData,tcData,cxbData] = [[],[],[],[]]
                  // 分月实销完成率
                  data.salesreportDetail.salesreportSalesSalesList.map(item => {
                      monthData.push(item.month+'月')
                      sxData.push(parseFloat(item.percent))
                  })
                  // 分月提车完成率
                  data.salesreportDetail.salesreportSalesCarList.map(item => {
                      tcData.push(parseFloat(item.percent))
                  })
                  // 分月存销比
                  data.salesreportDetail.salesreportSalesKuCunList.map(item => {
                      cxbData.push(parseFloat(item.percent))
                  })
                  this.monthData = monthData
                  this.sxData = sxData
                  this.tcData = tcData
                  this.cxbData = cxbData
              }
          })
      },
      // 关闭图片弹框
      closePhotoPop(){
          this.isPhotoShow = false
      }
  },
  components:{
      schoolReportInfo,competeTable,marketShareTrend,competTrend,saleVolumeTrend,photoPop,rewardsTable
  }
}
</script>

<style lang="less">
@import url('./css/detail.less');
</style>
