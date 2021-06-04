

<template>
  <div class="completion">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            年度完成TOP2
          </div>
          <div class="board__card__content">
            <div class="card__progress" v-if="completionRateMax1.businessModuleName">
              <div class="card__progress__name">{{completionRateMax1.businessModuleName || ''}}</div>
              <div class="card__progress__bar">
                <el-progress stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="completionRateMax1.completionRate"></el-progress>
              </div>
            </div>

            <div class="card__progress" v-if="completionRateMax2.businessModuleName ">
              <div class="card__progress__name">{{completionRateMax2.businessModuleName || ''}}</div>
              <div class="card__progress__bar">
                <el-progress  stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="completionRateMax2.completionRate"></el-progress>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            年度完成BOT2
          </div>
          <div class="board__card__content">
            <div class="card__progress" v-if="completionRateMin1.businessModuleName">
              <div class="card__progress__name">{{completionRateMin1.businessModuleName}}</div>
              <div class="card__progress__bar">
                <el-progress stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="completionRateMin1.completionRate"></el-progress>
              </div>
            </div>

            <div class="card__progress" v-if="completionRateMin2.businessModuleName">
              <div class="card__progress__name">{{completionRateMin2.businessModuleName}}</div>
              <div class="card__progress__bar">
                <el-progress  stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="completionRateMin2.completionRate"></el-progress>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            人 / 财 / 店
          </div>
          <div class="board__card__content">
            <div class="card__progress" v-for="(item, index) in cruxList" :key="index">
              <div class="card__progress__name">{{item.businessModuleName}}</div>
              <div class="card__progress__bar">
                <el-progress stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="item.completionRate"></el-progress>
              </div>
            </div>

<!--            <div class="card__progress" v-if="cruxList2.businessModuleName">-->
<!--              <div class="card__progress__name">{{cruxList2.businessModuleName}}</div>-->
<!--              <div class="card__progress__bar">-->
<!--                <el-progress  stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="cruxList2.completionRate"></el-progress>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="card__progress" v-if="cruxList3.businessModuleName">-->
<!--              <div class="card__progress__name">{{cruxList3.businessModuleName}}</div>-->
<!--              <div class="card__progress__bar">-->
<!--                <el-progress  stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="cruxList3.completionRate"></el-progress>-->
<!--              </div>-->
<!--            </div>-->

          </div>
        </div>
      </div>

      <div class="board__content__right">
          <el-row :gutter="16">
            <el-col v-for="(item, index) in moduleList" :key="index" :span="8">
              <div class="panel">
                <h3 class="panel__title">{{item.businessModuleName}}</h3>
                <div class="panel__field">
                  <div class="panel__field__item">
                    <div class="panel__field__item__value red">{{item.generalObjective}}</div>
                    <div class="panel__field__item__label">目标</div>
                  </div>
                  <div class="panel__field__item">
                    <div class="panel__field__item__value green">{{item.cumulativeCompletion}}</div>
                    <div class="fpanel__ield__item__label">完成</div>
                  </div>
                  <div class="panel__field__item">
                    <div class="panel__field__item__value blue">{{item.completionRate}}%</div>
                    <div class="panel__field__item__label">完成率</div>
                  </div>
                </div>

                <div class="panel__progress">
                  <div class="panel__progress__name">年度</div>
                  <div class="panel__progress__bar">
                    <el-progress :show-text="false" stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="item.completionRate"></el-progress>
                  </div>
                </div>

                <div class="panel__line"></div>

                <div class="panel__progress">
                  <div class="panel__progress__name">月度</div>
                  <div class="panel__progress__bar">
                    <el-progress :show-text="false" stroke-linecap="square" :stroke-width="8" color="#5B8FF9" :percentage="item.vo && item.vo.monthCompletionRate || 0"></el-progress>
                  </div>
                </div>

                <div class="panel__desc">
                    <span class="panel__desc__item">
                      当月目标：{{item.vo && item.vo.monthTarget || 0}}
                    </span>
                  <span class="panel__desc__item">
                    当月完成：{{item.vo && item.vo.completedInTheMonth || 0}}
                  </span>
                  <span class="panel__desc__item">
                    缺口：{{item.vo && item.vo.gapTarget || 0}}
                  </span>
                </div>

              </div>
            </el-col>
          </el-row>

      </div>

    </div>
  </div>
</template>

