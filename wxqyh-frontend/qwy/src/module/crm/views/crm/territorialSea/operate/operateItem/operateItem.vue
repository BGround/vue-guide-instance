<template>
    <div>
        <!--输入框 类型为input-->
        <div class="operateItem" v-if="itemData.itemType == 'input' && itemData.status == true">
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="input" v-if="itemData.optionName == '客户名称' ||  itemData.type == 1 ">
            <qwui-input inputType="text"
                        ref="input"
                        :maxLength="maxLength"
                        :inputTips="itemData.placeholderName"
                        v-model="itemData.value"
                        :class='{error:itemData.isWarning,inputError:itemData.isWarning}'
                        @blur="blur(itemData)">
            </qwui-input>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.errTip}}</p>
          </div>
          <div class="input" v-else>
            <qwui-input ref="input"
                        inputType="base"
                        :inputTips="itemData.placeholderName"
                        v-model="itemData.value"
                        :class='{error:itemData.isWarning,inputError:itemData.isWarning}'
                        @blur="blur(itemData)">
            </qwui-input>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.errTip}}</p>
            <span class="mapIcon" v-if="itemData.optionName == '地址'" @click="openMap"></span>
          </div>
          <span class="percent" v-if="itemData.ext1 == 3">%</span>
        </div>

        <!--点击选择 类型为clickSelect-->
        <div class="operateItem" v-if="itemData.itemType == 'clickSelect' && itemData.status == true">
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="clickSelect"  @click="select(itemData.optionName)" :class="{error:itemData.isWarning,inputError:itemData.isWarning}">
            <!--所属公海标签列表-->
            <ul class="industryList" v-if="itemData.optionName == '所属公海'">
              <li v-for="(item,index) in poolArr" :key="index">
                <span class="icon_pool"></span>
                <span class="industryName">{{item.optionName}}</span>
                <span class="delIndustry iconfont public-web-ic_b-close" @click.stop="delPool(index)"></span>
              </li>
              <p v-if="showPoolText">点击选择</p>
            </ul>
            <!--行业标签列表-->
            <ul class="industryList" v-if="itemData.optionName == '行业'">
              <li v-for="(item,index) in industryList" :key="index">
                <span class="icon_industry"></span>
                <span class="industryName">{{item.title}}</span>
                <span class="delIndustry iconfont public-web-ic_b-close" @click.stop="delIndustry(index)"></span>
              </li>
              <p v-if="showIndustryText">点击选择</p>
            </ul>
          </div>
          <!--所属公海-->
          <div class="industry">
            <qwSelectSea :show="showPoolSelect"
                         :poolList="poolList"
                         :poolId="poolId"
                         @closePool="closePool"
                         @on-confirm="confirmPool">
            </qwSelectSea>
          </div>
          <!--行业-->
          <div class="mask" v-if="showIndustry" @click="closeMask"></div>
          <div class="industry" v-if="showIndustry">
            <industry :selectedArr="industryArr" @confirm="confirmIndustry"></industry>
          </div>
          <!--提示-->
          <div class="numTip" v-if="itemData.optionName == '所属公海' && poolArr.length>=1">
            已选<span class="num">{{poolArr.length}}</span>公海池
            <span class="resetBtn" @click="resetPool">修改</span>
          </div>
          <div class="numTip" v-if="itemData.optionName == '行业' && industryList.length>=1">
            已选<span class="num">{{industryList.length}}</span>行业
            <span class="resetBtn" @click="resetIndustry">修改</span>
          </div>
          <!--错误提示-->
          <div class="click">
            <p class="errTip" v-if="itemData.isWarning">{{itemData.errTip}}</p>
          </div>
        </div>


        <!--下拉框 类型为select-->
        <div class="operateItem" v-if="itemData.itemType == 'select' && itemData.status == true" >
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="select">
            <qwui-select @selectItem="selectItem" ref="select" :dataList="optionData" :class='{error:itemData.isWarning,selectError:itemData.isWarning}'></qwui-select>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.errTip}}</p>
          </div>
        </div>

        <!--文本域 类型为textarea-->
        <div class="operateItem" v-if="itemData.itemType == 'textarea' && itemData.status == true">
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="textarea">
            <qwui-input
                        inputType="textarea"
                        :inputTips="itemData.placeholderName"
                        :maxLength="2000"
                        v-model="itemData.value"
                        :class='{error:itemData.isWarning,textareaError:itemData.isWarning}'>
            </qwui-input>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.optionName}}不能为空</p>
          </div>
        </div>

        <!--区域 类型为area-->
        <div class="operateItem" v-if="itemData.itemType == 'area' && itemData.status == true" >
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="area">
            <addr v-model="itemData.value"></addr>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.optionName}}不能为空</p>
          </div>
        </div>

        <!--日期  类型为date-->
        <div class="operateItem" v-if="itemData.itemType == 'date' && itemData.status == true">
          <div class="itemName">
            <h1 :class="{must:itemData.isMust == 1}">{{itemData.optionName}}</h1>
          </div>
          <div class="datePick">
            <date-picker class="date-picker-width"
                         v-model="itemData.value"
                         format="YYYY-MM-DD HH:mm"
                         :showButtons ="true"
                         :placeholder="itemData.placeholderName"
                         @confirm="dateConfirm"
                         :class='{error:itemData.isWarning,inputError:itemData.isWarning}'
                         ref="searchDate" >
            </date-picker>
            <p class="errTip" v-if="itemData.isWarning">{{itemData.optionName}}不能为空</p>
          </div>

        </div>


    </div>
</template>

