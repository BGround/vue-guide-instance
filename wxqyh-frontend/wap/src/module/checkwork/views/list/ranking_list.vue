<template>
  <div class="wrap">
    <ul>
      <li v-for="(item, index) in pageData" :key="index">
        <div class="qwui-ranking_list_box">
          <div class="qwui-ranking_list_place">
            <span class="qwui-ic_indexOne_icon" v-if="index == 0"></span>
            <span class="qwui-ic_indexTwo_icon" v-if="index == 1"></span>
            <span class="qwui-ic_indexThree_icon" v-if="index == 2"></span>
            <span v-if="index!==0 && index!==1 && index!==2">{{index+1}}</span>
          </div>

          <div class="qwui-ranking_list_item">
            <div class="qwui-ranking_list_logo">
              <img :src="item.headPic" alt="">
            </div>

            <div class="qwui-ranking_list_username">
              <p>{{item.personName}}</p>
              <span>{{item.departmentName}}</span>
            </div>
          </div>

          <!-- 列表右侧信息 -->
          <div class="qwui-ranking_list_right">
            <!-- 早到榜 -->
            <div v-if="item.signTime">
              <div class="qwui-ranking_list_count">
                <span>{{item.signTime | signTimefilter}}</span>
              </div>

              <div class="qwui-ranking_small_dianzan" @click="dolikes(index,'10')">
                <span
                  class="qwui-ranking_small_likes"
                  v-bind:class="[item.hasPraise ? 'qwui-dz_orange_color' : 'qwui-dz_gray_color']"
                >
                  {{item.praiseNum}}
                </span>
                <span
                  class="qwui-ranking_small_icon"
                  v-bind:class="[item.hasPraise ? 'qwui-dz_orange_icon' : 'qwui-dz_gray_icon']"
                >
                </span>
              </div>
            </div>

            <!-- 勤奋榜 -->
            <div v-if="item.countWorkHour">

              <!-- 开启总工时 -->
              <div v-if="dataBase.statistics.diligentIsDisplay">
                <div class="qwui-ranking_list_count">
                  <span>{{item.countWorkHour}} 小时</span>
                </div>

                <div class="qwui-ranking_small_dianzan" @click="dolikes(index,'11')">
                  <span
                    class="qwui-ranking_small_likes"
                    v-bind:class="[item.hasPraise ? 'qwui-dz_orange_color' : 'qwui-dz_gray_color']"
                  >
                    {{item.praiseNum}}
                  </span>
                  <span
                    class="qwui-ranking_small_icon"
                    v-bind:class="[item.hasPraise ? 'qwui-dz_orange_icon' : 'qwui-dz_gray_icon']"
                  >
                  </span>
                </div>
              </div>

              <!-- 未开启总工时 -->
              <div v-if="!dataBase.statistics.diligentIsDisplay">
                <div class="qwui-ranking_big_dianzan" @click="dolikes(index,'11')">
                  <span
                    class="qwui-ranking_big_likes"
                    v-bind:class="[item.hasPraise ? 'qwui-dz_orange_color' : 'qwui-dz_gray_color']"
                  >
                    {{item.praiseNum}}
                  </span>
                  <span
                    class="qwui-ranking_big_icon"
                    v-bind:class="[item.hasPraise ? 'qwui-dz_orange_icon1' : 'qwui-dz_gray_icon']"
                  >
                  </span>
                </div>
              </div>

            </div>

            <!-- 迟到榜 -->
            <div v-if="item.lateNum">
              <div class="qwui-ranking_list_count">
                <span>{{item.lateNum}} 次</span>
              </div>
            </div>

          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {spotPraise} from "../../api/getData";
  export default {
    props:['listdata',"loadmore"],
    data(){
      return {
        transData:{},
        dataBase:dataBase,
      }
    },
    filters: {
      signTimefilter: function (val) {
        if (!val) return '';
        return val.replace(" ",":").replace(/\:/g,"-").replace(/(\d{4})\-(\d{2})\-(\d{2})\-(\d{2})\-(\d{2})\-(\d{2})/,"$4:$5");
      }
    },
    computed: {
      pageData(){
        if(this.loadmore.padeConfig.pageData){
          return this.loadmore.padeConfig.pageData;
        }
      },
    },
    methods:{
      //点赞数
      dolikes(index,type){
        let pageData = this.loadmore.padeConfig.pageData[index];
        let foreignId = pageData.id;
        let praiseType;
        if(pageData.hasPraise){
          praiseType = "0";
        }else{
          praiseType = "1";
        }
        let getData = {
          foreignId:foreignId,//考勤部门id
          type:type,//排行榜类型
          praiseType:praiseType
        };
        spotPraise(getData,function () {
          pageData.praiseNum = pageData.hasPraise ? parseInt(pageData.praiseNum)-1 : parseInt(pageData.praiseNum)+1;
          pageData.hasPraise = !pageData.hasPraise;
        });
      },
    }
  }
