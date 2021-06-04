<template>
  <div class="qwui-veh_detail_container">
    <div class="qwui-veh_detail_head">
      <div class="qwui-veh_detail_title">{{vehDetailData.title}}</div>
      <div class="qwui-veh_detail_date">{{vehDetailData.createTime | formatDate}}</div>

      <div class="qwui-veh_detail_info">
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.startTime')}}</span>{{vehDetailData.takeTime}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.endTime')}}</span>{{vehDetailData.backTime}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.beginLocation')}}</span>{{vehDetailData.beginLocation}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.destinationLocation')}}</span>{{vehDetailData.destinationLocation}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.managerGroupName')}}</span>{{vehDetailData.managerGroupName}}</p>
      </div>

      <div class="qwui-veh_detail_content">{{vehDetailData.subject}}</div>
    </div>

    <div class="qwui-veh_section">
      <div class="qwui-veh_section_head border-bottom-1px">{{$t('i18n.reim.editor.carInfo')}}</div>
      <div class="qwui-veh_section_head qwui-veh_section_item border-bottom-1px"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carName')}}</span>{{vehDetailData.carName}}</div>
      <div class="qwui-veh_cart_driver">
        <div class="qwui-veh_driver_pic" :style="{'background-image': `url(${vehDetailData.headPic})`}"></div>
        <div>
          <div class="qwui-veh_driver_name">{{vehDetailData.driverName}}</div>
          <div class="qwui-veh_driver_phone">{{vehDetailData.mobileno}}</div>
        </div>
      </div>
    </div>

    <div class="qwui-veh_section">
      <div class="qwui-veh_section_head border-bottom-1px">{{$t('i18n.reim.editor.carDetail')}}</div>
      <div class="qwui-veh_mile_list">
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carTakeTime')}}</span>{{vehDetailData.realTakeTime}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carBackTime')}}</span>{{vehDetailData.realBackTime}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carBeginLocation')}}</span>{{vehDetailData.realBeginLocation}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carDestinationLocation')}}</span>{{vehDetailData.realDestinationLocation}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.mile')}}</span>{{vehDetailData.mile}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.startMile')}}</span>{{vehDetailData.startMile}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.endMile')}}</span>{{vehDetailData.endMile}}</p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.carMileage')}}</span></p>
        <p class="qwui-veh_section_item"><span class="qwui-veh_section_info">{{$t('i18n.reim.editor.luqiaoFee')}}</span>{{vehDetailData.luqiaoFee}}</p>
      </div>
    </div>

    <flow-button class="qwui-back_btn" :buttondata="buttonConfig"></flow-button>
  </div>
</template>

<script>
import FlowButton from '@/components/button/flow_button';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'QwVehDetail',
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
      //操作按钮
      buttonConfig:{
        primaryList:[],
        defaultList:[
          { type: 'default', name:'i18n.returnBack', callBack: () => {this.updateVehDetail({isShow: false})}},
        ],
        //按钮是否置底部 active :底部、"":相对定位
        class: 'active'
      },
    };
  },
  computed: {
    ...mapGetters([
      'vehDetailData',
    ]),
  },
  created() {
    this.titie =  document.title;
    document.title = this.$t('i18n.reim.pages.vehDetail');
  },
  beforeDestroy() {
    document.title = this.titie;
    this.updateVehDetail({isShow: false});
  },
  methods: {
    ...mapMutations([
      'updateVehDetail',
    ])
  }
}
</script>

<style lang="scss" scoped>
  .qwui-veh_detail_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    padding-bottom: 80px;
    font-size: 15px;
    background-color: #F7F7F7;
    overflow-y: auto;

    .qwui-veh_detail_head {
      padding: 30px 15px;
      background: #fff;

      .qwui-veh_detail_title {
        margin-bottom: 20px;
        font-size: 20px;
        line-height: 1.5;
        color: #333;
      }
      .qwui-veh_detail_date {
        color: #888;
        font-size: 14px;
      }
    }

    .qwui-veh_detail_info {
      margin-top: 30px;
      font-size: 15px;
      color: #666;
    }

    .qwui-veh_detail_content {
      margin-top: 30px;
      font-size: 16px;
      line-height: 1.5;
    }

    .qwui-veh_section_item {
      display: flex;
      font-size: 15px;
      line-height: 1.7;
      color: #333;

      .qwui-veh_section_info {
        min-width: 65px;
        margin-right: 15px;
        color: #666;
      }
    }

    .qwui-veh_section {
      margin-top: 10px;
      padding-left: 15px;
      background: #fff;
      .qwui-veh_section_head {
        padding: 15px 0;
        font-size: 14px;
        color: #999;
      }
      .qwui-veh_cart_driver{
        display: flex;
        align-items: center;
        padding: 15px 0;
        .qwui-veh_driver_pic {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 50px 50px;
          border: 1px solid #ddd;
        }
        .qwui-veh_driver_name {
          margin-bottom: 5px;
          font-size: 15px;
          color: #333;
        }
        .qwui-veh_driver_phone {
          font-size: 13px;
          color: #999;
        }
      }
      .qwui-veh_mile_list {
        padding: 15px 0;
      }
    }

    .qwui-back_btn {
      left: 0;
    }
  }
</style>

