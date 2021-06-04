<template>
    <div class="qwui-add_image_box" v-if="disabled">
		<div class="image_addIcon" :class="{disabled:!imageList.length}">
			<input v-if="isMobile" @click.prevent="handleClick($event)" ref="input" accept="image/jpeg,image/jpg,image/png,image/gif" type="file"  class="imageFileInput"/>
			<input v-else @change='handleChange' class="imageFileInput" ref="input" type=file accept="image/jpeg,image/jpg,image/png,image/gif" multiple/>
		</div>
    </div>
</template>
<script>
	import {wx_chooseImage,qw_uploadImages} from '@/utils/uploadImages';
	import EventBus from '@/utils/eventBus';
	export default {
	  name: 'QWUpdateImage',
	  props: {
		listType: {            //picture-card 行内块级 || picture 独占一行
			type: String,
			default: 'picture'
		},
    //手机端上传方式，默认：['album', 'camera']：相册、拍照
		camera: {
			type: Array,
			default (){
				return ['album', 'camera']
			}
		},
    //只能拍照上传，PC端不给上传
    onlyPhotograph:{
        type: Boolean,
        default: false
      },
    //限制上传最大张数
		limit: Number,
		imageList: {									    //图片列表
		  type: Array,
		  default (){
			  return [];
		  }
		},
    deleteImage:Object,								    //删除图片
		agent: {
			type: String,
			required: true
		},
		orderId: {
				type: String,
				default: ''
			}
	  },
	  data(){
		return {
		  fileList: this.imageList,
		  isMobile: false,	                           	 //是移动端
		}
	  },
	  computed:{
	  	disabled(){
	  		if(this.listType === 'picture-card'){
	  			return this.limit && this.fileList.length>=this.limit ? false : true
			}else{
				return true
			}
		}
	  },
    watch:{
    	imageList(val) {
    		this.fileList = val;
    	},
      deleteImage(val){
        this.handleDeleteImage(val.index);
      }
    },
	  mounted (){
		  this.isMobile = _.isWeChatApp();
	  },
	  methods:{
		  handleClick(event){									     	    //手机端图片上传
			  wx_chooseImage(this.agent,this.wxUpdateImage,this.limit,this.camera,this.orderId)
		  },
		  handleChange(event){										    	//pc端图片上传
        if(this.onlyPhotograph){
          _.alert('i18n.notice','请在手机上拍照上传');
          return
        }
			  const files = event.target.files;
			  if (!files) return;
			  if (this.limit && this.fileList.length + files.length > this.limit) {
			    this.$emit('limitUpdate',true)
				  return;
			  }
			  qw_uploadImages(event,this.agent,this.pcUpdateImage,this.orderId)
		  },
		  wxUpdateImage (urls){
		  	urls.forEach((item)=>{
				this.fileList.push({src:item});
			})
			  this.updateImageList()
		  },
		  pcUpdateImage (urls){
		  	if (urls.imgurl){
				this.fileList.push({src:urls.imgurl});
			}
			this.updateImageList()
		  },
		  handleDeleteImage (index){
			  if(index === this.fileList.length-1 && this.$refs.input){
				  this.$refs.input.value = ''
			  }
			  this.fileList.splice(index, 1);
			  this.updateImageList()
		  },
		  updateImageList (){
			this.$emit('updateImageList',this.fileList)
		  }
	  }
	}
</script>
<style scoped>
  .qwui-add_image_box {
	  display: inline-block;
	  position: relative;
	  background-color:#fff;
  }
  .imageFileInput {
	  width: 100%;
	  height: 100%;
	  opacity: 0;
  }
  .image_addIcon{
	  display: inline-block;
	  width: 48px;
	  height: 48px;
	  background: url("../../../assets/images/qwui-icon_addImage.png");
	  background-size: 100% 100%;
	  vertical-align: middle;
    margin: 7px 15px 0 0;
  }
  .image_addIcon.disabled{
    margin: 0 15px 0 0;
  }

</style>
