<template>
    <div>
      <!--顶部-->
      <div class="recycleList_top clearfix">
          <!--按钮-->
          <div class="recycleList_button">
            <span class="qwui-recycleList_back" @click="backList"></span>
            <span v-perm="'poolClientRecover'">
              <qw-button class="recycleBtn" v-if="showBtn" @click="recovery">恢复</qw-button>
            </span>
            <span v-perm="'poolClientDel'">
              <qw-button class="recycleBtn" v-if="showBtn" @click="del">删除</qw-button>
            </span>
          </div>
          <!--下拉框-->
          <div class="selectPool">
            <qw-select class="select" @selectItem="selectItem" :dataList="poolList" ref="selectPool" :placeholder="placeholder"></qw-select>
            <qw-input class="search" inputType="search" inputTips="输入客户名称" v-model="keyWord" @search="searchData"></qw-input>
          </div>
      </div>

      <!--状态-->
      <div class="status">
        <div class="statusBtn">
          状态:
          <span class="frozon" :class="{active:activeIndex == 1}" @click='frozon'>冻结</span>
          <span class="discard" :class="{active:activeIndex == 2}" @click='discard'>废弃</span>
        </div>
      </div>

      <!--客户列表-->
      <data-table class="clientList" :headData="headData" :dataList="dataList"></data-table>

      <!--分页-->
      <page :pageData="pageData" @change="pageChage"></page>

      <!--缺省图-->
      <noData v-if="showNoData"></noData>

      <!-- 详情 -->
      <crm-detail type="pool"
                  ref="territorialSeaDetail"
                  :id="detailId"
                  :operateConfig="operateConfig"
                  @edit="oprenEdit"
                  @moreOperate="moreOperateKey">
      </crm-detail>

    </div>
</template>
<script>
  import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect';
  import dataTable from '@/components/list/dataTable';
  import crmDetail from "@/module/crm/components/crm-detail/crmDetail";
  import page from '@/components/list/page';
  import noData from '@/components/list/noData';
  import {getRecycleList,recoverClient,deleteClient,getPoolList} from '@/module/crm/api/territorialSea'
