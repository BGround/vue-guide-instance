<!-- 預警陳述詳情 -->
<template>
  <div class="warning-desc-detail">

    <div class="section">
      <div class="header">
        <div>{{detail.exchangeTime}}预警陈述</div>
        <div class="desc">
          <span>更新日期: {{detail.updateTime || '暂无'}}</span>
          <span>更新人:{{detail.modifyUser || '暂无'}}</span>
        </div>
      </div>
      <div class="field">
        <div class="field__item">
          <div class="field__label">· 预警类别</div>
          <div class="field__value">{{detail.warningTypeDesc ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 预警时间</div>
          <div class="field__value">{{detail.warningTime ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 异常原因</div>
          <div class="field__value field__value--warning">{{detail.exceptionCause ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 整改项目数量</div>
          <div class="field__value">{{detail.porjectNum ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 整改核心内容</div>
          <div class="field__value">{{detail.coreContent ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 整改完成情况</div>
          <div class="field__value">{{detail.finishSituation ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 计划时间</div>
          <div class="field__value">{{detail.planTime ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 完成时间</div>
          <div class="field__value">{{detail.finishTime ||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">· 完成状态</div>
          <div class="field__value">{{detail.finishStateDesc ||'-'}}</div>
        </div>
      </div>
    </div>
    <!-- 附件 -->
    <div class="section">
      <div class="title">
        <p class="title__name">附件</p>
      </div>
      <div class="section__content">
        <div class="attachment">
          <div class="attachment__item" v-if="detail.planUrl">
            <i class="attachment__icon"
              :class="'word'"></i>
            <p class="attachment__name">整改计划书</p>
            <i class="attachment__download"
              @click="handleClickDownloadBtn(detail.planUrl)"></i>
          </div>
          <div class="attachment__item" v-if="detail.closedCycleUrl">
            <i class="attachment__icon"
              :class="'word'"></i>
            <p class="attachment__name">闭环资料</p>
            <i class="attachment__download"
              @click="handleClickDownloadBtn(detail.closedCycleUrl)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getEarlyRectification, doSendFileToMe } from '@/module/channelManagement/api/warning'

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
    handleClickDownloadBtn(mediaId) {
      if (mediaId) {
        // window.open(url)
          doSendFileToMe(mediaId).then((result)=>{
              if('0'===result.code){
                  if(_.isWeChatApp()){
                      _.alert("i18n.warmNotice","i18n.applicationMain",{
                          primaryBtn:{name:"i18n.confirm", callBack:wx.closeWindow}, defaultBtn:{name:"i18n.cancel", callBack:null},
                      });
                  }else{
                      _.alert("i18n.warmNotice","i18n.wechatMain");
                  }
              }else{
                  _.alert("i18n.notice",result.desc);
              }
          })

      }else{
          _.alert("i18n.notice",'该文件不存在');
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
    padding: 0 0 15px 0;
    font-size: 20px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    font-weight:bold;
    line-height: 34px;
    color:rgba(39,129,219,1);
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

  .header{

  }
  .desc {
    flex: 1;
    line-height: 23px;
    max-width: 63%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;

    & > span {
      display: block;
      font-size: 12px;
      transform: scale(0.84, 0.84);
      transform-origin: bottom right;
      margin-left: 4px;
    }
  }
}
</style>
