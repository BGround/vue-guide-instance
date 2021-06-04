<template>
  <div class="footer-bar">
    <div class="tabbar-heaght"></div>
    <div class="tabber-bar qwui-tabbar">
      <router-link v-for="(item, index) in footerList"
                    :key="index"
                    :to="item.path"
                    class="tabber-route"
      >
        <span :class="[item.type == 'normal' ? 'tabber-icon' : 'add-newForm', item.class ? item.class : '']">
          <span class="tabber-tag" v-if="item.num > 0">
            {{item.num}}
          </span>
          <i class="nav-item-tip" v-if="item.hasTip"></i>
        </span>
        <p class="tabber-text" v-if="item.text">{{item.text}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footerList: {
      type: Array,
      default: []
    }
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../../../assets/images/';
.tabbar-heaght{
  height: 50px;
}
.tabber-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 49px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-top: 1px solid #f7f8fb;
  z-index: 9;
  .tabber-route {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .add-newForm {
      display: block;
      width: 36px;
      height: 36px;
      background-color: rgba(85,133,240,1);
      background-image: url($baseURL + 'btn_a-homepage_add@2x.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 16px;
      border-radius: 50%;
    }
    .tabber-icon {
      display: block;
      width: 22px;
      height: 22px;
      position: relative;
      background-size: 22px;
      background-repeat: no-repeat;
      background-position: center;
      .tabber-tag {
        display: block;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        padding: 0 4px;
        position: absolute;
        left: 17px;
        top: -2px;
        background: #FF586D;
        border: 2px solid #fff;
        border-radius: 12px;
      }
      .nav-item-tip {
        width: 6px;
        height: 6px;
        background: #FF586D;
        position: absolute;
        border-radius: 50%;
        top: -1px;
        right: -4px;
      }
    }
    .ic_tabar1 {
      background-image: url($baseURL + 'icon_a-tabbars_home_nor@2x.png');
    }
    &.router-link-active .ic_tabar1 {
      background-image: url($baseURL + 'icon_a-tabbars_home_pes@2x.png');
    }
    .ic_tabar2 {
      background-image: url($baseURL + 'icon_a-tabbars_upcoming_nor@2x.png');
    }
    &.router-link-active .ic_tabar2 {
      background-image: url($baseURL + 'icon_a-tabbars_upcoming_pes@2x.png');
    }
    .ic_tabar3 {
      background-image: url($baseURL + 'icon_a-tabbars_mine_pes@2x.png');
    }
    &.router-link-active .ic_tabar3 {
      background-image: url($baseURL + 'icon_a-tabbars_mine_nor@2x.png');
    }
    .ic_tabar4 {
      background-image: url($baseURL + 'icon_a-tabbars_mine_pes1@2x.png');
    }
    &.router-link-active .ic_tabar4 {
      background-image: url($baseURL + 'icon_a-tabbars_more_pes@2x.png');
    }
    .ic_tabar5 {
      background-image: url(~assets/images/ic_reimindex.png);
      background-position: -66px -44px;
      background-size: 88px;
    }
    &.router-link-active .ic_tabar5 {
      background-image: url(~assets/images/ic_reimindex.png);
      background-position: -66px -66px;
    }
    &.router-link-active .tabber-text {
      color: #0A1735;
    }
    .tabber-text {
      text-align: center;
      height: 10px;
      line-height: 10px;
      color: #B2B9C8;
      font-size: 10px;
      margin-top: 4px;
    }
  }
}
</style>