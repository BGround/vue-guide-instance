const defaultVal = {
  mainPage: {
    update: false,
    scroll: 0,
  },
  audit: {
    update: false,
    scroll: 0,
  },
  mine: {
    update: false,
    scroll: 0,
  },
  open: {
    update: false,
    scroll: 0,
  }
}
/**
 * 初始化缓存
 */
export function initCache() {
  // 路由缓存信息
  sessionStorage.setItem('newFormPageCacheData', JSON.stringify(defaultVal));
  sessionStorage.setItem('needToUpdateHeadCounts', 0); //是否更新首页列表数量
}
/**
 * 更新首页数量信息
 * @param {function} cb 更新的回调
 */
export function updatePageCount(cb) {
  if(!sessionStorage.getItem('needToUpdateHeadCounts') || !sessionStorage.getItem('newFormPageCacheData')) initCache();
  if(sessionStorage.getItem('needToUpdateHeadCounts') == 1) {
    cb && cb(); //更新数据
    // initCache(); //重置
  }
}
/**
 * 重置页面的缓存信息
 * @param {string} page  需要重置的页面
 */
export function resetPageCache(page) {
  let viewList = JSON.parse(sessionStorage.getItem('newFormPageCacheData'));
  if(viewList) {
    viewList[page].update = false;
    viewList[page].scroll = 0;
    sessionStorage.setItem('newFormPageCacheData', JSON.stringify(viewList))
  }
}
/**
 * 执行操作后更新首页数据
 * @param {string} page 需更新的页面
 * @param {boolean} updateCount 是否需要更新数量信息
 */
export function updateCache(page, updateCount) {
  if(page) {
    let viewList = JSON.parse(sessionStorage.getItem('newFormPageCacheData'));
    if(viewList) {
      viewList[page].update = true;
      if(page !== 'mainPage') viewList[page].scroll = 0;
      sessionStorage.setItem('newFormPageCacheData', JSON.stringify(viewList))
    }
  }
  if(updateCount && sessionStorage.getItem('needToUpdateHeadCounts')) 
  sessionStorage.setItem('needToUpdateHeadCounts', 1); //更新首页数量信息
}
/**
 * 页面离开时设置缓存
 * @param {boolean} flag 是否记录滚动
 * @param {object} scrollEl  滚动条的包含块
 * @param {string} page  设置缓存的页面
 */
export function setLeaveCache(flag, scrollEl, page, cb) {
  let viewList = JSON.parse(sessionStorage.getItem('newFormPageCacheData'));
  if(viewList) {
    if(flag) {
      viewList[page].scroll = scrollEl.scrollTop;
      viewList[page].update = false;
      sessionStorage.setItem('needToUpdateHeadCounts', 0);
    }else {
      cb && cb(viewList); //其它判断
    }
    sessionStorage.setItem('newFormPageCacheData', JSON.stringify(viewList));
  }
}
/**
 * 路由进入时是否重置滚动条
 * @param {object} from 路由
 * @param {string} page 操作的页面
 */
export function enterCacheOption(from, page) {
  // 如果不是从详情跳转则重置滚动条位置
  if(from.name != 'detail' && sessionStorage.getItem('newFormPageCacheData')) {
    let viewList = JSON.parse(sessionStorage.getItem('newFormPageCacheData'));
    viewList[page].scroll = 0;
    sessionStorage.setItem('newFormPageCacheData', JSON.stringify(viewList));
  }
}
/**
 * 更新数据或滚动位置
 * @param {string} page 更新的页面
 * @param {function} updateCb 更新数据的回调
 */
export function updatePageInfo(page,updateCb) {
  let viewList = JSON.parse(sessionStorage.getItem('newFormPageCacheData'));
  if(viewList) {
    let pageCache = viewList[page];
    updateCb && updateCb(pageCache);
  }
}
