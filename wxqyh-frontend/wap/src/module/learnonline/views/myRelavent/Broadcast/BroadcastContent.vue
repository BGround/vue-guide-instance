<template>
  <div 
    class="qwui-lean_broadcast_content" 
    :style="{width: wrapWidth, left: wrapLeft}"
  >
    <div 
      class="image_wrap"
      :style="{width: clientWidth + 'px'}"
      v-for="(item, index) in dataList"
      :key="index"
    >
      <img 
        class="image"
        :src="item.src" 
        :style="{left: item.relativeDisplacement + 'px'}"
        draggable="false"
      >
    </div>
  </div>
</template>

<script>

export default {
  name: 'QwBroadcastContent',
  props: {
    dataList: {
      type: Array,
      required: true
    },
    nowIndex: {
      type: Number,
      required: true
    },
    relativeDisplacement: { // 相对位移
      type: Number,
      required: true
    },
    title: { // 路由title
      type: String,
      default: ''
    },
    parentWidth: { // 父元素宽度，如果没有则取全屏宽度
      type: Number,
      default: 0
    },
  },
  data(){
    return {
    };
  },
  computed: {
    clientWidth() {  // 父元素宽度，如果没有则取全屏宽度
      return this.parentWidth || document.documentElement.clientWidth;
    },
    wrapWidth() {
      return this.dataList.length * this.clientWidth + 'px';
    },
    wrapLeft() {
      let left = -this.clientWidth * this.nowIndex;
      left += this.relativeDisplacement;
      return  left + 'px';
    },
  },
  methods:{

  },
  created() {
    if (this.title) {
      document.title = this.title;
    }
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_broadcast_content {
  position: relative;
  margin-top: 13%;
  transition: left 0.2s ease 0s;

  .image_wrap {
    display: inline-block;
    text-align: center;
    .image {
      position: relative;
      height: 79.15vh;
    }
  }
}
</style>
