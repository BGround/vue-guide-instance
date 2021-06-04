<!-- 人员信息 -->
<template>
  <div class="employment">
    <div class="search">
          <searchHeader
      :region="typeName"
      :keyword="keyword"
      @pick="handlePickType"
      @change="handleChangeSearch"></searchHeader>
    </div>

    <div class="gutter"></div>
  <!--
    <div class="header" v-if="keyPosts.length">
      关键岗位
    </div>
    -->
    <div class="post">
      <div class="post__item"
        v-for="(item, index) in posts"
        :key="index">
        <div class="post__info">
          <span class="post__name">{{item.personName}}</span>
          <span class="post__position">{{item.position}}</span>
        </div>
        <div class="post__arrow"
          @click="handleClickpost(item.id)">
          <img :src="iconArrowRight"
            alt="">
        </div>
      </div>
      <noData style="paddingTop: 20vh" :visible="!posts.length"></noData>
    </div>

<!--
    <div class="header" v-if="businessPosts.length">
      业务岗位
    </div>
    <div class="post" v-if="businessPosts.length">
      <div class="post__item"
        :class="{'is-laave': isLeave(item)}"
        v-for="(item, index) in businessPosts"
        :key="index">
        <div class="post__info">
          <span class="post__name">{{item.name}}</span>
          <span class="post__position">{{item.proportion}}</span>
        </div>
        <div class="post__arrow"
          @click="handleClickpost(item.id)">
          <img :src="iconArrowRight"
            alt="">
        </div>
        <div v-if="isLeave(item)"
          class="post__status">
          <img :src="iconLeave"
            alt="">
        </div>
      </div>
    </div>
-->
  </div>
</template>

<script>
import iconLeave from '@/module/channelManagement/static/images/icon_leave.png'
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import SearchHeader from '@/module/channelManagement/components/SearchHeader'
import { getPersonInfo } from '@/module/channelManagement/api/basic'
import noData from '@/module/channelManagement/components/noData'


export default {
  components: {
    SearchHeader,
    noData
  },
  data: function() {
    return {
      iconArrowRight,
      iconLeave,
      typeName: '全部', // 关键字
      keyword: '',
      type: '',
      businessPosts:[],
      keyPosts:[],
      posts:[],
      erpNo: '',
    }
  },
  methods: {
    handleChangeSearch(value) {
      this.keyword = value;
      this.fetchEmployments();
    },
    // mock
    isLeave(item) {
      return !item.status
    },
    handleClickpost(id) {
      const queryParams = Object.assign({}, this.$route.query, {employmentId: id});
      this.$router.push({ name: 'employmentDetail', query: queryParams })
    },

    handlePickType() {
      this.$actionsheet({
        title: '岗位类型',
        options: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '关键岗位'
          },
          {
            value: '5',
            label: '核心业务岗位'
          },
          {
            value: '6',
            label: '一般业务岗位'
          },
          {
            value: '2',
            label: '业务岗位'
           },
            {
            value: '7',
            label: '认证岗位'
           }
        ]
      })
        .then(({ action, item }) => {
          this.type = item.value;
          this.typeName = item.label;
          this.fetchEmployments();
        })
        .catch(() => {})
    },

    fetchEmployments() {
      /**
       * data
       */
      const params = {
        type: this.type,
        erpNo: this.erpNo,
        name: this.keyword,
      }

      getPersonInfo(params).then(data => {
        if (data) {
          this.posts = data.personInfo
        }
      })
    }
  },
  created() {
    this.erpNo = this.$route.query.erpCarNo;
    this.fetchEmployments();
    // http://yange.natapp1.cc/wxqyh/portal/personInfoAction/getPersonInfo.do?erpNo=10011&type=2
  }
}
</script>

<style lang="scss" scoped>
.employment {
  .search{
    background: #ffffff;
  }

  padding-bottom: 50px;
  .gutter {
    height: 8px;

  }

  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding: 15px;
     background: rgba(245, 245, 245, 1);
  }
  .post {
    background: #f7f7f7;
    padding: 15px;
  }
  .post__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 30;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 19px 15px 19px 15px;
    position: relative;
    &.is-laave {
      .post__position,
      .post__name {
        color: #999999;
      }
    }
  }
  .post__name {
    font-size: 16px;
    line-height: 23px;
    color: rgba(68, 68, 68, 1);
  }
  .post__position {
    margin-top: 5px;
    font-size: 16px;
    line-height: 23px;
    color: rgba(68, 68, 68, 1);
  }

  .post__status {
    position: absolute;
    top: 0;
    right: 20px;
    width: 64px;
    height: 60px;
    & > img {
      width: 100%;
    }
  }
  .post__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }
}
</style>
