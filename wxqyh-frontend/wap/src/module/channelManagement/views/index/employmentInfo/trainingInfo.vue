<!-- 人员信息 -->
<template>
  <div class="training-info">
    <!-- 培训总览 -->
    <content-title :name="'培训总览'" :content="['更新日期:'+ (authData.updateTime || '暂无'),'更新人:'+ (authData.updateUser || '暂无')]" :padding="'8px 10px 13px 15px'"></content-title>
    <div class="rate__plate">
      <div class="rate__item" style="border-right:none;border-left:none;">
        <p class="rate__item__title">销售总体认证率</p>
        <p class="rate__item__rate">{{authData.salesTotalRate}}</p>
      </div>
      <div class="rate__item" style="border-right:none;">
        <p class="rate__item__title">服务总体认证率</p>
        <p class="rate__item__rate">{{authData.serviceTotalRate}}</p>
      </div>
    </div>
    <div class="section">
      <div class="section__title" style="padding-bottom: 0;">
          <p class="section__title__col">销售岗位认证明细</p>
          <p class="section__title__col">服务岗位认证明细</p>
      </div>
      <div class="section__content">
        <div class="section__row">
          <div class="section__col" v-for="(item,index) in authData.salesAuthList" :key="'salesAuth'+index">
            <div class="cell">
              <div class="cell__item">
                <p class="cell__value">{{item.positionName}}</p>
                <qw-progress :width="46" :percentage="filteringPercent(item.authRate)" :stroke-width="6" class="circle__progress">
                  <p class="progress__text">{{item.authRate}}<br/>认证率</p>
                  </qw-progress>
              </div>
              <div class="cell__item">
                <p class="cell__label">应认证 <b class="cell__num"> {{item.certifiedNum}} </b> 人</p>
                <p class="cell__label">已认证 <b class="cell__num"> {{item.actualCertifiedNum}} </b> 人</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section__row">
          <div class="section__col"  v-for="(item,index) in authData.serviceAuthList" :key="'serviceAuth'+index">
            <div class="cell">
              <div class="cell__item">
                <p class="cell__value">{{item.positionName}}</p>
                <qw-progress :width="46" :percentage="filteringPercent(item.authRate)" :stroke-width="6" class="circle__progress">
                  <p class="progress__text">{{item.authRate}}<br/>认证率</p>
                  </qw-progress>
              </div>
              <div class="cell__item">
                <p class="cell__label">应认证 <b class="cell__num">{{item.certifiedNum}}</b> 人</p>
                <p class="cell__label">已认证 <b class="cell__num">{{item.actualCertifiedNum}}</b> 人</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>
    <!-- 认证明细 -->
    <content-title :name="'认证明细'" :content="['更新日期:'+ (authDetail.updateTime || '暂无'),'更新人:'+ (authDetail.updateUser || '暂无')]" :padding="'8px 10px 13px 15px'"></content-title>
    <qw-tabs :slider-width="58">
      <qw-tab-pane value="1" label="关键岗位">
        <div class="card__content"  :class="{'showMore' : isShowMore1}">
          <div class="card" @click="viewCertification(item)" v-for="(item,index) in keyPostList" :key="'keyPost'+index">
            <div class="card__left">
              <img class="card__photo" :src="item.headPic&&item.headPic!='0' ? item.headPic : iconHeadPic">
              <span class="card__name" style="width:53px;">{{item.trainingUser || '-'}}</span>
              <span class="card__post" style="width:96px;">{{item.postName || '-'}}</span>
            </div>
            <div class="card__right">
              <img class="right__arrow" :src="iconArrowRight">
            </div>
          </div>
        </div>
        <div class="card__end" v-if="keyPostList.length > 3">
          <button class="view__more" @click="handleViewMore('part1')">
            {{isPart1Show ? '收起' : '查看更多'}}
            <img :src="isPart1Show ? iconHideMore : iconShowMore" alt="">
          </button>
        </div>
        <div v-if="keyPostList.length == 0"
          class="no-course">
          暂无关键岗位信息
        </div>
      </qw-tab-pane>
      <qw-tab-pane value="2" label="核心业务岗位" >
        <div class="card__content"  :class="{'showMore' : isShowMore2}">
          <div class="card" @click="viewCertification(item)" v-for="(item,index) in corePostList" :key="'corePost'+index">
            <div class="card__left">
              <img class="card__photo" :src="item.headPic&&item.headPic!='0' ? item.headPic : iconHeadPic">
              <span class="card__name" style="width:53px;">{{item.trainingUser || '-'}}</span>
              <span class="card__post" style="width:96px;">{{item.postName || '-'}}</span>
            </div>
            <div class="card__right">
              <img class="right__arrow" :src="iconArrowRight">
            </div>
          </div>
        </div>
        <div class="card__end" v-if="corePostList.length > 3">
          <button class="view__more" @click="handleViewMore('part2')">
            {{isPart2Show ? '收起' : '查看更多'}}
            <img :src="isPart2Show ? iconHideMore : iconShowMore" alt="">
          </button>
        </div>
        <div v-if="corePostList.length == 0"
          class="no-course">
          暂无核心业务岗位信息
        </div>
      </qw-tab-pane>
      <qw-tab-pane value="3" label="认证岗位" >
        <div class="card__content"  :class="{'showMore' : isShowMore4}">
          <div class="card" @click="viewCertification(item)" v-for="(item,index) in certificationList" :key="'certification'+index">
            <div class="card__left">
              <img class="card__photo" :src="item.headPic&&item.headPic!='0' ? item.headPic : iconHeadPic">
              <span class="card__name" style="width:53px;">{{item.trainingUser || '-'}}</span>
              <span class="card__post" style="width:96px;">{{item.postName || '-'}}</span>
            </div>
            <div class="card__right">
              <img class="right__arrow" :src="iconArrowRight">
            </div>
          </div>
        </div>
        <div class="card__end" v-if="certificationList.length > 3">
          <button class="view__more" @click="handleViewMore('part4')">
            {{isPart4Show ? '收起' : '查看更多'}}
            <img :src="isPart4Show ? iconHideMore : iconShowMore" alt="">
          </button>
        </div>
        <div v-if="certificationList.length == 0"
          class="no-course">
          暂无认证岗位信息
        </div>
      </qw-tab-pane>
    </qw-tabs>
    <div class="gutter"></div>
    <!-- 产品培训明细 -->
    <content-title :name="'产品培训明细'" :content="['更新日期:' + (productData.updateTime || '暂无'),'更新人:'+ (productData.updateUser || '暂无')]" :padding="'8px 10px 13px 15px'"></content-title>
    <div class="list__content" :class="{'showMore' : isShowMore3}">
      <div class="list" v-for="(item, index) in getProductTrainingList" :key="index">
        <div class="list__item">
          <div class="list__left">
            <span class="traning__name">{{item.model}}</span> |
            <span class="list__name">{{item.trainingUser}}</span> |
            <span class="list__post">{{item.postName}}</span>
          </div>
          <div class="list__right">
            <i class="training__icon" :class="{'is-open': isOpen(item.isOpen)}"
              @click="handleClickTrainingIcon(index)"><img :src="iconArrowDown"
                alt=""></i>
          </div>
        </div>
        <div class="list__item">
          <div class="list__date">
            <span>{{item.trainingStartTime}}</span> 至
            <span>{{item.trainingEndTime}}</span>
          </div>
        </div>
        <ul class="training__list"
          v-show="isOpen(item.isOpen)">
          <li class="training__list-item">
            <span>{{item.trainingClassName || '-'}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="card__end" v-if="productTrainingList.length > 3"  style="background:rgba(255,255,255,1);">
      <button class="view__more" @click="handleViewMore('part3')">
        {{isPart3Show ? '收起' : '查看更多'}}
        <img style="background:rgba(255,255,255,1);" :src="isPart3Show ? iconHideMore : iconShowMore" alt="">
      </button>
    </div>
    <div v-if="productTrainingList.length == 0"
      class="no-course">
      暂无产品培训明细
    </div>
  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png' //向下箭头图标
import iconHeadPic from '@/module/channelManagement/static/images/profile-photo@2x.png' //头像图标
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png' //向右箭头图标
import iconShowMore from '@/module/channelManagement/static/images/icon_show_more.png' //查看更多图标
import iconHideMore from '@/module/channelManagement/static/images/icon_hide_more.png' //隐藏更多图标
import SearchHeader from '@/module/channelManagement/components/SearchHeader'
import {
  getPersonInfo,
  getUserTrainingList,
  getUserTrainingimport ,
  getOverviewTrainingData,
  getAuthDetailList,
  getProductTrainingData} from '@/module/channelManagement/api/basic'
import noData from '@/module/channelManagement/components/noData'
import contentTitle from '@/module/channelManagement/components/contentTitle'

export default {
  components: {
    SearchHeader,
    noData,
    contentTitle
  },
  data: function() {
    return {
      authData: {}, //培训总览数据
      productData:{}, // 产品培训全部数据
      productTrainingList: [], // 产品培训列表
      authDetail: {}, //认证明细全部数据
      corePostList: [], //核心业务岗位
      keyPostList: [], //关键岗位
      certificationList: [], // 认证岗位
      erpNo: '',
      iconHideMore, //隐藏更多图标
      iconShowMore, //查看更多图标
      iconArrowDown, //向下箭头图标
      iconArrowRight, //向右箭头图标
      iconHeadPic, //头像图标
      isPart1Show: false,
      isPart2Show: false,
      isPart3Show: false,
      isPart4Show: false,
      isShowMore1: true,
      isShowMore2: true,
      isShowMore3: true,
      isShowMore4: true,
    }
  },
  computed:{
    getProductTrainingList(){
      return this.isPart3Show? this.productTrainingList : this.productTrainingList.slice(0, 3);
    }
  },
  methods: {
    filteringPercent(str){ // 去掉%
      return parseInt(str)
    },
    isOpen(status) {
      return status
    },
    handleClickTrainingIcon(index) {
      this.productTrainingList[index].isOpen = !this.productTrainingList[index].isOpen
    },
    handleViewMore(part){  //改变查看更多状态
      if(part == 'part1'){
        this.isPart1Show = !this.isPart1Show  //控制按钮的显隐
        this.isShowMore1 = !this.isShowMore1  //控制是否展示更多
      }else if(part == 'part2'){
        this.isPart2Show = !this.isPart2Show
        this.isShowMore2 = !this.isShowMore2
      }else if(part == 'part3'){
        this.isPart3Show = !this.isPart3Show
        this.isShowMore3 = !this.isShowMore3
      }else if(part == 'part4'){
        this.isPart4Show = !this.isPart4Show
        this.isShowMore4 = !this.isShowMore4
      }
    },
    viewCertification(item) { //查看认证明细
      const queryParams = Object.assign({}, this.$route.query,{item});
      this.$router.push({ name: 'certificationDetail', query: queryParams })
    },
    init(){
      let _this = this
      this.isLoading = true;
      const dealerId = this.$route.query.dealerId || ''
      const p1 = getOverviewTrainingData({dealerId}).then(data => { //获取培训总览数据
        if(data && data.authData){
          this.authData = data.authData
        }
      })
      const p2 = getAuthDetailList({dealerId}).then(data => { //获取认证明细数据
        if(data && data.authDetail){
          this.authDetail = data.authDetail //认证明细全部数据
          this.corePostList = data.authDetail.corePostList || []//核心业务岗位
          this.keyPostList = data.authDetail.keyPostList || [] //关键岗位
          this.certificationList = data.authDetail.certificationList || [] //认证岗位
        }
      })
      const p3 = getProductTrainingData({dealerId}).then(data => { //获取产品培训明细数据
        if(data && data.productData){
          this.productData = data.productData || {}
          const list = data.productData.productTrainingList || []
          this.productTrainingList = list.map(item => {
            return Object.assign({}, item, { isOpen: false })
          })
        }
      })
      Promise.all([p1,p2,p3]).finally(() => {
        _this.isLoading = false;
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
/deep/{
  .qw-tabs {
    .qw-tab-bar {
      height: 30px;
      .qw-tab-bar__wrapper {
        height: 30px;
      }
    }
    .qw-tab-bar__pane {
      font-size: 15px;
      font-weight: 400;
      height: 21px;
      line-height: 21px;
      color: rgba(128,128,128,1);
    }
    .qw-tab-bar__pane.is-active {
      font-weight: 600;
      color: rgba(0,0,0,1)
    }
    .qw-tab-pane {
      background-color:rgba(247,247,247,1);
    }
  }
}
.training-info {
  padding-bottom: 50px;
  .bold-line {
      width: 3px;
      height: 11px;
      background-color: rgba(198,0,31,1);
      margin-right: 8px;
    }
  .title__box{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .selectbar {
    background: #ffffff;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-around;
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
    .selectbar__item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-shrink: 0;
      .selectbar__value {
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
    }
  }
  .section {
    padding: 15px;
    background: #ffffff;
    .section__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .section__title {
        display: flex;
        .section__title__col{
          color: rgba(0, 0, 0, 1);
          text-align: center;
          flex: 1;
          height: 24px;
          font-size: 17px;
          font-weight: 600;
          line-height: 24px;
        }
      }
      .section__desc {
        height:10px;
        font-size:12px;
        -webkit-transform: scale(0.84, 0.84);
        transform-origin: right bottom;
        font-weight:300;
        line-height:10px;
        color:rgb(55, 72, 88);
      }
    }
    .section__title{
      display: flex;
      .section__title__col {
        flex: 1;
        font-size:16px;
        font-family:PingFang SC;
        font-weight:400;
        line-height:28px;
        color: rgba(0, 0, 0, 1);
        text-align: center;
        height: 24px;
        line-height: 24px;
      }
    }
    .section__content {
      display: flex;
      .section__row {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-right: 5px;
        &:last-child {
          padding-left: 5px;
          padding-right: 0;
        }
        .section__col {
          margin-bottom: 10px;
          width: 100%;
          &:last-child {
          margin-bottom: 0;
          }
        }
        .col__title {
          text-align: center;
          height:28px;
          font-size:16px;
          font-weight:400;
          line-height:28px;
          color:rgba(0,0,0,1);
        }
        .cell {
          display: flex;
          flex-direction: column;
          height: 82px;
          background:rgba(255,255,255,1);
          border:1px solid rgba(238,238,238,1);
          box-shadow:0px 0px 3px rgba(0,0,0,0.16);
          padding: 5px 5px;
           .cell__item {
             display: flex;
             justify-content: space-between;
             align-items: center;
             .circle__progress{
               .progress__text {
                text-align: center;
                font-size:12px;
                transform: scale(0.7);
                -webkit-transform: scale(0.7, 0.7);
                font-weight:400;
                line-height:12px;
                color:rgba(39,129,219,1);
               }
             }
             .cell__value {
                height: 19px;
                font-size: 13px;
                font-weight: 400;
                line-height: 19px;
                color:rgba(102,102,102,1);
                margin-bottom: 3px;
              }
              .cell__label {
                margin-top: 10px;
                height: 15px;
                font-size: 11px;
                font-weight: 400;
                line-height: 15px;
                color:rgba(153,153,153,1);
                display: flex;
                align-items: center;
                .cell__num {
                  height:25px;
                  font-size:15px;
                  font-weight:600;
                  line-height:25px;
                  color:rgba(204,49,73,1);
                }
              }
           }
        }
      }
    }
  }

  .card__content.showMore{
    max-height: 213px;
    overflow: hidden;
  }
  .card__content {
    .card {
      padding: 13px;
      height: 35px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 3px rgba(0,0,0,0.16);
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .card__left , .card__right{
        display: flex;
        align-items: center;
      }
      .card__photo {
        display: inline-block;
        width: 35px;
        height: 35px;
        position: relative;
        margin-right: 10px;
      }
      .card__name , .card__post {
        display: inline-block;
        margin-right: 10px;
        font-size:16px;
        font-weight:400;
        color:rgba(51,51,51,1);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .right__arrow{
        width:7px;
        height:11px;
        margin-right: 2px;
      }
      .change__reason{
        background:#F5B739;
        text-align: center;
        width:33px;
        padding: 2px 4.5px;
        border-radius:2px;
        width:24px;
        font-size:12px;
        font-weight:400;
        line-height:35px;
        color:rgba(255,255,255,1);
        margin-right: 22.5px;
      }
    }
  }
  .card__end {
    display: flex;
    justify-content: flex-end;
    .view__more{
      background-color: transparent;
      text-align: right;
      font-size:13px;
      font-weight:bold;
      color:rgba(198,0,31,1);
      display: flex;
      align-items: center;
      border: none;
      padding: 5px 15px;

      img {
        width: 13px;
        height: 13px;
        background:rgba(247,247,247,1);
        margin-left: 4.5px;
      }
    }
  }

  .list__content.showMore {
    /*max-height: 285px;*/
    /*overflow: hidden; */
  }
  .list__content {
    background:rgba(255,255,255,1);
    padding: 0 13px 13px;
    .list {
      padding: 15px 0;
      border-top:1px solid rgba(219,219,219,1);
      display: flex;
      flex-direction: column;
      &:last-child {
        border-bottom:1px solid rgba(219,219,219,1);
      }
      .list__item {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        &:last-child {
          margin-bottom: 0;
        }
        .list__date{
          height:21px;
          font-size:15px;
          font-weight:400;
          line-height:21px;
          color:rgba(153,153,153,1);
        }
      }
      .traning__name , .list__name , .list__post {
        height: 23px;
        font-size:16px;
        font-weight:400;
        line-height:23px;
        color:rgba(51,51,51,1);
      }

      .right__arrow {
        width:7px;
        height:11px;
        margin-right: 2px;
      }

      .training__icon {
        width: 11px;
        height: 7px;
        display: block;
        transition: transform 0.4s ease;
        & > img {
          width: 100%;
          vertical-align: top;
        }
      }

      .training__icon.is-open {
        transform: rotateZ(180deg);
      }

      .training__list {
        position: relative;

      }

      .training__list-item {
        display: flex;
        width: 100%;
        align-items: center;
        height: 30px;
        &:nth-child(2n + 2) {
          background: #f7f7f7;
        }
        & > span {
          height:21px;
          font-size:15px;
          font-weight:400;
          line-height:21px;
          color: rgb(158, 158, 158);
        }
      }
    }
  }
  .rate__plate {
    display: flex;
    .rate__item {
      flex: 1;
      padding: 20px;
      border: 1px solid rgba(219,219,219,1);
      background-color: #ffffff;
      text-align: center;
      .rate__item__title {
        height: 23px;
        font-size:16px;
        font-weight:400;
        line-height:23px;
        color:rgba(0,0,0,1);
        margin-bottom: 18px;
      }
      .rate__item__rate {
        height: 23px;
        font-size:16px;
        font-weight:400;
        line-height:23px;
        color:rgba(198,0,31,1);
      }
    }
  }
  .gutter {
    height: 8px;

  }

  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding: 15px;
     background: rgba(245, 245, 245, 1);
  }
  .post {
    background: #f7f7f7;
    padding: 15px;
  }
  .post__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 19px 15px 19px 15px;
    position: relative;
    &.is-laave {
      .post__position,
      .post__name {
        color: #999999;
      }
    }
  }
  .post__name {
    font-size: 16px;
    line-height: 23px;
    color: rgba(68, 68, 68, 1);
  }
  .post__position {
    margin-top: 5px;
    font-size: 16px;
    line-height: 23px;
    color: rgba(68, 68, 68, 1);
  }

  .post__status {
    position: absolute;
    top: 0;
    right: 20px;
    width: 64px;
    height: 60px;
    & > img {
      width: 100%;
    }
  }
  .post__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }
  .no-course {
    text-align: center;
    color: #ccc;
    padding: 15px;
  }
}
</style>
s