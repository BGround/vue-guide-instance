import {
  emailReg
} from '@/module/crm/utils/common'
export default {
  methods: {
    imageCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (option.detail.length === 0 || !option.detail[0].picPath) {
          reject({
            desc: '图片不能为空',
            index
          });
        } else if (option.detail.some((item) => {
            return item.loadStatus
          })) {
          reject({
            desc: '图片上传不成功',
            index
          });
        } else {
          resolve()
        }
      })
    },
    videoCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (option.detail.length === 0 || !option.detail[0].title) {
          reject({
            desc: '视频地址不能为空',
            index
          });
        } else {
          resolve()
        }
      })
    },
    addressCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (!option.detail[0].title) {
          reject({
            desc: '地址不能为空',
            index
          });
        } else {
          resolve()
        }
      })
    },
    infoCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (option.detail.length === 0) {
          reject({
            desc: '资讯不能为空',
            index
          });
        } else {
          resolve()
        }
      })
    },
    textareaCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (!option.detail[0].content) {
          reject({
            desc: '富文本不能为空',
            index
          });
        } else {
          resolve()
        }
      })
    },
    titleCheck(option, index) {
      return new Promise((resolve, reject) => {
        if (!option.detail[0].title) {
          reject({
            desc: '标题不能为空',
            index
          });
        } else {
          resolve()
        }
      })
    },
    phoneCheck(option, index) {
      const reg = /^[0-9][0-9-]*[^-]$/;
      return new Promise((resolve, reject) => {
        if (!option.detail[0].title) {
          reject({
            desc: '电话不能为空',
            index
          });
        } else if (!reg.test(option.detail[0].title)) {
          reject({
            desc: '电话格式不合法',
            index
          });
        } else {
          resolve()
        }
      })
    },
    emailCheck(option, index) {
      const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/;
      return new Promise((resolve, reject) => {
        if (!option.detail[0].title) {
          reject({
            desc: '邮箱不能为空',
            index
          });
        } else if (!reg.test(option.detail[0].title)) {
          reject({
            desc: '邮箱格式不合法',
            index
          });
        } else {
          resolve()
        }
      })
    },
    check(option, index) {
      switch (option.type) {
        case 'image':
          return this.imageCheck(option, index)
        case 'video':
          return this.videoCheck(option, index)
        case 'address':
          return this.addressCheck(option, index)
        case 'textarea':
          return this.textareaCheck(option, index)
        case 'info':
          return this.infoCheck(option, index)
        case 'title':
          return this.titleCheck(option, index)
        case 'phone':
          return this.phoneCheck(option, index)
        case 'email':
          return this.emailCheck(option, index)
        default:
          break;
      }
    }
  }
}
