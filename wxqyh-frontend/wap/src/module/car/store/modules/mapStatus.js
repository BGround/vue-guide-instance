const defaultData = {
  mapStatus: '',
  clickTarget: '',
  fromName: '',
  location:{
    beginLocation: '',
    beginLongitude: '',
    beginLatitude: '',
    destinationLocation: '',
    destinationLatitude: '',
    destinationLongitude: '',
    realBeginLocation: '',
    realBeginLongitude: '',
    realBeginLatitude: '',
    realDestinationLocation: '',
    realDestinationLatitude: '',
    realDestinationLongitude: ''
  }
}
const state = {
  ...defaultData
}
const mutations = {
  updateFromPath(state, payload){
    state.fromPath = payload
  },
  updateMapStatus(state, payload){
    state.mapStatus = payload
  },
  updateLocation(state, payload){
    state.location =  Object.assign( {}, state.location, payload)
  },
  updateClickTarget(state, payload){
    state.clickTarget = payload
  },
  resetMapStatus(state) {
    state.mapStatus = '',
    state.clickTarget = '',
    state.fromPath = ''
    state.location = {
      beginLocation: '',
      beginLongitude: '',
      beginLatitude: '',
      destinationLocation: '',
      destinationLatitude: '',
      destinationLongitude: '',
      realBeginLocation: '',
      realBeginLongitude: '',
      realBeginLatitude: '',
      realDestinationLocation: '',
      realDestinationLatitude: '',
      realDestinationLongitude: ''
    }
  }
}
export default {state, mutations}