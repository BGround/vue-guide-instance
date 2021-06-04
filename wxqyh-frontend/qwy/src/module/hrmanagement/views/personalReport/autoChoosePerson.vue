<template>
<div class="qwui-form_item qwui-form_item_required qwui-form_item_hasLabel">
    <div class="qwui-form_item_content">
        <div class="content_button"
             @click="showPick"
             v-if="!defaultDepts.length && !defaultUsers.length && !Object.keys(defaultPosition).length"
        >点击选择</div>
        <ul class="qwui-click_choose"
            @click="showPick"
            v-if="defaultDepts.length || defaultUsers.length || Object.keys(defaultPosition).length">
            <span class="qwui-click_choose_word" v-show="!selectShow">点击选择</span>
            <!--  部门已选择  -->
            <li class="qwui-dept_selected ellipsis" v-for="(item,index) in defaultDepts" :title="item.nodeName?item.nodeName:item.deptName">
                <div class="qwui-dept_selected_icon"></div>
                {{item.nodeName?item.nodeName:item.deptName}}
                <span class="qwui-selected_close" @click.stop.prevent="deleteDept(index)">×</span>
            </li>
            <!--  职位的选择  -->
            <li class="qwui-inline" v-if="Object.keys(defaultPosition).length">
                <div class="qwui-dept_selected pr10 ellipsis" :title="defaultPosition.name">
                <div class="qwui-tag_selected_icon"></div>
                {{defaultPosition.name}}
                </div>
            </li>
            <!--  人员选择  -->
            <li class="qwui-inline">
                <div class="qwui-dept_selected ellipsis" v-for="(item,index) in defaultUsers" :title="item.personName">
                <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
                <div v-else class="qwui-user_default_img"></div>
                {{item.personName}}
                <span class="qwui-selected_close" @click.stop.prevent="deleteUser(index)">×</span>
                </div>
            </li>
        </ul>
        <pick-person
            :show="show"
            :defaultDepts="defaultDepts"
            :defaultUsers="defaultUsers"
            :defaultPosition="defaultPositionArray"
            :functionTab="functionTab"
            :maxUser="maxUser"
            :maxPosition="maxPosition"
            @chooseDone="chooseDone"
            @closeThis="closeThis"
        ></pick-person>
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{validateMessage}}</div>
        <slot></slot>
    </div>
</div>
</template>

