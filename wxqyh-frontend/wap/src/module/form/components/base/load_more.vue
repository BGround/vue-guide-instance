<template>
  <div >
    <div class="qwui-showMoreList" v-if="!showrecord">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="loading"></i>{{loading ? '加载中' : tips}}</p>
    </div>
    <no-record :hasrecord="hasRecord" :show="showrecord" ></no-record>
  </div>
</template>
<script>
  import noRecord from './no_record.vue';
  export default {
    props:['busy','loading','showrecord', 'recordText', 'recordTitle','listCount','loadingText', 'recordIcon','entrustTips'],
    computed:{
      tips(){
        if(this.entrustTips){
          var tip = '';
          tip = this.entrustTips == 'rules' ? '规则' : '记录';
          return this.busy?this.listCount?'共 '+this.listCount+' 个' + tip :'已没有更多':'点击或向上滑加载更多'
        }
        let str = '';
        if(this.busy) {
          if(this.listCount) {
            str = '共' + this.listCount + ' 个表单';
          }else if(this.loadingText) {
            str = this.loadingText;
          }else {
            str = '已没有更多';
          }
        }else {
          str = '点击或向上滑加载更多';
        }
        return str;
      },
      hasRecord() {
        return {
          "show": false,
          "setTop": false,
          "icon": this.recordIcon ? 'other' : '',
          "title": this.recordTitle || "暂无数据",
          "text": this.recordText || ""
        }
      }
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
<style lang="scss" scoped>
  .qwui-showMoreList{
    line-height: 44px;
    text-align: center;
    font-size: 12px;
    color: #B2B9C8;
  }
</style>
