let addUpdate = {
  // 获取详情、更新
  draftDetail: {
    url: "/portal/checkWorkFormCtrl/viewRepCheckWorkInfo.do",
    buttonConfig:{ //操作按钮
      primaryList:[{type:"primary",name:'i18n.submit',callBack:null}],
      defaultList:[{type:"default",name:'i18n.cancel', callBack:null}],
      style:{class:""}//按钮是否置底部 active :底部、"":相对定位
    },
    commitDraft: { // 更新 方法
      draftFormData: {}// 更新 数据格式
    }
  },
  /**腾讯地图坐标转换为百度地图坐标 */
  mapabcEncryptToBdmap(gg_lat, gg_lon){
    let point=new Object();
	  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = new Number(gg_lon);
    let y = new Number(gg_lat);  
    let z =  Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
    let bd_lon = z * Math.cos(theta) + 0.0065;  
    let bd_lat = z * Math.sin(theta) + 0.006; 
    point.lng=bd_lon;
    point.lat=bd_lat;
    return point;
  },
  /**百度地图坐标转换为腾讯地图坐标 */
  BdmapEncryptToMapabc(bd_lat,bd_lon){
    let point=new Object();
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = new Number(bd_lon - 0.0065);
    let y = new Number(bd_lat - 0.006);
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let Mars_lon = z * Math.cos(theta);
    let Mars_lat = z * Math.sin(theta);
    point.lng=Mars_lon;
    point.lat=Mars_lat;
    return point;
  }
}
export default addUpdate;
