<template>
<div class="qwui-lean_examing">
  <exam 
    v-for="(item,index) in examingData"
    :item="item"
    :nowTimeStamp="examination.nowTimeStamp"
    :key="index"
  ></exam>
</div>

</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Exam from '../../../components/examination/Exam'; // 考试组件(以时间为单位)
import { searchExamCount as getExaming} from "../../../api/getData"; // 请求接口
import { newDateObj } from '../../../../../assets/js/time-util'; // 兼容ios时间
export default {
  name: 'QwExaming',
  components: {
    Exam
  },
  data(){
    return {
      examingData: [],
    };
  },
  computed:{
    ...mapState([
      'examination'
    ]),
  },
  created() {
    // 继续考试剩余时间定时器
    if(!this.examination.handle) {// 当前无循环时开启
      this.UPDATE_NOWTIME(); // 先更新当前时间在开启循环,避免空档期1s
      let remainingTimer = setInterval(() => {
        this.UPDATE_NOWTIME(); // 1s更新一次当前时间
      }, 1000);

      // 存句柄
      this.SET_CONTINUE_REMAIN({handle: remainingTimer})
    }

    this._getExaming();
  },
  methods:{
    ...mapMutations([
      'SET_CONTINUE_REMAIN',
      'UPDATE_NOWTIME'
    ]),
    // 获取正在考试数据请求
    _getExaming(obj){
      return new Promise((resolve, reject) => {
        getExaming({}, data => {
          let answerIngList = data.answerIngList;

          if (answerIngList.length) { // 如果有
            data.answerIngList = this.dataProcessing(data.answerIngList); // 数据处理
            this.examingData.push.apply(this.examingData, data.answerIngList);
            // 数据处理后赋值
          } else { // 如果正在考试中没数据, 返回
            this.$router.back();
          }

          resolve();
        }, reject);
      });
    },

    // 从后台拿到的数据进行处理
    dataProcessing(pageData) {
      let i, j, nowPageData, picList, picListLength, // 临时数据
          pageList = [], // 用来返回的，一个包含listItem数组
          listItem = {}, // 当前日期项对象，里面包含该日期点信息，以及包含考试数组
          dateTime= '',  // 当前日期, 与oldDateTime来判断是否新日期
          oldDateTime = '', // 老日期, 用来判断是否同新日期
          pageDataLength = pageData.length,
          dataObject = {}, // 存放时间的对象，可提取信息
          exam = {}; // 当前考试的信息。

      for (i = 0; i < pageDataLength; i++) {
        nowPageData = pageData[i];
        dateTime = nowPageData.startTime.substr(0, 10)? nowPageData.startTime.substr(0, 10): nowPageData.createTime.substr(0, 10);
        if (oldDateTime != dateTime && dateTime != '') { // 新的日期点
          oldDateTime && pageList.push(listItem); // 推入只在新日期(第一个新日期不用) 以及 最后一个推入

          listItem = {}; // 新的日期点需要新的listItem
          dataObject = this.getDateObejct(newDateObj(nowPageData.startTime)); // 需要把时间的-换成/ 兼容ios
          listItem.week = dataObject.day;
          listItem.data = `${dataObject.month}月${dataObject.date}日`;
          oldDateTime = dateTime;
          listItem.list = [];
        }
        // listItem.list = listItem.list || [];// 未初始化则初始化。

        /* 考试数据赋值 */
        exam = {};
        // 并赋值在考试中
        Object.assign(exam, nowPageData, {
          inTheExam: true
        });

        listItem.list.push(exam); // 将考试推入当前日期点
      } // for循环完

      pageList.push(listItem); // 推入只在新日期 以及 最后一个推入
      return pageList;
      /* 返回结构
      pageList: [
        listItem: {
          week: '',
          data: '',
          list: [
            {
              exam：{}
            }
          ]
        }
      ]
      */
    },

    //获取当前年、月、日、时、分、秒、周期的对象（以对象形式返回）
    getDateObejct(newDate=Date.now()) {
      let date = new Date(newDate);
      let dateObject={};
      dateObject.year = date.getFullYear();
      dateObject.month = date.getMonth() + 1;
      dateObject.date = date.getDate();
      dateObject.day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
      dateObject.month = dateObject.month < 10 ? "0" + dateObject.month : dateObject.month;
      dateObject.date = dateObject.date < 10 ? "0" + dateObject.date : dateObject.date;
      dateObject.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      dateObject.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      dateObject.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      return dateObject;
    },
  },

};

</script>

<style lang="scss" scoped>
</style>
