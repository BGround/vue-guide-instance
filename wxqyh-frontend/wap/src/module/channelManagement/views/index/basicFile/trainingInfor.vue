<!-- 培训信息  -->
<template>
  <div class="training-info">

    <div class="header">
      <div class="select"
        @click="handleClickDateSelect">
        <span class="select__value">{{year}}</span>
        <i class="select__icon"><img :src="iconSelectArrow"
            alt=""></i>
      </div>
      <div class="select"
        @click="handleClickPostBtn">
        <span class="select__value">{{typeName || '全部岗位'}}</span>
        <i class="select__icon"><img :src="iconSelectArrow"
            alt=""></i>
      </div>
    </div>

    <!-- <div class="gutter"></div> -->

    <div class="section section--basic">

      <div class="section__content">
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{productTraining||'0'}}</p>
              <p class="cell__label">产品培训</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{levelTraining||'0'}}</p>
              <p class="cell__label">等级认证</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{postTraining||'0'}}</p>
              <p class="cell__label">岗位培训</p>
            </div>
          </div>
        </div>
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{keyPosition||'0'}}</p>
              <p class="cell__label">关键岗位</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{businessPosition||'0'}}</p>
              <p class="cell__label">业务岗位</p>
            </div>
          </div>
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{specialTraining||'0'}}</p>
              <p class="cell__label">专项培训</p>
            </div>
          </div>
        </div>
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__value">{{certification||'0'}}</p>
              <p class="cell__label">认证岗位</p>
            </div>
          </div>
          <div class="section__col">

          </div>
          <div class="section__col">

          </div>
        </div>
      </div>
    </div>

    <div class="gutter">

    </div>

    <div class="section section--training">
      <h4 class="section__hrader">岗位培训信息</h4>
      <div class="section__content">
        <div class="training"
          v-for="(item, index) in courses"
          :key="index">
          <div class="training__title">
            <p class="training__name">{{item.title}}</p>
            <i class="training__icon"
              @click="handleClickTrainingIcon(index)"
              :class="{'is-open': isOpen(item.isOpen)}"><img :src="iconArrowDown"
                alt=""></i>
          </div>
          <div class="training__date">
            {{item.start}} 至 {{item.end}}
          </div>
          <ul class="training__list"
            v-show="isOpen(item.isOpen)">
            <li v-for="(member,mIndex) in item.memberList"
              :key="mIndex"
              class="training__list-item">
              <span>{{member.trainingUser}}</span>
              <span>{{member.postName}}</span>
              <span>{{member.qualifiedSituation}}</span>
            </li>
          </ul>
        </div>

        <div v-if="courses.length == 0"
          class="no-course">
          暂无课程信息
        </div>
      </div>

    </div>

    <qw-date-picker v-model="isVisibleDateSelect"
      :current="current"
      :column-count="1"
      @select="handleSelectDate">
    </qw-date-picker>

  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import iconSelectArrow from '@/module/channelManagement/static/images/icon_select_arrow.png'
