const state = {
	basicValue: {},
	customValue: {},
	_innerPassenger: [], //临时存取
	_outerPassenger: []
}

const mutations = {
	updateBasicValue(state,payload) {
		state.basicValue = Object.assign({}, state.basicValue, payload)
	},
	updateCustomValue(state,payload) {
		state.customValue = Object.assign({}, state.customValue, payload)
	},
	updateTemporaryPassenger(state,payload) {
		state._innerPassenger = payload._innerPassenger
		state._outerPassenger = payload._outerPassenger
	},
	resetBasicData(state) {
		state.basicValue = {}
		state.customValue = {}
		state._innerPassenger = []
		state._outerPassenger = []
	}
}

export default {
	state,
	mutations
}
