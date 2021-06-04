<template>
    <div>
        <div class="qwui-carousel_wrap" v-if="isShow">
            <!--轮播图-->
            <qw-carousel class='qwui-carousel' @update-index="updateIndex">
                <qw-carousel-item
                v-for="(item, index) in carousel"
                :key="index"
                :cover="item.cover"
                :title="item.title"
                ></qw-carousel-item>
            </qw-carousel>
            <div class="img_box_slider">
                <div class="span_list">
                    <div :class="{'active': index === i}"
                    v-for="i in carousel.length" :key="i"
                    ></div>
                </div>
            </div>
        </div>
        <div v-else class="qwui-pc_wrap">
            <img src="../img/screen_pc_icon.png"/>
            <p class="qwui-tip_text">投屏连接后，请保持网络通畅</p>
        </div>
        <div class="qwui-btn_wrap">
            <a class="qwui-btn_confirm" @click="confirmSelected">投屏</a>
        </div>
    </div>    
</template>
<script>
import QwCarousel from '@/components/carousel';
import QwCarouselItem from '@/components/carousel/item';
import { setTimeout } from 'timers';
import wx from 'weixin-js-sdk';

export default {
    data(){
        return{
            isShow: null, // 移动端true, pc端false
            index:1,
            tempSrc: []
        }
    },
    computed: {
      // 轮播图图片
      carousel () {
        return this.tempSrc.map(({id,title, coverImage }, index) => {
          return {
            id,
            title,
            cover: coverImage
          };
        })
      }
    },
    created:function () {
      this.isShow = _.isMobileApp();
      this.carouselPic();
    },
    methods:{
      carouselPic(){
        var srcList = [{
            id: '1',
            title: '投屏连接后，请保持网络通畅',
            coverImage: require('../img/screen_mobile1.png')
        }, {
            id: '2',
            title: 'iOS 连接后需打开"屏幕录制"以开启投屏',
            coverImage: require('../img/screen_mobile2.png')
        }];
        setTimeout(()=>{
            this.tempSrc = srcList; 
        },0)
      },
      updateIndex (index) {
        this.index = index;
      },
      confirmSelected(){
        if(_.isQiyeweixin() || _.isQiyeweixinApp()){
            wx.ready(function () {            
                wx.invoke("startWecast",{},
                    function(res) {
                        if(res.err_msg == "startWecast:ok"){
                            //调用成功
                        }else {
                            //错误处理
                            _.alert('提示', res.err_msg);
                        }
                    });
            });
        } else {
            _.alert('提示', '一键投屏功能只支持企业微信使用');
        }
        
      }
    },
    components:{
      QwCarousel,
      QwCarouselItem,
    }
}
</script>
<style scoped lang="scss">
@media screen and (min-width: 1024px) {
  .img_box_slider{
    width: 740px !important;
  }
}
.qwui-carousel {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  background: {
    image: url(../img/screen_mobile1.png);
    size: contain;
    position: center center;
  }
  /deep/ .qwui-carousel-item {
      background-size: contain;
      .qwui-carousel-title {
          bottom: 5%;
          font-size: 18px;
          text-align: center;
        div {
             white-space:normal;
             background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
        }
      }
       
        
  }
}
.img_box_slider{
    width: 100%;
    text-align: center;
    background-color: #5fa3e6;
    & .span_list {
      padding: 4px 0 10px;
      text-align: center;
      & div{
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin: 5px;
        background:rgba(255,255,255,0.4);
        &.active {
          background:rgba(255,255,255,1);
        }
      }
    }
  }
  // 按钮
  .qwui-btn_wrap {
      display: flex;
      justify-content: center;    
      margin-top: 80px;
      .qwui-btn_confirm{
        display: block;
        width: 267px;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        color: #fff;
        letter-spacing: 3px;
        text-align: center;
        background:#6796D4;
        box-shadow:0px 4px 9px 0px rgba(100,138,188,0.32);
        border-radius:6px;
        cursor: pointer;
      }
  }
  // pc端图片
  .qwui-pc_wrap {
      position: relative;
      width: 100%;
      height:436px;
      text-align: center;
      background:linear-gradient(360deg,rgba(111,161,226,1) 0%,rgba(80,119,170,1) 100%);
      img {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: auto;
          width: 337px;
          height: 336px;
      }
      .qwui-tip_text {
          position: absolute;
          width: 100%;
          bottom: 35px;
          font-size: 18px;
          text-align: center;
          color: #fff;
      }
  }
</style>
