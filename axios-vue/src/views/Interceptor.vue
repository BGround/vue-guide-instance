<template>
	<div></div>
</template>

<script>
	//拦截器：在请求或者响应被处理前拦截他们
	//请求拦截器，响应拦截器
	import axios from 'axios'
	export default{
		name:'Interceptor',
		created(){
			//请求拦截器 以及错误处理
			axios.interceptors.request.use(
			config=>{
				return config
			},
			err=>{
				$(#WindowModal).show() //弹窗显示
				setTimeout(()=>{
					$(#WindowModal).hide()
				},2000)
				return Promise.reject(err)
			})
			
			//响应拦截器 以及错误处理
			axios.interceptors.respose.use(
			res=>{
				return res
			},
			err=>{
				$(#WindowModal).show() //弹窗显示
				setTimeout(()=>{
					$(#WindowModal).hide()
				},2000)
				return Promise.reject(err)
			})
		}
	}
</script>

<style>
</style>
