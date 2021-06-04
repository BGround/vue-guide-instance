<template lang="html">
  <div class="qwui-view-list"
    v-qw-water-mark="{ agentCode: agentCode}">
    <div class="qwui-search_box">
      <search-bar :searchinput="searchBar" @listenToSearchBox="search_test"></search-bar>
    </div>

    <ul class="qwui-people">
      <qw-view-list-person
        class="qwui-person"
        v-for="person in people"
        :key="person.userId"
        :avator="person.headPic"
        :name="person.personName"
        :date="person.createTime"
      ></qw-view-list-person>
    </ul>

    <p class="qwui-more_tips">
      <span v-if="loading">正在加载更多</span>
      <span v-else-if="people.length === 0">暂未查到{{searchBar.moreFunction.defaultChoose}}数据</span>
      <span v-else>{{total}}人{{searchBar.moreFunction.defaultChoose}}</span>
    </p>

     <!--操作按钮-->
    <button_group :fixed="true"  v-show="isShowSendBtn">
        <button_item type="default" text="提醒未阅" @buttonClick="sendMsgToUnRead()"></button_item>
    </button_group>
  </div>

</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import QwViewListPerson from './person';
import searchBar from '@/components/base/search_box.vue';
import button_group from '@/components/base/button/button_group';
import button_item from '@/components/base/button/button';
import {getCreator, sendMsgToUnRead} from '../../api/getData';
import qwWaterMark from '@/directive/qwWaterMark';

const _ = window._;

const TIMEOUT = 1000;

const ReadUrl = _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getDynamicReadPager.action';
const UnReadUrl = _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getUnreadPager.action';

// 封装Ajax
Vue.use({
  install (vue, options) {
    let ajax = async (description, settings) => {
      let timer = setTimeout(() => {
        _.showLoading('正在' + description);
      }, TIMEOUT);

      let res = await axios(settings);

      clearTimeout(timer);

      _.hideLoading();

      if (res.code === '0') {
        return Promise.resolve(res);
      } else {
        _.alert('提示', res.desc);
        console.error(res.desc);
      }
    };

    ajax.get = async (description, url, settings) => {
      return await ajax(description, {
          url,
          method: 'get',
          ...settings
        });
    };

    ajax.post = async (description, url, data, settings) => {
      return await ajax(description, {
          url,
          data,
          method: 'post',
          ...settings
        });
    };

    vue.prototype.$ajax = ajax;
  }
});

let vm = {
  components: {
    QwViewListPerson,
    searchBar,
    button_group,
    button_item
  },
  data () {
    return {
      dataBase,
      page: 1,
      maxPage: 1,
      people: [],
      name: '',
      type: 1,
      loading: false,
      searchBar: { //头部搜索框
        show: true,
        keyWord: '',
        ridMask: true, // 搜索时隐藏空白页
        rightSpan: {
          show: false,
          callback: null
        },
        moreFunction: {
          show: true,
          defaultChoose: '已阅',
          option: [
            {
              name: '已阅',
              callback: null,
              placeholder: '搜索',
              value: 1
            }, {
              name: '未阅',
              callback: null,
              placeholder: '搜索',
              value: 2
            }
          ]
        }
      },
      total: null, // 总人数
      isShowSendBtn: false, //提醒未阅读按钮
      creator: '',
      lock_roll: false, // 锁住滚动
      agentCode: _.getUrlParam('agentCode') || 'dynamic',
    }
  },
  directives: { qwWaterMark },
  computed: {
    hasMore () {
      return this.page < this.maxPage;
    }
  },
  methods: {
    // 提醒未阅
    sendMsgToUnRead(){
      var self = this;
      let dataPost = {
        'id': self.$route.query.id,
      }
      sendMsgToUnRead(dataPost, (result)=>{
          _.alert('提示', '发送成功');
      })
    },
    getCreator(){
      var self = this;
      let dataPost = {
          'belongAgent': dataBase.wxqyh_uploadfile.agent,
          'dynamicInfoId': self.$route.query.id,
      }
      getCreator(dataPost, (result)=>{
          self.creator = result.data.creator;
      })
    },
    search_test (name, type) {
      this.isShowSendBtn = false;
      this.search({name, type});
    },
    async search_ajax ({name, type, page=1}) {
      if (this.loading) {
        return;
      } else {
        this.loading = true;
      }

      let url = '';

      if (type === 1) {
        url = ReadUrl;
      } else if (type === 2) {
        url = UnReadUrl;
      }

      let res = await this.$ajax.post(
          '搜索人员',
          url, {
            id: this.$route.query.id,
            groupId: this.$route.query.id,
            pageSize: 20,
            currentPage: page,
            keyWord: name
          }
        );

      this.name = name;
      this.type = type;
      this.page = res.data.currPage;
      this.maxPage = res.data.maxPage;
      this.total = res.data.totalRows;
      if(type == 2) {
      //如果创建人和登录人相同，提醒未阅显示
        if(this.creator ==  wxqyhConfig.userId){
          if(""==this.searchBar.keyWord && this.total<=0){
            this.isShowSendBtn = false;
          }else{
            this.isShowSendBtn = true;
          }
        }
      }
      this.loading = false;
      return res.data;
    },
    async search ({name, type}) {
      let data = await this.search_ajax({name, type});
      this.people = data.pageData || [];
      document.body.scrollTop = 0;
      // Firefox
      document.documentElement.scrollTop = 0;
      // Safari
      window.pageYOffset = 0;
    },
    async loadMore () {
      if (!this.hasMore) {
          return;
      }

      let data = await this.search_ajax({
          name: this.name,
          type: this.type,
          page: this.page + 1
        });

      for (let person of data.pageData) {
        this.people.push(person);
      }
      this.lock_roll = false;
    },
    scrollList(){
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
            if(!this.lock_roll && this.hasMore){
                this.lock_roll=true;
               this.loadMore();
            }
        }
    }
  },
  async created () {
    window.addEventListener('scroll', this.scrollList);
    if (this.$route.query.id) {
      await this.search({
          name: '',
          type: 1
        });
    } else {
      _.alert('提示', '异常访问');
    }
    this.getCreator();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollList);
  },
}

export default vm;
</script>

<style lang="scss" scoped>
.qwui-search_box {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}

.qwui-people {
  margin-top: 43px;
  .qwui-person {
     position: relative;
    ::before{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #dfdfdd;
      color: #dfdfdd;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
  }
}

.qwui-more_tips {
  margin-bottom: 45px;
  text-align: center;
  line-height: 60px;
  font-size: 14px;
}
.qwui-btn.qwui-btn_default {
  color: #fff;
  background: #ff6000;
}
@media screen and (min-width: 1024px){
  .qwui-search_box {
    width: 740px;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
}
</style>
