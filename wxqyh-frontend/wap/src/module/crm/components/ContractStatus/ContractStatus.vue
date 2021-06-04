<template>
    <div class="qwui-contrStatus">
      <div class="qwui-contrStatus_list">
        <div class="qwui-contrStatus_head">
          <span class="qwui-contrStatus_cancel">取消</span>
          <span class="qwui-contrStatus_title">更新合同状态</span>
          <span class="qwui-contrStatus_comfirm" @click="comfirmStatus(item)">确定</span>
        </div>
        <ul class="qwui-contrStatus_statusList">
          <li>请选择</li>
          <li v-for="(item,index) in statusList" @click="selectStatus(index)" :class="{statusActive:stautsIndex==index}">{{item.name}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
  import {getContractStatusList} from  '../../api/contract/getData.js';
    export default {
      data(){
        return {
          statusList:[],
          newStatusList:[],
          stautsIndex:"",
        }
      },
      props:{
        currentStatus:String,
      },
      created(){

      },
      mounted(){
        this.getStatus();
      },
      methods:{
        getStatus:function(){

          getContractStatusList((result) => {
            this.statusList=result.list;
            for(let i=0;i<this.statusList.length;i++){
              if(this.statusList[i].name==this.currentStatus){
                this.stautsIndex=i;
              }
            }

            // for(let i=0;i<this.statusList.length;i++){
            //   this.statusList.push({ name: "请选择"})
            // }
            // console.log( this.statusList)
          })
        },

        comfirmStatus:function(){

        },

        selectStatus:function(index){
          this.stautsIndex=index;
          console.log(this.currentStatus)
        }

      }
    }
</script>

<style scoped>
  @import './ContractStatus.scss';
</style>
