<template>
  <div class="retireWrap">
    <ul>
      <li class="first">
        <div class="aItem">
          <span class="aLabel">退网时间：</span>
          <span class="aValue">{{formData.retreatTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">会议决议：</span>
          <span class="aValue">{{formData.conferenceResolution  | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">库存截止时间：</span>
          <span class="aValue">{{formData.repertoryCloseTime | filterEmpty}}</span>
        </div>
      </li>
      <li class="second">
        <div class="aItem">
          <span class="aLabel">开通时间：</span>
          <span class="aValue">{{formData.openingTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">退网原因：</span>
          <span class="aValue">{{formData.retreatReason  | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">库存量：</span>
          <span class="aValue">{{formData.repertory  | filterEmpty}}</span>
        </div>
      </li>
      <li class="third">
        <div class="aItem">
          <span class="aLabel">退网性质：</span>
          <span class="aValue">{{formData.retireNature   | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">评估时间：</span>
          <span class="aValue">{{formData.assessmentTime | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">库存消化周期：</span>
          <span class="aValue">{{formData.period  | filterEmpty}}</span>
        </div>
      </li>
      <li class="four">
        <div class="aItem">
          <span class="aLabel">上网络委员会时间：</span>
          <span class="aValue">{{formData.committee | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">权限冻结时间：</span>
          <span class="aValue">{{formData.perFreezeTime   | filterEmpty}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">售后保留时间：</span>
          <span class="aValue">{{formData.saveAfterSaleTime  | filterEmpty}}</span>
        </div>
      </li>
    </ul>
    <div class="aItem aItemDetailWrap">
      <span class="aLabel">明细原因：</span>
      <span class="aValue">{{formData.detailReason | filterEmpty}}</span>
    </div>
  </div>
</template>

<script>
  export default {
      data () {
          return {
            formData: {},
          }
      },
      props:{
          columns:{
              type: Object,
              default(){
                return {}
              }
          }
      },
      created(){
        this.formData = this.columns;
      },
      watch:{
        columns(value){
          this.formData = value
        }
      },
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
