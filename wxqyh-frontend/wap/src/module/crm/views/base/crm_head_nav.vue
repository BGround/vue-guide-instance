<template>

    <!--头部菜单-->
    <div class="qwui-nav_box_fixed">
        <div class="qwui-nav_box">
          <div class="qwui-nav_box_content" v-for="(item,idx) in headrdata.nav" :key="idx" @click="linkUrl(item)" v-if="showNav">
              <div class="qwui-nav_box_radius">
                <i class="qwui-nav_box_tip" v-if="item.value != ''">{{item.value}}</i>
                <i class="qwui-nav_box_icon" :class="item.class">
                </i>
              </div>
              <span class="qwui-nav_box_text">{{item.text}}</span>
          </div>
        </div>
    </div>
</template>

<script>
import { getCrmBriefing } from '../../api/client/getData'
export default {
  name: 'crm_head_nav',
  components:{
  },

  props:{
    headrdata:Object,
    showNav:{
      type:Boolean,
      default:true,
    }
  },
  data(){
    return {
      isShow: false,
      headData:this.headrdata,
      show: false,
      logVO:{}
    }
  },
  mounted() {
    getCrmBriefing((data) => {
      var arr = [];// arr是返回数据的对象转成的数组
      var temp = [];// temp存储返回的参数
      for (let i in data.logVO) {
          temp.push(data.logVO[i])
          arr.push(i);
      }
      var len = arr.length;
      for(let i = 0;i<len;i++){
        if(this.headData.nav[i].name){//把有name值得参数循环出来
          for(let j = 0;j<this.headData.nav.length;j++){
            if(arr[j]===this.headData.nav[i].name){
              this.headData.nav[i].value = temp[j] > 99 ? 99 + '+' : temp[j]; //如果大于99，显示99+
            }
            if(this.headData.nav[i].value!=0||this.headData.nav[i].value!=''){
              this.isshow = true
            }
          }
        }
      }
    });
  },
  methods:{
    linkUrl(item){
      if (item.url.includes('jsp')) {
        location.href = _.baseURL + item.url;
      } else {
        this.$router.push({name: item.url, params: {status: item.params}});
      }
    },
    // 供父元素调用后可打开 “新建”
    newBuilt (){
      this.show = true;
    }
  }
  }

</script>

<style>

  /* 头部导航栏 */
   .qwui-nav_box_height{
    height: 100px;
  }
   .qwui-nav_box_fixed{
    width: 100%;
    z-index: 10
  }
   .qwui-nav_box{
    display: inline-block;
    width: 100%;
    height: 100%;
    padding-top: 8px;
    background-color: #ffffff;
  }
   .qwui-nav_box_content{
    display:inline-block;
    flex: 1;
    width:25%;
    padding: 20px 0 10px;
    text-align: center;
  }
   .add_content{
    width:33.33%;
  }
   .qwui-nav_box_content a{
    display: block;
  }
   .qwui-nav_box_radius{
    position: relative;
    margin:auto;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: #fff;
  }
   .qwui-nav_box_text{
    display:inline-block;
    height:15px;
    line-height:15px;
    font-size:1.3rem;
    font-family:"Microsoft YaHei","宋体";
    color:#7A7C80;
    }
  .qwui-nav_box_tip{
    position: absolute;
    top: -.4rem;
    left: 2.8rem;
    padding: .05rem 0.39rem;
    color: #fff;
    font-style: normal;
    text-align: center;
    font-size: 1rem;
    line-height: 1.3rem;
    background-color: #ff3333;
    border-radius: 3.45rem;
    z-index: 100;
  }
   .qwui-nav_box_icon{
    display: block;
    width: 48px;
    height: 48px;
  }
   .qwui-nav_box_create{
    width:100px;
    height:36px;
    margin:20px auto 24px auto;
    text-align:center;
    border-radius:18px;
    border:1px solid rgba(224,234,244,1);
    cursor:pointer;
  }
   .crm_index_wrap .ic_sea{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmghc.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_customer{
    position: absolute;
    left: 1px;
    background: url(~assets/images/crm/icon_home_crmkh@v2.png) center no-repeat;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_customer_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmkh_greyBG.png) center no-repeat;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_external_contact{
    position: absolute;
    background: url(~assets/images/crm/icon_home_wblcr.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_contact{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmlxr@v2.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_contact_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmlxr_greyBG.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_visit{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmbf@v2.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_visit_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmbf_greyBG.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_bussiness{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmsj@v2.png) center no-repeat;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_bussiness_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmsj_greyBG.png) center no-repeat;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_agreenment{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmht@v2.png) center no-repeat;
    left: 2px;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_agreenment_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmht_greyBG.png) center no-repeat;
    left: 2px;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_data{
    position: absolute;
    background: url(~assets/images/crm/icon_home_crmsjkb@v2.png) center no-repeat;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_competitor{
    position: absolute;
    background: url(~assets/images/crm/icon_home_competitor.png) center no-repeat;
    background-size: 100% 100%;
  }
  .crm_index_wrap .ic_competitor_grey_bg{
    position: absolute;
    background: url(~assets/images/crm/icon_home_competitor_greyBG.png) center no-repeat;
    left: 2px;
    background-size: 100% 100%;
  }
   .crm_index_wrap .ic_check{
      position: absolute;
      background: url(~assets/images/crm/icon_home_crmcc@v2.png) center no-repeat;
      background-size: 100% 100%;
    }
</style>
