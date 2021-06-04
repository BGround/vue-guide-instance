<template>
  <div class="setting-contract-branch">

    <iframe :src="src"
            frameborder="0"
            ref="iframe"></iframe>

    <div class="overlay"
         id="overlayDiv"
         style="display: none;"></div>
    <!-- imMsgBox -->
    <div class="modal-box"
         id="imMsgBox"
         style="display: none;">
      <div class="modal-header">
        <h3 id="imMsgBoxTitle">title</h3>
        <span class="modal-del"
              onclick="$('#imMsgBox').hide();$('#overlayDiv').hide();">×</span>
      </div>
      <div class="modal-body mt20">
        <div class="form-item">
          <p class="tc f14"
             id="imMsgBoxMsg">msg</p>
        </div>
        <div class="form-action tc mt20 mb30">
          <a id="imMsgBoxEnterBut"
             href="javascript:void(0);"
             class="btn orangeBtn twoBtn">确定</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import baseURL from "@/assets/js/baseURL_config";
export default {
  name: "settingContractBranch",
  data() {
    return {
      src: `${baseURL}/manager/crm/contract/contract_branch.jsp?agentCode=contract`
    };
  },
  created() {
    window.baseURL = baseURL;
    window._resetFrameHeight = function() {};
    window.frames.personFrame = "crm";
    window.$ = $;
    window._top_alert = dataBase.top_alert;
    /**验证最大字符，最小字符的设置**/
    window.checkMaxAndMiniVal = (obj, type) => {
      if ($(obj).val() != "") {
        if (type == 1) {
          //最小值
          if ($(obj).val() < 0) {
            $(obj).val(0);
          } else if ($(obj).val() > 2000) {
            $(obj).val(0);
          }
        } else if (type == 2) {
          //最大值
          if ($(obj).val() < 0) {
            $(obj).val(0);
          } else if ($(obj).val() > 2000) {
            $(obj).val(2000);
          }
        }
      }
    };
    this.loadFile();
    //loading
    dataBase.loading = true;
    setTimeout(() => {
      dataBase.loading = false;
    }, 10000);
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.iframe.onload = () => {
        dataBase.loading = false;
      };
    });
  },
  beforeDestroy() {
    document
      .getElementsByTagName("head")[0]
      .removeChild(document.querySelector("#jspStyle"));
    delete window.baseURL;
    delete window._resetFrameHeight;
    delete window.$;
    delete window._top_alert;
    delete window.checkMaxAndMiniVal;
  },
  methods: {
    loadFile(url, id) {
      let dom;
      dom = document.createElement("link");
      dom.id = "jspStyle";
      dom.type = "text/css";
      dom.href = `${baseURL}/manager/css/style.css`;
      dom.rel = "stylesheet";
      dom.async = "true";
      document.getElementsByTagName("head")[0].appendChild(dom);
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-contract-branch {
  iframe {
    width: 100%;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1100;
    filter: progid:DXImageTransform.Microsoft.gradient(enabled='true',startColorstr='#7F000000', endColorstr='#7F000000');
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-box {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 220px;
    /* margin-left: -250px;
  margin-top: -83px; */
    border: 2px solid #cccccc;
    z-index: 1105;
    background-color: #fff;
    transform: translate(-50%, -50%);
    -webkit-filter: blur(0);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
    -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
    border: 1px solid #cccccc;
    height: auto;
  }

  .modal-box .modal-header,
  .modal-box .modal-body,
  .modal-box .modal-footer {
    padding: 0 15px;
  }
  .modal-box .modal-header {
    height: 36px;
    text-align: right;
    border-bottom: 1px solid #cccccc;
  }
  .modal-box .modal-header h3 {
    float: left;
    display: inline;
    line-height: 36px;
    font-weight: bold;
  }
  .modal-box .modal-body {
    margin: 15px 0;
  }
  .modal-box .modal-body p {
    line-height: 20px;
  }
  .modal-box .modal-body div:last-child {
    height: 33px;
  }
  .modal-box .modal-footer {
    text-align: center;
    padding: 10px 15px;
  }
  .modal-box .modal-footer .btn {
    margin-left: 20px;
  }
  .modal-box .modal-del {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    padding: 0 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 6px;
  }
  .modal-box .modal-del:hover {
    background-color: whitesmoke;
    -webkit-border-radius: 6px;
    border-radius: 6px;
  }
  .tc {
    text-align: center;
  }
  .tl {
    text-align: left;
  }
  .orangeBtn {
    background: #C31725;
    color: #fff;
    border: 1px solid #f87b00;
  }
  .twoBtn {
    padding: 5px 20px;
    *padding: 4px 20px;
    _padding: 5px 20px;
  }

  .modal-box .modal-header {
    margin: 0 15px;
    height: 60px;
  }

  .modal-box .modal-header h3 {
    font-size: 18px;
    margin-top: 15px;
  }

  .modal-box .modal-del {
    margin-top: 20px;
  }
}
</style>
