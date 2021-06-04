<template>
  <div>
    <dl class="learn-leftMenu_dl"
        v-for="appItem in leftMenuData"
        :class="{ 'dt_borderBottom' : appItem.modules.length }"
    >
      <dt class="learn-leftMenu_dt"
          :class="{ hover : !appItem.modules.length ,
                   'dt_borderBottom' : !appItem.modules.length ,
                    active : activeIndex == appItem.routerName ,}"
          :title="appItem.appName"
          @click="!appItem.modules.length && activeIndex !== appItem.routerName && handleClick(appItem.routerName, appItem.redirectParam)"
      >
        <i class="dt_icon" :style="{ backgroundPosition: appItem.iconPosition }"></i>
        {{ appItem.appName }}
      </dt>
      <dd class="learn-leftMenu_dd hover"
          v-for="moduleItem in appItem.modules"
          :class="{ active : activeIndex == moduleItem.routerName ,}"
          @click="activeIndex !== moduleItem.routerName && handleClick(moduleItem.routerName, moduleItem.redirectParam)"
      >
        {{ moduleItem.moduleName }}
        <i class="dd_icon"></i>
      </dd>
    </dl>
  </div>
</template>

<script>

export default {
  name: 'leftMenu',

  components: {},

  props: {
    leftMenuData: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: String,
      required: true
    },
  },

  data() {
    return {}
  },

  computed: {},

  watch: {},

  created() {
  },

  methods: {
    handleClick(routerName, redirectParam) {
      this.$emit('leftMenuClick', routerName, redirectParam);
    },
  },

}
</script>

<style lang="scss" scoped>
  @import "../../style/config.scss";
  .learn-leftMenu_dl {
  padding-bottom: 6px;
  &.dt_borderBottom {
     border-bottom: 1px #e8e8e8 solid;
  }
  .learn-leftMenu_dt {
    position: relative;
    height: 44px;
    width: 100%;
    line-height: 44px;
    padding-left: 50px;
    font-size: 16px;
    color: #666;
    @include ellipsis
    &.dt_borderBottom {
       border-bottom: 1px #e8e8e8 solid;
    }
    .dt_icon {
      position: absolute;
      left: 20px;
      top: 11px;
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(~assets/images/mIcon.png) no-repeat;
      /*background-position: 0 -18px;*/
    }
  }
  .learn-leftMenu_dd {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding-left: 50px;
    .dd_icon {
      position: absolute;
      top: 14px;
      right: 31px;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url(~assets/images/arrow1.png) no-repeat;
    }
  }
  .hover {
    &:hover {
      background-color: #f4f5f9;
      cursor: pointer;
    }
  }
  .active {
    color: #fff;
    background-color: #C31725;
    .dd_icon {
      background: url(~assets/images/arrow2.png) no-repeat;
    }
    &:hover {
       background-color: #C31725;
    }
  }
}
</style>
