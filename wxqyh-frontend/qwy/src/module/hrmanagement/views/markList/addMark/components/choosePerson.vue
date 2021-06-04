<template>
<div class="qwui-markPerson">
    <div class="markPerson_list">
        <div class="list_header">权重总和：<span class="orange">{{ numRemain }}%</span></div>
        <div class="list_content">
            <num-input
                :EVENT_BUS="EVENT_BUS"
                v-for="(item,index) in defaultUsers"
                :key="(index+'')+'.'+(defaultUsers.length+'')+'.'+(numRemain+'')"
                :userObj="item"
                :userIndex="index"
                :num="+(item.flowInfo.weight?item.flowInfo.weight:0)"
                :disableSelfSel="selfSelType[index]"
                :numMap="numMap"
            ></num-input>
            <span class="list_content_add" @click="addPerson">添加下一评分人</span>
        </div>
        <div class="list_footer">
            <qwuiSwitch slot="switch" :defaultStatus="isOrder" @change="changeOrderStatus"></qwuiSwitch>
            流程评分<span class="gray">（开启后评分人按自上而下流程评分，关闭则按无流程评分）</span>
        </div>
    </div>
</div>
</template>

<script>
import numInput from './numInput'

import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch'
export default {
    name: 'choosePerson',
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        keyName: {
            type: String,
            required: false
        },
        objVal: {
            type: Array,
            required: false
        },
        leaveWeight: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: Number,
            required: true
        },
        disableSelfSel: {
            type: Array,
            required: true
        },
    },
    components: {
        numInput,
        qwuiSwitch
    },
    data() {
        return {
            numRemain: this.leaveWeight,
            defaultUsers:this.objVal,
            // 新评分人列表
            numMap: [],
            // 无序评分
            isOrder: this.orderStatus == '1' ? true : false,
            // 是否禁用 考核本人评分 选项
            selfSelType: this.disableSelfSel,
        }
    },
    watch: {
        objVal: {
            handler: function(value) {
                value.forEach((item,index) => {
                    // 每行数据的总权重
                    let itemAllWeight = 0
                    let tempPersonList = []
                    if (item.flowInfo.type == 1){
                        itemAllWeight += +item.flowInfo.weight
                    }else{
                        item.personList.forEach((pItem, pIndex) => {
                            tempPersonList.splice(pIndex, 1, {'groupId': pItem.groupId,'userId': pItem.userId,'weight': pItem.weight})
                            itemAllWeight += +pItem.weight
                        })
                    }
                    this.numMap.splice(index, 1 , {'flowInfo': {'weight': itemAllWeight, 'flowOrder': index + 1, 'type': item.flowInfo.type}, 'personList': tempPersonList})
                });
                // 获取数据中 选择了考核对象本人 的下标
                let selfSelIndex = value.findIndex((item)=>{ return item.flowInfo.type == 1})
                if (selfSelIndex >= 0) {
                    this.selfSelType = new Array(value.length).fill(true)
                    this.selfSelType.splice(selfSelIndex,1,false)
                }else{
                    this.selfSelType = new Array(value.length).fill(false)
                }
                
                this.EVENT_BUS.$emit('on-set-form-data', {
                    key: this.keyName,
                    value: this.numMap
                });
                // 改变 评分人类型 时修改select禁用规则
                this.EVENT_BUS.$emit('on-set-select-data', {
                    key: 'flowInfoType',
                    value: this.selfSelType
                });
                //计算剩余的权重
                this.computPower();
                //校验权重是否分配合理
                this.validate();
            },
            deep: true
        },
        // 无序评分
        orderStatus: {
            handler: function(value) {
                this.isOrder = value == '1' ? true : false
            },
            deep: true
        },
        leaveWeight(newVal) {
            this.numRemain = newVal;
        }
    },
    created() {
        //计算剩余的权重
        this.EVENT_BUS.$on('on-input', (NewValue, index) => {
            // 如果是考核对象本人，则填写的权重为总权重/如果是指定评分人，则为填写权重*选择人数
            this.numMap[index].flowInfo.weight =
                this.numMap[index].flowInfo.type == 1 ? NewValue : (this.numMap[index].personList.length ? this.numMap[index].personList.length * NewValue : NewValue)
            this.numMap[index].personList.forEach((pItem,pIndex)=>{
                this.numMap[index].personList[pIndex].weight = NewValue
            })
            //计算剩余的权重
            this.computPower();
            //校验权重是否分配合理
            this.validate();
            this.EVENT_BUS.$emit('on-set-form-data', {
                key: this.keyName,
                value: this.numMap
            });
            // copyDefaultMarkGroup权重赋值
            this.EVENT_BUS.$emit('on-set-input-data', this.numMap);
            this.EVENT_BUS.$emit('on-set-leave-weight',this.numRemain);
        });
        
        // 删除人员
        this.EVENT_BUS.$on('on-delete-user', index => {
            this.numMap.splice(index,1);
            this.numMap.forEach((item, index) => {
                this.numMap[index].flowInfo.flowOrder = index + 1
            })
            //计算剩余的权重
            this.computPower();
            this.defaultUsers.splice(index,1);
            // 删除成员，修改flowOrder的值  flowOrder：每行评分人的下标
            this.defaultUsers.forEach((item, index) => {
                this.defaultUsers[index].flowInfo.flowOrder = index + 1
            })
            //校验权重是否分配合理
            this.validate();
            this.EVENT_BUS.$emit('on-set-form-data', {
                key: this.keyName,
                value: this.numMap
            });
            this.EVENT_BUS.$emit('on-set-leave-weight',this.numRemain);
        });
        //每个input框失焦都要校验
        this.EVENT_BUS.$on('on-blur', () => {
            this.validate();
        })
        // 添加成员

    },
    mounted() {
        this.$props.EVENT_BUS.$emit('on-form-item-add', this);
    },
    beforeDestroy () {
        this.$props.EVENT_BUS.$emit('on-form-item-remove', this);
    },
    methods: {
        //计算剩余的权重
        computPower() {
            let num = 0;
            this.numMap.forEach((item,index) => {
                if (item.flowInfo.type == 1) {
                    num += (+item.flowInfo.weight)
                }else{
                    item.personList.forEach((item,index)=>{
                        num += +item.weight
                    })
                }
            });
            this.numRemain = num.toFixed(2);
        },
        validate() {
            return new Promise((resolve, reject) => {
                if(this.defaultUsers.length == 0){
                    this.EVENT_BUS.$emit('on-show-errror-tip','评分人不能为空');
                    resolve({
                        title: this.keyName,
                        status: false
                    })
                }else if(this.numRemain > 100){
                    this.EVENT_BUS.$emit('on-show-errror-tip','评分权重累计不能超过100%');
                    resolve({
                        title: this.keyName,
                        status: false
                    })
                }else if(this.numRemain === 100){
                    //判断权重为100时，是否还有未分配的人员
                    //是否存在“剩余权重为0%，无法分配到其他评分人”的问题
                    let flag = false;
                    this.numMap.forEach((value, index) => {
                        if (value.flowInfo.type == '2') {
                            /* if(value.flowInfo.weight == ''){
                                flag = true;
                                this.EVENT_BUS.$emit('on-show-errror-tip','剩余权重为0%，无法分配到其他评分人');
                                resolve({
                                    title: this.keyName,
                                    status: false
                                })
                                return false;
                            } */
                            if(value.personList.length == 0){
                                flag = true;
                                this.EVENT_BUS.$emit('on-show-errror-tip','评分人不能为空');
                                resolve({
                                    title: this.keyName,
                                    status: false
                                })
                                return false;
                            }
                        }
                    });
                    if(!flag){
                        this.EVENT_BUS.$emit('on-show-errror-tip','');
                            resolve({
                                title: this.keyName,
                                status: true
                            })
                    }
                }else if(this.numRemain < 100){
                    //判断权重小于100时，是否所有的人员都分配了
                    //是否存在未分配人员
                    /* this.numMap.forEach((value, index) => {
                        if(value.flowInfo.type != 1){
                            if(value.flowInfo.weight == ''){
                                //只要存在一个未分配权重的人员，就为true
                                this.EVENT_BUS.$emit('on-show-errror-tip','权重不能为空');
                                resolve({
                                    title: this.keyName,
                                    status: false
                                })
                                return false;
                            }
                        }
                    }); */
                    //剩余权重小于100，但是所选人员的权重都已经分配完毕
                    this.EVENT_BUS.$emit('on-show-errror-tip','已分配权重不满100%');
                    resolve({
                        title: this.keyName,
                        status: false
                    })
                    
                }else {
                    this.EVENT_BUS.$emit('on-show-errror-tip','');
                    resolve({
                        title: this.keyName,
                        status: true
                    })
                }
            });
        },
        // 添加评分人
        addPerson(){
            this.numMap.push({'flowInfo': {'weight': 0, 'flowOrder': this.numMap.length + 1, 'type': '2'}, 'personList': []})
            this.EVENT_BUS.$emit('on-set-form-data', {
              key: 'defaultMarkGroup',
              value: this.numMap
            });
            this.EVENT_BUS.$emit('on-add-person', this.numMap);
        },
        // 无序评分
        changeOrderStatus(status){
            this.isOrder = status
            this.$props.EVENT_BUS.$emit('on-change-order-status', status);
        }
    }
}
</script>

<style lang="scss" scoped>
@import './choosePerson'
</style>
