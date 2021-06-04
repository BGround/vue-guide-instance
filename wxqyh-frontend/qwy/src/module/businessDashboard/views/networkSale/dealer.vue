<template>
  <div class="dealer">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            提车排名
          </div>
          <div class="situation">

            <div class="situation__item">
              <div class="situation__name">{{liftDealerYearName}}</div>
              <div class="situation__label">年度NO.1</div>
              <div class="situation__value">{{liftNumberYearMax}} 台</div>
            </div>

            <div class="situation__item">
              <div class="situation__name">{{liftDealerMonthName}}</div>
              <div class="situation__label yellow">月度NO.1</div>
              <div class="situation__value">{{liftNumberMonthMax}} 台</div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            实销排名
          </div>
          <div class="situation">

            <div class="situation__item">
              <div class="situation__name">{{actualDealerYearName}}</div>
              <div class="situation__label">年度NO.1</div>
              <div class="situation__value">{{actualSalesNumberYearMax}} 台</div>
            </div>

            <div class="situation__item">
              <div class="situation__name">{{actualDealerMonthName}}</div>
              <div class="situation__label yellow">月度NO.1</div>
              <div class="situation__value">{{actualSalesNumberMonthMax}} 台</div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">

          <div class="card__content">
            <div class="card__content__item">
              <div class="card__content__item__label">当月0提车</div>
              <div class="card__content__item__value">{{liftDealerMonthZeroName}}</div>
            </div>

            <div class="card__content__item">
              <div class="card__content__item__label">当月0实销</div>
              <div class="card__content__item__value">{{actualDealerMonthZeroName}}</div>
            </div>
          </div>

        </div>
      </div>

      <div class="board__content__right top">
        <div class="top__section">
          <div class="top__section__header">
            <h3 class="top__section__header__title">经销商提车</h3>
            <div class="top__section__header__switch">
              <cheerySwitch @change="handleChangePickCarRankingType"></cheerySwitch>
            </div>
          </div>

          <div class="top__section__ranking">
            <div class="top__section__ranking__col">
              <div class="ranking">
                <div class="ranking__title">当年累计排名</div>
                <ul class="ranking__list">
                  <li class="ranking__item" v-for="(item,index) in pickCarListOfYear" :key="index">
                    <div class="ranking__item__no">{{item.rank}}</div>
                    <div class="ranking__item__name" :title="item.dealerName">{{item.dealerName}}</div>
                    <div class="ranking__item__value">{{item.liftNumber}}台</div>
                    <div class="ranking__item__change" :class="{up: item.rankDesc>0, down: item.rankDesc<0}">
                      {{!item.rankDesc? '&nbsp;-': item.rankDesc}}{{!item.rankDesc? '&nbsp;&nbsp;': (item.rankDesc>0? '↑':'↓') }}
                    </div>
                  </li>

                </ul>
              </div>

            </div>
            <div class="top__section__ranking__col">

              <div class="ranking">
                <div class="ranking__title">当月排名</div>
                <ul class="ranking__list">
                  <li class="ranking__item" v-for="(item,index) in pickCarListOfMonth" :key="index">
                    <div class="ranking__item__no">{{item.rank}}</div>
                    <div class="ranking__item__name" :title="item.dealerName">{{item.dealerName}}</div>
                    <div class="ranking__item__value">{{item.liftNumber}}台</div>
                    <div class="ranking__item__change" :class="{up: item.rankDesc>0, down: item.rankDesc<0}">
                      {{!item.rankDesc? '&nbsp;-': item.rankDesc}}{{!item.rankDesc? '&nbsp;&nbsp;': (item.rankDesc>0? '↑':'↓') }}
                    </div>
                  </li>

                </ul>
              </div>

            </div>

          </div>

        </div>

        <div class="top__section">
          <div class="top__section__header">
            <h3 class="top__section__header__title">经销商实销</h3>
            <div class="top__section__header__switch">
              <cheerySwitch @change="handleChangeSaleRankingType"></cheerySwitch>
            </div>
          </div>
          <div class="top__section__ranking">
              <div class="top__section__ranking__col">
                <div class="ranking">
                  <div class="ranking__title">当年累计排名</div>
                  <ul class="ranking__list">
                    <li class="ranking__item" v-for="(item,index) in actualSaleListOfYear" :key="index">
                      <div class="ranking__item__no">{{item.rank}}</div>
                      <div class="ranking__item__name" :title="item.dealerName">{{item.dealerName}}</div>
                      <div class="ranking__item__value">{{item.actualSalesNumber}}台</div>
                      <div class="ranking__item__change" :class="{up: item.rankDesc>0, down: item.rankDesc<0}">
                        {{!item.rankDesc? '&nbsp;-': item.rankDesc}}{{!item.rankDesc? '&nbsp;&nbsp;': (item.rankDesc>0? '↑':'↓') }}
                      </div>
                    </li>

                  </ul>
                </div>

              </div>
            <div class="top__section__ranking__col">

              <div class="ranking">
                <div class="ranking__title">当月排名</div>
                <ul class="ranking__list">
                  <li class="ranking__item" v-for="(item,index) in actualSaleListOfMonth" :key="index">
                    <div class="ranking__item__no">{{item.rank}}</div>
                    <div class="ranking__item__name" :title="item.dealerName">{{item.dealerName}}</div>
                    <div class="ranking__item__value">{{item.actualSalesNumber}}台</div>
                    <div class="ranking__item__change" :class="{up: item.rankDesc>0, down: item.rankDesc<0}">
                      {{!item.rankDesc? '-': item.rankDesc}}{{!item.rankDesc? '&nbsp;&nbsp;': (item.rankDesc>0? '↑':'↓') }}
                    </div>
                  </li>

                </ul>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
    import cheerySwitch from '@/module/businessDashboard/components/cheerySwitch'
    import networkSaleApi from '../../api/networkSaleApi'
    const sortTypeMap = {
        top: '1',
        bot:  '2'
    }
    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                pickCarRankingType: sortTypeMap.top,
                saleRankingType: sortTypeMap.bot,

                //年度
                liftNumberYearMax: 0 ,//    获取最高提车数
                liftDealerYearName: '' ,//    获取最高提车数的经销商名称
                actualSalesNumberYearMax: 0 ,//   获取最高实销数
                actualDealerYearName: '' ,//  获取最高实销数的经销商名称

               // 月度
                liftNumberMonthMax: 0, //    获取最高提车数
                liftDealerMonthName: '', //   获取最高提车数的经销商名称
                actualSalesNumberMonthMax: 0, //   获取最高实销数
                actualDealerMonthName: '', //  获取最高实销数的经销商名称


                liftDealerMonthZeroName: '' ,//    0提车数的经销商名称
                actualDealerMonthZeroName: '', //   0实销数的经销商名称
                pickCarListOfMonth: [],
                pickCarListOfYear: [],
                actualSaleListOfMonth:  [],
                actualSaleListOfYear:  []
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
                    this.getDealerData()
                }
            },

        },
        created(){
            this.getDealerData()
        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            handleChangePickCarRankingType(type){
                this.pickCarRankingType = sortTypeMap[type]
                this.getDealerLiftNumberRankingList()
            },

            handleChangeSaleRankingType(type){
                this.saleRankingType = sortTypeMap[type]
                this.getDealerActualSalesNumberRankingList()
            },

            getDealerData(){
                this.getDealerRanking()
                    .then(this.getDealerActualSalesNumberRankingList)
                    .then(this.getDealerLiftNumberRankingList)
            },

            getDealerLiftNumberRankingList(){

                const params = Object.assign({}, this.form, {type: this.pickCarRankingType})
                return  networkSaleApi.getDealerLiftNumberRankingList(params).then((data)=>{
                    if(data){
                        this.pickCarListOfMonth = data.liftMonthList || []
                        this.pickCarListOfYear = data.liftYearList || []
                    }else{
                        this.pickCarListOfMonth =  []
                        this.pickCarListOfYear =  []
                    }
                })
            },


            getDealerActualSalesNumberRankingList(){
                const params = Object.assign({}, this.form, {type: this.saleRankingType})
                return  networkSaleApi.getDealerActualSalesNumberRankingList(params).then((data)=>{
                    if(data){
                        this.actualSaleListOfMonth = data.actualMonthList || []
                        this.actualSaleListOfYear = data.actualYearList || []
                    }else{
                        this.actualSaleListOfMonth =  []
                        this.actualSaleListOfYear =  []
                    }
                })
            },

            getDealerRanking(){
                return networkSaleApi.getDealerRanking(this.form).then((data)=>{
                   if(data){
                      //年度
                      this.liftNumberYearMax=data.liftNumberYearMax || 0 //    获取最高提车数
                      this.liftDealerYearName=data.liftDealerYearName || '' //    获取最高提车数的经销商名称
                      this.actualSalesNumberYearMax=data.actualSalesNumberYearMax || 0 //   获取最高实销数
                      this.actualDealerYearName=data.actualDealerYearName || '' //  获取最高实销数的经销商名称

                      // 月度
                      this.liftNumberMonthMax= data.liftNumberMonthMax || 0 //    获取最高提车数
                      this.liftDealerMonthName= data.liftDealerMonthName ||'' //   获取最高提车数的经销商名称
                      this.actualSalesNumberMonthMax= data.actualSalesNumberMonthMax ||0 //   获取最高实销数
                      this.actualDealerMonthName= data.actualDealerMonthName ||'' //  获取最高实销数的经销商名称


                      this.liftDealerMonthZeroName = data.liftDealerMonthZeroName  ||''//    0提车数的经销商名称
                      this.actualDealerMonthZeroName = data.actualDealerMonthZeroName  ||''//   0实销数的经销商名称

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
            }

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
  .dealer{
    .situation{
      display: flex;
      width: 100%;
      padding: 16px 0;
      .situation__item{
        flex-basis: 50%;
        flex-shrink: 0;
        text-align: center;
      }
      .situation__name{
        height:31px;
        width: 130px;
        margin: 0 auto;
        font-size:24px;
        font-weight:bold;
        line-height:31px;
        color:rgba(51,51,51,1);
        padding-bottom: 9px;
        border-bottom: 1px solid #E6E6E6;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .situation__label{
        height:19px;
        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(209,3,28,1);
        margin-top: 8px;
        &.yellow{
          color: #FD9707;
        }
      }
      .situation__value{
        height:19px;
        font-size:14px;
        font-weight:400;
        line-height:19px;
        color:rgba(102,102,102,1);
        margin-top: 8px;
      }
    }
    .card__content{
      padding: 24px;
      .card__content__item{
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
        &:last-child{
          margin-bottom: 0;
        }
        .card__content__item__label{
          flex-basis: 75px;
          flex-shrink: 0;
          height:19px;
          font-size:14px;
          font-weight:bold;
          line-height:19px;
          color:rgba(51,51,51,1);
        }
        .card__content__item__value{
          font-size:14px;
          flex-grow: 1;
          font-weight:400;
          line-height:22px;
          color:rgba(102,102,102,1);
        }
      }

    }

    .top{
      display: flex;
      .top__section{
        margin-left: 16px;
        width:375px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(230,230,230,1);
        opacity:1;
        border-radius:4px;
        padding: 24px 24px 0;
      }
      .top__section__header{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .top__section__header__switch{
        padding-right: 20px;
      }
      .top__section__header__title{
        height:26px;
        font-size:20px;
        font-weight:bold;
        line-height:26px;
        color:rgba(51,51,51,1);
      }

      .top__section__ranking{
        display: flex;
        justify-content: space-between;
      }
      .top__section__ranking__col{
        width: 170px;
        flex-shrink: 0;
      }

      .ranking__title{
        position: relative;
        height:19px;
        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(51,51,51,1);
        padding-bottom: 8px;
        margin-bottom: 16px;
        margin-top: 24px ;
        &:before{
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width:40px;
          height:2px;
          background:rgba(195,23,37,1);
        }
      }

      .ranking__list{
        margin-top: 26px;
        .ranking__item{
          margin-bottom: 11px;
          display: flex;
          &:nth-child(1) .ranking__item__no{
            background: #F1405C;
            color: #ffffff;
          }
          &:nth-child(2) .ranking__item__no{
            background: #FF8547;
            color: #ffffff;
          }
          &:nth-child(3) .ranking__item__no{
            background: #FFBC00;
            color: #ffffff;
          }
        }
        .ranking__item__no{
          width:24px;
          height: 24px;
          text-align: center;
          opacity:1;
          border-radius:12px;
          color: #666666;
          line-height: 24px;
          margin-right: 12px;
          flex-shrink: 0;
          flex-basis: 24px;
        }
        .ranking__item__name{
          height: 24px;
          font-size:14px;
          font-weight:400;
          line-height: 24px;
          color:rgba(102,102,102,1);
          margin-right: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

        }
        .ranking__item__value{
          flex-shrink: 0;
          line-height: 24px;
          text-align: left;
          font-size:14px;
          font-weight:400;
          color:rgba(102,102,102,1);
        }
        .ranking__item__change{
          flex-basis: 30px;
          flex-shrink: 0;
          line-height: 24px;
          text-align: right;
          color:rgba(102,102,102,1);
          &.up{
            color: #00B563;
          }
          &.down{
            color: #D1031C;
          }
        }

      }
    }
  }
  #changeEnterpriseInfo{
    height: 520px;




  }
</style>


