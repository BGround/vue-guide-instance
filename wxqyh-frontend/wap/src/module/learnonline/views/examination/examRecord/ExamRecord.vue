<template>
  <div class="wrap exam_record">
    <!-- 考试中提示 -->
    <div 
      class="examing_tip_wrap"
      v-if="inTheExamMap.size"
    >
      <examing-tip
        class="qwui-tips fixed_set_top"
        @clickExaming="clickExaming"
      ></examing-tip>
      <!-- 填充方块 -->
      <div class="fill_box"></div>
    </div>

    <!-- 考试记录列表数据 -->
    <exam
      class="exam_content"
      v-for="(item,index) in pageData"
      :item="item"
      :isRecord="true"
      :nowTimeStamp="examination.nowTimeStamp"
      :key="index"
    ></exam>

    <!-- 加载更多组件 -->
    <load-more
      :loading="nowContentData.loading"
      :maxPage="nowContentData.maxPage"
      :currPage="nowContentData.currPage"
      :borderTop=false
      colorType="transparent"
      @loadMoreClick="loadMoreList"
    >
      <span v-show="loadMoreShow">{{$t('i18n.nomore')}}</span>
    </load-more>

    <!-- 无数据提示 -->
    <no-record
      v-show="hasRecord.show"
      :hasRecord="hasRecord"
    ></no-record>
  </div>
</template>


