// 任务分派任务列表页
const taskList = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskList')));
const taskAddOrEdit = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskAddOrEdit')));
// 任务分派设置页面
const taskSetting = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskSetting')));
// 任务分派类型设置页面
const taskType = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskType')));
const taskTimeSet = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskTimeSet')));
const addOrEditTaskType = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskTypeAddOrEdit')));
// 任务发布权限设置页面
const taskPermission = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskPermission')));
// 子任务发布权限设置页
const subTaskSet = r => require.ensure([],()=>r(require('../../views/taskAssignment/subTaskSet')));
// 任务菜单
const menuSet  = r => require.ensure([],()=>r(require('../../views/taskAssignment/taskMenu')));

export default {
  taskRouter:{
    name:'taskList',
    path:'/taskList',
    component:taskList,
    children:[
      {
        name:'taskSetting',
        path:'taskSetting',
        component:taskSetting,
      },
      {
        name:'taskMenu',
        path:'taskMenu',
        component:menuSet
      },
      {
        name:'taskType',
        path:'taskType',
        component:taskType,
      },
      {
        name:'taskTimeSet',
        path:'taskTimeSet',
        component:taskTimeSet
      },
      {
        name:'addOrEditType',
        path:'addOrEditType',
        component:addOrEditTaskType
      },
      {
        name:'taskAddOrEdit',
        path:'taskAddOrEdit',
        component:taskAddOrEdit
      },
      {
        name:'taskPermission',
        path:'taskPermission',
        component:taskPermission
      },
      {
        name:'subTaskSet',
        path:'subTaskSet',
        component:subTaskSet
      }
    ]
  },
}
