<template>
  <div>
  <div class="responsibility" v-if="taskItem.number">
    <span class="responsibility-title">项目编号</span>
    <span class="responsibility-content">
				{{taskItem.number}}
			</span>
  </div>
    <div class="responsibility" v-if="taskItem.projectType">
      <span class="responsibility-title">明检类型</span>
      <span class="responsibility-content">
				{{taskItem.projectType}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.point">
      <span class="responsibility-title">检查点位</span>
      <span class="responsibility-content">
				{{taskItem.point}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.content">
      <span class="responsibility-title">检查内容</span>
      <span class="responsibility-content">
				{{taskItem.content}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.score">
      <span class="responsibility-title">标准分值</span>
      <span class="responsibility-content">
				{{taskItem.score}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.deduct">
      <span class="responsibility-title">扣分</span>
      <span class="responsibility-content">
				{{taskItem.deduct}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.reason">
      <span class="responsibility-title">不合格原因</span>
      <span class="responsibility-content">
				{{taskItem.reason}}
			</span>
    </div>
    <div class="responsibility" v-if="taskItem.requirement">
      <span class="responsibility-title">改善要求</span>
      <span class="responsibility-content">
				{{taskItem.requirement}}
			</span>
    </div>
  </div>
</template>

<script>
    export default {
      props:{
        taskItem:{
          type:Object,
          default(){
            return {}
          }
        },

      },
        name: "TaskInfo"
    }
</script>

<style lang="scss" scoped>
  .responsibility{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 48px;
    padding-right: 14px;
    .responsibility-title{
      font-size: 15px;
      color: #0A1735;
      line-height: 46px;
    }
    .responsibility-content{
      color: #999;
      font-size: 15px;
      line-height: 46px;
    }
  }
</style>
