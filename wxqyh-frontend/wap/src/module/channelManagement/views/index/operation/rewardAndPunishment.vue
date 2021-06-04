<template>
  <div class="reward-and-punishment">

    <div class="assembly-date">
      <div class="select-bar">
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--year">
          <span class="select-bar__value">{{currentYear}}</span>
          <i class="section__icon"></i>
        </div>
        <div @click="handleClickDatePicker"
             class="select-bar__item select-bar__item--month">
          <span class="select-bar__value">{{currentMonth}}</span>
          <i class="section__icon"></i>
        </div>
      </div>
    </div>

    <template v-if="isNonEmptyObject(rewardsInfo)">
      <div class="gutter"></div>
      <content-title :content="[
                      '更新日期：'+ toFormatTime(rewardsInfo.modifyTime, 'yyyy-MM-dd'),
                      '更新人：'+ rewardsInfo.modifyUser
                     ]"
                     :showContent="rewardsInfo.modifyTime || rewardsInfo.modifyUser"
                     name="日常奖惩"
                     padding="15px 7px 0 18px"
      ></content-title>
      <div class="daily-total">
        <div>
          <span class="text-black--mini">当月累计奖惩次数：</span>
          <span class="text-red">{{rewardsInfo.monthRewardTimes||'-'}}</span>
        </div>
        <div>
          <span class="text-black--mini">累计金额：</span>
          <span class="text-red">{{rewardsInfo.monthTotalAmount||'-'}}</span>
        </div>
      </div>
      <div class="daily-total" style="padding-bottom:12px" @click="handleOpenMask()">
        <div>
          <span class="text-black--mini">当年累计奖惩次数：</span>
          <span class="text-red">{{rewardsInfo.yearTotalTimes||'-'}}</span>
        </div>
        <div>
          <span class="text-black--mini">累计金额：</span>
          <span class="text-red">{{rewardsInfo.yearTotalAmount||'-'}}</span>
        </div>
      </div>
      <!-- <div :key="'rewards'+index" class="daily-card"
           v-for="(item, index) in rewardsInfo.rewardsList">
        <div @click="handleOpenMask(item)" class="daily-card-item">
          <div :class="['card-tag','card-tag--'+isNegative(item.rewardsAmount)]"
               v-if="item.rewardsAmount && item.rewardsType">{{item.rewardsType}}
          </div>
          <div class="card-content">
            <div class="card-top">
              <div class="text-grey">{{item.executeTime||'-'}}</div>
              <div class="text-green text-ellipsis">{{item.rewardsDept||'-'}}</div>
            </div>
            <div class="text-black mt-12 text-ellipsis">{{item.checkThing||'-'}}</div>
          </div>
        </div>
      </div> -->
      <div v-for="(item, index) in rewardsInfo.rewardsList" :key="'rewards'+index">
        <div class="gutter"></div>
        <div class="reward-and-punishment-popup">
          <div class="title">
            <div :class="['card-tag','card-tag--'+isNegative(item.rewardsAmount)]"
                v-if="item.rewardsAmount && item.rewardsType">{{item.rewardsType}}
            </div>
            <div :class="'text-'+isNegative(item.rewardsAmount)+'--large'">{{item.rewardsAmount||'-'}}</div>
          </div>
          <div class="field">
            <div class="field__item">
              <div class="field__label">考核依据</div>
              <div class="field__value">{{item.checkGist||'-'}}</div>
            </div>
            <div class="field__item">
              <div class="field__label">考核事由</div>
              <div class="field__value">{{item.checkThing||'-'}}</div>
            </div>
            <div class="field__item">
              <div class="field__label">报告/通报名称</div>
              <div class="field__value">{{item.report||'-'}}</div>
            </div>
            <div class="field__item">
              <div class="field__label">执行时间</div>
              <div class="field__value">{{item.executeTime|formatTime('yyyy-MM-dd')}}</div>
            </div>
            <div class="field__item">
              <div class="field__label">执行部门</div>
              <div class="field__value">{{item.rewardsDept||'-'}}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="isNonEmptyObject(annualInfo)">
      <div class="gutter"></div>
      <content-title :content="[
                      '更新日期：'+ toFormatTime(annualInfo.modifyTime, 'yyyy-MM-dd'),
                      '更新人：'+ annualInfo.modifyUser
                     ]"
                     :showContent="annualInfo.modifyTime || annualInfo.modifyUser"
                     name="年度表彰"
                     padding="15px 7px 15px 18px"
      ></content-title>
      <div :key="'detail'+index" class="praise-card"
           v-for="(item, index) in annualInfo.detailList">
        <div class="praise-card-item">
          <img alt="" class="card-icon" src="../../../static/images/icon_praise.png"/>
          <div class="card-content">
            <div class="card-top">
              <div class="text-grey">{{item.year ? item.year+'年' : '-'}}</div>
              <div class="text-black">获奖数量：{{item.rewardTimes||'-'}}</div>
            </div>
            <div class="text-red mt-12 reward-name-list">
