<template>
<div class="dealer-detail">
    <ProfileItem :data="convertDealerData(detail)"></ProfileItem>

    <div @click=" handleTest" class="info">
        <div class="info__item">
            <p class="info__label">店面级别</p>
            <p class="info__value">{{ detail.storeLevel || "-" }}</p>
        </div>
        <div class="info__item">
            <p class="info__label">开通日期</p>
            <p class="info__value">{{ detail.openingTime || "-" }}</p>
        </div>
        <div class="info__item">
            <p class="info__label">所属集团</p>
            <p class="info__value">{{ detail.belongGroup || "-" }}</p>
        </div>
    </div>

    <div class="leadership" v-if="isNonEmptyObject(executive)">
        <div class="leadership__card" @click="clickLeadership(executive)">
            <div class="leadership__avatar">
                <img :src="getAvatar(executive.chairmanHeadUrl)" alt="" @click="previewImage(executive.chairmanHeadUrl)" />
            </div>
            <div class="leadership__info">
                <p class="leadership__name">{{ executive.chairmanName || '-' }}</p>
                <p class="leadership__position">董事长</p>
            </div>
        </div>

        <div class="leadership__card" @click="clickLeadership(executive)">
            <div class="leadership__avatar">
                <img :src="getAvatar(executive.generalManagerHeadUrl)" alt="" @click="previewImage(executive.generalManagerHeadUrl)" />
            </div>
            <div class="leadership__info">
                <p class="leadership__name">{{ executive.generalManagerName  || '-'}}</p>
                <p class="leadership__position">总经理</p>
            </div>
        </div>

        <div class="leadership__card" @click="clickLeadership(executive)">
            <div class="leadership__avatar">
                <img :src="getAvatar(executive.legalRepresentativeHeadUrl)" alt="" @click="previewImage(executive.legalRepresentativeHeadUrl)" />
            </div>
            <div class="leadership__info">
                <p class="leadership__name">
                    {{ executive.legalRepresentativeName  || '-'}}
                </p>
                <p class="leadership__position">法人</p>
            </div>
        </div>
    </div>

    <div class="panel">
        <div class="panel__group" v-for="(item, index) in apps" :key="index">
            <h4 class="panel__title">
                <div class="panel__title__icon">
                    <img :src="iconCart" alt="">
                </div>
                <span class="panel__title__text">{{ item.groupName }}</span>
            </h4>
            <div class="panel__content" v-show="item.isShow">
                <div class="panel__app" @click="handleClickIcon(appItem)" v-for="(appItem, appIndex) in item.children" :key="appIndex">
                    <div class="panel__icon">
                        <img :src="appItem.icon" alt="" />
                    </div>
                    <p class="panel__text">{{ appItem.name }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import ProfileItem from "@/module/channelManagement/components/ProfileItem";

import iconBuildingProcess from "@/module/channelManagement/static/images/dealerDetail/icon_building_process.png";
import iconBuildingProcess2 from "@/module/channelManagement/static/images/dealerDetail/icon_building_process2.png";
import iconBusinessDistrictInfo from "@/module/channelManagement/static/images/dealerDetail/icon_business_district_info.png";
import iconCityInfo from "@/module/channelManagement/static/images/dealerDetail/icon_city_info.png";
import iconCityShare from "@/module/channelManagement/static/images/dealerDetail/icon_city_share.png";
import iconEmployeeInfo from "@/module/channelManagement/static/images/dealerDetail/icon_employee_info.png";
import iconExitInfo from "@/module/channelManagement/static/images/dealerDetail/icon_exit_info.png";
import iconFundBalance from "@/module/channelManagement/static/images/dealerDetail/icon_fund_balance.png";
import iconRebate from "@/module/channelManagement/static/images/dealerDetail/icon_rebate.png";
import iconRebateBlue from "@/module/channelManagement/static/images/dealerDetail/icon_rebate_blue.png";
import iconNetworkPlanning from "@/module/channelManagement/static/images/dealerDetail/icon_network_planning.png";
import iconProfitStatus from "@/module/channelManagement/static/images/dealerDetail/icon_profit_status.png";
import iconRewardAndPunish from "@/module/channelManagement/static/images/dealerDetail/icon_reward_and_punish.png";
import iconSaleOperation from "@/module/channelManagement/static/images/dealerDetail/icon_sale_operation.png";
import iconStoreInfo from "@/module/channelManagement/static/images/dealerDetail/icon_store_info.png";
import iconTrainingInfo from "@/module/channelManagement/static/images/dealerDetail/icon_training_info.png";
import iconSaleStatus from "@/module/channelManagement/static/images/dealerDetail/icon_sale_status.png";
import defaultAvatar from "@/assets/images/icon_person.png";
import iconArrowDown from "@/module/channelManagement/static/images/icon_arrow_down.png";
import iconBusinessInfo from "@/module/channelManagement/static/images/dealerDetail/icon_business_info.png";
import iconRisk from '@/module/channelManagement/static/images/dealerDetail/icon_risk.png'
import iconCart from '@/module/channelManagement/static/images/icon_cart.png'

import {
    searchDealerUserByKey
} from "@/module/channelManagement/api/development";
import {
    getCompanyInfo,
    processIsComplete,
    isComplete
} from "@/module/channelManagement/api/getData";

export default {
    name: "DealerDetail",
    components: {
        ProfileItem
    },
    data() {
        return {
            iconCart,
            dealerData: {
                avatar: "",
                name: "",
                address: "",
                status: "1",
                province: "",
                city: ""
            },
            iconArrowDown: iconArrowDown,
            executive: {},
            apps: [{
                    groupName: "网络规划开发",
                    isShow: true,
                    children: [{
                            icon: iconCityInfo,
                            name: "城市介绍",
                            route: "cityInfo"
                        },
                        {
                            icon: iconCityShare,
                            name: "城市市占",
                            route: "cityShare"
                        },
                        {
                            icon: iconNetworkPlanning,
                            name: "一网规划",
                            route: "oneNetworkPlanning"
                        },
                        {
                            icon: iconBusinessDistrictInfo,
                            name: "二网规划",
                            route: "twoNetworkPlanning"
                        }
                    ]
                },
                {
                    groupName: "网络建设管理",
                    isShow: true,
                    children: [{
                            icon: iconBuildingProcess,
                            name: "一网建设",
                            route: "firstNetBuilding"
                        },
                        {
                            icon: iconBuildingProcess2,
                            name: "二网建设",
                            route: "secondNetBuilding"
                        },
                        {
                            icon: iconRebateBlue,
                            name: "一网返利",
                            route: "firstNetRebate"
                        },
                        {
                            icon: iconRebate,
                            name: "二网返利",
                            route: "secondNetRebate"
                        }
                    ]
                },
                {
                    groupName: "网络运营管理",
                    isShow: true,
                    children: [{
                            icon: iconSaleStatus,
                            name: "销量数据",
                            route: "salesData"
                        },
                        {
                            icon: iconProfitStatus,
                            name: "业绩评估",
                            route: "performanceEvaluation"
                        },
                        {
                            icon: iconSaleOperation,
                            name: "运营评估",
                            route: "operationEvaluation"
                        },
                        // {
                        //     icon: iconServiceOperation,
                        //     name: "服务运营",
                        //     route: "buildingRebate"
                        // },
                        {
                            icon: iconRewardAndPunish,
                            name: "奖惩信息",
                            route: "rewardAndPunishment"
                        }
                    ]
                },
                {
                    groupName: "预警退出管理",
                    isShow: true,
                    children: [{
                            icon: iconRisk,
                            name: "预警管理",
                            route: "warningInfo"
                        },
                        {
                            icon: iconExitInfo,
                            name: "退网信息",
                            route: "exitNetInfo"
                        },
                        // {
                        //   icon: iconEmployeeInfo,
                        //   name: "人员信息",
                        //   route: "employment"
                        // },
                        // {
                        //   icon: iconOperationAuthority,
                        //   name: "经营权限",
                        //   route: "operatingAuthority"
                        // },
                        // {
                        //   icon: iconTrainingInfo,
                        //   name: "培训信息",
                        //   route: "trainingInfor"
                        // },
                        // {
                        //   icon: iconFundStatus,
                        //   name: "资金状况",
                        //   route: "fundStatus"
                        // },
                        // {
                        //   icon: iconFundBalance,
                        //   name: "资金余额",
                        //   route: "fundBalance"
                        // },
                        // {
                        //   icon: iconStoreInfo,
                        //   name: "直营店信息",
                        //   route: "storeInfo"
                        // },
                        // {
                        //   icon: iconStore,
                        //   name: "网销平台",
                        //   route: "onlineSalesPlatform"
                        // },
                        // {
                        //   icon: iconEmployeeInfo,
                        //   name: "核心人员",
                        //   route: "coreStaff"
                        // }
                    ]
                },
                {
                    groupName: "人员信息管理",
                    isShow: true,
                    children: [{
                            icon: iconEmployeeInfo,
                            name: "人员信息",
                            route: "employment"
                        },
                        {
                            icon: iconTrainingInfo,
                            name: "培训信息",
                            route: "trainingInfo"
                        },

                        // {
                        //   icon: iconProfitStatus,
                        //   name: "盈利情况",
                        //   route: "profitStatus"
                        // },
                        // {
                        //   icon: iconSaleStatus,
                        //   name: "销量情况",
                        //   route: "salesVolumeStatus"
                        // },
                        // {
                        //   icon: iconSaleOperation,
                        //   name: "销售运营",
                        //   route: "salesOperation"
                        // },
                        // {
                        //   icon: iconSaleStatus,
                        //   name: "产品销量",
                        //   route: "productSales"
                        // },
                        // {
                        //   icon: iconServiceOperation,
                        //   name: "服务运营",
                        //   route: "serviceOperation"
                        // },
                        // {
                        //   icon: iconEvaluate,
                        //   name: "综合运营评估",
                        //   route: "evaluation"
                        // },
                        // {
                        //   icon: iconRewardAndPunish,
                        //   name: "奖惩信息",
                        //   route: "rewardsAndPunishments"
                        // },
                        // {
                        //   icon: iconAnnulCommendation,
                        //   name: "年度表彰",
                        //   route: "annualCommendation"
                        // }
                    ]
                },
                {
                    groupName: "基础信息管理",
                    isShow: true,
                    children: [{
                            icon: iconBusinessInfo,
                            name: "工商信息",
                            route: "businessInfo"
                        },
                        {
                            icon: iconStoreInfo,
                            name: "授权信息",
                            route: "authorizeInfo"
                        },
                        {
                            icon: iconFundBalance,
                            name: "资金信息",
                            route: "fundsInfo"
                        }
                    ]
                }
            ],
            detail: {
                // id: '', //主键
                // erpCarNo: '', //整车ERP
                // erpSerNo: '', //服务ERP
                // dealerFullName: '', //经销商名称（全称）
                // dealerShortName: '', //经销商名称（简称）
                // openingTime: '', //开通时间
                // storeLevel: '', //店面级别
                // storeProperties: '', //店面性质
                // storeType: '', //店面类别
                // storeImg: '', //店面图片
                // belongGroup: '', //所属集团
                // operatingState: '', //OMMENT运营状态（1、正常运营2、经营异常3、退网经销商 默认1）',
                // companyAddress: '', //公司地点
                // serviceShortName: '', //服务简称
                // businessModels: '', //经营车型
                // salesRegionName: '' //销售责任区域：物理地域DMS对接获取)',
            },
            dealerId: "",
            dealerFullName: "",
            storeImg: "",
            erpCarNo: ""
        };
    },

    created() {
        //  this.detail = this.$route.query
        this.dealerId = this.$route.query.dealerId || "";
        getCompanyInfo({
            id: this.dealerId
        }).then(data => {
            if (data) {
                const detail = data.companyInfoVO;
                this.detail = detail || {};
                this.dealerFullName = detail.dealerFullName || "";
                this.storeImg = detail.storeImg || "";
                this.erpCarNo = detail.erpCarNo || "";

            }
        });
        searchDealerUserByKey({
            dealerId: this.dealerId
        }).then(data => {
            if (data) {
                this.executive = data.tbEntQrDealerUserVo;
            }
        });
        processIsComplete({
            dealerId: this.dealerId
        }).then(data => {
            if (data && data.flag) {
                this.apps[2].isShow = !data.flag; // 建设
            }
        });
        isComplete({
            dealerId: this.dealerId
        }).then(data => {
            if (data && data.flag) {
                this.apps[1].isShow = !data.flag; // 入网
            }
        });
    },
    methods: {

        handleTest() {
            // const {name,query} =  this.$route;
            // this.$router.replace({
            //     name: name,
            //     query: Object.assign({}, query, {xx:233232})
            // })
            // const {hash, origin, pathname,search} = window.location
            // const routePath =  hash.replace(/\?.+$/,'');
            // const querystr = Qs.stringify({'23xxx':32223333333332})
            // const url = `${origin}${pathname}${search}${routePath}?${querystr}`
            // history.replaceState(null, document.title, url)
            // console.log(url)
        },

        handleClickArrow(index) {
            this.apps[index].isShow = !this.apps[index].isShow;
        },

        isNonEmptyObject(target) {
            const isObject =
                Object.prototype.toString.call(target) === "[object Object]";
            return isObject && !!Object.keys(target).length;
        },
        handleClickIcon({
            route
        }) {
            this.$router.push({
                name: route,
                query: {
                    dealerId: this.dealerId,
                    province: this.detail.provinceName,
                    city: this.detail.cityName,
                    erpCarNo: this.erpCarNo //整车ERP
                    // erpSerNo: this.detail.erpSerNo //服务ERP
                }
            });
        },

        clickLeadership(detail) {
            // const query = {
            //     dealerId: this.dealerId,
            //     province: this.detail.provinceName,
            //     city: this.detail.cityName,
            //     erpCarNo: this.erpCarNo, //整车ERP
            //     employmentId: detail.id
            // }
            // console.log(detail)
            // this.$router.push({ name: 'employmentDetail', query })
        },

        getAvatar(url) {
            return url ? _.fileDownURL + url : defaultAvatar;
        },

        convertDealerData(dealer) {
            return {
                id: dealer.id,
                avatar: this.storeImg ? _.compressURL + this.storeImg : "",
                name: this.dealerFullName,
                address: dealer.companyAddress,
                status: dealer.operatingState,
                nature: dealer.nature,
            };
        },

        previewImage(url) {
            const avatarUrl = url ? _.fileDownURL + url : defaultAvatar;
            this.$imagePreview({
                initialIndex: 0,
                urls: [avatarUrl]
            })
        },

    }
};
</script>

<style lang="scss" scoped>
.dealer-detail {
    min-height: 100vh;

    // background: #fff;
    .info {
        display: flex;
        justify-content: space-between;
        background: #ffffff;
        border-top: 1px solid rgba(219, 219, 219, 1);
        border-bottom: 1px solid rgba(219, 219, 219, 1);

        .info__item {
            width: 33.3%;
            text-align: center;
            padding: 15px 0 0;
            border-right: 1px solid rgba(219, 219, 219, 1);
        }

        .info__item:last-child {
            border-right: none;
        }

        .info__label {
            height: 28px;
            font-size: 12px;
            line-height: 28px;
            color: rgba(153, 153, 153, 1);
            overflow: hidden;
            text-align: center;
            white-space: nowrap;
        }

        .info__value {
            overflow: hidden;
            text-align: center;
            flex-wrap: wrap;
            margin-top: 4px;
            padding: 4px 0;
            height: 38px;
            font-size: 15px;
            font-weight: 400;
            line-height: 20px;
        }
    }

    .leadership {
        background: #ffffff;
        padding: 15px 0 15px 15px;
        overflow-x: auto;
        white-space: nowrap;
    }

    .leadership__card {
        width: 160px;
        height: 55px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        overflow: hidden;
        display: inline-block;
        margin-right: 30px;

        &::after {
            content: "";
            display: block;
            clear: both;
            height: 0;
            font-size: 0;
        }

        &:last-child {
            margin-right: 15px;
        }
    }

    .leadership__avatar {
        float: left;
        width: 55px;
        height: 55px;
        overflow: hidden;
        margin-right: 10px;

        &>img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .leadership__name {
        width: 85px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        color: rgba(51, 51, 51, 1);
        margin-top: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .leadership__position {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 85px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        color: rgba(51, 51, 51, 1);
    }

    .gutter {
        height: 10px;
        background: rgba(247, 247, 247, 1);
    }

    .panel {
        background: #ffffff;
        padding-bottom: 60px;
    }

    .panel__title {
        height: 40px;
        padding: 0 32px;
        background: #F7F7F7;
        display: flex;
        align-items: center;
    }

    .panel__title__icon {
        width: 17px;
        height: 17px;
        margin-right: 2px;

        &>img {
            width: 100%;
        }
    }

    .panel__title__text {
        height: 24px;
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
        color: rgba(198, 0, 31, 1);
        opacity: 1;
    }

    /*.panel__title::after {*/
    /*  content: "";*/
    /*  position: absolute;*/
    /*  bottom: 0;*/
    /*  height: 1px;*/
    /*  transform: scaleY(0.5);*/
    /*  left: 15px;*/
    /*  right: 15px;*/
    /*  background: #eee;*/
    /*}*/
    .panel__content {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        padding: 0 18px 6px;
    }

    .panel__app {
        width: 60px;
        height: 58px;
        padding-top: 11px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.16);
        border-radius: 4px;
        margin-right: 9px;
        margin-top: 6px;

        &:last-child {
            margin-right: 0;
        }
    }

    .panel__icon {
        width: 26px;
        height: 26px;
        margin: 0 auto;

        &>img {
            width: 100%;
        }
    }

    .panel__text {
        margin-top: 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 16px;
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        text-align: center;
        color: rgba(51, 51, 51, 1);
    }
}
</style>
