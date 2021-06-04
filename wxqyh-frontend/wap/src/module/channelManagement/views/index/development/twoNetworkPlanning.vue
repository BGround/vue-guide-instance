<template>
  <div class="network-planning">


    <div class="selectbar">

      <div class="selectbar__item location">
        <i class="location__icon"><img :src="iconLocation" alt=""></i>
        <span class="location__text"> {{cityName}}</span>
      </div>

      <div class="selectbar__item selectbar__item--province"
           @click="handleClickDatePicker">
        <span class="selectbar__value">{{year}}</span>
        <i class="section__icon"></i>
      </div>
    </div>

    <div class="card" v-if="planningList.length">
      <div class="card__title bl">
        <div class="card__title__text">在运营二网</div>
        <div class="card__title__desc scale">
          <span class="desc__date">更新日期：{{updateTime || '暂无'}}</span>
          <span class="desc__department">更新人：{{updateUser || '暂无'}}</span>
        </div>
      </div>

      <div class="card__content">

        <div class="table table--main">
          <table>
            <thead>
            <tr>
              <th>县市</th>
              <th>二网运营数量</th>
              <th>规划数量</th>
              <th>完成数量</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in planningList" :key="index">
              <td>{{item.areaName}}</td>
              <td>
                <a @click="handleClickSecondNet(item)" v-if="item.secondNetNum" href="JavaScript:void(0)">{{item.secondNetNum}}</a>
                <span v-else>{{item.secondNetNum}}</span>
              </td>
              <td>{{item.planningNum}}</td>
              <td>
                <a @click="handleClickComplete(item)" v-if="item.finishedNum" href="JavaScript:void(0)">{{item.finishedNum}}</a>
                <span v-else>{{item.finishedNum}}</span>
              </td>
            </tr>
            <tr>
              <td>合计</td>
              <td>{{secondNetTotalNum}}</td>
              <td>{{planningTotalNum}}</td>
              <td>{{finishedTotalNum}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !planningList.length"></noData>




    <qw-popup :disable-scroll="false" v-model="isVisibleSecondNetDetail" position="center">
      <div class="modal">
        <div class="modal__title">
          <span>{{area}}在运营二网</span>
          <div class="marker" :class="{noPadding: secondNetList.length< 9}">
            {{secondNetList.length}}
          </div>
        </div>
        <div class="table">
          <table>
            <colgroup align="center" width="50%"></colgroup>
            <colgroup align="center" width="25%"></colgroup>
            <colgroup align="center" width="25%"></colgroup>
            <thead>
            <tr>
              <th>二网名称</th>
              <th>入网时间</th>
              <th>归属一级</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in secondNetList" :key="index">
              <td>
                <div class="modal__cell ">{{item.shopName || '-'}}</div>
              </td>
              <td>
                <div class="modal__cell ">{{item.openTime || '-'}}</div>
              </td>
              <td>
                <div class="modal__cell">{{item.dealerShortName || '-'}}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </qw-popup>

    <qw-popup :disable-scroll="false" v-model="isVisibleCompleteDetail" position="center">
        <div class="modal">
          <div class="modal__title">
            <span>{{area}}开发完成二网</span>
            <div class="marker" :class="{noPadding: secondNetList.length< 9}">
              {{secondNetList.length}}
            </div>

          </div>

          <div class="table">
            <table>
              <colgroup align="center" width="40%"></colgroup>
              <colgroup align="center" width="30%"></colgroup>
              <colgroup align="center" width="30%"></colgroup>
              <thead>
              <tr>
                <th>二网名称</th>
                <th>入网时间</th>
                <th>归属一级</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in completeList" :key="index">
                <td>
                  <div class="modal__cell">{{item.shopName}}</div>
                </td>
                <td>
                  <div class="modal__cell">{{item.openTime}}</div>
                </td>
                <td>
                  <div class="modal__cell">{{item.dealerShortName}}</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
    </qw-popup>


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
import * as developmentApi from "@/module/channelManagement/api/development";
import CollectionForm from "@/module/form/views/CollectionForm";

export default {
  name: 'twoNetworkPlanning',
  components: {
      CollectionForm,
    noData
  },
  data() {
    const now = new Date();
    return {
      iconArrowRight,
      isVisibleDetail: false,
      isLoading: false,

        iconLocation,
        iconDevelopment,
        iconBuilding,
        iconOperation,

        planningList: [],
        completeList: [],
        secondNetList: [],
        isVisibleCompleteDetail: false,
        isVisibleSecondNetDetail: false,

        current: now,
        year: now.getFullYear(),
        isVisibleDatePicker: false,
        cityName: '未知',
        area: '',
        dealerId: '',
        updateTime: '',
        updateUser: '',
        secondNetTotalNum: 0,
        planningTotalNum: 0,
        finishedTotalNum: 0,

    }
  },
  computed: {
    hasData() {
      return this.isNonEmptyObject(this.aNet) || !!this.planDevs.length || !!this.bnetList.length
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    handleClickDetail(item) {
      this.isVisibleDetail = true
      this.detail = item
    },

    getCityInfoBySecondPlanning(){
        const params = {
            dealerId: this.dealerId,
            year: this.year,
        }
        this.isLoading = true;
        developmentApi.getCityInfoBySecondPlanning(params).then((data)=>{
          this.planningList = data && data.secondPlanningVOList ? data.secondPlanningVOList : [];
          this.updateTime = data && data.updateTime ? data.updateTime : '';
          this.updateUser = data && data.updateUser ? data.updateUser : '';
          this.secondNetTotalNum = data && data.secondNetTotalNum ? data.secondNetTotalNum : 0;
          this.planningTotalNum = data && data.planningTotalNum ? data.planningTotalNum : 0;
          this.finishedTotalNum = data && data.finishedTotalNum ? data.finishedTotalNum : 0;

        }).finally(()=>{
            this.isLoading = false;
        })
    },

      handleClickSecondNet(item){
          this.area = item.areaName;
          this.secondNetList = item.secondNetList || [];
          this.isVisibleSecondNetDetail = true;
      },

      handleClickComplete(item){
         this.area = item.areaName;
          this.completeList = item.finishedList || [];
          this.isVisibleCompleteDetail = true
      },

      handleClickDatePicker(){
          this.isVisibleDatePicker = true;
      },

      handleSelectDate(_,[year]){
          this.year = year;
          this.getCityInfoBySecondPlanning();
      },

      init(){
          const {dealerId, city} = this.$route.query;
          this.cityName = city;
          this.dealerId = dealerId;
          this.getCityInfoBySecondPlanning();
      },
  },
    watch:{
        '$route.query': function(){
            this.init();
        }
    },

    created() {

    this.init();
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
    .card__title{
      height: 24px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 12px 15px;
      .card__title__text{
        height:24px;
        font-size:17px;
        font-weight:600;
        line-height:24px;
        color:rgba(20,30,40,1);
        position: relative;
        text-indent: 10px;
        white-space: nowrap;
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
        height:12px;
        font-size:12px;
        font-weight:300;
        line-height:12px;
        color:rgba(20,30,40,1);
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
    padding: 0 7px 18px;
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
  .modal{
    background: #ffffff;
    width: 362px;
    padding: 23px 14px;
    box-sizing: border-box;
    min-height: 260px;
    max-height: 350px;
    overflow-y: auto;
    .modal__title{
      height:28px;
      font-size:20px;
      font-weight:400;
      line-height:24px;
      color:rgba(51,51,51,1);
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .marker {
      height: 22px;
      background: rgba(198, 0, 31, 1);
      border-radius: 11px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      min-width: 22px;
      text-align: center;
      padding: 0 3px;
      color: rgba(255, 255, 255, 1);
      margin-left: 5px;

      &.noPadding {
        padding: 0;
      }
    }
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
          line-height: 40px;
          font-size: 14px;
          color: #333333;
          a{
            text-decoration: underline;
            color: #2781DB;
          }
          &:first-child {
            padding-left: 10px;
          }
          &:last-child {
            padding-right: 10px;
          }
        }
      }
    }

    .table--main{
      tbody{
        tr{
          &:last-child{
            td{
              font-size:14px;
              font-weight:bold;
              color:rgba(0,0,0,1);
            }
          }
        }
      }
    }
  }

  .modal__cell{
    line-height: 20px;
    padding:10px 0;
  }
}
</style>
