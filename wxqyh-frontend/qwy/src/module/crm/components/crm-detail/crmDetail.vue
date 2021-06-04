/** 该组件只能公海池、客户、联系人、商机、拜访详情使用 */
/**
    参数：
    @params type: 应用名称，只允许传pool client contact business visit
    @params id: 详情id
    @params operateConfig: 更多操作配置
        operateConfig: [
            {
                key: 'assign',
                name: '分配'
            },
            {
                key: 'changePool',
                name: '变更公海'
            }
        ]

    方法：
    @params edit(返回详情id): 编辑回调函数
    @params moreOperate(操作选项key): 更多操作回调函数
    @params close: 关闭详情回调函数
*/
<template>
    <detail-card ref="detailBlock" @close="close">
        <template slot="title">
            <div class="detail-header-block">
                <h1 class="detail-title" :title="clinentName" >{{clinentName}}</h1>
                <div class="detail-header-btns">
                    <span v-perm="permissionEdit">
                        <qw-Button type="primary" @click="edit">编辑</qw-Button>
                    </span>
                    <qw-popover ref="qwPopover" class="btns-down" placement="bottom" :gutter="10" :show-arrow="false">
                      <div slot="content" class="btns-down-menu">
                          <div
                            v-for="(item,idx) in operateConfig"
                            :key="idx"
                            class="btns-down-item"
                            @click="moreOperate(item.key)"
                            v-perm="item.permission"
                        >{{item.name}}</div>
                      </div>
                      <qw-Button >更多 <i class="btns-down-icon"></i></qw-Button>
                    </qw-popover>
                </div>
            </div>
        </template>
        <template>
            <qw-tabs :defaultTabName="defaultTabName" @tabClick="tabClick">
                <qw-tab-item label="客户详情" name="clientOrPool">
                    <template v-if="isClick.clientOrPool">
                        <territorial-sea-info
                            v-if="type === 'pool'"
                            :id="idObj.clientOrPoolId"
                            @setTitle="setTitle"
                        ></territorial-sea-info>
                        <client-info
                            v-else
                            :id="idObj.clientOrPoolId"
                            @setTitle="setTitle"
                        ></client-info>
                    </template>
                </qw-tab-item>
                <qw-tab-item label="联系人" name="contact">
                    <template v-if="isClick.contact">
                        <contact-info
                            v-if="showInfo('contact')"
                            :showArrow="showArrow"
                            :id="idObj.contactId"
                            @back="back"
                            @setTitle="setTitle"
                        ></contact-info>
                        <contact-table
                            v-show="!isDetail"
                            v-if="defaultTabName !== 'contact'"
                            :id="idObj.clientOrPoolId"
                            @goDetail="goDetail"
                        ></contact-table>
                    </template>
                </qw-tab-item>
                <qw-tab-item label="商机" name="business">
                    <template v-if="isClick.business">
                        <business-info
                            v-if="showInfo('business')"
                            :showArrow="showArrow"
                            :id="idObj.businessId"
                            @back="back"
                            @setTitle="setTitle"
                        ></business-info>
                        <business-table
                            v-show="!isDetail"
                            v-if="defaultTabName !== 'business'"
                            :id="idObj.clientOrPoolId"
                            @goDetail="goDetail"
                        ></business-table>
                    </template>
                </qw-tab-item>
                <qw-tab-item label="拜访" name="visit">
                    <template v-if="isClick.visit">
                        <visit-info
                            v-if="showInfo('visit')"
                            :showArrow="showArrow"
                            :id="idObj.visitId"
                            @back="back"
                            @setTitle="setTitle"
                        ></visit-info>
                        <visit-table
                            v-show="!isDetail"
                            v-if="defaultTabName !== 'visit'"
                            :id="idObj.clientOrPoolId"
                            @goDetail="goDetail"
                        ></visit-table>
                    </template>
                </qw-tab-item>
            </qw-tabs>
        </template>
    </detail-card>
</template>
<script>
import DetailCard from 'crm/components/qw-detatil-card/qw-detatil-card';
import QwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import QwTabs from 'crm/components/qw-tab/tab/tab';
import QwTabItem from 'crm/components/qw-tab/tabItem/tabItem';
import QwPopover from 'crm/components/qwPopover';
import TerritorialSeaInfo from './components/territorialSeaInfo';
import ClientInfo from './components/clientInfo';
import ContactInfo from './components/contactInfo';
import ContactTable from './components/contactTable';
import BusinessInfo from './components/businessInfo';
import BusinessTable from './components/businessTable';
import VisitInfo from './components/visitInfo';
import VisitTable from './components/visitTable';

