<template>
    <div class="qwui-lean_myRelavent">
        <div class="qwui-lean_head"></div>
        <div class="qwui-lean_user">
            <div class="qwui-lean_user_portrait">
              <div class="qwui-lean_portrait_default iconfont icon-ic_a-head" v-if="!user.headPic"></div>
                <img class="qwui-lean_portrait" :src="user.headPic" :alt="$t('i18n.headPortrait')">
            </div>
            <p class="qwui-lean_user_name">{{user.personName}}</p>
            <div class="qwui-lean_user_info qwui-flexbox">
                <div :class="[cursorClass,'qwui-flexItem','qwui-info_item']" @click="enterScore"><p>{{user.totalCredit}}</p>
                  <p :class="[enterScoreClass,'lable','total_score']">{{$t('i18n.totalScore')}}</p>
                </div>
                <div class="qwui-flexItem qwui-info_item"><p>{{user.studyTimeDesc}}</p><p class="lable">{{$t('i18n.studyTimeLength')}}</p></div>
                <div class="qwui-flexItem qwui-info_item"><p>{{user.courseNum}}</p><p class="lable">{{$t('i18n.studyCourse')}}</p></div>
            </div>
        </div>

        <!-- 入口列表 -->
        <div class="qwui-lean_entry_list">
            <div
              v-for="(item, index) in list"
              class="lean_entry_list_item qwui-flexbox"
              @click="routerOrJump(item)"
            >
                <span class="qwui-flexItem">
                  <i :class="['relavent_icon', list[index].class]"></i>
                  <span :class="item.class"></span>
                  {{item.text}}
                </span>
                <i class="qwui-icon_arrow_fr icon_gray"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { getLearnUserInfo, getStatistics ,
  managesetting,feedbackList} from "../../api/getData";
import { getMenu } from "../../api/getData";

