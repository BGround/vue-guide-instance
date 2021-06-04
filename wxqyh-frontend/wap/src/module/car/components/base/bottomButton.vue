<template>
	<div class="cancel-btn" @click.stop="close">返回</div>
</template>

<script>
	export default {
		name: 'bottomButton',
		methods: {
			close() {
				this.$emit('close')
			}
		}
	}
</script>

<style scoped>
	.cancel-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    height: 49px;
    line-height: 49px;
    text-align: center;
    font-size:15px;
    color: #0A1735;
    background: #fff;
    border-top: 1px solid #F7F8FA;
    margin: 0 auto;
    z-index: 8;
    cursor: pointer;
  }
  @media screen and (min-width: 1024px) {
    .cancel-btn {
      width: 740px;
    }
  }
</style>
