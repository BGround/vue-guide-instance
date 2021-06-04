<template>
  <div class="report-card-item" @click="handleClick">
    <div class="report-card-item__avatar">
      <img :src="getAvatar" v-img-fallback alt="">
    </div>
    <div class="report-card-item__info">
      <p class="report-card-item__name">{{getName}}</p>
      <p class="report-card-item__date">{{getDate}}</p>
    </div>
    <div class="report-card-item__status" >
      <span :style="{'background-color': getStatusColor}">{{getStatusText}}</span>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/module/channelManagement/static/images/logo.jpg'
export default {
  props:{
    data:{
      type:Object,
      required: true,
    }
  },
  data(){
    return{

    }
  },
  computed:{
    getAvatar(){
      return this.data.avatar || defaultAvatar;
    },
    getName(){
      return this.data.name || '';
    },
    getDate(){
      return this.data.date || '';
    },
    getStatusColor(){
      return this.data.statusColor || ''
    },
    getStatusText(){
      return this.data.statusText || '';
    }
  },
  methods:{
    handleClick(){
      this.$emit('click', this.data);
    }
  },
}
</script>

<style lang="scss" scoped>
  .report-card-item{
    padding: 15px 15px 15px 19px;
    background: #ffffff;
    display: flex;
    align-items: center;
    .report-card-item__avatar{
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      padding-right: 10px;
      &>img{
        width: 100%;
      }
    }
    .report-card-item__status{
      flex-shrink: 0;
      padding-left: 10px;
      &>span{
        width:42px;
        height:20px;
        color: #06ACFF;
        border-radius:2px;
        text-align: center;
        display: block;
        font-size:12px;
        line-height:20px;
        color:rgba(255,255,255,1);
      }
    }
    .report-card-item__status--unread{
      &>span{
        background:rgba(198,0,31,1);
      }
    }
    .report-card-item__info{
      width: calc(100% - 120px);
    }
    .report-card-item__date{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height:20px;
      font-size:13px;
      font-family:PingFang SC;
      font-weight:400;
      line-height:20px;
      color:rgba(153,153,153,1);
      margin-top: 7px;
    }
    .report-card-item__name{
      height:24px;
      font-size:17px;
      line-height:24px;
      color:rgba(51,51,51,1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>