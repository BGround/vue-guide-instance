<template>
  <div class="wrap">
    <div v-show="showSearchBar" class="qwui-searchBox_height"></div>
    <div v-show="showSearchBar" class="qwui-menu_tab_fixed active">
      <search_bar
        :searchinput="searchBarData"
        :keyWord="searchBarData.keyWord"
        @listenToSearchBox="searchKeywordClick"
        :placeholder="searchBarData.placeholder"
      >
      </search_bar>
    </div>
    <div class="leadBar">
      <div class="itemTitle bottom_boder"  v-if="deptTitleName">
        <div class="fl">
          <span class="fl cblue" @click="backDept">全部</span>
          <span class="fl" v-if="childIndex>1">
            <span class="deptEllipsis">&gt; ... &gt; </span>
            <span class="cblue" @click="backLast">返回上一级</span>
          </span>
        </div>
        <div class="titleDept">&gt;{{deptTitleName}}</div>
      </div>
    </div>
    <div class="wrap_inner">
      <div class="blackPlaceholder"></div>
      <div class="deptBody">
        <div class="qwui-dept_item_marginTop">
          <div class="qwui-dept_item"
               v-for="departItem in deptlist"
               :key="departItem.id"
               v-if="departItem.totalUser>0"
          >
            <a class="a_link"
               @click="getChildDeptAndMember(departItem.id,departItem.departmentName)"
            >
            </a>
            <div class="qwui-dept_item_inner">
              <div class="avator"></div>
              <div class="title flexItem">
                <p class="">{{departItem.departmentName}}</p>
                <p class="">{{departItem.totalUser}}人</p>
              </div>
              <i class="qwui-icon_arrow_fr icon_gray"></i>
            </div>
          </div>
          <div class="rankItem"
               v-for="memberItem in memberList"
               :key="memberItem.id"
               @click="gotoPersonCalendar(memberItem)"
          >
            <div class="rankItemContent line-bottom">
              <img :src="memberItem.headPic!=0 ? memberItem.headPic : proHeadPicUrl" alt="未获取图片">
              <div class="rankUserName qwui-spanEllips">{{memberItem.personName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import search_bar from "../../../components/base/search_box.vue";

const proHeadPicUrl = require("../../../assets/images/icon_person.png");

export default {
  name: "statisticForSearch",
  components: {
    search_bar
  },
  data() {
    return {
      departItem:{
        departmentName:"",
        id:"",
        totalUser:""
      },
      memberItem:{
        headPic:proHeadPicUrl,
        personName:"",
        id:""
      },
      showSearchBar: true,
      searchBarData: {
        //头部搜索框
        show: true,
        keyWord: "",
        placeholder:"搜索姓名"
      },
      proHeadPicUrl:proHeadPicUrl,
      deptlist:[],
      memberList:[],
      childIndex:0,
      totalData:[],
      dataItem:{
        deptlist:[],
        memberList:[]
      },
      deptTitleName:""
    };
  },
  methods: {
    gotoPersonCalendar(rankItem){
       this.$router.push({
         path: '/checkCalendar',
         query:{
           rankItem: rankItem,
           index:1
         }
       });
    },
    searchKeywordClick(data) {
      var _this = this;
      _.ajax({
        url: _.baseURL + dataBase.statistics.getSearchKeyUrl,
        type: "post",
        data: {
          "personName":data,
        },
        success: function(result) {
          if (result.code == "0") {
            _this.memberList = result.data.pageData;
            _this.deptlist = [];
            _this.deptTitleName = "";
            _this.childIndex = 0;
          }
        }
      });
    },
    getInitDepart(){
      var _this = this;
      _.ajax({
        url: _.baseURL + dataBase.statistics.getDeptForSearch,
        type: "post",
        data: {
        },
        success: function(result) {
          if (result.code == "0") {
            _this.deptlist = result.data.dept;
          }
        }
      });
    },
    getChildDeptAndMember(deptId,deptName){
      var _this = this;
      _.ajax({
        url: _.baseURL + dataBase.statistics.getDeptAndMember,
        type: "post",
        data: {
          "deptId": deptId,
          "agentCode": "addressBook"
        },
        success: function(result) {
          if (result.code == "0") {
            _this.deptlist = result.data.deptlist;
            _this.memberList = result.data.userList;
            _this.deptTitleName = deptName;
            var dataItem = {
                  deptlist:[],
                  memberList:[],
                  deptTitleName:""
            };
            dataItem.deptlist = result.data.deptlist;
            dataItem.memberList = result.data.userList;
            dataItem.deptTitleName = deptName;
            _this.totalData.push(dataItem);
            _this.childIndex++;
          }
        }
      });
    },
    backDept(){
      this.deptTitleName = "";
      this.childIndex = 0;
      this.totalData = [];
      this.deptlist = [];
      this.memberList = [];
      this.getInitDepart();
    },
    backLast(){
      var dataItem = this.totalData[this.childIndex-2];
      this.deptlist = dataItem.deptlist;
      this.memberList = dataItem.memberList;
      this.deptTitleName = dataItem.deptTitleName;
      this.totalData.pop();
      this.childIndex--;
    }

  },
  created() {
    this.getInitDepart();
  },
};
</script>

<style scoped>
.leadBar {
  margin-top: 40px;
  background: #fff;
}
.itemTitle {
  margin-left: 15px;
  line-height: 40px;
}
.bottom_boder {
  position: relative;
}
.bottom_boder::after {
  content: " ";
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 200%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
}
.fl {
  float: left;
}
.cblue {
  color: #586c94;
}
.deptEllipsis {
  line-height: 20px;
  margin-left: 5px;
  color: #999;
}
.titleDept {
  display: block;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #999;
}
.wrap_inner {
  position: relative;
  width: 100%;
  background: #fff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-x: hidden;
}
.wrap_inner::-webkit-scrollbar {
  width: 0;
  height: 6px;
}
.wrap_inner::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
}
/*部门、组织*/
.qwui-dept_item_marginTop .qwui-dept_item .a_link {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin-left: 45px;
  color: #666;
}
.qwui-dept_item_open .qwui-dept_item .a_link {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  color: #666;
}
.qwui-dept_item {
  position: relative;
  overflow: hidden;
  font-size: 16px;
  background-color: white;
  line-height: 2.2;
  clear: both;
}
.qwui-dept_item:after {
  content: " ";
  position: absolute;
  left: 15px;
  bottom: 0;
  right: 0;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.qwui-dept_item_inner {
  display: flex;
  padding: 10px 15px;
}
.qwui-dept_item .avator {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  min-width: 38px;
  background: url(~assets/images/checkwork/dept_ico.jpg) no-repeat;
  background-size: 100%;
}
.qwui-dept_item .iconTag {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  min-width: 38px;
  background: url(~assets/images/checkwork/icon_common_tag.png) no-repeat;
  background-size: 100%;
}
.qwui-dept_item .title {
  flex: 1;
}
.qwui-dept_item p {
  line-height: 20px;
}
.qwui-dept_item p:last-child {
  font-size: 13px;
  color: #999;
}
.rankItem {
  position: relative;
  overflow: hidden;
  padding-left: 15px;
}
.rankItem img {
  float: left;
  margin: 12px 11px 12px 0;
  width: 40px;
  height: 40px;
}
.rankItemContent {
  overflow: hidden;
}
.rankUserName {
    margin: 20px 0 0 0;
    float: left;
    font-size: 15px;
    max-width: 250px;
}
.qwui-spanEllips {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.rankMemberDept {
  position: absolute;
  top: 35px;
  left: 50px;
  font-size: 12px;
  color: #999;
}
.icon_search_noCourse {
  display: inline-block;
  width: 130px;
  height: 130px;
  background: url("~assets/images/checkwork/noCourse.png") center no-repeat;
  background-size: cover;
}
.warp-no-data {
  margin: 220px 25px 0;
  text-align: center;
}
.warp-no-tab-no-data {
  margin: 170px 25px 0;
  text-align: center;
}
.warp-no-data p {
  margin-top: 18px;
  line-height: 20px;
}
.qwui-no-data-title {
  font-size: 20px;
  color: #666;
}
.qwui-no-data-sm_text {
  font-size: 14px;
  color: #bbb;
}
.date-list-datebtn {
  width: 20px;
  height: 20px;
  margin: 10px 15px 0 0;
  background: url(~assets/images/checkwork/ic_arrow_left.png) no-repeat left
    center;
  background-size: 10px;
  cursor: pointer;
  transform: rotate(270deg);
  float: right;
}
.dateForRank {
  display: block;
  float: right;
  margin: 15px 0 0 0;
  font-size: 14px;
  width: 80px;
  border: 0;
  color: #666;
}
/*边框定位*/
.line-bottom{
  position: relative;
}
/*下边框*/
.line-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: auto;
}
</style>
