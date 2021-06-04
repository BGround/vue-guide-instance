<template>
  <div class="selector">
    <div class="selector_container">
      <div class="selector_wrap qwui-border_bottom">
        <div class="selector_item"
             @click="toggleShowFilter('time')">
          <div class="selector_content">
            <span>{{selectTime.name}}</span>
            <i class="arrow"
               :class="{arrow_up: selectTime.show}"></i>
          </div>
        </div>
        <div class="selector_item"
             @click="toggleShowFilter('type')">
          <div class="selector_content">
            <span>{{selectType.name}}</span>
            <i v-if = "chooseType"
                class="arrow"
               :class="{arrow_up: selectType.show}"></i>
          </div>
        </div>
        <div class="selector_item"
             @click="toggleShowFilter('team')">
          <div class="selector_content">
            <span class="text">{{selectTeam.name}}</span>
            <i v-if="selectTeam.name"
               class="arrow"
               :class="{arrow_up: selectTeam.show}"></i>
          </div>
        </div>
      </div>
      <div v-if="showFilter"
           class="selector_filter">
        <ul class="selector_list">
          <li class="list_item"
              v-for="(filter,index) in filters"
              :key="index"
              :class="{'active':filter.selected,'qwui-border_bottom': index != filters.length-1}"
              @click="handleClickFilter(filter.type, index)"><span class="text">{{filter.name}}</span></li>
        </ul>
      </div>
    </div>
    <div class="mask"
         v-show="showFilter"
         @click="closeFilter"></div>
  </div>
</template>

<script>
const TIME_OPTION = [
  { type: 'week', name: '本周' },
  { type: 'month', name: '本月' },
  { type: 'season', name: '本季' },
  { type: 'year', name: '今年' },
  { type: 'lastWeek', name: '上周' },
  { type: 'lastMonth', name: '上月' },
  { type: 'lastSeason', name: '上季' }
]
const TYPE_OPTION = [
  { type: 'team', name: '团队' },
  { type: 'personal', name: '个人' }
]

