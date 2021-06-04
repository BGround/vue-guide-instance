<!-- 资金信息 -->
<template>
<div class="funds-info">
    <div class="time">
        <assembly-date-picker :defaultDate="defaultDate" type="month" @setDate="setDate">
        </assembly-date-picker>
    </div>

    <div class="fund_credit">
        <content-title style="margin-top: 8px" name="授信额度" :content="['更新日期：'+(facilityQuota.updateTime||'暂无'),'更新人：'+(facilityQuota.updateUser||'暂无')]" padding="9px 7px 9px 15px">
        </content-title>

        <div class="credit_content">
            <div class="card">
                <div class="num">
                    <span class="num_black">{{ facilityQuota.financialRealCredit|formatFunds }}</span>万元
                </div>
                <div class="label">金融额度</div>
            </div>
            <div class="card">
                <div class="num">
                    <span class="num_black">{{ facilityQuota.threeWayRealCredit|formatFunds }}</span>万元
                </div>
                <div class="label">三方额度</div>
            </div>
        </div>
    </div>

    <div class="capital_composition">
        <content-title style="margin-top: 8px" name="资金构成" :content="['更新日期：'+(facilityQuota.updateTime||'暂无'),'更新人：'+(facilityQuota.updateUser||'暂无')]" padding="9px 7px 9px 15px">
        </content-title>

        <div class="composition_content">
            <div class="month_composition">
                <div class="composition_title">当月提车资金构成</div>
                <div class="card_content">
                    <div class="card">
                        <div class="line">
                            <div class="label">金融贷款</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.financialLoans|formatFunds }}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.financialLoansPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">三方银票</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.threeWaySilverTicket|formatFunds }}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.threeWaySilverTicketPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">自有资金</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.ownFunds|formatFunds }}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.ownFundsPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">合计</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.total|formatFunds }}</span>万元</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="year_composition">
                <div class="composition_title">当年累计提车资金构成</div>
                <div class="card_content">
                    <div class="card">
                        <div class="line">
                            <div class="label">金融贷款</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.cumFinancialLoans|formatFunds}}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.cumFinancialLoansPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">三方银票</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.cumThreeWaySilverTicket|formatFunds }}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.cumThreeWaySilverTicketPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">自有资金</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.cumOwnFunds|formatFunds }}</span>万元</div>
                        </div>
                        <div class="line">
                            <div class="label">占比</div>
                            <div class="num proportion">{{ formatProportion(facilityQuota.cumOwnFundsPerCent) }}</div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="line">
                            <div class="label">合计</div>
                            <div class="num"><span class="num_black">{{ facilityQuota.cumTotal|formatFunds }}</span>万元</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="fund_balance">
                <div class="composition_title">整车资金余额</div>
                <div class="card_content">
                    <div class="card_3">
                        <div class="deadline">{{ vehicleCapital.updateTime||'-' }}</div>
                        <div class="label_3">截止日期</div>
                    </div>
                    <div class="card_3">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.carFinancialCurAvailability | formatFunds }}</span>万元
                        </div>
                        <div class="label_3">金融当前可用</div>
                    </div>
                    <div class="card_3">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.carThreeWaySilver | formatFunds }}</span>万元
                        </div>
                        <div class="label_3">三方银票资金</div>
                    </div>
                    <div class="card_3">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.carMarginBalance | formatFunds }}</span>万元
                        </div>
                        <div class="label_3">保证金余额</div>
                    </div>
                    <div class="card_3">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.carRebatePoolBalance | formatFunds }}</span>万元
                        </div>
                        <div class="label_3">返利池余额</div>
                    </div>
                    <div class="card_3">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.carOwnFunds | formatFunds }}</span>万元
                        </div>
                        <div class="label_3">自有资金</div>
                    </div>
                </div>
            </div>

            <div class="spare_fund_balance">
                <div class="composition_title">备件资金余额</div>
                <div class="card_content">
                    <div class="card_2">
                        <div class="num num_black">{{ vehicleCapital.updateTime||'-' }}</div>
                        <div class="label">截止日期</div>
                    </div>
                    <div class="card_2">
                        <div class="num">
                            <span class="num_black">{{ vehicleCapital.spareBalance | formatFunds }}</span>万元
                        </div>
                        <div class="label">备件余额</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="profitability">
        <content-title style="margin-top: 8px" name="盈利情况" :content="['更新日期：'+(profitabilityUpdate.time||'暂无'),'更新人：'+(profitabilityUpdate.user||'暂无')]" padding="9px 7px 18px 15px">
        </content-title>
        <table class="profitability_table">
            <tr class="table_header">
                <th class="header_cell"></th>
                <th class="header_cell">{{year}}年{{month > 1 ? '1-' : ''}}{{month}}月</th>
                <th class="header_cell">{{year}}年{{month}}月</th>
            </tr>
            <tr class="table_content title_border" v-for="(item, index) in profitabilityTableData" :key="index">
                <td class="first_col"><span style="margin-right: 4px">·</span>{{ item.name }}</td>
                <td class="data_cell">{{ item.fullYear }}</td>
                <td class="data_cell">{{ item.month }}</td>
            </tr>
            <div v-if="!profitabilityTableData||profitabilityTableData.length==0" class="no_data">
                <p>暂无数据</p>
            </div>
        </table>
    </div>
