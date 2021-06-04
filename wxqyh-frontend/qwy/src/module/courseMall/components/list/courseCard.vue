<template>
	<li class="ml20">
		<div class="coursePic">
			<router-link target="_blank" :to="{name: 'detail', params: { detailId: coursedata.id}, query: { detailId: coursedata.id}}" class=""><img :src="subject_cover" alt="" class=""></router-link>
		</div>
		<div class="courseInfo">
			<div class="item">
				<router-link target="_blank" :to="{name: 'detail', params: { detailId: coursedata.id}, query: { detailId: coursedata.id}}" class="">
					<span class="ellipsis courseTit w190" :title="coursedata.subjectName">{{coursedata.subjectName}}</span>
				</router-link>
			</div>
			<div class="item fz13 c999 mb20">
				<span class="mr5" v-if="coursedata.enclosureCount">{{coursedata.enclosureCount}}课时</span>
				<span class="">{{coursedata.saleLearnersNum}}人学习</span>
			</div>
			<div class="item h24">
				<span class="cprice fz16" v-if="coursedata.price>0">
					¥{{coursedata.price}}
					<span class="c999 fz13 ml5">
						<span class="line_through" v-if="coursedata.price<coursedata.originalPrice">{{coursedata.originalPrice}}</span>
						/人·年
					</span>
				</span>
				<span class="n_cprice" v-if="coursedata.price<=0">免费</span>
			</div>
		</div>
	</li>
</template>

<script>
	export default {
  		name: 'courseCard',
  		computed:{
  			subject_cover:function(){
  				if(this.coursedata.subjectCover){
					return _.compressURL+this.coursedata.subjectCover;
  				}else{
  					return '';
  				}
  			}
  		},
  		props:["coursedata"],
	}
</script>

<style>
.courseList{
	margin-left:-20px;
}
.courseList li{
	float: left;
	padding: 6px;
	margin-bottom: 20px;
	width: 212px;
}
.courseList li:hover{
	padding: 5px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border: 1px solid rgb(230, 230, 230);
}

.courseList li:hover .opt{
	display: block;
}

.coursePic{
	position: relative;
	height: 125px;
	width: 100%;
	background: url(../../../../assets/images/ic_courseimg.png) no-repeat center #e5e5e5;
}
.coursePic a{
	display: block;
	width: 100%;
	height:100%;
}
.coursePic .timeTip{
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 24px;
	font-size: 13px;
	line-height: 24px;
	color: #fff;
	text-align: center;
    background-color: rgba(0, 0, 0,0.7);
}
.coursePic .dayTip{
	position: absolute;
	right: 0;
	top: 0;
	width: 64px;
	height: 24px;
	font-size: 13px;
	line-height: 24px;
	color: #fff;
	text-align: center;
    background-color: #f53131;
}
.courseList li img{
	height: 100%;
	width: 100%;
}
.courseInfo{
	margin: 10px 0;
}
.courseTit{
	display: inline-block;
    height: 20px;
    line-height: 20px;
    vertical-align: bottom;
    color: #333;
}
</style>