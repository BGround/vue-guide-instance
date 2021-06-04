<template>
    <div class="city-detail">

      <div class="demo-slide-container" style="background: #ffffff;">
        <qw-slide :data="banners"></qw-slide>
      </div>


      <div class="search">

        <qw-tabs v-model="searchType">
          <qw-tab-pane value="city" label="搜索城市"></qw-tab-pane>
          <qw-tab-pane value="dealer" label="搜索经销商"></qw-tab-pane>
          <qw-tab-pane value="erp" label="搜索ERP号" ></qw-tab-pane>
        </qw-tabs>
        <cherySearch
                :departmentName="departmentName"
                @select="handleSelectDealer"
                @pick="handlePickDepartment"
                @confirm="handleConfirmDepartment"
                :placeholder="searchType==='city'?'搜索城市':'搜索经销商名称、ERP号'"
                :type="searchType"
                v-model="city">
        </cherySearch>
      </div>

      <div v-if="enclosure" class="picture">
        <img :src="enclosure"  @click="previewImage(enclosure)" alt="">
      </div>

      <div class="gutter"></div>

      <div class="card info">
        <div class="card__title bl">
          <div class="title title-left">
            <div class="title__icon"><img :src="iconMap" alt=""></div>
            <div class="card__title__text">商圈信息</div>
          </div>
          <div class="title title-right">
            <div class="title__location"><img :src="iconLocation" alt=""></div>
            <div class="title__city">{{departmentName}}</div>
          </div>
        </div>

        <div class="card__content">
          <p v-if="tradingDesc" v-html="tradingDesc"></p>
          <p v-else>暂无</p>
        </div>
      </div>

      <div class="gutter"></div>


      <div class="card">
        <div class="card__title ">
          <div class="title title-left">
            <div class="title__icon"><img :src="iconCalendar" alt=""></div>
            <div class="card__title__text">当年一网规划</div>
          </div>
        </div>

        <div class="grids">
          <div class="grids__item">
            <div class="grids__item__label">规划数量</div>
            <div class="grids__item__value">{{planNumber }}</div>
            <img :src="iconDevelopment" alt="">
          </div>

          <div class="grids__item">
            <div class="grids__item__label">在运营店</div>
            <div class="grids__item__value">{{nowOperatingShop }}</div>
            <img :src="iconOperation" alt="">
          </div>

          <div class="grids__item">
            <div class="grids__item__label">在建设店</div>
            <div class="grids__item__value">{{nowBuildShop }}</div>
            <img :src="iconBuilding" alt="">
          </div>
        </div>

        <div class="card__title has-marker">
          <div class="card__title__text">当年度开发进展</div>
          <div class="marker" v-show="planDevNumber" :class="{noPadding: planDevNumber< 9}">{{planDevNumber}}</div>
        </div>

        <div class="progress">
          <qw-progress
                  type="line"
                  :percentage="getPercentage"
                  linecap="butt"
                  :stroke-width="24"
                  color="#5294FF"
                  border-color="#C6001F"
                  :transition="false"
                  :active="false"
                  :show-text="false">
          </qw-progress>
          <div class="message">规划类型：{{planType}}</div>
          <div class="legend">
            <div class="legend__item">
              <i class="legend__item__color"></i>
              <span class="legend__item__text">完成数量<span>{{completedNum}}</span></span>
            </div>
            <div class="legend__item">
              <i class="legend__item__color red"></i>
              <span class="legend__item__text">剩余计划<span>{{remainingPlans}}</span></span>
            </div>
          </div>

        </div>

      </div>

      <div class="gutter"></div>

      <div class="scroll-list-wrap">
        <ProfileItem v-for="(item, index) in dealerList"
                     :key="index"
                     @click="handleClickProfile(item)"
                     :data="convertDealerData(item)">
        </ProfileItem>

        <infinite-loading v-if="isUpdate" @infinite="infiniteHandler">
          <div slot="spinner"
               class="more">
            <p>查看更多</p><i class="more__icon"></i>
          </div>
          <div slot="no-more"
               class="more">
            <p>没有更多了</p>
          </div>
          <div slot="no-results">
            <p>暂无数据</p>
          </div>
        </infinite-loading>
      </div>

    </div>
</template>

