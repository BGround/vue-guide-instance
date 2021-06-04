<template>
  <div class="stepWrap">
    <ul class="stepInfo">
      <li class="finish">
        <div class="stepIcon">&nbsp;</div>
        <div class="stepLine"></div>
      </li>
      <li v-for="(item,index) in columns" :key="index" :class="{finish:item.nodeRank<currentIndex,current:item.nodeRank===currentIndex}">
        <div class="stepIcon">{{item.deptName}}</div>
        <div class="stepc">
          <img v-if="item.nodeRank>currentIndex" src="../../images/icon_nostart.png" />
          <img v-else-if="item.nodeRank<currentIndex" src="../../images/icon_finish.png" />
          <img v-else-if="item.liquidationType===1 && (item.nodeRank===currentIndex)" src="../../images/icon_doing.png" />
        </div>
        <div class="stepLine"></div>
      </li>
    </ul>
    <!--      <div class="stepWrap">-->
    <!--        <ul class="stepInfo">-->
    <!--          <li class="finish">-->
    <!--            <div class="stepIcon">&nbsp;</div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li class="finish">-->
    <!--            <div class="stepIcon">退网通知下发</div>-->
    <!--            <div class="stepc"><img src="../images/icon_finish.png" /></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li class="finish">-->
    <!--            <div class="stepIcon">各部门清算</div>-->
    <!--            <div class="stepc"><img src="../images/icon_finish.png"></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li class="current">-->
    <!--            <div class="stepIcon">财务对账</div>-->
    <!--            <div class="stepc"><img src="../images/icon_doing.png" /></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            <div class="stepIcon">经销商对账</div>-->
    <!--            <div class="stepc"><img src="../images/icon_nostart.png" /></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            <div class="stepIcon">办理汇款</div>-->
    <!--            <div class="stepc"><img src="../images/icon_nostart.png" /></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--          <li>-->
    <!--            <div class="stepIcon">退网完成</div>-->
    <!--            <div class="stepc"><img src="../images/icon_nostart.png" /></div>-->
    <!--            <div class="stepLine"></div>-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--      </div>-->
  </div>
</template>

<script>
    export default {
        data () {
            return {}
        },
        props:{
            columns:{
                type: Array
            },
            currentIndex:{
                type: Number
            }
        }
    }
</script>