<!--              <qw-notice-bar-->
<!--                      :title="item.rewardNames? item.rewardNames.join('  '): ''"-->
<!--                      loop-->
<!--              ></qw-notice-bar>-->
<!--              <span :key="'name'+i" v-for="(name, i) in item.rewardNames">{{name}}</span>-->
              <marqueeBar :content="item.rewardNames? item.rewardNames.join('  '): ''"></marqueeBar>
            </div>
          </div>
        </div>
      </div>
    </template>

    <noData :visible="!isLoading && !hasData" style="paddingTop: 20vh"></noData>

    <qw-cascade-picker
      :data="dateOptions"
      :selected-index="selectedIndex"
      @select="handleSelectDate"
      v-model="isVisibleDatePicker"
    ></qw-cascade-picker>

    <div v-show="visible" class="detail-mask" @click="hideDetail">
      <div class="detail-popup">
        <div class="daily-total">
          <div>
            <span class="text-black--mini">当年累计处罚次数：</span>
            <span class="text-red">{{rewardsInfo.yearPenaltyTimes||'-'}}</span>
          </div>
          <div>
            <span class="text-black--mini">处罚金额：</span>
            <span class="text-red">{{rewardsInfo.yearPenaltyAmount||'-'}}</span>
          </div>
        </div>
        <div class="daily-total" style="padding-bottom:12px">
          <div>
            <span class="text-black--mini">当年累计奖励次数：</span>
            <span class="text-red">{{rewardsInfo.yearRewardTimes||'-'}}</span>
          </div>
          <div>
            <span class="text-black--mini">奖励金额：</span>
            <span class="text-red">{{rewardsInfo.yearRewardAmount||'-'}}</span>
          </div>
        </div>
        <div class="reward-scroll">
          <!-- <qw-scroll
            ref="scroll"
            :data="yearDetail"
            :options="options"
            @pulling-up="loadBottom"> -->
          <div v-for="(item,index1) in yearDetail" :key="'rewardDetail'+index1">
            <div class="gutter"></div>
            <div class="reward-and-punishment-popup">
              <div class="title">
                <div :class="['card-tag','card-tag--'+isNegative(item.rewardsAmount)]"
                    v-if="item.rewardsAmount && item.rewardsType">{{item.rewardsType}}
                </div>
                <div :class="'text-'+isNegative(item.rewardsAmount)+'--large'">{{item.rewardsAmount||'-'}}</div>
              </div>
              <div class="field">
                <div class="field__item">
                  <div class="field__label">考核依据</div>
                  <div class="field__value">{{item.checkGist||'-'}}</div>
                </div>
                <div class="field__item">
                  <div class="field__label">考核事由</div>
                  <div class="field__value">{{item.checkThing||'-'}}</div>
                </div>
                <div class="field__item">
                  <div class="field__label">报告/通报名称</div>
                  <div class="field__value">{{item.report||'-'}}</div>
                </div>
                <div class="field__item">
                  <div class="field__label">执行时间</div>
                  <div class="field__value">{{item.executeTime|formatTime('yyyy-MM-dd')}}</div>
                </div>
                <div class="field__item">
                  <div class="field__label">执行部门</div>
                  <div class="field__value">{{item.rewardsDept||'-'}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- </qw-scroll> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import assemblyDate from '@/module/channelManagement/mixins/assemblyDate'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle';
  import marqueeBar from '@/module/channelManagement/components/marqueeBar'

  import {getAnnualRecognitionList, getRewardsInfo, ajaxYearRewardAndPenaltySearch} from '@/module/channelManagement/api/operation'


  export default {
    mixins: [reloadApp, assemblyDate],
    components: {noData, contentTitle, marqueeBar},
    data() {
      return {
        showQuarter: false, // 是否显示季度的选项，默认是true
        dealerId: '',
        titleContent: [
          '更新日期：2010-3-31',
          '更新人：网络发展部'
        ],
        rewardsInfo: {},
        annualInfo: {},
        isLoading: false,
        detail: {},
        visible: false,
        // page: 1,
        // pageSize: 1000,
        // isNoMore: false,
        yearDetail: [],
        // // 上拉加载配置项
        // pullUpLoad: true,
        // pullUpLoadThreshold: 0,
        // pullUpLoadMoreText: "上拉加载更多",
        // pullUpLoadNoMoreText: "已没有更多",
      }
    },
    filters: {
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
        return this.isNonEmptyObject(this.rewardsInfo) || this.isNonEmptyObject(this.annualInfo)
      },
      // // 上拉加载配置项
      // pullUpLoadObj() {
      //   return this.pullUpLoad ? {
      //     threshold: parseInt(this.pullUpLoadThreshold),
      //     text: {
      //       more: this.pullUpLoadMoreText,
      //       noMore: this.pullUpLoadNoMoreText
      //     }
      //   } : false;
      // },
      // options() {
      //   return {
      //     pullUpLoad: this.pullUpLoadObj,
      //   };
      // }
    },
    methods: {
      // loadBottom() {
      //   // console.log(this.isNoMore)
      //   if (!this.isNoMore) {
      //     this.page ++
      //     this.getYearRewardDetail()  
      //   } else {
      //     this.$refs.scroll.forceUpdate();
      //   }
      // },
      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if(!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },

      // 是否为负数
      isNegative(rewardsAmount) {
        let res = parseFloat(rewardsAmount)
        if (res < 0) {
          return 'red'
        }
        return 'green'
      },

      handleOpenMask() {
        // console.log('pop')
        if (this.yearDetail && this.yearDetail.length) {
          this.visible = true
        }
      },
      hideDetail() {
        this.visible = false
      },

      getYearRewardDetail() {
        let params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          // page: this.page,
          // pageSize: this.pageSize
        }
        ajaxYearRewardAndPenaltySearch(params).then(res=>{
          // console.log(res)
          if (res) {
            if (res.rewardsInfoVO) {
              this.rewardsInfo = Object.assign({}, this.rewardsInfo, res.rewardsInfoVO)
              // console.log(this.rewardsInfo)
            }
            // if (this.page == res.maxPage) {
            //   this.isNoMore = true
            // } else {
            //   this.isNoMore = false
            // }
            if (res.rewardsInfoList) {
              this.yearDetail = this.yearDetail.concat(res.rewardsInfoList || [])
            }
          }
        })
      },

      // 日常奖惩
      fetchRewardsInfo() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue,
          monthly: this.currentMonthValue,
        }
        return getRewardsInfo(params).then((data) => {
          if (data && data.rewardsInfoVO) {
            this.rewardsInfo = Object.assign({}, {}, {
              ...data.rewardsInfoVO,
              yearTotalTimes: data.rewardsInfoVO.yearRewardTimes
            })
            // this.rewardsInfo = data.rewardsInfoVO
            if (this.rewardsInfo.yearTotalTimes && this.rewardsInfo.yearTotalTimes!="0") {
              this.yearDetail = []
              // this.page = 1
              this.getYearRewardDetail()
            } else {
              this.yearDetail = []
            }
          } else {
            this.rewardsInfo = {}
            this.yearDetail = []
          }
        })
      },

      // 年度表彰
      fetchAnnualRecognitionList() {
        const params = {
          dealerId: this.dealerId,
          year: this.currentYearValue
        }
        return getAnnualRecognitionList(params).then((data) => {
          if (data && data.data) {
            this.annualInfo = data.data
          } else {
            this.annualInfo = {}
          }
        })
      },

      initData() {
        let _this = this
        this.dealerId = this.$route.query.dealerId || ''
        const p1 = this.fetchRewardsInfo()
        const p2 = this.fetchAnnualRecognitionList()
        this.isLoading = true
        Promise.all([p1, p2]).finally(() => {
          _this.isLoading = false
        })
      },
    },
    beforeCreate() {
    },
    watch:{
      '$route.query'(query){
        this.initData()
      }
    },
    created() {
      this.initData()
    },
    beforeMount() {
    },
    mounted() {
    }
  }
