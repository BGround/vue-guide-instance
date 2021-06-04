<template>
  <div class="qwui-activity_list" :class="{'qwui-activity_background':!activityListObj.noContentTips}">
  <div class="qwui-noContent" v-if="activityListObj.noContentTips">
    <img src='~assets/images/img_a-homepage_blank2.svg'>
    <div>
      <span>{{activityListObj.noContentTextOne}}</span>
      <span>{{activityListObj.noContentTextTwo}}</span>
    </div>
  </div>
  <div class="qwui-activity_content" v-for="(item,index) in activityListObj.activityList" :key="index" @click="gotoDetail(item)">
    <div class="qwui-activity_head">
      <img class="qwui-cover_img" :src=imgUrl(item.coverImage)||defaultImg alt="">
      <div class="qwui-activity_status" v-if="!isDraft" :class="{'qwui-blue_bg':setStatus(item)==='进行中'||setStatus(item)==='报名截止'}">{{setStatus(item)}}</div>
    </div>
    <p class="qwui-activity_title overflowEllipsis">{{item.title}}</p>
    <div class="qwui-item_footer">
      <div class="qwui-activity_time">
        <span>{{calculateTime(item.activityStart,item.activityStop,true)}}</span> 至 <span>{{calculateTime(item.activityStop,item.activityStart,false)}}</span>
      </div>
      <div class="qwui-activity_population">
        <div v-if="!isDraft" class="qwui-population_num">
          <span class="qwui-reg_people">{{item.registryCount}}</span>/<span class="qwui-total_people">{{setRegisSum(item)}}</span>
        </div>
        <img 
          class="qwui-more_operation" 
          v-if="item.creator==userId"
          src="~assets/images/icon_a-homepage_more.svg" 
          @click.stop="moreOperation(item,index)">
      </div>
    </div>
  </div>
  </div>
