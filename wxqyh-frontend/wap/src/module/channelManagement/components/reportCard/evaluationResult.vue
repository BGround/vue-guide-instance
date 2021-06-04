<template>
  <div class="evaluation-result">
    <div class="header">
      服务运营评估结果
    </div>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="evaluation">
            <h2 class="evaluation__label">
              运营评估得分
            </h2>
            <p class="evaluation__value">{{getOperationalAssessment.score}}</p>
          </div>
        </div>
        <div class="grid__col">
          <div class="evaluation">
            <h2 class="evaluation__label">
              服务站分级
            </h2>
            <p class="evaluation__value evaluation__value--yellow">{{getOperationalAssessment.evaluate}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tips bl">业务联系人：{{getOperationalAssessment.servicePerson}}</div>

    <div v-for="(module, index) in getList"
      :key="index">
      <div class="title">{{ module.name }}{{ module.weight }}</div>
      <div class="grid">
        <div v-for="(item, index) in module.list"
          :key="index">
          <div class="grid__row">
            <div class="grid__col" :class="{bg:item.quotaType === 'KPI'}">
              <div class="ability">
                <div class="ability__title">
                  {{ item.indicatorName }}
                </div>
                <div class="ability__weights-target">
                  <div class="ability__field">
                    <span class="ability__field__label">权重</span>
                    <span class="ability__field__value">{{ item.weight }}</span>
                  </div>
                  <div class="ability__field">
                    <span class="ability__field__label">目标</span>
                    <span class="ability__field__value">{{ item.goal }}</span>
                  </div>
                </div>
                <div class="ability__field"
                  :style="{visibility: item.quarter>=1?'visible': 'hidden'}">
                  <span class="ability__field__label">{{ item.quarter > 1 ? item.year : item.year-1 }}年{{ item.quarter > 1 ? item.quarter-1 : 4 }}季度</span>
                  <span class="ability__field__value">{{item.preQuarterScore }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">{{ item.year }}年{{ item.quarter }}季度</span>
                  <span class="ability__field__value">{{ item.score }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">本站指标得分</span>
                  <span class="ability__field__value">{{
                    item.regionScore
                  }}</span>
                </div>
              </div>
            </div>
            <div class="grid__col" :class="{bg:item.quotaType === 'KPI'}">
              <div class="ability">
                <div class="ability__title ability__title--evaluation">
                  <span>评价</span>
                  <span class="ability__title__value">{{ item.evaluate }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">区域平均</span>
                  <span class="ability__field__value">{{
                    item.regionAverage | correctPercent
                  }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">全国平均</span>
                  <span class="ability__field__value">{{
                    item.nationwideAverage | correctPercent
                  }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">区域排名</span>
                  <span class="ability__field__value">{{ item.regionSort }}</span>
                </div>
                <div class="ability__field">
                  <span class="ability__field__label">全国排名</span>
                  <span class="ability__field__value">{{
                    item.nationwideSort
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="tips" >业务联系人：{{ item.servicePerson }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  filters:{
      formatPercent(value){
          const number = parseFloat(value);
          if(Number.isNaN(number)){
              return ''
          }else{
              return `(${Number(number * 100).toFixed(2)}%)`;
          }
      },
      correctPercent(value){
          if(value === '-'){
              return value;
          }
          const number = parseFloat(value)
          if(!Number.isNaN(number)){
              const hasDecimalPoint = String(value).includes('.');
              const hasPercentsymbol = String(value).includes('%');
              const precision = 2;
              const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision)
              const fixedNumber = hasDecimalPoint ? Number(roundNumber).toFixed(2) : Number(roundNumber).toFixed(0);
              return hasPercentsymbol? `${fixedNumber}%` : fixedNumber;
          }else{
              return value;
          }
      },
      addPercentSymbol(value){
          return (!!value || value === 0) && value !== '-' ? `${value}%`: '-'
      },
      round(value) {
          const number = parseFloat(value)
          if(!Number.isNaN(number)){
              const precision = 2;
              const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision)
              return Number(roundNumber).toFixed(2);
          }else{
              return value;
          }
      }
  },
  computed: {
    getList() {
      const modules = {}
      this.data.forEach(item => {
        if (item.module in modules) {
          modules[item.module].list.push(item)
        } else {
          modules[item.module] = {
            list: [item],
            name: item.module,
            weight: item.moduleWeight || item.moduleWeight===0 ? item.moduleWeight : '',
            servicePerson: item.servicePerson
          }
        }
      })
      return modules
    },
    getOperationalAssessment() {
      const module = this.getList['运营评估得分']
      return (module && module.list && module.list[0]) || {}
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.bl {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    transform: scaleY(0.5);
    background: #dbdbdb;
  }
}
.evaluation-result {
  background: #fff;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .grid {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }
  .grid__row {
    display: flex;
  }
  .grid__col {
    &.bg{
      background: rgb(230,184,184);
    }
    position: relative;
    width: 50%;
    &:last-child::before {
      display: none;
    }
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      top: 0;
      right: 0;
      width: 1px;
      transform: scaleX(0.5);
      background: #dbdbdb;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }

  .evaluation {
    height: 100px;
    text-align: center;
  }

  .evaluation__label {
    padding-top: 20px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 18px;
  }

  .evaluation__value {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(39, 129, 219, 1);
  }

  .evaluation__value.evaluation__value--yellow {
    color: #ffbc00;
  }

  .tips {
    position: relative;
    padding: 7px 26px 10px;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }
  .title {
    height: 20px;
    font-size: 13px;
    font-weight: 600;
    line-height: 20px;
    color: rgba(102, 102, 102, 1);
    padding: 9px 28px;
    position: relative;
  }

  .ability {
    padding: 15px 16px 10px 20px;
  }

  .ability__title {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
  }

  .ability__weights-target {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
    display: flex;
    padding-top: 10px;
    padding-bottom: 26px;
    justify-content: space-between;
    & > .ability__field {
      min-width: 64px;
    }
  }
  .ability__field {
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
    padding-bottom: 10px;
  }

  .ability__field__value {
    color: #000000;
  }

  .ability__title.ability__title--evaluation {
    padding-bottom: 28px;
    display: flex;
    justify-content: space-between;
  }
  .ability__title__value {
    color: #2781db;
  }

  .ability__field__label{
    color: #5e5e5e;
  }
}
</style>