export default {
    name: 'recycleList',
    components:{
      qwButton,
      qwInput,
      qwSelect,
      dataTable,
      page,
      noData,
      crmDetail
    },
    data () {
        return {
          showBtn:false,//是否显示恢复和删除按钮
          activeIndex:1,
          clientStatus:"3",//客户状态，默认是冻结状态
          ids:"",//客户id
          poolId:"",//公海池id
          detailId: '', //详情id
          clickDetail:false,
          operateConfig: [
            {
              key: 'recovery',
              name: '恢复',
              permission:'poolClientRecover'
            },
            {
              key: 'del',
              name: '删除',
              permission:'poolClientDel'
            }
          ],
          keyWord:"",//搜索框关键词
          showNoData:false,//是否显示缺省图
          placeholder:"全部公海",
          pageData: { //分页组件参数
            page: 1,
            pageSize: 10,
            maxPage: 1,
            totalRows: '',
          },
          poolList:[],//公海池数据
          dataList:[],//列表数据
          headData: {
            left: {   //checkbox栏设置
              show: true,  //是否显示checkbox
              checkFunc:(checkAll,checkList) => { //点击checkbox回调
                let arr = [];
                let checkNum = 0;
                checkList.map(item => {
                  item.isChecked? arr.push(item.id) : checkNum++;
                });
                this.ids = arr.join(',');
                this.showBtn = checkNum == checkList.length?  false : true;
                console.log(this.showBtn)
              },
            },
            middle: [  //头部栏设置
              {
                title: "客户名称",   //标题名称(必传)
                key: "clientName",    //数据字段名称(必传)
                width: 280,         //标题栏宽度(必传)
                textAlign: 'left', //数据文字方向(可选)：不传默认为left  值：left center right
                color: '#F87B00',      //数据字体颜色(可选)：默认字体颜色为#333
                skip: {             //该项是否能跳转(可选)：默认不跳转
                  skipFunc:(id) => {  //点击跳转的回调函数
                    // 打开详情
                    this.detailId = id;
                    this.$refs.territorialSeaDetail.showDetail()

                  }
                },
              },
              {
                title: "所属公海",
                key: "poolName",
                width: 70,
                color: '#383838',
              },
              {
                title: "创建人",
                key: "personName",
                width: 80,
                color: '#383838',
              },
              {
                title: "退回次数",
                key: "backTimes",
                width: 80,
                color: '#383838',
              },
              {
                title: "创建时间",
                key: "createTime",
                width: 150,
                color: '#383838',
              },
              {
                title: "更新时间",
                key: "updateTime",
                width: 150,
                color: '#383838',
              },
            ],
            right: {   //操作栏设置
              isShowOperate: false,  //是否显示操作栏
              fixedOperate: false  //操作栏是否固定在最后
            }
          },
        }
    },
    created(){
      this.getList();
      this.getPool();
    },
    methods: {
      //获取客户列表
      getList:function(){
        let obj={
          'searchValue.clientStatus': this.clientStatus,
          'searchValue.poolId':this.poolId,
          'searchValue.title':this.keyWord,
          page: this.pageData.page,
          pageSize: this.pageData.pageSize,
        }
        getRecycleList(obj).then(res=>{
          if(res.code == 0){
            let listItem=res.data.pageData;
            if(res.data.pageData){
              this.dataList=[];
              res.data.pageData.forEach(item=>{
                listItem=Object.assign(item,{changeColor:true}); //修改数据行文字颜色
                this.dataList.push(listItem);
              })
            }else{
              this.dataList=[];
            }
            this.pageData.maxPage=res.data.maxPage;
            this.pageData.totalRows=res.data.totalRows;
            this.showNoData=this.totalRows == 0? true:false; //缺省图
            this.showBtn=false;  //隐藏恢复删除按钮
          }
        }).catch(err =>{
          _.alert('提示','网络错误');
        })
      },
      //分页
      pageChage:function(page,pageSize){
        this.pageData.page = page;
        this.pageData.pageSize = pageSize;
        this.getList();
      },

      //获取公海池列表
      getPool:function(){
        let obj={
          checkDefault:1,
        }
        getPoolList(obj).then(res=>{
          let listObj={};
          if(res.code == 0){
            let list=res.data.CrmClientPoolConfigList;
            list.forEach(item =>{
              listObj=Object.assign({optionName:item.poolName,val:item.id});
              this.poolList.push(listObj);
            })
            let allPool={
              optionName:'全部公海',
              val:'',
            }
            this.poolList.unshift(allPool)
            this.$nextTick(() => { // 默认选中第一个
              this.$refs.selectPool && this.$refs.selectPool.setValue('')
            })
          }
        }).catch(err=>{
          _.alert('提示','网络错误');
        })
      },

      //恢复
      recoveryClient:function(){
        let clientIds = this.clickDetail ? this.detailId : this.ids;
        let obj={
          clientIds:clientIds,
        }
        recoverClient(obj)
          .then(res=>{
            if(res.code == 0){
              dataBase.top_alert('恢复成功',true,1500)
              this.getList();
            }else{
              dataBase.top_alert('恢复失败',false,1500)
            }
            this.clickDetail=false
          })
          .catch(err=>{
            dataBase.alert('提示', '网络错误')
          })
      },
      recovery:function(){
        dataBase.alert('提示','确定要恢复数据吗？',()=>{this.recoveryClient()})
      },
      // 删除
      delClient:function(){
        let clientIds = this.clickDetail ? this.detailId : this.ids;
        let obj={
          ids:clientIds,
          belongAgent:'crm',
        }
        deleteClient(obj)
          .then(res=>{
            if(res.code == 0){
              dataBase.top_alert('删除成功',true,1500)
              this.getList();
            }else{
              dataBase.top_alert('删除失败',false,1500)
            }
            this.clickDetail=false;
          })
          .catch(err=>{
            dataBase.alert('提示', '网络错误')
          })
      },
      del:function(){
        dataBase.alert(
          '提示',
          '删除公海客户将同时删除该客户关联的商机和合同，清空联系人和拜访记录，操作不可恢复。确认删除吗？',
          ()=>{this.delClient()})
      },
      // 下拉选择公海池
      selectItem:function(optionName,val){
        this.poolId=val;
        this.getList();
      },
      // 搜索
      searchData:function(){
        this.getList();
      },
      //冻结
      frozon:function(){
        this.activeIndex = 1;
        this.clientStatus = 3;
        this.getList()
      },
      //废弃
      discard:function(){
        this.activeIndex = 2;
        this.clientStatus = 4;
        this.getList()
      },
      //返回公海池列表首页
      backList:function(){
        this.$router.replace('/crm/territorialSea/list')
      },


      //打开编辑页面
      oprenEdit(id) {
        document.body.style.overflow = 'visible';
        this.$router.push({path:'operate',query:{clientId:id,isFromRecycle:1}})
      },

      //详情里更多操作按钮回调
      moreOperateKey(key) {
        this.clickDetail = true;
        const func = {
          recovery: this.recovery,
          del: this.del,
        }
        func[key]()
      },
    }
}
</script>
<style lang='scss' scoped>
  @import "./recycleList.scss";
</style>
