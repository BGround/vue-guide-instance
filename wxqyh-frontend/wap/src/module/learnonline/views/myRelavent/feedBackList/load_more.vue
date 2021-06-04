<template>
  <div >
    <div class="qwui-showMoreList" v-if="!showrecord">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="loading"></i>{{loading ? $t('i18n.loading') : tips}}</p>
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
          tip = this.entrustTips == 'rules' ? this.$t('i18n.rule') : $t('i18n.record');
          return this.busy?this.listCount?this.$t('i18n.total')+this.listCount+' ' + this.$t('i18n.piece') + tip : this.$t('i18n.nomore'): this.$t('i18n.loadMore')
        }
        let str = '';
        if(this.busy) {
          if(this.listCount) {
            str = this.$t('i18n.total') + this.listCount + this.$t('i18n.formTotal');
          }else if(this.loadingText) {
            str = this.loadingText;
          }else {
            str = this.$t('i18n.nomore');
          }
        }else {
          str = this.$t('i18n.loadMore');
        }
        return str;
      },
      hasRecord() {
        return {
          "show": false,
          "setTop": false,
          "icon": this.recordIcon ? 'other' : '',
          "title": this.recordTitle || this.$t('i18n.noRecord'),
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
