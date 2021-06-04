<template>
    <div>
        <div class="remind_header">
            <div class="remind_item">
                <div class="item_left">提醒类型</div>
                <div class="item_right right_arrow_icon">
                    <select class="remind_select" v-model="remindStatus">
                        <option value="">请选择提醒类型</option>
                        <option value="0">客户联系人提醒</option>
                        <option value="1">客户商机提醒</option>
                        <option value="2">客户拜访提醒</option>
                    </select>
                </div>
            </div>
            <div class="remind_item">
                <div class="item_left">提醒时间</div>
                <div class="item_right">
                    <input class="remind_input"
                        type="text"
                        :value="remindTime"
                        :readonly="true"
                        @click="showTimePicker=!showTimePicker"
                        >
                      <time-picker  :min-year=1918
                                  :max-year=2050
                                  :show.sync="showTimePicker"
                                  :defaultDate="remindTime"
                                  @confirm="change"
                                  >
                                  </time-picker>
                    <!-- <group class="qwui-flexItem">
                        <datetime
                            v-model="remindTime"
                            :clear-text="$t('i18n.today')"
                            format="YYYY-MM-DD HH:mm"
                            :min-year=1918
                            :max-year=2050
                            @on-confirm="change"
                            year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                            :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
                        </datetime>
                    </group> -->
                </div>
            </div>
            <div class="remind_item">
                <div class="item_left">重复提醒</div>
                <div class="item_right right_arrow_icon">
                    <select class="remind_select" v-model="repeatStatus">
                        <option value="0">不重复</option>
                        <option value="1">每天</option>
                        <option value="2">每周</option>
                        <option value="3">每月</option>
                    </select>
                </div>
            </div>
            <div class="remind_item" v-show="repeatStatus !== '0'">
                <div class="item_left">结束重复</div>
                <div class="item_right">
                     <input class="remind_input"
                        type="text"
                        :value="endTime"
                        :readonly="true"
                        placeholder="请输入结束重复提醒的时间"
                        @click="showEndTimePicker=!showEndTimePicker"
                        >
                        <time-picker  :min-year=1918
                            :max-year=2050
                            :show.sync="showEndTimePicker"
                            :defaultDate="endTime"
                            @confirm="endChange"
                             :dateOnly="true"
                            >
                            </time-picker>
                    <!-- <group class="qwui-flexItem">
                        <datetime
                            v-model="endTime"
                            :clear-text="$t('i18n.today')"
                            format="YYYY-MM-DD"
                            :min-year=1918
                            :max-year=2050
                            @on-confirm="endChange"
                            year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                            :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
                        </datetime>
                    </group> -->
                </div>
            </div>
        </div>
        <div class="remind_main">
            <div class="main_title">提醒内容</div>
            <div class="qwui-tape_box">
                <textarea
                    v-model="remindContent"
                    class="item_content"
                    maxLength="200"
                    cols="5"
                    rows="1"
                    placeholder="请输入">
                </textarea>
                <p
                    class="qwui-dialog_textarea_counter"
                    :class="{tip_wran: remindContent.length === 200}"
                    v-show="remindContent"
                >
                    {{remindContent|getLength}}/200
                </p>
            </div>
            <div class="main_title">提醒对象</div>
            <div>
                <div class="remind_object_item">
                    <label for="mine" class="crm_label_box"></label>
                    <div class="check_wrap">
                        <input type="checkbox" id="mine" class="icon_check" v-model="targetArr[0]">
                    </div>
                    <div>
                        <div class="list_item_top ellipsis">本人</div>
                    </div>
                </div>
                <div class="remind_object_item">
                    <label for="incharge" class="crm_label_box"></label>
                    <div class="check_wrap">
                        <input type="checkbox" id="incharge" class="icon_check" v-model="targetArr[1]">
                    </div>
                    <div>
                        <div class="list_item_top ellipsis">负责人</div>
                    </div>
                </div>
                <div class="remind_object_item">
                    <label for="relative" class="crm_label_box"></label>
                    <div class="check_wrap">
                        <input type="checkbox" id="relative" class="icon_check" v-model="targetArr[2]">
                    </div>
                    <div>
                        <div class="list_item_top ellipsis">相关人</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="remind_footer">
            <qwui-button
                v-if="isEdit"
                type="default"
                text="关闭提醒"
                @buttonClick="saveRemind('close')"
            ></qwui-button>
            <qwui-button
                v-if="isEdit"
                type="primary"
                text="立即提交"
                @buttonClick="saveRemind"
            ></qwui-button>
            <qwui-button
                v-if="!isEdit"
                type="primary"
                text="保存"
                @buttonClick="saveRemind"
            ></qwui-button>
        </div>

    </div>
</template>
<script>
import datetime from 'vux/src/components/datetime';
import group from 'vux/src/components/group';
import QwuiButton from '@/components/base/button/button';
import { getRemindData, saveRemindData } from '../../../api/client/getData';
  import TimePicker from '@/components/basicUI/qwuiPicker/time_picker.vue'
