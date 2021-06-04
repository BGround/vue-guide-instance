<template>
    <div class="crm_box">
        <div class="tab_list">
            <span v-perm="'reimbursementList'" class="tab_item" @click="goViewTab('reimbursementList')">报销</span>
            <router-link
              :to="{name: 'debitList'}"
              v-perm="'loanList'"
              class="tab_item"
              :class="{active: $route.meta.module === 'debitList'}"
              v-if="isWhite">借款</router-link>
            <!--<router-link :to="{name: 'debitList'}" v-perm="'goalDetail'" class="tab_item" :class="{active: goalActive}">借款</router-link>-->
            <span v-perm="'projectList'" class="tab_item" @click="goViewTab('projectList')">成本中心</span>
            <span v-perm="'subjList'" class="tab_item" @click="goViewTab('subjList')">科目</span>
            <span v-perm="'budgetView'" class="tab_item" @click="goViewTab('budgetView')">费用预算</span>
            <span v-perm="'reimbursementSet' || 'loanSetting'" class="tab_item" @click="goViewTab('reimbursementSet')" :class="{active: $route.meta.module === 'setting'}">设置</span>
           <!--<router-link :to="{name: 'settingIndex'}" v-perm="'reimbursementSet'" class="tab_item" active-class="active">设置</router-link>-->
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { isWhiteCorpId } from "@/module/approve/api/reimbursement/debit";

export default {
  name: 'reimBox',
  data() {
    return {
//      goalActive:false,
      baseURL:_.baseURL,
      isWhite :false
    };
  },
  created() {
    isWhiteCorpId({agentCode:'reimbursement',agentFunction:'loan'}).then(res=>{
      if (res.code == '0') {
        this.isWhite = res.data.isWhiteCorpId;
      }else {
        _.alert('提示',res.desc);
      }
    }).catch(err=>{
      _.alert('提示','网络错误');
    })
  },
  computed: {
    ...mapGetters('header',[
      'trustApp'
    ]),
  },
  methods: {
    // 点击tab跳转
    goViewTab(type) {
      let baseURL = this.baseURL;
      window.location.href = `${baseURL}/manager/form_flow/main.jsp?module=reimbursement&tab=${type}`;
    }

  },
  watch: {
    /*$route(newRoute){
      var debit_routeName = ['debitList','setting'];
      var currentRouteName = newRoute.meta.module;

      debit_routeName.forEach((value, index) => {
        if(value === currentRouteName){
          this.goalActive = true;
        }
      })

    }*/
  }
};
</script>
<style scoped>
  .crm_box{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
.tab_list {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
.tab_list .tab_item {
  display: inline-block;
  padding: 0 15px;
  margin: 0 5px;
  height: 50px;
  line-height: 50px;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}
.tab_list .tab_item:hover {
  color: #f87b00;
}
.tab_list .tab_item.active {
  color: #f87b00;
  border-bottom: 2px solid #f87b00;
}
</style>
