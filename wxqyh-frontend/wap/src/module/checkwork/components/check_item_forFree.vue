<template>
  <div class="checkForFree">
    <!-- 常规显示四条记录之内部分 -->
    <div class="freeRule-item" v-for="(freeItem,index) in freeItemList" :key="index">
       <p class="qiandao-item">
          <span class="freeRuleSignTime">{{freeItem.signTime}}</span>
          <span class="kaoqinCon ellipsis" @click="showMap(freeItem)">{{freeItem.signAddress}}<br>
              <span class="kaoqinStatus">{{freeItem.signStatusCont}}</span>
          </span>
          <a class="remarks_btn" @click="showRemark(freeItem)">备注</a>
       </p>
       <div class="beizhu_details" v-if="freeItem.isHasRemark">
         <div class="beizhu_text">{{freeItem.remarkContent}}</div>
         <div class="icon_edit" @click="turnToAdd(freeItem)"></div>
         <div class="qwui-tupian_box" v-for="list in freeItem.remarkImg" :key="list.picPath">
           <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,freeItem.remarkImg)">
         </div>
         <div>{{freeItem.remarkPerson}}</div>
       </div>
    </div>
    <!-- 展开记录 -->
    <span
      class="freeRuleShowMoreBtn active"
      @click="getMoreFreeItem"
      v-if="Number(totalNum) > 4 && showMore == true"
    >
      展开记录
    </span>
    <!-- 展开记录显示四条以上部分 -->
    <div class="freeRule-item" v-for="(freeItem) in moreFreeItemList" :key="freeItem.id" v-show="showMoreDetail">
      <p class="qiandao-item">
        <span class="freeRuleSignTime">{{freeItem.signTime}}</span>
        <span class="kaoqinCon ellipsis" @click="showMap(freeItem)">{{freeItem.signAddress}}<br>
          <span class="kaoqinStatus">{{freeItem.signStatusCont}}</span>
        </span>
        <a class="remarks_btn"  @click="showRemark(freeItem)">备注</a>
      </p>
      <div class="beizhu_details" v-if="freeItem.isHasRemark">
        <div class="beizhu_text">{{freeItem.remarkContent}}</div>
        <div class="icon_edit" @click="turnToAdd(freeItem)"></div>
        <div class="qwui-tupian_box" v-for="list in freeItem.remarkImg" :key="list.picPath">
          <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,freeItem.remarkImg)">
        </div>
        <div>{{freeItem.remarkPerson}}</div>
      </div>
    </div>
    <!-- 收起记录 -->
    <span
      class="freeRuleShowMoreBtn active"
      @click="delMoreFreeItem"
      v-if="Number(totalNum) > 4 && showMore == false"
    >
      收起记录
    </span>
    <!-- 打卡按钮 -->
    <div class="freeRuleSignBtn" @click="signCardforFree" v-show="showSignBtn">打卡</div>
    <!-- 图片预览 -->
    <previewImages></previewImages>
    <!--地图组件-->
    <tencent-map v-if="locationInfo.showMap"
                 :pos="locationInfo"
                 :type="locationInfo.type"
                 @closeMap="closeMap"
    >
    </tencent-map>
    <!-- 弹框组件 -->
    <checkFreeAlert :freeAlertData="freeAlertConfig"></checkFreeAlert>
  </div>
</template>

<script>
import previewImages from "@/components/base/previewImages";
import EventBus from "@/utils/eventBus";
import tencentMap from "@/components/add/tencentMap.vue";
import checkFreeAlert from "./check_free_alert.vue";
import addUpdate from "../js/add.js"

