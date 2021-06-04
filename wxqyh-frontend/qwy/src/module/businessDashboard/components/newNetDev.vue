<template>
    <div class="polar-chart">
        <div class="section">
          <div class="polar-chart__title">新网开发</div>

          <div class="charts">
            <div class="charts__item">
              <div class="charts__item__label">
                <span class="label__legend blue"></span>
                <span class="label__text">目标</span>
              </div>
              <div class="charts__item__value">{{monthlyTarget}}</div>
              <div class="charts__item__process">
                <el-progress
                        color="#5B8FF9"
                        :show-text="false"
                        :text-inside="true"
                        :stroke-width="16"
                        :percentage="normalizePercent(monthlyTarget)">
                </el-progress>
              </div>
            </div>

            <div class="charts__item">
              <div class="charts__item__label">
                <span class="label__legend green"></span>
                <span class="label__text">上会</span>
              </div>
              <div class="charts__item__value">{{meetingNum}}</div>
              <div class="charts__item__process">
                <el-progress
                        color="#3CD083"
                        :show-text="false"
                        :text-inside="true"
                        :stroke-width="16"
                        :percentage="meetingNum">
                </el-progress>
              </div>
            </div>

            <div class="charts__item">
              <div class="charts__item__label">
                <span class="label__legend gray"></span>
                <span class="label__text">打款</span>
              </div>
              <div class="charts__item__value">{{paymentNum}}</div>
              <div class="charts__item__process">
                <el-progress
                        color="#7585A2"
                        :show-text="false"
                        :text-inside="true"
                        :stroke-width="16"
                        :percentage="paymentNum">
                </el-progress>
              </div>
            </div>
          </div>

        </div>
    </div>
</template>

<script>



    export default {
        name: "newNetDev",
        components: {},
        data() {
            return {
                chart: null,
                isActiveTarget: true,
                isActiveMeeting: true,
                isActiveApprove: true,
                isActivePaid: true,
                isActiveUnpaid: true,

                monthlyTarget: 0,
                meetingNum: 0,
                approvalNum: 0,
                paymentNum: 0,
                unPaymentNum: 0,
            }
        },
        props: {
            data: {
                type: Object,
                default(){
                    return {
                        meetingNum: 0, //	新网开发-已上会
                        approvalNum	: 0, //	新网开发-已审批
                        paymentNum: 0, //	新网开发-已打款
                        unPaymentNum: 0, //	新网开发-未打款
                        monthlyTarget: 0,
                        hasData: false,
                    }
                }
            }
        },
        methods: {
            normalizePercent(value){
                return  value > 100? 100: value;
            },
            handleClick(name, field){
                if(!this.hasData){
                    return
                }
                this.chart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: name                    // 图例名称
                })
                this[field] = !this[field];
            },


            setData(data){
                this.monthlyTarget = data.monthlyTarget || 0;
                this.meetingNum = data.meetingNum || 0;
                this.approvalNum = data.approvalNum || 0;
                this.paymentNum = data.paymentNum || 0;
                this.unPaymentNum = data.unPaymentNum || 0;
            },

            checkOptions(data){
                return !!(data.monthlyTarget || data.meetingNum ||  data.approvalNum || data.paymentNum || data.unPaymentNum)
            },
        },
        watch:{
            data:{
                deep: true,
                handler(data){
                    this.hasData = this.checkOptions(data);
                    this.setData(data)
                }
            }
        },
        created() {
            this.hasData = this.checkOptions(this.data);
            this.setData(this.data)
        },
        mounted() {

        }
    }
</script>

<style scoped lang="scss">
  .polar-chart{
    .section{
      box-sizing: border-box;
      width:374px;
      height:188px;
      background:rgba(247,247,247,1);
      border:1px solid rgba(230,230,230,1);
      border-radius:4px;
      /*display: flex;*/
      padding: 24px;
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
    }
    .polar-chart__title{
      height:26px;
      font-size:20px;
      font-weight:400;
      line-height:26px;
      color:rgba(51,51,51,1);
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
        margin: 15px 0;
      }

    }

    .charts{
      margin-top: 12px;
    }

    .charts__item{
      display: flex;
      align-items: center;
      height: 36px;
      .charts__item__label{
        width: 50px;
        text-indent: 20px;
        position: relative;
        .label__legend{
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(0, -50%);
          height:12px;
          width: 12px;
        }
      }
      .charts__item__value{
        width: 60px;
        text-indent: 5px;
        font-weight: bold;
      }
      .charts__item__process{
        width: 214px;
      }

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
  }
</style>
