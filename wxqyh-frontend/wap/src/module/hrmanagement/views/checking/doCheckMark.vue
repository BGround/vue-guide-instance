<template>
  <div id="doCheckMark" class="wrap">
    <div class="qwui-mark_header">
      <div class="qwui-headPic">
        <img
          v-if="targetObj.headPic!='0'&& targetObj.headPic!=''"
          :src="targetObj.headPic"
          class="headPic"
        >
        <img v-else src="~assets/images/icon_person.png">
      </div>
      <span class="qwui-personName">{{targetObj.personName}}</span>
      <span
        v-if="status=='0' && markStatus=='1'"
        class="qwui-get_sorce"
        :title="targetObj.position"
      >{{targetObj.position}}</span>
      <span v-if="status=='1' && markStatus=='2'" class="qwui-get_sorce">未评分</span>
      <span v-if="status=='2' && markStatus=='2'" class="qwui-get_sorce">部分未评分</span>
    </div>
    <div class="qwui-progress_bar">
      <span :style="styleObject"></span>
    </div>
    <div class="qwui-mark_content">
      <div class="qwui-mark_question" v-for="(item,i) in markContentList" :key="i">
        <div class="qwui-question_title" @click="toggleSystem(i)">
          <div class="qwui-left_content">
            <span class="desc">{{1+i}}、{{item.name}}</span>
            <span class="score">（{{item.maxScore}}）分</span>
            <span class="blue_flag" v-if="item.calculateType == '0'">系统评分</span>
            <span
              class="help_icon"
              @click.stop.prevent="instructions(i)"
              v-if="item.description !== ''"
            >
              <img src="~assets/images/icon_help.png" alt>
            </span>
          </div>
          <span
            class="show_content_icon down"
            v-if="item.calculateType == '0' && item.systemRankShow == 0"
          ></span>
          <span
            class="show_content_icon up"
            v-if="item.calculateType == '0' && item.systemRankShow == 1"
          ></span>
          <p
            class="no_match"
            v-if="item.calculateType==='0' && !item.detailPO.itemId"
          >没有匹配：该题目没有匹配的选项，需到员工花名册维护</p>
        </div>
        <div class="qwui-question_content">
          <ul v-if="item.calculateType==='1' || item.calculateType==='0'">
            <li
              v-if="item.calculateType == '1' || item.systemRankShow == 1"
              v-for="(itemJ,j) in item.indexItemsList"
              :key="j"
              @click="item.calculateType != '0' && clickItem(item,itemJ)"
              :class="{active:item.selectItem===itemJ}"
              class="qwui-list_item"
            >
              <div v-if="item.calculateType != '0'" class="flexbox">
                <i class="fa" :class="{disabled:status=='1' && markStatus=='2'}"></i>
                <div class="question_select_title flexItem c333">
                  {{itemJ.name}}
                  <span class="pl5 c999">({{itemJ.score}}分)</span>
                </div>
              </div>
              <div v-if="item.calculateType == '0'" class="flexbox">
                <i class="fa disabled" :class="{disable_chose: itemJ.id == item.detailPO.itemId}"></i>
                <div class="question_select_title flexItem c999">
                  {{itemJ.name}}
                  <span class="pl5">({{itemJ.score}}分)</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="qwui-content_box" v-else>
            <div class="one_common">
              <div class="common_title">
                <span class="mr10">评分</span>
                <input
                  type="text"
                  class="input_sort"
                  v-model="item.comment.score"
                  v-if="status=='1' && markStatus=='2'"
                  disabled="disabled"
                  placeholder="无"
                  value="无"
                >
                <input
                  type="number"
                  class="input_sort"
                  v-else
                  @change="doOnblur"
                  v-bind:data-id="item.id"
                  v-model="item.comment.score"
                  min="0"
                  placeholder="请输入"
                >
              </div>
            </div>
            <div class="one_common">
              <div class="common_title">评语</div>
              <div class="input_wrap">
                <input
                  type="text"
                  class="disableInput"
                  v-model="item.comment.answer"
                  v-if="status=='1' && markStatus=='2'"
                  disabled="disabled"
                  placeholder="无"
                  value="无"
                >
                <textarea
                  class="common_text"
                  v-model="item.comment.answer"
                  v-else
                  placeholder="请输入"
                  v-bind:data-id="item.id"
                  maxlength="280"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="divLine" v-show="item.calculateType == '0' && item.systemRankShow == 0"></div>
        </div>
      </div>
      <div :class="{hidden:status=='1' && markStatus=='2'}" style="height: 84px;"></div>
    </div>
    <div class="footer_btn" :class="{hidden:status=='1' && markStatus=='2'}">
      <div class="fbtns">
        <span class="btn" @click="submit">提交</span>
      </div>
    </div>
  </div>
