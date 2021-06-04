<template>
  <div class="network-planning">

    <div class="selectbar">

      <div class="selectbar__item location">
        <i class="location__icon"><img :src="iconLocation" alt=""></i>
        <span class="location__text">{{cityName || '暂无'}}</span>
      </div>

      <div class="selectbar__item selectbar__item--province"
           @click="handleClickDatePicker">
        <span class="selectbar__value">{{year}}</span>
        <i class="section__icon"></i>
      </div>
    </div>

    <template v-if="isNonEmptyObject(info)">

      <div class="card" >

        <div class="card__title bl">
            <div class="card__title__text">
              <span>奇瑞一网规划</span>
            </div>

            <div class="card__title__desc">
              <span class="desc__date">更新日期：{{info.updateTime || '暂无'}}</span>
              <span class="desc__department">更新人：{{info.updateUser || '暂无'}}</span>
            </div>
        </div>

        <div class="grids">
          <div class="grids__item">
            <div class="grids__item__label">规划数量</div>
            <div class="grids__item__value">{{info.planNumber}}</div>
            <img :src="iconDevelopment" alt="">
          </div>

          <div class="grids__item">
            <div class="grids__item__label">在运营店</div>
            <div class="grids__item__value">{{info.nowOperatingShop}}</div>
            <img :src="iconOperation" alt="">
          </div>

          <div class="grids__item">
            <div class="grids__item__label">在建设店</div>
            <div class="grids__item__value">{{info.nowBuildShop}}</div>
            <img :src="iconBuilding" alt="">
          </div>
        </div>

        <div class="card__title bl">
          <div class="card__title__text">一网开发进展</div>
          <div class="card__title__desc">
            <span class="desc__date">更新日期：{{info.updateTime}}</span>
            <span class="desc__department">更新人：{{info.updateUser}}</span>
          </div>
        </div>

        <div class="progress">
          <qw-progress
                  type="line"
                  :percentage="getPercentage"
                  :width="360"
                  linecap="butt"
                  :stroke-width="24"
                  color="#5294FF"
                  border-color="#C6001F"
                  :transition="false"
                  :active="false"
                  :show-text="false">
          </qw-progress>
          <span class="message">规划类型：{{info.planType||'暂无'}}</span>
          <div class="legend">
            <div class="legend__item">
              <i class="legend__item__color"></i>
              <span class="legend__item__text">完成数量<span>{{info.completedNum}}</span></span>
            </div>
            <div class="legend__item">
              <i class="legend__item__color red"></i>
              <span class="legend__item__text">剩余计划<span>{{info.remainingPlans}}</span></span>
            </div>
          </div>

        </div>

      </div>
      <div class="gutter"></div>

    </template>


    <div class="card" v-if="planDevList.length > 0">
      <div class="marker marker2" :class="{noPadding: count< 9}">
        <span>{{count}}</span>
      </div>
      <div class="card__title bl">
        <div class="card__title__text">一网开发明细</div>
        <div class="card__title__desc scale">
          <span class="desc__date">更新日期：{{info.updateTime || '暂无'}}</span>
          <span class="desc__department">更新人：{{info.updateUser || '暂无'}}</span>
        </div>
      </div>

      <div class="card__content">

        <div class="table">
          <table>

            <colgroup align="center"
                      width="30%"></colgroup>
            <colgroup align="center"
                      width="20%"></colgroup>
            <colgroup align="center"
                      width="20%"></colgroup>
            <colgroup align="center"
                      width="20%"></colgroup>
            <thead>
            <tr>
              <th>申请经销商</th>
              <th>入网时间</th>
              <th>入驻商圈</th>
              <th>开通时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in planDevList" :key="index">
              <td>
                <div class="cell">{{item.applyDealerName}}</div>
              </td>
              <td>
                <div class="cell date">{{item.netReportTime | formatDate}}</div>
              </td>
              <td>
                <div class="cell">{{item.businessName}}</div>
              </td>
              <td>
                <div class="cell date">{{item.openTime | formatDate}}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !isNonEmptyObject(info) && !planDevList.length"></noData>

    <qw-date-picker
            v-model="isVisibleDatePicker"
            :column-count="1"
            :current="current"
            @select="handleSelectDate"
    >
    </qw-date-picker>

  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import noData from '@/module/channelManagement/components/noData';
import iconLocation from '@/module/channelManagement/static/images/icon_location.png'
import iconDevelopment from '@/module/channelManagement/static/images/icon_development.png'
import iconBuilding from '@/module/channelManagement/static/images/icon__building.png'
import iconOperation from '@/module/channelManagement/static/images/icon_op.png'
import  * as developmentApi from '@/module/channelManagement/api/development/index'

