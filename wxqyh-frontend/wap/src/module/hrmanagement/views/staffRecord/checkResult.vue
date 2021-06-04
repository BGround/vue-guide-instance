<template>
  <div id="checkResult" class="wrap">
    <div class="qwui-count_bar_statis">
      <div class="qwui-text_title">{{barData.name}}</div>
      <div
        class="qwui-date"
      >时间：{{ barData.startTime | formatDate}} 至 {{ barData.endTime | formatDate}}</div>
    </div>
    <div class="qwui-complete_warp" @click="goPersonList('')">
      <span class="qwui-complete_text">完成评分人数</span>
      <span class="qwui-complete_num">
        <i class="resultTarget">{{barData.resultTarget}}</i>
        /{{barData.allTarget}}
      </span>
    </div>
    <div class="qwui-address_list" v-if="addressList.length">
      <ul>
        <li
          class="qwui-list_item"
          v-for="(item, i) in addressList"
          :key="i"
          @click="goPersonList(item.name)"
        >
          <span class="qwui-serial_number">{{item.name}}</span>
          <span class="qwui-number">{{item.number}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getResultList } from "../../api/getData";
export default {
  name: "checkResult",
  data() {
    return {
      params: {
        markId: "",
        tempId: ""
      },
      barData: {
        startTime: "",
        endTime: ""
      },
      addressList: []
    };
  },
  created() {
    this.params.markId = this.$route.query.markId;
    this.params.tempId = this.$route.query.tempId;
    this.getResultList();
  },
  methods: {
    getResultList() {
      getResultList(this.params, data => {
        if (data.resultVO) {
          this.barData = data.resultVO;
        }
        if (data.ruleList) {
          this.addressList = data.ruleList;
        }
      });
    },
    goPersonList(degree) {
      this.$router.push({
        path: "checkPersonList",
        query: {
          markId: this.params.markId,
          tempId: this.params.tempId,
          degree: degree
        }
      });
    }
  },
  filters: {
    formatDate(time) {
      if(time == null || time == undefined || time == '') return '-'
      return time.substring(5, 16);
    }
  }
};
</script>
<style lang="scss" scoped>
#checkResult {
  background-color: #f5f5f5;
  height: 100%;
  .qwui-count_bar_statis {
    min-height: 100px;
    text-align: center;
    background: #5077aa;
    .qwui-text_title {
      padding-top: 21px;
      margin-bottom: 10px;
      font-size: 20px;
      color: #fff;
    }
    .qwui-date {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }
  }
  .qwui-complete_warp {
    padding: 25px 15px;
    overflow: hidden;
    margin-bottom: 15px;
    background-color: #fff;
    line-height: 20px;
    .qwui-complete_text {
      font-size: 16px;
      color: #333;
    }
    .qwui-complete_num {
      font-size: 20px;
      float: right;
      .resultTarget {
        color: #467db9;
      }
    }
  }
  .qwui-address_list {
    line-height: 2.2;
    font-size: 16px;
    overflow: hidden;
    background-color: #fff;
    .qwui-list_item {
      padding: 10px 15px;
      line-height: 1.5;
      border-bottom: 1px solid #dfdfdd;
      &:last-child {
        border-bottom: none;
      }
      .qwui-number {
        position: relative;
        margin-right: 20px;
        float: right;
        &::after {
          content: " ";
          position: absolute;
          top: 50%;
          right: -20px;
          display: inline-block;
          height: 6px;
          width: 6px;
          margin-top: -4px;
          border-width: 2px 2px 0 0;
          border-style: solid;
          transform: rotate(45deg);
          border-color: #c8c8cd;
        }
      }
    }
  }
}
</style>