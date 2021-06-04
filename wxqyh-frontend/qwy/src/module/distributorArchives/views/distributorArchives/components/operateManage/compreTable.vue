<template>
  <div class="compreWrap">
  <table>
    <tr>
      <th>评估周期</th>
      <th>得分</th>
<!--      <th>环比</th>-->
      <th>星级</th>
      <th>排名</th>
      <th>奖励额度</th>
      <th>否决项</th>
      <th>得分详情</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.year}}年第{{item.quarter | filterQuarter}}季度</td>
      <td>{{item.score}}</td>
      <td><span v-for="sitem in item.starLevel" :key="sitem"><img :src="icon.iconStar"></span></td>
      <td>{{item.rankNo}}</td>
      <td>{{item.awardAmount}}</td>
      <td>{{item.veto}}</td>
      <td>
        <el-popover
          placement="left"
          title="得分详情:"
          width="200"
          name
          slot="content"
          trigger="click">
            <div v-html="item.functional"></div>
          <el-button slot="reference" type="text">查看</el-button>
        </el-popover>
      </td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="7">暂无数据</td></tr>
  </table>

  <!-- 详情弹框 start -->
  <compreDesPop v-if="isShowCompreDes" :columns="compreDes" @closeCompreDesPop="closeCompreDesPop"></compreDesPop>
  <!-- 详情弹框 end -->
  </div>
</template>

<script>
  import compreDesPop from "./compreDesPop";
  import iconStar from '../../images/icon_star.png'
  export default {
      data () {
          return {
              isShowCompreDes:false,
              compreDes:{},
              icon: {
                  iconStar: iconStar
              },
          }
      },
      props:{
          columns:{
              type:Array,
              default: []
          }
      },
      methods:{
          openDesFun(item){
              this.compreDes = item
              this.isShowCompreDes = true
          },
          closeCompreDesPop(){
              this.isShowCompreDes = false
          }
      },
      components:{compreDesPop},
      filters:{
          filterQuarter(val){
              let txt = '-'
              switch (val) {
                  case '1':
                      txt = '一'
                      break;
                  case '2':
                      txt = '二'
                      break;
                  case '3':
                      txt = '三'
                      break
                  case '4':
                      txt = '四'
                      break
              }
              return txt
          }
      }
  }
</script>