export default {
  name: 'DevelopmentInfor',
  components: {
    noData
  },
  filters:{
        formatDate(dateStr){
          if(dateStr){
              const year =  dateStr.substr(0,4)
              const month =  dateStr.substr(5,2)
              const day =  dateStr.substr(8,2)
              return [year, month, day].join('-');
          }
          return '-';
        }
    },
  data() {
      const now = new Date();
    return {
      iconArrowRight,
      isVisibleDetail: false,
      isLoading: false,
      aNet: {

      },
      planDevs: [],
      bnetList: [],
      detail: {},

        iconLocation,
        iconDevelopment,
        iconBuilding,
        iconOperation,

        info:{
            // planNumber: 0,//	规划数量
            // nowOperatingShop: 0,//	运营店
            // nowBuildShop: 0,//	在建店
            // planDevNumber: 0,//	开发计划数量
            // completedNum: 0,//	完成数量
            // remainingPlans: 0,//	剩余数量
            // planDevType: '',//	计划分类
        },

        planDevList:[],
        current: now,
        year: now.getFullYear(),
        isVisibleDatePicker: false,
        cityName: '',
    }
  },
  computed: {
    hasData() {
      return this.isNonEmptyObject(this.aNet) || !!this.planDevs.length || !!this.bnetList.length
    },

      getPercentage(){
          const completedNum = parseInt(this.info.completedNum) || 0;
          const remainingPlans = parseInt(this.info.remainingPlans) || 0;
          const total = completedNum + remainingPlans;
          if(total){
              return completedNum / total *100;
          }
          return 0
      }

  },
  methods: {

      isUndefined(val){
          return  val === void(0);
      },

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    handleClickDetail(item) {
      this.isVisibleDetail = true
      this.detail = item
    },

    handleClickANetDetail(item){
      this.$router.push({name: 'networkPlanningDetail', query:this.$route.query, params: item});
    },

      getCityInfoByNetPlannet(){
          this.isLoading = true;
          const params = {
              dealerId: this.dealerId,
              year: this.year,
          }
          developmentApi.getCityInfoByNetPlannet(params).then((data)=>{
              // count	int	开发信息中对应城市的数据条数
              this.info =  data && data.tbEntQrPlanAnetVo? data.tbEntQrPlanAnetVo: {};
              this.count = data && data.count ? data.count: 0;
              this.planDevList = data && data.planDevVoList ? data.planDevVoList : [];
          }).finally(()=>{
              this.isLoading = false;
          })
      },

      handleClickDatePicker(){
          this.isVisibleDatePicker = true;
      },

      handleSelectDate(_,[year]){
          this.year = year;
          this.getCityInfoByNetPlannet();
      },

      init(){
          const {dealerId, city} = this.$route.query;
          this.cityName = city;
          this.dealerId = dealerId
          this.getCityInfoByNetPlannet()
      }
  },

    watch:{
        '$route.query'(){
            this.init();
        }
    },
  created() {
    this.init();

    // const year = new Date().getFullYear()
    // const aNetPromise = searchPlanNetAnetInfoBykey({ dealerId, year }).then(data => {
    //   if (data) {
    //     this.aNet = data.tbEntQrPlanAnetVo || {}
    //     this.planDevs = data.tbEntQrPlanDevVos || []
    //   }
    // })
    // //
    // const bNetPromise = searchPlanNetBnetInfoBykey({ dealerId, year }).then(data => {
    //   if (data) {
    //     this.bnetList = data.tbEntQrPlanBnetVos || []
    //   }
    // })
    //
    // this.isLoading = true;
    // Promise.all([aNetPromise, bNetPromise]).finally(()=>{
    //   this.isLoading = false
    // })
  }
}
</script>

