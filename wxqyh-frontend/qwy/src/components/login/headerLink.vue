<!--
    登录页面头部模块 右边菜单栏
 -->
<template>
    <!--头部右边菜单-->
    <div id="loginHeaderLink" class="qwui-header_right">
        <!--右边菜单模块-->
        <ul class="qwui-nav">
            <li><a href="http://wbg.do1.com.cn" target="_blank" class="qwui-nav_link">企微官网</a></li>
            <li @mouseover="showMoreNav" @mouseout="showMoreNav">
                <a class="qwui-nav_link qwui-nav_linkMore">更多</a>
                <div class="qwui-nav-more" v-show="showMore">
                    <a target="_blank" v-for="item in navMoreMenu" :key="item.name" :href="item.url">{{ item.name }}</a>
                </div>
            </li>
        </ul>
    </div>
    
</template>

<script>
export default {
    name: 'loginHeaderLink',
    props: {
        /*
         * 更多菜单  
         * name 名称
         * url 链接地址
         */
        navMoreMenu: {
            type: Array,
            default: () => {
                return  [{
                            name: '企微资料下载',
                            url: 'http://wbg.do1.com.cn/icon.html'
                        }, {
                            name: '套件安装手册',
                            url: 'http://wbg.do1.com.cn/suiteps/question/st_help.html',
                        }, {
                            name: '管理平台使用手册',
                            url: 'http://wbg.do1.com.cn/ask/gongnenxiangguan/2015/0930/437.html',
                        }, {
                            name: '企微学院',
                            url: 'http://wbg.do1.com.cn/School/'
                        }]
            }
        }
    },
    data() {
        return {
            showMore: false,
        }
    },
    methods: {
         // 鼠标划过更多子栏目显示
        showMoreNav() {
            this.showMore = !this.showMore;
        },
    }
}
</script>

<style scoped>
.qwui-header_right {
    height: auto;
    margin: 0 auto;
}
.qwui-nav li {
    display: inline-block;
    position: relative;
    margin: 0 20px;
    text-align: center;
}
.qwui-nav .qwui-nav_link {
    font-size: inherit;
    cursor: pointer;
} 
.qwui-nav .qwui-nav_link:hover {
    color: #666;
}
.qwui-nav .qwui-nav_linkMore::before{
    position: absolute;
    top: 8px; 
    right: -14px; 
    height: 0;
    border-width: 5px;
    border-color: #999 transparent transparent;
    border-style: solid;    
    content: '';
}
.qwui-nav .qwui-nav-more {
    position: absolute;
    top: 100%;
    right: -16px;
    z-index: 11;
    width: 130px;
    padding: 10px 0;
    background: none repeat scroll 0 0 #eaeaea;
}
.qwui-nav .qwui-nav-more a {
    display: block;
    height: 40px;
    line-height: 40px;
    color: #666;
}
</style>
