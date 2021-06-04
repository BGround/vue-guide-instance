<template>
	<div class="qwui-title_file" :class="customClass">
		<!-- 上传媒体文件（手机端页面）引入  start -->
		<slot name="title"></slot>
		<div class="qwui-setting_item qwui-fujian" v-for="(item, index) in filesList" :key="index">
				<span class="qwui-detail_mediaList_images_new" :class="item.fileExt" @click="openPreviewFile(item)"></span>
				<div class="qwui-fujian_text">
					<p class="name" @click="openPreviewFile(item)">{{item.fileName}}</p>
					<p class="qwui-fujian_size">{{item.fileSizeStr}}</p>
				</div>
        <div class="flex-iconp">
          <i class="iocnType icon_download" v-if="downLoad" @click="downloadFileClick(item,index)"></i>
          <i class="iocnType icon_delete" v-if="deleteFile" @click="doDelFile(item,index)"></i>
        </div>
		</div>
    <div v-if="filesList && filesList.length<1 && downLoad">
      <i class="icon_nolist"></i>
    </div>
		<slot name="append"></slot>
	</div>
</template>
<script>
	import EventBus from '@/utils/eventBus';
	import {deleteFile} from '@/utils/updateFiles';
	export default {
		name:"QWFilesImagesList",
		props: {
			customClass: {
			  type: String,
        default: ''
      },
			agent:String,
      //显示下载图标按钮
			downLoad:{
				type: Boolean,
				default:false
			},
      //显示删除图标按钮
			deleteFile:{
				type: Boolean,
				default:true
			},
      //显示的附件列表
			filesList: Array,
      //审批单的id
      groupId: {
        type: String,
        default: ''
      }
		},
		data() {
			return {
				newFilesList: this.filesList
			}
		},
		methods: {
			openPreviewFile(item){  //预览附件
				_.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
			},
			downloadFileClick(item){ //下载附件
				_.wxqyh_downloadFile(item.id,item.url,item.fileName);
			},
			doDelFile(item,index) { //删除附件
				this.newFilesList.splice(index, 1);
				deleteFile(item.id,this.agent,this.groupId);
				this.$emit("deleteFileItem",item);
			}
		}
	}
</script>
<style scoped>
	.qwui-title_file{
		position: relative;
		background-color: #fff;
	}
	.qwui-fujian {
		display: flex;
		line-height: 1.3;
    padding-bottom: 12px;
    align-items: center;
	}
	.file_title{
		padding-bottom: 10px;
		font-size: 15px;
		color: #333;
	}
	.file_list_len{
		padding: 5px 15px;
		background-color: #fff;
	}
	/* 文件的图标*/
	.qwui-detail_mediaList_images_new{
		display: inline-block;
		width: 34px;
		height: 34px;
		border-radius: 4px;
		background: url(../../../assets/images/icon_file_type_new.png) center no-repeat;
		background-size: cover;
	}
	.qwui-detail_mediaList_images_new.XML,.qwui-detail_mediaList_images_new.FILE{
		background-position: 0 0;
	}
	.qwui-detail_mediaList_images_new.XLS,.qwui-detail_mediaList_images_new.XLSX{
		background-position: -34px 0;
	}
	.qwui-detail_mediaList_images_new.TXT{
		background-position: -68px 0;
	}
	.qwui-detail_mediaList_images_new.DOCX,.qwui-detail_mediaList_images_new.DOC{
		background-position: -102px 0;
	}
	.qwui-detail_mediaList_images_new.PPT,.qwui-detail_mediaList_images_new.PPTX{
		background-position: -136px 0;
	}
	.qwui-detail_mediaList_images_new.PDF{
		background-position: -170px 0;
	}
	.qwui-detail_mediaList_images_new.MP3,.qwui-detail_mediaList_images_new.WMA,.qwui-detail_mediaList_images_new.AMR{
		background-position: -204px 0;
	}
	.qwui-detail_mediaList_images_new.MP4{
		background-position: -238px 0;
	}
	.qwui-detail_mediaList_images_new.RAR,.qwui-detail_mediaList_images_new.ZIP{
		background-position: -272px 0;
	}
	.qwui-fujian_text{
		flex: 1;
		position: relative;
		padding-left: 6px;
		padding-right: 100px;
	}
	.qwui-fujian_size{
		color: #999;
		font-size: 12px;
	}
	.qwui-fujian .name {
		display: -webkit-box;
		font-size: 15px;
		color: #333;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		cursor: pointer;
    word-break: break-all;
	}
  .flex-iconp{
    display: flex;
    justify-content: center;
    align-items: center;
  }
	.iocnType{
    display: inline-block;
    width: 22px;
    height: 22px;
    margin: 5px 5px 0 10px;
	}
	.icon_download{
    width: 25px;
    height: 30px;
		background: url('../../../assets/images/ic_file_download.png') no-repeat;
    background-size: 125%;
	}
	.icon_delete{
		background: url('../../../assets/images/ic_file_delete.png') no-repeat;
    background-size: 100%;
  }
  .icon_nolist{
    display: inline-block;
    height: 48px;
    width: 48px;
    background: url('../../../assets/images/icon_form_nofile.png') no-repeat;
    background-size: 100%;
  }
</style>
