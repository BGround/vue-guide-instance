<template>
  <div class="scrollTableWrap">
    <div class="table-head">
      <table>
        <colgroup>
          <col style="width: 90px;" />
          <col style="width: 90px;" />
          <col style="width: 90px;" />
          <col style="width: 90px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />
        </colgroup>
        <thead>
          <tr class="cityRateTit">
            <th colspan="4" class="borderR">城市信息</th>
            <th colspan="8"  class="borderR">{{currentYear}}年上险数</th>
            <th colspan="8"
                class="borderR">{{lastYear}}年上险数</th>
            <th colspan="8" >{{beforeLastYear}}年上险数</th> 
          </tr>
          <tr>
            <th colspan="4" class="borderR"></th>
            <th colspan="4"
                class="borderR">全市场</th>
            <th colspan="4"
                class="borderR">自主品牌</th>
            <th colspan="4"
                class="borderR">全市场</th>
            <th colspan="4"
                class="borderR">自主品牌</th>
            <th colspan="4"
                class="borderR">全市场</th>
            <th colspan="4">自主品牌</th>
          </tr>
          <tr>
            <th class="borderR">省份</th>
            <th class="borderR">城市</th>
            <th class="borderR">区县</th>
            <th class="borderR">类别</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th class="borderR">排名</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th class="borderR">排名</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th class="borderR">排名</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th class="borderR">排名</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th class="borderR">排名</th>

            <th class="borderR">容量</th>
            <th class="borderR">奇瑞</th>
            <th class="borderR">市占率</th>
            <th>排名</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body">
      <table>
        <colgroup>
          <col style="width: 90px;" />
          <col style="width: 90px;" />
          <col style="width: 90px;" />
          <col style="width: 90px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />

          <col style="width: 90px;" />
          <col style="width: 70px;" />
          <col style="width: 90px;" />
          <col style="width: 40px;" />
        </colgroup>
        <tbody>
          <tr v-for="(item,index) in columns"
              :key="index">
            <td>{{item.province}}</td>
            <td>{{item.city}}</td>
            <td>{{item.region}}</td>
            <td>{{item.cityType}}</td>

             <!-- 当年 -->
            <td>{{item.totalNumAll3}}</td>
            <td>{{item.qiruiNumAll3}}</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentAll3 | filterNum}}%<i v-if="item.upDownAll3>0"
                                                    class="up">&#8593;</i><i v-else-if="item.upDownAll3<0"
                                                                             class="down">&#8595;</i><i v-else
                                                                                                        class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortAll3}}</td>
            <td v-else>-</td>

            <td>{{item.totalNumChina3}}</td>
            <td>{{item.qiruiNumChina3}}</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentChina3 | filterNum}}%<i v-if="item.upDownChina3>0"
                                                      class="up">&#8593;</i><i v-else-if="item.upDownChina3<0"
                                                                               class="down">&#8595;</i><i v-else
                                                                                                          class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortChina3}}</td>
            <td v-else>-</td>


            <!-- 去年 -->
            <td>{{item.totalNumAll2}}</td>
            <td>{{item.qiruiNumAll2}}</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentAll2 | filterNum}}%<i v-if="item.upDownAll2>0"
                                                    class="up">&#8593;</i><i v-else-if="item.upDownAll2<0"
                                                                             class="down">&#8595;</i><i v-else
                                                                                                        class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortAll2}}</td>
            <td v-else>-</td>

            <td>{{item.totalNumChina2}}</td>
            <td>{{item.qiruiNumChina2}}</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentChina2 | filterNum}}%<i v-if="item.upDownChina2>0"
                                                      class="up">&#8593;</i><i v-else-if="item.upDownChina2<0"
                                                                               class="down">&#8595;</i><i v-else
                                                                                                          class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortChina2}}</td>
            <td v-else>-</td>

            <!-- 前年 -->
            <td>{{item.totalNumAll1}}</td>
            <td>{{item.qiruiNumAll1}} </td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentAll1 | filterNum}}%<i v-if="item.upDownAll1>0"
                                                    class="up">&#8593;</i><i v-else-if="item.upDownAll1<0"
                                                                             class="down">&#8595;</i><i v-else
                                                                                                        class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortAll1}}</td>
            <td v-else>-</td>

            <td>{{item.totalNumChina1}}</td>
            <td>{{item.qiruiNumChina1}}</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.percentChina1 | filterNum}}%<i v-if="item.upDownChina1>0"
                                                      class="up">&#8593;</i><i v-else-if="item.upDownChina1<0"
                                                                               class="down">&#8595;</i><i v-else
                                                                                                          class="up">-</i></td>
            <td v-else>-</td>
            <td v-if="item.province!=='合计' && item.province!=='全国'">{{item.sortChina1}}</td>
            <td v-else>-</td>
          </tr>
          <tr v-if="columns && columns.length === 0">
            <td colspan="28">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
      data(){
          return {
              // currentYear:'',
              lastYear:'',
              beforeLastYear:''
          }
      },
      props:{
          columns:{
              type:Array
          },
          currentYear:{
              type: Number,
              default(){
                  return (new Date()).getFullYear()
              }
          }
      },
      created(){
          this.init()
      },
      methods:{
          init(){
              // let dateVal = new Date()
              // let year = dateVal.getFullYear()
              // this.currentYear = year
              let year = this.currentYear
              this.lastYear = year -1
              this.beforeLastYear = year-2
          }
      },
      filters: {
          filterNum: function(val) {
              if (val) {
                  return val.toFixed(2)
              } else {
                  return 0
              }
          }
      }
  }
</script>
