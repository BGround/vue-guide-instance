<template>
  <div class="preview" ref="pageContainer">
    <div class="preview__inner" ref="contentContainer">
    <!--   BEGIN:基础信息    -->
      <div class="basic">

        <h3 class="title">
          <span class="title__text">基础信息</span>
          <span class="title__desc"></span>
        </h3>

        <div class="basic__content">
          <div class="row">
            <div class="col">
              <div class="basic__filed">
                <div class="basic__filed__label">经销商：</div>
                <div class="basic__filed__value">{{salesReport.dealerShortName}}</div>
              </div>
              <div class="basic__filed">
                <div class="basic__filed__label">所在省份：</div>
                <div class="basic__filed__value">{{salesReport.province}}</div>
              </div>
            </div>

            <div class="col">
              <div class="basic__filed">
                <div class="basic__filed__label">成绩单日期：</div>
                <div class="basic__filed__value">{{salesReport.pushTime ? salesReport.pushTime.substring(0,10) : '-'}}</div>
              </div>
              <div class="basic__filed">
                <div class="basic__filed__label">所在城市：</div>
                <div class="basic__filed__value">{{salesReport.city}}</div>
              </div>
            </div>

            <div class="col">
              <div class="basic__filed">
                <div class="basic__filed__label">ERP号：</div>
                <div class="basic__filed__value">{{salesReport.erp}}</div>
              </div>
              <div class="basic__filed">
                <div class="basic__filed__label">所属集团：</div>
                <div class="basic__filed__value">{{salesReport.dealerGroup}}</div>
              </div>
            </div>

            <div class="col">
              <div class="basic__filed">
                <div class="basic__filed__label">开通时间：</div>
                <div class="basic__filed__value">{{salesReport.dealerTime}}</div>
              </div>
              <div class="basic__filed">
                <div class="basic__filed__label"></div>
                <div class="basic__filed__value"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    <!--   END:基础信息    -->

    <!--   BEGIN:市场表现    -->
      <div class="market">
        <h3 class="title">
          <span class="title__text">市场表现</span>
          <span class="title__desc">数据：{{calculatePrevMonth(1).year}}年{{calculatePrevMonth(1).month}}月自主市占率</span>
        </h3>

        <h4 class="subtitle">· 所在城市自主市占率表现</h4>


        <div class="market__data">

          <div class="market__data__item ranking">

            <div class="market__data__item__value">
              <div class="decoration">NO.</div>
              <div class="decoration">{{getMarket.provinceSort || 0}}</div>
            </div>
            <div class="market__data__item__label">全省排名</div>
          </div>

          <div class="market__data__item city-share">
            <div class="market__data__item__value">
              <div class="decoration">{{getMarket.cityPercent | round | addPercentSymbol}}</div>
            </div>
            <div class="market__data__item__label">所在城市市占率</div>
          </div>

          <div class="market__data__item city-share">
            <div class="market__data__item__value">
              <div class="decoration">{{getMarket.provincePercent | round | addPercentSymbol}}</div>
            </div>
            <div class="market__data__item__label">全省市占率</div>
          </div>

          <div class="market__data__item city-share">
            <div class="market__data__item__value">
              <div class="decoration">{{getMarket.countryPercent  | round | addPercentSymbol}}</div>
            </div>
            <div class="market__data__item__label">全国市占率</div>
          </div>

        </div>

        <h4 class="subtitle">· 自身表现</h4>

        <div class="self">
          <table>
              <thead>
                <tr>
                  <th>{{getYear -3}}</th>
                  <th>{{getYear -2}}</th>
                  <th>{{getYear -1}}</th>
                  <th colspan="3">近三月市占率</th>
                  <th colspan="8">{{calculatePrevMonth(1).year}}年{{calculatePrevMonth(1).month}}月</th>
                </tr>

                <tr>
                  <th>年度</th>
                  <th>年度</th>
                  <th>年度</th>
                  <th>{{calculatePrevMonth(4).year}}年{{calculatePrevMonth(4).month}}月</th>
                  <th>{{calculatePrevMonth(3).year}}年{{calculatePrevMonth(3).month}}月</th>
                  <th>{{calculatePrevMonth(2).year}}年{{calculatePrevMonth(2).month}}月</th>
                  <th>所在城市市占率</th>
                  <th>全国市占率</th>
                  <th>全省市占率</th>
                  <th>比全国</th>
                  <th>比全省</th>
                  <th>全省排名</th>
                  <th>同比</th>
                  <th>环比</th>
                </tr>

              </thead>
              <tbody>
                <tr>
                  <td class="rb">{{getMarket.year3 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.year2 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.year1 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getCityPerformance.month3 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getCityPerformance.month2 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getCityPerformance.month1 | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.cityPercent | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.countryPercent| round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.provincePercent | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.country | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.province | round | addPercentSymbol}}</td>
                  <td class="rb">{{getMarket.provinceSort}}</td>
                  <td class="rb">{{getMarket.yearOnYear| round | addPercentSymbol}}</td>
                  <td>{{getMarket.monthOnMonth| round | addPercentSymbol}}</td>
                </tr>
              </tbody>
          </table>
        </div>

        <h4 class="subtitle">· 与竞品对比表现</h4>

        <div class="compare">
          <table>
            <colgroup :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
            <colgroup :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
            <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-1`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
            <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-2`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
            <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-3`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
            <thead>
            <tr>
              <th :colspan="2+ getFirstRowBrandList.length">奇瑞</th>
              <th  v-for="(item, index) in getFirstRowBrandList" colspan="2">
                {{item.brand}}
                {{item.brandsDisplay==='1' && item.brands?`(${item.brands})`:''}}
              </th>
            </tr>
            <tr class="compare__header2">
              <th>
                <p>所在城市</p>
                <p>排名</p>
              </th>
              <th>
                <p>所在城市</p>
                <p>市占率</p>
              </th>
              <th  v-for="(item, index) in getFirstRowBrandList">奇瑞-{{item.brand}}</th>

              <template  v-for="(item, index) in getFirstRowBrandList">
                <th>
                  <p>所在城市</p>
                  <p>排名</p>
                </th>
                <th>
                  <p>所在城市</p>
                  <p>市占率</p>
                </th>
              </template>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td v-if="hasValue(getCheryBrand)">{{getCheryBrand.sort | formatNumber }}</td>
              <td v-if="hasValue(getCheryBrand)"> {{getCheryBrand.percent  | round | addPercentSymbol}}</td>
              <td v-for="(item, index) in getFirstRowBrandList" :key="`differPercent-${index}`">{{item.differPercent | round | addPercentSymbol}}</td>
              <template v-for="(item, index) in getFirstRowBrandList">
                <td :key="`sort-${index}`">{{item.sort | formatNumber }}</td>
                <td :key="`percent-${index}`">{{item.percent | round | addPercentSymbol}}</td>
              </template>
            </tr>
            </tbody>
          </table>
        </div>



        <div class="compare" v-for="(brandList, index) in getOtherRowBrandLists" :key="index">
          <table>
            <colgroup v-for="(item, index) in brandList" :key="`${index}-1`" :width="calculateColWidthOfRows(brandList)"></colgroup>
            <colgroup v-for="(item, index) in brandList" :key="`${index}-2`" :width="calculateColWidthOfRows(brandList)"></colgroup>
            <colgroup v-for="(item, index) in brandList" :key="`${index}-3`" :width="calculateColWidthOfRows(brandList)"></colgroup>
            <thead>
            <tr>
              <th :colspan="brandList.length">奇瑞</th>
              <th  v-for="(item, index) in brandList" colspan="2">
                {{item.brand}}
                {{item.brandsDisplay==='1' && item.brands?`(${item.brands})`:''}}
              </th>
            </tr>
            <tr class="compare__header2">
              <th  v-for="(item, index) in brandList">奇瑞-{{item.brand}}</th>
              <template  v-for="(item, index) in brandList">
                <th>
                  <p>所在城市</p>
                  <p>排名</p>
                </th>
                <th>
                  <p>所在城市</p>
                  <p>市占率</p>
                </th>
              </template>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td v-for="(item, index) in brandList" :key="`differPercent-${index}`">{{item.differPercent |  round |addPercentSymbol}}</td>
              <template v-for="(item, index) in brandList">
                <td :key="`sort-${index}`">{{item.sort | formatNumber }}</td>
                <td :key="`percent-${index}`">{{item.percent  | round | addPercentSymbol}}</td>
              </template>
            </tr>
            </tbody>
          </table>
        </div>

      </div>
    <!--   END:市场表现    -->

    <!--   BEGIN:销量表现    -->
      <div class="sales">

        <h3 class="title">
          <span class="title__text">销量表现</span>
          <span class="title__desc">注：提车数据采用公司单点报表数据，未考虑集团统算，具体政策核算结果以财务公示为准</span>
        </h3>
        <h4 class="subtitle">· 提车（{{calculatePrevMonth(0).year}}年{{calculatePrevMonth(0).month}}月）</h4>
        <div class="pick">
          <table>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <thead>
            <tr>
              <th colspan="5">月度完成情况</th>
              <th colspan="4">提车完成率排名</th>
              <th rowspan="2" class="dealer-count">
                <div class="dealer-count__text">
                  <p>同城经销</p>
                  <p>商家数</p>
                </div>
              </th>
            </tr>
            <tr>
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
            </thead>
            <tbody>
            <tr>
              <td class="rb">{{salePerformance.carTarget | formatNumber}}</td>
              <td class="rb">{{salePerformance.carComplete| formatNumber}}</td>
              <td class="rb">{{salePerformance.carPercent  | round | addPercentSymbol}}</td>
              <td class="rb">{{salePerformance.carYearOnYear  | round | addPercentSymbol}}</td>
              <td class="rb">{{salePerformance.carMonthOnMonth  | round | addPercentSymbol}}</td>
              <td class="rb">{{salePerformance.carCountrySort| formatNumber}}</td>
              <td class="rb">{{salePerformance.carAreaSort| formatNumber}}</td>
              <td class="rb">{{salePerformance.carProvinceSort| formatNumber}}</td>
              <td class="rb">{{salePerformance.carCitySort | formatNumber}}</td>
              <td class="rb">{{salePerformance.carDealerNum | formatNumber}}</td>
            </tr>
            </tbody>
          </table>
        </div>


        <h4 class="subtitle">· 实销（{{calculatePrevMonth(0).year}}年{{calculatePrevMonth(0).month}}月）</h4>
        <div class="real">
          <table>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="10%"></colgroup>
            <thead>
            <tr>
              <th colspan="5">月度完成情况</th>
              <th colspan="4">实销量排名</th>
              <th rowspan="2" class="dealer-count">
                <div class="dealer-count__text">
                  <p>同城经销</p>
                  <p>商家数</p>
                </div>
              </th>
            </tr>
            <tr>
              <th>实销目标</th>
              <th>实销完成</th>
              <th>完成率</th>
              <th>同比</th>
              <th>环比</th>
              <th>全国排名</th>
              <th>大区排名</th>
              <th>全省排名</th>
              <th>同城排名</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="rb">{{salePerformance.salesTarget | formatNumber}}</td>
              <td class="rb">{{salePerformance.salesComplete | formatNumber}}</td>
              <td class="rb">{{salePerformance.salesPercent | round | addPercentSymbol}}</td>
              <td class="rb">{{salePerformance.salesYearOnYear | round | addPercentSymbol}}</td>
              <td  class="rb">{{salePerformance.salesMonthOnMonth | round | addPercentSymbol}}</td>
              <td class="rb">{{salePerformance.salesCountrySort | formatNumber}}</td>
              <td class="rb">{{salePerformance.salesAreaSort | formatNumber}}</td>
              <td class="rb">{{salePerformance.salesProvinceSort | formatNumber}}</td>
              <td  class="rb">{{salePerformance.salesCitySort | formatNumber}}</td>
              <td class="rb">{{salePerformance.salesDealerNum | formatNumber}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <h4 class="subtitle">· 库存（{{calculatePrevMonth(0).year}}年{{calculatePrevMonth(0).month}}月）</h4>
        <div class="stock">
          <table>
            <thead>
            <tr>
              <th colspan="2">月度库存情况</th>
            </tr>
            <tr>
              <th>库存数</th>
              <th>存销比</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td  class="rb">{{salePerformance.stock}}</td>
              <td>{{salePerformance.stockPercent}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    <!--   END:销量表现    -->

    <!--   BEGIN:奖惩信息    -->
      <div class="reward">

        <h3 class="title">
          <span class="title__text">奖惩信息</span>
          <span class="title__desc">数据：{{calculatePrevMonth(1).year}}年{{calculatePrevMonth(1).month}}月已执行考核明细</span>
        </h3>

        <div class="reward__data">
          <div class="row">
            <div class="col">
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">当年奖惩</div>
                <div class="reward__data__filed__value"></div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">奖励次数:</div>
                <div class="reward__data__filed__value">{{rewardInfo.yearSize | formatNumber}}</div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">处罚次数:</div>
                <div class="reward__data__filed__value">{{rewardInfo.yearPunishSize | formatNumber}}</div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">累计次数:</div>
                <div class="reward__data__filed__value">{{formatRewardSize(rewardInfo.yearSize,rewardInfo.yearPunishSize) | formatNumber}}</div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">当月奖惩</div>
                <div class="reward__data__filed__value"></div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">累计次数:</div>
                <div class="reward__data__filed__value">{{rewardInfo.monthSize | formatNumber}}</div>
              </div>
            </div>

            <div class="col">
              <div class="reward__data__filed" style="visibility:hidden">
                <div class="reward__data__filed__label">当年奖惩</div>
                <div class="reward__data__filed__value"></div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">奖励金额:</div>
                <div class="reward__data__filed__value">{{rewardInfo.yearAmount | formatNumber}}</div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">处罚金额:</div>
                <div class="reward__data__filed__value">{{rewardInfo.yearPunishAmount | formatNumber}}</div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">累计金额:</div>
                <div class="reward__data__filed__value">{{formatRewardAmount(rewardInfo.yearAmount,rewardInfo.yearPunishAmount) | formatNumber}}</div>
              </div>
              <div class="reward__data__filed" style="visibility:hidden">
                <div class="reward__data__filed__label">当月奖惩</div>
                <div class="reward__data__filed__value"></div>
              </div>
              <div class="reward__data__filed">
                <div class="reward__data__filed__label">累计金额:</div>
                <div class="reward__data__filed__value">{{rewardInfo.monthAmount | formatNumber}}</div>
              </div>
            </div>

          </div>
        </div>


        <div class="reward__table">
          <table>
            <colgroup width="6%"></colgroup>
            <colgroup width="8%"></colgroup>
            <colgroup width="20%"></colgroup>
            <colgroup width="25%"></colgroup>
            <colgroup width="15%"></colgroup>
            <colgroup width="8%"></colgroup>
            <colgroup width="10%"></colgroup>
            <colgroup width="8%"></colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>类别</th>
                <th>事由</th>
                <th>文件名称</th>
                <th>文件编号</th>
                <th>联系人</th>
                <th>联系电话</th>
                <th>金额（元）</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in rewardsList" :key="item.id">
                <td>{{index + 1}}</td>
                <td>{{item.rewardsType || '-'}}</td>
                <td>{{item.checkThing || '-'}}</td>
                <td>{{item.report || '-'}}</td>
                <td>{{item.reportNo || '-'}}</td>
                <td>{{item.linkman || '-'}}</td>
                <td>{{item.linkmanPhone || '-'}}</td>
                <td>{{item.rewardsAmount || '-'}}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    <!--   END:市场表现    -->

    <!--   BEGIN:经销商反馈    -->
    <div class="feedback">

      <h3 class="title">
        <span class="title__text">经销商反馈</span>
        <span class="title__desc"></span>
      </h3>

      <div class="feedback__table">
        <table>
          <thead>
          <tr>
            <th>序号</th>
            <th>项目</th>
            <th>责任人</th>
            <th>完成时间</th>
            <th>参会人</th>
            <th>图片</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in feedbackProjects">
            <td>{{index +1}}</td>
            <td>{{item.projectName || '-'}}</td>
            <td>{{item.projectLeader || '-'}}</td>
            <td>{{item.finishedTime || '-'}}</td>
            <td>{{item.attendee || '-'}}</td>
            <td>查看</td>
          </tr>
          </tbody>
        </table>
      </div>


    </div>
    <!--   END:经销商反馈    -->

      <!--   END:签名    -->
      <div class="sign">
        <span class="sign__label">
          总经理签名:
        </span>
        <span class="sign__value" style="margin-right: 12px">
          <img v-if="getSignImage1" :src="signImage1" alt="">
        </span>
        <span class="sign__label">
          投资人签名（必填）:
        </span>
        <span class="sign__value">
          <img v-if="getSignImage" :src="signImage" alt="">
        </span>
      </div>
      <!--   END:签名    -->




    <div data-html2canvas-ignore class="print">
      <button @click="handleClick" class="print__btn">打印</button>
    </div>
  </div>
  </div>
</template>

<script>
    import {
        getMarketReportInfo,
        getSalesreportSales,
        uploadImageBase64,
        getSalesreportRewards,
        viewFeedProject,
        doSendFileToMe, getSalesreportDetail, readSalesreport
    } from "@/module/channelManagement/api/reportCard";
    import dayjs from "dayjs";
    import './html2canvas.js';

    const PAGE_WIDTH = 1260;

    function resetViewportMeta() {
        const content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        const $viewportMeta = document.querySelector('meta[name="viewport"]');
        $viewportMeta.content = content;
        document.body.style.width = '';
    }

    function setViewPortMeta() {
        const $viewportMeta = document.querySelector('meta[name="viewport"]');
        const windowWidth = window.innerWidth;
        const initialScale = windowWidth / PAGE_WIDTH;
        const content = `width=device-width, initial-scale=${initialScale}, user-scalable=no, viewport-fit=cover`;
        $viewportMeta.content = content;
        document.body.style.width = '100%';
    }

    function imageSrcToBase64(sourceSrc) {
        return new Promise((resolve, reject)=>{
            const image = new Image();
            image.src = sourceSrc;
            image.onload = function(){
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0, image.width, image.height);
                const dataURL = canvas.toDataURL();
                resolve(dataURL);
            }
            image.onerror = function (e) {
                reject(e);
            }
        })

    }

    export default {
        name: "preview",
        components: {},
        filters:{
            formatNumber(value){
                return value === 0 || value? value: '-';
            },
            addPercentSymbol(value){
                  return (!!value || value === 0) ? `${value}%`: '-'
            },
            round(number) {
                if(!!number || number === 0){
                    const precision = 2;
                    const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision);
                    return Number(roundNumber).toFixed(2);
                }else{
                    return number;
                }

                //same as:
                //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
            }
        },
        data() {
            return {
                imgSrc: '',
                salesreportMarketBrandList: [],
                marketPerformance: {},
                salePerformance: {},
                salesReport: {},
                reportMonth: null,
                rewardInfo: {
                    monthSize: '',
                    monthAmount: '',
                    yearAmount: '',
                    yearSize:  '',
                    yearPunishAmount: '',
                    yearPunishSize: '',

                },
                feedbackProjects: [],
                rewardsList: [],
                signImage: '',
                signImage1: '',
            }
        },
        props: {},
        computed:{

            getMonth(){
                return this.salesReport.month || '';
            },

            getYear(){
                return this.salesReport.year || '';
            },

            getMarket(){
                return this.marketPerformance.marketPO || {};
            },

            getCityPerformance(){
                return this.marketPerformance || {};
            },
            getCheryBrand(){
                if(this.marketPerformance){
                    return {
                        sort: this.marketPerformance.citySort,
                        percent: this.marketPerformance.cityPercent,
                    }
                }else{
                    return {}
                }
            },
            getOtherBrandList(){
                const otherBrandList = this.salesreportMarketBrandList.filter(item=>{
                    return item.brand !== '奇瑞'
                });
                return otherBrandList || [];
            },
            getFirstRowBrandList(){
                return this.getOtherBrandList.slice(0, 4);
            },
            getOtherRowBrandLists(){ // 生成二维数组
                const BrandCountPerRow = 4;
                const otherBrandList = this.getOtherBrandList.slice(4);
                const list = otherBrandList.reduce((result, currentItem, currentIndex)=>{
                    const rowIndex = Math.floor(currentIndex / 4);
                    if(currentIndex % BrandCountPerRow === 0){
                        result[rowIndex] = [];
                    }
                    result[rowIndex].push(currentItem);
                    return result;
                }, [])
                return list;
            },

            getSignImage(){
                const investorSign = this.feedbackProjects.length && this.feedbackProjects[0] && this.feedbackProjects[0].investorSign ? this.feedbackProjects[0].investorSign: '';
                return investorSign? _.fileDownURL + investorSign: '';
            },
            getSignImage1(){
                const generalManagerSign = this.feedbackProjects.length && this.feedbackProjects[0] && this.feedbackProjects[0].generalManagerSign ? this.feedbackProjects[0].generalManagerSign: '';
                return generalManagerSign? _.fileDownURL + generalManagerSign: '';
            }

        },
        methods: {
            formatRewardSize(size1,size2) {
              if (size1 && size2) {
                return size1 + size2
              } else if (size1) {
                return size1
              } else if (size2) {
                return size2
              } else {
                return '-'
              }
            },

            formatRewardAmount(reward,punish) {
              if (reward && punish) {
                return reward + punish
              } else if (reward) {
                return reward
              } else if (punish) {
                return punish
              } else {
                return '-'
              }
            },
            isEmpty(value){
               return typeof value === 'object' && Object.keys(value).length === 0;
            },

            hasValue(value){
                return !!value || value === 0;
            },

            /**
             *计算第一行的宽度
             */
            calculateColWidthOfFirstRow(brandList){
                const fixedColCount = 2;
                const brandCount = brandList.length;
                const width = 100 / (fixedColCount +( brandCount*3));
                return `${width}%`;
            },

            /**
             * 计算其他行的宽度
             */
            calculateColWidthOfRows(brandList){
                if(!brandList.length){
                    return 0;
                }
                const brandCount = brandList.length;
                const width = 100 / ( brandCount*3);
                return `${width}%`;
            },

            sendFile(mediaId) {
                doSendFileToMe(mediaId).then((result)=>{
                    if('0'===result.code){
                        if(_.isWeChatApp()){
                            _.alert("i18n.warmNotice","i18n.applicationMain",{
                                primaryBtn:{name:"i18n.confirm", callBack:wx.closeWindow}, defaultBtn:{name:"i18n.cancel", callBack:null},
                            });
                        }else{
                            _.alert("i18n.warmNotice","i18n.wechatMain");
                        }
                    }else{
                        _.alert("i18n.notice",result.desc);
                    }
                })
            },

            handleClick(){
                const dom = document.querySelector(".preview__inner");
                const {width, height} = dom.getBoundingClientRect();
                const scaleBy = 2;
                const canvas = document.createElement('canvas');
                canvas.width = width * scaleBy;
                canvas.height = height * scaleBy + 35;
                canvas.style.width = width * scaleBy + 'px';
                canvas.style.height = height * scaleBy + 'px';
                const context = canvas.getContext('2d');
                context.scale(scaleBy, scaleBy);
                context.font = 'Microsoft YaHei';
                const docWidth = this.$refs['pageContainer'].clientWidth
                const offset = docWidth - width > 0 ? (docWidth - width)/4: 0;
                console.log(offset, offset)
                const mobileConfig = { // 移动端需要设置canvas 否则生成失败
                    width: 1260,
                    y:0,
                    x: offset,
                    scrollX: 0,
                    scrollY: 0,
                    scale: 1,
                    canvas: canvas,
                }
                const pcConfig = {
                    foreignObjectRendering: true,
                    width: 1260,
                    y:0,
                    x: offset,
                    windowWidth: docWidth,
                    removeContainer: false,
                    scale: 1,
                }
                const config = _.isMobileApp() ? mobileConfig : pcConfig
                html2canvas(dom, config).then((canvasRes)=>{
                    const base64 = canvasRes.toDataURL();
                    uploadImageBase64(base64).then((data)=>{
                        if (data && data.mediaInfo && data.mediaInfo.id) {
                            this.sendFile(data.mediaInfo.id)
                        }else{
                            _.alert("i18n.notice",'该文件不存在');
                        }
                    })
                })
            },


            /**
             * 计算前N个月
             * @param n
             * @return {{month: string, year: string}|{month: number, year: number}}
             */
            calculatePrevMonth(n){
                if(!this.reportMonth){
                    return {
                        year: '',
                        month: ''
                    };
                };
                const d = dayjs(this.reportMonth).subtract(n, 'month');
                console.log(d.format('YYYY'), n)
                return {
                    year: d.format('YYYY'),
                    month: d.format('MM')
                }
            },

            initReportMonth(salesReport){
                const {month, year} = salesReport;
                if(month && year){
                    this.reportMonth = new Date(`${year}/${month}/01`)
                    console.log(this.reportMonth.toISOString())
                }
            },

            parseViewportContent(content){
                return content.split(',').reduce((result, contentItem) => {
                    let [key, value] = contentItem.split('=');
                    key.trim()
                    if(key){
                        let parsedValue = parseFloat(value);
                        parsedValue = Number.isNaN(parsedValue) ? value: parsedValue
                        return {...result, [key]: parsedValue};
                    }else{
                        return result;
                    }
                },{})
            },

            adjustPageSize(){
                const {height:contentContainerHeight} = this.$refs['contentContainer'].getBoundingClientRect();
                const pageHeight = this.$refs['pageContainer'].clientHeight;
                if(contentContainerHeight > pageHeight){
                    const $viewportMeta = document.querySelector('meta[name="viewport"]');
                    const scale = pageHeight / contentContainerHeight;
                    const parsedContent = this.parseViewportContent($viewportMeta.getAttribute('content'))
                    const initialScale = parsedContent['initial-scale'] * scale;
                    console.log(pageHeight / contentContainerHeight, pageHeight , contentContainerHeight)
                    const contentValue = `width=device-width, initial-scale=${initialScale}, user-scalable=no, viewport-fit=cover`;
                    $viewportMeta.content = contentValue;
                    document.body.style.width = '100%';
                }
            },


            setImage(){
                const investorSign = this.feedbackProjects.length && this.feedbackProjects[0] && this.feedbackProjects[0].investorSign ? this.feedbackProjects[0].investorSign: '';
                const imageSrc = investorSign? _.fileDownURL + investorSign: '';
                if(imageSrc){
                    imageSrcToBase64(imageSrc).then((base64)=>{
                        this.signImage = base64;
                    }).catch((e)=>{
                        console.log(e,'加载签名')
                    })
                }
            },
            setImage1(){
                const generalManagerSign = this.feedbackProjects.length && this.feedbackProjects[0] && this.feedbackProjects[0].generalManagerSign ? this.feedbackProjects[0].generalManagerSign: '';
                const imageSrc = generalManagerSign? _.fileDownURL + generalManagerSign: '';
                if(imageSrc){
                    imageSrcToBase64(imageSrc).then((base64)=>{
                        this.signImage1 = base64;
                    }).catch((e)=>{
                        console.log(e,'加载签名')
                    })
                }
            }
        },
        created() {
            // _.alert("i18n.notice",'result.desc');


            this.id = this.$route.query.id || '';
            this.dealerId = this.$route.query.dealerId || '';
            this.salesReport =  this.$route.query || {};
            this.initReportMonth(this.salesReport);


            getSalesreportDetail({id: this.id}).then((data)=>{
                if(data && data.salesreportDetail){
                    // this.salesreport = data.salesreportDetail.salesreport || {};
                    // this.initReportMonth(this.salesreport);
                    console.log( data.salesreportDetail.salesreport)
                    this.salePerformance = data.salesreportDetail.salesreportSalesPO || {}; //销量表现
                    this.marketPerformance = data.salesreportDetail.marketReportInfo || {}; // 市场表现
                    const salesreportRewards = data.salesreportDetail.salesreportRewards || {};
                    this.rewardsList = salesreportRewards.rewardsList || [];
                    this.rewardInfo = {
                        monthSize:salesreportRewards.monthSize? salesreportRewards.monthSize: '',
                        monthAmount: salesreportRewards.monthAmount? salesreportRewards.monthAmount: '',
                        yearAmount: salesreportRewards.yearAmount? salesreportRewards.yearAmount: '',
                        yearSize: salesreportRewards.yearSize? salesreportRewards.yearSize: '',
                        yearPunishAmount: salesreportRewards.yearPunishAmount? salesreportRewards.yearPunishAmount: '',
                        yearPunishSize: salesreportRewards.yearPunishSize? salesreportRewards.yearPunishSize: '',
                    }
                    this.salesreportMarketBrandList = this.marketPerformance.brandList ? this.marketPerformance.brandList: [];
                    this.feedbackProjects = data.salesreportDetail.dealerFeedProjectVOList || []
                    this.setImage()
                    this.setImage1()
                }
            }).finally(()=>{
                this.$nextTick(this.adjustPageSize) // 如果页面不在屏幕视野内无法生成快照,需要提交页面高度
            })


            // 销量表现
            // const p1 = getSalesreportSales({id:this.id}).then((data)=>{
            //     this.salePerformance = data || {};
            // })

            // //移动端-市场表现
            // const p2 = getMarketReportInfo({id:this.id}).then((data)=>{
            //     this.marketPerformance = data || {};
            //     this.salesReportMarketBrandList = data ? data.brandList : [];
            // })
            //
            // const p3 = getSalesreportRewards({id:this.id}).then((data)=>{
            //     this.rewardsList = data && data.rewardsList? data.rewardsList : [];
            //     this.rewardInfo = {
            //         monthSize: data && data.monthSize? data.monthSize: '',
            //         monthAmount: data && data.monthAmount? data.monthAmount: '',
            //         yearAmount: data && data.yearAmount? data.yearAmount: '',
            //         yearSize: data && data.yearSize? data.yearSize: ''
            //     }
            // })

            // const p4 = viewFeedProject({dealerInfoId:this.dealerId , salesreportId:this.id}).then((data)=>{
            //   this.feedbackProjects = data || [];
            // })


        },
        beforeRouteEnter(to, form, next){
          setViewPortMeta();
          next();
        },
        beforeRouteLeave(to, form, next){
            resetViewportMeta();
            next()
        }
    }
</script>

<style scoped lang="scss">
  .preview{
    position: fixed;
    height: 100vh;
    background: #ffffff;
    width: 100vw;
    overflow: auto;
    box-sizing: border-box;
  }
  .preview__inner{
    /*position: fixed;*/
    box-sizing: border-box;
    width: 1260px;
    padding: 25px 50px 34px 49px;
    margin: 0 auto;
    background: #ffffff;

    .basic__content{
      width:1160px;
      height:80px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(213,213,213,1);
      padding: 16px;
      box-sizing: border-box;
      margin-bottom: 40px;
    }

    .basic__filed{
      display: flex;
      &__label{
        height:24px;
        font-size:14px;
        font-weight:400;
        line-height:24px;
        color:rgba(102,102,102,1);
        width: 84px;
      }
      &__value{
        height:24px;
        font-size:14px;
        font-weight:400;
        line-height:24px;
        color:rgba(51,51,51,1);
      }
    }

    .row{
      display: flex;
      .col{
        flex: 1;
      }
    }

    .title{
      position: relative;
      padding-bottom: 10px;
      &::before{
        content: '';
        width:4px;
        height:12px;
        background:rgba(201,17,46,1);
        top: 0;
        left: 0;
        position: absolute;
        margin-top: 4px;
      }
      &__text{
        margin-left: 8px;
        height:20px;
        font-size:14px;
        font-weight:bold;
        line-height:20px;
        color:rgba(51,51,51,1);
      }
      &__desc{
        margin-left: 42px;
        height:20px;
        font-size:14px;
        font-weight:400;
        line-height:20px;
        color:rgba(51,51,51,1);
      }
    }

    .subtitle{
      height:19px;
      font-size:14px;
      font-weight:bold;
      line-height:28px;
      color:rgba(51,51,51,1);
      margin-left: 15px;
    }

    .compare, .reward__table, .feedback__table{
      table{
        tbody{
          tr{
            td{
              border:1px solid rgba(213,213,213,1);
            }
          }
        }
      }
    }

    table{
      margin-top: 10px;
      margin-bottom: 35px;
      width: 100%;
      border: none;
      text-align: center;
      border-collapse:collapse;
      thead{
        tr:first-child{
          width:550px;
          height:30px;
          background:rgba(231,232,233,1);
          border:1px solid rgba(213,213,213,1);
          font-size:12px;
          font-weight:bold;
          color:rgba(0,0,0,1);
        }
        tr{
          background: #F7F7F7;
          th{
            line-height:14px;
            padding: 8px 8px;
            border:1px solid rgba(213,213,213,1);
          }
        }
      }
      tbody{
        tr{
          .rb{
            border-right:1px solid rgba(213,213,213,1);
          }
        }
      }

      tr{
        min-height:30px;
        border:1px solid rgba(213,213,213,1);
        line-height: 16px;
        td{
          padding: 7px 0;
        }
      }


    }

    .reward__data__filed{
      display: flex;
      margin-bottom: 10px;
      .reward__data__filed__label{
        height:14px;
        font-size:14px;
        font-weight:400;
        line-height:14px;
        color:rgba(20,30,40,1);
        margin-right: 5px;
      }
      .reward__data__filed__value{
        height:14px;
        font-size:14px;
        font-weight:400;
        line-height:14px;
        color:#C6001F;
      }


    }
    .reward__data{
      width: 400px;
    }

    .market__data{
      display: flex;
      padding: 25px 38px 30px;
      justify-content: space-between;
      text-align: center;
      .market__data__item__value{
        display: flex;
        justify-content: center;
      }
      .market__data__item__label{
        height:20px;
        font-size:14px;
        font-weight:bold;
        line-height:20px;
        color:rgba(112,112,112,1);
        margin-top: 5px;
      }
      .city-share{
        .decoration{
          padding: 0 30px;
        }
      }
      .decoration{
        background: #707070;
        min-width: 68px;
        height: 76px;
        font-size:48px;
        font-weight:bold;
        line-height:76px;
        position: relative;
        border-radius: 6px;
        color: #ffffff;
        &:after{
          content: '';
          height: 50%;
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          background:rgba(255,255,255,0.35);
        }
      }

      .ranking{
        .market__data__item__value{
          .decoration:first-child{
            margin-right: 8px;
            font-size: 32px;
          }
          .decoration:last-child{
              padding: 0 10px;
          }
        }
      }
    }

    .print{
        text-align: center;
      .print__btn{
        margin: 0 auto;
        border: none;
        width:347px;
        height:100px;
        background:rgba(91,155,239,1);
        opacity:1;
        border-radius:14px;
        font-size:50px;
        font-weight:400;
        line-height:100px;
        color:rgba(255,255,255,1);
      }
    }

    .dealer-count{
      position: relative;
      padding: 0;
      .dealer-count__text{
        width: 100%;
        background: #F7F7F7;
        height: 60px;
        box-sizing: border-box;
        right: 1px;
        top: 0;
        padding: 12px 0;
        p{
          height: 18px;
          line-height: 18px;
          width: 100%;
        }
      }
    }

    .compare__header2{
      th{
        font-size: 9px;
        padding-left: 4px;
        padding-right: 4px;
        white-space: nowrap;
      }
    }

    .sign{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .sign__label{
        margin-right: 10px;
      }
      .sign__value{
        width: 86px;
        height: 40px;
        img{
          vertical-align: top;
          width: 86px;
          height: 40px;
        }
      }
    }

  }


</style>
<style>
  @media screen and (min-width: 1024px){
    .qwui-mask{
      width: 100% !important;
    }
    body {
      width: 100% !important;
    }
  }

</style>