export default {
  name: 'headerSelector',
  props: {
    option: {
      type: Array,
      default: []
    },
    selectOptions: {
      type: Object,
      default: {
        time: 'week',
        type: 'personal'
      }
    },
    chooseType: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectTime: {},
      selectType: {},
      selectTeam: {},
      filters: [],
      showFilter: false,
      timeOption: [],
      typeOption: [],
      teamOption: [],
      selectTeamIndex: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化配置
    init() {
      // 时间、类型、团队可选列表
      this.timeOption = JSON.parse(JSON.stringify(TIME_OPTION))
      this.typeOption = JSON.parse(JSON.stringify(TYPE_OPTION))
      this.teamOption = JSON.parse(JSON.stringify(this.option).replace(/teamName/g, 'name').replace(/id/g, 'type'))

      // 设为选中的选项，show表示是否打开选项设置，设置选中的样式
      this.timeOption.forEach(item => {
        item.selected = false
        if (item.type === this.selectOptions.time) {
          this.selectTime = item
          this.$set(this.selectTime, 'show', false)
          item.selected = true
        }
      })

      this.typeOption.forEach(item => {
        item.selected = false
        if (item.type === this.selectOptions.type) {
          this.selectType = item
          this.$set(this.selectType, 'show', false)
          item.selected = true
        }
      })

      if (this.selectType.type === 'personal') {
        this.$set(this.selectTeam, 'show', false)
        this.teamOption.forEach(item => {
          this.$set(item, 'selected', false)
        })

      } else {
        this.teamOption.forEach((item, index) => {
          item.selected = false
          if (item.type === this.selectOptions.team) {
            //this.selectTeam = JSON.parse(JSON.stringify(item))
            this.selectTeam = item
            this.$set(this.selectTeam, 'show', false)
            item.selected = true
            this.selectTeamIndex = index
          }
        })
      }

      this.timeOption = this.timeOption.slice()
      this.typeOption = this.typeOption.slice()
      this.teamOption = this.teamOption.slice()
    },
    // 点击选择器时的显示逻辑
    toggleShowFilter(type) {
      if (type === 'time') {
        this.showFilter = !this.selectTime.show
        this.filters = this.timeOption
        this.selectTime.show = !this.selectTime.show

        if (this.selectTime.show) {
          this.selectType.show = false
          this.selectTeam.show = false
        }
      }

      if (type === 'type') {
        if(!this.chooseType){
          return;
        }
        this.showFilter = !this.selectType.show
        this.filters = this.typeOption
        this.selectType.show = !this.selectType.show

        if (this.selectType.show) {
          this.selectTime.show = false
          this.selectTeam.show = false
        }
      }

      if (type === 'team') {
        if(this.selectType.type === 'personal'){
          return;
        }
        this.showFilter = !this.selectTeam.show
        this.filters = this.teamOption
        this.selectTeam.show = !this.selectTeam.show

        if (this.selectTeam.show) {
          this.selectTime.show = false
          this.selectType.show = false
        }
      }
    },
    // 点击选择器时的逻辑
    handleClickFilter(type, index) {
      // 选择的是时间选择器
      if (this.selectTime.show) {
        this._normalizeSelect('selectTime', type)
      }

      // 选择的是类型选择器
      if (this.selectType.show) {
        this._normalizeSelect('selectType', type)

        // 当选择的是团队时，需要把隐藏掉得组别选择器显示回来
        if (this.selectType.type === 'team') {
          this.selectTeamIndex = this.selectTeamIndex ? this.selectTeamIndex : 0
          this.selectTeam.name = this.option[this.selectTeamIndex].teamName
          this.selectTeam.type = this.option[this.selectTeamIndex].id

           this.teamOption[this.selectTeamIndex].selected = true;
        }

        // 当选择的是个人时，需要隐藏掉组别选择器
        if (this.selectType.type === 'personal') {

          this.selectTeam.name = ''
          this.selectTeam.type = ''
        }
      }

      // 选择的时队别选择器
      if (this.selectTeam.show) {
        this._normalizeSelect('selectTeam', type)
        this.selectTeamIndex = index
      }

      const data = {
        time: this.selectTime.type,
        type: this.selectType.type,
        team: this.selectTeam.type,
      }

      this.$emit('selectChange', data)
      this.showFilter = false
    },
    // 格式化选择数据
    _normalizeSelect(selectType, type) {
      this.filters.forEach(item => {
        if (item.type === type) {
          item.selected = true
          this[selectType] = item
        } else {
          item.selected = false
        }
      })

      this[selectType].show = false
    },
    //关闭选项
    closeFilter() {
      this.showFilter = false;
      this.selectTime.show = false;
      this.selectType.show = false;
      this.selectTeam.show = false;
    }
  }
}
</script>

<style lang="scss">
.selector {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9;
  height: 45px;
  width: 100%;
  .selector_container {
    position: relative;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 45px;
    background-color: #fff;
    .selector_wrap {
      display: flex;
      height: 100%;
      .selector_item {
        flex: 1;
        text-align: center;
        cursor: pointer;
        .selector_content {
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #333;
          .text{
            max-width: 82px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
          }
        }
        .arrow {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-image: url('../../../../../../assets/images/icon_down_gray.png');
          background-repeat: no-repeat;
          background-size: 12px 10px;
          background-position-y: center;
          margin-left: 4px;
        }
        ::after{
          content: normal;
        }
        .arrow_up {
          transform: rotate(180deg);
        }
      }
    }
    .selector_filter {
      max-height: 220px;
      background-color: #fff;
      overflow: auto;
      .selector_list {
        background-color: #fff;
        padding-left: 18px;
        .list_item {
          position: relative;
          display: flex;
          align-items: center;
          height: 42px;
          color: #333;
          font-size: 14px;
          cursor: pointer;
          .text{
              display: inline-block;
              width: 85%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
          }
        }
        .active {
          color: #467db9;
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            right: 20px;
            margin-top: -4px;
            width: 13px;
            height: 9px;
            background-image: url('../../../../../../assets/images/ic_right.png');
            background-size: 13px 9px;
          }
        }
      }
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    background: rgba(37, 38, 45, 0.4);
  }
}
</style>
