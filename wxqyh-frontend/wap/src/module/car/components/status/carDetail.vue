<template>
  <transition name="slide">
    <div class="car-detail-wrapper">
      <div class="car-detail" ref="carDetail">
        <div class="car">
          <div class="name">{{carData && carData.name}}</div>
          <div class="status">
            <span class="number">{{carData.carno}}</span>
            <span class="color">{{carData.color}}<span v-if="carData.limited"> 限载{{carData.limited | toNum}}人</span></span>
          </div>
        </div>
        <nav-tabs :selectdata="tabs"
                  @listenTabChange="listenNavTabsBack">
        </nav-tabs>
      </div>
      <div class="swiper-container swiper-detail">
        <div class="swiper-wrapper">
          <div :style="{height:contentHeight+'px'}"
              class="car-use swiper-slide"
              :class="{'whiteBg':useCarData && useCarData.length === 0}">
            <ul class="car-use-status" v-if="useCarData && useCarData.length > 0">
              <li class="car-use-item" v-for="(item,index) in useCarData" :key="index">
                <div class="avatar">
                  <img :src="item.headPic" alt="">
                  <span class="name">{{item.personName}}</span>
                </div>
                <div class="basic-fields">
                  <basic-list @showMap="showMap" :basicFields="item" :basicList="basicList" :showBtn="true"></basic-list>
                </div>
              </li>
              <p class="no-more">— 已经到底了 —</p>
            </ul>
            <div v-if="useCarData && useCarData.length === 0">
              <no-record :show="true" :hasrecord="hasRecord"></no-record>
            </div>
          </div>
          <div :style="{height:contentHeight+'px'}" class="car-status swiper-slide" >
            <ul v-for="(item,index) in carStatus" :key="index">
              <li>
                <text-field :field="item.field" :value="item.value" :readonly="item.readonly"></text-field>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button-group class="absolute_active">
        <qwui-button type="default" text="返回" @buttonClick="close"></qwui-button>
        <qwui-button type="primary" :text="primaryText" @buttonClick="confirm"></qwui-button>
      </button-group>
    </div>
  </transition>
</template>

<script>
  import {mapState} from 'vuex'
  import basicList from '../customFields/basicList'
  import NavTabs from '@/components/button/menu_tab_two'
  import noRecord from '../base/no_record'
  import textField from '../fields/textField'
  import qwuiButton from '@/components/base/button/button'
  import buttonGroup from '@/components/base/button/button_group'
  import {carDetail, validCar} from '../../api/getData'
  export default {
    name: 'carDetail',
    props: {
      carInfo: {
        type: Object,
        required: true
      },
      carIdx:{
        require: true
      }
    },
    components: {
      basicList,
      NavTabs,
      noRecord,
      textField,
      qwuiButton,
      buttonGroup
    },
    data() {
      return {
        swiperDetail: '',
        carDetail: {}, //车辆详情信息
        carData: {}, //车辆信息
        tabs: {
          index:0,
          nav:[{content: '车辆占用情况'}, {content: '车辆详情'}]
        },
        currentIndex: 0,
        hasRecord: {
          icon: 'qwui-icon_noCar',
          title: '暂无车辆占用情况',
          text: ''
        },
        carStatus: [],
        basicList: [],
        contentHeight: '',
        primaryText: '确认'
      }
    },
    mounted() {
      var _this = this
      document.body.style.overflow = "hidden"
      if(!this.carInfo.isSendCar) {
        this.primaryText = '新建用车申请'
      }
      this.swiperDetail = ''
      this.basicList[3] = {'status': 0}
      this.basicList[4] = {'status': 1}
      this.basicList[5] = {'status': 1}
      this.basicList[6] = {'status': 0}
      this.basicList[7] = {'status': 0}
      this.isIPhoneX()
      this.initCarDetail()
      this.$nextTick(()=>{
        this.initSwiper()
      })
    },
    computed: {
      ...mapState({
        clickTarget: state => state.mapStatus.clickTarget,
        detailData: state => state.detail.detailData && state.detail.detailData.detail     //detail信息
      }),
      useCarData() {
        return this.carDetail && this.carDetail.bookList
      },
      carNumber() {
        return this.carData.carno || '无'
      },
      carDriver() {
        return this.carData.driver || '无'
      },
      driverMobile() {
        return this.carDetail.driverMobile || ''
      },
      driverInfo() {
        return `${this.carDriver} ${this.driverMobile}`
      },
      carMile() {
        return this.carData.mile ? this.carData.mile : ''
      },
      driverDept() {
        if(this.carDetail.deptName && this.carDetail.deptName.length > 0) {
          return this.carDetail.deptName.join('；')
        } else return '无'
      }
    },
    methods: {
      initSwiper() {
        var _this = this
        var swiperDetail = this.swiperDetail = new Swiper('.swiper-detail',{
          observer:true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents:true, //修改swiper的父元素时，自动初始化swiper
          autoHeight: true,
          on:{
            slideChange: function(){
              _this.tabs.index = _this.currentIndex = this.activeIndex
            }
          }
        })
      },
      isIPhoneX(){
        var u = navigator.userAgent;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isIOS) {
          if (screen.height == 812 && screen.width == 375){
            this.contentHeight = document.documentElement.clientHeight - 213
          }else{
            this.contentHeight = document.documentElement.clientHeight  - 187
          }
        }else{
          this.contentHeight = document.documentElement.clientHeight  - 187
        }
      },
      initCarDetail() {
        let _this = this
        let carId = this.carInfo.carId
        _.showLoading()
        carDetail({carId: carId}, data => {
          _this.carDetail = data
          _this.carData = data.car
          _this.carStatus = [
            {
              field: {optionName: '车牌号', status: 1},
              value: _this.carNumber,
              readonly: true
            },
            {
              field: {optionName: '司机', status: 1},
              value: _this.driverInfo,
              readonly: true
            },
            {
              field: {optionName: '里程数', status: 1},
              value: _this.carMile,
              readonly: true
            },
            {
              field: {optionName: '所属部门', status: 1},
              value: _this.driverDept,
              readonly: true
            }
          ]
        })
      },
      close() {
        this.$emit('closeCarDetail')
      },
      confirm() {
        if(!this.carInfo.isSendCar) {
          this.$router.push({path: '/add', query: {carName: this.carData.name}})
        } else {
          if(this.useCarData.length === 0) {
            this.$store.commit('updateCarDetail', {carId: this.carData.carId, carName: this.carData.name, carNumber: this.carData.carno})
            this.$emit('closeStatus')
          } else {
            this.isValidCar()
          }
        }
      },
      isValidCar() {
        let _this = this
        _.showLoading()
        validCar({carId: _this.carData.carId,takeTime: this.detailData.takeTime,backTime: this.detailData.backTime},function(data) {
          let askList = data.askList
          let userAskList = data.userAskList
          let btnConfig = {
            primaryBtn: {
              name: '确认',
              callBack: function() {
                _this.selectCar(_this.carData)
              }
            },
            defaultBtn: {
              name: '取消',
              callBack: null
            }, //主操作按钮
          }
          if(askList.length > 0) {
            _.alert('确定继续分派吗？','车辆在用车时间内已被占用',btnConfig);
          } else if(userAskList.length > 0) {
            _.alert('确定要分派吗？',`${userAskList[0].title}还未结束`,btnConfig);
          } else {
            _this.selectCar(_this.carData)
          }
        })
      },
      selectCar(item) {
        this.$store.commit('updateCarDetail', {carId: item.carId, carName: item.name, carNumber: item.carno})
        this.$emit('closeStatus')
      },
      showMap(address){
        if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
          this.$store.commit('updateMapStatus', 'showMap')
          if(this.$route.path!=='/status'){
            this.$emit('seeMapDetail',address)
          }else{
            this.$emit('openMapDetail',address)
          }
        }else{
          _.alert('提示','您的终端暂不支持查看地址')
        }
      },
      listenNavTabsBack(item, index) {
        this.swiperDetail.slideTo(index,500,false)
        this.currentIndex = index = this.swiperDetail.activeIndex
      },
    },
    filters: {
      toNum(val) { //过滤字符串里非数字部分
        if(!val) return
        return val.replace(/[^0-9]/ig,"")
      }
    },
    destroyed() {
      document.body.style.overflow = "auto"
    },
  }
