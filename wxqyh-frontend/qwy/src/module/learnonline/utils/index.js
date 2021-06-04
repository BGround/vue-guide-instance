import Vue from "vue";
// import api from './api/index'
import { isVipSilver, isVipGold } from "assets/js/vip-manager.js"
import api from "../api/index.js"

const goBuyVip = function () {
  window.open(_.baseURL+'/qiweipublicity/companysrv/vip/vip_gold_index.jsp')
}

const isSilverVip = function ( param = interfaceCode.INTERFACE_CODE_EXAMINATION ) {
  return isVipSilver(param);
}

const isGoldVip = function ( param = interfaceCode.INTERFACE_CODE_EXAMINATION ) {
  return isVipGold(param);
}

export const createEventBus = function () {
  return new Vue()
};

export const extendVue = function () {
  // 跳转到金卡购买页面
  Vue.prototype.$goBuyVip = goBuyVip;

  //判断是否为考试评测VIP，银卡以上都包括
  Vue.prototype.$isVipSilver = isSilverVip();

  //判断用户是否为考试评测金卡vip
  Vue.prototype.$isVipGold = isGoldVip();

  //判断是否为培训学习VIP，银卡以上都包括
  Vue.prototype.$isLearnVipSilver = isSilverVip(interfaceCode.INTERFACE_CODE_LEARN);

  //判断用户是否为培训学习金卡vip
  Vue.prototype.$isLearnVipGold = isGoldVip(interfaceCode.INTERFACE_CODE_LEARN);

  //接口的代理
	Vue.prototype.$api = api;

	//公共方法
	 	// 图片链接处理
    Vue.prototype.$completeImgUrl = function (url) { // 图片链接处理
     	return _.fileDownURL + url;
    };

    // 转义文本，用于处理特殊字符
    Vue.prototype.$strEscape = function (str) {
    	let divEle = document.createElement('div');
      divEle.appendChild(document.createTextNode(str));
     	return divEle.innerHTML;
    };

    // 文本处理，用于转移和处理特殊字符
    Vue.prototype.$checkjs = function (str) {
      //替换转义
      let dealStr = this.$strEscape(str);

      //替换空格、换行等
      return dealStr.replace(/\n\n/g,'<br>').replace(/\n/g,'<br>').replace(/\u3000/g,'  ').replace(/\u0020/g,' ');
    };

    //现在公用的方法写在这里
    Vue.prototype.$utils = {
      //将选人对象的id提取成字符串
      handlerId(originArray, attrId = 'id') {
        let idStr = '';
        originArray.length>0 && originArray.forEach((item, index) => {
          !index ? idStr += item[attrId] : idStr += '|' + item[attrId]
        })
        return idStr;
      },
      //页面跳转,url地址，newWindow是否用新窗口打开
      windowRedirect(url, newWindow = false) {
        if(newWindow) {
          window.open(url);
        }else {  //打开我们项目的某一个页面
          window.location.href = _.baseURL+url;
        }
      },
      //导出报表时的命名方式，传递一个数组，返回arr[0]_+...+arr[arr.length-1]_+userName_+年月天日时分秒;
      exportFormName(arr = []) {
        let name = '';
        arr.length && arr.forEach(item => {
          name += item + '_';
        });
        name += wxqyhConfig.userName + '_' + (new Date).Format('yyyyMMddhhmmss');
        return name;
      },
    }
}
