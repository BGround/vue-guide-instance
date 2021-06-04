<template>
  <div>
    <div class="qwui-score" @click="showScoreDetail">
      <span class="scoreTitle">评分</span>
      <div class="star">
        <span class="trueStar" v-for="(item,key) in score" :key="key"></span>
        <span class="falseStar" v-for="(item,key) in (10 - score)" :key="key"></span>
      </div>
      <i class="allScore" v-if="hasSubTask"></i>
    </div>
    <div class="selectBox" v-show="scoreDetailShow">
      <div class="qwui-score qwui-score_detail">
        <p class="mainTitle">{{ mainTitle }}</p>
        <div class="star">
          <span class="trueStar" v-for="item in score"></span>
          <span class="falseStar" v-for="item in (10 - score)"></span>
        </div>
      </div>
      <div class="qwui-score qwui-score_detail" v-for="(value,key) in subTaskScore" :key="key">
        <div v-if="value.score != ''">
          <p class="subTitle">{{ value.title }}</p>
          <div class="star">
            <span class="trueStar" v-for="item in Number(value.score)"></span>
            <span class="falseStar" v-for="item in (10 - value.score)"></span>
          </div>
        </div>
      </div>
      <flow-button :buttondata="buttonConfig"></flow-button>
    </div>
  </div>
</template>

<script>
  import flowButton from '@/components/button/flow_button';
//  import { } from '../../api/getData';

  export default {
    props:{
      mainTitle:{
        type:String,
        default:''
      },
      score:{
        type:[Number,String],
        default:10
      }
    },
    data(){
      return {
        buttonConfig:{
          primaryList:[
            {
              type:"primary",
              name:'确定',
              callBack:this.hideScoreDetail
            },
          ],
          defaultList:[],
          class:"active"
        },
        scoreDetailShow:false,
      }
    },
    created(){

    },
    methods:{
      showScoreDetail(){
        if (this.subTaskPage || !this.hasSubTask){ return; }
        this.scoreDetailShow = true;
      },
      hideScoreDetail(){
        this.scoreDetailShow = false;
      }
    },
    computed:{
      subTaskPage(){
        return this.$store.getters.subTaskPage;
      },
      // 是否有子任务
      hasSubTask(){
        if (this.$store.getters.subtaskScoreList && !this.$store.getters.subTaskPage){
          return true;
        }
        return false;
      },
      // 子任务评分
      subTaskScore(){
        return this.$store.getters.subtaskScoreList;
      }

    },
    components:{
      flowButton
    }

  }
</script>

<style>

</style>
