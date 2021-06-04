<template>
  <div class="field-content" v-if="field.status != '0'">
    <div class="title">
      <span>{{field.optionName}}
        <span class="qwui-required_mark" v-if="field.isMust && (field.isMust == '1' || field.isMust == '3') && (!readonly || canPassengerEdit)">*</span>
      </span>
      <i class="add-icon" v-if="!readonly || canPassengerEdit" @click="openContacts"></i>
      <div class="modify" @click="modifyPassenger" v-if="showModifyBtn && !canPassengerEdit">
        <span class="modify-icon"></span>
        <span class="text">修改</span>
      </div>
    </div>
    <div class="person-list" v-if="!readonly || canPassengerEdit">
      <div class="persons"
        v-for="(item, index) in personList"
        :key="index"
        :class="{selected: showTips[index]}"
        @click.stop="showDeleteTips(index)">{{item}}
        <div class="delete" v-show="showTips[index]" @click.stop="deletePerson(item, index)">删除</div>
      </div>
      <form action="" class="form" @submit.prevent="">
        <input type="text" 
          placeholder="请输入乘车人" 
          :id="'field-'+field.id"
          @keyup.enter.stop="addPerson($event)" 
          @keydown.delete.stop="keyBoardDel($event)">
      </form>
    </div>
    <div class="person-list" style="minHeight: 0" v-if="readonly && !canPassengerEdit">
      <div class="persons readonly" 
        v-for="(item, index) in personList" 
        :key="index">{{item}}
      </div>
      <p class="no-person" v-if="personList.length == 0">未填写</p>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  export default {
    props: {
      field: {
        type: Object,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      showModifyBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        personList: [],
        showTips: {}, //提示语标识
        isClicked: false //控制第一次点击删除
      }
    },
    mounted() {
      this.resetAllTips()
      window.addEventListener('click', this.resetAllTips)
    },
    computed: {
      ...mapState({
        basicValue: state => state.fieldData.basicValue,
        canPassengerEdit: state => state.detail.canPassengerEdit
      }),
      innerPassenger() {
        if(this.basicValue && this.basicValue.innerPassenger) {
          let arr = this.basicValue.innerPassenger.map(item => {
            return item.personName
          })
          return arr
        } else return []
      },
      outerPassenger() {
        return this.basicValue && this.basicValue.outerPassenger || []
      }
    },
    methods: {
      // 显示提示语
      showDeleteTips(index) {
        let tipsSign = this.showTips[index]
        this.resetAllTips()
        this.showTips[index] = !tipsSign
      },
      // 增加人员
      addPerson({target}) {
        let value = target.value.trim()
        if(value == '') return
        if(!this.checkPerson(value, this.personList)) return
        let outer = JSON.parse(JSON.stringify(this.outerPassenger))
        outer.push(value)
        this.$store.commit('updateBasicValue', {outerPassenger: outer})
        this.personList.push(value)
        target.value = ''
        this.resetAllTips()
      },
      // 删除人员
      deletePerson(item, index) {
        this.dealPerson(item, this.basicValue.outerPassenger, this.basicValue.innerPassenger)
        this.personList.splice(index, 1)
        //判断是外部人员还是内部人员
        this.resetAllTips()
      },
      // 键盘删除事件
      keyBoardDel({target}) {
        if(target.value.trim() != '') return
        if(this.isClicked) {
          this.dealPerson(this.personList[this.personList.length - 1], this.basicValue.outerPassenger, this.basicValue.innerPassenger)
          this.personList.pop()
          this.resetAllTips()
          this.isClicked = false
        } else {
          if(this.personList.length > 0) this.showTips[this.personList.length - 1] = true
          this.isClicked = true
        }
      },
      // 人员总列表删除处理
      dealPerson(name, outerList = [], innerList = []) {
        let outer = JSON.parse(JSON.stringify(outerList))
        let inner = JSON.parse(JSON.stringify(innerList))
        let outerIndex = outer.indexOf(name)
        if(outerIndex > -1) {
          outer.splice(outerIndex, 1)
          this.$store.commit('updateBasicValue', {outerPassenger: outer})
        } else {
          inner.forEach((item, index) => {
            if(item.personName == name) {
              inner.splice(index, 1)
              return false
            }
          })
          this.$store.commit('updateBasicValue', {innerPassenger: inner})
        }
      },
      // 检查是否含有相同人员
      checkPerson(newPerson, list) {
        if(list.some(item => item == newPerson)) {
          _.tooltips_succeed('乘车人已存在', true, '', 1500)
          return false
        } else return true
      },
      // 修改乘车人
      modifyPassenger() {
        this.$store.commit('updateTemporaryPassenger', {
          _innerPassenger: this.basicValue.innerPassenger,
          _outerPassenger: this.basicValue.outerPassenger
        })
        this.$store.commit('updateCanEdit', true)
        this.$emit('showBtn')
      },
      // 打开通讯录
      openContacts() {
        this.$emit('openContacts')
      },
      // 重置提示语
      resetAllTips() {
        this.showTips = {}
        if(this.personList.length > 0) {
          this.isClicked = false
          this.personList.forEach((item, index) => {
            this.$set(this.showTips, index, false)
          })
        }
      }
    },
    watch: {
      'basicValue.innerPassenger': {
        handler(list) {
          if(!list) return
          let hasPerson = false
          list.forEach((item, index) => {
            if(this.outerPassenger.indexOf(item.personName) > -1) {
              let newInner = JSON.parse(JSON.stringify(list))
              hasPerson = true
              newInner.splice(index, 1)
              this.$store.commit('updateBasicValue', {innerPassenger: newInner})
            }  
          })
          this.personList = this.innerPassenger.concat(this.outerPassenger)
          if(hasPerson) _.tooltips_succeed('乘车人已存在', true, '', 1500)
        },
        deep: true
      },
      outerPassenger(list) {
        this.personList = this.innerPassenger.concat(list || [])
      },
      personList: {
        handler(list) {
          if(list.length > 0) $(document).find("#field-" + this.field.id).removeClass("error-tip")
        }
      }
    },
    beforeDestroy() {
      window.removeEventListener('click', this.resetAllTips)
      this.$store.commit('updateCanEdit', false)
    }
  }
