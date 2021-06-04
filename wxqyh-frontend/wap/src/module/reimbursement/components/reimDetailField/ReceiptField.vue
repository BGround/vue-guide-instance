<template>
  <div class="qwui-receipt-container border-bottom-1px">
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="false"
      :isMust="field.isMust === '1'"
      @click="relationWxCard($parent.index)">
      <span v-if="!isApproveredit" class="qwui-add_icon" slot="title">{{$t('i18n.reim.editor.relactionAdd')}}</span>
    </qw-cell>
    <div class="qwui-receipt_wrap">
      <qw-relation-card
        class="qwui-relaction_card"
        v-for="(fapiao, faIndex ) in fieldValue.fapiaoInfo"
        :key="fapiao.card_id"
        :isShowOperate="!isApproveredit"
        :relationData="wxCardInfo(fapiao)"
        @chooseRelation="showWxCardDetail(fapiao)"
        @deleteRelation="deleteWxCard(fapiao, faIndex)"
      ></qw-relation-card>
    </div>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk';
import QwCell from './Cell';
import QwRelationCard from '../reimbursement/RelationCard';
import { getVehDetail } from '../../api/editor';
import { mapMutations, mapGetters } from 'vuex';
import { wxcardAuthorize, getWxcardInfo, downLoadWxCard } from '../../api/invoice';

