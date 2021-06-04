<template>
    <div class="crmContact adapt_iphonex">
        <crm-external
                    :contactData="contactData"
                    :isWarnShow="isWarnShow"
                    @moveInput="moveInput"
                    @delExternal="delExternal"
                    @editCompany="editCompany"
                    v-if="externalShow"
        ></crm-external>
        <div class="contactBtn wrap">
            <div class="btn_cancle" @click="cancleClick">
                <span class="btn_text">取消</span>
            </div>
            <div class="btn_confirm" @click="confirmClick">
                <span class="btn_text">创建</span>
            </div>
        </div>
    </div>
</template>
<script>
import CrmExternal from '../../../components/CrmExternal/CrmExternal'
import avatarImg from '@/assets/images/icon_person.png'
import { getWxContactList,validClientName,batchAddContact } from '../../../api/externalContact/getData';

export default {
    name: 'externalContact',
    components: {
        CrmExternal
    },
    data () {
        return {
            // pass: true,
            isWarnShow: false, // 企业号不为空
            externalShow: true,
            contactData:[
                // {
                //     avatar: avatarImg,
                //     name: '外部联系人',
                //     corp_full_name: '1',
                //     noCompany: false,
                //     isRepeat: false,
                //     remark: '123432'
                // },
            ]
        }
    },
    created () {
        // this.readyCheck();
        this.init();
    },
    methods: {
        // 初始化
        init(){
            let obj = localStorage.getItem('externalIds');
            let contactObj = {
                userIds: obj
            }
            getWxContactList(contactObj).then(res => {
                if(res.code == '0'){
                    localStorage.removeItem('externalIds')
                    this.contactData = [...res.data.wxContactList]
                    this.contactData.forEach((item) => {
                        this.$set(item,'isRepeat',false);
                        this.$set(item,'noCompany',false);
                        this.$set(item,'isfocus',true);
                        this.$set(item,'avatar',item.avatar || avatarImg);
                        item.noCompany = item.corp_full_name == '' ? true : false
                    })
                    this.externalShow = true;
                    this.readyCheck();
                }else if(res.code == '60011'){
                    _.alert("",res.desc)
                }else{
                    _.alert('提示',res.desc)
                }
            })
        },

        // 离开焦点，验证客户名称是否重复
        moveInput(item){
            item.isfocus = false;
            let obj = {
                clientName: item.corp_full_name
            }
            validClientName(obj).then(res => {
                if(res.code == '0'){
                    if(res.data.isRepeat == true){
                        item.isRepeat = true
                    }else{
                        item.isRepeat = false
                        // 客户不重名之后，隐藏input框
                        if(item.corp_full_name.length > 0){
                            item.noCompany = !item.noCompany
                        }else if(item.corp_full_name == ''){
                            this.isWarnShow = true;
                            setTimeout(() => {
                                this.isWarnShow = false;
                            }, 1000);
                        }
                    }
                }else{
                    _.alert('提示',res.desc)
                }
            })
        },

        // 点击修改
        editCompany(item){
            item.isfocus = true;
            item.noCompany = !item.noCompany
        },

        // 点击删除事件
        delExternal(item,idx){
            if(this.contactData.length > 1){
                this.contactData.splice(idx,1);
            }
        },

        // 刚进入页面的时候就查重
        readyCheck(){
            this.contactData.forEach((item) => {
                let obj = {
                    clientName: item.corp_full_name
                }
                validClientName(obj).then(res => {
                    if(res.code == '0'){
                        if(res.data.isRepeat == true){
                            item.isRepeat = true
                        }else{
                            item.isRepeat = false
                        }
                    }else{
                        _.alert('提示',res.desc)
                    }
                })
            })
        },

        // 按取消键则返回之前的页面
        cancleClick(){
            this.$route.query.type == 'home' ? this.$router.replace({path: "index"}) : this.$router.replace({path: "contactOperate"})
        },

        // 按确定则新增客户跟联系人
        confirmClick(){
            this.checkAllVali();
        },

        // 新增客户
        addClientContact(){
            let clientNamesArr = [];
            let contactsArr = []
            this.contactData.forEach((item) => {
                clientNamesArr.push(item.corp_full_name)
                let externalObj = {
                    contactsName: item.remark || item.name,
                    position: item.position,
                    clientName: item.corp_full_name,
                    openId: item.external_userid
                }
                contactsArr.push(externalObj);

            })
            let obj =　{
                clientNames: clientNamesArr.join(),
                contacts: JSON.stringify(contactsArr),
            }
            batchAddContact(obj).then(res => {
                if(res.code == '0'){
                    this.$router.replace({path: '/contactList/isread'});
                }else{
                    _.alert('提示',res.desc)
                }
            })
        },

        checkAllVali(){
            let checkRepeatArr = [];
            let checkNameArr = [];
            this.contactData.forEach((item) => {
                checkRepeatArr.push(item.isRepeat);
                checkNameArr.push(item.corp_full_name);
            })
            if(!checkRepeatArr.includes(true)){
                if(!checkNameArr.includes('')){
                    this.addClientContact();
                }else{
                    this.isWarnShow = true;
                    setTimeout(() => {
                        this.isWarnShow = false;
                    }, 1000);
                }
            }
        }
    },

}
</script>
<style lang="scss">
@import './externalContact.scss';
</style>





