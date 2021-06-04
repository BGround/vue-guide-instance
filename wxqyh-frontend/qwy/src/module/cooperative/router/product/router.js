
const productMain = r => require.ensure([],()=>r(require('../../views/product/productMain')));
const productList = r => require.ensure([],()=>r(require('../../views/product/productList')));
const productReadCount = r => require.ensure([],()=>r(require('../../views/product/productReadCount')));
const productCase = r => require.ensure([],()=>r(require('../../views/product/productCase')));
const productAddOrEdit = r => require.ensure([],()=>r(require('../../views/product/productAddOrEdit')));
const caseAddOrEdit = r => require.ensure([],()=>r(require('../../views/product/productCaseAddOrEdit')));
const productSetting = r => require.ensure([],()=>r(require('../../views/product/productSetting')));
const productTypeSet = r => require.ensure([],()=>r(require('../../views/product/productTypeSet')));
const productMenu = r => require.ensure([],()=>r(require('@/components/Menu/QwMenuSet')));
// 新增经销商
const productDealerIndex = r => require.ensure([],()=>r(require('../../views/product/dealer/index')));
const productDealerRead = r => require.ensure([],()=>r(require('../../views/product/dealer/read')));
const productDealerUnread = r => require.ensure([],()=>r(require('../../views/product/dealer/unread')));

let productRouter = {
  name:'product',
  path:'/product',
  component:productMain,
  redirect:'/product/productList',
  children:[
    {
      name:'productList',
      path:'productList',
      component:productList
    },
    {
      name:'productReadCount',
      path:'productReadCount',
      component:productReadCount
    },
    {
      name:'productCase',
      path:'productCase',
      component:productCase
    },
    {
      name:'productAddOrEdit',
      path:'productAddOrEdit',
      component:productAddOrEdit
    },
    {
      name:'caseAddOrEdit',
      path:'caseAddOrEdit',
      component:caseAddOrEdit
    },
    {
      name:'productSetting',
      path:'productSetting',
      component:productSetting
    },
    {
      name:'productTypeSet',
      path:'productTypeSet',
      component:productTypeSet
    },
    {
      name:'productMenu',
      path:'productMenu',
      component:productMenu
    },
    {
      name:'productDealer',
      path:'dealer',
      component:productDealerIndex,
      children:[
        {
          name:'productDealerRead',
          path:'dealerRead',
          component:productDealerRead,
        },
        {
          name:'productDealerUnread',
          path:'dealerUnread',
          component:productDealerUnread,
        }
      ],
    }
  ]
};

export default productRouter ;