<script>
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import datePicker from '@/components/base/VueDatepickerLocal';
  import industry from 'crm/components/industry/industry'
  import qwSelectSea from 'crm/components/qw-selectSea/qw-selectSea'
  import addr from 'crm/components/qwAddress/index'
  import {getPoolList,validPhoneOrClient} from '@/module/crm/api/territorialSea';
    export default {
      name: "operate-item",
      props:{
        itemData:{
          type:Object,
          default:{},
        },
        poolArray:{
          type:Array,
          default: () => [] ,
        },
        industryArray:{
          type:Array,
          default: () => [] ,
        },
        selectArray:{
          type:Object,
          default: () => {} ,
        },
      },
      components:{
        qwuiInput,
        qwuiSelect,
        qwuiButton,
        datePicker,
        industry,
        addr,
        qwSelectSea,
      },
      data(){
        return {
          isWarning:true,
          maxLength:200,
          optionData:[],//下拉列表项数据
          industryArr:[],//行业树
          industryList:[],//行业列表
          showIndustry:false,
          showPoolText:true,
          showIndustryText:true,
          selectData:0,//下拉列表值
          address:{},
          showPoolSelect:false,//显示公海池选择
          poolArr:[],//所属公海数组
          poolList:[],//公海池列表
          poolId:'',//公海池id
        }
      },
      created(){
        this.getSelectItem();
      },
      mounted(){
        this.$refs.select&&this.$refs.select.setValue(this.itemData.value);
      },
      watch: {
        poolArray(newVal){
          if(newVal.length != 0){
            this.poolArr=newVal;
            this.poolId=newVal[0].val?newVal[0].val:'';
          }else{
            this.poolArr=[];
            this.poolId='';
          }
          this.showPoolText= this.poolArr.length>0?false:true;
        },
        industryArray(newVal) {
          newVal.forEach(item=>{
            if(item.key!=""){
              this.industryArr.push(item.key);
              this.industryList=newVal;
              this.showIndustryText= this.industryList.length>0?false:true;
            }
          })
        },
        "itemData.value"(val){
          this.$refs.select&&this.$refs.select.setValue(val)
        }
      },
      methods:{

      //  获取区域
        getArea:function(val){
          this.$emit('getArea',val)
        },

      //  获取下拉列表选项
        getSelectItem:function(){
          let listObj,arr=[];
          arr.push(this.itemData)
          arr.forEach(item=>{
            if(item.type == '0'){
              item.list.forEach(item=>{
                listObj=Object.assign({optionName:item.name,val:item.id});
                this.optionData.push(listObj);
              })
            }
          })
          let firstOption={
            optionName:'请选择',
            val:'',
          }
          this.optionData.unshift(firstOption)
        },

        //获取公海池列表
        getList: function () {
          getPoolList().then(res => {
            if (res.code == '0') {
              this.poolList = res.data.CrmClientPoolConfigList;
            } else {
              _.alert('提示', res.desc)
            }
          }).catch(err => {
            _.alert('提示', "网络错误")
          })
        },

        //所属公海选择
        confirmPool:function(val){
          this.poolArr=[];
          this.poolArr.push(val);
          this.showPoolText=this.poolArr.length>0?false:true;
          this.showPoolSelect=false;
          this.$emit('poolData',val)
        },
        //关闭公海池
        closePool:function () {
          this.showPoolSelect=false;
        },
        //删除公海池
        delPool:function(index){
          this.poolArr.splice(index,1);
          this.showPoolText=this.poolArr.length>0?false:true;
          this.$emit('removePool')
        },
        //修改公海池
        resetPool:function(){
          this.showPoolSelect=true;
          this.getList()
        },

        //显示选择行业&所属公海
        select:function(opt){
          if(opt=='所属公海'){
            this.showPoolSelect=true;
            this.getList()
          }
          if(opt=='行业'){
            this.showIndustry=true;
          }
        },
        //关闭遮罩
        closeMask:function(){
          this.showIndustry=false;
        },
        //关闭选择行业树
        closeIndustry:function(){
          this.showIndustry=false;
        },
        //确认选择的行业
        confirmIndustry:function(val){
          this.industryList=val;
          this.showIndustryText=this.industryList.length>0?false:true;

          let keys='',titles='';
          this.industryArr=[];
          val.forEach(item=>{
            keys+=item.key+',';
            titles+=item.title+'|';
            this.industryArr.push(item.key);
          })
          keys=keys.slice(0,keys.length-1);
          titles=titles.slice(0,titles.length-1);

          this.showIndustry=false;
          this.$emit('industryData',keys,titles)
        },
        //  删除行业
        delIndustry:function(index){
          this.industryList.splice(index,1);
          this.industryArr=[];

          let keys='',titles='';
          this.industryList.forEach(item=>{
            keys+=item.key+',';
            titles+=item.title+'|';
            this.industryArr.push(item.key);
          })
          keys=keys.slice(0,keys.length-1);
          titles=titles.slice(0,titles.length-1);
          console.log('+',keys,titles)

          this.showIndustry=false;
          this.showIndustryText=this.industryList.length==0?true:false;

          this.$emit('industryData',keys,titles)
        },
        //修改行业
        resetIndustry:function(){
          this.showIndustry=true;
        },

        // 日期组件 确定 按钮回调函数
        dateConfirm(val){
          this.itemData.value = val;
        },

        //下拉列表选项值
        selectItem:function (optionName,val) {
          this.selectData=val;
          this.$emit('getSelectData',val)
        },

      //  输入框失去焦点
        blur:function(val){
          if(val.optionName == '客户名称'){
            this.$emit('isRepeat','clientName')
          }
          if(val.optionName == '联系电话'){
            this.$emit('isRepeat','phone')
          }
        },


      //  打开地图
        openMap:function(){
          this.$emit('openMap')
        },

      }
    }
</script>

<style scoped lang="scss">
  @import "./operateItem.scss";
</style>
