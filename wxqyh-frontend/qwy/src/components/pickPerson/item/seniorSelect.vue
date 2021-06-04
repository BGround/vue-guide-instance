<template>
  <div class="qwui-main_senior_select clearfix" @click="hidePanel">
    <div class="qwui-select_keyword">
      <div v-for="(item,index) in inputData" :key="item.description">
        <div v-if="item.keyWord!=='positions'">
          <p class="qwui-keyword_description">{{item.description}}</p>
          <input type="text" :placeholder="item.placeholder" class="qwui-select_input" v-model="item.val">
        </div>

        <div v-else class="downBox">
          <p class="qwui-keyword_description">{{item.description}}</p>
          <!--  岗位 -->
          <input type="text" placeholder="请选择岗位" readonly @click="job.isShowJob=true" class="qwui-select_input" v-model="job.jobVal">
          <!-- 下拉框 start -->
          <!--<div id="downWrap" class="downWrap" v-if="job.isShowJob">-->
            <!--<div v-if="job.loading" class="jobLoading"></div>-->
            <!--<label v-if="!job.loading" for="selectJobAll"><input id="selectJobAll" @change="checkAllJobFun(item)" type="checkbox" v-model="job.checkAllJob">-->
              <!--全选</label>-->
            <!--<ul>-->
              <!--<li v-for="(jitem,index) in job.list" :key="'j'+index">-->
                <!--<label><input type="checkbox" v-model="job.selectVal" @change="jobSelectChange(item)" name="job" :value="jitem.optionName">-->
                  <!--{{jitem.optionName}}</label>-->
              <!--</li>-->
            <!--</ul>-->
          <!--</div>-->
          <!-- 下拉框 end -->

          <!-- tankuang start -->
          <div class="downPopShow" v-if="job.isShowJob">
          <div class="mask" @click="job.isShowJob=false"></div>
          <div class="downPopWrap">
            <h3>岗位选择</h3>
            <div class="downPopInfo">
              <p>销售</p>
              <ul>
                <li v-if="jitem.catalogName==='销售'" v-for="(jitem,index) in job.list" :key="'j'+index">
                  <label ><input type="checkbox" v-model="job.selectVal" name="job" :value="jitem.optionName">
                    {{jitem.optionName}}</label>
                </li>
              </ul>
              <p>售后</p>
              <ul>
                <li v-if="jitem.catalogName==='售后'" v-for="(jitem,index) in job.list" :key="'j'+index">
                  <label ><input type="checkbox" v-model="job.selectVal" name="job" :value="jitem.optionName">
                    {{jitem.optionName}}</label>
                </li>
              </ul>
            </div>
            <div class="popBtnWrap">
              <div class="selectAllWrap">
                <label v-if="!job.loading" for="selectJobAll"><input id="selectJobAll" @change="checkAllJobFun(item)" type="checkbox" v-model="job.checkAllJob">
                全选</label>
                <span>已选 {{job.selectVal.length}}</span>
                <label>
                  <input style="margin-left: 10px;" type="button" value="清空选择" @click="clearAllJobFun()" class="qwui-button qwui-button_reset">
                </label>

              </div>
              <div class="popBtn">
                <input class="popcancel" @click="job.isShowJob=false" type="button" value="取消">
                <input class="popconfirm" @click="confirmFun(item)" type="button" value="确定">
              </div>
            </div>
          </div>

          </div>

          <!-- tankuang end -->
        </div>
      </div>

      <div v-for="item in dropDownData">

          <p class="qwui-keyword_description">{{item.description}}</p>
          <select class="qwui-search_select" v-model="item.val">
            <option v-for="list in item.chooseArray"
                    :key="list.val"
                    :value="list.val">{{list.optionName}}</option>
          </select>

      </div>

      <div v-for="(item,index) in datePickData" :key="item.description" class="qwui-pick_time">
        <p class="qwui-keyword_description">{{item.description}}</p>
        <vue-datepicker-local v-model="item.time"
                              range-separator="至"
                              clearable></vue-datepicker-local>
      </div>
    </div>

    <!--  右部结果列表  -->
    <div class="qwui-select_result" style="top:0;">
      <div v-show="isInit && total > 0">
        <div class="qwui-result_title">
          <span>全选({{total}})</span>
          <label class="qwui-result_checkbox active" @click.self="selectAll">
            <input type="checkbox" v-model="checkAll">
            <span @click.self="selectAll"></span>
          </label>
        </div>
        <ul class="qwui-result_list_s" ref="personList">
          <li class="qwui-select_list_item clearfix" v-for="(item,index) in loadMore.pageConfig.pageData">
            <img class="qwui-list_item_headpic" v-if="item.headPic&&(item.headPic != '0')" :src="item.headPic">
            <div v-else class="qwui-user_default_img"></div>
            <span class="qwui-list_item_name">{{item.personName}}</span>
            <label :for="item.id" class="qwui-result_checkbox active" @click.self="clickThis()">
              <input type="checkbox"  v-model="userCheckList" :value="item" :id="item.id" :disabled="isDisabled(item)">
              <span @click.self="clickThis()"></span>
            </label>
          </li>
          <li>
            <load-more :loadmore="loadMore"
                       @loadFinished="requestFinished"
                       ref="loadMoreFun"></load-more>
          </li>
        </ul>
      </div>
      <div class="qwui-search_none" v-show="isInit && total == 0 && loadFinished">
        <span class="none_words">没有找到相关数据 换别的条件试试</span>
      </div>
      <div class="qwui-select_result" v-show="!loadFinished">
        <div class="_loading_logo"></div><i></i>
      </div>
      <div class="qwui-init_tips" v-show="!isInit"></div>
      <span class="tips_words" v-show="!isInit">请在左边设置条件进行筛选</span>
    </div>

    <!--  确定搜索  -->
    <div class="qwui-select_btn">
      <span class="qwui-more_con" @click="showEditorView()">更多选择</span>
      <input type="button" value="筛选" @click="search()" class="qwui-button qwui-button_choose">
      <input type="button" value="清空" @click="reset()" class="qwui-button qwui-button_reset">
    </div>

    <!--  自定义筛选条件视图遮罩  -->
    <div class="qwui-editor_mask" v-show="editorView"></div>

    <!--  自定义筛选条件视图  -->
    <div class="qwui-editor_view" v-show="editorView">
      <div class="qwui-editor_title">
        高级筛选条件
        <span class="close_editor" @click="editorView = false">×</span>
      </div>
      <div class="qwui-editor_list">
        <div class="list_item" v-for="(item, index) in editorList">
          <span class="title" @click="foldThis(index)">
            {{item.title}}
            <div class="fold_this" :class="{'expand_this': !editorItemShow[index]}"></div>
          </span>
          <div class="list_item_text" v-show="editorItemShow[index]" v-for="thing in item.word">
            <label :for="thing.keyWord" class="qwui-editor_checkbox">
              <input type="checkbox"  v-model="itemCheckList" :value="thing" :id="thing.keyWord">
              <span></span>
            </label>
            {{thing.text}}
          </div>
        </div>
      </div>
      <div class="qwui-editor_button">
        <input type="button" value="取消" @click="editorView = false" class="qwui-button">
        <input type="button" value="确定" @click="changeEditorView()" class="qwui-button qwui-button_ok">
      </div>
    </div>

  </div>
