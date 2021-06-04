<template>
  <div class="wrap qwui-employee_care_list" v-qw-water-mark="{ agentCode: 'hrmanagement'}">
    <div class="searchFixed mt10">
      <search-box 
        :searchinput="searchBar"
        :placeholder = "placeholder"
        @listenToSearchBox="searchCareList">
      </search-box>
    </div>
    <div class="fixedHeight"></div>
    <div class="qwui-birthday_tip" v-if="isFull" v-show="isShow" >
      <div class="qwui-birthday_content" @click="entryFrom">
        <span>立即完善生日信息，与同事祝福互动</span>
        <i></i>
      </div>
    </div>
    <ul class="qwui-employee_care-box">
      <li class="qwui-employee_care_every" v-for="(item,index) in careList" :key="index+'carelist'">
        <div class="qwui-care_detail" @click="viewCareDetail(item.dynamicInfoId)">
          <div class="qwui-care_detail_img">
            <img :src="item.coverImage?(item.coverImage):item.headPic" :alt="item.contentType">
          </div>
          <div class="qwui-care_detail_tip" v-cloak>{{item.title}}</div>
        </div>
        <div class="qwui-care_ctrl">
          <div class="qwui-care_ctrl_time"  @click="viewCareDetail(item.dynamicInfoId)">
            <span class="qwui-care_ctrl_realtime">{{item.publishTime | formateTime}}</span>
            <span class="qwui-care_ctrl_crop" v-cloak>{{item.personName}}</span>
          </div>
          <div class="qwui-care_ctrl_btns">
            <span class="qwui-care_ctrl_comment_btn" 
              @click="viewCareDetail(item.dynamicInfoId,1)">
              <img :src="listImg.reply"></span>

            <span class="qwui-care_ctrl_comment" 
              @click="viewCareDetail(item.dynamicInfoId,1)">
              {{item.commentCount?item.commentCount:'评论'}}</span>

            <span class="qwui-care_ctrl_up_btn" 
              @click="togglePraise(item,item.dynamicInfoId)" 
              :class="{'qwui-hr_care_up_active':item.hasPraise}">
                    <img :src="item.hasPraise?listImg.giveUp:listImg.noGive"></span>

            <span class="qwui-care_ctrl_up" 
              @click="togglePraise(item,item.dynamicInfoId)" >
              {{item.praise?item.praise:'点赞'}}</span>

          </div>
        </div>
        <div class="qwui-up_person" v-if="item.praise">
          <p class="qwui-up_person_detail">{{item.praiseNames}}</p>
        </div>
      </li>
    </ul>
    

    <!--无数据-->
    <no-record
      v-if="noMoreRecord"
      :hasrecord="hasrecord">
    </no-record>

    <!--更多数据-->
    <load-more v-bind="loadMoreMes"></load-more>
  </div>
</template>

