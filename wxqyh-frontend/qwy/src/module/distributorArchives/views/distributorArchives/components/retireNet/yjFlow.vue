<template>
  <div class="stepWrap">
    <ul class="stepInfo">
      <li class="finish">
        <div class="stepIcon">&nbsp;</div>
        <div class="stepLine"></div>
      </li>
      <li v-for="item in flowData" :key="item.index" :class="{finish:item.index<columns,current:item.index===columns}">
        <div class="stepIcon">{{item.name}}</div>
        <div class="stepc">
          <img v-if="item.index<columns" src="../../images/icon_finish.png" />
          <img v-else-if="item.index===columns" src="../../images/icon_doing.png" />
          <img v-else src="../../images/icon_nostart.png" />
        </div>
        <div class="stepLine"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
      data () {
          return {
              flowData:[{name:'通知陈述',index:1},{name:'反馈回执/材料',index:2},{name:'预警陈述',index:3},{name:'项目整改',index:4},{name:'整改审核',index:5},{name:'项目关闭',index:6}]
          }
      },
      props:{
          columns:{
              type: Number,
              default: 0
          }
      }
  }
</script>