</template>
<script>
  import VueDatepickerLocal from "vue-datepicker-local";
  import loadMore from './loadMore.vue'
  import {isVipGold} from '@/assets/js/vip-manager';
  import {getKeyParams,getPosition} from '../api/getData'
  export default {
    props:{
      //默认选中人员
      defaultUser:{
        type:Array,
        default:function(){
          return []
        }
      },
      //选择的人数是否超过限制
      isOver:{
        type:Boolean,
        default:false
      },
      //限制的所选部门id组成的string
      intersectionDeptIds:{
        type:String,
        default:''
      },
      //限制的所选标签id组成的string
      intersectionTagIds:{
        type:String,
        default:''
      },
      //限制的所选成员id组成的string
      intersectionUserIds:{
        type:String,
        default:''
      },
    },
    data(){
      return {
        dataBase,
        isInit:false, //是否初始化
        inputData:[ //输入框item
          {
            description:'ERP号',
            placeholder:'ERP号搜索，多个以空格分开',
            val:'',
            keyWord:'deptCode'
          },
          // {
          //   val:'',
          //   description:'岗位',
          //   keyWord:'positions',
          //   chooseArray:[],
          // },
          {
            description:'岗位',
            placeholder:'请选择',
            val:'',
            keyWord:'positions'
          },
          {
            description:'姓名(精确)',
            placeholder:'姓名搜索',
            val:'',
            keyWord:'exactName'
          },
          {
            description:'拼音',
            placeholder:'拼音搜索',
            val:'',
            keyWord:'pinyin'
          },
          {
            description:'手机号',
            placeholder:'手机号搜索',
            val:'',
            keyWord:'mobile'
          },
          {
            description:'帐号',
            placeholder:'请输入',
            val:'',
            keyWord:'wxUserId'
          }
        ],
        dropDownData:[ //下拉框item
          // {
          //   val:'',
          //   description:'岗位',
          //   keyWord:'positions',
          //   chooseArray:[],
          // },
          {
            val:'',
            description:'关注情况',
            keyWord:'userStatus',
            chooseArray:[
              {
                val: '',
                optionName: '全部'
              },
              {
                val: 2,
                optionName: '已关注'
              },
              {
                val: 0,
                optionName: '未关注'
              },
              {
                val: 1,
                optionName: '已取消关注'
              }
            ],
          },
          {
            val:'',
            description:'性别',
            keyWord:'sex',
            chooseArray:[
              {
                val: '',
                optionName: '全部'
              },
              {
                val: 1,
                optionName: '男'
              },
              {
                val: 2,
                optionName: '女'
              }
            ],
          },
        ],
        datePickData:[ //时间选择item
          {
            description:'阳历生日',
            keyWord:'startBirthday',
            keyWordMore:'endBirthday',
            noYear:true,
            time:[]
          },
          {
            description:'农历生日',
            keyWord:'startLunarCalendar',
            keyWordMore:'endLunarCalendar',
            noYear:true,
            time:[]
          },
          {
            description:'入职时间',
            keyWord:'startEntryTime',
            keyWordMore:'endEntryTime',
            time:[]
          },
          {
            description:'创建时间',
            keyWord:'startTimes',
            keyWordMore:'endTime',
            time:[]
          },
          {
            description:'取消关注时间',
            keyWord:'reStartFollowTimes',
            keyWordMore:'reEndFollowTimes',
            time:[]
          },
        ],
        userCheckList:this.defaultUser,//选中列表
        loadFinished:true, //控制接口请求，避免多次
        loadMore:{ //加载更多
          url:"/contact/selectUserMgrAction!ajaxSearch.action",//请求路径
          pageIndexName:"page",//分页参数
          data:{ //ajax入参数据
            intersectionDeptIds:this.intersectionDeptIds,
            intersectionTagIds:this.intersectionTagIds,
            intersectionUserIds:this.intersectionUserIds,
            pageSize:10, //全选时将pageSize置为5000
          },
          pageConfig:{},
        },
        editorView:false, //控制 自定义筛选条件视图 显示
        editorItemShow:[true,true,true], //控制 搜索条目类型 显示
        itemCheckList:[], //选择的 条目 列表
        editorList:[ //筛选条件 type：1表示输入框，2表示下拉框，3表示选择时间
          {
            title:'系统字段',
            word:[
              {
                text:'姓名拼音',
                keyWord:'pinyin',
                placeholder:'拼音搜索',
                type:1
              },
              {
                text:'关注情况',
                keyWord:'userStatus',
                chooseArray:[
                  {
                    val: '',
                    optionName: '全部'
                  },
                  {
                    val: 2,
                    optionName: '已关注'
                  },
                  {
                    val: 0,
                    optionName: '未关注'
                  },
                  {
                    val: 1,
                    optionName: '已取消关注'
                  }
                ],
                type:2
              },
              {
                text:'入职时间',
                keyWord:'startEntryTime',
                keyWordMore:'endEntryTime',
                noYear:false,
                type:3
              },
              {
                text:'成员创建时间',
                keyWord:'startTimes',
                keyWordMore:'endTime',
                noYear:false,
                type:3
              },
              {
                text:'取消关注时间',
                keyWord:'reStartFollowTimes',
                keyWordMore:'reEndFollowTimes',
                noYear:false,
                type:3
              },
/*              {
                text:'标签'
              }*/
            ]
          },
          {
            title:'通讯录基础字段',
            word:[
              {
                text:'姓名(精确)',
                keyWord:'exactName',
                placeholder:'姓名搜索',
                type:1
              },
              {
                text:'性别',
                keyWord:'sex',
                type:2,
                chooseArray:[
                  {
                    val: '',
                    optionName: '全部'
                  },
                  {
                    val: 1,
                    optionName: '男'
                  },
                  {
                    val: 2,
                    optionName: '女'
                  }
                ],
              },
              {
                text:'岗位',
                keyWord:'positions',
                placeholder:'请输入',
                type:1
              },
              {
                text:'帐号',
                keyWord:'wxUserId',
                placeholder:'请输入',
                type:1
              },
              {
                text:'手机号',
                keyWord:'mobile',
                placeholder:'请输入',
                type:1
              },
              {
                text:'阳历生日',
                keyWord:'startBirthday',
                keyWordMore:'endBirthday',
                noYear:true,
                type:3
              },
              {
                text:'农历生日',
                keyWord:'startLunarCalendar',
                keyWordMore:'endLunarCalendar',
                noYear:true,
                type:3
              },
/*              {
                text:'英文名'
              },
              {
                text:'昵称',
              },
              {
                text:'员工编号'
              },
              {
                text:'邮箱',
              },
              {
                text:'微信号'
              },
              {
                text:'所属部门',
              },
              {
                text:'身份证'
              },
              {
                text:'QQ',
              },
              {
                text:'座机'
              },
              {
                text:'座机2',
              },
              {
                text:'地址'
              },*/
            ]
          },
          {
            title:'通讯录自定义字段',
            word:[]
          },
        ],
        checkAll:false, //全选
        job:{
          list:[],
          loading:false,
          isShowJob:false,
          checkAllJob:false, // 全选岗位
          selectVal:[],
          jobVal:''
        }
      }
    },
    created:function () {
      //this.search()
      let self = this;
      getKeyParams(
        this.intersectionDeptIds,
        this.intersectionTagIds,
        this.intersectionUserIds
      ).then(res => { //加载通讯录自定义字段
        res.data.optionVOList.forEach(item => {
          self.editorList[2].word.push({
            text: item.optionName,
            keyWord: 'custom_'+item.id,
            placeholder:'请输入',
            type:1
          })
        })
      })
      this.getPositionFun()
    },
    computed:{
      total:function () {
        return this.loadMore.pageConfig.totalRows || 0
      },
    },
    mounted () { //容器里的下拉加载
      this.box = this.$refs.personList
      this.box.addEventListener('scroll', () => {
        if((this.box.scrollTop + this.box.offsetHeight >= this.box.scrollHeight - 5)&&this.loadFinished){
          this.$refs.loadMoreFun.scrollLoadMore();
        }
      }, false)
    },
    watch:{
      userCheckList:function (val) {
        if(val.length == 0){
          this.checkAll = false
        }
        this.$emit("userChecked", val);
      },
      defaultUser:function (val) {
        this.userCheckList = val
      },
      'loadMore.pageConfig.pageData':function (val) {
        if(val.length>0) {
          var self = this;
          self.userCheckList.forEach(function (e,index) {
            if (e.id == undefined || e.orgId == undefined) {
              let findResult = val.find(item => {
                return item.userId == e.userId
              })
              findResult ? self.userCheckList.splice(index, 1, findResult):''
            }
          })
        }
      }
    },
    methods:{
      // 获取岗位
      getPositionFun(){
        this.job.loading = true
        getPosition().then(res => {
          res.data.pageData.map(item => {
            this.job.list.push({
              val: item.name,
              optionName: item.name,
              catalogName: item.catalogName
            })
          })
          this.job.loading = false
        })
      },
      //岗位全部清空
      clearAllJobFun(){
        this.job.jobVal = ''
        this.job.selectVal = []
        this.job.checkAllJob = false
      },
      // 全选岗位
      checkAllJobFun(arr){
        if(this.job.checkAllJob){
          let temp = []
          let tempName = []
          this.job.list.map(item => {
            temp.push(item.val)
            tempName.push(item.optionName)
          })
          this.job.selectVal = tempName
          arr.val = tempName.join(',')
          this.job.jobVal = tempName.join(',')
        } else {
          this.job.selectVal = []
          arr.val = ''
          this.job.jobVal = ''
        }
      },
      confirmFun(arr){
        this.job.isShowJob=false
        if(this.job.selectVal.length>0){
          let temp = []
          let tempName = []
          this.job.list.map(item => {
            this.job.selectVal.map(ditem => {
              if(item.val === ditem) {
                temp.push(ditem)
                tempName.push(item.optionName)
              }
            })
          })
          this.job.selectVal = tempName
          arr.val = tempName.join(',')
          this.job.jobVal = tempName.join(',')
          if(this.job.selectVal.length === arr.chooseArray.length){
            this.job.checkAllJob = true
          }
        } else {
          this.job.selectVal = []
          arr.val = ''
          this.job.jobVal = ''
        }
      },
      // 单个选择岗位
      // jobSelectChange(arr){
      //   if(this.job.selectVal.length>0){
      //     let temp = []
      //     let tempName = []
      //     this.job.list.map(item => {
      //       this.job.selectVal.map(ditem => {
      //         if(item.val === ditem) {
      //           temp.push(ditem)
      //           tempName.push(item.optionName)
      //         }
      //       })
      //     })
      //     this.job.selectVal = tempName
      //     arr.val = tempName.join(',')
      //     this.job.jobVal = tempName.join(',')
      //     if(this.job.selectVal.length === arr.chooseArray.length){
      //       this.job.checkAllJob = true
      //     }
      //   } else {
      //     this.job.selectVal = []
      //     arr.val = ''
      //     this.job.jobVal = ''
      //   }
      // },
      // 点击岗位框以外的关闭
      hidePanel: function(event){
        var sp = document.getElementById("downWrap");
        if(sp){
          if(!sp.contains(event.target)){            //这句是说如果我们点击到了id为myPanel以外的区域
            this.job.isShowJob = false;
          }
        }
        },
      //点击确定，改变显示的changeEditorView
      changeEditorView(){

        this.editorView = false;
        let self = this;
        self.inputData = [];
        self.dropDownData = [];
        self.datePickData = [];
        self.itemCheckList.forEach((e)=>{
          if(e.type == 1){
            self.inputData.push({
              description:e.text,
              placeholder:e.placeholder,
              val:'',
              keyWord:e.keyWord
            })
          } else if(e.type == 2){
            self.dropDownData.push({
              val:'',
              description:e.text,
              keyWord:e.keyWord,
              chooseArray:e.chooseArray,
            })
          } else {
            self.datePickData.push({
              description:e.text,
              keyWord:e.keyWord,
              keyWordMore:e.keyWordMore,
              noYear:e.noYear,
              time:[]
            })
          }
        })
      },
      //点击更多条件，显示showEditorView
      showEditorView(){
        this.editorView = true;
        this.itemCheckList = [];
        let itemString = '';
        this.dropDownData.forEach(function (e) {
          itemString += (e.keyWord + ',')
        });
        this.inputData.forEach(function (e) {
          itemString += (e.keyWord + ',')
        });
        this.datePickData.forEach(function (e) {
          itemString += (e.keyWord + ',')
        });
        let self = this;
        this.editorList.forEach(function (e) {
          e.word.forEach((item)=>{
            if(itemString.indexOf(item.keyWord) != -1){
              self.itemCheckList.push(item)
            }
          })
        })
      },
      //筛选结果全选
      selectAll(){
        if(this.total <= 0){
          return
        }
        if(!this.checkAll) {
          this.loadMore.data['pageSize'] = 6000;
          this.loadFinished = false;
          this.$refs.loadMoreFun.clearLoadFun();
        } else {
          this.checkAll = false
          let self = this;
          self.loadMore.pageConfig.pageData.forEach((e) => {
            let indexResult = self.userCheckList.findIndex(item => {
              return item.userId == e.userId
            })
            indexResult!=-1 ? self.userCheckList.splice(indexResult,1):''
          })
        }
      },
      clickThis(){
        this.checkAll = false
      },
      //折叠、展开
      foldThis(val){
        let temp = !this.editorItemShow[val];
        this.editorItemShow.splice(val,1,temp)
      },
      //控制是否可以选中
      isDisabled:function (val) {
        return this.isOver && this.userCheckList.findIndex(item => {
          return item.userId == val.userId
        }) == -1
      },
      //重置所有
      reset(){
        this.dropDownData.forEach(function (e) {
          e.val = ''
        })
        this.inputData.forEach(function (e) {
          e.val = ''
        });
        this.datePickData.forEach(function (e) {
          e.time = []
        });
      //  岗位清空
        this.job.jobVal = ''
        this.job.selectVal = []
      },
      //点击搜索，配置参数
      search(){
        let self = this;
        self.dropDownData.forEach(function (e) {
          self.loadMore.data['searchValue.'+ e.keyWord] = e.val
        });
        self.inputData.forEach(function (e) {
          self.loadMore.data['searchValue.'+ e.keyWord] = e.val
        });
        self.datePickData.forEach(function (e) {
          self.loadMore.data['searchValue.'+ e.keyWord] = e.time[0]
            ? (new Date(e.time[0])).Format(e.noYear?"MM-dd":"yyyy-MM-dd")
            :'';
          self.loadMore.data['searchValue.'+ e.keyWordMore] = e.time[1]
            ? (new Date(e.time[1])).Format(e.noYear?"MM-dd":"yyyy-MM-dd")
            :'';
        });
        this.loadFinished = false;
        this.isInit = true;
        this.checkAll = false;
        this.loadMore.data['pageSize'] = 10;
        this.$refs.loadMoreFun.clearLoadFun();
      },
      //接口请求完成
      requestFinished:function () {
        this.loadFinished = true;
        if(this.loadMore.data['pageSize'] == 6000){ //全选
          let self = this;
          if(!isVipGold(self.dataBase.agent?self.dataBase.agent:self.dataBase.agentCode) && self.loadMore.pageConfig.pageData.length > 300){
            self.dataBase.top_alert('超出300人限制',false,2000)
            setTimeout(()=>{
              self.checkAll = false
            },1000);
          } else if(isVipGold(self.dataBase.agent?self.dataBase.agent:self.dataBase.agentCode) && self.loadMore.pageConfig.pageData.length > 20000){
            // self.dataBase.top_alert('超出5000人限制',false,2000)
            self.dataBase.top_alert('超出20000人限制',false,2000)
            setTimeout(()=>{
              self.checkAll = false
            },1000);
          } else {
            self.loadMore.pageConfig.pageData.forEach((e) => {
              let findResult = self.userCheckList.find(item => {
                return item.userId == e.userId
              })
              findResult ? '': self.userCheckList.splice(self.userCheckList.length,0,e)
            })
            self.checkAll = true
          }
        }
      },
    },
    components:{
      VueDatepickerLocal,
      loadMore
    }
  }
