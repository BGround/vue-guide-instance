<template>
<div>
  <div class="qwui-my" v-show="footerTab.nav_on == 1">
    <div class="bg_img"></div>
    <div class="content">
      <div class="head">
        <div class="pic">
          <img :src="headPic"/>
        </div>
        <div class="name">{{userName}}</div>
      </div>
      <div class="more">
        <div class="function" v-for="item in content">
          <span class="description">
            <i :class="item.class"></i>
            {{item.description}}
          </span>
          <span class="link">敬请期待<i></i></span>
        </div>
      </div>
    </div>
  </div>
  <div class="qwui-login" v-show="footerTab.nav_on == 0">
    <qw-carousel class='qwui-carousel'
      @update-index="updateIndex"
    >
      <qw-carousel-item
        v-for="(item, index) in carousel"
        :key="item.id"
        :cover="item.cover"
        :title="item.title"
        @item-click="toDetail(index)"
      ></qw-carousel-item>
    </qw-carousel>
    <div class="img_box_slider">
      <div class="span_list">
        <div :class="{'active': index === i}"
          v-for="i in carousel.length"
        ></div>
      </div>
    </div>
    <div class="menu">
      <div class="item" v-for="item in menu"
        @click="jump(item)"
      >
        <div class="pic">
          <div class="img"
            :class="['position-' + item.id]"
          ></div>
        </div>
        <p v-text="item.text"></p>
      </div>
    </div>
  </div>
  <footer-tab :footerNavData="footerTab" @click="clickFooter"></footer-tab>
</div>
</template>
<script>
  import footerTab from './login/footer.vue'
  import login from '../js/login'
  import {getTypeData, getLoginPictures} from '../api/getData'
  import QwCarousel from '@/components/carousel';
  import QwCarouselItem from '@/components/carousel/item';

  import defaultImage1 from '../img/background1.png';
  import defaultImage2 from '../img/background2.png';
  import defaultImage3 from '../img/background3.png';

  const _ = window._;

  // 默认封面图
  const DEFAULT_IMAGE = [
    defaultImage1,
    defaultImage2,
    defaultImage3
  ];

  export default {
    data(){
      return{
        content:[
          {
            description:"我的档案",
            class:"doc"
          },
          {
            description:"缴纳党费",
            class:"pay"
          }
        ],
        menu: [
          {
            id: 1,
            text: '党建要闻',
            link: '',
            type: 'vue'
          }, {
            id: 2,
            text: '党内公示',
            link: '',
            type: 'vue'
          }, {
            id: 3,
            text: '通知公告',
            link: '',
            type: 'vue'
          }, {
            id: 4,
            text: '政策法规',
            link: '',
            type: 'vue'
          }, {
            id: 5,
            text: '三会一课',
            link: '',
            type: 'vue'
          }, {
            id: 6,
            text: '专题教育',
            link: '',
            type: 'vue'
          }, {
            id: 7,
            text: '党员社区',
            link: _.baseURL + '/jsp/wap/topic/all_topic_list.jsp?agentCode=partyconstruction',
            type: 'default'
          }, {
            id: 8,
            text: '党员活动',
            link: _.baseURL + '/jsp/wap/activity/activity_index.jsp?agentCode=partyconstruction',
            type: 'default'
          }, {
            id: 9,
            text: '民意调研',
            link: _.baseURL + '/jsp/wap/question/question_index.jsp?agentCode=partyconstruction',
            type: 'default'
          }, {
            id: 10,
            text: '党员考学',
            link: _.baseURL + '/vp/module/learnonline.html?agentCode=partyconstruction',
            // link: _.baseURL + '/vp/module/learnonline.html?agentCode=partyconstruction',
            type: 'default'
          }
        ],
        footerTab:login.footer,
        index:1,
        userName:_.personName,
        headPic:_.headPic,
        tempSrc: []
      }
    },
    computed: {
      // 轮播图图片
      carousel () {
        return this.tempSrc.map(({ id, title, coverImage }, index) => {
          if (coverImage === '') {
            coverImage = DEFAULT_IMAGE[index % DEFAULT_IMAGE.length];
          }

          return {
            id,
            title,
            cover: coverImage
          };
        })
      }
    },
    created:function () {
      var _this = this;
      this.getLoginData();
      this.getPictures();
    },
    methods:{
      //首页的类型
      getLoginData:function () {
        // 未改版接口
        getTypeData(result => {
          result.typeList.forEach((id, index) => {
            let menu = this.menu[index];
            menu.link = `/index?id=${id}&name=${menu.text}`
          });
          this.menu[0].id = result.typeList[0];
        });
      },
      jump ({ link, type }) {
        if (link) {
          switch (type) {
            case 'vue':
              this.$router.push(link);
              break;
            default:
              let corp_id = _.getUrlParam('corp_id');
              if (corp_id) {
                link += '&corp_id=' + corp_id;
              }
              location.assign(link);
              break;
          }
        } else {
          _.alert('提示', '该功能尚未开发');
        }
      },
      //首页轮播图
      getPictures:function () {
        getLoginPictures( (result) =>{
          result.articleSummaryList.forEach(function (e) {
            e.coverImage != '' ? (e.coverImage = (_.compressURL+ e.coverImage).replace('/compress/', '/')):''
          })
          this.tempSrc = result.articleSummaryList;
        })
      },
      //轮播图跳到详情
      toDetail:function (index) {
        if(this.tempSrc[index]) {
          this.$router.push({
            path: '/partyDetail',
            query: {
              id: this.tempSrc[index].id,
              page: index + 1,
              typeId: this.menu[0].id
            }
          })
        }
      },
      clickFooter:function (val) {
      },
      toIndex:function (i) {
        this.$router.push({
          path: '/index',
          query:{ id:i.id, name:i.text}
        })
      },
      updateIndex (index) {
        this.index = index;
      }
    },
    components:{
      footerTab,
      QwCarousel,
      QwCarouselItem
    }
  }
</script>
<style src="../scss/login.scss" lang="scss">
</style>
