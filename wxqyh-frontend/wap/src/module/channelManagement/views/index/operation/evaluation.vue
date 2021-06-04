<!-- 综合评分-->
<template>
  <div class="evaluate">
    <!-- 
    <qw-tab-bar v-model="selected"
      :data="tabs"
      @change="handleChange"
      :scrollable="false">
    </qw-tab-bar> -->

    <div class="list">
      <div class="list__item"
        @click="handleClicklist(item)"
        v-for="(item, index) in evaluates"
        :key="index">
        <div class="list__info">
          <h4 class="list__name">{{item.year}}年第{{item.quarter}}季度星级评估</h4>
          <p class="list__data">
            <span>得分：{{item.score||'-'}}</span>
            <span>星级：{{item.starLevel||'-'}}</span>
            <span>排名：{{item.rankNo||'-'}}</span>
          </p>
        </div>
        <div class="list__arrow">
          <img :src="iconArrowRight"
            alt="">
        </div>
      </div>

      <noData style="paddingTop: 20vh" :visible="!isLoading &&!evaluates.length" />
    </div>
  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getOperationEvaluationInfoList } from '@/module/channelManagement/api/operation'
import { mapMutations } from 'vuex'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    return {
      iconArrowRight,
      selected: 1,
      tabs: [
        {
          value: 1,
          label: '售前'
        },
        {
          value: 2,
          label: '售后'
        }
      ],
      evaluates: [],
      isLoading: false,
    }
  },
  methods: {
    ...mapMutations('evaluationDetail', ['setEvaluationDetail']),

    handleClicklist(item) {
      this.setEvaluationDetail(item)
      this.$router.push({
        name: 'evaluationDetail',
        query: this.$route.query
      })
    },
    handleChange() {}
  },
  created() {
    const dealerId = this.$route.query.dealerId
    if (!dealerId) {
      this.reloadApp()
      return
    }
    this.isLoading = true;
    getOperationEvaluationInfoList({ dealerId }).then(data => {
      if (data) {
        this.evaluates = data.voList
      }
    }).finally((data)=>{
      this.isLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.evaluate {
  padding-bottom: 50px;
  .list__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 16px 15px 18px;
  }
  .list__name {
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list__data {
    margin-top: 5px;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
    & > span {
      display: inline-block;
      width: 86px;
      margin-right: 10px;
    }
  }
  .list__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }
}
</style>
</style>