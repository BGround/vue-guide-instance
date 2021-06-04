<template>

  <el-dialog
          custom-class="preview-dialog"
          :visible.sync="isShowDialog"
          @closed="handleClose"
          width="1010px"
          center>
    <div class="updateTimePopWrap">
    <div class="popInfo2">
      <div class="titWrap mb10">
        <h4>培训照片</h4>
      </div>
      <div class="scrollWrap">
        <div class="hallImgList">
          <ul>
            <li v-for="(item,index) in getImages"
                :key="index">
              <img :src="item">
            </li>
          </ul>

          <no-data v-if="!getImages"></no-data>
        </div>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger" @click="closePhotoPop">确认</qwuiButton>
      </div>
    </div>

    </div>
      <span slot="footer" class="dialog-footer">

  </span>
  </el-dialog>

</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import noData from '@/components/list/noData'
export default {
  data() {
    return {
        isShowDialog: false,
    }
  },
  model:{
      prop: 'visible',
      event: 'change',
  },
  props:{
    visible:{
      type: Boolean,
    },
    images:{
        type: Array,
        default(){
            return []
        }
    },
  },
  watch:{
      visible(value){
          this.isShowDialog = value;
          console.log(this, this.isShowDialog)
      },
  },
  computed: {
      getImages(){
          console.log(this.images.map(item => _.fileDownURL + item))
          return this.images.map(item => _.fileDownURL + item);
      }
  },
  methods: {
    closePhotoPop() {
        this.isShowDialog = false;
        this.$emit('change', false)
    },
      handleClose(){
          this.$emit('change', false)
      }
  },
  components: {
    qwuiButton,noData
  }
}
</script>

<style lang="scss">
  .preview-dialog{
    .el-dialog__footer,
    .el-dialog__header,
    .el-dialog__body{
      padding: 0;
    }
  }
</style>

