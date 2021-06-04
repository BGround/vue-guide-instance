import axios from 'axios';
import baseURL from '../../assets/js/baseURL_config';

const header = {
    namespaced: true,
    state: {
        showQRCode: false,  //关注二维码显示隐藏状态
        trustApp: {},  // 应用托管状态
        permission: {}  // 权限列表
    },
    mutations: {
        SET_SHOWQRCODE: (state, data) => {
            state.showQRCode = data;
        },
        SET_TRUSTAPP: (state, data) => {
            state.trustApp = data;
        },
        SET_PERMISSION: (state, data) => {
            state.permission = data;
        }
    },
    actions: {
        setShowQRCode: ({state,commit}, data) => {
            commit('SET_SHOWQRCODE', data);
        },
        setTrustApp: ({state,commit}, data={}) => {
            return new Promise((resolve,reject) => {
                let trustData;
                let { alert:_alert } = dataBase;
                axios({
                    url: data.url,
                    data: data.postData,
                    method: "POST",
                    dataType: "json"
                })
                .then(res => {
                    if(res.code == '0'){
                        trustData = data.isTrue ? res.data : data.computeFunc(res);
                        commit('SET_TRUSTAPP', trustData);
                        resolve(res);
                    }
                    else{
                        _alert('提示',res.desc);
                    }
                })
                .catch(err => {
                    console.log(err)
                    _alert('提示','网络错误');
                });
            })
        },
        setPermission: ({state,commit}, data) => {
            return new Promise((resolve,reject) => {
                let { alert:_alert } = dataBase;
                axios({
                    url:`${baseURL}/vip/vipAction!wxqyhConfigNew.action`,
                    method:'POST',
                    dataType:'json',
                    data:{outputPermissions:'@outputAll'}
                })
                .then(res => {
                    if(res.code == '0'){
                        commit('SET_PERMISSION', res.data.permissions);
                        resolve(res);
                    }
                    else{
                        _alert('提示',res.desc);
                    }
                })
                .catch(err => {
                    _alert('提示','错误提示');
                });
            })
        }
    },
    getters: {
        showQRCode: state => state.showQRCode,
        trustApp: state => state.trustApp,
        permission: state => state.permission
    }
}

export default header;
