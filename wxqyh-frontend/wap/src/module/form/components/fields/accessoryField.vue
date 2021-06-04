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
			  :agent="agent" :orderId="orderId" @updateFileList="showMsgFromFileDetail">
	</add_file>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  import add_file from '@/components/add/upload/add_file';
  import addFileList from '@/components/add/upload/addFileList';
  import {fileSendata} from '../../js/validation'
  import {setFiles,deleteFile} from '../../../../utils/updateFiles';
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
      this.orderId = this.$store.state.detail.detailData.detailsPO.definitionVersionsId;
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
        orderId: '',
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

