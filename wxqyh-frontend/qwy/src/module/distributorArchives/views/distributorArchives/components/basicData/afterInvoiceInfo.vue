<template>
  <ul>
  <!--  售后-->
    <li class="first">
      <div class="aItem">
        <span class="aLabel">增值税开票名称：</span>
        <span class="aValue">{{columns.afterSalesInvoiceInfoName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">开票电话：</span>
        <span class="aValue">{{columns.afterSalesInvoiceInfoTel | filterEmpty}}</span>
      </div>
    </li>
    <li>
      <div class="aItem">
        <span class="aLabel">开票地址：</span>
        <span class="aValue">{{columns.afterSalesInvoiceInfoAddress | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">税号：</span>
        <span class="aValue">{{columns.afterSalesInvoiceInfoTax | filterEmpty}}</span>
      </div>
    </li>
    <li class="first">
      <div class="aItem">
        <span class="aLabel">开户行：</span>
        <span class="aValue">{{columns.afterSalesOpenBank | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">开户银行账号：</span>
        <span class="aValue">{{columns.afterSalesInvoiceInfoAccount | filterEmpty}}</span>
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
        },
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
