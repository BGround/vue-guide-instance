<template>
  <div class="city-info ">

      <div class="map" v-if="businessDistrictInfo.enclosure">
        <img :src="getImage" alt="" @click="previewImage(getImage)">
      </div>
      <noData :visible="!isVisible &&!businessDistrictInfo.enclosure" message="" />

      <div class="gutter"></div>

    <template v-if="isNonEmptyObject(cityInfo)">

      <div class="card admin">
        <div class="card__title bl">
          <div class="card__title__text">行政信息</div>
          <div class="card__title__desc">
            <span class="desc__date">更新日期：{{cityInfo.updateTime || '暂无'}}</span>
            <span class="desc__department">更新人：{{cityInfo.updateUser|| '暂无'}}</span>
          </div>
        </div>
        <div class="card__content">

          <div class="subtitle">
            <div class="subtitle__text">·行政区域</div>
            <div class="location">
              <i class="location__icon">
                <img :src="iconLocation" alt="">
              </i>
              <span class="location_name">{{cityInfo.planProvinces|| '暂无'}} | {{cityInfo.planCity|| '暂无'}}</span>
            </div>
          </div>
          <div class="field">
            <div class="field__value">
              {{cityInfo.administrativeRegion|| '暂无'}}
            </div>
          </div>

          <div class="field">
            <div class="field__label">
              ·面积
            </div>
            <div class="field__value">
              {{cityInfo.administrativeArea|| '暂无'}}
  <!--            （2016年数据）-->
            </div>
          </div>

          <div class="field">
            <div class="field__label">
              ·常驻人口
            </div>
            <div class="field__value">
              {{cityInfo.administrativePopulation? `${cityInfo.administrativePopulation}`: '暂无'}}
  <!--            （2017年数据）-->
            </div>
          </div>

          <div class="field">
            <div class="field__label">
              ·GDP总值
            </div>
            <div class="field__value">
              {{cityInfo.administrativeGdp? `${cityInfo.administrativeGdp}` :'暂无'  }}
  <!--            （2017年数据）-->
            </div>
          </div>

          <div class="field">
            <div class="field__label">
              ·当地经济支柱
            </div>
            <div class="field__value">
              {{cityInfo.localEconomicPillar|| '暂无'}}
            </div>
          </div>

          <div class="field">
            <div class="field__label">
              ·特殊行业政策
            </div>
            <div class="field__value">
              {{cityInfo.specialIndustryPolicy|| '暂无'}}
            </div>
          </div>


        </div>

      </div>

      <div class="gutter"></div>


      </template>
      <template v-if="isNonEmptyObject(businessDistrictInfo)">

      <div class="card">
        <div class="card__title bl">
          <div class="card__title__text">城市商圈</div>
          <div class="card__title__desc">
            <span class="desc__date">更新日期：{{tradingInfoVo.updateTime || '暂无'}}</span>
            <span class="desc__department">更新人：{{tradingInfoVo.updateUser|| '暂无'}}</span>
          </div>
        </div>
        <div class="card__content">

          <div class="subtitle">
            <div class="subtitle__text">·商圈介绍</div>
          </div>
          <div class="field">
            <div class="field__value">
              <p v-if="businessDistrictInfo.tradingDesc" v-html="businessDistrictInfo.tradingDesc"></p>
              <p v-else>暂无</p>
            </div>
          </div>

          <div class="subtitle">
            <div class="subtitle__text">·商圈信息</div>
            <div class="marker" :class="{'no-padding':businessDistrictCount<10}">{{businessDistrictCount || 0}}</div>
          </div>


        </div>

      </div>

    </template>

    <div class="districts" v-if="businessDistrictDetailList.length">

      <div class="districts__item" v-for="(item,index) in businessDistrictDetailList" :key="index"  @click="handleClickItem(item)">
        <div class="districts__info">
          <h4 class="districts__name">
            <span>{{item.tradingName || '暂无'}}</span>
            <span>TOP{{index+1}}</span>
          </h4>
          <p class="districts__address">{{item.tradingAddress || '暂无'}}</p>
        </div>
        <div class="districts__arrow" >
