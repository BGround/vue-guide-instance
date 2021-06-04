<template>
  <div class="product-compare">
    <h3 class="header">市占率表现-竞品对比</h3>
    <div class="content">
      <div class="box main">
        
        <div class="box__left">
          <div class="brand_info">
            <div class="brand_name">
              <div class="title">奇瑞汽车</div>
              <!-- <div class="brand">(奇瑞)</div> -->
            </div>
            <div class="logo">
              <img  :src="cherryLogo" alt="">
            </div>
          </div>
          
          <div class="data">
            <div class="data__label">所在城市排名</div>
            <div class="data__value">{{citySort  | formatNumber}}</div>
          </div>
          <div class="data">
            <div class="data__label">所在城市市占率</div>
            <div class="data__value">{{cityPercent  | round | addPercentSymbol}}</div>
          </div>
        </div>
        <div class="box__right">
          <div class="product" v-for="(item, index) in otherBrandPercentData" :key="index">
            <div class="product__name">奇瑞-{{item.brand}}</div>
            <div class="product__percent">{{item.differPercent  | round | addPercentSymbol}}</div>
          </div>
        </div>
      </div>

      <div class="grid">

          <div  v-for="(item,index) in otherBrandPercentData" :key="index" class="grid__row column-2 mt15" v-show="index % 2 === 0">
            <div class="grid__col mr10">
              <div class="box flex_column_between">
                <div class="brand_info">
                  <div class="brand_name">
                    <div class="title">{{item.brand}}</div>
                    <div class="brand" v-if="item.brandsDisplay=='1'">({{item.brands}})</div>
                  </div>
                  <div class="logo">
                    <img :src="getLogo(item.brandImg)" alt="">
                  </div>
                </div>
                <!-- <div class="logo">
                  <img :src="getLogo(item.brandImg)" alt="">
                </div>
                <div class="title">{{item.brand}}</div> -->
                <div>
                  <div class="data">
                    <div class="data__label">所在城市排名</div>
                    <div class="data__value">{{item.sort | formatNumber}}</div>
                  </div>
                  <div class="data">
                    <div class="data__label">所在城市市占率</div>
                    <div class="data__value">{{item.percent | round | addPercentSymbol}}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid__col">
              <div class="box flex_column_between" v-if="getNetItem(otherBrandPercentData, index)">
                <div class="brand_info">
                  <div class="brand_name">
                    <div class="title">{{getNetItem(otherBrandPercentData, index).brand}}</div>
                    <div class="brand" v-if="getNetItem(otherBrandPercentData, index).brandsDisplay =='1'">({{getNetItem(otherBrandPercentData, index).brands}})</div>
                  </div>
                  <div class="logo">
                    <img :src="getLogo(getNetItem(otherBrandPercentData, index).brandImg)" alt="">
                  </div>
                </div>
                <!-- <div class="logo">
                  <img :src="getLogo(getNetItem(otherBrandPercentData, index).brandImg)" alt="">
                </div>
                <div class="title">{{getNetItem(otherBrandPercentData, index).brand}}</div> -->
                <div>
                  <div class="data">
                    <div class="data__label">所在城市排名</div>
                    <div class="data__value">{{getNetItem(otherBrandPercentData, index).sort | formatNumber}}</div>
                  </div>
                  <div class="data">
                    <div class="data__label">所在城市市占率</div>
                    <div class="data__value">{{getNetItem(otherBrandPercentData, index).percent | round | addPercentSymbol}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>

      <div class=""></div>
    </div>
  </div>
</template>

<script>
    import cherrylogo from '../../static/images/cherrylogo.png';
    export default {
        name: "productCompare",
        components: {},
        filters:{
            formatNumber(value){
                return value === 0 || !value? '-': value;
            },
            addPercentSymbol(value){
                return (!!value || value === 0) ? `${value}%`: '-'
            },
            round(number) {
                if(!!number || number === 0){
                    const precision = 2;
                    const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision);
                    return Number(roundNumber).toFixed(2);
                }else{
                    return number;
                }

                //same as:
                //return Number(Math.round(+number + 'e' + precision) + 'e-' + precision);
            }
        },
        data() {
            return {
                cherryLogo: cherrylogo
            }
        },
        props: {
            brandList:{
                type: Array,
                default(){
                    return []
                }
            },
            marketPerformance:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        computed:{
            cheeryBrandPercentData() {
                return this.brandList.find(item => item.brand === '奇瑞')
            },
            otherBrandPercentData() {
                var arr =  this.brandList.filter(item => item.brand !== '奇瑞')
                return arr.sort((item1,item2) => {
                  return item1.sequence != item2.sequence ? item1.sequence - item2.sequence : item1.brand - item2.brand
                })
            },

            citySort(){
              return this.marketPerformance.citySort
            },
            cityPercent(){
                return this.marketPerformance.cityPercent
            }

        },
        methods: {

            getLogo(path){
                if(path){
                   return _.fileDownURL + path;
                }
                return null
            },

            getNetItem(list, index){
                if(list[index+1]){
                    return list[index+1]
                }else{
                    return null
                }
            }

        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
  .flex_column_between {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
  }
  .product-compare{
    background: #ffffff;
    .header {
      height: 24px;
      font-size: 17px;
      font-weight: 600;
      line-height: 24px;
      color: rgba(20, 30, 40, 1);
      padding-left: 26px;
      padding-top: 13px;
      padding-bottom: 13px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        display: block;
        height: 16px;
        border-radius: 2px;
        width: 4px;
        background-color: #c6001f;
        top: 18px;
        left: 18px;
      }
      &>span{
        font-weight: normal;
        font-size: 14px;
      }
    }
    .content{
      padding: 4px 8px 20px;
    }
    .box{
      height: 100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px rgba(0,0,0,0.16);
      border-radius:4px;
      padding: 15px 6px 10px 6px;
      box-sizing: border-box;
      position: relative;
      // .logo{
      //   position: absolute;
      //   width: 48px;
      //   left: 98px;
      //   top: 10px;
      //   img{
      //     width: 48px;
      //     vertical-align: top;
      //   }
      // }
    }

    .grid__col{
      flex-grow: 1;
      box-sizing: border-box;
    }

    .column-2{
      .grid__col{
        width: 50%;
      }
    }

    .grid__row{
      display: flex;
    }

    .mt15{
      margin-top: 15px;
    }
    .mr10{
      margin-right: 10px;
    }

    .brand_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2px;

      .brand_name {
        display: flex;
        width: 90px;
        flex-flow: column;
        justify-content: flex-start;
        align-items: center;

        .title{
          // height:16px;
          font-size:16px;
          text-align: center;
          font-weight:bold;
          line-height:16px;
          color:rgba(39,129,219,1);
        }
        
        .brand {
          margin-top: 8px;
          text-align: center;
          font-size:12px;
          line-height:16px;
          color:rgba(39,129,219,1);
        }
      }

      .logo{
        width: 48px;
        img{
          width: 48px;
          vertical-align: top;
        }
      }
    }
    .data{
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }

    .data__label{
      height:20px;
      font-size:13px;
      font-weight:400;
      line-height:20px;
      color:rgba(153,153,153,1);
    }
    .data__value{
      height:20px;
      font-size:13px;
      font-weight:400;
      line-height:20px;
      color:rgba(0,0,0,1);
    }

    .box__left{
      width: 150px;
      flex-basis: 150px;
    }

    .product{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .product__name{
      font-size:13px;
      font-weight:bold;
      line-height:20px;
      color:rgba(39,129,219,1);
    }
    .product__percent{
      height:20px;
      font-size:13px;
      font-weight:400;
      line-height:20px;
      color:rgba(0,0,0,1);
    }
    .main{
      display: flex;
      justify-content: space-between;
    }

    .box__right{
      flex-grow: 1;
      margin-left: 12px;
      margin-right: 4px;
    }
  }
</style>
