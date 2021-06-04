<template>
  <div class="list-bar" :class="{bottomLine: bottomLine}">
    <div  v-for="item in option" 
          :key="item.type"
          class="bar_item"
          :class="{active: item.type === activeItem}"
          @click="dealClick(item.type)"
    >
      {{item.title}}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      activeItem: ''
    }
  },
  props: {
    option: {
      type: Array,
      default: null
    },
    active: {
      type: String,
      default: ''
    },
    bottomLine: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if(!this.active){
      this.activeItem = this.option[0].type;
    } else {
      this.activeItem = this.active;
    }
  },
  computed: {},
  methods: {
    dealClick(itemType){
      this.activeItem = itemType;
      this.$emit('changeBar', itemType)
    } 
  }
}
</script>
<style lang='scss' scoped>
@import '../../crmBase.scss';

.list-bar{
  position: relative;
  display: flex;
  background: #fff;
  padding: 0 15px;
  &.bottomLine{
    &:after{
      @include underLine;
      z-index: 0;
    }
  }
  &:before{
    @include topLine;
    z-index: 0;
  }
  .bar_item{
    line-height: 50px;
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: #333;
    &.active{
      border-bottom: 3px solid #468CEB;
      color: #468CEB;
      position: relative;
      z-index: 1;
    }
  }
}
</style>