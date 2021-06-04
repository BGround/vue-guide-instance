<template>
	<div class="subjectTop-box">
		<div class="subjectTop clearfix">
          	<img :src="subjectCover" alt="" class="">
          	<div class="subjectTop_info">
          	    <h1 class="w630">{{detaildata.subject.subjectName}}</h1>
          	    <p class="mt10">
          	        <span class="c999 mr20">{{detaildata.subject.enclosureCount}}课时</span>
          	        <span class="c999 mr20">总时长：{{detaildata.subject.studyTime}}分钟</span>
          	        <span class="c999 mr20">{{detaildata.subject.saleLearnersNum}}人学习</span>
          	    </p>
          	    <p class="mt20">
          	    	<span class="c999">存放至：</span><input type="text" class="text" @click="showSelectTypePop" v-model="selectedtype.name">
          	    </p>
          	    <p class="mt10" v-if="detaildata.subject.price!=0">
          	        <span class="cprice">
                    <span class="fz28 mr5">￥{{detaildata.subject.priceStr}}</span>
                    <span class="fz16 c999 line_through mr5" v-if="detaildata.subject.priceStr!=detaildata.subject.originalPriceStr">￥{{detaildata.subject.originalPriceStr}}</span>
                    /人·年</span>
          	    </p>
                <p class="mt10 n_cprice fz28" v-if="detaildata.subject.price==0">免费</p>
          	    <p class="subjectTop-buy">
                  <span class="fl mt10 fz14 c999">购买人数：</span>
          	    	<number-input :config="config_numberInput" class="mr20"></number-input><go-buygoods  :config="config_goBuyGoods"></go-buygoods>
          	    </p>
          	</div>
        </div>
	</div>
</template>

<script>
	import numberInput from '@/components/base/numberInput'
  import goBuyGoods from '@/components/base/goBuyGoods'
	export default{
		name:"subjectTop",
		props:["detaildata","selectedtype"],
		data(){
			return {
        config_numberInput:{
					data:1,
					multiple:1,
					showBtn:true
				},
			}
		},
		computed:{
			"subjectCover":function(){
				if(this.detaildata.subject.subjectCover){
					return _.compressURL+this.detaildata.subject.subjectCover;
  				}else{
  					return '';
  				}
			},
      "config_goBuyGoods":function(){
        var extParam = "categoryId=" +this.selectedtype.id+"&subjectId=" +this.detaildata.subject.id+"&coverImg="+this.detaildata.subject.subjectCover+ "&unit=人/年"+ "&productName="+this.detaildata.subject.subjectName;
        var data={
            text:"立即购买",
            services:{
              corpId: _.orgConfigInfo.corpId,
              "services":[
                {
                  "serviceId":this.detaildata.subject.id,
                  "priceCode":this.detaildata.subject.id,
                  "buyNum":this.config_numberInput.data,
                  "extParam":extParam
                }
              ]
            }
        }
        return data
      }
		},
  		created:function(){
  			//console.log(this.selectedtype)
  		},
  		components:{"number-input":numberInput,"go-buygoods":goBuyGoods},
  		methods:{
  			"showSelectTypePop":function(){
  				this.selectedtype.isShow=true;
        		dataBase.mask=true;
        		console.log(dataBase)
  			}
  		},
	}
</script>

<style>

.subjectTop-box{
	background: #fff;
}
.subjectTop{
	width: 1200px;
	margin: 0 auto;
	padding: 30px 0;
}
.subjectTop img{
	float: left;
	width: 560px;
	height:310px;
	background: url(../../../../assets/images/ic_courseimg.png) no-repeat center #e5e5e5;
}
.subjectTop_info{
	position: relative;
    height: 310px;
    margin-left: 580px;
}
.subjectTop_info>input{
	position: absolute;
	left: 0;
	bottom: 0;
}
.subjectTop_info h1{
	font-size: 22px;
	line-height: 30px;
}
.subjectTop-buy{
	position: absolute;
	bottom: 0;
}
</style>
