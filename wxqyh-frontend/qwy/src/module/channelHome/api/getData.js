import axios from 'axios'

function commonPost(url, params, callback) {
  dataBase.loading = true
  axios.post(_.baseURL + url, params).then(function(result) {
    dataBase.loading = false
    if (result.code == '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function ajaxSearchMenuList(callback) {
  commonPost(
    '/menu/menuAction!ajaxSearchMenuList.action',
    {
      menuAssortment: 'content'
    },
    callback
  )
}

// 渠道首页-战区下的省市，如果查询战区ID为空，默认查询战区数据
export function ajaxSearchDepatmentList(data, callback) {
  commonPost(
    '/dealer/dealerAction!searchDepatmentList.action',
    data,
    callback
  )
}
