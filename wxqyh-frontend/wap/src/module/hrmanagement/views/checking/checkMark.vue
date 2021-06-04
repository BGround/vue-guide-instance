<template>
  <div id="checkMark" class="wrap">
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
      <span class="qwui-get_sorce">我的评分：{{targetObj.totalScore}}</span>
    </div>
    <div class="qwui-progress_bar">
      <span style="width: 100%"></span>
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
          <div class="qwui-content_box" v-if="item.calculateType==='2'">
            <div class="one_common">
              <div class="common_title">
                <span class="mr10">评分</span>
                <input
                  type="number"
                  class="input_sort"
                  style="border: none"
                  :value="item.detailPO.score"
                  readonly="readonly"
                >
              </div>
            </div>
            <div class="one_common">
              <div class="common_title">内容</div>
              <div class="input_wrap">
                <textarea class="common_text" :value="item.detailPO.answer" readonly="readonly"></textarea>
              </div>
            </div>
          </div>
          <ul v-else>
            <li
              v-if="item.calculateType == 1 || item.systemRankShow == 1"
              v-for="(itemJ,j) in item.indexItemsList"
              :key="j"
              class="qwui-list_item"
            >
              <input
                class="mr5 disableRadio"
                type="radio"
                :value="itemJ.id"
                v-model="item.checked"
                disabled="disabled"
              >
              <div class="question_select_title">
                {{itemJ.name}}
                <span class="pl5">({{itemJ.score}}分)</span>
              </div>
            </li>
          </ul>
          <div class="divLine" v-show="item.calculateType == '0' && item.systemRankShow == 0"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findMarkDetail } from "../../api/getData";

export default {
  name: "checkMark",
  data() {
    return {
      params: {
        targetId: "",
        refId: ''
      },
      markContentList: [],
      targetObj: {}
    };
  },
  created() {
    // status为1是已评分 0为未评分
    this.params.targetId = this.$route.query.targetId;
    this.params.refId = this.$route.query.refId;
    this.getForMark();
  },
  methods: {
    getForMark() {
      findMarkDetail(this.params, data => {
        this.targetObj = data.target;
        //格式化头像
        if (
          this.targetObj.headPic.length > 0 &&
          this.targetObj.headPic != "0"
        ) {
          if (this.targetObj.headPic.indexOf("http") < 0) {
            this.targetObj.headPic = _.compressURL + this.targetObj.headPic;
          }
        }
        for (var i = 0; i < data.indexList.length; i++) {
          var index = data.indexList[i];
          data.indexList[i].checked = index.detailPO.itemId;
        }
        this.targetObj = data.target;
        this.markContentList = data.indexList;
        //加入显示隐藏系统评分选项的属性
        for (var i = 0; i < this.markContentList.length; i++) {
          if (this.markContentList[i].calculateType == "0") {
            this.$set(this.markContentList[i], "systemRankShow", 0);
          }
        }
      });
    },
    //显示隐藏系统评分
    toggleSystem: function(i) {
      this.markContentList[i].systemRankShow =
        this.markContentList[i].systemRankShow == 0 ? 1 : 0;
    },
    //显示提示
    instructions(i) {
      _.alert("提示", this.markContentList[i].description);
    }
  }
};
</script>
<style lang="scss" scoped>
#checkMark {
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
      white-space: nowrap;
      word-wrap: normal;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .qwui-personName {
      flex: 1;
      font-size: 16px;
      padding-right: 20px;
    }
    .qwui-get_sorce {
      float: right;
      font-size: 16px;
      max-width: 150px;
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
        }
        .qwui-list_item {
          padding: 10px 15px 10px;
          line-height: 1.5;
          font-size: 16px;
          color: #666;
          background: #fff;
          display: flex;
          .disableRadio {
            position: relative;
            top: 5px;
            width: 16px;
            height: 16px;
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
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  #checkMark {
    .qwui-mark_header {
      width: 740px;
    }
    .qwui-progress_bar {
      width: 740px;
    }
  }
}
</style>