<!-- 人员信息 -->
<template>
  <div class="employment">
    <div class="selectbar">
      <div class="selectbar__item selectbar__item--province"
        @click="handleBusinessTypePicker">
        <span class="selectbar__value">{{businessTypeLabel}}</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--province"
        @click="handlePostTypePicker">
        <span class="selectbar__value">{{postTypeLabel}}</span>
        <i class="section__icon"></i>
      </div>
    </div>
    <!-- 业务类型弹出层 -->
    <qw-picker
      v-model="isVisibleBusinessTypePicker"
      :data="businessType"
      @select="handleSelectBusinessPosType"
      :selected-index="selectedBusinessType">
    </qw-picker>
    <!-- 岗位类型弹出层 -->
    <qw-picker
      v-model="isVisiblePostTypePicker"
      :data="PostType"
      @select="handleSelectPosType"
      :selected-index="selectedPostType">
    </qw-picker>

    <div class="section">
      <content-title :name="'岗位配备'" :content="['更新日期：'+ (allocationDetail.updateTime || '暂无'),' 更新人：'+ (allocationDetail.updateUser || '暂无')]" :padding="'15px 0 15px'"></content-title>
      <div class="section__content">
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__value"><span>{{allocationDetail.allocationSum | formatData}}</span></p>
              <p class="cell__label">应配备人数</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value"><span>{{allocationDetail.actualAllocationSum | formatData}}</span></p>
              <p class="cell__label">实际人数</p>
            </div>
          </div>
        </div>
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__value"><span>{{allocationDetail.allocationRate | formatData}}</span></p>
              <p class="cell__label">在职率</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value"><span>{{allocationDetail.authRate | formatData}}</span></p>
              <p class="cell__label">认证率</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>
    <content-title :name="'在职人员'" :content="['更新日期：'+ (personData.updateTime || '暂无'),'更新人：'+ (personData.updateUser || '暂无')]" :padding="'15px'"></content-title>
      <div class="card__content"  :class="{'showMore' : isShowMore1}">
        <div class="card" @click="viewDetail(item)" v-for="item in personList">
          <div class="card__left">
            <img class="card__photo" :src="item.headPic || iconHeadPic">
            <span class="card__name" style="width:53px;">{{item.personName | formatData}}</span>
            <span class="card__post" style="width:96px;">{{item.position | formatData}}</span>
          </div>
          <div class="card__right">
            <span class="card__double__post" style="width:76px;">{{item.position2 || ' '}}</span>
            <img class="right__arrow" :src="iconArrowRight">
          </div>
        </div>
      </div>
      <div class="card__end" v-if="personList.length > 3">
        <button class="view__more" @click="handleViewMore('part1')">
          {{isPart1Show ? '收起' : '查看更多'}}
          <img :src="isPart1Show ? iconHideMore : iconShowMore" alt="">
        </button>
      </div>
      <div v-if="personList.length == 0" class="no-course">
        暂无在职人员信息
      </div>
      <div class="gutter"></div>
    <content-title :name="'变更记录'" :content="['更新日期：' + (changeData.updateTime || '暂无'),' 更新人：' + (changeData.updateUser || '暂无')]" :padding="'15px'"></content-title>
      <div class="card__content"   :class="{'showMore' : isShowMore2}">
        <div class="card" @click="viewTransfer(item)" v-for="item in changeList">
          <div class="card__left">
            <span class="card__name" style="width:53px;">{{item.name | formatData}}</span>
            <span class="card__post" style="width:96px;">{{item.afterPost || '-'}}</span>
          </div>
          <div class="card__right">
            <span class="change__reason" :class="[item.type != '调岗' ? 'change__bgcolor' : '']">{{item.type}}</span>
            <img class="right__arrow" :src="iconArrowRight">
          </div>
        </div>
      </div>
      <div class="card__end" v-if="changeList.length > 3">
        <button class="view__more" @click="handleViewMore('part2')">
          {{isPart2Show ? '收起' : '查看更多'}}
          <img :src="isPart2Show ? iconHideMore : iconShowMore" alt="">
        </button>
      </div>
      <div v-if="changeList.length == 0" class="no-course">
        暂无变更记录
      </div>
  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'  //右指向箭头
import iconShowMore from '@/module/channelManagement/static/images/icon_show_more.png' //查看更多图标
import iconHideMore from '@/module/channelManagement/static/images/icon_hide_more.png' //隐藏更多图标
import iconHeadPic from '@/module/channelManagement/static/images/profile-photo@2x.png' //头像图标
import SearchHeader from '@/module/channelManagement/components/SearchHeader'
import {
        getAllocationDetail,
        getPersonList,
        getChangeRecord,
        getAllPositionType,
        getPositionType
      } from '@/module/channelManagement/api/basic'
