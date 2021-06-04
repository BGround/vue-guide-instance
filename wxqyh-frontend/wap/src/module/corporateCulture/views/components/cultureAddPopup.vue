<template>
  <div>
    <transition name="slide-fade">
      <div class="qwui-add_nav" v-show="show" ref="addNav">
        <div class="qwui-add_main" v-if="popupList.length>2">
          <div class="qwui-nav_box_content" v-show="popupList[2].isShow" :class="{'fadeInUpBig':show,'fadeOutBottomBig':!show}">
            <span class="qwui-nav_box_text qwui-new_built_box_text">{{newPopupList[2].name}}</span>
            <div class="qwui-nav_box_radius" @click="gotoCultureAdd(popupList[2].url)">
              <i class="qwui-nav_box_icon" :class="newPopupList[2].type"></i>
            </div>
          </div>
          <div class="qwui-nav_box_content" v-show="popupList[1].isShow" :class="{'fadeInUpMiddle':show,'fadeOutBottomMiddle':!show}">
            <span class="qwui-nav_box_text qwui-new_built_box_text">{{newPopupList[1].name}}</span>
            <div class="qwui-nav_box_radius" @click="gotoCultureAdd(popupList[1].url)">
              <i class="qwui-nav_box_icon" :class="newPopupList[1].type"></i>
            </div>
          </div>
          <div class="qwui-nav_box_content" v-show="popupList[0].isShow" :class="{'fadeInUpSmall':show,'fadeOutBottomSmall':!show}">
            <span class="qwui-nav_box_text qwui-new_built_box_text">{{newPopupList[0].name}}</span>
            <div class="qwui-nav_box_radius" @click="gotoCultureAdd(popupList[0].url)">
              <i class="qwui-nav_box_icon" :class="newPopupList[0].type"></i>
            </div>
          </div>
        </div>
        <span class="qwui-add_close" @click="hideAddPopup" ref="addClose"></span>
      </div>
    </transition>
    <div class="qwui-culture_entry" @click="showAddPopup" ref="cultrureEntry"></div>
  </div>
</template>

