import axios from 'axios'

function commonGetData(url,params,type,callback){
  dataBase.loading=true;
  if(type=='post'){
    axios.post(_.baseURL+url,params).then(function (result) {
      dataBase.loading=false;
      if (result.code == '0'){
        callback(result.data);
      }else {
        dataBase.top_alert(result.desc,false,3000);
      }
    });
  }else if(type=='get'){
    axios.get(_.baseURL+url,params).then(function (result) {
      dataBase.loading=false;
      if (result.code == '0'){
        callback(result.data);
      }else {
        dataBase.top_alert(result.desc,false,3000);
      }
    });
  }
}

export function ajaxGetMenus(callback){
  commonGetData('/custommenus/custommenusAction!ajaxGetMenus.action',{
    params:{
      agentCode:dataBase.agentCode,
    }
  },'get',callback);
}

export function ajaxGetDefaultMenus(callback){
  commonGetData('/custommenus/custommenusAction!ajaxGetDefaultMenus.action',{
    agentCode:dataBase.agentCode,
  },'post',callback);
}

export function saveMenu(saveJson,callback) {
  commonGetData('/custommenus/custommenusAction!saveMenu.action',{
    'strJson':saveJson,
    agentCode:dataBase.agentCode,
  },'post',callback);
}

export function publishMenu(saveJson,callback) {
  commonGetData('/custommenus/custommenusAction!publishMenu.action',{
    'strJson':saveJson,
    agentCode:dataBase.agentCode,
  },'post',callback);
}
