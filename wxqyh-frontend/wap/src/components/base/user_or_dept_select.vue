<template>
  <div class="qwui-userOrDept_select" v-model="selectconfig" @click="closeLetterList($event)">
    <!--搜索框-->
    <div class="qwui-selectSearch_box" v-show="!resultDemo">
      <div class="qwui-search_back_box" @click="cancel">
        <span class="icon_search_back"></span>
        <span v-if="closeAllTab && tabActive == 'dept'" class="icon_back_text">{{$t('i18n.cancel')}}</span>
      </div>
      <div v-if="!closeAllTab || tabActive != 'dept'" class="qwui-searchTool_box">
        <div class="qwui-search_button" @click="showSearch">
          <i class="qwui-user_search"></i>
          <span>{{$t('i18n.npn')}}</span>
        </div>
        <div class="qwui-search_more" @click="letterListShow">
          <span class="qwui-search_letter_btn"><i class="qwui-ic_letterList"></i></span>
          <div class="qwui-letter_list" v-show="letterList" style="z-index: 9;top:44px">
            <ul class="clearfix">
              <li v-for="(item,index) in letter" :key="index" @click="letterSearch(item)"><a>{{item}}</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
    <!--选人、部门tab菜单-->
    <div class="qwui-userOrDept_selectTab" v-if="!closeAllTab && !resultDemo && tab.len!=1" @click="switchTab($event)">
      <div class="selectTab_item flexItem" :class="{active:tab.active=='group'}" dataType="group"
           v-if="!closeGroup && tab.group.show">{{$t('i18n.common')}}</div>
      <div class="selectTab_item" :class="{active:tab.active=='user'}" dataType="user"
           v-if="!closeUser && tab.user.show">{{$t('i18n.member')}}</div>
      <div class="selectTab_item" :class="{active:tab.active=='tag'}" dataType="tag"
           v-if="!closeTag  && userRestriction != 1 && tab.tag.show">{{$t('i18n.tag')}}</div>
      <div class="selectTab_item" :class="{active:tab.active=='dept'}" dataType="dept"
           v-if="!closeDept &&  tab.dept.show">{{$t('i18n.department')}}</div>
    </div>

    <!--选择页面-->
    <!--常用群组、常用联系人-->
    <div class="qwui-userOrDept_select_content" v-show="!resultDemo && !closeGroup && tab.active=='group'">
      <div class="qwui-selectMain_item">
        <!--常用群组-->
        <div v-show="userRestriction != 1">
          <div class="qwui-selectMain_item_title">
            <div class="qwui-selectMain_item_name"
                 @click.prevent="groupShowFunc">
              {{$t('i18n.commonlyGroups')}}
              <span class="seeGroupTipBox" @click.stop.prevent="showDialogConfig('group')"><i class="seeGroupTip"></i></span>
            </div>
            <i class="icon_select_arrow" :class="{active:groupShow}"></i>
          </div>
          <div v-show="groupShow">
            <mb-tagdata v-if="groupData.length>0"
                        :message="groupData"
                        :selectdata="groupDataSelected"
                        :userselected="userSelected"
                        :type="'group'"
            >
            </mb-tagdata>
            <contentTip v-bind="noContent" v-else>
              <span class="no_content_text">暂无常用群组，可前往通讯录应用中添加</span>
            </contentTip>
          </div>
        </div>
        <!--常用联系人-->
        <div>
          <div class="qwui-selectMain_item_title">
            <div class="qwui-selectMain_item_name"
                 @click.prevent="showCommonList = !showCommonList">
              {{$t('i18n.commonlyContacts')}}
              <span class="seeGroupTipBox" @click.stop.prevent="showDialogConfig('contact')"><i class="seeGroupTip"></i></span>
            </div>
            <i class="icon_select_arrow" :class="{active:showCommonList}"></i>
          </div>

          <div v-if="showCommonList">
            <mb-userlist v-if="commonList.data.length>0"
                         :message="commonList.data"
                         :selectdata="groupDataSelected"
                         :userselected="userSelected"
                         :userRestriction="userRestriction"
                         :tab="{show:false,select:true,arrow:false}"
                         @selUser="selUser"
            >
            </mb-userlist>

            <contentTip v-bind="noContent" v-else>
              <span class="no_content_text">暂无常用联系人</span>
            </contentTip>

          </div>
        </div>
      </div>
    </div>
    <!--成员、组织架构-->
    <div class="qwui-userOrDept_select_content" v-show="!resultDemo && !closeUser && tab.active=='user'" v-handleScroll="scrollFun">
      <div class="qwui-selectMain_item">
        <!--按组织\按成员选项-->
        <div class="qwui-selectMain_item_title" v-if="userSelectType!='onlyUser'">
          <div class="qwui-selectMain_item_name"
               @click="controlUserStructure">{{userStructure==1 ? $t('i18n.selectByOrganization'): $t('i18n.selectByContactList')}}</div>
          <i class="icon_select_arrow"></i>
        </div>

        <!--字母排序人员列表-->
        <div class="" v-show="userStructure==1">
          <mb-userlist v-if="userList.data.length"
                       :message="userList.data"
                       :selectdata="groupDataSelected"
                       :userselected="userSelected"
                       :userRestriction="userRestriction"
                       :tab="{show:true,select:true,arrow:false}"
                       @selUser="selUser"
          ></mb-userlist>
          <div class="qwui-user_item_more" v-if="loadMoreTips!=''">
            <p>
              <i class="qwui-icon_loadingMore"
                 v-show="loadMoreTips==$t('i18n.loading')"
              ></i>
              {{loadMoreTips}}
            </p>
          </div>
        </div>
        <!--部门排序列表-->
        <div class="" v-show="userStructure==2">
          <div class="qwui-selectMain_itemTitle" v-if="orgUserList.upperLevel.length!=0">
            <div class="qwui-selectMain_itemTitle_left" :style="{width:orgUserList.upperLevel[orgUserList.upperLevel.length-1].id!=''?'150px':'30px'}">
              <span class="fl cblue" @click="userStructureInit('')">{{$t('i18n.all')}}</span>
              <span class="fl" v-if="orgUserList.upperLevel[orgUserList.upperLevel.length-1].id!=''"
                    @click="goBack_user(orgUserList.upperLevel)">
                                  <span class="lh20 c999 ml5">&gt; ... &gt; </span>
                                  <span class="cblue">{{$t('i18n.goBack')}}</span>
                               </span>
            </div>
            <div class="qwui-selectMain_itemTitle_ellipsis" v-show="orgUserList.deptName">&gt; {{orgUserList.deptName}}</div>
          </div>
          <user-dept v-if="orgUserList.deptList_d.length>0 && showDept" :message="orgUserList" :deptselected="deptSelected"
                     :tab="{show:true,select:false,arrow:true}" @userStructureInitFunc="userStructureInitFunc" @selDept="selDept"></user-dept>
          <mb-userlist v-if="orgUserList.userList_d.length>0" :message="orgUserList.userList_d" :selectdata="groupDataSelected"
                       :userselected="userSelected" :userRestriction="userRestriction" :tab="{show:false,select:true,arrow:false}" @selUser="selUser"></mb-userlist>
          <p class="qwui-text_tips" v-show="noMoreUserMessage!=''">{{noMoreUserMessage}}</p>
        </div>
      </div>
    </div>
    <!--标签-->
    <div class="qwui-userOrDept_select_content" v-show="!resultDemo && !closeTag && tab.active=='tag' && userRestriction != 1">
      <div class="qwui-selectMain_item">
        <!--标签-->
        <div class="qwui-selectMain_item_title" v-show="!closeAllTab">
          <div class="qwui-selectMain_item_name">{{$t('i18n.selectPeopleByLabel')}}</div>
          <!--<i class="icon_select_arrow" :class="{active:tagShow}"></i>-->
        </div>
        <div v-show="tagShow">
          <mb-tagdata v-if="tagData.length>0"
                      :message="tagData"
                      :selectdata="groupDataSelected"
                      :userselected="userSelected"
                      :tagSelect="tagSelect"
                      :type="'tag'"
                      @handleTagSelect="handleTagSelect"
          >
          </mb-tagdata>
          <contentTip v-bind="noContent" v-else>
            <span class="no_content_text">暂无标签，可联系管理员在管理后台添加</span>
          </contentTip>
        </div>
      </div>
    </div>
    <!--部门-->
    <div class="qwui-userOrDept_select_content" v-show="!resultDemo && !closeDept && tab.active=='dept'">
      <div class="qwui-selectMain_item">
        <div class="qwui-selectMain_itemTitle" v-if="deptList.upperLevel.length!=0">
          <div class="qwui-selectMain_itemTitle_left" :style="{width:deptList.upperLevel[deptList.upperLevel.length-1].id!=''?'150px':'30px'}">
            <span class="fl cblue" @click="deptListInit('')">{{$t('i18n.all')}}</span>
            <span class="fl" v-if="deptList.upperLevel[deptList.upperLevel.length-1].id!=''"
                  @click="goBack_dept(deptList.upperLevel)">
                              <span class="lh20 c999 ml5">&gt; ... &gt; </span>
                              <span class="cblue">{{$t('i18n.goBack')}}</span>
                           </span>
          </div>
          <div class="qwui-selectMain_itemTitle_ellipsis" v-show="deptList.deptName">&gt; {{deptList.deptName}}</div>
        </div>
        <mb-deptlist v-if="deptList.data.length>0" :message="deptList"
                     :deptselected="deptSelected" @deptListInitFunc="deptListInitFunc" @selDept="selDept"></mb-deptlist>
        <p class="qwui-text_tips" v-show="deptList.data.length==0 && showNoDeptListTip!=''">{{showNoDeptListTip}}</p>
      </div>
    </div>

    <div class="qwui-userOrDept_select_content" v-show="!resultDemo && tab.active=='rang'">
      <div class="qwui-selectMain_item">
        <mb-userlist v-if="rangData.data.length>0" :message="rangData.data" :selectdata="groupDataSelected"
                     :userselected="userSelected" :userRestriction="userRestriction" :tab="{show:true,select:true,arrow:false}"@selUser="selUser"></mb-userlist>
      </div>
    </div>
    <!--垫高-->
    <div class="qwui-userOrDept_select_footheight"></div>
    <!--选择页面 end-->

    <!--已选结果-->
    <div class="qwui-userOrDept_footer_box" v-show="!resultDemo">
      <div class="selected" @click="showResult">
        <span v-if="filterSelectResult" class="select_text">{{$t('i18n.selected')}}:</span>
        <div class="select_result">
          <span v-if="deptSelected.data.length>0">{{deptSelected.data.length}} {{$t('i18n.department')}}</span>
          <span v-if="filterTagResult">{{tagDataSelected.data.length}}{{$t('i18n.tag')}}</span>
          <span v-if="userSelected.data.length>1">{{userSelected.data.length}}{{$t('i18n.member')}}</span>
          <span v-if="userSelected.data.length==1">{{userSelected.data[0].personName}}</span>
        </div>
      </div>
      <div class="qwui-userOrDept_footer">
          <span class="btn_box"
                @click="confirm">{{$t('i18n.confirm')}}</span>
      </div>
    </div>
    <!--已选页面-->
    <div id="userOrDept_select_r" class="qwui-selectBox_page" v-show="resultDemo">
      <div class="qwui-selectSearch_box" v-show="!resultShow">
        <!--搜索框-->
        <div class="qwui-search_outer">
          <div class="qwui-search_inner_bar">
            <input type="text" ref="input" class="qwui-search_input" @keyup.enter="enterSearch" v-model="searchData.keyWord"
                   v-focus="searchData.focus" :placeholder="$t('i18n.npn')" required="">
          </div>
          <div class="qwui-search_outer_icon">
            <a @click="clearInputVal" v-show="searchData.keyWord!=''"><i class="qwui-icon_del"></i></a>
            <a @click="enterSearch"><i class="qwui-user_search"></i></a>
          </div>
        </div>
        <!--搜索框字母按钮-->
        <div class="qwui-search_more" @click="letterListShow">
          <a class="qwui-search_letter_btn"><i class="qwui-ic_letterList"></i></a>
          <div class="qwui-letter_list" v-show="letterList">
            <ul class="clearfix">
              <li v-for="(item,index) in letter" :key="index" @click="letterSearch(item)"><a>{{item}}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="qwui-userOrDept_search_keyWord" v-handleScroll="scrollSearchFun">
        <!--搜索关键字查询列表-->
        <div v-show="!resultShow">
          <mb-userlist v-if="searchData.data.length>0" :message="searchData.data" :selectdata="groupDataSelected"
                       :userselected="userSelected" :userRestriction="userRestriction" :tab="{show:true,select:true,arrow:false}" @selUser="selUser">
          </mb-userlist>
          <p class="qwui-text_tips" v-show="showNoContentTips">{{$t('i18n.tryAnotherWord')}}</p>
        </div>
        <!--查看勾选结果页面-->
        <div class="qwui-add_user" v-if="resultShow">
          <div class="qwui-add_user_header" v-if="filterSelectResult">{{$t('i18n.selected')}}
            <span  v-if="deptSelected.data.length>0">{{deptSelected.data.length}} {{$t('i18n.department')}}</span>
            <span  v-if="filterTagResult">{{tagDataSelected.data.length}}{{$t('i18n.tag')}}</span>
            <span  v-if="userSelected.data.length>1">{{userSelected.data.length}}{{$t('i18n.member')}}</span>
            <span  v-if="userSelected.data.length==1">{{userSelected.data[0].personName}}</span>
          </div>
          <mb-result
              :userselected="userSelected"
              :deptselected="deptSelected"
              :selectdata="tagDataSelected"
              @selUser="selUser"
              @selDept="selDept"
              @deleteThisTag="deleteThisTag"
            >
          </mb-result>
        </div>
        <div class="qwui-userOrDept_select_footheight"></div>
      </div>
      <!--确定按钮-->
      <div class="qwui-userOrDept_footer_box">
        <div class="selected">
          <span v-if="filterSelectResult && !resultShow" class="select_text">{{$t('i18n.selected')}}:</span>
          <div class="select_result" v-show="!resultShow">
            <span v-if="deptSelected.data.length>0">{{deptSelected.data.length}} {{$t('i18n.department')}}</span>
            <span v-if="filterTagResult">{{tagDataSelected.data.length}}{{$t('i18n.tag')}}</span>
            <span v-if="userSelected.data.length>1">{{userSelected.data.length}}{{$t('i18n.member')}}</span>
            <span v-if="userSelected.data.length==1">{{userSelected.data[0].personName}}</span>
          </div>
        </div>
        <div class="qwui-userOrDept_footer">
          <span class="btn_box"
                @click="closeShowResult">{{$t('i18n.confirm')}}</span>
        </div>
      </div>

    </div>
    <!--弹窗提示-->
    <dialog-group
      :confirmText="$t('i18n.iKnow')"
      v-bind="dialogConfig"
      @confirm="closeDialogConfig"
    >
      <ul class="dialog_text_box">
        <li class="dialog_text_item" v-for="(text,index) in dialogConfig.content" :key="index">
          {{text}}
        </li>
      </ul>
    </dialog-group>
  </div>
