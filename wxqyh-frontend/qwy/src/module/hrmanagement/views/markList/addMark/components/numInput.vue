<template>
<div>
    <div class="qwui-numInput">
        <span class="numInput-left_index">{{ userIndex + 1 }}</span>
        <qw-select :EVENT_BUS="EVENT_BUS"
                   :objVal="userObj.flowInfo.type+''"
                   :selectTemplate="selectTemplateDis"
                   class="numInput-minselect"
                   :keyName="'flowInfoType.'+userIndex"
                   v-if="disableSelfSel"
        ></qw-select>
        <qw-select :EVENT_BUS="EVENT_BUS"
                   :objVal="userObj.flowInfo.type+''"
                   :selectTemplate="selectTemplate"
                   class="numInput-minselect"
                   :keyName="'flowInfoType.'+userIndex"
                   v-else
        ></qw-select>
        <span class="numInput-center_label">权重/人</span>
        <span class="numInput-center_group" @mouseover="showControls = true" @mouseout="showControls = false">
            <input class="numInput-input"
                   v-model="msg"
                   @input="handleInput(+$event.target.value)"
                   @blur="handleBlur"
            >
            <i class="numInput-center_group_add" v-show="showControls" @click="magChange(1)"></i>
            <i class="numInput-center_group_reduce" v-show="showControls" @click="magChange(-1)"></i>
        </span>
        <span class="numInput-center_label" style="margin-right: 28px">%</span>
        <div class="numInput-left_group">
            <span class="numInput-left_item" :title="item.personName" v-for="(item,index) in userObj.personList" :key="index" v-show="index < 2">
                <img class="numInput-left_head"
                    v-if="item.headPic && item.headPic!='0'"
                    :src="item.headPic"
                >
                <div v-else class="numInput-left_head_default"></div>
                {{ item.personName }}
            </span>
        </div>
        <span class="numInput-center_label gray" v-if="userObj.personList.length > 2">...等{{ userObj.personList.length }}人</span>
        <span class="numInput-center_label numInput-center_btn" @click="showPick" v-if="userObj.flowInfo.type != 1">{{ userObj.personList.length?'修改':'添加' }}</span>
        <span class="numInput-right_close" @click="deleteUser" v-if="userIndex != 0"></span>
    </div>
    <!-- 选人组件 -->
    <pick-person
        :show="show"
        :defaultUsers="userObj.personList"
        :functionTab="functionTab"
        :maxUser="maxUser"
        @chooseDone="chooseDone"
        @closeThis="closeThis"
    ></pick-person>
</div>

</template>

<script>
import qwSelect from "../../../../components/QWSelect";
import pickPerson from '@/components/pickPerson/pickPerson'
export default {
    name: 'numInput',
    components: {
        qwSelect,
        pickPerson
    },
    props: {
        userObj: {
            type: Object,
            required: true
        },
        userIndex: {
            type: Number,
            required:true
        },
        EVENT_BUS: {
            type: Object,
            required: true
        },
        //已保存的值
        num: {
            type: Number,
            required: false
        },
        disableSelfSel: {
            type: Boolean,
            default: false
        },
        //人数最大限制
        maxUser:{
            type:Number,
            default:1000
        },
        numMap: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            msg: this.userObj.flowInfo.type == 2?(this.userObj.personList.length?this.num / this.userObj.personList.length:0):this.num,
            // 评分人中没有 考核对象本人
            selectTemplate:[
                {
                    name: '考核对象本人',
                    id: '1'
                },
                {
                    name: '指定评分人',
                    id: '2'
                }
            ],
            // 评分人中有 考核对象本人 禁止其他下拉框选择 考核对象本人
            selectTemplateDis:[
                {
                    name: '考核对象本人',
                    id: '1',
                    disabled: true
                },
                {
                    name: '指定评分人',
                    id: '2'
                }
            ],
            // 显示权重输入框的加减按钮
            showControls: false,
            // 选择了考核对象本人，其他禁用考核对象本人选项
            hasSelfAssessment: true,
            // 选人组件
            show:false,
            // 选人组件 tab
            functionTab: [
                {text:'特定人员'},
                {text:'批量导入'},
                {text:'高级筛选'}
            ],
        }
    },
    watch: {
        leaveWeight(newVal) {
            this.numRemain = newVal;
        }
    },
    methods: {
        // 点击删除
        deleteUser() {
            this.EVENT_BUS.$emit('on-delete-user',this.userIndex);
        },
        handleInput(newValue) {
            if(newValue<=0 || isNaN(newValue)){
                this.msg = '';
                newValue = '';
            }else if(newValue>100){
                this.msg = +String(this.msg).slice(0,2);
                newValue = this.msg;
            }
            if(newValue>0){
                this.msg = this.msg;
                newValue = parseFloat(newValue)
            }
            if((newValue+'').indexOf('.') > 0){
                this.msg = +String(this.msg).replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                newValue = this.msg;
            }
            this.EVENT_BUS.$emit('on-input', newValue, this.userIndex);
        },
        magChange(value) {
            this.msg = +this.msg + value;
            if(this.msg <= 0){
                this.msg = 1;
            }else if(this.msg > 100){
                this.msg = 100;
            }
            this.EVENT_BUS.$emit('on-input', this.msg, this.userIndex);
        },
        handleBlur() {
            this.EVENT_BUS.$emit('on-blur');
        },
        // 打开选人组件
        showPick:function () {
            this.show = !this.show
        },
        // 关闭选人组件
        closeThis:function () {
            this.show = false;
        },
        chooseDone:function (dept,tag,user) {
            let itemNum
            if(this.numMap[this.userIndex].personList.length){
                itemNum = +this.numMap[this.userIndex].personList[0].weight
            }else{
                itemNum = this.num
            }
            this.numMap[this.userIndex].personList = user || []


            this.numMap[this.userIndex].personList.forEach((item,index) => {
                this.numMap[this.userIndex].personList[index].weight = itemNum
            })
            this.numMap[this.userIndex].flowInfo.weight = this.numMap[this.userIndex].personList.length * itemNum
            //保存到表单数据
            this.EVENT_BUS.$emit('on-set-form-data', {
              key: 'defaultMarkGroupadd',
              value: this.numMap
            });
            this.userObj.personList=user.slice(0);
            this.show = false;
        },
    }
}
</script>

<style lang="scss" scoped>
@import './numInput'
</style>
