<template>
  <transition-group
    tag="ul"
    class="qwui-upload_list"
    name="qwui-list"
  >
    <a
      v-for="(file,index) in filesNew"
      :key="file.url"
      class="qwui-upload_item"
      tabindex="0"
      @click="preview(file.url,file.fileName)"
    >
      <img :src="file.src" alt="">
      <div class="qwui-item_content">
        <div class="qwui-item_name">{{file.fileName}}</div>
        <div class="qwui-item_size c666">{{file.fileSizeStr}}</div>
      </div>
      <span class="qwui-icon_close" @click.stop="$emit('remove',file)"></span>
    </a>
  </transition-group>
</template>

<script>
  export default {
    props:{
      files:{
        type:Array,
        default:[],
      }
    },
    computed:{
      filesNew(){
        let iconArr = {
          '.xls':'excel',
          '.xlsx':'excel',
          '.mp3':'music',
          '.wma':'music',
          '.amr':'music',
          '.pdf':'pdf',
          '.ppt':'ppt',
          '.pptx':'ppt',
          '.mp4':'video',
          '.doc':'word',
          '.docx':'word',
          '.rar':'zip',
          '.zip':'zip',
          '.csv':'excel',
        };
        if(this.files&&this.files.length>0){
          this.files.forEach((item)=>{
            let fileName = item.fileName;
            let isExt = fileName.lastIndexOf(".");
            let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
            let str = iconArr[fileExt] || 'other';
            item.src = require('assets/svg/icon_b-detail_'+str+'.svg');
          });
        }
        return this.files;
      },
    },
    methods:{
      //预览附件
      preview(url,fileName){
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        let useYongzhongyun = ['.xls','.xlsx','.ppt','.pptx','.doc','.docx'];
        if(useYongzhongyun.includes(fileExt)){
          window.open(_.fileDownURL+_.downFileURL+url+'&fileFileName='+fileName);
          // window.open(_.yongzhong_url+encodeURIComponent(_.fileDownURL+_.downFileURL+encodeURIComponent(url)+'&fileFileName='+encodeURIComponent(fileName)));
        }else{
          window.open(_.fileDownURL+url);
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .qwui-list-enter-active,
  .qwui-list-leave-active {
    transition: all .3s;
  }
  .qwui-list-enter, .qwui-list-leave-active {
    opacity: 0;
    transform: translateY(-30px);
  }

  .qwui-upload_list{
    .qwui-upload_item{
      position: relative;
      display: flex;
      height:68px;
      width:330px;
      background:rgba(250,250,250,1);
      border:1px solid rgba(230,230,230,1);
      box-sizing: border-box;
      border-radius:2px;
      padding: 11px 12px;
      margin-bottom: 4px;
      .qwui-item_content{
        flex:1;
        padding-left: 12px;
        .qwui-item_name{
          width: 220px;
          color:#333;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .qwui-item_size{

        }
      }
      .qwui-icon_close{
        position: absolute;
        right: 12px;
        top: 50%;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
        background: url(~assets/images/ic_b-delet.png) no-repeat;
        background-size:16px 16px;
        &:hover{
          background: url(~assets/images/ic_b-delet_hover.png) no-repeat;
        }
      }
    }
  }
</style>