</template>


<script>
  import groupTemp from '@/components/base/userOrDeptSelect/group_item_temp';
  import userTemp from '@/components/base/userOrDeptSelect/user_item_temp';
  import deptTemp from '@/components/base/userOrDeptSelect/dept_item_temp';
  import userDept from '@/components/base/userOrDeptSelect/user_dept_temp';
  import resultTemp from '@/components/base/userOrDeptSelect/result_item_temp';
  import contentTip from '@/components/list/load_more';
  import DialogGroup from '@/components/base/dialog/dialog-group'; // 弹窗组件

  export default {
    name: 'userOrDeptSelect',
    directives:{
      handleScroll:{
        bind: function (el, binding) {
          let ele = el;
          ele.handler = function (evt) {
            if (binding.value(evt, ele)) {
              ele.removeEventListener('scroll', ele.handler)
            }
          };
          ele.addEventListener('scroll', ele.handler)
        },
        unbind:function (el) {
          el.removeEventListener('scroll',el.handler)
        }
      }
    },
    props:{
      selectconfig:{
        type:Object,
        default:function () {
          return {}
        }
      },
      closeAllTab:{                     //关闭全部tab
        type: Boolean,
        default: false
      },
      closeGroup:{                  //关闭常用
        type: Boolean,
        default: false
      },
      closeUser:{                  //关闭人员
        type: Boolean,
        default: false
      },
      closeDept:{                  //关闭部门
        type: Boolean,
        default: false
      },
      //关闭标签
      closeTag:{
        type: Boolean,
        default: false
      },
      hasChildRecall:{          //选择子部门的时候有回调
        type:Boolean,
        default: false
      },
      hasFirstRecall:{          //初次加载部门的时候有回调
        type:Boolean,
        default: false
      },
      tabActive:{                   //默认当前tab和页面内容
        type:String,
        default:'group'
      },
      //人员页面的选择类型，默认显示组织部门人员、常用人员列表、字母排序人员
      // 只显示排序人员列表可配置为：onlyUser
      userSelectType: {
        type:String,
        default:''
      },
      userListUrl:{                  //字母排序人员接口
        type:String,
        default:'/portal/selectUserAction!ajaxGetUserListByOrgID.action'
      },
      //部门数据源接口
      deptListUrl:{
        type:String,
        default:'/portal/departmentAction!getChildDept.action'
      },
      //子部门数据源接口
      deptChildUrl:{
        type:String,
        default:'/portal/departmentAction!getChildDept.action'
      },
      //启动真标签
      tagSelect:{
        type: Boolean,
        default: false
      },
      keyWordSearchUrl:{                  //关键词查询接口
        type:String,
        default:'/portal/selectUserAction!searchByNameOrPhone.action'
      },
      letterSearchUrl:{                  //字母开头选择查询接口
        type:String,
        default:'/portal/selectUserAction!searchFirstLetter.action'
      },
      //常用群组和标签
      searchTagPageAction: {
        type:String,
        default:'/portal/tagAction!searchTagPage.action'
      },
      //请求成员列表参数回调
      userRequestData: Function,
      //请求部门列表参数回调
      deptRequestData: Function,
      //请求字母拼音\搜索关键词参数回调
      keyWordRequestData: Function,
      //查询群组和标签参数回调
      searchTagRequestData: Function,
      //组织架构参数回调
      childDeptRequestData: Function
    },
    data() {
      return {
        "actions": {
          "loadDeptUrl": this.deptListUrl,//部门
          "deptChildUrl": this.deptChildUrl,//子部门
          "searchTagPage": this.searchTagPageAction,//常用群组和标签
          "getCommonList": "/portal/selectUserAction!getCommonList.action",//常用联系人
          "userList": this.userListUrl,//按字母顺序的人员数据
          "deptAndUser": "/portal/departmentAction!getChildDeptAndPerson.action",//按组织获取人员数据及子部门
          "getUserForTag": "/portal/tagAction!searchTagGroupRefPage.action",//获取标签下的人员数据
          "getUserForGroup": "/portal/selectUserAction!getUserGroupPerson.action",//获取群组下的人员数据
          "keyWordSearch": this.keyWordSearchUrl,//拼音/手机/名字搜索人员
          "letterSearch": this.letterSearchUrl,//头字母搜索
        },
        dataBase:dataBase,
        "tab": {
          "active": this.tabActive,
          'tag':{
            show: true
          },
          "group": {
            show: true
          },
          "user": {
            show: true
          },
          "dept": {
            show: true
          },
          "len": 3
        },
        //选人上限(选配，不配置默认1000，配1为单选)
        "userRestriction": 1000,
        //选部门上限(选配，不配置默认500，配1为单选)
        "deptRestriction": 500,
        //标签列表显示
        "tagShow": true,
        //常用群组列表显示
        "groupShow": false,
        //结果页显示隐藏
        "resultDemo": false,
        //选择结果页
        "resultShow": false,
        //字母搜索列表
        letterList: false,
        //搜索数据
        "searchData": {
          //接口
          "url": '',
          //输入框关键字
          "keyWord": '',
          //入参关键字
          "searchKeyWord": '',
          //结果数据
          "data": [],
          //当前页数
          "page": 1,
          //最大页数
          "maxPage": 1,
          //阻止多次请求
          "lock_roll": false,
          //输入框是否失焦
          "focus": false
        },
        //人员组织结构和按字母排序互相切换
        "userStructure": 1,//1:按字母；2:按组织结构
        //常用列表数据
        "groupData": {},
        //标签列表数据
        "tagData": {},
        //常用联系人
        "commonList": {
          "data": []
        },
        //范围选人数据
        "rangData": {
          "data": []
        },
        //按字母顺序的人员数据
        "userList": {
          "data": [],
          "page": 1,
          "maxPage": 1,
          "lock_roll": false
        },
        //组织选人数据
        "orgUserList": {
          //数据缓存
          "cacheData": {},
          //第一级数据
          "firstOrg": null,
          //上一级id
          "upperLevel": [],
          //当前部门id
          "deptId": '',
          //当前部门名称
          "deptName": '',
          //组织选人当前部门数据
          "deptList_d": [],
          //组织选人当前人员数据
          "userList_d": [],
        },
        "deptList": {
          //数据缓存
          "cacheData": {},
          //第一级数据
          "firstOrg": null,
          //上一级id
          "upperLevel": [],
          //当前部门id
          "deptId": '',
          //当前部门名称
          "deptName": '',
          //当前部门数据
          "data": []
        },
        //已选群组+标签
        "groupDataSelected": {
          "data": {},
          "idStr": ''
        },
        //已选真标签
        tagDataSelected:{
          data: [],
          idStr: ''
        },
        //已选人员
        "userSelected": {
          "data": [],
          "idStr": ''
        },
        //已选部门
        "deptSelected": {
          "data": [],
          "idStr": ''
        },
        //字母数组
        "letter": ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "*"],
        //回调
        "callBack": {
          "confirm": null,
          "close": null
        },

        //当前第几个页面是显示的
        "demoIndex": 0,
        //当前选人节点id
        "el": '',
        //无更多联系人信息
        noMoreUserMessage:"",//（无更多联系人信息）  提示
        //控制部门显示隐藏
        //显示常用人员列表 ， 默认不显示
        showCommonList: true,
        //无内容提示
        noContent:{
          type: 'commentList',
          colorType: 'FFF',
          borderBottom: true
        },
        showDept:false,//显示部门列表
        showNoDeptListTip:"",//（无更多部门信息） 提示
        showNoContentTips:false,//（显示搜索关键字无内容） 提示
        loadMoreTips:"",//正在加载中
        newCommonUserDeptInitData:{},//新的缓存数据
        oldCommonUserDeptInitData:{},//久的缓存数据
        //弹窗配置
        dialogConfig:{
          show: false
        }
      }
    },
    created: function () {
      this.el=this.selectconfig.signIndex;
      this.callBack.confirm=this.selectconfig.selectList[this.selectconfig.signIndex].callBack.confirm;
      this.callBack.close=this.selectconfig.selectList[this.selectconfig.signIndex].callBack.close;
      //配置已选的人员
      this.userSelectedStart(this.selectconfig.selectList[this.selectconfig.signIndex].userSelected);
      //配置已选部门
      if((this.selectconfig.selectList[this.selectconfig.signIndex].deptSelected && this.selectconfig.selectList[this.selectconfig.signIndex].deptSelected.length)
          || this.selectconfig.selectList[this.selectconfig.signIndex].deptSelectedShow){
        this.deptSelectedStart(this.selectconfig.selectList[this.selectconfig.signIndex].deptSelected);
      }else{
        this.tab.dept.show=false;
      }
      //初始化已选的标签和群组
      if(!this.closeGroup && this.tagSelect && this.selectconfig.selectList[this.selectconfig.signIndex].tagSelected){
        this.tagSelectStart(this.selectconfig.selectList[this.selectconfig.signIndex].tagSelected)
      }
      //限制选人上限
      if(this.selectconfig.selectList[this.selectconfig.signIndex].userRestriction){
        this.userRestriction = this.selectconfig.selectList[this.selectconfig.signIndex].userRestriction;
      }
      //限制选部门上限
      if(this.selectconfig.selectList[this.selectconfig.signIndex].deptRestriction){
        this.deptRestriction = this.selectconfig.selectList[this.selectconfig.signIndex].deptRestriction;
      }
      //初始化部门列表
      if(this.tabActive=='dept' && this.closeGroup && this.closeUser){
        this.deptListInit()
      }
      this.groupDataInit();
      this.commonUserInit();
      this.userListInit();
      this.dealLocalStorage();//处理缓存下来的数据，获取页面高度
    },
    computed:{
      //常用群组数量
      groupDataLength(){
        if(JSON.stringify(this.groupData)=="{}"){
          return 0;
        }else{
          return this.groupData.length;
        }
      },
      //显示已选择描述
      filterSelectResult(){
        return this.userSelected.data.length>0 || this.deptSelected.data.length>0 || this.tagDataSelected.data.length>0
      },
      //已选标签总数
      filterTagResult(){
          return this.tagSelect && this.tagDataSelected.data.length>0
      }
    },
    methods: {
      //显示弹窗提示
      showDialogConfig(type){
        var obj = {
          'group':{
            show: true,
            title: "常用群组",
            content: ['使用常用群组，可快速选择同一批成员', '常用群组可在通讯录应用中添加维护']
          },
          'contact':{
            show: true,
            title: "常用联系人",
            content: ['可在联系人详情中标记“常用联系人”', '应用中经常选择的成员也会自动标记为“常用联系人”','手动标记的排在前面，最多显示20个']
          }
        }
        this.dialogConfig = obj[type]
      },
      //关闭弹窗提示
      closeDialogConfig(){
        this.dialogConfig = {
          show: false
        }
      },
      //字母排序滚动搜索
      scrollFun:function (el) {
        var self = this;
        if(self.tab.active=='user'&&self.userStructure==1){
          var scrollTop = el.target.scrollTop;
          var offsetHeight = el.target.offsetHeight;
          var scrollHeight = el.target.scrollHeight;
          if(scrollTop + offsetHeight >= scrollHeight) {
            // 触发事件，AJAX加载下页的数据
            if(!self.userList.lock_roll){
              self.userList.lock_roll=true;
              if(self.userList.page<self.userList.maxPage){
                self.userList.page++;
                self.userListInit();
              }
            }
          }
        }
      },
      //关键字搜索加载下一页
      scrollSearchFun(el){
        if(!this.resultShow){
          var scrollTop = el.target.scrollTop;
          var offsetHeight = el.target.offsetHeight;
          var scrollHeight = el.target.scrollHeight;
          if(scrollTop + offsetHeight >= scrollHeight) {
            // 触发事件，AJAX加载下页的数据
            if(!this.searchData.lock_roll){
              this.searchData.lock_roll=true;
              if(this.searchData.page<this.searchData.maxPage){
                this.searchData.page++;
                this.loadSearch();
              }
            }
          }
        }
      },
      //切换tab
      switchTab: function (event) {
        if (event.target.className.indexOf("selectTab_item") == -1) {
          return;
        }

        var type = event.target.attributes["0"].nodeValue;
        this.tab.active = type;
        if (type == "dept" && !this.deptList.firstOrg) {
          this.deptListInit();
        }
      },
      // 已选人员配置
      userSelectedStart(data){
      	if(data){
			for(var i=0;i<data.length;i++){
              this.userSelected.data.push(data[i]);
              this.userSelected.idStr+=data[i].userId+'|';
			 }
			}
      },
      //已选部门配置
      deptSelectedStart(data){
        if(data){
          for(var i=0;i<data.length;i++){
            this.deptSelected.data.push(data[i]);
            this.deptSelected.idStr+=data[i].id+'|';
          }
        }
      },
      //初始化真标签选择
      tagSelectStart(data){
        if(data){
          this.tagDataSelected.data.push(...data);
          for(var i=0;i<data.length;i++){
            this.groupDataSelected.data[data.id] = Object.assign({},data[i]);
            this.groupDataSelected.idStr += data[i].id + '|';
            this.tagDataSelected.idStr += data[i].id + '|';
          }
        }
      },
      //标签显示
      tagShowFunc: function () {
        this.tagShow = !this.tagShow
      },
      //常用群组显示
      groupShowFunc: function () {
        this.groupShow = this.groupShow ? false : true;
      },
      //选择结果页面显示
      showResult: function () {
        if (this.tagDataSelected.data.length>0 || this.userSelected.data.length > 0 || this.deptSelected.data.length > 0) {
          this.resultShow = true;
          this.resultDemo = true;
        }
      },
      //关闭选择结果页面
      closeShowResult: function () {
        this.resultShow = false;
        this.resultDemo = false;
      },
      //搜索结果页面显示
      showSearch: function () {
        this.resultShow = false;
        this.resultDemo = true;
        this.searchData.focus = true;
        this.$refs.input.click();
      },
      //控制人员组织结构和按字母排序互相切换
      controlUserStructure: function () {
        if (this.userStructure == 1) {
          this.userStructure = 2;
          this.showDept=true;
          if (this.orgUserList.deptList_d.length == 0 && this.orgUserList.userList_d.length == 0) {
            this.userStructureInit();
          }
        } else {
          this.showDept=false;
          this.userStructure = 1;
        }
      },
      dealLocalStorage(){//处理缓存下来的数据
        var self=this;
        self.newCommonUserDeptInitData.userId=_.userId;
        this.getOldLocalStorage();//判断是否存在缓存
      },
      //判断是否存在缓存
      getOldLocalStorage(){
        var self=this;
        if(localStorage.getItem("userDeptSelect_commonUserInit")){
          self.oldCommonUserDeptInitData=JSON.parse(localStorage.getItem("userDeptSelect_commonUserInit"));
          if(self.oldCommonUserDeptInitData.userId==_.userId){
            if(self.oldCommonUserDeptInitData.groupData){ //取缓存公共群组
              self.groupData = self.oldCommonUserDeptInitData.groupData;
            }
            if(self.oldCommonUserDeptInitData.tagData){//取缓存公共标签
              self.tagData = self.oldCommonUserDeptInitData.tagData;
            }
            if(self.oldCommonUserDeptInitData.commonUserInit){ //取缓存常用联系人
              self.commonList.data = self.oldCommonUserDeptInitData.commonUserInit;
            }
            if(self.oldCommonUserDeptInitData.userList){//取缓存字母排序人员
              self.userList.data=[];
              self.userList.data = self.oldCommonUserDeptInitData.userList.data;
              self.userList.maxPage = self.oldCommonUserDeptInitData.userList.maxPage;
            }
          }
        }
      },
      //初始化常用群组和标签数据
      groupDataInit: function () {
        var self = this;
        var url = this.actions.searchTagPage;
        const params = this.searchTagRequestData?  this.searchTagRequestData() : {};
        this.dataRequest(url, params, function (list) {
          //添加公共群组
          var groupList = list.pageData;
          if (groupList && groupList.length > 0) {
            self.groupData = groupList;
            //缓存数据
            self.newCommonUserDeptInitData.groupData=groupList;
          }
          //添加公共标签
          var publicListcc = list.tagList;
          if (publicListcc && publicListcc.length > 0) {
            self.tagData = publicListcc;
            //缓存数据
            self.newCommonUserDeptInitData.tagData=publicListcc;
          }
        });
      },
      //初始化常用联系人
      commonUserInit: function () {
        var url = this.actions.getCommonList;
        var data = {"agentCode": this.dataBase.wxqyh_uploadfile.agent};
        var self = this;
        this.dataRequest(url, data, function (list) {
          self.commonList.data = list.commonList;
          //缓存数据
          self.newCommonUserDeptInitData.commonUserInit=list.commonList;
        });
      },
      //初始化字母排序人员
      userListInit: function () {
        var url = this.actions.userList;
        const data = {"agentCode": this.dataBase.wxqyh_uploadfile.agent, "page": this.userList.page};
        const params = this.userRequestData?  this.userRequestData({page: this.userList.page}) : data;

        var self = this;
        self.loadMoreTips=self.$t('i18n.loading');
        this.dataRequest(url, params, function (list) {
          if(self.userList.page==1){
            self.userList.data=[];
          }
          for (var i = 0; i < list.pageData.length; i++) {
            self.userList.data.push(list.pageData[i]);
          }
          self.userList.maxPage = list.maxPage;
          //缓存数据
          self.newCommonUserDeptInitData.userList={
            data:self.userList.data,
            maxPage:list.maxPage,
          };
          localStorage.removeItem("userDeptSelect_commonUserInit");
          localStorage.setItem("userDeptSelect_commonUserInit",JSON.stringify(self.newCommonUserDeptInitData));
          self.userList.lock_roll = false;
          self.loadMoreTips="";
        })
      },
      //加载人员组织结构
      userStructureInit: function (id, name) {
        this.userStructureInitFunc(this.orgUserList, id, name);
      },
      //组织选人返回上一级
      goBack_user: function () {
        var arr = this.orgUserList.upperLevel;
        this.userStructureInitFunc(this.orgUserList, arr[arr.length - 1].id, arr[arr.length - 1].name);
        arr.length = arr.length - 2;
      },
      //加载部门数据
      deptListInit: function (id, name) {
        this.deptListInitFunc(this.deptList, id, name)
      },
      //部门返回上一级
      goBack_dept: function () {
        var arr = this.deptList.upperLevel;
        this.deptListInitFunc(this.deptList, arr[arr.length - 1].id, arr[arr.length - 1].name);
        arr.length = arr.length - 2;
      },
      //拼音/手机/名字搜索人员
      enterSearch: function () {
        this.searchData.url = this.actions.keyWordSearch;
        this.searchData.page = 1;
        this.searchData.searchKeyWord = this.searchData.keyWord;
        this.showNoContentTip(null);//判断是否有内容
        this.loadSearch();
      },
      //加载搜索结果
      loadSearch: function () {
        var url = this.searchData.url;

        const data = {"agentCode": this.dataBase.wxqyh_uploadfile.agent, "page": this.searchData.page, "keyWord": this.searchData.searchKeyWord};
        const params = this.keyWordRequestData?  this.keyWordRequestData({"page": this.searchData.page, "keyWord": this.searchData.searchKeyWord}) : data;

        var self = this;
        _.showLoading(self.$t('i18n.loading'));
        this.dataRequest(url, params, function (list) {
          _.hideLoading();
          if (self.searchData.page == 1) {
            self.searchData.focus = false;
            self.searchData.data = list.pageData ? list.pageData : [];
          } else {
            for (var i = 0; i < list.pageData.length; i++) {
              var hasSameId=false;
              for(var  j=0;j<self.searchData.data.length;j++){
                  if(list.pageData[i].id==self.searchData.data[j].id){
                      hasSameId=true;
                      break;
                  }
              }
              if(!hasSameId){
                self.searchData.data.push(list.pageData[i]);
              }
            }
          }
          self.searchData.maxPage = list.maxPage;
          self.showNoContentTip(self.searchData.data);//判断是否有内容
          self.searchData.lock_roll = false;
        });
      },
      //清空搜索框内容
      clearInputVal: function () {
        this.searchData.keyWord = '';
        this.searchData.focus = true;
//        清除关键词后进行全部搜索
        this.enterSearch()
      },
      //字母搜索列表
      letterListShow: function () {
        this.letterList = this.letterList ? false : true;
        this.searchData.focus = false;
      },
      //关闭字母搜索列表
      closeLetterList: function (e) {
        if (!(e.target.className.indexOf('qwui-ic_letterList') != -1 || e.target.className.indexOf('qwui-search_letter_btn') != -1)) {
          this.letterList = false;
        }
      },
      //头字母搜索
      letterSearch: function (keyWord) {
        this.searchData.keyWord = '';
        this.resultShow = false;
        this.resultDemo = true;
        this.searchData.url = this.actions.letterSearch;
        this.searchData.page = 1;
        this.searchData.searchKeyWord = keyWord == "*" ? "" : keyWord;
        this.showNoContentTip(null);//判断是否有内容
        this.loadSearch();
      },
      //判断是否显示无搜索内容提示
      showNoContentTip(data){
        if(Object.prototype.toString.call(data) === "[object Array]" && data.length==0){
          this.showNoContentTips=true;//显示无内容提示
        }else{
          this.showNoContentTips=false;//显示无内容提示
        }
      },
      //取消选择
      cancel: function () {
        if (this.callBack.close) {
          var obj = {
            "user": this.userSelected,
            "dept": this.deptSelected
          };
          this.callBack.close(this.el, obj);
        }
        this.selectconfig.show=false;
      },
      //确定选择
      confirm: function () {
        if (this.selectconfig.selectList[this.el]) {
          if (this.selectconfig.selectList[this.el].userSelected) {
            this.selectconfig.selectList[this.el].userSelected=[];
            for (var i = 0; i < this.userSelected.data.length; i++) {
              this.selectconfig.selectList[this.el].userSelected.push(this.userSelected.data[i]);
            }
          }
          if (this.selectconfig.selectList[this.el].deptSelected) {
            this.selectconfig.selectList[this.el].deptSelected=[];
            for (var i = 0; i < this.deptSelected.data.length; i++) {
              this.selectconfig.selectList[this.el].deptSelected.push(this.deptSelected.data[i]);
            }
          }
        }
        var obj = {
          user: this.userSelected,
          dept: this.deptSelected
        };
        if(this.tagSelect){
          obj.tag = this.tagDataSelected
        }

        if (this.callBack.confirm) {
          this.callBack.confirm(this.el, obj);
        }
        this.selectconfig.show=false;
        this.$emit('chooseDone',obj)
      },
      //加载人员组织结构
      userStructureInitFunc: function (obj, id, name) {
        this.showDept=false;
        _.showLoading(this.$t('i18n.loading'));
        var deptObj = {"id": obj.deptId, "name": obj.deptName};
        obj.upperLevel.push(deptObj);
        if (!id) {
          obj.deptId = '';
          obj.deptName = '';
          obj.upperLevel = []
        } else {
          obj.deptId = id;
          obj.deptName = name;
        }
        var  url = this.actions.deptAndUser;
        var data = {"agentCode": this.dataBase.wxqyh_uploadfile.agent, "sortTop": 1, "deptId": obj.deptId};
        const params = this.childDeptRequestData?  this.childDeptRequestData({"sortTop": 1, "deptId": obj.deptId}) : data;
        var self=this;
        if (obj.deptId == '') {
          if (!obj.firstOrg) {
            this.dataRequest(url, params , function (list) {
              _.hideLoading();
              obj.upperLevel.length = 0;
              obj.firstOrg = list;
              obj.deptList_d = list.deptlist;
              obj.userList_d = list.userList;
              self.showNoDeptList(obj.deptList_d,obj.userList_d);
              self.showDept=true;
            });
          } else {
            _.hideLoading();
            obj.deptList_d = obj.firstOrg.deptlist;
            obj.userList_d = obj.firstOrg.userList;
            self.showNoDeptList(obj.deptList_d,obj.userList_d);
            self.showDept=true;
          }
        } else {
          if (!obj.cacheData[obj.deptId]) {
            this.dataRequest(url, data, function (list) {
              _.hideLoading();
              obj.cacheData[obj.deptId] = list;
              obj.deptList_d = list.deptlist;
              obj.userList_d = list.userList;
              self.showNoDeptList(obj.deptList_d,obj.userList_d);
              self.showDept=true;
            });
          } else {
            _.hideLoading();
            obj.deptList_d = obj.cacheData[obj.deptId].deptlist;
            obj.userList_d = obj.cacheData[obj.deptId].userList;
            self.showNoDeptList(obj.deptList_d,obj.userList_d);
            self.showDept=true;
          }
        }
      },
      //是否显示组织结构无内容提示
        showNoDeptList(deptList_d,userList_d){
        if(deptList_d.length==0 && userList_d.length==0){
          this.noMoreUserMessage=this.$t('i18n.noMoreDep');
        }else{
          this.noMoreUserMessage="";
        }
      },
      //加载部门数据方法
      deptListInitFunc: function (obj, id, name) {
        this.showDept=false;
        _.showLoading();
        var deptObj = {"id": obj.deptId, "name": obj.deptName};
        obj.upperLevel.push(deptObj);
        var url = '';
        if (!id) {
          obj.deptId = '';
          obj.deptName = '';
          obj.upperLevel = []
          url = this.actions.loadDeptUrl;
          if(this.hasFirstRecall == true){
            this.$emit('firstRecall',obj);
          }
        } else {
          obj.deptId = id
          obj.deptName = name;
          url = this.actions.deptChildUrl;
          if(this.hasChildRecall == true){
            this.$emit('childRecall',obj);
          }
        }
        var data = {"agentCode": this.dataBase.wxqyh_uploadfile.agent, "searchDept": 1, "deptId": obj.deptId};
        const params = this.deptRequestData?  this.deptRequestData({"searchDept": 1, "deptId": obj.deptId}) : data;
        var self=this;
        if (obj.deptId == '') {
          if (!obj.firstOrg) {
            this.dataRequest(url, params, function (list) {
              _.hideLoading();
              self.showDept=true;
              obj.upperLevel.length = 0;
              obj.firstOrg = list;
              obj.data = list.deptlist;
              self.showNoDeptListTip= obj.data.length==0? self.$t('i18n.noMoreDep'):"";
            });
          } else {
            _.hideLoading();
            self.showDept=true;
            obj.data = obj.firstOrg.deptlist;
            self.showNoDeptListTip= obj.data.length==0? self.$t('i18n.noMoreDep'):"";
          }
        } else {
          if (!obj.cacheData[obj.deptId]) {
            this.dataRequest(url, data, function (list) {
              _.hideLoading();
              self.showDept=true;
              obj.cacheData[obj.deptId] = list;
              obj.data = list.deptlist;
              self.showNoDeptListTip= obj.data.length==0? self.$t('i18n.noMoreDep'):"";
            });
          } else {
            _.hideLoading();
            self.showDept=true;
            obj.data = obj.cacheData[obj.deptId].deptlist;
            self.showNoDeptListTip= obj.data.length==0? self.$t('i18n.noMoreDep'):"";
          }
        }

      },
      dataRequest: function (url, data, callback, async) {
        var asyncs = async == false ? false : true;
        //showLoading();
        var list=null;
        _.ajax({
          url: _.baseURL + url,
          type: "post",
          data: data,
          dataType: "json",
          async: asyncs,
          success: function (result) {
            if ("0" == result.code) {
              list = result.data;
              if (callback) {
                callback(list);
              }
              //hideLoading();
            } else {
              _.alert('i18n.notice', result.desc);
            }
          }
        });
        return list;
      },
      //添加或删除真标签
      handleTagSelect(id,index){
        if(this.tagDataSelected.idStr.indexOf(id)!=-1){
          for(var i = 0 ; i< this.tagDataSelected.data.length;i++){
            if(this.tagDataSelected.data[i].id == id){
              this.tagDataSelected.data.splice(i,1);
              break;
            }
          }
          this.tagDataSelected.idStr = this.tagDataSelected.idStr.replace(id+"|","");
        } else {
          this.tagDataSelected.idStr+=id+"|";
          this.tagDataSelected.data.push(this.tagData[index]);
        }
      },
      //删除真标签
      deleteThisTag(id,index){
        if(this.tagDataSelected.idStr.indexOf(id)!=-1){
          this.groupDataSelected.idStr = this.groupDataSelected.idStr.replace(id+"|","");
          this.tagDataSelected.data.splice(index,1);
          this.tagDataSelected.idStr = this.tagDataSelected.idStr.replace(id+"|","");
        }
      },
      selUser(self,id){ //添加或删除用户
        var _this=this;
        var userselectedData = self.userselected.data;
        if(self.userselected.idStr.indexOf(id)!=-1){
          var personId = id;
          self.userselected.idStr =self.userselected.idStr.replace(personId+"|","");
          for(var t = 0;t<userselectedData.length;t++){
            if(userselectedData[t].userId==personId){
              userselectedData.splice(t,1);
            }
          }
          if(this.groupDataSelected.idStr!="" ){
            for(var v in this.groupDataSelected.data){
              if(this.groupDataSelected.data[v].idStr && this.groupDataSelected.data[v].idStr.indexOf(personId)!=-1){
                delete this.groupDataSelected.data[v];
                this.groupDataSelected.idStr = this.groupDataSelected.idStr.replace(v+"|","");
              }
            }
          }
        }else{
          if(_this.userRestriction==1){
            self.userselected.idStr='';
            userselectedData.length = 0;
          }else if(_this.userRestriction<userselectedData.length+1){
            _.alert('i18n.confirm',_this.$t("i18n.choosenPerson")+_this.userRestriction);
            return;
          }
          self.userselected.idStr+=id+"|";
          var userData = null;
          for(var i = 0;i<self.message.length;i++){
            if(self.message[i].userId == id){
              userData = self.message[i];
              break;
            }
          }
          userselectedData.push(userData);
        }
      },
      selDept(self,id){
        var _this=this;
        var deptselectedData = self.deptselected.data;
        if(self.deptselected.idStr.indexOf(id)!=-1){
          self.deptselected.idStr =self.deptselected.idStr.replace(id+"|","");
          for(var t = 0;t<deptselectedData.length;t++){
            if(deptselectedData[t].id==id){
              deptselectedData.splice(t,1);
            }
          }
        }else{
          if(_this.deptRestriction==1){
            self.deptselected.idStr='';
            deptselectedData.length = 0;
          }else if(_this.deptRestriction<deptselectedData.length+1){
            _.alert(_this.$t("i18n.choosenDep")+_this.deptRestriction);
            return
          }
          self.deptselected.idStr+=id+"|";
          var deptData = null;
          for(var i = 0;i<self.message.data.length;i++){
            if(self.message.data[i].id == id){
              deptData = self.message.data[i];
              break;
            }
          }
          deptselectedData.push(deptData);
        }
      }
    },
    components: {
      "mb-tagdata": groupTemp,
      "mb-userlist": userTemp,
      'mb-deptlist': deptTemp,
      'mb-result': resultTemp,
      'user-dept': userDept,
      contentTip,
      DialogGroup
    },
  }
