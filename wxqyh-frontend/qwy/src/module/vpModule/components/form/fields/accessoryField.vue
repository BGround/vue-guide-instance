<template>
  <div class="field-content">
	<add-file-list :agent="agent"
				   :filesList="fileUpload.mediaList"
				   :deleteFile="!(field.disabled||field.readonly)"
				   :downLoad="field.disabled"
           @deleteFileItem="deleteFileItem">
	</add-file-list>
    <add_file v-if="!(field.disabled||field.readonly)"
			  :filesList="fileUpload.mediaList"
        :deleteFileList="deleteFileList"
			  :agent="agent" @updateFileList="showMsgFromFileDetail">
	</add_file>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  import add_file from 'vpCommon/add/upload/add_file';
  import addFileList from 'vpCommon/add/upload/addFileList';
  import {fileSendata} from 'vpModule/js/form/validation'
  import {setFiles,deleteFile} from 'vpModule/utils/updateFiles';
  export default {
    components:{
      add_file,addFileList
    },
    props:{
      field: {
			type: Object,
			default: function () {
				return {}
			}
	  }
	},
    created(){
      this.fileUpload.mediaList = setFiles(this.field.value)||[];
	  	this.showMsgFromFileDetail(this.fileUpload.mediaList,'1');
      this.fileUpload.isEdit = !this.field.disabled||false;
    },
    data(){
      return{
      	agent: 'form',
        fileUpload: {
          mediaList: [], // 编辑/复制等存在的原数据
		  		isEdit: true
        },
        deleteFileList:{},
      }
    },
    methods:{
			showMsgFromFileDetail (val,type){
				var key = this.field._id;
				var value = [];
				value = fileSendata(val);
				this.$emit('change',{key,value});
        type != '1' && field_validation(this.field);//首次加载页面不进行字段验证
			},
      deleteFileItem(item){
			  this.deleteFileList = item;
      },
    }
  }
</script>
