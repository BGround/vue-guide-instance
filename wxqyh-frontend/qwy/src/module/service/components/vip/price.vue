<template>
    <div class="service-price-box" :class="className">
        <div class="service-price-left"></div>
        <div class="service-price-content">
            <div class="service-price-item">
                <div class="service-price">
                    <div class="service-price-total">
                      <slot></slot>
                    </div>
                </div>
                <div class="dashed-style"></div>
                <div class="service-price-btn">
                    <qw-button class="exclusive-btn" type='primary'
                               :ant-click-animating-without-extra-node="animating"
                               @click="sureBuyClick"
                    >
                      立即购买
                    </qw-button>
                    <p class="text-item">购买即视为同意<span @click="showServiceAgreement = !showServiceAgreement">《企业账户服务协议》</span></p>
                </div>
            </div>
        </div>
      <service-agreement :show.sync="showServiceAgreement"></service-agreement>
    </div>
</template>
<script>
  import  {QwButton,ServiceAgreement} from '../../index'
  export default {
    name:'QwPrice',
    components:{
      QwButton,
      ServiceAgreement
    },
    props:{
      className:{
        type: String,
        default: ''
      }
    },
    data() {
      return {
        animating: false,
        //企业服务协议
        showServiceAgreement: false
      }
    },
    methods:{
      sureBuyClick(){
        this.$emit('buyClick',true)
        this.animating = true
        let self = this
        setTimeout(function () {
          self.animating = false
        },300)
      }
    },
  }
</script>
<style lang="scss" scoped>
.service-price-box{
    display: flex;
    margin:0 86px 0  14px;
    font-size: 0;
    box-shadow: 0 2px 8px #f0f1f2;
    box-sizing: border-box;
    border-radius: 15px;
    background: url(~assets/images/icon-vip-priceBg.png) no-repeat;
    background-size:100% 100%;
    &.active{
       background: url(~assets/images/icon-vip-priceBg1.png) no-repeat;
       background-size: 100% 100%;
     }
    .service-price-left{
        flex: 1;
        display: inline-block;
        width: 52px;
        max-width: 52px;
        background: url(~assets/images/icon-service-pricebg.png) no-repeat;
        background-size:100% 100%;
    }
    .service-price-content{
        flex: 1;
        padding: 44px 62px 40px 71px;
        .service-price-item{
            .service-price{
                padding-bottom: 24px;
                .service-price-total{
                    color: #F5A723;
                    font-size: 36px;
                    .title{
                        display: flex;
                        font-size: 38px;
                        line-height: 50px;
                        i{
                            padding: 0 5px 0 0;
                        }
                        .have-price{
                          display: inline-table;
                        }
                        .price{
                          padding: 0 5px 0 0;
                          font-size: 30px;
                        }
                        .year{
                          padding: 0 5px 0 0;
                          font-size: 22px;
                        }
                    }
                    .default-text{
                      font-size:16px;
                      color:#999
                    }
                }
            }
            .dashed-style{
              height: 1px;
              background: linear-gradient(to right, #ccc, #ccc 6.5px, transparent 6.5px, transparent);
              background-size: 13px 100%;
            }
            .service-price-btn{
                padding-top: 24px;
                .text-item{
                  margin-top: 10px;
                  font-size: 14px;
                  color: #999;
                  span{
                    color: #3692E3;
                    cursor: pointer;
                  }
                }
                .exclusive-btn{
                  width: 120px;
                  height: 40px;
                  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
                  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
                  -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
                  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.035);
                  border: 1px solid transparent;
                  font-size: 16px;
                  background: #F5A623;
                  cursor: pointer;
                }
            }
        }
    }
}
</style>
