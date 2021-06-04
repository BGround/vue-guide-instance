<template>
  <div class="oneNet">
    <div class="wrapper">

        <el-row :gutter="15">

          <el-col :span="12">
            <div class="first section">
              <div class="header">
                <h4 class="title">二网规模</h4>
                <div class="statistics">
                  <div class="statistics__value"><span class="blue">{{monthlyNetworkSize}}</span><span>/{{yearTarget}}</span></div>
                  <div class="statistics__label">完成/目标</div>
                </div>
              </div>
              <div class="first__chart">
                <div class="first__chart__bottom">

                  <div class="progress">
                    <div class="instruction">
                      <div class="instruction__item instruction__item--left">0%</div>
                      <div class="instruction__item instruction__item--middle">50%</div>
                      <div class="instruction__item instruction__item--right">100%</div>
                    </div>

                    <div class="progress__wrapper">
                      <el-progress color="#5B8FF9" :show-text="false" :text-inside="true" :stroke-width="16" :percentage="calculation"></el-progress>
                    </div>

                    <div class="instruction">
                      <div class="instruction__item instruction__item--left">0</div>
                      <div class="instruction__item instruction__item--middle">{{getMidValue(yearTarget)}}</div>
                      <div class="instruction__item instruction__item--right">{{yearTarget||0}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="12">
            <progressChart
              title="二网开发"
              :current="developmentCompleted"
              :total="developmentObjectives"
              color="#73DEB3">
            </progressChart>
          </el-col>

          <el-col :span="8">

          </el-col>

        </el-row>

      <el-row :gutter="15" class="mt16">

        <el-col :span="12">
          <progressChart
             title="二网建设"
             :current="completionOfConstruction"
             :total="constructionObjectives"
            color="#EB7F65">
          </progressChart>
        </el-col>

        <el-col :span="12">
          <div class="exit section">
            <div class="exit__title">异常退出</div>
            <div class="exit__value">{{annualNetworkWithdrawal}}</div>
            <div class="exit__label">数量</div>
          </div>
        </el-col>

        <el-col :span="8">

        </el-col>

      </el-row>




    </div>
  </div>
</template>

<script>

    import polarChart from "../../components/polarChart";
    import pieChart from "../../components/pieChart";
    import progressChart from "../../components/progressChart";
    import getData from '../../api/getData'
    export default {
        data() {
            return {
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                calculation: 0,
                monthlyNetworkSize: 0,
                developmentObjectives: 0,
                annualNetworkWithdrawal: 0,
                developmentCompleted: 0,
                constructionObjectives: 0,
                completionOfConstruction: 0,
                yearTarget: 0,
            };
        },
        props:{
            date: {
                type: Object,
                required: true,
            },

        },
        watch:{
            date:{
                deep: true,
                handler(date){
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getTwoScale()
                }
            },

        },
        created(){
            console.log(this.form)
          this.getTwoScale()
        },
        methods: {

          getMidValue(value = 0){
            var v = parseInt(value);
            if(v){
              return Number(v/2).toFixed(0);
            }
            return '0'
          },

            resetChartSize() {
                this.chart.resize()
            },

            getTwoScale(){
                getData.getTwoScale(this.form).then((data)=>{
                    this.calculation = data && data.calculation? data.calculation : 0;
                    this.monthlyNetworkSize = data && data.monthlyNetworkSize? data.monthlyNetworkSize : 0;
                    this.developmentObjectives = data && data.developmentObjectives? data.developmentObjectives : 0;
                    this.annualNetworkWithdrawal = data && data.annualNetworkWithdrawal? data.annualNetworkWithdrawal : 0;
                    this.developmentCompleted = data && data.developmentCompleted? data.developmentCompleted : 0;
                    this.constructionObjectives = data && data.constructionObjectives? data.constructionObjectives : 0;
                    this.completionOfConstruction =data &&  data.completionOfConstruction? data.completionOfConstruction : 0;
                    this.yearTarget = data && data.yearTarget? data.yearTarget : 0;
                })
            }



        },
        components: {
            polarChart,
            pieChart,
            progressChart
        },
        mounted() {

        },
    }
</script>

<style lang="scss" scoped>
  @import '../../scss/common/board.scss';
  .oneNet{

    & /deep/{
      .el-progress-bar__outer, .el-progress-bar__inner{
        border-radius: 0;
      }
      .el-progress{
        white-space: nowrap;
      }
    }

    .progress__wrapper{
      padding: 6px 0;
    }

    .instruction{
      display: flex;
      justify-content: space-between;
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

    .wrapper{
      padding: 24px 0;
    }
    .section{
      border:1px solid rgba(230,230,230,1);
      opacity:1;
      background:rgba(247,247,247,1);
      border-radius:4px;
      height: 188px;
      padding: 24px 24px 0;
      box-sizing: border-box;
    }
    .first{
      background:rgba(255,255,255,1);
    }
    .header{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .title{
        height:42px;
        font-size:20px;
        font-weight:bold;
        line-height:42px;
        color:rgba(20,30,40,1);
      }
      .statistics{

          .statistics__value{
            font-size:32px;
            font-weight:bold;
            line-height:42px;
            color:rgba(51,51,51,1);
            color: #333333;
            .blue{
              color: #5B8FF9;
            }
          }
          .statistics__label{
            text-align: right;
          }
      }
    }
    .first__chart{
      margin-top: 23px;
    }

    .exit{
      text-align: center;
      .exit__title{
        height:26px;
        font-size:20px;
        font-weight:400;
        line-height:26px;
        color:rgba(51,51,51,1);
      }
      .exit__value{
        height:31px;
        font-size:24px;
        font-weight:bold;
        line-height:31px;
        color:rgba(230,55,82,1);
        padding: 35px 0 9px;
        width: 80px;
        margin: 0 auto;
        border-bottom: 1px solid #E6E6E6;
      }
      .exit__label{
        height:19px;
        font-size:14px;
        font-weight:400;
        line-height:19px;
        color:rgba(102,102,102,1);
        margin-top: 8px;

      }
    }

  }
  #changeEnterpriseInfo{
    height: 520px;
    background: rgba(247, 247, 247, 1);



  }
</style>

