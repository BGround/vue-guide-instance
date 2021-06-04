<template>
    <div class="dataReport" v-show="hasInit">
        <div class="content" v-if="!showNoVip && !showNoData && !showNoPermission">
            <div class="showField ku_arrow"  @click="showSetting = true">
                <i class="icon"></i>
                显示/隐藏字段
            </div>
            <show-field
                v-if="hasInit"
                v-show="showSetting"
                :showField.sync="showField"
                :customField="customField"
                @close="closeSetting"
                @search="init"></show-field>
            <div class="field"
                v-for="(field, index) in statisticsField"
                :key="field.itemKey">
                <component :is="checkType(field.itemType)"
                    :field="field"
                    :index="index"></component>
            </div>
        </div>
        <no-vip v-if="showNoVip"></no-vip>
        <no-data v-if="showNoData"></no-data>
        <no-permission v-if="showNoPermission"></no-permission>
    </div>
</template>
<script>
import countField from './components/countField'
import numberField from './components/numberField'
import selectField from './components/selectField'
import selectTwoField from './components/selectTwoField'
import noData from './noData'
import noPermission from './noPermission'
import noVip from './noVip'
import showField from './showField'
import { getDataReport, reportVisitLog } from '../../../api/list'
import { map } from './map'
import {isVipGold} from '@/assets/js/vip-portal.js'

export default {
    name: "dataReport",
    components: {
        showField,
        countField,
        numberField,
        selectField,
        selectTwoField,
        noData,
        noPermission,
        noVip
    },
    data(){
        return {
            showSetting: false, // 是否显示用于控制显示字段的弹窗
            showField: '', // 显示字段
            customField: [], // 所有用户自定义字段
            statisticsField: [], // 统计字段
            hasInit: false, // 是否已经返回数据
            showNoVip: false,
            showNoData: false,
            showNoPermission: false,
        }
    },
    methods: {
        async init(showField = '') {
            if(!isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
                this.hasInit = true;
                return this.showNoVip = true;
            }
            let res = await getDataReport({
                'showFields': showField,
                'versionsId': this.$route.query.id
            });
            this.hasInit = true;
            // 无权限
            if(res.canSeeDataReport == 0) {
                return this.showNoPermission = true;
            }
            // 无数据
            if(res.formStatisticsResultVOList.length == 0) {
                return this.showNoData = true;
            }
            this.showField = res.showFields;
            this.customField = res.itemListTemplateList;
            this.statisticsField = res.formStatisticsResultVOList;
        },
        initTitle(formTitle) {
            let title = document.getElementsByTagName('title')[0];
            title.innerHTML = '';
            title.append(formTitle);
        },
        closeSetting() {
            this.showSetting = false;
        },
        checkType(itemType) {
            let i = -1,
                type = '';
            map.forEach((item, index) => {
                if(item[itemType]) {
                    i = index;
                }

            })
            switch(i) {
                case 0: type = 'countField'; break;
                case 1: type =  'selectField'; break;
                case 2: type =  'numberField'; break;
                case 3: type =  'selectTwoField'; break;
            }
            return type
        }
    },
    created() {

        // this.initTitle(this.$route.query.title);
        // 数据埋点，用于统计进入统计报表的用户量
        reportVisitLog({
            type: 1,
            userId: dataBase.config.userId,
            definitionVersionsId: this.$route.query.id
        });
        this.init();
    }
}

</script>

<style lang="scss" scoped>
.content {
    margin-bottom: -8px;
    .showField {
        position: relative;
        height: 50px;
        padding-left: 40px;
        font-size: 15px;
        font-weight: 400;
        line-height: 50px;
        background: #fff;
        color: #7A7D80;
        border: 1px solid #F7F8FA;
        box-shadow: 0px -1px 0px 0px rgba(247,248,250,1);
        cursor: pointer;
        .icon {
            position: absolute;
            top: 50%;
            left: 15px;
            height: 16px;
            width: 16px;
            background: url(~assets/images/ic_setting.png) no-repeat;
            background-size: contain;
            transform: translateY(-50%);
        }
    }
    .field {
        margin-bottom: 8px;
    }
    .field:last-child {
        margin-bottom: 0;
    }
}
</style>
