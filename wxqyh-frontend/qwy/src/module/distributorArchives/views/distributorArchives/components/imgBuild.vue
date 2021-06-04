<template>
  <!-- 形象建设信息 -->
  <div class="imgBuildWrap">

    <!--形象展示 start  -->
    <div class="titWrap">
      <h4>形象展示</h4>
    </div>
    <div class="titWrap mb10">
      <div class="marketTab"><span :class="{current:saleTab==='1'}" @click="changeSaleShowFun('1')">售前建设信息</span> <i>|</i> <span :class="{current:saleTab==='2'}" @click="changeSaleShowFun('2')">售后建设信息</span></div>
<!--      <a href="javascript:;">查看更多 ></a>-->
    </div>
    <img-show :btype="saleTab" :columns="imgShowData"></img-show>
    <!--形象展示 end  -->

    <!-- 店面信息 start -->
    <div class="titWrap mb10">
      <h4>店面信息</h4>
    </div>
    <store-info :columns="stopInfoData"></store-info>
    <!-- 店面信息 end -->

    <!-- 建设过程管理 start -->
    <div class="titWrap mb10">
      <h4>建设过程管理</h4>
    </div>
    <div class="buildProcessWrap">
      <div class="stepWrap">
        <ul class="stepInfo">
          <li class="finish">
            <div class="stepIcon">&nbsp;</div>
            <div class="stepLine"></div>
          </li>
          <li v-for="(item,index) in processData" :key="index" :class="{finish:currentIndex>index+1,current:currentIndex===index+1}">
            <div class="stepIcon">{{item}}</div>
            <div class="stepc">
              <img v-if="currentIndex>index+1" src="../images/icon_finish.png" />
              <img v-else-if="currentIndex===index+1" src="../images/icon_doing.png" />
              <img v-else src="../images/icon_nostart.png" />
            </div>
            <div class="stepLine"></div>
          </li>
         </ul>
      </div>
      <table>
        <tr>
          <th>当前建设进度</th>
          <th>建设过程照片</th>
        </tr>
        <tr>
          <td><el-popover
            placement="left"
            title=""
            width="200"
            name
            slot="content"
            trigger="click">
            <div v-html="currentMark"></div>
            <el-button slot="reference" type="text">{{currentName || '-'}}</el-button>
          </el-popover></td>
          <td><a class="red"
              href="javascript:;"
              @click="openPhotoFun">查看</a></td>
        </tr>
      </table>
    </div>
    <!-- 建设过程管理 end -->

    <!-- 建店及返利 start -->
    <div class="titWrap">
      <h4>建店及返利</h4>
    </div>
    <div class="rebateWrap">
      <div class="subTit">
        <p> · 一网建店返利</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <first-net-store :columns="firstNetStoreList"></first-net-store>

      <div class="subTit">
        <p> · 二网建店返利</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="titWrap mb10">
        <div class="marketTab">
          <span :class="{current:storeType==='销售直营店'}" @click="changeStoreTypeFun('销售直营店')">销售直营店</span> <i>|</i>
          <span :class="{current:storeType==='服务直营店'}" @click="changeStoreTypeFun('服务直营店')">服务直营店</span> <i>|</i>
          <span :class="{current:storeType==='服务二网'}" @click="changeStoreTypeFun('服务二网')">服务二网</span>
        </div>
      </div>
      <second-net-store :columns="secondNetStoreList"></second-net-store>
    </div>
    <!-- 建店及返利 end -->

    <!-- 建设过程照片弹框 start -->
    <photoPop v-show="pop.isShowPhoto"
      @closePhotoPop="closePhotoPop" :columns="constructionImgData" :updateTime="photoUpdateTime"></photoPop>
    <!-- 建设过程照片弹框 end -->
  </div>
</template>

