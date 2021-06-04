<template>
  <div class="zombie">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            整体情况
          </div>
          <div class="situation">
            <div class="situation__col">
              <div class="situation__item bold line">
                <div class="situation__item__label">僵尸网点</div>
                <div class="situation__item__value green">{{zombieCount}} 家</div>
              </div>
              <div class="situation__item">
                <div class="situation__item__label">经营异常</div>
                <div class="situation__item__value">{{businessExceptionCount}} 家</div>
              </div>
              <div class="situation__item">
                <div class="situation__item__label">运营异常</div>
                <div class="situation__item__value">{{operationExceptionCount}} 家</div>
              </div>
              <div class="situation__item">
                <div class="situation__item__label">资金异常</div>
                <div class="situation__item__value">{{fundsExceptionCount}} 家</div>
              </div>
              <div class="situation__item">
                <div class="situation__item__label">店面异常</div>
                <div class="situation__item__value">{{storeExceptionCount}} 家</div>
              </div>

            </div>
            <div class="situation__col">
              <div class="situation__item bold">
                <div class="situation__item__label">僵尸转在网网点</div>
                <div class="situation__item__value yellow">{{toOnlineCount}} 家</div>
              </div>
              <div class="situation__item bold">
                <div class="situation__item__label">僵尸转退网网点</div>
                <div class="situation__item__value red">{{toNormalCount}} 家</div>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="change">
            <div class="change__title">本周新增僵尸网点</div>
            <div v-for="(item) in weekList" class="change__item">
              <span class="change__item__label">{{item.warZone}}:</span>
              <span class="change__item__value">{{item.typeCount?item.typeCount:0}}家（{{item.dealerName}}{{item.zombieNetworkType? `(${item.zombieNetworkType})` :''}}）</span>
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
            </el-table-column>
            <el-table-column
              prop="reason"
              align="center"
              label="原因">
            </el-table-column>
            <el-table-column
              prop="count"
              align="center"
              label="数量">
              <template slot-scope="scope">
                <el-popover  popper-class="table-popper"  v-if="scope.row.count"  trigger="hover" placement="left">
                  <p v-for="(item,index) in scope.row.dealers" :index="index">{{item}}</p>
                  <span slot="reference" class="name-wrapper">
                    <span size="medium">{{ scope.row.count }}</span>
                  </span>
                </el-popover>
                <span v-else>-</span>
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
    export default {
        name: 'zombie',

        data() {
            return {
                form:{
                    month: this.date.month,
                    year: this.date.year
                },
                situationList: [],
                weekList: [],
                tableData:[],


                zombieCount:0,
                toOnlineCount:0,
                toNormalCount: 0,
                fundsExceptionCount: 0,
                businessExceptionCount: 0,
                storeExceptionCount: 0,
                operationExceptionCount: 0,
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
                    console.log(date)
                    this.getZombieNetworkDetails()
                }
            },

        },
        created(){
            this.getZombieNetworkDetails()
        },
        methods: {
            setTableData(zombieList){
                const tableData = []
                zombieList.forEach((zombieItem)=>{
                    if(zombieItem.type === '僵尸网点'){
                        const zombie = zombieItem.list &&  zombieItem.list[0] ?zombieItem.list[0]: null
                        if(zombie){

                            if(zombie.frozenType1){
                                tableData.push({
                                    type: '僵尸网点',
                                    reason: '经营异常',
                                    count: zombie.frozenType1 || '',
                                    dealers: zombie.frozenType1Name ? zombie.frozenType1Name.split('、') : []
                                })
                            }

                            if(zombie.frozenType2 ){
                                tableData.push({
                                    type: '僵尸网点',
                                    reason: '运营异常',
                                    count: zombie.frozenType2 || '',
                                    dealers: zombie.frozenType2Name ? zombie.frozenType2Name.split('、') : []
                                })
                            }
                            if(zombie.frozenType3){
                                tableData.push({
                                    type: '僵尸网点',
                                    reason: '资金异常',
                                    count: zombie.frozenType3 || '',
                                    dealers: zombie.frozenType3Name ? zombie.frozenType3Name.split('、') : []
                                })
                            }

                            if(zombie.frozenType4){
                                tableData.push({
                                    type: '僵尸网点',
                                    reason: '店面异常',
                                    count: zombie.frozenType4 || '',
                                    dealers: zombie.frozenType4Name ? zombie.frozenType4Name.split('、') : []
                                })
                            }

                        }
                    }else{
                        tableData.push({
                            type: zombieItem.type,
                            reason: zombieItem.zombieType  || '-',
                            count: zombieItem.typeCount || '-',
                            dealers: zombieItem.dealerName ? zombieItem.dealerName.split('、') : []
                        })
                    }
                })
                this.tableData = tableData;
                console.log(tableData)
            },

            getZombieNetworkDetails(){
                exitingNetworkApi.getZombieNetworkDetails(this.form).then((data)=>{
                    if(data){
                        this.setTableData(data.zombieNetworkDetails || [])
                        this.setSituationData(data.zombieNetworkDetails || [])
                        this.weekList = data.weekZombieNetworkDetails || [];
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

            setSituationData(frozenDetails){
                const zombie = frozenDetails.find(item=>item.type === '僵尸网点')
                const toOnline = frozenDetails.find(item=>item.type === '僵尸转在网')
                const toExiting = frozenDetails.find(item=>item.type === '僵尸转退网')

                this.zombieCount = zombie && zombie.typeCount ? zombie.typeCount: 0
                this.toOnlineCount = toOnline && toOnline.typeCount ? toOnline.typeCount: 0
                this.toNormalCount = toExiting && toExiting.typeCount ? toExiting.typeCount: 0

                if(zombie && zombie.list && zombie.list[0]){
                    this.fundsExceptionCount = zombie.list[0].frozenType3 ? zombie.list[0].frozenType3: 0
                    this.businessExceptionCount = zombie.list[0].frozenType1 ? zombie.list[0].frozenType1: 0
                    this.storeExceptionCount = zombie.list[0].frozenType4 ? zombie.list[0].frozenType4: 0
                    this.operationExceptionCount = zombie.list[0].frozenType2 ? zombie.list[0].frozenType2: 0
                }else{
                    this.fundsExceptionCount = 0
                    this.businessExceptionCount = 0
                    this.storeExceptionCount = 0
                    this.operationExceptionCount = 0
                }

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
                if (columnIndex === 0 && row.type === '僵尸网点') {
                    const first = this.tableData.find(item => item.type === row.type);
                    const index = this.tableData.indexOf(first)
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
  .zombie{
    .board__card{
      min-height: 240px;
    }
    .situation{
      display: flex;
      padding: 16px 24px;
      justify-content: space-between;
      .situation__col{
        flex-basis: 150px;
        flex-shrink: 0;
      }
      .situation__item{
        display: flex;
        justify-content: space-between;
        height:24px;
        font-size:14px;
        font-weight:400;
        line-height:24px;
        color:rgba(102,102,102,1);
        &.line{
          position: relative;
        }
        &.line:before{
          position: absolute;
          content: '';
          bottom: 0;
          width: 150px;
          height: 1px;
          background: #E6E6E6;
          margin-bottom: -10px;
        }
        &.bold{
          font-weight: bold;
          margin-bottom: 18px;
        }
        .situation__item__value{
          &.green{
            color: #73DEB3;
          }
          &.blue{
            color: #5B8FF9;
          }
          &.red{
            color: #E63752;
          }
          &.yellow{
            color:#FD9707 ;
          }
        }
      }
    }
    .change{
      padding: 24px;
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
          flex-shrink: 0;
          height:19px;
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
  }

  .table /deep/{
    .el-table__header thead th{
      background-color: rgba(20, 30, 40, 0.1);
    }
    .type{
      background: rgba(247, 247, 247, 1);
    }
  }
</style>

<style>
  .table-popper{
    min-width: 40px;
  }
</style>

