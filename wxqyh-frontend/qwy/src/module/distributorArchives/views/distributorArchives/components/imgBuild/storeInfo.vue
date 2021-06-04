<template>
  <div class="storeInfo">
    <ul>
      <li class="first">
        <div class="aItem">
          <span class="aLabel">建设类型：</span>
          <span class="aValue">{{columns.buildType | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">建设级别：</span>
          <span class="aValue">{{columns.buildLevel | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">启动协议完工时间：</span>
          <span class="aValue">{{columns.startProtocolCompleteTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">建设阶段明细：</span>
          <span class="aValue">{{columns.buildDetail | filterEmpty}}</span>
        </div>
      </li>
      <li class="first">
        <div class="aItem">
          <span class="aLabel">开工时间：</span>
          <span class="aValue">{{columns.startTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">店面级别：</span>
          <span class="aValue">{{columns.shopLevel | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">最终协议完工时间：</span>
          <span class="aValue">{{columns.endProtocolCompleteTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">验收日期：</span>
          <span class="aValue">{{columns.acceptanceTime | filterEmpty}}</span>
        </div>
      </li>
      <li class="third">
        <div class="aItem">
          <span class="aLabel">完工时间：</span>
          <span class="aValue">{{columns.completeTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">是否店厂分离：</span>
          <span class="aValue">{{columns.isSeparation | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">延期次数：</span>
          <span class="aValue">{{columns.postponeCount | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">店面变更次数：</span>
          <span class="aValue"><a href="javascript:;"
                                  @click="openStoreChangePop">{{columns.shopChangeCount | filterEmpty}}次</a></span>
        </div>
      </li>
      <li class="four">
        <div class="aItem">
          <span class="aLabel">转正时间：</span>
          <span class="aValue">{{columns.returnTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">附件：</span>
          <span class="aValue"><a v-if="columns.enclosure" :href="columns.enclosure" download="店面信息"><img src="../../images/icon_download.png"></a></span>
        </div>
        <div class="aItem">
          <span class="aLabel">考核金额(万元)：</span>
          <span class="aValue">{{columns.assessmentAmount | filterEmpty}}</span>
        </div>
      </li>
    </ul>

    <!-- 店面变更 start -->
    <storeChangeRecordPop v-show="pop.isShowStoreChange"
                          @closeStoreChangePop="closeStoreChangePop"></storeChangeRecordPop>
    <!-- 店面变更 end -->
  </div>
</template>

<script>
  import storeChangeRecordPop from './storeChangeRecordPop'
  export default {
      data () {
          return {
              pop: { isShowPhoto: false, isShowStoreChange: false },
          }
      },
      props:{
          columns:{
              type: Object
          }
      },
      methods:{
          // 打开店面变更
          openStoreChangePop() {
              this.pop.isShowStoreChange = true
          },
          // 关闭店面变更
          closeStoreChangePop() {
              this.pop.isShowStoreChange = false
          }
      },
      components:{storeChangeRecordPop},
      filters:{
          filterEmpty(val){
              let txt = '-'
              if(val) {
                  txt = val
              }
              return txt
          }
      }
  }
</script>
