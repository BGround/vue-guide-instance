<!-- 【认证明细】 -->
<template>
  <div class="personnel-info">
    <div class="panel">
      <div class="panel__title">【认证明细】</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">· 姓名</div>
            <div class="field__value">{{list.trainingUser||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 任职岗位</div>
            <div class="field__value">{{list.postName||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 培训时间</div>
            <div class="field__value">{{list.trainingStartTime||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 结业理论成绩</div>
            <div class="field__value">{{list.graTheroyScore||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 结业实操成绩</div>
            <div class="field__value">{{list.graOperationScore||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 是否合格</div>
            <div class="field__value">{{list.qualifiedSituation||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 证书编号</div>
            <div class="field__value">{{list.trainingCertificateNo||'-'}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">岗位信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">岗位</div>
            <div class="field__value"
              :class="{'is-cert': isCert}">{{detail.position}}</div>
            <div v-if="isCert"
              class="field__cert">
              <img :src="iconCertification"
                alt="">
            </div>
          </div>

          <div class="field__item">
            <div class="field__label">岗位类别</div>
            <div class="field__value">{{detail.category || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">上岗时间</div>
            <div class="field__value">{{detail.workTime || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">入职时间</div>
            <div class="field__value">{{detail.entryTime || '-'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div> -->
    <!-- 
    <div class="panel">
      <div class="panel__title">培训信息</div>
      <div class="training">
        <div class="training__course">
          产品培训 | 2017年第七期...技术总监培训班
        </div>
        <div class="training__position">
          技术总监
        </div>
        <div class="field">
          <div class="field__item">
            <div class="field__label">20080101 至 20190103</div>
            <div class="field__value">3天</div>
          </div>
          <div class="field__item">
            <div class="field__label">证书编号：1234567</div>
          </div>
        </div>
      </div>
      <div class="training">
        <div class="training__course">
          产品培训 | 2017年第七期...技术总监培训班
        </div>
        <div class="training__position">
          技术总监
        </div>
        <div class="field">
          <div class="field__item">
            <div class="field__label">20080101 至 20190103</div>
            <div class="field__value">3天</div>
          </div>
          <div class="field__item">
            <div class="field__label">证书编号：1234567</div>
            <div v-if="isQualifie" class="field__qualifie">
              <img :src="iconQualifie" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">任职信息</div>
      <div class="experience">
        <div class="experience__company">
          上海瑞杰汽车销售服务有限公司
        </div>
        <div class="experience__position">
          技术总监
        </div>
        <div class="field">
          <div class="field__item">
            <div class="field__label">20080101 至今</div>
            <div class="field__value">调岗</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div> -->

  </div>
</template>

<script>
import iconCertification from '@/module/channelManagement/static/images/icon_certification.png'
import iconQualifie from '@/module/channelManagement/static/images/icon_qualifie.png'
import { getPersonInfoDetail } from '@/module/channelManagement/api/basic'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
export default {
  mixins: [reloadApp],
  data() {
    return {
      iconCertification,
      iconQualifie,
      detail: {},
      list: [],
    }
  },
  computed: {
    isCert() {
      return false
    },
    isQualifie() {
      return true
    }
  },
  methods: {
    mapMarriageStatus(status) {
      if (status === '0') {
        return '未婚'
      }
      if (status === '1') {
        return '已婚'
      }
      return '-'
    },
    init(){
      this.list = this.$route.query.item || ''
    }
  },
  created() {
    this.init();
  },
  watch:{
    '$route.query'(){
        this.init();
    }
  },
}
</script>

<style lang="scss" scoped>
.personnel-info {
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
    background: #fff;
  }
  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
  }

  .panel__subtitle {
    height: 22px;
    font-size: 16px;
    line-height: 22px;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 13px;
    font-weight: bold;
  }
  .panel__content {
    padding-top: 15px;
  }

  .training {
    margin-top: 16px;
    position: relative;
    padding-bottom: 14px;
    // &:last-child::after{
    //   display: none;
    // }
    &::after {
      content: '';
      display: block;
      background: rgba(219, 219, 219, 1);
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      transform: scaleY(0.5);
    }
  }

  .training__course {
    height: 23px;
    font-size: 16px;
    font-weight: bold;
    line-height: 23px;
  }

  .training__position {
    height: 21px;
    font-size: 15px;
    color: rgba(51, 51, 51, 1);
    margin: 14px 0 13px;
  }

  .experience {
    margin-top: 16px;
    position: relative;
    padding-bottom: 14px;
    // &:last-child::after{
    //   display: none;
    // }
    &::after {
      content: '';
      display: block;
      background: rgba(219, 219, 219, 1);
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      transform: scaleY(0.5);
    }
  }

  .experience__company {
    height: 23px;
    font-size: 16px;
    font-weight: bold;
    line-height: 23px;
  }

  .experience__position {
    height: 21px;
    font-size: 15px;
    color: rgba(51, 51, 51, 1);
    margin: 14px 0 13px;
  }

  .panel__section {
    position: relative;
    padding-bottom: 15px;
    padding-top: 15px;
  }
  .panel__section:last-child::after {
    display: none;
  }
  .panel__section::after {
    content: '';
    display: block;
    background: rgba(219, 219, 219, 1);
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: 0;
    transform: scaleY(0.5);
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .field__cert {
    position: absolute;
    width: 50px;
    height: 48px;
    right: -10px;
    top: -5px;
    & > img {
      width: 100%;
    }
  }

  .field__qualifie {
    position: absolute;
    width: 50px;
    height: 48px;
    left: 140px;
    top: -5px;
    & > img {
      width: 100%;
    }
  }

  .field__label {
    font-size: 15px;
    font-weight:bold;
    line-height:34px;
    color:rgba(39,129,219,1);
    white-space: nowrap;
    margin-right: 10px
  }
  .field__value {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(51, 51, 51, 1);
  }

  .field__value.is-cert {
    padding-right: 30px;
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }
}
</style>