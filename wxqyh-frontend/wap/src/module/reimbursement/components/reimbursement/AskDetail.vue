<template>
  <div class="qwui-ask_detail_container">
    <div class="qwui-ask_head">
      <div class="qwui-ask_title">{{askDetailData.title}}</div>
      <div class="qwui-ask_date">{{askDetailData.createTime | formatDate}}</div>
    </div>

    <div class="qwui-ask_info">
      <p class="qwui-ask_info_item"><span class="qwui-ask_info_type">{{$t('i18n.reim.editor.sumAskDays')}}</span>{{askDetailData.sumAskDays}}天</p>
      <p class="qwui-ask_info_item"><span class="qwui-ask_info_type">{{$t('i18n.reim.editor.askType')}}</span>{{askType}}</p>
      <p class="qwui-ask_info_item"><span class="qwui-ask_info_type">{{$t('i18n.startTime')}}</span>{{askDetailData.startTime}}</p>
      <p class="qwui-ask_info_item"><span class="qwui-ask_info_type">{{$t('i18n.endTime')}}</span>{{askDetailData.endTime}}</p>
    </div>

    <div class="qwui-ask_content" v-text="askDetailData.content"></div>

    <flow-button class="qwui-back_btn" :buttondata="buttonConfig"></flow-button>
  </div>
</template>

<script>
import FlowButton from '@/components/button/flow_button';
import { mapGetters, mapMutations } from 'vuex';
import { getAskType } from '../../api/editor';

export default {
  name: 'QwAskDetail',
  components: {
    FlowButton,
  },
  filters: {
    formatDate(time) {
      return _.getFormatTime(time);
    },
  },
  data() {
    return {
      askType: '',
      // 操作按钮
      buttonConfig:{
        primaryList:[],
        defaultList:[
          { type: 'default', name:'i18n.returnBack', callBack: () => {this.updateAskDetail({isShow: false})}},
        ],
        //  按钮是否置底部 active :底部、"":相对定位
        class: 'active'
      },
    };
  },
  computed: {
    ...mapGetters([
      'askDetailData',
    ])
  },
  created() {
    this.getAskType();
    this.titie =  document.title;
    document.title = this.$t('i18n.reim.pages.askDetail');
  },
  beforeDestroy() {
    document.title = this.titie;
    this.updateAskDetail({isShow: false});
  },
  methods: {
    // 获取请假类型
    getAskType() {
      _.showLoading();
      getAskType({typeId: this.askDetailData.askType}).then((res) => {
        this.askType = res.data.typeName;
        _.hideLoading();
      });
    },
    ...mapMutations([
      'updateAskDetail',
    ])
  }
};
</script>

<style lang="scss" scoped>
  .qwui-ask_detail_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    padding-bottom: 60px;
    font-size: 15px;
    background-color: #fff;
    overflow-y: auto;

    .qwui-ask_head {
      margin: 30px 15px 30px;

      .qwui-ask_title {
        margin-bottom: 15px;
        font-size: 20px;
        line-height: 1.5;
        color: #333;
      }
      .qwui-ask_date {
        font-size: 14px;
        color: #888;
      }
    }

    .qwui-ask_info {
      padding: 0 15px;
      margin-bottom: 30px;
      color: #666;
      .qwui-ask_info_item {
        display: flex;
        align-items: center;
        color: #333;
        line-height: 1.8;

        .qwui-ask_info_type {
          margin-right: 15px;
          min-width: 65px;
          color: #666;
        }
      }
    }

    .qwui-ask_content {
      padding: 0 15px;
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }

    .qwui-back_btn {
      left: 0;
    }
  }
</style>

