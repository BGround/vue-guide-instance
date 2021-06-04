<!--打卡信息项-->
<template>
  <div :class="isFixRule? 'signMassage':''">
    <div class="qwui-checkItem" v-for="(signItem,index) in signListData" :key="index">
      <div class="qwui-checkItemPos">
        <!--签到-->
        <div class="qwui-checkline">
        <div class="qwui-qiandaoItem" v-if="signItem.signinItem.signinTime">
          <!--左侧-->
          <div class="qwui-signTime">
            <p class="qwui-signText">签到</p>
            <p class="qwui-smallSignText">{{signItem.signinItem.signinTime}}</p>
          </div>
          <!--中部-->
          <div class="qwui-signMsg" v-show="signItem.signinItem.status">
            <div class="ellipsis kaoqinCon"
                 @click="showMap(signItem.signinItem)"
            >
              {{signItem.signinItem.signAddress}}
            </div>
            <div class="qwui-signOther">
              <span class="qwui-signStatu">{{checkStatusObj[signItem.signinItem.status]}}</span>
              <span class="qwui-signRemarks" @click="showRemark(signItem.signinItem)">备注</span>
            </div>
          </div>
          <!--右侧-->
          <div v-if="!signItem.signinItem.status && ifShake" class="shakePhone_btn"></div>
          <div
            v-if="!signItem.signinItem.status && !ifShake"
            class="qwui-signBtn signinBtn"
            @click="signIn(signItem.signinItem,'0','1')"
          >
            签到
          </div>
          <div
            v-if="signItem.signinItem.status"
            class="qwui-signBtn signMsgBtn"
            @click="signIn(signItem.signinItem,'1','1')"
            :class="{'qwui-signStatu':signItem.signinItem.status !== '1'}"
          >
            {{cutTime(signItem.signinItem.signTime)}}
          </div>
        </div>
          <!-- 备注缩略 -->
          <div class="beizhu_details" v-if="signItem.signinItem.isHasRemark">
            <div class="beizhu_text">{{signItem.signinItem.content}}</div>
            <div class="icon_edit" @click="turnToAdd(signItem.signinItem)"></div>
            <div class="qwui-tupian_box" v-for="list in signItem.signinItem.remarkImg" :key="list.picPath">
            <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,signItem.signinItem.remarkImg)">
            </div>
            <div>{{signItem.signinItem.remarkPerson}}</div>
          </div>
        </div>
        <!--签退-->
        <div class="qwui-diffLine">
        <div class="qwui-qiandaoItem signOutItem" v-if="signItem.signoutItem.signinTime">
          <!--左侧-->
          <div class="qwui-signTime">
            <p class="qwui-signText">签退</p>
            <p class="qwui-smallSignText">{{signItem.signoutItem.signinTime}}</p>
          </div>
          <!--中部-->
          <div class="qwui-signMsg" v-show="signItem.signoutItem.status">
            <div class="ellipsis kaoqinCon"
                @click="showMap(signItem.signoutItem)"
            >
              {{signItem.signoutItem.signAddress}}
            </div>
            <div class="qwui-signOther">
              <span class="qwui-signStatu">{{checkStatusObj[signItem.signoutItem.status]}}</span>
              <span class="qwui-signRemarks" @click="showRemark(signItem.signoutItem)">备注</span>
            </div>
          </div>
          <!--右侧-->
          <div
            v-if="!signItem.signoutItem.status && ifShake"
            class="shakePhone_btn"
          >
          </div>
          <div
            v-if="!signItem.signoutItem.status && !ifShake"
            class="qwui-signBtn signoutBtn"
            @click="signIn(signItem.signoutItem,'0','1')"
          >
            签退
          </div>
          <div
            v-if="signItem.signoutItem.status"
            class="qwui-signBtn signMsgBtn"
            @click="signIn(signItem.signoutItem,'1','1')"
            :class="{'qwui-signStatu':signItem.signoutItem.status !== '1'}"
          >
            {{cutTime(signItem.signoutItem.signTime)}}
          </div>
        </div>
        <!-- 备注缩略 -->
          <div class="beizhu_details" v-if="signItem.signoutItem.isHasRemark">
            <div class="beizhu_text">{{signItem.signoutItem.content}}</div>
            <div class="icon_edit" @click="turnToAdd(signItem.signoutItem)"></div>
            <div class="qwui-tupian_box" v-for="list in signItem.signoutItem.remarkImg" :key="list.picPath">
            <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,signItem.signoutItem.remarkImg)">
            </div>
            <div>{{signItem.signoutItem.remarkPerson}}</div>
          </div>
      </div>
      </div>
    </div>
    <!--地图组件-->
    <tencent-map v-if="locationInfo.showMap"
                 :pos="locationInfo"
                 :type="type"
                 @closeMap="closeMap"
    >
    </tencent-map>
    <!-- 图片预览 -->
    <previewImages></previewImages>
  </div>
