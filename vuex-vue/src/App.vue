<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
	<h1>count:{{this.$store.state.count}}</h1>
	<button @click="increaseCount">点我自增</button>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
	increaseCount(){
		this.$store.commit('countIncrease') 
	}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
