<template>
	<span class="buy-btn" @click="goBuyGoods">{{config.text}}</span>
</template>

<script>
  export default {
    name: "buyBtn",
    props: ["config"],
    methods: {
      goBuyGoods:function(){
        console.log(this.config);
        var shopping_cart_key = "companysrv_shopping_cart"; //购物车的Key
        localStorage.setItem(shopping_cart_key, JSON.stringify(this.config.services));
        document.location.href= _.baseURL+"/qiweipublicity/companysrv/order/order_mulit_confirm.jsp?corpId="+_.orgConfigInfo.corpId;
      }
    },
  }
</script>

<style>
  .buy-btn{
    display: inline-block;
    width: 120px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    border-radius: 3px;
    background-color: rgb(255, 150, 0);
    cursor: pointer;
  }
  .buy-btn:hover{
    background: #F08088;
  }
</style>
