<template>
  <div
    class="fieldView"
    @click.stop="publishCurrentField({FieldItem,index})"
    :class="{'active': currentIndex === index}"
  >
    <div class="fieldView-item">
      <slot name="currentComponent"></slot>
    </div>
    <div
      class="fieldView-action"
      v-show="currentIndex === index"
    >
      <div
        class="fieldView-action-button fieldView-edit"
        @click="edit"
      >
        <span class="action-icon"></span>编辑
      </div>
      <div
        class="fieldView-action-button fieldView-delete"
        @click.stop="deleteSelectType(index)"
      >
        <span class="action-icon"></span>删除
      </div>
      <div
        class="fieldView-action-button fieldView-move-up"
        @click.stop="moveItem({index,replaceIndex:index-1})"
        v-show="FieldData[index-1]"
      >
        <span class="action-icon"></span>上移
      </div>
      <div
        class="fieldView-action-button fieldView-move-down"
        @click.stop="moveItem({index,replaceIndex:index+1})"
        v-show="FieldData[index+1]"
      >
        <span class="action-icon"></span>下移
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions} from 'vuex'
  import mixinUtils from '../mixin'

  export default {
    name: "fieldViewGroup",
    props: {
      FieldItem: Object,
      index: Number,
    },
    mixins:[mixinUtils],
    methods: {
      ...mapActions([
        "moveItem"
      ]),
      edit() {
        this.selectCurrentType({data:this.FieldItem,isEdit:true})
        this.$router.push('/formdesign/setting')
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../css/fieldView";
</style>

