/**
   * 导出检查函数
   * @param checkExportRequest {request} - 必传，导出检查函数，判断是否有导出过
   * @param obj {obj} - 必传，传入参数
   * @returns {Promise<any>} - result为返回值，成功与否
   */
  export function checkExport(checkExportRequest,obj){
    let result = new Promise((resolve,reject) => {
        checkExportRequest(obj).then(res => {
            if(res.code == '0' && res.data.useReport){
                if(res.data.fileName || res.data.fileName == "undefined"){
                    _.alert('提示', "已找到相同查询条件的报表：【"+res.data.fileName+"】是否重新导出？",function () {
                        resolve(res);
                    },'确定',true)
                }else{
                    resolve(res);
                }
            }
            else{
                reject(res.desc);
            }
        })
        .catch(err => {
            _.alert('提示','网络错误');
        });
    })
    return result;
}


/**
   * 导出操作函数
   * @param createReportRequest {request} - 必传，导出函数请求
   * @param obj {obj} - 必传，传入参数
   */
export function exportReport(createReportRequest,obj){
    createReportRequest(obj).then(res => {
        if(res.code == '0'){
            _.alert('提示','操作成功，请稍后到<a href="'+ _.baseURL +'/manager/report/reportTask_main.jsp" target="_blank" ' +
            'style="color:orange;">'+'导出报表管理(点击跳转)</a>处下载对应的导出文件：'+res.data.fileName,function () {
            },'确定',true)
        }else{
            _.alert('提示',res.desc)
        }
    })
}
