<!-- 預警陳述詳情 -->
<template>
  <div class="warning-desc-detail">

    <div class="section">
      <div class="header">
        {{detail.exchangeTime}}预警陈述
      </div>
      <div class="field">
        <div class="field__item">
          <div class="field__label">交流时间</div>
          <div class="field__value">{{detail.exchangeTime ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">交流地点</div>
          <div class="field__value">{{detail.exchangeAddress ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">交流人员</div>
          <div class="field__value">{{detail.exchangeUsers ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">异常原因</div>
          <div class="field__value field__value--warning">{{detail.abnormalReason ||''}}</div>
        </div>

      </div>
    </div>

    <div class="gutter"></div>

    <div class="section">
      <div class="title">
        <p class="title__name">背景</p>
      </div>
      <div class="section__content">
        <p>
          {{detail.background ||'-'}}
        </p>
      </div>

      <div class="title">
        <p class="title__name">会议决议</p>
      </div>
      <div class="section__content section__content--red">
        <p>{{detail.conferenceResolution ||'-'}}</p>
      </div>

      <div class="title">
        <p class="title__name">结论</p>
      </div>
      <div class="section__content">
        <p> {{detail.conclusion ||'-'}}</p>
      </div>

      <div class="title">
        <p class="title__name">附件</p>
      </div>
      <div class="section__content">
        <div class="attachment">
          <div class="attachment__item" v-if="detail.conferenceEnclosureUrl">
            <i class="attachment__icon"
              :class="'word'"></i>
            <p class="attachment__name">{{detail.conferenceEnclosureName}}</p>
            <i class="attachment__download"
              @click="handleClickDownloadBtn(detail.conferenceEnclosureUrl)"></i>
          </div>
          <div class="attachment__item" v-if="detail.enclosureUrl">
            <i class="attachment__icon"
              :class="'word'"></i>
            <p class="attachment__name">{{detail.enclosureName}}</p>
            <i class="attachment__download"
              @click="handleClickDownloadBtn(detail.enclosureUrl)"></i>
          </div>
        </div>
      </div>

    </div>

    <div class="gutter"></div>

    <div v-for="(item, key) in rectifications"
      :key="key">
      <div class="section">
        <div class="title">
          <p class="title__name">项目整改</p>
          <span class="title__status"
            v-if="item.status">{{item.status}}</span>
          <i class="title__icon"
            @click="handleClickDetailIcon(status)"
            :class="{'is-open': isOpen(status)}"><img :src="iconArrowDown"
              alt=""></i>
        </div>
        <div class="field"
          v-show="isOpen(status)">

          <div class="field__item">
            <div class="field__label">期数</div>
            <div class="field__value">{{item.numberPeriods||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">交流时间</div>
            <div class="field__value">{{item.exchangeTime||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">项目类别</div>
            <div class="field__value">{{item.projectCategory||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">项目内容</div>
            <div class="field__value">{{item.projectContent||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">下一步</div>
            <div class="field__value">{{item.nextContent||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">责任部门</div>
            <div class="field__value">{{item.deptName||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">责任人</div>
            <div class="field__value">{{item.personLiables||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">计划完成时间</div>
            <div class="field__value">{{item.planTime||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">实际完成时间</div>
            <div class="field__value">{{item.actualTime||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">进展</div>
            <div class="field__value">{{item.progress||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">申请关闭时间</div>
            <div class="field__value">{{item.closedTime||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">附件</div>
            <div class="field__value"></div>
          </div>

          <div class="attachment">
            <div class="attachment__item" v-if="item.closeEnclosureUrl">
              <i class="attachment__icon"
                :class="'word'"></i>
              <p class="attachment__name">关闭依据</p>
              <i class="attachment__download"
                @click="handleClickDownloadBtn(item.closeEnclosureUrl)"></i>
            </div>
          </div>

        </div>
      </div>
      <div class="gutter"></div>
    </div>

  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getEarlyRectification } from '@/module/channelManagement/api/warning'

export default {
  mixins: [reloadApp],
  data() {
    return {
      iconArrowDown,
      status: true,
      detail: {},
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
      rectifications: []
    }
  },
  methods: {
    isOpen(status) {
      return this.status
    },
    handleClickDetailIcon(status) {
      this.status = !this.status
    },
    handleClickDownloadBtn(url) {
      if (url) {
        window.open( url)
      }
    },
    mapFileType({ type }) {
      const map = {
        word: 'W'
      }
      return map[type] || 'F'
    }
  },
  created() {
    const { dealerId = '' } = this.$route.query
    this.detail = this.$route.params || {}
    getEarlyRectification({
      dealerInfoId: dealerId,
      time: this.detail.exchangeTime2
    }).then(data => {
      if (data && Array.isArray(data.entEarlyRectificationVos)) {
        this.rectifications = data.entEarlyRectificationVos
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.warning-desc-detail {
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .section {
    padding: 15px;
    background: #ffffff;
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
    align-items: flex-start;
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
    line-height: 22px;
    color: rgba(51, 51, 51, 1);
    margin-left: auto;
    text-align:right;
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
}
</style>