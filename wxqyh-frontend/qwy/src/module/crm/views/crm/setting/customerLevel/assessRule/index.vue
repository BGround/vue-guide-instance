<template>
    <func-box v-if="isShow" boxTitle="评定规则" boxWidth=850 @firstFunc="finish" firstBtn='完成' secondBtn='' @closeBox="toggleDialog" :footerSpaceBetween="true" >
        <div class="wrap">
            <!-- quotaFormArr 每个指标都对应自quotaFormArr里的每一项（quotaItem） -->
            <qwForm
                v-for="(quotaItem,quotaIndex) in quotaFormArr"
                :key="quotaIndex"
                class="quota-block"
                :class="{ 'quota-block-boreder': quotaIndex != quotaFormArr.length - 1 }"
                :model="quotaItem"
                label-width="120"
                width="650"
                ref="ruleForm">
                <!-- 指标 -->
                <qwFormItem label="指标">
                    <qwuiInput class="form-input" inputType="base" v-model="quotaItem.name" ></qwuiInput>
                </qwFormItem>

                <!-- 权重 -->
                <qwFormItem label="权重">
                    <qwuiInput class="form-input" inputType="sort" v-model="quotaItem.weight" ></qwuiInput>
                    <span class="label-after-input">%</span>
                </qwFormItem>

                <!-- 指标来源 -->
                <qwFormItem label="指标来源">
                    <!-- 增加 指标来源 时，如果不是第一个 指标来源 那么添加一个 margin-top：10px 的样式 -->
                    <div :class="{ 'mt10': sourceIndex != 0 }" v-for="(sourceItem,sourceIndex) in quotaItem.indexFactors" :key="sourceIndex">
                        <qwui-select class="form-input" :dataList="dataFormat.quotaSourceData" v-model="sourceItem.type" @selectItem="sourceSelect(arguments,quotaIndex,sourceIndex)" ></qwui-select>
                        <!-- 自定义字段 - 下拉 -->
                        <qwui-select class="form-input" :dataList="dataFormat.fieldSelectData" v-model="sourceItem.fieldId"  @selectItem="fieldSelect(arguments,quotaIndex)" v-show="sourceItem.type === 'clientCustomFieldOption'" ></qwui-select>
                        <!-- 自定义字段 - 数值 -->
                        <qwui-select class="form-input" :dataList="dataFormat.fieldNumberData" v-model="sourceItem.fieldNumber" @selectItem="fieldNumberSelect(arguments,quotaIndex,sourceIndex)" v-show="sourceItem.type === 'clientCustomFieldNumber'" ></qwui-select>
                        <!-- 删除 图标只有在 指标来源 的数量不为 1 时才显示 -->
                        <i class="icon-delete" v-if="quotaItem.indexFactors.length > 1" @click="deleteItem(quotaItem.indexFactors,sourceIndex)" ></i>
                        <!-- 增加指标来源 -->
                        <div>
                            <span class="orange-font-btn mt10" @click="addAccessSource(quotaItem.indexFactors)"  v-if="sourceIndex === quotaItem.indexFactors.length -1 && sourceItem.type !== 'clientCustomFieldOption'" >添加指标来源</span>
                        </div>
                    </div>
                </qwFormItem>

                <!-- 计算公式 -->
                <qwFormItem label="当前计算方式">
                    <div class="calculator">
                        <span class="expression" :title="`${quotaItem.name} = ${transferExpression(quotaItem.calFormulas)}`">
                            {{quotaItem.name}}
                            <span v-if="quotaItem.name"> = </span>
                            <span v-if="quotaItem.indexFactors[0].type !== 'clientCustomFieldOption'">{{transferExpression(quotaItem.calFormulas)}}</span>
                            <span v-if="quotaItem.indexFactors[0].type === 'clientCustomFieldOption'">{{quotaItem.indexFactors[0].name}}</span>
                        </span>
                        <!-- 打开 配置计算公式 弹框 ( 指标来源 非 自定义字段-下拉类型 才可配置 )-->
                        <span class="setExpression" @click="setExpression(quotaIndex)"  v-if="quotaItem.indexFactors[0].type !== 'clientCustomFieldOption'" >配置计算公式</span>
                    </div>
                </qwFormItem>

                <!-- 区间 -->
                <qwFormItem label="区间">
                    <div :class="{ 'mt10': rangrIndex != 0 }" v-for="(rangeItem,rangrIndex) in quotaItem.indexValues" :key="rangrIndex">

                        <!-- 区间（指标来源：自定义下拉类型） -->
                        <span class="field-name-block" v-show="quotaItem.indexFactors[0].type === 'clientCustomFieldOption'">
                            {{rangeItem.name}}
                        </span>

                        <!-- 区间（指标来源：非自定义下拉类型） -->
                        <span v-show="quotaItem.indexFactors[0].type !== 'clientCustomFieldOption'">
                            <!-- 添加区间 规则： 第一个区间和评分 不可被删除，并且只需输入 最小值 ，其他区间可删除需要输入 最小值 和 最大值 -->
                            <qwuiInput class="form-range" inputType="sort" v-model="rangeItem.minVal" ></qwuiInput>
                            <!-- 非第一个区间，最大值最小值间有一条 横杠  -->
                            <span class="label-after-input label-before-input">-</span>
                            <!-- 非第一个区间，才会显示 最大值 输入框 -->
                            <qwuiInput class="form-range" inputType="sort" v-model="rangeItem.maxVal" ></qwuiInput>
                        </span>
                        <!-- 评分下拉框 -->
                        <span class="access-block">
                            <span class="label-before-input" v-if="rangrIndex == 0">评分</span>
                            <qwui-select class="form-access-select" :dataList="dataFormat.accessData" v-model="rangeItem.gradeVal" ></qwui-select>                            
                            <!-- 非第一个区间才显示删除按钮 -->
                            <i class="icon-delete" v-if="quotaItem.indexValues.length > 1" @click="deleteItem(quotaItem.indexValues,rangrIndex)"></i>
                        </span>

                        <!-- 添加区间 -->
                        <div>
                            <span class="orange-font-btn mt10" @click="addRange(quotaItem.indexValues,rangrIndex)"  v-if="quotaItem.indexFactors[0].type !== 'clientCustomFieldOption' && rangrIndex === quotaItem.indexValues.length -1">添加区间</span>
                        </div>
                    </div>
                </qwFormItem>

                <!-- 删除 指标 -->
                <i class="icon-rubbish-bin" title="删除该指标" @click="deleteItem(quotaFormArr,quotaIndex)" v-if="quotaFormArr.length != 1"></i>

            </qwForm>
        </div>
        <template slot="footer">
            <div class="footer-btn-block" @click="addQuota">
                <i class="icon-add-quota"></i>
                <span class="add-btn-quota">
                    增加指标
                </span>
            </div>
        </template>
        <!-- 计算公式弹框 -->
        <calculator @finish="calculateFinish" ref="calculator"></calculator>
    </func-box>
