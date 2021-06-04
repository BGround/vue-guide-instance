<template>
  <transition name="slide">
    <div class="car-change-time">
      <div class="car-edit-time edit">
        <div class="title">修改用车时间</div>
        <div class="car-time-wrap">
          <input type="hidden" id="car_time_start" v-model="timeArea.startTime">
          <input type="hidden" id="car_time_end" v-model="timeArea.endTime">
          <div class="time-box" :style="allowModifyStart ? 'cursor:pointer' : ''" :class="{'enable': !allowModifyStart}" @click="modifyStartTime">
            <p class="time">{{timeArea.startTime.slice(11)}}</p>
            <p class="day">{{timeArea.startTime.slice(0,10)}}</p>
            <p class="time-tip" v-show="timeErrTips.takeErr != ''">{{timeErrTips.takeErr}}</p>
          </div>
          <div class="arrow"></div>
          <div class="time-box" :style="allowModifyEnd ? 'cursor:pointer' : ''" :class="{'enable': !allowModifyEnd}" @click="modifyEndTime">
            <p class="time">{{timeArea.endTime.slice(11)}}</p>
            <p class="day">{{timeArea.endTime.slice(0,10)}}</p>
            <p class="time-tip" v-show="timeErrTips.backErr">{{timeErrTips.backErr}}</p>
          </div>
        </div>
      </div>
      <div class="car-edit-reason edit">
        <text-area-field
          :field="field"
          :value="value"
          :placeholder="placeholder"
          @change="modifyReason">
        </text-area-field>
      </div>
      <button-group class="absolute_active">
        <qwui-button type="default" text="取消" @buttonClick="cancel"></qwui-button>
        <qwui-button type="primary" text="确认" @buttonClick="confirm"></qwui-button>
      </button-group>
    </div>
  </transition>
</template>