export default {
  name: 'QwReceiptField',
  components: {
    QwCell,
    QwRelationCard,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  data() {
    return {
      // jsapi签名
      cardapijs: '',
    }
  },
  computed: {
    isApproveredit() {
      return this.$route.name === 'approveredit';
    },
    ...mapGetters([
      'isVerified',
      'corpNameInfo',
      'wxCardInfoList',
    ])
  },
  created() {
    // 是否开启debug
    this.wxqyh_is_debug = this.$route.query.debug;
  },
  methods: {
    deleteWxCard(fapiao, faIndex) {
      // 删除当前明细发票信息
      this.fieldValue.fapiaoInfo.splice(faIndex, 1);
      this.delRelationWxCard(fapiao.cardCode);
    },
    // 获取发票信息数据
    wxCardInfo(fapiao) {
      return {
        title: this.$t('i18n.reim.editor.cardRecpt'),
        name: fapiao.gmfMc,
        price: this.$t('i18n.reim.editor.money') + '：' + fapiao.xsfMc,
        time: fapiao.kprq,
      }
    },
    // 显示发票详情
    showWxCardDetail(fapiao) {
      this.updateWxCardDetail({isShow: true, data: fapiao});
    },
    // 关联发票
    relationWxCard(index) {
      if (this.isApproveredit) {  return; }

      if (!this.isVerified) {
        _.alert('i18n.notice', this.$t('i18n.reim.editor.unVerified'));
        return;
      }
      if (this.corpNameInfo == '') {
        _.alert('i18n.notice', this.$t('i18n.reim.editor.noCorpNameInfo'));
        return;
      }
      if(_.isWeChatApp()) {
        if (this.cardapijs == '') {
          wx.ready(function() {
            if (this.wxqyh_is_debug) {
              console.log('debug: cardAuthorize')
            }
            cardAuthorize(index);
          });
        } else {
          chooseWxCard(index);
        }
      } else {
        _.alert('i18n.notice', this.$t('i18n.reim.editor.noAppWxcard'));
      }
    },
    // 拉取用户电子发票卡券类参数
    cardAuthorize(index) {
      wxcardAuthorize().then((res) => {
        const cardapijs = res.data.apijs;

        // 获取jsapi签名
        this.cardapijs = cardapijs;

        wx.invoke('chooseInvoice', {
          'timestamp': cardapijs.timestamp,
          'nonceStr': cardapijs.nonceStr,
          'signType': 'SHA1',
          'cardSign': cardapijs.cardSign,
        }, function(res) {
          if(this.wxqyh_is_debug){
            alert(JSON.stringify(res));
          }

          if(res.err_msg=='err_msg choose_invoice:fail'){
              _.alert('i18n.notice', this.$t('i18n.reim.editor.VerifiyError'));
          }

          // 用户选中的卡券列表信息
          let cardList = res.choose_invoice_info;
          if(cardList && cardList.length>0){
            this.getWxCardInfo(cardList, index);
          }
      });
      }).catch((err) => {
        _.alert('i18n.notice', this.$t('i18n.reim.editor.VerifiyError'));
        console.log(err);
      });
    },
    // 选择发票
    chooseWxCard(index) {
      wx.ready(function(){
          wx.invoke('chooseInvoice', {
              'timestamp': cardapijs.timestamp,
              'nonceStr': cardapijs.nonceStr,
              'signType': 'SHA1',
              'cardSign': cardapijs.cardSign,
          }, function(res) {
              if(this.wxqyh_is_debug){
                  alert(JSON.stringify(res));
              }
              if(res.err_msg=='err_msg choose_invoice:fail'){
                  _.alert('i18n.notice', this.$t('i18n.reim.editor.VerifiyError'));
              }
              // 用户选中的卡券列表信息
              var cardList = res.choose_invoice_info;
              if(cardList && cardList.length>0){
                  getWxCardInfo(cardList,index);
              }

          });
      });
    },
    // 删除关联
    delRelationWxCard(cardCode) {
      if (this.wxCardInfoList.length) {
        let wxCardInfoList = [...this.wxCardInfoList];

        for(let i = 0; i < wxCardInfoList.length; i++) {
          if (cardCode == wxCardInfoList[i].cardCode) {
            wxCardInfoList.splice(i, 1);
          }
        }

        this.updateWxCardInfoList(wxCardInfoList);
      }
    },
    // 获取微信发票
    getWxCardInfo(cardList, index) {
      _.showLoading();
      this.getWxcardInfo({cardList}).then((res) => {
        let wxCardList = res.data.wxFaPiaoList;

        //判断电子发票是否已经被其他项目使用
        let isExit = checkWxCardList(wxCardList);

        if (!isExit) {
          showWxCardInfo(wxCardList, index);
        }
        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
         _.alert('i18n.notice', err.desc);
      });
    },
    // 显示发票信息
    showWxCardInfo(wxCardList, index) {
      let wxCardInfoList = [...this.wxCardInfoList]
      // 格式化成与后台储存的同种格式
      let fapiaoInfo = wxCardList.map(fapiao => {
        return  {
          reimId: index,
          cardId: fapiao.card_id,
          cardCode: fapiao.encrypt_code,
          kprq: fapiao.billing_time,
          xsfMc: fapiao.payee,
          gmfMc: fapiao.title,
          fpDm: fapiao.billing_no,
          fpHm: fapiao.billing_code,
          jshj: fapiao.fee,
          source: 1,
          kpxmc: fapiao.info[0] ? fapiao.info[0].name: '',
        }
      });

      this.fieldValue.fapiaoInfo.push(...fapiaoInfo);
      wxCardInfoList.push(...fapiaoInfo);
      this.updateWxCardInfoList(wxCardInfoList);
    },
    // 检查发票是否重复
    checkWxCardList(wxCardList) {
      let isExit = false;
      let wxCardInfoList = this.wxCardInfoList;

      if (wxCardList && wxCardList.length > 0) {
        for(let i = 0; i < wxCardList.length; i++) {
          for(let j = 0; j < wxCardInfoList.length; j++) {
            if (wxCardList[i].encrypt_code == wxCardInfoList[j].cardCode) {
              _.alert('i18n.notice', this.$t('i18n.reim.editor.reimDetailItem') + wxCardInfoList[j].reimId + this.$t('i18n.reim.editor.wxCardRepeat'));
              return true;
            }
          }

          if(wxCardList[i].title != this.corpNameInfo){
            _.alert('i18n.notice', this.$t('i18n.reim.editor.wxCardNumIs') + '[' + wxCardList[i].billing_code + ']' +  this.$t('i18n.reim.editor.wxCardReceipt') + '[' + wxCardList[i].title + ']' + this.$t('i18n.reim.editor.yourCorpName') + '[' + this.corpNameInfo + ']' + this.$t('i18n.reim.editor.diff') + '，' + this.$t('i18n.reim.editor.chooseAgain'));
            return true;
          }
          if(wxCardList[i].reimburse_status == "INVOICE_REIMBURSE_LOCK"){
            _.alert('i18n.notice', this.$t('i18n.reim.editor.wxCardNumIs') + '[' + wxCardList[i].billing_code + ']' + this.$t('i18n.reim.editor.wxCardLock') + '，' + this.$t('i18n.reim.editor.chooseAgain'));
            return true;
          }
        }
      }
      return isExit;
    },
    ...mapMutations([
      'updateWxCardDetail',
      'updateWxCardInfoList',
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';
  .qwui-receipt-container {
    overflow: hidden;

    .qwui-add_icon {
      flex: 1;
      text-align: right;
      font-size: $font-size-medium-s;
      color: $color-sub-theme;
    }

    .qwui-relaction_card {
      margin: 0 $box-padding $box-padding 0;
    }
  }
</style>
