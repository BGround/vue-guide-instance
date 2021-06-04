<template>
    <div>
      <p class="fieldView-title">
        {{FieldItem.label}}
        <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
      </p>
      <span :class="ICON[FieldItem._type]"></span>
    </div>
</template>

<script>
  import Map from '../data/DesignerMap'
  const ICON = {
    [Map.ImageField]: 'image_addIcon',
    [Map.AccessoryField]: 'qwui-user_select_addpic',
  }
  export default {
    name: "ImageField",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data() {
      return {
        ICON
      }
    }
  }
</script>

<style scoped>
  .image_addIcon,.qwui-user_select_addpic {
    display: inline-block;
    width: 48px;
    height: 48px;
    background: url("~assets/images/qwui-icon_addImage.png") no-repeat 0 0;
    background-size: 100% 100%;
    vertical-align: middle;
  }
  .qwui-user_select_addpic {
    background: url("~assets/images/ic_file_default.png") no-repeat 0 0;
  }
</style>
