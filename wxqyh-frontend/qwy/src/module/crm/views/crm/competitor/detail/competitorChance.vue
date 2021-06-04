<template>
    <div>
        <div class="list" v-show="isShowList">
            <data-table :headData="headData" :dataList="dataList" :showCheckBox="false" ></data-table>
            <page :pageData="pageSetting" @change="pageChage"></page>
        </div>
        <div class="detail">
            <detail @show="show" ref="detail"></detail>
        </div>
    </div>
</template>

<script>
import dataTable from '@/components/list/dataTable';
import page from '@/components/list/page';
import detail from './../../businessOpportunity/businessOpportunityDetail.vue';
import { getCompetitorChanceList } from '@/module/crm/api/businessOpportunity';
export default {
    components: {
        dataTable,
        page,
        detail
    },
    props: {
        id: {
            type: String,
            default: ""
        }
    },
    data(){
        return {
            headData: {   //  页表数据头
                left: {
                    checkFunc:(checkAll,checkList) => {
                        let arr = [];
                        let checkNum = 0;
                        checkList.map(item => {
                            item.isChecked? arr.push(item.id) : checkNum++;
                            
                        });
                        this.ids = arr.join(',');
                        this.showDel = checkNum == checkList.length?  false : true;
                    }
                },
                middle: [
                {
                    title: "商机标题",
                    key: "title",
                    width: 324,
                    skip: {
                        skipFunc:(id) => {
                            this.hide();
                            this.$refs.detail.showDialog(id)
                        }
                    }
                },
                {
                    title: "创建人",
                    key: "personName",
                    width: 160
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    width: 180
                },
                {
                    title: "更新时间",
                    key: "updateTime",
                    width: 179
                },                                                
                ],
                right: {
                    isShowOperate: false
                }
            },
            dataList:[                
            ],
            pageSetting: {
                maxPage: "",
                totalRows: "",
                page: "",
                pageSize: 10
            },  // 页码设置            
            isShowList: true,
        }
    },
    methods: {
        init(){
            if( this.dataList.length == 0 ){
                this.getCompetitorChanceList()
            }
        },
        reload(){
          this.pageSetting={
                maxPage: "",
                totalRows: "",
                page: "",
                pageSize: 10
            };
          this.getCompetitorChanceList()
        },
        getCompetitorChanceList(){
            getCompetitorChanceList({ 
                competitorId :this.id, 
                page: this.pageSetting.page,
                pageSize: this.pageSetting.pageSize })
            .then(res => {
                if(res.code == '0'){
                    this.dataList = res.data.pageData || [];        
                    this.pageSetting.totalRows = res.data.totalRows;
                    this.pageSetting.maxPage =  res.data.maxPage;    
                    this.pageSetting.page = res.data.currPage;
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                console.log(err)
                _alert('提示','网络错误');
            });
        },
        // 页码组件回调函数
        pageChage(page,pageSize){
            this.pageSetting.page = page;
            this.pageSetting.pageSize = pageSize;
            this.getCompetitorChanceList();
        },
        hide(){
            this.isShowList = false;
        },
        show(){
            this.isShowList = true;
        }
    }
}
</script>

<style>

</style>
