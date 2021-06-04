/*移动报销*/
const _import = file => r => require.ensure([], () => r(require('../../views/reimbursement/' + file + '.vue')))
// const test = r => require.ensure([],()=>r(require('../../views/reimbursement/debit/test')));

export default {
  reimRouter:{
    /*name:'test',
    path:'/test',
    component:test,
    children:[
      {
        /!*name:'diaryList',
        path:'diaryList',
        component:diaryList*!/
      },
    ]*/

    path: 'reimBox',
    name: 'reimBox',
    component: _import('reimBox'),
    children: [
      {path: 'debitList', component: _import('debit/debitList'), name: 'debitList',meta:{module:'debitList'}},
      {path: 'filedConfig', component: _import('debitSetting/filedConfig'), name: 'filedConfig',meta:{module:'setting'}},
      {path: 'flowConfig', component: _import('debitSetting/flowConfig'), name: 'flowConfig',meta:{module:'setting'}},
      {path: 'printConfig', component: _import('debitSetting/printConfig'), name: 'printConfig',meta:{module:'setting'}},
      {path: 'probablyConfig', component: _import('debitSetting/probablyConfig'), name: 'probablyConfig',meta:{module:'setting'}},
      {path: 'typeListConfig', component: _import('debitSetting/typeListConfig'), name: 'typeListConfig',meta:{module:'setting'}}
    ],
  }
}
