<template>
  <div class="businessDetail">
    <!-- 筛选头部start -->
    <div class="crm_goal_filter">
      <div class="crm_filter_wrap qwui-border_bottom">
        <div class="crm_filter_item" @click="pickTime">
          <div class="item_content_wrap">
            <div class="item_content has_list">
              <span>{{stageName}}</span>
              <i :class="[{arrow:true},arrowDirection_arr[0] == 'up'?'arrow_up': '']"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="StageStcs">
        <div class="StageStcs-item">
            <p class="totalNum">{{totalNum}}</p>
            <span>商机总数</span>
        </div>
        <div class="StageStcs-item">
            <p class="totalNum">{{totalMoney}}</p>
            <span>阶段总金额(万元)</span>
        </div>
        <div class="StageStcs-item">
            <p class="totalNum">{{winRate}}%</p>
            <span>赢率</span>
        </div>
    </div>

     <div
        class="viewListAll"
        v-windowscroll="loadMore"
        ref="viewListAll"
    >
    <crm-list :listData="listData" @click="listClick"></crm-list>
    <load-more
                :loading="loadingMore"
                :currPage="page"
                :maxPage="maxPage"
    >
        <div class="member_tips">共{{totalRows}}个商机</div>
    </load-more>
  </div>


    <timePicker
            v-if="timeShow"
          :data="pickerOption"
          ref="picker"
          @select="handleSelect(arguments)"
          :selectedIndex = 'defalutArr'
          @cancel="cancelPicker()"
          cancelTxt="取消" confirmTxt="确定">
    </timePicker>
  </div>
</template>

<script>
    import timePicker from '@/components/picker/index';
    import LoadMore from '@/components/list/load_more';
    import CrmList from '../../../components/CrmList/CrmList';
    import {
        getBusinessStage,
        searchBusinessStageDetail
    } from "../../../api/businessFunnel/getData";

    const YEAR = [
        {text: '初步交流'},
        {text: '需求沟通'},
        {text: '商务交通'},
        {text: '签约交款'},
        {text: '商务失败'},
    ];
    let userId = window._.userId;

    export default {
        components: {
            timePicker,
            LoadMore,
            CrmList
        },
        name: 'funnelViewList',
        data() {
        return {
            timeShow: false, // 组件请求数据后再显示
            winRate: '', // 赢率
            totalMoney: '', // 阶段总金额
            totalNum: '', // 商机总数
            stageName: '初步交流',
            pickerOption: [
                []
            ],
            defalutArr: [], // 默认进入页面时选中的值
            arrowDirection_arr: ['down','down','down','down'],
            listData:[], // 存放列表数据
            page: 1,
            hasMore: false, // 是否有更多数据
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
            lock_roll: false, // 滚动锁
        }
        },
        computed: {
//            页面跳转携带过来的商机分布
            stage(){
                for(let i = 0;i<this.pickerOption[0].length;i++){
                    if(this.stageName == this.pickerOption[0][i].text){
                        return this.pickerOption[0][i].id
                    }
                }
            }
        },
        created(){
            this.getBusinessStageData();
        },
        mounted(){
        },
        methods: {
            // 获取商机个数及数据
            getBusinessStageData(){
                getBusinessStage().then(res => {
                    if(res.code == '0'){
                        res.data.stageList.forEach((item) => {
                            let pickerObj = {
                                text: item.name,
                                id: item.stageCode
                            };
                            this.pickerOption[0].push(pickerObj)
                            if( this.$route.query.stage == item.stageCode ){
                                this.stageName = item.name
                            }
                        })
                    }else{
                        _.alert('提示',res.desc)
                    }
                this.timeShow = true;
                this.initDate();
                this.getListData();
                })
            },
            getListData(){
                let { startTime,endTime,businessType,teamIds,owner,paramType,toDeptIds,toUserIds,searchTimeType,stage } = this.$route.query
                let obj =　{
                    'tbBusinessFunnelSearchVO.startTime': startTime || '',
                    'tbBusinessFunnelSearchVO.endTime': endTime || '',
                    'tbBusinessFunnelSearchVO.businessType': businessType || '',
                    'tbBusinessFunnelSearchVO.teamIds': teamIds || '',
                    'tbBusinessFunnelSearchVO.toUserIds': toUserIds || '',
                    'tbBusinessFunnelSearchVO.toDeptIds': toDeptIds || '',
                    'tbBusinessFunnelSearchVO.searchTimeType': searchTimeType || '',
                    'tbBusinessFunnelSearchVO.queryType':"query_by_month",
                    page: 1,
                    owner: owner,
                    paramType: paramType,
                    stage: this.stage,
                }
                // 是否加载更多
                this.loadingMore = true;
                obj.page = this.page;
                searchBusinessStageDetail(obj).then(res => {
                    if(res.code == '0'){
                        if(res.data.funnel){
                            this.totalNum = res.data.funnel.businessNum;
                            this.totalMoney = res.data.funnel.num;
                            this.winRate = res.data.funnel.winRate;
                        }
                        if(res.data.pageData){
                            let { maxPage,totalRows } = res.data;
                            this.maxPage = maxPage;
                            this.totalRows = totalRows;
                            this.hasMore = this.page >= this.maxPage? false : true;
                            this.loadingMore = false;
                            res.data.pageData.forEach((item) => {
                                let listObj = {
                                        id: item.id,
                                        top: item.title,
                                        mid: [
                                            {
                                                title: item.clientName,
                                                titleColor: '#999',
                                            },
                                        ],
                                        bottom: {
                                            data:[
                                                {
                                                    title: `${_.formatMoney(new Number(item.estimatedSale),2)}元`,
                                                    fontSize: '14px',
                                                    titleColor: '#f76160'
                                                }
                                            ]
                                        }
                                };

                                this.listData.push(listObj)
                            })
                        }else{
                            this.loadingMore = false;
                            this.totalRows = 0
                        }
                    }else{
                        _.alert('提示',res.desc)
                    }

                })
            },

            // 滚动加载更多
            loadMore (el) {
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                    if(this.hasMore && !this.loadingMore){
                        this.page++;
                        this.getListData();
                    }
                }
            },

            // 点击进入详情页面
            listClick(id, callBackVal){
                this.$router.push({path:"BusinessDetails/BusinessContent",query:{id:id,isPartner:''}});
            },

            arrowReset(){
                this.arrowDirection_arr.forEach((currentValue,index) => {
                this.$set(this.arrowDirection_arr, index, 'down');
                })
            },
            pickTime() {
                this.arrowReset();
                this.$set(this.arrowDirection_arr,0,'up');
                // 显示picker
                this.$nextTick(function() {
                    let pick = this.$refs.picker;
                    pick.show();
                })
            },

            // 初始化弹窗
            initDate(){
                this.pickerOption[0].forEach((item,index) =>{
                    if(this.stageName == item.text){
                        this.defalutArr[0] = index;
                    }
                })
            },

            handleSelect(args){
                // 获取年份信息
                let year = args[2][0];
                if(year){
                this.stageName = year;
                }
                this.$set(this.arrowDirection_arr,0,'down');
                this.page = 1;
                this.listData = [];
                this.getListData();
            },
            cancelPicker(){
                this.$set(this.arrowDirection_arr,0,'down');
            },
        },
    }
