<template>
  <div>
    <div class="qwui-place_item" :class="addResponsibleClass" @click="showPlaceBoxList">
      <i class="qwui-place_left"></i>
      <div class="qwui-flexItem qwui-add_place">
        <span class="qwui-place_name" :style="{ 'width':placeNameWidth+'px' }">{{ taskPlace }}</span>
      </div>
      <i class="qwui-place_right" v-if="hasPermission"></i>
    </div>
    <div class="qwui-place_box" v-show="showPlaceBox" :style="{height:'100%'}">
      <div class="qwui-place_title">
        <div>{{$t('i18n.taskPlace')}}</div>
        <div class="qwui-place_title_right" @click="adminPlace">
          <span>{{$t('i18n.administration')}}</span>
        </div>
      </div>
      <div class="qwui-place_each_item" v-for="(item,index) in taskPlaceList" :key="index">
        <div v-if="!isDeletePlace" class="qwui-flex" @click="selectRadio(index)">
          <i class="qwui-place_radio" :class="{active:item.isActive}"></i>
          <div class="qwui-place_info">{{item.address}}</div>
        </div>
        <div v-else class="qwui-flex">
          <i class="qwui-place_delete" @click="deletePlace(index,item)"></i>
          <div class="qwui-place_info">{{item.address}}</div>
        </div>
      </div>
      <div v-show="!isDeletePlace" class="qwui-place_add" @click="showTentMap">
        <i class="qwui-place_add_left"></i>
        <span class="qwui-place_add_text">{{$t('i18n.taskAddPlace')}}</span>
      </div>
      <!--Button组件-->
      <flow_button :buttondata="buttonConfig" v-show="!isDeletePlace"></flow_button>
    </div>
    <tencentMap
      v-if="showMap"
      :pos="field.value"
      :type="type"
      @positionData="setValue"
      @closeMap="close"></tencentMap>
  </div>
</template>

