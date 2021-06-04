<template>
  <div class="learn-courseList">
    <!--顶部tab栏-->
    <div class="courseList_tab">
      <qw-tab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qw-tab>
      <span class="tab_btn">
        <qw-button type="primary" @click="openCourse">
          开设课程
        </qw-button>
        <div class="btn_options"
             v-show="showCourseOption"
             @mouseleave="showCourseOption = false"
        >
          <div class="option"
               v-for="item in tabList"
          > {{ item.text }} </div>
        </div>
      </span>
      <span class="label_description"
            @mouseover="showOpenCourseTip = true"
            @mouseleave="showOpenCourseTip = false"
      >?</span>
      <div class="label_tip tip_openCourse tip_topToBottom"
           v-show="showOpenCourseTip"
           @mouseover="showOpenCourseTip = true"
           @mouseleave="showOpenCourseTip = false"
      >
        <div class="tip_content">
          【必学课】有规定的完成时间，突出完成时间和完成进<br>
          <span class="ml60">度，可给员工指派多个必学课程</span><br>
          【选学课】鼓励学员自由选择感兴趣的课程学习，没有<br>
          <span class="ml60">规定的完成时间</span>
        </div>
      </div>
    </div>
    <!--标签-->
    <div class="courseList_tag">
      <tag :tags="tags" :activeTag="activeTag" @click="tagClick"></tag>
    </div>
    <!--搜索功能-->
    <div class="courseList_search">
      <div class="bread">
        <span class="bread_allCourse" @click="tagClick('type', '', '不限')">全部课程</span>
        <span @click="tagClick('type', activeTagArray[index]['type'], activeTagArray[index]['typeName'])">&nbsp;>&nbsp;<span class="bread_type">{{ activeTagArray[index]["typeName"] }}</span></span>
        <span v-if="activeTagArray[index]['smallTypeName']">&nbsp;>&nbsp;<span class="bread_smallType"></span>{{ activeTagArray[index]["smallTypeName"] }}</span>
      </div>
      <div class="search">
        <search-box :searchSetting="searchSetting" :keyWord="keyWord" @click="searchCourse"></search-box>
      </div>
      <div class="sort" v-show="!index">
        <span class="sort_item"
              :class="{ active : !sortType.activeType }"
              @click="sortClick(0)"
        >
          发布时间
          <span class="sort_arrow"
                :class="{active : !sortType.activeType, down : !sortType.value[0]}"></span>
        </span>
        <span class="sort_split">|</span>
        <span class="sort_item"
              :class="{ active :  sortType.activeType }"
              @click="sortClick(1)"
        >
          学习人数
          <span class="sort_arrow"
                :class="{active : sortType.activeType, down : !sortType.value[1]}"></span>
        </span>
      </div>
    </div>
    <!--课程列表-->
    <div class="courseList_list">
      <course-card :courseList="courseList" :isMust="index" @click="cardClick"></course-card>
    </div>
    <!--分页-->
    <div class="courseList_page" v-if="pageData.totalRows">
      <page :pageData="pageData" :pageSizeOption="pageSizeOption" @change="pageChange"></page>
    </div>
    <!--课程详情侧滑页-->
    <course-detail v-if="showCourseDetail" v-bind:show.sync="showCourseDetail" :courseId="courseId"></course-detail>
  </div>
</template>

<script>
import qwTab from '@/components/Tab/QwTab';
import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import tag from './components/tag';
import searchBox from 'learn/components/base/searchBox';
import courseCard from './components/courseCard';
import page from '@/components/list/page'
import courseDetail from './components/courseDetail'
import { mapMutations } from 'vuex'