</script>

<style lang="scss" scoped>
@import '../../../crmBase.scss';

.businessDedail{
    background: #fff;
}
.arrow::after{
    content:normal
}
.StageStcs{
    display: flex;
    // border-bottom: 1px solid #e6e6e6;
    padding: rem(17) 0;
    background: #fff;
}
.StageStcs .StageStcs-item{
    width: 33.3333%;
    float: left;
    text-align: center;
}
.StageStcs-item p {
    font-size: rem(20);
    margin-bottom: 3px;
    font-weight:400;
}
.StageStcs-item span {
    color: #999;
    font-size: rem(12);
    font-weight:400;
}
.crm_goal_filter{
   width: 100%;
   height: 4rem;
   background-color: #fff;
 }
 .crm_goal_filter .crm_filter_wrap{
   display: flex;
   display: -webkit-flex;
   height: 4rem;
 }
 .crm_goal_filter .crm_filter_wrap .crm_filter_item{
   flex: 1;
   text-align: center;
 }
 .crm_goal_filter .item_content_wrap{
   display: flex;
   display: -webkit-flex;
   align-items: center;
   justify-content: center;
   height: 4rem;
   font-size: 1.2rem;
 }
 .crm_goal_filter .item_content_wrap .item_content{
    position: relative;
    display: inline-block;
    color: #666666;
    color: rem(14);
    box-sizing: border-box;
 }
 .crm_goal_filter .item_content .teamName{
   display: inline-block;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
   width: 6rem;
   vertical-align: bottom;
 }
 .item_content .arrow{
   display: inline-block;
   width: 1rem;
   height: 1rem;
   background-image: url('~assets/images/icon_down_gray.png');
   background-repeat: no-repeat;
   background-size: 1rem 0.7rem;
   background-position-y: center;
   margin-left: 3px;
 }

 .item_content .arrow_up{
   transform: rotate(180deg);
 }
  .qwui-border_bottom:after {
    transform-origin: 0 0;
  }
</style>
