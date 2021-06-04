<template>
	<div class="detail-main clearfix">
			<div class="detail-main-l">
				<div class="detail-tab clearfix" :class="{'detail-tab-gd':scroll>452}">
                	<div class="item" :class="{active:mainActive=='introduce'}" @click="mainActiveTab('introduce')">介绍</div>
            	    <div class="item" :class="{active:mainActive=='catalog'}" @click="mainActiveTab('catalog')">目录</div>
            	</div>
            	<!--基本信息-->
            	<div class="detail-info" :class="{none:mainActive!='introduce','detail-info-gd':scroll>452}">
            	    <div class="item mt40">
            	        <p class="fz18 c333">课程介绍</p>
            	        <div class="mt20" v-html="subject.content"></div>
            	    </div>
            	    <div class="item mt40">
            	        <p class="fz18 c333">适用人群</p>
            	        <div class="mt20 fz14">{{subject.suit}}</div>
            	    </div>
            	    <div class="item mt40 pb30 model_hide">
            	        <p class="fz18 c333">讲师介绍</p>
            	        <div class="mt20 clearfix teacherList">
            	        	<div class="detail-card" v-for="item in teacherList">
            	        		<div class="detail-cardPic">
            	        			<img :src="getHeadPic(item.headPic)" alt="">
            	        		</div>
            	        		<div class="detail-cardInfo">
            	        			<p class="fz16 mt5">{{item.userName}}<span class="fz14 c999 ml10">{{item.position}}</span></p>
            	        			<p class="detail-cardIntd">{{item.content}}</p>
            	        		</div>
            	        	</div>
            	        </div>
            	    </div>
            	</div>
            	<!--目录-->
            	<div class="detail-catalog mt40 pb100" :class="{none:mainActive!='catalog'}">
            		<div class="detail-chapter" v-for="(item,i) in enclosureList">
            			<div class="detail-chapter-tit">
            				<span class="firType">{{item.chapterName}}</span>
            			</div>
            			<ul class="fileUl">
            				<li v-for="(item_c,t) in item.enclosureVOs" :class="[(isSelfClass || item_c.trySeeTime !== '' || detaildata.subjectInfo.subject.price == 0)  ? 'canTrySee' : 'canotTrySee']" @click="preview_file(item_c)">
            					<span class="">课时{{t+1}}</span>
            					<i class="cloud-folder mr5" :class="getEnclosureClass(item_c.fileType,item_c.file_name)"></i>
            					<span class="w450 ellipsis iblock vm">{{item_c.file_name}}</span>
            					<span class="fr">{{getStudyTime(item_c.studyTime)}}</span>
											<a class="preview-ico fr mr5"></a>
            					<span class="canotInfo">需购买后观看</span>
								<template v-if="!isSelfClass && subject.price != 0">
									<span class="freeSeeFlag fr mr15" v-if="parseInt(item_c.trySeeTime) === 0">免费试看</span>
									<span class="freeSeeFlag fr mr15" v-else-if="(item_c.fileType == 2 || item_c.fileType == 3) && parseInt(item_c.trySeeTime) > 0">免费试看{{item_c.trySeeTime}}分钟</span>
								</template>
            				</li>
            			</ul>
            		</div>
            	</div>
			</div>
			<div class="detail-main-r">
				<div class="main-r-info" :class="{'detail-main-gd':scroll>452}">
					<div class="mechanism-logo" :class="{bgnone:externalLogo}"><img :src="externalLogo" alt=""></div>
					<p class="fz16 tac mt20 mb20">{{external.organizationName}}</p>
					<p class="c999">{{external.description}}</p>
				</div>
			</div>
        </div>
</template>

