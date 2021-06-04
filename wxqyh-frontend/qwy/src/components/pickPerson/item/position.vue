<template>
  <div class="qwui-main_position clearfix">
    <!--  标题栏  -->
    <div class="qwui-position_title">
      请选择职位
      <span class="qwui-position_title_ills">（职位可在通讯录管理）</span>
    </div>
    <!--  职位列表  -->
    <ul class="qwui-position_list" ref="positionList">
      <li class="qwui-list_item clearfix"
          v-for="(item, index) in loadMore.pageConfig.pageData">
        <span class="qwui-list_item_text">{{item.name}}</span>
        <label :for="item.id" class="qwui-position_checkbox">
          <input type="checkbox"  v-model="positionChecked" :value="item" :id="item.id" :disabled="isDisabled(item)">
          <span></span>
        </label>
      </li>
      <li>
        <load-more :loadmore="loadMore"
            @loadFinished="requestFinished"
            ref="loadMoreFun"></load-more>
      </li>
    </ul>
  </div>
</template>
<script>
  import loadMore from './loadMore.vue'
  export default {
    props:{
      defaultPosition:{
        type:Array,
        default:function () {
          return []
        }
      },
      //职位最大限制
      maxPosition:{
        type:Number,
        default:100
      },
    },
    data(){
      return{
        positions:[], //职位列表
        positionChecked:this.defaultPosition,
        loadFinished:true, //控制接口请求，避免多次
        loadMore:{ //加载更多
          url:"/post/postAction!queryPositionList.action",//请求路径
          pageIndexName:"page",//分页参数
          data:{ //ajax入参数据
            page: 1,
            pageSize: 10,
            'searchValue.name': '',
            'searchValue.catalog': ''
          },
          pageConfig:{},
        },
      }
    },
    created:function () {
      this.$nextTick(()=>{
        this.$refs.loadMoreFun.clearLoadFun();
      })
    },
    //容器里的下拉加载
    mounted () {
      this.box = this.$refs.positionList
      this.box.addEventListener('scroll', () => {
        if((this.box.scrollTop + this.box.offsetHeight >= this.box.scrollHeight - 5)&&this.loadFinished){
          this.$refs.loadMoreFun.scrollLoadMore();
        }
      }, false)
    },
    computed:{
      isOver(){
        return this.positionChecked.length >= this.maxPosition ? true : false
      }
    },
    watch:{
      positionChecked:function (val) {
        this.$emit("positionChecked", val);
      },
      'loadMore.pageConfig.pageData':function (val) {
        if(val.length>0) {
          var self = this;
          self.positionChecked.forEach(function (e,index) {
            if (e.id == undefined) {
              let findResult = val.find(item => {
                return item.id == e.id
              })
              findResult ? self.positionChecked.splice(index, 1, findResult):''
            }
          })
        }
      }
    },
    methods:{
      //控制是否可以选中
      isDisabled:function (val) {
        return this.isOver && this.positionChecked.findIndex(item => {
          return item.id == val.id
        }) == -1
      },
      //接口请求完成
      requestFinished:function () {
        this.loadFinished = true;
      },
    },
    components:{
      loadMore
    }
  }
</script>
<style scoped>
  .qwui-position_title{
    margin-left: 20px;
    padding: 15px 0 10px;
    cursor: pointer;
    color:#383838;
    font-size: 14px;
  }
  .qwui-position_title_ills{
    color:#A6A6A6;
  }
  .qwui-position_list{
    position: relative;
    height: 361px;
    overflow-x: auto;
    overflow-y: scroll;
    list-style: none outside none;
  }
  .qwui-list_item{
    padding: 0 0 4px 20px;
    white-space: nowrap;
    cursor: pointer;
    line-height: 30px;
  }
  .qwui-list_item:hover{
    background: #ececec;
  }
  .qwui-list_item_text{
    display: inline-block;
    width: 500px;
    float: left;
    margin-left: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: inherit;
  }
  .qwui-position_checkbox{
    float: right;
  }
  .qwui-position_checkbox input{
    visibility: hidden;
  }
  .qwui-position_checkbox span{
    display: inline-block;
    float: right;
    width: 18px;
    height: 18px;
    margin: 8px 15px 0 0;
    background: url(../../../assets/images/checkbox_off.png) no-repeat center;
  }
  .qwui-position_checkbox.active span {
    margin: 11px 15px 0 0;
  }
  .qwui-position_checkbox input:checked + span{
    background: url(../../../assets/images/checkbox_on.png) no-repeat center;
  }
  .qwui-position_checkbox input:disabled + span{
    width: 16px;
    height: 16px;
    border: 1px solid #CBCBCB;
    background: #EDEDED;
  }
</style>
