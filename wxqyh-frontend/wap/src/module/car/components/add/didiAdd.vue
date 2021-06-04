<template>

</template>

<script>
  export default {
    name: 'didiAdd',
    beforeCreate() {
      this.$router.push({path: '/travel'})
    },
    beforeRouteEnter(to, from, next) {
      if(from.name == 'travel') {
        window.location.href = `${_.baseURL}/jsp/wap/didi/diditrade.jsp?type=1&agentCode=car&abc=1`
      } else next()
    }
  }
</script>

<style>

</style>
