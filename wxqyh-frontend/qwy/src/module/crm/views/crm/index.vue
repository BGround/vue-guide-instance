<template>
    <div class="crm_box">
        <div class="tab_list">
            <router-link :to="{name: 'territorialSea'}" v-perm="'poolClientList'" active-class="active" class="tab_item">公海池</router-link>
            <router-link v-perm="'clientList'" :to="{name: 'client'}" class="tab_item" active-class="active" replace>客戶</router-link>
             <router-link :to="{name: 'crmContact'}" class="tab_item" active-class="active" replace>联系人</router-link>
            <span v-perm="'businessList'" class="tab_item" @click="goViewTab('business')">商机</span>
            <router-link :to="{name: 'visit'}" v-perm="'outsideList'" class="tab_item" active-class="active" replace>拜访</router-link>
            <span v-perm="'contractList'" class="tab_item" @click="goViewTab('contract')">合同</span>
            <router-link :to="{name: 'competitorList'}" class="tab_item" active-class="active" replace>竞争对手</router-link>
            <router-link :to="{name: 'goal'}" v-perm="'goalDetail'" active-class="active" class="tab_item" replace>目标</router-link>
            <router-link :to="{name: 'crmSetting'}" v-perm="'businessSet'" active-class="active" class="tab_item" replace>设置</router-link>
            
            <!-- v-perm="'wxAppProductSearch'"  -->
            <!-- <router-link :to="{name: 'assistantGuide'}" class="tab_item" :class="{active: $route.meta.module === 'assistant'}">企微云小站</router-link> -->
            <!-- <span v-perm="'businessSet'" class="tab_item" @click="goViewTab('setting')">设置</span> -->
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
        baseURL:_.baseURL,
    };
  },
  computed: {
    ...mapGetters('header',[
      'trustApp'
    ])
  },
  methods: {
    // 点击tab跳转
    goViewTab(type) {
      let baseURL = this.baseURL;
      window.location.href = `${baseURL}/manager/sales/main.jsp?tab=${type}`;
    }
  }
};
</script>
<style scoped>
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
<style lang="scss" scoped>
.crm_box{
  width: 1002px;
  padding: 10px 30px 0;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>



