/* 网点通讯录 */

const contactMain = r => require.ensure([],()=>r(require('../../views/netContact/contactMain')));
const contactSale = r => require.ensure([],()=>r(require('../../views/netContact/contactSale')));
const contactService = r => require.ensure([],()=>r(require('../../views/netContact/contactService')));

export default {
  contactRouter:{
    name:'contact',
    path:'/contact',
    redirect:'/contact/contactSale',
    component:contactMain,
    children:[
      {
        name:'contactSale',
        path:'contactSale',
        component:contactSale
      },
      {
        name:'contactService',
        path:'contactService',
        component:contactService
      },
    ]
  }
}
