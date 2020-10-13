<template>
  <div class="axiosinstance">
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'axiosinstance',
  created(){
	  let instance = axios.create({
		  baseURL:'http://localhost:8080', //请求域名，基本地址
		  timeout: 1000, //请求的超时时长(ms)
		  url:'/data.json' ,//请求的路径
		  method: '' ,//五大请求方法
		  headers: {} ,//请求头
		  params:{}, //请求参数，会拼接到url上
		  data: {} //请求参数放在请求体中
	  })
	  
	  //请求优先级顺序，下面是从低到高
	  //1.axios全局配置
	  axios.defaults.baseURL='http://localhost:8080'
	  axios.defaults.timeout= 1000
	  //2.axios实例配置
	  let instance=axios.create()
	  instance.default.timeout = 3000
	  //3.axios请求配置
	  instance.get('/data.json',{
		  timeout:5000
	  })
	  
	  instance.get('/data.json').then(res=>{
		  console.log(res)
	  })
  }
}
</script>