</script>

<style>
  .field-content {
    width: 100%;
    padding: 12px 0;
  }
  .field-content .title {
    position: relative;
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
  }
  .field-content .add-icon {
    float: right;
    width: 20px;
    height: 20px;
    margin: 0 -8px 0 12px;
    padding-left: 12px;
    background:url(~assets/images/car/icon_add.png) no-repeat center;
    background-size: 32px auto;
    cursor: pointer;
  }
  .title .modify {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
  .modify .modify-icon {
    display: inline-block;
    vertical-align: middle;
    width: 12px;
    height: 16px;
    background:url(~assets/images/car/modify-icon.png) no-repeat center;
    background-size: 12px 12px;
  }
  .modify .text {
    height: 17px;
    line-height: 17px;
    font-size: 12px;
    color: #467DB9;
    margin-left: 4px;
  }
  .field-content .person-list {
    min-height: 74px;
  }
  .person-list .persons, .person-list input {
    display: inline-block;
    font-size: 15px;
    margin-top: 12px;
  }
  .person-list .persons {
    position: relative;
    padding: 4px 8px;
    margin-right: 8px;
    border-radius: 4px;
    color: #5585F0;
    border: 1px solid rgba(85,133,240,1);  
    word-break: keep-all;
    cursor: pointer;
    user-select: none;
  }
  .person-list .selected {
    background: #5585F0;
    color: #fff;
  }
  .person-list .no-person {
    padding-top: 12px;
    color: #0A1735;
    font-size: 15px;
  }
  .person-list .readonly {
    color: #7A7C80;
    border-color: #E3E4E8;
    background: #fff;
    cursor: default;
  }
  .person-list .form {
    display: inline-block;
  }
  .person-list input {
    width: 100px;
    vertical-align: baseline;
  }
  .persons .delete {
    position: absolute;
    left: 50%;
    top: -40px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background: #0A1735;
    color: #fff;
    text-align: center;
    z-index: 10;
    transform: translateX(-50%);
  }
  .persons .delete::after {
    position: absolute;
    bottom: -10px;
    left: 41%;
    content: "";
    border-top: 5px solid #0A1735;
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid transparent;
  }
  /*input.placeholder颜色*/
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #D2D5DB;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D2D5DB;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D2D5DB;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #D2D5DB;
  }
    /*修改placeholder颜色*/
  .error-tip::-webkit-input-placeholder{
    color: #FF586D;
  }
  .error-tip::-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-ms-input-placeholder{
    color: #FF586D;
  }
  /* 去掉input=search里的小叉叉 */
  input[type=search]::-webkit-search-cancel-button{
    -webkit-appearance: none;
  }
</style>