<script>
  import tencentMap from '@/components/add/tencentMap';
  import flow_button from '@/components/button/flow_button';
  import { taskAddPlace,taskGetPlace,liveUpdateTask } from '../../api/getData';

  export default {
    props:{
      'placeShow':{
        type:Boolean,
      },
      taskAddress:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data(){
      return{
        showMap:false,
        showPlaceBox:false,
        selectName:{
          address:this.$t('i18n.taskPlaceDefault'),
          latitude:'',
          longitude:'',
        },
        isDeletePlace:false,
        type:'getPosition',
        field:{
          value:this.taskAddress
        },
        taskPlace:this.$t('i18n.taskPlaceDefault'),
        taskPlaceList:[],
        placeBoxHeight:null,
        buttonConfig:{ //操作按钮
          primaryList:[
            {
              type:"primary",
              name:'确定',
              callBack:null
            },
          ],
          defaultList:[
            {
              type:"default",
              name:'取消',
              callBack:null
            }
          ],
          class:"active"//按钮是否置底部 active :底部、"":相对定位
        },
        addResponsibleClass:'',
        isShow:false,
        placeData:{},
        delStrArr:[],
        addPlaceList:[],
      }
    },
    methods:{
      showPlaceBoxList(){
        if (!this.hasPermission){
          return false;
        }
        this.delStrArr = [];
        this.addPlaceList = [];
        var isChange = window.sessionStorage.getItem('isChange');
        if(isChange!='true'){
          taskGetPlace((data)=>{
            window.sessionStorage.setItem('isChange',true);
            data.addressPOList.forEach((item,index)=>{
              item['isActive'] = false;
              if (this.$store.getters.isDetailPage){
                if (this.taskAddress.latitude == item.latitude && this.taskAddress.longitude == item.longitude){
                  item['isActive'] = true;
                  this.selectName['address'] = item.address;
                }
              }else {
                if(index==0){
                  item['isActive'] = true;
                  this.selectName['address'] = item.address;
                }
              }
            });
            this.taskPlaceList = data.addressPOList;
          });
        }
        this.showPlaceBox = true;
      },
      showTentMap(){
        this.showMap = true;
      },
      setValue(data){
        if(data.value&&data.value!=''){
          this.taskPlaceList.forEach(function(placeItem){
            placeItem['isActive'] = false;
          });
          this.taskPlaceList.push({
            address:data.value,
            latitude:data.latitude,
            longitude:data.longitude,
            isActive:true,
          });
          this.selectName['address'] = data.value;
          this.selectName['latitude'] = data.latitude;
          this.selectName['longitude'] = data.longitude;
        }
      },
      close(){
        this.showMap = false;
      },
      closePlaceBox(){
        if(!this.$store.getters.placeDisplay){
          this.$emit('listenToChild','hide');
        }
        this.showPlaceBox = false;
      },
      selectPlace(){
        let self = this;
        this.taskPlace = this.selectName['address'];
        this.$emit('listenToChild',this.selectName);
        if (this.$store.getters.isDetailPage && this.taskAddress.value != this.selectName.address){
          let params = {};
          let flag = this.$store.getters.placeDisplay ? 61 : 60;
          let address = this.selectName.address;
          let latitude = this.selectName.latitude;
          let longitude = this.selectName.longitude;
          if (this.selectName.address == this.$t('i18n.taskPlaceDefault')){
            address = '';
            latitude = '';
            longitude = '';
            flag = 62;
          }
          params['tbQyTaskPO.taskId'] = this.$store.getters.taskId;
          params['tbQyTaskPO.accessAddress'] = address;// 地点
          params['tbQyTaskPO.latitude'] = latitude;// 纬度
          params['tbQyTaskPO.longitude'] = longitude;// 经度
          params['operationFlag'] = flag;
          liveUpdateTask(params,function (result) {
            self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
          });
        }
        this.$store.commit('mainAddContentModuleHideUpdate');
        this.$store.commit('placeDisplayUpdate');
        this.taskPlaceList.forEach((item)=>{
          if(!item.id){
            this.addPlaceList.push(item);
          }
        });
        this.placeData['taskAddressJsonStr'] = JSON.stringify({
          'taskAddress':this.addPlaceList
        });
        this.placeData['delStr'] = this.delStrArr.join(',');
        if(this.delStrArr.length>0||this.addPlaceList.length>0){
          window.sessionStorage.setItem('isChange',false);
          taskAddPlace(this.placeData,(data)=>{
            console.log(data);
          });
        }
        this.closePlaceBox();
      },
      selectRadio(index){
        this.selectName['address'] = this.taskPlaceList[index].address;
        this.selectName['latitude'] = this.taskPlaceList[index].latitude;
        this.selectName['longitude'] = this.taskPlaceList[index].longitude;
        this.taskPlaceList.forEach(function(placeItem){
          placeItem['isActive'] = false;
        });
        this.taskPlaceList[index]['isActive'] = true;
      },
      adminPlace(){
        this.isDeletePlace = !this.isDeletePlace;
      },
      deletePlace(index,item){
        this.taskPlaceList.splice(index,1);
        this.delStrArr.push(item.id);
        if(item.isActive){
          this.selectName['address'] = this.$t('i18n.taskPlaceDefault');
        }
      }
    },
    created(){
      window.sessionStorage.removeItem('isChange');
      if(this.placeShow!=undefined){
        this.addResponsibleClass = 'qwjs-place';
      }
      this.buttonConfig.defaultList[0].callBack = this.closePlaceBox;
      this.buttonConfig.primaryList[0].callBack = this.selectPlace;
      if(document.documentElement.clientHeight>0){
        this.placeBoxHeight=document.documentElement.clientHeight;
      }else{
        this.placeBoxHeight="auto";
      }

      if (this.taskAddress.value){
        this.taskPlace = this.taskAddress.value;
      }
    },
    watch:{
      placeShow(val){
        document.querySelector('.qwjs-place').click();
      },
      taskAddress(){
        this.taskPlace = this.taskAddress.value;
      }
    },
    computed:{
      placeNameWidth(){
        let w = document.documentElement.clientWidth;
        w = w>1024 ? 652 : w-88;
        return w;
      },
      hasPermission(){
        if (!this.$store.getters.isDetailPage){
          return true;
        }
        return this.$store.getters.taskLevel == 'a1' && !this.$store.getters.taskOver;
      }
    },
    components:{
      tencentMap,
      flow_button,
    }
  }
</script>

<style type="text/css">
  .qwui-flex{
    display: flex;
  }
  .qwui-place_item{
    display: flex;
    color:#0A1735;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-add_place{
    padding-left: 8px;
  }
  .qwui-place_name {
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-place_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/right.svg") no-repeat scroll left;
  }
  .qwui-place_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_place.svg") no-repeat scroll right;
  }
  .qwui-place_box{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    max-width: 740px;
    margin: 0 auto;
    background: #fff;
    z-index: 12;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 60px;
  }
  .qwui-place_title{
    display: flex;
    font-size: 13px;
    color:#7A7C80;
    height: 44px;
    line-height: 44px;
    padding:0 15px 0 14px;
    justify-content:space-between;
  }
  .qwui-place_title_right{
    color:#5585F0;
  }
  .qwui-place_title_right span{
    background: url(../../../../assets/svg/icon_a-place_location.svg) no-repeat scroll left;
    padding-left: 20px;
    padding-top: 1px;
  }
  .qwui-place_each_item{
    padding:15px 36px 15px 18px;
    color:#0A1735;
    font-size: 15px;
  }
  .qwui-place_radio{
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color:#ccc;
    margin-right: 13px;
    margin-top: 3px;
  }
  .qwui-place_radio::before{
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    border-radius: 50%;
    content: "";
  }
  .qwui-place_info{
    display: inline-block;
  }
  .qwui-place_radio.active{
    color:#2F7DCD;
  }
  .qwui-place_radio.active::before{
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 4px solid #479DE6;
    border-radius: 50%;
    content: "";
  }
  .qwui-place_add{
    display: flex;
    padding:0 15px 0 14px;
    height: 50px;
    line-height: 50px;
  }
  .qwui-place_add_left{
    width: 26px;
    margin-right: 6px;
    background: url("../../../../assets/svg/icon_a-newtask-list_add.svg") no-repeat scroll left;
  }
  .qwui-place_add_text{
    color:#648EEC;
    font-size: 15px;
  }
  .qwui-place_delete{
    width: 22px;
    margin-top:1px;
    padding-right: 9px;
    background: url("../../../../assets/svg/icon_a-enclosure-list_delete.svg") no-repeat scroll left top;
  }
</style>
