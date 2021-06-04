<!--  直营店详情  -->
<template>
  <div class="core-staff">

    <div class="header">
      <p class="header__name">董事长</p>
      <!-- <i class="header__icon header__icon--normal">{{store.shopName ||'-'}}</i> -->
      <i class="header__icon"></i>
    </div>

    <div class="field">
      <div class="field__item">
        <div class="field__label">姓名</div>
        <div class="field__value">{{detail.chairmanName ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">手机号码</div>
        <div class="field__value">{{detail.chairmanPhone ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">性别</div>
        <div class="field__value">{{detail.chairmanSex ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">微信号码</div>
        <div class="field__value">{{detail.chairmanWechat ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">电子邮箱</div>
        <div class="field__value">{{detail.chairmanEmail ||'-'}}</div>
      </div>
    </div>

    <div class="gutter" ></div>

    <div class="header">
      <p class="header__name">总经理</p>
      <i class="header__icon"></i>
    </div>

    <div class="field">
      <div class="field__item">
        <div class="field__label">姓名</div>
        <div class="field__value">{{detail.generalManagerName ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">手机号码</div>
        <div class="field__value">{{detail.generalManagerPhone ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">性别</div>
        <div class="field__value">{{detail.generalManagerSex ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">微信号码</div>
        <div class="field__value">{{detail.generalManagerWechat ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">电子邮箱</div>
        <div class="field__value">{{detail.generalManagerEmail ||'-'}}</div>
      </div>
    </div>

    <div class="gutter" ></div>

    <div class="header">
      <p class="header__name">法人</p>
      <i class="header__icon"></i>
    </div>

    <div class="field">
      <div class="field__item">
        <div class="field__label">姓名</div>
        <div class="field__value">{{detail.legalRepresentativeName ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">手机号码</div>
        <div class="field__value">{{detail.legalRepresentativePhone ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">性别</div>
        <div class="field__value">{{detail.legalRepresentativeSex ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">微信号码</div>
        <div class="field__value">{{detail.legalRepresentativeWechat ||'-'}}</div>
      </div>

       <div class="field__item">
        <div class="field__label">电子邮箱</div>
        <div class="field__value">{{detail.legalRepresentativeEmail ||'-'}}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { searchDealerUserByKey } from '@/module/channelManagement/api/development'
export default {
  data() {
    return {
      detail:{}
    }
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
    const dealerId = this.$route.query.dealerId ||'';
    searchDealerUserByKey({dealerId}).then((data)=>{
      if(data && data.tbEntQrDealerUserVo){
        this.detail = data.tbEntQrDealerUserVo
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.core-staff {
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

    .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
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