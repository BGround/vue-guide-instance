<template>
  <div class="operation-evaluation">

    <div class="assembly-date">
      <div class="select-bar">
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--year">
          <span class="select-bar__value">{{currentYear}}</span>
          <i class="section__icon"></i>
        </div>
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--year"
             v-if="showQuarter">
          <span class="select-bar__value">{{currentQuarter}}</span>
          <i class="section__icon"></i>
        </div>
<!--        <div @click="handleClickDatePicker"-->
<!--             class="select-bar__item select-bar__item&#45;&#45;month">-->
<!--          <span class="select-bar__value">{{currentMonth}}</span>-->
<!--          <i class="section__icon"></i>-->
<!--        </div>-->
      </div>
    </div>


      <div class="gutter"></div>
      <content-title :content="[
                      '更新日期：'+ (toFormatTime(salesInfo.updateTime, 'yyyy-MM-dd') ? toFormatTime(salesInfo.updateTime, 'yyyy-MM-dd'): '暂无'),
                      '更新人：'+ (salesInfo.updateUser? salesInfo.updateUser: '暂无')
                     ]"
                     :showContent="true"
                     name="销售运营"
                     padding="8px 7px 15px 18px"
      ></content-title>
    <template v-if="isNonEmptyObject(salesInfo)">
      <div class="section-list">
        <div class="section-item">
          <img src="../../../static/images/icon_sales_operations.png" style="width: 60px;"/>
          <div class="text-center">
            <div class="text-blue">大区内排名</div>
            <div class="text-red mt-10">{{salesInfo.ranking | filterEmpty}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">销售运营分级</div>
            <div class="text-red mt-10">{{salesInfo.salesOperationClassification | filterEmpty}}</div>
          </div>
        </div>
        <div class="section-maintitle">【得分明细】</div>
        <div class="section-item">
          <div class="text-center">
            <div class="text-blue--mini">销售运营核检得分</div>
            <div class="text-red--mini mt-10">{{salesInfo.flightInspection | filterEmpty}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue--mini">销售满意度得分</div>
            <div class="text-red--mini mt-10">{{salesInfo.salesSatisfaction | filterEmpty}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue--mini">销售运营综合得分</div>
            <div class="text-red--mini mt-10">{{salesInfo.salesOperationScore | filterEmpty}}</div>
          </div>
        </div>
      </div>
    </template>


      <div class="gutter"></div>
      <content-title :content="[
                      '更新日期：'+ (toFormatTime(serviceInfo.modifyTime, 'yyyy-MM-dd')? toFormatTime(serviceInfo.modifyTime, 'yyyy-MM-dd'): '暂无'),
                      '更新人：'+ (serviceInfo.modifyUser ? serviceInfo.modifyUser : '暂无')
                     ]"
                     :showContent="serviceInfo.modifyTime || serviceInfo.modifyUser"
                     name="服务运营"
                     padding="8px 7px 15px 18px"
      ></content-title>
      <template v-if="isNonEmptyObject(serviceInfo)">
      <div class="section-list" style="padding-bottom: 10px;">
        <div class="section-item">
          <div class="text-center">
            <div class="text-blue">评估日期</div>
            <div class="text-black mt-10">{{serviceInfo.valuationDate | formatTime('yyyy-MM-dd')}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">服务运营分级</div>
            <div class="text-red mt-10">{{serviceInfo.operateLevel||'-'}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">月均台次</div>
            <div class="text-red mt-10">{{serviceInfo.monthQty||'-'}}</div>
          </div>
        </div>
        <div class="section-maintitle">【得分明细】</div>
        <div class="section-item">
          <div class="text-center">
            <div class="text-blue">服务满意度(分)</div>
            <div class="text-red mt-10">{{ Math.round(serviceInfo.satisfaction) || ''}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">一次修复率</div>
            <div class="text-red mt-10">{{serviceInfo.repairRate }}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">抱怨率</div>
            <div class="text-red mt-10">{{serviceInfo.grumbleRate }}</div>
          </div>
        </div>
        <div class="section-item" style="margin-top: 13px;">
          <div class="text-center">
            <div class="text-blue">客户保持率</div>
            <div class="text-red mt-10">{{serviceInfo.customerHoldRate | formatPercent}}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">客单价(元)</div>
            <div class="text-red mt-10">{{ Math.round(serviceInfo.customerPrice) || '' }}</div>
          </div>
          <div class="text-center">
            <div class="text-blue">奖励额度(元)</div>
            <div class="text-red mt-10">{{Math.round(serviceInfo.awardAmount) || ''}}</div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <div class="gutter"></div>
      <content-title :content="[
                      '更新日期：'+ (evaluationInfo.modifyTime ? toFormatTime(evaluationInfo.modifyTime, 'yyyy-MM-dd'): '暂无'),
                      '更新人：'+ (evaluationInfo.modifyUser || '暂无')
                     ]"
                     :showContent="true"
                     name="星级评估"
                     padding="8px 7px 10px 18px"
      ></content-title>
      <div class="field" v-if="isNonEmptyObject(evaluationInfo.detail)">
        <div class="field__item">
          <div class="field__label">评估周期</div>
          <div class="field__value">{{evaluationInfo.detail.evaluationDate}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">得分</div>
          <div class="field__value">{{evaluationInfo.detail.score||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">星级</div>
          <div class="field__value">
            <span :key="index" v-for="(level, index) in parseInt(evaluationInfo.detail.starLevel)"
                  v-if="evaluationInfo.detail.starLevel">
              <img src="../../../static/images/icon_evaluate.png" alt="" style="width: 18px;"/>
            </span>
          </div>
        </div>
        <div class="field__item">
          <div class="field__label">排名</div>
          <div class="field__value">{{evaluationInfo.detail.rankNo||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">奖励额度</div>
          <div class="field__value">{{evaluationInfo.detail.awardAmount||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">否决项</div>
          <div class="field__value">{{evaluationInfo.detail.veto||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">得分详情</div>
        </div>
        <div :key="'details'+index" v-for="(details, index) in evaluationInfo.detail.details">
          <div class="field__item field__item--black">
            <div class="field__label">{{details.name}}</div>
            <i :class="{'is-open': details.open}"
               @click="()=>{details.open = !details.open}"
               class="icon_arrow">
              <img :src="iconArrowDown" alt="">
            </i>
          </div>
          <template v-if="details.open">
            <div class="field__item field__item--black field__item--lower"
                 :key="'item'+index" v-for="(item, index) in details.list">
              <div class="field__label">{{item.scoreDetail||'-'}}</div>
              <div class="field__value">{{item.scoreDetailGrade||'-'}}</div>
            </div>
          </template>
        </div>
      </div>
    </template>
<!--
    <noData :visible="!isLoading && !hasData" style="paddingTop: 20vh"></noData>
-->
    <qw-cascade-picker
      :data="dateOptions"
      :selected-index="selectedIndex"
      @select="handleSelectDate"
      v-model="isVisibleDatePicker"
    ></qw-cascade-picker>

  </div>
</template>
<script>
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  // import assemblyDate from '@/module/channelManagement/mixins/assemblyDate'
  import assemblyQuarterOption from '@/module/channelManagement/mixins/assemblyQuarterOption'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle';
  import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
  import {getOperationEvaluationList, getSalesOperationDetail, getSerOperationDetail} from '@/module/channelManagement/api/operation'
  import dayjs from "dayjs";

  export default {
    mixins: [reloadApp, assemblyQuarterOption],
    components: {noData, contentTitle},
    data() {
      return {
        iconArrowDown,
        showQuarter: true, // 是否显示季度的选项，默认是true
        dealerId: '',
        salesInfo: {}, // 销售运营
        serviceInfo: {}, // 服务运营
        evaluationInfo: {}, // 星级评估
        detail: {},
        isLoading: false
      }
    },
    filters: {

        formatInt(value){
            const val = parseInt(value);
            return Number.isNaN(val)? '-': val;
        },

        filterEmpty(value){
           return value || value === 0? value: '-';
        },

      formatPercent(value) {
        if (typeof value === 'string' || typeof value === 'number') {
          if(value.indexOf('%') !== -1) return `${value}`
          return `${value}%`
        } else {
          return '-'
        }
      },
      formatTime(value, fmt) {
        if (value) {
          let da
          if (typeof value == 'string') {
            if (value.indexOf(".") > -1) {
              // 有些日期接口返回带有.0。
              value = value.substring(0, value.indexOf("."));
            }
            value = value.replace(/-/g, '/')
          }
          da = new Date(value)
          let o = {
            'M+': da.getMonth() + 1, //月份
            'd+': da.getDate(), //日
            'h+': da.getHours(), //小时
            'm+': da.getMinutes(), //分
            's+': da.getSeconds(), //秒
            'q+': Math.floor((da.getMonth() + 3) / 3), //季度
            S: da.getMilliseconds() //毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (da.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
          }
          return fmt
        } else {
          return value || '-'
        }
      },
    },
    computed: {
      hasData() {
        return this.isNonEmptyObject(this.salesInfo)
          || this.isNonEmptyObject(this.serviceInfo)
          || this.isNonEmptyObject(this.evaluationInfo)
      }
    },
    methods: {
      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if(!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },

      // 销售运营
      fetchSalesOperationDetail() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          quarter: this.currentQuarterValue,
        }
        return getSalesOperationDetail(params).then((data) => {
          if (data && data.detail) {
            this.salesInfo = data.detail || {}
          } else {
            this.salesInfo = {}
          }
        })
      },

      // 服务运营
      fetchSerOperationDetail() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          monthly: this.currentQuarterValue,
        }
        return getSerOperationDetail(params).then((data) => {
          if (data && data.data) {
            this.serviceInfo = data.data || {}
          } else {
            this.serviceInfo = {}
          }
        })
      },

      // 星级评估
      fetchOperationEvaluationList() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          quarter: this.currentQuarterValue,
        }
        return getOperationEvaluationList(params).then((data) => {
          if (data && data.data) {
            if (data.data.detailList && data.data.detailList.length) {
              let detailList = data.data.detailList || [];
              let result = { // 由于星级评估数据为多条，暂时以第一条数据为主，然后进行评分细项的拼合
                details: [],
                scoreTypeList: [],
                ...detailList[0]
              };
              for (let i = 0; i < detailList.length; i++) {
                let scoreType = detailList[i].scoreType;
                let item = {
                  scoreDetail: detailList[i].scoreDetail,
                  scoreDetailGrade: detailList[i].scoreDetailGrade
                };
                if (result.scoreTypeList.indexOf(scoreType) !== -1) {
                  let res = result.details.find(x=>{
                    return x.name == scoreType
                  });
                  if(res) res.list.push(item)
                } else {
                  result.scoreTypeList.push(scoreType);
                  result.details.push({
                    name: scoreType,
                    open: false,
                    list: [].concat(item)
                  });
                }
              }
              data.data.detail = result;
            }
            this.evaluationInfo = data.data
          } else {
            this.evaluationInfo = {}
          }
          console.log(this.evaluationInfo);
        })
      },

      initData() {
        let _this = this
        this.dealerId = this.$route.query.dealerId || ''
        const p1 = this.fetchSalesOperationDetail()
        const p2 = this.fetchSerOperationDetail()
        const p3 = this.fetchOperationEvaluationList()
        this.isLoading = true
        Promise.all([p1, p2, p3]).finally(() => {
          _this.isLoading = false
        })
      },
    },

      watch:{
          '$route.query'(query){
              console.log(query, 'xx')
              this.initData()
          }
      },
    created() {
      this.initData()
    },
  }
</script>
<style lang="scss">
  .operation-evaluation {
    margin-bottom: 50px;

    .assembly-date {
      .select-bar {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        justify-content: center;
        background: #ffffff;

        .select-bar__item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          width: 36%;

          .select-bar__value {
            height: 21px;
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: rgba(0, 0, 0, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .section__icon {
            display: block;
            width: 9px;
            height: 6px;
            background-image: url('~@/module/channelManagement/static/images/icon_select_arrow.png');
            background-repeat: no-repeat;
            background-size: 100%;
            margin-left: 16px;
          }

          &--year {
            .select-bar__value {
              width: 55px;
              text-align: right;
            }
          }

          &--month {
            .select-bar__value {
              width: 45px;
              text-align: right;
            }
          }
        }
      }
    }

    .gutter {
      height: 8px;
      background: rgba(245, 245, 245, 1);
    }

    .section-list {
      padding: 0 9px 0 7px;
      background-color: #fff;

      .section-item {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 8px 0;
        box-shadow: 0 0 5px rgba(0, 0, 0, .1);
        box-sizing: border-box;
      }

      .section-maintitle {
        font-weight: bold;
        font-size: 17px;
        color: rgba(0, 0, 0, 1);
        padding: 13px 0 10px 8px;
      }
    }

    .field {
      padding: 5px 15px 15px 15px;
      background: #fff;

      .field__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 34px;

        .field__label {
          flex: none;
          width: 140px;
          font-size: 15px;
          font-weight: bold;
          color: rgba(39, 129, 219, 1);
          white-space: nowrap;
          margin-right: 10px;
          padding-left: 8px;
          position: relative;
          box-sizing: border-box;

          &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: "·";
            width: 8px;
          }
        }

        .field__value {
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: rgba(51, 51, 51, 1);
          margin-left: auto;
          text-align: right;
        }

        .icon_arrow {
          width: 20px;
          display: block;
          transition: transform 0.4s ease;

          & > img {
            width: 11px;
            height: 7px;
            vertical-align: middle;
          }

          &.is-open {
            img {
              transform: rotateZ(180deg);
            }
          }
        }
      }

      .field__item--black {
        .field__label {
          font-size: 15px;
          color: rgba(51, 51, 51, 1);

          &:before {
            content: "";
          }
        }
      }

      .field__item--lower {
        padding: 0 10px;
      }
    }

    .text-center {
      text-align: center;
    }

    .text-blue {
      font-size: 16px;
      font-weight: bold;
      color: rgba(39, 129, 219, 1);
    }

    .text-blue--mini {
      font-size: 14px;
      font-weight: bold;
      color: rgba(39, 129, 219, 1);
    }

    .text-red {
      font-size: 16px;
      font-weight: bold;
      color: rgba(198, 0, 31, 1);
    }

    .text-red--mini {
      font-size: 14px;
      font-weight: bold;
      color: rgba(198, 0, 31, 1);
    }

    .text-black {
      font-size: 16px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }

    .mt-10 {
      margin-top: 10px;
    }
  }
</style>