</template>

<script>
import TencentMap from "@/components/add/tencentMap";
import previewImages from "@/components/base/previewImages";
import EventBus from "@/utils/eventBus";
import addUpdate from "../js/add.js"

export default {
  name: "sign_message",
  props: ["signMessage", "isShake", "ruleList","ifFixRule"],
  components: {
    TencentMap,
    previewImages
  },
  data() {
    return {
      signItem: {
        signinItem: {
          id: "", //签到id
          status: "", //状态
          signAddress: "", //签到地址
          signTime: "", //应签到时间
          signinTime: "" //签到时间
        },
        signoutItem: {
          id: "", //签到id
          status: "", //状态
          signAddress: "", //签到地址
          signTime: "", //应签到时间
          signoutTime: "" //签退时间
        }
      },
      isFixRule:true,
      ifShake: false,
      shakeId: "",
      signList: [],
      signinTime: "09:00",
      signoutTime: "18:00",
      checkStatusObj: {
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
      locationInfo: {
        // 地图信息
        showMap: false,
        latitude: "",
        longitude: "",
        value: ""
      },
      type: "showPosition",
      address: {
        value: "",
        longitude: "",
        latitude: ""
      },
      scheContTime: "" //排班考勤工作总时长
    };
  },
  watch: {
    "signMessage.signList": function() {
      this.signList = this.signMessage.signList;
    },
    isShake: function() {
      this.ifShake = this.isShake;
    }
  },
  computed: {
    signListData: function() {
      return this.signMessage.signList;
    }
  },
  created() {
    let ticket = _.getUrlParam(ticket);
    this.isFixRule = this.ifFixRule;
    if (_.isGetLocation() && ticket.length > 0) {
      /**如果是摇一摇考勤，进入摇一摇考勤 */
      this.shakeSign(ticket, "", "", "0", "0", "");
    }
  },
  methods: {
    /**摇一摇考勤*/
    shakeSign(ticket, checkWorkId, signId, againsignin, isWorkDate, shakeId) {
      let _this = this;
      /**处理摇一摇签到obj(是否覆盖签到:0:需要询问用户；1：用户已确认要覆盖),
       * obj1(0:当前是非考勤日，询问用户是否考勤；1：当前是非考勤日，用户已确认要考勤)
       shakeId 第一次进入记录的唯一id，用于后台再次提交不用再调接口查询用户信息（用户还停在考勤页面） */
      _.showLoading("正在处理摇一摇考勤...");
      _.ajax({
        url: dataBase.todayCheck.shakeSignUrl,
        type: "post",
        data: {
          checkWorkId: checkWorkId,
          signId: signId,
          ticket: ticket,
          againsignin: againsignin,
          isWorkDate: isWorkDate,
          shakeId: shakeId
        },
        success: function(result) {
          if (result.code == "0") {
            let list = result.data.list;
            let resultShakeId = result.data.shakeId;
            _this.shakeId = resultShakeId;
            if (list && list.length > 0) {
              tihs.$emit("handerShakeRule", list);
            } else {
              _this.handerSignAfter(result, item);
            }
          }
        }
      });
    },
    showRemark(item) {
      /**如果已有备注则显示备注缩略，否则打开备注编辑页面 */
      let _this = this;
      if (item.isHasRemark) {
        item.isHasRemark = !item.isHasRemark;
        return;
      }
      if (item.content || item.id == dataBase.todayCheck.markItem) {
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
            item["remarkImg"] = picList;
            for (let i = 0; i < personList.length; i++) {
              tempName += personList[i].personName + " ";
            }
            if (personList.length > 0) {
              item["remarkPerson"] = "负责人：" + tempName;
            }
            item["personList"] = personList;
            item.content = result.data.content;
            item.isHasRemark = !item.isHasRemark;
          }
        });
      } else {
        /**打开备注页面 */
        _this.turnToAdd(item);
      }
    },
    //点击跳转备注添加页
    turnToAdd(item) {
      this.$emit("remarkPageShow", item);
    },
    //预览图片
    preview(src, list) {
      EventBus.$emit(
        "previewImages",
        (_.compressURL + src).replace("/compress/", "/"),
        list
      );
    },
    //打开地图
    showMap(item) {
      this.locationInfo.showMap = true;
      /**百度地图坐标转化为腾讯地图坐标 */
      let newPoint = addUpdate.BdmapEncryptToMapabc(item.latitude,item.longitude);
      this.locationInfo.latitude = Number(newPoint.lat).toFixed(6); //保留六位小数
      this.locationInfo.longitude = Number(newPoint.lng).toFixed(6); //保留六位小数
      this.locationInfo.value = item.signAddress;
    },
    //关闭地图
    closeMap() {
      this.locationInfo.showMap = false;
    },
    signIn: function(item, againsignin, isWorkDate) {
      let _this = this;
      let signPosintionId = item.signPosintionId;
      let signType = item.signType;
      let ruleId = dataBase.todayCheck.nowRule.id ? dataBase.todayCheck.nowRule.id :item.checkWorkId ;
         if(!_.isGetLocation()){//如果非微信
             _.alert("","请在手机端/考勤机进行考勤");
             return;
         }
      let dataVo = _this.signMessage.ruleVo ? _this.signMessage.ruleVo :dataBase.todayCheck.nowRule.item; //当前考勤规则详情
      let signName;
      if (signType == "1") {
        signName = "签到";
      } else {
        signName = "签退";
      }
      dataBase.todayCheck.submitItem = {
        signPosintionId: signPosintionId,
        againsignin: againsignin,
        isWorkDate: isWorkDate,
        ruleId: ruleId,
        signName: signName,
        dataVo: dataVo,
        item: item
      };
      _this.isMobileCheckWork(dataVo);
      _this.isBeDisable(dataVo);
      _.getAddress(_this.getAddress);
    },
    getAddress: function(address) {
      //获取考勤地址和经纬度
      this.address = address;
      this.handleBeforSignSubmit(dataBase.todayCheck.submitItem);
    },
    handleBeforSignSubmit(item) {
      /**提交前处理 */
      let _this = this;
      if (item.againsignin == "1") {
        let desc = "重新" + item.signName + "将覆盖时间和地点信息";
        _.alert("提示", desc, {
          primaryBtn: {
            name: "确定",
            callBack: function() {
              _this.submitSign(
                item.signPosintionId,
                item.againsignin,
                item.isWorkDate,
                item.ruleId,
                item.signName,
                item.dataVo,
                item.item
              );
            }
          },
          defaultBtn: {
            name: "取消",
            callBack: function() {
              return;
            }
          }
        });
        return;
      } else {
        _this.submitSign(
          item.signPosintionId,
          item.againsignin,
          item.isWorkDate,
          item.ruleId,
          item.signName,
          item.dataVo,
          item.item
        );
      }
    },
    isMobileCheckWork: function(dataVo) {
      //是否允许手机端进行考勤
      let isUseMachineSign = dataVo.isUseMachineSign; //是否使用考勤机考勤
      let isMobileSign = dataVo.isMobileSign; //使用考勤机考勤考勤时，是否禁用手机签到
      if (
        isUseMachineSign &&
        "1" == isUseMachineSign &&
        isMobileSign &&
        "1" == isMobileSign
      ) {
        //1：使用考勤机考勤；1：禁止手机端考勤
        _.alert("", "该考勤规则已禁用手机考勤，如有问题请联系管理员");
        return false;
      }
      return true;
    },
    isBeDisable: function(dataVo) {
      //是否被禁用不能考勤
      let checkType = dataVo.checkType;
      if (checkType === "1") {
        //排班的规则需要判断规则是禁用状态时不能考勤
        let ruleStatus = dataVo.status;
        if (ruleStatus !== "2") {
          //不是启用状态的都不能考勤
          _.alert("", "该规则已被禁用，不能考勤，如有疑问请联系管理员");
          return;
        }
      }
    },
    getWxLocation: function() {
      //通过微信SDK获取经纬度
      let longitude = "";
      let latitude = "";
      let checkwork_address = "";
      _.showLoading("正在获取定位信息...");
    },
    submitSign: function(
      signPosintionId,
      againsignin,
      isWorkDate,
      ruleId,
      signName,
      dataVo,
      item
    ) {
      /**提交签到签退数据*/
      let _this = this;
      let address = _this.address;
       /**腾讯地图坐标转换为百度地图 */
      let newPoint = addUpdate.mapabcEncryptToBdmap(address.latitude,address.longitude);
      address.latitude = newPoint.lat;
      address.longitude = newPoint.lng;
      if (!address.longitude) {
        _.hideLoading();
        _.alert("", "当前由于网络原因获取不到位置，请稍后重试");
        return;
      }
      let isgps = "0";
      let signDateVal = dataVo ? dataVo.signDate : "";
      if (!signDateVal) {
        signDateVal = "";
      }
      _.showLoading("正在" + signName + "...");
      _.ajax({
        url: _.baseURL + dataBase.todayCheck.submitSignUrl,
        type: "post",
        data: {
          id: signPosintionId,
          againsignin: againsignin, //是否再次打卡，0不是，1是，是否覆盖签到
          isgps: isgps, //固定传参0，obj3为判断签到还是签退，是否是gps签到
          longitude: address.longitude,
          latitude: address.latitude, //经纬度
          address: address.value, //地址信息
          isWorkDate: isWorkDate, //是否检查工作日
          signDate: signDateVal, //考勤日期
          ruleId: ruleId //规则id
        },
        success: function(result) {
          _this.handerSignAfter(result, item);
        }
      });
    },
    dealImagesUrl(url) {
      /**图片路径*/
      if (url.indexOf("http") != -1) {
        return url;
      }
      return (_.compressURL + url).replace("/compress/", "/");
    },
    getRuleDetial(ruleId) {
      /**由id从规则列表中找出符合的规则详情，如没有则返回false */
      let ruleList = this.ruleList;
      for (let i = 0; i < ruleList.length; i++) {
        if (ruleId == ruleList[i].id) {
          return ruleList[i];
        }
      }
      return false;
    },
    handleSchedulingCountTime(ruleId, countTime) {
      let ruleVo = this.getRuleDetial(ruleId);
      if (ruleVo) {
        this.scheContTime =
          parseFloat(this.scheContTime) + parseFloat(countTime);
      }
      return this.scheContTime;
    },
    updateSignView(item, newItem) {
      /**更新打卡后视图 */
      item.signTime = newItem.signinTime;
      item.status = newItem.status;
      item.id = newItem.id;
      item.latitude = newItem.latitude;
      item.longitude = newItem.longitude;
      item.signAddress = newItem.signAddress;
    },
    cutTime(signTime) {
      /**由于后台传递时间参数与显示要求不符，对不同长度参数进行切割处理 */
      return signTime.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "").replace(/(\d{2})\:(\d{2})\:(\d{2})/,"$1:$2");;
    },
    handerSignAfter(result, item) {
      /**处理打卡后更新的打卡项数据并渲染 */
      let _this = this;
      if (result.code == "0") {
        _.hideLoading();
        let po = result.data.po;
        let elasticWorkHour = result.data.elasticWorkHour;
        let countTime = result.data.countTime;
        let signStatus = result.data.signStatus;
        let signCardType = result.data.signCardType;
        let detailedNum = result.data.detailedNum;
        let checkSignType = result.data.checkSignType;
        let roleDetailedVO = result.data.roleDetailedVO;
        let newItem = {
          signTime: "",
          status: "",
          id: "",
          latitude: "",
          longitude: "",
          signAddress: ""
        };
        newItem.signinTime = result.data.signTime;
        newItem.status = po.status ? po.status : "1";
        newItem.id = po.id;
        newItem.latitude = po.latitude;
        newItem.longitude = po.longitude;
        newItem.signAddress = po.signAddress;
        _this.updateSignView(item, newItem);
        if (!countTime || parseFloat(countTime) <= 0) {
          countTime = "0";
        }
        if (checkSignType && checkSignType == "2" && _this.signMessage.ruleVo) {
          /**2:排班考勤*/
          dataBase.todayCheck.showNowTimeOne.totalNum = _this.handleSchedulingCountTime(
            _this.signMessage.ruleVo.id,
            countTime
          );
        } else {
          dataBase.todayCheck.showNowTimeOne.totalNum = countTime;
          if (result.data.isElastic && result.data.isElastic == "1") {
            /**1:弹性时长考勤*/
            if (
              elasticWorkHour &&
              parseFloat(countTime) < parseFloat(elasticWorkHour) &&
              signStatus == "2"
            ) {
              /**2:总考勤状态异常*/
              dataBase.todayCheck.isNormal = false;
            }
          }
        }
        if (result.data.signresult) {
          _.alert("", result.data.signresult);
        }
      } else if (result.code == "88") {
        _.hideLoading();
        _.alert("提示", result.desc, {
          primaryBtn: {
            name: "确定",
            callBack: function() {
              _this.signIn(item, "1", "1");
            }
          },
          defaultBtn: {
            name: "取消",
            callBack: function() {
              return;
            }
          }
        });
      } else if (result.code == "99") {
        _.hideLoading();
        _.alert("提示", result.desc, {
          primaryBtn: {
            name: "确定",
            callBack: function() {
              _this.signIn(item, "0", "1");
            }
          },
          defaultBtn: {
            name: "取消",
            callBack: function() {
              return;
            }
          }
        });
      } else {
        _.hideLoading();
        _.alert("提示", result.desc);
      }
    }
  }
};
</script>