import {
  getUserTrainingList,
  getUserTraining
} from '@/module/channelManagement/api/basic' 
export default {
  data() {
    const d = new Date()
    return {
      iconArrowDown,
      iconSelectArrow,
      isVisibleDateSelect: false,
      status: false,
      current: d,
      dealerId: '',
      year: d.getFullYear(),
      productTraining: '',
      levelTraining: '',
      postTraining: '',
      keyPosition: '',
      businessPosition: '',
      specialTraining: '',
      certification: '',
      courses: [],
      typeName: '',
      postOptions: [
        {
          value: '',
          label: '全部岗位'
        },
        {
          value: '业务岗位',
          label: '业务岗位'
        },
        {
          value: '关键岗位',
          label: '关键岗位'
        },
        {
          value: '认证岗位',
          label: '认证岗位'
        }
      ]
    }
  },
  methods: {
    isOpen(status) {
      return status
    },
    handleClickTrainingIcon(index) {
      this.courses[index].isOpen = !this.courses[index].isOpen
    },
    handleClickDateSelect() {
      this.isVisibleDateSelect = true
    },
    handleSelectDate(_, [year]) {
      this.year = year
      this.fetchTainingInfo()
      this.fetchTainingList()
    },

    handleClickPostBtn() {
      this.$actionsheet({ options: this.postOptions })
        .then(({ action, item }) => {
          this.typeName = item.value
          this.fetchTainingList()
        })
        .catch(() => {})
    },

    /**
     * 培訓列表
     */
    fetchTainingList() {
      const params = {
        year: this.year,
        dealerId: this.dealerId,
        typeName: this.typeName
      }
      getUserTrainingList(params).then(data => {
        if (data) {
          const list = data.statistics || []
          this.courses = list.map(item => {
            return Object.assign(item, { isOpen: false })
          })
        }
      })
    },

    /**
     * 培訓信息
     */
    fetchTainingInfo() {
      const params = {
        year: this.year,
        dealerId: this.dealerId
      }
      getUserTraining(params).then(data => {
        if (data) {
          this.productTraining = data.chanpin
          this.levelTraining = data.dengji
          this.postTraining = data.gangwei
          this.keyPosition = data.guanjian
          this.businessPosition = data.yewu
          this.specialTraining = data.zhuanxiang
          this.certification = data.renzheng
        }
      })
    },

    init() {
      this.fetchTainingInfo()
      this.fetchTainingList()
    },

    reloadApp() {
      this.$toast('参数错误')
      const id = window.setTimeout(() => {
        window.clearTimeout(id)
        window.location.href = window.location.pathname
      }, 1500)
    }
  },
  created() {
    this.dealerId = this.$route.query.dealerId
    if (!this.dealerId) {
      this.reloadApp()
      return
    }
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.training-info {
  padding-bottom: 50px;

  .header {
    display: flex;
    justify-content: flex-start;
    background: #ffffff;
    
    padding: 17px 15px 2px;
    align-items: center;
    & > .select {
      margin-right: 20px;
      text-align: center;
    }
  }

  .section {
    padding: 17px 0 15px;
    background: #ffffff;
  }

  .section--basic {
    padding-left: 15px;
    padding-right: 15px;
  }


  .select__value {
    height: 21px;
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    color: rgba(0, 0, 0, 1);
  }

  .select__icon {
    display: inline-block;
    width: 9px;
    height: 6px;
    margin-left: 6px;
    vertical-align: top;
    & > img {
      width: 100%;
    }
  }

  .section__row {
    display: flex;
    margin-bottom: 15px;
  }

  .section__col {
    margin-right: 15px;
    width: 100%;
    &:last-child {
      margin-right: 0;
    }
  }

  .cell {
    background: rgba(247, 248, 250, 1);
    padding: 12px 8px 12px 18px;
  }

  .cell__value {
    height: 21px;
    font-size: 15px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(10, 23, 53, 1);
  }

  .cell__label {
    margin-top: 2px;
    height: 19px;
    font-size: 13px;
    font-weight: 500;
    line-height: 24px;
    color: rgba(178, 185, 200, 1);
  }

  .section__hrader {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    margin-bottom: 14px;
  }

  .section--training {
    .training__title,
    .training__date,
    .section__hrader {
      padding-left: 15px;
      padding-right: 15px;
    }
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .training {
    position: relative;
    margin-bottom: 15px;
  }

  .training__title {
    justify-content: space-between;
    display: flex;
    align-items: center;
  }

  .training__name {
    height: 24px;
    font-size: 17px;
    font-weight: bold;
    line-height: 24px;
    width: calc(100% - 30px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .training__icon {
    width: 11px;
    height: 7px;
    display: block;
    transition: transform 0.4s ease;
    & > img {
      width: 100%;
      vertical-align: top;
    }
  }

  .training__icon.is-open {
    transform: rotateZ(180deg);
  }

  .training__date {
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
    height: 21px;
    margin-top: 10px;
    color: rgba(153, 153, 153, 1);
    padding-bottom: 14px;
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 15px;
      right: 15px;
      height: 1px;
      background: #dbdbdb;
      transform: scaleY(0.5);
      bottom: 0;
    }
  }

  .training__list {
    padding-bottom: 15px;
    position: relative;
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      height: 1px;
      left: 15px;
      right: 15px;
      background: #dbdbdb;
      transform: scaleY(0.5);
    }
  }

  .training__list-item {
    display: flex;
    width: 100%;
    align-items: center;
    height: 30px;
    &:nth-child(2n + 2) {
      background: #f7f7f7;
    }
    & > span {
      width: 33.3%;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      line-height: 24px;
      color: #b2b9c8;
    }
  }

  .no-course {
    text-align: center;
    color: #ccc;
    padding: 15px;
  }
}
</style>