<template>
    <div class="nodeItem">
        <div class="title">
            {{nodeItem.nodeName}}
            <div class="number">{{nodeItem.totalRows}}</div>
        </div>
        <div class="list"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false">
            <div class="form-list">
                <div class="form"
                    v-for="(form, index) in nodeItem.list"
                    :key="index"
                    @click="showDetail(form.workOrderId)">
                    <div class="form-name" :title="form.instanceTitle">{{form.instanceTitle}}</div>
                    <div class="audit-list">
                        <img class="head-pic"
                            v-for="(user, index) in form.auditUsers"
                            v-show="index < 4"
                            :key="user.id"
                            :src="user.headPic"
                            :title="user.personName"
                            @error="noFind">
                        <div class="head-pic more" v-show="form.auditUsers.length > 4">
                            <div class="dot"
                                v-for="i in 3"
                                :key="i"></div>
                        </div>
                    </div>
                    <div class="wake-time">
                        <!-- <div class="level high"></div> -->
                        停留 {{waitTime(form.waitTime)}}
                    </div>
                </div>
            </div>
            <load-more
                :busy="busy"
                :loading="loading"
                :showrecord="showRecord"
                @childevent="loadMore">
            </load-more>
        </div>
    </div>
</template>
<script>
import LoadMore from '../../../base/load_more.vue'
import { getFlowBoardList } from '../../../../api/list'

export default {
    name: 'nodeItem',
    components: {
        LoadMore
    },
    props: {
        nodeItem: {},
        isTask: String,
        versionId: String,
        searchValue: {}
    },
    data() {
        return {
            busy: this.nodeItem.totalRows == this.nodeItem.list.length,
            loading: false,
            page: 1,
            pageSize: 20,
        }
    },
    computed: {
        detailUrl() {
            return window.location.href.replace(window.location.hash, '#' + (this.isTask == '3' ? '/open/detail' : '/detail'))
        },
        showRecord() {
            return this.nodeItem.list.length == 0 ? true : false
        }
    },
    methods: {
        async initList() {
            this.busy = true
            let res = await getFlowBoardList({
                workOrderSearchVO: JSON.stringify(this.searchValue),
                versionId: this.versionId,
                nodeId: this.nodeItem.nodeId,
                page: this.page,
                pageSize: this.pageSize
            })
            this.loading = false
            this.nodeItem.list = this.nodeItem.list.concat(res.result[0].list)
            this.nodeItem.totalRows = res.result[0].totalRows
            this.busy = this.nodeItem.totalRows == this.nodeItem.list.length
        },
        loadMore() {  // 加载更多
            this.page++
            this.loading = true
            this.initList()
        },
        showDetail(id) {
            this.$emit('showDetail', this.detailUrl + '?id=' + id)
        },
        noFind(e) {
            e.onerror = null;
            e.srcElement.src = require('@/assets/images/icon_person.png');
        },
        waitTime(waitTime) {
            if(!waitTime.includes('天') ) {
              waitTime = '0 天' + waitTime
            }
            if(!waitTime.includes('时')) {
              let start = waitTime.indexOf('天') + 1
              waitTime = waitTime.slice(0, start) + ' 0 时' + waitTime.slice(start)
            }
            if(!waitTime.includes('分')) {
              let start = waitTime.indexOf('时') + 1
              waitTime = waitTime.slice(0, start) + ' 0 分' + waitTime.slice(start)
            }
            return waitTime.replace(/分.*/, '') + '分'
        }
    }
}
</script>

<style lang="scss" scoped>
$black: #0A1735;
.nodeItem {
    position: relative;
    display: flex;
    flex: 0 0 312px;
    flex-direction: column;
    margin: 0 15px 24px;
    background-color: #F7F8FA;
    border-radius: 8px;
    &:first-child {
        margin-left: 32px;
    }
    .title {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        width: 100%;
        font-size: 12px;
        color: #85868F;
        font-weight: 600;
        padding-left: 14px;
        line-height: 48px;
        border-radius: 8px 8px 0px 0px;
        .number {
            position: absolute;
            top: 50%;
            right: 16px;
            height: 16px;
            padding: 0 8px;
            line-height: 16px;
            font-weight: 600;
            color: rgba(85, 133, 240, 1);
            font-size: 12px;
            background-color: rgba(85, 133, 240, 0.1);
            border-radius: 8px;
            transform: translateY(-50%);
        }
    }
    .list {
        flex: 1;
        margin-top: 48px;
        overflow-y: auto;
        margin-bottom: 10px;
        .form-list {
            .form {
                position: relative;
                padding: 14px 12px;
                height: 88px;
                margin: 0 8px 8px 8px;
                background-color: #FFF;
                border-radius: 4px;
                cursor: pointer;
                transition: all .3s ease;
                &:hover {
                    box-shadow: 0 2px 12px 0 rgba(178, 185, 200, 0.4);
                }
                .form-name {
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    max-height: 72px;
                    color: #333;
                    font-size: 14px;
                    line-height: 1.4;
                    word-break: break-all;
                    white-space: normal;
                }
                .audit-list {
                    display: flex;
                    position: absolute;
                    bottom: 14px;
                    height: 22px;
                    user-select: none;
                    .head-pic {
                        width: 20px;
                        height: 20px;
                        border-radius: 11px;
                        border: 1px solid #FFF;
                        &.more {
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            background-color: #E3E4E8;
                            .dot {
                                width: 2px;
                                height: 2px;
                                background-color: #FFF;
                                border-radius: 1px;
                                margin: 1px;
                            }
                        }
                    }
                }
                .wake-time {
                    position: absolute;
                    right: 16px;
                    bottom: 16px;
                    width: 140px;
                    font-size: 12px;
                    color: #85868F;
                    user-select: none;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    overflow: hidden;
                    text-align: right;
                    .time {
                        padding: 0 2px;
                        font-weight: 600;
                    }
                    .level {
                        position: absolute;
                        top: 50%;
                        left: -12px;
                        width: 6px;
                        height: 6px;
                        border-radius: 3px;
                        transform: translateY(-50%);
                        &.high {
                            background-color: #FF586D;
                        }
                        &.middle {
                            background-color: #FFC363;
                        }
                        &.low {
                            background-color: #28DA98;
                        }
                    }
                }
            }
        }
    }
}
::-webkit-scrollbar {
    width: 6px;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #E3E4E8;
}
</style>
