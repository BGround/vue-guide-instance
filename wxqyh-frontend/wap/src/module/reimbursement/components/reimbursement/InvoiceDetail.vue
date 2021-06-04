<template>
  <div class="qwui-detail_electronic_invoice">
    <div class="qwui-electronic_top">
      <img class="qwui-electronic_top_arrow" src="~assets/images/icon_down_gray.png" alt="" @click="close">
      <span class="qwui-electronic_top_text">{{$t('i18n.reim.detail.returnEditor')}}</span>
    </div>
    <div class="qwui-electronic_content">
      <div class="qwui-electronic_content_top">
        <div class="qwui-electronic_top_ellipseB">
          <div class="qwui-electronic_top_ellipseS"></div>
        </div>
        <div class="qwui-electronic_top_text">{{$t('i18n.reim.detail.electronicInvoice')}}</div>
      </div>
      <div class="qwui-electronic_content_center">
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.payer')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.gmfMc}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.receive')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.xsfMc}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.invoiceAmmount')}}</span>
          <span class="qwui-electronic_center_name">￥{{wxCardDetailData.jshj}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.billingTime')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.kprq}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.invoiceCode')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.fpDm}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.invoiceNo')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.fpHm}}</span>
        </div>
        <div class="qwui-electronic_center_row">
          <span class="qwui-electronic_center_title">{{$t('i18n.reim.detail.invoiceItem')}}</span>
          <span class="qwui-electronic_center_name">{{wxCardDetailData.kpxmc}}</span>
        </div>
      </div>
      <div class="qwui-electronic_content_down">
        <div class="qwui-electronic_down_row">
          <span class="qwui-electronic_down_title">{{$t('i18n.reim.detail.viewInvoice')}}</span>
          <span class="qwui-electronic_down_name" @click="downLoadInvoice">{{$t('i18n.reim.detail.downInvoice')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //请求发票的数据
  import { getElectronic } from '../../api/downElectronic'; //引入详情的请求方法
  import { mapMutations, mapGetters } from 'vuex';

  export default {
    name: 'QwInvoiceDetail',
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      ...mapGetters([
        'isShowWxCardDetail',
        'wxCardDetailData',
      ])
    },
    methods: {
      //点击返回按钮
      close() {
        this.updateWxCardDetail({isShow: false});
      },
      downLoadInvoice() {
        // 下载电子发票
        let code = this.wxCardDetailData.cardCode;
        let cardId = this.wxCardDetailData.cardId;
        if (_.isIOS()) {
          window.location.href = _.baseURL + '/portal/fapiaoAction!downLoadFaPiaoInfo.action?code=' +
            encodeURIComponent(code) + "&cardId=" + encodeURIComponent(cardId) + "&type=1";
        } else if (_.isWeChatApp()) {
          getElectronic({
            code: code,
            cardId: cardId,
            type: "2"
          }).then((res) => {
            if (res.code == "0") {
              _.hideLoading();
              _.alert("$t('i18n.reim.detail.downTip')", "$t('i18n.reim.detail.messagePush')");
            }
          }).catch((error) => {
            _.hideLoading();
            _.alert("$t('i18n.reim.detail.errorTip')", error.desc);
          });
        } else {
          window.location.href = _.baseURL + '/portal/fapiaoAction!downLoadFaPiaoInfo.action?code=' +
            encodeURIComponent(code) + "&cardId=" + encodeURIComponent(cardId) + "&type=1";
        }
      },
      ...mapMutations([
        'updateWxCardDetail'
      ])
    }
  }

</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  @import '~../../styles/variable.scss';
  .qwui-detail_electronic_invoice {
    position: fixed;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    z-index: 5;
    padding: 0px 15px 0 15px;
    background-color: #596175;
    .qwui-electronic_top {
      padding: 16px 0 16px 0;
      .qwui-electronic_top_arrow {
        width: 7px;
        height: 12px;
        transform: rotate(90deg);
      }
      .qwui-electronic_top_text {
        color: $color-text;
        font-size: $font-size-medium;
        padding-left: 8px;
      }
    }
    .qwui-electronic_content {
      border: 1px solid #ffffff;
      border-radius: 4px;
      .qwui-electronic_content_top {
        position: relative;
        z-index: 2;
        background-color: $color-background;
        padding: 28px 0;
        border-bottom: 1px dashed #EFEFF5;
        &::before {
          content: '';
          width: 15px;
          height: 15px;
          position: absolute;
          bottom: -8px;
          left: -8px;
          border-radius: 50%;
          background-color: #596175;
        }
        &::after {
          content: '';
          width: 15px;
          height: 15px;
          position: absolute;
          bottom: -8px;
          right: -8px;
          border-radius: 50%;
          background-color: #596175;
        }
        .qwui-electronic_top_ellipseB {
          width: 91px;
          height: 54px;
          border: 3px solid #A67171;
          border-radius: 50%;
          margin: 0 auto;
          .qwui-electronic_top_ellipseS {
            width: 79px;
            height: 48px;
            border: 2px solid #A67171;
            border-radius: 50%;
            margin: 0 auto;
          }
        }
        .qwui-electronic_top_text {
          position: absolute;
          color: #9A3434;
          width: 165px;
          top: 44px;
          left: 50%;
          margin-left: -80px;
          font-size: $font-size-large;
        }
      }
      .qwui-electronic_content_center {
        position: relative;
        z-index: 1;
        padding: 0px 0px 26px 16px;
        background-color: $color-background;
        border-bottom: 1px dashed #EFEFF5;
        &::before {
          content: '';
          width: 15px;
          height: 15px;
          position: absolute;
          bottom: -8px;
          left: -8px;
          border-radius: 50%;
          background-color: #596175;
        }
        &::after {
          content: '';
          width: 15px;
          height: 15px;
          position: absolute;
          bottom: -8px;
          right: -8px;
          border-radius: 50%;
          background-color: #596175;
        }
        .qwui-electronic_center_row {
          padding-top: 18px;
          display: flex;
          font-size: $font-size-medium;
          .qwui-electronic_center_title {
            display: inline-block;
            width: 57px;
            margin-right: 14px;
            color: #9196A1;
            text-align: left;
          }
          .qwui-electronic_center_name {
            flex: 1;
            text-align: left;
            color: #3F4A64;
          }
        }
      }
      .qwui-electronic_content_down {
        position: relative;
        padding: 0 27px 34px 16px;
        border-bottom: 1px dashed #EEEEEE;
        background-color: $color-background;
        .qwui-electronic_down_row {
          padding-top: 18px;
          display: flex;
          font-size: $font-size-medium;
          .qwui-electronic_down_title {
            display: inline-block;
            width: 57px;
            margin-right: 14px;
            color: #9196A1;
            text-align: left;
          }
          .qwui-electronic_down_name {
            flex: 1;
            text-align: left;
            color: #458BE9;
          }
        }
      }
    }
  }

</style>
