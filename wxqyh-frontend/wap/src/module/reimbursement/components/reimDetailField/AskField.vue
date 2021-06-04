<template>
  <div class="qwui-ask-container border-bottom-1px">
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="false"
      :isMust="field.isMust === '1'"
      @click="selectAsk">
      <span v-if="!isApproveredit" class="qwui-add_icon" slot="title">{{iconText}}</span>
    </qw-cell>
    <div class="qwui-ask_wrap" v-if="this.fieldValue.askId">
      <qw-relation-card
        class="qwui-relaction_card"
        :isShowOperate="!isApproveredit"
        :relationData="askInfo"
        @chooseRelation="updateAskDetail({isShow: true, data: askData})"
        @deleteRelation="deleteAsk"
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
  name: 'QwAskField',
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
      return this.fieldValue.askId ? this.$t('i18n.reim.editor.relactionChange') : this.$t('i18n.reim.editor.relactionAdd');
    },
    isApproveredit() {
      return this.$route.name === 'approveredit';
    },
    // 请假单信息
    askInfo() {
      let data = this.askData;
      if (Object.keys(data).length > 0) {
        return {
          title: this.$t('i18n.reim.editor.askRecpt'),
          name: data.title,
          price: this.$t('i18n.reim.editor.duration') + '：' + data.sumAskDays + this.$t('i18n.day'),
          time: data.startTime,
        }
      }
    },
    // 根据当前的请假id获取
    askData() {
      if (this.fieldValue.askId != '' && this.fieldValue.title != '') {
        const { askId, askType, content, createTime, askEndTime, startTime, sumAskDays, title } = this.fieldValue;
        return {
          askId,
          askType,
          content,
          createTime,
          startTime,
          sumAskDays,
          title,
          endTime: askEndTime,
        };
      } else {
        return {};
      }
    },
  },
  methods: {
    selectAsk() {
      if (this.isApproveredit) {  return; }

      this.updateViewScrollLock(true);
      this.updateRelationConfig({
        isShow: true,
        type: 'ask',
        data: this.fieldValue.askId,
        callBack: {
          confirm: (selected) => {
            this.updateViewScrollLock(false);
            for (let key in selected) {
              this.$set(this.fieldValue, key, selected[key]);
            }
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      });
    },
    deleteAsk() {
      this.fieldValue.askId = '';
      this.fieldValue.askType = '';
      this.fieldValue.content = '';
      this.fieldValue.createTime = '';
      this.fieldValue.startTime = '';
      this.fieldValue.sumAskDays = '';
      this.fieldValue.title = '';
      this.fieldValue.endTime = '';
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateRelationConfig',
      'updateAskDetail',
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';
  .qwui-ask-container {
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