export default {
  name: 'courseList',

  components: { qwTab, qwButton, tag, searchBox, courseCard, page, courseDetail, },

  data() {
    return {
      //是否加载过列表数据, 0记录选学课，1记录必学课
      isLoadListDataArray: [false, false],
      showCourseOption : false,
      showOpenCourseTip: false,
      //目前激活的tab
      index:0,
      //tab栏配置
      tabList:[
        {
          text:'选学课',
        },
        {
          text:'必学课',
        },
      ],
      //激活的标签
      activeTagArray: [
        { //选学课
          'type': '', //分类
          'smallType': '', //子类
          'status': '', //状态
          'typeName' : '不限', //分类标签的名字
          'smallTypeName': '', //子类标签的名字
        },
        { //必学课
          'type': '',
          'smallType': '',
          'endTime': '',
          'status': '',
          'typeName' : '不限', //分类标签的名字
          'smallTypeName': '', //子类标签的名字
        }
      ],
      //标签的缓存
      tagsArray: [
        [
          { // 状态
            title: '状态',
            id: 'status',
            tag: [
              {
                id: '',
                category: '不限',
              },
              {
                id: '1',
                category: '未上线',
              },
              {
                id: '2',
                category: '上线中',
              },
              {
                id: '3',
                category: '已结束',
              },
            ],
          }
        ], //选学课
        [
          { // 截止时间
            title: '截止时间',
            id: 'endTime',
            tag: [
              {
                id: '',
                category: '不限',
              },
              {
                id: '7',
                category: '今后7天',
              },
              {
                id: '15',
                category: '今后15天',
              },
              {
                id: '30',
                category: '今后30天',
              },
            ],
          },
          { // 状态
            title: '状态',
            id: 'status',
            tag: [
              {
                id: '',
                category: '不限',
              },
              {
                id: '1',
                category: '未上线',
              },
              {
                id: '2',
                category: '上线中',
              },
              {
                id: '3',
                category: '已结束',
              },
            ],
          }
        ], //必学课
      ],
      //课程列表页的缓存
      courseListArray: [
        [], //选学课
        [], //必学课
      ],
      //发布时间和学习人数的排序
      sortType: {
        activeType: 0,
        value: [true, true], //ture表示上，false表示下
      },
      //搜索框的配置
      searchSetting : {
        width: 180,
        height: 32,
        placeholder: '课程名称',
      },
      //搜索关键词的缓存
      keyWordArray: [
        '', ''
      ],
      //分页的缓存
      pageDataArray: [
        { //选学课
          page: 1,
          pageSize: 9,
          maxPage: '',
          totalRows: '',
        },
        { //必学课
          page: 1,
          pageSize: 9,
          maxPage: '',
          totalRows: '',
        },
      ],
      //分页的配置
      pageSizeOption: [9, 18, 27, 36],
      //显示课程详情侧滑页
      showCourseDetail: false,
      //查看课程详情的id
      courseId: '',
    }
  },

  computed: {
    //已激活的tag
    activeTag() {
      return this.activeTagArray[this.index];
    },
    //标签的配置
    tags() {
      return this.tagsArray[this.index];
    },
    //课程列表的配置
    courseList() {
      return this.courseListArray[this.index];
    },
    //分页组件的配置
    pageData() {
      return this.pageDataArray[this.index];
    },
    //关键词的配置
    keyWord() {
      return this.keyWordArray[this.index];
    }
  },


  created() {
    //加载分类
    this.getCategory();
    //加载课程列表
    this.getCourseList();
    //改变是否加载过目前所处tab数据的标识
    this.isLoadListDataArray[this.index] = true;
  },

  methods: {
    ...mapMutations('app', ['SET_HIDDENSCROLL']),
    //tab点击
    selectIndex(index) {
      this.index = index;
      !this.isLoadListDataArray[this.index] && this.getCourseList();
      //第一次点击tab改变是否加载过目前所处tab数据的标识
      this.isLoadListDataArray[this.index] = true;
    },
    openCourse() {
      this.showCourseOption = !this.showCourseOption;
    },
    //标签点击
    tagClick(tagsId, tagId, tagName) {
      //保存tagId到缓存
      this.activeTagArray[this.index][tagsId] = tagId;
      //保存tagName到缓存
      if(tagsId == 'smallType') {
        this.activeTagArray[this.index]["smallTypeName"] = tagName;
      }
      if(tagsId == 'type') { //分类上的标签点击
        //保存tagName到缓存
        this.activeTagArray[this.index]["typeName"] = tagName;
        //获取子分类
        this.getCategory(tagId);
        //重置子类的激活标签
        this.activeTagArray[this.index]["smallType"] ='';
        //重置子类标签的名字
        if(tagId) {
          this.activeTagArray[this.index]["smallTypeName"] ='不限';
        }else { //点击不限
          this.activeTagArray[this.index]["smallTypeName"] ='';
        }
      }
      //重置当前页数为第一页
      this.pageDataArray[this.index].page = 1;
      //获取课程列表
      this.getCourseList();
    },
    //获取分类
    getCategory(categoryId = '') {
      let tags = this.tagsArray[this.index];
      //获取分类
      this.$api.getCategory({categoryId: categoryId}, data => {
        data.categoryList.unshift({
          id: '',
          category: '不限',
        });
        if(tags[0].id !== 'type') { //第一进来加载分类
          let categoryList = {
            title: '分类',
            id: 'type',
            tag: data.categoryList,
          };
          //为所有tagsArray赋值分类
          this.tagsArray.forEach(item => {
            item.unshift(categoryList, {});
          });
        }else if(categoryId !== ''){ //除不限之外的标签点击
          let categoryList = {
            title: '子类',
            id: 'smallType',
            tag: data.categoryList,
          };
          tags.splice(1, 1, categoryList);
        }else if(tags[1].id === 'smallType'){ //点击不限
          this.tags.splice(1, 1, {});
        }
      });
    },
    //获取课程列表
    getCourseList() {
      let index = this.index;
      //课程分类id
      let categoryId = this.activeTagArray[index]["smallType"] || this.activeTagArray[index]["type"];
      //课程的状态
      let searchValueState = this.activeTagArray[index]["status"];
      let param = {
        categoryId: categoryId, //分类id
        isMust: this.index, //课程类型
        page: this.pageData["page"], //当前页
        pageSize: this.pageData["pageSize"], //一页显示多少条数据
        'searchValue.state': searchValueState, //课程状态
        'searchValue.subject_name' : this.keyWordArray[this.index],
      };
      if(this.index) { //只有必学课才有的参数
        //课程截止时间
        param["searchValue.days"] = this.activeTagArray[index]["endTime"];
      }else { //只有选学课才有的参数
        //排序方式
        if(this.sortType.activeType){ //按学习人数
          param["searchValue.joinNumOrder"] = this.sortType.value[1] ? 'up' : 'down';
        }else { //按发布时间
          param["searchValue.pulishOrder"] = this.sortType.value[0] ? 'up' : 'down';
        }
      }
      this.$api.getCourseList(param, data => {
        let { currPage, maxPage, page, totalRows} = data;
        let pageData = this.pageDataArray[index];
        let courseList = this.courseListArray[index];
        pageData["page"] = currPage;
        pageData["maxPage"] = maxPage;
        pageData["totalRows"] = totalRows;
        courseList.splice(0);
        if(!page) {
          page = [];
        }
        courseList.push(...page);
      });
    },
    sortClick(type) {
      if(this.sortType.activeType == type) {
        this.sortType.value.splice(type, 1, !this.sortType.value[type])
      }else {
        this.sortType.activeType = type;
      }
      //重置当前页数为第一页
      this.pageDataArray[this.index].page = 1;
      //获取课程
      this.getCourseList()
    },
    //搜索课程
    searchCourse(keyWord) {
      this.keyWordArray.splice(this.index, 1, keyWord)
      //重置当前页数为第一页
      this.pageDataArray[this.index].page = 1;
      //获取课程
      this.getCourseList()
    },
    //课程卡片点击事件
    cardClick(event, id) {
      this[event](id);
    },
    //展示课程详情侧滑栏
    showDetail(id) {
      //限制页面滚动
      this.SET_HIDDENSCROLL(true);
      this.showCourseDetail = true;
      this.courseId = id;
    },
    //分页事件
    pageChange(currentPage, pageSize) {
      this.pageDataArray[this.index].page = currentPage;
      this.pageDataArray[this.index].pageSize = pageSize;
      //获取课程
      this.getCourseList()
    },
  },

}
</script>