<script>
import pickPerson from '@/components/pickPerson/pickPerson'
export default {
    name: 'autoChoosePerson',
    components: {
        pickPerson
    },
    props: {
        EVENT_BUS: {
            type: Object,
            required: true
        },
        objVal: {
            type: Object,
            required: true
        },
        //该标签的所属key值
        keyName: {
            type: String,
            required: false
        },
        //考核对象的选择方式
        markType: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data() {
        return {
            //通讯录的选人
            maxUser: _.vip_grade>=1 ? 5000 : 25,
            //职位选择数量得限制
            maxPosition: 1,
            //校验规则
            rule: {
                name:{
                    "required": true,
                    "message": "部门不能为空"
                }
            },
            validateState: '',
            // 选人
            show:false,
            defaultDepts:this.objVal["markSetting[0].viewDeptIds"],
            defaultUsers:this.objVal["markSetting[0].viewUserIds"],
            defaultPosition:this.objVal["markSetting[0].postId"],
            //通讯录选人的配置
            functionTab: [
                // {text:'职位'},
                {text:'部门'},
            ],
            showValidate: false,
            validateMessage: '部门不能为空'
        }
    },
    computed:{
      selectShow:function () {
        return this.defaultDepts.length>0 || this.defaultUsers.length>0 || Object.keys(this.defaultPosition).length>0
      },
      defaultPositionArray() {
        let arr = Object.keys(this.defaultPosition).length ? [this.defaultPosition] : [];
        return arr
      },
    },
    watch:{
      'objVal': {
        handler: function(val) {
            this.defaultDepts = [];
            this.defaultUsers = [];
            this.defaultPosition = {};
            this.defaultDepts.push(...val["markSetting[0].viewDeptIds"]);
            this.defaultUsers.push(...val["markSetting[0].viewUserIds"]);
            this.defaultPosition = Object.assign({},val["markSetting[0].postId"]);
        },
        deep: true
      },
      'markType': function(val) {
        this.functionTab = [];
        let arrObj = [{text:'部门'},
                      {text:'标签人员'},
                      {text:'特定人员'},
                      {text:'批量导入'},
                      {text:'高级筛选'}]
        let arrPost = [{text:'职位'}]
        if(val == 1){
            this.functionTab.push(...arrObj);
        }else{
            this.functionTab.push(...arrPost);
        }
      }
    },
    mounted() {
        this.EVENT_BUS.$emit('on-form-item-add', this);
    },
    beforeDestroy () {
        this.EVENT_BUS.$emit('on-form-item-remove', this);
    },
    methods:{
      //删除部门
      deleteDept:function (index) {
        this.defaultDepts.splice(index,1)
        this.EVENT_BUS.$emit('on-set-form-data', {
          key: this.keyName,
            value: {
              "markSetting[0].viewDeptIds": this.defaultDepts,
              "markSetting[0].viewUserIds": this.defaultUsers,
              "markSetting[0].postId": this.defaultPosition
          }
        })
      },
      //删除人员
      deleteUser:function (index) {
        this.defaultUsers.splice(index,1)
        this.EVENT_BUS.$emit('on-set-form-data', {
          key: this.keyName,
          value: {
            "markSetting[0].viewDeptIds": this.defaultDepts,
            "markSetting[0].viewUserIds": this.defaultUsers,
            "markSetting[0].postId": this.defaultPosition
          }
        })
      },
      chooseDone:function (dept,tag,user,post) {
        this.defaultDepts=dept.slice(0);
        this.defaultUsers=user.slice(0);
        post = post.length && post[0];
        this.defaultPosition = Object.assign({}, post);
        this.show = false;
        this.EVENT_BUS.$emit('on-set-form-data',{
            key: this.keyName,
            value: {
                "markSetting[0].viewDeptIds": dept,
                "markSetting[0].viewUserIds": user,
                "markSetting[0].postId": post
            }
        })
        if(post.id){
            this.EVENT_BUS.$emit('on-choose-post',post.id)
        }
      },
      closeThis:function () {
        this.show = false;
      },
      showPick:function () {
        this.show = !this.show
      },
      validate() {
          return new Promise((resolve, reject) => {
            if(this.defaultDepts.length == 0 && this.defaultUsers.length == 0 && Object.keys(this.defaultPosition).length == 0){
              this.showValidate = true;
              resolve({
                    title: this.keyName,
                    status: false
              })
            }else {
                this.showValidate = false;
                resolve({
                    title: this.keyName,
                    status: true
                })
            }
          });
      }
    },
}
</script>

<style lang="scss" scoped>
.qwui-form_item_content {
    line-height: initial;
    .content_button {
        width: 340px;
        line-height: 48px;
        text-align: center;
        border-radius:2px;
        border:1px dashed rgba(203,203,203,1);
        color: #999;
        cursor: pointer;
    }
}
</style>
<style>
.qwui-click_choose{
overflow: auto;
width: 702px;
height: 78px;
padding: 4px 8px;
border: 1px dashed #cccccc;
background: #fff;
border-radius: 2px;
}
.qwui-click_choose_word{
display: inline-block;
width: 100%;
height: 100%;
text-align: center;
font-size: 14px;
line-height: 78px;
color: #999;
}
.qwui-dept_selected{
position: relative;
display: inline-block;
max-width: 275px;
padding-right: 18px;
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
position: absolute;
right: -5px;
top: 0;
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
.qwui-inline{
display: inline;
vertical-align: middle;
}
.qwui-user_default_img{
display: inline-block;
width: 26px;
height: 24px;
margin-right: 5px;
list-style: none;
vertical-align: top;
background: url(~assets/images/touxiang02.png) no-repeat center;
background-size: 26px 24px;
}
.qwui-tag_selected_icon{
display: inline-block;
width: 26px;
height: 24px;
margin-right: 5px;
list-style: none;
vertical-align: top;
background: url(~assets/images/tag_icon02.png) no-repeat center;
}
</style>
