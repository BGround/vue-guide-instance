<template>
  <div class="basic-list">
    <div class="car-time-area" v-if="canEditTime && showTime">
      <p class="time-title">用车时间</p>
      <p class="edit-text" @click="openEditTime">
        <span class="modify-icon"></span>
        <span class="text">修改时间</span>
      </p>
    </div>
    <div class="car-item take-time" v-if="showTime">
      <div id="take-time" class="flex">
        <p class="time">{{calDateTime(basicFields.takeTime, 1)}}</p>
        <p class="date">{{calDateTime(basicFields.takeTime, 0)}}</p>
      </div>
      <div class="flex icon-wrapper">
        <i class="take-time-icon"></i>
      </div>
      <div id="back-time" class="flex">
        <p class="time">{{calDateTime(basicFields.backTime, 1)}}</p>
        <p class="date">{{calDateTime(basicFields.backTime, 0)}}</p>
      </div>
    </div>
    <div class="car-item start-place" v-if="basicList && basicList.length>0 && basicList[4] && basicList[4].status && basicList[4].status != '0'">
      <i class="beginLocation"></i>
      <div class="flex ellipsis" ref="begin">{{ isReally[0] || '未获取到地址' }}</div>
      <i ref="beginBtn" v-if="showBtn && basicFields.beginLocation" class="map-btn" @click="getAddress(isReally[0], 0)" ></i>
    </div>
    <div class="car-item end-place" v-if="basicList && basicList.length>0 && basicList[5] && basicList[5].status && basicList[5].status != '0'">
      <i class="destinationLocation"></i>
      <div class="flex ellipsis" ref="destination">{{ isReally[1] || tips || '未获取到地址' }}</div>
      <i ref="destinationBtn" v-if="showBtn && basicFields.destinationLocation" class="map-btn" @click="getAddress(isReally[1], 1)" ></i>
    </div>
    <div class="car-item reason"  v-if="basicList && basicList.length>0 && basicList[3] && basicList[3].status && basicList[3].status != '0'">
      <div class="title">{{basicList && basicList[3].optionName}}</div>
      <div class="text">{{basicFields.subject ? basicFields.subject : '未填写'}}</div>
    </div>
    <div style="borderTop: 8px solid #f7f7f7" v-if="basicList && basicList.length>0 && basicList[6] && basicList[6].status && basicList[6].status != '0' || basicList && basicList.length>0 && basicList[7] && basicList[7].status && basicList[7].status != '0'">
      <div class="car-item manager-group" v-if="basicList && basicList.length>0 && basicList[6] && basicList[6].status && basicList[6].status != '0'">
        <div class="title ellipsis">{{basicList && basicList[6].optionName}}</div>
        <div class="text ellipsis flex">{{basicFields.managerGroupName ? basicFields.managerGroupName : '未填写'}}</div>
      </div>
      <div class="passenger" v-if="basicList && basicList.length>0 && basicList[7] && basicList[7].status && basicList[7].status != '0'">
        <passenger-field :field="basicList[7]" :readonly="true" :showModifyBtn="showModifyBtn" @showBtn="showPassengerBtn" @openContacts="openContacts"></passenger-field>
      </div>
    </div>
  </div>
</template>

