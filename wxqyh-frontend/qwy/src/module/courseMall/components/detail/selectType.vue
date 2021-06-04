<template>
	<div class="pop-warp" v-show='selectedtype.isShow'>
    <div class="pop-tit">移动到<i @click="closePop">×</i></div>
    <div class="pop-main">
        <ul class="select_list">
        	<li v-for="item in typeData" @click.stop="selectCategory(item,item.category)">
        		<div class="jstree-wholerow" :class="{sel:item.id==selectedId}">&nbsp;</div>
        		<div class="listInfo">
        			<i :class="{'arrow-down':!item.isShow,'arrow-right':item.isShow}" v-if="item.subCategoryList.length!=0"></i>
        			<em class="ic_file"></em>
        			<span>{{item.category}}</span>
        		</div>
        		<ul class="pl20" v-show="item.isShow">
        			<li v-for="item_c in item.subCategoryList" @click.stop="selectCategory(item_c,item.category,item_c.category)">
        				<div class="jstree-wholerow" :class="{sel:item_c.id==selectedId}">&nbsp;</div>
        				<div class="listInfo">
        					<em class="ic_file"></em>
        					<span>{{item_c.category}}</span>
        				</div>
        			</li>
        		</ul>
        	</li>
        </ul>
    </div>
    <div class="pop-btn mt0"><input type="button" value="确定" class="btn orangeBtn mr10" @click="confirm"></div>
</div>
</template>

<script>
	export default{
		name:'selectType',
		props:["typeData","selectedtype"],
    data(){
      return {
        selected:{
          id:'',
          name:''
        }
      }
    },
    computed:{
      "selectedId":function(){
        if(!this.selectedtype.isShow){
          this.selected.id = this.selectedtype.id
          return this.selectedtype.id
        }
        return this.selected.id
      }
    },
		created:function(){
			//console.log(this.typeData)
      this.selected.id=this.selectedtype.id;
      this.selected.name=this.selectedtype.name;
		},
		methods:{
			"selectCategory":function(obj,f_name,s_name){
			    if(obj.isShow){
			    	obj.isShow = false;
			    }else{
			    	obj.isShow = true;
			    }
          this.selected.id = obj.id;
          this.selected.name = f_name;
          if(s_name){
            this.selected.name += " > "+s_name
          }
			    if(!s_name){
			        /*$(".jstree-wholerow").removeClass("hover");
			        $(".jstree-wholerow").removeClass("sel");
			        $(obj).children(".jstree-wholerow").addClass("hover");
			        $(obj).children(".jstree-wholerow").addClass("sel");*/
			    }
			},
      "closePop":function(){
        this.selectedtype.isShow=false;
        dataBase.mask=false;
      },
      "confirm":function(){
        this.closePop();
        this.selectedtype.id=this.selected.id;
        this.selectedtype.name=this.selected.name;
      },
		}
	}
</script>

<style>
.pop-warp{
  position:fixed;
  z-index: 101;
  width:600px;
  top:50%;
  left:50%;
  margin-left:-300px;
  margin-top:-211px;
  border-radius: 2px;
  background:#fbfbfb;
  overflow: hidden;
}
.pop-tit {
    background: #ececec;
    color: #333;
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    position: relative;
    text-align: left;
    border-bottom: 1px solid #dddddd;
}
.pop-tit i {
    cursor: pointer;
    font-style: normal;
    position: absolute;
    right: 0;
    width: 50px;
    text-align: center;
    color: #bbb;
    font-size: 28px;
}
.pop-btn {
    text-align: center;
    background: #ececec;
    padding: 10px;
}
.pop-main{
  border-radius: 2px;
  border:1px solid #dddddd;
  margin:10px 20px 0;
  width:560px;
}
.pop-tip{
  text-align: center;
  color:#ff3333;
  line-height: 28px;
}
.pop-main .select_list{
  line-height:30px;
  height:290px;
  margin-top:10px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
.pop-main .arrow-down{
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 8px solid #999;
}
.pop-main .arrow-right{
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #999;
}
.pop-main .select_list li i {
  width: 0;
  height: 0;
  display: inline-block;
  position: absolute;
  left: 20px;
  top: 12px;
}
.pop-main .select_list li .ic_file{
  display: inline-block;
  width: 24px;
  height:24px;
  margin-right: 5px;
  vertical-align: middle;
  background: url(../../../../assets/images/ic_file_24.png)
}
.pop-main .listInfo{
  padding-left: 35px;
  cursor: pointer;
  position: relative;
  width: auto;
}
.pop-main .select_list li .jstree-wholerow {
  width: 100%;
  cursor: pointer;
  position: absolute;
  left: 0;
  height: 30px;
}
.pop-main .select_list li .jstree-wholerow.hover {
  background:#ececec;
}
.pop-main .select_list li .jstree-wholerow.sel {
  background:#ddd;
}
</style>
