<template>
  <div class="rankList_ent line-bottom line-top">
    <div class="rankList_item" @click="clickToRanking('early')" v-if="earlyTop.isOpen">
      <img :src="earlyTop.headPicUrl" alt="">
      <i class="ic_slices_icon slices_pos"></i>
      <span>早到榜</span>
      <p>{{earlyTop.name}}</p>
    </div>
    <div class="rankList_item" @click="clickToRanking('diligence')" v-if="diligenceTop.isOpen">
      <img :src="diligenceTop.headPicUrl" alt="">
      <i class="ic_slices_icon slices_pos"></i>
      <span>勤奋榜</span>
      <p>{{diligenceTop.name}}</p>
    </div>
    <div class="rankList_item" @click="clickToRanking('later')" v-if="laterTop.isOpen">
      <img :src="laterTop.headPicUrl" alt="">
      <span>迟到榜</span>
      <p>{{laterTop.name}}</p>
    </div>
  </div>
</template>

<script>
const proHeadPicUrl = require("../../../assets/images/touxiang02.png");

export default {
  name: "rank_top",
  props: {
    rankTop:Object,
    getDeptData:Object,
  },
  data() {
    return {
      earlyTop: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      },
      diligenceTop: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      },
      laterTop: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      },
      earlyTopInit: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      },
      diligenceTopInit: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      },
      laterTopInit: {
        name: "-",
        headPicUrl: proHeadPicUrl,
        isOpen: false
      }
    };
  },
  created(){

  },
  watch: {
    rankTop: {
      handler: function() {
        this.earlyTop.name = this.rankTop.earlyTop.name
          ? this.rankTop.earlyTop.name
          : this.earlyTopInit.name;
        this.earlyTop.isOpen = dataBase.statistics.isOpenEarlySetting;
        this.earlyTop.headPicUrl = this.rankTop.earlyTop.headPicUrl
          ? this.rankTop.earlyTop.headPicUrl
          : this.earlyTopInit.headPicUrl;
        this.diligenceTop.name = this.rankTop.diligenceTop.name
          ? this.rankTop.diligenceTop.name
          : this.diligenceTopInit.name;
        this.diligenceTop.isOpen = dataBase.statistics.isOpenDiligenceSetting;
        this.diligenceTop.headPicUrl = this.rankTop.diligenceTop.headPicUrl
          ? this.rankTop.diligenceTop.headPicUrl
          : this.diligenceTopInit.headPicUrl;
        this.laterTop.name = this.rankTop.laterTop.name
          ? this.rankTop.laterTop.name
          : this.laterTopInit.name;
        this.laterTop.isOpen = dataBase.statistics.isOpenLaterSetting;
        this.laterTop.headPicUrl = this.rankTop.laterTop.headPicUrl
          ? this.rankTop.laterTop.headPicUrl
          : this.laterTopInit.headPicUrl;
      },
      deep: true
    }
  },
  methods:{
    // 点击进入排行榜
    clickToRanking(type){
      this.$router.push({path:"/ranking", query:{type:type,isDepartManager:1,data:this.getDeptData,}});
    },
  }
};
</script>

<style scoped>
.rankList_ent {
  display: flex;
  line-height: 1;
  text-align: center;
  background: #fff;
  margin-top: 15px;
}
/*边框定位*/
.line-top,
.line-bottom{
  position: relative;
}
/*上边框*/
.line-top::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #e5e5e5;
  color: #999;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
/*下边框*/
.line-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.rankList_item {
  flex: 1;
  text-align: center;
}
.rankList_item img {
  width: 56px;
  height: 56px;
  margin: 28px 0 -5px;
  border-radius: 50%;
}
.rankList_item span {
  position: relative;
  width: 42px;
  margin: 0 auto;
  padding: 3px;
  display: block;
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
  background: #468ceb;
}
.rankList_item:nth-child(3) span {
  background: #999;
}
.rankList_item p {
  margin: 8px 0 18px;
}
.ic_slices_icon {
  display: inline-block;
  width: 20px;
  height: 54px;
  background: url(~assets/images/checkwork/ic_slices.png) no-repeat;
  background-size: 20px 18px;
}
.slices_pos {
  margin: 0 0 7px -25px;
}
</style>

