<template>
  <div class="qwui-veh-container border-bottom-1px">
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="false"
      :isMust="field.isMust === '1'"
      @click="selectVeh">
      <span v-if="!isApproveredit" class="qwui-add_icon" slot="title">{{iconText}}</span>
    </qw-cell>
    <div class="qwui-veh_wrap" v-if="this.fieldValue.carId">
      <qw-relation-card
        class="qwui-relaction_card"
        :isShowOperate="!isApproveredit"
        :relationData="vehInfo"
        @chooseRelation="getVehDetail(fieldValue.carId)"
        @deleteRelation="deleteVeh"
        ></qw-relation-card>
    </div>
  </div>
</template>

<script>
import QwCell from './Cell';
 import QwRelationCard from '../reimbursement/RelationCard';
 import { getVehDetail } from '../../api/editor';
 import { mapMutations } from 'vuex';

export default {
  name: 'QwVehField',
  components: {
    QwCell,
    QwRelationCard,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  computed: {
    iconText() {
      return this.fieldValue.carId ? this.$t('i18n.reim.editor.relactionChange') : this.$t('i18n.reim.editor.relactionAdd');
    },
    isApproveredit() {
      return this.$route.name === 'approveredit';
    },
    // 用车单信息
    vehInfo() {
      if (this.fieldValue.carId != '' && this.fieldValue.carTitle != '') {
        const { carId, carTitle, takeTime, luqiaoFee } = this.fieldValue;
        return {
          title: this.$t('i18n.reim.editor.vehRecpt'),
          name: carTitle,
          price: `${this.$t('i18n.reim.editor.expense')}：${luqiaoFee}`,
          time: `${this.$t('i18n.reim.editor.carTake')}：${takeTime}`,
        };
      }
    },
  },
  methods: {
    selectVeh() {
      if (this.isApproveredit) {  return; }

      this.updateViewScrollLock(true);
      this.updateRelationConfig({
        isShow: true,
        type: 'veh',
        data: this.fieldValue.carId,
        callBack: {
          confirm: (selected) => {
            this.updateViewScrollLock(false);
            this.fieldValue.carId = selected.askId;
            this.fieldValue.carTitle = selected.title;
            this.fieldValue.takeTime = selected.takeTime;
            this.fieldValue.luqiaoFee = selected.luqiaoFee;
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      });
    },
    // 获取用车详情
    getVehDetail(askId) {
      _.showLoading();
      getVehDetail({ askId, size: 10 }).then((res) => {
        this.updateVehDetail({isShow: true, data: res.data.detail});
        _.hideLoading();
      });
    },
    // 删除用车单
    deleteVeh() {
      this.fieldValue.carId = '';
      this.fieldValue.carTitle = '';
      this.fieldValue.takeTime = '';
      this.fieldValue.luqiaoFee = '';
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateRelationConfig',
      'updateVehDetail',
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-veh-container {
    overflow: hidden;

    .qwui-relaction_card {
      margin: 0 $box-padding $box-padding 0;
    }

    .qwui-add_icon {
      flex: 1;
      text-align: right;
      font-size: $font-size-medium-s;
      color: $color-sub-theme;
    }
  }
</style>
