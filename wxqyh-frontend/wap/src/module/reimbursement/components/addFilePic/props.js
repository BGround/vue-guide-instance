let props = {
  "dataDetailMsg": { //附件ID列表
    type: Array,
    default() {
      return [];
    }
  },
  'fileList': { //附件数据
    type: Array,
    default() {
      return [];
    }
  },
  'enclosurePicShow': { //默认false
    type: Boolean,
  },
  'enclosurePicDelClass': { // 父组件的enclosurePicDelClass:'qwjs-main_del',
    type: String,
  },
  'enclosurePicPreviewClass': { //父组件的enclosurePicPreviewClass:'main-previewer-demo-img',
    type: String,
  },
  previewImageUrl: { //没有传进来
    type: Array,
    default() {
      return []
    }
  }
};

// @listenToImg="getImgUrl"
// getImgUrl(url){
//   this.taskData['imageUrls'] = url.join(',');
// }
// @listenToFile="getFileId"
// getFileId(mediaIds){
//   this.taskData['mediaIds'] = mediaIds.join(',');
//   this.taskData['tbQyTaskPO.filepicCount'] = mediaIds.length;
// },
/*
* icon_a-newtask-list_enclosure.svg
* icon-a-public_arrow-lower.svg
* icon_a-enclosure-list_delete.svg
* icon_a-enclosure-list_download.svg
* icon_file_type_mini.png imgs里的
* */
