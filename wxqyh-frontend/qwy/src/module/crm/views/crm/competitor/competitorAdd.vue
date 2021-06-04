<template>
    <div class="add" v-if="isShowAddDialog" >
        <funcBox :boxTitle="dialogTitle" firstBtn="保存" secondBtn="清空"  @firstFunc="saveCompetitor" @secondFunc="clearCompetitor" boxWidth="900" @closeBox="toggleDialog" >
            <div class="form-wrap" ref="form" >
                <div class="search_items">
                    <div class="qw-form-item required">
                        <h1>
                            企业名称
                        </h1>
                        <qw-input class="qw-input search-input-width-340" v-model="addForm.competitorName" :maxLength ="200" :isWarning="competitorMustFlag" warningTips="企业名称不得为空" @input="competitorNameChange" inputTips="请输入" ></qw-input>
                    </div>
                    <div class="qw-form-item">
                        <h1>
                            规模
                        </h1>
                        <qw-select class="search-input-width-340 select-box" @selectItem="selectItem" :dataList="scaleData" inputTips="请选择" ref="scaleAdd"></qw-select>
                    </div>
                </div>
                <div class="search_items">
                    <div class="qw-form-item">
                        <h1>
                            竞争力
                        </h1>
                        <qw-select class="search-input-width-340 select-box" @selectItem="selectItem_competitor" :dataList="competitorPower" inputTips="请选择" ref="competitorPowerAdd"></qw-select>
                    </div>
                    <div class="qw-form-item">
                        <h1>
                            联系信息
                        </h1>
                        <qw-input class="qw-input search-input-width-340" v-model="addForm.contactInfo" :maxLength ="200" inputTips="请输入" ></qw-input>
                    </div>
                </div>
                <div class="search_items">
                    <div class="qw-form-item">
                        <h1>
                            优势
                        </h1>
                        <qw-input class="qw-input search-input-width-340" inputType="textarea" v-model="addForm.advantage" :maxLength ="2000" inputTips="请输入" ></qw-input>
                    </div>
                    <div class="qw-form-item">
                        <h1>
                            劣势
                        </h1>
                        <qw-input class="qw-input search-input-width-340" inputType="textarea" v-model="addForm.disadvatage" :maxLength ="2000" inputTips="请输入" ></qw-input>
                    </div>
                </div>
                <div class="search_items">
                    <div class="qw-form-item">
                        <h1>
                            策略
                        </h1>
                        <qw-input class="qw-input search-input-width-340" inputType="textarea" v-model="addForm.strategy" :maxLength ="2000" inputTips="请输入" ></qw-input>
                    </div>
                    <div class="qw-form-item">
                        <h1>
                            描述
                        </h1>
                        <qw-input class="qw-input search-input-width-340" inputType="textarea" v-model="addForm.description" :maxLength ="2000" inputTips="请输入" ></qw-input>
                    </div>
                </div>
                <div class="cut-line"></div>
                <div class="search_items">
                    <div class="qw-form-item required">
                        <h1>
                            负责人
                        </h1>
                        <!-- toPersons -->
                        <pick-exam  class="competitorPickPerson"
                                    :useTab="functionTab"
                                    :useDepts ="defaultDeptVOList_creator"
                                    :useUsers ="defaultUserVOList_creator"
                                    @chooseDone ="chooseDone_creator"
                                    :maxUser="toPersonsMaxUser"
                                    :isShowRadios ="false"
                                    ref="toPersonsPick">
                        </pick-exam>
                    </div>
                    <div class="qw-form-item">
                        <h1>
                            相关人
                        </h1>
                        <!-- ccPersons -->
                        <pick-exam  class="competitorPickPerson"
                                    :useTab="functionTab"
                                    :useDepts ="defaultDeptVOList_correlation"
                                    :useUsers ="defaultUserVOList_correlation"
                                    @chooseDone ="chooseDone_correlation"
                                    :isShowRadios ="false"
                                    ref="ccPersonsPick">
                        </pick-exam>
                    </div>
                </div>
            </div>
        </funcBox>

    </div>
</template>

