<!-- 退网清算 -->
<template>
  <div class="exit-liquidation">

    <template v-if="isNonEmptyObject(info)">
      <div class="section">
        <div class="header">
          <!-- {{info.retreatTime}} -->
          退网信息
        </div>

        <div class="field">
          <div class="field__item">
            <div class="field__label">开通时间</div>
            <div class="field__value">{{info.openingTime||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">退网时间</div>
            <div class="field__value">{{info.retreatTime ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">退网性质</div>
            <div class="field__value">{{info.retireNature  ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">上网网络委员会</div>
            <div class="field__value">{{info.committee  ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">评估时间</div>
            <div class="field__value">{{info.assessmentTime ||'-'}}</div>
          </div>

        </div>
      </div>

      <div class="gutter"></div>

      <div class="section">
        <div class="title">
          <p class="title__name">会议决议</p>
        </div>
        <div class="section__content section__content--red">
          <p>
            {{info.conferenceResolution  ||'-'}}
          </p>
        </div>

        <div class="title">
          <p class="title__name">退网原因</p>
        </div>
        <div class="section__content section__content--red">
          <p>{{info.retreatReason||'-'}}</p>
        </div>

        <div class="title">
          <p class="title__name">明细原因</p>
        </div>
        <div class="section__content section__content--notpb">
          <p>{{info.detailReason  ||'-'}}</p>
        </div>
      </div>

      <div class="gutter"></div>

      <div class="section">
        <div class="title">
          <p class="title__name">退网状态</p>
          <i class="title__icon"
            @click="()=>{isOpenExitNet = !isOpenExitNet}"
            :class="{'is-open':isOpenExitNet}"><img :src="iconArrowDown"
              alt=""></i>
        </div>
        <div class="field"
          v-show="isOpenExitNet">
          <div class="field__item">
            <div class="field__label">库存量</div>
            <div class="field__value">{{info.repertory  }}</div>
          </div>
          <div class="field__item">
            <div class="field__label">库存消化周期</div>
            <div class="field__value">{{info.period ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">售后保留时间</div>
            <div class="field__value">{{info.saveAfterSaleTime ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">权限冻结时间</div>
            <div class="field__value">{{info.perFreezeTime  ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">库存截止时间</div>
            <div class="field__value">{{info.repertoryCloseTime ||'-'}}</div>
          </div>

        </div>
      </div>

      <div class="gutter"></div>

    </template>

    <template v-if="departments.length">
      <div class="section">
        <div class="title">
          <p class="title__name">清算状态</p>
          <i class="title__icon"
            @click="()=>{isOpenLiquidation = !isOpenLiquidation}"
            :class="{'is-open': isOpenLiquidation}"><img :src="iconArrowDown"
              alt=""></i>
        </div>
        <div class="table"
          v-show="isOpenLiquidation">
          <div class="table__row"
            v-for="(item, index) in departments"
            :key="index">
            <span class="table__col">{{item.deptName}}</span>
            <span class="table__col"
              :class="{'table__col--warning':false}">{{mapType(item.liquidationType)}}</span>
            <span class="table__col">{{item.createTime}}</span>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <template v-if="isNonEmptyObject(formInfo)">
      <div class="section">
        <div class="title">
          <p class="title__name">退保证金</p>
          <i class="title__icon"
            @click="()=>{isOpenMargin = !isOpenMargin}"
            :class="{'is-open': isOpenMargin}"><img :src="iconArrowDown"
              alt=""></i>
        </div>
        <div class="field"
          v-show="isOpenMargin">
          <div class="field__item">
            <div class="field__label">保证金扣款</div>
            <div class="field__value">{{formInfo.depositMoney}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">到期时间</div>
            <div class="field__value">{{formInfo.expireTime}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">清算单交财务</div>
            <div class="field__value">{{formInfo.submitFinanceTime}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">资料寄出</div>
            <div class="field__value">{{formInfo.depositDataSendTime}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">汇款时间</div>
            <div class="field__value">{{formInfo.remittanceTime}}</div>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !hasData" />

  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData'
import {
  getRetireInfo,
  liquidationDept,
  quitWarningFormInfo
} from '@/module/channelManagement/api/warning'
export default {
  mixins: [reloadApp],
  components: {noData},
  data() {
    return {
      iconArrowDown,
      status: true,
      attachments: [
        {
          type: 'word',
          name: '小型车辆维修',
          url: ''
        },
        {
          type: 'word',
          name: '小型车辆维修',
          url: ''
        }
      ],
      info: {},
      departments: [],
      formInfo: {},
      isOpenLiquidation: true,
      isOpenExitNet: true,
      isOpenMargin: true,
      isLoading: false,
    }
  },

  computed: {
    hasData() {
      return this.isNonEmptyObject(this.info) || (this.departments.length>0) || this.isNonEmptyObject(this.formInfo);
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },
    isOpen(status) {
      return this.status
    },
    handleClickDetailIcon(status) {
      this.status = !this.status
    },
    handleClickDownloadBtn() {},
    mapFileType({ type }) {
      const map = {
        word: 'W'
      }
      return map[type] || 'F'
    },
    mapType(type) {
      const map = {
        '1': '已清算',
        '0': '未清算'
      }
      return map[type] || ''
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    // const getRetireInfoPromise = getRetireInfo({ dealerInfoId: dealerId}).then(data => {
    //   if (data && data.tbEntRetireInfoVo) {
    //     this.info = data.tbEntRetireInfoVo
    //   }
    // })

    // const liquidationDeptPromise = liquidationDept({ dealerId }).then(departments => {
    //   if (Array.isArray(departments)) {
    //     this.departments = departments
    //   }
    // })

    const quitWarningFormInfoPromise = quitWarningFormInfo({ dealerId }).then(data => {
      if (data && data.flowStatusList) {
        this.flowStatusList = data.flowStatusList
        this.info = data.formData || {}
        this.departments = data.liquidationDept || []
      }
    })

    // this.isLoading = true;
    // Promise.all([getRetireInfoPromise, liquidationDeptPromise, quitWarningFormInfoPromise]).finally(()=>{
    //   this.isLoading = false;
    // })
  }
}
</script>

<style lang="scss" scoped>
.exit-liquidation {
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .section {
    background: #ffffff;
    padding: 15px;
  }

  .section__content {
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 25px;
  }

  .section__content--red {
    color: #c6001f;
  }

  .section__content--notpb {
    padding-bottom: 0;
  }

  .title {
    justify-content: space-between;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .title__name {
    height: 24px;
    font-size: 17px;
    font-weight: bold;
    line-height: 24px;
    // width: calc(100% - 30px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title__icon {
    width: 11px;
    height: 7px;
    display: block;
    transition: transform 0.4s ease;
    & > img {
      width: 100%;
      vertical-align: top;
    }
  }

  .title__icon.is-open {
    transform: rotateZ(180deg);
  }

  .header {
    position: relative;
    padding: 0 15px 15px 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 8px;
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .header__icon {
    display: block;
    width: 76px;
    height: 50px;
    position: absolute;
    right: 13px;
    top: 10px;
    background-size: 100%;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin-left: auto;
  }

  .field__value--warning {
    color: #c6001f;
  }

  .attachment {
  }

  .attachment__item {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    &:last-child {
      padding-bottom: 0;
    }
  }

  .attachment__icon {
    display: block;
    width: 35px;
    height: 35px;
    text-align: center;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .attachment__download {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url('~@/module/channelManagement/static/images/icon_download.png');
    flex-shrink: 0;
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .title__status {
    height: 17px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: rgba(198, 0, 31, 1);
    border: 1px solid rgba(198, 0, 31, 1);
    padding: 2px 5px;
    margin-right: auto;
    flex-grow: 0;
    margin-left: 15px;
    border-radius: 2px;
  }

  .attachment__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 21px;
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
    color: rgba(0, 0, 0, 1);
    margin-right: auto;
  }

  .attachment__icon.word {
    background: rgba(255, 153, 168, 0.2);
    &::before {
      content: 'W';
      font-size: 16px;
      font-weight: 400;
      line-height: 35px;
      color: rgba(230, 55, 82, 1);
    }
  }

  .table__row {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px 0 15px;
    &:nth-child(2n + 1) {
      background: rgba(250, 250, 250, 1);
    }
  }

  .table_col {
    font-size: 15px;
    font-weight: 400;
    line-height: 40px;
    color: rgba(102, 102, 102, 1);
  }

  .table__col.table__col--warning {
    color: #c6001f;
  }
}
</style>