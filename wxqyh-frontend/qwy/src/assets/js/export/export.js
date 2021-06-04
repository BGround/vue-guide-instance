import axios from 'axios';

export default {
  methods:{
    //设置导出时间长度
    exportDaysLimitByMonthCounts(sTime,eTime,monthCounts=2){
      let exportDaysDesc="";
      var starTime = new Date(sTime.replace(/-/g,"/"));
      var endTime = new Date(eTime.replace(/-/g,"/"));
      var days=Math.floor((endTime.getTime()-starTime.getTime())/(24*60*60*1000));
      if(days>(31*monthCounts)){//用31日当做一个月,注意修改提示消息的文字
        var cnCounts="";
        if(monthCounts==1){
          cnCounts="一";
        }else if(monthCounts==2){
          cnCounts="二";
        }else if(monthCounts==3){
          cnCounts="三";
        }else if(monthCounts==4){
          cnCounts="四";
        }else if(monthCounts==5){
          cnCounts="五";
        }else if(monthCounts==6){
          cnCounts="六";
        }else if(monthCounts==7){
          cnCounts="七";
        }else if(monthCounts==8){
          cnCounts="八";
        }else{
          cnCounts="二";//默认两个月
        }
        exportDaysDesc="不要一次性导出跨度超过"+cnCounts+"个月的记录";
        dataBase.top_alert(exportDaysDesc,false,3000);
        return false;
      }
      return true;
    },
    _createReport(params,callback){
      let self = this;
      axios.post(_.baseURL+'/report/reportAction!checkReport.action',params).then(function(result){
        if(result.code == '0'){
          if(result.data.useReport){
            if(result.data.fileName||result.data.fileName == "undefined"){
              _.alert("提示", "已找到相同查询条件的报表：【"+result.data.fileName+"】是否重新导出？",function(){
                self._exportReport(params);
              }, '确定', true);
            }else{
              self._exportReport(params);
            }
          }
        }else{
          dataBase.top_alert(result.desc,false,3000);
        }
      })
    },
    _exportReport(params){
      axios.post(_.baseURL+'/report/reportAction!createReportTask.action',params).then(function(result){
        if(result.code == '0'){
          if (dataBase.agentCode === 'partyconstruction') {
            _.alert("提示", "操作成功，请稍后到<a href='"+_.baseURL+"/manager/partyconstruction/settings.jsp' style='color:#f87b00'>导出报表管理(点击跳转)</a>处下载对应的导出文件："+result.data.fileName);
          } else {
            _.alert("提示", "操作成功，请稍后到<a href='"+_.baseURL+"/manager/report/reportTask_main.jsp' style='color:#f87b00'>导出报表管理(点击跳转)</a>处下载对应的导出文件："+result.data.fileName);
          }
        }else{
          _.alert("提示", "导出失败，请联系管理员...");
        }
      });
    }
  }
}
