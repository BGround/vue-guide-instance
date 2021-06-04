<template>
  <div class="wrap qwui-learnonline" >

  <!--头部菜单栏以及搜索栏,showMsgFromSearchBox:监听搜索事件-->
    <header class="qwui-tips fixed_set_top">
      <search-box
        v-if ="flag"
        :keyWord="keyWord"
        :searchinput="searchData"
        :searchIndex="searchIndex"
        @listenToSearchBox="showMsgFromSearchBox"
      ></search-box>
    </header>

    <div class="content">
      <keep-alive>
        <router-view ref="content"></router-view>
      </keep-alive>
    </div>

    <!-- 底部导航 -->
    <nav-footer class="fillBackground">
      <tab-one
        v-for="(navItem, index) in footerListData.nav"
        v-bind="navItem"
        :activeIndex="tabActiveIndex"
        :defaultColor="'icon-skyBlue'"
        :key="navItem.icon"
        @tabOneClick="tabOneClickMy(index)"
      >
      </tab-one>
    </nav-footer>
  </div>
</template>

<script>
  import search_box from '@/components/base/search_box';
  import footer_nav from '@/components/home/footer_nav';
  import navFooter from '@/components/part/nav_footer';
  import tabOne from '@/components/part/tab_one';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import { mapState, mapMutations } from 'vuex';

  import homePage from '../js/homePage';
  import * as timeUtil from '@/assets/js/time-util';
  import { getMenu } from '../api/getData';

  export default {
    name: 'index',
    components: {
      "footer-nav": footer_nav,
      "search-box": search_box,
      tabOne,
      navFooter
    },
    data() {
      return {
        footerListData:{},
        searchData: homePage.searchData,
        keyWord: '',
        searchIndex: 0, // 搜索类型的索引
        tabActiveIndex: 0, // 底部导航当前选中tab
        scrollTopArr: [0, 0, 0, 0, 0], // 存放五个页面的各种滚动高度，互不影响
        fromMy: false,
        flag: false, // 是否是学习任务
      }
    },
    computed: {
      ...mapState([
        'searchVal'
      ]),
      nav () {
        return this.footerListData.nav;
      }
    },
    created() {
      if(window.AGENT_CODE !== 'partyconstruction'){
        this._getMenu();
      }else{
        this.searchData.moreFunction.option.splice(1,1)
        let  option = dataBase.search.searchBar.moreFunction.option;
        if (option.length > 2) {
          option.splice(1, 1);
        }
        dataBase.search.coursesTabData.index = 1;
        this.footerListData =   dataBase.home.footerListData;
        if(this.$route.name == 'learn') {
          this.tabOneClickMy(0);
        }else {
          for (let i = 0; i < this.nav.length; i++) {
            if (this.nav[i].routerName === this.$route.name) {
              this.tabOneClickMy(i);
              return;
            }
          }
        }
      }
    },
    activated() {
      let querySearchType = Number(this.searchVal.searchType);
      if(!isNaN(querySearchType)) {
        this.searchIndex = this.searchData.moreFunction.option.findIndex((item)=>{// 更改搜索组件的搜索类型index
          return item.value == querySearchType
        });
      }

      // 滚动条高度恢复（ios微信端不设置高度仅用keep-alive首页几个页面滚动条会相互影响）
      this.$nextTick(() => {// 渲染完再设置回去
        window.scrollTo(0,  this.scrollTopArr[this.tabActiveIndex]);
      });

      // 添加滚动事件
	    window.addEventListener('scroll', this.scrollList);

      let dataBaseNav = dataBase.home.footerListData.nav;
      for (let i = 0; i < dataBaseNav.length; i++) {
        if (dataBaseNav[i].routerName === this.$route.name) {
          // 需要判断nav，因为初次进入页面，nav未有值，也会触发activated
          this.nav && this.nav.length && this.tabOneClickMy(i, true);
          return;
        }
      }

    },
    deactivated() {
      // 移除事件，避免污染其他页面
      window.removeEventListener('scroll', this.scrollList);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 返回首页需要请求考试页的数据 ['exam_result', 'marking_result', 'exam_write']
        let getExamDataRoute = ['marking_result', 'exam_write', 'exam_result', 'examing'];

        // 如果当前应用是考试首页，且从以上几个项目跳转回来，需要重新请求数据
        if (to.name == 'examination' && getExamDataRoute.includes(from.name)) {
          // 如果是考试中跳转回来，判断是否考试列表，考试列表需要刷新
          if(from.name == 'examing' ) {
            if (to.params.index == 0) { // 考试列表，直接刷新
              vm.$refs.content.initGetData(); // 请求刷新考试页面数据
            } else {
              // 练习或阅卷，仅需要刷新考试中
              vm.$refs.content._getRedPoint(); // 请求红点
              vm.$refs.content._getExaming(); // 请求考试中数据
            }

          } else {
            // 其他跳转过来的无需判断，直接刷新
            vm.$refs.content.initGetData(); // 请求刷新考试页面数据
          }
        }
      });
    },
    methods: {
      ...mapMutations([
        'SET_SEARCH_VALUE'
      ]),
      // 点击底部导航的任一项
      tabOneClickMy(index, created) {
        this.flag = this.nav[index].routerName == 'learning_tasks';
        this.fromMy = this.nav[index].routerName == 'my_relavent'; //“我的”
        // 切换路由
        this.tabActiveIndex = index;
        let router = {
          name: this.nav[index].routerName
        };
        // 滚动条高度恢复（ios微信端不设置高度仅用keep-alive首页几个页面滚动条会相互影响）
        this.$nextTick(() => {// 渲染完再设置回去
          window.scrollTo(0,  this.scrollTopArr[this.tabActiveIndex]);
        });

        // 首页之间的跳转,为考试时, nav为-1
        this.nav[index].routerName == 'examination' && Object.assign(router, {params: {index: -1}})
        if(window.AGENT_CODE !== 'partyconstruction'){
          this.$router.replace(router);// 需要路由跳转
        }else{
          created || this.$router.replace(router);// 需要路由跳转
        }

        // 变换active图标
        this.footerListData.nav.forEach((item, i) => {
          item.icon = item.icon.replace(/on$/, 'off');
        });
        let iconActiveClass = this.footerListData.nav[index].icon.replace(/off$/, 'on');
        this.footerListData.nav[index].icon = iconActiveClass;
      },
      // 搜索
      showMsgFromSearchBox(keyWord, index) {

        this.SET_SEARCH_VALUE({ // 更改仓库的index,在搜索页面可读取
            keyWord: keyWord,
            searchType: index
          });
         // 更改搜索组件的搜索类型index
        this.searchIndex = this.searchData.moreFunction.option.findIndex((item)=>{// 更改搜索组件的搜索类型index
          return item.value == index
        });
        if (keyWord) {
          this.$set(this, 'keyWord', keyWord);
          setTimeout(()=>{
            this.$set(this, 'keyWord', '');
          }, 100);
        }
        /*
        确认搜索后需要清空输入栏 watch需要有变动才会更新
        但keyWord单线程连续更新过快，watch监听不到变化,
        此处用异步清空
        */
        this.$router.push({name: 'search'});
      },
      // 滚动事件
      scrollList(event) {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
         this.scrollTopArr[this.tabActiveIndex] = scrollTop; // 当前页面高度赋值（用于记录各页面滚动条位置）
         // 由于是数组内整数，内无对象。computed会缓存数据，这里就没整合成计算属性
  	  },
  	  //获取底部菜单栏数据
  	  _getMenu() {
			  let _this = this;
			  let newNav = [];
			  //加return返回promise对象
  			return new Promise((resolve, reject) => {
  				getMenu({}, data => {
  					let openArray = data.menu.split(';');
  					dataBase.home.footerListData.nav.forEach(function(ele){
  						let index =  openArray.indexOf(ele.routerName);
  						index<0 ?'':newNav[index] = ele;
  						index<0 ? '':newNav[index].index = index;
  					})
  					_this.footerListData = dataBase.home.footerListData;
  					_this.footerListData.nav = newNav;
  					if (_this.$route.path == '/') {
  						_this.tabOneClickMy(0, true);
  					} else {
  						for (let i = 0; i < _this.nav.length; i++) {
  							if (_this.nav[i].routerName === _this.$route.name) {
  								_this.tabOneClickMy(i, true);
  							  return;
  							}
  						}
  					}

  				resolve();
  				});
  			});
  		}
	  },
  };

</script>

<style lang="scss" scoped>
  .wrap {
    .fixed_set_top {
      z-index: 3; // 因为公共组件下方的nav栏为 2, 默认的1点出的白屏无法遮挡
    }
  }
  .fillBackground /deep/ .qwui-nav_footer_height {
    height: 47px; //ios按公共组件上的48px会露底
  }
  .qwui-learnonline /deep/ .qwui-iconfont{
    font-size: 28px;
  }
</style>