<script>
	export default {
		name:"detailMain",
		props:["detaildata"],
		data(){
			return {
				mainActive:"introduce",
				scroll:''
			}
		},
		computed:{
			subject:function(){
				return this.detaildata.subjectInfo.subject
			},
			teacherList:function(){
				return this.detaildata.subjectInfo.teacherRefPOList
			},
			enclosureList:function(){
				return this.detaildata.subjectInfo.chapterEnclosureListVOList
			},
			external:function(){
				return this.detaildata.externalCorpPO
			},
			externalLogo:function(){
				if(this.external.logo){
					return _.compressURL+this.external.logo
				}
			},
			isSelfClass: function() {
				if(this.external.orgId == _qwy.orgConfigInfo.orgId){
					return true;
				} else {
					return false;
				}
			}
		},
		created:function(){
			window.addEventListener('scroll', this.scroll_detailTab)
		},
		methods:{
			mainActiveTab:function(type){
				this.mainActive=type;
			},
			getStudyTime:function(time){
    			var Minute = time;
    			Minute = Minute>9?Minute:"0"+Minute;
    			return Minute + ':00'
			},
			getHeadPic:function(pic){
				var headPic = /^http/.test(pic)?pic:_.compressURL+pic;
				return headPic;
			},
			getEnclosureClass: function(type,name){
			    switch (type){
			        case 6:
			            return {"url":true};
			            break;
			        case 5:
			            return {"pictxt":true};
			            break;
			        case 3:
			            return {"mp4":true};
			            break;
			        case 2:
			            return {"mp3":true};
			            break;
			        case 1:
			            return {"pic":true};
			            break;
			        case 4:
			            var nameArr = name.split(".");
			            var type =  nameArr[nameArr.length-1].toLowerCase();
			            return type.substring(0,3);
			            break;
			    }
			},
			"preview_file": function(obj){
				var fileType = obj.fileType;
				var detailId = this.subject.id;
				var trySeeTime = obj.trySeeTime;   //用localStorage保存试看时间
				var isSelfClass = this.isSelfClass;    //为true则是当前企业的课程，不受试看时长限制。
				var price = this.subject.price;
				//如果不可试看，则点击无效
				if(!isSelfClass && price != 0 && (trySeeTime === '' || trySeeTime === null)) {
					return false;
				}
				//设置为0表示可观看全部
				(isSelfClass || price == 0) ? localStorage.setItem(obj.id+'_trySeeTime',0) : localStorage.setItem(obj.id+'_trySeeTime',trySeeTime);
				var url='';
				if(fileType!="4"){
                    if(fileType == "6") {
                        url=obj.url;
                    } else {
                        url = _.baseURL + '/manager/learnonline/filePreview.jsp?fileId=' + encodeURI(obj.id) + '&fileType=' + encodeURI(obj.fileType) + '&page=courseMall' + '&outURL=' + encodeURI(obj.url) + '&fileSize=' + encodeURI(obj.fileSize) + '&fileName=' + encodeURI(obj.file_name) + '&detailId=' + encodeURI(detailId);
                    }
        			if(url.indexOf("mck.baidu")!=-1){
        			    url = url.replace("mck","chuanke");
        			}
                }else{
                    url =_.yongzhong_url+encodeURIComponent(_.fileDownURL+_.downFileURL+encodeURIComponent(obj.url)+'&fileFileName='+encodeURIComponent(obj.file_name))
                }
				window.open(url)
			},
			scroll_detailTab:function() {
    			this.scroll = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
   			}
		}
	}
</script>

<style>
.detail-main{
	width: 1200px;
	margin: 30px auto;
}
.detail-main-l{
	float: left;
	width: 820px;
	padding: 30px;
	padding-top: 0;
	background: #fff;
}
.detail-tab {
	z-index: 99;
	border-bottom: 2px solid #e7e7e7;
}

.detail-tab-gd{
	position: fixed;
    top: 0;
    width: 820px;
    background: #fff;
}

.detail-main-gd{
    position: fixed;
    top: 0;
}

.detail-tab .item {
	padding: 0 20px;
	height: 45px;
	box-sizing: border-box;
	font-size: 16px;
	color: #666;
	line-height: 40px;
	float: left;
	margin-right: 20px;
	position: relative;
	top: 1px;
	cursor: pointer;
}