<script>
 //涉及列表展示页面 下拉展示 点赞  url
  import searchBox from '@/components/base/search_box';
  import NoRecord from '@/components/base/no_record';
  import loadMore from '@/components/list/load_more';
  import qwWaterMark from '@/directive/qwWaterMark';
  import { findAllCareList ,changePraise ,viewSetting ,hasSetBirth} from '../api/getData';
  import { pluszero ,getImgURLHead  } from '../api/tools';
  export default {
    name: 'employeesCareList',
    data(){
      return {
        searchBar: {
          show:true, //显示搜索框
        },
        placeholder:'标题/内容',
        params:{  //请求参数
          page:1,
          pageSize:10,
          'searchValue.title':'',
          'searchValue.sendType':''
        },
        lock_roll:true,//列表加载请求是否结束
        noMoreRecord:false,//是否显示无数据图片
        hasrecord:{  //无数据配置
          show: true,
          setTop: true,
          icon: 'img_a-nodata_01',
          text:"暂无数据",
        },
        loadMoreMes:{  // 加载更多配置
          loading:false,  //加载转圈
          currPage:1,  //当前页码 
          maxPage:1,   //总页数
          // loadMoreDesc:'向上滑动加载更多',
          // type:'commentList'   //------组件type为commentList，会默认展示组件
        },
        noMore:false,
        careList:[],
        localPraise:false, //当前用户是否点赞
        localStrPraise:'',
        listImg:{
          reply:require('../../../assets/images/hr_care_comment.png'),
          noGive:require('../../../assets/images/hr_care_up.png'),
          giveUp:require('../../../assets/images/hr_care_up_active.png'),
        },
        isFull: false, //生日信息是否填写完整
        isShow: true, //是否显示完善生日信息提示
      }
    },
    created(){
      this.searchCareList();
      window.addEventListener("scroll",this.scrollList);
      this._viewSetting();
    },
    methods:{
      //搜索列表
      searchCareList(inputKey){
        //搜索时完善生日信息隐藏
        if(inputKey!=undefined){
          this.isShow=false;
        }
        this.params.page = 1;
        this.noMoreRecord = false;
        this.params['searchValue.title'] = inputKey;
        this.careList = [];  //清空数据
        this.loadMoreMes = {
          loading:false,  //加载转圈
          currPage:1,  //当前页码 
          maxPage:1,   //总页数
        };
        this.getCareList();
      },
      //滚动触发
      scrollList(){
        if(this.$route.path.indexOf('employees_care_list') === -1){
          return;
        }
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight || window.innerHeight;
         //存在滚动 && 请求已结束 && 当前页码数小于总页码数
        if(scrollTop + clientHeight >= document.body.scrollHeight && this.lock_roll  && this.loadMoreMes.currPage < this.loadMoreMes.maxPage) {
            this.lock_roll = false;
            this.loadMoreMes.loading = true;
            this.params.page++;
            this.getCareList();
        }else{
          this.loadMoreMes.loading = false;
        }
      },
      //获取数据
      getCareList(){
        findAllCareList(this.params,res=>{
          if(res && res.totalRows >0){
            this.showList(res);
          }else{
            this.noMoreRecord = true;
          }
        });
      },
      //列表数据展示
      showList(res){
        if(res&&res.pageData.length>0){
          let result = {...res};
          let list = [...result.pageData];
          this.loadMoreMes.currPage = result.currPage;
          this.loadMoreMes.maxPage = result.maxPage;
          list.forEach((item,i) => {
            if(item.coverImage !=""){
              if(getImgURLHead(item.coverImage ) == _.baseURL){
                 list[i].coverImage = _.baseURL+list[i].coverImage;
              }else{
                list[i].coverImage = _.compressURL+list[i].coverImage;
              }
            }else{
              list[i].coverImage = `${_.baseURL}/manager/images/cover.jpg`
            }
          });
          this.careList = [...this.careList,...list];
          this.lock_roll = true;
        }
      },
      //查看关怀详情
      viewCareDetail(id,scroll=2){
        window.location.href= `${_.baseURL}/vp/module/dynamic.html?corp_id=${window.wxqyhConfig.orgConfigInfo.corpId}&agentCode=${dataBase.wxqyh_uploadfile.agent}#/partyDetail?id=${id}&title=&typeId=&page=1&isPassReview=&schType=10&scrolltop=${scroll}`;
      },
      //点赞
      togglePraise(item,id){
        changePraise({belongAgent: 'hrmanagement',id:id},res => {
          let nameArr = [];
          let str = '';
          //获取当前人员的点赞状态
          this.localPraise = res.hasPraise; 
          if(res && res.praisePager){
            //获取人数
            this.localperson = [...res.praisePager.pageData]; 
            //存放点赞人员信息数组
            this.localperson.forEach((val,i) => {
              nameArr.push(val.personName);
            })
            //切割人员信息数组,以，分割
            str = nameArr.join('、');
            //找到当前id指向的数据,替换为点赞按钮获取的数据信息
            this.careList.forEach((item,index) => {
              if(id === item.dynamicInfoId){
                this.careList[index].praiseNames = str;
                this.careList[index].hasPraise = this.localPraise;
                this.careList[index].praise = nameArr.length;
              }
            })
          }
        });
      },
      //完善生日信息
      entryFrom() {
        this.$router.push({ name: "complete_birthday_mes" });
      },
      //生日信息编辑权限
      _viewSetting() {
        viewSetting({ type: "hrPersonal" }, res => {
          let hasEditBirthMoon =
            res.setting.hrPersonal.editBySelf.field.birthDayMoon;
          let hasEditBirth = res.setting.hrPersonal.editBySelf.field.birthDay;
          hasEditBirthMoon && hasEditBirth ? this._hasSetBirth() : "";
        });
      },
      //检查是否当前生日信息是否完善
      _hasSetBirth() {
        hasSetBirth({}, res => {
          this.isFull = !res.hasSetBirth;
        });
      },
    },

    filters: {
      //时间格式化
      //当天只显示时间，如：14:25  非当天的显示日期：10-22   非当年的显示：17-05-30
      formateTime: function (value) {
        let _this = this;
        if (!value) return '';
        let now = new Date();
        let li_time = value.replace(/-/g,"/") + ':00';
        let time = new Date(li_time);
        if(now.getFullYear() != time.getFullYear()){
          return `${String(time.getFullYear()).substring(2)}-${ pluszero(time.getMonth()+1)}-${pluszero(time.getDate())}`;
        }else if(now.getMonth() === time.getMonth() && now.getDate() === time.getDate()){
          let hour = time.getHours()<10?'0'+time.getHours():time.getHours();
          let minute = time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes();
          return `${hour}:${minute}`;
        }else{
           return `${pluszero(time.getMonth()+1)}-${pluszero(time.getDate())}`;
        }
      },
    },
    components:{
      searchBox,
      NoRecord,
      loadMore,
    },
    directives: {
      qwWaterMark
    },
    beforeDestroy(){
      window.removeEventListener("scroll",this.scrollList);
    }
  }
