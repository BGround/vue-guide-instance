<template>
    <func-box v-if="isShow" boxTitle="配置计算公式" boxWidth=800 @firstFunc="finish" @secondFunc="toggleDialog" @closeBox="toggleDialog" >
        <div class="wrap">
            <div class="title">
                {{calculatorTitle}}=
            </div>
            <div class="result clear-fix">
                <card v-for="(item,index) in resultData" :type="item.type == 'symbol' ? 'operators': 'param' " class="result-label" :key="index" >{{item.name}}</card>                                
            </div>
            <div class="title">
                可选字段
            </div>
            <div class="control-block clear-fix">
                <!-- 参数字段 选择框 -->
                <div class="param-block">
                    <card type="param" class="param-label" v-for="(item,index) in paramData" :key="index" @click.native="addLabel('param',item)" >{{item.name}}</card>                                                 
                </div>
                <!-- 运算符 选择框 -->
                <div class="operators-block">
                    <card type="operators" class="operators-label"  v-for="(item,index) in operatorsData" :key="index" @click.native="addLabel('operators',item)" >{{item.name}}</card>                    
                    <card type="operators" class="operators-label" title="删除" @click.native="delLabel()" >←</card>  
                </div>
            </div>
        </div>
    </func-box>
</template>

<script>
import funcBox from '@/components/list/funcBox'; 
import card from './label'
import { validArithmeticExpression } from "@/module/crm/api/setting";
export default {
    components: {
        funcBox,
        card
    },
    data(){
        return{
            dataBase,
            // 是否显示弹出框
            isShow: false,
            // 公式名称
            calculatorTitle: "",
            // 字段参数
            paramData: [],
            // 运算符
            operatorsData: [
                { name: "+", type: "symbol" },
                { name: "-", type: "symbol" },
                { name: "*", type: "symbol" },
                { name: "/", type: "symbol" },
                { name: "(", type: "symbol" },
                { name: ")", type: "symbol" },                
            ],
            // 运算表达式
            resultData: [],
            // 现在正在编辑的 指标 的index值（指标可增加多个，用index作为唯一标识）
            quotaIndex: null,
        }
    },
    methods: {
        // 添加 字段参数/运算符
        addLabel(type,obj){
            this.resultData.push({type,...obj})
        },
        // 删除 字段参数/运算符
        delLabel(){
            this.resultData.pop();
        },
        // 完成 按钮
        finish(){        
            let { alert:_alert, top_alert } = this.dataBase;                
            this.validExpression(this.resultData)
            .then(()=>{
                this.toggleDialog();
                this.$emit("finish",this.resultData,this.quotaIndex);                
            })
            .catch(()=>{
                top_alert('计算公式配置不合理，请检查无误后再次提交',false,3000);    
            })
            
        },
        // 打开/关闭 弹出框
        toggleDialog(data,quotaIndex){                                                    
            this.isShow = !this.isShow;            
            if( this.isShow ){   
                this.quotaIndex = quotaIndex;
                this.initCalculator(data)                
            }            
        },
        // 初始化
        initCalculator(data){
            // 公式名称
            this.calculatorTitle = data.name;
            // 如果有计算公式，回显出来
            this.resultData = data.calFormulas;
            // 格式化 指标来源
            this.formatData(data.indexFactors);            
        },
        // 格式化 指标来源 数组
        formatData(data){         
            let result = [];
            // 当指标来源有 自定义字段-数值类型时 ，fieldNumber字段将存在，将fieldNumber字段存入fieldId ，以提供给后端            
            data.map(item => {
                if( item.type ){       
                    if( !(item.type == 'clientCustomFieldNumber' && !item.fieldNumber) ){
                        result.push(item)
                    }              
                }                
            })
            this.paramData = result;            
        },
        // 表达式 校验
        validExpression(expression){        
            let { alert:_alert, top_alert } = this.dataBase;                       
            var result = new Promise( (resolve, reject) => {                
                validArithmeticExpression({ expression : JSON.stringify(expression) })
                .then(res => {                
                    if(res.code == '0'){                     
                        res.data.valid ? resolve() : reject();              
                    }
                    else{
                        _alert('提示',res.desc);
                    }
                })
                .catch(err => {                
                    _alert('提示','网络错误');
                }); 
            }); 
            return result;           
        }
    }
}
</script>

<style lang="scss" scoped >
.wrap{
    box-sizing: border-box;
    max-height: 658px;
    padding: 50px 56px;
    overflow-y: scroll;
    background-color: #fff;
    .title{        
        margin-bottom: 12px;
    }
    .result{
        @extend .border;
        width: 100%;        
        min-height: 42px;
        margin-bottom: 32px;
        padding: 8px 12px 0;
        .result-label{
            float: left;
            margin-right: 8px;
            margin-bottom: 8px;
        }
    }
    .control-block{
        width: 100%;   
        .param-block{
            @extend .border;
            float: left;
            box-sizing: border-box;
            width: 497px;
            min-height: 216px;               
            padding: 0 0 16px 16px;         
            .param-label{
                margin-top: 16px;  
                margin-right: 16px;                     
            }
        }
        .operators-block{
            @extend .border;
            float: right;
            box-sizing: border-box;
            width: 166px;
            min-height: 216px;
            padding: 0 0 16px 16px;   
            .operators-label{
                margin-top: 16px;  
                margin-right: 12px;                
            }
        }          
    }        
    .border{
        border: 1px solid #e6e6e6;
    }
    .clear-fix:after{
        content: "";
        clear: both;        
        display: block;
        visibility: hidden;
        line-height: 0;
    }
}
</style>