<script>
import { mapState, mapMutations } from 'vuex';
import NoRecord from '@/components/base/noRecord';    // 暂无数据公共组件
import LoadMore from '@/components/list/load_more';   // 加载更多公共组件
import Exam from '../../../components/examination/Exam'; // 考试组件(以时间为单位)
import ExamingTip from '../../../components/examination/ExamingTip'; // 考试中标签
import { newDateObj } from '../../../../../assets/js/time-util'; // 兼容ios时间
import { searchExam, searchExamCount} from "../../../api/getData"; // 请求接口
export default {
  name: 'MarkingRecord',
  components: {
    NoRecord,
    LoadMore,
    Exam,
    ExamingTip
  },
  filters: {
  },
  data(){
    return {
      /* 公共组件配置项 */
      hasRecordCommon: { // 无数据配置
        setTop: true,
        icon: 'icon_noData',
        title: this.$t('i18n.noRecord'),
        text: '',
      },

      /* 数据项 */
      examPageData: { // 考试数据
        inTheExamMap: new Map(), // 正在考试中的数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },

    };
  },
  computed: {
    ...mapState([
      'examination'
    ]),
    // 当前使用的数据，统一方式，便于理解和维护多个文件
    nowContentData() {
      return this.examPageData;
    },
    pageData() {
      return this.nowContentData.pageData;
    },
    inTheExamMap() {
      return this.examPageData.inTheExamMap;
    },
    // 无数据配置
    hasRecord() {
      return Object.assign({}, this.hasRecordCommon, {
        // 请求后为第一页。 可以避免初始化时渲染无数据页
        show: !this.pageData.length && this.nowContentData.currPage
      })
    },
    loadMoreShow() {
      return !this.hasRecord.show && this.pageData.length
    }

  },
  created() {
    // 继续考试剩余时间定时器
    if(!this.examination.handle) {// 当前无循环时开启
      this.UPDATE_NOWTIME(); // 先更新当前时间在开启循环,避免空档期1s
      let remainingTimer = setInterval(() => {
        this.UPDATE_NOWTIME(); // 1秒更新一次当前时间
      }, 1000);

      // 存句柄
      this.SET_CONTINUE_REMAIN({handle: remainingTimer})
    }

    // 添加滚动事件
    window.addEventListener('scroll', this.scrollList);

    this._searchExamCount().then(() => {
      this._searchExam();
    });
  },
  beforeDestroy() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  methods:{
    ...mapMutations([
      'SET_CONTINUE_REMAIN',
      'UPDATE_NOWTIME'
    ]),
    // 查询是否有正在进行的考试
    _searchExamCount() {      
      let nowContentData = this.nowContentData;
      nowContentData.inTheExamMap = new Map(); // 每次请求都初始化

      return new Promise((resolve, reject) => {
        searchExamCount({}, data => {
          let answerIngList = data.answerIngList;

          // 如果有正在考试中数据, 进行赋值
          answerIngList && answerIngList.forEach(nowAnswer => {
            nowContentData.inTheExamMap.set(nowAnswer.id, nowAnswer);
          })
          
          resolve();
        });
      });
    },

    // 查询考试记录数据
    _searchExam() {
      return new Promise((resolve, reject) => {
        searchExam({ // 为0 1则是考试搜索
          examStatus: 1, // 考试记录
          page: this.nowContentData.currPage + 1,
          keyWord: ''
        }, data => {
          let pageData = this.pageData;

          data.pageData = this.dataProcessing(data.pageData);// 数据处理
          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;


          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false});
          resolve();
        });
      })
    },

    // 从后台拿到的数据进行处理
    dataProcessing(pageData) {
      let inTheExamMap = this.nowContentData.inTheExamMap,
          retPageList = [], // 用来返回的，一个包含listItem数组
          listItem = {}, // 当前日期项对象，里面包含该日期点信息，以及包含考试数组
          dateTime= '',  // 当前日期, 与oldDateTime来判断是否新日期
          oldDateTime = '', // 老日期, 用来判断是否同新日期
          exam = {}; // 当前考试的信息。

      pageData.forEach(nowExam => {
        dateTime = nowExam.startTime? nowExam.startTime: nowExam.createTime;
        dateTime = dateTime.substr(0, 10);

        if (oldDateTime != dateTime && dateTime != '') { // 新的日期点
          oldDateTime && retPageList.push(listItem); // 推入只在新日期(第一个新日期不用) 以及 最后一个推入

          listItem = {}; // 新的日期点需要新的listItem
          let dataObject = this.getDateObejct(newDateObj(nowExam.startTime)); // 需要把时间的-换成/ 兼容ios
          listItem.week = dataObject.day;
          listItem.data = `${dataObject.month}月${dataObject.date}日`;
          oldDateTime = dateTime;
          listItem.list = listItem.list || [];
        }
        // 日期点提取完，准备考试项赋值且推入listItem.list中
        listItem.list = listItem.list || [];// 未初始化则初始化。

        /* 考试数据赋值 */
        exam = {};
        // 判断是否在考试中，并赋值
        let examObj = inTheExamMap.get(nowExam.id);
        let isInTheExam = !examObj? false:
                          examObj.duration == '0'? true: // 无限时长则在考试中
                          newDateObj(examObj.answerTime).getTime() + examObj.duration * 60 * 1000 - new Date().getTime() > 0;
        Object.assign(exam, nowExam, {
          inTheExam: isInTheExam
        });

        listItem.list.push(exam); // 将考试推入当前日期点
      });


      retPageList.push(listItem); // 推入只在新日期 以及 最后一个推入

      return retPageList;
      /* 返回结构
      retPageList: [
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
      let completeTimeLessTen = this.completeTimeLessTen;
      let date = new Date(newDate);
      let currentTime = {};
      currentTime.year = date.getFullYear();
      currentTime.month = date.getMonth() + 1;
      currentTime.date = date.getDate();
      currentTime.day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
      currentTime.month = completeTimeLessTen(currentTime.month);
      currentTime.date = completeTimeLessTen(currentTime.date);
      currentTime.hour = completeTimeLessTen(date.getHours());
      currentTime.minute = completeTimeLessTen(date.getMinutes());
      currentTime.second = completeTimeLessTen(date.getSeconds());
      return currentTime;
    },

    // 文本处理 小于十添加0
    completeTimeLessTen(time) {
      let parTime = parseInt(time);
      return parTime < 10? `0${parTime}`: parTime;
    },

    // 加载更多监听事件
    loadMoreList() {
      this._searchExam();
    },

    // 滚动事件
    scrollList() {
      let nowContentData = this.nowContentData;
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      if (nowContentData.scrollLock || !scrollTop) return; // 锁定/在顶处不用触发滚动

      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 44) { // 44是loadmore高度
        nowContentData.scrollLock = true; // 防止滚动多次请求
        if (!nowContentData.loading && nowContentData.currPage < nowContentData.maxPage) {
          this.loadMoreList();
        }
      }
    },

    // 点击考试中标签
    clickExaming() {
      let inTheExamMap = this.inTheExamMap;
      if (inTheExamMap.size == 1) {
        inTheExamMap.forEach((examingItem, examingId) => {
          this.$router.push({name: 'exam_write', params: {id: examingId}});
          return;
        });
      } else { // 多个考试列表, 进入考试中页面
        this.$router.push({name: 'examing'});
      }
    },
  },

};

</script>

<style lang="scss" scoped>

.exam_record {

  .examing_tip_wrap {
  
    .fill_box {
      width: 100%;
      height: 40px;
    }
  }

  /deep/ .icon_noData {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('~assets/images/icon_noData.png') center no-repeat;
    background-size: cover;
  }
}

</style>
