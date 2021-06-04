<template>
  <div>
    <div class="row15" v-for="(askItem,index) in askList" :key="index" :class="firstAddClass(index,askList)">
      <div class="flexItem ohidden">
        <div class="fz14">
          <span class="mr5 c666">请假出差</span>
          <span class="ckw-cldDetail-qiandao cred">{{askItem.askDay=='0'?'':askItem.askDay+'天'}}{{askItem.ext1=='0'?'':askItem.ext1+'小时'}}</span>
          <span class="cred">{{askItem.askTypeName}}</span>
        </div>
        <div class="ellipsis fz13 c999 mt5">
          {{askItem.startTime | signTimefilter}} 至 {{askItem.endTime | signTimefilter}}
        </div>
      </div>
    </div>
	</div>
</template>

<script>
export default {
  name: "check_item_forAsk",
  props: ["checkItemForAsk"],
  data() {
    return {
      
    };
  },
  filters: {
    signTimefilter: function (val) {
      if (!val) return '';
      return val.replace(" ",":").replace(/\:/g,"-").replace(/(\d{4})\-(\d{2})\-(\d{2})\-(\d{2})\-(\d{2})\-(\d{2})/,"$2月$3日 $4:$5");
    }
  },
  computed: {
    askList() {
      return this.checkItemForAsk;
    },
    firstAddClass(){
      return function (index,list) {
        if(list){
          let addClass = index==0?'mt10 rowCenter ':'rows';
          addClass = list.length==1?addClass+'rows':addClass+'';
          return addClass;
        }
      }
    }
  },
  methods: {

  }
};
</script>

<style scoped>
.rows {
  position: relative;
  padding: 10px 15px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background: #fff;
}
.rows::before {
  content: " ";
  position: absolute;
  left: 15px;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
          transform: scaleY(0.5);
}
.row15 {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: relative;
  padding: 10px 15px 5px;
  background: #fff;
}
.rowCenter {
  position: relative;
  padding: 10px 15px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
          align-items: center;
  background: #fff;
  border-top: 1px solid #e5e5e5;
}
.mt10 {
    margin-top: 10px;
}
.flexItem {
  flex: 1;
}
.ckw-cldDetail-qiandao {
  border-left: 1px solid #ccc;
  padding-left: 10px;
  margin-left: 10px;
  margin-right: 5px;
  color: #666;
}
.cred {
  color: #f56262;
}
.ohidden {
  overflow: hidden;
}
.fz14 {
  font-size: 14px;
}
.mr5 {
  margin-right: 5px;
}
.c666 {
  color: #666;
}
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
}
.fz13 {
  font-size: 13px;
}
.c999 {
  color: #999;
}
.mt5 {
  margin-top: 5px;
}
</style>