<!--          <img :src="iconArrowRight"  alt="">-->
        </div>
      </div>

    </div>

    <noData style="paddingTop: 20vh" :visible="isVisible"></noData>

    <qw-popup :disable-scroll="false" v-model="isVisibleDetail" position="center">
      <div class="detail">

        <h4 class="detail__title">{{dialogTitle}}</h4>
        <div class="detail__content">
            <div class="detail__item">
              <img class="detail__item__icon" :src="iconDistrictShare" alt="">
              <span class="detail__item__label">商圈销量占比：</span>
              <span class="detail__item__value">{{currentDetail.sales || 0}}%</span>
            </div>


          <div class="detail__item">
            <img class="detail__item__icon" :src="iconBrandShare" alt="">
            <span class="detail__item__label">进驻品牌总数：</span>
            <span class="detail__item__value">{{currentDetail.garrisonOneNum || '暂无'}}</span>
          </div>

          <div class="detail__item">
            <img class="detail__item__icon" :src="iconLabel" alt="">
            <span class="detail__item__label">进驻品牌：</span>
            <span class="detail__item__value">
              {{currentDetail.oneGarrisonBrand|| '暂无'}}
            </span>
          </div>

          <div class="detail__item">
            <img class="detail__item__icon" :src="iconStore" alt="">
            <span class="detail__item__label">奇瑞一网：</span>
            <span class="detail__item__value">
              {{currentDetail.oneEnt|| '暂无'}}
            </span>
          </div>

          <div class="detail__item">
            <img class="detail__item__icon" :src="iconStore" alt="">
            <span class="detail__item__label">奇瑞城市展厅：</span>
            <span class="detail__item__value">
              {{currentDetail.cityShowroom|| '暂无'}}
            </span>
          </div>
        </div>

      </div>
    </qw-popup>

  </div>
</template>

<script>


import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import noData from '@/module/channelManagement/components/noData';
import iconLocation from '@/module/channelManagement/static/images/icon_location.png'
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import iconDistrictShare from '@/module/channelManagement/static/images/icon_brand_share.png'
import iconLabel from '@/module/channelManagement/static/images/icon_label.png'
import iconStore from '@/module/channelManagement/static/images/icon_store.png'
import iconBrandShare from '@/module/channelManagement/static/images/icon_brand_share.png'
import  * as developmentApi from '@/module/channelManagement/api/development/index'

