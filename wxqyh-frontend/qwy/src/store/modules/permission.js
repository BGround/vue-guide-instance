import { asyncRouterMap, constantRouterMap } from '@/module/approval/router/index'
import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

let rolesArray = [
    'formAdd', 'formMenu', 'formOpenlicensing', 'formDel', 'formTypeList', 'formSet',
    'formTypeEdit', 'formTypeDel', 'formOrder', 'formOpenPreview', 'formEdit', 'formOpenEdit',
    'formOpenCopy', 'formOpenOpen', 'formOpenShut', 'formOpenDel', 'formlicensing',
    'formCopy', 'formOpen', 'formShut', 'weixinapp', 'formPrintTemplate',
    'formStatistics'
]
function getRoles() {
    return  axios({
        url:  baseURL + '/vip/vipAction!wxqyhConfigNew.action?outputPermissions=' + rolesArray.toString(),
        method: 'GET'
    })
}

/** 
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
*/
function hasPermission(roles, route) {
    if(roles == undefined) {
        return false;
    } else if(route.meta && route.meta.resource) {
        return roles[route.meta.resource]
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if(hasPermission(roles, route)) {
            if(route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state: {
        roles: [], // 权限表
        routers: constantRouterMap, // 
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        }
    },
    actions: {
        GenerateRoutes({ commit }, roles) {
            return new Promise(resolve => {
                let accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
                commit('SET_ROUTERS', accessedRouters)
                resolve(roles)
            })
        },
        GetRoles({ commit }) {
            return new Promise(resolve => {
                getRoles().then(res => {
                    if(res.code != 0) {
                        _top.alert("信息提示层", res.desc)
                    }
                    let roles = res.data.permissions
                    commit('SET_ROLES', roles)
                    resolve(res.data.permissions)
                })
            })
        }
    },
    getters: {
        routers: state => state.routers,
        addRouters: state => state.addRouters,
        roles: state => state.roles
    }
}

export default permission