export default {
  name: "QwMyRelavent",
  data() {
    return {
      /*database配置数据*/
      isSuperManager: false,
      list: [],

      /*该组件使用数据*/

      // 用户信息
      user: {
        headPic: "", //添加默认等待图片
        personName: this.$t("i18n.lastName"),
        totalCredit: "0",
        studyTimeDesc:
          "0" + this.$t("i18n.hours") + "0" + this.$t("i18n.minute"),
        courseNum: "0"
      },
      //是否是管理员
      isManager: "",
      goFeedBackHistory: false,
      feedbackBase: `${location.href.slice(
        0,
        location.href.indexOf("/vp")
      )}/vp/module/form.html?agentCode=form&corp_id=${
        wxqyhConfig.orgConfigInfo.corpId
      }#/open/add?id=`
    };
  },
  computed: {
    enterScoreClass() {
      return { "qwui-icon_arrow_fr": this.user.totalCredit != 0 };
    },
    cursorClass() {
      return { enter_cursor: this.user.totalCredit != 0 };
    }
  },
  created() {
    this._feedbackList()
    this._getLearnUserInfo();
    this._getStatistics().then(() => {
      if (window.AGENT_CODE !== "partyconstruction") {
        this._getMenu();
      } else {
        this.list = dataBase.myRelavent.entryList;
      }
	});this._managesetting();
  },
  methods: {
    // 得到个人信息
    _getLearnUserInfo() {
      // 加return返回promise对象
      return new Promise((resolve, reject) => {
        getLearnUserInfo({}, data => {
          let myStudy = data.myStudy;
          /*如果url未完整则补全*/
          myStudy.headPic = myStudy.headPic
            ? this.getCoverUrl(myStudy.headPic)
            : "";
          Object.assign(this.user, myStudy);

          resolve();
        });
      });
    },

    // 判断统计权限
    _getStatistics() {
      return new Promise((resolve, reject) => {
        getStatistics({}, data => {
          if (data.hasPower) {
            // 如果有权限
            let entryList = dataBase.myRelavent.entryList;
            let index = entryList.findIndex(obj => {
              return obj.class == "quickExperience";
            });
            index = index == -1 ? entryList.length : index; // 避免快速体验被误删，导致无法插入

            entryList.splice(index, 0, {
              class: 'examStatistics',
              text: this.$t("i18n.examStatistics"),
              path: 'examStatistics',
              router: true,
              routerName: 'exam_statistics'
            });
          }
          resolve();
        });
      });
    },

    enterScore() {
      this.user.totalCredit != 0 && this.$router.push({ name: "score_detail" });
    },
// 是否有反馈历史
    _feedbackList() {
      feedbackList({}, data => {
        this.feedbackBase += data.feedBackVersionId;
        if (data.tbFormWorkOrderPOList.length > 0) {
          this.goFeedBackHistory = false;
        } else {
          this.goFeedBackHistory = true;
        }
      });
    },
    // 功能区页面跳转：判断使用【路由】或【直接跳转】
    routerOrJump(item) {
      let isVip = _.is_vip ? "付费用户" : "普通用户"
      if (item.router) {
        this.$router.push({ path: item.path });
      } else {
        // 跳转其他模块/页面
        if (item.class == "problemFeedback") {
          let href
        if (!this.goFeedBackHistory) {
          // href = `${_.baseURL}/vp/module/form.html#/feedback-list?charge=胡韵静&app=培训学习`;
          this.$router.push({path:'FeedBackList'})
        } else {
          href = `${this.feedbackBase}&field=${
            wxqyhConfig.orgConfigInfo.corpId
          }&field1=${_.userId}&field2=胡韵静&field3=${
            this.isManager == 1 ? "管理员" : "普通员工"
          }&field4=${_.is_vip ? "付费用户" : "普通用户"}&field5=培训学习`;
        location.href = href;
        }
        return
        }
        window.location.href = item.otherModule
          ? item.path
          : _.baseURL + item.path;
      }
    },

    // 得到正确的封面图URL
    getCoverUrl(url) {
      return url.includes("http") ? url : _.compressURL + url;
    },

	//判断是否有超管权限
	_getMenu() {
		//自定义菜单入口
		let addMenu = {class: 'theCustom', text: '自定义菜单', path: 'theCustom', router: true};
		return new Promise((resolve, reject) => {
			getMenu({}, data => {
				let showMenu = data.menu.split(';');
        let entryList = dataBase.myRelavent.entryList;
				this.isSuperManager = data.isSuperManager;
				this.isSuperManager && entryList.push(addMenu)
				if(showMenu.length == 2 && showMenu[0] == 'examination'){
					entryList.shift(1);
				}
				this.list = dataBase.myRelavent.entryList;
				resolve();
				});
			});
  },
  //获取反馈来源
    _managesetting() {
      managesetting({}, data => {
        if(data.isManager == 0) {
          this.isManager = "普通用户"
        }else {
          this.isManager = "管理员"
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../static/css/mixin.scss";
.qwui-lean_myRelavent {
  position: relative;
  min-height: calc(100vh - 47px);
  font-weight: 500;
  background: #fff;

  .qwui-lean_head {
    height: 145px;
    margin-bottom: 106px;
    background: linear-gradient(#5077aa, #3d7ed2);
  }
  .qwui-lean_user {
    position: absolute;
    top: 59px;
    left: 15px;
    right: 15px;
    height: 173px;
    text-align: center;
    background: #fff;
    border-radius: 5px;
    box-shadow: 2px 0 10px rgba(76, 78, 81, 0.11);

    .qwui-lean_user_portrait {
      position: relative;
      width: 74px;
      height: 74px;
      margin: 0 auto;
      margin-top: -37px;
      border-radius: 50%;
      border: 1px solid #f5f5f5;
      background: #fcfdff;
      overflow: hidden;

      .qwui-lean_portrait_default:before {
        font-size: 65px;
        color: #abc3e3;
      }
      .qwui-lean_portrait {
        max-width: 100%;
      }
    }

    .qwui-lean_user_name {
      margin-top: 14px;
      font-size: 16px;
      line-height: 16px;
      color: #333;
    }
    .qwui-lean_user_info {
      margin-top: 40px;

      .enter_cursor {
        cursor: pointer;
      }

      .qwui-info_item {
        font-size: 24px;
        line-height: 19px;
        color: #333;
        &:not(:last-of-type) {
          @include border-r-1px(#e6e6e6);

          &::after {
            top: 12.5%;
            height: 66.66%;
          }
        }
        &:nth-of-type(2) {
          font-size: 18px;
        }
        .lable {
          margin-top: 13px;
          font-size: 13px;
          line-height: 13px;
          color: #999;
        }
        .total_score:after {
          right: 25%;
          height: 5px;
          width: 5px;
          margin-top: -2px;
          border-width: 1px 1px 0 0;
        }
      }
    }
  }

  .qwui-lean_entry_list {
    color: #333;
    background: #fff;

    .lean_entry_list_item {
      margin-left: 17px; /*在这里不都用margin，是因为有*/
      padding-right: 15px; /*下划线border-bottom的存在。所以right用padding*/
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      @include border-b-1px(#e6e6e6);
      /*最后一行margin-left改padding-left，下横线长度有变化*/
      &:last-of-type {
        margin-left: 0;
        padding-left: 17px;
      }
    }
    .relavent_icon {
      position: relative;
      top: 5px;
      display: inline-block;
      width: 22px;
      height: 22px;
      margin-right: 9px;
      background-size: cover;
    }
    .recentStudy {
      background-image: url("~assets/images/ic_recentStudy.png");
    }
    .testRecord {
      background-image: url("~assets/images/ic_testRecord.png");
    }
    .readRecord {
      background-image: url("~assets/images/ic_readRecord.png");
    }
    .examStatistics {
      background-image: url("~assets/images/ic_examStatistics.png");
    }
    .theCustom {
      background-image: url("~assets/images/ic_a-mine_div.png");
    }
    .quickExperience {
      background-image: url("~assets/images/ic_quickExperience.png");
    }
    .problemFeedback {
      background-image: url("~assets/images/ic_problemFeedback.png");
    }
  }
}
</style>
