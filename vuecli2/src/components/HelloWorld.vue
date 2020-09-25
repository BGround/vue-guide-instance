<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <router-link to="./a">转向A页面</router-link>
    <router-link to="./b">转向B页面</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
