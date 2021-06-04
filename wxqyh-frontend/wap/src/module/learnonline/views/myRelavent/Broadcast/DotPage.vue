<template>
  <div class="qwui-lean_dot_page">
    <div 
      class="dot_item"
      :class="{select: index == nowIndex}"
      v-for="(item, index) in dataList"
      :key="index"
      @click="dotPageClick(index)"
    ></div>
  </div>
</template>

<script>

export default {
  name: 'QwDotPage',
  components: {
  },
  props: {
    dataList: {
      type: Array,
      required: true
    },
    nowIndex: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed: {
  },
  methods:{
    dotPageClick(index) {
      this.$emit('update:nowIndex', index);
    }
  },
  created() {
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_dot_page {
  
  .dot_item {
    display: inline-block;
    width: 6px;
    margin: 0 4px;
    height: 6px;
    border-radius: 50%;
    background: #DAE1F0;
  }
  .select {
    width: 16px;
    background: #5585F0;
    border-radius: 4px;

    &:first-of-type {
      margin-left: 0px;
    }
    &:last-of-type {
      margin-right: 0px;
    }
  }
}
</style>
