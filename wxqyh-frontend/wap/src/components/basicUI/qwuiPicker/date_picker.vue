<template>
  <transition name="picker-fade">
    <div class="picker"
         v-show="state===1"
         @touchmove.prevent
         ref="scrollThis"
         @click="cancel">
      <transition name="picker-move">
        <div class="picker-panel" v-show="state===1" @click.stop>
          <div class="picker-choose">
            <a class="cancel" @click="cancel">{{cancelTxt}}</a>
            <a class="confirm" @click="confirm">{{confirmTxt}}</a>
            <h1 class="picker-title" @click="setToday(true)">{{$t('i18n.today')}}</h1>
          </div>
          <div class="picker-illustration">
            <div class="ills-item" v-for="item in illustration">{{$t(item)}}</div>
          </div>
          <div class="picker-content">
            <div class="mask-top"></div>
            <div class="mask-bottom"></div>
            <div class="wheel-wrapper" ref="wheelWrapper">
              <div class="wheel" v-for="data in pickerData">
                <ul class="wheel-scroll">
                  <li v-for="item in data" class="wheel-item">{{item.text}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="picker-footer"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  /**
   * picker组件
   * @example
   * <qwui-picker :data="pickData"  ref="picker"  @select="handleSelect(arguments)"  cancelTxt="取消" confirmTxt="确定"></qwui-picker>
   */
  import BScroll from 'better-scroll'

  const STATE_HIDE = 0
  const STATE_SHOW = 1

  const EVENT_SELECT = 'select'
  const EVENT_VALUE_CHANGE = 'valuechange'
  const EVENT_CANCEL = 'cancel'
  const WEEK = ['i18n.Sunday', 'i18n.Monday', 'i18n.Tuesday', 'i18n.Wednesday', 'i18n.Thursday', 'i18n.Friday', 'i18n.Saturday']

  export default {
    name: 'qwui-picker',
    props: {
      //显示数据
      data: {
        type: Array,
        default() {
          return []
        }
      },
      //取消文字
      cancelTxt: {
        type: String,
        default: '取消'
      },
      //确认文字
      confirmTxt: {
        type: String,
        default: '确认'
      },
      //初始化时间
      initDate: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        state: STATE_HIDE,
        illustration:['i18n.year', 'i18n.month', 'i18n.days', 'i18n.hour', 'i18n.minute'],
        pickerData: this.data.slice(),
        pickerSelectedIndex: [],    // 默认选中第几个
        pickerSelectedVal: [],                      // 选中的值
        pickerSelectedText: [],                     // 选中的文字
        scrollRecord:[],                            // 记录滚动(未确定)时的pickerSelectedIndex temp值
        lock_scroll:false
      }
    },
    watch:{
      data(newData) {
        this.setData(newData)
      },
      initDate(val){
        if(val) {
          this.setToday(false, val)
        }
      }
    },
    created() {
      if(this.pickerData.length == 3){
        this.illustration = ['i18n.year', 'i18n.month', 'i18n.days']
      } else if (this.pickerData.length == 2){
        this.illustration = ['i18n.year', 'i18n.month']
      }
      if(this.initDate){
        this.setToday(false,this.initDate);
      } else if (!this.pickerSelectedIndex.length) {       // 默认当前日期
        this.pickerSelectedIndex = [];
        this.setToday(false);
      }
    },
    mounted(){
      this.mouseWheel();
    },
    methods: {
      //根据当前年月添加上星期几
      addWeek:function (year, month, flag) {
        if(this.pickerData.length > 2) {
          let days = this.getDaysInOneMonth(year, month), tempDay = '';
          this.pickerData[2] = this.data[2].slice(0, days)
          for (let i = 0; i < this.pickerData[2].length; i++) {
            tempDay = new Date(year + '/' + month + '/' + this.pickerData[2][i].text.substring(0, 2)).getDay()
            this.pickerData[2][i].text = this.pickerData[2][i].text.substring(0, 2) + ' ' + this.$t(WEEK[tempDay])
          }
          flag ? this.refillColumn(2) : '' //重置日期选择框
        }
      },
      //获取某年某月有多少天
      getDaysInOneMonth:function(year, month){
        month = parseInt(month, 10);
        let d= new Date(year, month, 0);
        return d.getDate();
      },
      //设置今天
      setToday:function(flag, hasDate){
        let time = hasDate ? hasDate :_.getCurrentTime(), dateToday = [];
        dateToday.splice(0,0,time.substring(0,4), time.substring(5,7), time.substring(8,10), time.substring(11,13), time.substring(14,16))
        for( let i = 0; i < this.pickerData.length; i++){
          let temp = this.pickerData[i].findIndex((e) => {
            return i != 2 ? e.text == dateToday[i] : e.text.substring(0,2) == dateToday[i]
          })
          flag ? this.scrollTo(i, temp) : this.pickerSelectedIndex[i] = temp
        }
        !flag ? this.addWeek(time.substring(0,4), time.substring(5,7), false) : ''
      },
      //阻止父元素滚动
      mouseWheel(){
        this.$refs.scrollThis.addEventListener('mousewheel',this.stopScroll);
        this.$refs.scrollThis.addEventListener('wheel',this.stopScroll);
        this.$refs.scrollThis.addEventListener('DOMMouseScroll',this.stopScroll);
      },
      stopScroll(event){
        var event = event || window.event, delta;
        event.preventDefault();
        if(!this.lock_scroll) {
          this.lock_scroll = true;
          let self = this;
          setTimeout(()=>{
            self.lock_scroll = false
          },100)
          //兼容浏览器的鼠标滚动
          if (event.deltaY) {
            delta = event.deltaY
          } else if (event.wheelDelta) {
            delta = -e.wheelDelta / 120
          } else if (event.detail) {
            delta = event.detail
          }
          //获取当前选中的索引值赋给scrollRecord（因为可能用鼠标拖动）
          for (let i = 0; i < this.pickerData.length; i++) {
            let index = this.wheels[i].getSelectedIndex()
            this.scrollRecord[i] = index
          }
          let currIndex = 0, evenLength = document.documentElement.clientWidth / this.scrollRecord.length;
          for (let j = 0; j < this.scrollRecord.length; j++) {
            if (event.clientX <= evenLength * (j + 1)) {
              currIndex = j;
              j = this.scrollRecord.length
            }
          }
          if (delta > 0 && this.scrollRecord[currIndex] + 1 < this.pickerData[currIndex].length) {
            this.scrollTo(currIndex, this.scrollRecord[currIndex] + 1)
          } else if (delta < 0 && this.scrollRecord[currIndex] - 1 >= 0) {
            this.scrollTo(currIndex, this.scrollRecord[currIndex] - 1)
          }
        }
      },
      confirm() {
        if (!this._canConfirm()) {
          return
        }
        this.hide()

        let changed = false
        for (let i = 0; i < this.pickerData.length; i++) {
          let index = this.wheels[i].getSelectedIndex()       // 获取当前选中的索引值
          this.pickerSelectedIndex[i] = index

          let value = null
          if (this.pickerData[i].length) {
            value = this.pickerData[i][index].value
          }
          if (this.pickerSelectedVal[i] !== value) {
            changed = true
          }
          this.pickerSelectedText[i] = this.pickerData[i][index].text
        }

        this.$emit(EVENT_SELECT,this.pickerSelectedText)
        this.setToday(false, this.initDate)

        if (changed) {
          this.$emit(EVENT_VALUE_CHANGE, this.pickerSelectedVal, this.pickerSelectedIndex, this.pickerSelectedText)
        }
      },
      cancel() {
        this.hide()
        this.$emit(EVENT_CANCEL)
      },
      show() {
        this.scrollRecord = [];
        this.scrollRecord = this.pickerSelectedIndex.slice(0);      //赋值给scrollRecord
        if (this.state === STATE_SHOW) {
          return
        }
        this.state = STATE_SHOW

        if (!this.wheels || this.dirty) {       // 如果没有渲染过
          this.$nextTick(() => {
            this.wheels = []
            let wheelWrapper = this.$refs.wheelWrapper              // 获取滚动的元素
            for (let i = 0; i < this.pickerData.length; i++) {      // 渲染滚动的列
              this._createWheel(wheelWrapper, i)
            }
            this.dirty = false
            // 初始化周
            this.addWeek(this.pickerData[0][this.wheels[0].getSelectedIndex()].text,
              this.pickerData[1][this.wheels[1].getSelectedIndex()].text, true)
          })
        } else {    // 如果渲染过，则直接启用better-scroll
          for (let i = 0; i < this.pickerData.length; i++) {
            this.wheels[i].enable()
            this.wheels[i].wheelTo(this.pickerSelectedIndex[i])
          }
          this.addWeek(this.pickerData[0][this.wheels[0].getSelectedIndex()].text,
            this.pickerData[1][this.wheels[1].getSelectedIndex()].text, true)
        }
      },
      hide() {
        this.state = STATE_HIDE
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].disable()        // 禁用 better-scroll
        }
      },
      setData(data) {
        this.pickerData = data.slice()
        this.dirty = true
      },
      refillColumn(index) {
        if (this.state !== STATE_SHOW) {
          console.error('can not use refillColumn when picker is not show')
          return
        }
        const wheelWrapper = this.$refs.wheelWrapper
        let scroll = wheelWrapper.children[index].querySelector('.wheel-scroll')
        let wheel = this.wheels[index]
        if (scroll && wheel) {
          this.$nextTick(() => {
            // recreate wheel so that the wrapperHeight will be correct.
            wheel = this._createWheel(wheelWrapper, index)
          })
        }
      },
      scrollTo(index, dist) {
        const wheel = this.wheels[index]
        this.scrollRecord[index] = dist
        wheel.wheelTo(dist)
        if(index == 0 || index == 1) {
          this.addWeek(this.pickerData[0][this.wheels[0].getSelectedIndex()].text,
            this.pickerData[1][this.wheels[1].getSelectedIndex()].text, true)
        }
      },
      refresh() {
        this.$nextTick(() => {
          this.wheels.forEach((wheel, index) => {
            wheel.refresh()
          })
        })
      },
      _createWheel(wheelWrapper, i) {
        if (!this.wheels[i]) {
          this.wheels[i] = new BScroll(wheelWrapper.children[i], {
            wheel: {
              selectedIndex: this.pickerSelectedIndex[i],
              /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item',
            },
            probeType: 3,     // 滚动的位置
            disablePointer: true, // important to disable the pointer events that causes the issues
            disableTouch: false, // false if you want the slider to be usable with touch devices
            disableMouse: false // false if you want the slider to be usable with a mouse (desktop)
          })

          // 添加滚动监听事件
          this.wheels[i].on('scrollEnd', () => {
            if(i == 0 || i == 1) {
              this.addWeek(this.pickerData[0][this.wheels[0].getSelectedIndex()].text,
                this.pickerData[1][this.wheels[1].getSelectedIndex()].text, true)
            }
          });
        } else {
          this.wheels[i].refresh()
        }

        return this.wheels[i]
      },
      _canConfirm() {
        return this.wheels.every((wheel) => {
          return !wheel.isInTransition
        })
      }
    },
  }
</script>

<style src="./picker.scss" lang="scss">
</style>
