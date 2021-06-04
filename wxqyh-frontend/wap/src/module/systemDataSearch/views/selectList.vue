<template>
  <div class="mainStyle">
    <header class="qwui-nav_box_fixed">
      <div>
        <span class="pramTitle">数据源：</span>
        <select v-model="dataSource" class="dataSource">
          <option v-for="(item,key) in dataSourceConfig" :key="key" :value="item.dataSource">{{ item.optionName }}</option>
        </select>
      </div>
      <textarea
        @keydown.enter.shift.prevent = "showResult()"
        v-model="sql"
        type="text"
        placeholder="输入SQL查询语句,shift+Enter键快速查询"
        class="searchTextarea"></textarea>
      <span class="searchBtn" @click="showResult">
        <span class="searchIcon"></span>
      </span>
    </header>
    <div class="qwui-search_data" v-if="listNum > 0">
      <div class="qwui-remove_data" @click="removeData">清除全部</div>

      <div class="resultStyle" v-for="(value,index) in listShowArr">
        <div class="searchResult">
          <p class="sqlStyle">
            <span class="pramTitle">SQL语句:</span>
            <span>{{sqlArr[index]}}</span>
          </p>
          <span class="pramTitle">共有{{value.length}}条数据</span>
          <span v-if="value.length" class="showHide" @click="showHide(index)">{{showArr[index]?'折叠':'展开'}}列表>></span>
          <span class="delData" @click="delResult(index)">×</span>
          <div class="tableStyle">
            <table class="tableContent" v-show="showArr[index]">
              <thead>
              <tr class="trStyle">
                <th v-for="(value, key) in value[0]">{{key}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in value">
                <td v-for="items in item">{{items | isTime}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSelectResult} from '../api/getData';
  import * as timeUtil from '../../../../src/assets/js/time-util';
  export default {
    name: "selectList",
    data(){
      return {
        dataSourceConfig:dataBase.dataSourceConfig,
        dataSource: 'MAIN_READONLY',//数据源
        sql:'',//sql语句
        sqlArr:[],//sql语句数组
        listArr:[],//列表数据
        listNum:0,//列表数量
        showArr:[],//列表展示与隐藏
      }
    },
    created(){
      if (this.$route.params.sql){
        this.dataSource = this.$route.params.dataSource;
        this.sql = this.$route.params.sql;
      }
      if (localStorage.getItem('listArr')){
        this.listArr = JSON.parse(localStorage.getItem('listArr'));
        this.sqlArr = JSON.parse(localStorage.getItem('sqlArr'));
        this.listArr.forEach(()=>{
          this.showArr.push(false);
        });
        this.listNum = this.listArr.length;
      }
      this.showResult();
    },
    computed:{
      listShowArr(){
        return this.listArr;
      }
    },
    methods: {
      showResult(){
        let self = this;
        if (this.sql){
          getSelectResult(this.dataSource,this.sql,function (list) {
            self.sqlArr.unshift(self.sql);
            self.listArr.unshift(list);
            localStorage.setItem('sqlArr',JSON.stringify(self.sqlArr));
            localStorage.setItem('listArr',JSON.stringify(self.listArr));
            self.listNum += 1;
            self.showArr.splice(0,0,true);
          })
        }
      },
      delResult(index){
        this.sqlArr.splice(index,1);
        this.listArr.splice(index,1);
        this.showArr.splice(index,1);
        this.listNum -= 1;

        if (this.listNum == 0){
          localStorage.removeItem('sqlArr');
          localStorage.removeItem('listArr');
        }else {
          localStorage.setItem('sqlArr',JSON.stringify(this.sqlArr));
          localStorage.setItem('listArr',JSON.stringify(this.listArr));
        }
      },
      showHide(index){
        this.showArr.splice(index,1,!this.showArr[index]);
      },
      // 一键清除
      removeData(){
        let self = this;
        _.alert('','确认清除所有数据',{
          primaryBtn: {
            name: '清除',
            callBack: function(){
              self.sqlArr.splice(0,self.sqlArr.length);
              self.listArr.splice(0,self.listArr.length);
              self.showArr.splice(0,self.showArr.length);
              self.listNum = 0;
              localStorage.removeItem('sqlArr');
              localStorage.removeItem('listArr');
            }
          },
          defaultBtn:{
            name:"取消",
            callBack:null
          },
        })
      }
    },
    filters:{
      isTime:function (items) {
        if (items && items.time){
          return timeUtil.changeFormat(new Date(items.time),'yyyy-MM-dd hh:mm:ss');
        }else {
          return items;
        }
      }
    }
  }
</script>

<style scoped>
  .mainStyle{
    padding-top: 160px;
  }
  .pramTitle{
    font-size: 16px;
    font-weight:bold;
  }
  .dataSource{
    margin-bottom: 3px;
    width: 130px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    border-radius: 2px;
  }
  .sqlStyle{
    margin:0 30px 10px 0;
    word-wrap:break-word
  }
  .qwui-search_data {
    position: relative;
  }
  .qwui-remove_data {
    position: absolute;
    right: 10px;
    top: -48px;
    width: 120px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    border-radius: 4px;
    background-color: #5077AA;
    cursor: pointer;
    color: #fff;
  }
  .tableStyle{
    width: 100%;
    overflow-x: auto;
  }
  .tableStyle::-webkit-scrollbar{
    width: 8px;
    height: 8px;
  }
  .tableStyle::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: #8e8e8e;
  }
  .tableStyle::-webkit-scrollbar-track{
    border: 1px #eeeeee solid;
    border-radius: 10px;
    background: #eeeeee;
  }
  .tableContent{
    margin-top: 5px
  }
  .trStyle{
    background: #eee;
  }
  .resultStyle{
    padding:0 10px;
  }
  .searchResult {
    position: relative;
    margin: 30px auto;
    padding: 10px;
    width: 100%;
    overflow-x: auto;
    background-color: #fff;
    border:1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .searchResult table{
    border-collapse: collapse;
  }
  .searchResult td,.searchResult th{
    word-wrap:break-word;
    text-align: left;
    height: 45px;
    padding:0 5px;
    border:1px solid #ccc
  }
  .searchTextarea {
    min-height: 100px;
    width: 100%;
    padding: 10px 55px 10px 10px;
    font-size: 14px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }
  .searchBtn {
    position: absolute;
    right: 10px;
    top: 78px;
    width: 45px;
    height: 48px;
    line-height: 45px;
    text-align: center;
    border-radius: 4px;
    background-color: #5077AA;
    cursor: pointer;
  }
  .searchIcon {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    background: url("../../../assets/images/ic_search_sm.png");
    background-size:cover;
  }
  .qwui-nav_box_fixed{
    min-height: 130px;
    position: fixed;
    padding: 0 10px;
    top: 0;
    width: 100%;
    z-index: 10;
    border-bottom: 1px solid #ddd;
    background: #f0f0f0;
    box-sizing: border-box;
  }
  @media screen and (min-width: 1024px){
    .qwui-nav_box_fixed{width: 100% !important;}
    .searchTextarea{width: 100% !important;}
  }
  .delData{
    position: absolute;
    top: 3px;
    right: 5px;
    width: 30px;
    height: 30px;
    line-height: 27px;
    text-align: center;
    font-size: 30px;
    border-radius: 50%;
    background: #ddd;
    color: #fff;
    cursor: pointer;
  }
  .delData:hover{
    background: #ccc;
  }
  .showHide{
    margin-left: 10px;
    font-size: 14px;
    color: #2F7DCD;
    cursor: pointer;
  }
</style>
