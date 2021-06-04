<template>
    <div class="dataManager">
        <select-card
            :selectdata="selectData"
            @listenTabChange="showMsgFromSelectCard"
            :userStyle="styleData"></select-card>
        <router-view></router-view>
    </div>
</template>

<script>
import selectCard from "../base/MenuTab";
export default {
  name: "dataManager",
  components: {
    selectCard
  },
  data() {
    return {
      styleData: {
        height: 44,
        fixed: true
      },
      selectData: {
        index: 0,
        nav: [
          { content: "明细数据", data: { name: "detailData" } },
          { content: "统计报表", data: { name: "dataReport" } }
        ]
      }
    };
  },
  methods: {
    showMsgFromSelectCard(data) {
      this.$router.push({
        name: data.data.name,
        query: {
          id: this.$route.query.id,
          isTask: this.$route.query.isTask
        },
        title: this.formName
      });
    }
  },
  watch: {
    $route: {
      handler(router) {
        switch (router.name) {
          case "detailData":
            this.selectData.index = 0;
            break;
          case "dataReport":
            this.selectData.index = 1;
            break;
        }
      },
      immediate: true
    }
  }
};
</script>