<script>

    import iconLocation from '@/module/channelManagement/static/images/icon_location.png'
    import iconMap from '@/module/channelManagement/static/images/icon_map.png'
    import iconCalendar from '@/module/channelManagement/static/images/icon_calendar.png'
    import iconDevelopment from '@/module/channelManagement/static/images/icon_development.png'
    import iconBuilding from '@/module/channelManagement/static/images/icon__building.png'
    import iconOperation from '@/module/channelManagement/static/images/icon_op.png'
    import cherySearch from '@/module/channelManagement/components/chery-search';
    import * as homeApi from '@/module/channelManagement/api/home';
    import * as utils from "@/module/channelManagement/js/utils";
    import ProfileItem from '@/module/channelManagement/components/ProfileItem'
    import {searchDealerPagerByKey} from "@/module/channelManagement/api/development";

    export default {
        name: "cityDetail",
        components: {
            cherySearch,
            ProfileItem
        },
        filters:{
            defaultValue(value){
                if(value){
                    return value;
                }else{
                    return value === 0? 0: '-';
                }
            }
        },
        data() {
            return {
                city: '',
                searchType: 'city',
                banners:[
                ],
                iconLocation,
                iconMap,
                iconCalendar,
                iconDevelopment,
                iconBuilding,
                iconOperation,
                tradingDesc: '',
                planNumber: '', //	规划数量
                nowOperatingShop: '', //	运营店
                nowBuildShop: '', //	在建店
                planDevNumber: '', //	开发计划数量
                planDevType: '', //	开发计划类别
                completedNum: '', //	完成数量
                remainingPlans: '', //	剩余计划
                departmentName: '',
                departmentId: '',
                enclosure: '',
                dealerList: [],
                page: 1,
                planType: '暂无',
                isUpdate: true,
            }
        },
        props: {},
        computed:{
          getPercentage(){
              const completedNum = parseInt(this.completedNum) || 0;
              const remainingPlans = parseInt(this.remainingPlans) || 0;
            const total = completedNum + remainingPlans;
            if(total){
               return completedNum / total *100;
            }
            return 0
          }
        },
        methods: {

          previewImage(url){
              this.$imagePreview({
                  initialIndex: 0,
                  urls: [url]
              });
          },

          getbannerImage(){
              homeApi.getbannerImage().then((data)=>{
                  if(data && data.map && data.map.list){
                      this.banners = data.map.list.filter(item=>!!item.imageUrl).map(item => _.fileDownURL + item.imageUrl);
                  }else{
                      this.banners = []
                  }
              })
          },

          getCityDetails(cityName){
            homeApi.getCityDetails({cityName}).then((data)=>{
              this.tradingDesc = data && data.map && data.map.tradingDesc ? data.map.tradingDesc: '';
              const build = (data && data.map && data.map.yearCityDetails)? data.map.yearCityDetails : null;
              this.planNumber = build && build.planNumber ? build.planNumber : ''; //	规划数量
              this.nowOperatingShop = build && build.nowOperatingShop ? build.nowOperatingShop : ''; //	运营店
              this.nowBuildShop = build && build.nowBuildShop ? build.nowBuildShop : ''; //	在建店
              this.planDevNumber = build && build.planDevNumber ? build.planDevNumber : ''; //	开发计划数量
              this.planDevType = build && build.planDevType ? build.planDevType : ''; //	开发计划类别
              this.completedNum = build && build.completedNum ? build.completedNum : ''; //	完成数量
              this.remainingPlans = build && build.remainingPlans ? build.remainingPlans : ''; //	剩余计划
              this.enclosure = data && data.map && data.map.enclosure ? _.fileDownURL+ data.map.enclosure: '';
              this.planType = build && build.planType ? build.planType : '暂无'; //	剩余计划
            })
          },

          handleConfirmDepartment({departmentName,departmentId}){
              // this.departmentName = departmentName;
              // this.getCityDetails(departmentName);
              // this.page =1
              // this.dealerList = [];
              // this.departmentId = departmentId;
              // this.fetchDealerList()
          },

          /**
           * 处理选择经销商
           */
          handleSelectDealer(dealer){
              this.$router.push({
                  name: 'dealerDetail',
                  query:{
                      dealerFullName:dealer.dealerFullName || '',
                      dealerId: dealer.id || '',
                      storeImg: dealer.storeImg || '',
                      erpCarNo: dealer.erpCarNo || '',
                  }
              })
          },

            handleClickProfile(detail) {
                this.$router.push({
                    name: 'dealerDetail',
                    query: {
                        storeImg: detail.storeImg,
                        dealerFullName: detail.dealerFullName || '',
                        dealerId: detail.id || '',
                        erpCarNo: detail.erpCarNo || '', //整车ERP
                    },
                    params: {

                    }
                })
            },

            convertDealerData(item) {
                return {
                    id: item.id,
                    avatar: item.storeImg ? _.compressURL + item.storeImg : '',
                    name: item.dealerFullName,
                    address: item.companyAddress,
                    status: item.operatingState,
                    nature: item.nature
                }
            },

            /**
             *
             * @return {Promise<* | void>}
             */
            fetchDealerList() {
                const params = {
                    page: this.page,
                    pageSize: 20,
                    'searchValue.departmentId': this.departmentId,
                    'searchValue.keyWord': '',
                    'searchValue.status': ''
                }
                return searchDealerPagerByKey(params).then(data => {
                    if (data) {

                        if(data.maxPage >= this.page){
                            const list = data.pageData || []
                            this.dealerList = this.dealerList.concat(list)
                        }

                        if (data.maxPage < this.page) {
                            return { isDone: true }
                        } else {
                            return { isDone: false }
                        }
                    } else {
                        return { isDone: true }
                    }
                })
            },

            infiniteHandler($state) {
                this.fetchDealerList().then(({ isDone }) => {
                    if (isDone) {
                        $state.complete()
                    } else {
                        $state.loaded()
                        this.page = this.page + 1
                    }
                })
            },

            handlePickDepartment(department){
                this.$router.push({
                    query: {
                        departmentName: department.departmentName,
                        departmentId: department.id
                    }
                })
            },

            forceUpdateList(){
                this.page = 1;
                this.dealerList = [];
                this.isUpdate = false;
                this.$nextTick(()=>{
                    this.isUpdate = true;
                })
            },

            init(){
                const {departmentName='', departmentId=''} = this.$route.query;
                this.departmentName = departmentName;
                this.departmentId = departmentId;
                this.getCityDetails(departmentName);
                this.forceUpdateList();
            }
        },
        watch:{
            '$route.query': function(){
                this.init()
            }
        },
        created() {
          this.getbannerImage();
          this.init()
        }
    }
