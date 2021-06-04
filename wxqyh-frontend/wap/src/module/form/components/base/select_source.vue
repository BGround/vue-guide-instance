<template>
  <div class="qwui-crm_select">
    <div class="select-crm-content">
      <div :style="{height:contentHeight+'px'}" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false" class="clientList">
        <div class="qwui-nav_box_fixed">
          <search_bar :searchinput="searchBar" v-on:listenToSearchBox="showMsgFromSearchBar"></search_bar>
        </div>
        <div class="qwui-user-list">    <!--遍历显示的数据-->
          <div v-for="(item,index) in list" class="qwui-user_item" :key="index">
            <div class="qwui-user_item_inner" @click="selectThis(item)">
              <div class="qwui-user_select_icon" :class="{active:formselected.idStr.indexOf(item[IdShowKey])!=-1}"><i></i></div>
              <div class="title description_title flexItem">
                <div class="client-code"><h1>{{item[MainFieldKey]}}</h1></div>
                <div class="source-list">
                  <p v-if="idShow">{{IdShowName}}：{{item[IdShowKey]}}</p>
                  <p v-for="field in ShowField">{{field.field_name}}：{{item[field.field_key]}}</p>
                  <img class="qwui-head-pic" v-for="pic in ImageField" :key="pic.index" :src="item[pic.field_key]" alt="" @error="noFind"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <load-more :busy="busy" :loading="loading" :showrecord="showrecord" @childevent="loadMore"></load-more>
      </div>

      <!--底部按钮-->
      <div class="qwui-userOrDept_select_footer">
        <div class="qwui-userOrDept_select_footerBar">
          <div class="qwui-userOrDept_footer_flex"><a class="qwui-btn qwui-btn_default" @click="concel">取消</a></div>
          <div class="selected">
          </div>
          <div class="qwui-userOrDept_footer_flex"><a class="qwui-btn fr" @click="comfirm">确定</a></div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import search_bar from '@/components/base/search_box.vue';
  import loadMore from '../base/load_more.vue'
  import { dataSource } from '../../api/list'

  export default {
    props: {
      'field':{
        type:Object,
        required:true,
      },
    },
    components:{
      search_bar,
      loadMore
    },
    data(){
      return {
        MainFieldKey: '',  // 主字段key
        IdShowKey: '',     // 主键key
        IdShowName: '',    // 主键名称
        ShowField:[],      // 显示字段
        ImageField:[],     // 图片字段
        idShow: false,     // 主键是否显示
        list:[],
        formselected:{
          selectedList:[],
          idStr:'',
        },
        fieldAll:[],
        searchBar:{ //头部搜索框
          show:true,
          keyWord:'',
          rightSpan:{
            show:false,
            callback:null
          },
          moreFunction:{
            show:true,
            option:[
              {name:'全部',value:''}
            ]
          }
        },
        contentHeight:'',
        page:1,
        busy:false,
        loading:false,
        pageSize:10,
        keyword:'',
        keywordType:'',
        val:[], //field.value数据
      }
    },
    created(){
      this.getData();
      this.getKeys();
      if(document.documentElement.clientHeight>0){
        this.contentHeight=document.documentElement.clientHeight;
      }else{
        this.contentHeight="auto";
      }
      this.getFieldVal();
      //初始化映射关系
      this.setFieldMap(this.fieldAll);
    },
    computed:{
      // value中的主键key值对应的数据
      fieldKey() {
        var ids = [];
        this.field.value && this.field.value.forEach((item) => {
          ids.push(JSON.parse(item)[this.IdShowKey])
        })
        return ids;
      },
      showrecord(){
        this.list = this.list ||[];
        return this.list.length==0?true:false;
      },
    },
    methods: {
      // 获取主键、主字段、显示字段、图片的key值
      getKeys() {
        var _this =this;
        this.field.ref_cfg.datasource_fields.forEach((item) => {
          if (item.field_type == 'MainField'){//主字段
            _this.MainFieldKey = item.field_key;
            _this.fieldAll.push(item);
          } else if(item.field_type == 'ShowField'){//显示字段
            _this.ShowField.push(item);
            _this.fieldAll.push(item);
          }else if (item.field_type == 'IdShow' || item.field_type == 'Id'){//主键
            _this.IdShowKey = item.field_key;
            _this.IdShowName = item.field_name;
            _this.fieldAll.push(item);
            if (item.field_type == 'IdShow') {
              _this.idShow = true;
            }
          }else if(item.field_type == 'ImageField'){//图片
            _this.ImageField.push(item);
          }
        })
      },
      // 获取value中的数据并加载到已选列表
      getFieldVal() {
        var _this = this;
        var value = this.field.value || [];
        value.forEach(item => {
          _this.val.push(JSON.parse(item));
        })
        this.selectStart(_this.val);
      },
      //列表选择删除
      selectThis(item){
        var id = item[this.IdShowKey];
        var selectedData = this.formselected.selectedList;
        //删除选择
        if(this.formselected.idStr.indexOf(id)!=-1){
          this.formselected.idStr = this.formselected.idStr.replace(id+"|","");
          for(var t = 0;t<selectedData.length;t++){
            if(selectedData[t][this.IdShowKey]==id){
              selectedData.splice(t,1);
            }
          }
          //添加选择
        }else{
          this.formselected.idStr+=id+"|";
          selectedData.push(item);
        }
      },
      //缓存已选在列表中选上
      selectStart(data){
        for(var i=0;i<data.length;i++){
          this.formselected.selectedList.push(data[i]);
          this.formselected.idStr+=data[i].id+'|';
        }
      },
      //请求数据源类型数据
      getData(){
        _.showLoading();
        var _this = this;
        var params = `keyword=${this.keyword}\n keywordType=${this.keywordType}`;
        var url = this.field.ref_url,isParams = `wxUserId=${dataBase.config.wxUserId}&corpId=${wxqyhConfig.orgConfigInfo.corpId}&id=${this.field._id}&page=${this.page}&pageSize=${this.pageSize}`;
        url.indexOf('?') !=-1? url = url+ '&'+isParams: url = url+ '?'+isParams
        var param = {
          url,
          params,
        }
        dataSource(param).then(res =>{
          _this.loading = false;
          _.hideLoading();
          _this.busy = res == [];
          _this.list = _this.list.length > 0 ? _this.list.concat(res) : res;
        })
      },
      //加载更多
      loadMore(){
        this.page++;
        this.loading = true;
        this.busy = true;
        this.getData();
      },
      setFieldMap(field){
        var _this = this;
        field.forEach(item=>{
          //初始化搜索框的内容option
          _this.searchBar.moreFunction.option.push({name:item.field_name,value:item.field_key});
        });
      },
      //查询数据
      showMsgFromSearchBar(keyword,keywordType){
        this.page = 1;
        this.list = [];
        this.keyword = keyword;
        this.keywordType = keywordType;
        this.getData();
      },
      comfirm(){
        //将当前所选添加到选人控件
        this.$emit('addSource',this.formselected.selectedList);
      },
      concel() {
        this.$emit('addSource');
      },
      noFind(e) {
        e.onerror = null;
        e.srcElement.src = require('@/assets/images/touxiang02.png');
      },
    },
  }