</div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp.js'
import contentTitle from '@/module/channelManagement/components/contentTitle';
import assemblyDatePicker from '@/module/channelManagement/components/assemblyDatePicker';
import {
    getFacilityQuota,
    getVehicleCapital,
    getProfitability
} from '@/module/channelManagement/api/basic';
import dayjs from "dayjs";

export default {
    name: "fundsInfo",
    mixins: [reloadApp],
    components: {
        contentTitle,
        assemblyDatePicker
    },

    data() {
        const defaultDate = dayjs(new Date()).subtract(1, 'month').toDate();
        return {
            defaultDate: defaultDate,
            dealerId: '',
            year: defaultDate.getFullYear(),
            month: defaultDate.getMonth() + 1,
            vehicleCapital: {},
            facilityQuota: {},
            profitability: {},
            profitabilityUpdate: {
                time: '',
                user: ''
            },
            profitabilityTableData: [],
            isLoading: false
        }
    },
    computed: {

    },
    watch: {
        $route: {
            handler() {
                this.dealerId = this.$route.query.dealerId;
                console.log(this.dealerId);
                if (this.dealerId) {
                    this.init(this.dealerId)
                } else {
                    this.reloadApp()
                }
            }
        }
    },
    methods: {
        init() {
            this.isLoading = true
            const getFacilityQuotaPromise = getFacilityQuota(this.dealerId, this.year, this.month).then(data => {
                if (data) {
                    // console.log(data)
                    this.facilityQuota = data || {}
                    // console.log(this.facilityQuota)
                } else {
                    this.facilityQuota = {}
                }
            })

            const getProfitabilityPromise = getProfitability(this.dealerId, this.year, this.month).then(data => {
                if (data) {
                    this.profitability = data || {}
                    this.formatDataTable(this.profitability)
                    // console.log(this.profitability)
                } else {
                    this.profitability = {}
                    this.formatDataTable(this.profitability)
                }
            })

            const getVehicleCapitalPromise = getVehicleCapital(this.dealerId, this.year, this.month).then(data => {
                if (data) {
                    this.vehicleCapital = data || {}
                    // console.log(this.vehicleCapital)
                } else {
                    this.vehicleCapital = {}
                }
            })

            Promise.all([
                getFacilityQuotaPromise,
                getProfitabilityPromise,
                getVehicleCapitalPromise
            ]).finally(() => {
                this.isLoading = false;
            })
        },
        setDate(yearText, quarterText, monthText, yearValue, quarterValue, monthValue) {
            // console.log(yearText ,quarterText, monthText, yearValue, quarterValue, monthValue)
            this.year = yearValue;
            this.month = monthValue;
            this.init()
        },
        formatProportion(proportion) {
            if (proportion) {
                if (proportion.indexOf('%') != -1) {
                    return proportion.substr(0, proportion.indexOf('%')) + ' %'
                }
            } else {
                return '-'
            }
        },
        formatDataTable(data) {
            const monthData = data.thisMonth || {};
            const yearData = data.thisYear || {};
            this.profitabilityTableData = [{
                name: '整车毛利',
                fullYear: (this.formatNum(yearData.carGrossMargin) || '-') + '万元',
                month: (this.formatNum(monthData.carGrossMargin) || '-') + '万元'
            }, {
                name: '整车毛利率',
                fullYear: (this.formatNum(yearData.carGrossProfitRate) || '-') + '%',
                month: (this.formatNum(monthData.carGrossProfitRate) || '-') + '%'
            }, {
                name: '售后毛利',
                fullYear: (this.formatNum(yearData.afterSaleGrossMargin) || '-') + '万元',
                month: (this.formatNum(monthData.afterSaleGrossMargin) || '-') + '万元'
            }, {
                name: '售后毛利率',
                fullYear: (this.formatNum(yearData.afterSaleGrossProfitRate) || '-') + '%',
                month: (this.formatNum(monthData.afterSaleGrossProfitRate) || '-') + '%'
            }, {
                name: '增值毛利',
                fullYear: (this.formatNum(yearData.addValueGrossMargin) || '-') + '万元',
                month: (this.formatNum(monthData.addValueGrossMargin) || '-') + '万元'
            }, {
                name: '增值毛利率',
                fullYear: (this.formatNum(yearData.addValueGrossProfitRate) || '-') + '%',
                month: (this.formatNum(monthData.addValueGrossProfitRate) || '-') + '%'
            }, {
                name: '毛利合计',
                fullYear: (this.formatNum(yearData.totalGrossMargin) || '-') + '万元',
                month: (this.formatNum(monthData.totalGrossMargin) || '-') + '万元'
            }, {
                name: '费用合计',
                fullYear: (this.formatNum(yearData.totalExpense) || '-') + '万元',
                month: (this.formatNum(monthData.totalExpense) || '-') + '万元'
            }, {
                name: '所得税税前润总额',
                fullYear: (this.formatNum(yearData.preTaxTotalGrossMargin) || '-') + '万元',
                month: (this.formatNum(monthData.preTaxTotalGrossMargin) || '-') + '万元'
            }]
            this.profitabilityUpdate.time = monthData.updateTime || ''
            this.profitabilityUpdate.user = monthData.updateUser || ''
        },
        formatNum(num) {
            if (!num) {
                return ''
            } else if (num.indexOf('.') != -1) {
                // console.log(num)
                return Number(num).toFixed(2)
            } else {
                return num
            }
        }
    },
    created() {
        this.dealerId = this.$route.query.dealerId || ''
        if (this.dealerId) {
            this.init()
        } else {
            this.reloadApp()
        }
    },
    filters: {
        formatFunds(value) {
            if (value) {
                return Math.round(value / 10000)
            } else {
                return typeof value === 'number' ? Math.round(value / 10000) : '-'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.funds-info {
    padding-bottom: 50px;

    .label {
        width: 60px;
        height: 24px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 24px;
        color: rgba(178, 185, 200, 1);
        opacity: 1;
        white-space: nowrap;
        // margin-right: 20px;
    }

    .num {
        // max-width: 60%;
        height: 24px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 24px;
        color: rgba(178, 185, 200, 1);
        opacity: 1;
        white-space: nowrap;
        // overflow: hidden;
    }

    .num_black {
        color: #0A1735;
        font-weight: 600;
        margin-right: 6px;
    }

    .proportion {
        color: #0A1735;
        font-weight: 600;
        margin-right: 16px;
    }

    .time {
        background-color: rgba(255, 255, 255, 1);
        margin-bottom: 8px;

        .time_picker {
            height: 34px;
            display: flex;
            justify-content: center;
            align-content: center;
            font-size: 15px;
            font-family: PingFang SC;
            line-height: 34px;
            color: rgba(0, 0, 0, 1);
            opacity: 1;

            .triangle {
                vertical-align: middle;
                width: 9px;
                height: 6px;
                margin: auto 15px auto 8px;
            }

        }
    }

    .fund_credit {

        .credit_content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: rgba(255, 255, 255, 1);

            .card {
                width: calc(50% - 32px);
                height: 46px;
                background: rgba(247, 248, 250, 1);
                opacity: 1;
                border-radius: 4px;
                display: flex;
                flex-flow: column nowrap;
                justify-content: flex-start;
                align-items: flex-start;
                padding: 8px 14px;

            }
        }
    }

    .capital_composition {
        .composition_content {
            padding: 15px 15px 0 15px;
            background-color: rgba(255, 255, 255, 1);

            .composition_title {
                padding-left: 9px;
                height: 24px;
                font-size: 15px;
                font-family: PingFang SC;
                font-weight: 600;
                line-height: 24px;
                color: rgba(0, 0, 0, 1);
                opacity: 1;
            }

            .card_content {
                padding-top: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-flow: row wrap;

                .card {
                    width: calc(50% - 20px);
                    height: 46px;
                    background: rgba(247, 248, 250, 1);
                    opacity: 1;
                    border-radius: 4px;
                    padding: 8px;
                    margin-bottom: 13px;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    overflow: hidden;

                    .line {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;

                    }
                }

                .card_3 {
                    width: calc(33% - 25px);
                    height: 46px;
                    background: rgba(247, 248, 250, 1);
                    opacity: 1;
                    border-radius: 4px;
                    padding: 8px 0 8px 12px;
                    margin-bottom: 13px;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: flex-start;
                    align-items: flex-start;

                    .deadline {
                        color: rgba(10, 23, 53, 1);
                        font-weight: 600;
                        height: 22px;
                        font-size: 13px;
                        font-family: PingFang SC;
                        line-height: 24px;
                        opacity: 1;
                    }

                    .label_3 {
                        height: 24px;
                        font-size: 13px;
                        font-family: PingFang SC;
                        font-weight: 500;
                        line-height: 24px;
                        color: rgba(178, 185, 200, 1);
                        opacity: 1;
                    }
                }

                .card_2 {
                    width: calc(50% - 32px);
                    height: 46px;
                    background: rgba(247, 248, 250, 1);
                    opacity: 1;
                    border-radius: 4px;
                    padding: 8px 14px;
                    margin-bottom: 13px;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: flex-start;
                    align-items: flex-start;
                    overflow: hidden;
                }
            }
        }
    }

    .profitability_table {
        background: #ffffff;
        width: 100%;
        margin: 0;

        .table_header {
            height: 40px;
            background-color: rgba(39, 129, 219, 1);
            display: flex;
            justify-content: flex-start;
            align-content: center;

            .header_cell {
                margin: auto 8px;
                width: calc(33% - 16px);
                min-width: 50px;
                font-size: 14px;
                font-family: PingFang SC;
                font-weight: 400;
                text-align: center;
                line-height: 32px;
                height: 32px;
                opacity: 1;
                padding: 0;
                color: rgba(255, 255, 255, 1);
            }
        }

        .table_content {
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-content: center;

            .data_cell {
                margin: auto 8px;
                width: calc(33% - 16px);
                min-width: 50px;
                height: 32px;
                text-align: center;
                font-size: 12px;
                font-family: PingFang SC;
                font-weight: 400;
                line-height: 32px;
                color: rgba(51, 51, 51, 1);
                opacity: 1;
            }

            &:nth-child(2n + 1) {
                background: rgba(247, 247, 247, 1);
            }

            .first_col {
                margin: auto 0 auto 15px;
                width: calc(33% - 16px);
                min-width: 50px;
                height: 32px;
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                color: rgba(39, 129, 219, 1);
                line-height: 32px;
                opacity: 1;
            }
        }
    }
}
</style>
