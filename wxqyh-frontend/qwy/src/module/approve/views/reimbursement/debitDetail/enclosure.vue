<template>
    <div class="photo_attachments">
        <ul class="photo_attachments_list">
          <li class="photo_attachments_item"
              v-for="(item,index) in fileList">
            <a :href="item.down" :download="item.fileName">
              <span class="qwui-detail_mediaList_images_new" :class="item.fileExt"></span>
              <p class="name">{{item.fileName}}</p>
            </a>
          </li>
          <li class="photo_attachments_item"
              v-for="(item,index) in imgList">
            <a :href="item.down" :download="item.fileName">
              <img :src="item.newUrl" alt="图片">
              <p class="name">{{item.fileName}}</p>
            </a>
          </li>
        </ul>
    </div>
</template>
<script>
  import{downLoadLog} from "@/module/approve/api/reimbursement/debit";

  export default {
    components: {},
    computed: {},
    data() {
      return {
        mediaInfo:[],
        baseURL:_.baseURL,
        imgList:[],
        fileList:[],
      }
    },
    props:{
      mediaList:{
        type:Array,
        default:function(){
          return []
        }
      },
      picList:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    created(){
      var _this=this;
      if( this.mediaList){
        this.mediaList.forEach(function(item,index){
          item.down=_.fileDownURL + _.downFileURL + encodeURIComponent(item.url) + "&fileFileName=" + encodeURIComponent(item.fileName);
          _this.fileList.push(item)
        })
      }
      if(this.picList){
        this.picList.forEach(function(item,index){
          item.newUrl=_.compressURL+ item.picPath;  //_.baseURL  'https://tqy.do1.net.cn/fileweb/compress/'
          var index = item.picPath.lastIndexOf("/");
          item.fileName = item.picPath.substring(index+1,item.picPath.length);
          item.down=_.fileDownURL + _.downFileURL + encodeURIComponent(item.picPath)+ "&fileFileName=" + encodeURIComponent(item.fileName) ; //+ "&fileFileName=" + encodeURIComponent(item.fileName)
          _this.imgList.push(item)
        })
      }
    }
  }
</script>
<style scoped>
  .photo_attachments{
    padding: 30px 20px;
  }
  .photo_attachments_list {

  }
  .photo_attachments_item{
    display: inline-block;
    width: 170px;
    height: 150px;
    text-align: center;
    vertical-align: top;
    cursor: pointer;
  }
  .photo_attachments_item ,name{
    display: inline-block;
    width: 90%;
    word-break: break-all;
  }
  .photo_attachments_item img{
    width: 80px;
    height: 80px;
    padding:0 9px;
  }
  /* 文件的图标*/
  .qwui-detail_mediaList_images_new{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    background-size: cover;
  }
  .qwui-detail_mediaList_images_new.XML,.qwui-detail_mediaList_images_new.FILE{
    background: url(~assets/images/reim/loan/icon_common_other.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.XLS,.qwui-detail_mediaList_images_new.XLSX{
    background: url(~assets/images/reim/loan/icon_common_ex.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.TXT{
    background: url(~assets/images/reim/loan/icon_common_txt.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.DOCX,.qwui-detail_mediaList_images_new.DOC{
    background: url(~assets/images/reim/loan/icon_common_word.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.PPT,.qwui-detail_mediaList_images_new.PPTX{
    background: url(~assets/images/reim/loan/icon_common_ppt.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.PDF{
    background: url(~assets/images/reim/loan/icon_common_pdf.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.MP3,.qwui-detail_mediaList_images_new.WMA,.qwui-detail_mediaList_images_new.AMR{
    background: url(~assets/images/reim/loan/icon_common_music.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.MP4{
    background: url(~assets/images/reim/loan/icon_common_player.png) center no-repeat;
  }
  .qwui-detail_mediaList_images_new.RAR,.qwui-detail_mediaList_images_new.ZIP{
    background: url(~assets/images/reim/loan/icon_common_rar.png) center no-repeat;
  }

</style>
