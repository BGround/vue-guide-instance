<template>
	<div class="qwui-enclosure_pic_box">
		<div class="qwui-enclosure_pic_item">
			<i class="qwui-enclosure_pic_left"></i>
			<div class="qwui-flexItem qwui-enclosure_pic">审批意见</div>
		</div>
    <div class="reason-wrap" v-for="(item,index) in appList" :key="index">
      <span>{{item.approvalTime}}：{{item.remark}}</span>
    </div>
		<!--<div style="padding: 0 18px;">-->
			<!--<div class="textAare-box" v-if="!showTextArea" @click="toggle">-->
				<!--<span :style="{color: textVal!=''?'':'#bbb'}">{{textVal!=''?textVal:'请输入审批意见123'}}</span>-->
			<!--</div>-->
			<!--<textarea class="textAare-box" v-else ref="rectification" v-model="textVal" :disabled="disabled" placeholder="请输入审批意见568" maxlength="2048"-->
			 <!--@blur="onBulr"></textarea>-->
		<!--</div>-->
	</div>
</template>

<script>
	export default {
    props: {
     value:{
			 type: String,
			 default: '',
		 },
		 status: {
			 type: String,
		 },
		 showDealer: {
			 type: Boolean,
       default: false,
		 },
      appList: {
        type: Array,
        default: [],
      }
    },
    components: {

    },
    data(){
      return{
        disabled: false,
        showTextArea: false,
				textVal: ''
      };
    },
    watch:{
      value: {
				handler(val){
					this.textVal = val;
				},
				immedaite: true
			},
      status: {
        handler(val){
          console.log(val)
          if(val=='1'){
            this.disabled = true;
          }
        },
        immedaite: true
      }
    },
    methods:{
      toggle(){
				if(this.status!='0'&&!this.showDealer){
					return;
				}
				this.showTextArea = true;
				this.$nextTick(()=>{
					let el = this.$refs.rectification;
					el.focus();
					let range = this.getSelectedText(); //创建range
					range.collapseToEnd(); //光标移至最后
				})
			},
			onBulr(){
				this.showTextArea = false;
				this.$emit('input',this.textVal)
			},
			// 兼容性处理，获取所选的对象，用于鼠标聚到文本尾部
			getSelectedText() {
			  var txt = '';
			  if (window.getSelection) {
			    txt = window.getSelection();
			  } else if (window.document.getSelection) {
			    txt = window.document.getSelection();
			  } else if (window.document.selection) {
			    txt = window.document.selection.createRange().text;
			  }
			  return txt;
			},
    },
  }
</script>

<style type="text/css">
	.qwui-flex {
		display: flex;
	}

	.qwui-enclosure_pic_box {
		background: #fff;
	}

	.qwui-enclosure_pic_item {
		display: flex;
		line-height: 46px;
		color: #0A1735;
		font-size: 15px;
	}

	.qwui-enclosure_pic {
		padding-left: 8px;
	}

	.qwui-enclosure_pic_left {
		width: 26px;
		padding-left: 15px;
		background: url("../../../../assets/svg/icon_a-newtask-list_enclosure.svg") no-repeat scroll right;
	}

	.qwui-enclosure_pic_right {
		width: 24px;
		padding-right: 15px;
		background: url("../../../../assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
	}

	.qwui-flexItem {
		flex: 1;
	}

	.qwui-w_zero {
		width: 0;
	}

	.qwui-enclosure_pic_li {
		padding: 10px 0;
	}

	.qwui-enclosure_pic_show {
		padding-left: 48px;
	}

	.qwui-enclosure_pic_icon img {
		width: 34px;
		height: 34px;
		border-radius: 4px;
	}

	.qwui-enclosure_pic_iblock {
		display: inline-block;
		vertical-align: middle;
	}

	.qwui-enclosure_pic_icon {
		margin-right: 10px;
	}

	.qwui-enclosure_pic_name {
		font-size: 14px;
		color: #0A1735;
		word-wrap: break-word;
	}

	.qwui-enclosure_pic_size {
		font-size: 13px;
		color: #B2B9C8;
	}

	.qwui-enclosure_pic_item_right {
		width: 20px;
		padding-right: 15px;
		background: url("../../../../assets/svg/icon_a-enclosure-list_delete.svg") no-repeat scroll left;
	}

	.qwui-download {
		background: url("../../../../assets/svg/icon_a-enclosure-list_download.svg") no-repeat scroll left;
	}

	/* 文件的图标*/
	.qwui-detail_mediaList_imgs {
		display: inline-block;
		width: 34px;
		height: 34px;
		margin-right: 0;
		border-radius: 4px;
		background: url("../../../../assets/images/icon_file_type_mini.png") center no-repeat;
		background-size: cover;
	}

	.qwui-detail_mediaList_imgs.XML,
	.qwui-detail_mediaList_imgs.FILE {
		background-position: 0 0;
	}

	.qwui-detail_mediaList_imgs.XLS,
	.qwui-detail_mediaList_imgs.XLSX {
		background-position: -34px 0;
	}

	.qwui-detail_mediaList_imgs.TXT {
		background-position: -68px 0;
	}

	.qwui-detail_mediaList_imgs.DOCX,
	.qwui-detail_mediaList_imgs.DOC {
		background-position: -102px 0;
	}

	.qwui-detail_mediaList_imgs.PPT,
	.qwui-detail_mediaList_imgs.PPTX {
		background-position: -136px 0;
	}

	.qwui-detail_mediaList_imgs.PDF {
		background-position: -170px 0;
	}

	.qwui-detail_mediaList_imgs.MP3,
	.qwui-detail_mediaList_imgs.WMA,
	.qwui-detail_mediaList_imgs.WAV,
	.qwui-detail_mediaList_imgs.AMR {
		background-position: -204px 0;
	}

	.qwui-detail_mediaList_imgs.MP4 {
		background-position: -238px 0;
	}

	.qwui-detail_mediaList_imgs.RAR,
	.qwui-detail_mediaList_imgs.ZIP {
		background-position: -272px 0;
	}

	.qwui-pic_pop .qwui-dialog_bottom_footer {
		font-size: 15px !important;
	}

	.qwui-pic_pop .qwui-dialog_bottom_btn:after {
		border-bottom: 1px solid #fff !important;
	}

	.textAare-box {
		border: 1px solid #999;
		height: 150px;
		font-size: 15px;
		display: block;
		width: 100%;
		color: #0A1735;
		background: #fff;
		line-height: 25px;
		box-sizing: border-box;
		resize: none;
		white-space: pre-wrap;
		word-wrap: break-word;
		padding: 0 4px;
		overflow: auto;
	}
  .reason-wrap{
    padding: 15px 0;
    margin: 0 18px;
    /*background: red;*/
    border-bottom: 1px solid #e5e5e5;
  }
  .reason-wrap:last-child{
    border-bottom: none;
  }
</style>