.detail-tab .active {
	border-bottom: 3px solid #f87b00;
	color: #f87b00;
}

.detail-card {
	float: left;
	padding: 20px;
	width: 50%;
	box-sizing: border-box;
}

.detail-cardPic {
	float: left;
	width: 100px;
	height: 100px;
	border-radius: 50%;
	overflow: hidden;
}

.detail-cardPic img {
	width: 100%;
	height: 100%;
}

.detail-cardInfo {
	margin: 0 50px 0 120px;
}

.detail-cardIntd {
	margin-top: 15px;
	height: 55px;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
}

.cloud-folder{
  display: inline-block;
  position:relative;
  width:24px;
  height:24px;
  vertical-align: middle;
}
.cloud-folder.pic,.cloud-folder.jpg {
	background: url('../../../../assets/images/file_type.png') 2px -243px no-repeat;
}

.cloud-folder.ppt {
	background: url('../../../../assets/images/file_type.png') 2px -2px no-repeat;
}

.cloud-folder.xls {
	background: url('../../../../assets/images/file_type.png') 2px -27px no-repeat;
}

.cloud-folder.doc {
	background: url('../../../../assets/images/file_type.png') 2px -53px no-repeat;
}

.cloud-folder.pdf {
	background: url('../../../../assets/images/file_type.png') 2px -80px no-repeat;
}

.cloud-folder.txt {
	background: url('../../../../assets/images/file_type.png') 2px -134px no-repeat;
}

.cloud-folder.mp4 {
	background: url('../../../../assets/images/file_type.png') 2px -161px no-repeat;
}

.cloud-folder.mp3 {
	background: url('../../../../assets/images/file_type.png') 2px -188px no-repeat;
}

.cloud-folder.pictxt {
	background: url('../../../../assets/images/ic_file_pictext.png') 2px 0 no-repeat;
}

.cloud-folder.url {
	background: url('../../../../assets/images/ic_file_url.png') 2px 0 no-repeat;
}

.detail-chapter {
	margin-bottom: 20px;
}

.detail-chapter-tit {
	padding: 0 20px;
	height: 40px;
	line-height: 40px;
	font-size: 16px;
	color: #666;
	background: #fafafa;
}

.detail-chapter ul li {
	padding: 0 20px;
	height: 36px;
	line-height: 36px;
	cursor: pointer;
}


.detail-chapter ul li span:first-child {
	width: 80px;
	display: inline-block;
}

.preview-ico {
	display: none;
	height: 36px;
	width: 30px;
	background: url('../../../../assets/images/ic_courseopt.png') no-repeat -216px 10px;
	cursor: pointer;
}

.canotTrySee{
	position: relative;
}

.canotInfo{
	position: absolute;
	right: 20px;
	height: 36px;
	background-color: #f0f0f0;
	color: #f77c00;
	display: none;
}

.detail-chapter ul li:hover {
	background: #f0f0f0;
}

.canTrySee:hover .preview-ico {
	display: inline-block;
}

.canotTrySee:hover .canotInfo {
	display: inline-block;
}

.detail-main-r{
	float: right;
	width: 260px;
}

.main-r-info{
	width: 260px;
	padding: 20px;
	background: #fff;
}
.mechanism-logo{
	width: 260px;
	height:144px;
	text-align: center;
	line-height: 142px;
	background: url(../../../../assets/images/ic_courseimg.png) no-repeat center #e5e5e5;
}
.main-r-info img{
	max-width: 100%;
	max-height: 100%;
	vertical-align: middle;
}
.detail-info img{
	max-width: 100%;
}
.detail-info-gd{
	padding-top: 47px
}
.freeSeeFlag{
    height:14px;
	margin-top: 10px;
    padding: 0 5px;
	line-height: 14px;
    font-size:12px;
    color: #80C056;
    border: 1px solid #80C056;
}
</style>