<script>
  export default {
    props:{
      popupList:{
        type:Array,
      },
      jumpURL:{
        type:String,
        default:'',
      }
    },
    mounted () {
        this.computWidth();
        window.onresize = () => {
          this.computWidth();
        }
    },
    data(){
      return{
        show:false,
      }
    },
    methods:{
      showAddPopup(){
        if(this.jumpURL!=''){
          document.location.href = this.jumpURL;
          return;
        }
        this.show = true;
      },
      hideAddPopup(){
        this.show = false;
      },
      gotoCultureAdd(url){
        document.location.href = url;
      },
      computWidth(){
        const self = this;
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          if(width>1024){
            self.$refs.addClose.style.right=(width-740)/2+14+'px';
            self.$refs.cultrureEntry.style.right=(width-740)/2+14+'px';
            self.$refs.addNav.style.width=740+'px';
            self.$refs.addNav.style.left=(width-740)/2+'px';
          }else{
            self.$refs.addClose.style.right=14+'px';
            self.$refs.cultrureEntry.style.right=14+'px';
            self.$refs.addNav.style.width='100%';
            self.$refs.addNav.style.left=0;
          }
      }
    },
    computed:{
      newPopupList:function(){
        this.popupList.reverse();
        var typeClassList = ['survey','activity','topic'];
        this.popupList.forEach(function(item,index){
          if(item.type){
            item.type = 'ic_grey_bg_'+item.type;
          }else{
            item.type = 'ic_grey_bg_'+typeClassList[index];
          }
        });
        return this.popupList;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
  }

  .qwui-add_nav{
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,.95);
    z-index: 110;
    .qwui-add_main{
      position: absolute;
      bottom:0;
      right: 14px;
      transform: translateY(-50%);
      .qwui-nav_box_content{
        position: fixed;
        bottom: 34px;
        right: 0;
        width: 100vw;
        text-align: right;
        margin-bottom: 20px;
        &:nth-child(1){
          bottom: 262px;
        }
        &:nth-child(2){
          bottom: 186px;
        }
        &:nth-child(3){
          bottom: 110px;
        }
        .qwui-nav_box_radius{
          position: relative;
          display: inline-block;
          vertical-align: middle;
          height: 56px;
          line-height: 56px;
          border-radius: 100%;
          background: #fff;
          .qwui-nav_box_icon{
            display: block;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            box-shadow: 0 8px 14px 0 rgba(178, 185, 200, 0.27);
            &.ic_grey_bg_topic{
              background: url(~assets/svg/icon_a-homepage_addbtn1.svg) center no-repeat;
              background-size: 100% 100%;
            }
            &.ic_grey_bg_activity{
              background: url(~assets/svg/icon_a-homepage_addbtn3.svg) center no-repeat;
              background-size: 100% 100%;
            }
            &.ic_grey_bg_survey{
              background: url(~assets/svg/icon_a-homepage_addbtn2.svg) center no-repeat;
              background-size: 100% 100%;
            }
            &.ic_grey_bg_draft{
              background: url(~assets/svg/icon_a-homepage_addbtn4.svg) center no-repeat;
              background-size: 100% 100%;
            }
          }
        }
        .qwui-nav_box_text{
          display: inline-block;
          height: 56px;
          line-height: 56px;
          margin-right: 16px;
          vertical-align: middle;
          font-size: 14px;
          color: #0A1735;
        }
      }
    }
  }

  .qwui-add_close{
    position: fixed;
    display: block;
    width: 54px;
    height: 54px;
    background: #fff;
    bottom: 55px;
    right: 14px;
    font-size: 18px;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0 8px 14px 0 rgba(178,185,200,0.27);
    z-index: 111;
    &::before{
      content:' ';
      position:absolute;
      left: 50%;
      top: 50%;
      width: 12px;
      height: 12px;
      background: url(~assets/images/crm/CombinedShape.png);
      background-size: 100% 100%;
      background-color: #fff;
      transform: translate(-50%,-50%);
    }
  }

  @keyframes fadeInUpSmall {
    0% {
      opacity: 0;
      bottom: 34px;
    }
    100% {
      opacity: 1;
      bottom: 110px;
    }
  }

  @keyframes fadeOutBottomSmall {
    0% {
      opacity: 1;
      bottom: 110px;
    }
    to {
      opacity: 0;
      bottom: 34px;
    }
  }

  @keyframes fadeInUpMiddle {
    0% {
      opacity: 0;
      bottom: 34px;
    }
    to {
      opacity: 1;
      bottom: 186px;
    }
  }

  @keyframes fadeOutBottomMiddle {
    0% {
      opacity: 1;
      bottom: 186px;
    }
    to {
      opacity: 0;
      bottom: 34px;
    }
  }

  @keyframes fadeInUpBig {
    0% {
      opacity: 0;
      bottom: 34px;
    }
    to {
      opacity: 1;
      bottom: 262px;
    }
  }

  @keyframes fadeOutBottomBig {
    0% {
      opacity: 1;
      bottom: 262px;
    }
    to {
      opacity: 0;
      bottom: 34px;
    }
  }

  .fadeInUpSmall {
    animation: fadeInUpSmall .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .fadeInUpMiddle {
    animation: fadeInUpMiddle .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .fadeInUpBig {
    animation: fadeInUpBig .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .fadeOutBottomSmall {
    animation: fadeOutBottomSmall .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .fadeOutBottomMiddle {
    animation: fadeOutBottomMiddle .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .fadeOutBottomBig {
    animation: fadeOutBottomBig .3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .qwui-culture_entry{
    position: fixed;
    right: 14px;
    bottom: 55px;
    z-index: 1;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    text-align: center;
    line-height: 54px;
    background: #5585F0;
    cursor: pointer;
    box-shadow:0px 8px 14px 0px rgba(85,133,240,0.3);
    &::before{
      content:' ';
      position:absolute;
      left: 50%;
      top: 50%;
      width: 16px;
      height: 16px;
      background: url(~assets/images/btn_A0_addto.png);
      background-size: 100% 100%;
      transform: translate(-50%,-50%);
    }
  }
</style>
