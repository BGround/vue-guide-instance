<template>
  <div class="level-setting">
    <func-box v-if="visible" boxTitle="评定规则" boxWidth=744  @firstFunc="save" firstBtn='确定' secondBtn='' @closeBox="toggleDialog" :footerSpaceBetween="true" >
      <div class="level-setting-container">
        <div class="level-content">
          <div class="content-head">
            <span class="meta-show">显示</span>
            <span class="meta-content">内容</span>
            <span class="meta-score">等级分数<i>(须输入0~100范围内的整数)</i></span>
          </div>
          <div class="content-middle">
            <div class="content-item" v-for="(item, index) in copy_level_data" :key="index">
              <div class="item-isshow">
                <qwui-checkbox v-model="item.display" @change="changeDisplay(item)"></qwui-checkbox>
              </div>
              <div class="item-name">
                <qwui-input class="name-input" inputType="text" :maxLength="8" v-model="item.name"></qwui-input>
              </div>
              <div class="item-range">
                <qwui-input class="form-range" inputType="sort" v-model="item.minVal"></qwui-input>
                <i>~</i>
                <qwui-input class="form-range" inputType="sort" v-model="item.maxVal" ></qwui-input>
                <span class="range-opt">
                  <!-- <img class="opt-img" src="~assets/images/icon_delete.png" alt="" @click="deleteItem(item, index)"> -->
                  <i class="opt-img"  @click="deleteItem(item, index)"></i>
                </span>
              </div>
            </div>
            <div class="add-range" @click="addItem()">
              添加客户级别
            </div>
          </div>
        </div>
      </div>
    </func-box>
  </div>
</template>

<script>
import funcBox from '@/components/list/funcBox';
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
export default {
  name: 'levelSetting',
  data() {
    return {
      visible: false,
      copy_level_data: [],
    }
  },
  props: {
    value: Boolean,
    level_data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    qwuiCheckbox,
    qwuiInput,
    funcBox
  },
  methods: {
    // 保存设置
    save() {
      // 0 到 100 正则表达式
      const re=/^(?:[1-9]?\d|100)$/;
      for(let i = 0 ; i < this.copy_level_data.length; i ++) {
        if(this.copy_level_data[i].display) {
          // 显示的区间分数必填校验
          if (this.checkValue(this.copy_level_data[i].name) || this.checkValue(this.copy_level_data[i].maxVal) || this.checkValue(this.copy_level_data[i].minVal)) {
            dataBase.top_alert('显示的等级必须填写完整信息',false,2000);
            return ;
          }
          // 只能输入0到100的数字
          if (!re.test(this.copy_level_data[i].minVal) || !re.test(this.copy_level_data[i].maxVal)) {
            dataBase.top_alert('须输入0~100范围内的整数',false,2000);
            return ;
          }
          // 区间从小到大校验
          if (parseInt(this.copy_level_data[i].minVal) >= parseInt(this.copy_level_data[i].maxVal)) {
            dataBase.top_alert('请从小到大输入分数范围',false,2000);
            return ;
          }
          
        }
      }
      this.$emit("on-save", this.copy_level_data);
    },
    // 是否显示
    changeDisplay(item) {
      this.$set(item, 'display', item.display ? 1 : 0);
    },
    checkValue(value) {
      if (value === 0) {
        return false;
      }
      if (!value || value.trim() === '') {
        return true;
      }
    },
    // 点击 删除 图标
    deleteItem(item, index) {
      const arr = this.copy_level_data;
      arr.splice(index , 1);
      this.copy_level_data = arr;
    },
    // 点击 添加 图标
    addItem() {
      if (this.copy_level_data.length === 10) {
        dataBase.top_alert('最多设置10个等级',false,2000);
        return ;
      }
      const obj = {
        itemId: "",
        name: "",
        minVal: "",
        maxVal: "",
        display: ""
      };
      this.copy_level_data.push(obj);
    },
    // 深克隆对象/数组
    deepClone(obj){
      return JSON.parse(JSON.stringify(obj))
    },
    // 打开/关闭 评定规则
    toggleDialog(data){
        this.visible = !this.visible;
    },
    // 数据格式化
    formatData(data) {
      let arr = data.filter(item => {
        item.display = parseInt(item.display);
        return item;
      });
      return arr;
    }
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    visible(val) {
      this.$emit("input", val);
      // 每次重新打开都以页面现有标签数据为准
      if (this.visible) {
        this.copy_level_data = this.formatData(this.deepClone(this.level_data));
      }
    },
    level_data(val) {
      this.copy_level_data = this.formatData(this.deepClone(this.level_data));
    }
  },
}
</script>

<style lang="scss" scoped>
.level-setting {
  & /deep/ .funcBox_main {
    background: #fff;
  }
  & /deep/ .funcBox {
    max-height: 680px;
    display: flex;
    flex-direction: column;
    border-radius: 4px 4px 0px 0px;
    .funcBox_header {
      min-height: 60px;
      padding-left: 0;
      height:60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background:rgba(247,247,247,1);
      border-radius:4px 4px 0px 0px;
      .close {
        margin-bottom: 2px;
      }
      .box_title {
        width:72px;
        height:25px;
        font-size:18px;
        padding-left: 28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:25px;
      }
    }
    .funcBox_main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .funcBox_footer {
      height: 65px;
      padding: 15px 0;
      display: flex;
      justify-content: center;
      .orangeBtn {
        width: 60px;
        height: 32px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(255,255,255,1);
        padding: 0;
        background: #FF9700;
      }
    }
  }
  .level-setting-container {
    background: #fff;
    width: 744px;
    .level-discription {
      margin-left: 51px;
      margin-top: 38px;
      margin-bottom: 20px;
      text-align: left;
      .discription {
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(166,166,166,1);
        line-height:20px;
      }
    }
    .level-content {
      margin-top: 38px;
      margin-left: 51px;
      .content-head {
        text-align: left;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        height:19px;
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(56,56,56,1);
        line-height:20px;
        .meta-show {
          margin-right: 35px;
        }
        .meta-content {
          width:56px;
          margin-right: 321px;
        }
        .meta-score {
          & > i {
            font-size:12px;
            color:rgba(153,153,153,1);
            line-height:17px;
            padding-left: 2px;
          }
        }

      }
      .content-middle {
        display: flex;
        flex-direction: column;
        .content-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          .item-isshow {
            display: flex;
            margin-bottom: 4px;
            margin-right: 36px;
          }
          .item-name {
            margin-right: 36px;
            .name-input {
              height: 32px;
            }
          }
          .item-range {
            display: flex;
            align-items: center;
            i {
              width:12px;
              height:17px;
              font-size:12px;
              margin: 0 4px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(153,153,153,1);
              line-height:17px;
            }
            .form-range{
              width: 46px;
              display: inline-block;
              & /deep/ .qw_input.qw_sortInput{        
                  width: 100%;
                  text-align: center;
              }
            }
            .range-input {
              width: 46px;
              height: 28px;
              background:rgba(255,255,255,1);
              border-radius:2px;
              border:1px solid #d5d5d5;
              text-indent: 10px;
            }
            .range-opt {
              margin-left: 16px;
              .opt-img {
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url('~assets/images/ic_delete.png') no-repeat center;
                background-size: contain;
                cursor: pointer;
              }
            }
          }
        }
        .add-range {
          cursor: pointer;
          font-size: 14px;
          color: #F87B00;
          margin-bottom: 160px;
          text-align: left;
          margin-left: 60px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
::-webkit-scrollbar-thumb {
  background: rgba(215,215,215,1);
  border-radius: 3px;
  width: 6px;
}
</style>





