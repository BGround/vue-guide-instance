<template>
  <transition-group tag="ul"
     :class="[cls('',listType)]"
     name="upload-list"
     v-if="showUploadList"
  >
    <li v-for="file in fileList"
        :class="[cls('item'), 'is-' + file.status]"
        :key="file.uid"
    >
      <a :class="cls('item_thumbnail')">
        <img class="img" alt="" @click="handlePreview($event,file)"
             :src="filterSrc(file)">
        <div :class="cls('item_progress')" v-if="file.status == 'uploading' && file.percentage && file.percentage < 100 ">
          <span :class="cls('item_progress_mask')"></span>
          <qw-progress :percentage="file.percentage" :strokeWidth="3" :width="28"></qw-progress>
        </div>
        <div :class="cls('item_error')" v-if="file.status == 'error'">
          <span :class="cls('item_error_mask')"></span>
          <span :class="cls('item_error_text')" @click="onClickThumbnail($event,file)">点击重试</span>
        </div>
      </a>
      <a v-if="listType == 'picture-list'" @click="handlePreview($event,file)"
         :class="cls('item_name')">
        <span :class="cls('item_title')">{{file.name}}</span>
        <span :class="cls('item_size')">{{filterSize(file)}}</span>
      </a>
      <span :class="cls('item_icon')" v-if="showUploadList && showUploadList.showDownIcon && showUploadListFun(file)" @click="handleClick(file,'showDownIcon')">
          <i class="down_icon"></i>
      </span>
      <span :class="cls('item_icon')" v-if="showUploadList && showUploadList.showRemoveIcon" @click="handleClick(file,'showRemoveIcon')">
          <i class="remove_icon"></i>
      </span>
      <slot></slot>
    </li>
  </transition-group>
</template>

<script>
  import Mods from '../mixins/mods';
  import QwProgress from './progress'
  export default {
    name:'uploadList',
    mixins:[Mods],
    components:{
      QwProgress
    },
    props:{
      fileList:{
        type: Array,
        default(){
          return [];
        }
      },
      listType: {
        type: String,
        default: 'picture-list'
      },
      beforePreview: Function,
      showUploadListFun:{
        type: Function,
        default(file){
          return true;
        }
      },
      showUploadList: {
        type: [Boolean,Object],
        default(){
          return {
            showRemoveIcon: true,
            showDownIcon: false
          }
        }
      }
    },
    data(){
      return {}
    },
    methods:{
      filterSize(file) {
        if(!file.size || !(typeof file.size === "number")){
          return file.size
        }
        return this.formatSize(file.size,2)
      },
      formatSize(size,pointLength,units){
        let unit;
        units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
        while ( (unit = units.shift()) && size > 1024 ) {
          size = size / 1024;
        }
        return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) + unit;
      },
      filterSrc(file){
        //附件类型
        const matchType = {
          'doc': 'doc.docx',
          'music': 'mp3.wma.wav.mod.ra.cd.md.acc.mp3pro.vqf.flac.ape.mid.ogg.m4a',
          'pdf': 'pdf',
          'ppt': 'ppt.pptx',
          'rar': 'rar.zip.cab.arj.lzh.ace.7-zip.tap.gzip.uue.bz2.jar.iso',
          'txt': 'txt',
          'video': 'AVI.MOV.QT.ASF.RM.NAVI.Divx.MPEG.MPG.DAT.MP4',
          'xls': 'xls.xlsx.xlsm.xltx.xltm.xlsb.xlam',
        };
        const imageList = ['jpg','png','gif','jpeg'];
        const fileType = file.originFileObj && file.originFileObj.type? file.originFileObj.type : '';

        let background = 'other';
        let fileName = file.name;
        if(!fileName){
          return require(`@/assets/images/icon_file_${background}.png`)
        }
        fileName = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

        if(fileType && fileType.indexOf("image") >= 0  || imageList.includes(fileName)){
          return  file.src || require(`@/assets/images/icon_file_other.png`);
        }

         Object.keys(matchType).forEach((item) => {
          let fileList = matchType[item].toLowerCase().split('.')
          if(fileList.includes(fileName)){
            background = item;
            return false
          }
        })
        return require(`@/assets/images/icon_file_${background}.png`)
      },
      handleClick(file,key){
        const {showDownIcon,showRemoveIcon} = this.showUploadList;
        if(key === 'showRemoveIcon' && showRemoveIcon){
          this.$emit('remove',file);
          return;
        }
        if(key === 'showDownIcon' && showDownIcon){
          this.$emit('download',file);
        }
      },
      //Detect file status
      onClickThumbnail(ev,file){
        ev.preventDefault;
        this.$emit('onThumbnail',file);
      },
      handlePreview(ev,file){
        Promise.resolve( typeof this.beforePreview === 'function'? this.beforePreview(file) : this.beforePreview).
          then(res => {
            // Limit preview file
            if (res === false) {
              return;
            }
            ev.preventDefault;
            this.$emit('preview',file);
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>