<style scoped>
.signMassage {
  margin-top: 15px;
}
.qwui-checkItem {
  background: #fff;
}
.qwui-checkItemPos {
  width: auto;
  margin: 0 15px;
}
.qwui-qiandaoItem {
  display: flex;
  padding: 15px 0 0 0;
  justify-content: space-between;
}
.qwui-checkline {
  position: relative;
  padding-bottom: 15px;
}
.qwui-checkline:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  bottom: 0;
  border-top: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.qwui-signTime {
  height: 35px;
}
.qwui-signText {
  font-size: 16px;
  line-height: 20px;
}
.qwui-smallSignText {
  color: #999;
  font-size: 12px;
}
.qwui-signBtn {
  position: relative;
  width: 64px;
  height: 35px;
  box-sizing: border-box;
  text-align: center;
  line-height: 35px;
  font-weight: 300;
  border-radius: 5px;
  font-size: 15px;
}
.qwui-signBtn:after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
  border-radius: 10px;
}
.signinBtn {
  background: #2f7dcd;
  color: #fff;
}
.signoutBtn {
  background: #f8f8f8;
  color: #333;
}
.signMsgBtn {
  background: #f8f8f8;
  font-size: 20px;
  color: #2f7dcd;
}
.qwui-signMsg {
  margin: 0 auto 0 20px;
  max-width: 60%;
  color: #999;
}
.qwui-signRemarks {
  margin: 0 0 0 5px;
  color: #2f7dcd;
}
.qwui-signStatu {
  color: #e94f4f;
}
.qwui-diffLine {
  margin-bottom: 15px;
}
.shakePhone_btn {
  margin-left: 10px;
  position: relative;
}
.shakePhone_btn::after {
  content: "";
  background: url("~assets/images/checkwork/shakePhone.png") no-repeat;
  background-size: 61px 31px;
  background-position: -27px;
  width: 33px;
  height: 31px;
  display: block;
}
.beizhu_details {
  position: relative;
  border: 1px solid #ccc;
  font-size: 12px;
  padding: 10px 25px 10px 8px;
  margin-top: 9px;
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
.kaoqinCon {
  font-size: 13px;
  background: url(~assets/images/checkwork/mapMarker.png) no-repeat left 3px;
  -webkit-background-size: 13px 13px;
  background-size: 13px 13px;
  padding-left: 17px;
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
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.signOutItem {
  padding-bottom: 15px;
}
</style>

