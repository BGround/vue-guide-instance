<template>
  <div>
    <div class="main_wrap">
      <div class="container clearfix">
        <div class="left_side">
          <left-menu :leftMenuData="leftMenuData" :activeIndex="activeIndex" @leftMenuClick="leftMenuClick"></left-menu>
        </div>
        <div class="right_side">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from "../components/base/leftMenu"
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'learnonline',

  components: { leftMenu },

  props: {},

  data() {
    return {
      //侧边栏数据
      activeIndex: '',
    }
  },

  computed: {
    //获取用户权限
    ...mapGetters('header', [ 'permission', 'trustApp' ]),
    //获取侧边栏配置
    ...mapGetters('app', [ 'leftMenuData', ]),
  },

  watch: {},

  created() {
    //第一次进入初始化侧边栏数据
    !this.leftMenuData.length && this.setLeftMenuData();
    //初始化当前激活的侧边栏
    this.activeIndex = this.$router.currentRoute.name;
  },

  methods: {
    //把侧边栏数据保存在侧边栏中
    ...mapMutations('app', ['SET_LEFTMENUDATA']),
    //侧边栏数据的整理
    setLeftMenuData() {
      //首页数据的配置
      let indexData = [
        {
          appName: "首页",//应用名称
          iconPosition: "0 0",//图标样式
          // routerName: "",//路由的名字(还没重构的就不要该值)
          redirectParam: "",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
          modules: []//应用下的模块，即使modules为空也要写一个空数组
        }
      ];

      //后台返回的套件对象
      let { learnonline, examination } = this.trustApp;

      //培训学习和课程商城的配置
      let leranAndMallData = [];

      //判断是否有培训学习和课程商城权限的字段
      let { courseView, subjectView, enclosureView, teacherView, liveMenu, practiceMenu, } = this.permission;

      if(courseView || subjectView || enclosureView || teacherView || liveMenu || practiceMenu) {
        //套件的名字由后台返回
        let learnAgentName = this.beyondSubstr(learnonline.agentName);
        leranAndMallData = [
          {
            appName: learnAgentName,//应用名称
            iconPosition: "0 -20px",//图标样式
            modules:[
              {
                moduleName: "开课管理",//模块名称
                redirectParam: "10",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
                // routerName: "courseManage",//路由的名字(还没重构的就不要该值)
              },
              {
                moduleName: "课件管理",//模块名称
                redirectParam: "7",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "课程管理",//模块名称
                redirectParam: "8",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "讲师管理",//模块名称
                redirectParam: "9",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "直播管理",//模块名称
                redirectParam: "16",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
            ],
          },
          {
            appName: "课程商城",//应用名称
            iconPosition: "0 -40px",//图标样式
            redirectParam: "/vm/module/courseMall.html",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
            modules:[],
          },
        ];
      }

      //考试评测的配置
      let examData = [];

      //判断是否有考试评测权限的字段
      let { questionPoolMenu, testpaperMenu, examMenu, } = this.permission;

      if(questionPoolMenu || testpaperMenu || examMenu) {
        //套件的名字由后台返回
        let examAgentName = this.beyondSubstr(examination.agentName);
        examData = [
          {
            appName: examAgentName,//应用名称
            iconPosition: "0 -60px",//图标样式
            modules:[
              {
                moduleName: "题库管理",//模块名称
                redirectParam: "3",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "试卷管理",//模块名称
                redirectParam: "2",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "考试管理",//模块名称
                redirectParam: "1",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "练习管理",//模块名称
                redirectParam: "15",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
            ],
          },
        ]
      }

      //判断是否有公共题库权限, 但是必须要现有考试评测的权限
      let { questionTemplateMenu } = this.permission;
      if(examData.length && questionTemplateMenu) {
        examData[0].modules.push({
          moduleName: "公共题库",//模块名称
          redirectParam: "6",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
        })
      }

      //数据统计的配置
      let countData = [];

      let { examCountMenu, studentCount } = this.permission;

      if(examCountMenu || studentCount) {
        countData = [
          {
            appName: "数据统计",//应用名称
            iconPosition: "0 -80px",//图标样式
            modules:[
              {
                moduleName: "考试统计",//模块名称
                redirectParam: "4",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "学习统计",//模块名称
                routerName: "learnStatistics",
//                redirectParam: "12",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
              {
                moduleName: "课程统计",//模块名称
                redirectParam: "17",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
              },
            ],
          },
        ]
      }

      //学分统计的权限
      let { examCountDetail } = this.permission;

      if(countData.length && (studentCount || examCountDetail)) {
        countData[0].modules.push({
          moduleName: "学分统计",//模块名称
          routerName: "scoreStatistics",
//          redirectParam: "18",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
        });
      }

      //设置项的配置
      let settingData = [];

      //设置权限
      let { learnSetting, examSetting } = this.permission;

      if(learnSetting || examSetting) {
        settingData = [{
          appName: "设置",//应用名称
          iconPosition: "0 -100px",//图标样式
          routerName: "examSetting",//路由的名字(还没重构的就不要该值)
//          redirectParam: "5",//跳转到jsp页面所需要带上的参数，已经重构了的就不需要该参数
          modules: []
        }];
      }

      //整合新的左侧边栏
      // this.leftMenuData.push(...indexData, ...leranAndMallData, ...examData, ...countData, ...settingData);

      //保存侧边栏数据到vuex
      this.SET_LEFTMENUDATA([...indexData, ...leranAndMallData, ...examData, ...countData, ...settingData]);
    },
    //后台左侧应用入口文字，超出6个中文且前三个文字为“企微云”时，自动截取掉（不显示）。
    beyondSubstr(agentName) {
      if(agentName.length > 6 && agentName.substr(0,3) == '企微云'){
        agentName = agentName.substr(3);
      }
      return agentName;
    },
    //侧边栏点击事件
    leftMenuClick(routerName, redirectParam) {
      //目前被点击的测边栏
      if(routerName) {
        this.activeIndex = routerName;
        //vue重构页面的跳转逻辑
        routerName && this.$router.push({
          name: routerName
        });
      }
      //课程商城的跳转
      if(redirectParam === "/vm/module/courseMall.html") {
        this.$utils.windowRedirect(redirectParam);
        return
      }
      //还没重构页面的跳转
      (redirectParam === '' || redirectParam) &&
      this.$utils.windowRedirect("/manager/examination/main.jsp?classClick="+redirectParam);
    }
  },

}
</script>

<style lang="scss" scoped>
.main_wrap {
  width: 100%;
  .container {
    width: 1200px;
    min-height: 430px;
    margin: 25px auto;
    border: 1px solid #d9dadc;
    border-radius: 4px;
    background: #fbfbfb;
    overflow: hidden;
    .left_side {
      float: left;
      width: 200px;
      padding: 20px 0 10000px;
      margin-bottom: -10000px;
      border-right: 1px #eee solid;
      background-color: #fafafa;
    }
    .right_side {
      float: right;
      position: relative;
      width: 998px;
      min-height: 555px;
      background-color: #fff;
    }
  }
}
</style>
