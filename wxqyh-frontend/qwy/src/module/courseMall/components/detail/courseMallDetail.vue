<template>
  <div class="detail">
		<subject-top :detaildata="subjectInfo" :selectedtype="selectedType" v-if="subjectInfo"></subject-top>
		<subject-main :detaildata="this.detail.subject" v-if="subjectInfo"></subject-main>
    	<select-type :typeData="detail.subject.catgeoryVOList" :selectedtype="selectedType" v-if="subjectInfo"></select-type>
	  	<inner-footer></inner-footer>
  </div>
</template>

<script>
import axios from 'axios'
import courseDetailTop from './courseDetailTop'
import courseDetailMain from './courseDetailMain'
import selectType from './selectType.vue'
import footer from '@/components/base/footer'

export default {
  name: 'detail',
  created:function(){
  	this.detail.param.id=this.$route.query.detailId;
	  this.detailInit()
  },
  data(){
    return {dataBase:dataBase,detail:dataBase.detailData}
  },
  computed:{
  	subjectInfo:function(){
  		return this.detail.subject.subjectInfo;
  	},
    selectedType:function(){
      return this.detail.selectedType;
    },
  	/*catgeoryList:function(){
  		return this.detail.subject.catgeoryVOList;
  	},
  	externalCorp:function(){
  		return this.detail.subject.externalCorpPO;
  	}*/
  },
  components:{
  	"subject-top":courseDetailTop,
  	"subject-main":courseDetailMain,
    "select-type":selectType,
	"inner-footer":footer
  },
  methods:{
  	"detailInit":function(){
      this.dataBase.loading=true;
    	var self = this;
  		this.detail.subject = {};
      _.ajax({
        url: _.baseURL+self.detail.url,
        type: 'post',
        data: self.detail.param,
        success: function (result) {
          if ("0" == result.code) {
            self.dataBase.loading=false;
            for(var i = 0;i<result.data.catgeoryVOList.length;i++){
              result.data.catgeoryVOList[i].isShow=false;
            }
            self.detail.subject = result.data;
            var catgeoryList = self.detail.subject.catgeoryVOList;
            if(catgeoryList[0].subCategoryList.length==0){
              self.detail.selectedType.id=catgeoryList[0].id;
              self.detail.selectedType.name=catgeoryList[0].category;
            }else{
              self.detail.selectedType.id=catgeoryList[0].subCategoryList[0].id;
              self.detail.selectedType.name=catgeoryList[0].category+' > '+catgeoryList[0].subCategoryList[0].category;
            }
          }else{
            _.alert("提示",result.desc)
          }
        }
      })
  	}
  }
}

</script>

<style>
  .detail{
    background: #eee;
  }

  .coverPic {
	margin-top: 20px;
	position: relative;
}

.coverPic img {
	width: 940px;
	height:520px;
}

.coverPic .coverPic-opt {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 80px;
	background: rgba(0, 0, 0, 0.7);
}

.coverPic-opt input {
	margin-left: 40px;
	padding: 10px 30px;
	font-size: 16px;
	line-height: 100%;
}




</style>