</script>

<style scoped lang="scss">

  .bl{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      height: 1px;
      left: 7px;
      right: 7px;
      transform: scaleY(0.5);
      background: #D0D0D0;
    }
  }

  /deep/{
    .qw-slide-item{
      line-height: 0;
      img{
        width: 100%;
        height: 170px;
        object-fit: cover;
      }
    }
  }

  .marker{
    height:22px;
    background:rgba(198,0,31,1);
    border-radius: 11px;
    font-size:14px;
    font-weight:400;
    line-height:22px;
    min-width: 22px;
    text-align: center;
    padding: 0 3px;
    color:rgba(255,255,255,1);
    margin-left: 5px;
    &.noPadding{
      padding: 0;
    }
  }

  .city-detail{


    .gutter{
      height:8px;
      background:rgba(245,245,245,1);
    }

    .picture{
      width: 100%;
      img{
        width: 100%;
        object-fit: cover;
      }
    }

    .card{
        background: #ffffff;
        .card__title{
          display: flex;
          height: 48px;
          align-items: center;
          justify-content: space-between;
          padding: 0 7px;
          &.has-marker{
            justify-content: normal;
          }
          .title-left{
            height: 48px;
            display: flex;
            align-items: center;
            .title__text{
              height:24px;
              font-size:17px;
              font-weight:600;
              line-height:24px;
              color:rgba(0,0,0,1);
            }
          }
          .title-right{
            height: 48px;
            align-items: center;
            display: flex;
            .title__location{
              width: 15px;
              height: 15px;
              margin-right: 4px;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .title__city{
              height:21px;
              font-size:15px;
              font-weight:bold;
              line-height:21px;
              color:rgba(0,0,0,1);
            }
          }

          .title__icon{
            width: 40px;
            height: 40px;
            margin-right: 12px;
            img{
              width: 120%;
              height: 120%;
            }
          }

          .card__title__text{
            height:24px;
            font-size:17px;
            font-weight:600;
            line-height:24px;
            color:rgba(0,0,0,1);
          }
        }

      &.info{
        .card__content{
          padding: 13px 7px 21px;
          font-size:14px;
          font-weight:400;
          line-height:24px;
          color:rgba(51,51,51,1);
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


    .search{
      height:79px;
      background: rgba(198, 0, 31, 0.11);
      /deep/ {
        .qw-tab-bar__wrapper{
          height: 33px;
        }
        .qw-tab-pane{
          padding: 0;
        }
        .qw-tab-bar{
          height: 33px;
          background: rgba(198, 0, 31, 0);
        }
        .qw-tabs__wrapper{
          border-top: none;
        }
        .header{
          background: rgba(198, 0, 31, 0);
        }
        .qw-search-bar{
          background:rgba(240,240,240,1);
        }
        .qw-tab-bar__pane{
          color:rgba(153,153,153,1);
        }
        .qw-tab-bar__pane.is-active{
          color:rgba(0,0,0,1);
          font-weight:600;
        }
        .qw-tab-bar__slider{
          background-color: rgba(198, 0, 31, 1);
        }

      }
    }

    /deep/{
      .qw-slide-item{
        line-height: 0;
        img{
          width: 100%;
        }
      }

      .qw-progress--line{
        width: 100%;
      }
      .qw-progress__outer{
        width: 100% !important;
      }
    }


  }

</style>
