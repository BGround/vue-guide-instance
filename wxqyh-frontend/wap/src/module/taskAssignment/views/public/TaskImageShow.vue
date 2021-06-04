<!--任务图片展示组件-->

<template>
  <div class="qwui-img_wrap">
    <div class="qwui-show_region"
         :class="{ 'tile_map':showStyle == 1 }"
         v-for="(item,key) in imageList"
         :key="key"
         ref="region" :style="{ 'height':picHeight }">
      <img class="qwui-thumbnail tile_map"
           v-if="showStyle == 1"
           :src="compressURL + item.src"
           @click="preview(item)">
      <span v-else
            class="qwui-thumbnail"
            :style="{'backgroundImage':'url('+compressURL + item.src+')'}"
            @click="preview(item)"></span>
      <span v-if="editPerm" class="qwui-close_btn" @click.stop="deleteImg(item,key)"></span>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus';

  export default {
    props:{
      imageList:{
        type:Array,
        default(){
          return []
        }
      },
      showStyle:{
        type:[Number,String],
        default:0
      },
      editPerm:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return {
        compressURL:_.compressURL,
        picHeight:0,
      }
    },
    created(){
      this.$nextTick(()=>{
        let w = document.documentElement.clientWidth;
        w = w >= 1024 ? 740 : w;
        this.picHeight = (w - 64)/3 + 14 + 'px';
      })
    },
    computed:{
      previewList(){
        let arr = [];
        this.imageList.forEach((item)=>{
          arr.push({
            src:this.compressURL + item.src
          })
        });
        return arr;
      }
    },
    methods:{
      deleteImg(item,key){
        this.$emit('deleteImage',item,key)
      },
      //预览图片
      preview (item) {
        EventBus.$emit("previewImages",this.compressURL+item.src,this.previewList);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-img_wrap {

    .qwui-show_region {
      display: inline-block;
      position: relative;
      width: 33.33%;
      padding: 14px 0 0 14px;
      box-sizing: border-box;

      &:nth-child(3n+1) {
        padding-left:0;
       }

      .qwui-thumbnail {
        width: 100%;
        display: inline-block;
        height: 100%;
        background: no-repeat center;
        background-size: cover;
        cursor: pointer;

        &.tile_map {
          height: initial;
         }
      }

      &.tile_map {
         width: 100%;
         padding-left:0;
       }

      .qwui-close_btn {
        position: absolute;
        top: 18px;
        right: 4px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: url("~assets/svg/icon_a-16-close.svg") no-repeat center center;
        cursor: pointer;
      }
    }
  }

</style>
