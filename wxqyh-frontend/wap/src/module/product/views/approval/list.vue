<template>
  <div class="approval-list">
    <div class="head">
      <menuTab :menudata="menuData"></menuTab>
    </div>

    <div class="content">
        <div v-for="(item, index) in approvalList" :key="index">
            <approvalItem :show-checkbox="isPending" @click="handleClickItem" :info="item" v-model="item.checked"></approvalItem>
            <div class="gutter"></div>
        </div>

        <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading">
          <div slot="spinner" class="more">
            <p>查看更多</p>
            <i class="more__icon"></i>
          </div>
          <div slot="no-more" class="more">
            <p>没有更多了</p>
          </div>
          <div slot="no-results">
            <p>已经到底了</p>
          </div>
        </infinite-loading>

    </div>

    <div v-show="hasCheckedItem" class="footer">
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
  </div>
</template>

<script>
    import menuTab from '@/components/button/menu_tab.vue'
    import flow_button from '@/components/button/flow_button';
    import cherryCheckbox from '../../components/cherryCheckbox'
    import approvalItem from "@/module/product/components/approvalItem";
    // import {searchPositionList} from "@/module/postManagement/api/getData";
    import * as approvalApi from "../../api/approvalApi"

    export default {
        name: "list",
        components: {
            menuTab,
            flow_button,
            cherryCheckbox,
            approvalItem
        },
        props: {},
        data() {
            return {
                checked: false,

                menuData:{
                    show:false, //控制显示与否
                    navNum:0, //当前点击的是哪个
                    navBar:[
                        {name:"待审核", num:0, data: {key:'pending', value:'1' }, callBack: this.handleClickTap},
                        {name:"已通过", num:0, data: {key:'passed',  value:'0' }, callBack:  this.handleClickTap},
                        {name:"未通过", num:0, data: {key:'notPass', value:'2' }, callBack: this.handleClickTap},
                    ],
                },

                buttonConfig:{
                    primaryList:[
                        {type:"primary",name:'通过',callBack: this.pass},
                    ],
                    defaultList:[
                        {type:"default",name:'返回', callBack: this.back},
                        {type:"default",name:'不通过', callBack: this.notPass}
                    ],
                    style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                },


                approvalList:[

                ],

                type :1,              //审核状态（0-通过,1-待审核,2-不通过'）
                page: 1,
                pageSize: 10,
                belongAgent:"survey",        //类型
            }
        },
        computed:{
            hasCheckedItem(){
                return this.approvalList.some(item=>item.checked);
            },
            isPending(){
                return String(this.type)==='1';
            }
        },
        methods: {

            back(){
                this.$router.back()
            },


            notPass(){
                const productIds = this.approvalList.filter(i=>i.checked).map(i=>i.productId).join('|')
                approvalApi.notPass({productIds}).then((data)=>{
                    if(data){
                        this.resetList();
                        this.initReviewerCount();
                        _.alert('提示', '审核成功');
                    }
                })
            },

            pass(){
                const productIds = this.approvalList.filter(i=>i.checked).map(i=>i.productId).join('|')
                approvalApi.pass({productIds}).then((data)=>{
                    if(data){
                        this.resetList();
                        this.initReviewerCount();
                        _.alert('提示', '审核成功');
                    }
                })
            },

            handleClickTap({value}){
                this.type = value;
                this.resetList();
            },

            resetList(){
                this.page = 1;
                this.approvalList = [];
                this.$refs['infiniteLoading'].$emit('$InfiniteLoading:reset')
            },

            fetchListData(){
                const params = {
                    // belongAgent: this.belongAgent,        //类型
                    type: this.type,
                    page: this.page,
                    pageSize: this.pageSize,
                }
                return approvalApi.getProductReviewerPager(params).then(data => {
                    if (data && data.pager) {
                        const pageData = data.pager || []
                        const list = pageData.map((item)=>({...item, checked: false}));
                        this.approvalList = this.approvalList.concat(list)
                        return data.currPage >= data.maxPage
                    } else {
                        return true
                    }
                })
            },

            infiniteHandler($state){
                this.fetchListData().then((isDone) => {
                    if (isDone) {
                        $state.complete()
                    } else {
                        $state.loaded()
                        this.page = this.page + 1
                    }
                })
            },

            handleClickItem(item){
                this.$router.push({
                    name: 'productDetail',
                    query: {
                        id: item.productId,
                        userId: _.userId,
                    }
                });
            },

            initReviewerCount(){
                approvalApi
                    .geTproductReviewerCount()
                    .then((data)=>{
                      if(data && data.notPassNum){
                          const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'notPass');
                          notPassItem.num = data.notPassNum;
                      }
                      if(data && data.passNum){
                          const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'passed');
                          notPassItem.num = data.passNum;
                      }
                      if(data && data.todoNum){
                          const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'pending');
                          notPassItem.num = data.todoNum;
                      }
                    })
            }

        },
        created() {
            this.initReviewerCount()
        }
    }
</script>

<style scoped lang="scss">
  .approval-list{
    .head{
      position: fixed;
      top: 0;
      width: 100%;
    }
    .footer{
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #ffffff;
    }
    .content{
      padding: 60px 0 60px;
    }
    .gutter{
      height: 10px;
    }
  }

</style>
