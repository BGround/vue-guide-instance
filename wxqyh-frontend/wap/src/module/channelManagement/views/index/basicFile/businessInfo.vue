<!-- 工商信息 -->
<template>
  <div class="basic-info">
    <template>
      <content-title class="title_border"
        name="通讯联络信息"
        :content="['更新日期：'+ (contactInfo.updateTime||'暂无'),'更新人：' + (contactInfo.updateUser||'暂无')]"
        padding="9px 7px 9px 15px">
      </content-title>
      <div class="panel">
        <div class="panel__content">
          <div class="panel__line">
            <div class="panel__label">法人姓名</div>
            <div class="panel__description">
              <span class="firstname" v-if="contactInfo.legalRepresentativeName&&contactInfo.legalRepresentativeName.length>0">{{ contactInfo.legalRepresentativeName.split('')[0] }}</span>
              {{ contactInfo.legalRepresentativeName||'-' }}
            </div>
          </div>
          <div class="panel__line">
            <div class="panel__label">性别</div>
            <div class="panel__description">{{ contactInfo.legalRepresentativeSex||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">手机</div>
            <div class="panel__description">{{ contactInfo.legalRepresentativePhone||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">职务</div>
            <div class="panel__description">{{ contactInfo.legalRepresentativePost||'-' }}</div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <content-title style="margin-top: 8px"
        class="title_border"
        name="基本信息"
        :content="['更新日期：'+(baseInfo.updateTime||'暂无'),'更新人：'+(baseInfo.updateUser||'暂无')]"
        padding="9px 7px 9px 15px">
      </content-title>
      <div class="panel">
        <div class="panel__content">
          <div class="panel__title">主营业务</div>
          <div class="panel__detail">{{ baseInfo.mainBusiness||'-' }}</div>
        </div>
        <div class="panel__content">
          <div class="panel__title">经营品牌</div>
          <div class="panel__detail">一级：{{ baseInfo.oneBrandManagement||'-' }}</div>
          <div class="panel__detail">二级：{{ baseInfo.twoBrandManagement||'-' }}</div>
        </div>
        <div class="panel__content">
          <div class="panel__title" style="margin-bottom: 8px">企业信息</div>
          <div class="panel__line">
            <div class="panel__label">大区</div>
            <div class="panel__description">{{ baseInfo.deptFullName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">省份</div>
            <div class="panel__description">{{ baseInfo.provinceName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">城市</div>
            <div class="panel__description">{{ baseInfo.cityName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">ERP号</div>
            <div class="panel__description">{{ baseInfo.erpCarNo||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">4S店名称</div>
            <div class="panel__description">{{ baseInfo.dealerShortName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">组织机构代码证</div>
            <div class="panel__description">{{ baseInfo.organizationCode||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">注册资本</div>
            <div class="panel__description">{{ baseInfo.registerCapital||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">4S店地址</div>
            <div class="panel__description">{{ baseInfo.salesStoreAddress||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">服务站名称</div>
            <div class="panel__description">{{ baseInfo.serviceStationName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">服务站地址</div>
            <div class="panel__description">{{ baseInfo.serviceStationAddress||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">销售热线</div>
            <div class="panel__description">{{ baseInfo.salesPhone||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">销售服务合作模式</div>
            <div class="panel__description">{{ baseInfo.salesServiceType||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">店厂分离情况</div>
            <div class="panel__description">{{ baseInfo.factorySeparationDesc||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">店厂分离距离</div>
            <div class="panel__description">{{ baseInfo.factorySeparationDistance||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">服务热线</div>
            <div class="panel__description">{{ baseInfo.serviceStationPhone||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">集团归属</div>
            <div class="panel__description">{{ baseInfo.belongGroup||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">邮政编码</div>
            <div class="panel__description">{{ baseInfo.postalCode||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">服务站公司全称</div>
            <div class="panel__description">{{ baseInfo.serviceStationFullName||'-' }}</div>
          </div>
          <div class="panel__line">
            <div class="panel__label">维修资质类别</div>
            <div class="panel__description">{{ baseInfo.repairLevel||'-' }}</div>
          </div>
        </div>
      </div>
    </template>

    <template>
      <content-title style="margin-top: 8px"
        name="开票信息"
        :content="['更新日期：'+(billingInfo.updateTime||'暂无'),'更新人：'+(billingInfo.updateUser||'暂无')]"
        padding="9px 7px 9px 15px">
      </content-title>
      <qw-tab-bar
        class="title_border"
        v-model="saleType"
        :data="tabs"
        :slider-width=58
        @change="handleChangeTabs">
      </qw-tab-bar>
      <div v-show="saleType==1" class="panel">
        <div class="panel__line">
          <div class="panel__label">单位名称</div>
          <div class="panel__description">{{ billingInfo.salesInvoiceInfoName||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">税号</div>
          <div class="panel__description">{{ billingInfo.salesInvoiceInfoTax||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">注册地址</div>
          <div class="panel__description">{{ billingInfo.salesInvoiceInfoAddress||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">电话号码</div>
          <div class="panel__description">{{ billingInfo.salesInvoiceInfoTel||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">开户银行</div>
          <div class="panel__description">{{ billingInfo.salesOpenBank||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">银行账号</div>
          <div class="panel__description">{{ billingInfo.salesInvoiceInfoAccount||'-' }}</div>
        </div>
      </div>
      <div v-show="saleType==2" class="panel">
        <div class="panel__line">
          <div class="panel__label">单位名称</div>
          <div class="panel__description">{{ billingInfo.afterSalesInvoiceInfoName||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">税号</div>
          <div class="panel__description">{{ billingInfo.afterSalesInvoiceInfoTax||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">注册地址</div>
          <div class="panel__description">{{ billingInfo.afterSalesInvoiceInfoAddress||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">电话号码</div>
          <div class="panel__description">{{ billingInfo.afterSalesInvoiceInfoTel||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">开户银行</div>
          <div class="panel__description">{{ billingInfo.afterSalesOpenBank||'-' }}</div>
        </div>
        <div class="panel__line">
          <div class="panel__label">银行账号</div>
          <div class="panel__description">{{ billingInfo.afterSalesInvoiceInfoAccount||'-' }}</div>
        </div>
      </div>
    </template>

    <template>
      <content-title style="margin: 8px auto"
        name="股东股本信息"
        :content="['更新日期：'+(shareholdersUpdate.time||'暂无'),'更新人：'+(shareholdersUpdate.user||'暂无')]"
        padding="9px 7px 11px 15px">
      </content-title>
      <div class="shareholders" v-if="shareholdersInfo&&shareholdersInfo.length>0">
        <div class="shareholder_content" v-for="(item, index) in shareholdersInfo" :key="index">
          <div class="shareholder_header">
            <div class="shareholder_firstname" :class="{holding: item.nature=='控股', join: item.nature=='参股'}">{{item.name.split('')[0]}}</div>
            <div class="shareholder_name_tag">
              <div class="shareholder_name">{{item.name}}</div>
              <div class="shareholder_tag holding_tag" v-if="item.nature=='控股'">控股</div>
              <div class="shareholder_tag join_tag" v-if="item.nature=='参股'">参股</div>
            </div>
          </div>
          <div class="shareholder_cap">
            <div class="shareholder_capital">占股资金：<span style="color:#C6001F">{{item.money}}</span>万元</div>
            <div class="shareholder_proportion">占股比例：<span style="color:#C6001F">{{item.proportion}}%</span></div>
          </div>
        </div>
      </div>
      <div v-else class="no_data">
        <p>暂无数据</p>
      </div>
    </template>

    <template>
      <div class="panel change_log">
        <div class="change_log_title">变更记录</div>
        <div v-if="changeLogList&&changeLogList.length > 0" >
          <div class="change_log_content" v-for="(item, index) in changeLogList" :key="index">
            <div class="change_log_header">
              <div class="change_log_head">{{ formatNumber(index) }} {{item.changeType}}-{{item.changeInfo}}</div>
              <div @click="handleClickTrainingIcon(index)">
                <div class="change_log_time">{{ formatDate(item.changeDate) }}</div>
                <i
                  :class="{'is-open': item.isOpen}"
                  class="title__icon">
                  <img :src="iconArrowDown">
                </i>
              </div>
            </div>
            <div class="change_log_info" v-if="item.isOpen">
              <div class="change_log_label">变更前</div>
              <div class="change_log_text">{{ item.beforeInfo }}</div>
            </div>
            <div class="change_log_info" v-if="item.isOpen" style="margin-bottom: 15px;">
              <div class="change_log_label">现信息</div>
              <div class="change_log_text">{{ item.nowInfo }}</div>
            </div>
          </div>
        </div>

        <div v-else class="no_data">
          <p>暂无数据</p>
        </div>
      </div>

    </template>

  </div>
</template>

<script>
import {
  getBasicInfo,
  getLegalRepresentative,
  getBillingInfo,
  getStockRightInfoList,
  getStockRightChangeInfoList
} from '@/module/channelManagement/api/basic/index'

import reloadApp from '@/module/channelManagement/mixins/reloadApp.js'
import contentTitle from '@/module/channelManagement/components/contentTitle'


import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
export default {
  mixins: [reloadApp],
  components: { contentTitle },
  data() {
    return {
      dealerId: '',
      contactInfo: {},
      baseInfo: {},
      billingInfo: {},
      shareholdersInfo: [],
      shareholdersUpdate: {
        time: '',
        user: ''
      },
      changeLogList: [],
      tabs: [
        {
          value: 1,
          label: '售前'
        },
        {
          value: 2,
          label: '售后'
        }
      ],
      isLoading: false,
      saleType: 1, // 1：售前，2：售后
      iconArrowDown,
    }
  },
  methods: {
    init(dealerId) {
      console.log(dealerId)
      const getBasicInfoPromise = getBasicInfo( dealerId ).then(data => {
        if (data) {
          this.baseInfo = data || {}
        } else {
          this.baseInfo = {}
        }
      })

      const getLegalRepresentativePromise = getLegalRepresentative( dealerId ).then(data => {
        if (data) {
          this.contactInfo = data || {}
        } else {
          this.contactInfo = {}
        }
      })

      const getBillingInfoPromise = getBillingInfo( dealerId ).then(data => {
        if (data) {
          this.billingInfo = data || {}
        } else {
          this.billingInfo = {}
        }
      })

      const getStockRightInfoListPromise = getStockRightInfoList( dealerId ).then(data => {
        if (data) {
          this.shareholdersInfo = data || []
          if (this.shareholdersInfo.length > 0) {
            this.shareholdersUpdate.time = this.shareholdersInfo[0].updateTime || ''
            this.shareholdersUpdate.user = this.shareholdersInfo[0].updateUser || ''
          }
        } else {
          this.shareholdersInfo = []
          this.shareholdersUpdate = {}
        }
      })

      const getStockRightChangeInfoListPromise = getStockRightChangeInfoList( dealerId ).then(data => {
        if (data) {
          this.changeLogList = data || []
          const list = this.changeLogList
          this.changeLogList = list.map(item => {
            return Object.assign({},item,{isOpen:false})
          })
          this.changeLogList = this.MsgSort(this.changeLogList)
          // 同一天同一类型的变更内容、变更前、变更后合并
          var arr = this.changeLogList
          var counter = 0
          for(var i = 0; i < arr.length; i++){
            for (let j = i+1; j < arr.length; j++) {
              if(arr[i].changeDate == arr[j].changeDate){ //时间相等
                if(arr[i].changeType == arr[j].changeType){ //时间相等 && 种类相等
                  arr[i].beforeInfo += '，' + arr[j].beforeInfo
                  arr[i].changeInfo += '，' + arr[j].changeInfo
                  arr[i].nowInfo += '，' + arr[j].nowInfo
                  counter++
                }
              }else{ //时间不相等就直接删除合并项，并跳出循环
                arr.splice(i+1,counter);
                counter = 0
                break
              }
            }
            if(counter !== 0){ //排除最后的合并项没有经过删除生成重复项的情况
              arr.splice(i+1,counter);
            }
          }
        } else {
          this.changeLogList = []
        }
      })

      this.isLoading = true;
      Promise.all([
        getBasicInfoPromise,
        getLegalRepresentativePromise,
        getBillingInfoPromise,
        getStockRightInfoListPromise,
        getStockRightChangeInfoListPromise
      ]).finally(() => {
        this.isLoading = false;
      })
    },
    //传入一个需要排序的数组
    MsgSort(obj){
        obj.sort((a,b)=>{
          let t1 = new Date(Date.parse(a.changeDate.replace(/-/g,"/")))
          let t2 = new Date(Date.parse(b.changeDate.replace(/-/g,"/")))
          return t2.getTime()-t1.getTime()
        })
    return obj
    },
    handleClickTrainingIcon(index){
      this.changeLogList[index].isOpen = !this.changeLogList[index].isOpen
    },
    handleChangeTabs(tableValue) {
      switch (tableValue) {
        case 1:
          this.saleType = 1;
          break;
        case 2:
          this.saleType = 2;
          break;
      }
    },
    formatNumber(index){
      const n = index+1;
      return n>=10? `${n}`: `0${n}`;
    },
    formatDate(changeDate){
      if(changeDate){
        const [date] = changeDate.split(' ');
        return date;
      }else{
        return '暂无'
      }
    }
  },
  created() {
    this.dealerId = this.$route.query.dealerId || ''
    if (this.dealerId) {
      this.init(this.dealerId)
    } else {
      this.reloadApp()
    }
  },
  watch: {
    $route: {
      handler() {
        this.dealerId = this.$route.query.dealerId || ''
        console.log(this.dealerId);
        if (this.dealerId) {
          this.init(this.dealerId)
        } else {
          this.reloadApp()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

/deep/{
  .qw-tab-bar__pane {
    .qw-badge.qw-tab-bar__without-icon{
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 21px;
      color: rgba(128,128,128,1);
      opacity: 1;
    }
  }

  .qw-tab-bar__pane.is-active {
    .qw-badge.qw-tab-bar__without-icon{
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 21px;
      color: rgba(0,0,0,1);
      opacity: 1;
    }
  }
}

.basic-info {
  padding-bottom: 50px;

  .title_border{
    border-bottom: 1px solid rgba(230,230,230,1);
  }

  .no_data {
    padding: 8px 15px;
    margin: 8px;
    background: #ffffff;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    font-family: PingFang SC;
    letter-spacing: 2px;
    text-align: center;
  }

  .panel {
    padding: 15px;
    background: #ffffff;

    .panel__line {
      display: flex;
      justify-content: space-between;
      align-items: top;
      padding-right: 12px;

      .firstname {
        margin: auto 5px;
        width: 30px;
        height: 30px;
        background-color: rgba(39,129,219,1);
        font-size: 23px;
        text-align: center;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 30px;
        color: rgba(255,255,255,1);
        opacity: 1;
      }

      .panel__label {
        line-height: 34px;
        font-size: 15px;
        font-weight: bold;
        // font-family: PingFang SC;
        font-family: Source Han Sans CN;
        color: rgba(39,129,219,1);
        flex: 1;
        position: relative;
        padding-left: 8px;

        &:before {
          position: absolute;
          top: 0;
          left: 0;
          content: "·";
          width: 8px;
        }
      }

      .panel__description {
        flex: none;
        max-width: 65%;
        display: flex;
        flex-wrap: wrap;
        font-size: 15px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 34px;
        text-align: end;
        color: rgba(51,51,51,1);
        opacity: 1;
      }
    }

    .panel__title {
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 24px;
      color: rgba(0,0,0,1);
      opacity: 1;
    }

    .panel__detail {
      margin: 7.5px auto 13.5px auto;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 24px;
      color: rgba(153,153,153,1);
      opacity: 1;
    }
    .change_log_title {
      width: 68px;
      height: 24px;
      font-size: 17px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 24px;
      color: rgba(0,0,0,1);
      opacity: 1;
    }

    .change_log_content {
      border-bottom: solid 1px #f5f5f5;

      .change_log_header {
        display: flex;
        justify-content: space-between;
        align-items: top;
        margin: 15px auto;

        .change_log_head {
          width: 65%;
          height: 24px;
          line-height: 24px;
          font-size: 17px;
          color: rgba(51,51,51,1);
          white-space:nowrap;
          overflow-x: scroll;
          position: relative;
          opacity: 1;
          &::-webkit-scrollbar {
            display:none
          }
        }


        .change_log_time {
          display: inline-block;
          height: 24px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 24px;
          color: rgba(153,153,153,1);
          opacity: 1;
        }

        .title__icon {
          width: 20px;
          height: 24px;
          line-height: 24px;
          display: inline-block;
          text-align: center;
          transition: transform 0.4s ease;

          & > img {
            width: 11px;
            height: 7px;
            vertical-align: middle;
          }

          &.is-open {
            transform: rotateZ(180deg);
          }
        }
      }

      .change_log_info {
        display: flex;
        justify-content: flex-start;
        align-items: top;
        .change_log_label {
          width: 50px;
          height: 30px;
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 30px;
          color: rgba(153,153,153,1);
          opacity: 1;
        }

        .change_log_text {
          max-width: calc(100% - 70px);
          margin-left: 10px;
          // height: 30px;
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 30px;
          color: rgba(51,51,51,1);
          opacity: 1;
        }
      }
    }

  }

  .shareholders {
    margin: 8px auto;
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    // padding: auto 6.5px;

    .shareholder_content {
      width: calc(50% - 13px);
      /*height: 106px;*/
      margin: 6.5px;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow:0px 2px 3px rgba(0,0,0,0.16);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .shareholder_header {
        margin: 11px auto 8px auto;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;

        .shareholder_firstname {
          margin-right: 30px;
          height: 38px;
          width: 38px;
          font-size: 28px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          line-height: 38px;
          text-align: center;
          color: rgba(255,255,255,1);
          opacity: 1;
        }

        .holding {
          background-color: rgba(39,129,219,1);
        }

        .join {
          background-color: rgba(110,132,153,1);
        }

        .shareholder_name {
          width: 48px;
          /*height: 20px;*/
          text-align: center;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 20px;
          color: rgba(51,51,51,1);
          opacity: 1;
          padding: 5px 0;
          word-break: break-word;
        }

        .shareholder_tag {
          height: 15px;
          width: 48px;
          border-top-left-radius: 5px;
          border-bottom-right-radius: 5px;
          text-align: center;
          font-size:10px;
          font-family:Source Han Sans CN;
          font-weight:bold;
          line-height:15px;
          color:rgba(255,255,255,1);
          opacity:1;
        }

        .holding_tag {
          background-color: #C6001F;
        }

        .join_tag {
          background-color: #999999;
        }
      }

      .shareholder_cap {
        .shareholder_capital,.shareholder_proportion{
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 20px;
          color: #999999;
          opacity: 1;
        }
      }
    }
  }

}
</style>

