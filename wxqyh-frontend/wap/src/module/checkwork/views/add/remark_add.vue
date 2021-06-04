<template>
  <div>
    <div>
      <!--考勤打卡信息-->
      <div class="qwui-check_info_box">
        <div class="qwui-sign_address_box">
          <!--左侧栏-->
          <div class="qwui-info_box_left">
            <p class="qwui-info_left_signtype">
              <span>
              {{checkInfo.signType ==1 ? "签到" : "签退"}}
              </span>
            </p>
            <p class="qwui-info_left_time">
              {{checkInfo.signinTime}}
            </p>
          </div>
          <!--中间栏-->
          <div class="qwui-info_box_center">
            <p>
              <i v-if="checkInfo.signAddress"></i>
              <span class="qwui-sign_address" v-if="!checkInfo.longitude&&!checkInfo.latitude">
                  {{checkInfo.signAddress}}
              </span>
              <span class="qwui-sign_address"
                    v-if="!checkInfo.pageId && !checkInfo.machineId && checkInfo.longitude && checkInfo.latitude"
                    @click="operateMap('showPosition')"
              >
                  {{checkInfo.signAddress}}
              </span>
            </p>
            <p class="qwui-sign_type_box">
              <span class="qwui-sign_type">{{checkStatusObj[checkInfo.status]}}</span>
            </p>
          </div>
          <!--右侧栏-->
          <div class="qwui-info_box_right">
            <div
              class="qwui-sign_time"
              :class="{'qwui-red_color' : checkInfo.status != 1 }"
            >
              {{checkInfo.signTime | filtersSignTime}}
            </div>
          </div>
        </div>
      </div>
      <!--备注内容-->
      <div class="qwui-remark_text_box">
        <div>
          <div class="qwui-remark_text">
             <textarea
               placeholder="请输入备注内容，不多于60字"
               class="qwui-add_remark_text"
               v-model="commitDraft.content"
             >
             </textarea>
          </div>
        </div>
        <div class="qwui-add_image_file">
          <!--上传图片-->
          <add-img-list
            v-if="imgUploadPicList && imgUploadPicList.length"
            :imageList="imgUploadPicList"
            @handleDeleteImage="handleDeleteImage"
            :disabled="false">
          </add-img-list>
          <add-img v-if="isPic" agent="checkwork" :orderId="orderId" :onlyPhotograph="onlyPhotograph"
                   :imageList="imgUploadPicList"
                   :camera="camera"
                   :deleteImage="deleteImage"
                   @updateImageList="setImgUploadValue"
          >
          </add-img>
        </div>

      </div>
      <!--选人组件-->
      <user_add
        :userselect="dataBase.selectConfig"
        @selectPerson="selectPerson"
        @confirmPick="confirmPick"
      >
      </user_add>
      <!--底部操作按钮-->
      <div class="qwui-bottom_btn">
        <flow_button :buttondata="draftDetail.buttonConfig"></flow_button>
      </div>
    </div>

    <!--地图组件-->
    <tencent-map v-if="showMap"
                 :pos="pos"
                 :type="type"
                 @positionData="positionData"
                 @closeMap="showMap =false"
    >
    </tencent-map>
    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>
    <!--选择人员-->
    <user_select
      :selectconfig="dataBase.selectConfig"
      v-if="dataBase.selectConfig.show"
    >
    </user_select>
  </div>
</template>

<script>
import tencentMap from "@/components/add/tencentMap.vue";
import AddImgList from "@/components/add/upload/imgList";
import AddImg from "@/components/add/upload/add_img";
import previewImages from "@/components/base/previewImages";
import user_add from "@/components/add/user_select_build";
import flow_button from "@/components/button/flow_button";
import user_select from "@/components/base/user_or_dept_select";
import { photoSetting,loadLastCharge,commitRemark } from "../../api/getData";
import addUpdate from "../../js/add";

