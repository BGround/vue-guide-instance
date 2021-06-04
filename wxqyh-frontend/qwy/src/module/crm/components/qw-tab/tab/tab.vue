<!-- 
  参数：
    @param defaultTabName(默认'')：默认选中哪一个 name （该参数详见tabItem）； 如下例中  defaultTabName="tab'sName1" 那么便默认打开 name值为tab'sName1的标签
    @param checkboxSwitch(默认 false)：是否需要在tab头中开启checkbox

   子组件（tab-item参数说明）
    @param checked(默认 false)；是否勾选checkbox  （ checked的值通过 .sync 双向绑定，详情见例2 ）
    @param disabled(默认 false)：是否禁用checkbox

  方法：
    @param tabClick(obj): 初始化tab和每次点击tab都会触发该方法，obj值为 { index: 序号， name: tabitem的name值 }

  用法：
    例1 【常规】
    import qwTabs from 'XX/components/qw-tab/tab/tab';
    import qwTabItem from 'XX/components/qw-tab/tabItem/tabItem';
    
    <qw-tabs defaultTabName="tab'sName1" @tabClick="tabClick" >  
        <qw-tab-item label="tab标题1" name="tab'sName1" >
            tab'sName1 的内容
        </qw-tab-item>    
        <qw-tab-item label="tab标题2" name="tab'sName2" >
            tab'sName2 的内容
        </qw-tab-item>    
    </qw-tabs>

    例2 【tab头带checkbox】
    <qw-tabs defaultTabName="1" @tabClick="tabClick" :checkboxSwitch="true" >
        <qw-tab-item label="基本信息" name="1" :checked.sync="d1">
            基本信息
        </qw-tab-item>
        <qw-tab-item label="竞争商机" name="2" :checked.sync="d2" :disabled="true" >
            竞争商机
        </qw-tab-item>
    </qw-tabs>
-->
<template>
    <div class="qwui-tab">        
        <div class="qwui-tab-header--block">            
            <div class="qwui-tab-header" :class="{ 'active': tabIndex === index }" v-for="(value,index) in headerDatas" :key="index" @click="checkTab(index)" >
                <qw-checkbox v-model="checkedArr[index]" @click.native.stop="checkBoxClick(index,checkedArr[index])" v-if="checkboxSwitch" :disabled="checkboxDisabledArr[index]"></qw-checkbox>                
                <span v-html="value"></span>
            </div>            
        </div>  
        <div ref="qwuiTabContent">                             
            <slot></slot>      
        </div>
        
    </div>
</template>

<script>
import qwCheckbox from "@/components/exportComponents/qw-checkbox";
export default {
    components: {
        qwCheckbox
    },
    props: {
        defaultTabName: {
            type: String,
            default: ""
        },  
        checkboxSwitch: {
            type: Boolean,
            default: false
        } 
    },
    data(){
        return {            
            headerDatas: [],     
            headerNames: [],
            tabIndex: "",
            tabName: "",
            checkedArr: [],
            checkboxDisabledArr: []
        }
    },   
    mounted(){       
        this.init()      
    },
    methods: {
        init(){                      
            this.initTab();
            if( this.checkboxSwitch ){
                this.initCheckbox();
            }
        },
        initTab(){
            this.$children.forEach((value, index) =>{            
                let label = value._props.label;
                let name = value._props.name;
                if( this.headerNames.indexOf(name) != -1 ){
                    throw Error("tab的name值必须唯一");
                }
                if( name === this.defaultTabName ){
                    this.tabIndex = index;
                    this.tabName = name;
                }
                this.headerDatas.push(label)
                this.headerNames.push(name)                                                       
            }) 
        },
        initCheckbox(){            
            // 将tab-item组件的checked值取出来放在checkedArr数组中对checkbox进行初始化赋值       
            let checkResult = [];
            let disabledResult = [];  
            this.$children.forEach((value, index) =>{   
                let checked = value._props.checked;
                let disabled = value._props.disabled;                
                if( checked != undefined ){
                    checkResult.push(checked)
                    disabledResult.push(disabled)                                        
                }                                 
            }) 
            this.checkedArr = checkResult;
            this.checkboxDisabledArr =  disabledResult;                   
        },
        checkTab(index){
            this.tabIndex = index;  
            this.tabName = this.headerNames[index]         
        },
        checkBoxClick(index,value){      
            let result = { index,value };      
            this.$emit("change",result)            
        },
        getChildrenTabName(){            
            return this.tabIndex.length != 0 ? this.$children[this.tabIndex]._props.name : ""
        },   
    },
    watch: {
        tabIndex(oldVal,newVal){
            this.$emit("tabClick",{ index: this.tabIndex, name: this.tabName })
        },
        checkedArr: {
            deep: true,
            handler(newVal,oldVal){
                newVal.map((value,index)=>{                                     
                    if( typeof this.$children[index].setChecked === 'function' ){                                                
                        this.$children[index].setChecked(value);
                    }                    
                })
            }
        }
    }
}
</script>
<style lang="scss" src="./tab.scss"></style>
