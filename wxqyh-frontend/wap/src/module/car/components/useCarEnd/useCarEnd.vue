<template>
  <transition name="slide">
    <div class="use-car-end">
      <div class="error-time-tip" v-if="mileError">
        <span>结束里程应大于开始里程</span>
      </div>
      <div class="verify-end">
        <div class="end-title">
          <span>结束用车确认</span>
        </div>
        <div class="use-car-msg" v-if="isVip && showPosAndTime">
          <p class="use-time start-time">
            <span class="time-title">实际开始时间</span>
            <span class="time-msg">{{detail && detail.realTakeTime || '无'}}</span>
          </p>
          <p class="use-time end-time">
            <span class="time-title">实际结束时间</span>
            <span class="time-msg">{{realBackTime+':00'}}</span>
          </p>
        </div>
        <div class="basic-fields" v-if="isVip && showPosAndTime">
          <basic-list :isReal="true" @getGeoPos="getGeoPos" :basicFields="detail" :basicList="basicList" :showBtn="true" :showTime="false" :detail="detail" :tips="getLocationStatus!='-2'?locationData:'未获取到地址'" @showMap="showMap"></basic-list>
        </div>
      </div>
      <div class="edit-field" v-if="isVip && showPosAndTime">
        <div class="miles">
          <span class="title">直线里程</span>
          <span class="info">{{strightMile}}</span>
        </div>
      </div>
      <div class="modify-fields">
        <custom-fields
          :list="carEndList"
          @change="fieldChange">
        </custom-fields>
      </div>
      <button-group class="absolute_active">
        <qwui-button type="default" text="返回" @buttonClick="close"></qwui-button>
        <qwui-button type="primary" text="确认" @buttonClick="confirm"></qwui-button>
      </button-group>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex'
