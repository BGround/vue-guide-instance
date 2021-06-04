<template>
  <div class="news">
    <div class="news__title-bg"></div>
    <div class="news__title"><span class="red">渠道</span>头条</div>
    <div class="news__content" ref="container" :style="containerStyle">
      <!-- <p class="news__content__text">{{text}}</p> -->
<!--      <qw-notice-bar-->
<!--        :title="text"-->
<!--        loop-->
<!--      ></qw-notice-bar>-->

      <div ref="text"  :style="textStyle" class="news__content__text news__content__text-1">
        <template>
          <span style="color:#C6001F;">{{getCurrentMonth}}</span>
          <span>· 开通{{content.openNewNetworkList.length}}家新网</span>
          <span v-if="content.openNewNetworkList.length">（</span>
          <a @click.prevent="handleClickDealer(item.id)" v-for="item in content.openNewNetworkList">{{item.dealerShortName}} </a>
          <span v-if="content.openNewNetworkList.length">）</span>
        </template>
        <template>
          <span>· 退出网点{{content.networkExitList.length}}家</span>
          <span v-if="content.networkExitList.length">（</span>
          <a @click.prevent="handleClickDealer(item.id)" v-for="item in content.networkExitList">{{item.dealerShortName}} </a>
          <span v-if="content.networkExitList.length">）</span>
        </template>
      </div>


<!--      <div class="news__content__text news__content__text-2">{{text}}</div>-->
    </div>
  </div>
</template>

<script>
    import { getCompanyInfo } from "@/module/channelManagement/api/getData";
    function insertKeyFrame (rule) {
        if (document.styleSheets && document.styleSheets.length) {
            try {
                document.styleSheets[0].insertRule(rule, 0)
            } catch (ex) {
            }
        } else {
            var style = document.createElement('style')
            style.innerHTML = rule
            document.head.appendChild(style)
        }
    }

    function deleteKeyFrame (ruleName) {
        var cssrules = (document.all) ? 'rules' : 'cssRules'
        var i
        if (document.styleSheets && document.styleSheets.length && document.styleSheets[0][cssrules]) {
            for (i = 0; i < document.styleSheets[0][cssrules].length; i += 1) {
                var rule = document.styleSheets[0][cssrules][i]
                if (rule.name === ruleName || rule.selectorText === '.' + ruleName) {
                    document.styleSheets[0].deleteRule(i)
                    break
                }
            }
        }
    }

    export default {
        name: "news",
        components: {},
        data() {
            return {
                // text: this.content,
                timer: null,
                textStyle:{

                },
                containerStyle:{

                },
                detail: {

                }
            }
        },
        props: {
            content: {
                type: Object,
                default(){
                    return {}
                }
            }
        },
        watch:{
            content(){
                this.$nextTick(this.initAnimationData)
            }
        },
        methods: {

            handleClickDealer(id){
              var dealerId = id
              this.$router.push({path: '/dealerDetail', query: {dealerId}})
            },

            initAnimationData(){
                const $container = this.$refs['container'];
                const $text = this.$refs['text'];
                const {width:containerWidth } = $container.getBoundingClientRect();
                const {width: textWidth } = $text.getBoundingClientRect();
                const animationName = 'marquee' + Math.random().toString(36).substring(3, 8);
                const duration = (containerWidth+textWidth) / 60;

                console.log( containerWidth, textWidth )
                this.textStyle = {
                    transform:  `translateX(${containerWidth+textWidth}px)`,
                    'animation-duration': `${duration}s`,
                    'animation-name': animationName,
                }
                deleteKeyFrame(animationName)
                insertKeyFrame(`@keyframes ${animationName} {
                  from {transform: translateX(${containerWidth}px)}
                  to {transform: translateX(-${textWidth+containerWidth}px)}
                }`)
                insertKeyFrame(`@-webkit-keyframes ${animationName} {
                  from {transform: translateX(${containerWidth}px)}
                  to {transform: translateX(-${textWidth+containerWidth}px)}
                }`)

            },

        },
        created() {

        },
        mounted() {
            this.initAnimationData()
        },
        destroyed() {

        },
        computed: {
          getCurrentMonth(){
            const year = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            if(year && month){
              return `${year}年${month}月`
            }else{
              return ''
            }
          }
        }
    }
</script>

<style scoped lang="scss">
  /deep/{
    .qw-notice-bar{
      height: 51px;
      padding: 0;
    }
    .qw-notice-bar--primary{
      background-color: transparent;
      font-size:12px;
      font-weight:bold;
      color:rgba(85,85,85,1);
    }
  }
  .news{
    height:50px;
    background:rgba(247,247,247,1);
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .news__title-bg{
    position: absolute;
    top: 0;
    left: -20px;
    width:142px;
    height:51px;
    background:rgba(255,255,255,1);
    box-shadow:3px 0px 2px rgba(0,0,0,0.16);
    transform: skewX(-30deg);
    z-index: 10;
  }
  .news__title{
    position: absolute;
    top: 0px;
    left: 18px;
    width:150px;
    font-size:20px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:51px;
    z-index: 10;
    .red{
      color: #C6001F;
    }
  }
  .news__content{
    position: absolute;
    top: 0;
    left: 110px;
    right: 0;
    height:51px;
    background:#F7F7F7;
    overflow: hidden;
    white-space: nowrap;
    &:after{
      content: '';
      display: block;
      position: absolute;
      right: 0;
      width: 20px;
      height: 51px;
      top: 0;
      background:linear-gradient(89deg,rgba(247,247,247,0) 0%,rgba(247,247,247,1) 100%);
    }
  }
  .news__content__text{
    /*padding-left: 20px;*/
    white-space: nowrap;
    line-height: 51px;
    height:51px;
    font-size:12px;
    font-weight:bold;
    color:rgba(85,85,85,1);
    display: inline-block;
  }

  .news__content__text-1{
    animation-duration: 7s;
    /*animation-name: moveLeft;*/
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  a {
    color: #555555;
  }



</style>
