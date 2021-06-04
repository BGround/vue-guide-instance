<template>
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
        <div class="member_tips">共{{totalRows}}个{{title}}<span v-if="totalSale"> 金额总计 {{totalMoney}}万元</span></div>
    </load-more>
  </div>
</template>

<script>
import CrmList from '../../../components/CrmList/CrmList';
import { searchBusinessViewList,searchBusinessTrendList ,searchContractTrendList} from '../../../api/businessGraphic/getData'
import LoadMore from '@/components/list/load_more';

export default {
    name: 'businessViewList',
    components:{
        CrmList,
        LoadMore,
    },
    props:{
    },
    data(){
        return {
            // 存放列表数据
            listData:[],
            page: 1,
            hasMore: false,
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
            title: '商机',
            totalMoney: 0,  // 总金额万元
            totalSale: false //是否显示总金额
        }
    },
    computed:{
        winHeight() {
            let height = window.innerHeight - 50; // 减去搜索框和nav栏
            return height + 'px';
        }
    },
    created(){
        if(this.$route.query.trend === 'searchContractTrendList'){
            this.title = '合同'
            document.title = this.title
        }
        this.currentApi()
    },
    mounted() {
    },
    methods:{
        getListData(fun){
            let { startTime,endTime,businessType,teamIds,owner,paramType,queryType,toDeptIds,toUserIds,searchTimeType,status } = this.$route.query
            if(queryType == 'query_by_season')  queryType = 'query_by_month'
            let obj =　{
                'tbBusinessFunnelSearchVO.startTime': startTime || '',
                'tbBusinessFunnelSearchVO.endTime': endTime || '',
                'tbBusinessFunnelSearchVO.businessType': businessType || '',
                'tbBusinessFunnelSearchVO.teamIds': teamIds || '',
                'tbBusinessFunnelSearchVO.toUserIds': toUserIds || '',
                'tbBusinessFunnelSearchVO.toDeptIds': toDeptIds || '',
                'tbBusinessFunnelSearchVO.searchTimeType': searchTimeType || '',
                'tbBusinessFunnelSearchVO.queryType': queryType || '',
                // 'tbBusinessFunnelSearchVO.queryType': 'query_by_month',
                page: 1,
                'tbBusinessFunnelSearchVO.owner': owner,
                status: status,
                paramType: paramType,
                // paramType: 3,
            }
            // 是否加载更多
            this.loadingMore = true;
            obj.page = this.page;
            fun(obj).then(res => {
                if(res.code == '0'){
                    if(res.data.pageData){
                        let { maxPage,totalRows,totalSale } = res.data;
                        this.maxPage = maxPage;
                        this.totalRows = totalRows;
                        this.totalSale = totalSale ? true: false
                        this.totalMoney = Math.floor(totalSale/10000 * 100)/100;
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
                    }
                }else{
                    _.alert('提示',res.desc)
                }

            })
        },

        //判断是哪个页面进入，调用不同接口
        currentApi(){
            switch (this.$route.query.trend) {
                case 'searchBusinessTrendList':
                    this.getListData(searchBusinessTrendList)
                    break
                case 'searchContractTrendList':
                    this.getListData(searchContractTrendList)
                    break
                default:
                    this.getListData(searchBusinessViewList)
            }
        },
        // getListData(){
        //     let { startTime,endTime,businessType,teamIds,owner,paramType,toDeptIds,toUserIds,searchTimeType,status } = this.$route.query
        //     let obj =　{
        //         'tbBusinessFunnelSearchVO.startTime': startTime || '',
        //         'tbBusinessFunnelSearchVO.endTime': endTime || '',
        //         'tbBusinessFunnelSearchVO.businessType': businessType || '',
        //         'tbBusinessFunnelSearchVO.teamIds': teamIds || '',
        //         'tbBusinessFunnelSearchVO.toUserIds': toUserIds || '',
        //         'tbBusinessFunnelSearchVO.toDeptIds': toDeptIds || '',
        //         'tbBusinessFunnelSearchVO.searchTimeType': searchTimeType || '',
        //         'tbBusinessFunnelSearchVO.queryType': 'query_by_month',
        //         page: 1,
        //         owner: owner,
        //         status: status,
        //         paramType: paramType,
        //         // paramType: 3,
        //     }
        //     // 是否加载更多
        //     this.loadingMore = true;
        //     obj.page = this.page;
        //     searchBusinessViewList(obj).then(res => {
        //         if(res.code == '0'){
        //             if(res.data.pageData){
        //                 let { maxPage,totalRows } = res.data;
        //                 this.maxPage = maxPage;
        //                 this.totalRows = totalRows;
        //                 this.hasMore = this.page >= this.maxPage? false : true;
        //                 this.loadingMore = false;
        //                 res.data.pageData.forEach((item) => {
        //                     let listObj = {
        //                             id: item.id,
        //                             top: item.title,
        //                             mid: [
        //                                 {
        //                                     title: item.clientName,
        //                                     titleColor: '#999',
        //                                 },
        //                             ],
        //                             bottom: {
        //                                 data:[
        //                                     {
        //                                         title: `${_.formatMoney(new Number(item.estimatedSale),2)}元`,
        //                                         fontSize: '14px',
        //                                         titleColor: '#f76160'
        //                                     }
        //                                 ]
        //                             }
        //                     };
        //                     this.listData.push(listObj)
        //                 })
        //             }
        //         }else{
        //             _.alert('提示',res.desc)
        //         }

        //     })
        // },
        // 加载更多
        // 滚动加载更多
        loadMore (el) {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.currentApi()
                }
            }
        },

        // 点击进入详情页面
        listClick(id, callBackVal){
            if(this.$route.query.trend === 'searchContractTrendList'){
                this.$router.push({path:"/ContractContent",query:{id:id,isPartner:''}});
                return
            }
            this.$router.push({path:"/BusinessDetails/BusinessContent",query:{id:id,isPartner:''}});
        },
    }
}

</script>

<style lang="scss" scoped>

</style>
