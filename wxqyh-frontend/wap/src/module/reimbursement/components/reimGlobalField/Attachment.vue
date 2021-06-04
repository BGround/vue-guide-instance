<template>
  <div class="qwui-attachment-container">
    <!--上传附件-->
    <qw-cell
      class="qwui-attachment_head"
      :label="$t(`i18n.reim.field.${field.field}`) + `(${mediaList.length})`"
      :isMust="field.isMust">
      <span class="qwui-add_icon" slot="title">{{$t('i18n.upload')}}</span>
      <file-detail
        slot="tip"
        class="qwui-file_detail"
        agent="reimbursement"
        :filesList="mediaList"
        :deleteFileList="deleteFileList"
      >
      </file-detail>
    </qw-cell>
    <!--附件列表-->
    <add-file-list
      v-if="mediaList && mediaList.length"
      agent="reimbursement"
      customClass="file_list_len"
      :filesList="mediaList"
      :deleteFile="true"
      @deleteFileItem="deleteFileItem">
    </add-file-list>
  </div>
</template>

<script>
import QwCell from '../reimDetailField/Cell';
import FileDetail from '@/components/add/upload/add_file';
import AddFileList from '@/components/add/upload/addFileList';

export default {
  name: 'QwAttachment',
  props: {
    field: Object,
    vo: Object,
  },
  components: {
    QwCell,
    FileDetail,
    AddFileList
  },
  data() {
    return {
      // 文件附件
      mediaList: [],
      // 删除文件附件
      deleteFileList:{},
    }
  },
  watch: {
    mediaList(list) {
      this.vo.mediaIds = list.map(media => media.id).join(',');
      this.vo['tbQyReimbursementPO.attachmentCount'] = list.length;
    },
  },
  methods: {
    deleteFileItem(item){
      this.deleteFileList = item;
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';
  .qwui-attachment_head {
    position: relative;
    padding-left: $box-padding !important;

    .qwui-file_detail {
      position: absolute;
      top: 0;
      right: 15px;
      overflow: hidden;
      opacity: 0;
    }
  }

  .qwui-add_icon {
    flex: 1;
    text-align: right;
    font-size: $font-size-medium-s;
    color: $color-sub-theme;
  }
</style>

