import baseURL from './baseURL_config'
import axios from 'axios'

export default function(menuAssortment) {
  if (!window.sessionStorage.getItem('jumpVue')) {
    let pathJson = {
      channel: '/channelHome',
      archives: '/archivesList',
      dynamic: '/newsMain/list',
      diary: '/diary/diaryList',
      meetingassistant: '/meeting/meetingList',
      task: '/taskList',
      express: '/express',
      chat: '/chat/chatList',
      productinfo: '/product/productList',
      homework: '/homework/homeworkList',
      redpack: '/redpack/list',
      topic: '/topicMain/topicList'
    }
    axios
      .post(
        baseURL + '/managesetting/managesettingAction!getIndustryVer.action',
        {}
      )
      .then(function(result) {
        if (result.code == '0') {
          window.sessionStorage.setItem('jumpVue', 'jumpVue')
          if (result.data.eduPO && result.data.eduPO.industryVer == '1') {
            window.location.href = baseURL + '/manager/veredu/main.jsp'
          }
          axios
            .post(baseURL + '/menu/menuAction!ajaxSearchMenuList.action', {
              menuAssortment: menuAssortment
            })
            .then(function(result) {
              if (result.code == '0') {
                let menu = result.data.menuList[0]
                let url = ''
                if (pathJson[menu.menuModule]) {
                  url = pathJson[menu.menuModule]
                  window.location.hash = url
                  if (menu.menuModule !== 'dynamic') {
                    window.history.go(0)
                  }
                } else {
                  url = baseURL + '/manager/main.jsp'
                  window.location.href = url
                }
              }
            })
        }
      })
  }
}
