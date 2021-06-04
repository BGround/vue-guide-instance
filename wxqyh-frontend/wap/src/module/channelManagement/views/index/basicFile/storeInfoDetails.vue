<!--  直营店详情  -->
<template>
  <div class="store-detail">

    <div class="header">
      <p class="header__name">{{store.shopName ||'-'}}</p>
      <!-- <i class="header__icon header__icon--normal">{{store.shopName ||'-'}}</i> -->
      <i class="header__icon"></i>
    </div>

    

    <div class="field">

      <div class="field__item">
        <div class="field__label">管理代码</div>
        <div class="field__value">{{store.shopCode ||'-'}}</div>
      </div>
      
      <div class="field__item">
        <div class="field__label">直营店名称</div>
        <div class="field__value">{{store.shopName ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">店面级别</div>
        <div class="field__value">{{store.shopLevel ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">直营店类型</div>
        <div class="field__value">{{store.marketSort ||'-'}}</div>
      </div>



      <div class="field__item">
        <div class="field__label">ERP号</div>
        <div class="field__value">{{store.erpCarNo ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">入网时间</div>
        <div class="field__value">{{formatDate(store.openTime) ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">运营年限</div>
        <div class="field__value">{{store.operatingLifeOf ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">形象</div>
        <div class="field__value">{{store.visuailze ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">公司名称</div>
        <div class="field__value">{{store.dealerFullName ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">经销商简称</div>
        <div class="field__value">{{store.dealerShortName ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">区县</div>
        <div class="field__value">{{store.shopCity ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">运营状态</div>
        <div class="field__value">{{store.shopStatus ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">战区人员</div>
        <div class="field__value">{{store.warUser ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">直营店店长</div>
        <div class="field__value">{{store.shopManager ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">手机号码</div>
        <div class="field__value">{{store.shopPhone ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">地址</div>
        <div class="field__value">{{store.address ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">服务分厂号</div>
        <div class="field__value">{{store.serviceFactorySemicolon ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">服务专员（姓名）</div>
        <div class="field__value">{{store.nameOfServiceOfficer ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">服务专员手机号</div>
        <div class="field__value">{{store.phoneNumber ||'-'}}</div>
      </div>
      
      <div class="field__item">
        <div class="field__label">变更说明</div>
        <div class="field__value">{{store.changeDesc ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">备注</div>
        <div class="field__value">{{store.remark ||'-'}}</div>
      </div>


    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      store: {

      }
    }
  },
  computed:{
    ...mapGetters('storeInfoDetail', ['getStoreDetail'])
  },
  methods:{
    formatDate(openTime){
      if(openTime){
          const [y, m, d] = new Date(openTime.replace(/-/g, '/')).toISOString().substring(0,10).split('-')
          return `${y}年${m}月${d}日`;
      }else{
        return '';
      }
    },
  },
  created() {
    const detail = this.getStoreDetail;
    if(detail){
      this.store = detail;
    }else{

    }
    
  }
}
</script>

<style lang="scss" scoped>
.store-detail {
  // 
  padding-bottom: 50px;
  .header{
    position: relative;
    padding: 20px 15px 5px;
    height:24px;
    font-size:17px;
    font-weight:600;
    line-height:24px;
    color:rgba(0,0,0,1);
    background: #ffffff;
  }

  .header__icon{
    display: block;
    width: 76px;
    height: 50px;
    position: absolute;
    right: 13px;
    top: 10px;
    background-size: 100%;
  }

  .header__icon--normal{
    background-image: url('~@/module/channelManagement/static/images/icon_normalOperation.png');
  }



  .field {
    padding: 15px;
    background: #ffffff;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
  }
  .field__value {
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(51, 51, 51, 1);
    margin-left: auto;
  }
}
</style>