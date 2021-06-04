<template>
  <div class="intention">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            整体情况
          </div>
          <div class="situation">

            <div class="situation__item" v-for="(item, index) in situationList" :key="index">
              <div class="situation__left"  v-popover:popover>
                <h4 class="situation__left__value">{{item.typeCount}}家</h4>
                <div class="situation__left__label">{{item.type}}</div>
              </div>
              <div class="situation__right">
                <span>已上会：{{item.alreadyMeetingCount}}家</span>
                <span>未上会：{{item.notMeetingCount}}家</span>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="change">
            <div class="change__title">本周新增意向退网</div>
            <div v-for="(item, index) in weekList" :key="index" class="change__item">
                <span class="change__item__label">{{item.warZone}}:</span>
                <span class="change__item__value">{{item.typeCount?item.typeCount:0}}家 ({{item.dealerName}})</span>
            </div>

          </div>
        </div>
      </div>

      <div class="board__content__right">

        <div class="table">
          <el-table
            :data="tableData"
            :span-method="objectSpanMethod"
            border
            style="width: 100%">
            <el-table-column
              class-name="type"
              align="center"
              prop="type"
              label="类型"
              width="180">
              <template slot-scope="scope">
                <span>{{scope.row.type || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="reason"
              align="center"
              label="异常原因">
              <template slot-scope="scope">
                <span>{{scope.row.reason || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="businessException"
              align="center"
              label="经营异常">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper" v-if="scope.row.businessExceptionDealer.length"  trigger="hover" placement="right">
                  <p v-for="(item,index) in scope.row.businessExceptionDealer" :key="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span >{{ scope.row.businessException }}</span>
                  </span>
                </el-popover>
                <span v-else>{{scope.row.businessException || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="operatingException"
              label="运营异常">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper" v-if="scope.row.operatingExceptionDealer.length" trigger="hover" placement="right">
                  <p v-for="(item,index) in scope.row.operatingExceptionDealer" :key="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span>{{ scope.row.operatingException }}</span>
                  </span>
                </el-popover>
                <span v-else>{{ scope.row.operatingException || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="fundsException"
              align="center"
              label="资金异常">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper" v-if="scope.row.fundsExceptionDealer.length" trigger="hover" placement="right">
                  <p v-for="(item,index) in scope.row.fundsExceptionDealer" :key="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span >{{ scope.row.fundsException }}</span>
                  </span>
                </el-popover>
                <span v-else>{{ scope.row.fundsException || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="storeException"
              label="店面异常">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper" v-if="scope.row.storeExceptionDealer.length" trigger="hover" placement="right">
                  <p v-for="(item,index) in scope.row.storeExceptionDealer" :key="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span >{{ scope.row.storeException }}</span>
                  </span>
                </el-popover>
                <span v-else>{{ scope.row.storeException || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="other"
              align="center"
              label="其他">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper" v-if="scope.row.otherExceptionDealer.length" trigger="hover" placement="right">
                  <p v-for="(item,index) in scope.row.otherExceptionDealer" :key="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span >{{ scope.row.otherException }}</span>
                  </span>
                </el-popover>
                <span v-else>{{scope.row.otherException || '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total"
              align="center"
              label="合计">
              <template slot-scope="scope">
                <span>{{scope.row.total || '-'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        </div>


      </div>
  </div>
</template>

<script>
    import exitingNetworkApi from '../../api/exitingNetworkApi'
    import marketDisciplineAreaChart from '../../components/marketDisciplineAreaChart'
    export default {
        name: 'intention',
        components:{
            marketDisciplineAreaChart
        },
        data() {
            return {
                tableData: [],
                form:{
                    month: this.date.month,
                    year: this.date.year
                },
                situationList: [],
                weekList: [],
                exitingNetworkDealers: [],
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
                    this.getIntentionExitList()
                    this.getIntentionExit()
                }
            },

        },
        created(){
            this.getIntentionExitList()
            this.getIntentionExit()
        },
        methods: {

            /**
             * 计算总计
             */
            calculateTotal(intentionExitList, type){
              return intentionExitList
                  .filter((item)=> item.type!=='总计')
                  .map(item=> type === '已上会'? item.alreadyMeetingCount : item.notMeetingCount)
                  .reduce((total,value)=>(total = total + value) ,0)
            },

            getIntentionExitList(){
                exitingNetworkApi.getIntentionExitList(this.form).then((data)=>{
                    const intentionExitList = data && data.intentionExitList? data.intentionExitList : [];
                    const tableData = []
                    intentionExitList.forEach((intentionItem)=>{
                        const list = intentionItem.list || [];
                        list.forEach((item, index)=>{
                            let total = '-'
                            if(intentionItem.type==='合计'){
                               total = this.calculateTotal(intentionExitList, item.upperConferenceState);
                            }else{
                               total = item.upperConferenceState === '已上会' ? intentionItem.alreadyMeetingCount : intentionItem.notMeetingCount
                            }
                            tableData.push({
                                total: total,
                                otherException: item.abnormalReason5 || '',
                                storeException: item.abnormalReason4 || '',
                                fundsException: item.abnormalReason3 || '',
                                operatingException: item.abnormalReason2 || '',
                                businessException:  item.abnormalReason1 || '',
                                reason: item.upperConferenceState || '',
                                type: intentionItem.type || '',
                                storeExceptionDealer: item.abnormalReason4Name? item.abnormalReason4Name.split('、') : [],
                                fundsExceptionDealer: item.abnormalReason3Name? item.abnormalReason3Name.split('、') : [],
                                operatingExceptionDealer: item.abnormalReason2Name? item.abnormalReason2Name.split('、') : [],
                                businessExceptionDealer: item.abnormalReason1Name ? item.abnormalReason1Name.split('、') : [],
                                otherExceptionDealer: item.abnormalReason5Name ? item.abnormalReason5Name.split('、') : [],
                            })
                        })
                    })
                    this.tableData = tableData
                })
            },

            getIntentionExit(){
                exitingNetworkApi.getIntentionExit(this.form).then((data)=>{
                    if(data){
                        this.situationList = data.intentionExit || []
                        this.weekList = data.weekIntentionExit || [];
                        const total = this.weekList.map((item)=> item.dotTypeCount).reduce((init, count)=> {
                            return init + count
                        }, 0)
                        this.exitingNetworkDealers = this.weekList.map((item)=>{
                            return item.dealerName
                        })

                        this.total = total
                    }

                    if(data && data.user){
                        this.$emit('change',{
                            updateUser: data.user.updateUser || '',
                            updateTime: data.user.updateTime || '',
                        })
                    }else {
                        this.$emit('change', {
                            updateUser: '',
                            updateTime: ''
                        })
                    }
                })
            },

            headerCellStyle(row, rowIndex){
                return {
                    height:'48px',
                    background: 'rgba(20,30,40,0.1)',
                    borderRightColor: 'rgba(20,30,40,0.1)',
                    color: 'rgba(51, 51, 51, 1)'
                }
            },

            cellStyle({row, column, rowIndex, columnIndex}){
                const baseStyle = {
                    height: '48px',
                    color: 'rgba(51, 51, 51, 1)'
                }

                if(columnIndex == 0){
                    return Object.assign({}, baseStyle, {
                        background: 'rgba(247,247,247,1)'
                    })
                }else{
                    return  baseStyle
                }
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    const firstFroze = this.tableData.find(item => item.type === row.type);
                    const index = this.tableData.indexOf(firstFroze)
                    const sameTypeCount = this.tableData.filter(item => item.type === row.type).length;
                    if (index === rowIndex) {
                        return {
                            rowspan: sameTypeCount,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }

        },
        computed:{

        },

        mounted() {


        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .intention{
    .board__card{
      min-height: 286px;
    }
    .situation{
      padding: 0 24px 0 24px;
      .situation__item{
        padding: 16px 0 17px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        &:last-child{
          border-bottom: none;
        }
        .situation__left__value{
          height:26px;
          font-size:20px;
          font-weight:bold;
          line-height:26px;
          color:rgba(51,51,51,1);
        }
        .situation__left__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
      }
    }
    .change{
      padding: 24px;
      & /deep/ img{
        max-width: 100% !important;
      }
      .change__title{
        height:19px;
        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(51,51,51,1);
      }
      .change__item{
        margin: 10px 0;
        display: flex;
        align-items: flex-start;
        .change__item__label{
          flex-basis:70px;
          height:19px;
          flex-shrink: 0;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(51,51,51,1);
        }
        .change__item__value{
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
      }
    }

    .board__content__right{
      min-height: 645px;
    }

    .chart{
      padding-top: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #F7F7F7;
      justify-content: flex-end;
      .chart__item{
        justify-content: space-around;
        flex-basis: 80px;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        text-align: center;
        &.x{
          flex-basis: 48px;
          flex-grow: 0;
        }
        .chart__item__label{
          flex-basis: 100px;
          flex-shrink: 0;
        }
        .chart__item__wrapper{
          flex-grow: 1;
          height: 100%;
          padding-right: 50px;
        }
      }
    }

    .table /deep/{
      .el-table__header thead th{
        background-color: rgba(20, 30, 40, 0.1);
      }
      .type{
        background: rgba(247, 247, 247, 1);
      }
    }

  }
</style>

<style>
  .table-popper{
    min-width: 40px;
  }
</style>


