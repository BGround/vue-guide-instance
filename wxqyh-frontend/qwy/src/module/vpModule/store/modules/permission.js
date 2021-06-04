import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

let rolesArray = [
  'formMgrUpdate'
]
function getRoles() {
  return  axios({
    url:  baseURL + '/vip/vipAction!wxqyhConfigNew.action?outputPermissions=' + rolesArray.toString(),
    method: 'GET'
  })
}

const state = {
  roles : {}
}

getRoles().then( res => {
  state.roles = res.data.permissions;
})


export default {
  state,
}

