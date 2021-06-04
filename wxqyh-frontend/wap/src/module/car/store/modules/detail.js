
const defaultData = {
	detailData: null,       // 详情数据
	carDetail: {
		carId: '',
		carName: '',
		carNumber: '',
		driverId: '',
		driverName: '',
		driverMobile: ''
  },        // 车辆数据
  canPassengerEdit: false //乘车人是否可编辑
}

const state = {
	currentIndex: 0,            // 详情导航索引
	...defaultData
}
const mutations = {
  // 更新详情信息
  updateDetailData(state,payload) {
    state.detailData = Object.assign({},state.detailData,payload)
	},
	// 更新车辆信息
  updateCarDetail(state,payload) {
    state.carDetail = Object.assign({},state.carDetail,payload)
	},
	// 更新导航索引
  updateCurrentIndex(state,payload) {
    state.currentIndex = payload
  },
  // 更新乘车人是否编辑
  updateCanEdit(state,payload) {
    state.canPassengerEdit = payload
  },
  // 重置详情数据
  resetDetailData(state) {
    Object.assign(state,defaultData)
    state.canPassengerEdit = false
  },
  // 重置车辆数据
  resetCarDetail(state) {
    state.carDetail = {
      carId: '',
      carName: '',
      carNumber: '',
      driverId: '',
      driverName: '',
      driverMobile: ''
    }
  },
  resetCurrentIndex(state) {
    state.currentIndex = 0
  }
}

export default {
  state,
  mutations
}
