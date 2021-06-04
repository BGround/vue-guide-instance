<template>
    <div class="wrap">
      <ul class="qwui-poolList">
        <li v-for="(item,index) in poolList" :key="index" class="qwui-listItem">
          <span class="iconfont":class="{check_box:listIndex===index,'icon-icon-a-common_multip':listIndex!==index}"></span>
          <input type="radio"class="qwui-poolInput" name="pool" :value="item.id" v-model="poolId" @click="clickItem(index)">
          <label><p>{{item.poolName}}</p><span class="qwui-poolClientNum">({{item.clientNum}})</span></label>
        </li>
      </ul>
      <div class="qwui-bottomButton">
        <button class="qwui-back" @click="backPoolDetail">返回</button>
        <button class="qwui-transfer" @click="transfer">转移</button>
      </div>

    </div>
</template>

<script>
    import {poolTransferList,transferClient} from '../../api/pool/getData.js'
    import {changePool,changePoolTransferClient} from '../../api/client/getData.js'
    import { mapActions } from 'vuex';
    export default {
      components:{

      },
      data(){
        return {
          id:"",//客户
          poolId:"",//公海池id
          poolList:[],//公海池列表
          listIndex:"",//列表索引
          type:"",//判断是客户详情变更公海还是公海池详情转移公海
        }
      },
      created(){
        this.id=this.$route.query.id;
        this.type=this.$route.query.type;
        this.getPoolList();
      },
      methods:{
        ...mapActions('list',[
          'delCacheArray'
        ]),

        //获取公海池列表
        getPoolList:function(){
          if(this.type=='changePool'){ //客户详情变更公海
            changePool(this.id,(result) => {
              this.poolList=result.poolList;
            })
          }else{ //公海池详情转移公海
            poolTransferList(this.id, (result) => {
              this.poolList=result.poolList;
            })
          }
        },
        //变更公海&&转移客户到其他公海池
        transfer:function(){
          let obj={
            "poolId":this.poolId,
            "clientIds":this.id,
          }
          if(this.type=='changePool'){ //客户详情变更公海
            changePoolTransferClient( obj,() => {
              this.$router.replace({path:"/ClientDetails/ClientContent",query:{id:this.id}});
            })
          }else{ //公海池详情转移公海
            transferClient( obj,() => {
              this.$router.replace({path:"/PoolDetails/PoolContent",query:{id:this.id}});
              this.delCacheArray('PoolList'); //清除公海池客户列表缓存
            })
          }
        },
        //返回
        backPoolDetail:function () {
          this.$router.go(-1);
        },

        clickItem:function (index) {
          this.listIndex = index;
        }
      }
    }
</script>

<style scoped>
  @import './PoolTransferList.scss';
</style>
