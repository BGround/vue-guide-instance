import axios from 'axios';
import baseURL from 'assets/js/baseURL_config';
const SUCCESS_CODE = '0';

function getData(url,flag,method='post'){
	return async(data,callback) => {
		if(method === "post"){
			axios.post(baseURL+url,data).then(result => {
				result&&result.code == SUCCESS_CODE?callback&&callback(result.data):flag?dataBase.alert('提示', result.desc):'';
			}).catch(err=>{
			});
		}else{
			axios.get(baseURL+url,{params:data}).then(result =>{
				result&&result.code == SUCCESS_CODE?callback&&callback(result.data):flag?dataBase.alert('提示', result.desc):'';
			}).catch(err=>{
			});
		}
	}
};


// 获取部门列表
const getDepartment = getData("/department/departmentAction!listOrgNodeByParent.action");

// 获取简历列表
const getResumeList=getData("/hrResumeCtl/listResume.do");

// 获取简历详情
const getResumeDetail=getData('/hrResumeCtl/viewResumeDetail.do');
 
// 更新简历数据
const updateResume=getData('/hrResumeCtl/updateResumeData.do',true,'get');

//更新简历详情备注
const updateRemark=getData('/hrResumeCtl/updateRecruitRemark.do',true)

// 删除简历
const deleteResume=getData('/hrResumeCtl/deleteResumeData.do',true);

// 添加新增简历
const addNewBuild=getData('/hrResumeCtl/addResume.do',true)


export{
	getDepartment,
	getResumeList,
	getResumeDetail,
	updateResume,
	deleteResume,
	updateRemark,
	addNewBuild
}