</script>

<style scoped>
  .wrap{
    background: #fff;
  }
  .qwui-ranking_list_box{
    position: relative;
    height:52px;
    margin: 12px 15px 12px 15px;
  }
  .qwui-ranking_list_box::after{
    content: '';
    position: absolute;
    left:39px;
    bottom: 0;
    right: -15px;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
  }
  .qwui-ranking_list_place{
    margin: 7.5px 19px 0 0;
    float: left;
    width: 20px;
    height: 25px;
    text-align: center;
    font-size: 16px;
    font-family: "黑体";
    font-weight: bold;
    color: #999;
  }
  .qwui-ic_indexOne_icon {
    display: inline-block;
    margin: 0;
    width: 20px;
    height: 25px;
    background: url("~assets/images/checkwork/ic_indexOne.png") no-repeat;
    background-size: 20px 25px;
  }
  .qwui-ic_indexTwo_icon {
    display: inline-block;
    margin: 0;
    width: 20px;
    height: 25px;
    background: url("~assets/images/checkwork/ic_indexTwo.png") no-repeat;
    background-size: 20px 25px;
  }
  .qwui-ic_indexThree_icon {
    display: inline-block;
    margin: 0;
    width: 20px;
    height: 25px;
    background: url("~assets/images/checkwork/ic_indexThree.png") no-repeat;
    background-size: 20px 25px;
    z-index: 999
  }
  .qwui-ranking_list_item{
    margin-left:40px;
    margin-right:100px;
  }
  .qwui-ranking_list_logo{
    width: 40px;
    float: left;
  }
  .qwui-ranking_list_logo img{
    width: 40px;
    height: 40px;
  }
  .qwui-ranking_list_username{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 51px;
  }
  .qwui-ranking_list_username p{
    font-size: 15px;
    color: #333;
    line-height: 1.2
  }
  .qwui-ranking_list_username span{
    display: inline-block;
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
  .qwui-ranking_list_right{
    position: absolute;
    top:0;
    right:0;
  }
  .qwui-ranking_list_count{
    line-height: 1.1;
    font-size: 14px;
    color: #333;
  }

  /* 点赞图标 start*/
  .qwui-ranking_small_dianzan{
    margin-top: 8px;
    cursor: pointer;
    text-align: end
  }
  .qwui-ranking_small_likes{
    position: absolute;
    top: 22px;
    right: 20px;
    font-size: 10px;
    color: #999;
  }
  .qwui-ranking_small_icon{
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url("~assets/images/checkwork/ic_dz.png") no-repeat;
    background-size: 48px 12px;
  }

  .qwui-ranking_big_dianzan{
    margin-top: 12px;
    cursor: pointer;
    text-align: end
  }
  .qwui-ranking_big_likes{
    position: absolute;
    top: 9px;
    right: 25px;
    font-size: 16px;
    color: #999;
  }
  .qwui-ranking_big_icon{
    display:inline-block;
    width: 16px;
    height: 16px;
    background: url("~assets/images/checkwork/ic_dz.png") no-repeat;
    background-size: 64px 16px;
  }
  .qwui-dz_gray_icon{
    background-position:0 0;
  }
  .qwui-dz_orange_icon{
    background-position:-12px 0;
  }
  .qwui-dz_orange_icon1{
    background-position:-16px 0;
  }
  .qwui-dz_orange_color{
    color:#FF9600;
  }
  .qwui-dz_gray_color{
    color:#bbb;
  }
  /* 点赞图标 end*/
</style>

