<template>
  <div class="mile-info">
    <div class="mile-title">
      <span class="info" >里程费用信息</span>
      <div class="right">
        <div v-if="dealPerson" class="iconwrap" @click="$emit('openChangeMile')">
          <i class="edit-mile"></i>
          <span class="edit-info" >修改</span>
        </div>
      </div>
    </div>
    <div class="modify-fields">
      <custom-fields :list="carEndList"></custom-fields>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import customFields from '../customFields/customFields'
export default {
  name: 'mileInfo',
  components:{
    customFields
   },
  data(){
    return{
      carEndList: [
        {
          id: 'start-mile',
          itemId: 'start',
          optionName: '开始里程数',
          placeholder: '填写开始里程',
          type: '3',
          status: '1',
          isMust: '0',
          readonly: true,
          value: '',
          maxLength: 10
        },
        {
          id: 'end-mile',
          itemId: 'end',
          optionName: '结束里程数',
          placeholder: '填写最终里程',
          type: '3',
          status: '1',
          isMust: '0',
          readonly: true,
          value: '',
          maxLength: 10
        },
        {
          id: 'real-mile',
          itemId: 'referenceMile',
          optionName: '行驶里程',
          placeholder: '填写行驶里程',
          type: '3',
          status: '1',
          isMust: '0',
          readonly: true,
          value: '',
          maxLength: 10
        },
        {
          id: 'car-cost',
          itemId: 'luqiao',
          optionName: '用车费用',
          placeholder: '填写用车费用',
          type: '3',
          status: '1',
          isMust: '0',
          readonly: true,
          value: '',
          maxLength: 10
        }
      ],
    }
  },
  created() {
    // 里程数和费用控制
    if(this.config) {
      this.carEndList[0].status = this.carEndList[1].status = this.config.showMile
      this.carEndList[3].status = this.config.showFee
    }
    if(this.detail) {
      this.updateData(this.detail)
    }
  },
  computed: {
    ...mapState({
      detailData: state => state.detail.detailData
    }),
    detail() {
      return this.detailData && this.detailData.detail
    },
    config() {
      return this.detailData && this.detailData.config
    },
    isCreator() {
      return this.detail && this.detail.creator === _.userId
    },
    // 提单人、司机、车管员(并且后台有设置)
    dealPerson() {
      return this.isCreator && this.config && this.config.carUserOpen == 1 ||
             this.detailData && this.detailData.isCarManager == 1 && this.config && this.config.managerOpen == 1 ||
             this.detailData && this.detailData.isCarDriver == 1 && this.config && this.config.driverOpen == 1
    },
  },
  methods: {
    updateData(detail) {
      if(this.config && this.config.showMile == 1) {
        this.carEndList[0].value = detail.startMile || '0'
        this.carEndList[1].value = detail.endMile || '0'
        this.carEndList[2].value = detail.referenceMile || '0'
      } else  this.carEndList[2].status = 0
      if(this.config && this.config.showFee == 1) this.carEndList[3].value = detail.luqiaoFee || '0'
    }
  },
  watch: {
    detail: {
      handler(item) {
        this.updateData(item)
      },
      deep: true
    }
  }
}
</script>
<style scope>
  .mile-info{
    padding: 0 14px;
    background-color: #FFFFFF;
  }
  .mile-title{
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #F7F8FA;
  }
  .info{
    display: inline-block;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
    color:#1B233A;

  }
  .right{
    display: inline-block;
    flex:1;
    text-align: right;
  }
  .edit-mile{
    display: inline-block;
    vertical-align: text-bottom;
    width: 12px;
    height: 16px;
    background:url(~assets/images/car/modify-icon.png) no-repeat center;
    background-size: 100%;
  }
  .edit-info{
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #467DB9;
    margin-left: 4px;
  }
  .miles-start{
    padding: 12px 0;
    display: flex;
  }
  .detail-title-mile{
    height:21px;
    font-size:15px;
    line-height:21px;
    color: #7A7C80;
  }
  .detail-info{
    flex: 1;
    height:21px;
    font-size:15px;
    text-align: right;
    line-height: 21px;
    color: #0A1735;
  }
  .iconwrap{
    display: inline-block;
    cursor: pointer;
  }

</style>


