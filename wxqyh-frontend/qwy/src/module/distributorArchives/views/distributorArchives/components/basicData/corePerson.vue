<template>
  <ul>
    <li class="first">
      <div class="aItem">
        <span class="aLabel">法人代表：</span>
        <span class="aValue">{{columns.legalRepresentativeName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">手机：</span>
        <span class="aValue">{{columns.legalRepresentativePhone | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">邮箱：</span>
        <span class="aValue">{{columns.legalRepresentativeEmail | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">性别：</span>
        <span class="aValue">{{columns.legalRepresentativeSex | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">微信：</span>
        <span class="aValue">{{columns.legalRepresentativeWechat | filterEmpty}}</span>
      </div>
    </li>
    <li class="first">
      <div class="aItem">
        <span class="aLabel">董事长：</span>
        <span class="aValue">{{columns.chairmanName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">手机：</span>
        <span class="aValue">{{columns.chairmanPhone | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">邮箱：</span>
        <span class="aValue">{{columns.chairmanEmail | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">性别：</span>
        <span class="aValue">{{columns.chairmanSex | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">微信：</span>
        <span class="aValue">{{columns.chairmanWechat | filterEmpty}}</span>
      </div>
    </li>
    <li class="first">
      <div class="aItem">
        <span class="aLabel">总经理：</span>
        <span class="aValue">{{columns.generalManagerName | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">手机：</span>
        <span class="aValue">{{columns.generalManagerPhone | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">邮箱：</span>
        <span class="aValue">{{columns.generalManagerEmail | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">性别：</span>
        <span class="aValue">{{columns.generalManagerSex | filterEmpty}}</span>
      </div>
      <div class="aItem">
        <span class="aLabel">微信：</span>
        <span class="aValue">{{columns.generalManagerWechat | filterEmpty}}</span>
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