import { validation } from '../../js/validate'
import { updataCarAskMileAndFeel, getCarConfig, finishCarAsk, carDetail} from '../../api/getData.js'
import { mixinCarEndFields } from '../../js/mixin'
import basicList from '../customFields/basicList'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
import customFields from '../customFields/customFields'
export default {
  name: 'useCarEnd',
  mixins:[mixinCarEndFields],
  components:{
    basicList,
    qwuiButton,
    buttonGroup,
    customFields
  },
  props: {
    isVip: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      strightMile: '无法计算',
      realBackTime: '',
      basicList: [],
      showPosAndTime: false, //金卡vip才能使用
      carEndValue: {},
      isScroll: false,
      locationParams: '',
      locationStatus:{
        '-2':'暂不支持电脑端打开，请在手机上打开',
        '-1':'未获取到地址，点击重新获取',
        '0': '正在获取当前位置...',
        '1': ''
      },
      getLocationStatus:'',
      reg: /\d{0,4}[.]{0,1}?\d{0,1}?/
    }
  },
  mounted() {
    let _this = this
    carDetail({carId: this.carId}, res => {
      this.carEndList[0].value = res.car.mile
    })
    this.getGeoPos(true)
    // 里程数和费用控制
    if(this.config) {
      this.carEndList[0].status = this.carEndList[1].status = this.config.showMile
      this.carEndList[0].isMust = this.carEndList[1].isMust = this.config.needMile
      this.carEndList[2].status = this.config.showFee
      this.carEndList[2].isMust = this.config.needFee
      this.carEndList[0].maxLength = 10
      this.carEndList[1].maxLength = 10
      this.carEndList[2].maxLength = 10
      this.showPosAndTime = this.config.recordPosition == 1 ? true : false
    }
    this.realBackTime = this.detail.realBackTime || _.getCurrentTime()
    this.basicList = [,,,{'status': 0},{'status': 1},{'status': 1},{'status': 0},{'status': 0}]
    $(window).resize(function() {
      _this.fixedBtn()
    });
    $('.use-car-end').scroll(function() {
      _this.fixedBtn()
    });
  },
  computed:{
    ...mapState({
      clickTarget: state => state.mapStatus.clickTarget,
      mapStatus: state => state.mapStatus.mapStatus,
      location: state => state.mapStatus.location,
      carId: state => state.detail.carDetail.carId
    }),
    askId() {
      return this.detail && this.detail.askId
    },
    locationData(){
      if(this.getLocationStatus!==''){
        return this.locationStatus[this.getLocationStatus]
      }else return '未获取到地址'
    }
  },
  methods:{
    //根据经纬度计算直线距离
    getRad(d){
      var PI = Math.PI;
      return d*PI/180.0;
    },
    getDistance(lat1,lng1,lat2,lng2){
      if(lat1&&lng1&&lat2&&lng2){
        var f = this.getRad((lat1 + lat2)/2);
        var g = this.getRad((lat1 - lat2)/2);
        var l = this.getRad((lng1 - lng2)/2);
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        var s,c,w,r,d,h1,h2;
        var a = 6378137.0;
        var fl = 1/298.257;
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        s = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        s = s/1000;
        s = s.toFixed(1);//指定小数点后的位数。
        return s;
      }else return NaN
    },
    //结束里程格式  #####.#
    getGeoPos(show) {
      var _this = this
      this.getLocationStatus = '0'
      if(_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()){
        let userAuthorization = localStorage.userAuthorization
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              var speed = res.speed; // 速度，以米/每秒计
              var accuracy = res.accuracy; // 位置精度
              let position = new qq.maps.LatLng(latitude,longitude)
              qq.maps.convertor.translate( position, 1 ,function(result){
                var latLng=result[0];
                var geocoder = new qq.maps.Geocoder({
                  complete: (result) =>{
                    _this.getLocationStatus = '1'
                    let addressAll = result.detail.addressComponents
                    _this.locationStatus['1'] = addressAll.city + addressAll.district + addressAll.town + addressAll.street
                    _this.locationParams = {
                      realBackTime: _.getCurrentTime(),
                      realDestinationLocation: _this.locationStatus['1'],
                      realDestinationLatitude: result.detail.location.lat,
                      realDestinationLongitude: result.detail.location.lng
                    }
                    _this.strightMile = _this.getDistance( _this.detail.realBeginLatitude*1, _this.detail.realBeginLongitude*1, result.detail.location.lat*1, result.detail.location.lng*1,)
                    _this.strightMile = isNaN(_this.strightMile) ? '无法计算' : _this.strightMile
                    _this.$store.commit('updateLocation', _this.locationParams)
                  }
                })
                geocoder.getAddress(latLng)
              })
          },
          fail: function (res){
            this.getLocationStatus = '-1'
          }
        })
      }else{
        this.getLocationStatus = '-2'
        if(!show){
          _.alert('提示','暂不支持PC端，请在手机端打开')
        }
      }
    },
    // 字段值处理
    fieldChange(item) {
      if(item.key == 'carDesc') {
        this.carEndValue[item.key] = item.value
      } else {
        this.carEndValue[item.key] = (item.value * 1).toFixed(1)
        let idx = item.value.indexOf('.')
        this.carEndValue[item.key] = idx >= 0 ? item.value.split('.')[0].substring(0, 9) + '.' + item.value.split('.')[1].substring(0, 1) : item.value.substring(0)+'.0'
      }
    },
    close(){
      this.$emit('close')
    },
    confirm(){
      let _this = this
      this.params={
        askId : this.askId,
      }
      // 开始里程显示
      if(this.carEndList[0].status == 1 && this.carEndValue.start == undefined) {
        this.carEndValue.start = this.carEndList[0].value
      }
      // 车辆状况显示
      if(this.carEndList[3].status == 1 && this.carEndValue.carDesc == undefined) {
        this.carEndValue.carDesc = this.carEndList[3].value
      }
      if(this.isVip && this.showPosAndTime) this.carEndValue.realBackTime = this.realBackTime + ':00'
      this.params = Object.assign({}, this.params, this.locationParams, this.carEndValue)
      if(!this.checkMile(this.params.start, this.params.end)) return
      let validate = validation([], {}, this.carEndList, this.carEndValue)
      if(!validate.showFieldTips){
        finishCarAsk(this.params,(res)=>{
          setTimeout(function() {
            _this.$router.push({path: '/travel'})
          }, 1000)
        })
      }
    },
    showMap(address){
      if(address && address.length>0){
        this.$emit('seeMap',address)
      }else{
        _.alert('提示', '无法查看该详情地址')
      }
    },
    fixedBtn() {
      if(this.isScroll) return
      $('.absolute_active').css({position: 'fixed'})
      this.isScroll = true
    }
  },
  beforeRouteLeave(to, from, next) {
    if(to.name == 'map'){
      this.$store.commit('updateFromPath', 'useCarEnd')
    }
  }
}
</script>
 <style scoped>
  .use-car-end{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 60px;
    background: #fff;
    overflow: auto;
    margin: 0 auto;
    z-index: 10;
  }
  .error-time-tip{
    padding: 8px 0;
    height: 20px;
    color: #FE5354;
    text-align: center;
    background-color: #FFE5E5;
  }
  .end-msg, .modify-fields, .use-car-msg {
    padding: 0 14px;
  }
  .end-title{
    height: 53px;
    line-height: 54px;
    border-bottom: 1px solid #F7F8FA;
    padding: 0 14px;
  }
  .end-title span{
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #1B233A;
  }
  .use-time{
    padding: 13px 0 12px;
    display: -webkit-box;
    display: flex;
    display: -ms-flexbox;
  }
  .time-msg,.time-title{
    height:21px;
    font-size:15px;
    line-height:21px;
  }
  .time-title{
    margin-right: 17px;
    color: #7A7C80;
  }
  .time-msg{
    flex: 1;
    color: #0A1735;
    text-align: right;
  }
  .edit-field {
    border-top: 8px solid #F4F6F8;
    padding: 12px 0;
  }
  .edit-field .miles {
    padding: 0 14px;
  }
  .edit-field > div{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 21px;
    padding: 13px 0 12px;
  }
  .edit-field > div .title{
    display: inline-block;
    height: 21px;
    width: 107px;
    font-size: 15px;
    line-height: 21px;
    color: #7A7C80;
  }
  .edit-field > div .info {
    flex: 1;
    height: 21px;
    font-size: 15px;
    line-height: 21px;
    text-align: right;
    color: #0A1735;
  }
  @media screen and (min-width: 1024px) {
    .use-car-end {
      width: 740px;
    }
  }
  .use-car-end >>> .qwui-btn_box.absolute_active {
    position: absolute;
    background: #fff;

  }
  .use-car-end >>> .qwui-btn_box.absolute_active::before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
  }
</style>


