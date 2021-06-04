<template>
  <div class="btn-wrapper">
    <div class="btn-content" @click="showOption">
      <div class="line-wrapper" :class="{'line-rotate': isShowOption}">
        <div class="line horizon"></div>
        <div class="line vertical"></div>
      </div>
      <div :class="{'leave-type-list':true,'show-list':isShowOption}">
        <div :class="{'icon-wrapper':true,'close':!isShowOption}" v-for="(item, index) in nav" :key="index">
          <router-link :to="item.url" :class="[item.class,{'icon-show': isShowOption}]">
            <div class="icon-box"></div>
            <p class="desc">{{'num' in item  ? `${item.text} (${item.num})` : item.text}}</p>
          </router-link>
        </div>
      </div>
    </div>
    <div class="mask qwui-nav_box_fixed" v-show="isShowOption" @touchmove="unScroll"></div>
  </div>
  
</template>

<script>
import {initHead,getTemplateTypeCount} from '../api/getData.js';
export default {
  props: {
    nav: {
      type: Array,
      defalt() {
        return []
      }
    }
  },
  data () {
    return {
      isShowOption: false,
      leaveTypeCount:{}
    };
  },
  created() {
    initHead();
    getTemplateTypeCount().then(res=>{
      this.leaveTypeRender(res.data)
    })
  },
  destroyed() {
    unLockScroll()
  },
  watch: {
    isShowOption(val) {
      if(val) {
        lockScroll();
      }else {
        unLockScroll()
      }
    }
  },
  methods: {
    showOption() {
      this.isShowOption = !this.isShowOption;
      dataBase.ZIndex[dataBase.ZIndex.curr] = false;
    },
    unScroll(event) {
      event.preventDefault();
    },
    // 判断请假类型 入口类型渲染
    leaveTypeRender(data){
      if(data.travel==0){
        this.filterNav('ic_add_trip')
      } 
      if(data.overtime==0){
        this.filterNav('ic_add_work')
      }
    },
    // 删选对象
    filterNav(str) {
      this.nav.filter((i,index)=>{
        if(i.class=== str){
          this.nav.splice(index,1)
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.btn-wrapper {
  padding-bottom: 100%;
  position: relative;
}
.btn-content {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  box-shadow: 0 5px 6px 2px rgba(0,0,0,.1);
  .line-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    background: #5585F0;
    transition: all .3s ease;
    z-index: 10;
    &.line-rotate {
      transform: rotate3d(0,0,1,225deg);
      background-color: #fff;
      .line {
        background: #b2b9c8;
      }
    }
    .line {
      background: #fff;
      position: absolute;
      &.horizon {
        height: 2px;
        width: 29.6%;
        top: 48.1%;
        left: 35.1%;
      }
      &.vertical {
        height: 29.6%;
        width: 2px;
        left: 48.1%;
        top: 35.1%;
      }
    }
  }
  .leave-type-list{
    position: fixed;
    width: 56px;
    height: 56px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    .icon-wrapper {
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      a {
        display: block;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        bottom: 2px;
        left: 3px;
        overflow: hidden;
        background-color: #fff;
        &.icon-show {
          overflow: visible;  
          box-shadow: 0 5px 6px 2px rgba(0,0,0,.1);
        }
        .icon-box {
          width: 100%;
          height: 100%;
          bottom: 0;
          left: 0;
          background-size: 21px;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 2;
          border-radius: 50%;
        }
        .desc {
          min-width: 50px;
          font-size: 14px;
          color:#0A1735;
          text-align: right;
          white-space: nowrap;
          position: absolute;
          top: 70px;
          z-index: 1;
        }
        &.ic_add_apply > .icon-box {
          background-image: url(../asset/img/icon_add_btn.png);
        }
        &.ic_add_trip .icon-box{
          background-image: url(../asset/img/ic_add_trip.png);
          background-size: 29px;
        }
        &.ic_add_work .icon-box{
          background-image: url(../asset/img/ic_add_work.png);
          background-size: 29px;
        }
        &.ic_draft > .icon-box {
          background-image: url(../asset/img/icon_draft_btn.png);
        }
      }
    }
    .icon-wrapper.close{
      flex:0;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  }
  .leave-type-list.show-list{
    width: 100%;
    transform: translate3d(0, -112px, 0);
    right: 0;
    overflow: unset;
    transition: all .3s ease-in-out;
    @media screen and (min-width: 1024px){
      width: 740px;
      right: 0;
      left: 0;
      margin: auto;
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  background-color: rgba(255,255,255, .9);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  transition: all .3s ease;
  z-index: -1;
}


</style>