<template>
    <div class="searchResult">
        <div class="form"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false">
            <form-block
                v-for="(form, index) in listData"
                :formData="form"
                :key="form.id"
                :isOver="index % 5 == 0"
                @del="formDel(index)"
                @open="formOpen(index)"
                @forbid="formForbid(index)"></form-block>
        </div>
        <load-more :busy="busy"
                :loading="loading"
                no-more-tips="已加载全部可见表单"
                @loadMore="loadMore"
                v-show="!showNoData"></load-more>
        <div class="no-data"
            v-show="showNoData">
            <div class="content">
                <img class="img" src="../../../../../../assets/images/noData.png">
                <div class="no-data-text">暂无相关数据</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import formBlock from './formBlock'
import loadMore from '@/components/list/LoadMore'
import { getForm } from '@/module/approval/api/form/index'

export default {
    name: 'searchResult',
    components: {
        formBlock,
        loadMore
    },
    data() {
        return {
            loading: false,
            page: 1,
            pageSize: 20
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'listData',
            'setting',
            'searchValue'
        ]),
        showNoData() {
            return this.listData.length == 0;
        },
        busy() {
            return this.setting.currPage == this.setting.maxPage;
        }
    },
    methods: {
        ...mapActions('form/index',[
            'GetFormData',
            'SetSetting',
            'SetListData'
        ]),
        loadMore() {
            this.loading = true;
            this.SetSetting({
                page: this.setting.page + 1
            })
            this.GetFormData({ isLoadMore: true, viewMode: 1 }).then(res => {
                this.loading = false;
            })
        },
        formDel(index) { // 删除
            _top.top_alert("删除成功");
            let listData = this.listData,
                searchValue = JSON.parse(JSON.stringify(this.searchValue)),
                data = Object.assign({
                    page: listData.length,
                    pageSize: 1,
                    viewMode: 1
                }, searchValue);
            listData.splice(index, 1);
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                if(listData[listData.length - 1].id != res.data.pageData[0].id) {
                    listData.push(res.data.pageData[0]);
                }
            })
        },
        formOpen(index) { // 启用
            _top.top_alert("启用成功，已移动至列表前方");
            let indx,
                listData = this.listData;
            for(let i = index - 1; i >= 0; i--) {
                if(listData[i].status == 2) {
                    indx = i + 1;
                    break;
                } else if(i == 0){
                    indx = 0;
                }
            }
            let form = listData.splice(index, 1)[0];
            form.status = 1;
            listData.splice(indx, 0, form);
        },
        formForbid(index) { // 禁用
            _top.top_alert("禁用成功，已移动到列表末尾");
            for(let i = index; i < this.listData.length; i++) {
                if(this.listData[i].status == '-1') {
                    let item = this.listData.splice(index, 1)[0];
                    item.status = '-1';
                    this.listData.splice(i - 1, 0, item);
                    return
                }
            }
            let listData = this.listData,
                searchValue = JSON.parse(JSON.stringify(this.searchValue)),
                data = Object.assign({
                    page: listData.length,
                    pageSize: 1,
                    viewMode: 1
                }, searchValue);
            getForm(data).then(res => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                listData.splice(index, 1);
                listData.splice(data.page - 1, 0, res.data.pageData[0]);
            })
        }
    }

}
</script>

<style scoped>
.searchResult .form{
    display: flex;
    flex-wrap: wrap;
}
.no-data {
    position: relative;
    width: 100%;
    height: 500px;
}
.no-data .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.no-data .no-data-text {
    text-align: center;
    color: #999999;
}
</style>

