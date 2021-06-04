<template>
  <div >
    <div class="qwui-showMoreList" v-if="!showrecord">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="loading"></i>{{loading ? '加载中' : tips}}</p>
    </div>
    <no-record :hasrecord="hasRecord" :show="showrecord" ></no-record>
  </div>
</template>
<script>
  import NoRecord from './NoRecord.vue';
  export default {
    props:['busy','loading','showrecord', 'recordText', 'recordTitle'],
    data(){
      return {
       
      }
    },
    computed:{
      tips(){
        return this.busy?'已没有更多':'点击或向上滑加载更多'
      },
      hasRecord() {
        return {
          "show": false,
          "setTop": false,
          // "icon": "qwui-icon_text",
          "title": this.recordTitle || "暂无记录",
          "text": this.recordText || ""
        }
      }
    },
    components:{
      NoRecord,
    },
    methods:{
      loadMoreClick(){
        if(!this.busy){
          this.$emit('childevent')
        }
      }
    }
  }
</script>
<style>
  .qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
</style>
