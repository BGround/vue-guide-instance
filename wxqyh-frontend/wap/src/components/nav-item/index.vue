<template>
  <div :class="cls({active})" @click="handleClick">
    <div :class="cls('icon',{dot})">
      <slot name="icon">
        <i v-if="icon" :class="['qwui-icon',icon]" />
      </slot>
      <div :class="cls('info')" v-if="info">{{maxLimit()}}</div>
    </div>
    <div :class="cls('text')">
      <slot/>
    </div>
  </div>
</template>
<script>
  import Mods from '../mixins/mods';
  import RouterLink from '../mixins/router-link';
  export default {
    name:'QwNavItem',
    mixins:[Mods,RouterLink],
    props:{
      icon: {
        type: String,
        default: ''
      },
      info: {
        type: [Number,String],
        default: ''
      },
      maxLimit:{
        type: Function,
        default: function () {
          return this.info > 99? '99+' : this.info;
        }
      },
      dot: {
        type: Boolean	,
        default: false
      }
    },
    data() {
      return {
        active: false
      }
    },
    beforeCreate() {
      this.$parent.items.push(this);
    },
    destroyed() {
      this.$parent.items.splice(this.$parent.items.indexOf(this), 1);
    },
    methods:{
      //点击当前导航
      handleClick(event){
        //判断当前导航的索引
        this.$parent.handleChange(this.$parent.items.indexOf(this));
        this.$emit('click', event);
         this.routerLink();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
