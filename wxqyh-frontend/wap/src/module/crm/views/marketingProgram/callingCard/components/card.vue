<template>
  <div class="card">
    <div class="head">
      <img class="avatar" :src="avatarPicPath">
      <div class="company-name">
        <span class="company-text">{{cardList.companyName}}</span>
        <span class="icon-company"></span>
      </div>
      <div class="title">{{cardList.personName}}</div>
      <div class="job">{{cardList.position}}</div>
    </div>
    <div class="card-item" v-for="(item,index) in cardMessage" :key="index">
      <!-- <div class="icon" :class="item.iconBack"></div> -->
      {{item.message}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'card',
    data() {
      return {

      }
    },
    props: {
      cardList:{
        type:Object,
        required: true
      }
    },
    computed: {
      //自定义渲染名片列表
      cardMessage () {
        let array = [
                {
                  iconBack: 'icon-cellPhone',
                  message: this.cardList.cellPhone
                },
                {
                  iconBack: 'icon-phone',
                  message: this.cardList.phone
                },
                {
                  iconBack: 'icon-email',
                  message: this.cardList.email
                },
                // {
                //   iconBack: 'icon-wxNumber',
                //   message: this.cardList.wxNumber
                // }
              ]
        return array
      },
      avatarPicPath(){
        if(this.cardList.avatarPicPath){
          const avatarPicPath = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action?imgUrl="+_.filterCompressURL(this.cardList.avatarPicPath)
          return avatarPicPath
        }
      }
    },
  }
</script>


<style scoped lang="scss">
@import '../../../../crmBase.scss';
.card{
  position: relative;
  // min-height: 178px;
  padding: rem(16) rem(20);
  font-family:'PingFangSC-Regular';
  background: #fff;
  background-size: 100%;
  .head{
    margin-bottom: rem(20);
    .avatar{
      position: absolute;
      top: rem(16);
      right: rem(18);
      width: rem(54);
      height: rem(54);
      border-radius: 50%;
    }
    .title{
      @include content-item(33,33,#343434,24);
    }
    .job{
      @include content-item(18,18,#343434,13);
      margin-top:rem(2) ;
    }
    .company-name{
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color:#7A7C80;
      margin: rem(6) 0 rem(20);
      display: flex;
      align-items: center;
      .icon-company{
        font-size: 0;
        display: inline-block;
        margin-left: 4px;
        width: 16px;
        height: 17px;
        background: url('../../../../../../assets/images/crm/icon-company.png') center no-repeat;
        background-size: 100%;
      }
    }
  }
  .card-item{
    @include content-item(18,18,#7A7C80,13);
    word-wrap: break-word;
    word-break: break-all;
    padding-bottom: rem(2);
    // height: auto;
    // .icon{
    //   position: absolute;
    //   top: rem(8);
    //   left: rem(15);
    //   width: rem(18);
    //   height: rem(18);
    //   background: url('../../../../../../assets/images/crm/card_message.png') center no-repeat;
    //   background-size: 500%;
    //   &.icon-cellPhone{
    //     background-position: rem(-2) 0;
    //   }
    //   &.icon-email{
    //     background-position: rem(-24) 0;
    //   }
    //   &.icon-phone{
    //     background-position: rem(-46) 0;
    //   }
    //   &.icon-wxNumber{
    //     background-position: rem(-69) 0;
    //   }
    // }
  }
}
</style>
