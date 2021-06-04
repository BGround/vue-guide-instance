<template>
  <div class="qwui-statusList">
    <div  v-for='(item,index) in list' :key='item.carId' class="MR_settings_content">
      <div class="settings-item MR_settings-item">
        <div class="MR_item">
          <span class="MR_makeBtn qw_makeBtn" @click="useCar(item)">用车</span>
          <div class="qw_settings-item" @click="carDetail(item,index)">
            <p class="MR_name ellipsis">{{ item.name }}</p>
            <p class="MR_msg ellipsis">
              <span>{{item.carno + ', '}}</span>
              <span v-if="item.limited">限载{{item.limited | toNum}}人, </span>
              <span>{{'司机 ' + item.driver}}</span>
            </p>
            <div class="qw_timeProgress MR_timeProgress">
              <span class="text" v-if="!item.progress.length">未来7天空闲</span>
              <div class="progress" v-if="item.progress.length" v-for="(item1,key) in item.progress"
                   :key="key"
                   :style="{left: item1.left, width: item1.width}">
              </div>
            </div>
            <div class="occupyMsg" v-if="item.carAsks.length">
              <div class="carAsksItem">
                <p class="MR_tip_title ellipsis">占用信息:</p>
                <p class="MR_use_time ellipsis" v-for="item1 in item.carAsks.slice(0, 3)" :key="item1.askId">
                  <span class="time">{{item1.takeTime.slice(5) + ' 至 ' + item1.backTime.slice(5) }}</span>
                  <span class="tip">{{(item1.beginLocation || '未填写出发地') + ' 至 ' + (item1.destinationLocation || '未填写目的地')}}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {validCar} from '../../api/getData'
  export default {
    name: 'statusList',
    props: {
      list: {
        type: Array,
        required: true
      },
      isSendCar: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      if(!this.detailData && this.isSendCar) {
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapState({
        detailData: state => state.detail.detailData && state.detail.detailData.detail     //detail信息
      })
    },
    methods: {
      useCar(item) {
        if(this.isSendCar) {
          this.isValidCar(item)
        } else {
          document.documentElement.scrollTop = document.body.scrollTop = 0 //滚动到顶部
          this.$router.push({path: '/add', query: {carName: item.name}})
        }
      },
      isValidCar(item) {
        let _this = this
        _.showLoading()
        validCar({carId: item.carId,takeTime: this.detailData.takeTime,backTime: this.detailData.backTime},function(data) {
          let askList = data.askList
          let userAskList = data.userAskList
          let btnConfig = {
            primaryBtn: {
              name: '确认',
              callBack: function() {
                _this.selectCar(item)
              }
            },
            defaultBtn: {
              name: '取消',
              callBack: null
            }, //主操作按钮
          }
          if(askList.length > 0) {
            _.alert('确定继续分派吗？','车辆在用车时间内已被占用',btnConfig);
          } else if(userAskList.length > 0) {
            _.alert('确定要分派吗？',`${userAskList[0].title}还未结束`,btnConfig);
          } else {
            _this.selectCar(item)
          }
        })
      },
      selectCar(item) {
        this.$store.commit('updateCarDetail', {carId: item.carId, carName: item.name, carNumber: item.carno})
        this.$emit('close')
      },
      carDetail(item,index) {
        this.$emit('openCarDetail', {carId: item.carId, isSendCar: this.isSendCar,carIdx: index})
      }
    },
    filters: {
      toNum(val) { //过滤字符串里非数字部分
        if(!val) return
        return val.replace(/[^0-9]/ig,"")
      }
    }
  }
</script>

<style scoped>
  .MR_settings_content {
    padding-left: 14px;
    background: #fff;
  }
  .MR_settings_content .MR_settings-item {
    line-height: normal;
    padding: 14px 14px 12px 0;
    /* border-bottom: 1px solid #dfdfdd; */
  }
  .settings-item {
    position: relative;
    overflow: hidden;
    font-size: 16px;
    line-height: 2.2;
    clear: both;
    background-color: white;
  }
  .settings-item::before{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid rgba(247,248,250,1);
    color: #dfdfdd;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .MR_item {
    position: relative;
    cursor: pointer;
    outline: none;
  }
  .MR_makeBtn {
    padding: 6px 15px;
    font-size: 13px;
    color: #fff;
    background-color: #5585F0;
    border: 1px solid #5585F0;
    border-radius: 2px;
  }
  .MR_makeBtn {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 1;
    cursor: pointer;
  }
  .MR_name {
    line-height: 22px;
    font-size: 16px;
    padding-bottom: 6px;
    color: #333;
    padding-right: 60px;
  }
  .MR_msg {
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 9px;
    color: #B2B9C8;
    width: 80%;
  }
  .MR_timeProgress {
    position: relative;
    width: 100%;
    background-color: #E8EFFF
  }
  .MR_timeProgress, .MR_timeProgress rect {
    height: 20px;
    fill: #E8EFFF;
  }
  .MR_timeProgress .text {
    font-size: 12px;
    color: rgb(156, 187, 255);
    margin-left: 6px;
    vertical-align: top;
    height: 20px;
    line-height: 20px;
  }
  .MR_timeProgress .progress {
    position: absolute;
    height: 20px;
    background-color: #C1D4FF;
  }
  .MR_tip_title {
    color: #B2B9C8;
    padding-top: 10px;
  }
  .MR_use_time, .MR_tip_title {
    line-height: 18px;
    font-size: 13px;
    width: 98%;
    padding-bottom: 3px;
    word-break: break-word;
  }
  .MR_use_time .tip {
    color: #7A7C80;
  }
  .MR_use_time .time {
    color: #FF586D;
  }

</style>
