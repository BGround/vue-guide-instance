<template>
  <div id="salaryDetails" class="wrap">
    <div class="qwui-details_card">
      <div class="qwui-header">
        <div class="qwui-title">{{dataObj.name}}</div>
        <div class="qwui-desc">
          <p class="qwui-time">
            {{dataObj.sendTime.substring(0,10)}}
            <i
              class="destory"
              v-show="showDestory"
              @click="delSalary"
            >销毁</i>
          </p>
          <p class="qwui-sender">
            发件人：
            <span class="qwui-creator">{{dataObj.creator}}</span>
          </p>
          <!-- 已阅读图标 -->
          <img class="haveRead" v-show="showReadedIcon" src="~assets/images/ic_emil_readed.png" alt>
        </div>
      </div>
      <div class="qwui-content">
        <p class="defaultTips">{{dataObj.contentVO.newsStart}}</p>
        <ul>
          <li
            class="qwui-list_item"
            v-for="(item, i) in dataObj.contentVO.itemList"
            :key="i"
            :class="{'cf5':i%2 != 0}"
          >
            <p class="qwui-item_desc">{{item.itemName}}</p>
            <p class="qwui-item_value">{{item.itemValue}}</p>
          </li>
        </ul>
        <p class="defaultTips">{{dataObj.contentVO.newsEnd}}</p>
      </div>
    </div>
    <div v-if="showUpdataBtn" class="qwui-footer_btn">
      <div class="btn_box">
        <span @click="_updateReadStatus('1')">确认已查阅</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getDetails, updateReadStatus } from "../../api/getData";
export default {
  name: "salaryDetails",
  data() {
    return {
      dataObj: {
        sendTime: "",
        contentVO: []
      },
      params: {
        id: ""
      },
      showUpdataBtn: false, //确认阅读按钮
      showReadedIcon: false, //已查阅图标
      showDestory: false //销毁按钮
    };
  },
  created() {
    this.params.id = this.$route.query.id;
    this._getDetails();
  },
  methods: {
    _getDetails() {
      getDetails(this.params, data => {
        this.dataObj = data.vo;
        if ("0" == data.vo.readStatus || "4" == data.vo.readStatus) {
          //默认状态
          this.showReadedIcon = false;
          this.showDestory = true;
          this.showUpdataBtn = true;
        } else if ("1" == data.vo.readStatus) {
          //点击查阅后的状态
          this.showReadedIcon = true;
          this.showUpdataBtn = false;
          this.showDestory = true;
        } else if ("2" == data.vo.readStatus) {
          //撕毁状态： 不显示按钮
          this.showUpdataBtn = false;
        }
      });
    },
    _updateReadStatus(status) {
      let params = {
        id: this.$route.query.id,
        readStatus: status
      };
      updateReadStatus(params, data => {
        this.showUpdataBtn = false;
        this.showReadedIcon = true;
        if(status == '2') {
          history.back()
        }
      });
    },
    //销毁
    delSalary() {
      _.alert("提示","确定销毁吗？", {
        primaryBtn: {
          name: "i18n.confirm",
          callBack: () => {
            this._updateReadStatus('2')
          }
        },
        defaultBtn: {
          name: "i18n.cancel",
          callBack: null
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#salaryDetails {
  padding: 15px 10px 0;
  .qwui-details_card {
    padding: 15px 14px;
    border: 1px solid rgb(204, 204, 204);
    border-radius: 4px;
    margin-bottom: 70px;
  }
  .qwui-title {
    margin-top: 6px;
    font-size: 18px;
    color: #333;
  }
  .qwui-desc {
    position: relative;
    margin-top: 6px;
    padding-bottom: 15px;
    font-size: 13px;
    border-bottom: 1px solid #ddd;
  }
  .qwui-time {
    font-size: 14px;
    color: #666;
    .destory {
      font-size: 15px;
      color: #586c94;
      margin-left: 10px;
    }
  }
  .qwui-sender {
    margin-top: 7px;
    color: #999;
    font-size: 16px;
    .qwui-creator {
      color: #666;
    }
  }
  .qwui-content {
    li {
      font-size: 15px;
      color: #666;
      word-break: break-all;
    }
    .qwui-list_item {
      display: flex;
      padding: 10px;
      .qwui-item_desc {
        flex: 0 0 120px;
        margin-right: 10px;
      }
      .qwui-item_value {
        flex: 1 1 auto;
        text-align: right;
      }
    }
    .cf5 {
      background-color: #f5f5f5;
    }
  }
  .qwui-footer_btn {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    min-height: 40px;
    background: #fff;
    .btn_box {
      padding: 10px 15px;
      span {
        display: inline-block;
        width: 100%;
        line-height: 44px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
        background: #2f7dcd;
      }
    }
  }
  .defaultTips {
    padding: 10px 0;
    color: #999;
    font-size: 13px;
  }
  .haveRead {
    position: absolute;
    right: 0px;
    top: -5px;
    width: 66px;
    height: 66px;
    z-index: 2;
  }
}
</style>