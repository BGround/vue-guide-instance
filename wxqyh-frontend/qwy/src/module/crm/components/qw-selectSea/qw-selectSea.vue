<!--
@param Boolean show:true     显示选择公海弹窗  默认为false
@param Array   poolList:[]   公海池列表数据    默认为[]
@param String  poolId:''     公海池id          默认为''

用法：<qwSelectSea  :show='true'
                    :poolList='poolList'
                    :poolId='poolId'
                    @on-confirm='onConfirm'
                    @closePool='close'>
      </qwSelectSea>
-->
<template>
  <div>
    <qw-modal :show="show" :showClose="true" :hideOnBlur="false" :width="600" :height="546" :title="title" @change="close"
      @on-confirm="confirm">
      <div class="sea-container">
        <div class="header">
          <qwui-input inputType="search" @search='changeInput' :inputTips="placeholder" v-model="poolName"></qwui-input>
        </div>
        <div class="content">
          <ul class="poolList">
            <li v-for="(item,index) in poolListArr" :key="index" @click="selectPool(index)">
              <p class="poolName">{{item.poolName || item.optionName}} </p>
              <span class="radioBtn" :class="{radioBtnActive:listIndex == index && listIndex!=='' }"></span>
            </li>
          </ul>
          <!--缺省图-->
          <noData v-if="showNoData"></noData>
        </div>
      </div>
    </qw-modal>
  </div>
</template>

<script>
  import qwModal from "@/module/crm/components/qwModal";
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import noData from '@/components/list/noData';
  import {
    getPoolList
  } from '@/module/crm/api/territorialSea'
  export default {
    name: "qw-select-sea",
    components: {
      qwModal,
      qwuiInput,
      noData
    },
    props: {
      show: {
        type: Boolean,
        default: false,
      },
      poolList:{
        type: Array,
        default: ()=>[],
      },
      poolId:{
        type: String,
        default: '',
      }
    },
    data() {
      return {
        title: '选择公海',
        placeholder: '公海名称',
        poolName: '',//公海名称
        poolArr: [], //选择的公海
        listIndex: "", //选中列表索引
        poolListArr:[],//公海列表数组
        ids:'',//当前选择的公海池id
        showNoData:false,
      }
    },
    watch:{
      poolList:function(val){
        this.poolListArr=val;
        for(let i=0;i<this.poolListArr.length;i++){
          if(this.poolId!='' && this.poolListArr[i].id==this.poolId){  //编辑页面  记住上一次选中的公海池
            this.listIndex=i;
            this.poolArr=[];
            this.poolArr.push(this.poolListArr[this.listIndex])
          }else if(this.poolListArr[i].id==this.ids){ //新增页面  记住上一次选中的公海池
            this.listIndex=i;
            this.poolArr=[];
            this.poolArr.push(this.poolListArr[this.listIndex])
          }
        }
      },
      poolId:function(val){
        if(val==''){
          this.listIndex='';
          this.poolArr=[]
        }
      }
    },
    methods: {

      // 获取公海池
      getList: function () {
        let obj = {
          'poolName': this.poolName,
        }
        getPoolList(obj).then(res => {
          if (res.code == '0') {
            this.poolListArr = res.data.CrmClientPoolConfigList;
            this.showNoData = res.data.CrmClientPoolConfigList.length==0? true:false;
          } else {
            _.alert('提示', res.desc)
          }
        }).catch(err => {
          _.alert('提示', "网络错误")
        })
      },

      //  点击确定
      confirm: function () {
        if (this.poolArr.length != 0) {
          let pool={
            'optionName':this.poolArr[0].poolName || this.poolArr[0].optionName,
            'val':this.poolArr[0].id || this.poolArr[0].val,
          }
          this.$emit('on-confirm', pool);
          this.poolName = ''; // 清空搜索框公海池名称
        } else {
          dataBase.alert('提示', '请选择公海')
        }
      },
      //  点击关闭
      close: function () {
        this.ids='';
        this.$emit('closePool');
        this.poolName = '';
      },
      //  点击遮罩层
      //   clickMask:function(){
      //     this.$emit('closePool')
      //   },

      //  搜索
      changeInput: function (val) {
        this.listIndex=''
        this.poolName=val;
        this.getList();
      },

      //  选择公海池
      selectPool: function (index) {
        this.listIndex = index;
        this.poolArr=[];
        this.poolArr.push(this.poolListArr[index]);
        this.ids=this.poolListArr[index].id;  //记住选中的公海池id
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "qw-selectSea.scss";

</style>
