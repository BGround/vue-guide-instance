<template>
  <div>
    <div class="qwui-dept_item" v-for="item in message" :key="item.id">
      <div class="qwui-dept_item_inner" @click="selectThis(item.id)">
        <div class="qwui-user_select_icon" :class="{active:selectdata.idStr.indexOf(item.id)!=-1}">
          <i></i>
        </div>
        <div :class="[type=='tag'? 'iconTag':'avator']"></div>
        <div class="title flexItem">
          <p class="name">{{item.tagName}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'groupItemTemp',
    props: ['message', 'selectdata', 'userselected','tagSelect','type'],
    data(){
      return{
        dataBase:dataBase,
        "getUserForTag":"/portal/tagAction!searchTagGroupRefPage.action",//获取标签下的人员数据，
        "getUserForGroup":"/portal/selectUserAction!getUserGroupPerson.action",//获取群组下的人员数据，
        userselectedData:null,//已选人员数据
        userselectedIdStr:null,//已选人员id字符串
        selectdataStr:null,//已选择群组集合字符串
        index:"",//当前选中群组的下标
        parameter:{
          "agentCode":dataBase.wxqyh_uploadfile.agent
        }
      }
    },
    methods: {
      //选择群组、标签
      selectThis: function (id) {
        var data = this.message;//群组列表数据
        var isCache = false;//判断是否已加载群组内人员数据
        this.userselectedData = this.userselected.data;//已选人员数据
        this.userselectedIdStr = this.userselected.idStr;//已选人员id字符串
        this.selectdataStr = this.selectdata.idStr;//已选择群组\标签集合字符串
        for(var i=0;i<data.length;i++){
          if(data[i].id==id){
            this.index = i;
            if(data[i].person){
              isCache = true;
            }
            break;
          }
        }
        //没有群组人员缓存数据
        if(!isCache){
          var url = '';
          if(this.type=="tag"){
            url = this.getUserForTag;
            delete this.parameter.groupId;
            this.parameter.tagId=id;
          }else{
            url = this.getUserForGroup;
            delete this.parameter.tagId;
            this.parameter.groupId=id;
          }

          this.dataRequest(url,this.parameter,this.type,false);
        }else{
          var userList = data[this.index].person;
          if(userList.length>0){
            if(this.selectdataStr.indexOf(id)!=-1){
              this.selectdataStr = this.selectdataStr.replace(id+"|","");

              //真标签，emit给父组件处理
              if(this.type == 'tag' && this.tagSelect){
                this.$emit('handleTagSelect',id,this.index)
              } else{
                delete this.selectdata.data[id];
                for(var i=0;i<userList.length;i++){
                  var personId = userList[i].userId;
                  this.userselectedIdStr = this.userselectedIdStr.replace(personId+"|","");
                  for(var t = 0;t<this.userselectedData.length;t++){
                    if(this.userselectedData[t].userId==personId){
                      this.userselectedData.splice(t,1);
                    }
                  }
                }
              }
            }else{
              this.selectdataStr+=id+"|";

              //真标签，emit给父组件处理
              if(this.type == 'tag' && this.tagSelect){
                this.$emit('handleTagSelect',id,this.index)
              }else{
                this.selectdata.data[id]=data[this.index];
                if(this.userselectedData.length!=0){
                  for(var i=0;i<userList.length;i++){
                    if(this.userselectedIdStr.indexOf(userList[i].userId)==-1){
                      this.userselectedData.push(userList[i]);
                      this.userselectedIdStr+=userList[i].userId+"|";
                    }
                  }
                }else{
                  for(var i=0;i<userList.length;i++){
                    this.userselectedData.push(userList[i]);
                    this.userselectedIdStr+=userList[i].userId+"|";
                  }
                }
              }
            }

            this.userselected.idStr = this.userselectedIdStr;
            this.selectdata.idStr = this.selectdataStr;

          }else{
            _.alert('i18n.notice','i18n.noContact')
          }
        }
      },
      showSelectData:function(userList,type){
        if(type=="tag"){
          userList=userList.list;
        }else{
          userList = userList.pageData;
        }
        if(userList && userList.length>0){
          this.message[this.index].person=userList;
          this.message[this.index].idStr='';
          if(type=="tag" ){
            this.selectdataStr+=this.parameter.tagId+"|";
            !this.tagSelect ? this.selectdata.data[this.parameter.tagId]=this.message[this.index] : '';
          } else{
            this.selectdataStr+=this.parameter.groupId+"|";
            this.selectdata.data[this.parameter.groupId]=this.message[this.index];
          }

          for(var i=0;i<userList.length;i++){
            //群组\标签内人员id拼接字符串
            this.message[this.index].idStr+=userList[i].userId+"|";
            if(this.userselectedData.length!=0){
              if(!this.tagSelect && this.userselectedIdStr.indexOf(userList[i].userId)==-1){
                this.userselectedData.push(userList[i]);
                this.userselectedIdStr+=userList[i].userId+"|";
              }
            } else{
              if(!this.tagSelect){
                this.userselectedData.push(userList[i]);
                this.userselectedIdStr+=userList[i].userId+"|";
              }
            }
          }
          //真标签，emit给父组件处理
          if(this.tagSelect){
            this.$emit('handleTagSelect',this.parameter.tagId,this.index)
          }
          this.userselected.idStr = this.userselectedIdStr;
          this.selectdata.idStr = this.selectdataStr;

        }else{
          _.alert('i18n.notice','i18n.noContact')
        }
      },
      dataRequest: function (url, data, type, async) {
        var self = this
        var asyncs = async == false ? false : true;
        var list = null;
        _.ajax({
          url: _.baseURL + url,
          type: "post",
          data: data,
          dataType: "json",
          async: asyncs,
          success: function (result) {
            if ("0" == result.code) {
              list = result.data;
              self.showSelectData(list,type);
            } else {
              _.alert('i18n.notice', result.desc);
            }
          }
        });
        return list;
      }
    }
  }
</script>

