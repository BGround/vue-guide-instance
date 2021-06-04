<template>
  <transition name="slide">
    <div class="confirm-to-use">
      <div class="info-wrap">
        <div class="title">开始用车确认</div>
        <p class="info">
          <span class="p-desc">实际开始时间</span>
          <span class="p-time">{{currDate}}</span>
        </p>
        <div class="address">
          <p class="addr-info" :class="getLocationStatus==='1'?'black-font':''">{{getTips}}</p>
          <div class="addr-i addr-icon-aim"  @click="getGeoPos(true)"></div>
        </div>
      </div>
      <button-group class="absolute_active">
        <qwui-button type="default" text="取消" @buttonClick="cancel"></qwui-button>
        <qwui-button type="primary" text="确认" @buttonClick="confirm"></qwui-button>
      </button-group>
    </div>
  </transition>
</template>

<script>
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'

export default {
  components: {
    qwuiButton,
    buttonGroup
  },
  data () {
    return {
      locationStatus:{
        '-2':'无法获取到地址',
        '-1':'未获取到地址，点击重新获取',
        '0': '正在获取当前位置...',
        '1': ''
      },
      getLocationStatus:'',
      currDate: '',
      locationData:'',
    };
  },
  computed:{
    getTips(){
      return this.locationStatus[this.getLocationStatus]
    }
  },
  mounted(){
    var _this = this
    this.currDate = _.getCurrentTime()
    this.getLocationStatus = '0'
    //初始化locationData
    this.locationData = {
      realTakeTime: _.getCurrentTime(),
      realBeginLocation: '',
      realBeginLongitude: '',
      realBeginLatitude: ''
    }
    this.getGeoPos()
  },
  methods: {
    getGeoPos(type) {
      var _this = this
      this.getLocationStatus = '0'
      if(_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()){
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度
              let position = new qq.maps.LatLng(latitude,longitude)
              qq.maps.convertor.translate( position,1 ,function(result){
                var latLng=result[0];
                var geocoder = new qq.maps.Geocoder({
                  complete: (result) =>{
                    _this.getLocationStatus = '1'
                    let addressAll = result.detail.addressComponents
                    _this.locationStatus['1'] = addressAll.city + addressAll.district + addressAll.town + addressAll.street
                    _this.locationData = {
                      realTakeTime: _.getCurrentTime(),
                      realBeginLocation: _this.locationStatus['1'],
                      realBeginLatitude: result.detail.location.lat,
                      realBeginLongitude: result.detail.location.lng
                    }
                    _this.$store.commit('updateLocation', _this.locationData)
                  }
                })
                geocoder.getAddress(latLng)
              })
          },
          fail: function (res){
            _this.getLocationStatus = '-1'
            _this.$store.commit('updateLocation', _this.locationData)
          }
        })
      }else{
        _this.getLocationStatus = '-2'
        if(type) _.alert('提示','您的终端暂不支持定位')
      }
    },
    cancel() {
      this.$emit('closeStart');
    },
    confirm() {
      this.$emit('startUse',  this.locationData );
    }
  }
}

</script>
<style lang='scss' scoped>
.confirm-to-use {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  @media screen and (min-width: 1024px) {
    width: 740px;
  }
  position: fixed;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  background: #fff;
  z-index: 10;
  .info-wrap {
    padding-left: 14px;
    .title {
      height:54px;
      font-size:16px;
      color:rgba(27,35,58,1);
      line-height:54px;
      border-bottom: 1px solid #f4f6f8;
    }
    .info {
      height: 46px;
      line-height: 46px;
      padding-right: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .p-desc {
        font-size:15px;
        color:rgba(122,124,128,1);
      }
      .p-time {
        font-size:15px;
        color:rgba(10,23,53,1);
      }
    }
    .address {
      display: flex;
      height: 46px;
      align-items: center;
      .addr-info {
        flex: 1;
        font-size:15px;
        color:rgba(178,185,200,1);
        line-height:21px;
        &:before  {
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 8px;
          content: '';
          background: url(~assets/images/car/icon_begin.png) no-repeat;
          background-size: 10px 10px;
        }
      }
      .black-font {
        color: #0A1735
      }
      .addr-i {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        background-position: center;
        cursor: pointer;
      }
      .addr-icon-aim{
        background: url(~assets/images/car/icon_a-newtask-list_place@2x.png) no-repeat;
        background-size: 24px 24px;
      }
    }
  }
}
.confirm-to-use .qwui-btn_box.absolute_active {
  position: absolute;
  background: #fff;
}
</style>
