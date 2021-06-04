const visit={
  path:'visit',
  name:'visit',
  redirect:'visit/list',
  component:()=>import('crm/views/crm/visit'),
  children:[
    {
      path:'list',
      name:'visitList',
      component:()=>import('crm/views/crm/visit/list/list'),
      meta:{
        role:'crm',
      }
    },
    {
      path:'edit',
      name:'visitEdit',
      component:()=>import('crm/views/crm/visit/edit/edit'),
      meta:{
        role:'crm',
      }
    }
  ]
}

export default visit;

