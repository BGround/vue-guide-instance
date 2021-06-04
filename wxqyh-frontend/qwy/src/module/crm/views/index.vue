<template>
  <div>
    <div class="main_wrap">
      <div class="container">
        <div class="left_side">
          <ul class="side_menu">
            <li v-perm="'crmMenu'"
                :class="{active:activeArr[0]}"
                @click="goDetail('crm')"
                v-if="trustApp['crm'] && trustApp['crm']['isTrust']"
                class="menu_item">移动CRM</li>
            <!-- <router-link v-perm="'crmMenu'"
                :to="{name: 'crm'}"
                active-class="active"
                class="menu_item"
                replace>移动CRM</router-link> -->
            <li v-perm="'contractList'"
                :class="{active:activeArr[1]}"
                @click="goDetail('contract')"
                v-if="trustApp['contract'] && trustApp['contract']['isTrust']"
                class="menu_item">合同管理</li>
            <li v-perm="'outworkMenu'"
                :class="{active:activeArr[2]}"
                @click="goDetail('outsidework')"
                v-if="trustApp['outsidework'] && trustApp['outsidework']['isTrust']"
                class="menu_item">移动外勤</li>
            <li v-perm="'saleMenu'"
                :class="{active:activeArr[3]}"
                @click="goDetail('sale')"
                v-if="trustApp['sale'] && trustApp['sale']['isTrust']"
                class="menu_item">快消管理</li>

            <router-link :to="{name: 'assistant'}"
                         active-class="active"
                         class="menu_item"
                         replace>企微云小站</router-link>
          </ul>
        </div>
        <div class="right_side">
          <router-view></router-view>
        </div>
      </div>
      <div class="bged pt25">
        <qwFooter></qwFooter>
      </div>
    </div>
  </div>
</template>
<script>
import qwFooter from "@/components/base/footer";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      baseURL: _.baseURL,
      activeArr: [false, false, false, false]
    };
  },
  components: {
    qwFooter
  },
  computed: {
    ...mapGetters("header", ["trustApp", "permission"])
  },
  watch: {
    trustApp: function(newVal, oldVal) {
      this.changeActive(newVal);
    },
    $route(val) {
      // if (val.path.includes("crm")) {
      //   this.activeArr = [true, false, false, false];
      // } else if (val.path.includes("mini")) {
      //   this.activeArr = [false, false, false, false];
      // }
      this.changeActive();
    }
  },
  created() {
    // //判断当前展示内容是否为企微云小站,不是则去掉左侧导航的高亮
    // if (this.$route.meta.module != "assistant") {
    //   sessionStorage.removeItem("leftTabFixed");
    // }
    //处理左侧导航条正确高亮
    // if (
    //   this.$route.query.tabFlag ||
    //   JSON.parse(sessionStorage.getItem("leftTabFixed"))
    // ) {
    //   this.activeArr = [false, false, false, false];
    // }
  },

  methods: {
    // 跳转页面
    goDetail(agentCode) {
      let baseURL = this.baseURL;
      if(agentCode == 'crm' && this.permission['poolClientList']){
        window.location.href = `${baseURL}/vm/module/crm.html#/crm/territorialSea/list`;
      }else{
        window.location.href = `${baseURL}/manager/sales/main.jsp?agentCode=${agentCode}`;
      }
    },

    // 改变选择tab状态
    changeActive(data) {
      this.activeArr = [false, false, false, false];

      // if (data["crm"]["isTrust"]) {
      //   this.activeArr[0] = true;
      // } else if (!data["crm"]["isTrust"] && data["contract"]["isTrust"]) {
      //   this.activeArr[1] = true;
      // } else if (
      //   !data["contract"]["isTrust"] &&
      //   data["outsidework"]["isTrust"]
      // ) {
      //   this.activeArr[2] = true;
      // } else if (!data["outsidework"]["isTrust"] && data["sale"]["isTrust"]) {
      //   this.activeArr[3] = true;
      // }

      // //处理左侧导航条正确高亮
      if (this.$route.path.includes("crm")) {
        this.activeArr = [true, false, false, false];
      } else if (this.$route.path.includes("mini")) {
        this.activeArr = [false, false, false, false];
      }
    },
    goAssistant() {
      this.activeArr = [false, false, false, false];
      this.$router.push({ name: "assistantGuide" });
    }
  },
  mounted() {
    // 动态渲染内容高度
    let windowHeight = document.documentElement.clientHeight;
    let mainHeight = windowHeight - 90 - 58;
    document.querySelector(".main_wrap").style.minHeight = `${mainHeight}px`;
    this.changeActive(this.trustApp);
  }
};
</script>
<style scoped>
.pt25 {
  padding-top: 25px;
}
.main_wrap {
  padding-top: 25px;
  width: 100%;
  background: #ededed;
  box-sizing: border-box;
}
.bged {
  background: #ededed;
}
.container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 430px;
  border: 1px solid #d9dadc;
  background: #fbfbfb;
}
.container .left_side {
  padding: 30px 0 40px;
  width: 200px;
  min-height: 679px;
  border-right: 1px solid #d9dadc;
  background: #f6f6f6;
}
.side_menu .menu_item {
  height: 32px;
  line-height: 32px;
  color: #676666;
  text-indent: 22px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  box-sizing: border-box;
  cursor: pointer;
  background: url(~assets/images/arrow1.png) no-repeat 90% center;
  width: 100%;
  display: inline-block;
}
.side_menu .menu_item:hover {
  color: #676666;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  background: #fff;
}
.side_menu .active,
.side_menu .active:hover {
  color: #fff;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  background: url(~assets/images/arrow2.png) no-repeat 90% center #C31725;
}
.right_side {
  /* padding: 10px 30px 0;
  width: 80%;
  position: relative; */
}
</style>