export default {
  name: "remark_add",
  props: {
    markDate: {}
  },
  components: {
    tencentMap,
    AddImgList,
    AddImg,
    previewImages,
    user_add,
    flow_button,
    user_select
  },
  data() {
    return {
      dataBase: dataBase,
      draftDetail: addUpdate.draftDetail,
      checkInfo: {
        signAddress: "",
        latitude: "",
        longitude: "",
        signType: "",
        signinTime: "",
        pageId: "",
        machineId: "",
        status: ""
      },
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
      pos: {},
      type: "",
      showMap: false,
      commitDraft: {
        content: "",
        toSelectId: 0,
        imageUrls: [],
        incharges: [],
        id: ""
      },
      isPic: true,
      orderId: "", //图片水印参数
      onlyPhotograph: false, // 判断能否拍照上传，true：只能拍照，false，支持拍照跟图片库
      imgUploadPicList: [],
      deleteImage: {}, //删除图片附件
      camera: ["album", "camera"],
      previewImageUrl: [], //需要预览的图片列表
      keyword: {
        type: 0,
        clientName: ""
      }
    };
  },
  created() {
    // 图片上传方式 可否支持拍照上传
    this.getPhotoType();
    this.initPicAndPerson();
    this.draftDetail.buttonConfig.primaryList[0].callBack = this.checkCommit;
    this.draftDetail.buttonConfig.defaultList[0].callBack = this.backToList;
    this.dataBase.selectConfig.selectList["toPersonList"].title = "负责人";
    this.dataBase.selectConfig.selectList["toPersonList"].loadLast = {
      show: true,
      name: "加载上次"
    };
  },
  filters: {
    filtersSignTime: function(val) {
      if (!val) return "";
      let newTimeVal = val.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "").replace(/(\d{2})\:(\d{2})\:(\d{2})/,"$1:$2");
      return newTimeVal;
    }
  },
  computed: {},
  methods: {
    /**初始化图片内容和负责人 */
    initPicAndPerson() {
      let _this = this;
      this.pos = {
        value: this.markDate.signAddress,
        latitude: this.markDate.latitude,
        longitude: this.markDate.longitude
      };
      this.commitDraft.id = this.markDate.id;
      this.checkInfo = this.markDate;
      this.commitDraft.content = this.markDate.content ? this.markDate.content : "";
      if (this.markDate.remarkImg && this.markDate.remarkImg.length > 0) {
        this.markDate.remarkImg.forEach(function(item, index) {
          _this.imgUploadPicList.push({ src: item.picPath });
        });
      } else {
        this.imgUploadPicList.splice(0);
      }
      if (this.markDate.personList && this.markDate.personList.length > 0) {
        this.dataBase.selectConfig.selectList[
          "toPersonList"
        ].userSelected = this.markDate.personList;
      } else {
        this.dataBase.selectConfig.selectList[
          "toPersonList"
        ].userSelected.splice(0);
      }
    },
    positionData(data) {
      this.pos = data;
    },
    //打开地图
    operateMap(type) {
      this.type = type;
      this.showMap = true;
    },
    // 获取图片上传方式
    getPhotoType() {
      let obj = {
        agentCode: "checkwork"
      };
      // is_photograph:0 允许选择图片 is_photograph:1  只能拍照上传
      photoSetting(obj).then(res => {
        if (res.code == "0") {
          this.onlyPhotograph = res.data.is_photograph == "1" ? true : false;
          if (res.data.is_photograph == "1") {
            this.onlyPhotograph = true;
            this.camera = ["camera"];
          } else {
            this.onlyPhotograph = false;
            this.camera = ["album", "camera"];
          }
        } else {
          _.alert("提示", res.desc);
        }
      });
    },
    // 图片上传
    setImgUploadValue(val) {
      this.imgUploadPicList = val;
      let arr = [];
      this.imgUploadPicList.forEach(item => {
        arr.push(item.src ? item.src : item.picPath);
      });
      this.commitDraft["imageUrls"] = arr.join();
    },
    // 图片删除
    handleDeleteImage(item) {
      this.deleteImage = item;
    },
    //确定选择的人员返回的数据
    selectPerson(el, obj) {
      if (obj && obj.user) {
        this.commitDraft["incharges"] = obj.user.idStr.replace(/\|/g, ",");
      }
    },
    // 负责人相关人添加
    confirmPick(el, isGet) {
      //负责人
      let userSelected = this.dataBase.selectConfig.selectList["toPersonList"]
        .userSelected;
      if (isGet) {
        loadLastCharge({ id: this.markDate.id }, data => {
          userSelected.splice(0, userSelected.length);
          userSelected.push.apply(userSelected, data.changeList);
        });
      } else {
        userSelected.splice(0, userSelected.length);
      }
    },
    //取消备注
    backToList: function() {
      this.$emit("closeMark", this.markDate);
    },
    checkCommit() {
      if (this.commitDraft["content"].length > 60) {
        _.alert("提示", "备注内容过长，请重新输入！");
        return;
      }
      this.doCommit();
    },
    //提交备注
    doCommit: function() {
      let self = this;
      _.showLoading("提交中");
      commitRemark(self.commitDraft,function () {
        _.hideLoading();
        if(self.commitDraft.content != "" || self.commitDraft.imageUrls.length > 0 || self.commitDraft.incharges.length > 0){
          self.dataBase.todayCheck.markItem = self.markDate.id;
        }else{
          self.dataBase.todayCheck.markItem = "";
        }
        self.$emit("closeMark", self.markDate);
      });
    }
  }
};
</script>

