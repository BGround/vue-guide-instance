<!--任务图片上传组件-->

<template>
  <div>
    <div class="qwui-enclosure_pic_item">
      <i class="qwui-enclosure_pic_left"></i>
      <div class="qwui-flexItem qwui-enclosure_pic">图片</div>
      <add_img class="qwui-task_add_img"
               :agent="agentCode"
               :imageList="imageList"
               @updateImageList="updateImageList"
               ref="add_img"></add_img>
    </div>
    <div class="qwui-rate_item">
      <span class="qwui-item_title">显示方式</span>
      <div class="qwui-select_type" @click="showTypePop">
        <span class="qwui-item_type">{{ showStyle == 0 ? '缩略图' : '平铺图' }}</span>
        <i class="qwui-icon_right"></i>
      </div>
    </div>
    <div class="qwui-choose_rate" v-if="typePopShow">
      <p class="qwui-rate_title">请选择显示方式</p>
      <div class="image-type">
        <div class="thumbnail" :class="{'active':showStyle == 0}" @click="chooseShowType(0)">
          <p>缩略图</p>
        </div>
        <div class="title-map" :class="{'active':showStyle == 1}" @click="chooseShowType(1)">
          <p>平铺图</p>
        </div>
      </div>
    </div>
    <div class="qwui-mask z-index_top" v-if="typePopShow" @click="typePopShow=false"></div>
  </div>
</template>

<script>
  import add_img from '@/components/add/upload/add_img';

  export default {
    props:{
      agentCode:{
        type:String,
        default:''
      },
      showStyle:{
        type:[Number,String],
        default:0
      },
      imageList:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        typePopShow:false,
      }
    },
    methods:{
      updateImageList(imageList){
        this.$emit('updateImageList',imageList)
      },
      showTypePop(){
        this.typePopShow = true;
      },
      chooseShowType(status){
        this.typePopShow = false;
        this.$emit('listenToShowStyle',status);
      }
    },
    components:{
      add_img
    }
  }
</script>

<style lang="scss" scoped>

  .qwui-enclosure_pic_item{
    display: flex;
    line-height: 46px;
    color:#0A1735;
    font-size: 15px;
  }
  .qwui-enclosure_pic_left{
    width: 26px;
    padding-left: 15px;
    background: url("~assets/svg/icon_image_upload.svg") no-repeat scroll right;
  }
  .qwui-enclosure_pic_right{
    width: 24px;
    padding-right: 15px;
    background: url("~assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-enclosure_pic{
    padding-left: 8px;
  }
  .qwui-task_add_img /deep/ .image_addIcon {
    width: 24px;
    height: 46px;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    background: url("~assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
  }
  .qwui-icon_right {
    width: 24px;
    height: 46px;
    position: absolute;
    right: 15px;
    top: 0;
    background: url("~assets/svg/right.svg") no-repeat center left;
  }
  .qwui-rate_item {
    display: flex;
    position: relative;
    min-height: 26px;
    color: #0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-item_title {
    padding-left: 48px;
    color: #7A7C80;
  }
  .qwui-select_type {
    cursor: pointer;
  }
  .qwui-item_type {
    position: absolute;
    right: 30px;
  }
  @media screen and (min-width:1024px) {
    .qwui-choose_rate{
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .qwui-choose_rate {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    z-index: 11;
    background: #fff;

    .qwui-rate_title {
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 16px;
      color: #0A1735;
    }
    .image-type {
      height: 150px;
      display: flex;
      flex-direction: row;

      .thumbnail,.title-map {
        flex:1;
        text-align: center;
        color: #B2B9C8;
        font-size: 13px;
        cursor: pointer;

        &.active {
           color: #5585F0;
         }
         p {
           margin-top: 100px;
         }
      }
      .thumbnail {
        background: url("~assets/svg/icon_thumbnail.svg") no-repeat center;
        border-right:1px solid #F7F8FA;

        &.active {
          background: url("~assets/svg/icon_thumbnail_active.svg") no-repeat center;
         }
      }
      .title-map {
        background: url("~assets/svg/icon_title_map.svg") no-repeat center;

        &.active {
           background: url("~assets/svg/icon_title_map_active.svg") no-repeat center;
         }
      }
    }
  }
</style>
