<template>
  <div class="cicular-chart" :style="{backgroundColor: circularColor}">
    <div class="wrapper" :style="{backgroundColor: wrapperColor, transform: `translateX(-50%) rotate(${degree})`}"></div>
    <div class="inner"></div>
    <div class="label">{{label}}</div>
    <div class="value">{{value}}</div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                circularColor: this.color,
                wrapperColor: this.auxiliaryColor,
                degree: this.ratio >1? `180deg`: `${180 *this.ratio}deg`,
                value: `${Number(this.ratio*100).toFixed(1)}%`
            }
        },
        props:{
            ratio: {
                type:Number,
                default(){
                    return 0;
                },
            },
            label:{
                type: String,
                default(){
                    return 0;
                },
            },
            color: {
                type: String,
                default(){
                    return 'rgba(253, 151, 7, 1)'
                }
            },
            auxiliaryColor:{
                default(){
                    return 'RGBA(255, 246, 233, 1)'
                }
            }
        },
        watch:{
            ratio(ratioValue){
                this.degree = ratioValue >1? `180deg` :`${180 * ratioValue}deg`;
                this.value = `${Number(ratioValue*100).toFixed(1)}%`
            }
        }
    }
</script>
<style lang="scss" scoped>
  .cicular-chart{
    width:120px;
    height: 60px;
    overflow: hidden;
    border-top-left-radius: 60px;
    border-top-right-radius: 60px;
    position: relative;
    background: rgba(253, 151, 7, 1);
  }
  .wrapper{
    position: absolute;
    width: 120px;
    height: 60px;
    background: RGBA(255, 246, 233, 1);
    // background: rebeccapurple;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    transform-origin:50% 100%;
  }
  .inner{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 45px;
    border-top-left-radius: 45px;
    border-top-right-radius: 45px;
    background: #ffffff;
    z-index: 1;
  }
  .value{
    position: absolute;
    bottom: -2px;
    text-align: center;
    height:24px;
    font-size:22px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:24px;
    color:rgba(51,51,51,1);
    z-index: 2;
    width: 100%;
  }
  .label{
    position: absolute;
    bottom: 20px;
    text-align: center;
    height:14px;
    font-size:12px;
    font-weight:400;
    line-height:14px;
    color:rgba(102,102,102,1);
    z-index: 1;
    width: 100%;
  }
</style>
