<template>
  <div class="qwui-menuWrap">
    <li>
      <span @click="toggle" :class="isFolder?'':'noFolder'" :title="model.nodeName">
        <i v-if="isFolder" :class="isFolder?'isFolder':''"></i>
        <i :class="!loading?'icon':'loading'"></i>
        {{model.nodeName}}
      </span>
      <ul class="qwui-treeMenu" v-if="isFolder" v-show="model.loadingShow">
        <item class="item" v-for="(model,idx) in model.children" :key="idx" :model="model"></item>
      </ul>
    </li>
  </div>
</template>

<script>
//一进页面要显示 true
//点击切换显示和隐藏
//点击加载，loading显示，架构图标隐藏
//加载完成，loading隐藏，架构图标显示
//没有子级菜单的
import http from "../../api/index";
import { mapMutations } from "vuex";

export default {
  name: "item",
  props: {
    model: Object
  },
  data() {
    return {
      currentNode: "",
      childrenNode: "",
      loading: false
    };
  },
  computed: {
    isFolder: function() {
      return this.model.hasChildrent;
    }
  },
  methods: {
    ...mapMutations("scoreStatistics", ["SET_CURRENTNODE"]),
    toggle() {
      this.currentNode = this.model;
      this._getDepartmentAction();
      this.$set(this.model, "loadingShow", !this.model.loadingShow);
      if(this.model.loadingShow && this.currentNode.hasChildrent>0){
        this.loading = true;
      }
      this.SET_CURRENTNODE(this.model);
    },
    addChild(children) {
      this.$set(this.model, "children", children.orgList);
    },
    //获取子级部门
    _getDepartmentAction() {
      return http.getDepartmentAction(
        {
          nodeId: this.currentNode.nodeId
        },
        data => {
         this.loading = false;
          if (this.currentNode.hasChildrent > 0) {
            this.childrenNode = data;
            this.addChild(this.childrenNode);
          }
        }
      );
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.qwui-menuWrap {
  width: 100%;
  li {
    span {
      cursor: pointer;
      display: inline-block;
      width: 170px;
      line-height: 20px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
      padding-left: 22px;
      margin-left: 2px;
      background: url(~assets/images/dept_icon01.png) no-repeat left;
    }
  }
  .qwui-treeMenu {
    list-style: none;
    padding-left: 15px;
    li {
      overflow-x: hidden;
      position: relative;
      color: #666;
      /deep/span {
        cursor: pointer;
        display: inline-block;
        width: 130px;
        padding: 5px 0px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        background: none;
        .isFolder {
          width: 10px;
          height: 10px;
          display: inline-block;
          background: url(~assets/images/arrow_d.png) no-repeat left;
        }

        .icon {
          padding: 1px 14px;
          background: url(~assets/images/dept_icon.png) no-repeat left;
        }
       /deep/ .loading {
         padding:9px;
          background: url(~assets/images/loading.gif);
          background-size: 18px;
          background-repeat: no-repeat;
          background-position: left center;
        }
      }
      /deep/ .noFolder {
        padding-left: 14px;
      }

      .qwui-menuWrap {
        padding-left: 5px;
      }
    }
  }
}
.qwui-treeMenu li span:hover {
  background-color: #f5f5f5;

  & .qwui-a_more {
    display: inline-block;
  }
}
</style>
