<template>
  <div class="investors-detail">

    <div class="panel">
      <div class="panel__title">基本信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">姓名</div>
            <div class="field__value">刘德华</div>
          </div>

          <div class="field__item">
            <div class="field__label">性别</div>
            <div class="field__value">男</div>
          </div>

          <div class="field__item">
            <div class="field__label">手机号</div>
            <div class="field__value">17382973940</div>
          </div>

          <div class="field__item">
            <div class="field__label">邮箱</div>
            <div class="field__value">liudehu@outlook.com</div>
          </div>

          <div class="field__item">
            <div class="field__label">出生日期</div>
            <div class="field__value">1990-03-17</div>
          </div>

          <div class="field__item">
            <div class="field__label">学历</div>
            <div class="field__value">本科</div>
          </div>

          <div class="field__item">
            <div class="field__label">国籍</div>
            <div class="field__value">中国</div>
          </div>

           <div class="field__item">
            <div class="field__label">籍贯</div>
            <div class="field__value">上海</div>
          </div>

           <div class="field__item">
            <div class="field__label">公司电话</div>
            <div class="field__value">020-666666</div>
          </div>

           <div class="field__item">
            <div class="field__label">常驻城市</div>
            <div class="field__value">上海</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">股本信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">投入金额</div>
            <div class="field__value">100W</div>
          </div>

           <div class="field__item">
            <div class="field__label">占比</div>
            <div class="field__value">52%</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">工作简历</div>
      <div class="panel__section">
        <div class="panel__subtitle">
          上海嘉松汽车销售有限公司
        </div>
        <div class="field">
           <div class="field__item">
            <div class="field__label">董事长</div>
            <div class="field__value">200801 至 201901</div>
          </div>
        </div>
      </div>
      <div class="panel__section">
        <div class="panel__subtitle">
          上海嘉松汽车销售有限公司
        </div>
        <div class="field">
           <div class="field__item">
            <div class="field__label">董事长</div>
            <div class="field__value">200801 至 201901</div>
          </div>
        </div>
      </div>
    </div>

    <div class="gutter"></div>


    <div class="panel">
      <div class="panel__title">社会职务</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">上海政协委员</div>
            <div class="field__value">2018.01至今</div>
          </div>

           <div class="field__item">
            <div class="field__label">上海商会成员</div>
            <div class="field__value">2018.01 至 2019.01</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>

  </div>
</template>

<script>
export default {
  data(){
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .investors-detail{
    background: #ffffff;
    padding-bottom: 50px;
    .gutter{
      height:8px;
      background:rgba(245,245,245,1);
    }

    .panel{
      padding: 15px;
    }
    .panel__title{
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
    }

    .panel__subtitle{
      height:22px;
      font-size:16px;
      line-height:22px;
      color:rgba(51,51,51,1);
      padding-bottom: 13px;
      font-weight:bold;
    }
    .panel__content{
      padding-top: 15px;
    }
    .panel__section{
      position: relative;
      padding-bottom: 15px;
      padding-top: 15px;
    }
    .panel__section:last-child::after{
      display: none;
    }
    .panel__section::after{
      content: '';
      display: block;
      background: rgba(219,219,219,1);
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      transform: scaleY(0.5);
    }

    .field__item{
      display: flex;
      justify-content: space-between;
    }

    .field__label{
      font-size:15px;
      font-weight:400;
      line-height:34px;
      color:rgba(153,153,153,1);
      white-space: nowrap;
      margin-right: 10px;
    }
    .field__value{
      font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      line-height:34px;
      color:rgba(51,51,51,1);
    }

    .field__item--lang{
      white-space: normal;
      &> .field__value{
        line-height:24px;
      }
    }
  }
</style>