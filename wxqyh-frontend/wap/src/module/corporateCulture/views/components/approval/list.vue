<template>
  <div class="approval-list">
    <div class="head">
      <menuTab :menudata="menuData"></menuTab>
    </div>

    <div class="content">
        <div v-for="(item, index) in approvalList" :key="index">
            <approvalItem @click="handleClickItem" :info="item" v-model="item.checked"></approvalItem>
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
            <p>暂无数据</p>
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
    import approvalItem from "./approvalItem";
    import * as approvalApi from "../../../api/approvalApi"

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
                checkedItems: ['上海', '北京'],
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
                        {type:"primary",name:'返回',callBack:null},
                    ],
                    defaultList:[
                        {type:"default",name:'不通过', callBack:null},
                        {type:"default",name:'通过', callBack:null}
                    ],
                    style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                },

                options: {
                    xx: '',
                },

                approvalList:[

                ],

                isPassReview :1,              //审核状态（0-通过,1-待审核,2-不通过'）
                page: 1,
                pageSize: 10,
                belongAgent:"survey",        //类型
            }
        },
        computed:{
            hasCheckedItem(){
                return this.approvalList.some(item=>item.checked);
            }
        },
        methods: {

            handleClickTap({value}){
                this.isPassReview = value;
                this.resetList();
            },

            resetList(){
                this.page = 1;
                this.approvalList = [];
                this.$refs['infiniteLoading'].$emit('$InfiniteLoading:reset')
            },

            fetchListData(){
                const params = {
                    belongAgent: this.belongAgent,        //类型
                    isPassReview: this.isPassReview,
                    page: this.page,
                    pageSize: this.pageSize,
                }
                return approvalApi.ajaxAuditQuestionnairePager(params).then(data => {
                    if (data && data.pageData) {
                        const pageData = data.pageData || []
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
                    name: 'surveyDetail',
                    query: {
                        id: item.id,
                        userId: _.userId,
                        type: Number(this.isPassReview === 1)
                    }
                });
            },

            initAuditCount(){
                approvalApi.getQuestionnairAuditCount().then((data)=>{
                    if(data && data.notPassReview){
                        const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'notPass');
                        notPassItem.num = data.notPassReview;
                    }
                    if(data && data.passReview){
                        const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'passed');
                        notPassItem.num = data.passReview;
                    }
                    if(data && data.waitReview){
                        const notPassItem = this.menuData.navBar.find(item=>item.data.key === 'pending');
                        notPassItem.num = data.waitReview;
                    }
                })
            }

        },
        created() {
            this.initAuditCount();
        }
    }
</script>

<style scoped lang="scss">
  .approval-list{
    .head{
      top: 83px;
      width: 100%;
      position: fixed;
      &:before{
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 1px;
        background: #ddd;
        transform: scaleY(0.5);
        z-index: 100;
      }
    }
    .footer{
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #ffffff;
    }
    .content{
      padding: 50px 0 20px;
    }
    .gutter{
      height: 10px;
    }

    /deep/ .qwui-navbar_item{
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }

</style>