export default {
    name: 'crmDetail',
    props: {
        // 应用名称
        type: {
            type: String,
            required: true,
            validator(val) {
                return ['pool', 'client', 'contact', 'business', 'visit'].indexOf(val) !== -1;
            }
        },

        // 详情id
        id: {
            type: String,
            required: true
        },

        //详情权限
        permissionEdit: {
            type: String,
            default: ''
        },

        // 更多操作栏
        operateConfig: {
            type: Array,
            required: true
        }
    },
    components: {
        DetailCard,
        QwButton,
        QwTabs,
        QwTabItem,
        QwPopover,
        TerritorialSeaInfo,
        ClientInfo,
        ContactInfo,
        ContactTable,
        BusinessInfo,
        BusinessTable,
        VisitInfo,
        VisitTable
    },
    data () {
        return {
            isClick: {  // tab是否已经被点击过
                clientOrPool: false,
                contact: false,
                business: false,
                visit: false
            },
            isDetail: false,  // 是否进入详情
            showArrow: false,  // 是否显示返回箭头
            idObj: {  // id对象
                clientOrPoolId: '',
                contactId: '',
                businessId: '',
                visitId: ''
            },
            currentTab: this.defaultTabName,  // 当前tab
            clinentName: ''  // 客户名称
        }
    },
    computed: {
        // 默认的tabName
        defaultTabName() {
            if(this.type === 'client' || this.type === 'pool'){
                this.$set(this.idObj, 'clientOrPoolId', this.id);
                return 'clientOrPool';
            }
            else{
                this.$set(this.idObj, `${this.type}Id`, this.id);
                return this.type;
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            this.isClick[this.defaultTabName] = true;
        },

        // 编辑
        edit() {
            this.$emit('edit', this.id);
        },

        // 点击tab
        tabClick(obj) {
            this.isDetail = false;
            this.isClick[obj.name] = true;
            this.currentTab = obj.name;
            this.showArrow = false;
        },

        // 设置详情标题
        setTitle(clientName, clientId) {
            this.idObj['clientOrPoolId'] = clientId || this.id;
            this.clinentName = clientName;
        },

        // 打开详情
        showDetail(){
            this.$refs.detailBlock.open();
        },

        // 关闭详情
        close() {
            // 重置是否点击
            this.isClick = {
                clientOrPool: false,
                contact: false,
                business: false,
                visit: false
            }
            this.$emit('close');
        },

        // 查看详情
        goDetail(type, id) {
            this.isDetail = true;
            this.showArrow = true;
            this.$set(this.idObj, `${type}Id`, id);
        },

        // 返回
        back() {
            this.isDetail = false;
            this.showArrow = false;
        },

        // 是否显示列表详情
        showInfo(type){
            return (this.isDetail || this.defaultTabName === type) && this.currentTab === type;
        },

        // 更多操作
        moreOperate(key) {
            this.$emit('moreOperate', key);
        }
    }
}
</script>
<style lang='scss' scoped>
@import '@/assets/scss/baseUI.scss';

.detail-header-block{
    display: flex;
    justify-content: space-between;
    .detail-title{
        @include ellipsis;
        width: 600px;
    }
    .btns-down-menu{
        background: #fff;
    }
    .detail-header-btns{
      .btns-down{
        position: relative;
        display: inline-block;
        margin-left: 12px;
       &-icon{
            background: url(~assets/images/ic_down.png) no-repeat;
            background-size: contain;
            display: inline-block;
            width: 11px;
            height: 6px;
            margin-left: 3px;
            vertical-align: middle;
          }
        &-menu{
          font-size: 14px;
          width: 100%;
          width:80px;
          box-shadow:0px 0px 6px 0px rgba(0,0,0,0.1);
          border-radius:2px;
        }
        &-item{
          padding:8px 0px;
          text-align: center;
          width: 100%;
          cursor: pointer;
          &:active{
            background: #f4f5f9;
          }
        }
      }
    }
}
</style>
