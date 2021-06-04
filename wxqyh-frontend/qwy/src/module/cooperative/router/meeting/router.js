/* 会议助手 */

const meetingMain = r => require.ensure([],()=>r(require('../../views/meeting/meetingMain')));
const meetingList = r => require.ensure([],()=>r(require('../../views/meeting/meetingList')));
const meetingSummary = r => require.ensure([],()=>r(require('../../views/meeting/meetingSummary')));
const meetingSetting = r => require.ensure([],()=>r(require('../../views/meeting/meetingSetting')));
const meetingRoom = r => require.ensure([],()=>r(require('../../views/meeting/meetingRoom')));
const meetingSignIn = r => require.ensure([],()=>r(require('../../views/meeting/meetingSignIn')));
const meetingPermission = r => require.ensure([],()=>r(require('../../views/meeting/meetingPermission')));
const meetingSignage = r => require.ensure([],()=>r(require('../../views/meeting/meetingSignage')));
const meetingMenu = r => require.ensure([],()=>r(require('../../views/meeting/meetingMenu')));

export default {
  meetingRouter:{
    name:'meeting',
    path:'/meeting',
    redirect:'/meeting/meetingList',
    component:meetingMain,
    children:[
      {
        name:'meetingList',
        path:'meetingList',
        component:meetingList
      },
      {
        name:'meetingSummary',
        path:'meetingSummary',
        component:meetingSummary
      },
      {
        name:'meetingSetting',
        path:'meetingSetting',
        component:meetingSetting
      },
      {
        name:'meetingRoom',
        path:'meetingRoom',
        component:meetingRoom
      },
      {
        name:'meetingSignIn',
        path:'meetingSignIn',
        component:meetingSignIn
      },
      {
        name:'meetingPermission',
        path:'meetingPermission',
        component:meetingPermission
      },
      {
        name:'meetingSignage',
        path:'meetingSignage',
        component:meetingSignage
      },
      {
        name:'meetingMenu',
        path:'meetingMenu',
        component:meetingMenu
      },
    ]
  }
}
