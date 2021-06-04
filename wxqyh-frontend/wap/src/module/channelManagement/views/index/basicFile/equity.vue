<!-- 股东股本 -->
<template>
  <div class="equity">
    <div class="header">
      股东信息
    </div>
    <div class="info">
      
       <div class="info__cell" v-for="(item, index) in shareholders" :key="index">
          <h5 class="info__name">{{item.name}}</h5>
          <p class="info__fund">占股资金：{{item.money}}万元</p>
          <p class="info__proportion">占股比例：{{item.proportion}}%</p>
          <p class="info__proportion">股东性质：{{item.nature||'-'}}</p>
          <p class="info__proportion">经营年限：{{item.business||'-'}}</p>
        </div>

        <div v-if="!shareholders.length" class="no-data--shareholders">
        <p class="">暂无记录</p>
      </div>
    </div>

    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">
        变更记录
      </div>
      <div class="panel__section" v-for="(item, index) in records" :key="index">
        <div class="panel__subtitle">
          <span class="panel__subtitle--name">{{formatNumber(index)}}股本变更</span>
          <span class="panel__subtitle--date">{{formatDate(item.changeDate)}}</span>
        </div>
        <div class="field">
          <div class="field__label">变更前</div>
          <div class="field__value">{{item.beforeInfo}}</div>
        </div>
        <div class="field">
          <div class="field__label">现信息</div>
          <div class="field__value">{{item.nowInfo}}</div>
        </div>
      </div>
      <div v-if="!records.length" class="no-data">
        <p class="">暂无记录</p>
      </div>
     
    </div>
  </div>
</template>

<script>

import {getShareHolder, getShareHolderLog } from '@/module/channelManagement/api/basic';

export default {
  data(){
    return {
      shareholders: [],
      records: []
    }
  },
  methods:{
    formatNumber(index){
      const n = index+1;
      return n>=10? `${n}`: `0${n}`;
    },
    formatDate(changeDate){
      if(changeDate){
        const [date] = changeDate.split(' ');
        return date;
      }else{
        return '暂无'
      }
    },
  },
  created() {
    const dealerId = this.$route.query.dealerId;
    getShareHolder({dealerId}).then((data)=>{
      if(data){
        this.shareholders = data.shareHolderPoList;
      }
    }) 
    getShareHolderLog({dealerId}).then((data)=>{
      if(data){
        this.records = data.shareHolderLogList;
      }
    });
  },
}
</script>

<style lang="scss" scoped>
  .equity{
    
    padding-bottom: 50px;
    .header{
      padding: 16px 15px 15px;
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
      background: #ffffff;
    }

    .info{
      background: #ffffff;
      position: relative;
      margin-bottom: 15px;
      display: flex;
      flex-wrap: wrap;
      &::after{
         content: '';
         position: absolute;
          display: block;
          top: 0;
          width: 100%;
          background: rgba(219,219,219,1);
          height: 1px;
          transform: scaleY(0.5);
      }
      &::before{
         content: '';
         position: absolute;
          display: block;
          bottom: 0;
          width: 100%;
          background: rgba(219,219,219,1);
          height: 1px;
          transform: scaleY(0.5);
      }

      .info__cell{
        width: 50%;
        position: relative;
        flex-shrink: 0;
        padding: 15px 0;
        &> .info__name{
            height:23px;
            font-size:16px;
            line-height:28px;
            color:rgba(0,0,0,1);
            padding-bottom: 6px;
            padding-left: 15px;
            padding-right: 5px;
          }
        &> .info__proportion,
        &> .info__fund{
          height:24px;
          font-size:13px;
          font-family:PingFang SC;
          font-weight:400;
          line-height:24px;
          color:rgba(153,153,153,1);
          padding-left: 15px;
          padding-right: 5px;
        }
        &::after{
          content: '';
          position: absolute;
          display: block;
          bottom: 0;
          width: 100%;
          background: rgba(219,219,219,1);
          height: 1px;
          transform: scaleY(0.5);
        }
        &::before{
          content: '';
          position: absolute;
          display: block;
          right: 0;
          width: 100%;
          background: rgba(219,219,219,1);
          width: 1px;
          top: 0;
          bottom: 0;
          transform: scaleX(0.5);
        }
        &:nth-child(2n+2)::before{
          display: none;
        }
      
      }
    }

    .gutter{
      height:8px;
      background:rgba(245,245,245,1);
    }

    .panel{
      padding: 15px; 
      background: #ffffff;
    }

    .panel__title{
      padding: 0;
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
    }

    .panel__section{
      // padding-top: 15px;
      position: relative;
      padding-bottom: 15px;
      &::after{
          content: '';
          position: absolute;
          display: block;
          width: 100%;
          height: 1px;
          background: rgba(219,219,219,1);
          bottom: 0;
          transform: scaleY(0.5);
      }
    }

    .panel__subtitle{
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      padding-top:15px;
    }
    .panel__subtitle--name{
      height:18px;
      font-size:16px;
      font-weight:600;
      line-height:18px;
      color:rgba(51,51,51,1);
    }
    .panel__subtitle--date{
      height:20px;
      font-size:14px;
      font-family:PingFang SC;
      font-weight:400;
      line-height:29px;
      color:rgba(153,153,153,1);
    }

    .field{
      display: flex;
      align-items: flex-start;
    }

    .field__label{
      font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      line-height:20px;
      padding: 7px 0;
      color:rgba(153,153,153,1);
      margin-right: 10px;
      white-space: nowrap;
    }

    .field__value{
      font-size:15px;
      font-weight:400;
      line-height:20px;
      padding: 7px 0;
      color:rgba(51,51,51,1);
    }
    .no-data{
      line-height:20px;
      padding-top: 15px;
      padding-bottom: 10px;
      text-align:center;
      color: #ccc;
      width: 100%;
    }
    .no-data--shareholders{
      line-height:20px;
      text-align:center;
      color: #ccc;
      width: 100%;
      padding-top: 15px;
      padding-bottom: 30px;
    }
  }
</style>

