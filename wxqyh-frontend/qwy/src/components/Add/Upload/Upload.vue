<template>
  <div>
    <el-dialog title="批量导入" :visible.sync="showUpolad" @close='closeDialog'>
      <div class="cMain">
        <div class="ImportContact pb30">
          <div class="importSetp">
            <div class="importTitle clearfix">
              <h3>1</h3><span>下载导入模版</span>
            </div>
            <div class="importContent pl30">
              <p class="mt15"><a href="javascript:;" style="color: #C31725" @click="doExpertTemp">点此下载导入模板</a></p>
              <p class="mt10 f12 f999">请在下载下来的Excel文档里将对应字段信息输入或粘贴进去。为保障粘贴信息被有效导入，请使用纯文本或数字。</p>
            </div>
          </div>
          <div class="importSetp mt50">
            <div class="importTitle clearfix">
              <h3>2</h3><span>导入编辑好的Excel文档</span>
            </div>
            <div class="importContent pl30">
              <form role="form" id="id_form_save" method="post" enctype="multipart/form-data">
                <p class="mt15">
                  <input type="file" ref="upFile" name="upFile" id="upFile" @change="handleChange">
                </p>
                <p class="mt10 f12 f999" style="line-height: 22px;">请选择编辑好的Excel文档，点击“批量导入”进行用户批量导入<span
                  style="color:red">(文件大小不能超过10M)</span>
                </p>
                <p class="mt10">
                  <button permission="" type="button" class="btn orangeBtn" @click="doImport">批量导入</button>
                </p>
              </form>
            </div>
            <div class="importSetp mt50">
              <div class="importTitle clearfix">
                <h3>3</h3><span>导入结果</span>
              </div>
              <div class="importContent pl30">
                <p>{{process}}</p>
                <p>{{errorlist}}</p>
                <div id="errorId" v-show="exportErrorData">
                  <p class="mt10" id="xuanzhe">
                    <button permission="" type="button" id="butUpload" class="btn orangeBtn" @click="doExportError">
                      导出错误数据
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {noop} from '@/assets/js/utils/util.js';

  export default {
    props: {
      isImportPopShow: {
        type: Boolean,
        default: true,
      },
      multiple: {
        type: Boolean,
        default: true,
      },
      onSuccess: {
        type: Function,
        default: noop,
      },
      autoUpload: {
        type: Boolean,
        default: true,
      },
      beforeUpload: {
        type: Function,
      },
      limit: {
        type: Number,
      },
      fileList: {
        type: Array
      },
      onExceed: {
        type: Function,
      },
      reportType: {
        type: String,
      },
    },
    data() {
      return {
        exportErrorData: false,
        process: "",
        errorlist: "",
        errorId: "",
        showUpolad: false,
        isImportPopInnershow: false,
        filesItem: {},
      }
    },
    watch: {
      isImportPopShow: function (val) {
        if (val) this.showUpolad = true;
      },
    },
    methods: {
      initializationData(){
        this.exportErrorData = false;
        this.process = "";
        this.errorlist = "";
        this.errorId = "";
      },
      closeDialog() {
        this.showUpolad = false;
        this.isImportPopInnershow = false;
        this.initializationData();
        this.filesItem = {}
        this.$refs.upFile.value =''
        this.$emit('closeDialog', false);
      },
      // 点击下载模板
      doExpertTemp() {
        window.location.href = _.baseURL + "/taskinfo/fileUploadMgr/fileUploadMgrAction!exportTemplate.action?reportType=" + this.reportType;
      },
      //  点击批量导入
      doImport() {
        if (this.filesItem.files==null){
          this.$notify.error({
            title: '系统提示',
            message: '请选择文件！'
          });
          return;
        }
        this.$confirm('此操作将进行批量导入, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploadFiles(this.filesItem.files);
        });
      },
      // 点击错误
      doExportError() {
        window.location.href = _.baseURL + "/taskinfo/fileUploadMgr/fileUploadMgrAction!exportErrorBusiness.action?id=" + this.errorId + "&reportType=" + this.reportType;
      },

      handleChange(e) {
        this.filesItem = {};
        let files = e.target.files;
        let size = files[0].size;
        size = size/(1024*1024);
        if (!files) {
          return;
        }
        let extName = files[0].name.substring(files[0].name.lastIndexOf(".")).toLowerCase();
        let AllUpExt = ".xls|.xlsx|";
        if(AllUpExt.indexOf(extName + "|") == "-1"){
          this.$notify.error({
            title: '系统提示',
            message: '文件格式不正确！'
          });
          this.$refs.upFile.value =''
          return;
        }else{
          if(size > 10){  // 10M
            this.$notify.error({
              title: '系统提示',
              message: '文件过大！'
            });
            this.$refs.upFile.value =''
            return;
          }else {
            this.filesItem.files = files;
          }
        }
      },
      uploadFiles(files) {
        let postFiles = Array.prototype.slice.call(files);
        let self = this;
        if (!this.multiple) {
          postFiles = postFiles.slice(0, 1);
        }
        if (postFiles.length === 0) {
          return;
        }
        Promise.all(postFiles.map(function (rawFile) {
          dataBase.loading = true;
          return new Promise(function (resolve, reject) {
            if (self.autoUpload) {
              self.upload(rawFile, resolve, reject);
            }
          });
        })).then(function (data) {
          self.onSuccess(data);
          dataBase.loading = false;
          dataBase.top_alert('上传成功', true, 3000);
        }).catch(e => {
          dataBase.loading = false;
        });
      },
      upload(rawFile, resolve, reject) {
        if (!this.beforeUpload) {
          this.post(rawFile, resolve, reject);
        }
        let before = this.beforeUpload(rawFile);
        if (before) {
          this.post(rawFile, resolve, reject);
        } else {
          reject();
        }
      },
      post(rawFile, resolve, reject) {
        let self = this;
        let fileUpdataUrl = _.baseURL + '/taskinfo/fileUploadMgr/fileUploadMgrAction!batchImportExles.action';
        try {
          // FormData 对象
          let form = new FormData();
          form.append("type", "0");          // 可以增加表单数据
          form.append("reportType", this.reportType);
          form.append("upFile", rawFile);              // 文件对象
          let xhr = new XMLHttpRequest();
          try {
            xhr.open("post", fileUpdataUrl, true);
          } catch (e) {
            dataBase.top_alert('导入失败', false, 3000);
            reject();
            return;
          }
          xhr.onload = function () {
            let result = eval("(" + xhr.responseText + ")");
            if ('0' == result.code) {
              self.initializationData();
              setTimeout(function () {
                self.viewImportProcess(result.data.id);
              },3000)
              self.errorId = result.data.id;
              resolve(result.data.mediaInfo);
            } else {
              dataBase.top_alert('导入失败', false, 3000);
              reject();
            }
          }
          xhr.send(form);
        } catch (e) {
          dataBase.top_alert('导入失败', false, 3000);
          reject();
          return;
        }
      },
      viewImportProcess(id) {
        let self = this;
        let fileUpdataUrl = _.baseURL + '/taskinfo/fileUploadMgr/fileUploadMgrAction!viewImportProcess.action?reportType=' + self.reportType + "&id=" + id;
        try {
          let xhr = new XMLHttpRequest();
          try {
            xhr.open("get", fileUpdataUrl, true);
          } catch (e) {
            dataBase.top_alert('查询失败', false, 3000);
            return;
          }
          xhr.onload = function () {
            let result = eval("(" + xhr.responseText + ")");
            if ('0' == result.code) {
              var processNum = result.data.processNum;
              var totalNum = result.data.totalNum;
              var isFinish = result.data.isFinish;
              self.process = "已处理条数：" + processNum + "/" + "总条数" + totalNum;
              if (isFinish) {
                var errorlist = result.data.errorlist;
                if (totalNum != "0") {
                  if (errorlist == null || errorlist == "" || errorlist.length == 0) {
                    self.errorlist = "导入成功！";
                  } else {
                    self.errorlist = "导入失败条数：" + errorlist.length;
                    self.exportErrorData = true;
                  }
                }
              }
            } else {
              dataBase.top_alert('查询失败', false, 3000);
            }
          }
          xhr.send();
        } catch (e) {
          dataBase.top_alert('查询失败', false, 3000);
          return;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper .el-dialog{
    width: 800px;
  }
  .ImportContact { width: 600px; margin: 0 auto; }
  .importTitle { height: 40px; line-height: 34px;vertical-align: middle; border-bottom: 1px dashed #b6b6b6;}
  .newImportContact .importTitle { height: 35px; line-height: 35px;border-bottom: none; }
  .importTitle h3 {
    font-family: Georgia;
    font-size: 48px;
    color: #b6b6b6;
    float: left;
    line-height: 24px;
    font-style: italic;
  }
  .importTitle span {
    margin-left: 10px;
  }

  .mt50 {
    margin-top: 30px;
  }
  #id_form_save .mt10.f12.f999 {
    margin-top: 20px;
  }
  #xuanzhe {
    border-bottom: 1px dashed #ababab;
    color: red;
    margin-bottom: 20px;
    padding-bottom: 10px;
    margin-top: 20px;
  }
  #xuanzhe input{margin-right: 10px;}
  #xuanzhe .orangeBtn{width: 150px;}
</style>
