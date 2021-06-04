<!--
  参数：
  @param title(默认'')：标题文字

  方法：
  @param open：打开
  @param close：打开
  @param toggle：打开 - 关闭

  用法：
    1、传入title值，默认插槽用于填充内容
        <qw-detail-card title="i m title">
            i m content
        </qw-detail-card>
    2、定制详情头,不传title值，直接在title插槽里去定义头部
        <qw-detail-card>
            <template slot="title">
                <h1>Title</h1>
            </template>
            <template>
                <h1>Content</h1>
            </template>
        </qw-detail-card>
-->
<template>
      <div class="qwui-detail-card" v-if="show">
          <div class="mask" @click="close"></div>
          <div class="content" :class="{ 'dragOut': isDragOut }">
              <!-- 头部 -->
              <div class="top">
                  <div class="top-block">
                      {{title}}
                      <slot name="title"></slot>
                  </div>
                  <i class="close-btn" @click="close"></i>
              </div>
              <!-- 内容主体区域 -->
              <div class="main">
                  <slot></slot>
              </div>
          </div>
      </div>
</template>

<script>
export default {
    props: {
        title:{
            type:String,
            default:"",
        },
    },
    data(){
        return {
            show: false,
            isDragOut: false
        }
    },
    watch: {
        show(newVal,oldVal){
            document.body.style.overflow = newVal? 'hidden' : 'visible';
            this.$nextTick(()=>{
                this.isDragOut = newVal;
            })
        }
    },
    methods: {
        open(){
            this.show = true;
        },
        close(){
            this.show = false;
            this.$emit('close');
        },
        toggle(){
            this.show = !this.show;
        }
    }
}
</script>

<style src="./qw-detatil-card.scss" lang="scss" scoped></style>
