<template>
  <div class="no-chart" :class="iconClass">
      <div class="tip">
        <span>{{title}}</span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name:'no-chart',
    props: {
      iconClass:{
        type:String,
        default:'icon-one-column'
      },
      title:{
        type:String,
        default:'没有数据'
      }
    }
  }
</script>

<style scoped lang="scss">
  .no-chart{
    display: flex;
    justify-content: center;
    width: 100%;
    height: 148px;
    &.icon-three-column{
      background: url(~assets/images/crm/three_column.png) no-repeat center;
      background-size: 100%;
    }
    &.icon-one-column{
      background: url(~assets/images/crm/one_column.png) no-repeat center;
      background-size: 100%;
    }
    &.icon-one-column2{
      background: url(~assets/images/crm/one_column2.png) no-repeat center;
      background-size: 100%;
    }
    &.icon-trends{
      background: url(~assets/images/crm/no_trends.png) no-repeat center;
      background-size: contain;
    }
    &.icon-trends-num{
      background: url(~assets/images/crm/no_trends_num.png) no-repeat center;
      background-size: contain;
    }
    .tip{
      position: relative;
      width:112px;
      height:35px;
      line-height: 36px;
      margin-top: 14px;
      border-radius: 3px;
      background: #88A9F4;
      text-align: center;
      font-size: 14px;
      color: #fff;
      &::before{
        content: '';
        position: absolute;
        bottom:-6px;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #88A9F4;
        transform: translateX(-50%);
      }
    }
  }
</style>
