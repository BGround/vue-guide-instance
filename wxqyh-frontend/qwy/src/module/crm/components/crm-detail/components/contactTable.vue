<template>
    <div>
        <div class="list">
            <data-table :headData="headData" :dataList="dataList"></data-table>
            <page :pageData="pageSetting" @change="pageChage"></page>
        </div>
    </div>
</template>

<script>
import dataTable from '@/components/list/dataTable';
import page from '@/components/list/page';
import { getDetailList } from '@/module/crm/api/contact';
export default {
    name: 'ContactTable',
    components: {
        dataTable,
        page,
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
                    noShow: true
                },
                middle: [
                {
                    title: "联系人",
                    key: "contactsName",
                    skip: {
                        skipFunc:(id) => {
                            this.$emit('goDetail', 'contact', id);
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
            pageSetting: {  // 页码设置
                maxPage: "",
                totalRows: "",
                page: "",
                pageSize: 10
            },
        }
    },
    created() {
        // 初始化
        this.init();
    },
    methods: {
        init(){
            this.getListData()
        },

        reload(){
          this.pageSetting = {
                maxPage: "",
                totalRows: "",
                page: "",
                pageSize: 10
            };
          this.getListData()
        },

        getListData(){
            let obj = {
                id :this.id,
                page: this.pageSetting.page,
                pageSize: this.pageSetting.pageSize
            }
            getDetailList(obj).then(res => {
                if(res.code == '0'){
                    this.dataList = res.data.pageData || [];
                    this.pageSetting.totalRows = res.data.totalRows;
                    this.pageSetting.maxPage =  res.data.maxPage;
                    this.pageSetting.page = res.data.currPage;
                }
                else{
                    _.alert('提示',res.desc);
                }
            })
            .catch(err => {
                _.alert('提示','网络错误');
            });
        },

        // 页码组件回调函数
        pageChage(page,pageSize){
            this.pageSetting.page = page;
            this.pageSetting.pageSize = pageSize;
            this.getListData();
        },
    }
}
</script>

<style>

</style>
