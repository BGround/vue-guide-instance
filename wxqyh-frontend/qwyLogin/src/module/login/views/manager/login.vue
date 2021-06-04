<template>
    <div id="login">
        <login-manager v-if="!showOem"></login-manager>
        <login-oem v-else></login-oem>
    </div>
</template>

<script>
import baseURL from '@/assets/js/baseURL_config';
import loginManager from '@/module/login/components/loginManager';
import loginOem from '@/module/login/components/loginOem';
export default {
    name: 'login',
    components: {
        "login-manager": loginManager,
        "login-oem": loginOem
    },
    data() {
        return {
            showOem: false,
            preCode: '',
            token: ''
        }
    },
    created() {
        localStorage.removeItem('.yyzx_liid_pop'); // 清除h5缓存，应用中心的冒泡消息
        localStorage.setItem('hasShowOverVipMaxPeerson','false'); //清除VIP超限提醒缓存
        localStorage.setItem('hasShowNoInvoiceOrder','false'); // 清除订单开票提醒缓存
        sessionStorage.removeItem('blockVip'); // 系统管理_人数超限系统（拉黑名单）
        // 判断是否有desc
        var url = decodeURIComponent(window.location.href);
        var desc = _.getUrlParam(url, 'desc');
        var redirect_uri = _.getUrlParam(url, 'redirect_uri');
        var oemName = _.getUrlParam(url, 'oem');
        if(redirect_uri){
            localStorage.setItem('redirect_uri', redirect_uri);
            if(!oemName){
                // 带redirect_uri且无oem 则清除缓存的oem
                 localStorage.removeItem('oemName');
            }
        }
        this.initParam();

        if(desc){
            localStorage.setItem('hasDesc', 'true');
            var btnName = desc == '登录页面CODE过期，需要刷新页面重新登录' ? '刷新页面' : '确定';
            _.alert('提示信息', desc,()=>{
                localStorage.removeItem('hasDesc');
                window.location.href = localStorage.getItem('redirect_uri');
            }, btnName,false,()=>{
                localStorage.removeItem('hasDesc');
                window.location.href = localStorage.getItem('redirect_uri');
            });
        }
    },
    methods: {
        initParam(){
            var url = decodeURIComponent(window.location.href);
            var oemText = _.getUrlParam(url, 'oem') || localStorage.getItem('oemName');
            if(oemText) {
                localStorage.setItem('oemName', oemText);
                this.showOem = true;
            } else {
                this.showOem = false;
            }
        }
    }
}
</script>

<style scoped>
</style>
