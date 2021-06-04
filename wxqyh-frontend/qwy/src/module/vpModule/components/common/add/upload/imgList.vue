<template>
    <div class="imgListMain" :class="['image-list_' + listType]">
      <div v-if="viewImageList && viewImageList.length<1 && disabled">
        <i class="icon_nolist"></i>
      </div>
      <ul class="impression" v-else>
        <li v-for="(item, index) in viewImageList" :key="index" class="image-list" :class="{disabled:disabled}">
          <a class="qwui-remove_icon_minus" @click="handleDelete(item,index); " v-if="!disabled"></a>
          <p class="img">
            <img class="image_addIcon previewImagesField" @click="show(item.src,index)" :src="item.src">
          </p>
        </li>
        <slot></slot>
      </ul>
			<div v-transfer-dom>
				<previewer :list="viewImageList" ref="preview" :options="options"></previewer>
			</div>
    </div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import EventBus from 'vpModule/utils/eventBus';
	import { Previewer, TransferDom } from 'vux'
	export default {
		props: {
			listType: {            //picture-card 行内块级 || picture 独占一行
				type: String,
				default: 'picture'
			},
			imageList:Array,
			disabled:{
				type: Boolean,
				default:true
			},
			agent: String,
			//兼容微信端新增,详情预览图片打不开
			useWxPreview:{
				type:Boolean,
				default: true
			}
		},
		directives: {
			TransferDom
		},
		components: {
			Previewer
		},
		data (){
			return {
				list: [],
				viewImageList: [],
				fileList: this.imageList,
				options: {
					getThumbBoundsFn (index) {
						// find thumbnail element
						let thumbnail = document.querySelectorAll('.previewImagesField')[index]
						// get window scroll Y
						let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
						let rect = thumbnail.getBoundingClientRect()
						// w = width
						return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
					}
				}
			}
		},
		created(){
			this.changeList(this.imageList);
		},
		watch: {
			'fileList'(val){
				this.changeList(val);
			}
		},
		methods: {
			handleDelete (item,index) {
			  var obj = item;
			  obj.index = index;
				this.$emit("handleDeleteImage",obj);
			},
			changeList(val){
				this.viewImageList = JSON.parse(JSON.stringify(val))
				this.viewImageList.forEach((item)=>{
					item.src.indexOf('http') == -1?  item.src = _.compressURL + item.src : '';
				})
			},
			show (currentUrl,index) {
				//图片预览功能
				if(_.isWeChatApp()){
					var wxImagesUrls = [];
					this.imageList.forEach(function(item){
						wxImagesUrls.push(_.filterCompressURL(item.src));
					})
					wx.previewImage({
						current:wxImagesUrls[index],                            // 当前显示的图片链接
						urls: wxImagesUrls                                                       // 需要预览的图片链接列表
					});
				}else{
					this.imageList.forEach((val,index)=>{
						if(currentUrl.indexOf(val.src)!=-1){
							this.$refs.preview.show(index);
						}
					});
				}
			}
		},
	}
</script>
<style scoped>
	.qwui-remove_icon_minus {
		display: block;
		position: absolute;
		left: 34px;
		top: -6px;
		width: 18px;
		height: 18px;
		background:url(../../../../assets/images/form_icon_pic-delete.png);
		background-size: 100% 100%;
		cursor: pointer;
	}
	.impression {
		display: inline-block;
	}
	.impression .image_addIcon{
		display: inline-block;
		width: 48px;
		height: 48px;
		border-radius: 4px;
	}
	.impression .image-list{
		position: relative;
		float: left;
		width: 48px;
		margin: 7px 15px 0px 0;
		border-radius: 2px;
		color: #666;
	}
  .impression .image-list.disabled{
    margin: 0px 15px 0px 0;
  }
	.image-list_picture-card{
		display: inline-block;
	}
  .icon_nolist{
    display: inline-block;
    height: 48px;
    width: 48px;
    margin-top: 7px;
    background: url('../../../../assets/images/icon_form_nopic.png') no-repeat;
    background-size: 100%;
  }
</style>
