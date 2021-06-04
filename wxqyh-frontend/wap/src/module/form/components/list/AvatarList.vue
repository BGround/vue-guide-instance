<template>
	<div class="qwui-cardList">
		<router-link
			v-for="(item,index) in list"
			:key="item.id"
			@click.native="setPagerNum(index)"
			tag="div"
      :to="item.status==1 ? {name: 'detail', query: { id: item.id}} : {name: 'add', query: { id: item.id,type:'edit'}}"
			class="qwui-cardList_item flexbox"
    >
			<div class="qwui-cardList_img">
				<img
					:src="item.headPic"
					@error="noFind">
			</div>
			<div class="flexItem">
        <div class="list-title ">
          <h3>{{item.instanceTitle}}</h3>
          <span class="entrust-status" v-if="item.entrust">委托</span>
        </div>
				<p class="list-info">
          <span>{{isTask(item.isTask)}}</span><span>·</span><span>{{timeStr(item.createaTime)}}</span><span class="spn" v-if="showPersonName">{{item.personName}}</span>
        </p>
				<p class="list-status"
          v-if="showStatusInfo && status(item)!=''"
          :class="status(item).style"
        >
          {{status(item).text}} <span v-if="showCurrtNode(item)">: {{item.currentNode}}</span>
        </p>
			</div>
      <div class="options" v-if="showOption">
        <i class="qwui-icon-operate showActionSheet" @click.stop.prevent="initOption(item, index)"></i>
      </div>
		</router-link>
	</div>
</template>

<script>
import { mixinList } from "./list";

export default {
  mixins: [mixinList],
  props: {
    list: {
      type: Array,
      default: []
    },
    showOption: {
      type: Boolean,
      default: false
    },
    showStatusInfo: {
      type: Boolean,
      default: false
    },
    showPersonName: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    initOption(item, index) {
      this.$emit("initOption", item, index);
    },
    showCurrtNode(item) {
      return item.isover == 2 && item.currentNode;
    },
    status({isTask, isClose, isover}) {
      // 表单显示状态
      if (isTask == 2 || isTask == 3) {
        if (isover == "-1") {
          return { text: "已关闭", style: "form-close" };
        } else if (isover == "0") {
          return { text: "退审", style: "form-back" };
        }
        if (isClose == "1") {
          return { text: "已审批", style: "form-audited" };
        } else {
          return { text: "审批中", style: "form-audit" };
        }
      } else if (isTask == 1) {
        if (isover == "-1") {
          return { text: "已关闭", style: "form-close" };
        } else {
          return { text: "未关闭", style: "form-audit" };
        }
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$baseURL: "../../../../assets/images/";
.qwui-cardList {
  position: relative;
  padding-left: 0;
  background-color: #fff;
}
.qwui-cardList_item {
  position: relative;
  padding: 15px 45px 15px 15px;
  cursor: pointer;
  &::before {
    transform: initial;
    border-bottom-color: #f7f8fa;
  }
  &:active {
    background: #F7F8FA;
  }
}
.qwui-icon-operate {
  position: absolute;
  top: 0;
  right: 0;
  width: 45px;
  height: 100%;
  background: url($baseURL+"icon_more.png") no-repeat center;
  background-size: 3px;
}
.qwui-cardList_item img {
  width: 32px;
  height: 32px;
  margin-top: 4px;
  border-radius: 50%;
}
.flexbox {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.qwui-cardList_img {
  margin-right: 10px;
  height: 40px;
  width: auto !important;
}
.qwui-cardList .list-info {
  height: 18px;
  font-size: 13px;
  font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
  font-weight: 400;
  color: rgba(178, 185, 200, 1);
  line-height: 18px;
  margin: 2px 0 0 0;
}
.qwui-cardList .list-info > span {
  margin-right: 0.4em;
  &.spn {
    margin-left: 8px;
  }
}
.list-status {
  height: 18px;
  font-size: 13px;
  font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
  font-weight: 400;
  line-height: 18px;
  margin-top: 4px;
  &.form-close {
    color: #7a7c80;
  }
  &.form-audit {
    color: #5585f0;
  }
  &.form-audited {
    color: #1cc888;
  }
  &.form-back {
    color: #ff586d;
  }
}
.list-title{
  display: flex;
}
.entrust-status{
  margin-top: 1px;
  margin-left: 10px;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
  font-size: 12px;
  height: 18px;
  color: #5585F0;
  background: rgba(85,133,240,0.1);
  border-radius: 2%;
  white-space: nowrap;
}
</style>
