
const dealerList = r => require.ensure([],()=>r(require('../../views/channel/dealerList')));


export default {
    name:'dealerList',
    path:'/dealerList',
    component: dealerList,
}
