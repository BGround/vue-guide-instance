/*  用于判断是否拥有分组权限
*   managerType: 管理员类型
*   creator: 分组创建者
*/
export function hasGroupAuthority(creator) {
    let userName = dataBase.config.userName,
        managerType = dataBase.config.managerType;
    if(managerType != 0 && userName != creator) {
        return false
    } else {
        return true
    }
}
