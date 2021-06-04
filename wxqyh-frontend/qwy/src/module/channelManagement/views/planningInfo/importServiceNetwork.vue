<template>
  <div>
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwuiButton @click="handleBack">&nbsp;返回&nbsp;</qwuiButton>
      </div>
    </div>

    <div class="fl ml30">
      <div class="ad-title">批量导入</div>
      <div>1、导入须知：</div>
      <p class="ad-explain">
        • 请使用最新的导入模板，文件不能大于15M，内容用纯文本或数字填写；<br />
        <!-- • 模板中成员账号不能为空，并且只能是唯一的；<br>
        • 如需更新已存在的成员数据，可先导出最新的数据，修改后上传 -->
      </p>
      <a href="javascript:;" style="color:#f87b00" @click="download" v-show="fileUrl" >下载导入文件</a>
      
      <!-- <span class="ml30" style="color:red;">已于2018年11月06日更新</span> -->
      <form ref="form">
        <div class="mt10 mb20">
          2、<label class="ad-up-load" for="upFile">选择导入文件</label
          ><span class="ml10"></span>
          <input
            type="file"
            ref="file"
            @change="handleInputFile($event)"
            name="upFile"
          />
          <!-- <input type="hidden" name="type" value="" /> -->
          
        </div>
        <div class="mb20">
          <label
            ><input type="checkbox" name="gengx" v-model="isForceUpdate"/><span
              class="ml10"
              >以导入文件为准，更新已存在的数据</span
            ><span class="f999"></span
          ></label>
        </div>
        <button
          permission="contactEdit"
          type="button"
          @click.prevent="handleSubmit"
          class="btn orangeBtn"
        >
          批量导入
        </button>
        <p class="mt20" id="process"></p>
        <p id="errorlist"></p>
      </form>
    </div>
  </div>
</template>

<script>
import {
  importServiceNetworkPlan,
  translate
} from "@/module/channelManagement/api/getData";
import qwuiButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
export default {
  components: {
    qwuiButton
  },
  data() {
    return {
      isForceUpdate: false,
      uploadFile: null,
      fileUrl: '',
    };
  },
  methods: {
    handleInputFile(event) {
      if (event.target.files[0]) {
        this.uploadFile = event.target.files[0];
      }
    },

    download(){
      window.open(_.fileDownURL + this.fileUrl)
    },

    handleBack() {
      this.$router.back();
    },

    reset() {
      this.isForceUpdate = false;
      this.uploadFile = null;
      this.$refs['file'].value = '';
      // this.fileUrl = '';
    },

    handleSubmit() {
      if (!this.uploadFile) {
        return;
      }
      // const form = {
      //   uploadFile: this.uploadFile,
      //   isForceUpdate: this.isForceUpdate ? '1' : '0'
      // }
      const isForceUpdate = this.isForceUpdate ? "1" : "0";
      const formdata = new window.FormData();
      formdata.append("uploadFile", this.uploadFile);
      formdata.append("isForceUpdate", isForceUpdate);
      importServiceNetworkPlan(formdata).then(data => {
        if(data){
          this.fileUrl = data.downUrl;
          console.log(this.fileUrl);
          this.reset();
          _.alert("提示", '导入成功');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ad-title {
  font-weight: 400;
  font-size: 20px;
  padding-bottom: 20px;
}

.ad-explain {
  color: #999;
  font-size: 12px;
  line-height: 2;
  padding: 10px 0 30px;
}

#container {
  min-width: 600px;
  min-height: 767px;
}
@mixin tip-style {
  display: inline-block;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  margin-right: 5px;
  padding: 2px 5px;
  background: #32cd32;
}
@mixin pt15 {
  padding-top: 15px;
}
@mixin pt20 {
  padding-top: 20px;
}
.qwui-dotted_line {
  border-right: 1px dashed #cfcfcf;
  margin: 0 8px 0 5px;
}

.qwui-top_main_bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  @include pt20;
  .qwui-bar_left {
    flex: 1;
  }
  .qwui-bar_right {
    .qwui-senior_search_btn {
      cursor: pointer;
      float: right;
      font-size: 12px;
      height: 35px;
      line-height: 16px;
      margin: 0 5px;
      padding: 0 3px;
      text-align: center;
      width: 30px;
      color: #f87b00;
      user-select: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.qwui-map_wrap {
  @include pt15;
  .qwui-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .qwui-set_top {
      @include tip-style;
    }
    .qwui-secret {
      @include tip-style;
      background: #ff574d;
    }
    .goLink {
      color: #f87b00;
      text-decoration: underline;
    }
  }
}
</style>
