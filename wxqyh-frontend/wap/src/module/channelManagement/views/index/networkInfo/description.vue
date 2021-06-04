<template>
  <div class="description">

    <template v-if="hasDescription">
      <div class="panel">
        <div class="panel__title">基本信息</div>
        <div class="panel__content">
          <div class="field">

             <!-- <div class="field__item">
              <div class="field__label">店面状态</div>
              <div class="field__value">{{info.storeCondition||'-'}}</div>
            </div> -->

            

            <div class="field__item">
              <div class="field__label">性质</div>
              <div class="field__value">{{info.storeProperties||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">公司名称</div>
              <div class="field__value">{{info.companyName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">公司体制</div>
              <div class="field__value">{{info.companySystem||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">注册资本</div>
              <div class="field__value">{{info.capital||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">成立时间</div>
              <div class="field__value">{{info.establishmentTime||'-'}}</div>
            </div>  

            <div class="field__item">
              <div class="field__label">注册登记机关</div>
              <div class="field__value">{{info.authority||'-'}}</div>
            </div>  
       
            <div class="field__item">
              <div class="field__label">法人姓名</div>
              <div class="field__value">{{info.legalPerson ||'-'}}</div>
            </div>

             <div class="field__item">
              <div class="field__label">性别</div>
              <div class="field__value">{{info.legalSex===1?'女': info.legalSex===0?'男':'-'}}</div>
            </div>

              <div class="field__item">
              <div class="field__label">手机</div>
              <div class="field__value">{{info.telephone ||'-'}}</div>
            </div>

             <div class="field__item">
              <div class="field__label">职务</div>
              <div class="field__value">{{info.legalPost ||'-'}}</div>
            </div>

            

          </div>
        </div>
      </div>

      <div class="gutter"></div>

      <div class="panel">
        <div class="panel__title">经营信息</div>
        <div class="panel__content">
          <div class="field">
            <div class="field__item">
              <div class="field__label">经营汽车品牌（一级）</div>
              <div class="field__value">{{info.oneBrand||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">营汽车品牌（二级）</div>
              <div class="field__value">{{info.twoBrand||'-'}}</div>
            </div>

            <div class="field__item--lang">
              <div class="field__label">主营业务</div>
              <div class="field__value">
                {{info.business}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="gutter"></div>
      <div class="panel">
        <div class="panel__title">展厅服务站信息</div>
        <div class="panel__content">
          <div class="field">
            <div class="field__item">
              <div class="field__label">展厅地址</div>
              <div class="field__value">{{info.exhibitionHall||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">服务站地址</div>
              <div class="field__value">{{info.serviceStationAdress||'-'}}</div>
            </div>

             <div class="field__item">
              <div class="field__label">服务站资质公司全称</div>
              <div class="field__value">{{info.serviceStationName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">店厂是否分离</div>
              <div class="field__value">{{isSeparate(info.separate)}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">店厂分离距离（公里）</div>
              <div class="field__value">{{info.distance ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">销售服务合作模式</div>
              <div class="field__value">{{info.cooperation||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">维修资质公司全称</div>
              <div class="field__value">{{info.serviceStationAdress||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">维修资质级别</div>
              <div class="field__value">{{info.repairLevel||'-'}}</div>
            </div>

          </div>
        </div>
      </div>
    </template>
    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !hasDescription" />

  </div>
</template>

<script>
import { findByNetwork } from '@/module/channelManagement/api/networkInfo/index'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: {
    noData
  },
  data() {
    return {
      info: {},
      isLoading: false,
    }
  },
  computed: {
    hasDescription() {
      return Object.keys(this.info).length
    }
  },
  methods: {
    isSeparate(separate) {
      if (typeof separate === 'undefined') {
        return '-'
      }
      return separate ? '是' : '否'
    }
  },
  created() {
    const id = this.$route.query.dealerId || ''
    if (!id) {
      this.reloadApp()
      return
    }
    this.isLoading = true;
    findByNetwork({ id }).then(data => {
      if (data) {
        this.info = data.networkVo || {}
      }
    }).catch(()=>{
      this.isLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.description {
  // background: #ffffff;
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
    background-color: #ffffff;
  }
  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 15px;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
  }
  .field__value {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 34px;
    color: rgba(51, 51, 51, 1);
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }
}
</style>