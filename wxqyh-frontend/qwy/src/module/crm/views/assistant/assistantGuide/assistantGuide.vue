<template>
  <div class="assistantGuide">
    <div class="header">
      <h1>企微云小站</h1>
      <p>基于微信小程序打造多渠道的社会化营销体系，利用数据实时了解客户的行为及喜好，让你的营销变得更智能，实现低成本、高效率获客的目标</p>
    </div>
    <qw-introduce-item v-for="(item, index) in introduceList"
                       :key="index"
                       v-bind="item"></qw-introduce-item>
    <span @click="showPic()">查看示例</span>
    <div class="card_list">
      <qw-card>
        <div slot="content"
             class="card_container">

          <img class="img_item"
               :src="cardList[0].imgSrc">
          <div class="text_item">
            <h2>{{cardList[0].title}}</h2>
            <p>{{cardList[0].text}}</p>
          </div>
          <div class="operation_item">
            <qwui-button type='primary'
                         @click="dealClick(0)">进入</qwui-button>
          </div>
        </div>
      </qw-card>
      <qw-card>
        <div slot="content"
             class="card_container">
          <img class="img_item"
               :src="cardList[1].imgSrc">
          <div class="text_item">
            <h2>{{cardList[1].title}}</h2>
            <p>{{cardList[1].text}}</p>
          </div>
          <div class="operation_item">
            <template v-if="!existOficiaWebsite">
              <qwui-button type='primary'
                           @click="dealClick(1)">创建</qwui-button>
              <span @click="showPreview=true">查看示例</span>
            </template>
            <template v-else>
              <qwui-button type='primary'
                           @click="dealClick(1)">编辑</qwui-button>
              <qwui-button type='primary'
                           @click="showPreview=true">预览</qwui-button>
            </template>
          </div>
        </div>
      </qw-card>
      <qw-card>
        <div slot="content"
             class="card_container">
          <img class="img_item"
               :src="cardList[2].imgSrc">
          <div class="text_item">
            <h2>{{cardList[2].title}}</h2>
            <p>{{cardList[2].text}}</p>
          </div>
          <div class="operation_item">
            <qwui-button type='primary'
                         @click="dealClick(2)">设置</qwui-button>
          </div>
        </div>
      </qw-card>
    </div>
    <Preview v-model="showPreview"
             :example="true"
             :existOficiaWebsite="existOficiaWebsite"
             @on-click-edit="dealClick(1)"></Preview>
  </div>
</template>

<script>
import {
  getOfficialWebsite,
  setUpWebsite,
  getWxAppEntrance
} from 'crm/api/assistant'
import QwIntroduceItem from 'crm/components/qw-introduce-item/qw-introduce-item'
import QwCard from 'crm/components/qw-card/qw-card'
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import Preview from '../officialWebsite/components/preview'
import { mapActions, mapGetters } from 'vuex'
const INTRODUCE_OPTION = [
  {
    imgSrc: require('assets/images/img_social.png'),
    title: '社会化销售',
    introduceText:
      '将企业产品、官网和销售人员名片，通过小程序分享，裂变式的触达10亿微信用户'
  },
  {
    imgSrc: require('assets/images/img_smart.png'),
    title: '智能化销售',
    introduceText:
      '实时追踪用户对营销内容的喜好数据，是否阅读是否分享，随时挖掘潜在的意向客户，实现精准销售'
  },
  {
    imgSrc: require('assets/images/img_passive.png'),
    title: '被动转主动的全民销售工具',
    introduceText:
      '用户对营销内容产生兴趣，实时向销售人员推送消息，及时跟进，无需添加微信好友在小程序内即可一对一聊天，高效获客'
  }
]

const CARD_OPTION = [
  {
    imgSrc: require('assets/images/img_product.png'),
    title: '企业产品',
    text: '向用户展现企业的核心产品'
  },
  {
    imgSrc: require('assets/images/img_link.png'),
    title: '小程序网站',
    text: '10分钟拥有您的小程序网站',
    permission: 'wxAppAuthoritySearch'
  },
  {
    imgSrc: require('assets/images/img_permissions.png'),
    title: '设置',
    text: '依据企业需要设置个性化服务'
  }
]
export default {
  data() {
    return {
      introduceList: INTRODUCE_OPTION,
      cardList: CARD_OPTION,
      dataBase,
      showPreview: false, //展示示例
      existOficiaWebsite: false
    }
  },
  components: {
    QwIntroduceItem,
    QwuiButton,
    QwCard,
    Preview
  },
  created() {
    //为了解决左侧导航条正确高亮
    sessionStorage.setItem('leftTabFixed', true)
    this.getWxAppEntrance()
  },
  computed: {
    ...mapGetters('assistant', ['showAssistant'])
  },
  methods: {
    ...mapActions('assistant', ['setshowAssistant']),

    dealClick(index) {
      if (index === 0) {
        this.$router.push({ name: 'productList' })
      } else if (index === 1) {
        this.$router.push({ name: 'officialWebsite' })
      } else if (index === 2) {
        this.$router.push({ name: 'assistantSetting' })
      }
    },
    showPic() {
      document.body.style.overflow = 'hidden'
      this.setshowAssistant(true)
    },
    getWxAppEntrance() {
      getWxAppEntrance().then(res => {
        if (res.code == '0') {
          this.existOficiaWebsite = res.data.whetherExist
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    }
  }
}
</script>

<style src="./assistantGuide.scss" lang="scss" scoped></style>
