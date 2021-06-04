<template>
    <div class="root-level" >
        <ul class="group-list clearfix"
            v-infinite-scroll="loadMore" 
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false">
            <group-block v-for="(group, index) in groupData" 
                :key="group.id"
                :group="group"
                :index="index">
            </group-block>
        </ul>
        <load-more 
                v-if="!showNoData"
                :busy="busy"
                :loading="loading"
                no-more-tips="已加载全部分组"
                @loadMore="loadMore"></load-more>
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
import loadMore from '@/components/list/LoadMore'
import groupBlock from './groupBlock'

export default {
    name: 'rootLevel',
    components: {
        loadMore,
        groupBlock
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'groupData',
            'setting'
        ]),
        busy: {
            set(val) {
                return val
            },
            get() {
                if(this.loading) {
                    return true;
                }
                if(this.setting.maxPage == 0) {
                    return true
                }
                if(this.setting.maxPage == this.setting.currPage) {
                    return true
                } else {
                    return false
                }
            }
        },
        showNoData() {
            return this.groupData.length == 0;
        }
    },
    methods: {
        ...mapActions('form/index',[
            'GetFormData',
            'SetSetting'
        ]),
        // 加载更多
        loadMore() {
            let isLoadMore = true,
                page = this.setting.pageSize * this.setting.page / 20 + 1;
            this.loading = true;
            this.busy = true;
            this.SetSetting({
                page: page,
                pageSize: 20
            })
            this.GetFormData({isLoadMore}).then(res => {
                this.loading = false;
                this.busy = res.data.currPage == res.data.maxPage;
            });
        },
    }
}
</script>

<style scoped>
.root-level {
    margin: 0 auto;
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