</template>
<script>
export default {
  props:{
    activityListObj:{
      type:Object,
    },
    isDraft:{
      type:Boolean,
      default:false,
    },
  },
  created(){
    
  },
  computed:{
    
  },
  data(){
    return{
      defaultImg:require('assets/images/activity_noContent.svg'),
      userId:_.userId,
      week:[
        '周日',
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六'
      ]
    }
  },
  methods:{
    moreOperation(item,index){
      this.$emit('moreOperation',{item,index})
    },
    setStatus(item){
      let setStatus='';
      let startTime=Date.parse(item.activityStart.replace(/-/gi,"/"));
      let stopTime=Date.parse(item.activityStop.replace(/-/gi,"/"));
      let registryTime=Date.parse(item.registryStop.replace(/-/gi,"/"));
      let dateTime=new Date().getTime();
      if(item.activityStatus=='取消'){
        return '已取消';
      }else{
        if(startTime <= dateTime && dateTime <= stopTime || registryTime > dateTime){
          return '进行中';
        }else if(stopTime <= dateTime){
          return '已结束';
        }else if(registryTime <= dateTime){
          return '报名截止'
        }
      }
    },
    isSingUpEnd(item){
      return  registryTime <= dateTime?true:false;
    },
    setRegisSum(item){
      return item.regis_sum==='0'?'不限人数':item.regis_sum+'人';
    },
    imgUrl(url){
      return url?_.compressURL+url:url;
    },
    gotoDetail(item){
      this.$emit('gotoDetail',item)
    },
    calculateTime(date,otherDate,isStartTime){
      let time=this.getCurrentTime();
      let sunday=Date.parse(new Date(time.sunday));
      let monday=Date.parse(new Date(time.monday));
      let today=Date.parse(new Date(time.today));
      let yesterday=Date.parse(new Date(time.yesterday));
      let tomorrow=Date.parse(new Date(time.tomorrow));
      let currentTime=Date.parse(date.replace(/-/gi,"/").substr(0,10));
      let second=date.replace(/-/gi,"/").substr(11,date.length-1);
      if(currentTime===today){
        return '今天'+second;
      }else if(currentTime===tomorrow){
        return '明天'+second;
      }else if(currentTime===yesterday){
        return '昨天'+second;
      }else {
        let weekIndex=Math.abs(new Date(time.sunday).getDay()-new Date(date.replace(/-/gi,"/")).getDay());
        if(monday<=currentTime&&currentTime<=sunday){//本周
          return '本'+this.week[weekIndex]+second;
        }else if(currentTime<monday&&monday-currentTime<=7*24*60*60*1000){
          return '上'+this.week[weekIndex]+second;
        }else if(currentTime>sunday&&currentTime-sunday<=7*24*60*60*1000){
          return '下'+this.week[weekIndex]+second;
        }else{
          if(date.replace(/-/gi,"/").substr(0,4)===otherDate.replace(/-/gi,"/").substr(0,4)){
            return isStartTime?date:date.substr(5,otherDate.length-1);
          }else{
            return date.substr(0,10);
          }
        }
      }
    },
    getCurrentTime(){
      let timestamp=Date.parse(new Date());//当前时间戳
      let serverDate=new Date(timestamp);//当前时间
      let yesterdayTimeStamp=timestamp-24*60*60*1000;
      let yesterday=new Date(yesterdayTimeStamp);
      let tomorrowTimeStamp=timestamp+24*60*60*1000;
      let tomorrow=new Date(tomorrowTimeStamp);
      let sundayTimeStamp=timestamp+((7-serverDate.getDay())*24*60*60*1000);//当周周日时间戳
      let sundayData=new Date(sundayTimeStamp);//当周周日
      let mondayImeStamp=timestamp-((serverDate.getDay()-1)*24*60*60*1000);//当周周一时间戳
      let mondayData=new Date(mondayImeStamp);//当周周一
      return {
        sunday:this.getTime(sundayData),
        monday:this.getTime(mondayData),
        today:this.getTime(serverDate),
        yesterday:this.getTime(yesterday),
        tomorrow:this.getTime(tomorrow)
      }
    },
    getTime(date){
      let year=date.getFullYear();//年
      let month=date.getMonth()+1<10?'0'+date.getMonth()+1:date.getMonth()+1;//月
      let day=date.getDate()<10?'0'+date.getDate():date.getDate();//日
      return ''+year+'/'+month+'/'+day;
    }
  },
}
</script>
<style lang="scss" scoped>
  .qwui-activity_list{
    .qwui-activity_background{
      background: #fff;
    }
    margin: 16px 14px 0;
    .qwui-noContent{
      margin-top:41px;
      text-align: center;
      span{
        display: inline-block;
        width: 65%;
        color:#B2B9C8;
        font-size: 14px;
      }
    }
    .qwui-activity_content{
      margin-top: 16px;
      border-radius: 4px;
      box-shadow:0px 2px 12px 0px rgba(178,185,200,0.3);
      .qwui-activity_head{
        position: relative;
        .qwui-cover_img{
          object-fit: cover;
          width: 100%;
          height: 194px;
          border-radius:4px;
        }
        .qwui-activity_status{
          position: absolute;
          top: 16px;
          right: 0;
          height: 21px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          line-height: 21px;
          border-radius: 100px 0 0 100px;
          background: #B2B9C8;
          padding:0 4px 0 8px;
        }
        .qwui-blue_bg{
          background: #5585F0;
        }
      }
      .qwui-activity_title{
        color: #0A1735;
        font-size: 16px;
        font-weight: 600;
        margin: 14px 14px 1px;
      }
      .overflowEllipsis{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      .qwui-item_footer{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px 14px;
        .qwui-activity_time{
          color: #B2B9C8;
          font-size: 12px;
          padding-top: 9px;
        }
        .qwui-activity_population{
          color: #B3BAC9;
          font-size: 12px;
          vertical-align: bottom;
          .qwui-population_num{
            display: inline-block;
            .qwui-reg_people{
              color: #5585F0;
              font-size: 20px;
              padding-right: 4px;
            }
          }
          .qwui-more_operation{
            position: relative;
            top: 8px;
            left: 6px;
          }
        }
      }
    }
    
    
  }
</style>