<style lang="scss" scoped>
.network-planning {
  padding-bottom: 50px;

  .selectbar {
    background: #ffffff;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-between;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      background: #dbdbdb;
      left: 0;
      right: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }
  }
  .location__icon{
    width: 15px;
    height: 15px;
    margin-right: 3px;
    &>img{
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
  .location__text{
    height: 21px;
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
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
  .selectbar__value {
    height: 21px;
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 70px;
    text-align: center;
  }

  .selectbar__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 0;
    position: relative;
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .card{
    background: #ffffff;
    position: relative;
    .card__title{
      height: 24px;
      /*display: flex;*/
      justify-content: space-between;
      align-items: baseline;
      padding: 12px 15px;
      .card__title__text{
        height:24px;
        font-size:17px;
        font-weight:600;
        line-height:24px;
        color:rgba(20,30,40,1);
        white-space: nowrap;
        position: relative;
        text-indent: 10px;
        &:before{
          position: absolute;
          content: '';
          left: 0;
          top: 50%;
          height: 17px;
          width: 2px;
          border-radius: 1px;
          background: #C6001F;
          transform: translate(0, -50%);
        }
      }
      .card__title__desc{
        text-align: right;
        height:12px;
        font-size:12px;
        font-weight:300;
        line-height:12px;
        color:rgba(20,30,40,1);
        white-space: nowrap;
        transform: scale(0.85);
        transform-origin: bottom right;
        &>span:first-child{
          margin-right: 10px;
        }
        &.zoom{
          transform-origin: bottom right;
          transform: scale(0.6);
        }
      }
    }
  }

  .grids{
    display: flex;
    justify-content: space-between;
    padding: 12px 7px;
    .grids__item{
      position: relative;
      width:114px;
      height:66px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px rgba(0,0,0,0.16);
      border-radius:4px;
      & >img{
        height: 25px;
        position: absolute;
        right: 3px;
        bottom: 5px;
      }
      .grids__item__label{
        height:13px;
        font-size:13px;
        font-weight:bold;
        line-height:13px;
        color:rgba(0,0,0,1);
        margin-left: 12px;
        margin-top: 13px;
      }
      .grids__item__value{
        width:11px;
        height:18px;
        font-size:18px;
        font-weight:bold;
        line-height:24px;
        color:rgba(198,0,31,1);
        margin-left: 12px;
        margin-top: 12px;
      }
    }
  }

  .progress{
    margin-top: 8px;
    padding: 0 7px 18px;
    position: relative;
    .message{
      height:12px;
      font-size:12px;
      font-weight:bold;
      line-height:24px;
      color:rgba(255,255,255,1);
      text-shadow:0px 2px 3px rgba(0,0,0,0.16);
      position: absolute;
      width: 100%;
      text-align: center;
      z-index: 10;
      left: 0;
      top: 0;
    }
    .legend{
      display: flex;
      padding: 12px 50px 0;
      justify-content: space-around;
      .legend__item{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .legend__item__color{
        width:11px;
        height:11px;
        display: block;
        background:rgba(82,148,255,1);
        margin-right: 7px;
        &.red{
          background:#C6001F;
        }
      }
      .legend__item__text{
        height:14px;
        font-size:14px;
        font-weight:400;
        line-height:14px;
        color:rgba(0,0,0,1);
        &>span{
          margin-left: 14px;
        }
      }
    }
  }


  .table__name{
    display: block;
    max-width: 160px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .modal {
    width: 355px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 15px 24px;
    box-sizing: border-box;
  }

  .table__cell {
    display: block;
    position: relative;
  }
  .table__cell > span {
    padding: 0 8px;
  }
  .section__icon {
    position: absolute;
    right: 0;
    top: 50%;
    width: 7px;
    height: 11px;
    display: inline-block;

    & > img {
      width: 100%;
      vertical-align: top;
    }
  }

  .table {
    background: #ffffff;
    margin-top: 15px;
    table {
      border-collapse: collapse;
      width: 100%;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        height: 1px;
        background: #dbdbdb;
        left: 0;
        right: 0;
        bottom: 0;
        transform: scaleY(0.5);
      }
    }
    thead {
      height: 40px;
      background: #2781DB;
      padding: 0 10px;
      th {
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        color: #ffffff;
        white-space: normal;
        &:first-child {
          padding-left: 10px;
        }
        &:last-child {
          padding-right: 10px;
        }
      }
    }
    tbody {
      width: 100%;
      tr {
        padding: 0 10px;
        width: 100%;
        &:nth-child(2n + 1) {
          background: rgba(247, 247, 247, 1);
        }
        &:nth-child(2n) {
          background: #ffffff;
        }
        td {
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #333333;
          &:first-child {
            padding-left: 10px;
          }
          &:last-child {
            padding-right: 10px;
          }
        }
      }
    }
  }

  .marker{
    position: absolute;
    left: 100px;
    top: 14px;
    height:22px;
    background:rgba(198,0,31,1);
    border-radius: 11px;
    font-size:14px;
    font-weight:400;
    line-height:22px;
    min-width: 22px;
    padding: 0 3px;
    color:rgba(255,255,255,1);
    margin-left: 5px;
    text-align: center;
    transform: translate(100%,0);
    display: inline-block;
    &.marker2{
      left: 108px;
    }
    &.noPadding{
      padding: 0;
    }
  }

  .cell{
    line-height: 18px;
    padding: 11px 0;
    &.date{
      white-space: nowrap;
    }
  }

  /deep/{
    .qw-progress--line{
      width: 100%;
    }
    .qw-progress__outer{
      width: 100% !important;
    }
  }

}
</style>