<script>
import photoPop from './photoPop'
import firstNetStore from "./imgBuild/firstNetStore";
import secondNetStore from "./imgBuild/secondNetStore";
import storeInfo from "./imgBuild/storeInfo";
import imgShow from "./imgBuild/imgShow";
import {ajaxGetOneNetShopByErpNo,ajaxGetSecondNetShopByErpNo,ajaxGetImageDisplay,ajaxGetShopInfoByErpNo,ajaxGetConstructionProcess,ajaxGetConstructionImg} from '../../../api/getData'
export default {
  data() {
    return {
      pop: { isShowPhoto: false, isShowStoreChange: false },
      storeType:'销售直营店', // 二网建店类型-销售直营店、服务直营店
      saleTab:'1',
      firstNetStoreList:[],
      secondNetStoreList:[],
      imgShowData:{}, // 形象展示
      stopInfoData:{}, // 店面信息
      currentIndex:0,
      currentName:'-',
      currentMark:'-',
      processData:['方案设计','启动建设','基础施工','内部施工','完工预验收','建设完成'],
      photoUpdateTime:'',
      processCurrentData:{}, // 当前过程
      constructionImgData:[], // 圖片列表
    }
  },
  props:['dealerId'],
  created(){
    this.init()
  },
  methods: {
      init(){
          this.getShopInfoByErpNo()
          this.getImageDisplay()
          this.getOneNetShopByErpNo()
          this.getSecondNetShopByErpNo()
          this.getConstructionProcess()
      },
      // 获取建设过程
      getConstructionProcess(){
          let params = {
              dealerId:this.dealerId,
          }
          let self = this
          ajaxGetConstructionProcess(params,data => {
              if(data && data.constructionProcessPos){
                  let res = data.constructionProcessPos
                  self.currentIndex = res.currentIndex
                  self.currentName = res.currentName
                  if(res.currentMark) {
                      self.currentMark = res.currentMark.replace(/\n/g,'<br>')
                  }
                  self.processCurrentData = res
                  if(typeof res.updateTime==='string') {
                      self.photoUpdateTime = res.updateTime.substr(0,10)
                  }
              }
          })
      },
      // 获取建设详情
      getConstructionImg(id){
          let params = {
              processId:id,
          }
          ajaxGetConstructionImg(params,data => {
              if(data && data.constructionImgPos){
                  this.constructionImgData = data.constructionImgPos
              }
          })
      },
      // 获取店面信息
      getShopInfoByErpNo(){
          let params = {
              dealerId:this.dealerId,
          }
          ajaxGetShopInfoByErpNo(params,data => {
              if(data){
                  this.stopInfoData = data
                  if(data.enclosure) {
                      let tempUrl = _.compressURL.replace('//compress','')
                      this.stopInfoData.enclosure = tempUrl+data.enclosure
                  }
              }
          })
      },
      // 获取形象展示
      getImageDisplay(){
          let params = {
              dealerInfoId: this.dealerId
          }
          ajaxGetImageDisplay(params,data => {
              if(data && data.imageDisplayVO){
                  let temp = data.imageDisplayVO
                  if(temp.antechamberImg) {
                      temp.antechamberImg =  _.compressURL + temp.antechamberImg
                  }
                  if(temp.hall45Img) {
                      temp.hall45Img =  _.compressURL + temp.hall45Img
                  }
                  if(temp.hallFrontImg) {
                      temp.hallFrontImg =  _.compressURL + temp.hallFrontImg
                  }
                  if(temp.hallInsideFrontImg) {
                      temp.hallInsideFrontImg =  _.compressURL + temp.hallInsideFrontImg
                  }
                  if(temp.saleReceptionDeskImg) {
                      temp.saleReceptionDeskImg =  _.compressURL + temp.saleReceptionDeskImg
                  }
                  if(temp.serviceStationFrontImg) {
                      temp.serviceStationFrontImg =  _.compressURL + temp.serviceStationFrontImg
                  }
                  if(temp.lounge) {
                      temp.lounge =  _.compressURL + temp.lounge
                  }
                  if(temp.plant) {
                      temp.plant =  _.compressURL + temp.plant
                  }

                this.imgShowData = temp
              }
          })
      },
      // 获取一网数据
      getOneNetShopByErpNo(){
          let params = {
              dealerId:this.dealerId,
          }
          ajaxGetOneNetShopByErpNo(params,data => {
            if(data){
              this.firstNetStoreList=data
            }
          })
      },
      // 切换二网类别
      changeStoreTypeFun(str){
          this.storeType = str
          this.getSecondNetShopByErpNo()
      },
      // 获取二网数据
      getSecondNetShopByErpNo(){
          let params = {
              type: this.storeType,
              dealerId:this.dealerId,
          }
          ajaxGetSecondNetShopByErpNo(params,data => {
              if(data){
                  this.secondNetStoreList=data
              }
          })
      },
      // 切换售前售后
      changeSaleShowFun(type){
        this.saleTab = type
      },
      // 打开照片弹框
      openPhotoFun() {
        let id = this.processCurrentData.id
        this.getConstructionImg(id)
        this.pop.isShowPhoto = true
      },
    // 关闭照片弹框
    closePhotoPop() {
      this.pop.isShowPhoto = false
    },
  },
  components: {
    photoPop,
    firstNetStore,secondNetStore,storeInfo,imgShow
  }
}
</script>
