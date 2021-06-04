/*工作日志*/
const diaryMain = r => require.ensure([],()=>r(require('../../views/diary/diaryMain')));
const diaryList = r => require.ensure([],()=>r(require('../../views/diary/diaryList')));
const diaryStat = r => require.ensure([],()=>r(require('../../views/diary/diaryStat')));
const diarySetting = r => require.ensure([],()=>r(require('../../views/diary/diarySetting')));
const diaryType = r => require.ensure([],()=>r(require('../../views/diary/diaryType')));
const diaryTypeAddOrEdit = r => require.ensure([],()=>r(require('../../views/diary/diaryTypeAddOrEdit')));
const diaryStatSet = r => require.ensure([],()=>r(require('../../views/diary/diaryStatSet')));
const diaryMenu = r => require.ensure([],()=>r(require('../../views/diary/diaryMenu')));

export default {
  diaryRouter:{
    name:'diary',
    path:'/diary',
    redirect:'/diary/diaryList',
    component:diaryMain,
    children:[
      {
        name:'diaryList',
        path:'diaryList',
        component:diaryList
      },
      {
        name:'diaryStat',
        path:'diaryStat',
        component:diaryStat
      },
      {
        name:'diarySetting',
        path:'diarySetting',
        component:diarySetting,
      },
      {
        name:'diaryType',
        path:'diaryType',
        component:diaryType
      },
      {
        name:'diaryTypeAddOrEdit',
        path:'diaryTypeAddOrEdit',
        component:diaryTypeAddOrEdit
      },
      {
        name:'diaryStatSet',
        path:'diaryStatSet',
        component:diaryStatSet
      },
      {
        name:'diaryMenu',
        path:'diaryMenu',
        component:diaryMenu
      }
    ]
  }
}
