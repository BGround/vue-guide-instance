<template>
  <div class="promiserequest">
  </div>
</template>

<script>
//并打请求，同事进行多个请求，并统一处理返回值
import axios from 'axios'
export default {
	name: 'promiserequest',
	created() {
		//axios.all() axios.spread()
		axios.all([
			axios.get('/data.json'),
			axios.get('/city.json')
		]).then(
			axios.spread((dataRes,cityRes) => {
				console.log(dataRes, cityRes)
			})
		)
	}
}
</script>
