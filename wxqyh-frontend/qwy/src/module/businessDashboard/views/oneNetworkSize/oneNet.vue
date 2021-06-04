<template>
  <div class="oneNet">
    <div class="wrapper">

        <el-row :gutter="15">

          <el-col :span="8">
            <div class="first section">
              <div class="header">
                <h4 class="title">一网规模</h4>
                <div class="statistics">
                  <div class="statistics__value"><span class="blue">{{monthlyNetworkSize}}</span><span>/{{yearTarget}}</span></div>
                  <div class="statistics__label">完成情况/年度目标</div>
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
                      <el-progress
                              color="#5B8FF9"
                              :show-text="false"
                              :text-inside="true"
                              :stroke-width="16"
                              :percentage="normalizePercent(calculation)">
                      </el-progress>
                    </div>

                    <div class="instruction">
                      <div class="instruction__item instruction__item--left">0</div>
                      <div class="instruction__item instruction__item--middle">{{ getMidValue(yearTarget) }}</div>
                      <div class="instruction__item instruction__item--right">{{yearTarget || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <el-col :span="8">


            <newNetDev :data="oneNetworkProgressPO"></newNetDev>
          </el-col>

          <el-col :span="8">



            <div class="first section">
              <div class="header">
                <h4 class="title">店面建设</h4>
                <div class="statistics">
                  <div class="statistics__value"><span class="blue">{{onenetStorefrontBuildPO.finishedNum || 0}}</span><span>/{{onenetYearTarget || 0}}</span></div>
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
                      <el-progress
                              color="#5B8FF9"
                              :show-text="false"
                              :text-inside="true"
                              :stroke-width="16"
                              :percentage="calculatePercentage(onenetYearTarget,onenetStorefrontBuildPO.finishedNum)">
                      </el-progress>
                    </div>

                    <div class="instruction">
                      <div class="instruction__item instruction__item--left">0</div>
                      <div class="instruction__item instruction__item--middle">{{ getMidValue(onenetYearTarget) }}</div>
                      <div class="instruction__item instruction__item--right">{{onenetYearTarget || 0}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </el-col>

        </el-row>

      <el-row :gutter="15" class="mt16">

        <el-col :span="8">
          <progressChart
            title="新网开通"
            :current="openingTarget"
            :total="openingYearTarget"
            color="#73DEB3">
          </progressChart>
        </el-col>

        <el-col :span="8">
          <progressChart
            title="预警网点"
            :current="violationCount"
            :total="violation"
            color="#E63752">
          </progressChart>
        </el-col>

        <el-col :span="8">
          <pieChart
              title="异常退出"
              :color="['#7585A2', '#E63752', '#F5D023', '#3CD083', '#7585A2', '#C31725']"
              :options="assemblyOptionsOfExit"
          ></pieChart>
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
    import circularChart from "@/module/businessDashboard/components/circularChart";
    import newNetDev from "../../components/newNetDev";

    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },

                yearTarget: 0,	//	一网规模-年度目标
                monthlyNetworkSize: 0, //	一网规模-完成情况
                calculation: 0 ,	//一网规模-进度条计算
                oneNetworkProgressPO: {
                    meetingNum: 0, //	新网开发-已上会
                    approvalNum	: 0, //	新网开发-已审批
                    paymentNum: 0, //	新网开发-已打款
                    unPaymentNum: 0, //	新网开发-未打款
                    monthlyTarget: 0,
                },//	新网开发对象
                onenetYearTarget: 0,
                onenetStorefrontBuildPO: {
                    onenetYearTarget: 0, //	店面建设-年度计划数
                    underConstrucNum: 0, //	店面建设-在建
                    finishedNum: 0, //	店面建设-完工
                    delayNum: 0, //	店面建设-延期
                }, //	店面建设对象
                openingYearTarget: 0,	//新网开通-完成
                openingTarget: 0, //	新网开通-目标
                openingCalculation: 0, //	新网开通-进度条计算
                violationCount: 0, //	预警网点数
                violation: 0, //	预警总数
                violationRate: 0, //	预警进度条
                activeRetreat: 0, //	异常退出-主动清退
                activeApplication: 0, //	异常退出-主动申请

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
                    this.getOneScale()
                }
            },

        },
        created(){
            this.getOneScale()
        },
        computed:{
            assemblyOptionsOfBuilding(){
                return [
                    {
                        value: this.onenetYearTarget || 0,
                        name: '目标',
                        color: '#5B8FF9'
                    },
                    {
                        value: this.onenetStorefrontBuildPO.underConstrucNum  || 0,
                        name: '在建',
                        color: '#73DEB3'
                    },
                    {
                        value: this.onenetStorefrontBuildPO.finishedNum  || 0,
                        name: '完工',
                        color: '#F7C739'
                    },
                    {
                        value: this.onenetStorefrontBuildPO.delayNum  || 0,
                        name: '延期',
                        color: '#E63752'
                    }
                ]
            },

            assemblyOptionsOfExit(){
                return [
                    {
                        value: this.activeRetreat,
                        name: '主动清退',
                        color: '#E63752'
                    },
                    {
                        value: this.activeApplication,
                        name: '主动申请',
                        color: '#7585A2'
                    }
                ]
            }
        },
        methods: {

            normalizePercent(value){
                return  value > 100? 100: value;
            },

            calculatePercentage(total, current){
                if(!total || !current){
                    return 0
                }
                const percentage = (current / total) * 100;
                return percentage > 100? 100 : percentage;
            },

          getMidValue(value = 0){
            var v = parseInt(value);
            if(v){
              return Number(v/2).toFixed(0);
            }
            return '0'
          },

            getOneScale(){
                getData.getOneScale(this.form).then((data)=>{
                    if(data){
                        this.yearTarget = data.yearTarget || 0;	//	一网规模-年度目标
                        this.monthlyNetworkSize = data.monthlyNetworkSize || 0; //	一网规模-完成情况
                        this.calculation = data.calculation || 0;	//一网规模-进度条计算
                        this.oneNetworkProgressPO = data.oneNetworkProgressPO? data.oneNetworkProgressPO : {
                            meetingNum: 0, //	新网开发-已上会
                            approvalNum	: 0, //	新网开发-已审批
                            paymentNum: 0, //	新网开发-已打款
                            unPaymentNum: 0, //	新网开发-未打款
                            monthlyTarget: 0,
                        };//	新网开发对象
                        this.onenetYearTarget = data&& data.onenetYearTarget? data.onenetYearTarget: 0; //	店面建设-年度计划数
                        this.monthlyTarget = data.monthlyTarget || 0; //	新网开发-月度目标
                        this.onenetStorefrontBuildPO = data.onenetStorefrontBuildPO? data.onenetStorefrontBuildPO : {
                            onenetYearTarget: this.onenetYearTarget? this.onenetYearTarget:0,
                            underConstrucNum: 0, //	店面建设-在建
                            finishedNum: 0, //	店面建设-完工
                            delayNum: 0, //	店面建设-延期
                        };
                        this.openingYearTarget= data.openingYearTarget || 0;	//新网开通-完成
                        this.openingTarget= data.openingTarget || 0; //	新网开通-目标
                        this.underConstrucNum = data.underConstrucNum || 0; //	店面建设-在建
                        this.finishedNum = data.finishedNum || 0; //	店面建设-完工
                        this.delayNum = data.delayNum || 0; //	店面建设-延期
                        this.openingCalculation = data.openingCalculation || 0; //	新网开通-进度条计算
                        this.violationCount = data.violationCount || 0; //	预警网点数
                        this.violation = data.violation || 0; //	预警总数
                        this.violationRate = data.violationRate || 0; //	预警进度条
                        this.activeRetreat = data.activeRetreat || 0; //	异常退出-主动清退
                        this.activeApplication = data.activeApplication || 0; //	异常退出-主动申请
                    }else{
                        this.yearTarget = 0;	//	一网规模-年度目标
                        this.monthlyNetworkSize = 0; //	一网规模-完成情况
                        this.calculation = 0;	//一网规模-进度条计算
                        this.oneNetworkProgressPO = {
                            meetingNum: 0, //	新网开发-已上会
                            approvalNum	: 0, //	新网开发-已审批
                            paymentNum: 0, //	新网开发-已打款
                            unPaymentNum: 0, //	新网开发-未打款
                            monthlyTarget: 0,
                        };//	新网开发对象
                        this.monthlyTarget = 0; //	新网开发-月度目标
                        this.onenetStorefrontBuildPO =  {
                            onenetYearTarget: 0, //	店面建设-年度计划数
                            underConstrucNum: 0, //	店面建设-在建
                            finishedNum: 0, //	店面建设-完工
                            delayNum: 0, //	店面建设-延期
                        };
                        this.openingYearTarget= 0;	//新网开通-完成
                        this.openingTarget= 0; //	新网开通-目标
                        this.underConstrucNum = 0; //	店面建设-在建
                        this.finishedNum = 0; //	店面建设-完工
                        this.delayNum = 0; //	店面建设-延期
                        this.openingCalculation = 0; //	新网开通-进度条计算
                        this.violationCount = 0; //	预警网点数
                        this.violation = 0; //	预警总数
                        this.violationRate = 0; //	预警进度条
                        this.activeRetreat = 0; //	异常退出-主动清退
                        this.activeApplication = 0; //	异常退出-主动申请
                    }

                    const updateUser = data && data.oneNetworkProgressPO && data.oneNetworkProgressPO.modifyUser ? data.oneNetworkProgressPO.modifyUser : '';
                    const updateTime = data && data.oneNetworkProgressPO && data.oneNetworkProgressPO.modifyTime ? new Date(data.oneNetworkProgressPO.modifyTime).toISOString().substring(0,10) : '';
                    this.$emit('change', {updateTime,updateUser})
                })
            },


        },
        components: {
            circularChart,
            polarChart,
            pieChart,
            progressChart,
            newNetDev
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
  }
  #changeEnterpriseInfo{
    height: 520px;
    background: rgba(247, 247, 247, 1);



  }
</style>