</script>

<style>

  .qwui-userOrDept_select{
    display: flex;
    flex-direction: column;
    position: fixed;
    z-index: 12;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: auto;
    background: #fff;
  }

  @media screen and (min-width: 1024px) {
    .qwui-userOrDept_select{
      width: 740px;
    }
  }
  .qwui-userOrDept_select_content{
    flex: 1;
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .qwui-userOrDept_search_keyWord{
    flex: 1;
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .qwui-userOrDept_select_content::-webkit-scrollbar,.qwui-userOrDept_search_keyWord::-webkit-scrollbar{
    width:0px;
    height:6px;
  }
  .qwui-userOrDept_selectTab::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .qwui-userOrDept_selectTab {
    display: flex;
    position: relative;
    left: 0;
    right: 0;
    width: 100%;
    min-height: 49px;
    margin: auto;
    z-index: 3;
    background: #fff;
  }
  @media screen and (min-width: 1024px) {
    .qwui-userOrDept_selectTab,.qwui-selectBox_page {
      width: 740px !important;
    }
  }

  .qwui-userOrDept_select .selectTab_item {
    flex: 1;
    margin: 0 15px 1px;
    font-size: 16px;
    text-align: center;
    line-height: 45px;
    background: #fff;
    cursor: pointer;
  }

  .qwui-userOrDept_select .selectTab_item.active {
    color: #467DB9;
    border-bottom: 4px #468CEB solid;
  }

  .selectMain .itemTitle {
    position: relative;
    margin-top: 1px;
    padding: 0 15px;
    line-height: 40px;
  }
  /*部门、组织*/

  .qwui-dept_item_marginTop .qwui-dept_item .a_link {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    margin-left: 45px;
    color: #666;
  }

  .qwui-dept_item_open .qwui-dept_item .a_link {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: #666;
  }

  .qwui-dept_item {
    position: relative;
    overflow: hidden;
    font-size: 16px;
    background-color: white;
    line-height: 2.2;
    clear: both;
  }
  .qwui-dept_item:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .qwui-dept_item_inner {
    display: flex;
    padding: 10px 15px;
  }


  .qwui-dept_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
    background: url(../../assets/images/dept_ico.jpg) no-repeat;
    background-size: 100%;
  }

  .qwui-dept_item .iconTag {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
    background: url(../../assets/images/icon_common_tag.png) no-repeat;
    background-size: 100%;
  }

  .qwui-dept_item .title {
    flex: 1;
  }

  .qwui-dept_item p {
    line-height: 20px;
  }

  .qwui-dept_item p:last-child {
    font-size: 13px;
    color: #999;
  }
  /*底部按钮*/
  .qwui-userOrDept_footer_box{
    display: flex;
    position: absolute;
    bottom: 0;
    padding: 0 3%;
    width: 94%;
    min-height: 50px;
    box-sizing: content-box;
    background: #fff;
    z-index: 10;
  }
  .qwui-userOrDept_footer_box:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-userOrDept_footer_box .selected {
    display: flex;
    align-items: center;
    text-align: center;
    flex: 1;
  }
  .qwui-userOrDept_footer_box .select_text{
    padding-right: 15px;
    font-size: 15px;
    color:#7A7C80
  }
  .qwui-userOrDept_footer_box .select_result{
    font-size: 15px;
    color: #467DB9;
  }
  .qwui-userOrDept_footer_box .select_result span{
    padding-right: 10px;
  }
  .qwui-userOrDept_footer_box .selected p:first-child{
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
  .qwui-userOrDept_footer_box .selected p:last-child{
    font-size: 14px;
    color: #586c94;
    cursor: pointer;
  }
  .qwui-userOrDept_footer{
    display: flex;
    align-items: center;
  }
  .qwui-userOrDept_footer .btn_box {
    position: relative;
    width: 60px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    display: block;
    cursor: pointer;
    background: #2F7DCD;
  }
  .qwui-userOrDept_footer .btn_box::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
  }
  .qwui-userOrDept_select .qwui-btn_default {
    color: #333!important;
    background: #fbfafc!important;
  }
  .qwui-userOrDept_select .fr{
    float: right;
  }
  .qwui-userOrDept_select_footheight{
    height: 59px;
  }

  .qwui-add_user{
    padding-left: 15px;
    background: #fff;
  }
  .qwui-add_user_header{
    padding-top: 10px;
    font-size: 13px;
    color: #7A7D80;
  }

  .qwui-selectMain_item{
    margin-top: 3px;
    /*overflow-y: scroll;*/
  }
  .qwui-selectMain_itemTitle{
    display: flex;
    position: relative;
    padding: 0 15px;
    font-size: 14px;
    color: #999;
    line-height: 40px;
  }
  .qwui-selectMain_item_title{
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 15px;
    font-size: 16px;
    color: #0A1736;
    line-height: 50px;
  }
  .qwui-selectMain_item_name{
    display: flex;
    align-items: center;
    flex: 1;
  }
  .qwui-selectMain_itemTitle:first-child{
    margin-top: 2px;
  }
  .qwui-selectMain_itemTitle_left{
    display: inline-block;
    width: 30px;
  }
  .qwui-selectMain_itemTitle_left span{
    color: #586c94;
    cursor: pointer;
  }
  .qwui-selectMain_itemTitle_ellipsis{
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-selectMain_itemTitle:after,.qwui-selectMain_item_title:after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .qwui-text_tips{
    margin-top: 30px;
    font-size: 14px;
    color: #999;
    text-align: center;
  }

  .qwui-selectSearch_box{
    display: flex;
    align-items: center;
    position: relative;
    height: 30px;
    min-height: 30px;
    padding: 7px 10px 7px 0;
    margin-top: 2px;
    box-sizing: content-box;
  }
  .qwui-selectSearch_box:after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    border-bottom: 1px solid #e5e5e5;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
  }
  .qwui-search_outer{
    display: flex;
    margin-left: 10px;
    position: relative;
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .qwui-search_outer .qwui-search_inner_bar{
    flex: 1;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    background: #fff;
    z-index: 91;
  }
  .qwui-search_outer_icon{
    display: flex;
    position: relative;
  }
  .qwui-search_outer_icon a{
    display: block;
    position: relative;
    height: 100%;
    padding-right: 10px;
  }
  .qwui-search_button{
    position: relative;
    flex: 1;
    color: #9b9b9b;
    text-align: center;
    line-height: 29px;
    background: #fff;
    border-radius: 4px;
  }
  .qwui-search_button span{
    font-size: 14px;
  }
  .qwui-search_button:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 8px;
  }
  .qwui-search_outer_icon a i{
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: 8px;
    background-size: 14px;
    vertical-align: middle;
  }
  .qwui-user_search{
    background: url("../../assets/images/ic_search.png") no-repeat;
  }
  .qwui-icon_del{
    background: url("../../assets/images/ic_del.png") no-repeat;
    padding-right: 10px;
    border-right: 1px solid #ddd;
  }
  .qwui-search_input{
    width: 95%;
    height: 19px;
    padding: 5px 0 5px 5px;
    border: 0;
    font-size: 13px;
    line-height: 19px;
    box-sizing: content-box;
    background: transparent;
    box-shadow: none;
  }
  .qwui-search_more{
    margin-left: 10px;
  }
  .qwui-letter_list{
    position: absolute;
    z-index: 9;
    left: 0;
    top: 44px;
    width: 100%;
    background: rgba(100,100,100,0.8);
  }
  .qwui-letter_list ul{
    clear: both;
  }
  .qwui-letter_list li{
    float: left;
    list-style: none;
    width: 20%;
  }
  .qwui-letter_list li a{
    display: block;
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    line-height: 45px;
    text-align: center;
    text-decoration: none;
  }
  .qwui-search_letter_btn{
    display: block;
    width: 20px;
    height: 30px;
    font-size: 18px;
    color: #bbb;
    line-height: 30px;
    text-decoration: none;
    text-align: center;
  }
  .qwui-ic_letterList{
    display: inline-block;
    width: 16px;
    height: 13px;
    background: url("../../assets/images/icon_letterList.png") no-repeat 100%;
    background-size: 100%;
  }
  /*正在加载中*/
  .qwui-user_item_more{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }

  .no_content_text{
    position: relative;
    font-size: 13px;
    color: #B2B9C8;
  }
  .qwui-search_back_box{
    display: flex;
    align-items: center;
    padding: 5px 20px 5px 15px;
  }
  .icon_search_back{
    display: inline-block;
    width: 10px;
    height: 16px;
    background: url("../../assets/images/icon_arrow_ccc.png") no-repeat 100%;
    background-size: 100%;
  }
  .icon_select_arrow{
    display: inline-block;
    width: 10px;
    height: 16px;
    background: url("../../assets/images/icon_arrow_dadde4.png") no-repeat 100%;
    background-size: 100%;
    transition: all .2s;
  }
  .icon_select_arrow.active{
    transform: rotate(90deg);
  }
  .seeGroupTipBox{
    padding: 0 20px 0 10px;
    z-index: 2;
  }
  .seeGroupTip{
    display: inline-block;
    width: 15px;
    height: 15px;
    background: url("../../assets/images/icon_select_tip.png") no-repeat 100%;
    background-size: 100%;
    vertical-align: middle;
  }
  .dialog_text_box{
    padding:  15px 25px;
    font-size: 15px;
    color: #596175;
    text-align: left;
  }
  .dialog_text_item{
    position: relative;
    padding-bottom: 10px;
  }
  .dialog_text_item::before{
    content: '';
    position: absolute;
    top: 9px;
    left: -10px;
    width: 6px;
    height: 6px;
    background: #458BE9;
    border-radius: 50%;
  }
  .icon_back_text{
    font-size: 16px;
    color: #666;
    padding-left: 15px;
  }
  .qwui-searchTool_box{
    display: flex;
    flex: 1;
  }
  .qwui-selectBox_page{
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
  }
</style>
