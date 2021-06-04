<template>
    <div class="progress-chart">

      <div class="section">
        <div class="progress-chart__top">
          <div class="chart__title">{{title}}</div>
          <div class="statistics">
            <div class="statistics__value">{{current}}/{{total}}</div>
            <div class="statistics__label">完成/目标</div>
          </div>
        </div>

        <div class="progress-chart__bottom">
          <div class="instruction">
            <div class="instruction__item instruction__item--left">0%</div>
            <div class="instruction__item instruction__item--middle">50%</div>
            <div class="instruction__item instruction__item--right">100%</div>
          </div>
          <div class="progress">
            <el-progress :show-text="false" :color="color" :text-inside="true" :stroke-width="16" :percentage="normalizePercent(percentage)"></el-progress>
          </div>
        </div>
      </div>



    </div>
</template>

<script>


    export default {
        name: "progressChart",
        components: {},
        data() {
            return {
                chart: null,
                isActiveTarget: true,
                isActiveMeeting: true,
                isActiveApprove: true,
                isActivePaid: true,
                isActiveUnpaid: true,
            }
        },
        props: {
            color:{
              type: String,
              required: true,
            },
             title:{
              type: String,
              required: true,
            },
            current:{
              type: Number,
              default(){
                return 0;
              }
            },
            total:{
              type: Number,
              default(){
                return 0;
              }
            }
        },
        computed:{
          percentage(){
            if(!this.total || !this.current){
              return 0
            }
            return (this.current / this.total) * 100;
          }
        },
        methods: {

            normalizePercent(value){
                return  value > 100? 100: value;
            },

            handleClick(name, field){
                this.chart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: name                    // 图例名称
                })
                this[field] = !this[field];
            }

        },
        created() {

        },
        mounted() {

        }
    }
</script>

<style scoped lang="scss">
  .progress-chart{

    & /deep/{
      .el-progress-bar__outer, .el-progress-bar__inner{
        border-radius: 0;
      }
      .el-progress{
        white-space: nowrap;
      }
    }

    .section{
      box-sizing: border-box;
      /*width:374px;*/
      height:188px;
      background:rgba(247,247,247,1);
      border:1px solid rgba(230,230,230,1);
      border-radius:4px;
      padding: 24px;
    }

    .statistics__value{
      height:19px;
      font-size:14px;
      font-weight:bold;
      line-height:19px;
      color:rgba(51,51,51,1);
      text-align: right;
    }
    .statistics__label{
      margin-top: 4px;
      height:16px;
      font-size:12px;
      font-weight:400;
      line-height:16px;
      color:rgba(153,153,153,1);
      text-align: right;
    }

    .instruction{
      display: flex;
      justify-content: space-between;
      padding-bottom: 6px;
    }
    .instruction__item{
      flex-basis: 33.33%;
      height:16px;
      font-size:12px;
      font-weight:400;
      line-height:16px;
      color:rgba(153,153,153,1);
      &--left{
        text-align: left;
      }
      &--middle{
        text-align: center;
      }
      &--right{
        text-align: right;
      }
    }

    .chart__left{
      flex-grow: 1;
    }
    .chart__right{
      margin-top: 7px;
      flex-shrink: 0;
      flex-basis: 142px;
      .chart__chart{
        width: 142px;
        height: 142px;
      }
    }
    .legend-dot{
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #eee;
      line-height: 19px;
      margin-right: 2px;
      vertical-align: top;
      margin-top: 6px;
      background: #eee;
    }
    .chart__title{
      height:26px;
      font-size:20px;
      font-weight:400;
      line-height:26px;
      color:rgba(51,51,51,1);
    }
    .progress-chart__top{
      display: flex;
      justify-content: space-between;
    }
    .legend{
      width: 100%;
      height:19px;
      font-size:14px;
      font-weight:400;
      line-height:19px;
      color:rgba(153,153,153,1);
      .active{
        .blue{
          background: #5B8FF9;
        }
        .yellow{
          background: #F5D023;
        }
        .green{
          background: #3CD083;
        }
        .gray{
          background: #7585A2;
        }
        .red{
          background: #C31725;
        }
      }


      .row{
        margin: 9px 0;
      }
    }

    .progress-chart__bottom{
      margin-top: 45px;
    }
  }
</style>