</script>

<style lang="scss" scoped>
  .searchFixed{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
		}
    @media screen and (min-width: 1024px){
      .searchFixed{
        width: 740px;
      }

      /deep/ #qwWaterMark{
        width: 740px!important;
        margin: 0 auto;
      }
    }
  .fixedHeight{
		height: 43px;
  }
  .qwui-birthday_tip{
    width:100%;
    height:36px;
    .qwui-birthday_content{
      position:fixed;
      display: flex;
      align-items: center;
      top:43px;
      width:100%;
      height:36px;
      line-height: 36px;
      padding:8px 10px 8px 14px;
      box-sizing: border-box;
      background:rgba(230,237,253,1);
      z-index:9;
      span{
        flex:1;
        width:224px;
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(85,133,240,1);
        line-height:20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i{
        width: 16px;
        height: 16px;
        background: url(~assets/svg/icon-a-common_arrow-care.svg) no-repeat center;
      }
    }
    @media screen and (min-width:1024px){
       .qwui-birthday_content{
        width:740px;
       }
    }
  }
  .qwui-employee_care-box{
    width: 100%;
    .qwui-employee_care_every{
      // height:124px;
      padding:16px 14px;
      box-sizing:border-box;
      box-shadow:0 -1px 0  #F7F8FA inset;
      .qwui-care_detail{
        display: -webkit-flex;
        display: flex;
        margin-bottom:8px;
      }
      .qwui-care_detail_img{
        margin-right:12px;
        width: 122px;
        height: 68px;
        img{
          width: 100%;
          height: 100%;
          border-radius:2px;
        }
      }
      .qwui-care_detail_tip{
        flex:1;
        height: 68px;
        line-height:22px;
        color:#0A1735;
        font-size:15px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        overflow: hidden;
        text-overflow:ellipsis;
      }

      .qwui-care_ctrl{
        display: -webkit-flex;
        display: flex;
        height:17px;
        margin-bottom:4px;
      }
      .qwui-care_ctrl_time{
        flex:1;
        color:#B2B9C8;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .qwui-care_ctrl_btns{
        flex:1;
        text-align: right;
        font-size:0;
        color:#B2B9C8;
        font-family:PingFangSC-Regular;
        font-weight:400;
        .qwui-care_ctrl_comment_btn,.qwui-care_ctrl_up_btn,.qwui-hr_care_up_active{
          display:inline-block;
          margin-right:2px;
          width:24px;
          height:24px;
          background-repeat: no-repeat;
          background-position: center;
          background-size:100%;
          background-origin:content-box;
          box-sizing: border-box;
          transform: translateY(-3px);
          img{
            width:24px;
            height:24px;
          }
        }
        // .qwui-care_ctrl_comment_btn{
        //   background-image:url(~assets/images/hr_care_comment.png);
        // }
        // .qwui-care_ctrl_up_btn{
        //   background-image:url(~assets/images/hr_care_up.png);
        // }
        // .qwui-hr_care_up_active{
        //   padding:5px;
        //   background-image:url(~assets/images/hr_care_up_active.png);
        // }
        .qwui-care_ctrl_comment,.qwui-care_ctrl_up{
         display: inline-block; 
         vertical-align: top;
         font-size:12px;
         transform: translateY(-1px);
        }
        .qwui-care_ctrl_comment{
          margin-right:20px;
        }
      }

      .qwui-up_person{
        width: 100%;
        height: 37px;
        padding:11px 8px 6px;
        box-sizing:border-box;
        background:url(~assets/images/hr_up_person_bg.png) no-repeat center;
        background-size:100% 100%;
        .qwui-up_person_detail{
          width: 100%;
          height:20px;
          line-height:20px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size:14px;
          font-family:PingFangSC-Regular;
          font-weight:400;
        }
      }
    }
  }
  /deep/ .qwui-no_record_text{
    margin-top: 10px;
    height:21px;
    font-size:15px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(178,185,200,1);
    line-height:21px;
  }
  /deep/ .img_a-nodata_01 {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('../../../assets/svg/img_commom_emptypage.svg') center no-repeat;
    background-size: 130px 130px;
  }
</style>
