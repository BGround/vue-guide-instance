<template>
  <div class="footer-bar">
    <div class="tabbar-heaght"></div>
    <div class="tabber-bar qwui-tabbar">
      <router-link v-for="(item, index) in footerList"
                    :key="index"
                    :to="{name: item.name}"
                    exact
                    replace
                    class="tabber-route"
      >
        <span :class="[item.type == 'normal' ? 'tabber-icon' : 'addnew', item.class ? item.class : '']">
          <span class="tabber-tag" v-if="item.num > 0">
            {{item.num}}
          </span>
        </span>
        <p class="tabber-text" v-if="item.text">{{$t(item.text)}}</p>
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
    .addnew {
      display: block;
      width: 36px;
      height: 36px;
      background-color: rgba(85,133,240,1);
      background-image: url(~assets/images/reim/btn_homepage_add@2x.png);
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
        min-width: 8px;
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
    }
    .ic_tabar1 {
      background-image: url(~assets/svg/ic_reim_tabbar_reim.svg);
    }
    &.router-link-active .ic_tabar1 {
      background-image: url(~assets/svg/ic_reim_tabbar_reim_active.svg);
    }
    .ic_tabar2 {
      background-image: url(~assets/svg/ic_reim_tabbar_approve.svg);
    }
    &.router-link-active .ic_tabar2 {
      background-image: url(~assets/svg/ic_reim_tabbar_approve_active.svg);
    }
    .ic_tabar3 {
      background-image: url(~assets/svg/ic_reim-tabbar_relative.svg);
    }
    &.router-link-active .ic_tabar3 {
      background-image: url(~assets/svg/ic_reim-tabbar_relative_active.svg);
    }
    .ic_tabar4 {
      background-image: url(~assets/svg/ic_reim-tabbar_mine_pes.svg);
    }
    &.router-link-active .ic_tabar4 {
      background-image: url(~assets/svg/ic_reim-tabbar_mine_pes_active.svg);
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