import noData from '@/module/channelManagement/components/noData'
import contentTitle from '@/module/channelManagement/components/contentTitle'

const POST_TYPE_LABEL = '岗位类型';
const BUSINESS_TYPE_LABEL = '业务类型';

export default {
  components: {
    SearchHeader,
    noData,
    contentTitle
  },
  data: function() {
    return {
      isLoading:false,
      iconHideMore,
      iconShowMore,
      iconArrowRight,
      iconHeadPic, //头像图标

      allocationDetail: {}, //岗位配备数据

      erpNo: '',
      isVisibleBusinessTypePicker: false,
      selectedBusinessType: [0],
      selectedBusinessTypeId: '',
      isVisiblePostTypePicker: false,
      selectedPostType: [0],
      selectedPostTypeId: '',
      isPart1Show: false,
      isPart2Show: false,
      businessType: [],//选择业务类型
      PostType: [], //选择岗位类型
      personData:{},//在职人员全部数据
      personList:[],//在职人员数据
      changeData:{},//变更记录全部数据
      changeList:[],//变更记录数据
      isShowMore1: true,
      isShowMore2: true,
      // part1数据
      postTypeLabel: POST_TYPE_LABEL,
      businessTypeLabel: BUSINESS_TYPE_LABEL,
      businessTypeValue: '',
      postTypeValue: '',
      businessTypeOptionIndex: [0]
    }
  },
  methods: {
    handleViewMore(part){  //改变查看更多状态
      if(part == 'part1'){
        this.isPart1Show = !this.isPart1Show  //控制按钮的显隐
        this.isShowMore1 = !this.isShowMore1  //控制是否展示更多
      }else{
        this.isPart2Show = !this.isPart2Show
        this.isShowMore2 = !this.isShowMore2  //控制是否展示更多
      }
    },

    handleBusinessTypePicker(){ //展开业务类型选择器
      this.isVisibleBusinessTypePicker = true
    },
    handlePostTypePicker(){ //展开岗位类型选择器
      this.isVisiblePostTypePicker = true
    },

    handleSelectPosType([value], [index]){
      this.isVisiblePostTypePicker = false;
      const option = this.PostType[0][index];
      this.postTypeLabel = option['text'];
      this.postTypeValue = option['value'];
      this.fetchEmployments()
    },

      loadPostTypeOptions(type){
          return  getPositionType({type: type}).then((data)=>{
              if(Array.isArray(data)){
                  const list = []
                  data.forEach((item)=>{
                    // 隐藏 经销商重点岗位
                    if (item !== '经销商重点岗位') {
                      // console.log(item)
                      list.push({
                        text: item,
                        value: item
                      })
                    }
                  })
                  console.log(list)
                  this.PostType = [list];
                  if(list.length && list[0]){
                      this.postTypeValue = list[0].value;
                      this.postTypeLabel = list[0].text;
                  }
              }else{
                  this.PostType = [];
              }
          })
      },

    handleSelectBusinessPosType([value], [index]){
      this.isVisibleBusinessTypePicker = false;
      const option = this.businessType[0][index];
      this.businessTypeLabel = option['text'];
      this.businessTypeValue = option['value'];
      this.loadPostTypeOptions(this.businessTypeLabel).then(()=>{
          this.fetchEmployments()
      })

    },
    viewDetail(item) { //查看在职人员
      const queryParams = Object.assign({}, this.$route.query,{item});
      this.$router.push({ name: 'employmentDetail', query: queryParams })
    },
    viewTransfer(item){ //查看变更记录
      const queryParams = Object.assign({}, this.$route.query,{item});
      this.$router.push({ name: 'employmentTransfer', query: queryParams })
    },
    handlePickType() {
        /**
         * @see https://tqy.do1.net.cn/Qw/wap/#/zh-CN/action-sheet
         */
      this.$actionsheet({
        title: '岗位类型',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '关键岗位'
          },
          {
            value: '5',
            label: '核心业务岗位'
          },
          {
            value: '6',
            label: '一般业务岗位'
          },
          {
            value: '2',
            label: '业务岗位'
           },
            {
            value: '7',
            label: '认证岗位'
           }
        ]
      })
        .then(({ action, item }) => {
          this.type = item.value;
          this.typeName = item.label;
          this.fetchEmployments();
        })
        .catch(() => {})
    },
    fetchEmployments(){
      let _this = this
      const params = {
        erpNo: this.erpNo, // 测试用例 erpNo: '17793',
        postType: this.postTypeValue,//岗位类型
        busType: this.businessTypeValue,//业务类型
      }
      const p1 = getAllocationDetail(params).then(data => { //获取岗位配备数据
        if(data){
          this.allocationDetail = data.allocationDetail
        }
      })
      const p2 = getPersonList(params).then(data => { //获取在职人员数据
        if(data){
          this.personData = data.personData
          this.personList = this.personData.personList
        }
      })
      Promise.all([p1,p2]).finally(() => {
        _this.isLoading = false;
      })
    },
    init(){
      this.isLoading = true;


      const businessTypePromise = getAllPositionType({postType: 1 , type: 1}).then(data => { // 获取业务分类
        const list =  data.map((item)=> ({
          text: item.name,
          value: item.id
        })).filter((item)=> item.text !== '营销公司')
        this.businessType = [list];

        // if(list.length && list[0]){
        //     this.businessTypeValue = list[0].value;
        //     this.businessTypeLabel = list[0].text;
        // }
        // 默认显示销售
        const defaultOption = list.find(item=>item.text === '销售')
          if(defaultOption){
              this.businessTypeValue = defaultOption.value;
              this.businessTypeLabel = defaultOption.text;
              const index = list.indexOf(defaultOption)
              this.selectedBusinessType = [index];
          }

        return this.businessTypeLabel;
      })

      const postTypePromise = businessTypePromise.then((type)=>{
          if(type){
              return this.loadPostTypeOptions(type)
          }else{
              return Promise.reject(new Error('缺少业务类型'));
          }
      })

        postTypePromise.then(()=>{
            this.fetchEmployments();
        })


      // Promise.all([p1,p2]).then(()=>{
      //   if(this.PostType.length && this.PostType[0][0]){
      //       this.postTypeValue = this.PostType[0][0].value;
      //       this.postTypeLabel = this.PostType[0][0].text;
      //   }
      //   if(this.businessType.length && this.businessType[0][0]){
      //       this.businessTypeValue = this.businessType[0][0].value;
      //       this.businessTypeLabel = this.businessType[0][0].text;
      //   }
      //
      // })

      getChangeRecord({erpNo: this.erpNo}).then(data => { //获取变更记录数据
        if(data){
          this.changeData = data.changeData
          this.changeList = data.changeData.changeList
        }
      })
    }
  },
  filters:{
    formatData(value){
      if(value){
        return value;
      }else{
        return typeof value === 'number'? value : '-'
      }
    }
  },
  created() {
    this.isLoading = true
    this.erpNo = this.$route.query.erpCarNo;
    const dealerId = this.$route.query.dealerId
    this.init()
  },
}
</script>

