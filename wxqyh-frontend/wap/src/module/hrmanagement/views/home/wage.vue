<template>
  <div class="qwui-wage">
    <!-- <span class="qwui-font-header">工资条</span> -->
    <div @click="goToWage" class="qwui-lean_entry_list h40">
      <div class="lean_entry_list_item qwui-flexbox h40">
        <span class="qwui-flexItem h40">工资条</span>
        <i class="qwui-icon_arrow_fr icon_gray">更多</i>
      </div>
    </div>
    <div class="qwui_data_list" v-if="wageList[0]" @click="goToWageDetail(wageList[0].id)">
      <div class="data_mes ic_a-certificate">
        <span class="qwui_font_title" v-text="wageList[0]?wageList[0].name:''"></span>
        <span
          class="qwui_font_category mt6"
          v-text="wageList[0]?wageList[0].sendTime.substring(0,16):''"
        ></span>
      </div>
    </div>
    <div class="qwui_data_list" v-if="wageList[1]" @click="goToWageDetail(wageList[1].id)">
      <div class="data_mes ic_a-certificate">
        <span class="qwui_font_title" v-text="wageList[1].name"></span>
        <span class="qwui_font_category mt6" v-text="wageList[1].sendTime.substring(0,16)"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { getDetailList } from "../../api/getData";
export default {
  name: "wage",
  data() {
    return {
      wageList: [] //工资条信息列表
    };
  },
  created() {
    this._getDetailList(); //获取工资信息
  },
  methods: {
    goToWage() {
      window.location.href = _.baseURL+'/jsp/wap/dynamicinfoManage/private_list.jsp?form_hr=true&agentCode=hrmanagement&abc=1'
      // this.$router.push({
      //   path: "salaryList",
      //   query: { form_hr: true, agentCode: "hrmanagement", abc: 1 }
      // });
    },
    _getDetailList() {
      let _this = this;
      getDetailList({}, data => {
        if (data.pageData) {
          _this.wageList = data.pageData;
        }
      });
    },
    goToWageDetail(id) {
      window.location.href =
        _.baseURL +
        "/jsp/wap/dynamicinfoManage/private_detail.jsp?id=" +
        id +
        "&belongAgent=dynamic";
    }
  }
};
</script>
<style lang="scss" scoped>
.qwui-lean_entry_list .lean_entry_list_item {
  height: 40px;
  line-height: 40px;
  .qwui-icon_arrow_fr {
    padding-right: 25px;
    color: #b2b9c8;
    font-size: 14px;
    font-weight: 400;
    font-family: PingFangSC-Regular;
    cursor: pointer;
  }
}
.qwui-lean_entry_list .lean_entry_list_item::after {
  border: none;
}
.ic_a-certificate {
  background: url("../../../../assets/images/ic_a-certificate.png") no-repeat
    left center;
  background-size: 41px 40px;
}
.qwui_data_list_div {
  height: 196px;
}
.qwui-wage /deep/ .img_a-nodata_04 {
  display: inline-block;
  width: 274px;
  height: 142px;
  background: url("../../../../assets/images/img_a-nodata_04.png") center
    no-repeat;
  background-size: cover;
}
.qwui-wage /deep/ .qwui-no_record_text {
  margin-top: 0;
  height: 21px;
  font-size: 15px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(178, 185, 200, 1);
  line-height: 21px;
}
.qwui-wage /deep/ .qwui-no_record_box {
  position: relative;
  top: 0;
  margin-top: 0;
}
</style>


