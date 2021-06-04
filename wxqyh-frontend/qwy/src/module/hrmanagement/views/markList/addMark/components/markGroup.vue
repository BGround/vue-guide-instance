<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{markTemplate.name}}</label>
    <div class="qwui-form_item_content">
        <div>
            <div class="content_button" @click="showPick">添加</div>
            <div class="content_detail" v-if="defaultUsers.length>0">
                <div class="qwui-dept_selected"
                     v-for="item in defaultUsers"
                     :key="item.id"
                >
                    <img v-if="item.headPic && item.headPic!='0'"
                         class="qwui-dept_selected_icon"
                         :src="item.headPic">
                    <div v-else class="qwui-user_default_img"></div>
                    {{item.personName}}
                    <span class="qwui-selected_close" @click.stop.prevent="deleteUser">×</span>
                </div>
            </div>
        </div>
        <div class="qwui-form_item_error_tip" v-if="showErrorTip">评分人不能为空</div>
    </div>
    <pick-person
        :show="show"
        :maxUser=1
        :defaultUsers="defaultUsers"
        :functionTab="functionTabs"
        @chooseDone="chooseDone"
        @closeThis="closeThis"
    ></pick-person>
</div>
</template>

<script>
import pickPerson from '@/components/pickPerson/pickPerson'
export default {
    name: 'markGroup',
    props: {
        markTemplate: {
            type: Object,
            require: true
        },
        EVENT_BUS: {
            type: Object,
            required: true
        },
        keyName: {
            type: String,
            require: false
        },
        keyIndex: {
            type: Number,
            required: false
        }
    },
    components: {
        pickPerson
    },
    data() {
        return {
            functionTabs: [
                {text:'特定人员'},
                {text:'批量导入'},
                {text:'高级筛选'}
            ],
            show: false,
            defaultUsers: [],
            showErrorTip: false
        }
    },
    watch: {
        markTemplate: {
            handler: function(newVal) {
                //当是从报文获取回来的数据personList属性不为空
                if(newVal.personList != undefined){
                    this.defaultUsers = [];
                    this.defaultUsers.push(newVal.personList[0]);
                    this.EVENT_BUS.$emit('on-set-form-data', {
                        key: this.keyName,
                        keyIndex: this.keyIndex,
                        value: {
                            "markTemplateId": newVal.groupId || newVal.id,
                            "userId":  newVal.personList[0].userId
                        }
                    });
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.EVENT_BUS.$emit('on-form-item-add', this);
    },
    beforeDestroy () {
        this.EVENT_BUS.$emit('on-form-item-remove', this);
    },
    methods: {
        chooseDone(dept,tag,user) {
            this.defaultUsers=user.slice(0);
            this.show = false;
            this.EVENT_BUS.$emit('on-set-form-data', {
                key: this.keyName,
                keyIndex: this.keyIndex,
                value: {
                    "markTemplateId": this.markTemplate.groupId  || this.markTemplate.id,
                    "userId":  this.defaultUsers[0].userId
                }
            });
        },
        showPick() {
            this.show = !this.show
        },
        closeThis() {
            this.show = false;
        },
        //删除人员
        deleteUser:function (index) {
            this.defaultUsers.splice(index,1)
            this.EVENT_BUS.$emit('on-set-form-data', {
                key: this.keyName,
                keyIndex: this.keyIndex,
                value: {
                    "markTemplateId": this.markTemplate.groupId || this.markTemplate.id,
                    "userId":  ''
                }
            });
        },
        validate() {
            return new Promise((resolve, reject) => {
                if(this.defaultUsers.length == 0){
                    this.showErrorTip = true;
                    resolve({
                        title: this.keyName,
                        status: false
                    })
                }else {
                    this.showErrorTip = false;
                    resolve({
                        title: this.keyName,
                        status: true
                    })
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.content_button {
    display: inline-block;
    vertical-align: middle;
    width: 60px;
    height: 32px;
    line-height: 30px;
    border: 1px solid #CBCBCB;
    border-radius:4px;
    text-align: center;
}
.content_detail {
    display: inline-block;
    margin-left: 5px;
}
</style>
<style scoped>
.qwui-dept_selected{
display: inline-block;
width: auto;
height: 24px;
margin: 5px 5px 0 0;
line-height: 24px;
list-style: none;
background-color: #eee;
border: 1px solid #ddd;
border-left:none;
border-radius: 3px;
vertical-align: top;
}
.qwui-dept_selected_icon{
display: inline-block;
width: 26px;
height: 24px;
margin-right: 5px;
list-style: none;
vertical-align: top;
background: url(~assets/images/dept_icon.png) no-repeat center;
}
.qwui-selected_close{
display: inline-block;
width: 18px;
height: 18px;
margin: 3px 5px 0 10px;
line-height: 17px;
text-align: center;
color: #afafaf;
font-size: 19px;
font-weight: 600;
cursor: pointer;
vertical-align: text-bottom;
border-radius: 100%;
opacity: 1;
}
</style>
