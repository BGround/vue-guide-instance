<template>
  <div class="investors">

    <div class="investor" v-if="investors.length">
      <div class="investor__item"
        v-for="(item, index) in investors"
        :key="index">
        <div class="investor__info">
          <span class="investor__name">{{item.name}}</span>
          <span class="investor__proportion">{{item.proportion}}</span>
        </div>
        <div class="investor__arrow"
          @click="handleClickinvestor(item)">
          <img :src="iconArrowRight"
            alt="">
        </div>
      </div>
    </div>
     <noData :style="{paddingTop: '20vh'}" v-if="!isLoading && !investors.length"></noData>
  </div>
</template>

<script>

import {mapMutations} from 'vuex';
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import { findByInvestment } from '@/module/channelManagement/api/networkInfo/index'
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: {noData},
  data() {
    return {
      iconArrowRight,
      investors: [],
      isLoading: false,
    }
  },
  methods: {

    ...mapMutations('investorDetail', ['setInvestorDetail']),

    handleClickinvestor(item) {
      this.setInvestorDetail(item);
      this.$router.push({ name: 'investorDetail', query: this.$route.query});
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    this.isLoading = true;
    findByInvestment({ id: dealerId }).then(data => {
      if (data) {
        this.investors = data.po
      }
    }).finally(()=>{
      this.isLoading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.investor {
  margin-top: 17px;
  padding-bottom: 50px;
}
.investor__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30;
  margin: 10px 0;
  background: rgba(255, 255, 255, 1);
  padding: 15px 16px 15px 18px;
  border-left: 5px solid #c6001f;
}
.investor__name {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  color: rgba(68, 68, 68, 1);
}
.investor__proportion {
  margin-top: 5px;
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30px;
  color: rgba(153, 153, 153, 1);
}
.investor__arrow {
  width: 7px;
  height: 11px;
  flex-shrink: 0;
  margin-left: 5px;
  & > img {
    width: 100%;
  }
}
</style>