<script>
import {setErrorTips} from '../../js/validate'
import {modifyTime} from '../../api/getData.js'
import textAreaField from '../fields/textAreaField'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
export default {
  props: {
    allowModifyStart: { //是否允许修改起始时间
      type: Boolean,
      default: true
    },
    allowModifyEnd: {
      type: Boolean,
      default: true
    },
    takeTime: {
      type: String,
      default: ''
    },
    backTime: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    textAreaField,
    qwuiButton,
    buttonGroup
  },
  data() {
    return {
      field: {},
      value: '行程有变，需修改用车时间。',
      placeholder: '请输入修改原因',
      timeArea: {
        startTime: '',
        endTime: ''
      },
      timeErrTips: {
        takeErr: '',
        backErr: ''
      },
      isScroll: false
    };
  },
  mounted() {
    let _this = this
    this.field = {
      id: 'modify-time',
      status: 1,
      isMust: 1,
      optionName: '修改原因'
    }
    this.timeArea.startTime = this.takeTime;
    this.timeArea.endTime = this.backTime;
    if(this.allowModifyEnd) {
      // 只能是修改结束时间
      if(!this.allowModifyStart) this.value = '车辆尚未使用完，需要延长用车时间。'
    }
    $(window).resize(function() {
      _this.fixedBtn()
    });
  },
  updated() {
    this.initTimePlugin()
  },
  methods: {
    showTimeErrTips() { //开始结束时间差
      let now = Number(new Date().getTime())
      let startTime = Number(new Date(this.timeArea.startTime.replace(/-/g,'/')).getTime())
      let endTime = Number(new Date(this.timeArea.endTime.replace(/-/g,'/')).getTime())
      if(this.takeTime != this.timeArea.startTime && startTime < now) {
        this.timeErrTips.takeErr = '用车开始时间不能早于当前时间';
      } else if((this.backTime != this.timeArea.endTime || this.takeTime != this.timeArea.startTime) && endTime < startTime) {
        this.timeErrTips.takeErr = '用车开始时间应早于结束时间';
        this.timeErrTips.backErr = '用车结束时间应晚于开始时间';
      } else {
        this.timeErrTips = {
          takeErr: '',
          backErr: ''
        }
      }
    },
    modifyReason(item) {
      this.value = item.value
    },
    cancel() {
      this.$emit('closeEvent');
    },
    confirm() {
      let _this = this
      //时间范围不正确或没填理由
      this.showTimeErrTips()
      if(this.timeErrTips.takeErr != '' || this.timeErrTips.backErr != '') {
        return
      }
      if(this.value.trim() == '') {
        setErrorTips(this.field.id, this.field.optionName)
        return
      }
      //没有修改用车时间权限并且没有修改时间
      let takeTime = !this.allowModifyStart || this.takeTime === this.timeArea.startTime ? '' : this.timeArea.startTime + ':00'
      let delayTime = !this.allowModifyEnd || this.backTime === this.timeArea.endTime ? '' : this.timeArea.endTime + ':00'
      if(takeTime == '' && delayTime == '') {
        this.cancel()
        return
      }
      //接口请求
      let postData = {
        "askId": this.id,
        "takeTime": takeTime,
        "delayTime": delayTime,
        "delayReason": this.value
      };
      _.showLoading()
      modifyTime(postData).then(res => {
        _.hideLoading()
        if(res.code == 0) {
          _.tooltips_succeed('操作成功')
          setTimeout(function() {
            _this.$emit('closeEvent', postData)
          }, 1000)
        } else {
          _.alert('提示',res.desc)
        }
      });
    },
    initTimePlugin() {
      let _this = this;
      let $takeTime = $("#car_time_start");
      let $backTime = $("#car_time_end");
      let mobiConfig = {
          dateFormat: "yy-mm-dd",
          dateOrder: "yymmd D",
          dayText: "日",
          display: "bottom",
          startYear: 2014,
          endYear: 2050,
          mode: "scroller",
          monthText: "月份",
          showNow: true,
          nowText: '当前时间',
          headText: "",
          stepMinute: 1,
          theme: "android-holo light",
          yearText: "年份",
          cancelText: "确认",
          setText: "取消"
        }
      if(this.allowModifyStart) {
        $takeTime.mobiscroll().datetime({
          ...mobiConfig
        })
        $takeTime.on("change", function(e) {
          _this.timeArea.startTime = e.target.value
        })
      }
      if(this.allowModifyEnd) {
        $backTime.mobiscroll().datetime({
          ...mobiConfig
        })
        $backTime.on("change", function(e) {
          _this.timeArea.endTime = e.target.value
        })
      }
    },
    modifyStartTime() {
      $('#car_time_start').trigger('click')
    },
    modifyEndTime() {
      $('#car_time_end').trigger('click')
    },
    fixedBtn() {
      if(this.isScroll) return
      $('.absolute_active').css({position: 'fixed'})
      this.isScroll = true
    }
  }
};
</script>
<style lang='scss' scoped>
.car-change-time {
  width: 100%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1024px) {
    width: 740px;
  }
  position: fixed;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  background: #f4f6f8;
  z-index: 10;
  overflow: auto;
  .edit {
    padding: 0 14px;
    background: #fff;
    .title {
      height: 54px;
      line-height: 54px;
      font-size: 16px;
      text-align: left;
      margin-left: 14px;
      border-bottom: 1px solid #f4f6f8;
    }
  }
  .car-edit-time {
    padding: 0;
    margin-bottom: 8px;
    .title {
      color: #1b233a;
    }
    .car-time-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 92px;
      padding: 0 14px;
      .time-box {
        flex: 1;
        &.enable {
          .time {
            color: #BFC1C7;
          }
          .day {
            color: #BFC1C7;
          }
        }
        > p {
          text-align: center;
        }
        .time {
          height: 28px;
          font-size: 20px;
          color: rgba(27, 35, 58, 1);
          line-height: 28px;
        }
        .day {
          height: 20px;
          font-size: 14px;
          color: rgba(162, 165, 178, 1);
          line-height: 20px;
        }
        .time-tip {
          font-size:11px;
          color:rgba(255,88,109,1);
          line-height:16px;
        }
      }
      .arrow {
        width: 72px;
        height: 100%;
        margin: 0 14px;
        background-image: url(~assets/images/car/group.png);
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
  .car-edit-reason {
    flex: 1;
  }
  .car-change-time >>> .qwui-btn_box.absolute_active{
        position: absolute;
    background: #fff;
  }
  .car-change-time >>> .qwui-btn_box.absolute_active::before{
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
}
</style>
