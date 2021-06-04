/**
 * oem下所有的登录页面
 * name ==> 名称
 * nameClass ==> 名称样式class名
 * picture ==> 图标相关内容 （地址url， 宽width， 高height）
 * tabsParam ==> 登录框tab 头部名称 默认['管理平台', '个人网页'],
 * bgImg ==> 背景图片地址
 * loginBoxMarginTop ==> 登录框外上边距
 * loginBoxClass ==> 登录框样式class名
 * isFull ==> 背景图的高是否布满浏览器
 * copyRight ==> 底部 工商号
 */
const viewList = {
    'bit': {
        name: '北京理工大学',
        picture: {
            url: require('@/assets/images/oem_logo_bit.jpg')
        },
    },
    'bjwx': {
        name: '北京万象娱通网络科技股份有限公司'
    },
    'bsh': {
        name: '博西家用电器（中国）有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_bsh.png')
        },
    },
    'cbxz': {
        name: '城北区人民政府行政服务中心'
    },
    'cl': {
        name: '侨益物流股份有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_cl.png')
        },
    },
    'cscec': {
        name: '',
        picture: {
            url: require('@/assets/images/oem_logo_cscec.png'),
            height: '60px'
        },
        tabsParam: ['管理后台', '个人网页版'],
        bgImg: require('@/assets/images/oem_bg2_login.jpg')
    },
    'do1vip': {
        name: '',
        picture: {
            url: require('@/assets/images/oem_logo_do1vip.png')
        },
        tabsParam: ['管理后台', '个人网页版'],
        bgImg: require('@/assets/images/oem_bg2_login.jpg')
    },
    'drcbank': {
        name: '银校通系统管理后台',
        nameClass: 'qwui-title_drcbank',
        picture: {
            url: require('@/assets/images/oem_logo_drcbank.png')
        }        
    },
    'eral': {
        name: '',
        picture: {
            url: require('@/assets/images/oem_logo_eral.png'),
            height: '60px'
        },
        tabsParam: ['管理后台登录'],
        bgImg: require('@/assets/images/oem_bg2_login.jpg'),
        loginBoxClass: 'qwui-loginBox_eral'      
    },
    'fandy': {
        name: '',
        bgImg: require('@/assets/images/oem_bg3_login.jpg'),
        loginBoxMarginTop: '220px',
    },
    'flq': {
        name: '重庆市涪陵区国家税务局'
    },
    'ganlee': {
        picture: {
            url: require('@/assets/images/oem_logo_ganlee.png'),
            width: '88px',
            height: '50px'
        },
    },
    'gdhl95': {
        name: '广东鸿联九五信息产业有限公司'
    },
    'gpes': {
        name: '广州电力工程监理有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_gpes.png')
        }
    },
    'highhopegroup': {
        name: '江苏汇鸿国际集团中天控股有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_highhopegroup.jpg'),
            width: '50px',
            height: '50px'
        }
    },
    'hny': {
        name: '海南云在线网络科技有限公司'
    },
    'hthy': {
        name: '北京华图宏阳教育文化发展股份有限公司厦门分公司',
        picture: {
            url: require('@/assets/images/oem_logo_hthy.png'),
            width: '142px',
            height: '50px'
        }
    },
    'jbmy': {
        name: '九百米网络科技有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_jbmy.jpg'),
            width: '106px',
            height: '30px'
        }
    },
    'jzhr': {
        name: '广州建智企业管理服务有限公司'
    },
    'ljjt': {
        picture: {
            url: require('@/assets/images/oem_logo_ljjt.png')
        },
        tabsParam: ['管理后台', '个人网页版'],
        bgImg: require('@/assets/images/oem_bg2_login.jpg')      
    },
    'ltxx': {
        name: '龙拓鑫玺（北京）国际网络技术服务有限公司'
    },
    'lxzx': {
        name: '鲁迅中学'
    },
    'mj': {
        name: '上海闵捷网络科技发展有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_mj.jpeg'),
            width: '205px',
            height: '50px'
        }
    },
    'msyh': {
        name: '中国民生银行股份有限公司北京国贸支行'
    },
    'pt0594': {
        name: '福建省莆田市凯兴工贸有限公司'
    },
    'py': {
        name: '濮阳教育党建',
        picture: {
            url: require('@/assets/images/oem_logo_py.png')
        }
    },
    'sdnsh': {
        name: '广东顺德农村商业银行股份有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_sdnsh.png')
        }
    },
    'sedsy': {
        name: '深圳桑达商用机器有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_sedsy.png')
        }
    },
    'shmh': {
        bgImg: require('@/assets/images/oem_bg4_login.jpg'),
        loginBoxMarginTop: '120px',
    },
    'shpro': {
        name: '上海市人民检察院'
    },
    'suncloud': {
        name: '太阳云计算有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_suncloud.png')
        }
    },
    'szkx': {
        name: '重庆市石柱土家族自治县科学技术协会'
    },
    'tchnt': {
        name: '天津市天材伟业建筑材料有限公司',
        nameClass: 'qwui-title_tchnt',
        picture: {
            url: require('@/assets/images/oem_logo_tchnt.png'),
            width: '175px',
            height: '75px'
        }
    },
    'test': {
        name: '道一云|企微',
        picture: {
            url: require('@/assets/images/oem_logo_test.png'),
            width: '106px',
            height: '30px'
        }
    },
    'tibet990': {
        name: '西藏玖佰玖科技发展有限公司'
    },
    'wanfang': {
        name: '北京万方软件股份有限公司'
    },
    'wz': {
        name: '郑州微智信息科技有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_test.png')
        }
    },
    'xiangbao': {
        name: '成都享保商务服务有限公司',
        bgImg: require('@/assets/images/oem_bg2_login.jpg'),
        tabsParam: ['管理后台', '个人网页版']
    },
    'xn': {
        name: '汕头高新区信诺信息技术有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_xn.png')
        }
    },
    'xsdsn': {
        bgImg: require('@/assets/images/oem_bg6_login.jpg'),
        tabsParam: ['管理后台', '个人网页版'],
        loginBoxMarginTop: '120px',
    },
    'ycwgh': {
        picture: {
            url: require('@/assets/images/oem_logo_ycwgh.png')
        },
        bgImg: require('@/assets/images/oem_bg5_login.jpg'),
        loginBoxClass: 'qwui-loginbox_ycwgh'
    },
    'yczxfj': {
        name: '企业OA办公云平台',
        nameClass: 'qwui-title_yczxfj',
        picture: {
            url: require('@/assets/images/oem_logo_yczxfj.png'),
            height: '50px'
        },
        tabsParam: ['管理后台', '个人网页版'],
        bgImg: require('@/assets/images/oem_bg2_login.jpg'),
    },
    'yuancun': {
        name: '广州市天河区人民政府员村街道办事处'
    },
    'yunqi': {
        name: '广州市纵迈网络科技有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_yunqi.png')
        }
    },
    'zhehui': {
        name: '杭州浙汇科技有限公司'
    },
    'zjmt': {
        name: '小百合微信工作室'
    },
    'zjyd': {
        name: '浙江移动教育云平台',
        picture: {
            url: require('@/assets/images/oem_logo_zjyd.png')
        },
        bgImg: require('@/assets/images/oem_bg_zjyd_login.jpg'),
        loginBoxClass: 'qwui-loginbox_zjyd',
        isFull: true, // 背景是否布满浏览器
        copyRight: `Copyright©2014-${new Date().getFullYear()} DO1.com.cn All Rights Reserved 粤B2-20062018号`
    },
    'zocoo': {
        name: '济南卓高建材有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_zocoo.png')
        }
    },
    'zwy': {
        name: '锦州正一科技有限责任公司',
        picture: {
            url: require('@/assets/images/oem_logo_zwy.png'),
            width: '50px',
            height: '50px'
        }
    },
    'zxhy': {
        picture: {
            url: require('@/assets/images/oem_logo_zxhy.png'),
            width: '291px',
            height: '90px'
        }
    },
    'zy': {
        name: '浙江正云物联网技术有限公司',
        picture: {
            url: require('@/assets/images/oem_logo_test.png')
        }
    }
};

export default viewList;