<template>
	<div>
		<div class="qwui-time_item">
		  <i class="qwui-time_left stopTime"></i>
			<span>实际完成时间</span>
		</div>
		<div class="time-box">
			<div class="time-text">{{finishTime}}</div>
		</div>
	</div>
  
</template>

<script>

  export default {
    name:'taskTime',
		props:{
			finishTime: {
				type: String,
				default: ''
			}
		},
    data(){
      return {
      }
    },
    methods:{
      
    },
    created(){
      
    },
    computed:{
      
    },
    filters:{
      
    }
  }
</script>

<style type="text/css">
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-time_item{
    display: flex;
    position: relative;
    min-height: 46px;
    color: #0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-time_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_time.svg") no-repeat scroll right;
  }
  .qwui-time_left.stopTime{
    background: url("../../../../assets/svg/icon_a-newtask-list_time-b.svg") no-repeat scroll right;
  }
	.time-box{
		padding: 0 15px;
	}
	
	.time-text{
		border: 1px solid #b3b3b3;
		background: #eee;
		line-height: 36px;
		font-size: 14px;
		color: #666;
		padding: 0 8px;
	}
</style>
