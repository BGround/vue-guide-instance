
import axios from 'axios'

class WaterMark {
  constructor(config, el) {
    const defaultConfig = {
      agentCode: '',
      isShow: true,
      isFullScreen: true,
      text: '',
      width: 150,
      height: 120,
      fontSize: '12px',
      fontColor: 'rgba(204, 204, 204, 0.5)',
      rotate: -19
    }
    this.resultConfig = Object.assign(defaultConfig, config)
    this.el = el
  }
  getIsOpenWaterMark() {
    if (!this.resultConfig.isShow) {
      return
    }
    if (this.resultConfig.agentCode === '') {
      return // agentCode 必传
    }
    const self = this
    axios.get(_.baseURL + `/portal/contact/contactOtherPortalCtl/isOpenWaterMark.do?agentCode=${self.resultConfig.agentCode}`).then(function (result) {
      if (result.code !== '0') {
        return
      }
      if (result.code === '0' && result.data.isOpenWaterMark != 1) {
        return
      }
      // 默认水印：接口返回的userWaterMark
      self.resultConfig.text = self.resultConfig.text ? self.resultConfig.text : result.data.userWaterMark
      self.addWaterMark()
    })
  }
  addWaterMark () {
    let canvas = document.createElement('CANVAS')
    let ctx = canvas.getContext("2d")

    canvas.width = this.resultConfig.width
    canvas.height = this.resultConfig.height

    ctx.fillStyle = this.resultConfig.fontColor
    ctx.font = this.resultConfig.fontSize + ' PingFangSC-Regular'
    ctx.rotate(this.resultConfig.rotate * Math.PI / 180)
    ctx.fillText(this.resultConfig.text, 10, 85) // 旋转后调整x、y位移，使其全部显示在画布可视区域

    let img = canvas.toDataURL()

    let waterMarkDiv = document.createElement('div')
    waterMarkDiv.style.backgroundImage = `url(${img})`
    waterMarkDiv.id = `qwWaterMark`
    // 页面水印
    if (this.resultConfig.isFullScreen) {
      waterMarkDiv.style.position="fixed"
      waterMarkDiv.style.top = 0
      waterMarkDiv.style.bottom = 0
      waterMarkDiv.style.left = 0
      waterMarkDiv.style.right = 0
    } else {
      // 局部水印
      waterMarkDiv.style.position="absolute"
      waterMarkDiv.style.top = 0
      waterMarkDiv.style.left = 0
      waterMarkDiv.style.width = '100%'
      waterMarkDiv.style.height ='100%'
    }

    waterMarkDiv.style.zIndex = 9999
    waterMarkDiv.style.pointerEvents = 'none'

    this.el.appendChild(waterMarkDiv)
  }
  // 对比2个对象的值是否一样（该函数只能比较只有一级嵌套的对象的值是否相等）
  isObjectValueEqual(objA, objB) {
    let aProps = Object.getOwnPropertyNames(objA)
    let bProps = Object.getOwnPropertyNames(objB)

    if (aProps.length != bProps.length) {
      return false
    }

    for (let i = 0; i < aProps.length; i++) {
      let propName = aProps[i]
      if (objA[propName] !== objB[propName]) {
        return false
      }
    }
    return true
  }
}

export default {
  inserted: function (el, binding) {
    let config = binding.value || {}
    let waterMark = new WaterMark(config, el)
    waterMark.getIsOpenWaterMark()
  },
  componentUpdated: function (el, binding) {
    let config = binding.value || {}
    let waterMark = new WaterMark(config, el)
    // 外部传进来的值有更新（外部参数是接口异步获取的情况），重新执行水印功能
    if (!waterMark.isObjectValueEqual(binding.oldValue, binding.value)) {
      waterMark.getIsOpenWaterMark()
    }
  }
}
