<template>
<transition name="slide">
  <div class="driver-detail" v-if="driverId">
    <div class="driver_msg" v-if="driverMsg">
      <img :src="driverImg(driverMsg.headPic)" :alt="driverMsg.name" class="head-pic">
      <span class="driver-name">{{driverMsg.personName}}</span>
      <div class="tel_wrap">
        <a :href="'tel:'+driverMsg.mobile"><i class="tel"></i></a>
      </div>
    </div>
    <div class="task-count">司机分派状态<span>({{ driverTaskList.length }})</span></div>
    <div class="driver-task" >
      <ul class="driver-task-list" v-if="driverTaskList && driverTaskList.length > 0" :style="{height:contentHeight+'px',overflow:'auto'}">
          <li class="driver-task-item" v-for="(item,index) in driverTaskList" :key="index">
            <div class="task-wrap">
              <img :src="driverImg(item.headPic)" :alt="item.name">
              <div class="task-msg">
                <p class="task-person">
                  <span class="task-person_name ellipsis">{{ item.personName }}</span>
                  <span class="car-number ellipsis" >{{ item.carName.split('-')[1] }}</span>
                </p>
                <p class="car-name ellipsis" >{{ item.carName.split('-')[0] }}</p>
              </div>
            </div>
              <div class="basic-fields">
                <basic-list :basicFields="item" :basicList="basicList" :showBtn="true" @showMap="showMap"></basic-list>
              </div>
          </li>
          <p class="no-more">— 已经到底了 —</p>
      </ul>

      <div v-if="driverTaskList && driverTaskList.length === 0  ">
        <no-record :show="lifeStatus == '1' && driverTaskList && driverTaskList.length>0" :hasrecord="hasRecord"></no-record>
      </div>
      <bottom-button @close="close" class="absolute_active"></bottom-button>
    </div>
  </div>
</transition>
</template>
<script>
import defaultHeadPic from '@/assets/images/car/touxiang02.png'
import { driverDetail } from '../../api/getData.js'
import bottomButton from '../base/bottomButton'
import noRecord from '../base/no_record'
import basicList from '../customFields/basicList'
export default {
  name: 'driverDetail',
  props: {
    driverId: {
      type: String,
      required: true
    }
  },
  components:{
    bottomButton,
    basicList,
    noRecord
  },
  data() {
    return {
      lifeStatus: '',
      driverMsg:'',
      driverTaskList:[],
      basicList:[],
      hasRecord: {
        icon: "qwui-icon_noRecord",
        title: "没有搜索到相关司机",
        text: "请联系管理员添加"
      },
      contentHeight: '',
      isScroll: false
    }
  },
  methods:{
    showMap(address){
      this.$emit('showMapDetail',address)
    },
    isIPhoneX(){
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        if (screen.height == 812 && screen.width == 375){
          this.contentHeight = document.documentElement.clientHeight - 185
        }else{
          this.contentHeight = document.documentElement.clientHeight  - 151
        }
      }else{
        this.contentHeight = document.documentElement.clientHeight  - 151
      }
    },
    close(){
      this.$emit('close')
    },
    //没有图片时使用默认图片
    driverImg(img){
      return img == 0 ? defaultHeadPic : img
    },
    fixedBtn() {
      if(this.isScroll) return
      $('.absolute_active').css({position: 'fixed'})
      this.isScroll = true
    }
  },
  created(){
    document.body.style.overflow = "hidden"
    this.contentHeight = document.documentElement.clientHeight - 130; //减去上面和下面的部分
    driverDetail({ driverId: this.driverId }, (res) =>{
      this.driverMsg = res.data.driverUser
      this.driverTaskList = res.data.list
    })
  },
  mounted(){
    let _this = this
    this.lifeStatus = '1'
    this.basicList[3] = {'status': 0}
    this.basicList[4] = {'status': 1}
    this.basicList[5] = {'status': 1}
    this.basicList[6] = {'status': 0}
    this.basicList[7] = {'status': 0}
    $('.driver-task').scroll(function() {
      _this.fixedBtn()
    });
    this.isIPhoneX()
  },
  destroyed() {
    document.body.style.overflow = "auto"
  }
}
</script>
<style scoped>
.driver-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  margin: 0 auto;
  background: #F4F6F8;
  z-index: 10;
}
.driver_msg{
  position: relative;
  background: #ffffff;
  height: 26px;
  padding: 10px 0 10px 14px;
}
.head-pic{
  vertical-align: middle;
  line-height: 46px;
  width: 26px;
  height: 26px;
}
.driver-name{
  vertical-align: middle;
  display: inline-block;
  margin: 2px 0 2px 4px;
  font-size: 16px;
  line-height: 22px;
  color: #1B233A;
}
.tel_wrap{
  position: absolute;
  height: 28px;
  width: 43px;
  text-align: right;
  top: 9px;
  right: 0;
  border-left: 1px solid #F7F7F7;
}
.tel{
  position: absolute;
  top:0;
  right:10px;
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url(~assets/images/car/icon_tel.png) no-repeat center;
  background-size: cover;
}
.task-count{
  margin:12px 0 12px 14px;
  font-size: 15px;
  line-height: 21px;
  color: #7A7C80;
}
.driver-task {
  overflow: auto;
}
.driver-task-list{
  margin:0 14px 14px 14px;
}
.driver-task-item{
  padding-top: 12px;
  background-color: #ffffff;
  padding-top: 12px;
  margin-bottom: 8px;
}
li:nth-last-child(){
  margin-bottom:0;
}
.task-wrap{
  display: flex;
  border-bottom: 1px solid #F6F7FB;
  padding: 0 14px 12px;
}
.driver-task-item img{
  width: 26px;
  height: 26px;
}
.task-msg{
  flex:1;
  height: 43px;
  display: inline-block;
  margin-left: 8px;
}
.task-person{
  height: 22px;
  font-size: 16px;
  color: #0A1735;
  line-height: 22px;
  margin-bottom: 4px;
  margin-top: -3px;
}
.task-person span{
  display: inline-block;
  max-width: 100px;
}

.task-person .car-number{
  float: right;
}
.car-name{
  height: 21px;
  font-size: 15px;
  line-height: 21px;
  color: #B2B9C8;
}
.no-more{
  width: 100%;
  padding: 10px 0;
  font-size: 14px;
  z-index: 10;
  text-align: center;
  color: #B2B9C8;
  line-height: 20px;
}
@media screen and (min-width: 1024px) {
  .driver-detail {
    width: 740px;
    margin: 0 auto;
  }
}
.driver-detail >>> .absolute_active {
    position: absolute;
}
@media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .driver-detail >>> .cancel-btn{
    padding-bottom: 34px;
  }
}
</style>


