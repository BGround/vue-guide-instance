<template>
  <div v-show="shareObj.isShow">
    <funcBox :boxTitle="title" firstBtn="" secondBtn="取消" @secondFunc="close" @closeBox="close">
      <div class="qwui-share_wrap">
        <div class="qwui-desc">复制地址给好友:</div>
        <div class="qwui-share_url">
          <input type="text" class="qwui-share_url_input" readonly="readonly" v-model="shareObj.shareUrl">
          <a target="_blank" class="qwui-open_url" :href="shareObj.shareUrl">打开</a>
        </div>
        <div class="qwui-share_path" :style="{'justify-content':isInnerForm?'center':'','text-align':isInnerForm?'center':''}">
          <div class="qwui-share_path_wx">
            <div class="qwui-share_wx_name">微信，企业微信扫码分享</div>
            <div class="qwui-share_wx_code">
              <qrcode-vue :value="qrCodeObj.value" :size="qrCodeObj.size" :title="qrCodeObj.value"></qrcode-vue>
            </div>
          </div>
          <div class="qwui-share_path_other" v-show="!isInnerForm">
            <div class="qwui-share_other_name">分享到其他:</div>
            <div class="qwui-share_other_list">
              <a target="_blank" :href="'http://v.t.sina.com.cn/share/share.php?appkey=&url='+encodeURIComponent(shareObj.shareUrl)+'&title='+shareTitle"></a>
              <a target="_blank" :href="'http://connect.qq.com/widget/shareqq/index.html?url='+encodeURIComponent(shareObj.shareUrl)+'&title='+shareTitle"></a>
              <a target="_blank" :href="'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(shareObj.shareUrl)+'&title='+shareTitle"></a>
            </div>
          </div>
        </div>
      </div>
    </funcBox>
  </div>
</template>

<script>
  import funcBox from '@/components/list/funcBox';
  import QrcodeVue from 'qrcode.vue';

  export default {
    props:{
      shareObj:{
        type:Object,
        default:{},
      }
    },
    data(){
      return{
        title:'',
        shareTitle:'',
        qrCodeObj:{},
        isShow:false,
        isInnerForm:false,
      }
    },
    methods:{
      //过滤字符串的非法字符
      filterString(s){
        s = s.replaceAll('<','').replaceAll('>','');
        return s;
      },
      close(){
        this.shareObj.isShow = false;
      },
    },
    watch:{
      shareObj:{
        handler:function(newValue){
          //限制监听次数
          if(!newValue.isShow){
            return;
          }
          let typeString = {
            'form':"表单",
            'productinfo':"知识百科",
            'news':"新闻公告"
          };
          this.isInnerForm=false;
          if(newValue.isInnerShare&&newValue.isInnerShare!=3){//判断是否分享内部单
            this.isInnerForm=true;
          }
          this.shareTitle = '我在@道一云|企微 上创建了' + typeString[newValue.type] +'，邀请大家来填写！';
          this.title = '将 '+ this.filterString(newValue.title) + ' 分享到' + (this.isInnerForm?'内部':'外部');
          this.qrCodeObj.value = newValue.shareUrl;
          this.qrCodeObj.size = 120;
        },
        deep:true,
      }
    },
    components:{
      funcBox,
      QrcodeVue
    }
  }
</script>

<style lang="scss" scoped>
  @mixin share-style{
    height: 30px;
    line-height: 30px;
    padding-bottom: 10px;
  }

  .qwui-share_wrap{
    padding: 30px 44px;
    .qwui-desc{
      @include share-style;
    }
    .qwui-share_url{
      @include share-style;
      .qwui-share_url_input{
        display: inline-block;
        color: #999;
        width: 410px;
        cursor: text;
        height: 30px;
        margin: 0;
        padding: 0 5px;
        border: 1px solid #ccc;
        outline: none;
      }
      .qwui-open_url{
        display: inline-block;
        padding: 0 10px;
        background-color: #fff;
        border: 1px solid #ccc;
        margin-left: 10px;
        color: #666;
        cursor: pointer;
      }
    }
    .qwui-share_path{
      display: flex;
      padding-top: 10px;
      .qwui-share_path_wx{
        flex:0 1 200px;
        .qwui-share_wx_name{
          line-height: 30px;
        }
      }
      .qwui-share_path_other{
        flex:1;
        .qwui-share_other_name{
          line-height: 30px;
        }
        .qwui-share_other_list{
          a{
            display: inline-block;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 10px;
          }
          a:nth-child(1){
            background: url(~assets/images/ic_share.png) #dc5f5c 0px 0px;
          }
          a:nth-child(2){
            background: url(~assets/images/ic_share.png) #5ca3e1 -57px 0;
          }
          a:nth-child(3){
            background: url(~assets/images/ic_share.png) #ffaf30 -116px 0;
          }
        }
      }
    }
  }
</style>
