<!-- 调岗详情 -->
<template>
  <div class="personnel-info">
    <div class="panel">
      <div class="panel__title">【变更记录】</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">·变更类型</div>
            <div class="field__value">{{list.type || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 类别</div>
            <div class="field__value">{{list.type || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 变更后岗位</div>
            <div class="field__value">{{list.afterPost || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 变更时间</div>
            <div class="field__value">{{list.time || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 变更原因</div>
            <div class="field__value">{{list.reason || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 姓名</div>
            <div class="field__value">{{list.name || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 性别</div>
            <div class="field__value">{{list.sex || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 入职时间</div>
            <div class="field__value">{{list.enterTime || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">· 认证级别</div>
            <div class="field__value">{{list.level || '-'}}</div>
          </div>
        </div>
      </div>
    </div>
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
    }
  },
  created() {
    this.list = this.$route.query.item
  }
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