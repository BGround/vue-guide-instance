/**
 * 检测图片是否存在
 * @param url
 */
export const isExist = function(url) {
  return new Promise(resolve => {
    var img = new Image()
    img.onload = function() {
      if (this.complete == true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function() {
      resolve(false)
      img = null
    }
    img.src = url
  })
}

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
export default {
  install(Vue, options) {
    Vue.directive('img-fallback', async function(el, binding) {
      let originImageSrc = el.getAttribute('src') //获取图片地址
      let fallbackImageSrc = binding.value //通过指令值获取默认图片地址
      if (originImageSrc) {
        let exist = await isExist(originImageSrc)
        if (exist) {
          el.setAttribute('src', originImageSrc)
        } else {
          if (fallbackImageSrc) {
            el.setAttribute('src', fallbackImageSrc)
            return
          }
          if (options.fallbackImageSrc) {
            el.setAttribute('src', options.fallbackImageSrc)
          }
        }
      }
    })
  }
}
