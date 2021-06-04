<template>
	<div class="qwui-wage">
		<img src="~assets/images/tax_img.png" alt="" @click="goToTax" class="qw_tax_img">
	</div>
</template>
<script>

export default {
	name:'tax',
	data(){
		return{
			
		}
	},
	methods:{
		goToTax(){
			this.$router.push('/taxDetail');
		}
	}
}
</script>
<style lang="scss" scoped>
	.qw_tax_img{
		display: block;
		width: 100%;
		
	}
	@media screen and (min-width: 500px) {
    .qw_tax_img{
      margin: 0 auto;
    	width: 81.5%;
    }
  }
</style>


