<!--
    登录页面底部模块
 -->
<template>
    <div class="qwui-footer" id="loginFooter">
        <div class="qwui-inner_footer">
            <a class="qwui-footer_link" v-for="(item, index) in footerMenu" :key="index" :href="item.url" target="_blank">{{ item.name }}</a>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'loginFooter',
    props: {
        /*
         * 底部菜单  
         * name 名称
         * url 链接地址
         */
        footerMenu: {
            type: Array,
            default: () => {
                return   [{
                            name: '关于我们',
                            url: 'http://wbg.do1.com.cn/More/About/About_us/'
                        }, {
                            name: '典型案例',
                            url: 'http://wbg.do1.com.cn/anli/',
                        }, {
                            name: '企微学院',
                            url: 'http://wbg.do1.com.cn/School/'
                        }, {
                            name: '咨询电话：400-111-2626',
                        }, {
                            name: `Copyright©2004-${new Date().getFullYear()} DO1.com.cn All Rights Reserved 粤B2-20062018号`,
                        }]
            }
        }
    }
}
</script>

<style scoped>
.qwui-footer {
    background-color: #fcfcfc;
}
.qwui-footer .qwui-inner_footer {
    width: 95%;
    margin: 0 auto;
    padding: 10px 0 0;
    font-size: 0;
    color: #666;
    text-align: center;
}
.qwui-inner_footer .qwui-footer_link {
    font-size: 12px;
}
.qwui-inner_footer .qwui-footer_link:after {
    content: '|';
    padding: 0 8px;
}
.qwui-inner_footer .qwui-footer_link:last-child::after {
    content: '';
}
.qwui-inner_footer .qwui-footer_link:hover {
    color: #666;
}
</style>
