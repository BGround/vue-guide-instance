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
            <th colspan="8"
                class="borderR">{{firstYear}}年{{month1}}月上险数</th>
            <th colspan="8"
                class="borderR">{{year2}}年{{month2}}月上险数</th>
            <th colspan="8">{{year3}}年{{month3}}月上险数</th>
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


            <!-- 最新一年 -->
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


            <!-- 最新一年 -1 -->
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


            <!-- 最新一年 -2 -->
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
              month1:'',
              year2:'',
              month2:'',
              year3:'',
              month3:''
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
          },
          startDate:{
            type: String
          },
          endDate:{
            type: String
          }
          // currentMonth:{
          //   type: String
          // },
          // lastMonth:{
          //   type: String
          // },
          // beforeMonth:{
          //   type: String
          // }
      },
      computed: {
        firstYear() {
          let year1 = this.endDate.substr(0,4)
          let month1 = this.endDate.substr(4,6)
          let year2 = ''
          let month2=''
          let year3 = this.startDate.substr(0,4)
          let month3 = this.startDate.substr(4,6)
          if(parseInt(month1)==1 && parseInt(month3)<12){
            month2 = '12'
            year2 = year3
          } else {
            month2 = this.add0(parseInt(month1)-1)
            year2 = year1
          }
          this.month1 = month1
          this.year2 = year2
          this.month2 = month2
          this.year3 = year3
          this.month3 = month3
          return year1
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
          },
          add0(val){
            let txt = val
            if(val<10){
              txt = '0'+val
            }
            return txt
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