</template>
<script>
import { loadForMark, doMark } from "../../api/getData";
import axios from "axios";
export default {
  name: "doCheckMark",
  data() {
    return {
      params: {
        targetId: ""
      },
      markContentList: [],
      targetObj: {},
      status: "",
      markStatus: "",
      arrData: [],
      humanRating: 0,
      totalRating: 0,
      ableSubmit: true,
      styleObject: {},
      subMitParams: {
        targetId: "",
        index: "",
        refId: "",
        flownodeId: ""
      }
    };
  },
  created() {
    this.params.targetId = this.$route.query.targetId;
    this.status = this.$route.query.status;
    this.markStatus = this.$route.query.markStatus;
    this.getLoadMark();
  },
  methods: {
    getLoadMark() {
      _.showLoading("");
      axios
        .post(
          _.baseURL + "/portal/portalHrMarkAction!loadForMark.action",
          this.params
        )
        .then(result => {
          if (result.code == "0") {
            _.hideLoading();
            let data = result.data;
            this.targetObj = data.target;
            //格式化头像
            if (
              this.targetObj.headPic.length > 0 &&
              this.targetObj.headPic !== "0"
            ) {
              if (this.targetObj.headPic.indexOf("http") < 0) {
                this.targetObj.headPic = _.compressURL + this.targetObj.headPic;
              }
            }
            data.total.forEach(function(item) {
              item.comment = { score: "", answer: "" };
            });
            this.markContentList = data.total;
            for (var i = 0; i < this.markContentList.length; i++) {
              if (
                this.markContentList[i].calculateType == "1" ||
                this.markContentList[i].calculateType == "2"
              ) {
                this.totalRating += 1;
              } else if (this.markContentList[i].calculateType == "0") {
                this.$set(this.markContentList[i], "systemRankShow", 0);
              }
            }
          } else if (result.code == "1028") {
            _.hideLoading();
            _.alert("提示", result.desc, {
              primaryBtn: {
                name: "i18n.confirm",
                callBack: () => {
                  this.$router.back(-1);
                }
              },
              defaultBtn: {
                name: "",
                callBack: null
              }
            });
          } else {
            _.hideLoading();
            _.alert("提示", result.desc);
          }
        })
        .catch(err => {
          _.hideLoading();
        });
    },
    doOnblur(event) {
      var _this = this;
      var dataId = event.currentTarget.getAttribute("data-id");
      if (event.currentTarget.value != "") {
        if (_this.arrData.length == 0) {
          _this.arrData.push(dataId);
          this.humanRating += 1;
          this.percentAll();
          return;
        }
        var isSame = false;
        for (var i = 0; i < _this.arrData.length; i++) {
          if (dataId == _this.arrData[i]) {
            isSame = true;
            break;
          }
        }
        if (!isSame) {
          _this.arrData.push(dataId);
          this.humanRating += 1;
        }
      } else {
        for (var i = 0; i < _this.arrData.length; i++) {
          if (dataId == _this.arrData[i]) {
            _this.arrData.remove(dataId);
            this.humanRating -= 1;
          }
        }
      }
      this.percentAll();
    },
    percentAll() {
      this.percent = (this.humanRating / this.totalRating) * 100;
      this.styleObject = {
        width: this.percent + "%"
      };
    },
    //显示隐藏系统评分
    toggleSystem(i) {
      this.markContentList[i].systemRankShow =
        this.markContentList[i].systemRankShow == 0 ? 1 : 0;
    },
    //显示提示
    instructions(i) {
      _.alert("提示", this.markContentList[i].description);
    },
    submit() {
      var self = this;
      if (self.ableSubmit) {
        var _this = this;
        var count = 0;
        var systemNum = 0;
        var valid = true;
        for (var i = 0; i < this.markContentList.length; i++) {
          var index = this.markContentList[i];
          if (index.calculateType === "0") {
            systemNum++;
          }
          if (index.calculateType === "2") {
            var temp = i + 1;
            if (/^[1-9]\d*|0$/.test(index.comment.score)) {
              count++;
              if (parseInt(index.maxScore) < index.comment.score) {
                _.alert("提示", "第" + temp + "道题评分不能超过最大分数");
                valid = false;
                break;
              }
            } else if (index.comment.score < 0) {
              _.alert("提示", "第" + temp + "道题评分分数不能为负数");
              valid = false;
              break;
            } else {
              _.alert("提示", "请输入第" + temp + "道题评分分数");
              valid = false;
              break;
            }
          } else {
            if (index.selectItem) {
              count++;
            }
          }
        }
        if (valid && count + systemNum < this.markContentList.length) {
          valid = false;
          _.alert(
            "提示",
            "还有" +
              (this.markContentList.length - count - systemNum).toString() +
              "道题没评"
          );
        }
        if (valid) {
          this.ableSubmit = false;
          this.subMitParams.targetId = this.$route.query.targetId;
          this.subMitParams.index = JSON.stringify(this.markContentList);
          this.subMitParams.refId = this.$route.query.refId;
          this.subMitParams.flownodeId = this.$route.query.flownodeId;
          doMark(this.subMitParams, data => {
            _.tooltips_succeed("提交成功");
            setTimeout(() => {
              _this.$router.go(-1);
            }, 1000);
          });
        }
      }
    },
    clickItem(index, item) {
      var _this = this;
      if (this.status == "1" && this.markStatus == "2") {
        return;
      }
      if (!index.selectItem) {
        this.humanRating += 1;
        this.$set(index, "selectItem", item);
      } else {
        index.selectItem = item;
      }
      this.percentAll();
    }
  }
};
</script>
<style lang="scss" scoped>
#doCheckMark {
  .qwui-mark_header {
    display: flex;
    width: 100%;
    height: 55px;
    line-height: 55px;
    background: #fff;
    position: fixed;
    z-index: 10;
    padding: 0 15px 0 63px;
    box-sizing: border-box;
    .qwui-headPic {
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
      width: 38px;
      height: 38px;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
    span {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .qwui-personName {
      font-size: 16px;
      flex: 1;
      padding-right: 20px;
    }
    .qwui-get_sorce {
      float: right;
      max-width: 150px;
      font-size: 16px;
    }
  }
  .qwui-progress_bar {
    position: fixed;
    width: 100%;
    height: 4px;
    background: #e1e3e6;
    top: 55px;
    z-index: 22;
    span {
      position: absolute;
      top: 0;
      left: 0;
      height: 4px;
      background: rgba(47, 125, 205, 1);
    }
  }
  .qwui-mark_content {
    position: relative;
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    padding-top: 59px;
    .qwui-mark_question {
      .qwui-question_title {
        position: relative;
        line-height: 1.6;
        padding: 10px 45px 10px 15px;
        font-size: 16px;
        background: #f5f5f5;
        .qwui-left_content {
          .desc,
          .score {
            vertical-align: middle;
          }
          .help_icon {
            img {
              width: 16px;
              vertical-align: middle;
            }
            margin-left: 10px;
          }
          .blue_flag {
            display: inline-block;
            width: 56px;
            height: 18px;
            border: 1px solid #458be9;
            border-radius: 2px;
            line-height: 18px;
            text-align: center;
            font-size: 12px;
            color: #458be9;
            vertical-align: middle;
          }
        }
        .show_content_icon {
          position: absolute;
          right: 15px;
          top: 50%;
          width: 15px;
          height: 15px;
          background: url(~assets/images/slide.png) no-repeat;
          background-size: 15px;
          background-position: 0 0;
        }
        .down {
          transform: translate(0, -50%) rotate(180deg);
        }
        .up {
          transform: translate(0, -50%) rotate(0deg);
        }
        .no_match {
          font-size: 13px;
          color: #999;
        }
      }
      .qwui-question_content {
        .common_title {
          height: 40px;
          padding-left: 15px;
          line-height: 40px;
          font-size: 16px;
          color: #333;
          span {
            vertical-align: middle;
          }
          .input_sort {
            padding-right: 15px;
            border: none;
            font-size: 16px;
            background: #fff;
          }
        }
        .input_wrap {
          padding: 10px 15px;
          .common_text {
            width: 100%;
            min-height: 135px;
            line-height: 22px;
            font-size: 16px;
            outline: none;
            border: none;
            resize: none;
          }
          .disableInput {
            border: none;
            font-size: 16px;
            color: #333;
            background: #fff;
          }
        }
        .qwui-list_item {
          padding: 10px 15px 10px;
          line-height: 1.5;
          font-size: 16px;
          color: #666;
          background: #fff;
          .flexbox {
            display: flex;
          }
          i {
            position: relative;
            top: 6px;
            width: 10px;
            height: 10px;
            border: 2px solid #ccc;
            border-radius: 50%;
            margin-right: 10px;
          }

          .question_select_title {
            flex: 1;
            line-height: 1.5;
          }
        }
        .divLine {
          height: 5px;
          background: #fff;
        }
        .active {
          i {
            border-color: #2f7dcd;
            &::after {
              position: absolute;
              content: "";
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background-color: #2f7dcd;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .disabled {
          background-color: #eee;
        }
        .disable_chose {
          &::after {
            position: absolute;
            content: "";
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #ccc;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
  .footer_btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-top: 30px;
    padding-top: 10px;
    background-color: #fff;
    .fbtns {
      padding: 0 15px 10px 15px;
    }
    .btn {
      display: inline-block;
      width: 100%;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      cursor: pointer;
      background: #2f7dcd;
    }
  }
  .hidden {
    display: none;
  }
}
@media screen and (min-width: 1024px) {
  #doCheckMark {
    .qwui-mark_header {
      width: 740px;
    }
    .qwui-progress_bar {
      width: 740px;
    }
    .footer_btn {
      width: 740px !important;
    }
  }
}
</style>