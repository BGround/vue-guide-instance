<template>
  <ul>
    <li>
      <div class="aItem">
        <span class="aLabel">销售店名称：</span>
        <span class="aValue">{{columns.salesStoreName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">服务站名称：</span>
        <span class="aValue">{{columns.serviceStationName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">销售合作模式：</span>
        <span class="aValue">{{columns.salesServiceType | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">集团归属：</span>
        <span class="aValue">{{columns.belongGroup | filterEmpty}} </span>
      </div>
    </li>
    <li>
      <div class="aItem">
        <span class="aLabel">销售店地址：</span>
        <span class="aValue">{{columns.salesStoreAddress | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">店厂分离情况：</span>
        <span class="aValue">{{columns.factorySeparationDistance | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">销售热线：</span>
        <span class="aValue">{{columns.salesPhone | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">服务热线：</span>
        <span class="aValue">{{columns.serviceStationPhone | filterEmpty}}</span>
      </div>
    </li>
    <li>
      <div class="aItem">
        <span class="aLabel">服务站地址：</span>
        <span class="aValue">{{columns.serviceStationAddress | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">店厂分离距离：</span>
        <span class="aValue">{{columns.factorySeparationDistance | filterEmpty}}km</span>
      </div>
      <div class="aItem">
        <span class="aLabel">销售传真：</span>
        <span class="aValue">{{columns.salesFax | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">邮政编码：</span>
        <span class="aValue">{{columns.postalCode | filterEmpty}}</span>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    data(){
        return {}
    },
    props:{
      columns:{
          type:Object
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