<style lang="scss" scoped>
.learn-courseList {
  padding: 0 35px 0 28px;
  .courseList_tab {
    position: relative;
    /deep/ .qwui-tabs {
      min-width: 936px;
      height: 60px;
      line-height: 60px;
      .qwui-tab_group {
        .qwui-tab {
          height: 60px;
          line-height: 60px;
          &:hover {
            color: #f87b00;
          }
        }
      }
    }
    .tab_btn {
      position: absolute;
      top: 14px;
      right: 0;
      .btn_options {
        position: absolute;
        top: 37px;
        left: 0;
        width: 88px;
        text-align: center;
        background-color: #fff;
        box-shadow:0px 3px 12px 0px rgba(0,0,0,0.08);
        border:1px solid rgba(247,247,247,1);
        z-index: 1;
        .option {
          height: 32px;
          line-height: 32px;
          color: #383838;
          cursor: pointer;
          &:hover {
            background-color: #F7F7F7;
          }
        }
      }
    }
    .label_description {
      position: absolute;
      top: 22px;
      right: 100px;
      line-height: normal;
    }
    .tip_topToBottom {
      top: 50px;
      left: inherit;
      right: 70px;
      &::before {
         transform: rotate(90deg);
         top: -15px;
         right: 30px;
         left: inherit;
      }
      &::after {
         top: -3px;
         right: 34px;
         left: inherit;
      }
      .tip_content {
        .ml60 {
          margin-left: 60px;
        }
      }
    }
  }
  .courseList_tag {
    padding: 16px;
    margin-top: 16px;
    background:rgba(250,250,250,1);
    border-radius:4px;
  }
  .courseList_search {
    height: 60px;
    padding-top: 14px;
    .bread {
      float: left;
      line-height: 32px;
      .bread_allCourse {
        color: #808080;
        cursor: pointer;
        &:hover {
          color: #f87b00;
        }
      }
      .bread_arrow {
        color: #808080;
      }
      .bread_type {
        color: #383838;
        cursor: pointer;
        &:hover {
           color: #f87b00;
        }
      }
      .bread_smallType {
        color: #383838;
      }
    }
    .search {
      float: right;
    }
    .sort {
      float: right;
      padding: 6px 0;
      margin-right: 26px;
      .sort_item {
        color: #A6A6A6;
        cursor: pointer;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        &.active {
           color: #F87B00;
        }
        .sort_arrow {
          position: relative;
          display: inline-block;
          top: 3px;
          width: 16px;
          height: 16px;
          background: url(~assets/images/icon_arrow.png) no-repeat;
          &.active {
             background: url(~assets/images/icon_arrowActive.png) no-repeat;
          }
          &.down {
            transform: rotateZ(180deg);
          }
        }
      }
      .sort_split {
        color: #E5E5E5;
        margin: 0 12px;
      }
    }
  }
  .courseList_list {
    margin-top: 24px;
  }
  .courseList_page {
    margin-top: 36px;
  }
}
</style>
