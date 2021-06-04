<template>
    <div class="externalWrap">
        <div class="qwui-warning wrap" v-show="isWarnShow">
            <span class="waring-text">{{warnMsg}}</span>
        </div>
        <div class="selectedContact">
            <div class="greyContact">
                <p class="selected_contact_text">已选择<span class="blue_text"> {{externalData.length}} </span>个联系人</p>
            </div>
            <transition-group name="slide-fade">
            <div class="contactContent" v-for="(item,idx) in externalData" :key="idx">
                <div class="deleteContact">
                    <span class="icon icon-reduce" @click="delExternal(item,idx)"></span>
                </div>
                <div class="mainContact">
                    <div class="contactInfo">
                        <div class="leftImg">
                            <img :src= item.avatar>
                            <!-- <img src= '~assets/images/icon_person.png'> -->
                        </div> 
                        <div class="rightText">
                            <p class="contactName">{{item.remark || item.name}}</p>
                            <div class="contactInput" v-if="item.noCompany" :class="item.isRepeat ? 'becomeRed' : ''">
                                <input v-model="item.corp_full_name" placeholder="请输入企业名称" class="inputBackground clientNamesInput" :class="item.isRepeat ? 'becomeRed' : ''" @blur="moveInput(item)">
                                <!-- <input v-model="item.corp_full_name" placeholder="请输入企业名称" class="inputBackground clientNamesInput" :class="item.isRepeat ? 'becomeRed' : ''" v-focus="item.isfocus" @blur="moveInput(item)"> -->
                                <!-- <input v-model="item.corp_full_name" placeholder="请输入企业名称" class="inputBackground clientNamesInput" :class="item.isRepeat ? 'becomeRed' : ''" v-focus="item.isfocus" @focus="onfocus(item)" @blur="moveInput(item)"> -->
                            </div>
                            <p class="companyName" v-if="!item.noCompany"><span>{{item.corp_full_name}}</span><span class="edit_btn" @click="editCompany(item)"></span></p>
                            <p class="clientRepeat" v-show="item.isRepeat">客户已经存在</p>
                        </div>
                    </div>
                </div>
            </div>
            </transition-group>
        </div>
        <div class="selectedClient">
            <div class="greyContact">
                <p class="selected_contact_text">将同时创建联系人所属的<span class="blue_text"> {{clientData.length}} </span>个客户</p>
            </div>
            <div class="clientList">
                <ul>
                    <transition-group name="fade">
                        <li class="clientLi" v-for="(item,idx) in clientData" :key="idx" v-show="item.length">
                            <span class="clientImg"></span>
                            <span class="clientName">{{item}}</span>
                        </li>
                    </transition-group>
                </ul>
            </div>
        </div>
        <div class="heightBlock"></div>
    </div>
</template>
<script>
export default {
    name: 'CrmExternal',
    components: {
    },
    props: {
        contactData:{
            type: Array,
            defalut: []
        },
        isWarnShow:{
            type: Boolean,
            defalut: false
        }
    },
    computed: {
        clientData(){
            let arr = [];
            this.contactData.forEach((item) => {
                if(item.corp_full_name != ''){
                    arr.push(item.corp_full_name);
                }
            })
            return Array.from(new Set(arr));
        },
        externalData(){
            return this.contactData
        },
    },
    data () {
        return {
            warnMsg: '企业名称不能为空',
        }
    },
    created(){
        
    },
    methods: {
        onfocus(item){
            document.querySelector('body').addEventListener('touchend', function(e) {
                if(e.target.className != 'clientNamesInput' && e.target.className != 'contactInput') {
                    document.querySelector('.clientNamesInput').blur();
                }else{
                }
            });
        },
        // 点击删除事件
        delExternal(item,idx){
            this.$emit('delExternal',item,idx)
        },

        // 失去焦点事件
        moveInput(item){
            this.$emit('moveInput',item)
        },

        // 点击修改所属客户
        editCompany(item){
            this.$emit('editCompany',item)
        },
    }
}
</script>
<style lang="scss" scoped>
@import './CrmExternal.scss';
</style>


