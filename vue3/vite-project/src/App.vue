<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import useFavicon from './utils/useFavicon.js'
import {useFullscreen} from '@vueuse/core'
const { isFullscreen, enter, exit, toggle } = useFullscreen()
let {favicon}  = useFavicon() 
function loading() {   
  favicon.value = './assets/logo.png' 
}

</script>

<template>
  <div>
    <div>{{rate}}</div>
    <button @click="loading">useFavicon</button>
    <button @click="toggle">vueuse</button>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
  </div>
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
  display: block;
  margin: 0 auto;
}
</style>