</script>
<style scoped>
  .qwui-nav_box_fixed{
    position: fixed;
    z-index: 9;
    width: 100%;
  }
  .qwui-user-list{
    margin-top:43px;
  }
  .qwui-crm_select {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: auto;
    background: #fff;
  }
  /*********/
  .qwui-user_item {
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    clear: both;
    background-color: white;
    overflow: hidden;
  }
  .qwui-user_item:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .qwui-user_item .qwui-user_item_inner {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 10px 15px;
  }
  .qwui-user_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
  }
  .qwui-user_item .avator img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .description_title{
    line-height: 1.4;
    overflow: hidden;
  }
  .client-code{
    font-size: 15px;
    color: #333;
    line-height: 1.5;
  }
  .client-code-sub{
    max-height:32px;
    font-size:12px;
    color: #666;
    overflow: hidden;
    word-break: break-all;
  }
  .qwui-head-pic{
    display: inline-block;
    width: 48px;
    height: 48px;
    margin-right: 5px;
    border-radius: 4px;
    border: none;
  }
  .select-crm-content{
    position: relative;
    width: 100%;
  }
  .clientList{
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .select-crm-footer{
    position: absolute;
    bottom: 0;
    padding: 0 3%;
    width: 94%;
    min-height: 50px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    background: #fff;
    z-index: 10;
  }
  .select-crm-footerBar{
    display: flex;
  }
  /*底部按钮*/
  .qwui-userOrDept_select_footer{
    position: absolute;
    bottom: 0;
    padding: 0 3%;
    width: 94%;
    min-height: 50px;
    box-sizing: content-box;
    background: #fff;
    z-index: 10;
  }
  .qwui-userOrDept_select_footer:before,.qwui-userOrDept_btn_tab:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-userOrDept_select_footerBar{
    display: flex;
  }
  .qwui-userOrDept_footer_flex{
    flex: 1;
  }
  .qwui-userOrDept_select_footer .selected {
    text-align: center;
    flex: 2;
  }
  .qwui-userOrDept_select_footer .selected p:first-child{
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
  .qwui-userOrDept_select_footer .selected p:last-child{
    font-size: 14px;
    color: #586c94;
    cursor: pointer;
  }
  .qwui-userOrDept_select_footer .qwui-btn {
    position: relative;
    margin-top: 10px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 17px;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    display: block;
    cursor: pointer;
    background: #2F7DCD;
  }
  .qwui-userOrDept_select_footer .qwui-btn::after {
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
    border-radius: 10px;
  }
  .qwui-userOrDept_select_footer .qwui-btn_default {
    color: #333!important;
    background: #fbfafc!important;
  }
  .fr{
    float:right;
  }
  .selected_user {
    background: #fff;
    overflow-y: hidden;
    overflow-x: scroll;
    border-bottom: 1px solid #eeeeee;
    box-shadow: 0px 2px 5px #ccc;
  }
  .item-selected {
    margin-bottom: 5px;
    padding: 0 10px;
    height: 29px;
    line-height: 29px;
    color: #333;
    font-size: 15px;
    border: 1px #ccc solid;
    border-radius: 2px;
    background-color: #fff;
    display: inline-block;
    cursor: pointer;
  }
  .source-list{
    font-size:12px;
    color: #666;
    overflow: hidden;
    word-break: break-all;
  }
</style>
