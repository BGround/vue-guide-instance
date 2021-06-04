<template>
    <div class="date">
        <label class="label" v-if="field.label">{{ field.label }}</label>
        <div class="origin" v-if="originShow" >
            <date-time
                v-model="startTime"
                class="item"
                :end-date="resetLimitEndDate"
                :clear-text="$t('i18n.clear')"
                @on-clear="clearStartTime"
                :format="field.format"
                @on-change="startTimeChange()"
                :year-row="`{value} ${$t('i18n.year')}`" :month-row="`{value} ${$t('i18n.month')}`" :day-row="`{value} ${$t('i18n.days')}`"
                :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
                <span :class="startTime ? '' : 'default'">{{startTime ? startTime : (fromPlaceholder || $t('i18n.pleaseSelect'))}}</span>
            </date-time>
            <span class="blank">
                <div class="line"></div>
            </span>
            <date-time
                v-model="endTime"
                class="item"
                :start-date="resetLimitStartDate"
                :clear-text="$t('i18n.clear')"
                @on-clear="clearEndTime"
                :format="field.format"
                @on-change="endTimeChange()"
                :year-row="`{value}${$t('i18n.year')}`" :month-row="`{value} ${$t('i18n.month')}`" :day-row="`{value} ${$t('i18n.days')}`"
                :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
                <span :class="endTime ? '' : 'default'">{{endTime ? endTime : (toPlaceholder || $t('i18n.pleaseSelect'))}}</span>
            </date-time>
        </div>
        <div class="diy" v-if="!originShow">
            <span class="item"
                :class="startTime ? '' : 'default'"
                @click="showPicker('startTime')">{{startTime ? startTime : (fromPlaceholder || $t('i18n.pleaseSelect'))}}</span>
            <span class="blank">
                <div class="line"></div>
            </span>
            <span class="item"
                :class="endTime ? '' : 'default'"
                @click="showPicker('endTime')">{{endTime ? endTime : (toPlaceholder || $t('i18n.pleaseSelect'))}}</span>
            <time-picker
                :data="field.dateValue"
                ref="startTime"
                @select="handleSelect(arguments, 'startTime')"
                :selected-index="startSelectedArr.length > 0 ? startSelectedArr : field.default"
                :cancel-txt="$t('i18n.cancel')" :confirm-txt="$t('i18n.sure')"></time-picker>
            <time-picker
                :data="field.dateValue"
                ref="endTime"
                @select="handleSelect(arguments, 'endTime')"
                :selected-index="endSelectArr.length > 0 ? endSelectArr : field.default"
                :cancel-txt="$t('i18n.cancel')" :confirm-txt="$t('i18n.sure')"></time-picker>
        </div>
    </div>
</template>

<script>
import dateTime from 'vux/src/components/datetime';
import * as timeUtil from '../../../assets/js/time-util';
import timePicker from '@/components/picker/index'

export default {
    name: 'dateField',
    components: {
        dateTime,
        timePicker
    },
    props: {
        searchValue: Object,
        setting: Array,
        field: Object
    },
    data() {
        return {
            startKey: this.field.key[0],
            endKey: this.field.key[1],
            startTime: '',
            endTime: '',
            resetLimitStartDate: '',
            resetLimitEndDate: '',
            startSelectedArr: [],
            endSelectArr: []
        }
    },
    computed: {
        originShow() {
            return this.field.dateType == 'DIY' ? false : true;
        },
        fromPlaceholder() {
            if(this.field.placeholder) {
                return this.field.placeholder.from;
            } else {
                return ''
            }
        },
        toPlaceholder() {
            if(this.field.placeholder) {
                return this.field.placeholder.to;
            } else {
                return ''
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if(!this.searchValue[this.startKey]) {
                return
            }

            let startTime = '', // 显示的字符串
                endTime = '';

            if(this.field.dateType == 'DIY') {
                let startArr = this.searchValue[this.startKey].split('-'), // searchValue按'-'分隔以后的数组
                    endArr = this.searchValue[this.endKey].split('-'),
                    startSelectedArr = [], // 选中的数组
                    endSelectArr = [];

                this.field.dateValue.forEach((item, index) => {
                    item.forEach((itm, indx) => {
                        if(startArr[index] == itm.value) {
                            startTime += itm.text;
                            startSelectedArr.push(indx)
                        }
                        if(endArr[index] == itm.value) {
                            endTime += itm.text;
                            endSelectArr.push(indx)
                        }
                    })
                })
                this.startSelectedArr = startSelectedArr;
                this.endSelectArr = endSelectArr;
            } else {
                startTime = this.searchValue[this.startKey];
                endTime = this.searchValue[this.endKey];
            }
            this.startTime = startTime;
            this.endTime = endTime;
        },
        startTimeChange() {
            this.searchValue[this.startKey] = this.startTime;
            if(this.field.callBack) {
                this.field.callBack.start();
            }
        },
        endTimeChange() {
            this.searchValue[this.endKey] = this.endTime;
            if(this.field.callBack) {
                this.field.callBack.end();
            }
        },
        clearStartTime () {
            this.startTime = '';
        },
        clearEndTime () {
            this.endTime = '';
        },
        reset() {
            this.startTime = "";
            this.endTime = "";
            this.resetLimitDate = "";
        },
        showPicker(type) {
            this.$refs[type].show();
        },
        handleSelect(args, type) {
            let time = '',
                searchValue = '',
                dateValue = this.field.dateValue;

            for(let i = 0; i < dateValue.length; i++) {
                time += args[2][i];
                searchValue += dateValue[i][args[1][i]].value;
                if(i != dateValue.length - 1) {
                    searchValue += '-';
                }
            }
            switch(type) {
                case 'startTime': this.startTime = time;
                                  this.searchValue[this.startKey] = searchValue;
                                  break;
                case 'endTime': this.endTime = time;
                                this.searchValue[this.endKey] = searchValue;
                                break;
            }
        }
    },
    watch: {
        startTime(val) {
            this.resetLimitStartDate = val.substring(0,10);
        },
        endTime(val) {
            this.resetLimitEndDate = val.substring(0,10);
        },
        searchValue: {
            handler(val) {
                if(!val[this.startKey] && !val[this.endKey]) {
                    this.reset();
                }
                if(val[this.startKey] != this.startTime || val[this.endKey] != this.endTime) {

                    this.init();
                }
            },
            deep: true
        }

    }
}
</script>

<style scoped>
.date .label {
    display: block;
    padding: 10px 0;
    color: #1B233A;
    font-size: 13px;
}
.origin, .diy{
    display: flex;
}
.date .item {
    flex: 4;
    height: 34px;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid #E4E5E9;
    line-height: 34px;
    border-radius: 2px;
    font-size: 13px;
    color: #666666;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
}
.date .blank {
    position: relative;
    display: inline-block;
    width: 35px;
    line-height: 34px;
    text-align: center;
}
.date .blank .line {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 19px;
    height: 1px;
    background-color: #E4E5E9;
    transform: translate(-50%, -50%);
}
.date .default {
    color: #bbb;
}
</style>