export default {
  name: "checkItemForFree",
  props: ["freeCheckData"],
  components: {
    previewImages,
    tencentMap,
    checkFreeAlert
  },
  data() {
    return {
      infoId: "",
      totalNum: "",
      ruleVO: {},
      showMore: true,
      showMoreDetail: false,
      freeItemList: [],
      moreFreeItemList: [],
      commitData: {
        checkWorkId: "",
        isWorkDate: "0", //是否检查工作日
        longitude: "",
        latitude: "",
        address: ""
      },
      freeItem: {
        signTime: "",
        signAddress: "",
        signStatus: "",
        signStatusCont: "", //考勤状态文字内容
        isHasRemark: "",
        remarkContent: "",
        remarkImg: "",
        latitude: "",
        longitude: "",
        id: ""
      },
      freeCheckStatusObj: {
        "1": "", // 正常
        "2": "迟到",
        "3": "早退",
        "4": "迟到 偏移位置",
        "5": "早退 偏移位置",
        "6": "偏移位置",
        "7": "迟到 ip异常",
        "8": "早退 ip异常",
        "9": "ip异常",
        "10": "请假",
        "11": "出差",
        "12": "请假出差"
      },
      showSignBtn: true, //是否显示签到按钮
      locationInfo: {
        // 地图信息
        showMap: false,
        latitude: "",
        longitude: "",
        value: "",
        type: "post"
      },
      freeAlertConfig: {
        showAlert: false,
        oneLineCont: "",
        otherCont: ""
      }
    };
  },
  computed: {},
  watch: {
    freeCheckData: {
      handler: function() {
        this.freeItemList = this.freeCheckData.freeSignList;
        this.infoId = this.freeCheckData.infoId;
        this.totalNum = this.freeCheckData.totalNum;
        this.ruleVO = this.freeCheckData.ruleVO;
        /**刷新规则时重置更多的信息 */
        this.moreFreeItemList.splice(0);
      },
      deep: true
    }
  },
  methods: {
    getMoreFreeItem() {
      let _this = this;
      _.ajax({
        url: _.baseURL + dataBase.todayCheck.getMoreFreeDetail,
        type: "post",
        data: {
          infoId: _this.infoId,
          totalNum: _this.totalNum
        },
        success: function(result) {
          _this.moreFreeItemList.splice(0);
          let freeSignList = result.data.detailList;
          for (let i = 0; i < freeSignList.length; i++) {
            let freeSignItem = {
              signTime: "",
              signAddress: "",
              signStatus: "",
              signStatusCont: "",
              isHasRemark: false,
              remarkContent: "",
              remarkImg: "",
              remarkPerson: "",
              latitude: "",
              longitude: "",
              id: ""
            };
            freeSignItem.signTime = freeSignList[i].signTime.substring(11, 16);
            freeSignItem.signAddress = freeSignList[i].signAddress;
            freeSignItem.signStatus = freeSignList[i].status;
            freeSignItem.latitude = freeSignList[i].latitude;
            freeSignItem.longitude = freeSignList[i].longitude;
            freeSignItem.id = freeSignList[i].id;
            freeSignItem.isHasRemark = false;
            freeSignItem.remarkContent = freeSignList[i].content;
            freeSignItem.signStatusCont =
              _this.freeCheckStatusObj[freeSignList[i].status];
            _this.moreFreeItemList.push(freeSignItem);
          }
          _this.showMoreDetail = true;
          _this.showMore = false;
        }
      });
    },
    delMoreFreeItem() {
      this.showMoreDetail = false;
      this.showMore = true;
    },
    showRemark(item) {
      /**如果已有备注则显示备注缩略，否则打开备注编辑页面 */
      let _this = this;
      if (item.isHasRemark) {
        item.isHasRemark = !item.isHasRemark;
        return;
      }
      if (!item.isHasRemark && item.remarkContent || item.id == dataBase.todayCheck.markItem) {
        /**请求备注图片负责人等信息 */
        _.ajax({
          url: _.baseURL + dataBase.todayCheck.getFreeMarkDetail,
          type: "post",
          data: {
            id: item.id
          },
          success: function(result) {
            let personList = result.data.changeList;
            let picList = result.data.picList;
            let tempName = "";
            item.remarkImg = picList;
            for (let i = 0; i < personList.length; i++) {
              tempName += personList[i].personName + " ";
            }
            if (personList.length > 0) {
              item.remarkPerson = "负责人：" + tempName;
            }
            item["remarkContent"] = result.data.content;
            item.isHasRemark = !item.isHasRemark;
            item["remarkImg"] = picList;
            item["personList"] = personList;
            if(result.data.changeList.length == "0" && result.data.picList.length == 0 && result.data.content == ""){
              _this.turnToAdd(item);
            }
          }
        });
      } else {
        /**打开备注页面 */
        this.turnToAdd(item);
      }
    },
    //点击跳转备注添加页
    turnToAdd(item) {
      this.$emit("remarkPageShow", item);
    },
    dealImagesUrl(url) {
      //图片路径
      if (url.indexOf("http") != -1) {
        return url;
      }
      return (_.compressURL + url).replace("/compress/", "/");
    },
    //预览图片
    preview(src, list) {
      EventBus.$emit(
        "previewImages",
        (_.compressURL + src).replace("/compress/", "/"),
        list
      );
    },
    signCardforFree() {
      let _this = this;
      let ruleVO = _this.ruleVO;
      /**如果非微信 */
      if (!_.isGetLocation()) {
        _.alert("", "请在手机端/考勤机进行考勤");
        return;
      }
      /**如果禁用手机签到 */
      if (!_this.isMobileCheckWork(ruleVO)) return;

      /**自由考勤获取地理位置 */
      _this.freeSigninLocation();
    },
    isMobileCheckWork(ruleVO) {
      let isUseMachineSign = ruleVO.isUseMachineSign; //是否使用考勤机考勤
      let isMobileSign = ruleVO.isMobileSign; //使用考勤机考勤考勤时，是否禁用手机签到
      if (
        isUseMachineSign &&
        "1" == isUseMachineSign &&
        isMobileSign &&
        "1" == isMobileSign
      ) {
        //1：使用考勤机考勤；1：禁止手机端考勤
        _.alert(
          "i18n.notice",
          "该考勤规则已禁用手机考勤，如有问题请联系管理员"
        );
        return false;
      }
      return true;
    },
    freeSigninLocation() {
      let _this = this;
      _.showLoading("正在获取定位信息...");
      _.getAddress(_this.getAddressOk);
    },
    /**获取地理位置成功后的回调函数 */
    getAddressOk(address) {
      let _this = this;
      /**腾讯地图坐标转换为百度地图 */
      let newPoint = addUpdate.mapabcEncryptToBdmap(address.latitude,address.longitude);
      _this.commitData.longitude = newPoint.lng;
      _this.commitData.latitude = newPoint.lat;
      _this.commitData.address = address.value;
      _this.commitData.checkWorkId = _this.ruleVO.id;
      _this.addFreeSignin(_this.commitData);
    },
    /**自由规则打卡提示多少分钟内只能记录一次 */
    temporaryDialog(recordInterval) {
      let _this = this;
      _this.freeAlertConfig.oneLineCont = recordInterval + "分钟内只能记录一次";
      _this.freeAlertConfig.otherCont = "请稍后操作";
      _this.freeAlertConfig.showAlert = true;
      setTimeout(function() {
        _this.freeAlertConfig.showAlert = false;
      }, 8000);
    },
    /**自由规则提示打卡时间范围 */
    noInCheckTime(signStartTime, signEndTime) {
      let _this = this;
      _this.freeAlertConfig.oneLineCont = "不在可打卡时间范围";
      _this.freeAlertConfig.otherCont =
        "范围：" + signStartTime + "~" + signEndTime;
      _this.freeAlertConfig.showAlert = true;
      setTimeout(function() {
        _this.freeAlertConfig.showAlert = false;
      }, 8000);
    },
    /**自由规则点击打卡，获取位置成功后 */
    addFreeSignin(commitData) {
      let _this = this;
      if (commitData.longitude == "" || commitData.longitude == null) {
        _.hideLoading();
        _.alert("i18n.notice", "当前由于网络原因获取不到位置，请稍后重试");
        return;
      }
      _.ajax({
        url: _.baseURL + dataBase.todayCheck.addFreeSignUrl,
        type: "post",
        data: commitData,
        success: function(result) {
          if (result.code === "0") {
            _.hideLoading();
            _this.totalNum += 1;
            _this.freeCheckData.totalNum += 1;
            let data = result.data;
            let countTime = data.countTime ? data.countTime : 0;
            let isCalculationWorkHour = data.isCalculationWorkHour;
            /**已经打卡成功但是ip异常或位置偏移的提示(为空时不需要提示) */
            let signresult = data.signresult;
            if (signresult) {
              _.alert("",signresult);
            }
            /**更新已工作时间 */
            _this.updataCountTime(countTime,isCalculationWorkHour);
            /**更新显示刚打卡的信息 */
            _this.renderSignInfo(data);
          } else if (result.code == "261073") {
            /**打卡时间间隔未到不能打卡 */
            _.hideLoading();
            _this.temporaryDialog(result.data.recordInterval);
          } else if (result.code == "99") {
            /**提示非工作日是否继续打卡 */
            _.hideLoading();
            _.alert("提示", "非工作日是否继续打卡", {
              ok: function() {
                showLoading();
                _this.commitData.isWorkDate = "1";
                _this.addFreeSignin(_this.commitData);
              }
            });
          } else if (result.code === "261075") {
            /**提示超过最大打卡次数 */
            _.alert("提示", "已经超出最大打卡次数");
            _this.showSignBtn = false;
          } else if (result.code === "261036") {
            /**打卡不在时间范围内 */
            _.hideLoading();
            let signStartTime = result.data.signStartTime;
            let signEndTime = result.data.signEndTime;
            _this.noInCheckTime(signStartTime, signEndTime);
          } else {
            _.hideLoading();
            _.alert("提示", result.desc);
          }
        }
      });
    },
    updataCountTime(countTime,isCalculationWorkHour) {
      /**更新已工作时间 */
      let _this = this;
      let newContTime;
      if(isCalculationWorkHour && isCalculationWorkHour == "1"){
        newContTime = "0";
      }
      if (countTime) {
        newContTime = countTime;
      }
      let contTimeData = {
        "countTime" : newContTime ,
        "isCalculationWorkHour" : isCalculationWorkHour
      }
      this.$emit("updataFreeContTime", contTimeData);
    },
    renderSignInfo(data) {
      let _this = this;
      let po = data.po;
      //考勤的位置
      let newFreeItem = {
        id: po.id,
        isHasRemark: "",
        latitude: po.latitude,
        longitude: po.longitude,
        remarkContent: "",
        remarkImg: "",
        signAddress: po.signAddress,
        signStatus: "",
        signStatusCont: _this.freeCheckStatusObj[po.status],
        signTime: data.signTime.slice(11, 16)
      };
      _this.freeItemList.unshift(newFreeItem);
      if (_this.totalNum > 4) {
        _this.freeItemList.pop();
      }
    },
    /**打开地图*/
    showMap(item) {
      this.locationInfo.showMap = true;
      /**百度地图坐标转化为腾讯地图坐标 */
      let newPoint = addUpdate.BdmapEncryptToMapabc(item.latitude,item.longitude);
      this.locationInfo.latitude = Number(newPoint.lat).toFixed(6); //保留六位小数
      this.locationInfo.longitude = Number(newPoint.lng).toFixed(6); //保留六位小数
      this.locationInfo.value = item.signAddress;
    },
    /**关闭地图*/
    closeMap() {
      this.locationInfo.showMap = false;
    }
  }
};
</script>

