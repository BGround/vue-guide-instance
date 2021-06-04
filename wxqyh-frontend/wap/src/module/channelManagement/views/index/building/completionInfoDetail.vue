<!-- 股东股本 -->
<template>
  <div class="completion-info-detail">
    <div class="panel">
      <div class="panel__title">店面变更信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">变更类型</div>
            <div class="field__value">搬迁</div>
          </div>

          <div class="field__item">
            <div class="field__label">变更时间</div>
            <div class="field__value">2019年3月1日</div>
          </div>

          <div class="field__item">
            <div class="field__label">搬迁时间</div>
            <div class="field__value">2010-01-01</div>
          </div>

          <div class="field__item">
            <div class="field__label">开工时间</div>
            <div class="field__value">2010-01-01</div>
          </div>

          <div class="field__item">
            <div class="field__label">完工时间</div>
            <div class="field__value">2010-01-01</div>
          </div>

          <div class="field__item">
            <div class="field__label">转正时间</div>
            <div class="field__value">2019年3月1日</div>
          </div>

          <div class="field__item">
            <div class="field__label">建设级别</div>
            <div class="field__value">A</div>
          </div>

          <div class="field__item">
            <div class="field__label">店面性质</div>
            <div class="field__value">过渡店</div>
          </div>

          <div class="field__item">
            <div class="field__label">是否店厂分离</div>
            <div class="field__value">否</div>
          </div>

          <div class="field__item">
            <div class="field__label">启动协议完工时间</div>
            <div class="field__value">2018年7月1日</div>
          </div>

          <div class="field__item">
            <div class="field__label">最终协议完工时间</div>
            <div class="field__value">2018年7月1日</div>
          </div>

          <div class="field__item">
            <div class="field__label">延期次数</div>
            <div class="field__value">一次</div>
          </div>

          <div class="field__item">
            <div class="field__label">考核金额</div>
            <div class="field__value">1.2万元</div>
          </div>

          <div class="field__item">
            <div class="field__label">建设过程节点</div>
            <div class="field__value"></div>
            <div class="field__icono" @click="handleClickNodes"><img :src="iconArrowRight" alt=""></div>
          </div>

          <div class="field__item">
            <div class="field__label">验收日期</div>
            <div class="field__value">2019年3月1日</div>
          </div>
        </div>
      </div>
    </div>

   

  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png';
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
export default {
  mixins: [reloadApp],
  data() {
    return {
      iconArrowRight
    }
  },
  methods:{
    handleClickNodes(){
      
    }
  }
}
</script>

<style lang="scss" scoped>
.completion-info-detail {
  background: #ffffff;
  padding-bottom: 50px;
  .header {
    padding: 22px 15px 15px;
    border-bottom: 3px solid rgba(38, 34, 34, 1);
  }

  .header__title {
    height: 28px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 24px;
    color: rgba(38, 34, 34, 1);
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
  }
  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 15px;
  }

  .panel__text{
    font-size:15px;
    font-family:PingFang SC;
    font-weight:400;
    line-height:24px;
    color:rgba(51,51,51,1);
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
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }

  .field__icono{
    width: 7px;
    height: 11px;
    margin-left: 5px;
    &>img{
      width: 100%;
      vertical-align: top;
    }
  }
}
</style>