</script>
<style lang="scss">
  .reward-and-punishment {
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

    .daily-total {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      box-sizing: border-box;
      background-color: #fff;
      padding: 12px 17px 0 18px;
      line-height: 22px;

      & > div:nth-child(2n+1) {
        margin-right: 10px;
        box-sizing: border-box;
      }

      span {
        vertical-align: middle;
      }
    }

    .daily-card {
      padding: 10px 10px 0 10px;

      &-item {
        display: flex;
        align-items: center;
        padding: 12px 14px 12px 13px;
        margin-bottom: 18px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 0 5px rgba(0, 0, 0, .1);
      }
    }

    .praise-card {
      padding: 10px 10px 0 10px;
      overflow: hidden;

      &-item {
        display: flex;
        align-items: center;
        padding: 8px 13px 8px 7px;
        margin-bottom: 25px;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0 0 5px rgba(0, 0, 0, .1);

        .card-icon {
          flex: none;
          width: 61px;
          height: 61px;
        }

        .card-content {
          width: calc(100% - 81px);
        }

        .reward-name-list {
          white-space: nowrap;
          overflow-x: auto;
          padding-bottom: 3px;

          span {
            padding-right: 10px;
          }
        }
      }
    }

    .detail-mask {
      width: 100%;
      height: 100%;
      position: fixed;
      background-color: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 11;
      display: flex;
      justify-content: center;
      align-items: center;

      .detail-popup {
        position: relative;
        width: 100%;
        height: 385px;
        z-index: 12;
      }
    }
    .reward-scroll {
      max-height: 300px;
      overflow: auto;
    }
    .reward-and-punishment-popup {
      // width: calc(100% - 12px);
      width: 100%;
      margin: 0 auto;
      padding: 10px 12px 15px 18px;
      background-color: #fff;
      box-sizing: border-box;
      &:last-child {
        padding-bottom: 12px;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
      }

      .field {
        padding-top: 10px;
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
            // font-weight: bold;
            color: #999;
            // color: rgba(39, 129, 219, 1);
            white-space: nowrap;
            margin-right: 10px;
            // padding-left: 8px;
            position: relative;
            box-sizing: border-box;

            // &:before {
            //   position: absolute;
            //   top: 0;
            //   left: 0;
            //   content: "·";
            //   width: 8px;
            // }
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
        }
      }
    }

    .card-tag {
      flex: none;
      width: 44px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      border-radius: 2px;
      margin-right: 10px;

      &--red {
        background-color: rgba(198, 0, 31, 1);
      }

      &--green {
        background-color: rgba(0, 181, 99, 1);
      }
    }

    .card-content {
      flex: 1;

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        & > div:first-child {
          flex: none;
          padding-right: 10px;
        }
      }
    }

    .text-black {
      font-size: 15px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
    }

    .text-black--mini {
      font-size: 14px;
      color: rgba(20, 30, 40, 1);
    }

    .text-grey {
      font-size: 15px;
      font-weight: bold;
      color: rgba(68, 68, 68, 1);
    }

    .text-red--large {
      font-size: 20px;
      color: rgba(198, 0, 31, 1);
    }
    
    .text-green--large {
      font-size: 20px;
      color: rgba(0, 181, 99, 1);
    }

    .text-red {
      font-size: 17px;
      font-weight: bold;
      color: rgba(198, 0, 31, 1);
    }

    .text-green {
      font-size: 15px;
      font-weight: bold;
      color: rgba(0, 181, 99, 1);
    }

    .mt-12 {
      margin-top: 12px;
    }

    .text-ellipsis {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    /deep/{
      .qw-notice-bar.qw-notice-bar--primary{
        color: #c6001f;
        background-color: rgba(255,255,255, 0);
        height:15px;
        font-size:15px;
        font-weight:bold;
        line-height:15px;
        color:rgba(198,0,31,1);
      }
    }
  }
</style>
