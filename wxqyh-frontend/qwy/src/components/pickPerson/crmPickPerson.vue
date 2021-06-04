<template>
  <div>
      <ul class="qwui-click_choose"  @click="showPick">
        <span class="qwui-click_choose_word" v-show="!selectShow">{{selectText}}</span>
        <!--  部门已选择  -->
        <li class="qwui-dept_selected" v-for="(item,index) in defaultDepts">
          <div class="qwui-dept_selected_icon"></div>
          {{item.nodeName?item.nodeName:item.deptName}}
          <span class="qwui-selected_close" @click.stop.prevent="deleteDept(index)">×</span>
        </li>

        <!--  标签选择  -->
        <li class="qwui-inline">
          <div class="qwui-dept_selected" v-for="(item,index) in defaultTags">
            <div class="qwui-tag_selected_icon"></div>
            {{item.tagName}}
            <span class="qwui-selected_close" @click.stop.prevent="deleteTag(index)">×</span>
          </div>
        </li>

        <!--  人员选择  -->
        <li class="qwui-inline">
          <div class="qwui-dept_selected" v-for="(item,index) in defaultUsers">
            <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
            <div v-else class="qwui-user_default_img"></div>
            {{item.personName}}
            <span class="qwui-selected_close" @click.stop.prevent="deleteUser(index)">×</span>
          </div>
        </li>

        <!--  管理员选择  -->
        <li class="qwui-inline">
          <div class="qwui-dept_selected" v-for="(item,index) in defaultAdmin">
            <div class="qwui-admin_selected_icon"></div>
            {{item.userName}}
          </div>
        </li>
      </ul>

      <pick-person :show="show"
                   :defaultDepts="defaultDepts"
                   :defaultTags="defaultTags"
                   :defaultUsers="defaultUsers"
                   :defaultAdmin="defaultAdmin"
                   :functionTab="functionTab"
                   :maxDept="maxDept"
                   :maxUser="maxUser"
                   :maxTag="maxTag"
                   :onlyUser="onlyUser"
                   :intersectionDept="intersectionDept"
                   :intersectionTag="intersectionTag"
                   :intersectionUser="intersectionUser"
                   @chooseDone="chooseDone"
                   @closeThis="closeThis"></pick-person>
  </div>
</template>
<script>
  import pickPerson from './pickPerson'
  export default {
    props:{
      //初始化的部门
      useDepts:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的标签
      useTags:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的人员
      useUsers:{
        type:Array,
        default:function(){
          return []
        }
      },
      //初始化的管理员
      useAdmin:{
        type:Array,
        default:function(){
          return []
        }
      },
      //使用的tab
      useTab:{
        type:Array,
        default:function(){
          return []
        }
      },
      //人数最大限制
      maxUser:{
        type:Number,
        default:1000
      },
      //部门最大限制
      maxDept:{
        type:Number,
        default:500
      },
      //标签最大限制
      maxTag:{
        type:Number,
        default:500
      },
      //选择框文案提示
      selectText:{
        type:String,
        default:'点击选择客户类别'
      },
      //标签页：是否只显示人员
      onlyUser:{
        type:Boolean,
        default:false
      },
      //限制的所选部门
      intersectionDept:{
        type:Array,
        default:function(){
          return []
        }
      },
      //限制的所选标签
      intersectionTag:{
        type:Array,
        default:function(){
          return []
        }
      },
      //限制的所选人员
      intersectionUser:{
        type:Array,
        default:function(){
          return []
        }
      },
    },
    data(){
      return{
        show:false,
        defaultDepts:this.useDepts,
        defaultTags:this.useTags,
        defaultUsers:this.useUsers,
        defaultAdmin:this.useAdmin,
        functionTab:this.useTab
      }
    },
    computed:{
      selectShow:function () {
        return this.defaultDepts.length>0 || this.defaultTags.length>0 || this.defaultUsers.length>0 || this.defaultAdmin.length>0
      }
    },
    watch:{
      'useDepts':function (val) {
        this.defaultDepts = val;
      },
      'useTags':function (val) {
        this.defaultTags = val;
      },
      'useUsers':function (val) {
        this.defaultUsers = val;
      },
      'useAdmin':function (val) {
        this.defaultAdmin = val;
      },
    },
    methods:{
      //删除部门
      deleteDept:function (index) {
        this.defaultDepts.splice(index,1)
        this.$emit('chooseDone',this.defaultDepts,this.defaultTags,this.defaultUsers)
      },
      //删除标签
      deleteTag:function (index) {
        this.defaultTags.splice(index,1)
        this.$emit('chooseDone',this.defaultDepts,this.defaultTags,this.defaultUsers)
      },
      //删除人员
      deleteUser:function (index) {
        this.defaultUsers.splice(index,1)
        this.$emit('chooseDone',this.defaultDepts,this.defaultTags,this.defaultUsers)
      },
      chooseDone:function (dept,tag,user,position,admin) {
        this.defaultDepts=dept.slice(0);
        this.defaultTags=tag.slice(0);
        this.defaultUsers=user.slice(0);
        this.defaultAdmin=admin.slice(0);
        this.show = false;
        this.$emit('chooseDone',dept,tag,user,position,admin)
      },
      closeThis:function () {
        this.show = false;
      },
      showPick:function () {
        this.show = !this.show
      },
    },
    components:{
      pickPerson,
    }
  }
</script>
<style scoped>
  .qwui-click_choose{
    overflow: auto;
    width: 702px;
    height: 78px;
    margin: 0 20px;
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
    display: inline-block;
    width: auto;
    height: 24px;
    margin: 5px 5px 0 0;
    line-height: 24px;
    list-style: none;
    background-color: #fff;
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
    background: url(../../assets/images/dept_icon.png) no-repeat center;
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
    background: url(../../assets/images/user_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
  .qwui-tag_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/tag_icon.png) no-repeat center;
  }
  .qwui-admin_selected_icon{
    display: inline-block;
    width: 26px;
    height: 24px;
    margin-right: 5px;
    list-style: none;
    vertical-align: top;
    background: url(../../assets/images/admin_icon.png) no-repeat center;
    background-size: 22px 22px;
  }
</style>
