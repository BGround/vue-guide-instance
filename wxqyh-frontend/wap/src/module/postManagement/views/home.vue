<template>
    <div class="post-list">
      <search_box placeholder="搜索姓名" :searchinput="searchBar" @listenToSearchBox="handleSearch"></search_box>

      <table>
        <colgroup width="26%"></colgroup>
        <colgroup width="20%"></colgroup>
        <colgroup width="30%"></colgroup>
        <colgroup width="24%"></colgroup>
        <thead>
          <tr>
            <th>岗位名称</th>
            <th>应配备</th>
            <th>实际配备</th>
            <th>配备率</th>
          </tr>
        </thead>

        <tbody>
          <tr :class="{red: isLessThan100(item.allocationRate)}" v-for="(item, index) in postList" :key="index">
            <td>{{item.postName}}</td>
            <td>{{item.allocation}}</td>
            <td>{{item.personName}}</td>
            <td>{{item.allocationRate}}</td>
          </tr>
        </tbody>

      </table>

      <infinite-loading @infinite="postInfiniteHandler" ref="infiniteLoading">
        <div slot="spinner" class="more">
          <p>查看更多</p>
          <i class="more__icon"></i>
        </div>
        <div slot="no-more" class="more">
          <p>没有更多了</p>
        </div>
        <div slot="no-results"></div>
      </infinite-loading>

<!--    <noData style="margin-top: 16vh" :visible="true"></noData>-->
    </div>
</template>

<script>
    import search_box from '../../../components/base/search_box.vue';
    import noData from "@/module/postManagement/components/noData";
    import {searchPositionList} from '@/module/postManagement/api/getData';

    export default {
        name: "home",
        components: {
            noData,
            search_box,
        },
        data() {
            return {
                page: 1,
                pageSize: 10,
                keyword: '',
                postList: [],
                searchBar:{ //头部搜索框
                    show:false,
                    keyWord:"",
                    setTopMask:false,//置顶遮罩
                    inputFocus:false,//input聚焦状态
                    closeLabel:true,
                    // ridMask: true,
                    rightSpan:{
                        show:false,
                        callback:null
                    },
                    moreFunction:{
                        show:false,
                        option:[
                            {name:'姓名', callback:null, placeholder:'搜索收姓名', value:0},
                            {name:'拼音', callback:null, placeholder:'按拼音搜索', value:1},
                            {name:'手机号', callback:null, placeholder:'按手机号搜索', value:1}
                        ]
                    }
                },
            }
        },
        props: {},
        methods: {

            clearPostList(){
                this.postList = [];
            },

            handleSearch(keyword){
                this.keyword = keyword;
                this.clearPostList()
                this.page = 1
                // this.fetchListData()
                this.$refs['infiniteLoading'].$emit('$InfiniteLoading:reset')
            },

            fetchListData(){
                const params = {
                    'searchValue.keyword': this.keyword,
                    page: this.page,
                    pageSize: this.pageSize,
                }
                return searchPositionList(params).then(data => {
                    if (data && data.pageData) {
                        console.log(this,2)
                        const list = data.pageData || []
                        this.postList = this.postList.concat(list)
                        return data.currPage >= data.maxPage
                    } else {
                        return true
                    }
                })
            },

            postInfiniteHandler($state) {
                this.fetchListData().then((isDone) => {
                    if (isDone) {
                        $state.complete()
                    } else {
                        $state.loaded()
                        this.page = this.page + 1
                    }
                })
            },

            isLessThan100(allocationRate){
                const value = allocationRate && allocationRate.replace('%','');
                const number = parseFloat(value);
                return number<100;
            }

        },
        created() {
        }
    }
</script>

<style scoped lang="scss">
  .post-list{
    table{
      border-collapse: collapse;
      width: 100%;
      text-align: center;
      th{
        background: rgb(39,129,229);
        height: 40px;
        color: #ffffff;
      }
      td{
        height: 40px;
        background: #ffffff;
        padding: 5px 4px;
        &:nth-child(3){
          text-align: justify;
        }
      }
      tr:nth-child(2n){
        td{
          background: rgb(250,250,250);
        }
      }
      tr.red{
        color: #c6001f;
      }
    }

    .no-data{
      height: 40px;
      line-height: 40px;
      color: #aaaaaa;
      font-size: 12px;
      text-align: center;
      position: relative;
      &::before{
        content: '';
        display: block;
        left: 0;
        right: 0;
        top: 0;
        height: 1px;
        background: #eee;
        transform: scaleY(0.5);
      }
    }

    .more{
      line-height: 40px;
    }
  }
</style>