</script>
<style scoped>
  .downBox{
    position: relative;
  }
  .downWrap{
    position: absolute;
    left: 0;
    top: 56px;
    width: 220px;
    height: 100px;
    background: #fff;
    overflow-y: scroll;
    padding: 0 0 11px;
    border: 1px solid #ccc;
  }
  .jobLoading{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 30px;
    height:30px;
    background: url('~assets/images/loading.png') no-repeat;
    background-size: contain;
    animation:loading 1.5s infinite linear ;
    -ms-animation:loading 1.5s infinite linear ;
    -moz-animation:loading 1.5s infinite linear ;
    -webkit-animation:loading 1.5s infinite linear ;
  }
  /* tankuang */
  .downPopWrap{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    margin: auto;
    width: 500px;
    background: #fff;
    z-index: 11;
  }
  .mask{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #000;
    opacity: 0.5;
    z-index: 10;
  }
  .downPopWrap h3{
    height: 46px;
    padding-left: 20px;
    color: #333;
    font-size: 18px;
    line-height: 45px;
    text-align: left;
    background: #f6f6f6;
    border-bottom: 1px solid #dddddd;
  }
  .downPopInfo{
    height: 300px;
    padding: 10px;
    overflow-y: auto;
  }
  .downPopInfo p{
    margin-bottom:15px;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
  }
  .downPopInfo ul{
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .downPopInfo ul li{
    width: 28%;
    margin: 0 0 10px 0;
    padding: 0 10px;
    /*border: 1px solid #ccc;*/
  }
  .downPopInfo ul li.current{
    border: 1px solid blue;
    background: blue;
    color: #fff;
  }
  .downPopShow label>input{
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
  }
  .popBtnWrap{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    padding: 10px 20px;
    text-align: center;
    border-top: 1px #eeeeee solid;
  }
  .popBtnWrap span{
    color: #999;
  }
  .popBtnWrap .popBtn input{
    width: 70px;
    height: 30px;
  }
  .popcancel{
    margin-right: 20px;
    color: #333;
    background-color: #fbfbfb;
    border: 1px solid #e5e5e5;
  }
  .popconfirm{
    background: #C31725;
    border: 1px solid #C31725;
    color: #fff;
  }

  .qwui-main_senior_select{
    display: block;
    position: relative;
  }
  .qwui-select_keyword{
    float: left;
    position: relative;
    width: 600px;
    height: 407px;
    padding-left: 20px;
    overflow-x: auto;
    overflow-y: scroll;
    box-sizing: border-box;
  }
  .qwui-pick_time:last-child{
    margin-bottom: 50px;
  }
  .qwui-keyword_description{
    margin: 10px 0 5px;
    color: #808080;
    font-size: 13px;
  }
  .qwui-select_input{
    width: 220px;
    margin: 0;
    padding: 4px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    box-sizing: border-box;
    line-height: normal;
    outline: none;
    font-family: inherit !important;
    font-size: 14px;
    vertical-align: baseline;
  }
  .qwui-select_input::-webkit-input-placeholder{
    color: #a6a6a6;
  }
  .qwui-select_result{
    position: absolute;
    right: 0;
    width: 338px;
    height: 407px;
    border-left: 1px solid #e5e5e5;
  }
  .qwui-select_keyword::-webkit-scrollbar{
    width: 0!important;
    height: 0!important;
  }
  @-webkit-keyframes loading{
    0%{
      transform:rotate(0deg);
      -ms-transform:rotate(0deg);   /* IE 9 */
      -moz-transform:rotate(0deg);  /* Firefox */
      -webkit-transform:rotate(0deg); /* Safari 和 Chrome */
      -o-transform:rotate(0deg);  /* Opera */
    }
    100%{
      transform:rotate(360deg);
      -ms-transform:rotate(360deg);   /* IE 9 */
      -moz-transform:rotate(360deg);  /* Firefox */
      -webkit-transform:rotate(360deg); /* Safari 和 Chrome */
      -o-transform:rotate(360deg);  /* Opera */
    }
  }
  ._loading_logo{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 75px;
    height:75px;
    background: url('~assets/images/loading.png') no-repeat;
    animation:loading 1.5s infinite linear ;
    -ms-animation:loading 1.5s infinite linear ;
    -moz-animation:loading 1.5s infinite linear ;
    -webkit-animation:loading 1.5s infinite linear ;
  }
  .qwui-select_result i{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 44px;
    height:33px;
    background: url('~assets/images/loading_logo.png') no-repeat;
  }
  .qwui-init_tips{
    position: absolute;
    right: 140px;
    top: 140px;
    width:62px;
    height:62px;
    text-align: center;
    background: url('~assets/images/pickperson_tips.png') no-repeat;
    background-size: 100%;
  }
  .qwui-search_none{
    position: absolute;
    right: 112px;
    top: 140px;
    width: 114px;
    height: 62px;
    text-align: center;
    background: url('~assets/images/pickperson_none.png') center no-repeat;
    background-size: 62px 62px;
  }
  .none_words{
    position: relative;
    top: 68px;
    font-size: 13px;
    color: #999;
  }
  .tips_words{
    position: absolute;
    right: 90px;
    top: 220px;
    font-size: 13px;
    color: #999;
  }
  .qwui-result_title{
    margin-left: 20px;
    padding-right: 9px;
    line-height: 40px;
  }
  .qwui-result_list_s{
    height: 364px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: relative;
  }
  .qwui-select_list_item{
    margin-left: 20px;
    line-height: 40px;
  }
  .qwui-list_item_headpic{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    vertical-align: middle;
  }
  .qwui-list_item_name{
    margin-left: 10px;
  }
  .qwui-result_checkbox{
    float: right;
  }
  .qwui-editor_checkbox{
    padding-right: 12px
  }
  .qwui-editor_checkbox input{
    display: none;
  }
  .qwui-result_checkbox input{
    visibility: hidden;
  }
  .qwui-result_checkbox input:disabled + span, .qwui-editor_checkbox input:disabled + span{
    width: 16px;
    height: 16px;
    border: 1px solid #CBCBCB;
    background: #EDEDED;
  }
  .qwui-result_checkbox span{
    float: right;
    margin: 8px 15px 0 0;
  }
  .qwui-result_checkbox span, .qwui-editor_checkbox span{
    display: inline-block;
    width: 18px;
    height: 18px;
    vertical-align: text-bottom;
    background: url(../../../assets/images/checkbox_off.png) no-repeat center;
  }
  .qwui-result_checkbox.active span {
    margin: 11px 15px 0 0;
  }
  .qwui-result_checkbox input:checked + span, .qwui-editor_checkbox input:checked + span{
    background: url(../../../assets/images/checkbox_on.png) no-repeat center;
  }
  .qwui-select_btn{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 260px;
    padding: 5px;
    text-align: center;
    background: #fff;
    box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(238, 238, 238, 0.004);
    box-sizing: border-box;
    line-height: 32px;
  }
  .qwui-more_con{
    float: left;
    padding: 5px 10px 0 13px;
    font-size: 13px;
    line-height: 24px;
    cursor: pointer;
  }
  .qwui-button{
    margin: 4px 10px 0 0;
    padding: 2px 14px 0;
    font-size: 13px;
    line-height: 24px;
    border-radius: 3px;
    cursor: pointer;
    color: #333333;
    background-color: #fff;
    border: 1px solid #cccccc;
  }
  .qwui-button:hover{
    opacity: 0.8;
  }
  .qwui-button_reset{
    float:right;
    color: #333333;
    background-color: #fff;
    border: 1px solid #cccccc;
  }
  .qwui-button_choose{
    float:right;
    color: #C31725;
    border: 1px solid #C31725;
  }
  .qwui-button_ok{
    color: #fff;
    background: #C31725;
    border: 1px solid #C31725;
  }
  .qwui-search_select {
    padding: 0 7px;
    width: 220px;
    height: 26px;
    line-height: 26px;
    color: #333;
    border: 1px #ccc solid;
    box-sizing: border-box;
    outline: none;
  }
  .datepicker-range{
    min-width:220px!important;
  }
  .qwui-editor_mask{
    position: absolute;
    bottom: -54px;
    top: -240px;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.2);
    z-index:100;
  }
  .qwui-editor_view{
    position: absolute;
    bottom: 12px;
    top: -98px;
    left: 20px;
    right: 20px;
    background: #fff;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.52);
    box-sizing: border-box;
    z-index: 100;
  }
  .qwui-editor_title{
    padding: 15px 24px;
    line-height: 30px;
    font-size: 18px;
    color: #333;
    background: #F7F7F7;
  }
  .close_editor{
    float: right;
    color: #E5E5E5;
    font-size: 28px;
    cursor: pointer;
  }
  .qwui-editor_list{
    width:100%;
    height:366px;
    overflow-y: scroll;
  }
  .qwui-editor_list::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
  }
  .qwui-editor_list::-webkit-scrollbar-thumb{
    background: rgba(0,0,0,0.1) !important;
  }
  .list_item{
    width: -webkit-fill-available;
    padding: 16px 0 14px 24px;
  }
  .list_item .fold_this{
    display: inline-block;
    position: relative;
    width: 5px;
    height: 5px;
    left: 5px;
    border: 1px solid #666;
    border-right: none;
    border-top: none;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
  }
  .list_item .expand_this{
    top: -2px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .list_item .title{
    display: block;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .list_item_text{
    display: inline-block;
    width: 25%;
    padding: 14px 0 0;
    font-size: 13px;
    color: #666;
  }
  .qwui-editor_button{
    position: relative;
    padding: 16px 5px;
    text-align: right;
    border-top: 1px solid #ccc;
  }
  .qwui-user_default_img{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 3px;
    vertical-align: middle;
    background: url('~assets/images/user_icon.png') no-repeat center;
    background-size: 24px 24px;
  }
</style>
