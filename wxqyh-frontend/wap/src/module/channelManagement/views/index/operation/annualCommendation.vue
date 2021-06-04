<!-- 利润情况-->
<template>
  <div class="annual-commendation">
    <div class="card" v-for="(item, index) in list" :key="index">
      <div class="card__header">
        <span class="card__title">{{item.year}}年{{item.awardsName}}</span>
        <i
          class="card__icon"
          @click="handleClickDetailIcon(index)"
          :class="{'is-open': item.isOpen}"
        >
          <img :src="iconArrowRight" alt />
        </i>
      </div>
      <div class="card__body" v-if="item.isOpen">
        <div class="card__content">
          <p>{{item.content}}</p>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>

    <noData style="paddingTop: 20vh" :visible="!list.length"></noData>
  </div>
</template>

<script>
import iconArrowRight from "@/module/channelManagement/static/images/icon_arrow_right.png";
import reloadApp from "@/module/channelManagement/mixins/reloadApp";
import { getAnnualRecognitionVOList } from "@/module/channelManagement/api/operation";
import noData from "@/module/channelManagement/components/noData";

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    return {
      iconArrowRight,
      status: true,
      list: []
      // year:'', //年度',
      // dealer_id:'', //经销商ID',
      // content:'', //表彰内容',
      // name:'', //受表彰人姓名',
      // card_no:'', //身份证号',
      // create_user:'', //创建人',
      // create_time:'', //创建时间',
      // modify_user:'', //修改人',
      // modify_time:'', //修改时间',
    };
  },

  created() {
    const dealerId = this.$route.query.dealerId;
    if (!dealerId) {
      this.reloadApp();
      return;
    }
    getAnnualRecognitionVOList({ dealerId }).then(data => {
      if (data && Array.isArray(data.annualRecognitionVOList)) {
        this.list = data.annualRecognitionVOList.map(item => {
          return Object.assign(item, { isOpen: true });
        });
      }
    });
  },

  methods: {
    isOpen(status) {
      return this.status;
    },
    handleClickDetailIcon(index) {
      this.list[index].isOpen = !this.list[index].isOpen;
    }
  }
};
</script>

<style lang="scss" scoped>
.annual-commendation {
  padding-bottom: 50px;
  min-height: calc(100vh - 100px);
  background: #f5f5f5;

  .card {
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 8px;
      background: #f5f5f5;
    }
  }

  .card__header {
    justify-content: space-between;
    display: flex;
    align-items: center;
  }

  .card__body {
    position: relative;
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 15px;
      right: 15px;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .card {
    background: #ffffff;
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .card__header {
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .card__body {
    padding: 0 15px;
  }

  .card__title {
    height: 24px;
    font-size: 17px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    width: calc(100% - 30px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card__content {
    padding: 15px 0;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
  }

  .card__icon {
    width: 7px;
    height: 11px;
    display: block;
    transition: transform 0.2s ease;
    & > img {
      width: 100%;
      vertical-align: top;
    }
  }

  .card__icon.is-open {
    transform: rotateZ(-90deg);
  }
}
</style>