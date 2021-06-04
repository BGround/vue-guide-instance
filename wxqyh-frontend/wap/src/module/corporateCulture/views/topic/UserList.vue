<template>
  <div class="qwui-userList">
    <!-- 搜索框 -->
    <search-box :searchinput="searchBar"
      @listenToSearchBox="showMsgFromSearchBox"
      class="qwui-fixed">
    </search-box>
    <div class="qwui-search_height"></div>
    <!-- 列表 -->
    <div v-for="(item,index) in personList" :key="index">
      <person
        :avator="item.avator"
        :name="item.name"
        :date="item.date">
      </person>
    </div>
    <!-- 加载更多 -->
    <load-more
        v-if="!hasNoInfo"
        :class="{'examine-list':reqData.status==2}"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        @loadMoreClick="loadMoreList"
      >
      <span v-show="hasMore">已没有更多</span>
    </load-more>
    <p class="qwui-noInfo_tip" v-show="hasNoInfo">暂未查到数据</p>
  </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import person from '../components/person';
import loadMore from '@/components/list/load_more';
import {getTopicPraisePager} from '../../api/getData';
export default {
  name:'user-list',
  data(){
    return {
      searchBar:{
        show:true,
        ridMask:true,
      },
      personList:[],
      reqData:{
        id:this.$route.query.id,
        page:1,
        'searchValue.keyWord':''
      },
      loadMore:{//下拉加载更多配置
        loading:false,
        currPage:1,
        maxPage:1,
      },
      scrollLock:false,
      hasNoInfo:false,
    }
  },
  created(){
    this.getTopicPraise();
    window.addEventListener('scroll',this.loadMoreList);
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.loadMoreList);
  },
  computed:{
    hasMore(){
      return this.loadMore.currPage==this.loadMore.maxPage?true:false;
    }
  },
  methods:{
    showMsgFromSearchBox(keyWord){
      this.reqData.page=1;
      this.reqData['searchValue.keyWord']=keyWord;
      this.personList=[];
      this.getTopicPraise();
    },
    getTopicPraise(){
      this.scrollLock=true;
      getTopicPraisePager(this.reqData,(data)=>{
        this.scrollLock=false;
        this.hasNoInfo=false;
        this.loadMore.currPage=data.currPage;
        this.loadMore.maxPage=data.maxPage;
        if(data.currPage>data.maxPage){
          this.hasNoInfo=true;
          return;
        }
        for(let i=0;i<data.pageData.length;i++){
          this.personList.push({
            avator:data.pageData[i].headPic,
            name:data.pageData[i].personName,
            date:data.pageData[i].createTime
          })
        }
      })
    },
    loadMoreList(){
      let scrollTop = document.documentElement.scrollTop|| document.body.scrollTop || window.pageYOffset ;
      if(this.scrollLock){
        return ;
      }
      if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if(this.loadMore.currPage<this.loadMore.maxPage){
          this.reqData.page++;
          this.getTopicPraise();
        }
      }
    }
  },
  components:{
    searchBox,
    person,
    loadMore
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  .qwui-fixed{
    width: 740px !important;
  }
}
.qwui-userList{
  .qwui-fixed{
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
  }
  .qwui-search_height{
    height: 43px;
  }
  .qwui-noInfo_tip{
    color: black;
    font-size: 14px;
    text-align: center;
    margin-top: 30px;
  }
}
</style>