</template>

<script>
import funcBox from '@/components/list/funcBox';
import qwForm from '@/components/form/form';
import qwFormItem from '@/components/form/formItem';
import qwuiInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import qwuiSelect from "@/components/qwuiBase/qwuiSelect/QwSelect";
import qwuiButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import calculator from './../calculator';
import { getCustomFieldSpecial,validClientGradeIndexData } from "@/module/crm/api/setting";

export default {
    components: {
        funcBox,
        qwForm,
        qwFormItem,
        qwuiInput,
        qwuiSelect,
        qwuiButton,
        calculator
    },
    data(){
        // 区间 数据模板，用于 添加区间 以及 评定规则页面初始化
        const rangetemplat = {
            //最小值区间，整数，最小0.00
            minVal: "",
            //最大值区间，整数，最大99,999,999.99
            maxVal: "",
            //如果存在自定义-下拉，此存放下拉项的名称
            name: "" ,
            //如果存在自定义-下拉，此存放下拉项id
            optionId: "",
            //评分值 0.0~1.0
            gradeVal: "",
        };
        // 指标来源 数据模板，用于 添加指标来源 以及 评定规则页面初始化
        const accessSource = { type: "" ,fieldId: "" , fieldNumber: "", name: ""};

        return {
            dataBase,
            // 是否显示该弹框
            isShow: false,
            // “评定规则”表单所有数据都存放在此数组
            quotaFormArr: [],
            // 指标来源、区间 的数据格式 该对象的数据格式仅作为 初始化、添加时的模板（初始化和添加时会进行深克隆），与后台交互的数据格式有变时，在此修改即可
            dataFormat: {
                // 指标
                quota: {
                    // 指标名 字符串 最长8位
                    name: "",
                    //"权重 整数 0~100 ",
                    weight: "",
                    indexFactors: [accessSource],
                    //计算公式 符号加type嵌套表示（数组）
                    calFormulas: [],
                    indexValues: [rangetemplat] // 区间
                },

                // 指标来源 添加指标来源时使用的模板
                accessSource: accessSource,
                // 区间 添加区间时使用的模板
                range: rangetemplat,
                // 指标来源 下拉框数据 商机销售额、合同金额、商机单数、合同单数、已回款合同数、(n)客户-自定义字段-下拉类型、(n)客户-自定义字段-数值类型
                quotaSourceData: [
                    {optionName: "商机销售额", val: "businessAmount" },{optionName: "合同金额", val: "contractAmout" },{optionName: "商机单数", val: "businessCount" },{optionName: "合同单数", val: "contractCount" },
                    {optionName: "已回款合同数", val: "contractReceiveCount" },{optionName: "客户-自定义字段-下拉类型", val: "clientCustomFieldOption" },{optionName: "客户-自定义字段-数值类型", val: "clientCustomFieldNumber" },
                ],
                // 区间 评分 下拉框数据
                accessData: [{ val: '1.0',optionName: '100' },{ val: '0.9',optionName: '90' },{ val: '0.8',optionName: '80' },{ val: '0.7',optionName: '70' },{ val: '0.6',optionName: '60' },
                { val: '0.5',optionName: '50' },{ val: '0.4',optionName: '40' },{ val: '0.3',optionName: '30' },{ val: '0.2',optionName: '20' },{ val: '0.1',optionName: '10' },{ val: '0.0' , optionName: '0', }],
                // 自定义字段 下拉选择框 数据
                fieldSelectData: [],
                // 自定义字段 下拉选择框 - id（键）：下拉选择项（值）
                fieldSelectKeyAndList: {},
                // 自定义字段 数值类型 数据
                fieldNumberData: [],
            },
        }
    },
    created(){
        this.addQuota();
        // 获取自定义字段-下拉框类型、数值类型
        this.getCustomFieldSpecial();
    },
    methods: {
        // 保存 按钮
        finish(){
            let { alert:_alert, top_alert } = this.dataBase;
            this.validClientGradeIndexData(this.formatDataBeforeFinish(this.quotaFormArr))
            .then(()=>{
                this.$emit("finish",this.quotaFormArr);
                this.toggleDialog();
            })
            .catch((res)=>{
                top_alert(res,false,3000);
            });

        },
        // 打开/关闭 评定规则
        toggleDialog(data){
            this.isShow = !this.isShow;
            // 如果打开评定规则时带了评定规则的表单数据（编辑回显时），将表单data存入quotaFormArr数组中初始化
            if( this.isShow && data.length != 0 ){
                this.quotaFormArr = this.deepClone(data)
            }
        },
        // 增加指标
        addQuota(){
            let { alert:_alert, top_alert } = this.dataBase;
            // 指标个数 <=8 1
            if( this.quotaFormArr.length > 7 ){
                top_alert('指标个数不可超过8个',false,2000);
                return false;
            }
            this.quotaFormArr.push(this.deepClone(this.dataFormat.quota));
        },
        // 增加指标来源
        addAccessSource(sourceArr){
            sourceArr.push(this.deepClone(this.dataFormat.accessSource));
        },
        // 添加区间
        addRange(sourceArr,index){
            let { alert:_alert, top_alert } = this.dataBase;
            // 区间不能超过10个
            if( index > 8 ){
                top_alert('最多添加10个区间',false,2000);
                return false;
            }
            sourceArr.push(this.deepClone(this.dataFormat.range));
        },
        // 删除新增项
        deleteItem(sourceArr,index){
            sourceArr.splice(index,1);
        },
        // 打开 计算规则设置页面
        setExpression(quotaIndex){
            let { alert:_alert, top_alert } = this.dataBase;
            if( !this.quotaFormArr[quotaIndex].name ){
                top_alert('请先填写指标名称与指标来源',false,3000);
                return;
            }
            this.$refs.calculator.toggleDialog(this.deepClone(this.quotaFormArr[quotaIndex]),quotaIndex);
        },
        // 指标来源 选择框回调函数
        sourceSelect(){
            let { alert:_alert, top_alert } = this.dataBase;
            // arguments[0] : [optionName,optionValue]
            let optionName = arguments[0][0];
            let optionValue = arguments[0][1];
            let quotaIndex = arguments[1];
            let sourceIndex = arguments[2];
            // 获取区间长度
            let indexValuesLength = this.quotaFormArr[quotaIndex].indexValues.length;
            if( optionValue === 'clientCustomFieldOption' ){
                // 指标来源 - 自定义字段-下拉类型

                // 如果 指标来源-数组 的长度大于1个,并且选择了 自定义字段-下拉类型 , 提示用户 "下拉类型的字段只能单独作为一个指标",并且置空此次选择 (因为下拉类型在一个指标里必须作为唯一的指标来源,不可与其他指标来源同在)
                let indexFactorsLength = this.quotaFormArr[quotaIndex].indexFactors.length;
                if( indexFactorsLength > 1 ){
                    top_alert('下拉类型的字段只能单独作为一个指标',false,3000);
                    this.$nextTick(()=>{
                        // 置空此次选择
                        this.quotaFormArr[quotaIndex].indexFactors[sourceIndex].type = "";
                    })
                }else{
                    // 清除 区间 数组
                    this.quotaFormArr[quotaIndex].indexValues.splice(0,indexValuesLength);
                    // 清空自定义字段下拉框的选中值
                    this.quotaFormArr[quotaIndex].indexFactors[0].fieldId = "";
                }
            }else{
                // 指标来源 - 非 自定义字段-下拉类型

                // 检查 计算规则结果的数组中 是否是 自定义字段-下拉 类型，如果是的话 清空之
                if( this.quotaFormArr[quotaIndex].calFormulas.length != 0 ){
                    this.quotaFormArr[quotaIndex].calFormulas[0].type === 'clientCustomFieldOption' ? this.quotaFormArr[quotaIndex].calFormulas.splice(0,this.quotaFormArr[quotaIndex].calFormulas.length) : "";
                    // 清除 区间 数组
                    this.quotaFormArr[quotaIndex].indexValues.splice(0,indexValuesLength);
                    // 清空自定义字段下拉框的选中值
                    this.quotaFormArr[quotaIndex].indexFactors[0].fieldId = "";
                    // 添加 一个区间
                    this.addRange(this.quotaFormArr[quotaIndex].indexValues);
                }

                // 如果选择了 自定义字段-数值类型 ，将fieldNumber字段置空(该字段用于存储 数值类型 下拉框的值)
                optionValue != 'clientCustomFieldNumber' ? this.quotaFormArr[quotaIndex].indexFactors[sourceIndex].fieldNumber = "" : "";
                // 将下拉选项名称 填入
                this.quotaFormArr[quotaIndex].indexFactors[sourceIndex].name = optionName
            }
        },
        // 自定义字段 - 下拉类型 选择框回调函数
        fieldSelect(){
            // arguments[0]: [optionName,optionId] ,
            // arguments[1]: quotaInde(当前 指标 的index值)
            let quotaIndex = arguments[1];
            let fieldId = arguments[0][1];
            let optionName = arguments[0][0];
            // 将 数据类型为下拉类型的自定义字段的 所有下拉选项 设置在区间中
            this.setCustomField(quotaIndex,fieldId);
            // 将储存计算公式的数组清空
            this.quotaFormArr[quotaIndex].calFormulas.splice(0,this.quotaFormArr[quotaIndex].calFormulas.length);
            // 将 自定义字段-下拉类型 的 选项名称、选项ID、type值插入 存储计算公式的数组中
            let calFormulasTem = this.deepClone(this.dataFormat.accessSource);
            calFormulasTem.fieldId = fieldId
            calFormulasTem.type = "clientCustomFieldOption";
            calFormulasTem.name = optionName
            this.quotaFormArr[quotaIndex].calFormulas.push(calFormulasTem);
            // 将自定义字段-下拉类型 的选项名称填入
            this.quotaFormArr[quotaIndex].indexFactors[0].name = optionName;
        },
        // 自定义字段 - 数值类型 下拉框回调函数
        fieldNumberSelect(){
            let optionName = arguments[0][0];
            let quotaIndex = arguments[1];
            let sourceIndex = arguments[2];
            // 将下拉选项名称 填入
            this.quotaFormArr[quotaIndex].indexFactors[sourceIndex].name = optionName;
        },
        // 指标来源 选择 下拉类型时 将对应的下拉类型自定义字段的下拉值填充进quotaFormArr.indexValues数组optionName(下拉选项名称)、optionId(下拉选项ID值)
        setCustomField(quotaIndex,optionId){
            //  获取 区间数组 的长度
            let indexValuesLength = this.quotaFormArr[quotaIndex].indexValues.length;
            // 清空 区间数组
            this.quotaFormArr[quotaIndex].indexValues.splice(0,indexValuesLength)
            // 遍历 自定义字段下拉类型的下拉选项,并将其填充进区间数组中
            this.dataFormat.fieldSelectKeyAndList[optionId].map(item => {
                var range = this.deepClone(this.dataFormat.range);
                range.optionId = item.id;
                range.name = item.name;
                this.quotaFormArr[quotaIndex].indexValues.push(range);
            })
        },
        // 计算公式 最终结果
        calculateFinish(result,quotaIndex){
            this.quotaFormArr[quotaIndex].calFormulas = result;
        },
        // 将计算结果数组转为 运算式
        transferExpression(dataArr){
            let result = "";
            dataArr.map( item => {
                result += item.name;
            })
            return result;
        },
        // 完成表单填写前进行格式化
        formatDataBeforeFinish(data){
            // type:下拉框(option) 区间值(interval)
            data.map((item,index)=>{
                var type = item.indexFactors[0].type === 'clientCustomFieldOption' ? 'option' : 'interval';
                item.indexValues.map(rangeItem=>{
                    rangeItem['type'] = type;
                })
            })            
            return data
        },
        // 校验表单填写是否正确
        validClientGradeIndexData(data){
            let { alert:_alert } = this.dataBase;
            let result = new Promise((resolve,reject) => {
                validClientGradeIndexData({ clientGradeIndex: JSON.stringify(data) })
                .then(res => {
                    if(res.code == '0'){
                        resolve();
                    }
                    else{
                        reject(res.desc);
                    }
                })
                .catch(err => {
                    _alert('提示','网络错误');
                });
            })
            return result;
        },
        // 获取自定义字段 下拉类型 和 数值类型
        getCustomFieldSpecial(){
            let { alert:_alert, top_alert } = this.dataBase;
            // fieldTypes   0: 下拉框类型的自定义字段    5：数值类型的自定义字段
            getCustomFieldSpecial({ fieldTypes: '0,5' })
            .then(res => {
                if(res.code == '0'){
                    // 自定义字段 下拉选择框 数据
                    this.dataFormat.fieldSelectData
                    // 自定义字段 数值类型 数据
                    this.dataFormat.fieldNumberData
                    res.data.list.map(item => {
                        item['val'] = item.id;
                        if( item.type == 5 ){
                            // 数值类型
                            this.dataFormat.fieldNumberData.push(item);
                        }else if( item.type == 0 ){
                            // 下拉框类型
                            this.dataFormat.fieldSelectData.push(item)
                            this.dataFormat.fieldSelectKeyAndList[item.id] = item.list;
                        }
                    })
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                _alert('提示','网络错误');
            });
        },
        // 深克隆对象/数组
        deepClone(obj){
            return JSON.parse(JSON.stringify(obj))
        }
    }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