export default {
  name: 'CityInfo',
  mixins:[reloadApp],
  components:{
    noData
  },
  data() {
    return {
      iconArrowRight:iconArrowRight,
      dealerId: '',
      iconLocation:iconLocation,
      isVisibleDetail: false,
      iconDistrictShare,
      iconLabel,
      iconStore,
      iconBrandShare,
      dialogTitle: '',

        cityInfo:{
            // administrativeArea: '', //	行政面积
            // administrativeCentre: '', //	行政中心
            // administrativeGdp: '', //	GDP(亿元)
            // administrativePopulation: '', //	常驻人口(万人)
            // administrativeRegion: '', //	行政区域
            // localEconomicPillar: '', //	当地经济支柱
            // planCity: '', //	城市
            // planProvinces: '', //	省份
            // remark: '', //	备注
            // specialIndustryPolicy: '', //	特殊行业政策
            // updateTime: '', //	更新时间
            // updateUser: '', //	更新人
        },

        businessDistrictInfo:{ // 商圈信息
            // city: "",
            // cityCode: "",
            // enclosure: "",
            // id: "",
            // province: "",
            // provinceCode: "",
            // tradingDesc: "",
            // tradingDescText: ""
        },

        businessDistrictCount: 0,

        businessDistrictDetailList:[],

        currentDetail:{

        },

        tradingInfoVo: {}

    }
  },
    computed:{
      isVisible(){

          return !this.isLoading &&
              !this.isNonEmptyObject(this.cityInfo) &&
              !this.isNonEmptyObject(this.businessDistrictInfo) &&
              !this.businessDistrictDetailList.length
      },
        getImage(){
          return this.businessDistrictInfo.enclosure? _.fileDownURL + this.businessDistrictInfo.enclosure: '';
        }
    },
  methods: {

      isNonEmptyObject(target) {
          const isObject =
              Object.prototype.toString.call(target) === '[object Object]'
          return isObject && !!Object.keys(target).length
      },

      handleClickItem(item){
          this.dialogTitle =  item.tradingName ||  '';
        this.$set(this, 'currentDetail', item);
        this.isVisibleDetail = true;
      },


      previewImage(url){
          this.$imagePreview({
              initialIndex: 0,
              urls: [url]
          });
      },

      /**
       *城市介绍-行政信息
       */
      getCityInfoAdministrative(dealerId){
          developmentApi.getCityInfoAdministrative({dealerId}).then((data)=>{
              this.cityInfo = data && data.planCityImportVO ?data.planCityImportVO: {}
          })
      },

      /**
       *
       */
      getCityInfoByBusinessInfo(dealerId){
          developmentApi.getCityInfoByBusinessInfo({dealerId}).then((data)=>{
              console.log(data)
              this.businessDistrictCount = data && data.tradingInfoVo && data.tradingInfoVo.count ? data.tradingInfoVo.count: 0;
              this.businessDistrictDetailList = data &&  data.tradingInfoVo && data.tradingInfoVo.detailPOList ? data.tradingInfoVo.detailPOList : [];
              this.businessDistrictInfo = data && data.tradingInfoVo && data.tradingInfoVo.infoPO ? data.tradingInfoVo.infoPO: {};
              this.tradingInfoVo =  data && data.tradingInfoVo && data.tradingInfoVo ? data.tradingInfoVo : {};
          })
      }

  },

    watch:{
        '$route.query'(query){
            this.dealerId = query.dealerId;
            this.getCityInfoAdministrative(this.dealerId)
            this.getCityInfoByBusinessInfo(this.dealerId);
        }
    },

  created() {
      this.dealerId = this.$route.query.dealerId;
      this.getCityInfoAdministrative(this.dealerId)
      this.getCityInfoByBusinessInfo(this.dealerId);
    //
    // this.dealerId = this.$route.query.dealerId;
    // this.currentCityName = this.$route.query.city || '暂无'
    // if(this.dealerId && this.currentCityName){
    //   this.initYearTabsData();
    // }else{
    //   this.reloadApp();
    // }

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.city-info {
  padding-bottom: 50px;
  /*background: #fff;*/
  .map {
    width: 100%;
    position: relative;
    img{
      width: 100%;
    }
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .admin{

  }

  .bl{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      height: 1px;
      left: 15px;
      right: 15px;
      transform: scaleY(0.5);
      background: #D0D0D0;
    }
  }

  .card{
    background: #ffffff;
  }

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
    }
  }

  .subtitle{
    padding: 16px 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

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
      &.no-padding{
        padding: 0;
      }
    }


    .location{
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
      display: flex;
      align-items: center;
      .location__icon{
        width: 15px;
        height: 15px;
        margin-right: 10px;
        &>img{
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
    }
  }

  .subtitle__text{
    height:14px;
    font-size:14px;
    font-weight:bold;
    line-height:14px;
    color:rgba(198,0,31,1);
  }

  .card__content{
    padding: 0 20px 4px;
  }

  .field__label{
    height:20px;
    font-size:14px;
    font-weight:400;
    line-height:20px;
    color:rgba(153,153,153,1);
    margin-bottom: 5px;
  }

  .field__value{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px rgba(0,0,0,0.16);
    margin-bottom: 6px;
    font-size:14px;
    font-weight:400;
    line-height:24px;
    color:rgba(112,112,112,1);
    padding: 9px 10px 3px;
    border-radius: 4px;
  }

  .districts{
    background: #F7F7F7;
    padding:10px 10px;
  }



  .districts__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 18px 15px 16px;
    margin-bottom: 10px;
  }

  .districts__info{
    flex-grow: 1;
  }
  .districts__name {
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 26px;
    font-family: Helvetica;
  }
  .districts__address {
    margin-top: 5px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
  }
  .districts__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }

  .detail{
    width:85%;
    margin: 0 auto;
    height:337px;
    background:rgba(255,255,255,1);
    padding: 16px 13px 30px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .detail__title{
    height:28px;
    font-size:20px;
    font-weight:400;
    line-height:24px;
    color:rgba(51,51,51,1);
  }

  .detail__content{
    margin-top: 10px;
    vertical-align: top;
    font-size:15px;
    font-weight:400;
    line-height:34px;
    color:#666666;
    margin-left: 20px;
    .detail__item__value{
      color: #333333;
    }
    .detail__item{
      position: relative;
    }
    .detail__item__icon{
      width: 14px;
      height: 14px;
      position: absolute;
      top: 10px;
      left: -20px;
    }
  }


}
</style>