<script>
import funcBox from "@/components/list/funcBox";
import PickExam from "@/components/pickPerson/pickExam"
import qwInput from "@/components/qwuiBase/qwuiInput/qwuiInput"
import qwSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect';
import { addCompetitor,editCompetitor,getCompetitorSetting } from "@/module/crm/api/competitor";
export default {
    components: {
        funcBox, // 弹出框组件
        PickExam, // 选人组件
        qwInput, // 输入框组件
        qwSelect, // 下拉框组件
    },
    props: {
        // 【编辑】时用于输入框等表单控件回显数据的对象
        editData: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return {
            dataBase,
            dialogTitle: "", // 弹出框标题
            isShowAddDialog: false, // 是否打开弹出框
            competitorMustFlag: false, // 企业名称是否为空时输入框border是否变红
            isEdit: false,// 是否为编辑，如果是编辑的话需要进行数据回显和发送接口更换
            addForm: { // 表单数据
                competitorName: "", // 企业名称
                scale: "", // 规模
                competitorPower: "", // 竞争力
                advantage: "", // 优势
                disadvatage: "", // 劣势
                strategy: "", // 策略
                contactInfo: "", // 联系人
                description: "", // 描述
                toPersons: "", // 负责人
                ccPersons: "", // 相关人
            },
            functionTab:[ // 选人组件标签
                {text:'特定人员'},
            ],
            // 竞争力 下拉框数据
            competitorPower: [
                {
                    val: '0',
                    optionName: '请选择'
                },
                {
                    val: '1',
                    optionName: '弱竞争力'
                },
                {
                    val: '2',
                    optionName: '一般竞争力'
                },
                {
                    val: '3',
                    optionName: '潜在竞争力'
                },
                {
                    val: '4',
                    optionName: '强竞争力'
                },
            ],
            // 规模 下拉框数据
            scaleData: [
                {
                    val: '0',
                    optionName: '请选择'
                },
                {
                    val: '1',
                    optionName: '0~20人'
                },
                {
                    val: '2',
                    optionName: '20~50人'
                },
                {
                    val: '3',
                    optionName: '50~100人'
                },
                {
                    val: '4',
                    optionName: '100~200人'
                },
                {
                    val: '5',
                    optionName: '200~500人'
                },
                {
                    val: '6',
                    optionName: '500~1000人'
                },
                {
                    val: '7',
                    optionName: '1000以上人'
                },
            ],
            defaultDeptVOList_creator: [], // 负责人 部门 默认数据
            defaultUserVOList_creator: [], // 负责人 用户 默认数据
            defaultDeptVOList_correlation: [], // 相关人 部门 默认数据
            defaultUserVOList_correlation: [], // 相关人 用户 默认数据
            toPersonsMaxUser: 1//负责人人数限制
        }
    },
    methods: {
        // 打开 新增/编辑框 并初始化
        openDialog(){
            this.isShowAddDialog = true;
            this.init();
        },
        init(){
            this.competitorMustFlag = false;
            if( Object.keys(this.editData).length == 0 ){ // 新增
                this.dialogTitle = "新建竞争对手";
                this.isEdit = false;
            }else{ // 编辑
                this.dialogTitle = "编辑竞争对手";
                this.isEdit = true;
                // 赋值给editData用于数据回显
                let { competitorName, scale, competitorPower, advantage, disadvatage, strategy, contactInfo, description } = this.editData;
                this.addForm = { competitorName, scale, competitorPower, advantage, disadvatage, strategy, contactInfo, description };
                let ccPersonArr = [];
                let toPersonArr = [];
                // 遍历 负责人 和 相关人 并将其格式化用逗号隔开的字符串
                this.editData.ccPersons.map(item => {
                    ccPersonArr.push(item.userId)
                })
                this.editData.toPersons.map(item => {
                    toPersonArr.push(item.userId)
                })
                this.addForm.ccPersons = ccPersonArr.join(",");
                this.addForm.toPersons = toPersonArr.join(",");
                console.log(this.editData.toPersons)
                this.defaultUserVOList_creator = this.editData.toPersons;
                this.defaultUserVOList_correlation = this.editData.ccPersons;
                let _this = this;
                setTimeout(()=>{
                    // 为 规模 、 竞争力 下拉框 赋值
                    _this.$refs.scaleAdd.setValue(this.editData.scale);
                    _this.$refs.competitorPowerAdd.setValue(this.editData.competitorPower);
                },400)
            }
          getCompetitorSetting().then(res => {
              if (res.code == 0) {
                // res.data.multiple 0关闭多选 1开启
                this.toPersonsMaxUser = res.data.multiple==1?undefined:1
              } else {
                this.dataBase.alert("提示", res.desc);
              }
          }).catch(err=>{
            this.dataBase.alert("提示", "网络错误");
          });
        },
        // 关闭弹框
        closeDialog(){
            this.isShowAddDialog = false;
        },
        // 打开/关闭弹框
        toggleDialog(){
            this.isShowAddDialog = !this.isShowAddDialog;
        },
        // 规模 下拉框回调函数
        selectItem(optionName, val){
            this.addForm.scale = val;
        },
        // 竞争力下拉框 回调函数
        selectItem_competitor(optionName, val){
            this.addForm.competitorPower = val;
        },
        // 负责人选人完成后的回调函数
        chooseDone_creator(dept, tag, user){
            // if( user.length == 0 ){
            //     this.addForm.toPersons = "";
            //     return false;
            // }
            // this.addForm.toPersons = user[0].userId;
            let result = []
            user.map(item => {
                result.push(item.userId)
            })
            this.addForm.toPersons = result.join(",");
        },
        // 相关人 选人回调函数
        chooseDone_correlation(dept, tag, user){
            let result = []
            user.map(item => {
                result.push(item.userId)
            })
            this.addForm.ccPersons = result.join(",");
        },
        // 企业名称 不为空时 关闭警告框
        competitorNameChange(val){
            if( val.length != 0 ){
                this.competitorMustFlag = false;
            }
        },
        // 保存
        saveCompetitor(){
            let { alert:_alert, top_alert } = this.dataBase;
            //  判断企业名称是否为空
            if( this.addForm.competitorName.length === 0 ){
                this.competitorMustFlag = true;
                return false;
            }
            if( this.addForm.toPersons.length === 0 ){
                _alert('提示','负责人不得为空');
                return false;
            }
            let toPersonsArr = [];
            this.addForm.toPersons.length != 0 ? this.addForm.toPersons.split(",").map((item,index) => {
                toPersonsArr.push({ userId: item, sort: index })
            }) : "";
            let ccPersonsArr = [];
            this.addForm.ccPersons.length != 0 ? this.addForm.ccPersons.split(",").map((item,index) => {
                ccPersonsArr.push({ userId: item, sort: index })
            }) : "";
            let form = {
                tbCrmCompetitorInfoPO: {
                    "competitorName": this.addForm.competitorName,
                    "scale": this.addForm.scale,
                    "competitorPower": this.addForm.competitorPower,
                    "advantage": this.addForm.advantage,
                    "disadvatage": this.addForm.disadvatage,
                    "strategy": this.addForm.strategy,
                    "contactInfo": this.addForm.contactInfo,
                    "description": this.addForm.description
                },
                "toPersons": toPersonsArr,
                // "toPersons": {
                //     "userId": this.addForm.toPersons,
                //     "sort": 0
                // },
                "ccPersons": ccPersonsArr
            }
            if( !this.isEdit ){
                this.newCompetitor(form)
            }else{
                this.editCompetitor(form)
            }


        },
        // 新建 保存
        newCompetitor(form){
            let { alert:_alert, top_alert } = this.dataBase;
            addCompetitor({ dataJson: JSON.stringify(form) })
            .then(res => {
                if(res.code == '0'){
                    top_alert('保存成功',true,2000);
                    this.$emit("refresh");
                    this.closeDialog();
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                _alert('提示','网络错误');
            });
        },
        // 编辑 保存
        editCompetitor(form){
            let { alert:_alert, top_alert } = this.dataBase;
            form.tbCrmCompetitorInfoPO["id"] = this.editData.id;
            editCompetitor({ dataJson: JSON.stringify(form) })
            .then(res => {
                if(res.code == '0'){
                    top_alert('保存成功',true,2000);
                    this.$emit("refreshInfo");
                    this.closeDialog();
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                _alert('提示','网络错误');
            });
        },
        // 表单 清空
        clearCompetitor(){
            this.$refs.ccPersonsPick.clearUsers();
            this.$refs.toPersonsPick.clearUsers();
            this.$refs.scaleAdd.setValue("");
            this.$refs.competitorPowerAdd.setValue("");
            this.addForm = {
                competitorName: "",
                scale: "",
                competitorPower: "",
                advantage: "",
                disadvatage: "",
                strategy: "",
                contactInfo: "",
                description: "",
                toPersons: "",
                ccPersons: "",
            };
        }
    },
}
</script>

<style scoped>
.add >>> .funcBox_mask{
    left: 0;
    top: 0;
}
.add .qw-form-item{
    margin-bottom: 20px;
}
.form-wrap{
    max-height: 600px;
    padding: 20px 40px;
}
.search-input-width-340{
    width: 340px;
}
.search-input-width-340 >>> .qw_textarea{
    width: 340px;
    height: 80px;
    min-height: 80px;
    padding-bottom: 20px;
    resize: vertical;
}
.competitorPickPerson >>> .qwui-click_choose{
    box-sizing: border-box;
    max-width: 720px;
    max-height: 88px;
    min-width: 340px;
    min-height: 45px;
    width: auto;
    height: auto;
}
.competitorPickPerson >>> span.qwui-click_choose_word{
    line-height: 40px;
}
.select-box.box_wrap{
    margin-top: 0;
}
.select-box.box_wrap >>> .qwui-select_wrap.round{
    width: 100%;
    background-color: #fff;
}
.select-box.box_wrap >>> input.text_wrap{
    background-color: #fff;
}
.required h1::before{
    content: "*";
    color: #FF3333;
    vertical-align: middle;
}
.cut-line{
    border-bottom: 1px dashed #E5E5E5;
    margin-top: 16px;
    margin-bottom: 25px;
}
</style>