<style scoped>
.qwui-check_info_box {
  background-color: #fff;
  padding: 0 15px;
  border-bottom: 1px solid #ddd;
}
.qwui-sign_address_box {
  padding: 15px 0;
  position: relative;
}
.qwui-info_box_left {
  float: left;
  margin-right: 10px;
  display: block;
}
.qwui-info_left_signtype {
  font-size: 16px;
}
.qwui-info_left_time {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
.qwui-info_box_center {
  width: 70%;
  margin-left: 42px;
  margin-right: 89px;
}
.qwui-info_box_center i {
  float: left;
  display: inline-block;
  width: 13px;
  height: 22px;
  line-height: 22px;
  background: url("~assets/images/checkwork/mapMarker.png") no-repeat left 4px;
  background-size: 13px auto;
}
.qwui-sign_address {
  width: 80%;
  padding-left: 3px;
  font-size: 13px;
  color: #999;
  line-height: 1.8;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  text-overflow: ellipsis;
}
.qwui-sign_type_box {
  vertical-align: center;
  font-size: 13px;
  padding-left: 17px;
}
.qwui-sign_type {
  max-width: 60%;
  color: #e94f4f;
  margin-right: 10px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
.qwui-info_box_right {
  position: absolute;
  top: 21px;
  right: 0;
  margin-left: 10px;
}
.qwui-sign_time {
  width: 64px;
  height: 35px;
  box-sizing: border-box;
  text-align: center;
  line-height: 35px;
  font-weight: 300;
  background: #fbfafc;
  border-radius: 5px;
  border: 1px solid #d6d5d6;
  font-size: 20px;
  color: #467db9;
}
.qwui-red_color {
  color: #e94f4f;
}
/*备注内容样式*/
.qwui-remark_text_box {
  padding-left: 15px;
  background: #fff;
}
.qwui-remark_text {
  padding: 12px 15px 12px 0;
  position: relative;
  min-height: 19px;
  line-height: 22px;
  border-bottom: 1px solid #ddd;
}
.qwui-add_remark_text {
  width: 100%;
  min-height: 42px;
  font-size: 16px;
  color: #666;
  border: none;
  resize: none;
}
.qwui-add_image_file {
  margin-top: 20px;
  padding-bottom: 10px;
}
.qwui-bottom_btn {
  margin-top: 10px;
}
</style>

