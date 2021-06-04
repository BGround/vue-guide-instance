<template>
  <div class="qwui-product_list">
    <div class="list_item" v-for="(item,index) in list" @click="toDetail(item,index)" :key="index">
      <!--标题、封面-->
      <div class="item_top clearfix">
        <div class="content">
          <h3 class="title ellipsis3">
            {{item.title}}
          </h3>
          <div class="time">{{item.createTime}}</div>
        </div>
        <div class="img_right" v-if="item.coverImage">
          <img :src="dealImg(item.coverImage,item.isSecret)"/>
        </div>
      </div>
      <!--百科类型、点赞数等-->
      <div class="item_bottom clearfix">
        <span class="name ellipsis">{{item.productTypeName}}</span>
        <div class="msg_icon">
          <span class="icon"><i class="read"></i>{{item.viewCount}}</span>
          <span class="icon"><i class="comment"></i>{{item.commentCount}}</span>
          <span class="icon"><i class="like"></i>{{item.praise}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      list:{
        type:Array,
      }
    },
    data(){
      return{
        
      }
    },
    methods:{
      dealImg:function(path){
        return _.filterCompressURL(path);
      },
      //跳到详情
      toDetail:function (item,index) {
          this.$emit('clickItem', item, index);
      }
    }
  }
</script>
<style lang="scss" scoped>
%half-px{
  content: " ";
  position: absolute;
  top:0;
  left: 0;
  right: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #ddd;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.qwui-product_list{
    .list_item {
        position: relative;
        margin: 10px 0;
        padding: 0 15px;
        background: #fff;
        cursor: pointer;
        &::before{
            @extend %half-px;
        }
        .item_top {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-top: 15px;
            .content {
                margin-right: 10px;
                vertical-align: middle;
                flex-grow: 2;
                .title {
                    color: #333;
                    font-size: 17px;
                    font-weight: normal;
                }
                .time {
                    padding: 5px 10px 0 0;
                    font-size: 11px;
                    color: #999;
                }
            }
            .img_right {
                width: 90px;
                height: 60px;
                vertical-align: middle;
                flex-shrink: 0;
                img {
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .item_bottom {
            position: relative;
            height: 34px;
            line-height: 34px;
            color: #999;
            &::before{
                @extend %half-px;
                top:0;
            }
            .name {
                max-width: 144px;
            }
            .msg_icon{
                float: right;
                .icon {
                    margin-right: 10px;
                    &:last-child {
                        margin-right: 0;
                    }
                }
                & i{
                    display: inline-block;
                    width: 14px;
                    padding-right: 5px;
                    background: url(~assets/images/readNumIcon.png) no-repeat;
                    background-size: 14px auto;
                }
                & .read{
                    height: 10px;
                    margin-top: -2px;
                    vertical-align: middle;
                }
                & .comment{
                    height: 11px;
                    background-position: 0 -12px;
                    vertical-align: -1px;
                }
                & .like{
                    width: 12px;
                    height: 12px;
                    background-position: 0 -24px;
                }
            }
        }
    }
}
.ellipsis3 {
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ellipsis {
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    overflow:hidden;
}
</style>
