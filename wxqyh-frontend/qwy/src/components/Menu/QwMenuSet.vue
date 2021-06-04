<template>
  <div class="qwui-menu_set">
    <div class="qwui-top_main_bar">
      <a @click="goBack" class="qwui-return_setting_btn"></a>
    </div>
    <div class="qwui-menu_main">
      <SortableList lockAxis="y" v-model="menuList" :lockToContainerEdges="lockToContainerEdges" :pressDelay="pressDelay">
        <SortableItem v-for="(list, index) in menuList" @addFirstMenu="addFirstMenu" @deleteFirstMenu="deleteFirstMenu" :index="index" :key="index" :list="list"/>
      </SortableList>
    </div>
    <div class="qwui-menu_operation">
      <qwuiButton v-perm="'menuUpdate'" @click="saveAndPublicMenu();">&nbsp;保存草稿&nbsp;</qwuiButton>
      <qwuiButton v-perm="'menuPublish'" @click="saveAndPublicMenu('public');" class="qwui-release" type='primary'>&nbsp;发布&nbsp;</qwuiButton>
      <qwuiButton v-perm="'menuReduce'" @click="loadDefaultMenu">&nbsp;加载默认&nbsp;</qwuiButton>
    </div>
  </div>
</template>

<script>
  // Using an ES6 transpiler like Babel
  import {ContainerMixin, ElementMixin} from 'vue-slicksort';
  import {ajaxGetMenus,ajaxGetDefaultMenus,saveMenu,publishMenu} from './api/getData';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';

  const SortableSecondList = {
    mixins: [ContainerMixin],
    template: `
    <div>
      <slot />
    </div>`,
  };

  const SortableSecondItem = {
    mixins: [ElementMixin],
    props: ['item','index'],
    template: `
        <div class="qwui-second_menu">
            <i class="qwui-box"></i>
            <input type="text" class="qwui-set qwui-set_name" placeholder="子菜单名称" v-model="item.menuName">
            <div class="qwui-icon qwui-delete_icon" @click="deleteSecondMenu(index)">
              <i class="qwui-sign qwui-minus_sign">-</i>
            </div>
            <input type="text" class="qwui-set qwui-set_url" v-model="item.menuUrl" placeholder='输入点击菜单后跳转的链接，设置发布后24小时内生效(Tips:必须以http://或https://开头)'>
        </div>
    `,
    methods:{
      deleteSecondMenu(index){
        this.$emit('deleteSecondMenu',index);
      }
    }
  };

  const SortableList = {
    mixins: [ContainerMixin],
    template: `
    <ul class="qwui-menu_ul">
      <slot />
    </ul>`,
  };

  const SortableItem = {
    mixins: [ElementMixin],
    props: ['list','index'],
    data() {
      return {
        lockToContainerEdges:true,
        pressDelay:100,
      }
    },
    template: `
    <li class="qwui-menu_li">
          <SortableSecondList lockAxis="y" :pressDelay="pressDelay" v-model="list.list" :lockToContainerEdges="lockToContainerEdges">
            <SortableSecondItem  v-for="(item, index) in list.list" @deleteSecondMenu="deleteSecondMenu" :index="index" :key="index" :item="item"></SortableSecondItem>
          </SortableSecondList>
          <div class="qwui-first_menu">
            <input type="text" class="qwui-set qwui-set_name" placeholder="主菜单名称" v-model="list.menuName">
            <div class="qwui-icon qwui-add_icon" @click="addSecondList">
              <i class="qwui-sign qwui-plus_sign">+</i>
            </div>
            <input type="text"
            v-model="list.menuUrl"
            class="qwui-set qwui-first_set_url"
            :disabled="list.list.length>0?true:false"
            placeholder='输入点击后跳转的链接；存在子菜单时不可设置；最多只能创建5个子菜单；设置发布后24小时内生效'>
          </div>
          <div v-if="index<=0" class="qwui-addli_icon" @click="addFirstMenu">
            <i>+</i>
          </div>
          <div v-else class="qwui-deleteli_icon" @click="deleteFirstMenu">
            <i>-</i>
          </div>
        </li>`,
    methods:{
      deleteSecondMenu(deleteIndex){
        this.list.list.splice(deleteIndex,1);
      },
      addFirstMenu(){
        this.$emit('addFirstMenu');
      },
      deleteFirstMenu(){
        this.$emit('deleteFirstMenu',this.index);
      },
      addSecondList(){
        if(this.list.list.length>=5){
          return;
        }
        this.list.list.push({
          list: [],
          menuName: "",
          menuUrl: "",
          type: "",
        });
      },
    },
    components:{
      SortableSecondList,
      SortableSecondItem
    }
  };

  export default {
    name: 'QwMenuSet',
    mounted(){
      ajaxGetMenus((data)=>{
        this.menuList = data.list;
      });
    },
    data() {
      return {
        lockToContainerEdges:true,
        menuList:[],
        pressDelay:100,
      }
    },
    methods:{
      goBack(){
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      //加载默认菜单
      loadDefaultMenu(){
        ajaxGetDefaultMenus((data)=>{
          this.menuList = data.list;
        });
      },
      //保存和发布菜单
      saveAndPublicMenu(type){
        let self = this;
        let nameNullCount = 0;
        let menunamecheck = 0;
        this.menuList.forEach(function(list,index){
          list.list.forEach(function(iList,iIndex){
            if(iList.menuName==''){
              nameNullCount++;
              return;
            }
            if(iList.menuUrl==''){
              dataBase.top_alert('请填写二级菜单的链接',false,3000);
              menunamecheck++;
              return;
            }
          });
          if(menunamecheck!=0){
            return;
          }
          if(list.menuUrl==''&&list.list.length==0){
            dataBase.top_alert('请填写一级菜单的链接',false,3000);
            return;
          }
          if(list.menuName==''){
            nameNullCount++;
          }
          if(nameNullCount!=0){
            dataBase.top_alert('菜单名字不能为空',false,3000);
            return;
          }
        });
        if(nameNullCount==0&&menunamecheck==0){
          let json = self.getJsonStr();
          if(type=='public'){
            dataBase.alert("提示信息","发布后将覆盖应用现有菜单，确定发布？",function(){
              publishMenu(json,()=>{
                dataBase.top_alert('发布成功，应用新菜单将在24小时内生效！',true,3000);
              });
            });
          }else{
            saveMenu(json,(data)=>{
              dataBase.top_alert('保存成功，如需启用新菜单，请点击发布按钮！',true,3000);
            });
          }
        }
      },
      //获取菜单json参数对象
      getJsonStr(){
        let self = this;
        let json = '{"data":{';
        json +='"list":[';
        self.menuList.forEach(function(list,index){
          json+="{";
          json+='"menuName"'+':"'+list.menuName.trim()+'",';
          if(list.list.length==0){
            json+='"menuUrl"'+':"'+list.menuUrl.trim()+'",';
            json+='"menuType"'+':"'+self.getMenuType(list.menuUrl,1)+'",';
          }else{
            json+='"menuUrl":"",';
            json+='"menuType":"'+self.getMenuType("",1)+'",';
          }
          //判断http://或https://开头，设置类型
          json+='"type":"'+list.type.trim()+'",';
          //按顺序设置menuIndex
          json+='"menuIndex":"'+index+'",';
          //为二级菜单增加list属性
          json+='"list":[';
          list.list.forEach(function(iList,iIndex){
            //如果二级菜单都不为空，才可以保存
            if(iList.menuName!=''&&iList.menuUrl!=''){
              json+='{';
              json+='"menuName"'+':"'+iList.menuName.trim()+'",';
              json+='"menuUrl"'+':"'+iList.menuUrl.trim()+'",';
              json+='"menuType"'+':"'+self.getMenuType(iList.menuUrl,2)+'",';
              //判断http://或https://开头，设置类型
              json+='"type":"'+iList.type.trim()+'",';
              //按顺序设置menuIndex
              json+='"menuIndex":"'+iIndex+'",';
              json+='"list":[]';
              json+='}';
              //判断是不是最后，增加逗号
              if(iIndex<list.list.length-1){
                json+=',';
              }
            }
          });
          json+=']';
          json+="}";
          //判断是不是最后，增加逗号
          if(index<self.menuList.length-1){
            json+=',';
          }
        });
        json+=']';
        json+='}}';
        return json;
      },
      //获取菜单类型
      getMenuType(strUrl,level){
        //0:一级菜单,1:key类型,2:http://https://类型
        var type="0";
        var tmpUrl=strUrl.trim();
        tmpUrl=tmpUrl.toLowerCase();
        if(tmpUrl==""){
          if(level=="1"){
            type="0";
          }else{
            type="1";//子菜单默认为key
          }
        }else{
          var index1 = tmpUrl.indexOf('http://');
          var index2 = tmpUrl.indexOf('https://');
          if(index1==0||index2==0){
            type="2";
          }else{
            //判断是否带有corp_id=@corp_id@，有则为我们的链接
            var urlArray=["@pre_url@"];
            var isUrl=false;
            for(var i=0;i<urlArray.length;i++){
              if(tmpUrl.indexOf(urlArray[i])==0){
                isUrl=true;
                break;
              }
            }
            if(isUrl){
              type="2";
            }else{
              type="1";
            }
          }
        }
        return type;
      },
      deleteFirstMenu(index){
        this.menuList.splice(index,1);
      },
      addFirstMenu(){
        if(this.menuList.length>=3){
          return;
        }
        this.menuList.push({
          list: [],
          menuName: '',
          menuUrl: '',
          type: "",
        });
      }
    },
    components: {
      SortableItem,
      SortableList,
      qwuiButton,
    }
  }
</script>

<style lang="scss">
  @mixin outer-right-icon{
    border-radius: 50%;
    cursor: pointer;
    height: 17px;
    position: absolute;
    top: 50%;
    right: -30px;
    width: 17px;
    margin-top: -10px;
    display: inline-block;
  }

  .qwui-menu_set{
    min-width: 960px;
    .qwui-top_main_bar{
      padding: 20px 0;
      border-bottom: 1px solid #dbdbdb;
      .qwui-return_setting_btn{
        padding: 5px 20px;
        background: url(~assets/images/back_icon.png) no-repeat center;
        cursor: pointer;
      }
    }
    .qwui-menu_main{
      position:relative;
      padding: 20px 30px 0;
      .qwui-menu_ul{
      }
    }
    .qwui-menu_operation{
      border-top: 1px solid #dbdbdb;
      padding: 20px 0;
      text-align: center;
      .qwui-release{
        margin: 0 10px;
      }
    }
  }

  .qwui-menu_li{
    position: relative;
    list-style: none;
    border: 1px solid #ccc;
    padding: 20px 0;
    background: #f6f5f4;
    margin-bottom: 20px;
    user-select: none;
    cursor:move;
    .qwui-addli_icon{
      background: none repeat scroll 0 0 #80c056;
      @include outer-right-icon;
      i{
        color: white;
        font-size: 19px;
        font-style: normal;
        font-weight: bold;
        left: 1px;
        position: absolute;
        top: -6px;
      }
    }
    .qwui-deleteli_icon{
      background: #df4949;
      @include outer-right-icon;
      i{
        color: white;
        font-size: 34px;
        font-style: normal;
        left: 1px;
        position: absolute;
        top: -20px;
      }
    }
  }

  .qwui-second_menu,.qwui-first_menu{
    padding: 0 20px;
    &:hover{
      background: #e5e5e5;
    }
    .qwui-box{
      border-color: #ccc transparent transparent #ccc;
      border-style: solid;
      border-width: 1px;
      display: inline-block;
      height: 10px;
      margin-right: 5px;
      width: 10px;
      margin-left: 5px;
    }
    .qwui-set{
      padding: 6px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 5px 0;
      border: 1px solid #cccccc;
      border-radius: 4px;
      transition: border linear 0.2s, box-shadow linear 0.2s;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      &:focus{
        border-color: rgba(82, 168, 236, 0.8);
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
      }
    }
    .qwui-set_name{
      width: 106px;
    }
    .qwui-set_url{
      text-align: left;
      margin: 5px 0 5px 28px;
      padding: 6px;
      width: 630px;
    }
    .qwui-first_set_url{
      padding: 6px;
      width: 655px;
      color: #666;
      margin: 5px 0 5px 30px;
      text-align: left;
    }
    .qwui-icon{
      border-radius: 50%;
      cursor: pointer;
      height: 17px;
      position: relative;
      top: 5px;
      width: 17px;
      margin-left: 10px;
      margin-top: 8px;
      display: inline-block;
      &.qwui-delete_icon{
        background: #df4949;
      }
      &.qwui-add_icon{
        background: #80c056;
      }
      .qwui-sign,.qwui-sign {
        color: white;
        font-style: normal;
        left: 1px;
        position: absolute;
        &.qwui-minus_sign {
          top: -20px;
          font-size: 34px;
        }
        &.qwui-plus_sign{
          top: -6px;
          font-size: 19px;
          font-weight: 700;
        }
      }
    }
  }
</style>