export default {
    name: 'ClientRemind',
    components: {
        datetime,
        group,
        QwuiButton,
        TimePicker
    },
    data () {
        return {
            remindTime: '',  // 提醒时间
            endTime: '',  // 结束重复时间
            remindStatus: '',   // 提醒状态
            repeatStatus: '0',  // 重复提醒类型
            remindContent: '',  // 提醒内容
            isEdit: false,  // 是否编辑
            targetArr: [false, false, false],
            targetType: '',
            params: {
                'userId': '',
                'tbReminderTaskPO.id': '',
                'tbReminderTaskPO.agentCode': 'crm',
                'tbReminderTaskPO.taskType': 'crmsendMsg',
                'tbReminderTaskPO.foreighId': this.$route.query.clientId || '',
                'tbReminderTaskPO.remindType': '',
                'tbReminderTaskPO.remindTime': '',
                'tbReminderTaskPO.remindCycle': '',
                'tbReminderTaskPO.endTime': '',
                'tbReminderTaskPO.content': '',
                'tbReminderTaskPO.targetType': '',
                'tbReminderTaskPO.runStatus': 1
            },
            showTimePicker:false,
            showEndTimePicker:false
        }
    },
    filters: {
        // 获取textarea的value长度
        getLength(value) {
            return value? value.length: '';
        }
    },
    watch: {
        targetArr (newVal) {
            let arr = [];
            newVal.map((item,idx) => {
                if(item){
                    arr.push(idx + 1);
                }
            });
            this.targetType = arr.length > 0? arr.join(',') : '';
        }
    },
    created () {
        this.init();
    },
    methods: {
        // 初始化
        init () {
            this.initRemindTime();
            this.getRemindData();
        },

        // 改变提醒时间
        change (val) {
            this.remindTime = val;
        },

        // 改变结束重复时间
        endChange (val) {
            this.endTime = val;
        },

        // 保存提醒
        saveRemind (type) {
            // 是否通过检验
            let isPass = type !== 'close'? this.validData() : true;

            if(!isPass) return;

            this.params['tbReminderTaskPO.runStatus'] = type === 'close'? '0' : '1';
            this.params['tbReminderTaskPO.remindType'] = this.remindStatus;
            this.params['tbReminderTaskPO.remindTime'] = `${this.remindTime}:00`;
            this.params['tbReminderTaskPO.remindCycle'] = this.repeatStatus;
            // this.params['tbReminderTaskPO.endTime'] = this.endTime === '请输入结束重复提醒的时间'? '' : `${this.endTime}:00`;
            this.params['tbReminderTaskPO.endTime'] = this.repeatStatus==0?'':this.endTime;
            this.params['tbReminderTaskPO.content'] = this.remindContent;
            this.params['tbReminderTaskPO.targetType'] = this.targetType;

            saveRemindData(this.params).then(res => {
                if(res.code == '0'){
                    this.$router.replace({path: '/ClientDetails/ClientContent', query: {
                        id: this.$route.query.clientId,
                        isClient: '0'
                    }})
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 获取提醒设置数据
        getRemindData () {
            let obj = {
                id: this.$route.query.clientId || '',
                agentCode: 'crm'
            }
            getRemindData(obj).then(res => {
                if(res.code == '0'){
                    let data = res.data.tbReminderTaskPO;
                    if(data){
                        let arr = '';
                        this.isEdit = true;
                        this.params['tbReminderTaskPO.id'] = data.id;
                        this.repeatStatus = data.remindCycle;
                        this.remindTime = data.remindTime;
                        this.remindStatus = data.remindType;
                        // this.endTime = data.endTime || '请输入结束重复提醒的时间';
                        this.endTime = data.endTime ;
                        this.remindContent = data.content;

                        arr = data.targetType.split(',');
                        arr.map(item => {
                            this.$set(this.targetArr, item - 1, true);
                        });
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },

        // 初始化提醒时间
        initRemindTime () {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            let hh = now.getHours();
            this.remindTime = `${year}-${month}-${day} ${hh}:00`;
        },

        // 校验数据
        validData () {
            // 判断提醒类型是否为空
            if(!this.remindStatus){
                _.alert('提示', '请选择提醒类型');
                return false;
            }

            // 判断提醒时间是否大于当前时间
            let now = new Date().getTime();
            let date = new Date(this.remindTime).getTime();
            if(date < now){
                _.alert('提示', '提醒时间不能小于当前时间');
                return false;
            }

            // 判断结束重复时间是否小于提醒时间
            if(this.repeatStatus != '0'){
                // if(this.endTime !== '请输入结束重复提醒的时间'){
                if(this.endTime){
                    let closeRepeatTime = new Date(this.endTime).getTime();
                    if(closeRepeatTime < date){
                        _.alert('提示', '结束重复只能是今天以后的时间');
                        return false;
                    }
                }
                else{
                    _.alert('提示', '结束重复只能是今天以后的时间');
                    return false;
                }
            }

            // 提醒内容不能为空
            if(!this.remindContent){
                _.alert('提示', '请填写提醒内容');
                return false;
            }

            // 提醒对象不能为空
            if(!this.targetType){
                _.alert('提示', '请填写提醒对象');
                return false;
            }

            return true;
        }
    }
}
</script>
<style lang="scss" scoped>
@import './ClientRemind.scss';
</style>


