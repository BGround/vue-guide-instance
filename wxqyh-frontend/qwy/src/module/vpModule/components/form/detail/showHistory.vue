<template>
	<div class="qwui-history-mark" @click="close">
		<div class="history-box" @click.stop="">
			<div class="history-title">
				[{{history.title}}]的修改轨迹
			</div>
      <div class="history-content">
         <!--图片-->
          <template v-if="upUriArr">
            <p v-for="(item,index) in upUriArr">
              {{item.creatorName}}:上传了
              <template v-for="(item1,index1) in item.name">
                [{{item1}}]
              </template>
              <span class="create-time">{{item.createTime}}</span>
            <p/>
          </template>
          <template v-if="deleteUriArr">
            <p v-for="(item,index) in deleteUriArr">
              {{item.creatorName}}:删除了
              <template v-for="(item1,index1) in item.name">
                [{{item1}}]
              </template>
              <span class="create-time">{{item.createTime}}</span>
            </p>
          </template><!--图片 end-->
         <!--附件-->
          <template  v-if="upStrArr">
            <p v-for="(item,index) in upStrArr">
              {{item.creatorName}}:上传了
              <template v-for="(item1,index1) in item.name">
                <a>{{item1}}</a>
              </template>
              <span class="create-time">{{item.createTime}}</span>
            </p>
          </template>
          <template  v-if="deleteStrArr">
            <p v-for="(item,index) in deleteStrArr" >
              {{item.creatorName}}:删除了
              <template v-for="(item1,index1) in item.name">
               {{item1}}
              </template>
              <span class="create-time">{{item.createTime}}</span>
            </p>
          </template><!--附件 end-->
        <!--其他字段-->
        <div v-for="item in historyList"
                  :key="item.id">
          <template v-if="!(item.itemType=='ImageField'||item.itemType=='AccessoryField')">
            <p>{{item.creatorName}}将[{{item.oldValue}}]修改成[{{item.newValue}}]</p>
            <span>{{item.createTime}}</span>
          </template>
        </div>
      </div>
		</div>
	</div>
</template>
<script>
	export default{
		props:['history'],
    data(){
		  return {
        upUriArr:[],//修改上传的图片
        deleteUriArr:[],//修改删除的图片
        upStrArr:[],  //修改 上传的附件
        deleteStrArr:[], //修改删除的附件
      }
    },
		computed:{
			historyList(){
				return this.history.eachOrbitList;
			}
		},
    created(){
		  this.showOrbitList();
    },
		methods:{
			close(){
				this.$emit('closeHistory')
			},
      showOrbitList:function (){
			  var historyList=this.history.eachOrbitList;
			  var _this=this;
        historyList.forEach(function(val,index) {
          if(val.itemType=='ImageField'){
            var _value = val.newValue;
            var value = _value.substring(1, _value.length - 1);//[]|[]
            if(value.indexOf("|")!=-1){//新轨迹处理
              var uploadAndDelete = value.split("|");//得到上传与删除的url
              var uploadUris = uploadAndDelete[0];
              if(uploadUris.length>2){
                var valueUri = uploadUris.substring(1, uploadUris.length - 1);
                var newArr=valueUri.split(",");
                var name=[];
                newArr.forEach(function(item,index){
                  name.push(_.compressURL + item.trim());
                });
                _this.upUriArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
              }
              var deleteUris = uploadAndDelete[1];
              if(deleteUris.length>2){
                var valueUri = deleteUris.substring(1, deleteUris.length - 1);
                var newArr=valueUri.split(",");
                var name=[];
                newArr.forEach(function(item,index){
                  name.push(_.compressURL + item.trim());
                });
                _this.deleteUriArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
              }
            }else{//兼容以前的轨迹
              var valueUri = value.substring(1, value.length - 1);
              var  newArr= newArr=valueUri.split(",");
              var name=[];
              newArr.forEach(function(item,index){
                name.push(_.compressURL + item.trim());
              });
              _this.upUriArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
            }
          }else if(val.itemType=='AccessoryField'){
            var _value = val.newValue;
            var value = _value.substring(1, _value.length - 1);
            if(value.indexOf("|")!=-1) {
              var uploadAndDelete = value.split("|");
              var uploadUris = uploadAndDelete[0];
              if (uploadUris.length > 2) {
                var valueUri = uploadUris.substring(1, uploadUris.length - 1);
                var newArr=valueUri.split(",");
                var name=[];
                newArr.forEach(function(item,index){
                  name.push(item.split(":")[2]);
                });
                _this.upStrArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
              }
              var deleteUris = uploadAndDelete[1];
              if (deleteUris.length > 2) {
                var valueUri = deleteUris.substring(1, deleteUris.length - 1);
                var newArr=valueUri.split(",");
                var name=[];
                newArr.forEach(function(item,index){
                  name.push(item.split(":")[2]);
                });
                _this.deleteStrArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
              }
            }else{//兼容以前的轨迹
              var valueUri = value.substring(1, value.length - 1);
              var valueUriArr = valueUri.split(",");
              for (var v = 0; v < valueUriArr.length; v++) {
                var valueStr = valueUriArr[v];
                var  newArr=valueStr.split(":");
                var name=[];
                newArr.forEach(function(item,index){
                  name.push(item.split(":")[2]);
                });
                _this.upStrArr.push({name:name,createTime:val.createTime,creatorName:val.creatorName});
              }
            }
          }
        })
      }
		}
	}
</script>
<style>
	.qwui-history-mark{
		position: fixed;
		z-index:12;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.history-box{
		position: absolute;
    max-height: 60%;
    overflow: scroll;
		z-index:15;
		top: 50%;
		left: 50%;
		right: 15px;
		padding: 10px;
		background:#fff;
		border-radius: 5px;
		opacity: 1;
		-webkit-transform: translate( -50%, -50% );
		transform: translate( -50%, -50% );
	}
	.history-title{
		min-height: 27px;
		line-height:27px;
		font-size: 15px;
		border-bottom: 1px solid #e5e5e5;
	}
	.history-content {
		margin-top: 10px;
		min-height: 27px;
		font-size: 14px;
		line-height: 20px;
    word-break: break-all;
	}
	.history-content span{
		font-size: 12px;
	}
  .create-time{
    display: block;
  }
</style>
