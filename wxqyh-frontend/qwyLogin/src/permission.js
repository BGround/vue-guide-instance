import router from './module/approval/router'
import store from './module/approval/store'
// import { getToken, removeToken } from '@/'

router.beforeEach((to, from, next) => {
    if(store.getters.roles.length === 0) {
        // 获取权限表
        store.dispatch('GetRoles').then((roles) => {
            store.dispatch('GenerateRoutes', roles).then(() => {
                let addRouters = store.getters.addRouters
                router.addRoutes(addRouters)
                next({ ...to })
            })
        })
    } else {
        next()
    }
})