</script>

<style scoped>
  .swiper-slide{
    box-sizing: border-box;
    width: 100%;
  }
  .car-detail-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    z-index: 10;
    background: #F4F6F8;
  }
  @media screen and (min-width: 1024px) {
    .car-detail-wrapper {
      width: 740px;
      margin: 0 auto;
    }
  }
  .car-detail {
    padding-left: 14px;
    margin-bottom: 8px;
    background: #fff;
  }
  .car-detail .car {
    font-size: 16px;
    line-height: 22px;
    color: #1B233A;
    padding: 12px 14px 12px 0;
    border-bottom: 1px solid #F6F7FB;
  }
  .car .name {
    margin-bottom: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .car .status {
    color: #B2B9C8;
  }
  .status .color {
    float: right;
  }
  .car-use {
    overflow: auto;
  }
  .car-use .car-use-status{
    background: #F4F6F8;
    padding: 0 14px;
    overflow-x: hidden;
  }
  .car-use-status .basic-fields {
    padding-bottom: 12px;
  }
  .car-use-status .no-more {
    text-align: center;
    font-size: 14px;
    color: #B2B9C8;
    margin-bottom: 8px;
  }
  .car-use .car-use-item {
    background: #fff;
    margin-bottom: 8px;
    border-radius: 2px;
  }
  .car-use-item .avatar {
    padding: 10px 10px 10px 0;
    margin-left: 10px;
    border-bottom: 1px solid #F6F7FB;
  }
  .avatar img {
    width: 26px;
    height: 26px;;
  }
  .avatar .name {
    vertical-align: top;
    height: 26px;
    line-height: 26px;
    font-size: 16px;
    color: #0A1735;
    margin-left: 8px;
  }
  .car-status {
    padding: 16px 14px 0 14px;
    background: #fff;
  }
  .whiteBg {
    background: #fff;
  }
  .car-detail-wrapper >>> .vux-tab .vux-tab-item {
    background: 0;
  }
  .car-detail-wrapper >>> .vux-tab .vux-tab-item.vux-tab-selected {
    color: #5585F0;
  }
  .car-detail-wrapper >>> .vux-tab-bar-inner {
    width: 28px !important;
    background: #6E9BFF;
  }
  .car-detail-wrapper >>> .qwui-btn_box.absolute_active {
    position: absolute;
    background: #fff;
  }
  .car-detail-wrapper >>> .qwui-btn_box.absolute_active::before{
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
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .car-detail-wrapper >>> .qwui-btn_tab{
    padding-bottom: 34px;
  }
}
</style>
