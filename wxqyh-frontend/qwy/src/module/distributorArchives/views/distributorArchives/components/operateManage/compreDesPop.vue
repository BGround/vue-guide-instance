<template>
  <div class="storeChangeWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="titWrap">
        <h4>综合运营评估得分详情</h4>
      </div>
      <div class="storeInfo">
        <ul>
          <li class="first">
            <div class="sItem">
<!--              _.compressURL+url-->
              <span class="sLabel">店面形象</span>
              <span class="sValue">{{columns.shopImage}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">人员配备</span>
              <span class="sValue">{{columns.personnelAllocation}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">提车目标完成率</span>
<!--              <span class="sValue">{{columns.carFinishingRate | filterNum}}%</span>-->
              <span class="sValue">{{columns.carFinishingRate}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">实销目标完成率</span>
<!--              <span class="sValue">{{columns.saleFinishingRate  | filterNum}}%</span>-->
              <span class="sValue">{{columns.saleFinishingRate}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">月均实销</span>
              <span class="sValue">{{columns.saleMonth}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">市占率</span>
<!--              <span class="sValue">{{columns.marketShare | filterNum}}%</span>-->
              <span class="sValue">{{columns.marketShare}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">销售满意度</span>
              <span class="sValue">{{columns.salesSatisfaction}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">服务满意度</span>
              <span class="sValue">{{columns.serviceSatisfaction}}</span>
            </div>
          </li>
          <li class="second">
            <div class="sItem">
              <span class="sLabel">备件目标完成率</span>
<!--              <span class="sValue">{{columns.partsCompletionRate | filterNum}}%</span>-->
              <span class="sValue">{{columns.partsCompletionRate}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">抱怨一次闭环率-销售</span>
<!--              <span class="sValue">{{columns.saleComplainCloseRate | filterNum}}%</span>-->
              <span class="sValue">{{columns.saleComplainCloseRate}}</span>
            </div>
            <div class="sItem">
              <span class="sLabel">抱怨一次闭环率-服务</span>
<!--              <span class="sValue">{{columns.serviceComplainCloseRate | filterNum}}%</span>-->
              <span class="sValue">{{columns.serviceComplainCloseRate}}</span>
            </div>
          </li>
        </ul>
        <div class="closeBtn">
          <qwuiButton type="danger" @click="closePop">关闭</qwuiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    export default {
        data() {
            return {}
        },
        props:{
            columns:{
                type: Object
            }
        },
        methods: {
            closePop() {
                this.$emit('closeCompreDesPop', '')
            }
        },
        components: {
            qwuiButton
        },
        filters:{
            filterNum(val){
                if(val){
                    return parseInt(val).toFixed(2)
                } else {
                    return 0
                }
            }
        }
    }
</script>

