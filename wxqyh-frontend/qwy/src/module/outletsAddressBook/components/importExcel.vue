<template>


<div class="import-excel">

  <div class="cMain">
    <div class="ImportContact pb30">
      <div class="importSetp">
        <div class="importTitle clearfix">
          <h3>1</h3><span>下载导入模版</span>
        </div>
        <div class="importContent pl30">
          <p class="mt15"><a href="javascript:;" @click="handleClickDownloadTemplate">点此下载导入模板</a></p>
          <p class="mt10 f12 f999">请在下载下来的Excel文档里将对应字段信息输入或粘贴进去。为保障粘贴信息被有效导入，请使用纯文本或数字。</p>
        </div>
      </div>
      <div class="importSetp mt50">
        <div class="importTitle clearfix">
          <h3>2</h3><span>导入编辑好的Excel文档</span>
        </div>
        <div class="importContent pl30">
          <form role="form" id="id_form_save">
            <p class="mt15">
              <input type="file" @change="handleChangeFile" id="upFile">
            </p>
            <p class="mt10 f12 f999" style="line-height: 22px;">请选择编辑好的Excel文档，点击“批量导入”进行用户批量导入<span style="color:red">(文件大小不能超过10M)</span>
            </p>
            <p class="mt10">
              <input type="checkbox" v-model="gengx" id="gengx">需要更新现有数据<br><br>
              <button  type="button" :disabled="isLoading"  class="btn orangeBtn" @click="submit">批量导入</button>
              <input type="hidden" v-model="type" value="">
            </p>
          </form>
        </div>
      </div>
      <div class="importSetp mt50">
        <div class="importTitle clearfix">
          <h3>3</h3><span>导入结果</span>
        </div>
        <div v-if="isVisibleResult" class="importContent pl30">
          <p></p>

          <p></p>
          <!-- <p id="errorNum"></p> -->

          <div class="importContent pt30">
            <p >已处理条数：{{processNum}}/总条数{{totalNum}}</p>

            <p ><br> 导入失败条数：{{errorlist.length}}<br></p>

            <div v-if="errorlist.length">
              <p class="mt10" id="xuanzhe">
                <button type="button" class="btn orangeBtn" @click="handleClickDownloadError">导出错误数据</button>
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script>

  import Qs from 'qs';

  import { batchImportExles, viewImportProcess } from "../api/common/getData";

export default {
  components: {

  },
    props:{
        reportType:{
            type:String,
            required: true,
        }
    },
    computed:{
      getReportType(){
          return this.reportType;
      }
    },
  data() {
    return {
        gengx: false,
        upFile: null,
        type: false,
        errorId: '',
        totalNum:0,
        processNum:0,
        isVisibleResult: false,
        errorlist: [],
        isFinish: false,
        isLoading: false,
    };
  },
  methods: {

      handleClickDownloadTemplate(){
          const query = {
              reportType: this.getReportType,
          }
          const queryString = Qs.stringify(query)
          window.location.href = _.baseURL  + "/mgr/fileUploadMgr/fileUploadMgrAction!exportTemplate.action?" + queryString;
      },

      //错误数据
      handleClickDownloadError(){
          const query = {
              reportType: this.getReportType,
              id:this.errorId,
          }
          const queryString = Qs.stringify(query)
          window.location.href =  _.baseURL + "/mgr/fileUploadMgr/fileUploadMgrAction!exportErrorBusiness.action?" + queryString;
      },

      handleChangeFile(event){
          const file = event.target.files[0];
          if(!file.name.includes('.xls')){
              this.upFile = '';
              event.target.value = '';
              this.$message('请检查你选择的文件!');
              return ;
          }
          this.upFile = file;
      },


      showProcess(id){
          const params = {
            reportType:this.getReportType,
            id:id,
          };
          return  viewImportProcess(params).then((data)=>{
              this.totalNum = data.totalNum;
              this.isFinish = data.isFinish;
              this.processNum = data.processNum;
              this.errorlist = data.errorlist ? data.errorlist: []
          }).finally(()=>{
              this.isVisibleResult = true;
          })
      },


      submit(){
          const form = {
              upFile: this.upFile,
              type:  this.gengx? '1': '0',
              reportType: this.getReportType,
          }
          this.isLoading= true;
          batchImportExles(form).then((data)=>{
            if(data){
                this.errorId = data.id;
                const timer = window.setInterval(()=>{
                    if(this.isFinish){
                        this.isLoading= false;
                        clearInterval(timer);
                    }else{
                        this.showProcess(data.id)
                    }
                },3000)

            }
          })
      }

  }
};
</script>

<style lang="scss" scoped>

  .importTitle h3 {
    font-family: Georgia;
    font-size: 48px;
    color: #b6b6b6;
    float: left;
    line-height: 24px;
    font-style: italic;
  }

  .importTitle {
    height: 40px;
    line-height: 34px;
    vertical-align: middle;
    border-bottom: 1px dashed #b6b6b6;
  }


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
  .newImportContact .importTitle h3 {
    display: inline-block;
    width: 34px;
    font-size: 21px;
    line-height: 34px;
    vertical-align: middle;
    text-align: center;
    border-radius: 50%;
    font-family: cursive;
    font-style: normal;
    color: #fff;
    background-color: #b6b6b5;
  }

  .importTitle span {
    /*float: left;*/
    margin-left: 10px;
    margin-top: 6px;
  }
  .newImportContact .importTitle span {
    margin-left: 25px;
  }

  .import-excel{
    padding: 0 30px;
  }

  .cTitle {
    background-color: #f8f8f8;
    border-bottom: 1px solid #dbdbdd;
    height: 47px;
    line-height: 47px;
    margin-top: 15px;
  }

</style>
