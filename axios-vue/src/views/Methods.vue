<template>
	<div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'methods',
  components: {
  },
  created() {
	//http://localhost:8080/data.json?id=12
	axios.get('/data.json', {
		params: {
			id: 12
		}
	}).then((res)=>{
		console.log(res)
	})
	axios({
		method: 'get',
		url:'/data.json',
		params: { id: 12}
	}).then(res=>{
		console.log(res)
	})
	//post
	//format-data(图片上传，文件上传)
	//application/json
	let data= {
		id:12
	}
	axios.post('/post', data).then(res => {
		console.log(res)
	})
	axios({
		method:'post',
		url:'/post',
		data:data
	}).then(res => {
		console.log(res)
	})
	
	//put
	axios.put('/put',data).then(res=>{
		console.log(res)
	})
	//patch
	axios.patch('/patch',data).then(res=>{
		console.log(res)
	})
	
	//delete
	//是跟随url传的，http://localhost:8080/delete?id=12
	axios.delete('/delete',{
		params:{
			id:12
		}
	}).then((res)=>{
		console.log(res)
	})
	//不是跟随url传的，在请求体里面是request payload里面，http://localhost:8080/delete，
	axios.delete('/delete',{
		data:{
			id:12
		}
	}).then((res)=>{
		console.log(res)
	})
  },
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
