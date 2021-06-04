<template>
    <div class="inner-footer">
        <span class="">{{footer}}</span>
    </div>
</template>

<script>
    export default{
        name:"QwFooter",
        data(){
            return {}
        },
      computed:{
        footer(){
            return dataBase.config && dataBase.config.logo.copyright
          }
      }
    }
</script>

<style>
    .inner-footer {
        text-align: center;
        font-size: 12px;
        color: #666666;
        margin: 0;
        padding: 10px 0 30px 0;
    }
</style>
