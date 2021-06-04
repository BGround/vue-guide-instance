<template>
  <transition name="slide">
    <div class="change-mile" v-if="detail">
      <div class="error-time-tip" v-show="mileError">
        <span>结束里程应大于开始里程</span>
      </div>
      <div class="change-detail">
        <div class="change-subject">
          <span>修改里程费用信息</span>
        </div>
        <div class="modify-fields">
          <custom-fields
            :list="carEndList"
            @change="fieldChange">
          </custom-fields>
        </div>
      </div>
      <button-group class="absolute_active">
        <qwui-button type="default" text="返回" @buttonClick="close"></qwui-button>
        <qwui-button type="primary" text="确认" @buttonClick="confirm"></qwui-button>
      </button-group>
    </div>
  </transition>
</template>
<script>
import { mixinCarEndFields } from '../../js/mixin'
import {updataCarAskMileAndFeel} from '../../api/getData.js'
import { validation } from '../../js/validate'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
import customFields from '../customFields/customFields'
export default {
  name: 'changeMile',
  mixins:[mixinCarEndFields],
  components: {
    qwuiButton,
    buttonGroup,
    customFields
  },
  data(){
    return {
      carEndValue: {},
      params: '',
      isScroll: false
    }

  },
  created() {
    let _this = this
    // 里程数和费用控制
    if(this.config) {
      this.carEndList[0].status = this.carEndList[1].status = this.config.showMile
      this.carEndList[0].isMust = this.carEndList[1].isMust = this.config.needMile
      this.carEndList[2].status = this.config.showFee
      this.carEndList[2].isMust = this.config.needFee
      this.carEndList[3].optionName = '修改原因'
      this.carEndList[3].itemId = 'updateContent'
      this.carEndList[3].value = '结束里程数跟实际里程数不符。'
    }
    this.carEndList[0].maxLength = 10
    this.carEndList[1].maxLength = 10
    this.carEndList[2].maxLength = 10
    if(this.detail) {
      if(this.config.showMile == 1) {
        this.carEndValue[this.carEndList[0].itemId] = this.carEndList[0].value = this.detail.startMile
        this.carEndValue[this.carEndList[1].itemId] = this.carEndList[1].value = this.detail.endMile
      }
      if(this.config.showFee == 1) this.carEndValue[this.carEndList[2].itemId] = this.carEndList[2].value = this.detail.luqiaoFee
      this.carEndValue[this.carEndList[3].itemId] = this.carEndList[3].value
    }
    $(window).resize(function() {
      _this.fixedBtn()
    });
  },
  computed:{
  },
  methods:{
    // 字段值处理
    fieldChange(item) {
      if(item.key == 'updateContent') {
        this.carEndValue[item.key] = item.value
      } else {
        this.carEndValue[item.key] = (item.value * 1).toFixed(1)
        let idx = item.value.indexOf('.')
        this.carEndValue[item.key] = idx >= 0 ? item.value.split('.')[0].substring(0, 9) + '.' + item.value.split('.')[1].substring(0, 1) : item.value.substring(0)+'.0'
      }
    },
    close(){
      this.$emit("closeChangeMile")
    },
    confirm(){
      let _this = this
      this.params = {
        askId: this.$route.query.askId                                     //修改原因
      }
      if(this.config.showMile == 1) {
        this.params.oldStart = this.detail.startMile
        this.params.oldEnd = this.detail.endMile
      }
      if(this.config.showFee == 1) {
        this.params.oldLuqiao = this.detail.luqiaoFee
      }
      this.params = Object.assign({}, this.params, this.carEndValue)
      if(!this.checkMile(this.params.start, this.params.end)) return
      // 验证字段有没必填
      let validate = validation([], {}, this.carEndList, this.carEndValue)
      if(!validate.showFieldTips) {
        if(this.params.luqiao * 1 < 0 || this.params.luqiao * 1 > 10000000) {
          _.alert("提示",'用车费用不能小于零或大于一千万')
          return
        }
        updataCarAskMileAndFeel(this.params, res => {
          setTimeout(function() {
            _this.close()
            _this.$emit('confirmEvent', _this.params)
          }, 1000)
        })
      }
    },
    fixedBtn() {
      if(this.isScroll) return
      $('.absolute_active').css({position: 'fixed'})
      this.isScroll = true
    }
  }
}
</script>
<style scope>
  .change-mile{
    position: fixed;
    width: 100%;
    background-color: #FFFFFF;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    z-index: 10;
    overflow: auto;
  }
  .change-detail {
    padding: 0 14px;
  }
  .change-subject{
    padding: 16px 0;
    margin-bottom: 6px;
    border-bottom: 1px solid #F7F8FA;
  }
  .change-subject span{
    height:22px;
    font-size:16px;
    line-height:22px;
    color: #1B233A;
  }
  .error-time-tip{
    padding: 8px 0;
    height: 20px;
    color: #FE5354;
    top: 0;
    text-align: center;
    background-color: #FFE5E5;
  }
  @media screen and (min-width: 1024px) {
    .change-mile {
      width: 740px;
    }
  }
  .change-mile >>> .qwui-btn_box.absolute_active {
    position: absolute;
    background: #fff;

  }
  .change-mile >>> .qwui-btn_box.absolute_active::before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
  }
</style>


