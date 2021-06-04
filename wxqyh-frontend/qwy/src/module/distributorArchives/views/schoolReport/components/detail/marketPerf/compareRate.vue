<template>
  <div>
    <div class="subTit">
      <p> · 与竞品对比表现</p>
    </div>
    <div class="competeInfo">

      <div class="compare">
        <table>
          <colgroup :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
          <colgroup :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
          <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-1`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
          <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-2`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
          <colgroup v-for="(item, index) in getFirstRowBrandList" :key="`${index}-3`" :width="calculateColWidthOfFirstRow(getFirstRowBrandList)"></colgroup>
          <thead>
          <tr>
            <th  :colspan="2+ getFirstRowBrandList.length">奇瑞</th>
            <th  v-for="(item, index) in getFirstRowBrandList" colspan="2">
              {{item.brand}}
              {{item.brandsDisplay==='1' && item.brands?`(${item.brands})`:''}}
            </th>
          </tr>
          <tr class="compare__head2">
            <th>
              <p>所在城市</p>
              <p>排名</p>
            </th>
            <th>
              <p>所在城市</p>
              <p>市占率</p>
            </th>
            <th  v-for="(item, index) in getFirstRowBrandList">
              奇瑞-{{item.brand}}
            </th>

            <template  v-for="(item, index) in getFirstRowBrandList">
              <th>
                <p>所在城市</p>
                <p>排名</p>
              </th>
              <th>
                <p>所在城市</p>
                <p>市占率</p>
              </th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="borderR " v-if="hasValue(getCheryBrand)">{{getCheryBrand.sort | formatNumber }}</td>
            <td class="borderR " v-if="hasValue(getCheryBrand)"> {{getCheryBrand.percent | round | addPercentSymbol}}</td>
            <td class="borderR " v-for="(item, index) in getFirstRowBrandList" :key="`differPercent-${index}`">{{item.differPercent | round | addPercentSymbol}}</td>
            <template v-for="(item, index) in getFirstRowBrandList">
              <td class="borderR" :key="`sort-${index}`">{{item.sort | formatNumber }}</td>
              <td class="borderR"  :key="`percent-${index}`">{{item.percent | round | addPercentSymbol}}</td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
      <div class="competeInfo">


      <div class="compare" v-for="(brandList, index) in getOtherRowBrandLists" :key="index">
        <table>
          <colgroup v-for="(item, index) in brandList" :key="`${index}-1`" :width="calculateColWidthOfRows(brandList)"></colgroup>
          <colgroup v-for="(item, index) in brandList" :key="`${index}-2`" :width="calculateColWidthOfRows(brandList)"></colgroup>
          <colgroup v-for="(item, index) in brandList" :key="`${index}-3`" :width="calculateColWidthOfRows(brandList)"></colgroup>
          <thead>
          <tr>
            <th :colspan="brandList.length">奇瑞</th>
            <th  v-for="(item, index) in brandList" colspan="2">
              {{item.brand}}
              {{item.brandsDisplay==='1' && item.brands?`(${item.brands})`:''}}
            </th>
          </tr>
          <tr class="compare__head2">
            <th  v-for="(item, index) in brandList">奇瑞-{{item.brand}}</th>
            <template  v-for="(item, index) in brandList">
              <th>
                <p>所在城市</p>
                <p>排名</p>
              </th>
              <th>
                <p>所在城市</p>
                <p>市占率</p>
              </th>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="borderR " v-for="(item, index) in brandList" :key="`differPercent-${index}`">{{item.differPercent | round  | addPercentSymbol}}</td>
            <template v-for="(item, index) in brandList">
              <td class="borderR " :key="`sort-${index}`">{{item.sort | formatNumber }}</td>
              <td class="borderR " :key="`percent-${index}`">{{item.percent | round | addPercentSymbol}}</td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>


    </div>
  </div>
</template>
<script>
export default {
    name:"",
      props:{
        compareData:{
          type:Array,
          default:[]
        },
        citySort:{
          type:String,
          default:'-'
        },
        cityPercent:{
          type:String,
          default:'-'
        },
        marketData:{
          type: Object,
          default(){
            return {}
          }
        }
    },
    filters:{
        formatNumber(value){
            return value === 0 || value? value: '-';
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
    computed:{
        getCheryBrand(){
            if(this.marketData){
                return {
                    sort: this.marketData.citySort,
                    percent: this.marketData.cityPercent,
                }
            }else{
                return {}
            }
        },
        getOtherBrandList(){
            const otherBrandList = this.compareData.filter(item=>{
                return item.brand !== '奇瑞'
            });
            return otherBrandList || [];
            console.log(otherBrandList)
        },
        getFirstRowBrandList(){
            const list = this.getOtherBrandList.sort((item1,item2) => {
              return item1.sequence != item2.sequence ? item1.sequence - item2.sequence : item1.brand - item2.brand
            }).slice(0,4)
            // const list =this.getOtherBrandList.slice(0, 4)
            console.log(list,'32')
            return list;
        },
        getOtherRowBrandLists(){ // 生成二维数组
            const BrandCountPerRow = 4;
            const otherBrandList = this.getOtherBrandList.slice(4);
            const list = otherBrandList.reduce((result, currentItem, currentIndex)=>{
                const rowIndex = Math.floor(currentIndex / 4);
                if(currentIndex % BrandCountPerRow === 0){
                    result[rowIndex] = [];
                }
                result[rowIndex].push(currentItem);
                return result;
            }, [])
            return list.forEach((item) => {
              item.sort((item1,item2) => {
                return item1.sequence != item2.sequence ? item1.sequence - item2.sequence : item1.brand - item2.brand
              })
            })
            
        }
    },
    methods:{

        hasValue(value){
            return !!value || value === 0;
        },

        /**
         *计算第一行的宽度
         */
        calculateColWidthOfFirstRow(brandList){
            const fixedColCount = 2;
            const brandCount = brandList.length;
            const width = 100 / (fixedColCount +( brandCount*3));
            return `${width}%`;
        },

        /**
         * 计算其他行的宽度
         */
        calculateColWidthOfRows(brandList){
            if(!brandList.length){
                return 0;
            }
            const brandCount = brandList.length;
            const width = 100 / ( brandCount*3);
            return `${width}%`;
        },
    }
}
</script>
<style lang="less" scoped>
  .compare{
    width: 100%;
    .compare__head2{
      font-size: 10px;
      white-space: nowrap;
      th{
        padding: 13px 4px 11px;
      }
    }
  }
  table {
    margin-top: 10px;
    margin-bottom: 35px;
    width: 100%;
    border: none;
    text-align: center;
    border-collapse: collapse;

    thead {
      tr:first-child {
        width: 550px;
        height: 30px;
        border: 1px solid rgba(213, 213, 213, 1);
        font-size: 12px;
        font-weight: bold;
        color: rgba(0, 0, 0, 1);
        th{
          background: #e7e8e9;
        }
      }

      tr {
        th {
          padding:13px 0 11px;
          background: #f7f7f7;
          line-height: 14px;
          border: 1px solid rgba(213, 213, 213, 1);
        }
      }
    }

    tbody{
      tr{
        .rb{
          border-right:1px solid rgba(213,213,213,1);
        }
        td{
          padding:13px 0 11px;
          background: #fff;
        }
      }
    }

    tr{
      min-height:30px;
      border:1px solid rgba(213,213,213,1);
      line-height: 16px;
      td{
        padding: 7px 0;
      }
    }
  }

</style>
