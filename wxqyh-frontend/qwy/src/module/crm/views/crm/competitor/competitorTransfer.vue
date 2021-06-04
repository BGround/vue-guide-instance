<template>
    <div class="transfer" v-if="isShowTransferDialog" >
        <funcBox boxTitle="转移竞争对手" firstBtn="确定" secondBtn="取消"  @firstFunc="save" @secondFunc="cancel" boxWidth="460" @closeBox="toggleDialog" >
            <div class="transfer-block">
                <pick-exam  class="competitorPickPerson"
                            :useTab="functionTab"
                            :useDepts ="defaultDeptVOList_transfer"
                            :useUsers ="defaultUserVOList_transfer"
                            @chooseDone ="chooseDone_transfer"
                            :maxUser= 1
                            :isShowRadios ="false">
                </pick-exam>
            </div>
        </funcBox>

    </div>
</template>

<script>
import funcBox from "@/components/list/funcBox";
import PickExam from "@/components/pickPerson/pickExam"
import { transferCompetitor } from "@/module/crm/api/competitor";

export default {
    props: {
        // 竞争对手ID 唯一
        competitorIds: {
            type: String,
            default: ""
        }
    },
    components: {
        funcBox,
        PickExam,
    },
    data(){
        return {
            dataBase,
            // 选人组件 标签
            functionTab:[                
                {text:'特定人员'},
            ],
            // 转移 表单
            transferForm: {
                competitorIds: "",
                userId: ""
            },
            // 是否打开 转移 弹出框
            isShowTransferDialog: false,
            defaultDeptVOList_transfer: [],
            defaultUserVOList_transfer: [],
            deptList_transfer: [],
            userList_transfer: [],
        }
    },
    computed: {
        scaleData(){
            return this.$parent._data.scaleData;
        }
    },
    methods: {
        openDialog(){
            this.isShowTransferDialog = true;
        },
        closeDialog(){
            this.isShowTransferDialog = false;
        },
        toggleDialog(){
            this.isShowTransferDialog = !this.isShowTransferDialog;
        },
        chooseDone_transfer(dept, tag, user){
            let result = []
            user.map(item => {
                result.push(item.userId)
            })
            this.transferForm.userId = result.join(",");
        },
        save(){
            let { alert:_alert, top_alert } = this.dataBase;            
            this.transferForm.competitorIds = this.competitorIds;            
            if( this.transferForm.userId.length === 0 ){
                _alert('提示','负责人不得为空');
                return false;
            }  
            transferCompetitor(this.transferForm)
            .then(res => {
                if(res.code == '0'){
                    top_alert('转移成功',true,2000);
                    this.closeDialog();
                    this.$emit('refresh');
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                console.log(err)
                _alert('提示','网络错误');
            });
        },
        cancel(){
            this.closeDialog()
        }
    },    
    watch: {
        isShowTransferDialog(curVal,oldVal){
            // 关闭时
            if( !curVal ){
                this.transferForm.userId = "";
            }
        }
    }
}
</script>

<style scoped>
.transfer >>> .funcBox_mask{
    left: 0;
    top: 0;
}
.transfer-block{
    padding: 30px;
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
</style>