<script>
  import passengerField from '../fields/passengerField'
  export default {
    name: 'basicList',
    props: {
      detail: {
        type: Object,
        defalut() {
          return {}
        }
      },
      tips: {
        type: String,
        defalt: ''
      },
      basicFields: {
        type: Object
      },
      basicList: {
        type: Array
      },
      showBtn: {
        type: Boolean,
        defalut: false
      },
      canEditTime: {
        type: Boolean,
        default: false
      },
      showTime:{
        type: Boolean,
        default: true
      },
      isReal:{
        type: Boolean,
        default: false
      },
      isCarManager: {
        type: Boolean,
        default: false
      }
    },
    components: {
      passengerField
    },
    computed: {
      isReally(){
        if(this.isReal){
          return [this.basicFields.realBeginLocation, this.basicFields.realDestinationLocation ]
        }else {return [this.basicFields.beginLocation, this.basicFields.destinationLocation ]}
      },
      showModifyBtn() {
        return this.detail && this.detail.status == 2 && this.detail.isover == 1 && this.isCarManager
      }
    },
    methods: {
      getAddress(address, target){
        this.$store.commit('updateClickTarget', target)
        //开始结束用车时获取定位信息
        if(target==1 && this.detail && this.detail.status == 3){
          this.$emit('getGeoPos')
        }else{//查看地图
          this.$store.commit('updateMapStatus','showMap')
          this.$emit('showMap',address)
        }
      },
      calDateTime(datetime, type) {  //计算时间和日期
        if(!datetime) return
        let date = datetime.split(' ')[0]
        let time = datetime.split(' ')[1]
        if(type == 0) {
          return date
        } else return time
      },
      openEditTime() {
        this.$emit('openModifyTime')
      },
      showPassengerBtn() {
        this.$emit('showPassengerBtn')
      },
      openContacts() {
        this.$emit('openContacts')
      }
    },
    mounted(){
      if(this.detail && this.detail.status == 4){
        this.$store.commit('updateMapStatus','showMap')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .car-time-area {
    display: flex;
    justify-content: space-between;
    height: 46px;
    padding: 0 15px;
    .time-title {
      line-height: 46px;
      font-size:15px;
      color:rgba(122,124,128,1);
    }
    .edit-text {
      line-height: 46px;
      font-size:12px;
      color:rgba(70,125,185,1);
      cursor: pointer;
      .modify-icon {
        display: inline-block;
        vertical-align: text-bottom;
        width: 12px;
        height: 16px;
        background:url(~assets/images/car/modify-icon.png) no-repeat center;
        background-size: 100%;
      }
      .text {
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        color: #467DB9;
        margin-left: 4px;
      }
    }
  }
  .map-btn {
    width: 24px;
    height: 24px;
    background: url(~assets/images/car/icon_a-newtask-list_place.png) no-repeat;
    background-size: 24px auto;
    cursor: pointer;
  }
  .basic-list .car-item {
    position: relative;
    background: #fff;
    font-size: 16px;
    color: #333;
    padding: 13px 15px;
    line-height: 22px;
    min-height: 19px;
    display: flex;
  }
  .take-time {
    padding: 22px 0;
  }
  .take-time .time {
    font-size: 20px;
    height: 28px;
    line-height: 28px;
    color: #1B233A;
    text-align: center;
  }
  .take-time .date {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: #B2B9C8;
    text-align: center;
  }
  .take-time .icon-wrapper {
    position: relative;
    text-align: center;
    transform: translateX(-36px);
  }
  .take-time-icon {
    position: absolute;
    top: 20px;
    width: 72px;
    height: 8px;
    background: url(~assets/images/car/group.png) no-repeat;
    background-size: 72px auto;
  }
  .destinationLocation {
    position: relative;
    width: 10px;
    height: 10px;
    background: url(~assets/images/car/icon_end.png) no-repeat;
    background-size: 10px auto;
    margin-top: 6px;
    margin-right: 7px;
  }
  .beginLocation {
    position: relative;
    width: 10px;
    height: 10px;
    background: url(~assets/images/car/icon_begin.png) no-repeat;
    background-size: 10px auto;
    margin-top: 6px;
    margin-right: 7px;
  }
  .beginLocation::before,.destinationLocation::before{
    content: '';
    position: absolute;
    width: 0;
    height: 19px;
    border-left: 1px dotted #E3E4E8;
    left: 4.5px;
  }
  .beginLocation::before{
    top: 10px;
  }
  .destinationLocation::before{
    top: -20px;
  }
  .reason div, .manager-group div{
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
    margin-right: 20px;
  }
  .basic-list .reason {
    display: block;
    text-align: left;
  }
  .basic-list .reason .text {
    color: #0A1735;
    text-align: left;
    margin-right: 0;
    margin-top: 12px;
  }
  .manager-group .text {
    color: #0A1735;
    text-align: right;
    margin-right: 0;
  }
  .basic-list .passenger {
    padding: 0 15px;
  }
</style>