<style scoped>
.freeRuleSignBtn {
  display: block;
  font-size: 24px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  margin: 60px auto 0;
  color: #586c94;
  border: 5px solid #a7b0c8;
  border-radius: 50%;
}
.freeRule-item {
  margin: 0 15px;
}
.freeRule-item .qiandao-item {
  display: flex;
  line-height: 18px;
  vertical-align: middle;
  padding: 12px 0;
}
.qiandao-item {
  padding: 15px 0;
}
.freeRuleSignTime {
  width: 60px;
  font-family: -apple-system-font, "Helvetica Neue", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  text-align: justify;
}

.freeRule-item .freeRuleSignTime {
  font-size: 18px;
}

.freeRule-item .kaoqinCon {
  color: #999;
}
.kaoqinCon {
  font-size: 13px;
  background: url(~assets/images/checkwork/mapMarker.png) no-repeat left 3px;
  -webkit-background-size: 13px 13px;
  background-size: 13px 13px;
  padding-left: 17px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.remarks_btn {
  margin-left: auto;
}
.kaoqinStatus {
  color: #e94f4f;
}
.freeRuleShowMoreBtn.active::after,
.freeRuleShowMoreBtn::after {
  display: inline-block;
  font-family: FontAwesome;
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  font-size: 16px;
  position: relative;
  top: 2px;
  left: 4px;
}
.freeRuleShowMoreBtn {
  display: block;
  text-align: center;
  text-decoration: none;
  color: #576b95;
  margin-top: 10px;
  cursor: pointer;
}
.beizhu_details {
  position: relative;
  border: 1px solid #ccc;
  font-size: 12px;
  padding: 10px 25px 10px 8px;
  margin-top: -6px;
  background: #f5f5f5;
  color: #999;
}
.qwui-tupian_box {
  height: 45px;
  width: 45px;
  display: inline-block;
  margin: 5px 5px 5px 0;
}
.qwui-tupian_box img {
  height: 45px;
  width: 45px;
}
.icon_edit {
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 5px;
}
.icon_edit::after {
  content: "";
  background: url(~assets/images/checkwork/icon_edit.png) no-repeat;
  background-size: 11px;
  width: 11px;
  height: 11px;
  display: inline-block;
}
.checkForFree {
  background: #ffffff;
}
</style>

