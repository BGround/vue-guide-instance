import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const alertManagementApi = {
	/**
	 * 项目总览
	 * @param params
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	selectStatisticsByProject(params) {
		return axios({
			method: 'get',
			baseURL: baseURL,
			url: '/pc/warningManagerStatisticsAction/selectStatisticsByProject.do',
			params: params
		}).then((data) => {
			if (data.code*1 !== 0) {
				throw new Error(data.msg)
			}
			return data.data
		}).catch((error) => {
			dataBase.alert('提示', error.message);
		})
	},
	/**
	 * 分大区
	 * @param params
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	selectStatisticsByArea(params) {
		return axios({
			method: 'get',
			baseURL: baseURL,
			url: '/pc/warningManagerStatisticsAction/selectStatisticsByArea.do',
			params: params
		}).then((data) => {
			if (data.code*1 !== 0) {
				throw new Error(data.msg)
			}
			return data.data
		}).catch((error) => {
			dataBase.alert('提示', error.message);
		})
	},
	/**
	 * 分异常类型
	 * @param params
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	selectStatisticsByType(params) {
		return axios({
			method: 'get',
			baseURL: baseURL,
			url: '/pc/warningManagerStatisticsAction/selectStatisticsByType.do',
			params: params
		}).then((data) => {
			if (data.code*1 !== 0) {
				throw new Error(data.msg)
			}
			return data.data
		}).catch((error) => {
			dataBase.alert('提示', error.message);
		})
	},
}

export default alertManagementApi
