<template>
  <div >
    <div class="qwui-showMoreList" v-if="!showrecord">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="loading"></i>{{loading ? '加载中' : (listCount > 4 ? '— 已经到底了 —' : '')}}</p>
    </div>
    <no-record :hasrecord="hasRecord" :show="showrecord" ></no-record>
  </div>
</template>
<script>
  import noRecord from './no_record.vue';
  export default {
    props:['busy', 'loading', 'showrecord', 'recordIcon', 'recordText', 'recordTitle','listCount'],
    computed:{
      hasRecord() {
        return {
          "show": false,
          "setTop": false,
          "icon": this.recordIcon || "qwui-icon_text",
          "title": this.recordTitle || "暂无记录",
          "text":  this.recordText || ""
        }
      },
    },
    components:{
      noRecord,
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
