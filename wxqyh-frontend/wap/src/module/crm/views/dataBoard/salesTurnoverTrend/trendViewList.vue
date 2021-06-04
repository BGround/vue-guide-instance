<template>
    <div 
        class="viewListAll"
        v-windowscroll="loadMore"
        ref="viewListAll"
    >
    <crm-list :listData="listData"></crm-list>
    <load-more
                :loading="loadingMore"
                :currPage="page"
                :maxPage="maxPage"
    >
        <div class="member_tips">共{{totalRows}}个商机</div>
    </load-more>
  </div>
</template>

<script>
import CrmList from '../../../components/CrmList/CrmList';
import { searchBusinessViewList } from '../../../api/businessGraphic/getData'
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
            hasMore: true,
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
        }
    },
    computed:{
        winHeight() {
            let height = window.innerHeight - 50; // 减去搜索框和nav栏
            return height + 'px';
        }
    },
    created(){
        this.getListData();
    },
    mounted() {
    },
    methods:{
        getListData(){
            let { startTime,endTime,businessType,teamIds,owner,paramType,toDeptIds,toUserIds,searchTimeType,status } = this.$route.query
            let obj =　{
                'tbBusinessFunnelSearchVO.startTime': startTime || '',
                'tbBusinessFunnelSearchVO.endTime': endTime || '',
                'tbBusinessFunnelSearchVO.businessType': businessType || '',
                'tbBusinessFunnelSearchVO.teamIds': teamIds || '',
                'tbBusinessFunnelSearchVO.toUserIds': toUserIds || '',
                'tbBusinessFunnelSearchVO.toDeptIds': toDeptIds || '',
                'tbBusinessFunnelSearchVO.searchTimeType': searchTimeType || '',
                page: 1,
                owner: owner,
                status: status,
                paramType: 3,
            }
            // 是否加载更多
            this.loadingMore = true;
            obj.page = this.page;
            searchBusinessViewList(obj).then(res => {
                if(res.code == '0'){
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
                                                title: `${item.estimatedSale}0元`,
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
        // 加载更多
        // 滚动加载更多
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;
            if(scrollTop + offsetHeight >= scrollHeight - 10){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getListData();
                }
            }
        },
    }
}

</script>

<style lang="scss" scoped>

</style>
