<template>
  <div class="personPopWrap">
    <div class="mask"></div>
    <div class="personPopInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>基础信息</h4>
        </div>

        <div class="basicDes">
          <div class="bLabel">
            <ul>
              <li>姓名</li>
              <li>性别</li>
              <li>出生日期</li>
              <li>日常居住城市</li>
              <li>国籍</li>
              <li>籍贯</li>
              <li>最高学历</li>
              <li>邮箱</li>
              <li>公司电话</li>
            </ul>
          </div>
          <div class="bValue">
            <ul>
              <li>{{columns.name}}</li>
              <li>{{columns.sex | filterSex}}</li>
              <li>{{columns.birthday}}</li>
              <li>{{columns.city}}</li>
              <li>{{columns.nationality}}</li>
              <li>{{columns.nativePlace}}</li>
              <li>{{columns.education}}</li>
              <li>{{columns.email}}</li>
              <li>{{columns.mobile}}</li>
            </ul>
<!--            <div class="headWrap"><img src="../../images/temp/test2.png" /></div>-->
          </div>
        </div>

        <div class="titWrap mb10">
          <h4>工作经历</h4>
        </div>
        <table>
          <tr>
            <th>起止年月</th>
            <th>工作单位</th>
            <th>承担职务</th>
          </tr>
          <tr v-if="columns && (columns.beginYear || columns.company || columns.bearPost)">
            <td>{{columns.beginYear}}</td>
            <td>{{columns.company}}</td>
            <td>{{columns.bearPost}}</td>
          </tr>
          <tr v-if="columns && !columns.beginYear && !columns.ompany && !columns.bearPost"><td colspan="3">暂无数据</td></tr>
        </table>

        <div class="titWrap mb10">
          <h4>担任社会职务</h4>
        </div>
        <table>
          <tr>
            <th>承担职务</th>
            <th>任职年月</th>
          </tr>
          <tr v-if="columns && (columns.sociologyPost || columns.servingYear)">
            <td>{{columns.sociologyPost || '-'}}</td>
            <td>{{columns.servingYear || '-'}}</td>
          </tr>
          <tr v-else><td colspan="2">暂无数据</td></tr>
        </table>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePersonDes">关闭</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return {}
  },
  props:{
    columns:{
        type:Object
    }
  },
  methods: {
    closePersonDes() {
      this.$emit('closePersonDes', '')
    }
  },
  components: {
    qwuiButton
  },
    filters:{
      filterSex(val){
          let txt = '-'
          switch (val) {
              case '0':
                  txt = '男'
                  break;
              case '1':
                  txt = '女'
                  break;
          }
          return txt
      }
    }
}
</script>
