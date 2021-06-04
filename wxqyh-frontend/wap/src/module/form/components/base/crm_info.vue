<template>
  <div class="qwui-crm-mask" @click="close" v-show="show">
    <div class="crm-info-wrapper" @click.stop>
      <div class="title">{{crmTitle}}</div>
      <div class="content">
        <div class="name">{{client.clientName}}</div>
        <p>类别：{{client.typeNames}}</p>
        <p>编码：{{client.clientCode}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus'
  import {crmInfo} from '../../api/list'

    export default {
      props: {
        crmTitle: {
          type: String,
          default: 'CRM客户信息'
        }
      },
      data() {
        return {
          client: {},
          show: false
        }
      },
      mounted() {
        EventBus.$on("showCrmUtil",this.showCrmMessage);
      },
      methods: {
        close() {
          this.show = false
        },
        open() {
          this.show = true
        },
        showCrmMessage(item) {
          // crm客户信息
          var query = {
            clientIdStr: item.id
          };
          var _this = this;
          _.showLoading()
          crmInfo(query).then((result) => {
            _.hideLoading()
            if(result.code == 0 && result.data) {
              _this.client = result.data.client;
              _this.open();
            }
          }).catch(e => {
            console.log(e)
          })
        }
      }
    }
</script>

<style scoped>
  .qwui-crm-mask {
    position: fixed;
    z-index:12;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .crm-info-wrapper {
    position: absolute;
    z-index:15;
    top: 50%;
    left: 20px;
    right: 20px;
    padding: 10px;
    background:#fff;
    border-radius: 5px;
    opacity: 1;
    -webkit-transform: translateY( -50%);
    transform: translateY(-50%);
    word-break: break-all;
  }
  .crm-info-wrapper .title {
    min-height: 27px;
    line-height:27px;
    font-size: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .crm-info-wrapper .content {
    margin-top: 10px;
    font-size: 14px;
  }
  .crm-info-wrapper .content .name {
    margin-bottom: 10px;
    line-height: 1.5;
  }
</style>
