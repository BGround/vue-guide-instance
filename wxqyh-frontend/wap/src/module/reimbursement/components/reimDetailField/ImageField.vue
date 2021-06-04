<template>
  <div class="qwui-image_container border-bottom-1px">
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="false"
      :isMust="field.isMust === '1'"
    ></qw-cell>
    <div>
      <add-img
        class="qwui-image" 
        :dataDetailMsg="this.$parent.imgUpload"  
        @listenToChild="getMsgFromImgDetail"></add-img>
    </div>
  </div>
</template>

<script>
import QwCell from './Cell';
import AddImg from '@/components/add/add_img';

export default {
  name: 'QwImageField',
  components: {
    QwCell,
    AddImg,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  data() {
    return {
    }
  },
  methods: {
    // 添加图片
    getMsgFromImgDetail(imgList) {
      this.fieldValue.imgList = imgList.join(',');
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';
  .qwui-image_container {
    padding-bottom: 1px;

    .qwui-image {
      margin: -15px 1px 0 -18px;
    }
  }
</style>