<script>
    import networkSaleApi from '../../api/networkSaleApi'
    import cheerySwitch from "../../components/cheerySwitch";
    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                businessModuleName: '', //业务模块
                generalObjective : 0,          //年度总目标
                cumulativeCompletion : 0,           //年度累计完成
                completionRate : 0,         //年度完成率
                monthTarget : 0,     //当月目标
                completedInTheMonth : 0,                //当月完成
                gapTarget : 0,     //缺口remark: '',         //备注
                keyBusiness : 0,                 //关键业务1是2否keyBusinessName: '',                 //关键业务是/否
                updateUser: '',                      //更新者
                updateTime: '',                      //更新时间
                // private BusinessModuleCompletionDetailsPCVO vo; //当月信息
                moduleList:[],
                monthCompletionRate: 0,
                completionRateMin1: {},
                completionRateMin2: {},
                cruxList1: {},
                cruxList2: {},
                completionRateMax1:{},
                completionRateMax2:{},
                cruxList3:{}
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
                    console.log(date)
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getCompletionData()
                }
            },

        },
        created(){
            this.getCompletionData()
        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            getCompletionData(){
                networkSaleApi.getModuleTopRanking(this.form).then((data)=>{
                    if(data){
                        this.monthlyDate = data.vo.monthlyDate;
                        this.businessModuleName = data.vo.businessModuleName;
                        this.generalObjective = data.vo.generalObjective;
                        this.cumulativeCompletion = data.vo.cumulativeCompletion;
                        this.completionRate = data.vo.completionRate;
                        this.monthTarget = data.vo.monthTarget;
                        this.completedInTheMonth = data.vo.completedInTheMonth;
                        this.gapTarget = data.vo.gapTarget;
                        this.remark = data.vo.remark;
                        this.keyBusiness = data.vo.keyBusiness;
                        this.keyBusinessName = data.vo.keyBusinessName;
                        this.updateUser = data.vo.updateUser;
                        this.updateTime = data.vo.updateTime;
                        this.monthCompletionRate = data.vo.monthCompletionRate;

                        this.completionRateMin = data.completionRateMin
                        this.cruxList = data.cruxList || []
                        this.completionRateMax = data.completionRateMax

                        this.completionRateMin1 = (data.completionRateMin && data.completionRateMin[0] )?data.completionRateMin[0] :{};
                        this.completionRateMin2 = (data.completionRateMin && data.completionRateMin[1] )?data.completionRateMin[1] :{};
                        // this.cruxList = data.cruxList || []
                        // this.cruxList2 = (data.cruxList && data.cruxList[1] )?data.cruxList[1] :{};
                        // this.cruxList3 = (data.cruxList && data.cruxList[2] )?data.cruxList[2] :{};
                        this.completionRateMax1 = (data.completionRateMax && data.completionRateMax[0] )?data.completionRateMax[0] :{};
                        this.completionRateMax2 = (data.completionRateMax && data.completionRateMax[1] )?data.completionRateMax[1] :{};

                        this.$emit('change',{
                            updateUser: data.vo.updateUser || '',
                            updateTime: data.vo.updateTime || '',
                        })
                    }else{
                        this.$emit('change',{
                            updateUser:'',
                            updateTime: ''
                        })
                    }

                })
                networkSaleApi.getModuleTopRankingList(this.form).then((data)=>{
                    if(data){
                        this.moduleList = data.moduleList
                    }
                })
            },

        },
        components: {
            cheerySwitch
        },
        mounted() {

        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .completion{

    & /deep/{
      .el-progress-bar__outer, .el-progress-bar__inner{
        border-radius: 0;
      }
      .el-progress{
        white-space: nowrap;
      }
    }
    .board__card{
      min-height: 180px;
    }
    .board__content__left{
      flex-basis: 276px;

      .board__card__content{
        padding: 8px 19px 0 24px;
        .card__progress{
          margin: 16px 0;
          display: flex;
          .card__progress__name{
            flex-basis: 84px;
            margin-right: 8px;
            font-size:14px;
            font-weight:400;
            line-height:19px;
            color:rgba(102,102,102,1);
          }
          .card__progress__bar{
            flex-grow: 1;
          }
        }
      }
    }
    .board__content__right{
      flex-basis: 860px;
    }
    .panel{
      padding: 22px 24px 17px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(230,230,230,1);
      opacity:1;
      border-radius:4px;
      margin-bottom: 16px;
      .panel__title{
        height:26px;
        font-size:20px;
        text-align: center;
        font-weight:bold;
        line-height:26px;
        color:rgba(51,51,51,1);
      }
      .panel__field{
        display: flex;
        padding: 24px 7px 14px;
        justify-content: space-between;
      }
      .panel__field__item{
        text-align: center;
      }
      .panel__field__item__label{
        height:16px;
        font-size:12px;
        font-weight:400;
        line-height:24px;
        color:rgba(102,102,102,1);
      }
      .panel__field__item__value{
        height:19px;
        font-size:14px;
        font-weight:bold;
        line-height:24px;
        color:rgba(91,143,249,1);
        &.red{
          color: #C31725;
        }
        &.green{
          color: #3CD083;
        }
      }
      .panel__progress{
        display: flex;
        align-items: center;
        .panel__progress__name{
          flex-basis: 38px;
          flex-shrink: 0;
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:24px;
          color:rgba(102,102,102,1);
        }
        .panel__progress__bar{
          flex-grow: 1;
        }
      }
      .panel__line{
        margin: 16px 0;
        height: 1px;
        background: #E6E6E6;
      }
      .panel__desc{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .panel__desc__item{
        height:16px;
        font-size:12px;
        font-weight:400;
        line-height:24px;
        color:rgba(102,102,102,1);
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
        &:first-child{
          text-align: left;
        }
        &:last-child{
          text-align: right;
        }
      }
    }
  }

</style>



