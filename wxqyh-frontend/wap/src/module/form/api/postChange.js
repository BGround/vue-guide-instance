import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

// 岗位变更人员信息回写接口
export async function findPostChangeInformation(params) {
  return axios
    .post(_.baseURL + '/portal/flow/flowBranchAction!findPostChangeInformation.action', params )
    .then(res => {
      if(res.code == "0") {
        return res.data
      } else {
        _.alert('提示', res.desc);
        throw Error;
      }
    })
}
