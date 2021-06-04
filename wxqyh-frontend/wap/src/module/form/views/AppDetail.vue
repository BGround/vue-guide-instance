<template>
  <div class="wrapper">
    <router-link :to="{name: 'search', query: {range: 'appdetail', tips: '搜索表单', id: $route.query.id}}" class="detail-search-wrap">
      <simple-search></simple-search>
    </router-link>
    <div class="formlist">
      <div class="list-wrapper">
        <div class="list-group" v-for="group in list" :key="group.id">
          <p class="group-title" @click="showChildList(group)" :class="{'active': group.isOpen}">
            <i class="icon-ellapse"></i> 
            {{group.name}}
          </p>
          <ul v-show="group.isOpen" class="list-box">
            <li v-for="item in group.child" :key="item.definitionVersionsId">
              <form-item :listItem="item"></form-item>
            </li>
          </ul>
        </div>
        <form-item :listItem="item" v-for="(item, index) in defaultType" :key="index"></form-item>
      </div>
      <p class="list-length" v-show="!showrecord">共{{formList.length}}个表单</p>
    </div>
  </div>
</template>

<script>
import FormItem from "../components/list/FormItem"
import NoRecord from "../components/base/no_record"
import SimpleSearch from "../components/base/newBase/SimpleSearch"
import { initGroupForm } from "../api/list";

export default {
  name: "formlist",
  components: {
    FormItem,
    NoRecord,
    SimpleSearch
  },
  data() {
    return {
      styleElem: null,
      isLoading: true,
      navList: {
        index: 0,
        nav: [
          {content: '表单', type: 'form', callback: null}
        ]
      },
      hasRecord: {
        "show": true,
        "setTop": false,
        "icon": '',
        "title": '暂无数据',
        "text": ''
      },
      formList: [],
      typeId: '',
      typeList: [],
      list: [],
      defaultType: [],
      openList: [],
      isSearching: false
    };
  },
  created() {
    var _this = this;
    this.typeId = this.$route.query.id;
    this.navList.nav[0].callback = this.searchFun();
    this.initList();
  },
  mounted() {
    let cssString = 'body,html,#app {height: 100%;}'
    this.styleElem = document.createElement("style");
    this.styleElem.setAttribute("type", "text/css");
 
    if(this.styleElem.styleSheet){// IE
      this.styleElem.styleSheet.cssText = cssString;
    } else {// w3c
      var cssText = document.createTextNode(cssString);
      this.styleElem.appendChild(cssText);
    }
  
    var heads = document.getElementsByTagName("head");
    if(heads.length)
      heads[0].appendChild(this.styleElem);
    else
      document.documentElement.appendChild(this.styleElem);
  },
  computed: {
    showrecord() {
      this.list = this.list || [];
      return this.list.length == 0 && this.defaultType.length == 0 ? true : false;
    }
  },
  methods: {
    initList() {
      var _this = this;
      this.openList = JSON.parse(localStorage.getItem('open_status' + this.typeId)) || [];
      _.showLoading();
      initGroupForm(this.typeId).then(res => {
        _this.setList(res);
      });
    },
    setList(res) {
      _.hideLoading();
      if (res.code != "0") {
        return _.alert("提示", res.desc);
      }
      this.typeList = res.data.formTypeData;
      this.formList = res.data.formData;
      if(this.isLoading) this.isLoading = false;
      if(this.typeList.length == 0) this.defaultType = this.formList;
      else this.list = this.classify();
    },
    showChildList(group) {
      group.isOpen = !group.isOpen;
    },
    classify() {
      let list = [];
      let copyFormList = [].concat(this.formList);
      let copyArr = [];
      for(let i = 0; i < this.typeList.length; i++) {
        let isOpen = false;
        this.openList.forEach(item => {
          if(item.id == this.typeList[i].id) isOpen = true;
        })
        list.push({'name': this.typeList[i].typeName, 'id': this.typeList[i].id, 'isOpen': isOpen, 'child': []});
        copyArr = [].concat(copyFormList);
        let k = 0;
        for(let j = 0; j < copyFormList.length; j++) {
          if(copyFormList[j].typeId == list[i].id) {
            list[i].child.push(copyFormList[j]);
            copyArr.splice(k, 1);
          }else {
            k ++
          }

        }
        copyFormList = copyArr;
      }
      this.defaultType = copyArr;
      return list;
    },
    searchFun() {
      let _this = this;
      return function(str) {
        let res = _this.formList.filter(item => {
          return item.formName.indexOf(str) != -1;
        });
        return res;
      }
    },
    cancelSearch() {
      this.isShowSearch = false;
    }
  },
  beforeDestroy() {
    //组件销毁前展开状态
    this.isLoading = true;
    let open = this.list.filter(item => {
      return item.isOpen;
    });
    localStorage.setItem('open_status' + this.typeId, JSON.stringify(open));
    this.styleElem.remove();
    this.styleElem = null;
  }
};
</script>

<style lang="scss" scoped>
@mixin fontStyle {
  font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
}
.wrapper {
  min-height: 100%;
  background: #F7F7F7;
  display: flex;
  flex-direction: column;
  z-index: 20;
}
.search-box-wrap {
  display: flex;
  flex-direction: column;
  background: #fff;
  .search-box {
    .search-high {
      height: 52px;
    }
    .search-item {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      .search-input-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        border-radius: 4px;
        background: #f4f6f8;
        font-size: 14px;
        color: #0A1735;
        .s-tosearch {
          width: 16px;
          height: 16px;
          background: url(~assets/images/ic_search.png) no-repeat;
          background-size: cover;
          margin-right: 4px;
        }
      }
    }
  }
}
.formlist {
  padding-top: 52px;
  .list-wrapper {
    background: #fff;
    .list-group {
      margin-bottom: 8px;
      .group-title {
        height: 44px;
        line-height: 44px;
        padding: 0 14px;
        text-align: left;
        font-size: 16px;
        @include fontStyle;
        font-weight: 400;
        color: rgba(10, 23, 53, 1);
        background: #fff;
        position: relative;
        &:active {
          background: #F7F8FA;
        }
        &.active::after {
          display: block;
          height: 1px;
          background: #F7F8FA;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        &.active > .icon-ellapse {
          transform: rotate3d(0,0,1,90deg);
        }
        .icon-ellapse {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 8px 0 0;
          background-image: url(../assets/images/icon_a-common_arrowright@2x.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          transition: transform 0.3s ease;
        }
      }
      .list-box {
        padding-left: 36px;
        background: #fff;
      }
    }
  }
  .list-length {
    line-height: 44px;
    text-align: center;
    font-size: 12px;
    color: #B2B9C8;
  }
}
.detail-search-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  @media screen and (min-width: 1024px) {
    width: 740px;
    margin: auto;
  }
  width: 100%;
  z-index: 10;
}
</style>