<style lang="scss" scoped>
.employment {
  margin-bottom: 50px;
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
  .search {
    background: #ffffff;
  }
  .selectbar {
    background: #ffffff;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-around;
    position: relative;
    .selectbar__item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-basis: 150px;
      flex-shrink: 0;
      text-align: center;
      display: flex;
      justify-content: center;
      .selectbar__value {
        height: 21px;
        font-size: 15px;
        font-weight: 400;
        line-height: 22px;
        color: rgba(0, 0, 0, 1);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
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
    padding: 0 15px;
    background: #ffffff;
    .section__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .section__title {
        height: 24px;
        font-size: 17px;
        font-weight: 600;
        line-height: 24px;
        color: rgba(0, 0, 0, 1);
      }
    }
    .section__content {
      .section__row {
        display: flex;
        padding-bottom: 15px;
        .section__col {
          margin-right: 15px;
          width: 100%;
          &:last-child {
            margin-right: 0;
          }
        }
        .cell {
          background: rgba(247, 248, 250, 1);
          padding: 12px 31px;
          .cell__value {
            height: 21px;
            font-size: 15px;
            font-weight: 600;
            line-height: 21px;
            color: rgba(10, 23, 53, 1);
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            .cell__symbol {
              height: 19px;
              font-size: 13px;
              line-height: 19px;
              font-weight: 400;
              color: rgba(153, 153, 153, 1);
              margin-left: auto;
              vertical-align: middle;
            }
          }
          .cell__label {
            height: 19px;
            font-size: 13px;
            font-weight: 500;
            line-height: 19px;
            color: rgba(178,185,200,1);
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
    padding: 15px 15px 0;
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
      .card__double__post{
        display: inline-block;
        margin-right: 10px;
        height: 35px;
        font-size:14px;
        font-weight:400;
        line-height:35px;
        color:rgba(51,51,51,1);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .change__reason{
        background:#F5B739;
        text-align: center;
        padding: 2px 4.5px;
        border-radius:2px;
        font-size:12px;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin-right: 22.5px;
      }
      .change__bgcolor{
        background: #C6001F;
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
